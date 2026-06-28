import { getSupabase } from '@/lib/core/database'
import type { MerchCampaign } from '@/lib/merch/types'

export async function findCampaignsByTenant(tenantId: string): Promise<MerchCampaign[]> {
  const { data } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
  return (data ?? []) as MerchCampaign[]
}

export async function findCampaignBySlug(tenantId: string, slug: string): Promise<MerchCampaign | null> {
  const { data, error } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return data as MerchCampaign
}

export async function findCampaignById(campaignId: string): Promise<MerchCampaign | null> {
  const { data, error } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()
  if (error || !data) return null
  return data as MerchCampaign
}

export async function updateCampaignStatus(
  campaignId: string,
  tenantId:   string,
  status:     string,
): Promise<void> {
  await getSupabase()
    .from('merch_campaigns')
    .update({ status })
    .eq('id', campaignId)
    .eq('tenant_id', tenantId)
}
