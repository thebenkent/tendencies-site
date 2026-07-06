/**
 * Product metrics.
 *
 * Registered with the metrics registry at startup.
 * Loaded on demand by the metrics panel and dashboard.
 */

import type { MetricDefinition } from '@/lib/admin/registry/metrics-registry'

export const productMetrics: MetricDefinition[] = [
  {
    key:         'products:average-price',
    label:       'Avg. Product Price',
    category:    'custom',
    format:      'currency',
    currency:    'NZD',
    priority:    100,
    description: 'Average sell price across all products for this tenant',
    comparable:  false,
    load: async (tenantId) => {
      const { findProductsByTenant } = await import('./repository')
      const rows = await findProductsByTenant(tenantId)
      if (!rows.length) return { current: 0 }
      const total = rows.reduce((s, r) => s + r.price_cents, 0)
      return { current: Math.round(total / rows.length) / 100 }
    },
  },
  {
    key:         'products:active',
    label:       'Active Products',
    category:    'custom',
    format:      'number',
    priority:    110,
    description: 'Products with lifecycle status = published',
    comparable:  false,
    load: async (tenantId) => {
      const { findProductStatusCounts } = await import('./repository')
      const { published } = await findProductStatusCounts(tenantId)
      return { current: published }
    },
  },
  {
    key:         'products:draft',
    label:       'Draft Products',
    category:    'custom',
    format:      'number',
    priority:    120,
    description: 'Products not yet published',
    comparable:  false,
    load: async (tenantId) => {
      const { findProductStatusCounts } = await import('./repository')
      const { draft } = await findProductStatusCounts(tenantId)
      return { current: draft }
    },
  },
  {
    key:         'products:without-variants',
    label:       'Products Without Variants',
    category:    'custom',
    format:      'number',
    priority:    130,
    description: 'Products that have no size or colour variants defined',
    comparable:  false,
    load: async (tenantId) => {
      const { findProductsByTenant } = await import('./repository')
      const rows = await findProductsByTenant(tenantId)
      const count = rows.filter((r) => r.variant_count === 0).length
      return { current: count }
    },
  },
]
