/**
 * Product admin service.
 *
 * Unified DTO + CRUD mutations + event dispatch.
 * Replaces the old split ProductTableRow/ProductEditorData approach.
 *
 * Architecture:
 *   page.tsx → admin-service → repository → Supabase
 *   Each mutation dispatches an AdminEvent for the audit log.
 */

'use server'

import { dispatch, AdminEvents } from '@/lib/admin/dispatcher'
import { executeAttach, executeDetach, executeReorder } from '@/lib/admin/relationships/helpers'
import {
  findProductsByTenant,
  findProductByIdAdmin,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  duplicateAdminProduct,
  findVariantsByProduct,
  createVariantAdmin,
  updateVariantAdmin,
  deleteVariantAdmin,
  reorderVariantsAdmin,
  findBrandingByProduct,
  createBrandingAdmin,
  updateBrandingAdmin,
  deleteBrandingAdmin,
  reorderBrandingAdmin,
  type ProductAdminListRow,
  type ProductVariantAdminRow,
  type ProductBrandingAdminRow,
} from './repository'
import { validateProduct, transitionProductStatus } from './service'
import type { LifecycleStatus } from '@/lib/admin/lifecycle'
import type { ProductAdminData } from './types'

export type { ProductAdminData } from './types'

// ── DTO mapper ────────────────────────────────────────────────────────────

function toAdminData(row: ProductAdminListRow): ProductAdminData {
  return {
    id:            row.id,
    tenantId:      row.tenant_id,
    campaignId:    row.campaign_id,
    campaign_name: row.campaign_name ?? '',
    name:          row.name,
    slug:          row.slug,
    sku:           row.sku ?? '',
    description:   '',  // loaded per-editor from storefront repo if needed
    price_cents:   row.price_cents,
    cost_cents:    row.cost_cents,
    currency:      row.currency,
    minimum_qty:   row.minimum_qty,
    lead_time_days: row.lead_time_days,
    supplier_sku:  row.supplier_sku ?? '',
    status:        row.lifecycle_status,
    active:        row.active,
    sort_order:    row.sort_order,
    featured:      row.featured,
    collection_id: row.collection_id ?? '',
    thumbnail_url: row.thumbnail_url ?? '',
    embroidery_available: row.embroidery_available,
    embroidery_notes:     row.embroidery_notes ?? '',
    sizing_notes:         row.sizing_notes ?? '',
    seo_title:       row.seo_title ?? '',
    seo_description: row.seo_description ?? '',
    tags:            row.tags,
    publish_at:  row.publish_at ?? '',
    archive_at:  row.archive_at ?? '',
    published_at: row.published_at,
    archived_at:  row.archived_at,
    variant_count: row.variant_count,
    image_count:   row.image_count,
    created_at:    row.created_at,
    updated_at:    row.updated_at ?? '',
  }
}

// ── Queries ───────────────────────────────────────────────────────────────

export async function listProductsForAdmin(tenantId: string): Promise<ProductAdminData[]> {
  const rows = await findProductsByTenant(tenantId)
  return rows.map(toAdminData)
}

export async function getProductForEditor(
  id:       string,
  tenantId: string,
): Promise<ProductAdminData | null> {
  const row = await findProductByIdAdmin(id, tenantId)
  return row ? toAdminData(row) : null
}

// ── Validation facade ─────────────────────────────────────────────────────

export async function validateProductData(
  data:       ProductAdminData,
  tenantId:   string,
  existingId?: string,
): Promise<Partial<Record<string, string>>> {
  return validateProduct(
    {
      name:        data.name,
      slug:        data.slug,
      campaign_id: data.campaignId,
      price_cents: data.price_cents,
      cost_cents:  data.cost_cents,
      minimum_qty: data.minimum_qty,
      publish_at:  data.publish_at || null,
      archive_at:  data.archive_at || null,
    },
    tenantId,
    existingId,
  )
}

// ── Mutations ─────────────────────────────────────────────────────────────

function toInput(data: ProductAdminData): Parameters<typeof createAdminProduct>[1] {
  return {
    campaign_id:          data.campaignId,
    name:                 data.name,
    slug:                 data.slug,
    sku:                  data.sku || null,
    description:          data.description || null,
    price_cents:          data.price_cents,
    cost_cents:           data.cost_cents,
    currency:             data.currency,
    minimum_qty:          data.minimum_qty,
    lead_time_days:       data.lead_time_days,
    supplier_sku:         data.supplier_sku || null,
    lifecycle_status:     data.status,
    active:               data.active,
    sort_order:           data.sort_order,
    featured:             data.featured,
    collection_id:        data.collection_id || null,
    embroidery_available: data.embroidery_available,
    embroidery_notes:     data.embroidery_notes || null,
    sizing_notes:         data.sizing_notes || null,
    seo_title:            data.seo_title || null,
    seo_description:      data.seo_description || null,
    tags:                 data.tags,
    publish_at:           data.publish_at || null,
    archive_at:           data.archive_at || null,
  }
}

export async function createProductForAdmin(
  tenantId: string,
  data:     ProductAdminData,
): Promise<ProductAdminData> {
  const row = await createAdminProduct(tenantId, toInput(data))
  await dispatch(AdminEvents.PRODUCT_CREATED, tenantId, {
    entityType:  'product',
    entityId:    row.id,
    entityLabel: row.name,
    action:      'created',
    after:       row,
  })
  return toAdminData(row)
}

export async function updateProductForAdmin(
  id:       string,
  tenantId: string,
  data:     ProductAdminData,
): Promise<ProductAdminData> {
  const row = await updateAdminProduct(id, tenantId, toInput(data))
  await dispatch(AdminEvents.PRODUCT_UPDATED, tenantId, {
    entityType:  'product',
    entityId:    id,
    entityLabel: row.name,
    action:      'updated',
    after:       row,
  })
  return toAdminData(row)
}

export async function deleteProductForAdmin(
  id:       string,
  tenantId: string,
  label:    string,
): Promise<void> {
  await deleteAdminProduct(id, tenantId)
  await dispatch(AdminEvents.PRODUCT_DELETED, tenantId, {
    entityType:  'product',
    entityId:    id,
    entityLabel: label,
    action:      'deleted',
  })
}

export async function publishProduct(
  id:       string,
  tenantId: string,
  label:    string,
  current:  LifecycleStatus = 'draft',
): Promise<void> {
  await transitionProductStatus(id, tenantId, 'published', current)
  await dispatch(AdminEvents.PRODUCT_PUBLISHED, tenantId, {
    entityType:  'product',
    entityId:    id,
    entityLabel: label,
    action:      'published',
  })
}

export async function archiveProduct(
  id:       string,
  tenantId: string,
  label:    string,
  current:  LifecycleStatus = 'published',
): Promise<void> {
  await transitionProductStatus(id, tenantId, 'archived', current)
  await dispatch(AdminEvents.PRODUCT_ARCHIVED, tenantId, {
    entityType:  'product',
    entityId:    id,
    entityLabel: label,
    action:      'archived',
  })
}

export async function duplicateProduct(
  id:       string,
  tenantId: string,
): Promise<ProductAdminData> {
  const row = await duplicateAdminProduct(id, tenantId)
  await dispatch(AdminEvents.PRODUCT_DUPLICATED, tenantId, {
    entityType:  'product',
    entityId:    row.id,
    entityLabel: row.name,
    action:      'duplicated',
    metadata:    { sourceId: id },
  })
  return toAdminData(row)
}

// ── Bulk operations ───────────────────────────────────────────────────────

export async function bulkPublishProducts(ids: string[], tenantId: string): Promise<void> {
  await Promise.all(ids.map((id) => publishProduct(id, tenantId, id, 'draft').catch(() => {})))
}

export async function bulkArchiveProducts(ids: string[], tenantId: string): Promise<void> {
  await Promise.all(ids.map((id) => archiveProduct(id, tenantId, id, 'published').catch(() => {})))
}

export async function bulkDuplicateProducts(ids: string[], tenantId: string): Promise<void> {
  await Promise.all(ids.map((id) => duplicateProduct(id, tenantId).catch(() => {})))
}

export async function bulkDeleteProducts(
  rows:     ProductAdminData[],
  tenantId: string,
): Promise<void> {
  await Promise.all(rows.map((r) => deleteProductForAdmin(r.id, tenantId, r.name).catch(() => {})))
}

// ── Variant relationship callbacks ────────────────────────────────────────

export async function getProductVariants(
  productId: string,
  _tenantId:  string,
): Promise<ProductVariantAdminRow[]> {
  return findVariantsByProduct(productId)
}

// Search: variants are inline children — no unattached variants to search.
export async function searchProductVariants(
  _query:    string,
  _tenantId: string,
  _exclude:  string[],
  _parentId?: string,
): Promise<ProductVariantAdminRow[]> {
  return []
}

// Attach: creates a new blank variant (ignores childIds — variants can't be "attached").
export async function attachProductVariant(
  productId:  string,
  _childIds:  string[],
  _tenantId:  string,
): Promise<void> {
  await createVariantAdmin(productId, {
    sku:                   null,
    fit:                   '',
    size:                  '',
    colour:                '',
    barcode:               null,
    additional_cost_cents: 0,
    available:             true,
    sort_order:            0,
    stock_qty:             null,
  })
}

export async function detachProductVariant(
  productId: string,
  variantId: string,
  tenantId:  string,
): Promise<void> {
  await executeDetach({
    tenantId,
    parentId:   productId,
    entityType: 'product',
    relation:   'variants',
    childId:    variantId,
    events:     { detached: AdminEvents.PRODUCT_VARIANT_REMOVED },
    doDetach:   (_pId, cId) => deleteVariantAdmin(cId),
  })
}

export async function reorderProductVariants(
  _productId: string,
  orderedIds: string[],
  _tenantId:  string,
): Promise<void> {
  await reorderVariantsAdmin(orderedIds)
}

export async function updateProductVariantMeta(
  _productId: string,
  variantId:  string,
  meta:       Record<string, unknown>,
  _tenantId:  string,
): Promise<void> {
  await updateVariantAdmin(variantId, {
    sku:                   (meta['sku'] as string | null) ?? null,
    fit:                   (meta['fit'] as string) ?? '',
    size:                  (meta['size'] as string) ?? '',
    colour:                (meta['colour'] as string) ?? '',
    barcode:               (meta['barcode'] as string | null) ?? null,
    additional_cost_cents: Number(meta['additional_cost_cents'] ?? 0),
    available:             Boolean(meta['available'] ?? true),
    stock_qty:             meta['stock_qty'] != null ? Number(meta['stock_qty']) : null,
  })
}

// ── Branding relationship callbacks ───────────────────────────────────────

export async function getProductBranding(
  productId: string,
  _tenantId: string,
): Promise<ProductBrandingAdminRow[]> {
  return findBrandingByProduct(productId)
}

export async function searchProductBranding(
  _query:    string,
  _tenantId: string,
  _exclude:  string[],
  _parentId?: string,
): Promise<ProductBrandingAdminRow[]> {
  return []
}

export async function attachProductBranding(
  productId:  string,
  _childIds:  string[],
  _tenantId:  string,
): Promise<void> {
  await createBrandingAdmin(productId, {
    method:                'screen_print',
    position:              null,
    max_colours:           null,
    artwork_notes:         null,
    additional_cost_cents: 0,
    sort_order:            0,
    active:                true,
  })
}

export async function detachProductBranding(
  productId:  string,
  brandingId: string,
  tenantId:   string,
): Promise<void> {
  await executeDetach({
    tenantId,
    parentId:   productId,
    entityType: 'product',
    relation:   'branding',
    childId:    brandingId,
    events:     { detached: AdminEvents.PRODUCT_BRANDING_REMOVED },
    doDetach:   (_pId, cId) => deleteBrandingAdmin(cId),
  })
}

export async function reorderProductBranding(
  _productId: string,
  orderedIds: string[],
  _tenantId:  string,
): Promise<void> {
  await reorderBrandingAdmin(orderedIds)
}

export async function updateProductBrandingMeta(
  _productId: string,
  brandingId: string,
  meta:       Record<string, unknown>,
  _tenantId:  string,
): Promise<void> {
  await updateBrandingAdmin(brandingId, {
    method:                (meta['method'] as string) ?? 'screen_print',
    position:              (meta['position'] as string | null) ?? null,
    max_colours:           meta['max_colours'] != null ? Number(meta['max_colours']) : null,
    artwork_notes:         (meta['artwork_notes'] as string | null) ?? null,
    additional_cost_cents: Number(meta['additional_cost_cents'] ?? 0),
  })
}
