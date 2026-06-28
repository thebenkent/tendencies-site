export type EmailTemplateType =
  | 'order_confirmation'
  | 'order_confirmed'
  | 'payment_request'
  | 'payment_received'
  | 'order_shipped'
  | 'order_completed'
  | 'order_cancelled'
  | 'campaign_closing_soon'
  | 'moq_reached'
  | 'moq_failed'
  | 'admin_new_order'

export type MerchEmailTemplate = {
  id:         string
  tenant_id:  string | null
  type:       EmailTemplateType
  subject:    string
  body_html:  string
  body_text:  string | null
  variables:  Record<string, string>
  enabled:    boolean
  created_at: string
  updated_at: string
}

export type SendEmailInput = {
  to:          string | string[]
  templateKey: EmailTemplateType
  variables:   Record<string, string | number | null>
  tenantId?:   string
}

export type EmailProvider = {
  send(input: SendEmailInput): Promise<void>
}
