// Wishlist architecture — storage-agnostic interface with localStorage implementation.
// Swap defaultWishlistService export for server-side persistence without touching UI.

export interface WishlistService {
  add(productId: string): void
  remove(productId: string): void
  has(productId: string): boolean
  getAll(): string[]
  clear(): void
}

function wishlistKey(tenantSlug: string, campaignSlug: string): string {
  return `merch_wishlist_${tenantSlug}_${campaignSlug}`
}

class LocalStorageWishlistService implements WishlistService {
  constructor(private readonly key: string) {}

  private getIds(): string[] {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(this.key) ?? '[]') as string[]
    } catch {
      return []
    }
  }

  private save(ids: string[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.key, JSON.stringify(ids))
  }

  add(productId: string): void {
    const ids = this.getIds()
    if (!ids.includes(productId)) this.save([...ids, productId])
  }

  remove(productId: string): void {
    this.save(this.getIds().filter((id) => id !== productId))
  }

  has(productId: string): boolean {
    return this.getIds().includes(productId)
  }

  getAll(): string[] {
    return this.getIds()
  }

  clear(): void {
    this.save([])
  }
}

export function createWishlistService(
  tenantSlug: string,
  campaignSlug: string,
): WishlistService {
  return new LocalStorageWishlistService(wishlistKey(tenantSlug, campaignSlug))
}
