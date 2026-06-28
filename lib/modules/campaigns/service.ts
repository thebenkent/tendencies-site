import { getSupabase } from '@/lib/core/database'
import { findProductsByCampaign } from '@/lib/modules/products/repository'
import { findOrdersByCampaignProduct, updateOrdersStatus, appendOrderEvent } from '@/lib/modules/orders/repository'
import { getRule } from '@/lib/modules/rules/service'
import { eventBus } from '@/lib/core/events'
import { CAMPAIGN_EVENTS } from './events'
import { updateCampaignStatus } from './repository'

type MOQResult = {
  productId:   string
  productName: string
  orderedQty:  number
  minimumQty:  number
  moqMet:      boolean
  confirmed:   number
  cancelled:   number
}

type CloseCampaignResult = {
  campaignId: string
  moqResults: MOQResult[]
}

export async function closeCampaign(
  campaignId: string,
  tenantId:   string,
): Promise<CloseCampaignResult> {
  const products = await findProductsByCampaign(campaignId)
  const moqResults: MOQResult[] = []

  // Check if MOQ lock behaviour is enabled for this campaign
  const moqLockEnabled = await getRule(campaignId, 'moq_lock_on_close')

  for (const product of products) {
    const reservedLines = await findOrdersByCampaignProduct(product.id, tenantId, 'reserved')
    const orderIds = [...new Set(reservedLines.map((l) => l.order_id))]

    const { data: qtyData } = await getSupabase().rpc('merch_product_order_qty', {
      p_campaign_product_id: product.id,
      p_statuses:            ['reserved'],
    })
    const orderedQty = (qtyData as number | null) ?? 0
    const moqMet     = orderedQty >= product.minimum_qty

    if (orderIds.length > 0) {
      // If moqLockEnabled: confirm on MOQ met, cancel on failure.
      // If not: confirm everything regardless of MOQ.
      const newStatus = moqLockEnabled
        ? (moqMet ? 'confirmed' : 'cancelled')
        : 'confirmed'
      await updateOrdersStatus(orderIds, tenantId, newStatus, 'system')
      await Promise.all(
        orderIds.map((id) =>
          appendOrderEvent(id, tenantId, 'campaign_closed', 'system', {
            moqMet, newStatus, productId: product.id, moqLockEnabled,
          })
        )
      )
    }

    // Emit per-product MOQ events
    await eventBus.emit(moqMet ? CAMPAIGN_EVENTS.MOQ_MET : CAMPAIGN_EVENTS.MOQ_FAILED, {
      tenantId,
      campaignId,
      payload: { productId: product.id, orderedQty, minimumQty: product.minimum_qty },
    })

    moqResults.push({
      productId:   product.id,
      productName: product.name,
      orderedQty,
      minimumQty:  product.minimum_qty,
      moqMet,
      confirmed:   (moqLockEnabled ? moqMet : true) ? orderIds.length : 0,
      cancelled:   (moqLockEnabled && !moqMet) ? orderIds.length : 0,
    })
  }

  await updateCampaignStatus(campaignId, tenantId, 'closed')

  await eventBus.emit(CAMPAIGN_EVENTS.CLOSED, {
    tenantId,
    campaignId,
    payload: { moqResults },
  })

  return { campaignId, moqResults }
}
