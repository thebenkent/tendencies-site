'use client'

import { useState } from 'react'
import { useCart } from './CartContext'
import SizeChartModal from './SizeChartModal'
import type { PortalProduct, PortalCategory } from '@/lib/portal/types'

const BORDER = 'rgba(255,255,255,0.07)'
const LIME = '#b8f400'
const IMG_BG = '#f2f1ed'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(cents / 100)
}

export default function ProductOrderCard({
  product,
  category,
  slug,
  accentColor,
}: {
  product: PortalProduct
  category: PortalCategory
  slug: string
  accentColor: string
}) {
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

  const decorationMeta = [
    product.decorationMethod !== 'None' ? product.decorationMethod : null,
    `${product.leadWeeks[0]}–${product.leadWeeks[1]}wk lead`,
  ]
    .filter(Boolean)
    .join(' · ')

  function handleAdd() {
    if (!canAdd) return
    addItem({
      productId: product.id,
      categoryId: product.categoryId,
      productName: selectedColour
        ? `${product.name} — ${selectedColour}`
        : product.name,
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
          background: '#0e0e0e',
          border: `1px solid ${BORDER}`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1/1',
            overflow: 'hidden',
            background: IMG_BG,
            flexShrink: 0,
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
              padding: '24px',
              transition: 'opacity 0.18s ease',
            }}
          />

          {/* Badges */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              alignItems: 'flex-start',
            }}
          >
            {product.sku && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#f5f5f0',
                  background: 'rgba(8,8,8,0.82)',
                  padding: '5px 10px',
                  border: `1px solid rgba(255,255,255,0.1)`,
                }}
              >
                {product.sku}
              </span>
            )}
            {product.requiresStaffName && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: LIME,
                  background: 'rgba(8,8,8,0.82)',
                  padding: '5px 10px',
                  border: '1px solid rgba(184,244,0,0.22)',
                }}
              >
                Personalised
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {/* Product title + price */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: accentColor,
                marginBottom: '6px',
              }}
            >
              {category.name}
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '-0.025em',
                textTransform: 'uppercase',
                color: '#f5f5f0',
                lineHeight: 1.05,
                marginBottom: '14px',
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#f5f5f0',
                  letterSpacing: '-0.02em',
                }}
              >
                {fmt(product.priceCents)}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                {decorationMeta}
              </span>
            </div>
          </div>

          {/* Colour selector */}
          {product.colours && product.colours.length > 0 && (
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: '18px',
                marginBottom: '18px',
              }}
            >
              <div style={labelStyle}>
                Colour
                {selectedColour && (
                  <span
                    style={{
                      color: '#f5f5f0',
                      fontWeight: 600,
                      marginLeft: '8px',
                      fontSize: '10px',
                      letterSpacing: '0.04em',
                      textTransform: 'none',
                    }}
                  >
                    — {selectedColour}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {product.colours.map((colour) => (
                  <button
                    key={colour.name}
                    onClick={() => setSelectedColour(colour.name)}
                    style={{
                      padding: '7px 14px',
                      background:
                        selectedColour === colour.name ? LIME : 'transparent',
                      color:
                        selectedColour === colour.name
                          ? '#080808'
                          : 'rgba(255,255,255,0.55)',
                      border: `1px solid ${
                        selectedColour === colour.name
                          ? LIME
                          : 'rgba(255,255,255,0.12)'
                      }`,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {colour.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: '18px',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={labelStyle}>Size</div>
                {hasSizeGuide && (
                  <button
                    onClick={() => setShowSizeChart(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: LIME,
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      padding: '0',
                    }}
                  >
                    Size Chart →
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '8px 12px',
                      background: selectedSize === size ? LIME : 'transparent',
                      color:
                        selectedSize === size
                          ? '#080808'
                          : 'rgba(255,255,255,0.5)',
                      border: `1px solid ${
                        selectedSize === size ? LIME : 'rgba(255,255,255,0.1)'
                      }`,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      transition: 'all 0.12s ease',
                      minWidth: '40px',
                      textAlign: 'center',
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
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: '18px',
                marginBottom: '18px',
              }}
            >
              <div style={labelStyle}>Name for embroidery</div>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                style={{
                  width: '100%',
                  background: '#111',
                  border: `1px solid ${BORDER}`,
                  color: '#f5f5f0',
                  fontSize: '13px',
                  padding: '11px 14px',
                  outline: 'none',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          {/* Qty + Add to order */}
          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              paddingTop: '18px',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
              {/* Qty stepper */}
              <div
                style={{
                  display: 'flex',
                  border: `1px solid ${BORDER}`,
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{
                    width: '38px',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    width: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#f5f5f0',
                    borderLeft: `1px solid ${BORDER}`,
                    borderRight: `1px solid ${BORDER}`,
                  }}
                >
                  {qty}
                </div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{
                    width: '38px',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>

              {/* Add button */}
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                style={{
                  flex: 1,
                  height: '46px',
                  background: added ? '#6cba00' : canAdd ? LIME : 'rgba(184,244,0,0.12)',
                  color: canAdd ? '#080808' : 'rgba(8,8,8,0.35)',
                  border: 'none',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: canAdd ? 'pointer' : 'not-allowed',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  transition: 'background 0.2s ease',
                }}
              >
                {added ? '✓ Added to Order' : 'Add to Order'}
              </button>
            </div>

            {/* Validation hint */}
            {!canAdd && (
              <p
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.28)',
                  marginTop: '10px',
                  letterSpacing: '0.04em',
                }}
              >
                {selectedSize === '' && product.sizes.length > 0
                  ? 'Select a size to continue'
                  : product.requiresStaffName && !staffName.trim()
                  ? 'Enter a name for embroidery'
                  : ''}
              </p>
            )}

            {/* View cart */}
            {added && (
              <a
                href={`/portal/${slug}/cart`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '12px',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: LIME,
                  textDecoration: 'none',
                }}
              >
                View cart →
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  fontFamily: 'Helvetica, Arial, sans-serif',
  display: 'inline',
  marginBottom: '12px',
}
