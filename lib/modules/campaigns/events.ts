export const CAMPAIGN_EVENTS = {
  CLOSED:     'campaign.closed',
  MOQ_MET:    'campaign.moq_met',
  MOQ_FAILED: 'campaign.moq_failed',
} as const

export type CampaignEventType = typeof CAMPAIGN_EVENTS[keyof typeof CAMPAIGN_EVENTS]
