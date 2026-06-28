import { getSupabase } from '@/lib/core/database'

export type OrderStatusCount = {
  status: string
  count:  number
}

export type OrderLineRevenue = {
  status:        string
  total_cents:   number
  order_count:   number
}

// Raw DB query — returns order counts grouped by status for a tenant/campaign.
export async function queryOrdersByStatus(
  tenantId:    string,
  campaignId?: string,
): Promise<OrderStatusCount[]> {
  let q = getSupabase()
    .from('merch_orders')
    .select('status')
    .eq('tenant_id', tenantId)
  if (campaignId) q = q.eq('campaign_id', campaignId)

  const { data } = await q
  const rows: Array<{ status: string }> = data ?? []
  const counts: Record<string, number> = {}
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1
  return Object.entries(counts).map(([status, count]) => ({ status, count }))
}

// Raw DB query — returns revenue aggregated by status.
export async function queryRevenueByStatus(
  tenantId:    string,
  campaignId?: string,
): Promise<OrderLineRevenue[]> {
  let q = getSupabase()
    .from('merch_orders')
    .select('id, status, merch_order_lines(qty, unit_price_cents)')
    .eq('tenant_id', tenantId)
  if (campaignId) q = q.eq('campaign_id', campaignId)

  const { data } = await q
  const rows: Array<{ id: string; status: string; merch_order_lines: Array<{ qty: number; unit_price_cents: number }> }> = data ?? []

  const byStatus: Record<string, { total_cents: number; order_count: number }> = {}
  for (const row of rows) {
    if (!byStatus[row.status]) byStatus[row.status] = { total_cents: 0, order_count: 0 }
    byStatus[row.status].order_count++
    for (const l of row.merch_order_lines) {
      byStatus[row.status].total_cents += l.qty * l.unit_price_cents
    }
  }
  return Object.entries(byStatus).map(([status, v]) => ({ status, ...v }))
}

// Raw DB query — returns per-product order line stats.
export async function queryProductStats(
  tenantId:    string,
  campaignId?: string,
): Promise<Array<{
  campaign_product_id: string
  product_name:        string
  minimum_qty:         number
  order_count:         number
  total_cents:         number
}>> {
  let q = getSupabase()
    .from('merch_orders')
    .select(`
      status,
      merch_order_lines (
        qty,
        unit_price_cents,
        merch_campaign_products ( id, name, minimum_qty )
      )
    `)
    .eq('tenant_id', tenantId)
    .not('status', 'in', '(cancelled,refunded)')
  if (campaignId) q = q.eq('campaign_id', campaignId)

  const { data } = await q
  const rows: any[] = data ?? []

  const byProduct: Record<string, { name: string; minimum_qty: number; count: number; revenue: number }> = {}
  for (const order of rows) {
    for (const line of order.merch_order_lines ?? []) {
      const cp = line.merch_campaign_products
      if (!cp) continue
      if (!byProduct[cp.id]) byProduct[cp.id] = { name: cp.name, minimum_qty: cp.minimum_qty, count: 0, revenue: 0 }
      byProduct[cp.id].count++
      byProduct[cp.id].revenue += line.qty * line.unit_price_cents
    }
  }

  return Object.entries(byProduct).map(([id, v]) => ({
    campaign_product_id: id,
    product_name:        v.name,
    minimum_qty:         v.minimum_qty,
    order_count:         v.count,
    total_cents:         v.revenue,
  }))
}

// Outstanding payments — orders awaiting payment that have been confirmed.
export async function queryOutstandingPayments(
  tenantId:    string,
  campaignId?: string,
): Promise<{ count: number; total_cents: number }> {
  let q = getSupabase()
    .from('merch_orders')
    .select('id, merch_order_lines(qty, unit_price_cents)')
    .eq('tenant_id', tenantId)
    .in('status', ['confirmed', 'payment_requested'])
  if (campaignId) q = q.eq('campaign_id', campaignId)

  const { data } = await q
  const rows: any[] = data ?? []
  let total_cents = 0
  for (const o of rows) {
    for (const l of o.merch_order_lines ?? []) {
      total_cents += l.qty * l.unit_price_cents
    }
  }
  return { count: rows.length, total_cents }
}
