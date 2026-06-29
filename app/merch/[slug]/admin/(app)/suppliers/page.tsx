import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import { Truck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SuppliersPage({
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
        title="Suppliers"
        description="Supplier profiles, lead times, factories, pricing history, and preferred vendors."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Suppliers' }]}
      />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={<Truck className="w-6 h-6" />}
            title="Supplier management — coming in Phase 7E"
            description="Manage supplier profiles with lead times, MOQ, pricing history, and factory locations."
          />
        </div>
      </div>
    </div>
  )
}
