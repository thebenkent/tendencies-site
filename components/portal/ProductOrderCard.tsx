import type { CSSProperties } from 'react'
import type { PortalProduct, PortalCategory, PortalVisualTokens } from '@/lib/portal/types'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(cents / 100)
}

export default function ProductOrderCard({
  product,
  category,
  slug,
  visual: v,
}: {
  product: PortalProduct
  category: PortalCategory
  slug: string
  visual: PortalVisualTokens
}) {
  const displayImage = product.colours?.[0]?.image ?? product.image

  return (
    <a
      href={`/portal/${slug}/${category.slug}/${product.slug}`}
      className="portal-product-card"
      style={{
        display: 'block',
        background: v.panel,
        border: `1px solid ${v.border}`,
        textDecoration: 'none',
        borderRadius: '8px',
        overflow: 'hidden',
        '--portal-accent': v.accent,
      } as CSSProperties}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
          background: v.imageWell,
        }}
      >
        <img
          src={displayImage}
          alt={product.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '8% 10%',
            transition: 'transform 0.4s ease',
          }}
        />
        {product.requiresStaffName && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: v.ink,
              background: 'rgba(34,44,61,0.88)',
              padding: '6px 10px',
              border: `1px solid ${v.accentSecondary}`,
              borderRadius: '3px',
            }}
          >
            Personalised
          </span>
        )}
      </div>

      <div style={{ padding: '16px 18px 20px' }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: v.ink,
            lineHeight: 1.3,
            marginBottom: '6px',
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: v.inkMuted,
            marginBottom: '14px',
          }}
        >
          {fmt(product.priceCents)}
          <span style={{ marginLeft: '8px', opacity: 0.7 }}>
            · {product.leadWeeks[0]}–{product.leadWeeks[1]}wk lead
          </span>
        </div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: v.accent,
          }}
        >
          View & configure →
        </div>
      </div>
    </a>
  )
}
