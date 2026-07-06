import { getSupabase } from '@/lib/core/database'
import type { MerchOrder, MerchOrderLine, MerchOrderExpanded, MerchOrderEvent, OrderStatus, AdminStats } from '@/lib/merch/types'

const ORDER_EXPAND_SELECT = `
  *,
  merch_customers ( first_name, last_name, email, phone, team, grade ),
  merch_order_lines (
    *,
    merch_campaign_products ( name, slug, price_cents ),
    merch_product_variants  ( size, colour, fit, additional_cost_cents )
  )
`

function normalizeExpanded(raw: any): MerchOrderExpanded {
  return {
    ...raw,
    merch_order_lines: (raw.merch_order_lines ?? []).map((line: any) => ({
      ...line,
      merch_products:         line.merch_campaign_products ?? { name: '', slug: '', price_cents: 0 },
      merch_product_variants: line.merch_product_variants  ?? { size: '', colour: '', fit: '', additional_cost_cents: 0 },
    })),
  } as MerchOrderExpanded
}

// ── Create ────────────────────────────────────────────────────

export type CreateOrderInput = {
  tenantId:         string
  campaignId:       string
  customerId:       string
  deliveryMethod:   string
  deliveryAddress?: string
  notes?:           string
  initialStatus?:   string
  attributeValues?: Record<string, string>   // campaign attribute answers
}

function generateOrderNumber(): string {
  const now    = new Date()
  const year   = now.getFullYear().toString().slice(-2)
  const month  = String(now.getMonth() + 1).padStart(2, '0')
  const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `TA${year}${month}${suffix}`
}

export async function createOrder(input: CreateOrderInput): Promise<MerchOrder> {
  const { tenantId, campaignId, customerId, deliveryMethod, deliveryAddress, notes, initialStatus, attributeValues } = input

  const { data, error } = await getSupabase()
    .from('merch_orders')
    .insert({
      tenant_id:        tenantId,
      campaign_id:      campaignId,
      customer_id:      customerId,
      delivery_method:  deliveryMethod,
      delivery_address: deliveryAddress  ?? null,
      notes:            notes            ?? null,
      status:           initialStatus    ?? 'reserved',
      order_number:     generateOrderNumber(),
      attribute_values: attributeValues  ?? {},
    })
    .select()
    .single()

  if (error) throw new Error(`createOrder failed: ${error.message}`)
  return data as MerchOrder
}

export type CreateOrderLineInput = {
  orderId:           string
  campaignProductId: string
  variantId:         string
  qty:               number
  unitPriceCents:    number
  playerName?:       string
}

export async function createOrderLine(input: CreateOrderLineInput): Promise<MerchOrderLine> {
  const { orderId, campaignProductId, variantId, qty, unitPriceCents, playerName } = input

  const { data, error } = await getSupabase()
    .from('merch_order_lines')
    .insert({
      order_id:            orderId,
      campaign_product_id: campaignProductId,
      variant_id:          variantId,
      qty,
      unit_price_cents:    unitPriceCents,
      player_name:         playerName ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(`createOrderLine failed: ${error.message}`)
  return data as MerchOrderLine
}

// ── Read ──────────────────────────────────────────────────────

export async function findOrderById(orderId: string, tenantId: string): Promise<MerchOrderExpanded | null> {
  const { data, error } = await getSupabase()
    .from('merch_orders')
    .select(ORDER_EXPAND_SELECT)
    .eq('id', orderId)
    .eq('tenant_id', tenantId)
    .single()
  if (error || !data) return null
  return normalizeExpanded(data)
}

export type FindOrdersOptions = {
  campaignId?: string
  status?:     string
  productId?:  string
  search?:     string
}

export async function findOrdersByTenant(
  tenantId: string,
  opts: FindOrdersOptions = {},
): Promise<MerchOrderExpanded[]> {
  let q = getSupabase()
    .from('merch_orders')
    .select(ORDER_EXPAND_SELECT)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (opts.campaignId) q = q.eq('campaign_id', opts.campaignId)
  if (opts.status)     q = q.eq('status', opts.status)

  const { data } = await q
  let rows: MerchOrderExpanded[] = (data ?? []).map(normalizeExpanded)

  if (opts.productId) {
    rows = rows.filter((o) =>
      o.merch_order_lines.some((l) => l.campaign_product_id === opts.productId)
    )
  }

  if (opts.search) {
    const s = opts.search.toLowerCase()
    rows = rows.filter((o) => {
      const c = o.merch_customers
      return (
        c.first_name.toLowerCase().includes(s) ||
        c.last_name.toLowerCase().includes(s)  ||
        c.email.toLowerCase().includes(s)      ||
        (c.team?.toLowerCase().includes(s) ?? false) ||
        o.merch_order_lines.some((l) => l.merch_products.name.toLowerCase().includes(s))
      )
    })
  }

  return rows
}

export async function findOrdersByCampaignProduct(
  campaignProductId: string,
  tenantId: string,
  status: string,
): Promise<Array<{ id: string; order_id: string }>> {
  // Two-step query — avoids relying on PostgREST embedded resource filtering,
  // which silently returns nothing when the FK relationship name doesn't exactly
  // match the table name in the schema cache.
  const { data: lines, error: linesErr } = await getSupabase()
    .from('merch_order_lines')
    .select('id, order_id')
    .eq('campaign_product_id', campaignProductId)

  if (linesErr) throw new Error(`findOrdersByCampaignProduct lines query failed: ${linesErr.message}`)
  if (!lines || lines.length === 0) return []

  const candidateOrderIds = [...new Set((lines as any[]).map((l: any) => l.order_id as string))]

  const { data: orders, error: ordersErr } = await getSupabase()
    .from('merch_orders')
    .select('id')
    .in('id', candidateOrderIds)
    .eq('tenant_id', tenantId)
    .eq('status', status)

  if (ordersErr) throw new Error(`findOrdersByCampaignProduct orders query failed: ${ordersErr.message}`)
  if (!orders || orders.length === 0) return []

  const matchingIds = new Set((orders as any[]).map((o: any) => o.id as string))
  return (lines as any[])
    .filter((l: any) => matchingIds.has(l.order_id))
    .map((l: any) => ({ id: l.id as string, order_id: l.order_id as string }))
}

// ── Update ────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId:  string,
  tenantId: string,
  status:   OrderStatus,
  actor:    string = 'admin',
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_orders')
    .update({ status })
    .eq('id', orderId)
    .eq('tenant_id', tenantId)

  if (error) throw new Error(`updateOrderStatus failed: ${error.message}`)

  await appendOrderEvent(orderId, tenantId, 'status_changed', actor, { status })
}

export async function updateOrdersStatus(
  orderIds: string[],
  tenantId: string,
  status:   OrderStatus,
  actor:    string = 'system',
): Promise<void> {
  if (!orderIds.length) return
  const { error } = await getSupabase()
    .from('merch_orders')
    .update({ status })
    .in('id', orderIds)
    .eq('tenant_id', tenantId)
  if (error) throw new Error(`updateOrdersStatus failed: ${error.message}`)
}

// ── Events ────────────────────────────────────────────────────

export async function appendOrderEvent(
  orderId:   string,
  tenantId:  string,
  eventType: string,
  actor:     string = 'system',
  metadata:  Record<string, unknown> = {},
): Promise<MerchOrderEvent> {
  const { data, error } = await getSupabase()
    .from('merch_order_events')
    .insert({ order_id: orderId, tenant_id: tenantId, event_type: eventType, actor, metadata })
    .select()
    .single()
  if (error) throw new Error(`appendOrderEvent failed: ${error.message}`)
  return data as MerchOrderEvent
}

// ── Stats ─────────────────────────────────────────────────────

export async function getAdminStats(
  tenantId:    string,
  campaignId?: string,
): Promise<AdminStats> {
  let q = getSupabase()
    .from('merch_orders')
    .select('status')
    .eq('tenant_id', tenantId)
    .not('status', 'in', '(cancelled,refunded)')
  if (campaignId) q = q.eq('campaign_id', campaignId)

  const { data } = await q
  const rows: Array<{ status: string }> = data ?? []

  let totalOrders    = 0
  let confirmedOrders = 0
  let pendingOrders  = 0

  for (const row of rows) {
    totalOrders++
    if (row.status === 'confirmed' || row.status === 'paid') confirmedOrders++
    if (row.status === 'reserved') pendingOrders++
  }

  return { totalOrders, confirmedOrders, pendingOrders, totalRevenue: 0 }
}
