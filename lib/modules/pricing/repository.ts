import { getSupabase } from '@/lib/core/database'
import type { MerchPricing } from './types'

// Returns the most-specific active price for a campaign product at a given point in time.
export async function findActivePricing(
  campaignProductId: string,
  currency:          string = 'NZD',
  at:                Date   = new Date(),
): Promise<MerchPricing | null> {
  const iso = at.toISOString()

  const { data } = await getSupabase()
    .from('merch_pricing')
    .select('*')
    .eq('campaign_product_id', campaignProductId)
    .eq('currency', currency)
    .or(`effective_from.is.null,effective_from.lte.${iso}`)
    .or(`effective_to.is.null,effective_to.gte.${iso}`)
    .order('effective_from', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (data as MerchPricing | null) ?? null
}

export async function upsertPricing(
  campaignProductId: string,
  input: {
    currency?:        string
    priceCents:       number
    salePriceCents?:  number | null
    effectiveFrom?:   string | null
    effectiveTo?:     string | null
  },
): Promise<MerchPricing> {
  const { data, error } = await getSupabase()
    .from('merch_pricing')
    .insert({
      campaign_product_id: campaignProductId,
      currency:            input.currency        ?? 'NZD',
      price_cents:         input.priceCents,
      sale_price_cents:    input.salePriceCents  ?? null,
      effective_from:      input.effectiveFrom   ?? null,
      effective_to:        input.effectiveTo     ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(`upsertPricing failed: ${error.message}`)
  return data as MerchPricing
}
