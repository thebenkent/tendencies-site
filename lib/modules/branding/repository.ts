import { getSupabase } from '@/lib/core/database'
import type { MerchBranding } from '@/lib/merch/types'
import type { MerchCampaignBranding, ResolvedBranding } from './types'

export type { MerchCampaignBranding, ResolvedBranding }

export async function findTenantBranding(tenantId: string): Promise<MerchBranding | null> {
  const { data } = await getSupabase()
    .from('merch_branding')
    .select('*')
    .eq('tenant_id', tenantId)
    .single()
  return (data as MerchBranding | null) ?? null
}

export async function findCampaignBranding(campaignId: string): Promise<MerchCampaignBranding | null> {
  const { data } = await getSupabase()
    .from('merch_campaign_branding')
    .select('*')
    .eq('campaign_id', campaignId)
    .single()
  return (data as MerchCampaignBranding | null) ?? null
}

export async function upsertTenantBranding(
  tenantId: string,
  patch: Partial<Omit<MerchBranding, 'id' | 'tenant_id' | 'updated_at'>>,
): Promise<void> {
  await getSupabase()
    .from('merch_branding')
    .upsert({ tenant_id: tenantId, ...patch, updated_at: new Date().toISOString() })
}

export async function upsertCampaignBranding(
  campaignId: string,
  patch: Partial<Omit<MerchCampaignBranding, 'campaign_id' | 'updated_at'>>,
): Promise<void> {
  await getSupabase()
    .from('merch_campaign_branding')
    .upsert({ campaign_id: campaignId, ...patch, updated_at: new Date().toISOString() })
}
