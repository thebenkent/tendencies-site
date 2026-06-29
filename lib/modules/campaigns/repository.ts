import { getSupabase } from '@/lib/core/database'
import type {
  MerchCampaign, MerchCollection, MerchCampaignBanner,
  MerchCampaignAttribute, MerchCampaignBranding,
} from '@/lib/merch/types'

// ── Campaign reads ────────────────────────────────────────────────────────

export async function findCampaignsByTenant(tenantId: string): Promise<MerchCampaign[]> {
  const { data, error } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('updated_at', { ascending: false })
  if (error) return []
  return (data ?? []) as MerchCampaign[]
}

export async function findCampaignBySlug(tenantId: string, slug: string): Promise<MerchCampaign | null> {
  const { data } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .maybeSingle()
  return data ? (data as MerchCampaign) : null
}

export async function findCampaignById(campaignId: string): Promise<MerchCampaign | null> {
  const { data } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('id', campaignId)
    .maybeSingle()
  return data ? (data as MerchCampaign) : null
}

export async function findCampaignBranding(campaignId: string): Promise<MerchCampaignBranding | null> {
  const { data } = await getSupabase()
    .from('merch_campaign_branding')
    .select('*')
    .eq('campaign_id', campaignId)
    .maybeSingle()
  return data ? (data as MerchCampaignBranding) : null
}

export async function upsertCampaignBranding(
  campaignId: string,
  branding:   Partial<Omit<MerchCampaignBranding, 'campaign_id' | 'updated_at'>>,
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaign_branding')
    .upsert({ campaign_id: campaignId, ...branding }, { onConflict: 'campaign_id' })
  if (error) throw error
}

// ── Campaign counts (for admin list view) ──────────────────────────────────

export type CampaignCounts = {
  campaign_id:       string
  collection_count:  number
  product_count:     number
  order_count:       number
}

export async function findCampaignCounts(campaignIds: string[]): Promise<CampaignCounts[]> {
  if (!campaignIds.length) return []
  const sb = getSupabase()
  const [collections, products, orders] = await Promise.all([
    sb.from('merch_collections').select('campaign_id').in('campaign_id', campaignIds),
    sb.from('merch_campaign_products').select('campaign_id').in('campaign_id', campaignIds),
    sb.from('merch_orders').select('campaign_id').in('campaign_id', campaignIds),
  ])

  const countBy = (rows: { campaign_id: string }[] | null) =>
    (rows ?? []).reduce<Record<string, number>>((m, r) => {
      m[r.campaign_id] = (m[r.campaign_id] ?? 0) + 1
      return m
    }, {})

  const cc = countBy(collections.data as { campaign_id: string }[] | null)
  const pc = countBy(products.data as { campaign_id: string }[] | null)
  const oc = countBy(orders.data as { campaign_id: string }[] | null)

  return campaignIds.map((id) => ({
    campaign_id:      id,
    collection_count: cc[id] ?? 0,
    product_count:    pc[id] ?? 0,
    order_count:      oc[id] ?? 0,
  }))
}

// ── Slug uniqueness check ──────────────────────────────────────────────────

export async function isCampaignSlugTaken(
  tenantId:   string,
  slug:       string,
  excludeId?: string,
): Promise<boolean> {
  let q = getSupabase()
    .from('merch_campaigns')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)

  if (excludeId) q = q.neq('id', excludeId)

  const { data } = await q.maybeSingle()
  return !!data
}

// ── Storefront reads (public) ─────────────────────────────────────────────

export async function findCollectionBySlug(campaignId: string, slug: string): Promise<MerchCollection | null> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('slug', slug)
    .eq('visible', true)
    .maybeSingle()
  return data ? (data as MerchCollection) : null
}

export async function findCollectionsByCampaign(campaignId: string): Promise<MerchCollection[]> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('visible', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as MerchCollection[]
}

/** Storefront: time-filtered, active-only banners */
export async function findBannersByCampaign(campaignId: string): Promise<MerchCampaignBanner[]> {
  const now = new Date().toISOString()
  const { data } = await getSupabase()
    .from('merch_campaign_banners')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('active', true)
    .order('sort_order', { ascending: true })
  return ((data ?? []) as MerchCampaignBanner[]).filter(
    (b) => (!b.starts_at || b.starts_at <= now) && (!b.ends_at || b.ends_at > now),
  )
}

// ── Admin banner CRUD ─────────────────────────────────────────────────────

/** Admin: all banners, no time filter */
export async function findAllBannersByCampaign(campaignId: string): Promise<MerchCampaignBanner[]> {
  const { data } = await getSupabase()
    .from('merch_campaign_banners')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('sort_order', { ascending: true })
  return (data ?? []) as MerchCampaignBanner[]
}

export type BannerInput = {
  message:     string
  banner_type: string
  link_label:  string | null
  link_url:    string | null
  active:      boolean
  starts_at:   string | null
  ends_at:     string | null
  sort_order:  number
}

export async function createBanner(
  campaignId: string,
  tenantId:   string,
  data:       BannerInput,
): Promise<MerchCampaignBanner> {
  const { data: row, error } = await getSupabase()
    .from('merch_campaign_banners')
    .insert({ campaign_id: campaignId, tenant_id: tenantId, ...data })
    .select()
    .single()
  if (error) throw error
  return row as MerchCampaignBanner
}

export async function updateBanner(
  bannerId: string,
  tenantId: string,
  data:     Partial<BannerInput>,
): Promise<MerchCampaignBanner> {
  const { data: row, error } = await getSupabase()
    .from('merch_campaign_banners')
    .update(data)
    .eq('id', bannerId)
    .eq('tenant_id', tenantId)
    .select()
    .single()
  if (error) throw error
  return row as MerchCampaignBanner
}

export async function deleteBanner(bannerId: string, tenantId: string): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaign_banners')
    .delete()
    .eq('id', bannerId)
    .eq('tenant_id', tenantId)
  if (error) throw error
}

export async function reorderBanners(orderedIds: string[], tenantId: string): Promise<void> {
  const updates = orderedIds.map((id, i) =>
    getSupabase()
      .from('merch_campaign_banners')
      .update({ sort_order: i })
      .eq('id', id)
      .eq('tenant_id', tenantId),
  )
  await Promise.all(updates)
}

// ── Admin attribute CRUD ──────────────────────────────────────────────────

/** Admin: all attributes (including inactive) */
export async function findAllAttributesByCampaign(campaignId: string): Promise<MerchCampaignAttribute[]> {
  const { data } = await getSupabase()
    .from('merch_campaign_attributes')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('sort_order', { ascending: true })
  return (data ?? []) as MerchCampaignAttribute[]
}

export type AttributeInput = {
  type:        string
  label:       string
  placeholder: string | null
  help_text:   string | null
  options:     string[] | null
  required:    boolean
  applies_to:  'order' | 'line'
  sort_order:  number
  active:      boolean
}

export async function createAttribute(
  campaignId: string,
  tenantId:   string,
  data:       AttributeInput,
): Promise<MerchCampaignAttribute> {
  const { data: row, error } = await getSupabase()
    .from('merch_campaign_attributes')
    .insert({ campaign_id: campaignId, tenant_id: tenantId, ...data })
    .select()
    .single()
  if (error) throw error
  return row as MerchCampaignAttribute
}

export async function updateAttribute(
  attrId:   string,
  tenantId: string,
  data:     Partial<AttributeInput>,
): Promise<MerchCampaignAttribute> {
  const { data: row, error } = await getSupabase()
    .from('merch_campaign_attributes')
    .update(data)
    .eq('id', attrId)
    .eq('tenant_id', tenantId)
    .select()
    .single()
  if (error) throw error
  return row as MerchCampaignAttribute
}

export async function deleteAttribute(attrId: string, tenantId: string): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaign_attributes')
    .delete()
    .eq('id', attrId)
    .eq('tenant_id', tenantId)
  if (error) throw error
}

export async function reorderAttributes(orderedIds: string[], tenantId: string): Promise<void> {
  const updates = orderedIds.map((id, i) =>
    getSupabase()
      .from('merch_campaign_attributes')
      .update({ sort_order: i })
      .eq('id', id)
      .eq('tenant_id', tenantId),
  )
  await Promise.all(updates)
}

// ── Status update ─────────────────────────────────────────────────────────

export async function updateCampaignStatus(
  campaignId: string,
  tenantId:   string,
  status:     string,
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaigns')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', campaignId)
    .eq('tenant_id', tenantId)
  if (error) throw error
}
