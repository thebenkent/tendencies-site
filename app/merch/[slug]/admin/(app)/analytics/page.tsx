import { notFound } from 'next/navigation'
import { getTenant, getCampaigns } from '@/lib/merch/db'
import { getCampaignAnalytics } from '@/lib/modules/analytics/service'
import PageHeader from '@/components/admin/PageHeader'
import type { MerchCampaign } from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

function fmtCents(cents: number) {
  return `$${(cents / 100).toLocaleString('en-NZ', { minimumFractionDigits: 0 })}`
}

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ campaign?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaigns      = await getCampaigns(tenant.id)
  const activeCampaign = sp.campaign
    ? (campaigns.find((c) => c.slug === sp.campaign) ?? campaigns[0])
    : campaigns[0]

  const analytics = activeCampaign
    ? await getCampaignAnalytics(tenant.id, activeCampaign.id).catch(() => null)
    : null

  const stats = [
    { label: 'Revenue',          value: analytics ? fmtCents(analytics.totalRevenue)      : '—' },
    { label: 'Orders',           value: analytics ? String(analytics.totalOrders)          : '—' },
    { label: 'Average order',    value: analytics ? fmtCents(analytics.averageOrderValue)  : '—' },
    { label: 'Conversion rate',  value: analytics ? `${(analytics.conversionRate * 100).toFixed(1)}%` : '—' },
  ]

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Revenue, orders, and performance metrics."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Analytics' }]}
        actions={
          campaigns.length > 0 && (
            <select
              defaultValue={activeCampaign?.slug ?? ''}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {campaigns.map((c: MerchCampaign) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          )
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</div>
              <div className="text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
            </div>
          ))}
        </div>

        {/* Top products */}
        {analytics && analytics.topProducts && analytics.topProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Top Products</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Orders</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analytics.topProducts.map((p) => (
                  <tr key={p.productId} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{p.productName}</td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums">{p.orderCount}</td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums">{fmtCents(p.revenue)}</td>
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
