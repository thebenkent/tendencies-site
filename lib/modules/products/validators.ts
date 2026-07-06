/**
 * Product validation rules.
 *
 * Registered via validationExtension() in the EntityDefinition.
 * All validators run before every save (create + update).
 * 'error' severity blocks save; 'warning' allows save but shows the issue.
 */

import type { ValidatorContribution } from '@/lib/admin/extensions/definition'

// ── Errors (block save) ───────────────────────────────────────────────────

const nameRequired: ValidatorContribution = {
  id:    'products:name-required',
  label: 'Name required',
  validate: async (data) => {
    if (!String(data['name'] ?? '').trim()) {
      return [{ field: 'name', message: 'Product name is required', severity: 'error' }]
    }
    return []
  },
}

const slugFormat: ValidatorContribution = {
  id:    'products:slug-format',
  label: 'Slug format',
  validate: async (data) => {
    const slug = String(data['slug'] ?? '').trim()
    if (!slug) {
      return [{ field: 'slug', message: 'Slug is required', severity: 'error' }]
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return [{ field: 'slug', message: 'Slug may only contain lowercase letters, numbers, and hyphens', severity: 'error' }]
    }
    return []
  },
}

const priceValid: ValidatorContribution = {
  id:    'products:price-valid',
  label: 'Valid price',
  validate: async (data) => {
    const price = data['price_cents']
    if (price !== null && price !== undefined && price !== '') {
      const n = Number(price)
      if (isNaN(n) || n < 0) {
        return [{ field: 'price_cents', message: 'Price must be a non-negative number', severity: 'error' }]
      }
    }
    return []
  },
}

const dateRange: ValidatorContribution = {
  id:    'products:date-range',
  label: 'Scheduling date range',
  validate: async (data) => {
    const pa = data['publish_at']
    const aa = data['archive_at']
    if (pa && aa && new Date(String(pa)) >= new Date(String(aa))) {
      return [{ field: 'archive_at', message: 'Archive date must be after publish date', severity: 'error' }]
    }
    return []
  },
}

// ── Warnings (allow save, show in ValidationSummary) ──────────────────────

const noImages: ValidatorContribution = {
  id:    'products:no-images',
  label: 'Product images',
  when: 'update',
  validate: async (data) => {
    if (!Number(data['image_count'] ?? 0)) {
      return [{ message: 'No images uploaded. Products without images have lower conversion.', severity: 'warning' }]
    }
    return []
  },
}

const noVariants: ValidatorContribution = {
  id:    'products:no-variants',
  label: 'Product variants',
  when: 'update',
  validate: async (data) => {
    if (!Number(data['variant_count'] ?? 0)) {
      return [{ message: 'No variants defined. Customers will not be able to select size or colour.', severity: 'warning' }]
    }
    return []
  },
}

const noCollection: ValidatorContribution = {
  id:    'products:no-collection',
  label: 'Collection assignment',
  when: 'update',
  validate: async (data) => {
    if (!data['collection_id']) {
      return [{ field: 'collection_id', message: 'Product is not assigned to a collection', severity: 'warning' }]
    }
    return []
  },
}

const missingSeo: ValidatorContribution = {
  id:    'products:missing-seo',
  label: 'SEO title',
  when: 'update',
  validate: async (data) => {
    if (!String(data['seo_title'] ?? '').trim()) {
      return [{ field: 'seo_title', message: 'No SEO title set. Add one for better search visibility.', severity: 'warning' }]
    }
    return []
  },
}

// ── Export ────────────────────────────────────────────────────────────────

export const productValidators: ValidatorContribution[] = [
  nameRequired,
  slugFormat,
  priceValid,
  dateRange,
  noImages,
  noVariants,
  noCollection,
  missingSeo,
]
