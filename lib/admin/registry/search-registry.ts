/**
 * Search Provider Registry.
 *
 * The command palette aggregates results from all registered providers.
 * Each provider is responsible for one domain (campaigns, products, orders…).
 *
 * Providers are async — they can hit a DB or API when needed.
 * For keyboard-speed results, providers should cache or debounce internally.
 */

import type { ReactNode } from 'react'

export type SearchResult = {
  id:          string
  label:       string
  description?: string
  url:         string                   // navigate to on select
  group:       string                   // display grouping in palette
  icon?:       ReactNode
  badge?:      string                   // e.g. "draft", "open"
  badgeVariant?: 'default' | 'success' | 'warning' | 'error'
  action?:     () => void              // alternative to URL navigation
  keywords?:   string[]
}

export type SearchProvider = {
  /** Unique key — matches entity/module key */
  key:      string
  /** Human-readable group label in results */
  label:    string
  /** Priority — lower shows first in results */
  priority: number
  /** Async search function — receives trimmed query, returns results */
  search:   (query: string, tenantSlug: string) => Promise<SearchResult[]>
  /** Static nav results shown when query is empty (navigation shortcuts) */
  navItems?: (tenantSlug: string) => SearchResult[]
}

class SearchRegistry {
  private readonly _providers = new Map<string, SearchProvider>()

  register(provider: SearchProvider): this {
    this._providers.set(provider.key, provider)
    return this
  }

  unregister(key: string): this {
    this._providers.delete(key)
    return this
  }

  getProviders(): SearchProvider[] {
    return Array.from(this._providers.values())
      .sort((a, b) => a.priority - b.priority)
  }

  /** Search all providers in parallel. Aggregates and sorts by provider priority. */
  async search(query: string, tenantSlug: string): Promise<SearchResult[]> {
    const providers = this.getProviders()
    const results = await Promise.allSettled(
      providers.map((p) => p.search(query, tenantSlug)),
    )
    return results.flatMap((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`[SearchRegistry] provider "${providers[i].key}" failed:`, r.reason)
        return []
      }
      return r.value
    })
  }

  /** Nav-only results (no query) — synchronous, instant. */
  navItems(tenantSlug: string): SearchResult[] {
    return this.getProviders()
      .flatMap((p) => p.navItems?.(tenantSlug) ?? [])
  }
}

export const searchRegistry = new SearchRegistry()

export function registerSearchProvider(provider: SearchProvider) {
  searchRegistry.register(provider)
}
