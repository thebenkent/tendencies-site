import { findEmailTemplate } from './repository'
import type { EmailTemplateType, SendEmailInput } from './types'

export type { EmailTemplateType, SendEmailInput }

// ── Provider interface ────────────────────────────────────────

export type RenderedEmail = {
  to:      string | string[]
  subject: string
  html:    string
  text?:   string
}

export interface EmailDispatcher {
  send(email: RenderedEmail): Promise<void>
}

let _dispatcher: EmailDispatcher | null = null

export function configureEmailProvider(dispatcher: EmailDispatcher): void {
  _dispatcher = dispatcher
}

// Auto-configure Resend if RESEND_API_KEY is present and no provider is set.
async function getDispatcher(): Promise<EmailDispatcher | null> {
  if (_dispatcher) return _dispatcher
  if (!process.env.RESEND_API_KEY) return null
  const { ResendDispatcher } = await import('./providers/resend')
  _dispatcher = new ResendDispatcher()
  return _dispatcher
}

// ── Template interpolation ─────────────────────────────────────

function interpolate(template: string, vars: Record<string, string | number | null>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = vars[key]
    return val == null ? '' : String(val)
  })
}

// ── sendEmail ─────────────────────────────────────────────────

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const dispatcher = await getDispatcher()
  if (!dispatcher) {
    console.log(`[EmailService] no provider — skipping ${input.templateKey} to`, input.to)
    return
  }

  const template = await findEmailTemplate(input.templateKey as EmailTemplateType, input.tenantId)
  if (!template) {
    console.warn(`[EmailService] no template: ${input.templateKey} (tenant: ${input.tenantId ?? 'global'})`)
    return
  }
  if (!template.enabled) return

  const vars    = Object.fromEntries(Object.entries(input.variables).map(([k, v]) => [k, v ?? '']))
  const subject = interpolate(template.subject,   vars)
  const html    = interpolate(template.body_html, vars)
  const text    = template.body_text ? interpolate(template.body_text, vars) : undefined

  await dispatcher.send({ to: input.to, subject, html, text })
  console.log(`[EmailService] sent ${input.templateKey} →`, Array.isArray(input.to) ? input.to.join(', ') : input.to)
}

// ── sendRawEmail ───────────────────────────────────────────────
// Bypass template lookup — send pre-rendered HTML directly.

export async function sendRawEmail(email: RenderedEmail): Promise<void> {
  const dispatcher = await getDispatcher()
  if (!dispatcher) {
    console.log(`[EmailService] no provider — skipping raw email to`, email.to)
    return
  }
  await dispatcher.send(email)
}
