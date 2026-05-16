import type { ClientPortalConfig } from './types'
import EDGE_CITY from './clients/edge-city'
import HIREPOOL from './clients/hirepool'

const CLIENTS: Record<string, ClientPortalConfig> = {
  'edge-city': EDGE_CITY,
  'hirepool': HIREPOOL,
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

export function getProductById(
  config: ClientPortalConfig,
  productId: string,
) {
  for (const category of config.categories) {
    const product = category.products.find((p) => p.id === productId)
    if (product) return product
  }
  return null
}

