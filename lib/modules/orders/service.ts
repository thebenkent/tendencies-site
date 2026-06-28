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
