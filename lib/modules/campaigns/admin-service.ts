/**
 * Campaign admin service.
 *
 * Prepares unified DTOs for the Campaign CMS.
 * Joins merch_campaigns + merch_campaign_branding + counts.
 * Dispatches domain events — no direct audit calls.
 *
 * Event flow:
 *   createCampaign → CAMPAIGN_CREATED → auditSubscriber
 *   updateCampaign → CAMPAIGN_UPDATED
 *   publishCampaign → CAMPAIGN_PUBLISHED
 *   archiveCampaign → CAMPAIGN_ARCHIVED
 *   etc.
 */

import {
  findCampaignsByTenant,
  findCampaignById,
  findCampaignBranding,
  findCampaignCounts,
  upsertCampaignBranding,
  isCampaignSlugTaken,
} from './repository'
import { getSupabase } from '@/lib/core/database'
import { dispatch, AdminEvents } from '@/lib/admin/dispatcher'
import type { MerchCampaign, CampaignType, CampaignStatus } from '@/lib/merch/types'

// ── Unified admin DTO ─────────────────────────────────────────────────────
//
// One type for both the list view (column rendering) and the editor form.
// Non-editable fields (id, tenantId, counts, timestamps) are included for
// display and for passing context into editor sub-components.

export type CampaignAdminData = {
  // Identity (managed by system, not editable)
  id:              string
  tenantId:        string

  // Editable — General tab
  name:            string
  slug:            string
  description:     string
  campaign_type:   CampaignType

  // Editable — Ordering tab
  opens_at:        string   // '' if null
  closes_at:       string
  is_public:       boolean

  // Editable — Storefront tab (from merch_campaign_branding)
  hero_image:      string   // MediaAsset URL, '' if none
  hero_title:      string
  hero_subtitle:   string

  // Editable — Branding tab
  primary_colour:  string   // '' to inherit from tenant
  secondary_colour: string
  logo_url:        string

  // Editable — Messaging tab
  success_message:  string
  failure_message:  string
  delivery_info:    string
  pickup_info:      string
  club_contact:     string

  // Lifecycle (Settings tab)
  status:          CampaignStatus

  // Display-only — list columns
  collection_count: number
  product_count:    number
  order_count:      number
  updated_at:       string
  created_at:       string
}

export const CAMPAIGN_DEFAULTS: CampaignAdminData = {
  id:               '',
  tenantId:         '',
  name:             '',
  slug:             '',
  description:      '',
  campaign_type:    'reservation',
  opens_at:         '',
  closes_at:        '',
  is_public:        true,
  hero_image:       '',
  hero_title:       '',
  hero_subtitle:    '',
  primary_colour:   '',
  secondary_colour: '',
  logo_url:         '',
  success_message:  '',
  failure_message:  '',
  delivery_info:    '',
  pickup_info:      '',
  club_contact:     '',
  status:           'draft',
  collection_count: 0,
  product_count:    0,
  order_count:      0,
  updated_at:       '',
  created_at:       '',
}

// ── DTO mapping ───────────────────────────────────────────────────────────

function toCampaignAdminData(
  c:        MerchCampaign,
  branding: Awaited<ReturnType<typeof findCampaignBranding>>,
  counts:   { collection_count: number; product_count: number; order_count: number },
  tenantId: string,
): CampaignAdminData {
  return {
    id:               c.id,
    tenantId,
    name:             c.name,
    slug:             c.slug,
    description:      c.description ?? '',
    campaign_type:    c.campaign_type,
    opens_at:         c.opens_at ?? '',
    closes_at:        c.closes_at ?? '',
    is_public:        c.is_public,
    hero_image:       branding?.hero_image ?? '',
    hero_title:       branding?.hero_title ?? '',
    hero_subtitle:    branding?.hero_subtitle ?? '',
    primary_colour:   branding?.primary_color ?? '',
    secondary_colour: branding?.secondary_color ?? '',
    logo_url:         branding?.logo_url ?? '',
    success_message:  c.success_message ?? '',
    failure_message:  c.failure_message ?? '',
    delivery_info:    c.delivery_info ?? '',
    pickup_info:      c.pickup_info ?? '',
    club_contact:     c.club_contact ?? '',
    status:           c.status,
    collection_count: counts.collection_count,
    product_count:    counts.product_count,
    order_count:      counts.order_count,
    updated_at:       c.updated_at,
    created_at:       c.created_at,
  }
}

// ── Service functions ─────────────────────────────────────────────────────

export async function listCampaignsForAdmin(tenantId: string): Promise<CampaignAdminData[]> {
  const campaigns = await findCampaignsByTenant(tenantId)
  if (!campaigns.length) return []

  const ids = campaigns.map((c) => c.id)
  const counts = await findCampaignCounts(ids)
  const countMap = Object.fromEntries(counts.map((c) => [c.campaign_id, c]))

  // Branding is fetched individually only in the editor — list view omits it for performance
  return campaigns.map((c) =>
    toCampaignAdminData(c, null, countMap[c.id] ?? { collection_count: 0, product_count: 0, order_count: 0 }, tenantId),
  )
}

export async function getCampaignForEditor(
  id:       string,
  tenantId: string,
): Promise<CampaignAdminData | null> {
  const [campaign, branding, counts] = await Promise.all([
    findCampaignById(id),
    findCampaignBranding(id),
    findCampaignCounts([id]),
  ])
  if (!campaign) return null
  const c = counts[0] ?? { collection_count: 0, product_count: 0, order_count: 0 }
  return toCampaignAdminData(campaign, branding, c, tenantId)
}

// ── Validation ────────────────────────────────────────────────────────────

export type ValidationErrors = Partial<Record<keyof CampaignAdminData | '_global', string>>

export async function validateCampaignData(
  data:      CampaignAdminData,
  tenantId:  string,
  existingId?: string,
): Promise<ValidationErrors> {
  const errors: ValidationErrors = {}

  if (!data.name.trim())  errors.name = 'Name is required'
  if (!data.slug.trim())  errors.slug = 'Slug is required'
  if (data.name.length > 120) errors.name = 'Name must be 120 characters or fewer'

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug))
    errors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens'

  if (data.opens_at && data.closes_at && data.opens_at >= data.closes_at)
    errors.closes_at = 'Closing date must be after opening date'

  // Slug uniqueness
  if (data.slug) {
    const taken = await isCampaignSlugTaken(tenantId, data.slug, existingId)
    if (taken) errors.slug = 'This slug is already in use'
  }

  return errors
}

// ── Mutations ─────────────────────────────────────────────────────────────

type MutationCtx = { userId?: string; ipAddress?: string }

export async function createCampaign(
  tenantId: string,
  data:     CampaignAdminData,
  ctx?:     MutationCtx,
): Promise<CampaignAdminData> {
  const { data: row, error } = await getSupabase()
    .from('merch_campaigns')
    .insert({
      tenant_id:       tenantId,
      name:            data.name.trim(),
      slug:            data.slug.trim(),
      campaign_type:   data.campaign_type,
      status:          data.status,
      description:     data.description.trim() || null,
      opens_at:        data.opens_at || null,
      closes_at:       data.closes_at || null,
      is_public:       data.is_public,
      success_message: data.success_message.trim() || null,
      failure_message: data.failure_message.trim() || null,
      delivery_info:   data.delivery_info.trim() || null,
      pickup_info:     data.pickup_info.trim() || null,
      club_contact:    data.club_contact.trim() || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  const campaign = row as MerchCampaign

  // Upsert branding if any branding field is set
  if (data.hero_image || data.hero_title || data.hero_subtitle || data.primary_colour || data.secondary_colour || data.logo_url) {
    await upsertCampaignBranding(campaign.id, {
      hero_image:     data.hero_image || null,
      hero_title:     data.hero_title || null,
      hero_subtitle:  data.hero_subtitle || null,
      primary_color:  data.primary_colour || null,
      secondary_color: data.secondary_colour || null,
      logo_url:       data.logo_url || null,
    })
  }

  await dispatch(AdminEvents.CAMPAIGN_CREATED, tenantId, {
    entityType:  'campaign',
    entityId:    campaign.id,
    entityLabel: campaign.name,
    action:      'created',
    after:       campaign,
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })

  return getCampaignForEditor(campaign.id, tenantId) as Promise<CampaignAdminData>
}

export async function updateCampaign(
  id:       string,
  tenantId: string,
  data:     CampaignAdminData,
  ctx?:     MutationCtx,
): Promise<CampaignAdminData> {
  const before = await findCampaignById(id)

  const { data: row, error } = await getSupabase()
    .from('merch_campaigns')
    .update({
      name:            data.name.trim(),
      slug:            data.slug.trim(),
      campaign_type:   data.campaign_type,
      status:          data.status,
      description:     data.description.trim() || null,
      opens_at:        data.opens_at || null,
      closes_at:       data.closes_at || null,
      is_public:       data.is_public,
      success_message: data.success_message.trim() || null,
      failure_message: data.failure_message.trim() || null,
      delivery_info:   data.delivery_info.trim() || null,
      pickup_info:     data.pickup_info.trim() || null,
      club_contact:    data.club_contact.trim() || null,
      updated_at:      new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  const campaign = row as MerchCampaign

  await upsertCampaignBranding(id, {
    hero_image:      data.hero_image || null,
    hero_title:      data.hero_title || null,
    hero_subtitle:   data.hero_subtitle || null,
    primary_color:   data.primary_colour || null,
    secondary_color: data.secondary_colour || null,
    logo_url:        data.logo_url || null,
  })

  await dispatch(AdminEvents.CAMPAIGN_UPDATED, tenantId, {
    entityType:  'campaign',
    entityId:    id,
    entityLabel: campaign.name,
    action:      'updated',
    before:      before ?? undefined,
    after:       campaign,
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })

  return getCampaignForEditor(id, tenantId) as Promise<CampaignAdminData>
}

export async function publishCampaign(
  id:       string,
  tenantId: string,
  label:    string,
  ctx?:     MutationCtx,
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaigns')
    .update({ status: 'open', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('tenant_id', tenantId)
  if (error) throw new Error(error.message)

  await dispatch(AdminEvents.CAMPAIGN_PUBLISHED, tenantId, {
    entityType:  'campaign',
    entityId:    id,
    entityLabel: label,
    action:      'published',
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })
}

export async function archiveCampaign(
  id:       string,
  tenantId: string,
  label:    string,
  ctx?:     MutationCtx,
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaigns')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('tenant_id', tenantId)
  if (error) throw new Error(error.message)

  await dispatch(AdminEvents.CAMPAIGN_ARCHIVED, tenantId, {
    entityType:  'campaign',
    entityId:    id,
    entityLabel: label,
    action:      'archived',
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })
}

export async function deleteCampaign(
  id:       string,
  tenantId: string,
  label:    string,
  ctx?:     MutationCtx,
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaigns')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)
  if (error) throw new Error(error.message)

  await dispatch(AdminEvents.CAMPAIGN_DELETED, tenantId, {
    entityType:  'campaign',
    entityId:    id,
    entityLabel: label,
    action:      'deleted',
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })
}

export async function duplicateCampaign(
  id:       string,
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<CampaignAdminData> {
  const original = await getCampaignForEditor(id, tenantId)
  if (!original) throw new Error('Campaign not found')

  const suffix = `-copy-${Date.now()}`
  const created = await createCampaign(
    tenantId,
    {
      ...original,
      id:          '',
      name:        `${original.name} (copy)`,
      slug:        `${original.slug}${suffix}`,
      status:      'draft',
      opens_at:    '',
      closes_at:   '',
      created_at:  '',
      updated_at:  '',
      collection_count: 0,
      product_count:    0,
      order_count:      0,
    },
    ctx,
  )

  await dispatch(AdminEvents.CAMPAIGN_DUPLICATED, tenantId, {
    entityType:  'campaign',
    entityId:    created.id,
    entityLabel: created.name,
    action:      'duplicated',
    metadata:    { originalId: id },
    userId:      ctx?.userId,
  })

  return created
}

// ── Bulk actions ──────────────────────────────────────────────────────────

export async function bulkPublishCampaigns(
  ids:      string[],
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<void> {
  await Promise.all(
    ids.map((id) => publishCampaign(id, tenantId, id, ctx)),
  )
}

export async function bulkArchiveCampaigns(
  ids:      string[],
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<void> {
  await Promise.all(
    ids.map((id) => archiveCampaign(id, tenantId, id, ctx)),
  )
}

export async function bulkDeleteCampaigns(
  rows:     CampaignAdminData[],
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<void> {
  await Promise.all(
    rows.map((r) => deleteCampaign(r.id, tenantId, r.name, ctx)),
  )
}

export async function bulkDuplicateCampaigns(
  ids:      string[],
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<void> {
  await Promise.all(
    ids.map((id) => duplicateCampaign(id, tenantId, ctx)),
  )
}
