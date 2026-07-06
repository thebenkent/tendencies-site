/**
 * Products CMS page.
 *
 * Thin Server Component wrapper around CRUDPage<ProductAdminData>.
 * All list columns, filters, editor tabs, relationships, lifecycle toolbar,
 * validation, search, and commands come from the runtime.
 *
 * This page only:
 *   1. Resolves the tenant
 *   2. Fetches products + campaigns
 *   3. Enriches the definition with live campaign + collection options
 *   4. Wires 'use server' CRUD callbacks
 *   5. Wires bulk actions
 */

import { notFound } from 'next/navigation'
import { getTenant, getCampaigns } from '@/lib/merch/db'
import CRUDPage from '@/components/admin/crud/CRUDPage'
import PageHeader from '@/components/admin/PageHeader'
import { productDefinition } from '@/lib/modules/products/definition'
import {
  listProductsForAdmin,
  createProductForAdmin,
  updateProductForAdmin,
  deleteProductForAdmin,
  duplicateProduct,
  archiveProduct,
  bulkPublishProducts,
  bulkArchiveProducts,
  bulkDuplicateProducts,
  bulkDeleteProducts,
  validateProductData,
  type ProductAdminData,
} from '@/lib/modules/products/admin-service'
import { PRODUCT_DEFAULTS } from '@/lib/modules/products/types'
import type { BulkAction } from '@/components/admin/crud/types'
import type { EntityDefinition } from '@/lib/admin/definitions'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug }  = await params
  const tenant    = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  // Narrow tenantId for TypeScript closure safety
  const tenantId = tenant.id

  const [products, campaigns] = await Promise.all([
    listProductsForAdmin(tenantId),
    getCampaigns(tenantId),
  ])

  const defaultValues: ProductAdminData = { ...PRODUCT_DEFAULTS, tenantId }

  // Enrich the definition with live campaign options (General tab → campaignId select).
  // This pattern is documented in Collections ARCHITECTURE.md.
  const campaignOptions = campaigns.map((c) => ({ label: c.name, value: c.id }))
  const enrichedDefinition: EntityDefinition<ProductAdminData> = {
    ...productDefinition,
    editorTabs: productDefinition.editorTabs?.map((tab) =>
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

  async function onCreate(data: ProductAdminData): Promise<ProductAdminData> {
    'use server'
    const errors = await validateProductData(data, tenantId)
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]!)
    return createProductForAdmin(tenantId, data)
  }

  async function onUpdate(id: string, data: ProductAdminData): Promise<ProductAdminData> {
    'use server'
    const errors = await validateProductData(data, tenantId, id)
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]!)
    return updateProductForAdmin(id, tenantId, data)
  }

  async function onDelete(id: string): Promise<void> {
    'use server'
    const row = products.find((p) => p.id === id)
    return deleteProductForAdmin(id, tenantId, row?.name ?? id)
  }

  async function onDuplicate(id: string): Promise<ProductAdminData> {
    'use server'
    return duplicateProduct(id, tenantId)
  }

  async function onArchive(id: string): Promise<void> {
    'use server'
    const row = products.find((p) => p.id === id)
    return archiveProduct(id, tenantId, row?.name ?? id)
  }

  // ── Bulk actions ───────────────────────────────────────────────────────

  const bulkActions: BulkAction<ProductAdminData>[] = [
    {
      key:   'publish',
      label: 'Publish',
      onClick: async (rows) => {
        'use server'
        await bulkPublishProducts(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:   'archive',
      label: 'Archive',
      onClick: async (rows) => {
        'use server'
        await bulkArchiveProducts(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:   'duplicate',
      label: 'Duplicate',
      onClick: async (rows) => {
        'use server'
        await bulkDuplicateProducts(rows.map((r) => r.id), tenantId)
      },
    },
    {
      key:     'delete',
      label:   'Delete selected',
      variant: 'danger',
      onClick: async (rows) => {
        'use server'
        await bulkDeleteProducts(rows, tenantId)
      },
    },
  ]

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Products"
        description="Manage campaign products with pricing, variants, branding, and lifecycle."
        breadcrumbs={[
          { label: 'Admin', href: `/merch/${slug}/admin` },
          { label: 'Products' },
        ]}
      />
      <CRUDPage
        data={products}
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
