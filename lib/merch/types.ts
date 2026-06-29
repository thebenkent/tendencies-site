// ── Enumerations ─────────────────────────────────────────────

export type MerchUserRole = 'owner' | 'admin' | 'production' | 'finance' | 'viewer'

export type CampaignType =
  | 'reservation' | 'pre_order' | 'retail'
  | 'uniform'     | 'corporate' | 'event' | 'gift_redemption'

export type CampaignStatus =
  | 'draft' | 'open' | 'closing_soon' | 'closed'
  | 'payment_requested' | 'production' | 'completed' | 'archived'

// Order status is workflow-driven — valid values depend on campaign_type.
// Reservation defaults: reserved → confirmed → payment_requested → paid → production → completed
export type OrderStatus = string

// Backward-compat alias
export type ReservationStatus = OrderStatus

export type DeliveryMethod = 'collect' | 'courier'
export type AssetType = 'image' | 'video' | 'pdf' | 'size_chart' | 'embroidery_guide' | 'lifestyle' | 'mockup'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

// ── Tenant & Branding ────────────────────────────────────────

export type MerchTenant = {
  id: string
  slug: string
  name: string
  contact_email: string | null
  contact_phone: string | null
  active: boolean
  created_at: string
  // merged from merch_branding
  logo_url: string | null
  favicon_url: string | null
  primary_color: string
  secondary_color: string
  font_family: string
  button_style: string
  border_radius: string
  hero_image: string | null
  hero_title: string | null
  hero_subtitle: string | null
}

export type MerchBranding = {
  id: string
  tenant_id: string
  logo_url: string | null
  favicon_url: string | null
  primary_color: string
  secondary_color: string
  font_family: string
  button_style: string
  border_radius: string
  hero_image: string | null
  hero_title: string | null
  hero_subtitle: string | null
  updated_at: string
}

export type MerchLocation = {
  id: string
  tenant_id: string
  name: string
  address: string | null
  phone: string | null
  active: boolean
  created_at: string
}

// ── Campaigns ────────────────────────────────────────────────

export type MerchCampaign = {
  id: string
  tenant_id: string
  slug: string
  name: string
  description: string | null
  campaign_type: CampaignType
  workflow_id: string | null
  opens_at: string | null
  closes_at: string | null
  is_public: boolean
  status: CampaignStatus
  success_message: string | null
  failure_message: string | null
  delivery_info:   string | null
  pickup_info:     string | null
  club_contact:    string | null
  created_at: string
  updated_at: string
}

// Per-campaign branding overrides (overrides tenant-level merch_branding)
export type MerchCampaignBranding = {
  campaign_id:     string
  logo_url:        string | null
  primary_color:   string | null
  secondary_color: string | null
  hero_image:      string | null
  hero_title:      string | null
  hero_subtitle:   string | null
  updated_at:      string
}

// ── Workflow Engine ───────────────────────────────────────────

export type MerchWorkflow = {
  id: string
  name: string
  description: string | null
  active: boolean
  created_at: string
}

export type MerchWorkflowState = {
  id: string
  workflow_id: string
  key: string
  label: string
  display_order: number
  colour: string
  icon: string | null
  terminal: boolean
  system: boolean
}

export type MerchWorkflowTransition = {
  id: string
  workflow_id: string
  from_state: string
  to_state: string
  action_name: string
  requires_permission: string | null
  email_template: string | null
  automation: Record<string, unknown> | null
}

export type WorkflowAction = {
  toState: string
  actionName: string
  requiresPermission: string | null
}

// ── Products ─────────────────────────────────────────────────

export type MerchMasterProduct = {
  id: string
  name: string
  description: string | null
  material: string | null
  weight_grams: number | null
  base_sku: string | null
  features: string[] | null
  created_at: string
  updated_at: string
}

export type MerchCampaignProduct = {
  id: string
  campaign_id: string
  master_product_id: string
  tenant_id: string
  collection_id: string | null
  slug: string
  name: string
  description: string | null
  price_cents: number
  minimum_qty: number
  lead_time_days: number
  sizing_notes: string | null
  embroidery_available: boolean
  embroidery_notes: string | null
  sort_order: number
  active: boolean
  created_at: string
  // Phase 9: CMS fields
  lifecycle_status:  string          // 'draft' | 'review' | 'published' | 'archived' | 'hidden' | 'scheduled'
  sku:               string | null
  cost_cents:        number | null
  currency:          string
  supplier_sku:      string | null
  seo_title:         string | null
  seo_description:   string | null
  tags:              string[]
  featured:          boolean
  publish_at:        string | null
  archive_at:        string | null
  published_at:      string | null
  archived_at:       string | null
  updated_at:        string | null
}

export type MerchProductBrandingMethod =
  | 'screen_print' | 'embroidery' | 'pad_print' | 'laser'
  | 'uv' | 'digital_transfer' | 'sublimation' | 'custom'

export type MerchProductBranding = {
  id:                    string
  campaign_product_id:   string
  method:                MerchProductBrandingMethod
  position:              string | null
  max_colours:           number | null
  artwork_notes:         string | null
  additional_cost_cents: number
  sort_order:            number
  active:                boolean
  created_at:            string
}

export type MerchProductVariant = {
  id: string
  campaign_product_id: string
  sku: string | null
  fit: string       // '' = no fit dimension; 'Mens' | 'Womens' | 'Youth' | ...
  size: string
  colour: string
  barcode: string | null
  additional_cost_cents: number
  available: boolean
  sort_order: number
  weight_grams: number | null
  stock_qty: number | null
  created_at: string
}

// ── Product Architecture Tables ───────────────────────────────

export type MerchProductPersonalisation = {
  id:                    string
  campaign_product_id:   string
  type:                  'text' | 'number' | 'select'
  label:                 string
  required:              boolean
  max_length:            number | null
  uppercase_only:        boolean
  additional_price_cents: number
  placeholder:           string | null
  sort_order:            number
  active:                boolean
  created_at:            string
}

export type MerchSizeChartData = {
  note?: string | null
  headers: string[]
  rows: string[][]
}

export type MerchSizeChart = {
  id:                  string
  campaign_product_id: string
  fit:                 string   // '' = applies to all fits
  title:               string
  chart_json:          MerchSizeChartData
  image_url:           string | null
  pdf_url:             string | null
  sort_order:          number
  created_at:          string
}

export type MerchProductImage = {
  id:                  string
  campaign_product_id: string
  url:                 string
  image_type:          'front' | 'back' | 'side' | 'detail' | 'lifestyle'
  alt_text:            string | null
  display_order:       number
  created_at:          string
}

export type MerchAsset = {
  id: string
  tenant_id: string | null
  master_product_id: string | null
  campaign_product_id: string | null
  variant_id: string | null
  type: AssetType
  url: string
  alt_text: string | null
  sort_order: number
  created_at: string
}

// ── Product content & badges ─────────────────────────────────

export type MerchProductBadge = {
  id:                  string
  campaign_product_id: string
  tenant_id:           string
  label:               string
  badge_type:          'default' | 'success' | 'warning' | 'danger' | 'info' | 'dark'
  icon:                string | null
  active:              boolean
  sort_order:          number
  starts_at:           string | null
  ends_at:             string | null
  created_at:          string
}

export type ProductContentType = 'text' | 'list' | 'table' | 'html'
export type ProductContentSection =
  | 'highlights' | 'features' | 'fabric' | 'materials'
  | 'sizing_notes' | 'care_instructions' | 'branding_details'
  | 'delivery' | 'returns' | 'custom'

export type MerchProductContent = {
  id:                  string
  campaign_product_id: string
  section:             ProductContentSection
  title:               string | null
  content_type:        ProductContentType
  content:             Record<string, unknown>  // shape depends on content_type
  sort_order:          number
  active:              boolean
  created_at:          string
}

export type ProductRelationType = 'related' | 'frequently_bought' | 'complete_look' | 'also_purchased' | 'upsell'

export type MerchProductRelated = {
  id:                  string
  source_product_id:   string
  related_product_id:  string
  relation_type:       ProductRelationType
  sort_order:          number
  created_at:          string
}

// Flat merged view consumed by pages.
// Combines campaign_product + master_product + assets.
export type MerchProduct = {
  id: string
  campaign_id: string
  master_product_id: string
  tenant_id: string
  collection_id: string | null
  slug: string
  name: string
  description: string | null
  price_cents: number
  minimum_qty: number
  lead_time_days: number
  sizing_notes: string | null
  embroidery_available: boolean
  embroidery_notes: string | null
  sort_order: number
  active: boolean
  created_at: string
  // from master product
  material: string | null
  weight_grams: number | null
  base_sku: string | null
  features: string[] | null
  // gallery — derived from merch_product_images, falls back to merch_assets
  images:          string[]
  product_images:  MerchProductImage[]
  // relational product configuration
  personalisation: MerchProductPersonalisation[]
  size_charts:     MerchSizeChart[]
  badges:          MerchProductBadge[]
  content:         MerchProductContent[]
}

export type MerchProductWithVariants = MerchProduct & {
  merch_product_variants: MerchProductVariant[]
}

// ── Collections ──────────────────────────────────────────────

export type MerchCollection = {
  id:               string
  campaign_id:      string
  tenant_id:        string
  name:             string
  slug:             string
  description:      string | null
  // Media
  image_url:        string | null   // hero image (migration 010)
  thumbnail_url:    string | null   // card thumbnail (migration 013)
  // Lifecycle
  lifecycle_status: string          // LifecycleStatus (migration 013)
  publish_at:       string | null
  archive_at:       string | null
  published_at:     string | null
  archived_at:      string | null
  // SEO
  seo_title:        string | null
  seo_description:  string | null
  // Categorisation
  tags:             string[]
  // Display
  visible:          boolean
  featured:         boolean         // migration 013
  sort_order:       number
  created_at:       string
  updated_at:       string
}

/** Junction row: collection → campaign_product, with metadata */
export type MerchCollectionProduct = {
  collection_id:       string
  campaign_product_id: string
  sort_order:          number
  featured:            boolean
}

// ── Customers ────────────────────────────────────────────────

export type MerchCustomer = {
  id: string
  tenant_id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  team: string | null
  grade: string | null
  created_at: string
  updated_at: string
}

// ── Orders ───────────────────────────────────────────────────

export type MerchOrder = {
  id:               string
  campaign_id:      string
  tenant_id:        string
  customer_id:      string
  location_id:      string | null
  order_number:     string | null
  status:           OrderStatus
  delivery_method:  DeliveryMethod
  delivery_address: string | null
  notes:            string | null
  attribute_values: Record<string, string>   // campaign attribute answers (formerly question_answers)
  created_at:       string
  updated_at:       string
}

export type MerchOrderLine = {
  id: string
  order_id: string
  campaign_product_id: string
  variant_id: string
  player_name: string | null
  qty: number
  unit_price_cents: number
  created_at: string
}

export type MerchOrderEvent = {
  id: string
  order_id: string
  tenant_id: string
  event_type: string
  actor: string
  metadata: Record<string, unknown>
  created_at: string
}

// Expanded order with joins — used in admin dashboard and CSV export.
export type MerchOrderExpanded = MerchOrder & {
  merch_customers: Pick<MerchCustomer, 'first_name' | 'last_name' | 'email' | 'phone' | 'team' | 'grade'>
  merch_order_lines: Array<
    MerchOrderLine & {
      merch_products: { name: string; slug: string; price_cents: number }
      merch_product_variants: Pick<MerchProductVariant, 'size' | 'colour' | 'fit' | 'additional_cost_cents'>
    }
  >
}

// Backward-compat aliases — keep success page + existing admin client code unchanged
export type MerchReservation = MerchOrder
export type MerchReservationExpanded = MerchOrderExpanded

// ── Payments ─────────────────────────────────────────────────

export type MerchPayment = {
  id: string
  order_id: string
  tenant_id: string
  customer_id: string
  amount_cents: number
  currency: string
  payment_link: string | null
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  status: PaymentStatus
  paid_at: string | null
  created_at: string
  updated_at: string
}

// ── Bundles ───────────────────────────────────────────────────

export type BundleDiscountType = 'none' | 'percentage' | 'fixed'

export type MerchBundle = {
  id:             string
  campaign_id:    string
  tenant_id:      string
  collection_id:  string | null   // optional collection grouping
  name:           string
  slug:           string
  description:    string | null
  image_url:      string | null
  price_cents:    number | null   // null = auto-calculated from components
  discount_type:  BundleDiscountType
  discount_value: number          // cents (fixed) or basis points (percentage)
  active:         boolean
  sort_order:     number
  created_at:     string
  items?:         MerchBundleItem[]
}

export type MerchBundleItem = {
  id:                  string
  bundle_id:           string
  campaign_product_id: string
  required_qty:        number
  required:            boolean    // true = must be included; false = optional add-on
  sort_order:          number
  created_at:          string
}

// ── Campaign Attributes ───────────────────────────────────────
// Configurable per-order fields: Team, Grade, Cost Centre, etc.
// Replaces the previous "Checkout Questions" naming.

export type CampaignAttributeType = 'text' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'date' | 'number'

export type MerchCampaignAttribute = {
  id:          string
  campaign_id: string
  tenant_id:   string
  type:        CampaignAttributeType
  label:       string
  placeholder: string | null
  help_text:   string | null
  options:     string[] | null   // for dropdown/radio types
  required:    boolean
  applies_to:  'order' | 'line'
  sort_order:  number
  active:      boolean
  created_at:  string
}

// Deprecated alias — remove after all admin code migrates to MerchCampaignAttribute
export type MerchCheckoutQuestion = MerchCampaignAttribute

// ── Campaign Banners ──────────────────────────────────────────

export type BannerType = 'info' | 'success' | 'warning' | 'urgent' | 'neutral'

export type MerchCampaignBanner = {
  id:          string
  campaign_id: string
  tenant_id:   string
  message:     string
  link_url:    string | null
  link_label:  string | null
  banner_type: BannerType
  icon:        string | null
  active:      boolean
  starts_at:   string | null
  ends_at:     string | null
  sort_order:  number
  created_at:  string
}

// ── Computed ─────────────────────────────────────────────────

export type ProductProgress = {
  orderedQty: number
  minimumQty: number
  percentage: number
  isMet: boolean
  isExpired: boolean
  daysLeft: number | null
  status: CampaignStatus
}

// ── Admin ────────────────────────────────────────────────────

export type AdminStats = {
  totalOrders: number
  confirmedOrders: number
  pendingOrders: number
  totalRevenue: number
}

// ── Rules Engine ─────────────────────────────────────────────

export type CampaignRuleKey = import('@/lib/modules/rules/types').CampaignRuleKey
export type CampaignRule = {
  id:          string
  campaign_id: string
  rule_key:    string
  rule_value:  unknown
}

// ── Automation Engine ────────────────────────────────────────

export type Automation = import('@/lib/modules/automations/types').MerchAutomation
export type AutomationStep = import('@/lib/modules/automations/types').MerchAutomationStep
