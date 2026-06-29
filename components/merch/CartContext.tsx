'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  type CartItem,
  cartKey, getCart, addToCart, updateItemQty, removeItem, clearCart,
  cartTotal, cartItemCount,
} from '@/lib/merch/cart'

type CartContextValue = {
  items:     CartItem[]
  count:     number
  total:     number
  key:       string
  add:       (item: Omit<CartItem, 'id'>) => CartItem
  setQty:    (id: string, qty: number) => void
  remove:    (id: string) => void
  clear:     () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({
  tenantSlug,
  campaignSlug,
  children,
}: {
  tenantSlug:   string
  campaignSlug: string
  children:     React.ReactNode
}) {
  const key = cartKey(tenantSlug, campaignSlug)
  const [items, setItems] = useState<CartItem[]>([])

  // Hydrate from localStorage on mount (avoids SSR mismatch)
  useEffect(() => {
    setItems(getCart(key))
  }, [key])

  const add = useCallback((incoming: Omit<CartItem, 'id'>): CartItem => {
    const newItem = addToCart(key, incoming)
    setItems(getCart(key))
    return newItem
  }, [key])

  const setQty = useCallback((id: string, qty: number) => {
    updateItemQty(key, id, qty)
    setItems(getCart(key))
  }, [key])

  const remove = useCallback((id: string) => {
    removeItem(key, id)
    setItems(getCart(key))
  }, [key])

  const clear = useCallback(() => {
    clearCart(key)
    setItems([])
  }, [key])

  return (
    <CartContext.Provider value={{
      items,
      count: cartItemCount(items),
      total: cartTotal(items),
      key,
      add, setQty, remove, clear,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

// Standalone badge component — shows cart item count.
// Works anywhere inside CartProvider.
export function CartBadge({
  slug,
  campaignSlug,
  primaryColor,
  accentColor,
}: {
  slug:         string
  campaignSlug: string
  primaryColor: string
  accentColor:  string
}) {
  const { count } = useCart()
  return (
    <a
      href={`/merch/${slug}/${campaignSlug}/cart`}
      aria-label={`Shopping cart, ${count} item${count !== 1 ? 's' : ''}`}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        gap: '6px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
        fontSize: '13px', fontWeight: 600, padding: '6px 12px',
        borderRadius: '8px',
        background: count > 0 ? `${accentColor}22` : 'transparent',
        border: count > 0 ? `1px solid ${accentColor}66` : '1px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span style={{
          background: accentColor, color: '#fff', fontSize: '10px', fontWeight: 800,
          minWidth: '18px', height: '18px', borderRadius: '999px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 5px', lineHeight: 1,
        }}>
          {count > 99 ? '99+' : count}
        </span>
      )}
      {count === 0 && <span>Cart</span>}
    </a>
  )
}
