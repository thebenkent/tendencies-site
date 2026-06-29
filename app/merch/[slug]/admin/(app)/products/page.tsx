import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Package } from 'lucide-react'
import { getTenant, getCampaigns, getProducts } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import type { MerchCampaign, MerchProductWithVariants } from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
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

  const products = activeCampaign ? await getProducts(activeCampaign.id) as MerchProductWithVariants[] : []

  return (
    <div>
      <PageHeader
        title="Products"
        description="Edit product details, variants, pricing, media, and content."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Products' }]}
        actions={
          <div className="flex items-center gap-2">
            {campaigns.length > 0 && (
              <select
                defaultValue={activeCampaign?.slug ?? ''}
                onChange={(e) => { window.location.href = `?campaign=${e.target.value}` }}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {campaigns.map((c: MerchCampaign) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            )}
            <Link
              href={`/merch/${slug}/admin/products/new${activeCampaign ? `?campaign=${activeCampaign.slug}` : ''}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New product
            </Link>
          </div>
        }
      />

      <div className="p-6">
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <EmptyState
              icon={<Package className="w-6 h-6" />}
              title="No products in this campaign"
              description="Add your first product to start building your catalogue."
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider" colSpan={2}>Product</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">MOQ</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Variants</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 w-12">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                        {p.images[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill className="object-contain p-1" sizes="40px" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300 text-lg">□</div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{p.slug}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums">
                      {p.price_cents != null
                        ? `$${(p.price_cents / 100).toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{p.minimum_qty ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{p.merch_product_variants?.length ?? 0}</td>
                    <td className="px-5 py-3">
                      <StatusBadge
                        label={p.active ? 'Active' : 'Hidden'}
                        variant={p.active ? 'success' : 'muted'}
                        dot
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/merch/${slug}/admin/products/${p.id}`}
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
