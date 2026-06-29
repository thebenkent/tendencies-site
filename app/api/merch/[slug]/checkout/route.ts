import { NextResponse } from 'next/server'
import { getTenant, getCampaign } from '@/lib/merch/db'
import { placeCartOrder } from '@/lib/modules/orders/service'
import { checkoutSchema } from '@/lib/modules/orders/validators'
import { sendRawEmail } from '@/lib/modules/emails/service'
import { getSupabase } from '@/lib/core/database'
import { checkRateLimit, getRateLimitIp } from '@/lib/core/rate-limit'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = getRateLimitIp(req)
  const rl = checkRateLimit(ip)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes before trying again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  const { slug } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 })
  }

  const d = parsed.data

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return NextResponse.json({ error: 'Portal not found' }, { status: 404 })

  const campaign = await getCampaign(tenant.id, d.campaign_slug).catch(() => null)
  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

  if (!['open', 'closing_soon'].includes(campaign.status)) {
    return NextResponse.json({ error: 'This campaign is not currently accepting orders' }, { status: 409 })
  }
  if (campaign.closes_at && new Date(campaign.closes_at) < new Date()) {
    return NextResponse.json({ error: 'This campaign has closed' }, { status: 409 })
  }

  let result
  try {
    result = await placeCartOrder({
      tenantId:         tenant.id,
      campaignId:       campaign.id,
      items:            d.items.map((item) => ({
        productSlug:  item.product_slug,
        variantId:    item.variant_id,
        qty:          item.qty,
        playerName:   item.player_name,
      })),
      deliveryMethod:   d.delivery_method,
      deliveryAddress:  d.delivery_address,
      notes:            d.notes,
      attributeValues:  d.attribute_answers,
      customer: {
        tenantId:  tenant.id,
        email:     d.email,
        firstName: d.first_name,
        lastName:  d.last_name,
        phone:     d.phone,
        team:      d.team,
        grade:     d.grade,
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create order'
    const isNotFound = msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('variant')
    const isStock    = msg.toLowerCase().includes('stock') || msg.toLowerCase().includes('insufficient')
    return NextResponse.json(
      { error: isNotFound ? 'One or more selected products are no longer available.' : isStock ? msg : 'Something went wrong. Please try again.' },
      { status: isNotFound || isStock ? 409 : 500 }
    )
  }

  // Fire-and-forget confirmation email
  sendCartConfirmationEmail({
    email:          d.email,
    firstName:      d.first_name,
    orderNumber:    result.order.order_number ?? result.order.id.slice(0, 8).toUpperCase(),
    campaignName:   campaign.name,
    closesAt:       campaign.closes_at ?? null,
    deliveryMethod: d.delivery_method,
    tenantName:     tenant.name,
    contactEmail:   tenant.contact_email ?? undefined,
    campaignId:     campaign.id,
    items:          d.items,
    totalCents:     0,  // resolved below from DB
  }).catch((err) => console.error('[Checkout] confirmation email failed:', err))

  return NextResponse.json(
    { order_id: result.order.id, status: result.order.status },
    { status: 201 }
  )
}

async function sendCartConfirmationEmail(opts: {
  email:          string
  firstName:      string
  orderNumber:    string
  campaignName:   string
  closesAt:       string | null
  deliveryMethod: string
  tenantName:     string
  contactEmail?:  string
  campaignId:     string
  items:          Array<{ product_slug: string; variant_id: string; qty: number; player_name?: string }>
  totalCents:     number
}): Promise<void> {
  // Resolve product names + variants in parallel
  const lineDetails = await Promise.all(opts.items.map(async (item) => {
    const [cpRes, varRes] = await Promise.all([
      getSupabase()
        .from('merch_campaign_products')
        .select('name, price_cents')
        .eq('campaign_id', opts.campaignId)
        .eq('slug', item.product_slug)
        .maybeSingle(),
      getSupabase()
        .from('merch_product_variants')
        .select('size, colour, additional_cost_cents')
        .eq('id', item.variant_id)
        .maybeSingle(),
    ])

    const name         = (cpRes.data as any)?.name ?? item.product_slug
    const baseCents    = (cpRes.data as any)?.price_cents ?? 0
    const surcharge    = (varRes.data as any)?.additional_cost_cents ?? 0
    const unitCents    = baseCents + surcharge
    const size         = (varRes.data as any)?.size ?? ''
    const colour       = (varRes.data as any)?.colour ?? ''
    const variant      = [size, colour].filter(Boolean).join(' / ')

    return { name, variant, qty: item.qty, unitCents, lineCents: unitCents * item.qty }
  }))

  const grandTotal = lineDetails.reduce((s, l) => s + l.lineCents, 0)

  const closesLabel = opts.closesAt
    ? new Date(opts.closesAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'To be confirmed'

  const deliveryLabel = opts.deliveryMethod === 'collect' ? 'Collect from club' : 'Courier delivery'

  const supportLine = opts.contactEmail
    ? `Questions? Reply to this email or contact us at <a href="mailto:${opts.contactEmail}" style="color:#0B1F4D;">${opts.contactEmail}</a>.`
    : `Questions? Reply to this email.`

  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`

  const lineRows = lineDetails.map((l, i) => `
    <tr style="border-top:1px solid #E2E8EF;${i % 2 === 0 ? '' : 'background:#FAFBFC;'}">
      <td style="padding:10px 16px;font-size:13px;color:#374151;">${l.name}</td>
      <td style="padding:10px 16px;font-size:13px;color:#5A6B7E;">${l.variant || '—'}</td>
      <td style="padding:10px 16px;font-size:13px;color:#5A6B7E;text-align:center;">${l.qty}</td>
      <td style="padding:10px 16px;font-size:13px;color:#0B1F4D;text-align:right;font-weight:600;">${fmt(l.lineCents)}</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pre-Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#F4F6FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FA;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr><td style="background:#0B1F4D;padding:28px 32px;text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">${opts.tenantName}</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.02em;">Pre-Order Confirmed</h1>
        </td></tr>
        <tr><td style="padding:28px 32px 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;">Your Pre-Order Reference</p>
          <p style="margin:0;font-size:28px;font-weight:800;color:#0B1F4D;letter-spacing:0.06em;font-variant-numeric:tabular-nums;">${opts.orderNumber}</p>
        </td></tr>
        <tr><td style="padding:24px 32px 0;">
          <p style="margin:0;font-size:15px;color:#374151;line-height:1.65;">
            Hi ${opts.firstName}, your pre-order for <strong>${opts.campaignName}</strong> has been placed.
            No payment is required now — we'll contact you once the minimum quantity is reached.
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8EF;border-radius:8px;overflow:hidden;">
            <tr style="background:#F8FAFC;">
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;text-align:left;">Product</th>
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;text-align:left;">Option</th>
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;text-align:center;">Qty</th>
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;text-align:right;">Total</th>
            </tr>
            ${lineRows}
            <tr style="border-top:2px solid #E2E8EF;background:#F0F3FA;">
              <td colspan="3" style="padding:12px 16px;font-size:14px;font-weight:700;color:#0B1F4D;">Order Total</td>
              <td style="padding:12px 16px;font-size:16px;font-weight:800;color:#0B1F4D;text-align:right;">${fmt(grandTotal)}</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0;font-size:13px;color:#5A6B7E;"><strong style="color:#0B1F4D;">Delivery:</strong> ${deliveryLabel}</p>
          <p style="margin:8px 0 0;font-size:13px;color:#5A6B7E;"><strong style="color:#0B1F4D;">Campaign closes:</strong> ${closesLabel}</p>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <p style="margin:0;font-size:13px;color:#5A6B7E;line-height:1.65;">${supportLine}</p>
        </td></tr>
        <tr><td style="background:#0B1F4D;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">
            ${opts.tenantName} &middot; Merchandise powered by <a href="https://tendencies.co.nz" style="color:rgba(255,255,255,0.5);text-decoration:none;">Tendencies</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const textLines = lineDetails.map((l) => `  • ${l.name} (${l.variant || '—'}) × ${l.qty} = ${fmt(l.lineCents)}`).join('\n')

  const text = `Hi ${opts.firstName}, your pre-order for ${opts.campaignName} has been confirmed.

Pre-Order Reference: ${opts.orderNumber}

Items:
${textLines}

Order Total: ${fmt(grandTotal)}
Delivery: ${deliveryLabel}
Campaign closes: ${closesLabel}

No payment is required now. We'll contact you once the minimum quantity is reached.

${opts.contactEmail ? `Questions? Contact us at ${opts.contactEmail}` : 'Questions? Reply to this email.'}`

  await sendRawEmail({
    to:      opts.email,
    subject: `Pre-order confirmed — ${opts.orderNumber} · ${opts.tenantName}`,
    html,
    text,
  })
}
