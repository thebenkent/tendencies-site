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

export type ClientPortalConfig = {
  slug: string
  clientName: string
  portalTitle: string
  logo?: PortalLogo
  logoText?: string
  logoUrl?: string
  accentColor: string
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
