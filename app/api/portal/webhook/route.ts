import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { getPortalConfig } from '@/lib/portal/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = 'Tendencies <orders@mail.tendencies.co.nz>'

function fmt(cents?: number | null) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(
    (cents ?? 0) / 100,
  )
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.PORTAL_STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook configuration.' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig, process.env.PORTAL_STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Portal webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const m = session.metadata ?? {}

  if (m.source !== 'portal') {
    return NextResponse.json({ received: true })
  }

  const config = getPortalConfig(m.portal_slug ?? '')
  if (!config) return NextResponse.json({ received: true })

  const { data: items } = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
  const total = fmt(session.amount_total)

  const itemRows = items
    .map((i) => `  • ${i.description}  ×${i.quantity}  —  ${fmt(i.amount_subtotal)}`)
    .join('\n')

  // ── 1. Customer confirmation
  if (m.email) {
    await resend.emails.send({
      from: FROM,
      to: m.email,
      subject: `Order confirmed — ${config.clientName} Uniform Portal`,
      text: [
        `Hi ${m.customer_name},`,
        '',
        `Your order has been placed through the ${config.clientName} uniform portal.`,
        '',
        'ORDER SUMMARY',
        '─────────────────────────────────────',
        itemRows,
        '─────────────────────────────────────',
        `Total incl. GST: ${total}`,
        '',
        `Delivery: ${m.delivery_label}${m.delivery_address ? `\n  ${m.delivery_address}` : ''}`,
        m.notes ? `\nNotes: ${m.notes}` : '',
        '',
        'Questions? Contact your Tendencies account manager:',
        `${config.contact.manager} — ${config.contact.email}`,
        config.contact.phone ? config.contact.phone : '',
      ]
        .filter((l) => l !== undefined)
        .join('\n'),
    })
  }

  // ── 2. Tendencies internal order notification
  await resend.emails.send({
    from: FROM,
    to: config.emails.internalTo,
    subject: `[Portal] ${config.clientName} — ${m.customer_name} — ${total}`,
    text: [
      'NEW PORTAL ORDER',
      `Portal:    ${config.clientName} (${m.portal_slug})`,
      `Customer:  ${m.customer_name} <${m.email}>`,
      m.phone ? `Phone:     ${m.phone}` : '',
      '',
      'ITEMS:',
      itemRows,
      '',
      `Total:     ${total}`,
      `Delivery:  ${m.delivery_label}`,
      m.delivery_address ? `Address:   ${m.delivery_address}` : '',
      m.notes ? `Notes:     ${m.notes}` : '',
      '',
      `Stripe:    ${session.id}`,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  // ── 3. Client contact copy (if configured)
  if (config.emails.clientTo) {
    await resend.emails.send({
      from: FROM,
      to: config.emails.clientTo,
      subject: `Uniform order received — ${m.customer_name}`,
      text: [
        `A new uniform order has been placed by ${m.customer_name}.`,
        '',
        'ITEMS:',
        itemRows,
        `\nTotal: ${total}`,
        `Delivery: ${m.delivery_label}`,
        '',
        'Your Tendencies account manager will confirm timeline shortly.',
      ].join('\n'),
    })
  }

  // TODO: supplier purchase order automation
  // TODO: decorator branding spec notification

  return NextResponse.json({ received: true })
}
