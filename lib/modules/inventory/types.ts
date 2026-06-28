export type InventoryEventType =
  | 'allocate'   // stock committed to an order
  | 'release'    // stock returned to available (order cancelled)
  | 'adjust'     // manual admin correction
  | 'receive'    // stock received from supplier / PO
  | 'write_off'  // damaged / lost stock

export type MerchInventoryEvent = {
  id:         string
  variant_id: string
  tenant_id:  string
  order_id:   string | null
  event_type: InventoryEventType
  delta:      number
  notes:      string | null
  actor:      string | null
  created_at: string
}

export type VariantInventoryPosition = {
  variant_id:          string
  campaign_product_id: string
  size:                string
  colour:              string
  stock_qty:           number | null   // null = unlimited
  stock_reserved:      number
  stock_low_threshold: number | null
  stock_available:     number | null   // null = unlimited
  is_low_stock:        boolean
}

export type StockCheckResult = {
  available: boolean
  reason?:   string
  stock_available?: number | null
}
