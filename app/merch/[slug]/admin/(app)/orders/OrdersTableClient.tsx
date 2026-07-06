'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send } from 'lucide-react'
import StatusBadge, { statusVariant } from '@/components/admin/StatusBadge'
import BulkActionBar from '@/components/admin/BulkActionBar'
import type { MerchOrderExpanded } from '@/lib/merch/types'

// Only orders that have cleared MOQ (confirmed) — not raw reservations, not already paid
const PAYMENT_REQUESTABLE = new Set(['confirmed', 'payment_requested'])

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

export default function OrdersTableClient({
  orders,
  slug,
}: {
  orders: MerchOrderExpanded[]
  slug:   string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const eligible = orders.filter((o) => PAYMENT_REQUESTABLE.has(o.status))

  async function requestPayment(orderIds: string[]) {
    const key = orderIds.length === 1 ? orderIds[0] : 'bulk'
    setLoading(key)
    try {
      let failed = 0
      for (const id of orderIds) {
        const res = await fetch(`/api/merch/${slug}/admin/orders`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ order_id: id, to_state: 'payment_requested' }),
        })
        if (!res.ok) failed++
      }
      if (failed > 0) alert(`${failed} of ${orderIds.length} payment request${orderIds.length !== 1 ? 's' : ''} failed.`)
      setSelected(new Set())
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  function toggleSelect(id: string, checked: boolean) {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    setSelected(next)
  }

  function toggleAll() {
    if (selected.size === eligible.length && eligible.length > 0) {
      setSelected(new Set())
    } else {
      setSelected(new Set(eligible.map((o) => o.id)))
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3.5 w-10">
                {eligible.length > 0 && (
                  <input
                    type="checkbox"
                    checked={selected.size > 0 && selected.size === eligible.length}
                    ref={(el) => {
                      if (el) el.indeterminate = selected.size > 0 && selected.size < eligible.length
                    }}
                    onChange={toggleAll}
                    className="rounded border-gray-300 cursor-pointer"
                  />
                )}
              </th>
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
              const totalCents = order.merch_order_lines.reduce(
                (sum, l) => sum + l.unit_price_cents * l.qty,
                0,
              )
              const canRequest = PAYMENT_REQUESTABLE.has(order.status)
              const isLoading  = loading === order.id
              const isSelected = selected.has(order.id)

              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    {canRequest && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelect(order.id, e.target.checked)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900 font-mono text-xs">
                      #{order.order_number ?? order.id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {order.merch_order_lines.length} item{order.merch_order_lines.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900">
                      {order.merch_customers
                        ? `${order.merch_customers.first_name} ${order.merch_customers.last_name}`
                        : '—'}
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
                    <div className="flex items-center justify-end gap-2">
                      {canRequest && (
                        <button
                          onClick={() => requestPayment([order.id])}
                          disabled={!!loading}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          {isLoading ? 'Sending…' : 'Request Payment'}
                        </button>
                      )}
                      <Link
                        href={`/merch/${slug}/admin/orders/${order.id}`}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        View →
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <BulkActionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        actions={[
          {
            label:   loading === 'bulk' ? 'Sending…' : `Request Payment (${selected.size})`,
            icon:    <Send className="w-3.5 h-3.5" />,
            onClick: () => requestPayment(Array.from(selected)),
          },
        ]}
      />
    </>
  )
}
