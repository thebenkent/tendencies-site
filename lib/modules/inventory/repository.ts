import { getSupabase } from '@/lib/core/database'
import type { MerchInventoryEvent, InventoryEventType, VariantInventoryPosition } from './types'

// ── Read ─────────────────────────────────────────────────────

export async function getVariantInventory(variantId: string): Promise<VariantInventoryPosition | null> {
  const { data } = await getSupabase()
    .from('merch_variant_inventory')
    .select('*')
    .eq('variant_id', variantId)
    .maybeSingle()
  return (data as VariantInventoryPosition | null) ?? null
}

export async function getInventoryByCampaignProduct(
  campaignProductId: string,
): Promise<VariantInventoryPosition[]> {
  const { data } = await getSupabase()
    .from('merch_variant_inventory')
    .select('*')
    .eq('campaign_product_id', campaignProductId)
  return (data ?? []) as VariantInventoryPosition[]
}

// ── Atomic stock operations (backed by DB functions in migration 005) ──

export async function reserveStock(
  variantId: string,
  tenantId:  string,
  orderId:   string,
  qty:       number,
  actor?:    string,
): Promise<void> {
  const { error } = await getSupabase().rpc('merch_reserve_stock', {
    p_variant_id: variantId,
    p_qty:        qty,
  })
  if (error) throw new Error(error.message)

  await appendInventoryEvent({ variantId, tenantId, orderId, eventType: 'allocate', delta: -qty, actor })
}

export async function releaseStock(
  variantId: string,
  tenantId:  string,
  orderId:   string,
  qty:       number,
  actor?:    string,
): Promise<void> {
  const { error } = await getSupabase().rpc('merch_release_stock', {
    p_variant_id: variantId,
    p_qty:        qty,
  })
  if (error) throw new Error(error.message)

  await appendInventoryEvent({ variantId, tenantId, orderId, eventType: 'release', delta: qty, actor })
}

export async function adjustStock(
  variantId: string,
  tenantId:  string,
  delta:     number,
  notes:     string,
  actor?:    string,
): Promise<void> {
  const { error } = await getSupabase().rpc('merch_adjust_stock', {
    p_variant_id: variantId,
    p_delta:      delta,
  })
  if (error) throw new Error(error.message)

  const eventType: InventoryEventType = delta > 0 ? 'receive' : 'write_off'
  await appendInventoryEvent({ variantId, tenantId, orderId: null, eventType, delta, notes, actor })
}

// ── Event log ─────────────────────────────────────────────────

async function appendInventoryEvent(input: {
  variantId:  string
  tenantId:   string
  orderId:    string | null
  eventType:  InventoryEventType
  delta:      number
  notes?:     string
  actor?:     string
}): Promise<MerchInventoryEvent> {
  const { data, error } = await getSupabase()
    .from('merch_inventory_events')
    .insert({
      variant_id:  input.variantId,
      tenant_id:   input.tenantId,
      order_id:    input.orderId,
      event_type:  input.eventType,
      delta:       input.delta,
      notes:       input.notes  ?? null,
      actor:       input.actor  ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(`Inventory event log failed: ${error.message}`)
  return data as MerchInventoryEvent
}

export async function getInventoryHistory(
  variantId: string,
  limit = 50,
): Promise<MerchInventoryEvent[]> {
  const { data } = await getSupabase()
    .from('merch_inventory_events')
    .select('*')
    .eq('variant_id', variantId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as MerchInventoryEvent[]
}
