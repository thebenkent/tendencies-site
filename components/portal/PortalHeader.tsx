'use client'

import { useCart } from './CartContext'
import type { ClientPortalConfig } from '@/lib/portal/types'
import { resolvePortalUiCopy, resolvePortalVisual } from '@/lib/portal/visual'

export default function PortalHeader({
  config,
  slug,
}: {
  config: ClientPortalConfig
  slug: string
}) {
  const { itemCount } = useCart()
  const v = resolvePortalVisual(config)
  const ui = resolvePortalUiCopy(config)

  return (
    <div
      style={{
        background: v.headerBg,
        borderBottom: `1px solid ${v.border}`,
        padding: '0 24px',
        minHeight: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: '0',
        zIndex: 40,
      }}
    >
      <a
        href={`/portal/${slug}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          textDecoration: 'none',
          minHeight: '48px',
        }}
      >
        {config.logo?.type === 'image' ? (
          <img
            src={config.logo.src}
            alt={config.logo.alt}
            style={{ maxHeight: '40px', width: 'auto', display: 'block' }}
          />
        ) : (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: v.accent,
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            {config.logo?.type === 'text' ? config.logo.text : (config.logoText ?? config.clientName)}
          </span>
        )}
        <span
          style={{
            width: '1px',
            height: '16px',
            background: v.border,
          }}
        />
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: v.inkFaint,
          }}
        >
          {config.portalTitle}
        </span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <a
          href={`/portal/${slug}/cart`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: itemCount > 0 ? v.accent : v.inkMuted,
            transition: 'color 0.2s ease',
            fontFamily: 'Helvetica, Arial, sans-serif',
            minHeight: '48px',
            padding: '0 8px',
          }}
        >
          <span>{ui.cartNavLabel}</span>
          {itemCount > 0 && (
            <span
              style={{
                background: v.accent,
                color: '#fff',
                fontSize: '10px',
                fontWeight: 800,
                minWidth: '24px',
                height: '24px',
                padding: '0 6px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 0 2px ${v.headerBg}, 0 0 0 3px ${v.accent}66`,
              }}
            >
              {itemCount}
            </span>
          )}
        </a>

        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: v.inkFaint,
            fontFamily: 'Helvetica, Arial, sans-serif',
            display: 'none',
          }}
          className="portal-header-powered"
        >
          Powered by Tendencies
        </span>
      </div>
    </div>
  )
}
