'use client'

import { useState } from 'react'
import { useCart } from '@/components/portal/CartContext'
import type { ClientPortalConfig, PortalProduct } from '@/lib/portal/types'

const BG = '#080808'
const BORDER = 'rgba(255,255,255,0.08)'
const LIME = '#b8f400'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(cents / 100)
}

export default function ProductOrderClient({
  config,
  product,
  slug,
  categorySlug,
  categoryName,
}: {
  config: ClientPortalConfig
  product: PortalProduct
  slug: string
  categorySlug: string
  categoryName: string
}) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColour, setSelectedColour] = useState(
    product.colours?.[0]?.name ?? '',
  )
  const [staffName, setStaffName] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const canAdd =
    (product.sizes.length === 0 || selectedSize !== '') &&
    (!product.requiresStaffName || staffName.trim() !== '')

  function handleAdd() {
    if (!canAdd) return
    addItem({
      productId: product.id,
      categoryId: product.categoryId,
      productName: product.name,
      categoryName,
      size: selectedSize || product.sizes[0] || 'One Size',
      colour: selectedColour || undefined,
      staffName: staffName.trim() || undefined,
      quantity: qty,
      priceCents: product.priceCents,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div
      style={{
        background: BG,
        minHeight: 'calc(100vh - 116px)',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: `1px solid ${BORDER}`,
          padding: '16px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {[
          { label: config.clientName, href: `/portal/${slug}` },
          { label: categoryName, href: `/portal/${slug}/${categorySlug}` },
          { label: product.name, href: null },
        ].map((crumb, i, arr) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {crumb.href ? (
              <a
                href={crumb.href}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                }}
              >
                {crumb.label}
              </a>
            ) : (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#f5f5f0',
                }}
              >
                {crumb.label}
              </span>
            )}
            {i < arr.length - 1 && (
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>›</span>
            )}
          </span>
        ))}
      </div>

      {/* Product layout */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 48px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '64px',
          alignItems: 'start',
        }}
      >
        {/* Image */}
        <div>
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              overflow: 'hidden',
              background: '#0f0f0f',
              border: `1px solid ${BORDER}`,
              marginTop: '48px',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.8)',
              }}
            />
          </div>

          {/* Decoration + lead time info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              marginTop: '2px',
            }}
          >
            {[
              { label: 'Decoration', value: product.decorationMethod },
              {
                label: 'Lead time',
                value: `${product.leadWeeks[0]}–${product.leadWeeks[1]} weeks`,
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: '#0d0d0d',
                  border: `1px solid ${BORDER}`,
                  padding: '16px 18px',
                }}
              >
                <div
                  style={{
                    fontSize: '8px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    marginBottom: '4px',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#f5f5f0',
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order form */}
        <div style={{ paddingTop: '48px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: config.accentColor,
              marginBottom: '10px',
            }}
          >
            {categoryName}
          </div>
          <h1
            style={{
              fontSize: 'clamp(28px, 3vw, 40px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#f5f5f0',
              lineHeight: 0.92,
              marginBottom: '16px',
            }}
          >
            {product.name}
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
              marginBottom: '32px',
              borderTop: `1px solid ${BORDER}`,
              paddingTop: '20px',
            }}
          >
            {product.description}
          </p>

          <div
            style={{
              fontSize: '22px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#f5f5f0',
              marginBottom: '32px',
            }}
          >
            {fmt(product.priceCents)}{' '}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.06em',
              }}
            >
              NZD incl. GST
            </span>
          </div>

          {/* Colour selector */}
          {product.colours && product.colours.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={labelStyle}>
                Colour{' '}
                {selectedColour && (
                  <span style={{ color: '#f5f5f0', fontWeight: 400 }}>— {selectedColour}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.colours.map((colour) => (
                  <button
                    key={colour.name}
                    title={colour.name}
                    onClick={() => setSelectedColour(colour.name)}
                    style={{
                      width: '32px',
                      height: '32px',
                      background: colour.hex,
                      border:
                        selectedColour === colour.name
                          ? `2px solid ${LIME}`
                          : '2px solid rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
            <div style={{ marginBottom: '24px' }}>
              <div style={labelStyle}>Size</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '8px 14px',
                      background: selectedSize === size ? LIME : 'transparent',
                      color: selectedSize === size ? '#080808' : 'rgba(255,255,255,0.6)',
                      border: `1px solid ${selectedSize === size ? LIME : BORDER}`,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Staff name */}
          {product.requiresStaffName && (
            <div style={{ marginBottom: '24px' }}>
              <div style={labelStyle}>Staff name for personalisation</div>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                style={{
                  width: '100%',
                  background: '#0d0d0d',
                  border: `1px solid ${BORDER}`,
                  color: '#f5f5f0',
                  fontSize: '14px',
                  padding: '12px 14px',
                  outline: 'none',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = LIME
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = BORDER
                }}
              />
            </div>
          )}

          {/* Qty */}
          <div style={{ marginBottom: '28px' }}>
            <div style={labelStyle}>Quantity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={qtyBtnStyle}
              >
                −
              </button>
              <div
                style={{
                  width: '56px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0d0d0d',
                  border: `1px solid ${BORDER}`,
                  borderLeft: 'none',
                  borderRight: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#f5f5f0',
                }}
              >
                {qty}
              </div>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={qtyBtnStyle}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            style={{
              width: '100%',
              background: added ? '#6cba00' : canAdd ? LIME : 'rgba(184,244,0,0.25)',
              color: '#080808',
              border: 'none',
              padding: '16px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: canAdd ? 'pointer' : 'not-allowed',
              fontFamily: 'Helvetica, Arial, sans-serif',
              transition: 'background 0.2s ease',
            }}
          >
            {added ? '✓ Added to cart' : 'Add to cart'}
          </button>

          {!canAdd && (
            <p
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.3)',
                marginTop: '8px',
                letterSpacing: '0.04em',
              }}
            >
              {product.sizes[0] !== 'One Size' && !selectedSize
                ? 'Select a size to continue.'
                : product.requiresStaffName && !staffName.trim()
                ? 'Enter a staff name to continue.'
                : ''}
            </p>
          )}

          {added && (
            <a
              href={`/portal/${slug}/cart`}
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '12px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#b8f400',
                textDecoration: 'none',
              }}
            >
              View cart →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '10px',
  fontFamily: 'Helvetica, Arial, sans-serif',
}

const qtyBtnStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  background: '#0d0d0d',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#f5f5f0',
  fontSize: '18px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Helvetica, Arial, sans-serif',
}
