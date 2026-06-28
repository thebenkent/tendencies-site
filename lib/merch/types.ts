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
  status: CampaignStatus
  created_at: string
  updated_at: string
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
}

export type MerchProductVariant = {
  id: string
  campaign_product_id: string
  sku: string | null
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

// Flat merged view consumed by pages.
// Combines campaign_product + master_product + assets.
export type MerchProduct = {
  id: string
  campaign_id: string
  master_product_id: string
  tenant_id: string
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
  // flattened assets → image URLs
  images: string[]
}

export type MerchProductWithVariants = MerchProduct & {
  merch_product_variants: MerchProductVariant[]
}

// ── Collections ──────────────────────────────────────────────

export type MerchCollection = {
  id: string
  campaign_id: string
  tenant_id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  created_at: string
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
  id: string
  campaign_id: string
  tenant_id: string
  customer_id: string
  location_id: string | null
  order_number: string | null
  status: OrderStatus
  delivery_method: DeliveryMethod
  delivery_address: string | null
  notes: string | null
  created_at: string
  updated_at: string
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
      merch_product_variants: Pick<MerchProductVariant, 'size' | 'colour' | 'additional_cost_cents'>
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
