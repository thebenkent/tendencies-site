import { NextResponse } from 'next/server'
import { handleStripeWebhook } from '@/lib/modules/payments/stripe'

// Must disable body parsing — Stripe needs the raw body for signature verification
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let rawBody: string
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read body' }, { status: 400 })
  }

  try {
    await handleStripeWebhook(rawBody, signature)
    return NextResponse.json({ received: true })
  } catch (err) {
    const message = (err as Error).message
    console.error('[MerchStripeWebhook] error:', message)

    // Return 400 for signature verification failures (tells Stripe not to retry)
    if (message.includes('verification failed')) {
      return NextResponse.json({ error: message }, { status: 400 })
    }
    // Return 200 for downstream failures — let Stripe retry is not helpful here
    return NextResponse.json({ received: true, warning: message })
  }
}
