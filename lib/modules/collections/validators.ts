/**
 * Collection extension validators.
 *
 * Registered via validationExtension() in definition.tsx.
 * Run automatically by the runtime before every save.
 * 'error' severity blocks save. 'warning' is informational.
 */

import type { ValidatorContribution, ValidationIssue } from '@/lib/admin/extensions/definition'
import { hasProducts, hasHeroImage } from './service'

// ── Required name ─────────────────────────────────────────────────────────

const nameRequired: ValidatorContribution = {
  id:    'collections:name-required',
  label: 'Name required',
  validate: async (data) => {
    if (!String(data['name'] ?? '').trim()) {
      return [{ field: 'name', message: 'Name is required', severity: 'error' }]
    }
    return []
  },
}

// ── Valid slug ────────────────────────────────────────────────────────────

const slugFormat: ValidatorContribution = {
  id:    'collections:slug-format',
  label: 'Slug format',
  validate: async (data) => {
    const slug = String(data['slug'] ?? '').trim()
    if (!slug) return [{ field: 'slug', message: 'Slug is required', severity: 'error' }]
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return [{
        field:    'slug',
        message:  'Slug may only contain lowercase letters, numbers, and hyphens',
        severity: 'error',
      }]
    }
    return []
  },
}

// ── Valid publish / archive dates ─────────────────────────────────────────

const dateRange: ValidatorContribution = {
  id:    'collections:date-range',
  label: 'Date range',
  validate: async (data) => {
    const pub = data['publish_at'] as string | undefined
    const arc = data['archive_at'] as string | undefined
    if (pub && arc && pub >= arc) {
      return [{
        field:    'archive_at',
        message:  'Archive date must be after publish date',
        severity: 'error',
      }]
    }
    return []
  },
}

// ── Hero image present (warning only) ────────────────────────────────────

const heroImagePresent: ValidatorContribution = {
  id:    'collections:hero-image',
  label: 'Hero image',
  when:  'update',   // only warn on existing records
  validate: async (data) => {
    const id = String(data['id'] ?? '')
    if (!id) return []
    const imageUrl = data['image_url'] as string | undefined
    if (!imageUrl) {
      return [{
        field:    'image_url',
        message:  'A hero image is recommended for storefront display',
        severity: 'warning',
      }]
    }
    return []
  },
}

// ── At least one product (warning on publish) ─────────────────────────────

const atLeastOneProduct: ValidatorContribution = {
  id:    'collections:product-required',
  label: 'Products attached',
  when:  'update',
  validate: async (data) => {
    const id     = String(data['id'] ?? '')
    const status = data['status'] as string | undefined
    if (!id || status !== 'published') return []
    const ok = await hasProducts(id)
    if (!ok) {
      return [{
        message:  'Published collections should have at least one product',
        severity: 'warning',
      }]
    }
    return []
  },
}

// ── Exported list (consumed by the EntityDefinition extension) ────────────

export const collectionValidators: ValidatorContribution[] = [
  nameRequired,
  slugFormat,
  dateRange,
  heroImagePresent,
  atLeastOneProduct,
]
