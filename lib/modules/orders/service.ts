import { upsertCustomer, type UpsertCustomerInput } from '@/lib/modules/customers/repository'
import { createOrder, createOrderLine, appendOrderEvent } from './repository'
import { findVariantById } from '@/lib/modules/products/repository'
import { findInitialState } from '@/lib/modules/workflows/repository'
import { checkStock, allocateStock } from '@/lib/modules/inventory/service'
import { getSupabase } from '@/lib/core/database'
import { eventBus } from '@/lib/core/events'
import { ORDER_EVENTS } from './events'
import type { MerchOrder } from '@/lib/merch/types'

export type PlaceOrderInput = {
  tenantId:         string
  campaignId:       string
  productSlug:      string
  variantId:        string
  qty:              number
  playerName?:      string
  deliveryMethod:   string
  deliveryAddress?: string
  notes?:           string
  customer:         UpsertCustomerInput
}

export type PlaceOrderResult = {
  order:  MerchOrder
  lineId: string
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const {
    tenantId, campaignId, productSlug, variantId, qty,
    playerName, deliveryMethod, deliveryAddress, notes, customer,
  } = input

  // 1. Resolve campaign product ID from slug + campaign
  const { data: cp, error: cpErr } = await getSupabase()
    .from('merch_campaign_products')
    .select('id, price_cents')
    .eq('campaign_id', campaignId)
    .eq('slug', productSlug)
    .single()
  if (cpErr || !cp) throw new Error(`Product not found: ${productSlug}`)

  // 2. Verify variant belongs to this product
  const variant = await findVariantById(variantId)
  if (!variant || variant.campaign_product_id !== (cp as any).id) {
    throw new Error('Invalid variant for this product')
  }

  // 2b. Check stock availability (NULL stock_qty = unlimited/made-to-order)
  const stockCheck = await checkStock(variantId, qty)
  if (!stockCheck.available) {
    throw new Error(stockCheck.reason ?? 'Insufficient stock')
  }

  // 3. Upsert customer
  const customerRecord = await upsertCustomer(customer)

  // 4. Resolve initial workflow state for this campaign
  const { data: campaign } = await getSupabase()
    .from('merch_campaigns')
    .select('workflow_id')
    .eq('id', campaignId)
    .single()
  const workflowId    = (campaign as any)?.workflow_id as string | null
  const initialStatus = workflowId ? await findInitialState(workflowId) : 'reserved'

  // 5. Create order
  const order = await createOrder({
    tenantId,
    campaignId,
    customerId:     customerRecord.id,
    deliveryMethod,
    deliveryAddress,
    notes,
    initialStatus,
  })

  // 6. Create order line — resolve effective price (handles time-bounded sale prices)
  const { resolvePrice } = await import('@/lib/modules/pricing/service')
  const resolved       = await resolvePrice((cp as any).id, (cp as any).price_cents)
  const unitPriceCents = resolved.displayCents + variant.additional_cost_cents
  let line
  try {
    line = await createOrderLine({
      orderId:           order.id,
      campaignProductId: (cp as any).id,
      variantId:         variant.id,
      qty,
      unitPriceCents,
      playerName,
    })
  } catch (err) {
    // Best-effort cleanup: remove the orderless header row so it doesn't appear as a ghost in the dashboard.
    await getSupabase()
      .from('merch_orders')
      .delete()
      .eq('id', order.id)
      .eq('tenant_id', tenantId)
    throw err
  }

  // 7. Reserve stock (fire-and-forget for unlimited/null stock; throws for finite stock)
  await allocateStock(variant.id, tenantId, order.id, qty)
    .catch((err) => console.error('[placeOrder] stock allocation failed (non-fatal):', err))

  // 8. Append audit event + emit domain event
  await appendOrderEvent(order.id, tenantId, 'order.created', 'customer', {
    productSlug, variantId, qty, unitPriceCents,
  })

  await eventBus.emit(ORDER_EVENTS.CREATED, {
    tenantId,
    campaignId,
    orderId: order.id,
    payload: { productSlug, variantId, qty, unitPriceCents, status: order.status },
  })

  return { order, lineId: line.id }
}

// ── Cart Order (multi-product) ────────────────────────────────

export type CartOrderItem = {
  productSlug: string
  variantId:   string
  qty:         number
  playerName?: string
}

export type PlaceCartOrderInput = {
  tenantId:         string
  campaignId:       string
  items:            CartOrderItem[]   // one or more products from the cart
  deliveryMethod:   string
  deliveryAddress?: string
  notes?:           string
  questionAnswers?: Record<string, string>
  customer:         UpsertCustomerInput
}

export async function placeCartOrder(input: PlaceCartOrderInput): Promise<PlaceOrderResult> {
  const {
    tenantId, campaignId, items, deliveryMethod, deliveryAddress,
    notes, questionAnswers, customer,
  } = input

  if (items.length === 0) throw new Error('Cart is empty')

  // 1. Upsert customer
  const customerRecord = await upsertCustomer(customer)

  // 2. Resolve initial workflow state once (same for all lines)
  const { data: campaignRow } = await getSupabase()
    .from('merch_campaigns')
    .select('workflow_id')
    .eq('id', campaignId)
    .single()
  const workflowId    = (campaignRow as any)?.workflow_id as string | null
  const initialStatus = workflowId ? await findInitialState(workflowId) : 'reserved'

  // 3. Create one order for all items
  const order = await createOrder({
    tenantId,
    campaignId,
    customerId:      customerRecord.id,
    deliveryMethod,
    deliveryAddress,
    notes,
    initialStatus,
    questionAnswers,
  })

  const lineIds: string[] = []

  try {
    const { resolvePrice } = await import('@/lib/modules/pricing/service')

    for (const item of items) {
      // 4a. Resolve campaign product
      const { data: cp, error: cpErr } = await getSupabase()
        .from('merch_campaign_products')
        .select('id, price_cents')
        .eq('campaign_id', campaignId)
        .eq('slug', item.productSlug)
        .single()
      if (cpErr || !cp) throw new Error(`Product not found: ${item.productSlug}`)

      // 4b. Verify variant belongs to this product
      const variant = await findVariantById(item.variantId)
      if (!variant || variant.campaign_product_id !== (cp as any).id) {
        throw new Error(`Invalid variant for product: ${item.productSlug}`)
      }

      // 4c. Check stock
      const stockCheck = await checkStock(item.variantId, item.qty)
      if (!stockCheck.available) {
        throw new Error(stockCheck.reason ?? `Insufficient stock for ${item.productSlug}`)
      }

      // 4d. Resolve price
      const resolved       = await resolvePrice((cp as any).id, (cp as any).price_cents)
      const unitPriceCents = resolved.displayCents + variant.additional_cost_cents

      // 4e. Create order line
      const line = await createOrderLine({
        orderId:           order.id,
        campaignProductId: (cp as any).id,
        variantId:         variant.id,
        qty:               item.qty,
        unitPriceCents,
        playerName:        item.playerName,
      })
      lineIds.push(line.id)

      // 4f. Allocate stock (non-fatal for unlimited/null stock)
      await allocateStock(variant.id, tenantId, order.id, item.qty)
        .catch((err) => console.error('[placeCartOrder] stock allocation failed (non-fatal):', err))
    }
  } catch (err) {
    // Clean up the order so it doesn't appear as a ghost in the dashboard
    await getSupabase()
      .from('merch_orders')
      .delete()
      .eq('id', order.id)
      .eq('tenant_id', tenantId)
    throw err
  }

  // 5. Audit event + domain event
  await appendOrderEvent(order.id, tenantId, 'order.created', 'customer', {
    itemCount: items.length,
    lineIds,
  })

  await eventBus.emit(ORDER_EVENTS.CREATED, {
    tenantId,
    campaignId,
    orderId:  order.id,
    payload:  { itemCount: items.length, status: order.status },
  })

  return { order, lineId: lineIds[0] }
}
