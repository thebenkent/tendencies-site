import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import { Boxes } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BundlesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant   = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  return (
    <div>
      <PageHeader
        title="Bundles"
        description="Create product bundles with visual builder — search products, set quantities, configure options."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Bundles' }]}
        actions={
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
            New bundle
          </button>
        }
      />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={<Boxes className="w-6 h-6" />}
            title="Bundle builder — coming in Phase 7B"
            description="Group products into bundles. Search and add products, set quantities, mark items as required or optional."
          />
        </div>
      </div>
    </div>
  )
}
