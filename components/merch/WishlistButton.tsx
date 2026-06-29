'use client'

import { useState, useEffect } from 'react'
import { createWishlistService } from '@/lib/merch/wishlist'

type Props = {
  productId:    string
  tenantSlug:   string
  campaignSlug: string
  accentColor:  string
  size?:        'sm' | 'md'
}

export default function WishlistButton({
  productId, tenantSlug, campaignSlug, accentColor, size = 'md',
}: Props) {
  const [wishlisted, setWishlisted] = useState(false)
  const [mounted,    setMounted]    = useState(false)
  const [animating,  setAnimating]  = useState(false)

  useEffect(() => {
    const svc = createWishlistService(tenantSlug, campaignSlug)
    setWishlisted(svc.has(productId))
    setMounted(true)
  }, [productId, tenantSlug, campaignSlug])

  const dim = size === 'sm' ? 32 : 40

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const svc = createWishlistService(tenantSlug, campaignSlug)
    if (wishlisted) {
      svc.remove(productId)
      setWishlisted(false)
    } else {
      svc.add(productId)
      setWishlisted(true)
      setAnimating(true)
      setTimeout(() => setAnimating(false), 400)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={wishlisted}
      style={{
        width: `${dim}px`, height: `${dim}px`,
        borderRadius: '50%', border: 'none', padding: 0,
        background: wishlisted ? accentColor : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        transform: animating ? 'scale(1.25)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s',
        fontSize: size === 'sm' ? '14px' : '16px',
        opacity: mounted ? 1 : 0,
      }}
    >
      {wishlisted
        ? <span style={{ color: '#fff' }}>♥</span>
        : <span style={{ color: '#94A3B8' }}>♡</span>}
    </button>
  )
}
