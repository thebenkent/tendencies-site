/**
 * Campaign CMS page.
 *
 * Thin Server Component wrapper around CRUDPage<CampaignAdminData>.
 * All display, search, filter, sort, selection, and editor logic lives
 * in the CRUD runtime. This page only:
 *   1. Resolves the tenant
 *   2. Fetches campaigns for the tenant
 *   3. Wires CRUD callbacks to the admin service
 *   4. Passes the EntityDefinition
 *
 * Lifecycle:  list → editor drawer → save → CRUDPage refreshes
 * Events:     every mutation dispatches to AdminEvents → auditSubscriber
 * Permissions: EntityDefinition.permissions gates UI via <Can>
 */

import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import CRUDPage from '@/components/admin/crud/CRUDPage'
import PageHeader from '@/components/admin/PageHeader'
import { campaignDefinition } from '@/lib/modules/campaigns/definition'
import {
  listCampaignsForAdmin,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  duplicateCampaign,
  archiveCampaign,
  bulkPublishCampaigns,
  bulkArchiveCampaigns,
  bulkDeleteCampaigns,
  bulkDuplicateCampaigns,
  validateCampaignData,
  CAMPAIGN_DEFAULTS,
  type CampaignAdminData,
} from '@/lib/modules/campaigns/admin-service'
import type { BulkAction } from '@/components/admin/crud/types'

export const dynamic = 'force-dynamic'

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant   = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  // Extract tenantId so TypeScript doesn't lose the narrowing inside async closures
  const tenantId = tenant.id
  const campaigns = await listCampaignsForAdmin(tenantId)

  // Default values for the "new campaign" editor
  const defaultValues: CampaignAdminData = { ...CAMPAIGN_DEFAULTS, tenantId }

  // ── CRUD callbacks ──────────────────────────────────────────────────────
  async function onCreate(data: CampaignAdminData): Promise<CampaignAdminData> {
    'use server'
    const errors = await validateCampaignData(data, tenantId)
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]!)
    return createCampaign(tenantId, data)
  }

  async function onUpdate(id: string, data: CampaignAdminData): Promise<CampaignAdminData> {
    'use server'
    const errors = await validateCampaignData(data, tenantId, id)
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]!)
    return updateCampaign(id, tenantId, data)
  }

  async function onDelete(id: string): Promise<void> {
    'use server'
    const row = campaigns.find((c) => c.id === id)
    return deleteCampaign(id, tenantId, row?.name ?? id)
  }

  async function onDuplicate(id: string): Promise<CampaignAdminData> {
    'use server'
    return duplicateCampaign(id, tenantId)
  }

  async function onArchive(id: string): Promise<void> {
    'use server'
    const row = campaigns.find((c) => c.id === id)
    return archiveCampaign(id, tenantId, row?.name ?? id)
  }

  // ── Bulk actions ───────────────────────────────────────────────────────
  const bulkActions: BulkAction<CampaignAdminData>[] = [
    {
      key:   'publish',
      label: 'Publish',
      onClick: async (rows) => {
        'use server'
        await bulkPublishCampaigns(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:   'archive',
      label: 'Archive',
      onClick: async (rows) => {
        'use server'
        await bulkArchiveCampaigns(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:   'duplicate',
      label: 'Duplicate',
      onClick: async (rows) => {
        'use server'
        await bulkDuplicateCampaigns(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:     'delete',
      label:   'Delete selected',
      variant: 'danger',
      onClick: async (rows) => {
        'use server'
        await bulkDeleteCampaigns(rows, tenantId)
      },
    },
  ]

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Campaigns"
        description="Manage ordering windows, products, and campaign settings."
        breadcrumbs={[
          { label: 'Admin', href: `/merch/${slug}/admin` },
          { label: 'Campaigns' },
        ]}
      />
      <CRUDPage
        data={campaigns}
        definition={campaignDefinition}
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
