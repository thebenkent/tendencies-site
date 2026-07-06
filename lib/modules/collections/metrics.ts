/**
 * Collection metrics.
 *
 * Registered in the metrics registry at startup.
 * Surfaced on the analytics dashboard.
 */

import type { MetricDefinition } from '@/lib/admin/registry/metrics-registry'
import { findCollectionStatusCounts } from './repository'

export const collectionMetrics: MetricDefinition[] = [
  {
    key:         'collections:total',
    label:       'Total Collections',
    category:    'custom',
    format:      'number',
    priority:    100,
    description: 'All collections across all campaigns for this tenant.',
    comparable:  false,
    load: async (tenantId) => {
      const counts = await findCollectionStatusCounts(tenantId)
      return { current: counts.total }
    },
  },
  {
    key:         'collections:published',
    label:       'Published Collections',
    category:    'custom',
    format:      'number',
    priority:    110,
    description: 'Collections currently live on the storefront.',
    comparable:  false,
    load: async (tenantId) => {
      const counts = await findCollectionStatusCounts(tenantId)
      return { current: counts.published }
    },
  },
  {
    key:         'collections:draft',
    label:       'Draft Collections',
    category:    'custom',
    format:      'number',
    priority:    120,
    description: 'Collections in draft, not yet visible on the storefront.',
    comparable:  false,
    load: async (tenantId) => {
      const counts = await findCollectionStatusCounts(tenantId)
      return { current: counts.draft }
    },
  },
  {
    key:         'collections:archived',
    label:       'Archived Collections',
    category:    'custom',
    format:      'number',
    priority:    130,
    comparable:  false,
    load: async (tenantId) => {
      const counts = await findCollectionStatusCounts(tenantId)
      return { current: counts.archived }
    },
  },
]
