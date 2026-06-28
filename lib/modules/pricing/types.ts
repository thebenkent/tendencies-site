export type MerchPricing = {
  id:                  string
  campaign_product_id: string
  currency:            string
  price_cents:         number
  sale_price_cents:    number | null
  effective_from:      string | null
  effective_to:        string | null
  created_at:          string
}

export type ResolvedPrice = {
  priceCents:     number
  salePriceCents: number | null
  currency:       string
  isOnSale:       boolean
  displayCents:   number   // effective price (sale if active, otherwise normal)
}
