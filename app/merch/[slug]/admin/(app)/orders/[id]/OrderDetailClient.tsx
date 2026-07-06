'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderDetailClient({
  slug,
  orderId,
}: {
  slug:    string
  orderId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function markPaid() {
    if (!confirm('Mark this order as paid? This uses the workflow transition and cannot be undone.')) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/merch/${slug}/admin/orders`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ order_id: orderId, to_state: 'paid' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? 'Failed to mark as paid')
        return
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        onClick={markPaid}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Processing…' : 'Mark Paid'}
      </button>
    </div>
  )
}
