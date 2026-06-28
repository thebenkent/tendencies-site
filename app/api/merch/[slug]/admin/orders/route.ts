import { NextResponse } from 'next/server'
import { getTenant, getCampaign, getReservationsForTenant } from '@/lib/merch/db'
import { getAdminContext, canWrite } from '@/lib/merch/auth'
import { findOrderById, updateOrderStatus } from '@/lib/merch/repositories/orders'
import { executeTransition } from '@/lib/merch/services/workflow'
import { getSupabase } from '@/lib/merch/supabase'
import { createPaymentLink, computeOrderTotal, refundPayment } from '@/lib/modules/payments/stripe'
import { sendEmail } from '@/lib/modules/emails/service'
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
      const total    = computeOrderTotal(order)
      const product  = order.merch_order_lines[0]?.merch_products.name ?? 'your order'
      await sendEmail({
        to:          order.merch_customers.email,
        templateKey: 'payment_request',
        tenantId:    tenant.id,
        variables: {
          customer_first_name: order.merch_customers.first_name,
          campaign_name:       campaignName,
          product_name:        product,
          amount:              `$${(total / 100).toFixed(2)}`,
          payment_link:        checkoutUrl,
        },
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
