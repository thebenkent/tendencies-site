import Stripe from 'stripe'
import { getSupabase } from '@/lib/core/database'
import { createPayment, findPaymentByOrderId, findPaymentByStripeSession, updatePaymentStatus } from './repository'
import { findOrderById } from '@/lib/modules/orders/repository'
import { sendEmail } from '@/lib/modules/emails/service'
import type { MerchOrderExpanded } from '@/lib/merch/types'


let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    _stripe = new Stripe(key)
  }
  return _stripe
}

// ── Compute order total ────────────────────────────────────────

export function computeOrderTotal(order: MerchOrderExpanded): number {
  return order.merch_order_lines.reduce(
    (sum, line) => sum + line.qty * line.unit_price_cents,
    0,
  )
}

// ── Create checkout session + payment record ───────────────────

export type CreatePaymentLinkInput = {
  orderId:    string
  tenantId:   string
  returnSlug: string  // tenant slug for success/cancel URLs
}

export type CreatePaymentLinkResult = {
  paymentId:   string
  checkoutUrl: string
}

export async function createPaymentLink(
  input: CreatePaymentLinkInput,
): Promise<CreatePaymentLinkResult> {
  const { orderId, tenantId, returnSlug } = input

  const order = await findOrderById(orderId, tenantId)
  if (!order) throw new Error(`Order not found: ${orderId}`)

  const totalCents = computeOrderTotal(order)
  if (totalCents === 0) throw new Error('Order has zero total — cannot create payment link')

  const customer = order.merch_customers
  const baseUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tendencies.co.nz'

  // Build Stripe line items from order lines
  const lineItems = order.merch_order_lines.map((line) => ({
    price_data: {
      currency:     'nzd',
      unit_amount:  line.unit_price_cents,
      product_data: {
        name: `${line.merch_products.name} — ${line.merch_product_variants.size}${
          line.merch_product_variants.colour ? ` / ${line.merch_product_variants.colour}` : ''
        }`,
      },
    },
    quantity: line.qty,
  }))

  const session = await getStripe().checkout.sessions.create({
    mode:           'payment',
    currency:       'nzd',
    line_items:     lineItems,
    customer_email: customer.email,
    metadata: {
      order_id:    orderId,
      tenant_id:   tenantId,
      tenant_slug: returnSlug,
    },
    success_url: `${baseUrl}/merch/${returnSlug}/success?order=${orderId}&paid=1`,
    cancel_url:  `${baseUrl}/merch/${returnSlug}`,
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL')

  // Create payment record
  const payment = await createPayment({
    orderId,
    tenantId,
    customerId:      order.customer_id,
    amountCents:     totalCents,
    currency:        'NZD',
    paymentLink:     session.url,
    stripeSessionId: session.id,
  })

  return { paymentId: payment.id, checkoutUrl: session.url }
}

// ── Refund ─────────────────────────────────────────────────────

export type RefundInput = {
  orderId:     string
  tenantId:    string
  amountCents?: number                     // omit to refund full payment
  reason?:     'duplicate' | 'fraudulent' | 'requested_by_customer'
}

export async function refundPayment(input: RefundInput): Promise<void> {
  const { orderId, tenantId, amountCents, reason } = input

  const payment = await findPaymentByOrderId(orderId)
  if (!payment) throw new Error(`No payment record found for order: ${orderId}`)
  if (payment.tenant_id !== tenantId) throw new Error('Payment/tenant mismatch')
  if (payment.status !== 'succeeded') throw new Error(`Cannot refund — payment status is ${payment.status}`)
  if (!payment.stripe_session_id && !payment.stripe_payment_intent_id) {
    throw new Error('No Stripe session or payment intent to refund against')
  }

  // Resolve the payment intent ID (needed for refunds API)
  let paymentIntentId = payment.stripe_payment_intent_id
  if (!paymentIntentId && payment.stripe_session_id) {
    const session      = await getStripe().checkout.sessions.retrieve(payment.stripe_session_id)
    paymentIntentId    = session.payment_intent as string | null
  }
  if (!paymentIntentId) throw new Error('Could not resolve Stripe payment intent ID')

  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  }
  if (amountCents) refundParams.amount = amountCents
  if (reason)      refundParams.reason = reason

  await getStripe().refunds.create(refundParams)
  await updatePaymentStatus(payment.id, 'refunded')
}

// ── Handle Stripe webhook event ────────────────────────────────

export async function handleStripeWebhook(rawBody: string, signature: string): Promise<void> {
  const webhookSecret = process.env.STRIPE_MERCH_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) throw new Error('STRIPE_MERCH_WEBHOOK_SECRET is not configured')

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    throw new Error(`Stripe webhook verification failed: ${(err as Error).message}`)
  }

  if (event.type !== 'checkout.session.completed') return

  const session = event.data.object as Stripe.Checkout.Session
  const metadata = session.metadata ?? {}
  const orderId  = metadata.order_id
  const tenantId = metadata.tenant_id

  if (!orderId || !tenantId) {
    // Not a merch platform order (could be legacy teamwear) — skip silently
    return
  }

  // Mark payment as succeeded
  const payment = await findPaymentByStripeSession(session.id)
  if (payment) {
    await updatePaymentStatus(payment.id, 'succeeded', new Date().toISOString())
  }

  // Transition order to 'paid' via workflow engine
  const order = await findOrderById(orderId, tenantId)
  if (!order) {
    console.error(`[StripeWebhook] order not found: ${orderId}`)
    return
  }

  const { data: campaign } = await getSupabase()
    .from('merch_campaigns')
    .select('workflow_id')
    .eq('id', order.campaign_id)
    .single()
  const workflowId = (campaign as any)?.workflow_id as string | null

  try {
    if (workflowId) {
      const { executeTransition } = await import('@/lib/modules/workflows/service')
      await executeTransition(orderId, tenantId, workflowId, order.status, 'paid', 'stripe')
    } else {
      const { updateOrderStatus } = await import('@/lib/modules/orders/repository')
      await updateOrderStatus(orderId, tenantId, 'paid', 'stripe')
    }
  } catch (err) {
    console.error(`[StripeWebhook] transition to paid failed for ${orderId}:`, err)
  }

  // Send payment confirmation email to customer
  const amountTotal = session.amount_total
  await sendEmail({
    to:          order.merch_customers.email,
    templateKey: 'payment_received',
    tenantId,
    variables: {
      customer_first_name: order.merch_customers.first_name,
      order_id:            orderId,
      amount:              amountTotal ? `$${(amountTotal / 100).toFixed(2)}` : 'NZD',
    },
  }).catch((err) => console.error('[StripeWebhook] confirmation email failed:', err))
}
