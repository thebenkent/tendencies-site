'use client'

import { usePathname } from 'next/navigation'
import { useCart } from './CartContext'
import type { ClientPortalConfig } from '@/lib/portal/types'
import { resolvePortalVisual } from '@/lib/portal/visual'

export default function PortalStickyBar({
  config,
  slug,
}: {
  config: ClientPortalConfig
  slug: string
}) {
  const { itemCount } = useCart()
  const pathname = usePathname()
  const v = resolvePortalVisual(config)

  // PDP has its own sticky add bar — don't stack
  const isPDP = !!pathname?.match(/\/portal\/[^/]+\/[^/]+\/[^/]+$/)
  if (itemCount === 0 || isPDP) return null

  return (
    <div
      className="portal-sticky-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 48,
        background: v.headerBg,
        borderTop: `1px solid ${v.border}`,
        padding: '12px 20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '13px', fontWeight: 600, color: v.ink }}>
        {itemCount} item{itemCount !== 1 ? 's' : ''} in shortlist
      </span>
      <a
        href={`/portal/${slug}/cart`}
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: v.accent,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        View shortlist →
      </a>
    </div>
  )
}
