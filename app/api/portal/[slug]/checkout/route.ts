import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPortalConfig } from '@/lib/portal/config'
import type { CartItem } from '@/lib/portal/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tendencies.co.nz'

function getAccessCode(slug: string): string | undefined {
  return process.env[`PORTAL_${slug.toUpperCase().replace(/-/g, '_')}_CODE`]
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  // Verify auth via cookie header
  const cookieHeader = req.headers.get('cookie') ?? ''
  const cookieValue = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`ptl_${slug}=`))
    ?.split('=')[1]

  const validCode = getAccessCode(slug)
  if (!validCode || cookieValue !== validCode) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const config = getPortalConfig(slug)
  if (!config) {
    return NextResponse.json({ error: 'Portal not found.' }, { status: 404 })
  }

  const body = await req.json()
  const { items, customerName, customerEmail, customerPhone, deliveryOptionId, notes } = body as {
    items: CartItem[]
    customerName: string
    customerEmail: string
    customerPhone?: string
    deliveryOptionId: string
    notes?: string
  }

  if (!items?.length || !customerName || !customerEmail) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const deliveryOption = config.ordering.deliveryOptions.find((d) => d.id === deliveryOptionId)

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'nzd',
      product_data: {
        name: [
          item.productName,
          item.size !== 'One Size' ? item.size : '',
          item.colour ?? '',
          item.staffName ? `(${item.staffName})` : '',
        ]
          .filter(Boolean)
          .join(' — '),
        metadata: { sku: item.productId, category: item.categoryId },
      },
      unit_amount: item.priceCents,
    },
    quantity: item.quantity,
  }))

  const orderSummary = items
    .map(
      (i) =>
        `${i.productName} ×${i.quantity} ${i.size}${i.colour ? ` / ${i.colour}` : ''}`,
    )
    .join('; ')
    .slice(0, 490)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    customer_email: customerEmail,
    metadata: {
      source: 'portal',
      portal_slug: slug,
      client_name: config.clientName,
      customer_name: customerName,
      email: customerEmail,
      phone: customerPhone ?? '',
      delivery_label: deliveryOption?.label ?? deliveryOptionId,
      delivery_address: deliveryOption?.address ?? '',
      notes: notes ?? '',
      order_summary: orderSummary,
      item_count: String(items.length),
    },
    success_url: `${SITE_URL}/portal/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/portal/${slug}/cart`,
  })

  return NextResponse.json({ url: session.url })
}
