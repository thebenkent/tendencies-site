import type { ClientPortalConfig } from './types'
import EDGE_CITY from './clients/edge-city'

const CLIENTS: Record<string, ClientPortalConfig> = {
  'edge-city': EDGE_CITY,
  // Add new clients here:
  // 'client-slug': CLIENT_CONFIG,
}

export function getPortalConfig(slug: string): ClientPortalConfig | null {
  return CLIENTS[slug] ?? null
}

export function getPortalCategory(config: ClientPortalConfig, categorySlug: string) {
  return config.categories.find((c) => c.slug === categorySlug) ?? null
}

export function getPortalProduct(
  config: ClientPortalConfig,
  categorySlug: string,
  productSlug: string,
) {
  const cat = getPortalCategory(config, categorySlug)
  return cat?.products.find((p) => p.slug === productSlug) ?? null
}
