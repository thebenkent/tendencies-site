/**
 * Campaign search provider.
 *
 * Registered in the search registry so the command palette can
 * search campaigns by name, slug, and status without any
 * entity-specific code in the palette itself.
 */

import type { SearchProvider, SearchResult } from '@/lib/admin/registry/search-registry'
import { findCampaignsByTenant } from './repository'

export const campaignSearchProvider: SearchProvider = {
  key:      'campaigns',
  label:    'Campaigns',
  priority: 10,

  async search(query: string, tenantSlug: string): Promise<SearchResult[]> {
    // Resolve tenant from slug — we need the tenantId for the DB query.
    // Import lazily to avoid circular dependencies at registration time.
    const { getTenant } = await import('@/lib/merch/db')
    const tenant = await getTenant(tenantSlug).catch(() => null)
    if (!tenant) return []

    const campaigns = await findCampaignsByTenant(tenant.id)
    const q = query.toLowerCase()

    return campaigns
      .filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q),
      )
      .slice(0, 8)
      .map((c) => ({
        id:    `campaign:${c.id}`,
        label: c.name,
        url:   `/merch/${tenantSlug}/admin/campaigns`,
        group: 'Campaigns',
        badge: c.status === 'open' ? 'Open' : c.status === 'draft' ? 'Draft' : c.status,
        badgeVariant: c.status === 'open' ? 'success' : 'default',
        keywords: [c.slug, c.status, c.campaign_type],
        description: c.slug,
      }))
  },

  navItems(tenantSlug: string): SearchResult[] {
    return [
      {
        id:    'nav:campaigns',
        label: 'Campaigns',
        url:   `/merch/${tenantSlug}/admin/campaigns`,
        group: 'Navigate',
      },
    ]
  },
}
