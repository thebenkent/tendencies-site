import {
  queryRevenueByStatus,
  queryProductStats,
  queryOutstandingPayments,
} from './repository'
import type { CampaignAnalytics, TopProduct, RevenueByStatus } from './types'

export type { CampaignAnalytics, TopProduct, RevenueByStatus }
export { queryOutstandingPayments }

const TERMINAL_EXCLUDED = ['cancelled', 'refunded']

export async function getRevenueByStatus(
  tenantId:    string,
  campaignId?: string,
): Promise<RevenueByStatus[]> {
  const raw = await queryRevenueByStatus(tenantId, campaignId)
  return raw
    .filter((r) => !TERMINAL_EXCLUDED.includes(r.status))
    .map((r) => ({ status: r.status, total: r.total_cents, count: r.order_count }))
}

export async function getTopProducts(
  tenantId:    string,
  campaignId?: string,
  limit        = 10,
): Promise<TopProduct[]> {
  const raw = await queryProductStats(tenantId, campaignId)
  return raw
    .map((r) => ({
      productId:   r.campaign_product_id,
      productName: r.product_name,
      orderCount:  r.order_count,
      revenue:     r.total_cents,
      moqMet:      r.order_count >= r.minimum_qty,
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, limit)
}

export async function getCampaignAnalytics(
  tenantId:   string,
  campaignId: string,
): Promise<CampaignAnalytics> {
  const [revenueBreakdown, topProducts] = await Promise.all([
    getRevenueByStatus(tenantId, campaignId),
    getTopProducts(tenantId, campaignId),
  ])

  const totalRevenue    = revenueBreakdown.reduce((s, r) => s + r.total, 0)
  const totalOrders     = revenueBreakdown.reduce((s, r) => s + r.count, 0)
  const confirmedOrders = revenueBreakdown
    .filter((r) => ['confirmed', 'paid', 'production', 'completed'].includes(r.status))
    .reduce((s, r) => s + r.count, 0)

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    conversionRate:    totalOrders > 0 ? Math.round((confirmedOrders / totalOrders) * 100) : 0,
    topProducts,
  }
}
