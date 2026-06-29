// CartRepository: interface + LocalStorageCartRepository implementation.
//
// All UI code communicates with CartRepository, not with cart.ts directly.
// To swap to a server-side cart (e.g. SupabaseCartRepository), change the
// defaultCartRepository export — no UI code changes required.

import type { CartItem } from './cart'
import {
  getCart, addToCart, updateItemQty, removeItem, clearCart,
} from './cart'

export interface CartRepository {
  getItems(key: string): CartItem[]
  addItem(key: string, item: Omit<CartItem, 'id'>): CartItem
  updateQty(key: string, id: string, qty: number): void
  removeItem(key: string, id: string): void
  clear(key: string): void
}

class LocalStorageCartRepository implements CartRepository {
  getItems(key: string): CartItem[] {
    return getCart(key)
  }
  addItem(key: string, item: Omit<CartItem, 'id'>): CartItem {
    return addToCart(key, item)
  }
  updateQty(key: string, id: string, qty: number): void {
    updateItemQty(key, id, qty)
  }
  removeItem(key: string, id: string): void {
    removeItem(key, id)
  }
  clear(key: string): void {
    clearCart(key)
  }
}

// Singleton: swap this export to change the underlying storage mechanism.
export const defaultCartRepository: CartRepository = new LocalStorageCartRepository()
