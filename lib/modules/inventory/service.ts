import { getVariantInventory, reserveStock, releaseStock } from './repository'
import type { StockCheckResult } from './types'

// ── Stock check (pre-order validation) ─────────────────────────

export async function checkStock(variantId: string, qty: number): Promise<StockCheckResult> {
  const inv = await getVariantInventory(variantId)
  if (!inv) {
    // Variant not found in inventory view — allow (variant may not yet have inventory record)
    return { available: true }
  }

  // NULL stock_qty = unlimited (reservation-based, made-to-order)
  if (inv.stock_qty === null) {
    return { available: true, stock_available: null }
  }

  if (inv.stock_available !== null && inv.stock_available < qty) {
    return {
      available:       false,
      reason:          `Only ${inv.stock_available} units available`,
      stock_available: inv.stock_available,
    }
  }

  return { available: true, stock_available: inv.stock_available }
}

// ── Allocate stock on order creation ───────────────────────────

export async function allocateStock(
  variantId: string,
  tenantId:  string,
  orderId:   string,
  qty:       number,
): Promise<void> {
  await reserveStock(variantId, tenantId, orderId, qty, 'order.created')
}

// ── Release stock on order cancellation ────────────────────────

export async function deallocateStock(
  variantId: string,
  tenantId:  string,
  orderId:   string,
  qty:       number,
  actor?:    string,
): Promise<void> {
  await releaseStock(variantId, tenantId, orderId, qty, actor ?? 'order.cancelled')
}

export { getVariantInventory, getInventoryByCampaignProduct, adjustStock, getInventoryHistory } from './repository'
