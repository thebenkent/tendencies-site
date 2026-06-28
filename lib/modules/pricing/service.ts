import { findActivePricing } from './repository'
import type { ResolvedPrice } from './types'

// Returns the effective price for a campaign product right now.
// Falls back to the base_price_cents passed in if no pricing row exists.
export async function resolvePrice(
  campaignProductId: string,
  basePriceCents:    number,
  currency:          string = 'NZD',
): Promise<ResolvedPrice> {
  const pricing = await findActivePricing(campaignProductId, currency)

  if (!pricing) {
    return {
      priceCents:     basePriceCents,
      salePriceCents: null,
      currency,
      isOnSale:       false,
      displayCents:   basePriceCents,
    }
  }

  const now   = new Date()
  const isOnSale = pricing.sale_price_cents !== null &&
    (!pricing.effective_from || new Date(pricing.effective_from) <= now) &&
    (!pricing.effective_to   || new Date(pricing.effective_to)   >= now)

  return {
    priceCents:     pricing.price_cents,
    salePriceCents: pricing.sale_price_cents,
    currency:       pricing.currency,
    isOnSale,
    displayCents:   isOnSale ? pricing.sale_price_cents! : pricing.price_cents,
  }
}
