/**
 * Collection admin service.
 *
 * Prepares unified DTOs, orchestrates mutations across repository + service,
 * and dispatches domain events. No React components call the repository directly.
 *
 * Event flow:
 *   createCollection → COLLECTION_CREATED → auditSubscriber
 *   publishCollection → COLLECTION_PUBLISHED → auditSubscriber
 *   attachProducts → COLLECTION_PRODUCT_ATTACHED → auditSubscriber
 *   etc.
 */

import {
  findCollectionsByTenant,
  findCollectionById,
  findCollectionProductCounts,
  isCollectionSlugTaken,
  createCollection,
  updateCollection,
  deleteCollection,
  reorderCollections,
  findProductsInCollection,
  findAttachableProducts,
  attachProductsToCollection,
  detachProductFromCollection,
  reorderCollectionProducts,
  updateCollectionProductMeta,
  findCollectionCampaignId,
  type CollectionProductRow,
  type CollectionWithCampaign,
} from './repository'
import { validateCollection, transitionCollectionStatus } from './service'
import { executeAttach, executeDetach, executeReorder } from '@/lib/admin/relationships/helpers'
import { dispatch, AdminEvents } from '@/lib/admin/dispatcher'
import type { LifecycleStatus } from '@/lib/admin/lifecycle'

// ── Unified admin DTO ─────────────────────────────────────────────────────
//
// One type serves the list view, the editor form, and relationship components.

export type CollectionAdminData = {
  // Identity (system-managed, non-editable)
  id:             string
  tenantId:       string
  campaignId:     string
  campaign_name:  string

  // General tab
  name:           string
  slug:           string
  description:    string

  // Status / lifecycle
  status:         LifecycleStatus

  // Media tab
  image_url:      string   // hero image
  thumbnail_url:  string

  // SEO tab
  seo_title:      string
  seo_description: string

  // Categorisation tab
  tags:           string[]  // comma-separated in form, array in data

  // Display tab
  visible:        boolean
  featured:       boolean
  sort_order:     number

  // Scheduling tab
  publish_at:     string   // '' if null
  archive_at:     string   // '' if null
  published_at:   string
  archived_at:    string

  // Display-only list columns
  product_count:  number
  updated_at:     string
  created_at:     string
}

export const COLLECTION_DEFAULTS: CollectionAdminData = {
  id:             '',
  tenantId:       '',
  campaignId:     '',
  campaign_name:  '',
  name:           '',
  slug:           '',
  description:    '',
  status:         'draft',
  image_url:      '',
  thumbnail_url:  '',
  seo_title:      '',
  seo_description: '',
  tags:           [],
  visible:        true,
  featured:       false,
  sort_order:     0,
  publish_at:     '',
  archive_at:     '',
  published_at:   '',
  archived_at:    '',
  product_count:  0,
  updated_at:     '',
  created_at:     '',
}

// ── DTO mapper ────────────────────────────────────────────────────────────

function toAdminData(
  c:       CollectionWithCampaign,
  tenantId: string,
  productCount: number,
): CollectionAdminData {
  return {
    id:              c.id,
    tenantId,
    campaignId:      c.campaign_id,
    campaign_name:   c.campaign_name,
    name:            c.name,
    slug:            c.slug,
    description:     c.description ?? '',
    status:          (c.lifecycle_status ?? 'draft') as LifecycleStatus,
    image_url:       c.image_url ?? '',
    thumbnail_url:   c.thumbnail_url ?? '',
    seo_title:       c.seo_title ?? '',
    seo_description: c.seo_description ?? '',
    tags:            c.tags ?? [],
    visible:         c.visible,
    featured:        c.featured ?? false,
    sort_order:      c.sort_order,
    publish_at:      c.publish_at ?? '',
    archive_at:      c.archive_at ?? '',
    published_at:    c.published_at ?? '',
    archived_at:     c.archived_at ?? '',
    product_count:   productCount,
    updated_at:      c.updated_at,
    created_at:      c.created_at,
  }
}

// ── Reads ─────────────────────────────────────────────────────────────────

export async function listCollectionsForAdmin(
  tenantId: string,
): Promise<CollectionAdminData[]> {
  const collections = await findCollectionsByTenant(tenantId)
  if (!collections.length) return []

  const ids    = collections.map((c) => c.id)
  const counts = await findCollectionProductCounts(ids)
  const countMap = Object.fromEntries(counts.map((c) => [c.collection_id, c.product_count]))

  return collections.map((c) =>
    toAdminData(c, tenantId, countMap[c.id] ?? 0),
  )
}

export async function getCollectionForEditor(
  id:       string,
  tenantId: string,
): Promise<CollectionAdminData | null> {
  const [collection, counts] = await Promise.all([
    findCollectionById(id),
    findCollectionProductCounts([id]),
  ])
  if (!collection) return null
  return toAdminData(collection, tenantId, counts[0]?.product_count ?? 0)
}

// ── Service validation (pre-save, callable from page server actions) ───────

export { validateCollection }

export async function validateCollectionData(
  data:      CollectionAdminData,
  tenantId:  string,
  existingId?: string,
): Promise<Record<string, string>> {
  const errors = await validateCollection(
    {
      name:       data.name,
      slug:       data.slug,
      campaign_id: data.campaignId,
      image_url:  data.image_url,
      publish_at: data.publish_at || undefined,
      archive_at: data.archive_at || undefined,
    },
    data.campaignId,
    existingId,
  )
  return errors as Record<string, string>
}

// ── Mutations ─────────────────────────────────────────────────────────────

type MutationCtx = { userId?: string; ipAddress?: string }

export async function createCollectionForAdmin(
  tenantId: string,
  data:     CollectionAdminData,
  ctx?:     MutationCtx,
): Promise<CollectionAdminData> {
  // Compute sort_order (append to end within campaign)
  const existing = await findCollectionsByTenant(tenantId)
  const inCampaign = existing.filter((c) => c.campaign_id === data.campaignId)
  const sortOrder = inCampaign.length > 0
    ? Math.max(...inCampaign.map((c) => c.sort_order)) + 1
    : 0

  const collection = await createCollection({
    campaign_id:      data.campaignId,
    tenant_id:        tenantId,
    name:             data.name.trim(),
    slug:             data.slug.trim(),
    description:      data.description.trim() || null,
    lifecycle_status: data.status || 'draft',
    image_url:        data.image_url || null,
    thumbnail_url:    data.thumbnail_url || null,
    seo_title:        data.seo_title || null,
    seo_description:  data.seo_description || null,
    tags:             data.tags ?? [],
    visible:          data.visible,
    featured:         data.featured,
    sort_order:       data.sort_order || sortOrder,
    publish_at:       data.publish_at || null,
    archive_at:       data.archive_at || null,
  })

  await dispatch(AdminEvents.COLLECTION_CREATED, tenantId, {
    entityType:  'collection',
    entityId:    collection.id,
    entityLabel: collection.name,
    action:      'created',
    after:       collection,
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })

  return getCollectionForEditor(collection.id, tenantId) as Promise<CollectionAdminData>
}

export async function updateCollectionForAdmin(
  id:       string,
  tenantId: string,
  data:     CollectionAdminData,
  ctx?:     MutationCtx,
): Promise<CollectionAdminData> {
  const before = await findCollectionById(id)

  const updated = await updateCollection(id, {
    name:             data.name.trim(),
    slug:             data.slug.trim(),
    description:      data.description.trim() || null,
    lifecycle_status: data.status,
    image_url:        data.image_url || null,
    thumbnail_url:    data.thumbnail_url || null,
    seo_title:        data.seo_title || null,
    seo_description:  data.seo_description || null,
    tags:             data.tags ?? [],
    visible:          data.visible,
    featured:         data.featured,
    sort_order:       data.sort_order,
    publish_at:       data.publish_at || null,
    archive_at:       data.archive_at || null,
  })

  await dispatch(AdminEvents.COLLECTION_UPDATED, tenantId, {
    entityType:  'collection',
    entityId:    id,
    entityLabel: updated.name,
    action:      'updated',
    before:      before ?? undefined,
    after:       updated,
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })

  return getCollectionForEditor(id, tenantId) as Promise<CollectionAdminData>
}

export async function publishCollection(
  id:       string,
  tenantId: string,
  label:    string,
  ctx?:     MutationCtx,
): Promise<void> {
  await transitionCollectionStatus(id, tenantId, 'published')

  await dispatch(AdminEvents.COLLECTION_PUBLISHED, tenantId, {
    entityType:  'collection',
    entityId:    id,
    entityLabel: label,
    action:      'published',
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })
}

export async function archiveCollection(
  id:       string,
  tenantId: string,
  label:    string,
  ctx?:     MutationCtx,
): Promise<void> {
  await transitionCollectionStatus(id, tenantId, 'archived')

  await dispatch(AdminEvents.COLLECTION_ARCHIVED, tenantId, {
    entityType:  'collection',
    entityId:    id,
    entityLabel: label,
    action:      'archived',
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })
}

export async function deleteCollectionForAdmin(
  id:       string,
  tenantId: string,
  label:    string,
  ctx?:     MutationCtx,
): Promise<void> {
  await deleteCollection(id, tenantId)

  await dispatch(AdminEvents.COLLECTION_DELETED, tenantId, {
    entityType:  'collection',
    entityId:    id,
    entityLabel: label,
    action:      'deleted',
    userId:      ctx?.userId,
    ipAddress:   ctx?.ipAddress,
  })
}

export async function duplicateCollection(
  id:       string,
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<CollectionAdminData> {
  const original = await getCollectionForEditor(id, tenantId)
  if (!original) throw new Error('Collection not found')

  const suffix  = `-copy-${Date.now()}`
  const created = await createCollectionForAdmin(
    tenantId,
    {
      ...original,
      id:            '',
      name:          `${original.name} (copy)`,
      slug:          `${original.slug}${suffix}`,
      status:        'draft',
      publish_at:    '',
      archive_at:    '',
      published_at:  '',
      archived_at:   '',
      product_count: 0,
      updated_at:    '',
      created_at:    '',
    },
    ctx,
  )

  await dispatch(AdminEvents.COLLECTION_DUPLICATED, tenantId, {
    entityType:  'collection',
    entityId:    created.id,
    entityLabel: created.name,
    action:      'duplicated',
    metadata:    { originalId: id },
    userId:      ctx?.userId,
  })

  return created
}

// ── Bulk operations ───────────────────────────────────────────────────────

export async function bulkPublishCollections(
  ids:      string[],
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<void> {
  await Promise.all(ids.map((id) => publishCollection(id, tenantId, id, ctx)))
}

export async function bulkArchiveCollections(
  ids:      string[],
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<void> {
  await Promise.all(ids.map((id) => archiveCollection(id, tenantId, id, ctx)))
}

export async function bulkDeleteCollections(
  rows:     CollectionAdminData[],
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<void> {
  await Promise.all(rows.map((r) => deleteCollectionForAdmin(r.id, tenantId, r.name, ctx)))
}

export async function bulkDuplicateCollections(
  ids:      string[],
  tenantId: string,
  ctx?:     MutationCtx,
): Promise<void> {
  await Promise.all(ids.map((id) => duplicateCollection(id, tenantId, ctx)))
}

// ── Product relationship operations ───────────────────────────────────────
//
// Called from RelationshipDefinition service callbacks.

export async function getCollectionProducts(
  collectionId: string,
  _tenantId:    string,
): Promise<CollectionProductRow[]> {
  return findProductsInCollection(collectionId)
}

export async function searchCollectionProducts(
  query:       string,
  tenantId:    string,
  excludeIds:  string[],
  parentId?:   string,  // collectionId — used to resolve campaign scope
): Promise<CollectionProductRow[]> {
  // Resolve campaign_id from the collection if parentId provided
  let campaignId: string | null = null
  if (parentId) {
    campaignId = await findCollectionCampaignId(parentId)
  }
  if (!campaignId) return []
  return findAttachableProducts(parentId ?? '', campaignId, query, excludeIds)
}

export async function attachCollectionProducts(
  collectionId: string,
  productIds:   string[],
  tenantId:     string,
): Promise<void> {
  const existing = await findProductsInCollection(collectionId)
  const baseOrder = existing.length
  await executeAttach({
    tenantId,
    parentId:   collectionId,
    entityType: 'collection',
    relation:   'products',
    childIds:   productIds,
    events:     { attached: AdminEvents.COLLECTION_PRODUCT_ATTACHED },
    doAttach:   async (pid, cids, _tid) => attachProductsToCollection(pid, cids, baseOrder),
  })
}

export async function detachCollectionProduct(
  collectionId: string,
  productId:    string,
  tenantId:     string,
): Promise<void> {
  await executeDetach({
    tenantId,
    parentId:   collectionId,
    entityType: 'collection',
    relation:   'products',
    childId:    productId,
    events:     { detached: AdminEvents.COLLECTION_PRODUCT_DETACHED },
    doDetach:   async (pid, cid, _tid) => detachProductFromCollection(pid, cid),
  })
}

export async function reorderCollectionProductsAdmin(
  collectionId: string,
  orderedIds:   string[],
  tenantId:     string,
): Promise<void> {
  await executeReorder({
    tenantId,
    parentId:   collectionId,
    entityType: 'collection',
    relation:   'products',
    orderedIds,
    events:     { reordered: AdminEvents.COLLECTION_PRODUCT_REORDERED },
    doReorder:  async (pid, ids, _tid) => reorderCollectionProducts(pid, ids),
  })
}

export async function updateCollectionProductMetaAdmin(
  collectionId: string,
  productId:    string,
  meta:         Record<string, unknown>,
  _tenantId:    string,
): Promise<void> {
  await updateCollectionProductMeta(collectionId, productId, {
    featured: Boolean(meta['featured']),
  })
}
