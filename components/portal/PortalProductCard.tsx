'use client'

import type { PortalProduct } from '@/lib/portal/types'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(cents / 100)
}

export default function PortalProductCard({
  product,
  slug,
  categorySlug,
}: {
  product: PortalProduct
  slug: string
  categorySlug: string
}) {
  return (
    <a
      href={`/portal/${slug}/${categorySlug}/${product.slug}`}
      style={{
        display: 'block',
        background: '#0f0f0f',
        border: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'border-color 0.25s ease, transform 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
        if (img) img.style.transform = 'scale(1.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.transform = 'translateY(0)'
        const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
        if (img) img.style.transform = 'scale(1)'
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4/3',
          overflow: 'hidden',
          background: '#151515',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.72)',
            transition: 'transform 0.4s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(8,8,8,0.8) 0%, transparent 60%)',
          }}
        />
        {product.requiresStaffName && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#b8f400',
              background: 'rgba(8,8,8,0.85)',
              padding: '4px 8px',
              border: '1px solid rgba(184,244,0,0.3)',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            Personalised
          </div>
        )}
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#f5f5f0',
            marginBottom: '4px',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.38)',
            letterSpacing: '0.08em',
            marginBottom: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          {product.decorationMethod} · {product.leadWeeks[0]}–{product.leadWeeks[1]}wk lead
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#f5f5f0',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            {fmt(product.priceCents)}
          </span>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#b8f400',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            Order →
          </span>
        </div>
      </div>
    </a>
  )
}
