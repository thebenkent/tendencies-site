'use client'

import { useCart } from './CartContext'
import type { ClientPortalConfig } from '@/lib/portal/types'

export default function PortalHeader({
  config,
  slug,
}: {
  config: ClientPortalConfig
  slug: string
}) {
  const { itemCount } = useCart()

  return (
    <div
      style={{
        background: '#0a0a0a',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 32px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: '64px',
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
        }}
      >
        {config.logo?.type === 'image' ? (
          <img
            src={config.logo.src}
            alt={config.logo.alt}
            style={{ maxHeight: '44px', width: 'auto', display: 'block' }}
          />
        ) : (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: config.accentColor,
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            {config.logo?.type === 'text' ? config.logo.text : (config.logoText ?? config.clientName)}
          </span>
        )}
        <span
          style={{
            width: '1px',
            height: '14px',
            background: 'rgba(255,255,255,0.12)',
          }}
        />
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          Uniform Portal
        </span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <a
          href={`/portal/${slug}/cart`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: itemCount > 0 ? '#b8f400' : 'rgba(255,255,255,0.45)',
            transition: 'color 0.2s ease',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          <span>Cart</span>
          {itemCount > 0 && (
            <span
              style={{
                background: '#b8f400',
                color: '#080808',
                fontSize: '9px',
                fontWeight: 900,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {itemCount}
            </span>
          )}
        </a>

        <span
          style={{
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.18)',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          Powered by Tendencies
        </span>
      </div>
    </div>
  )
}
