import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getTenant, getCampaigns } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import StatusBadge, { statusVariant } from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import type { MerchCampaign } from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

const TYPE_LABEL: Record<string, string> = {
  reservation:    'Reservation',
  pre_order:      'Pre-Order',
  retail:         'Retail',
  uniform:        'Uniform',
  corporate:      'Corporate',
  event:          'Event',
  gift_redemption:'Gift',
}

function fmt(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant   = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaigns = await getCampaigns(tenant.id)

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Manage ordering windows, products, and campaign settings."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Campaigns' }]}
        actions={
          <Link
            href={`/merch/${slug}/admin/campaigns/new`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New campaign
          </Link>
        }
      />

      <div className="p-6">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <EmptyState
              title="No campaigns yet"
              description="Create your first campaign to start taking orders."
              action={
                <Link
                  href={`/merch/${slug}/admin/campaigns/new`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New campaign
                </Link>
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Opens</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Closes</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((c: MerchCampaign) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{c.slug}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {TYPE_LABEL[c.campaign_type] ?? c.campaign_type}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        label={c.status.replace(/_/g, ' ')}
                        variant={statusVariant(c.status)}
                        dot
                      />
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">{fmt(c.opens_at)}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">{fmt(c.closes_at)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/merch/${slug}/admin/campaigns/${c.id}`}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Edit →
                      </Link>
                    </td>
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
