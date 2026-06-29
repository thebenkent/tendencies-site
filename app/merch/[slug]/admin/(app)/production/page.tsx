import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import { Factory } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductionPage({
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
        title="Production"
        description="Jobs due today, late jobs, supplier status, freight, and quality control."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Production' }]}
      />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={<Factory className="w-6 h-6" />}
            title="Production dashboard — coming in Phase 7D"
            description="Integrates with the workflow engine to show jobs in each stage: artwork, production, QC, packed, and shipped."
          />
        </div>
      </div>
    </div>
  )
}
