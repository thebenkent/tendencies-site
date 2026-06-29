import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTenant, getCampaigns, getReservationsForTenant } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import StatusBadge, { statusVariant } from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import { ShoppingBag } from 'lucide-react'
import type { MerchCampaign, MerchOrderExpanded } from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

const STATUS_DISPLAY: Record<string, string> = {
  reserved:          'Pre-Ordered',
  confirmed:         'MOQ Confirmed',
  payment_requested: 'Payment Requested',
  paid:              'Paid',
  production:        'In Production',
  completed:         'Completed',
  cancelled:         'Cancelled',
  refunded:          'Refunded',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })
}

function fmtAmount(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ status?: string; campaign?: string; search?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaigns      = await getCampaigns(tenant.id)
  const activeCampaign = sp.campaign
    ? (campaigns.find((c) => c.slug === sp.campaign) ?? campaigns[0])
    : campaigns[0]

  const orders = await getReservationsForTenant(tenant.id, {
    status:     sp.status,
    campaignId: activeCampaign?.id,
    search:     sp.search,
  }) as MerchOrderExpanded[]

  const STATUS_PILLS = [
    { label: 'All',         value: '' },
    { label: 'Pre-ordered', value: 'reserved' },
    { label: 'Confirmed',   value: 'confirmed' },
    { label: 'Payment req', value: 'payment_requested' },
    { label: 'Paid',        value: 'paid' },
    { label: 'Production',  value: 'production' },
    { label: 'Completed',   value: 'completed' },
    { label: 'Cancelled',   value: 'cancelled' },
  ]

  const base = `/merch/${slug}/admin/orders`

  return (
    <div>
      <PageHeader
        title="Orders"
        description="View, filter, and manage customer orders across all campaigns."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Orders' }]}
        actions={
          campaigns.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                defaultValue={activeCampaign?.slug ?? ''}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {campaigns.map((c: MerchCampaign) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <a
                href={`/api/merch/${slug}/admin/export?campaign=${activeCampaign?.slug ?? ''}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Export CSV
              </a>
            </div>
          )
        }
      />

      {/* Status filter pills */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white flex gap-1.5 overflow-x-auto">
        {STATUS_PILLS.map(({ label, value }) => {
          const active = (sp.status ?? '') === value
          return (
            <Link
              key={value}
              href={`${base}?${new URLSearchParams({ ...(sp.campaign ? { campaign: sp.campaign } : {}), ...(value ? { status: value } : {}) })}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <div className="p-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <EmptyState
              icon={<ShoppingBag className="w-6 h-6" />}
              title="No orders found"
              description="Orders will appear here once customers start checking out."
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const totalCents = (order.merch_order_lines ?? []).reduce((sum: number, item: { unit_price_cents: number; qty: number }) => sum + item.unit_price_cents * item.qty, 0)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900 font-mono text-xs">
                          #{order.id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {order.merch_order_lines.length} item{order.merch_order_lines.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900">
                          {order.merch_customers ? `${order.merch_customers.first_name} ${order.merch_customers.last_name}` : '—'}
                        </div>
                        <div className="text-xs text-gray-400">{order.merch_customers?.email ?? '—'}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          label={STATUS_DISPLAY[order.status] ?? order.status}
                          variant={statusVariant(order.status)}
                          dot
                        />
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-900 tabular-nums">
                        {fmtAmount(totalCents)}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 tabular-nums">
                        {fmtDate(order.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/merch/${slug}/admin/orders/${order.id}`}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
