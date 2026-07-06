/**
 * Collection CSV importer / exporter definitions.
 *
 * Registered via registerImporter / registerExporter at startup.
 * The runtime import/export UI discovers these automatically.
 *
 * Full parse/validate/import logic would live here in production.
 * This is the canonical stub demonstrating the pattern for future modules.
 */

import type { Importer, Exporter } from '@/lib/admin/importexport'
import type { CollectionAdminData } from './admin-service'

// ── CSV Importer ──────────────────────────────────────────────────────────

export type CollectionCsvRow = {
  name:        string
  slug:        string
  description: string
  campaign_id: string
  visible:     string   // 'true' | 'false'
  featured:    string
  seo_title:   string
  seo_description: string
  tags:        string   // comma-separated
}

export const collectionCsvImporter: Importer<CollectionCsvRow> = {
  key:         'collections_csv',
  label:       'Collections',
  description: 'Import collections from a CSV file.',
  entity:      'collections',
  formats:     ['csv'],
  maxRowsPreview: 20,

  async parse(file) {
    // Parse CSV file into CollectionCsvRow[]
    // Real implementation uses Papa Parse or csv-parse.
    const text = file instanceof File ? await file.text() : file.toString()
    const lines = text.trim().split('\n')
    const headers = lines[0]?.split(',').map((h) => h.trim()) ?? []
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim())
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])) as CollectionCsvRow
    })
  },

  async validate(rows, _tenantId) {
    const errors = rows.flatMap((row, i) => {
      const e = []
      if (!row.name)     e.push({ row: i + 2, field: 'name',     message: 'Name is required' })
      if (!row.slug)     e.push({ row: i + 2, field: 'slug',     message: 'Slug is required' })
      if (!row.campaign_id) e.push({ row: i + 2, field: 'campaign_id', message: 'Campaign ID is required' })
      return e
    })
    return { valid: errors.length === 0, errors }
  },

  async preview(rows, _tenantId) {
    return {
      totalRows: rows.length,
      previewRows: rows.slice(0, 20).map((r, i) => ({ ...r, _row: i + 2 })),
      warnings: [],
    }
  },

  async import(_rows, _tenantId, _userId) {
    // Stub — real implementation creates collections via admin service.
    return { created: 0, updated: 0, skipped: 0, errors: [] }
  },
}

// ── CSV Exporter ──────────────────────────────────────────────────────────

type CollectionExportRow = {
  id:              string
  name:            string
  slug:            string
  description:     string
  campaign_id:     string
  campaign_name:   string
  status:          string
  visible:         boolean
  featured:        boolean
  sort_order:      number
  product_count:   number
  seo_title:       string
  seo_description: string
  tags:            string
  publish_at:      string
  archive_at:      string
  created_at:      string
  updated_at:      string
}

export const collectionCsvExporter: Exporter<CollectionExportRow> = {
  key:      'collections_csv',
  label:    'Collections (CSV)',
  entity:   'collections',
  formats:  ['csv'],

  async extract(_filters, tenantId) {
    const { listCollectionsForAdmin } = await import('./admin-service')
    const rows = await listCollectionsForAdmin(tenantId)
    return rows.map((r) => ({
      id:              r.id,
      name:            r.name,
      slug:            r.slug,
      description:     r.description,
      campaign_id:     r.campaignId,
      campaign_name:   r.campaign_name,
      status:          r.status,
      visible:         r.visible,
      featured:        r.featured,
      sort_order:      r.sort_order,
      product_count:   r.product_count,
      seo_title:       r.seo_title,
      seo_description: r.seo_description,
      tags:            r.tags.join(','),
      publish_at:      r.publish_at,
      archive_at:      r.archive_at,
      created_at:      r.created_at,
      updated_at:      r.updated_at,
    }))
  },

  async serialise(rows, _format) {
    if (!rows.length) return ''
    const headers = Object.keys(rows[0] as object) as (keyof CollectionExportRow)[]
    const lines   = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
    ]
    return lines.join('\n')
  },
}
