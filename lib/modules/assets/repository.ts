import { getSupabase } from '@/lib/core/database'
import type { MerchAsset } from '@/lib/merch/types'
import type { CreateAssetInput } from './types'

export type { CreateAssetInput }

export async function findAssetsByCampaignProduct(campaignProductId: string): Promise<MerchAsset[]> {
  const { data } = await getSupabase()
    .from('merch_assets')
    .select('*')
    .eq('campaign_product_id', campaignProductId)
    .order('sort_order')
  return (data ?? []) as MerchAsset[]
}

export async function findAssetsByMasterProduct(masterProductId: string): Promise<MerchAsset[]> {
  const { data } = await getSupabase()
    .from('merch_assets')
    .select('*')
    .eq('master_product_id', masterProductId)
    .order('sort_order')
  return (data ?? []) as MerchAsset[]
}

export async function createAsset(input: CreateAssetInput): Promise<MerchAsset> {
  const { data, error } = await getSupabase()
    .from('merch_assets')
    .insert({
      tenant_id:           input.tenantId           ?? null,
      master_product_id:   input.masterProductId    ?? null,
      campaign_product_id: input.campaignProductId  ?? null,
      variant_id:          input.variantId          ?? null,
      type:                input.type,
      url:                 input.url,
      alt_text:            input.altText            ?? null,
      sort_order:          input.sortOrder          ?? 0,
    })
    .select()
    .single()
  if (error) throw new Error(`createAsset failed: ${error.message}`)
  return data as MerchAsset
}

export async function deleteAsset(assetId: string): Promise<void> {
  await getSupabase().from('merch_assets').delete().eq('id', assetId)
}

export async function reorderAssets(
  campaignProductId: string,
  orderedIds: string[],
): Promise<void> {
  await Promise.all(
    orderedIds.map((id, idx) =>
      getSupabase()
        .from('merch_assets')
        .update({ sort_order: idx })
        .eq('id', id)
        .eq('campaign_product_id', campaignProductId)
    )
  )
}
