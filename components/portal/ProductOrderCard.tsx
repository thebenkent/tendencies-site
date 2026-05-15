'use client'

import { useState, type CSSProperties } from 'react'
import { useCart } from './CartContext'
import SizeChartModal from './SizeChartModal'
import type { PortalProduct, PortalCategory, PortalVisualTokens, PortalUiCopy } from '@/lib/portal/types'
import { resolvePortalUiCopy } from '@/lib/portal/visual'
import type { ClientPortalConfig } from '@/lib/portal/types'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(cents / 100)
}

type Ui = Required<PortalUiCopy>

export default function ProductOrderCard({
  product,
  category,
  slug,
  visual: v,
  config,
}: {
  product: PortalProduct
  category: PortalCategory
  slug: string
  visual: PortalVisualTokens
  config: ClientPortalConfig
}) {
  const ui: Ui = resolvePortalUiCopy(config)
  const { addItem } = useCart()

  const [selectedColour, setSelectedColour] = useState(product.colours?.[0]?.name ?? '')
  const [selectedSize, setSelectedSize] = useState('')
  const [staffName, setStaffName] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const activeColour = product.colours?.find((c) => c.name === selectedColour)
  const displayImage = activeColour?.image ?? product.image

  const canAdd =
    (product.sizes.length === 0 || selectedSize !== '') &&
    (!product.requiresStaffName || staffName.trim() !== '')

  const hasSizeGuide = !!(product.sizeChart || product.measureGuide)

  const leadLabel = `${product.leadWeeks[0]}–${product.leadWeeks[1]} wk`

  function handleAdd() {
    if (!canAdd) return
    addItem({
      productId: product.id,
      categoryId: product.categoryId,
      productName: selectedColour ? `${product.name} — ${selectedColour}` : product.name,
      categoryName: category.name,
      size: selectedSize || product.sizes[0] || 'One Size',
      colour: selectedColour || undefined,
      staffName: staffName.trim() || undefined,
      quantity: qty,
      priceCents: product.priceCents,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const selBorder = v.accent
  const selBg = `${v.accent}22`

  return (
    <>
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        sizeChart={product.sizeChart}
        measureGuide={product.measureGuide}
      />

      <div
        style={{
          background: v.panel,
          border: `1px solid ${v.border}`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Helvetica, Arial, sans-serif',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <a
          href={`/portal/${slug}/${category.slug}/${product.slug}`}
          style={{
            position: 'relative',
            aspectRatio: '1 / 1.12',
            minHeight: '240px',
            overflow: 'hidden',
            background: v.imageWell,
            flexShrink: 0,
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <img
            src={displayImage}
            alt={`${product.name}${selectedColour ? ` — ${selectedColour}` : ''}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '20px',
              transition: 'opacity 0.18s ease',
            }}
          />

          {product.requiresStaffName && (
            <span
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: v.ink,
                background: 'rgba(26,36,54,0.88)',
                padding: '8px 12px',
                border: `1px solid ${v.accentSecondary}`,
                borderRadius: '2px',
              }}
            >
              Personalised
            </span>
          )}
        </a>

        <div
          style={{
            padding: '22px 22px 24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: v.inkFaint,
                marginBottom: '8px',
              }}
            >
              {category.name}
            </div>
            <a
              href={`/portal/${slug}/${category.slug}/${product.slug}`}
              style={{
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: v.ink,
                lineHeight: 1.25,
                marginBottom: '14px',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              {product.name}
            </a>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: v.ink,
                  letterSpacing: '-0.02em',
                }}
              >
                {fmt(product.priceCents)}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: v.inkMuted,
                  padding: '8px 14px',
                  borderRadius: '999px',
                  border: `1px solid ${v.border}`,
                  background: v.panelElevated,
                }}
              >
                {leadLabel}
              </span>
            </div>
          </div>

          {product.colours && product.colours.length > 0 && (
            <div
              style={{
                borderTop: `1px solid ${v.border}`,
                paddingTop: '16px',
                marginBottom: '16px',
              }}
            >
              <div style={labelStyle(v)}>Colour</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                {product.colours.map((colour) => (
                  <button
                    key={colour.name}
                    type="button"
                    onClick={() => setSelectedColour(colour.name)}
                    style={{
                      minHeight: '44px',
                      padding: '0 16px',
                      background: selectedColour === colour.name ? selBg : 'transparent',
                      color: selectedColour === colour.name ? v.ink : v.inkMuted,
                      border: `1px solid ${selectedColour === colour.name ? selBorder : v.border}`,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      borderRadius: '4px',
                    }}
                  >
                    {colour.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div
              style={{
                borderTop: `1px solid ${v.border}`,
                paddingTop: '16px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <div style={labelStyle(v)}>Size</div>
                {hasSizeGuide && (
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: v.accent,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      padding: '8px 0',
                      minHeight: '44px',
                    }}
                  >
                    Size chart
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      minWidth: '44px',
                      minHeight: '44px',
                      padding: '0 12px',
                      background: selectedSize === size ? selBg : 'transparent',
                      color: selectedSize === size ? v.ink : v.inkMuted,
                      border: `1px solid ${selectedSize === size ? selBorder : v.border}`,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      borderRadius: '4px',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.requiresStaffName && (
            <div
              style={{
                borderTop: `1px solid ${v.border}`,
                paddingTop: '16px',
                marginBottom: '16px',
              }}
            >
              <div style={labelStyle(v)}>Name for embroidery</div>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                style={{
                  width: '100%',
                  minHeight: '48px',
                  background: v.panelElevated,
                  border: `1px solid ${v.border}`,
                  color: v.ink,
                  fontSize: '15px',
                  padding: '12px 14px',
                  outline: 'none',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  boxSizing: 'border-box',
                  borderRadius: '4px',
                  marginTop: '10px',
                }}
              />
            </div>
          )}

          <div
            style={{
              borderTop: `1px solid ${v.border}`,
              paddingTop: '18px',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
              <div
                style={{
                  display: 'flex',
                  border: `1px solid ${v.border}`,
                  flexShrink: 0,
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{
                    width: '48px',
                    minHeight: '48px',
                    background: 'transparent',
                    border: 'none',
                    color: v.inkMuted,
                    fontSize: '20px',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    minWidth: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: v.ink,
                    borderLeft: `1px solid ${v.border}`,
                    borderRight: `1px solid ${v.border}`,
                  }}
                >
                  {qty}
                </div>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  style={{
                    width: '48px',
                    minHeight: '48px',
                    background: 'transparent',
                    border: 'none',
                    color: v.inkMuted,
                    fontSize: '20px',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!canAdd}
                style={{
                  flex: 1,
                  minHeight: '48px',
                  background: added ? v.accentSecondary : canAdd ? v.accent : `${v.accent}33`,
                  color: '#fff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: canAdd ? 'pointer' : 'not-allowed',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  borderRadius: '4px',
                  boxShadow: added ? `inset 3px 0 0 ${v.limeSpot}` : undefined,
                }}
              >
                {added ? ui.addedToShortlist : ui.addToShortlist}
              </button>
            </div>

            {!canAdd && (
              <p
                style={{
                  fontSize: '12px',
                  color: v.inkFaint,
                  marginTop: '12px',
                  letterSpacing: '0.02em',
                }}
              >
                {selectedSize === '' && product.sizes.length > 0
                  ? 'Choose a size to add this piece.'
                  : product.requiresStaffName && !staffName.trim()
                    ? 'Add a name for embroidery.'
                    : ''}
              </p>
            )}

            {added && (
              <a
                href={`/portal/${slug}/cart`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: v.accent,
                  textDecoration: 'none',
                  minHeight: '44px',
                  lineHeight: '44px',
                }}
              >
                {ui.viewShortlist} →
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function labelStyle(v: PortalVisualTokens): CSSProperties {
  return {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: v.inkFaint,
    fontFamily: 'Helvetica, Arial, sans-serif',
  }
}
