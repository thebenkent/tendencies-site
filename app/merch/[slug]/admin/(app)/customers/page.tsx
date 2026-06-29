import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import { findCustomersWithStats } from '@/lib/modules/customers/repository'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

function fmtCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant   = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const customers = await findCustomersWithStats(tenant.id, {})

  return (
    <div>
      <PageHeader
        title="Customers"
        description="View customer order history and contact information."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Customers' }]}
      />

      <div className="p-6">
        {customers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <EmptyState
              icon={<Users className="w-6 h-6" />}
              title="No customers yet"
              description="Customer records appear here once orders are placed."
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total spend</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900">{c.first_name} {c.last_name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{c.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">{c.orderCount}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">{fmtCents(c.totalSpent)}</td>
                    <td className="px-5 py-3.5 text-gray-500">{fmtDate(c.lastOrderAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
