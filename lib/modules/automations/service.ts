import { eventBus } from '@/lib/core/events'
import { findAutomationsByEvent, findStepsByAutomation } from './repository'
import { appendOrderEvent } from '@/lib/modules/orders/repository'
import type { MerchAutomationStep } from './types'

export type AutomationContext = {
  tenantId:   string
  campaignId?: string
  orderId?:   string
  payload:    Record<string, unknown>
}

// Register the automation engine as an event bus subscriber.
// Call this once at module init (e.g. in the API route or service layer).
export function registerAutomationSubscriber(): void {
  eventBus.on('*', async (event) => {
    await trigger(event.type, {
      tenantId:   event.tenantId,
      campaignId: event.campaignId,
      orderId:    event.orderId,
      payload:    event.payload,
    }).catch((err) => {
      console.error('[AutomationService] error processing event', event.type, err)
    })
  })
}

// Finds and executes all automations registered for a given event.
export async function trigger(eventType: string, ctx: AutomationContext): Promise<void> {
  const automations = await findAutomationsByEvent(ctx.tenantId, eventType, ctx.campaignId)
  for (const automation of automations) {
    const steps = await findStepsByAutomation(automation.id)
    for (const step of steps) {
      await executeStep(step, ctx).catch((err) => {
        console.error(`[AutomationService] step ${step.id} (${step.action_type}) failed:`, err)
      })
    }
  }
}

async function executeStep(step: MerchAutomationStep, ctx: AutomationContext): Promise<void> {
  switch (step.action_type) {
    case 'append_event':
      if (ctx.orderId) {
        await appendOrderEvent(
          ctx.orderId,
          ctx.tenantId,
          (step.config.event_type as string) ?? 'automation.step',
          'automation',
          { ...ctx.payload, ...step.config },
        )
      }
      break

    case 'send_email':
      // Stub: email sending requires an email provider (SendGrid, Resend, etc.).
      // The template key is in step.config.template_key.
      // When email provider is configured, look up merch_email_templates and send.
      console.log('[AutomationService] send_email stub — template:', step.config.template_key, 'ctx:', ctx.tenantId)
      break

    case 'notify_admin':
      // Stub: in-app or Slack notification.
      console.log('[AutomationService] notify_admin stub — message:', step.config.message)
      break

    case 'webhook':
      // Stub: call external webhook URL.
      console.log('[AutomationService] webhook stub — url:', step.config.url)
      break

    case 'create_stripe_session':
      // Stub: requires Stripe key and order total.
      console.log('[AutomationService] create_stripe_session stub')
      break

    case 'update_order_field':
      // Stub: requires order update logic.
      break

    default:
      console.warn('[AutomationService] unknown action_type:', (step as any).action_type)
  }
}
