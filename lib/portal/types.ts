export type PortalColour = {
  name: string
  hex?: string
  image?: string
}

export type PortalSizeChartRow = {
  label: string
  values: string[]
}

export type PortalSizeChart = {
  type: 'mens' | 'womens'
  headers: string[]
  rows: PortalSizeChartRow[]
}

export type PortalBrandPillar = {
  title: string
  description: string
}

export type PortalBrandStory = {
  headline: string
  body: string
  pillars?: PortalBrandPillar[]
}

export type PortalFeaturedCollection = {
  id: string
  title: string
  subtitle: string
  categorySlug: string
  productIds: string[]
}

export type PortalOrderHistoryEntry = {
  orderRef: string
  date: string
  client?: string
  qty: number
  unitPriceCents: number
  totalCents: number
  notes?: string
}

export type PortalProduct = {
  id: string
  name: string
  slug: string
  description: string
  image: string
  images?: string[]
  categoryId: string
  sizes: string[]
  colours?: PortalColour[]
  decorationMethod: string
  leadWeeks: [number, number]
  priceCents: number
  requiresStaffName: boolean
  sku?: string
  measureGuide?: string
  sizeChart?: PortalSizeChart
  moq?: number
  material?: string
  tags?: string[]
  orderHistory?: PortalOrderHistoryEntry[]
}

export type PortalCategory = {
  id: string
  slug: string
  name: string
  description: string
  image: string
  products: PortalProduct[]
}

export type PortalDeliveryOption = {
  id: string
  label: string
  address?: string
}

export type PortalLogo =
  | { type: 'image'; src: string; alt: string }
  | { type: 'text'; text: string }

/** Optional per-client palette; see `lib/portal/visual.ts` defaults. */
export type PortalVisualTokens = {
  canvas: string
  /** Alternating section background (e.g. warm off-white). */
  warmSection: string
  panel: string
  panelElevated: string
  ink: string
  inkMuted: string
  inkFaint: string
  border: string
  imageWell: string
  accent: string
  accentSecondary: string
  limeSpot: string
  headerBg: string
  warmInk: string
  warmInkMuted: string
  warmBorder: string
  cardOnWarm: string
}

export type PortalUiCopy = {
  heroPrimaryCta?: string
  heroSecondaryCta?: string
  collectionEyebrow?: string
  collectionViewAll?: string
  /** Micro-CTA on homepage featured kit cards (links to PDP). */
  featuredPieceCta?: string
  categoryIntroEyebrow?: string
  categoryIntroTitle?: string
  addToShortlist?: string
  addedToShortlist?: string
  viewShortlist?: string
  cartNavLabel?: string
}

export type ClientPortalConfig = {
  slug: string
  clientName: string
  portalTitle: string
  logo?: PortalLogo
  logoText?: string
  logoUrl?: string
  accentColor: string
  visualTokens?: Partial<PortalVisualTokens>
  uiCopy?: PortalUiCopy
  hero: {
    image?: string
    tagline: string
    subtitle: string
  }
  categories: PortalCategory[]
  brandStory?: PortalBrandStory
  featuredCollections?: PortalFeaturedCollection[]
  ordering: {
    requiresStaffName: boolean
    requiresDeliveryAddress: boolean
    deliveryOptions: PortalDeliveryOption[]
    orderNote?: string
  }
  contact: {
    manager: string
    email: string
    phone?: string
  }
  emails: {
    internalTo: string
    clientTo?: string
  }
}

export type CartItem = {
  id: string
  productId: string
  categoryId: string
  productName: string
  categoryName: string
  size: string
  colour?: string
  staffName?: string
  quantity: number
  priceCents: number
}

export type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  totalCents: number
  itemCount: number
}
