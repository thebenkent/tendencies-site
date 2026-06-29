import { getSupabase } from '@/lib/core/database'
import type {
  MerchProductWithVariants, MerchProduct, MerchProductVariant,
  MerchProductPersonalisation, MerchSizeChart, MerchProductImage,
  MerchProductBadge, MerchProductContent, ProductRelationType,
  ProductProgress, MerchCampaign,
} from '@/lib/merch/types'

// Non-terminal statuses that count toward MOQ / progress bar.
const ACTIVE_STATUSES = ['reserved', 'confirmed', 'payment_requested', 'paid', 'production', 'completed']

const PRODUCT_SELECT = `
  *,
  merch_master_products (
    description, material, weight_grams, base_sku, features
  ),
  merch_product_variants (
    id, campaign_product_id, sku, fit, size, colour, barcode,
    additional_cost_cents, available, sort_order, weight_grams, stock_qty, created_at
  ),
  merch_assets (
    url, alt_text, sort_order, type
  ),
  merch_product_personalisation (
    id, campaign_product_id, type, label, required,
    max_length, uppercase_only, additional_price_cents,
    placeholder, sort_order, active
  ),
  merch_size_charts (
    id, campaign_product_id, fit, title, chart_json,
    image_url, pdf_url, sort_order
  ),
  merch_product_images (
    id, campaign_product_id, url, image_type, alt_text, display_order
  ),
  merch_product_badges (
    id, campaign_product_id, tenant_id, label, badge_type, icon,
    active, sort_order, starts_at, ends_at, created_at
  ),
  merch_product_content (
    id, campaign_product_id, section, title, content_type, content,
    sort_order, active, created_at
  )
`

function buildProductView(raw: any): MerchProductWithVariants {
  const mp = raw.merch_master_products ?? {}

  // Gallery: prefer structured merch_product_images, fall back to merch_assets
  const rawImages: any[] = raw.merch_product_images ?? []
  const productImages: MerchProductImage[] = rawImages
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((img) => ({
      id:                  img.id,
      campaign_product_id: img.campaign_product_id,
      url:                 img.url,
      image_type:          img.image_type ?? 'front',
      alt_text:            img.alt_text ?? null,
      display_order:       img.display_order ?? 0,
      created_at:          img.created_at,
    }))

  const assets: Array<{ url: string; type: string; sort_order: number }> = raw.merch_assets ?? []
  const legacyImages = assets
    .filter((a) => a.type === 'image')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((a) => a.url)

  const images = productImages.length > 0
    ? productImages.map((img) => img.url)
    : legacyImages

  // Variants — all rows including unavailable (UI handles disabled state)
  const variants: MerchProductVariant[] = (raw.merch_product_variants ?? [])
    .map((v: any) => ({
      id:                    v.id,
      campaign_product_id:   v.campaign_product_id,
      sku:                   v.sku ?? null,
      fit:                   v.fit ?? '',
      size:                  v.size,
      colour:                v.colour ?? '',
      barcode:               v.barcode ?? null,
      additional_cost_cents: v.additional_cost_cents ?? 0,
      available:             v.available ?? true,
      sort_order:            v.sort_order ?? 0,
      weight_grams:          v.weight_grams ?? null,
      stock_qty:             v.stock_qty ?? null,
      created_at:            v.created_at,
    }))
    .sort((a: MerchProductVariant, b: MerchProductVariant) => a.sort_order - b.sort_order)

  // Personalisation options — active ones sorted by sort_order
  const personalisation: MerchProductPersonalisation[] = (raw.merch_product_personalisation ?? [])
    .filter((p: any) => p.active)
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((p: any) => ({
      id:                    p.id,
      campaign_product_id:   p.campaign_product_id,
      type:                  p.type ?? 'text',
      label:                 p.label,
      required:              p.required ?? false,
      max_length:            p.max_length ?? null,
      uppercase_only:        p.uppercase_only ?? false,
      additional_price_cents: p.additional_price_cents ?? 0,
      placeholder:           p.placeholder ?? null,
      sort_order:            p.sort_order ?? 0,
      active:                p.active ?? true,
      created_at:            p.created_at,
    }))

  // Size charts sorted by sort_order
  const size_charts: MerchSizeChart[] = (raw.merch_size_charts ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((c: any) => ({
      id:                  c.id,
      campaign_product_id: c.campaign_product_id,
      fit:                 c.fit ?? '',
      title:               c.title,
      chart_json:          c.chart_json ?? { headers: [], rows: [] },
      image_url:           c.image_url ?? null,
      pdf_url:             c.pdf_url ?? null,
      sort_order:          c.sort_order ?? 0,
      created_at:          c.created_at,
    }))

  // Badges — active only, time-bounded filter applied in JS (simpler than PostgREST filter)
  const now = new Date().toISOString()
  const badges: MerchProductBadge[] = (raw.merch_product_badges ?? [])
    .filter((b: any) => b.active && (!b.starts_at || b.starts_at <= now) && (!b.ends_at || b.ends_at > now))
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((b: any) => ({
      id:                  b.id,
      campaign_product_id: b.campaign_product_id,
      tenant_id:           b.tenant_id,
      label:               b.label,
      badge_type:          b.badge_type ?? 'default',
      icon:                b.icon ?? null,
      active:              b.active,
      sort_order:          b.sort_order ?? 0,
      starts_at:           b.starts_at ?? null,
      ends_at:             b.ends_at ?? null,
      created_at:          b.created_at,
    }))

  // Rich content sections — active only, sorted
  const content: MerchProductContent[] = (raw.merch_product_content ?? [])
    .filter((c: any) => c.active)
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((c: any) => ({
      id:                  c.id,
      campaign_product_id: c.campaign_product_id,
      section:             c.section,
      title:               c.title ?? null,
      content_type:        c.content_type ?? 'text',
      content:             c.content ?? {},
      sort_order:          c.sort_order ?? 0,
      active:              c.active,
      created_at:          c.created_at,
    }))

  const product: MerchProduct = {
    id:                   raw.id,
    campaign_id:          raw.campaign_id,
    master_product_id:    raw.master_product_id,
    tenant_id:            raw.tenant_id,
    collection_id:        raw.collection_id ?? null,
    slug:                 raw.slug,
    name:                 raw.name,
    description:          raw.description ?? mp.description ?? null,
    price_cents:          raw.price_cents,
    minimum_qty:          raw.minimum_qty,
    lead_time_days:       raw.lead_time_days,
    sizing_notes:         raw.sizing_notes ?? null,
    embroidery_available: raw.embroidery_available ?? false,
    embroidery_notes:     raw.embroidery_notes ?? null,
    sort_order:           raw.sort_order ?? 0,
    active:               raw.active ?? true,
    created_at:           raw.created_at,
    material:             mp.material     ?? null,
    weight_grams:         mp.weight_grams ?? null,
    base_sku:             mp.base_sku     ?? null,
    features:             mp.features     ?? null,
    images,
    product_images:       productImages,
    personalisation,
    size_charts,
    badges,
    content,
  }

  return { ...product, merch_product_variants: variants }
}

export async function findProductsByCampaign(campaignId: string): Promise<MerchProductWithVariants[]> {
  const { data } = await getSupabase()
    .from('merch_campaign_products')
    .select(PRODUCT_SELECT)
    .eq('campaign_id', campaignId)
    .eq('active', true)
    .order('sort_order', { ascending: true })
  return (data ?? []).map(buildProductView)
}

export async function findProductBySlug(
  campaignId: string,
  slug: string,
): Promise<MerchProductWithVariants | null> {
  const { data, error } = await getSupabase()
    .from('merch_campaign_products')
    .select(PRODUCT_SELECT)
    .eq('campaign_id', campaignId)
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return buildProductView(data)
}

export async function findProductById(id: string): Promise<MerchProductWithVariants | null> {
  const { data, error } = await getSupabase()
    .from('merch_campaign_products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .single()
  if (error || !data) return null
  return buildProductView(data)
}

export async function findProductsByCampaignAll(campaignId: string): Promise<MerchProductWithVariants[]> {
  // Returns all products including inactive — for admin use
  const { data } = await getSupabase()
    .from('merch_campaign_products')
    .select(PRODUCT_SELECT)
    .eq('campaign_id', campaignId)
    .order('sort_order', { ascending: true })
  return (data ?? []).map(buildProductView)
}

export async function findVariantById(variantId: string): Promise<MerchProductVariant | null> {
  const { data, error } = await getSupabase()
    .from('merch_product_variants')
    .select('*')
    .eq('id', variantId)
    .single()
  if (error || !data) return null
  return data as MerchProductVariant
}

export async function findRelatedProducts(
  campaignProductId: string,
): Promise<Array<{ product: MerchProductWithVariants; relationType: ProductRelationType }>> {
  const { data: links } = await getSupabase()
    .from('merch_product_related')
    .select('related_product_id, relation_type')
    .eq('source_product_id', campaignProductId)
    .order('sort_order', { ascending: true })
    .limit(8)

  if (!links || links.length === 0) return []

  const ids = (links as Array<{ related_product_id: string; relation_type: string }>)
    .map((l) => l.related_product_id)

  const { data } = await getSupabase()
    .from('merch_campaign_products')
    .select(PRODUCT_SELECT)
    .in('id', ids)
    .eq('active', true)

  if (!data || data.length === 0) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productMap = new Map<string, MerchProductWithVariants>(data.map((p: unknown) => [(p as { id: string }).id, buildProductView(p as any)]))

  return (links as Array<{ related_product_id: string; relation_type: string }>)
    .filter((l) => productMap.has(l.related_product_id))
    .map((l) => ({
      product:      productMap.get(l.related_product_id)!,
      relationType: l.relation_type as ProductRelationType,
    }))
}

export async function getProductProgress(
  product: Pick<MerchProduct, 'id' | 'minimum_qty'>,
  campaign: Pick<MerchCampaign, 'closes_at' | 'status'>,
  activeStatuses: string[] = ACTIVE_STATUSES,
): Promise<ProductProgress> {
  const { data } = await getSupabase().rpc('merch_product_order_qty', {
    p_campaign_product_id: product.id,
    p_statuses:            activeStatuses,
  })

  const orderedQty = (data as number | null) ?? 0
  const minimumQty = product.minimum_qty
  const percentage = Math.min(100, Math.round((orderedQty / minimumQty) * 100))
  const isMet      = orderedQty >= minimumQty
  const now        = new Date()
  const closesAt   = campaign.closes_at ? new Date(campaign.closes_at) : null
  const isExpired  = closesAt ? now > closesAt : false
  const daysLeft   = closesAt && !isExpired
    ? Math.ceil((closesAt.getTime() - now.getTime()) / 86_400_000)
    : null

  return { orderedQty, minimumQty, percentage, isMet, isExpired, daysLeft, status: campaign.status }
}

// ── CMS admin queries ─────────────────────────────────────────────────────
//
// These functions are used by the Products CMS admin service only.
// The storefront uses the functions above (findProductsByCampaign, etc.).

export type ProductAdminListRow = {
  id:                   string
  tenant_id:            string
  campaign_id:          string
  campaign_name:        string | null
  name:                 string
  slug:                 string
  sku:                  string | null
  price_cents:          number
  cost_cents:           number | null
  currency:             string
  minimum_qty:          number
  lead_time_days:       number | null
  supplier_sku:         string | null
  lifecycle_status:     string
  active:               boolean
  sort_order:           number
  featured:             boolean
  collection_id:        string | null
  thumbnail_url:        string | null
  embroidery_available: boolean
  embroidery_notes:     string | null
  sizing_notes:         string | null
  seo_title:            string | null
  seo_description:      string | null
  tags:                 string[]
  publish_at:           string | null
  archive_at:           string | null
  published_at:         string | null
  archived_at:          string | null
  created_at:           string
  updated_at:           string | null
  variant_count:        number
  image_count:          number
}

export async function findProductsByTenant(tenantId: string): Promise<ProductAdminListRow[]> {
  const { data, error } = await getSupabase()
    .from('merch_campaign_products')
    .select(`
      id, tenant_id, campaign_id, name, slug, sku, price_cents, cost_cents, currency,
      minimum_qty, lead_time_days, supplier_sku, lifecycle_status, active, sort_order,
      featured, collection_id, embroidery_available, embroidery_notes, sizing_notes,
      seo_title, seo_description, tags, publish_at, archive_at, published_at, archived_at,
      created_at, updated_at,
      merch_campaigns ( name ),
      merch_product_images ( id ),
      merch_product_variants ( id )
    `)
    .eq('tenant_id', tenantId)
    .order('updated_at', { ascending: false, nullsFirst: false })

  if (error) throw error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((p: any) => ({
    id:                   p.id,
    tenant_id:            p.tenant_id,
    campaign_id:          p.campaign_id,
    campaign_name:        p.merch_campaigns?.name ?? null,
    name:                 p.name,
    slug:                 p.slug,
    sku:                  p.sku ?? null,
    price_cents:          p.price_cents,
    cost_cents:           p.cost_cents ?? null,
    currency:             p.currency ?? 'NZD',
    minimum_qty:          p.minimum_qty,
    lead_time_days:       p.lead_time_days ?? null,
    supplier_sku:         p.supplier_sku ?? null,
    lifecycle_status:     p.lifecycle_status ?? 'draft',
    active:               p.active ?? true,
    sort_order:           p.sort_order ?? 0,
    featured:             p.featured ?? false,
    collection_id:        p.collection_id ?? null,
    thumbnail_url:        null,  // resolved separately for performance
    embroidery_available: p.embroidery_available ?? false,
    embroidery_notes:     p.embroidery_notes ?? null,
    sizing_notes:         p.sizing_notes ?? null,
    seo_title:            p.seo_title ?? null,
    seo_description:      p.seo_description ?? null,
    tags:                 p.tags ?? [],
    publish_at:           p.publish_at ?? null,
    archive_at:           p.archive_at ?? null,
    published_at:         p.published_at ?? null,
    archived_at:          p.archived_at ?? null,
    created_at:           p.created_at,
    updated_at:           p.updated_at ?? null,
    variant_count:        (p.merch_product_variants ?? []).length,
    image_count:          (p.merch_product_images ?? []).length,
  }))
}

export async function findProductByIdAdmin(
  id: string,
  tenantId: string,
): Promise<ProductAdminListRow | null> {
  const { data, error } = await getSupabase()
    .from('merch_campaign_products')
    .select(`
      id, tenant_id, campaign_id, name, slug, sku, price_cents, cost_cents, currency,
      minimum_qty, lead_time_days, supplier_sku, lifecycle_status, active, sort_order,
      featured, collection_id, embroidery_available, embroidery_notes, sizing_notes,
      seo_title, seo_description, tags, publish_at, archive_at, published_at, archived_at,
      created_at, updated_at,
      merch_campaigns ( name ),
      merch_product_images ( id ),
      merch_product_variants ( id )
    `)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .single()

  if (error || !data) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = data as any
  return {
    id:                   p.id,
    tenant_id:            p.tenant_id,
    campaign_id:          p.campaign_id,
    campaign_name:        p.merch_campaigns?.name ?? null,
    name:                 p.name,
    slug:                 p.slug,
    sku:                  p.sku ?? null,
    price_cents:          p.price_cents,
    cost_cents:           p.cost_cents ?? null,
    currency:             p.currency ?? 'NZD',
    minimum_qty:          p.minimum_qty,
    lead_time_days:       p.lead_time_days ?? null,
    supplier_sku:         p.supplier_sku ?? null,
    lifecycle_status:     p.lifecycle_status ?? 'draft',
    active:               p.active ?? true,
    sort_order:           p.sort_order ?? 0,
    featured:             p.featured ?? false,
    collection_id:        p.collection_id ?? null,
    thumbnail_url:        null,
    embroidery_available: p.embroidery_available ?? false,
    embroidery_notes:     p.embroidery_notes ?? null,
    sizing_notes:         p.sizing_notes ?? null,
    seo_title:            p.seo_title ?? null,
    seo_description:      p.seo_description ?? null,
    tags:                 p.tags ?? [],
    publish_at:           p.publish_at ?? null,
    archive_at:           p.archive_at ?? null,
    published_at:         p.published_at ?? null,
    archived_at:          p.archived_at ?? null,
    created_at:           p.created_at,
    updated_at:           p.updated_at ?? null,
    variant_count:        (p.merch_product_variants ?? []).length,
    image_count:          (p.merch_product_images ?? []).length,
  }
}

export async function findProductStatusCounts(tenantId: string): Promise<{
  total: number; draft: number; published: number; archived: number
}> {
  const { data } = await getSupabase()
    .from('merch_campaign_products')
    .select('lifecycle_status')
    .eq('tenant_id', tenantId)
  const rows = (data ?? []) as Array<{ lifecycle_status: string }>
  return {
    total:     rows.length,
    draft:     rows.filter((r) => r.lifecycle_status === 'draft').length,
    published: rows.filter((r) => r.lifecycle_status === 'published').length,
    archived:  rows.filter((r) => r.lifecycle_status === 'archived').length,
  }
}

export async function searchProductsByTenant(
  tenantId: string,
  query:    string,
  limit:    number = 8,
): Promise<Array<{ id: string; name: string; slug: string; sku: string | null; lifecycle_status: string; campaign_name: string | null }>> {
  const q = query.trim()
  if (!q) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await getSupabase()
    .from('merch_campaign_products')
    .select('id, name, slug, sku, lifecycle_status, merch_campaigns ( name )')
    .eq('tenant_id', tenantId)
    .or(`name.ilike.%${q}%,slug.ilike.%${q}%,sku.ilike.%${q}%,supplier_sku.ilike.%${q}%`)
    .limit(limit)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((p: any) => ({
    id:               p.id,
    name:             p.name,
    slug:             p.slug,
    sku:              p.sku ?? null,
    lifecycle_status: p.lifecycle_status ?? 'draft',
    campaign_name:    p.merch_campaigns?.name ?? null,
  }))
}

export async function isProductSlugTaken(
  campaignId: string,
  slug:       string,
  excludeId?: string,
): Promise<boolean> {
  let query = getSupabase()
    .from('merch_campaign_products')
    .select('id')
    .eq('campaign_id', campaignId)
    .eq('slug', slug)
  if (excludeId) query = query.neq('id', excludeId)
  const { data } = await query.limit(1)
  return (data ?? []).length > 0
}

export type ProductInput = {
  campaign_id:          string
  name:                 string
  slug:                 string
  sku?:                 string | null
  description?:         string | null
  price_cents:          number
  cost_cents?:          number | null
  currency?:            string
  minimum_qty?:         number
  lead_time_days?:      number | null
  supplier_sku?:        string | null
  lifecycle_status?:    string
  active?:              boolean
  sort_order?:          number
  featured?:            boolean
  collection_id?:       string | null
  embroidery_available?: boolean
  embroidery_notes?:    string | null
  sizing_notes?:        string | null
  seo_title?:           string | null
  seo_description?:     string | null
  tags?:                string[]
  publish_at?:          string | null
  archive_at?:          string | null
}

export async function createAdminProduct(
  tenantId: string,
  input:    ProductInput,
): Promise<ProductAdminListRow> {
  const { data, error } = await getSupabase()
    .from('merch_campaign_products')
    .insert({
      tenant_id:             tenantId,
      campaign_id:           input.campaign_id,
      name:                  input.name,
      slug:                  input.slug,
      sku:                   input.sku ?? null,
      description:           input.description ?? null,
      price_cents:           input.price_cents,
      cost_cents:            input.cost_cents ?? null,
      currency:              input.currency ?? 'NZD',
      minimum_qty:           input.minimum_qty ?? 1,
      lead_time_days:        input.lead_time_days ?? null,
      supplier_sku:          input.supplier_sku ?? null,
      lifecycle_status:      input.lifecycle_status ?? 'draft',
      active:                input.active ?? true,
      sort_order:            input.sort_order ?? 0,
      featured:              input.featured ?? false,
      collection_id:         input.collection_id ?? null,
      embroidery_available:  input.embroidery_available ?? false,
      embroidery_notes:      input.embroidery_notes ?? null,
      sizing_notes:          input.sizing_notes ?? null,
      seo_title:             input.seo_title ?? null,
      seo_description:       input.seo_description ?? null,
      tags:                  input.tags ?? [],
      publish_at:            input.publish_at ?? null,
      archive_at:            input.archive_at ?? null,
    })
    .select('id, tenant_id')
    .single()
  if (error) throw error
  const row = await findProductByIdAdmin((data as { id: string }).id, tenantId)
  if (!row) throw new Error('Product not found after create')
  return row
}

export async function updateAdminProduct(
  id:       string,
  tenantId: string,
  input:    Partial<ProductInput>,
): Promise<ProductAdminListRow> {
  const patch: Record<string, unknown> = {}
  const fields: (keyof ProductInput)[] = [
    'name','slug','sku','description','price_cents','cost_cents','currency',
    'minimum_qty','lead_time_days','supplier_sku','lifecycle_status','active',
    'sort_order','featured','collection_id','embroidery_available',
    'embroidery_notes','sizing_notes','seo_title','seo_description','tags',
    'publish_at','archive_at',
  ]
  for (const f of fields) {
    if (f in input) patch[f] = input[f] ?? null
  }
  const { error } = await getSupabase()
    .from('merch_campaign_products')
    .update(patch)
    .eq('id', id)
    .eq('tenant_id', tenantId)
  if (error) throw error
  const row = await findProductByIdAdmin(id, tenantId)
  if (!row) throw new Error('Product not found after update')
  return row
}

export async function deleteAdminProduct(id: string, tenantId: string): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaign_products')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)
  if (error) throw error
}

export async function duplicateAdminProduct(
  id:       string,
  tenantId: string,
): Promise<ProductAdminListRow> {
  const source = await findProductByIdAdmin(id, tenantId)
  if (!source) throw new Error('Product not found')

  const base = source.slug.replace(/-copy(-\d+)?$/, '')
  const newSlug = `${base}-copy`

  const created = await createAdminProduct(tenantId, {
    campaign_id:          source.campaign_id,
    name:                 `${source.name} (Copy)`,
    slug:                 newSlug,
    sku:                  null,
    description:          null,
    price_cents:          source.price_cents,
    cost_cents:           source.cost_cents,
    currency:             source.currency,
    minimum_qty:          source.minimum_qty,
    lead_time_days:       source.lead_time_days,
    supplier_sku:         source.supplier_sku,
    lifecycle_status:     'draft',
    active:               false,
    sort_order:           source.sort_order,
    featured:             false,
    collection_id:        source.collection_id,
    embroidery_available: source.embroidery_available,
    embroidery_notes:     source.embroidery_notes,
    sizing_notes:         source.sizing_notes,
    seo_title:            null,
    seo_description:      null,
    tags:                 source.tags,
    publish_at:           null,
    archive_at:           null,
  })

  // Copy variants
  const { data: variants } = await getSupabase()
    .from('merch_product_variants')
    .select('sku, fit, size, colour, barcode, additional_cost_cents, available, sort_order, weight_grams')
    .eq('campaign_product_id', id)
  if (variants && variants.length > 0) {
    await getSupabase()
      .from('merch_product_variants')
      .insert(variants.map((v: Record<string, unknown>) => ({ ...v, campaign_product_id: created.id, id: undefined })))
  }

  return created
}

// ── Variant admin queries ─────────────────────────────────────────────────

export type ProductVariantAdminRow = {
  id:                    string
  campaign_product_id:   string
  sku:                   string | null
  fit:                   string
  size:                  string
  colour:                string
  barcode:               string | null
  additional_cost_cents: number
  available:             boolean
  sort_order:            number
  stock_qty:             number | null
}

export async function findVariantsByProduct(productId: string): Promise<ProductVariantAdminRow[]> {
  const { data, error } = await getSupabase()
    .from('merch_product_variants')
    .select('id, campaign_product_id, sku, fit, size, colour, barcode, additional_cost_cents, available, sort_order, stock_qty')
    .eq('campaign_product_id', productId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as ProductVariantAdminRow[]
}

export async function createVariantAdmin(
  productId: string,
  input: Omit<ProductVariantAdminRow, 'id' | 'campaign_product_id'>,
): Promise<ProductVariantAdminRow> {
  const { data, error } = await getSupabase()
    .from('merch_product_variants')
    .insert({ campaign_product_id: productId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as ProductVariantAdminRow
}

export async function updateVariantAdmin(
  id:    string,
  input: Partial<Omit<ProductVariantAdminRow, 'id' | 'campaign_product_id'>>,
): Promise<ProductVariantAdminRow> {
  const { data, error } = await getSupabase()
    .from('merch_product_variants')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as ProductVariantAdminRow
}

export async function deleteVariantAdmin(id: string): Promise<void> {
  const { error } = await getSupabase().from('merch_product_variants').delete().eq('id', id)
  if (error) throw error
}

export async function reorderVariantsAdmin(orderedIds: string[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, i) =>
      getSupabase().from('merch_product_variants').update({ sort_order: i }).eq('id', id),
    ),
  )
}

// ── Branding admin queries ────────────────────────────────────────────────

export type ProductBrandingAdminRow = {
  id:                    string
  campaign_product_id:   string
  method:                string
  position:              string | null
  max_colours:           number | null
  artwork_notes:         string | null
  additional_cost_cents: number
  sort_order:            number
  active:                boolean
}

export async function findBrandingByProduct(productId: string): Promise<ProductBrandingAdminRow[]> {
  const { data, error } = await getSupabase()
    .from('merch_product_branding')
    .select('id, campaign_product_id, method, position, max_colours, artwork_notes, additional_cost_cents, sort_order, active')
    .eq('campaign_product_id', productId)
    .eq('active', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as ProductBrandingAdminRow[]
}

export async function createBrandingAdmin(
  productId: string,
  input: Omit<ProductBrandingAdminRow, 'id' | 'campaign_product_id'>,
): Promise<ProductBrandingAdminRow> {
  const { data, error } = await getSupabase()
    .from('merch_product_branding')
    .insert({ campaign_product_id: productId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as ProductBrandingAdminRow
}

export async function updateBrandingAdmin(
  id:    string,
  input: Partial<Omit<ProductBrandingAdminRow, 'id' | 'campaign_product_id'>>,
): Promise<ProductBrandingAdminRow> {
  const { data, error } = await getSupabase()
    .from('merch_product_branding')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as ProductBrandingAdminRow
}

export async function deleteBrandingAdmin(id: string): Promise<void> {
  const { error } = await getSupabase().from('merch_product_branding').delete().eq('id', id)
  if (error) throw error
}

export async function reorderBrandingAdmin(orderedIds: string[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, i) =>
      getSupabase().from('merch_product_branding').update({ sort_order: i }).eq('id', id),
    ),
  )
}
