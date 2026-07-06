/**
 * Product CSV importer / exporter definitions.
 *
 * Registered via registerImporter / registerExporter at startup.
 * Stub implementations — real parsing/import logic to be added per client.
 */

import type { Importer, Exporter } from '@/lib/admin/importexport'

// ── CSV Row type ──────────────────────────────────────────────────────────

export type ProductCsvRow = {
  name:            string
  slug:            string
  sku:             string
  campaign_id:     string
  collection_id:   string
  price_cents:     string   // numeric string
  minimum_qty:     string
  lead_time_days:  string
  currency:        string
  description:     string
  active:          string   // 'true' | 'false'
  tags:            string   // comma-separated
  seo_title:       string
  seo_description: string
}

// ── Importer ──────────────────────────────────────────────────────────────

export const productCsvImporter: Importer<ProductCsvRow> = {
  key:            'products_csv',
  label:          'Products',
  description:    'Import products from a CSV file.',
  entity:         'products',
  formats:        ['csv'],
  maxRowsPreview: 20,

  async parse(file) {
    const text    = file instanceof File ? await file.text() : file.toString()
    const lines   = text.trim().split('\n')
    const headers = lines[0]?.split(',').map((h) => h.trim()) ?? []
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim())
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])) as ProductCsvRow
    })
  },

  async validate(rows) {
    const errors = rows.flatMap((row, i) => {
      const e: { row: number; field: string; message: string }[] = []
      if (!row.name)        e.push({ row: i + 2, field: 'name',        message: 'Name is required' })
      if (!row.slug)        e.push({ row: i + 2, field: 'slug',        message: 'Slug is required' })
      if (!row.campaign_id) e.push({ row: i + 2, field: 'campaign_id', message: 'Campaign ID is required' })
      if (!row.price_cents || isNaN(Number(row.price_cents))) {
        e.push({ row: i + 2, field: 'price_cents', message: 'Price must be a number' })
      }
      return e
    })
    return { valid: errors.length === 0, errors }
  },

  async preview(rows) {
    return {
      totalRows:   rows.length,
      previewRows: rows.slice(0, 20),
      warnings:    [],
    }
  },

  async import(_rows, _tenantId, _userId) {
    return { created: 0, updated: 0, skipped: 0, errors: [] }
  },
}

// ── Exporter ──────────────────────────────────────────────────────────────

type ProductExportRow = {
  id:              string
  name:            string
  slug:            string
  sku:             string
  campaign_id:     string
  campaign_name:   string
  lifecycle_status: string
  price_cents:     number
  cost_cents:      number | null
  currency:        string
  minimum_qty:     number
  lead_time_days:  number | null
  active:          boolean
  featured:        boolean
  variant_count:   number
  seo_title:       string
  seo_description: string
  tags:            string
  created_at:      string
  updated_at:      string
}

export const productCsvExporter: Exporter<ProductExportRow> = {
  key:     'products_csv',
  label:   'Products (CSV)',
  entity:  'products',
  formats: ['csv'],

  async extract(_filters, tenantId) {
    const { findProductsByTenant } = await import('./repository')
    const rows = await findProductsByTenant(tenantId)
    return rows.map((r) => ({
      id:               r.id,
      name:             r.name,
      slug:             r.slug,
      sku:              r.sku ?? '',
      campaign_id:      r.campaign_id,
      campaign_name:    r.campaign_name ?? '',
      lifecycle_status: r.lifecycle_status,
      price_cents:      r.price_cents,
      cost_cents:       r.cost_cents,
      currency:         r.currency,
      minimum_qty:      r.minimum_qty,
      lead_time_days:   r.lead_time_days,
      active:           r.active,
      featured:         r.featured,
      variant_count:    r.variant_count,
      seo_title:        r.seo_title ?? '',
      seo_description:  r.seo_description ?? '',
      tags:             r.tags.join(','),
      created_at:       r.created_at,
      updated_at:       r.updated_at ?? '',
    }))
  },

  async serialise(rows, _format) {
    if (!rows.length) return ''
    const headers = Object.keys(rows[0] as object) as (keyof ProductExportRow)[]
    const lines   = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
    ]
    return lines.join('\n')
  },
}
