import { getSupabase } from '@/lib/core/database'
import type {
  MerchProductWithVariants, MerchProduct, MerchProductVariant,
  MerchProductPersonalisation, MerchSizeChart, MerchProductImage,
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

  const product: MerchProduct = {
    id:                   raw.id,
    campaign_id:          raw.campaign_id,
    master_product_id:    raw.master_product_id,
    tenant_id:            raw.tenant_id,
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

export async function findVariantById(variantId: string): Promise<MerchProductVariant | null> {
  const { data, error } = await getSupabase()
    .from('merch_product_variants')
    .select('*')
    .eq('id', variantId)
    .single()
  if (error || !data) return null
  return data as MerchProductVariant
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
