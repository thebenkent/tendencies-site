/**
 * Collection search provider.
 *
 * Registered in the search registry so the command palette
 * and relation pickers can find collections by name and slug.
 */

import type { SearchProvider, SearchResult } from '@/lib/admin/registry/search-registry'
import { searchCollectionsByTenant } from './repository'

export const collectionSearchProvider: SearchProvider = {
  key:      'collections',
  label:    'Collections',
  priority: 20,

  async search(query: string, tenantSlug: string): Promise<SearchResult[]> {
    const { getTenant } = await import('@/lib/merch/db')
    const tenant = await getTenant(tenantSlug).catch(() => null)
    if (!tenant) return []

    const collections = await searchCollectionsByTenant(tenant.id, query, 8)

    return collections.map((c) => ({
      id:          `collection:${c.id}`,
      label:       c.name,
      description: c.campaign_name ? `Campaign: ${c.campaign_name}` : c.slug,
      url:         `/merch/${tenantSlug}/admin/collections`,
      group:       'Collections',
      badge:       c.lifecycle_status === 'published' ? 'Published'
                 : c.lifecycle_status === 'draft'     ? 'Draft'
                 : c.lifecycle_status,
      badgeVariant: c.lifecycle_status === 'published' ? 'success' : 'default',
      keywords:    [c.slug, c.lifecycle_status, c.campaign_name],
    }))
  },

  navItems(tenantSlug: string): SearchResult[] {
    return [
      {
        id:    'nav:collections',
        label: 'Collections',
        url:   `/merch/${tenantSlug}/admin/collections`,
        group: 'Navigate',
      },
    ]
  },
}
