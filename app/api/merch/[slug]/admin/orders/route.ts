import { NextResponse } from 'next/server'
import { getTenant, getCampaign, getReservationsForTenant } from '@/lib/merch/db'
import { getAdminContext, canWrite } from '@/lib/merch/auth'
import { findOrderById, updateOrderStatus } from '@/lib/merch/repositories/orders'
import { executeTransition } from '@/lib/merch/services/workflow'
import { getSupabase } from '@/lib/merch/supabase'
import { createPaymentLink, computeOrderTotal, refundPayment } from '@/lib/modules/payments/stripe'
import { sendEmail, sendRawEmail } from '@/lib/modules/emails/service'
import type { MerchOrderExpanded } from '@/lib/merch/types'
import { deallocateStock } from '@/lib/modules/inventory/service'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const adminCtx = await getAdminContext(slug)
  if (!adminCtx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const url          = new URL(req.url)
  const campaignSlug = url.searchParams.get('campaign') ?? undefined
  const status       = url.searchParams.get('status') ?? undefined
  const productId    = url.searchParams.get('product_id') ?? undefined
  const search       = url.searchParams.get('search') ?? undefined

  let campaignId: string | undefined
  if (campaignSlug) {
    const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
    campaignId = campaign?.id
  }

  const orders = await getReservationsForTenant(tenant.id, { status, campaignId, productId, search })
  return NextResponse.json({ orders })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const adminCtx = await getAdminContext(slug)
  if (!adminCtx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(adminCtx.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body    = await req.json().catch(() => null)
  const orderId = body?.order_id ?? body?.reservation_id
  const toState = body?.status   ?? body?.to_state
  if (!orderId || !toState) {
    return NextResponse.json({ error: 'order_id and to_state required' }, { status: 400 })
  }

  const order = await findOrderById(orderId, tenant.id)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const { data: campaign } = await getSupabase()
    .from('merch_campaigns')
    .select('workflow_id, name')
    .eq('id', order.campaign_id)
    .single()

  const workflowId   = (campaign as any)?.workflow_id as string | null
  const campaignName = (campaign as any)?.name as string | ''

  // Handle Stripe refund before the workflow transition (so we can abort on error)
  if (toState === 'refunded' && process.env.STRIPE_SECRET_KEY) {
    try {
      const refundAmountCents = body?.amount_cents as number | undefined
      await refundPayment({
        orderId,
        tenantId: tenant.id,
        amountCents: refundAmountCents,
        reason: body?.reason ?? 'requested_by_customer',
      })
    } catch (err) {
      console.error('[RefundOrder] Stripe refund failed:', err)
      return NextResponse.json(
        { error: `Refund failed: ${(err as Error).message}` },
        { status: 400 }
      )
    }
  }

  // Execute workflow transition (or bare status update)
  if (workflowId) {
    await executeTransition(orderId, tenant.id, workflowId, order.status, toState, adminCtx.userId)
  } else {
    await updateOrderStatus(orderId, tenant.id, toState, adminCtx.userId)
  }

  // Side-effects keyed on the target state
  let checkoutUrl: string | undefined

  if (toState === 'payment_requested' && process.env.STRIPE_SECRET_KEY) {
    // Auto-generate a Stripe checkout link + send payment request email
    try {
      const result   = await createPaymentLink({ orderId, tenantId: tenant.id, returnSlug: slug })
      checkoutUrl    = result.checkoutUrl
      await sendPaymentRequestEmail({
        order,
        campaignName,
        tenantName: tenant.name,
        checkoutUrl,
      }).catch((err) => console.error('[PaymentLink] email failed:', err))
    } catch (err) {
      console.error('[PaymentLink] Stripe session creation failed:', err)
    }
  }

  if (toState === 'cancelled' || toState === 'refunded') {
    // Release reserved stock back to available
    for (const line of order.merch_order_lines) {
      await deallocateStock(
        line.variant_id,
        tenant.id,
        orderId,
        line.qty,
        adminCtx.userId,
      ).catch((err) => console.error('[OrderCancel] stock release failed:', err))
    }
  }

  if (toState === 'completed') {
    // Send collection/delivery ready notification
    const deliveryNotes = order.delivery_method === 'collect'
      ? 'Your order is ready for collection. Please contact us to arrange pick-up.'
      : 'Your order is on its way! We\'ll be in touch with tracking details.'
    await sendEmail({
      to:          order.merch_customers.email,
      templateKey: 'order_completed',
      tenantId:    tenant.id,
      variables: {
        customer_first_name: order.merch_customers.first_name,
        campaign_name:       campaignName,
        delivery_notes:      deliveryNotes,
      },
    }).catch((err) => console.error('[OrderComplete] email failed:', err))
  }

  return NextResponse.json({ ok: true, checkout_url: checkoutUrl ?? null })
}

async function sendPaymentRequestEmail(opts: {
  order:        MerchOrderExpanded
  campaignName: string
  tenantName:   string
  checkoutUrl:  string
}): Promise<void> {
  const { order, campaignName, tenantName, checkoutUrl } = opts
  const customer = order.merch_customers
  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`

  const courierCents = order.delivery_method === 'courier' ? 1000 : 0
  const totalCents   = order.merch_order_lines.reduce((s, l) => s + l.unit_price_cents * l.qty, 0)
  const grandTotal   = totalCents + courierCents

  const lineRows = order.merch_order_lines.map((l, i) => {
    const variant = [l.merch_product_variants.size, l.merch_product_variants.colour].filter(Boolean).join(' / ')
    return `
    <tr style="border-top:1px solid #E2E8EF;${i % 2 === 0 ? '' : 'background:#FAFBFC;'}">
      <td style="padding:10px 16px;font-size:13px;color:#374151;">${l.merch_products.name}</td>
      <td style="padding:10px 16px;font-size:13px;color:#5A6B7E;">
        ${variant || '—'}
        ${l.player_name ? `<br><span style="font-size:11px;color:#94A3B8;">Player: ${l.player_name}</span>` : ''}
      </td>
      <td style="padding:10px 16px;font-size:13px;color:#5A6B7E;text-align:center;">${l.qty}</td>
      <td style="padding:10px 16px;font-size:13px;color:#0B1F4D;text-align:right;font-weight:600;">${fmt(l.unit_price_cents * l.qty)}</td>
    </tr>`
  }).join('')

  const orderRef = order.order_number ?? order.id.slice(-8).toUpperCase()

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Payment Request</title></head>
<body style="margin:0;padding:0;background:#F4F6FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FA;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr><td style="background:#0B1F4D;padding:28px 32px;text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">${tenantName}</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.02em;">Payment Request</h1>
        </td></tr>
        <tr><td style="padding:28px 32px 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;">Order Reference</p>
          <p style="margin:0;font-size:28px;font-weight:800;color:#0B1F4D;letter-spacing:0.06em;font-variant-numeric:tabular-nums;">${orderRef}</p>
        </td></tr>
        <tr><td style="padding:24px 32px 0;">
          <p style="margin:0;font-size:15px;color:#374151;line-height:1.65;">
            Hi ${customer.first_name}, your order for <strong>${campaignName}</strong> is confirmed and ready for payment.
            Please use the button below to pay securely online.
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8EF;border-radius:8px;overflow:hidden;">
            <tr style="background:#F8FAFC;">
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;text-align:left;">Product</th>
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;text-align:left;">Option / Player</th>
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;text-align:center;">Qty</th>
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#5A6B7E;letter-spacing:0.08em;text-transform:uppercase;text-align:right;">Total</th>
            </tr>
            ${lineRows}
            ${courierCents > 0 ? `
            <tr style="border-top:1px solid #E2E8EF;">
              <td colspan="3" style="padding:10px 16px;font-size:13px;color:#5A6B7E;">Courier delivery</td>
              <td style="padding:10px 16px;font-size:13px;color:#5A6B7E;text-align:right;">${fmt(courierCents)}</td>
            </tr>` : ''}
            <tr style="border-top:2px solid #E2E8EF;background:#F0F3FA;">
              <td colspan="3" style="padding:12px 16px;font-size:14px;font-weight:700;color:#0B1F4D;">Amount Due</td>
              <td style="padding:12px 16px;font-size:16px;font-weight:800;color:#0B1F4D;text-align:right;">${fmt(grandTotal)}</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:28px 32px;text-align:center;">
          <a href="${checkoutUrl}" style="display:inline-block;background:#0B1F4D;color:#fff;font-size:16px;font-weight:700;padding:14px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;">
            Pay Now — ${fmt(grandTotal)}
          </a>
        </td></tr>
        <tr><td style="background:#0B1F4D;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">
            ${tenantName} &middot; Merchandise powered by <a href="https://tendencies.co.nz" style="color:rgba(255,255,255,0.5);text-decoration:none;">Tendencies</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const textLines = order.merch_order_lines.map((l) => {
    const variant = [l.merch_product_variants.size, l.merch_product_variants.colour].filter(Boolean).join(' / ')
    return `  • ${l.merch_products.name} (${variant || '—'})${l.player_name ? ` — Player: ${l.player_name}` : ''} × ${l.qty} = ${fmt(l.unit_price_cents * l.qty)}`
  }).join('\n')

  const text = `Hi ${customer.first_name},

Your order for ${campaignName} is confirmed and ready for payment.

Order Reference: ${orderRef}

${textLines}
${courierCents > 0 ? `Courier delivery: ${fmt(courierCents)}\n` : ''}Amount Due: ${fmt(grandTotal)}

Pay now: ${checkoutUrl}`

  await sendRawEmail({
    to:      customer.email,
    subject: `Payment request — ${orderRef} · ${tenantName}`,
    html,
    text,
  })
}
