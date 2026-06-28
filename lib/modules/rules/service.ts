import { findAllRules, findRule, upsertRule } from './repository'
import { RULE_DEFAULTS, type CampaignRuleKey, type CampaignRules, type CampaignRuleValue } from './types'

export { RULE_DEFAULTS }
export type { CampaignRuleKey, CampaignRules }

// Loads all rules for a campaign and merges with defaults.
export async function getCampaignRules(campaignId: string): Promise<CampaignRules> {
  const rows = await findAllRules(campaignId)
  const overrides = Object.fromEntries(rows.map((r) => [r.rule_key, r.rule_value]))
  return { ...RULE_DEFAULTS, ...overrides } as CampaignRules
}

// Reads a single rule, falling back to the default if not configured.
export async function getRule<K extends CampaignRuleKey>(
  campaignId: string,
  key: K,
): Promise<CampaignRules[K]> {
  const row = await findRule(campaignId, key)
  if (row?.rule_value !== undefined) return row.rule_value as CampaignRules[K]
  return RULE_DEFAULTS[key]
}

// Sets a rule value for a campaign.
export async function setRule(
  campaignId: string,
  key:        CampaignRuleKey,
  value:      CampaignRuleValue,
): Promise<void> {
  await upsertRule(campaignId, key, value)
}
