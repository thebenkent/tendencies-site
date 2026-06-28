import { z } from 'zod/v4'
import { slugSchema, uuidSchema } from '@/lib/core/validation'

export const closeCampaignSchema = z.object({
  campaign_slug: slugSchema,
})

export const campaignRuleSchema = z.object({
  campaign_id: uuidSchema,
  rule_key:    z.string().min(1),
  rule_value:  z.unknown(),
})
