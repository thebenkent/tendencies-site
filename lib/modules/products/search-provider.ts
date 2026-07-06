/**
 * Product search provider.
 *
 * Registered with the global search registry at startup.
 * Powers the command palette and global search bar.
 * Searches by name, SKU, slug, and supplier SKU.
 */

import type { SearchProvider, SearchResult } from '@/lib/admin/registry/search-registry'
import { searchProductsByTenant } from './repository'

export const productSearchProvider: SearchProvider = {
  key:      'products',
  label:    'Products',
  priority: 25,

  async search(query: string, tenantSlug: string): Promise<SearchResult[]> {
    const { getTenant } = await import('@/lib/merch/db')
    const tenant = await getTenant(tenantSlug).catch(() => null)
    if (!tenant) return []

    const products = await searchProductsByTenant(tenant.id, query, 8)

    return products.map((p) => ({
      id:           `product:${p.id}`,
      label:        p.name,
      description:  [p.sku, p.campaign_name].filter(Boolean).join(' · '),
      url:          `/merch/${tenantSlug}/admin/products`,
      group:        'Products',
      badge:        p.lifecycle_status,
      badgeVariant: p.lifecycle_status === 'published' ? 'success'
        : p.lifecycle_status === 'archived' ? 'default'
        : 'warning',
      keywords:     [p.slug, p.sku ?? '', p.campaign_name ?? ''].filter(Boolean),
    }))
  },

  navItems(tenantSlug: string): SearchResult[] {
    return [
      {
        id:    'nav:products',
        label: 'Products',
        url:   `/merch/${tenantSlug}/admin/products`,
        group: 'Navigate',
      },
    ]
  },
}
