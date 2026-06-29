'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import MerchProgressBar  from '@/components/merch/MerchProgressBar'
import MerchCountdown    from '@/components/merch/MerchCountdown'
import OrderSummary      from '@/components/merch/OrderSummary'
import ProductGallery    from '@/components/merch/ProductGallery'
import WishlistButton    from '@/components/merch/WishlistButton'
import { useCart }       from '@/components/merch/CartContext'
import type {
  MerchProductWithVariants, MerchTenant, MerchCampaign, ProductProgress,
  ProductRelationType,
} from '@/lib/merch/types'

// Colour name → CSS value for visual swatches
const COLOUR_CSS: Record<string, string> = {
  'black':        '#1a1a1a', 'white':        '#f4f4f4', 'off white': '#f0ede8',
  'navy':         '#0B1F4D', 'navy blue':    '#0B1F4D', 'royal blue': '#1e40af',
  'blue':         '#1D4ED8', 'sky blue':     '#0ea5e9', 'light blue': '#bae6fd',
  'red':          '#DC2626', 'crimson':      '#dc143c', 'maroon':    '#7f1d1d',
  'burgundy':     '#7f1d1d', 'green':        '#16a34a', 'forest green': '#166534',
  'olive':        '#4d7c0f', 'teal':         '#0d9488', 'yellow':    '#ca8a04',
  'gold':         '#b45309', 'orange':       '#ea580c', 'purple':    '#7c3aed',
  'pink':         '#db2777', 'hot pink':     '#ec4899', 'grey':      '#6b7280',
  'gray':         '#6b7280', 'light grey':   '#d1d5db', 'charcoal':  '#374151',
  'silver':       '#94a3b8',
  'blue/yellow':  '#1A56DB',
}

const RELATION_LABELS: Record<ProductRelationType, string> = {
  related:             'You May Also Like',
  frequently_bought:   'Frequently Bought Together',
  complete_look:       'Complete the Look',
  also_purchased:      'Others Also Bought',
  upsell:              'Upgrade Your Order',
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  default: { bg: '#F1F5F9', text: '#374151' },
  success: { bg: '#DCFCE7', text: '#15803D' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  danger:  { bg: '#FEE2E2', text: '#B91C1C' },
  info:    { bg: '#DBEAFE', text: '#1D4ED8' },
  dark:    { bg: 'rgba(0,0,0,0.75)', text: '#fff' },
}

const CONTENT_SECTION_ICONS: Record<string, string> = {
  highlights:        '✦',
  features:          '✓',
  fabric:            '🧵',
  materials:         '🧵',
  care_instructions: '♻',
  branding_details:  '🏷',
  delivery:          '🚚',
  returns:           '↩',
}

function renderContent(contentType: string, content: unknown): React.ReactNode {
  if (contentType === 'list' && Array.isArray(content)) {
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {(content as string[]).map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ color: '#94A3B8', fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>·</span>
            <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (contentType === 'table' && content && typeof content === 'object' && !Array.isArray(content)) {
    const tbl = content as { headers?: string[]; rows?: string[][] }
    if (!tbl.headers || !tbl.rows) return null
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>{tbl.headers.map((h, i) => <th key={i} style={{ padding: '8px 12px', background: '#F1F5F9', fontWeight: 700, textAlign: 'left', color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {tbl.rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#374151', borderBottom: '1px solid #F1F5F9' }}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  if (contentType === 'html' && typeof content === 'string') {
    return <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: content }} />
  }
  // Default: text
  const text = typeof content === 'string' ? content : typeof content === 'object' ? JSON.stringify(content) : String(content)
  return <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.75, margin: 0 }}>{text}</p>
}

const FIT_LABELS: Record<string, string> = {
  Mens:   "Men's",
  Womens: "Women's",
  Youth:  'Youth',
  Unisex: 'Unisex',
  Kids:   'Kids',
}
const fitLabel = (fit: string) => FIT_LABELS[fit] ?? fit

type Props = {
  tenant:   MerchTenant
  campaign: MerchCampaign
  product:  MerchProductWithVariants
  progress: ProductProgress
  slug:     string
  related?: Array<{ product: MerchProductWithVariants; relationType: ProductRelationType }>
}

export default function ProductDetail({ tenant, campaign, product, progress, slug, related = [] }: Props) {
  const primary = tenant.primary_color
  const accent  = tenant.secondary_color

  const isOpen = campaign.status === 'open' &&
    (!campaign.closes_at || new Date(campaign.closes_at) > new Date())

  // All variants including unavailable (for disabled size states)
  const allVariants  = product.merch_product_variants
  const variants     = allVariants.filter((v) => v.available)

  const colours     = [...new Set(variants.map((v) => v.colour).filter(Boolean))] as string[]
  const multiColour = colours.length > 1

  const fits    = [...new Set(allVariants.map((v) => v.fit).filter(Boolean))] as string[]
  const hasFits = fits.length > 0

  const personalisation = product.personalisation   // active, sorted
  const size_charts     = product.size_charts

  // ── State ──────────────────────────────────────────────────
  const [selectedFit,    setSelectedFit]    = useState<string>(fits.length === 1 ? fits[0] : '')
  const [selectedColour, setSelectedColour] = useState<string>(multiColour ? '' : (colours[0] ?? ''))
  const [selectedSize,   setSelectedSize]   = useState('')
  const [qty,            setQty]            = useState(1)
  const [personValues,   setPersonValues]   = useState<Record<string, string>>({})
  const [showSizeChart,  setShowSizeChart]  = useState(false)
  const [addedToCart,    setAddedToCart]    = useState(false)
  const [stickyVisible,  setStickyVisible]  = useState(false)
  const ctaRef = useRef<HTMLButtonElement | HTMLDivElement | null>(null)
  const cart   = useCart()

  // Show sticky CTA on mobile when primary CTA scrolls out of view
  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!addedToCart) return
    const t = setTimeout(() => setAddedToCart(false), 3000)
    return () => clearTimeout(t)
  }, [addedToCart])

  // All sizes for current fit/colour — from ALL variants (shows disabled state)
  const allSizesForSelection = [...new Set(
    allVariants
      .filter((v) => !hasFits || !selectedFit || v.fit === selectedFit)
      .filter((v) => !multiColour || !selectedColour || v.colour === selectedColour)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((v) => v.size),
  )]

  const availableSizeSet = new Set(
    variants
      .filter((v) => !hasFits || !selectedFit || v.fit === selectedFit)
      .filter((v) => !multiColour || !selectedColour || v.colour === selectedColour)
      .map((v) => v.size),
  )

  const selectedVariant = variants.find(
    (v) =>
      (!hasFits || v.fit === selectedFit) &&
      v.size === selectedSize &&
      (!multiColour || v.colour === selectedColour),
  ) ?? null

  const surcharge = selectedVariant?.additional_cost_cents ?? 0

  const personTotal = personalisation.reduce(
    (sum, p) => sum + ((personValues[p.id] ?? '').trim() ? p.additional_price_cents * qty : 0),
    0,
  )

  const displayTotal = (product.price_cents + surcharge) * qty + personTotal

  const canAdd = isOpen && !!selectedVariant

  const ctaLabel = !isOpen
    ? 'Campaign closed'
    : !selectedVariant
      ? hasFits && !selectedFit ? 'Select a fit'
        : multiColour && !selectedColour ? 'Select a colour'
        : 'Select a size'
      : `Add to Cart — $${(displayTotal / 100).toFixed(2)}`

  function handleAddToCart() {
    if (!canAdd || !selectedVariant) return
    cart.add({
      productId:   product.id,
      productSlug: product.slug,
      productName: product.name,
      imageUrl:    product.images[0] ?? null,
      variantId:   selectedVariant.id,
      fit:         selectedFit,
      colour:      selectedVariant.colour,
      size:        selectedVariant.size,
      qty,
      priceCents:  product.price_cents + selectedVariant.additional_cost_cents,
      personalisation: personalisation
        .filter((p) => (personValues[p.id] ?? '').trim())
        .map((p) => ({
          id:           p.id,
          label:        p.label,
          value:        (personValues[p.id] ?? '').trim(),
          priceCents:   p.additional_price_cents,
          maxLength:    p.max_length,
          uppercaseOnly: p.uppercase_only,
        })),
    })
    setAddedToCart(true)
  }

  const images = product.images

  const activeSizeChart =
    size_charts.find((c) => c.fit === selectedFit) ??
    size_charts.find((c) => c.fit === '') ??
    (size_charts.length > 0 ? size_charts[0] : null)

  const hasMinimum = progress.minimumQty > 1
  const hasSizeChart = size_charts.length > 0

  function updatePersonValue(
    id: string, raw: string,
    opt: { uppercase_only: boolean; max_length: number | null },
  ) {
    let val = raw
    if (opt.uppercase_only) val = val.toUpperCase()
    if (opt.max_length && val.length > opt.max_length) return
    setPersonValues((prev) => ({ ...prev, [id]: val }))
  }

  return (
    <>
      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid #E2E8EF', padding: '14px 32px', background: '#FAFBFC' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', fontSize: '13px', color: '#5A6B7E', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <a href={`/merch/${slug}`} style={{ color: '#5A6B7E', textDecoration: 'none' }}>{tenant.name}</a>
          <span style={{ opacity: 0.4 }}>›</span>
          <a href={`/merch/${slug}/${campaign.slug}`} style={{ color: '#5A6B7E', textDecoration: 'none' }}>{campaign.name}</a>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: primary, fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* ── Page body ───────────────────────────────────────── */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px 32px 96px' }}>
        <div className="product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: '72px', alignItems: 'start' }}>

          {/* ── Gallery ───────────────────────────────────────── */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
              <WishlistButton
                productId={product.id}
                tenantSlug={slug}
                campaignSlug={campaign.slug}
                accentColor={accent}
              />
            </div>
            <ProductGallery
              images={images}
              productImages={product.product_images}
              productName={product.name}
              primaryColor={primary}
              accentColor={accent}
            />
          </div>

          {/* ── Details panel ─────────────────────────────────── */}
          <div style={{ position: 'sticky', top: '100px' }}>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '5px 12px', borderRadius: '999px', marginBottom: '20px',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              background: !isOpen ? '#F1F5F9' : (!hasMinimum || progress.isMet) ? '#DCFCE7' : '#FFF7ED',
              color:      !isOpen ? '#64748B' : (!hasMinimum || progress.isMet) ? '#15803D' : '#92400E',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
              {!isOpen ? 'Campaign closed' : !hasMinimum ? '✓ Ready to Order' : progress.isMet ? '✓ Production Guaranteed' : 'Building to minimum'}
            </div>

            {/* ── Product badges ──────────────────────────────── */}
            {product.badges.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {product.badges.map((b) => {
                  const colors = b.badge_type === 'dark'
                    ? { bg: primary, text: '#fff' }
                    : (BADGE_COLORS[b.badge_type] ?? BADGE_COLORS.default)
                  return (
                    <span key={b.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '5px',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      background: colors.bg, color: colors.text,
                    }}>
                      {b.icon && <span>{b.icon}</span>}
                      {b.label}
                    </span>
                  )
                })}
              </div>
            )}

            <h1 style={{ fontSize: 'clamp(26px, 2.5vw, 36px)', fontWeight: 800, color: primary, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 10px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '30px', fontWeight: 800, color: primary, letterSpacing: '-0.02em' }}>
                ${(product.price_cents / 100).toFixed(2)}
              </span>
              <span style={{ fontSize: '13px', color: '#5A6B7E' }}>per item</span>
            </div>

            {product.description && (
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.75, margin: '0 0 28px' }}>
                {product.description}
              </p>
            )}

            {/* ── Fit selector ──────────────────────────────── */}
            {hasFits && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Fit {selectedFit && <span style={{ color: primary, textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>— {fitLabel(selectedFit)}</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {fits.map((f) => (
                    <button key={f} onClick={() => { setSelectedFit(f); setSelectedSize('') }}
                      style={{ padding: '9px 18px', fontSize: '14px', fontWeight: 600, border: `2px solid ${selectedFit === f ? accent : '#CBD5E1'}`, background: selectedFit === f ? primary : '#fff', color: selectedFit === f ? '#fff' : '#374151', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}>
                      {fitLabel(f)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Colour selector — visual swatches ─────────── */}
            {multiColour && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Colour {selectedColour && <span style={{ color: primary, textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>— {selectedColour}</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  {colours.map((c) => {
                    const css     = COLOUR_CSS[c.toLowerCase()] ?? '#CBD5E1'
                    const isLight = ['#f4f4f4', '#f0ede8', '#d1d5db', '#bae6fd'].includes(css)
                    const sel     = selectedColour === c
                    return (
                      <button
                        key={c}
                        onClick={() => { setSelectedColour(c); setSelectedSize('') }}
                        title={c}
                        aria-label={`Colour: ${c}${sel ? ' (selected)' : ''}`}
                        aria-pressed={sel}
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: css, padding: 0, border: 'none', cursor: 'pointer',
                          boxShadow: sel
                            ? `0 0 0 2px #fff, 0 0 0 4px ${accent}`
                            : isLight
                              ? `inset 0 0 0 1.5px #CBD5E1, 0 1px 3px rgba(0,0,0,0.06)`
                              : `0 1px 4px rgba(0,0,0,0.18)`,
                          transform: sel ? 'scale(1.1)' : 'scale(1)',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Size selector — all sizes, unavailable disabled ── */}
            <div style={{ marginBottom: hasSizeChart ? '8px' : '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Size {selectedSize && <span style={{ color: primary, textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>— {selectedSize}</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allSizesForSelection.map((sz) => {
                  const avail    = availableSizeSet.has(sz)
                  const selected = selectedSize === sz
                  return (
                    <button key={sz} disabled={!avail} onClick={() => avail && setSelectedSize(sz)}
                      title={avail ? undefined : 'Sold out'}
                      style={{
                        minWidth: '52px', height: '48px', padding: '0 14px',
                        fontSize: '14px', fontWeight: 700,
                        border:     `2px solid ${selected ? accent : avail ? '#CBD5E1' : '#E2E8EF'}`,
                        background:  selected ? primary : '#fff',
                        color:       selected ? '#fff' : avail ? '#374151' : '#CBD5E1',
                        borderRadius: '8px', cursor: avail ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit', transition: 'all 0.12s',
                        textDecoration: avail ? 'none' : 'line-through', opacity: avail ? 1 : 0.55,
                      }}>
                      {sz}
                    </button>
                  )
                })}
              </div>
            </div>

            {hasSizeChart && (
              <div style={{ marginBottom: '24px' }}>
                <button onClick={() => setShowSizeChart(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: `1.5px solid ${accent}`, fontSize: '13px', fontWeight: 600, color: accent, cursor: 'pointer', fontFamily: 'inherit' }}>
                  📐 View Size Guide
                </button>
              </div>
            )}

            {/* ── Personalisation fields ────────────────────── */}
            {personalisation.map((p) => (
              <div key={p.id} style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {p.label}
                  {!p.required && <span style={{ color: '#94A3B8', textTransform: 'none', letterSpacing: 0, fontWeight: 500, marginLeft: '6px' }}>(optional)</span>}
                  {p.additional_price_cents > 0 && <span style={{ color: accent, textTransform: 'none', letterSpacing: 0, fontWeight: 600, marginLeft: '6px' }}>+${(p.additional_price_cents / 100).toFixed(2)}</span>}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={p.type === 'number' ? 'number' : 'text'}
                    value={personValues[p.id] ?? ''}
                    onChange={(e) => updatePersonValue(p.id, e.target.value, p)}
                    placeholder={p.placeholder ?? ''}
                    maxLength={p.max_length ?? undefined}
                    style={{ width: '100%', padding: '12px 14px', fontSize: '15px', border: '1.5px solid #CBD5E1', borderRadius: '8px', background: '#fff', color: primary, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', paddingRight: p.max_length ? '52px' : '14px' }}
                  />
                  {p.max_length && (
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#94A3B8', pointerEvents: 'none' }}>
                      {(personValues[p.id] ?? '').length}/{p.max_length}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* ── Quantity ──────────────────────────────────── */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Quantity
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: '48px', height: '48px', fontSize: '22px', border: 'none', borderRight: '1.5px solid #CBD5E1', background: '#F8FAFC', color: primary, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}>−</button>
                <span style={{ minWidth: '56px', textAlign: 'center', fontSize: '18px', fontWeight: 700, color: primary }}>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(20, q + 1))} style={{ width: '48px', height: '48px', fontSize: '22px', border: 'none', borderLeft: '1.5px solid #CBD5E1', background: '#F8FAFC', color: primary, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}>+</button>
              </div>
            </div>

            {/* ── Live order summary ────────────────────────── */}
            <OrderSummary
              productName={product.name}
              fit={selectedFit ? fitLabel(selectedFit) : ''}
              colour={multiColour ? selectedColour : ''}
              size={selectedSize}
              personalisation={personalisation}
              personValues={personValues}
              qty={qty}
              basePriceCents={product.price_cents}
              surchargeCents={surcharge}
              primaryColor={primary}
              accentColor={accent}
            />

            {/* ── Cart confirmation toast ───────────────────── */}
            {addedToCart && (
              <div style={{ marginBottom: '12px', padding: '14px 16px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#15803D' }}>✓ Added to cart!</span>
                <a href={`/merch/${slug}/${campaign.slug}/cart`}
                  style={{ fontSize: '13px', fontWeight: 700, color: '#15803D', textDecoration: 'underline', textUnderlineOffset: '2px', whiteSpace: 'nowrap' }}>
                  View Cart →
                </a>
              </div>
            )}

            {/* ── CTA ───────────────────────────────────────── */}
            {isOpen ? (
              <button
                ref={ctaRef as React.RefObject<HTMLButtonElement>}
                onClick={handleAddToCart} disabled={!canAdd}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '18px 24px', boxSizing: 'border-box', background: canAdd ? accent : '#94A3B8', color: '#fff', border: 'none', fontSize: '16px', fontWeight: 700, letterSpacing: '0.02em', borderRadius: '10px', cursor: canAdd ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'opacity 0.15s' }}>
                {ctaLabel}
              </button>
            ) : (
              <div
                ref={ctaRef as React.RefObject<HTMLDivElement>}
                style={{ width: '100%', padding: '18px', background: '#F1F5F9', borderRadius: '10px', textAlign: 'center', fontSize: '15px', fontWeight: 600, color: '#64748B', boxSizing: 'border-box' }}>
                Campaign closed
              </div>
            )}

            {isOpen && hasMinimum && (
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px', textAlign: 'center', lineHeight: 1.5 }}>
                No payment required now — only charged if minimum quantity is reached.
              </p>
            )}

            <div style={{ borderTop: '1px solid #E2E8EF', margin: '28px 0' }} />

            {/* ── Progress (only shown when product has a real MOQ) ── */}
            {hasMinimum && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Order Progress</div>
                <MerchProgressBar current={progress.orderedQty} minimum={progress.minimumQty} primaryColor={primary} secondaryColor={accent} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px' }}>
                  {[
                    { label: 'Minimum',      value: progress.minimumQty },
                    { label: 'Pre-Ordered',  value: progress.orderedQty },
                    { label: 'Still needed', value: Math.max(0, progress.minimumQty - progress.orderedQty) },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: '#F8FAFC', borderRadius: '8px', padding: '12px 8px', textAlign: 'center', border: '1px solid #E2E8EF' }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: primary, lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: '11px', color: '#5A6B7E', marginTop: '4px', fontWeight: 500 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {campaign.closes_at && isOpen && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Campaign closes in</div>
                <MerchCountdown closingDate={campaign.closes_at} primaryColor={primary} secondaryColor={accent} />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8EF' }}>
              <span style={{ fontSize: '20px', lineHeight: 1 }}>🚚</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: primary }}>Estimated delivery</div>
                <div style={{ fontSize: '13px', color: '#5A6B7E', marginTop: '2px', lineHeight: 1.5 }}>
                  {product.lead_time_days} days after campaign closes and minimum is reached
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Product details section ─────────────────────────── */}
        {(product.features?.length || product.material || product.sizing_notes || product.content.length > 0) && (
          <div style={{ marginTop: '72px', paddingTop: '48px', borderTop: '1px solid #E2E8EF' }}>
            <h2 style={{ fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: '0 0 32px' }}>Product Details</h2>

            {/* Legacy features + material from master product */}
            {(product.features?.length || product.material || product.sizing_notes) && (
              <div style={{ marginBottom: product.content.length > 0 ? '40px' : '0' }}>
                {product.features && product.features.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', columns: 2, columnGap: '32px' }}>
                    {product.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid #F1F5F9', breakInside: 'avoid' }}>
                        <span style={{ color: accent, fontWeight: 800, fontSize: '16px', lineHeight: 1.5, flexShrink: 0 }}>·</span>
                        <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {product.material && <p style={{ fontSize: '14px', color: '#5A6B7E', margin: '0 0 8px' }}><strong style={{ color: primary }}>Material:</strong> {product.material}</p>}
                {product.sizing_notes && <p style={{ fontSize: '14px', color: '#5A6B7E', margin: '0 0 8px' }}><strong style={{ color: primary }}>Sizing notes:</strong> {product.sizing_notes}</p>}
              </div>
            )}

            {/* Rich content sections from DB */}
            {product.content.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {product.content.map((section) => {
                  const icon = CONTENT_SECTION_ICONS[section.section] ?? '·'
                  const heading = section.title ?? section.section.replace(/_/g, ' ')
                  return (
                    <div key={section.id} style={{ background: '#FAFBFC', border: '1px solid #E8ECF2', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '16px', lineHeight: 1 }}>{icon}</span>
                        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: primary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {heading}
                        </h3>
                      </div>
                      {renderContent(section.content_type, section.content)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Related products ────────────────────────────────────── */}
      {related.length > 0 && (
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px 80px' }}>
          <div style={{ borderTop: '1px solid #E2E8EF', paddingTop: '56px' }}>
            {Object.entries(
              related.reduce<Record<string, typeof related>>((acc, item) => {
                acc[item.relationType] = acc[item.relationType] ?? []
                acc[item.relationType].push(item)
                return acc
              }, {}),
            ).map(([relType, items]) => (
              <div key={relType} style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: '0 0 24px' }}>
                  {RELATION_LABELS[relType as ProductRelationType] ?? 'Related Products'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {items.map(({ product: rel }) => (
                    <a key={rel.id} href={`/merch/${slug}/${campaign.slug}/${rel.slug}`}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: '#fff', border: '1px solid #E8ECF2', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ position: 'relative', aspectRatio: '4 / 5', background: '#F3F6FA' }}>
                        {rel.images[0] ? (
                          <Image src={rel.images[0]} alt={rel.name} fill style={{ objectFit: 'contain', padding: '16px' }} sizes="220px" />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '40px', opacity: 0.08 }}>👕</div>
                        )}
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: primary, lineHeight: 1.3, marginBottom: '4px' }}>{rel.name}</div>
                        <div style={{ fontSize: '13px', color: accent, fontWeight: 700 }}>
                          {rel.price_cents != null ? `from $${(rel.price_cents / 100).toFixed(2)}` : 'View product'}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sticky mobile CTA ───────────────────────────────────── */}
      {isOpen && stickyVisible && (
        <div className="sticky-cta" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500,
          padding: '12px 16px', background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(8px)', borderTop: '1px solid #E2E8EF',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
        }}>
          <button onClick={handleAddToCart} disabled={!canAdd} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: '16px 24px',
            background: canAdd ? accent : '#94A3B8', color: '#fff',
            border: 'none', fontSize: '15px', fontWeight: 700,
            letterSpacing: '0.02em', borderRadius: '10px',
            cursor: canAdd ? 'pointer' : 'default', fontFamily: 'inherit',
          }}>
            {ctaLabel}
          </button>
        </div>
      )}

      {/* ── Size chart modal ────────────────────────────────────── */}
      {showSizeChart && (
        <div onClick={() => setShowSizeChart(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '832px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: primary, margin: 0 }}>
                {activeSizeChart ? activeSizeChart.title : 'Size Guide'}
              </h3>
              <button onClick={() => setShowSizeChart(false)} aria-label="Close" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {size_charts.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {size_charts.map((c) => {
                  const active = activeSizeChart?.id === c.id
                  return (
                    <button key={c.id} onClick={() => setSelectedFit(c.fit)}
                      style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 600, border: `2px solid ${active ? accent : '#E2E8EF'}`, background: active ? primary : '#fff', color: active ? '#fff' : '#374151', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {c.fit ? fitLabel(c.fit) : c.title}
                    </button>
                  )
                })}
              </div>
            )}

            {activeSizeChart ? (
              <>
                {activeSizeChart.chart_json.note && (
                  <p style={{ fontSize: '13px', color: '#5A6B7E', marginBottom: '16px', lineHeight: 1.6 }}>{activeSizeChart.chart_json.note}</p>
                )}
                {/* Inline size chart image */}
                {activeSizeChart.image_url && (
                  <div style={{ marginBottom: '16px' }}>
                    <img
                      src={activeSizeChart.image_url}
                      alt={activeSizeChart.title}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }}
                    />
                  </div>
                )}
                {/* Table — only render if headers exist */}
                {(activeSizeChart.chart_json.headers ?? []).length > 0 && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead>
                        <tr>
                          {activeSizeChart.chart_json.headers!.map((h) => (
                            <th key={h} style={{ padding: '10px 14px', background: primary, color: '#fff', textAlign: 'left', fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(activeSizeChart.chart_json.rows ?? []).map((row, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? '#F8FAFC' : '#fff' }}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: '10px 14px', color: '#374151', fontWeight: j === 0 ? 700 : 400, borderBottom: '1px solid #F1F5F9' }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {activeSizeChart.pdf_url && (
                  <div style={{ marginTop: '12px' }}>
                    <a href={activeSizeChart.pdf_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: accent, fontWeight: 600 }}>Download PDF →</a>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: '#5A6B7E', fontSize: '14px' }}>Select a fit above to view its size guide.</p>
            )}
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '20px', lineHeight: 1.6 }}>Sizes are approximate. If between sizes, we recommend sizing up.</p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .product-layout {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .product-layout > div:nth-child(2) {
            position: static !important;
          }
          .sticky-cta {
            display: block !important;
          }
        }
        @media (min-width: 861px) {
          .sticky-cta {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
