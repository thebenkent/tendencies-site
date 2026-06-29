export type {
  MerchMasterProduct,
  MerchCampaignProduct,
  MerchProductVariant,
  MerchProduct,
  MerchProductWithVariants,
  MerchAsset,
  MerchCollection,
  AssetType,
  ProductProgress,
} from '@/lib/merch/types'

// ── Admin DTO — kept separate so admin-service.ts ('use server') only
//    exports async functions, as required by Next.js.

export type ProductAdminData = {
  // Identity
  id:            string
  tenantId:      string
  campaignId:    string
  campaign_name: string

  // Core
  name:        string
  slug:        string
  sku:         string
  description: string

  // Pricing
  price_cents:  number
  cost_cents:   number | null
  currency:     string
  minimum_qty:  number

  // Operations
  lead_time_days: number | null
  supplier_sku:   string

  // Lifecycle
  status: string
  active: boolean

  // Display
  sort_order:    number
  featured:      boolean
  collection_id: string
  thumbnail_url: string

  // Branding (legacy inline)
  embroidery_available: boolean
  embroidery_notes:     string
  sizing_notes:         string

  // SEO
  seo_title:       string
  seo_description: string

  // Tags
  tags: string[]

  // Scheduling
  publish_at:  string
  archive_at:  string
  published_at: string | null
  archived_at:  string | null

  // Computed (list view)
  variant_count: number
  image_count:   number

  // Timestamps
  created_at: string
  updated_at: string
}

export const PRODUCT_DEFAULTS: ProductAdminData = {
  id:            '',
  tenantId:      '',
  campaignId:    '',
  campaign_name: '',
  name:          '',
  slug:          '',
  sku:           '',
  description:   '',
  price_cents:   0,
  cost_cents:    null,
  currency:      'NZD',
  minimum_qty:   1,
  lead_time_days: null,
  supplier_sku:  '',
  status:        'draft',
  active:        true,
  sort_order:    0,
  featured:      false,
  collection_id: '',
  thumbnail_url: '',
  embroidery_available: false,
  embroidery_notes:     '',
  sizing_notes:         '',
  seo_title:       '',
  seo_description: '',
  tags:            [],
  publish_at:  '',
  archive_at:  '',
  published_at: null,
  archived_at:  null,
  variant_count: 0,
  image_count:   0,
  created_at:    '',
  updated_at:    '',
}
