/**
 * Collections CMS page — reference implementation.
 *
 * Thin Server Component wrapper around CRUDPage<CollectionAdminData>.
 * Every capability — columns, filters, editor tabs, relationships, lifecycle
 * toolbar actions, validation, search, commands — comes from the runtime.
 *
 * This page only:
 *   1. Resolves the tenant
 *   2. Fetches collections for the tenant
 *   3. Fetches campaign options for the campaignId selector
 *   4. Wires CRUD callbacks to the admin service
 *   5. Passes the EntityDefinition (enriched with campaign options)
 *
 * Architecture: tenant → admin service → repository → Supabase
 * No direct DB access in this file.
 */

import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import { getCampaigns } from '@/lib/merch/db'
import CRUDPage from '@/components/admin/crud/CRUDPage'
import PageHeader from '@/components/admin/PageHeader'
import { collectionDefinition } from '@/lib/modules/collections/definition'
import {
  listCollectionsForAdmin,
  createCollectionForAdmin,
  updateCollectionForAdmin,
  deleteCollectionForAdmin,
  duplicateCollection,
  archiveCollection,
  bulkPublishCollections,
  bulkArchiveCollections,
  bulkDeleteCollections,
  bulkDuplicateCollections,
  validateCollectionData,
  COLLECTION_DEFAULTS,
  type CollectionAdminData,
} from '@/lib/modules/collections/admin-service'
import type { BulkAction } from '@/components/admin/crud/types'
import type { EntityDefinition } from '@/lib/admin/definitions'

export const dynamic = 'force-dynamic'

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant    = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  // Narrow tenantId so TypeScript doesn't lose it inside async server action closures
  const tenantId = tenant.id

  const [collections, campaigns] = await Promise.all([
    listCollectionsForAdmin(tenantId),
    getCampaigns(tenantId),
  ])

  // Default values for the "new collection" editor
  const defaultValues: CollectionAdminData = { ...COLLECTION_DEFAULTS, tenantId }

  // Enrich the definition with live campaign options for the campaignId selector.
  // This page-level enrichment avoids a bespoke campaign-picker component.
  const campaignOptions = campaigns.map((c) => ({ label: c.name, value: c.id }))
  const enrichedDefinition: EntityDefinition<CollectionAdminData> = {
    ...collectionDefinition,
    editorTabs: collectionDefinition.editorTabs?.map((tab) =>
      tab.key === 'general'
        ? {
            ...tab,
            fields: tab.fields?.map((f) =>
              f.key === 'campaignId'
                ? { ...f, component: 'select' as const, options: campaignOptions }
                : f,
            ),
          }
        : tab,
    ),
  }

  // ── CRUD callbacks ──────────────────────────────────────────────────────

  async function onCreate(data: CollectionAdminData): Promise<CollectionAdminData> {
    'use server'
    const errors = await validateCollectionData(data, tenantId)
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]!)
    return createCollectionForAdmin(tenantId, data)
  }

  async function onUpdate(id: string, data: CollectionAdminData): Promise<CollectionAdminData> {
    'use server'
    const errors = await validateCollectionData(data, tenantId, id)
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]!)
    return updateCollectionForAdmin(id, tenantId, data)
  }

  async function onDelete(id: string): Promise<void> {
    'use server'
    const row = collections.find((c) => c.id === id)
    return deleteCollectionForAdmin(id, tenantId, row?.name ?? id)
  }

  async function onDuplicate(id: string): Promise<CollectionAdminData> {
    'use server'
    return duplicateCollection(id, tenantId)
  }

  async function onArchive(id: string): Promise<void> {
    'use server'
    const row = collections.find((c) => c.id === id)
    return archiveCollection(id, tenantId, row?.name ?? id)
  }

  // ── Bulk actions ───────────────────────────────────────────────────────

  const bulkActions: BulkAction<CollectionAdminData>[] = [
    {
      key:   'publish',
      label: 'Publish',
      onClick: async (rows) => {
        'use server'
        await bulkPublishCollections(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:   'archive',
      label: 'Archive',
      onClick: async (rows) => {
        'use server'
        await bulkArchiveCollections(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:   'duplicate',
      label: 'Duplicate',
      onClick: async (rows) => {
        'use server'
        await bulkDuplicateCollections(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:     'delete',
      label:   'Delete selected',
      variant: 'danger',
      onClick: async (rows) => {
        'use server'
        await bulkDeleteCollections(rows, tenantId)
      },
    },
  ]

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Collections"
        description="Organise products into themed collections with hero images, SEO, and lifecycle management."
        breadcrumbs={[
          { label: 'Admin', href: `/merch/${slug}/admin` },
          { label: 'Collections' },
        ]}
      />
      <CRUDPage
        data={collections}
        definition={enrichedDefinition}
        defaultValues={defaultValues}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onArchive={onArchive}
        bulkActions={bulkActions}
        pageSize={25}
      />
    </div>
  )
}
