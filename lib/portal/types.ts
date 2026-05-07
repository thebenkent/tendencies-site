export type PortalColour = {
  name: string
  hex: string
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

export type ClientPortalConfig = {
  slug: string
  clientName: string
  portalTitle: string
  logoText?: string
  logoUrl?: string
  accentColor: string
  hero: {
    image?: string
    tagline: string
    subtitle: string
  }
  categories: PortalCategory[]
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
