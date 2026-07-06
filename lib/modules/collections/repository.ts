/**
 * Collection repository.
 *
 * Sole point of contact between the Collections module and the database.
 * No business logic — pure data access with tenant isolation.
 */

import { getSupabase } from '@/lib/core/database'
import type { MerchCollection } from '@/lib/merch/types'

// ── Collection reads ──────────────────────────────────────────────────────

/** Admin: all collections for a tenant, joined with campaign name. */
export type CollectionWithCampaign = MerchCollection & {
  campaign_name: string
  campaign_slug: string
}

export async function findCollectionsByTenant(
  tenantId: string,
): Promise<CollectionWithCampaign[]> {
  const { data, error } = await getSupabase()
    .from('merch_collections')
    .select('*, merch_campaigns(name, slug)')
    .eq('tenant_id', tenantId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return ((data ?? []) as Array<MerchCollection & { merch_campaigns: { name: string; slug: string } | null }>).map((r) => ({
    ...r,
    campaign_name: r.merch_campaigns?.name ?? '',
    campaign_slug: r.merch_campaigns?.slug ?? '',
  }))
}

/** Admin: all collections within a campaign. */
export async function findCollectionsByCampaign(
  campaignId: string,
): Promise<MerchCollection[]> {
  const { data, error } = await getSupabase()
    .from('merch_collections')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as MerchCollection[]
}

/** Single collection by id (admin — no tenant check, caller verifies ownership). */
export async function findCollectionById(
  id: string,
): Promise<CollectionWithCampaign | null> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('*, merch_campaigns(name, slug)')
    .eq('id', id)
    .maybeSingle()
  if (!data) return null
  const r = data as MerchCollection & { merch_campaigns: { name: string; slug: string } | null }
  return {
    ...r,
    campaign_name: r.merch_campaigns?.name ?? '',
    campaign_slug: r.merch_campaigns?.slug ?? '',
  }
}

/** Storefront: visible collections in a campaign, ordered by sort_order. */
export async function findPublishedCollectionsByCampaign(
  campaignId: string,
): Promise<MerchCollection[]> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('lifecycle_status', 'published')
    .eq('visible', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as MerchCollection[]
}

/** Slug uniqueness check — excludes current id on update. */
export async function isCollectionSlugTaken(
  campaignId:  string,
  slug:        string,
  excludeId?:  string,
): Promise<boolean> {
  let q = getSupabase()
    .from('merch_collections')
    .select('id')
    .eq('campaign_id', campaignId)
    .eq('slug', slug)
  if (excludeId) q = q.neq('id', excludeId)
  const { data } = await q.maybeSingle()
  return !!data
}

// ── Product count ─────────────────────────────────────────────────────────

export type CollectionProductCount = {
  collection_id: string
  product_count: number
}

export async function findCollectionProductCounts(
  collectionIds: string[],
): Promise<CollectionProductCount[]> {
  if (!collectionIds.length) return []
  const { data } = await getSupabase()
    .from('merch_collection_products')
    .select('collection_id')
    .in('collection_id', collectionIds)

  const countMap: Record<string, number> = {}
  for (const row of (data ?? []) as Array<{ collection_id: string }>) {
    countMap[row.collection_id] = (countMap[row.collection_id] ?? 0) + 1
  }

  return collectionIds.map((id) => ({
    collection_id: id,
    product_count: countMap[id] ?? 0,
  }))
}

// ── Aggregate counts (for metrics / widgets) ──────────────────────────────

export type CollectionStatusCounts = {
  total:     number
  draft:     number
  published: number
  archived:  number
}

export async function findCollectionStatusCounts(
  tenantId: string,
): Promise<CollectionStatusCounts> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('lifecycle_status')
    .eq('tenant_id', tenantId)

  const rows = (data ?? []) as Array<{ lifecycle_status: string }>
  return rows.reduce(
    (acc, r) => {
      acc.total++
      if (r.lifecycle_status === 'draft')     acc.draft++
      if (r.lifecycle_status === 'published')  acc.published++
      if (r.lifecycle_status === 'archived')   acc.archived++
      return acc
    },
    { total: 0, draft: 0, published: 0, archived: 0 },
  )
}

// ── Collection mutations ───────────────────────────────────────────────────

export type CollectionInsert = {
  campaign_id:      string
  tenant_id:        string
  name:             string
  slug:             string
  description?:     string | null
  image_url?:       string | null
  thumbnail_url?:   string | null
  lifecycle_status?: string
  seo_title?:       string | null
  seo_description?: string | null
  tags?:            string[]
  visible?:         boolean
  featured?:        boolean
  sort_order?:      number
  publish_at?:      string | null
  archive_at?:      string | null
}

export async function createCollection(input: CollectionInsert): Promise<MerchCollection> {
  const { data, error } = await getSupabase()
    .from('merch_collections')
    .insert(input)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as MerchCollection
}

export async function updateCollection(
  id:     string,
  input:  Partial<CollectionInsert>,
): Promise<MerchCollection> {
  const { data, error } = await getSupabase()
    .from('merch_collections')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as MerchCollection
}

export async function updateCollectionStatus(
  id:       string,
  tenantId: string,
  status:   string,
  extra?:   { published_at?: string; archived_at?: string },
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_collections')
    .update({ lifecycle_status: status, updated_at: new Date().toISOString(), ...extra })
    .eq('id', id)
    .eq('tenant_id', tenantId)
  if (error) throw new Error(error.message)
}

export async function deleteCollection(id: string, tenantId: string): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_collections')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)
  if (error) throw new Error(error.message)
}

export async function reorderCollections(
  orderedIds: string[],
  tenantId:   string,
): Promise<void> {
  await Promise.all(
    orderedIds.map((id, i) =>
      getSupabase()
        .from('merch_collections')
        .update({ sort_order: i })
        .eq('id', id)
        .eq('tenant_id', tenantId),
    ),
  )
}

// ── Product relationship ───────────────────────────────────────────────────
//
// Uses the merch_collection_products junction table (sort_order + featured).
// Products can belong to multiple collections (many-to-many).

export type CollectionProductRow = {
  id:            string   // campaign_product_id
  name:          string
  slug:          string
  price_cents:   number
  active:        boolean
  thumbnail_url: string | null
  sort_order:    number
  featured:      boolean
}

export async function findProductsInCollection(
  collectionId: string,
): Promise<CollectionProductRow[]> {
  const { data, error } = await getSupabase()
    .from('merch_collection_products')
    .select(`
      sort_order,
      featured,
      merch_campaign_products!campaign_product_id (
        id, name, slug, price_cents, active
      )
    `)
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)

  return ((data ?? []) as Array<{
    sort_order: number
    featured:   boolean
    merch_campaign_products: { id: string; name: string; slug: string; price_cents: number; active: boolean } | null
  }>)
    .filter((r) => r.merch_campaign_products !== null)
    .map((r) => ({
      id:            r.merch_campaign_products!.id,
      name:          r.merch_campaign_products!.name,
      slug:          r.merch_campaign_products!.slug,
      price_cents:   r.merch_campaign_products!.price_cents,
      active:        r.merch_campaign_products!.active,
      thumbnail_url: null,  // images in merch_assets; omit for list perf
      sort_order:    r.sort_order,
      featured:      r.featured,
    }))
}

/** Find attachable products: all campaign products not already in this collection. */
export async function findAttachableProducts(
  collectionId: string,
  campaignId:   string,
  query:        string,
  excludeIds:   string[],
): Promise<CollectionProductRow[]> {
  let q = getSupabase()
    .from('merch_campaign_products')
    .select('id, name, slug, price_cents, active')
    .eq('campaign_id', campaignId)
    .not('id', 'in', `(${excludeIds.length ? excludeIds.join(',') : 'null'})`)
    .limit(20)

  if (query) q = q.ilike('name', `%${query}%`)

  const { data, error } = await q
  if (error) throw new Error(error.message)

  return ((data ?? []) as Array<{ id: string; name: string; slug: string; price_cents: number; active: boolean }>).map((r) => ({
    id:            r.id,
    name:          r.name,
    slug:          r.slug,
    price_cents:   r.price_cents,
    active:        r.active,
    thumbnail_url: null,
    sort_order:    0,
    featured:      false,
  }))
}

export async function attachProductsToCollection(
  collectionId: string,
  productIds:   string[],
  baseOrder:    number,
): Promise<void> {
  const rows = productIds.map((id, i) => ({
    collection_id:       collectionId,
    campaign_product_id: id,
    sort_order:          baseOrder + i,
    featured:            false,
  }))
  const { error } = await getSupabase()
    .from('merch_collection_products')
    .upsert(rows, { onConflict: 'collection_id,campaign_product_id', ignoreDuplicates: true })
  if (error) throw new Error(error.message)
}

export async function detachProductFromCollection(
  collectionId: string,
  productId:    string,
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_collection_products')
    .delete()
    .eq('collection_id', collectionId)
    .eq('campaign_product_id', productId)
  if (error) throw new Error(error.message)
}

export async function reorderCollectionProducts(
  collectionId: string,
  orderedIds:   string[],
): Promise<void> {
  await Promise.all(
    orderedIds.map((id, i) =>
      getSupabase()
        .from('merch_collection_products')
        .update({ sort_order: i })
        .eq('collection_id', collectionId)
        .eq('campaign_product_id', id),
    ),
  )
}

export async function updateCollectionProductMeta(
  collectionId: string,
  productId:    string,
  meta:         { featured?: boolean },
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_collection_products')
    .update(meta)
    .eq('collection_id', collectionId)
    .eq('campaign_product_id', productId)
  if (error) throw new Error(error.message)
}

/** Find the campaign_id for a given collection (needed for scoped product search). */
export async function findCollectionCampaignId(
  collectionId: string,
): Promise<string | null> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('campaign_id')
    .eq('id', collectionId)
    .maybeSingle()
  return data ? (data as { campaign_id: string }).campaign_id : null
}

// ── Tenant-wide search (for search provider) ──────────────────────────────

export async function searchCollectionsByTenant(
  tenantId: string,
  query:    string,
  limit     = 8,
): Promise<Array<CollectionWithCampaign>> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('*, merch_campaigns(name, slug)')
    .eq('tenant_id', tenantId)
    .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
    .order('updated_at', { ascending: false })
    .limit(limit)

  return ((data ?? []) as Array<MerchCollection & { merch_campaigns: { name: string; slug: string } | null }>).map((r) => ({
    ...r,
    campaign_name: r.merch_campaigns?.name ?? '',
    campaign_slug: r.merch_campaigns?.slug ?? '',
  }))
}
