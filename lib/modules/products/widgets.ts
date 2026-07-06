/**
 * Product dashboard widgets.
 *
 * Registered with the widget registry at startup.
 * Each widget is a lightweight component shown on the admin dashboard.
 */

import type { DashboardWidget } from '@/lib/admin/registry/widget-registry'
import { Permissions } from '@/lib/admin/permissions'

// Widget components are lightweight stubs.
// Real implementations query findProductStatusCounts() and render counts.

import { findProductStatusCounts } from './repository'

async function ProductsPublishedWidget({ tenantId }: { tenantId: string; tenantSlug: string }) {
  const { published } = await findProductStatusCounts(tenantId).catch(() => ({ published: 0 }))
  // This runs as a React Server Component. Return value is a React element.
  // Using the JSX string pattern below since this is a .ts (not .tsx) file —
  // register as a function component; the dashboard renders it.
  return { type: 'stat', value: published, label: 'Published Products' } as unknown as null
}

async function ProductsDraftWidget({ tenantId }: { tenantId: string; tenantSlug: string }) {
  const { draft } = await findProductStatusCounts(tenantId).catch(() => ({ draft: 0 }))
  return { type: 'stat', value: draft, label: 'Draft Products' } as unknown as null
}

async function ProductsMissingImagesWidget({ tenantId }: { tenantId: string; tenantSlug: string }) {
  const { findProductsByTenant } = await import('./repository')
  const products = await findProductsByTenant(tenantId).catch(() => [])
  const missing = products.filter((p) => p.image_count === 0).length
  return { type: 'stat', value: missing, label: 'Missing Images' } as unknown as null
}

export const productWidgets: DashboardWidget[] = [
  {
    id:         'products:published',
    location:   'metrics',
    priority:   100,
    size:       '1/4',
    component:  ProductsPublishedWidget as DashboardWidget['component'],
    permission: Permissions.PRODUCTS_VIEW,
  },
  {
    id:         'products:draft',
    location:   'metrics',
    priority:   110,
    size:       '1/4',
    component:  ProductsDraftWidget as DashboardWidget['component'],
    permission: Permissions.PRODUCTS_VIEW,
  },
  {
    id:         'products:missing-images',
    location:   'metrics',
    priority:   120,
    size:       '1/4',
    component:  ProductsMissingImagesWidget as DashboardWidget['component'],
    permission: Permissions.PRODUCTS_VIEW,
  },
]
