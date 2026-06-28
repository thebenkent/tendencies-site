import { getSupabase } from '@/lib/core/database'
import type { CampaignRuleKey, CampaignRuleValue } from './types'

export type RuleRow = {
  id:          string
  campaign_id: string
  rule_key:    string
  rule_value:  CampaignRuleValue
  updated_at:  string
}

export async function findAllRules(campaignId: string): Promise<RuleRow[]> {
  const { data } = await getSupabase()
    .from('merch_campaign_rules')
    .select('*')
    .eq('campaign_id', campaignId)
  return (data ?? []) as RuleRow[]
}

export async function findRule(
  campaignId: string,
  key:        CampaignRuleKey,
): Promise<RuleRow | null> {
  const { data } = await getSupabase()
    .from('merch_campaign_rules')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('rule_key', key)
    .maybeSingle()
  return (data as RuleRow | null) ?? null
}

export async function upsertRule(
  campaignId: string,
  key:        CampaignRuleKey,
  value:      CampaignRuleValue,
): Promise<void> {
  await getSupabase()
    .from('merch_campaign_rules')
    .upsert(
      { campaign_id: campaignId, rule_key: key, rule_value: value, updated_at: new Date().toISOString() },
      { onConflict: 'campaign_id,rule_key' }
    )
}

export async function deleteRule(campaignId: string, key: CampaignRuleKey): Promise<void> {
  await getSupabase()
    .from('merch_campaign_rules')
    .delete()
    .eq('campaign_id', campaignId)
    .eq('rule_key', key)
}
