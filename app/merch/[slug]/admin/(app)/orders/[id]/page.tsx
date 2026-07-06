import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import { findOrderById } from '@/lib/modules/orders/repository'
import { findPaymentByOrderId } from '@/lib/modules/payments/repository'
import { getSupabase } from '@/lib/core/database'
import PageHeader from '@/components/admin/PageHeader'
import StatusBadge, { statusVariant } from '@/components/admin/StatusBadge'
import OrderDetailClient from './OrderDetailClient'
import type { MerchOrderEvent } from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = {
  reserved:          'Pre-Ordered',
  confirmed:         'MOQ Confirmed',
  payment_requested: 'Payment Requested',
  paid:              'Paid',
  production:        'In Production',
  completed:         'Completed',
  cancelled:         'Cancelled',
  refunded:          'Refunded',
}

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-NZ', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const order = await findOrderById(id, tenant.id)
  if (!order) notFound()

  const [payment, eventsResult] = await Promise.all([
    findPaymentByOrderId(id),
    getSupabase()
      .from('merch_order_events')
      .select('*')
      .eq('order_id', id)
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false }),
  ])

  const events = (eventsResult.data ?? []) as MerchOrderEvent[]
  const customer = order.merch_customers
  const ref = order.order_number ?? order.id.slice(-8).toUpperCase()

  const courierCents = order.delivery_method === 'courier' ? 1000 : 0
  const lineTotal    = order.merch_order_lines.reduce((s, l) => s + l.unit_price_cents * l.qty, 0)
  const grandTotal   = lineTotal + courierCents

  return (
    <div>
      <PageHeader
        title={`Order ${ref}`}
        breadcrumbs={[
          { label: 'Admin',  href: `/merch/${slug}/admin` },
          { label: 'Orders', href: `/merch/${slug}/admin/orders` },
          { label: ref },
        ]}
        actions={
          order.status === 'payment_requested'
            ? <OrderDetailClient slug={slug} orderId={order.id} />
            : undefined
        }
      />

      <div className="p-6 space-y-6">

        {/* Customer */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Customer</h2>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Name</p>
              <p className="font-medium text-gray-900">{customer.first_name} {customer.last_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="text-gray-800">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                <p className="text-gray-800">{customer.phone}</p>
              </div>
            )}
            {customer.team && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Team / Grade</p>
                <p className="text-gray-800">{[customer.team, customer.grade].filter(Boolean).join(' · ')}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Delivery</p>
              <p className="text-gray-800">{order.delivery_method === 'courier' ? 'Courier delivery' : 'Collect from club'}</p>
            </div>
            {order.delivery_address && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Address</p>
                <p className="text-gray-800">{order.delivery_address}</p>
              </div>
            )}
            {order.notes && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Notes</p>
                <p className="text-gray-800">{order.notes}</p>
              </div>
            )}
          </div>
        </section>

        {/* Status + Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Order Status</h2>
            </div>
            <div className="px-5 py-4">
              <StatusBadge
                label={STATUS_LABEL[order.status] ?? order.status}
                variant={statusVariant(order.status)}
                dot
              />
              <p className="text-xs text-gray-400 mt-2">Placed {fmtDate(order.created_at)}</p>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Payment</h2>
            </div>
            <div className="px-5 py-4">
              {payment ? (
                <div className="space-y-1.5 text-sm">
                  <StatusBadge
                    label={payment.status}
                    variant={statusVariant(payment.status)}
                    dot
                  />
                  <p className="text-gray-700">{fmt(payment.amount_cents)} {payment.currency}</p>
                  {payment.payment_link && (
                    <a
                      href={payment.payment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Stripe checkout link ↗
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No payment record</p>
              )}
            </div>
          </section>
        </div>

        {/* Order Lines */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Order Lines</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Option</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.merch_order_lines.map((line) => {
                const variant = [line.merch_product_variants.size, line.merch_product_variants.colour]
                  .filter(Boolean).join(' / ')
                return (
                  <tr key={line.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{line.merch_products.name}</td>
                    <td className="px-5 py-3 text-gray-600">{variant || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{line.player_name || '—'}</td>
                    <td className="px-5 py-3 text-center text-gray-700 tabular-nums">{line.qty}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900 tabular-nums">{fmt(line.unit_price_cents * line.qty)}</td>
                  </tr>
                )
              })}
              {courierCents > 0 && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-5 py-3 text-gray-500">Courier delivery</td>
                  <td className="px-5 py-3 text-right text-gray-600 tabular-nums">{fmt(courierCents)}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td colSpan={4} className="px-5 py-3 font-semibold text-gray-900">Total</td>
                <td className="px-5 py-3 text-right font-bold text-gray-900 tabular-nums">{fmt(grandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Workflow History */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Workflow History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {events.length === 0 ? (
              <p className="px-5 py-4 text-sm text-gray-400">No events recorded.</p>
            ) : (
              events.map((e) => (
                <div key={e.id} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {e.event_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">by {e.actor}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">{fmtDate(e.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
