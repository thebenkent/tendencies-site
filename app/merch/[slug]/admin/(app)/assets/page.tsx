import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import { FolderOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AssetsPage({
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
        title="Asset Library"
        description="Manage images, PDFs, and other files used across your campaigns and products."
        breadcrumbs={[{ label: 'Admin', href: `/merch/${slug}/admin` }, { label: 'Assets' }]}
        actions={
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
            Upload files
          </button>
        }
      />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={<FolderOpen className="w-6 h-6" />}
            title="Asset library — coming in Phase 7E"
            description="Upload images once, reuse them across all your products and campaigns. Supports folders, search, and automatic WebP conversion."
          />
        </div>
      </div>
    </div>
  )
}
