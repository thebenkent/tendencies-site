'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { CartItem, CartState } from '@/lib/portal/types'

const CartContext = createContext<CartState | null>(null)

export function CartProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const storageKey = `cart_${slug}`
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setHydrated(true)
  }, [storageKey])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(storageKey, JSON.stringify(items))
    }
  }, [items, storageKey, hydrated])

  function addItem(item: Omit<CartItem, 'id'>) {
    setItems((prev) => [...prev, { ...item, id: Math.random().toString(36).slice(2) }])
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQuantity(id: string, qty: number) {
    if (qty < 1) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
  }

  function clearCart() {
    setItems([])
    try {
      localStorage.removeItem(storageKey)
    } catch {}
  }

  const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalCents, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
