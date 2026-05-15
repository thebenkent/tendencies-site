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
    (product.sizes.length === 0 || selectedSize !== '' || product.sizes[0] === 'One Size') &&
    (!product.requiresStaffName || staffName.trim() !== '')

  const hasSizeGuide = !!(product.sizeChart || product.measureGuide)
  const showSizePicker = product.sizes.length > 0 && product.sizes[0] !== 'One Size'

  const leadLine = `Lead ${product.leadWeeks[0]}–${product.leadWeeks[1]} weeks`

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
        className="portal-product-card"
        style={{
          background: v.panel,
          border: `1px solid ${v.border}`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Helvetica, Arial, sans-serif',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <a
          href={`/portal/${slug}/${category.slug}/${product.slug}`}
          className="portal-card-media"
          style={{
            position: 'relative',
            aspectRatio: '1 / 1.08',
            minHeight: 'min(72vw, 320px)',
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
              padding: '16px 18px',
              transition: 'opacity 0.18s ease',
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
                background: 'rgba(34,44,61,0.92)',
                padding: '8px 12px',
                border: `1px solid ${v.accentSecondary}`,
                borderRadius: '3px',
              }}
            >
              Personalised
            </span>
          )}
        </a>

        <div
          style={{
            padding: '20px 20px 22px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <a
              href={`/portal/${slug}/${category.slug}/${product.slug}`}
              style={{
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: v.ink,
                lineHeight: 1.28,
                marginBottom: '12px',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              {product.name}
            </a>
            <div>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: v.ink,
                  letterSpacing: '-0.02em',
                  display: 'block',
                }}
              >
                {fmt(product.priceCents)}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: v.inkMuted,
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                {leadLine}
              </span>
            </div>
          </div>

          {product.colours && product.colours.length > 0 && (
            <div
              style={{
                borderTop: `1px solid ${v.border}`,
                paddingTop: '14px',
                marginBottom: '14px',
              }}
            >
              <div style={labelStyle(v)}>Colour</div>
              <div className="portal-options-scroll" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {product.colours.map((colour) => (
                  <button
                    key={colour.name}
                    type="button"
                    onClick={() => setSelectedColour(colour.name)}
                    style={{
                      minHeight: '48px',
                      padding: '0 18px',
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

          {showSizePicker && (
            <div
              style={{
                borderTop: `1px solid ${v.border}`,
                paddingTop: '14px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  gap: '12px',
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
                      minHeight: '48px',
                    }}
                  >
                    Size chart
                  </button>
                )}
              </div>
              <div className="portal-options-scroll" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      minWidth: '48px',
                      minHeight: '48px',
                      padding: '0 14px',
                      background: selectedSize === size ? selBg : 'transparent',
                      color: selectedSize === size ? v.ink : v.inkMuted,
                      border: `1px solid ${selectedSize === size ? selBorder : v.border}`,
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
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
                paddingTop: '14px',
                marginBottom: '14px',
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
                  minHeight: '52px',
                  background: v.panelElevated,
                  border: `1px solid ${v.border}`,
                  color: v.ink,
                  fontSize: '16px',
                  padding: '14px 16px',
                  outline: 'none',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  boxSizing: 'border-box',
                  borderRadius: '4px',
                  marginTop: '8px',
                }}
              />
            </div>
          )}

          <div
            style={{
              borderTop: `1px solid ${v.border}`,
              paddingTop: '16px',
              marginTop: 'auto',
            }}
          >
            <div className="portal-card-actions" style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
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
                    width: '52px',
                    minHeight: '52px',
                    background: 'transparent',
                    border: 'none',
                    color: v.inkMuted,
                    fontSize: '22px',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    minWidth: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
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
                    width: '52px',
                    minHeight: '52px',
                    background: 'transparent',
                    border: 'none',
                    color: v.inkMuted,
                    fontSize: '22px',
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
                  minHeight: '52px',
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
                  boxShadow: added ? `inset 3px 0 0 ${v.accent}` : undefined,
                }}
              >
                {added ? ui.addedToShortlist : ui.addToShortlist}
              </button>
            </div>

            {!canAdd && (
              <p
                style={{
                  fontSize: '13px',
                  color: v.inkFaint,
                  marginTop: '12px',
                  letterSpacing: '0.02em',
                  lineHeight: 1.45,
                }}
              >
                {showSizePicker && selectedSize === ''
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
                  minHeight: '48px',
                  lineHeight: '48px',
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
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: v.inkFaint,
    fontFamily: 'Helvetica, Arial, sans-serif',
  }
}
