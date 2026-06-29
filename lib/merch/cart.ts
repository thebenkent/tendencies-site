// Cart utilities — pure functions, no React dependency.
// Cart state is localStorage-only (no server persistence until customer accounts exist).

export type CartPersonalisationItem = {
  id:         string   // merch_product_personalisation.id
  label:      string
  value:      string
  priceCents: number   // additional_price_cents
}

export type CartItem = {
  id:             string            // random UUID, unique per cart addition
  productId:      string            // campaign_product_id
  productSlug:    string
  productName:    string
  imageUrl:       string | null
  variantId:      string
  fit:            string            // '' if no fit dimension
  colour:         string
  size:           string
  qty:            number
  priceCents:     number            // base price + size surcharge (NOT personalisation)
  personalisation: CartPersonalisationItem[]
}

const CART_VERSION = 1

export function cartKey(tenantSlug: string, campaignSlug: string): string {
  return `merch_cart_${tenantSlug}_${campaignSlug}`
}

export function getCart(key: string): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (parsed?.version !== CART_VERSION || !Array.isArray(parsed.items)) return []
    return parsed.items as CartItem[]
  } catch {
    return []
  }
}

function saveCart(key: string, items: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify({ version: CART_VERSION, items }))
}

export function addToCart(key: string, incoming: Omit<CartItem, 'id'>): CartItem {
  const items = getCart(key)
  // Merge with existing item if same variant + same personalisation values
  const existing = items.find(
    (i) =>
      i.variantId === incoming.variantId &&
      JSON.stringify(i.personalisation) === JSON.stringify(incoming.personalisation),
  )
  if (existing) {
    existing.qty += incoming.qty
    saveCart(key, items)
    return existing
  }
  const newItem: CartItem = { ...incoming, id: crypto.randomUUID() }
  saveCart(key, [...items, newItem])
  return newItem
}

export function updateItemQty(key: string, itemId: string, qty: number): void {
  const items = getCart(key)
  const item = items.find((i) => i.id === itemId)
  if (item) item.qty = Math.max(1, Math.min(20, qty))
  saveCart(key, items)
}

export function removeItem(key: string, itemId: string): void {
  saveCart(key, getCart(key).filter((i) => i.id !== itemId))
}

export function clearCart(key: string): void {
  if (typeof window !== 'undefined') localStorage.removeItem(key)
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const personCents = item.personalisation.reduce((s, p) => s + p.priceCents, 0)
    return sum + (item.priceCents + personCents) * item.qty
  }, 0)
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0)
}

export function cartLineTotal(item: CartItem): number {
  const personCents = item.personalisation.reduce((s, p) => s + p.priceCents, 0)
  return (item.priceCents + personCents) * item.qty
}
