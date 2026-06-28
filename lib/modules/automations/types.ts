// Automation engine types.
// Automations are triggered by domain event names (e.g. 'order.created').
// Each automation has ordered steps that execute sequentially.

export type AutomationActionType =
  | 'send_email'        // send template email to customer or admin
  | 'append_event'      // write to merch_order_events
  | 'notify_admin'      // future: Slack / push notification
  | 'create_stripe_session'  // future: Stripe payment link
  | 'webhook'           // future: call external HTTP endpoint
  | 'update_order_field'  // set a field on the order

export type MerchAutomation = {
  id:            string
  tenant_id:     string
  campaign_id:   string | null
  trigger_event: string
  name:          string
  active:        boolean
  created_at:    string
}

export type MerchAutomationStep = {
  id:            string
  automation_id: string
  step_order:    number
  action_type:   AutomationActionType
  config:        Record<string, unknown>
  created_at:    string
}
