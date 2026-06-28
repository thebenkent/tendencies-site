export type RevenueByStatus = {
  status:  string
  total:   number
  count:   number
}

export type TopProduct = {
  productId:   string
  productName: string
  orderCount:  number
  revenue:     number
  moqMet:      boolean
}

export type CampaignAnalytics = {
  totalRevenue:      number
  totalOrders:       number
  averageOrderValue: number
  conversionRate:    number  // confirmed / total (non-cancelled)
  topProducts:       TopProduct[]
}
