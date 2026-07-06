/**
 * Product business logic layer.
 *
 * Validates product data, enforces lifecycle rules, and provides
 * pure business functions that admin-service calls.
 * No UI code — no React, no server actions.
 */

import { canTransition, STANDARD_LIFECYCLE_POLICY } from '@/lib/admin/lifecycle'
import type { LifecycleStatus } from '@/lib/admin/lifecycle'
import {
  isProductSlugTaken,
  updateAdminProduct,
  type ProductAdminListRow,
} from './repository'

// ── Validation errors ─────────────────────────────────────────────────────

export type ProductValidationErrors = Partial<Record<string, string>>

export async function validateProduct(
  data:       Partial<ProductAdminListRow>,
  tenantId:   string,
  existingId?: string,
): Promise<ProductValidationErrors> {
  const errors: ProductValidationErrors = {}

  if (!String(data.name ?? '').trim()) {
    errors['name'] = 'Name is required'
  }

  const slug = String(data.slug ?? '').trim()
  if (!slug) {
    errors['slug'] = 'Slug is required'
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors['slug'] = 'Slug may only contain lowercase letters, numbers, and hyphens'
  } else if (data.campaign_id) {
    const taken = await isProductSlugTaken(data.campaign_id, slug, existingId)
    if (taken) errors['slug'] = 'A product with this slug already exists in this campaign'
  }

  if (data.price_cents !== undefined && data.price_cents !== null) {
    if (typeof data.price_cents !== 'number' || data.price_cents < 0) {
      errors['price_cents'] = 'Price must be a non-negative number'
    }
  }

  if (data.cost_cents !== undefined && data.cost_cents !== null) {
    if (typeof data.cost_cents !== 'number' || data.cost_cents < 0) {
      errors['cost_cents'] = 'Cost must be a non-negative number'
    }
  }

  if (data.publish_at && data.archive_at) {
    if (new Date(data.publish_at) >= new Date(data.archive_at)) {
      errors['archive_at'] = 'Archive date must be after publish date'
    }
  }

  if (data.minimum_qty !== undefined && data.minimum_qty !== null) {
    if (typeof data.minimum_qty !== 'number' || data.minimum_qty < 1) {
      errors['minimum_qty'] = 'Minimum quantity must be at least 1'
    }
  }

  return errors
}

// ── Lifecycle transitions ─────────────────────────────────────────────────

export async function transitionProductStatus(
  productId: string,
  tenantId:  string,
  to:        LifecycleStatus,
  current:   LifecycleStatus,
): Promise<void> {
  if (!canTransition(current, to, STANDARD_LIFECYCLE_POLICY)) {
    throw new Error(`Cannot transition product from '${current}' to '${to}'`)
  }

  const patch: Partial<ProductAdminListRow> = {
    lifecycle_status: to,
    active: to === 'published',
  }

  if (to === 'published') {
    patch.published_at = new Date().toISOString()
    patch.archived_at  = null
  } else if (to === 'archived') {
    patch.archived_at  = new Date().toISOString()
    patch.active       = false
  }

  await updateAdminProduct(productId, tenantId, patch as Parameters<typeof updateAdminProduct>[2])
}

// ── Business helpers ──────────────────────────────────────────────────────

export function hasVariants(variantCount: number): boolean {
  return variantCount > 0
}

export function hasImages(imageCount: number): boolean {
  return imageCount > 0
}

export function hasSeo(data: Pick<ProductAdminListRow, 'seo_title'>): boolean {
  return Boolean(data.seo_title?.trim())
}

export function hasCollection(data: Pick<ProductAdminListRow, 'collection_id'>): boolean {
  return Boolean(data.collection_id)
}
