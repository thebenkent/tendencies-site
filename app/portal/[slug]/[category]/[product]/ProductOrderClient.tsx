'use client'

import { useState, type CSSProperties } from 'react'
import { useCart } from '@/components/portal/CartContext'
import SizeChartModal from '@/components/portal/SizeChartModal'
import type { ClientPortalConfig, PortalProduct, PortalVisualTokens } from '@/lib/portal/types'
import { resolvePortalUiCopy, resolvePortalVisual } from '@/lib/portal/visual'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(cents / 100)
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
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
  const v = resolvePortalVisual(config)
  const ui = resolvePortalUiCopy(config)
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColour, setSelectedColour] = useState(product.colours?.[0]?.name ?? '')
  const [staffName, setStaffName] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const galleryImages = [product.image, ...(product.images ?? [])].filter(Boolean)
  const [activeImage, setActiveImage] = useState(galleryImages[0] ?? product.image)
  const hasSizeGuide = !!(product.sizeChart || product.measureGuide)

  function handleColourSelect(colourName: string) {
    setSelectedColour(colourName)
    const colour = product.colours?.find((c) => c.name === colourName)
    if (colour?.image) setActiveImage(colour.image)
  }

  const canAdd =
    (product.sizes.length === 0 || selectedSize !== '') &&
    (!product.requiresStaffName || staffName.trim() !== '')

  const selBorder = v.accent
  const selBg = `${v.accent}22`

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
    <>
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        sizeChart={product.sizeChart}
        measureGuide={product.measureGuide}
      />
      <div
        style={{
          background: v.canvas,
          minHeight: 'calc(100vh - 116px)',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        <div
          className="portal-px"
          style={{
            borderBottom: `1px solid ${v.border}`,
            padding: '16px 64px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '1200px',
            margin: '0 auto',
            flexWrap: 'wrap',
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
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: v.inkFaint,
                    textDecoration: 'none',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: v.ink,
                  }}
                >
                  {crumb.label}
                </span>
              )}
              {i < arr.length - 1 && (
                <span style={{ color: v.inkFaint, fontSize: '11px' }} aria-hidden>
                  ›
                </span>
              )}
            </span>
          ))}
        </div>

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 64px 88px',
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: '56px',
            alignItems: 'start',
          }}
          className="portal-pdp-grid portal-px"
        >
          <div>
            <div
              style={{
                position: 'relative',
                aspectRatio: '1 / 1.06',
                minHeight: 'min(85vw, 420px)',
                overflow: 'hidden',
                background: v.imageWell,
                border: `1px solid ${v.border}`,
                marginTop: '32px',
                borderRadius: '8px',
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '24px',
                }}
              />
            </div>

            {galleryImages.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '12px',
                  flexWrap: 'wrap',
                }}
              >
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '68px',
                      height: '68px',
                      padding: 0,
                      border: `2px solid ${activeImage === img ? v.accent : v.border}`,
                      background: v.imageWell,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      borderRadius: '6px',
                      flexShrink: 0,
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <span style={metaPill(v)}>
                {fmt(product.priceCents)} <span style={{ fontWeight: 500, opacity: 0.85 }}>incl. GST</span>
              </span>
              <span style={metaPill(v)}>
                Lead {product.leadWeeks[0]}–{product.leadWeeks[1]} weeks
              </span>
              {product.decorationMethod && product.decorationMethod !== 'None' && (
                <span style={metaPill(v)}>{product.decorationMethod}</span>
              )}
              {product.moq != null && (
                <span style={metaPill(v)}>From {product.moq} units</span>
              )}
              {product.material && (
                <span style={metaPill(v)}>{product.material}</span>
              )}
            </div>
          </div>

          <div style={{ paddingTop: '40px' }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: v.accentSecondary,
                marginBottom: '10px',
              }}
            >
              {categoryName}
            </div>
            <h1
              style={{
                fontSize: 'clamp(26px, 2.8vw, 36px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: v.ink,
                lineHeight: 1.05,
                marginBottom: '16px',
              }}
            >
              {product.name}
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: v.inkMuted,
                lineHeight: 1.65,
                marginBottom: '28px',
                borderTop: `1px solid ${v.border}`,
                paddingTop: '20px',
              }}
            >
              {product.description}
            </p>

            {product.accountManagerNote && (
              <div
                style={{
                  borderLeft: `3px solid ${v.accent}`,
                  background: v.panelElevated,
                  padding: '14px 16px',
                  marginBottom: '28px',
                  borderRadius: '0 4px 4px 0',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: v.inkMuted,
                    lineHeight: 1.6,
                    margin: 0,
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  {product.accountManagerNote}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: v.inkFaint,
                    marginTop: '8px',
                    marginBottom: 0,
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  From {config.contact.manager}
                </p>
              </div>
            )}

            {product.colours && product.colours.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <div style={labelStyle(v)}>Colour</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {product.colours.map((colour) => (
                    <button
                      key={colour.name}
                      type="button"
                      onClick={() => handleColourSelect(colour.name)}
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

            {product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minHeight: '44px',
                        minWidth: '44px',
                        padding: '0 14px',
                        background: selectedSize === size ? selBg : 'transparent',
                        color: selectedSize === size ? v.ink : v.inkMuted,
                        border: `1px solid ${selectedSize === size ? selBorder : v.border}`,
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
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
              <div style={{ marginBottom: '22px' }}>
                <div style={labelStyle(v)}>Staff name</div>
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

            <div style={{ marginBottom: '24px' }}>
              <div style={labelStyle(v)}>Quantity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: '10px' }}>
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtnStyle(v)}>
                  −
                </button>
                <div
                  style={{
                    minWidth: '52px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: v.panelElevated,
                    border: `1px solid ${v.border}`,
                    borderLeft: 'none',
                    borderRight: 'none',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: v.ink,
                  }}
                >
                  {qty}
                </div>
                <button type="button" onClick={() => setQty((q) => q + 1)} style={qtyBtnStyle(v)}>
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              style={{
                width: '100%',
                minHeight: '52px',
                background: added ? v.accentSecondary : canAdd ? v.accent : `${v.accent}33`,
                color: '#fff',
                border: 'none',
                padding: '0 16px',
                fontSize: '12px',
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

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <a
                href={`mailto:${config.contact.email}?subject=${encodeURIComponent(`Quote request — ${product.name}`)}&body=${encodeURIComponent(`Hi ${config.contact.manager},\n\nI'd like a quote for ${product.name} (SKU: ${product.sku || product.id}).\n\nQty: [your quantity]\nTimeline: [your timeline]`)}`}
                style={{
                  flex: 1,
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${v.border}`,
                  color: v.inkMuted,
                  background: 'transparent',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                }}
              >
                Request a quote
              </a>
              <a
                href={`mailto:${config.contact.email}?subject=${encodeURIComponent(`Sample request — ${product.name}`)}&body=${encodeURIComponent(`Hi ${config.contact.manager},\n\nI'd like to request a sample of ${product.name} (SKU: ${product.sku || product.id}).\n\nDelivery address: [your address]`)}`}
                style={{
                  flex: 1,
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${v.border}`,
                  color: v.inkMuted,
                  background: 'transparent',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                }}
              >
                Request a sample
              </a>
            </div>

            {!canAdd && (
              <p
                style={{
                  fontSize: '13px',
                  color: v.inkFaint,
                  marginTop: '10px',
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

        {product.orderHistory && product.orderHistory.length > 0 && (
          <div style={{ background: v.warmSection, borderTop: `1px solid ${v.warmBorder}` }}>
            <div
              className="portal-px"
              style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 64px 64px' }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: v.warmInkMuted,
                  marginBottom: '24px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                }}
              >
                Past orders
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${v.warmBorder}` }}>
                      {['Date', 'Order ref', 'Qty', 'Unit price', 'Total', 'Notes'].map((col) => (
                        <th
                          key={col}
                          style={{
                            textAlign: 'left',
                            fontWeight: 700,
                            fontSize: '10px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: v.warmInkMuted,
                            paddingBottom: '12px',
                            paddingRight: '28px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.orderHistory.map((entry, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: `1px solid ${v.warmBorder}` }}
                      >
                        <td style={{ padding: '14px 28px 14px 0', color: v.warmInk, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                          {fmtDate(entry.date)}
                        </td>
                        <td
                          style={{
                            padding: '14px 28px 14px 0',
                            color: v.warmInkMuted,
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            whiteSpace: 'nowrap',
                            verticalAlign: 'top',
                          }}
                        >
                          {entry.orderRef}
                        </td>
                        <td style={{ padding: '14px 28px 14px 0', color: v.warmInk, fontWeight: 600, verticalAlign: 'top' }}>
                          {entry.qty}
                        </td>
                        <td style={{ padding: '14px 28px 14px 0', color: v.warmInk, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                          {fmt(entry.unitPriceCents)}
                        </td>
                        <td style={{ padding: '14px 28px 14px 0', color: v.warmInk, fontWeight: 700, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                          {fmt(entry.totalCents)}
                        </td>
                        <td style={{ padding: '14px 0 14px 0', color: v.warmInkMuted, maxWidth: '320px', verticalAlign: 'top' }}>
                          {entry.notes || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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
    marginBottom: '0',
    fontFamily: 'Helvetica, Arial, sans-serif',
  }
}

function qtyBtnStyle(v: PortalVisualTokens): CSSProperties {
  return {
    width: '48px',
    height: '48px',
    background: v.panelElevated,
    border: `1px solid ${v.border}`,
    color: v.ink,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica, Arial, sans-serif',
  }
}

function metaPill(v: PortalVisualTokens): CSSProperties {
  return {
    fontSize: '12px',
    fontWeight: 700,
    color: v.ink,
    padding: '10px 14px',
    borderRadius: '999px',
    border: `1px solid ${v.border}`,
    background: v.panelElevated,
  }
}
