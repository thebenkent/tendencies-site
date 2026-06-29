import { getSupabase } from '@/lib/core/database'
import type { MerchCampaign, MerchCollection, MerchCampaignBanner } from '@/lib/merch/types'

export async function findCampaignsByTenant(
  tenantId: string
): Promise<MerchCampaign[]> {
  const { data, error } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) return []

  return (data ?? []) as MerchCampaign[]
}

export async function findCampaignBySlug(
  tenantId: string,
  slug: string
): Promise<MerchCampaign | null> {
  const { data, error } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null

  return data as MerchCampaign
}

export async function findCampaignById(
  campaignId: string
): Promise<MerchCampaign | null> {
  const { data, error } = await getSupabase()
    .from('merch_campaigns')
    .select('*')
    .eq('id', campaignId)
    .maybeSingle()

  if (error || !data) return null

  return data as MerchCampaign
}

export async function findCollectionBySlug(
  campaignId: string,
  slug: string,
): Promise<MerchCollection | null> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('slug', slug)
    .eq('visible', true)
    .maybeSingle()
  return data ? (data as MerchCollection) : null
}

export async function findCollectionsByCampaign(
  campaignId: string
): Promise<MerchCollection[]> {
  const { data } = await getSupabase()
    .from('merch_collections')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('visible', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as MerchCollection[]
}

export async function findBannersByCampaign(
  campaignId: string
): Promise<MerchCampaignBanner[]> {
  const now = new Date().toISOString()
  const { data } = await getSupabase()
    .from('merch_campaign_banners')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('active', true)
    .order('sort_order', { ascending: true })
  // Apply time bounds in JS — PostgREST filter on nullable timestamps is verbose
  return ((data ?? []) as MerchCampaignBanner[]).filter(
    (b) => (!b.starts_at || b.starts_at <= now) && (!b.ends_at || b.ends_at > now)
  )
}

export async function updateCampaignStatus(
  campaignId: string,
  tenantId: string,
  status: string
): Promise<void> {
  const { error } = await getSupabase()
    .from('merch_campaigns')
    .update({ status })
    .eq('id', campaignId)
    .eq('tenant_id', tenantId)

  if (error) throw error
}
