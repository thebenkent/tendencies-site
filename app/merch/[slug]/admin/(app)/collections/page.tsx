import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Plus, Layers } from 'lucide-react'
import { getTenant, getCampaigns, getCollections } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import type { MerchCampaign, MerchCollection } from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

export default async function CollectionsPage({
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

  const collections = activeCampaign ? await getCollections(activeCampaign.id) : []

  return (
    <div>
      <PageHeader
        title="Collections"
        description="Organise products into themed collections with hero images and descriptions."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Collections' }]}
        actions={
          <div className="flex items-center gap-2">
            {campaigns.length > 0 && (
              <select
                defaultValue={activeCampaign?.slug ?? ''}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {campaigns.map((c: MerchCampaign) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            )}
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
              <Plus className="w-4 h-4" />
              New collection
            </button>
          </div>
        }
      />

      <div className="p-6">
        {collections.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <EmptyState
              icon={<Layers className="w-6 h-6" />}
              title="No collections yet"
              description="Create collections to organise your products and build themed landing pages."
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Collection</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visibility</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {collections.map((c: MerchCollection) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900">{c.name}</div>
                      {c.description && (
                        <div className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{c.description}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        label={c.visible ? 'Visible' : 'Hidden'}
                        variant={c.visible ? 'success' : 'muted'}
                        dot
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        Edit →
                      </button>
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
