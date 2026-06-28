// Campaign-level configurable behaviour rules.
// Rules live in merch_campaign_rules table as (campaign_id, rule_key, rule_value).
// If a rule has no row the RULE_DEFAULTS are used, making rules purely additive.

export type CampaignRuleKey =
  | 'minimum_qty_enabled'   // boolean — enforce MOQ before confirming orders
  | 'payment_timing'        // 'immediate' | 'after_moq' | 'manual'
  | 'approval_required'     // boolean — orders need admin approval before proceeding
  | 'delivery_modes'        // string[] — ['collect', 'courier']
  | 'countdown_enabled'     // boolean — show countdown timer on campaign pages
  | 'inventory_mode'        // 'tracked' | 'unlimited'
  | 'allow_backorders'      // boolean
  | 'shipping_enabled'      // boolean
  | 'collection_enabled'    // boolean
  | 'moq_lock_on_close'     // boolean — automatically cancel orders that miss MOQ on campaign close

export type CampaignRuleValue = boolean | string | string[] | number

export type CampaignRules = {
  minimum_qty_enabled: boolean
  payment_timing:      'immediate' | 'after_moq' | 'manual'
  approval_required:   boolean
  delivery_modes:      string[]
  countdown_enabled:   boolean
  inventory_mode:      'tracked' | 'unlimited'
  allow_backorders:    boolean
  shipping_enabled:    boolean
  collection_enabled:  boolean
  moq_lock_on_close:   boolean
}

export const RULE_DEFAULTS: CampaignRules = {
  minimum_qty_enabled: true,
  payment_timing:      'after_moq',
  approval_required:   false,
  delivery_modes:      ['collect', 'courier'],
  countdown_enabled:   true,
  inventory_mode:      'unlimited',
  allow_backorders:    true,
  shipping_enabled:    true,
  collection_enabled:  true,
  moq_lock_on_close:   true,
}
