'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import MerchProgressBar from '@/components/merch/MerchProgressBar'
import MerchCountdown from '@/components/merch/MerchCountdown'
import type {
  MerchProductWithVariants,
  MerchTenant,
  MerchCampaign,
  ProductProgress,
  SizeChart,
} from '@/lib/merch/types'

// Display labels for fit keys stored in the DB
const FIT_LABELS: Record<string, string> = {
  Mens:   "Men's",
  Womens: "Women's",
  Youth:  'Youth',
  Unisex: 'Unisex',
  Kids:   'Kids',
}
function fitLabel(fit: string) {
  return FIT_LABELS[fit] ?? fit
}

type Props = {
  tenant:   MerchTenant
  campaign: MerchCampaign
  product:  MerchProductWithVariants
  progress: ProductProgress
  slug:     string
}

export default function ProductDetail({ tenant, campaign, product, progress, slug }: Props) {
  const primary = tenant.primary_color
  const accent  = tenant.secondary_color

  const isOpen = campaign.status === 'open' &&
    (!campaign.closes_at || new Date(campaign.closes_at) > new Date())

  const variants     = product.merch_product_variants.filter((v) => v.available)
  const colours      = [...new Set(variants.map((v) => v.colour).filter(Boolean))] as string[]
  const multiColour  = colours.length > 1

  // Fits: derive ordered unique list from variant data
  const fits    = [...new Set(variants.map((v) => v.fit).filter(Boolean))] as string[]
  const hasFits = fits.length > 0

  // Product options
  const opts    = product.product_options ?? {}
  const pnOpt   = opts.personalisation?.player_name
  const charts  = opts.size_charts ?? {}

  // ── State ──────────────────────────────────────────────────
  const [activeImage,    setActiveImage]    = useState(0)
  const [zoomed,         setZoomed]         = useState(false)
  const [brokenImages,   setBrokenImages]   = useState<Set<number>>(new Set())
  const [selectedFit,    setSelectedFit]    = useState<string>(fits.length === 1 ? fits[0] : '')
  const [selectedColour, setSelectedColour] = useState<string>(multiColour ? '' : (colours[0] ?? ''))
  const [selectedSize,   setSelectedSize]   = useState('')
  const [qty,            setQty]            = useState(1)
  const [playerName,     setPlayerName]     = useState('')
  const [showSizeChart,  setShowSizeChart]  = useState(false)
  const touchStartX = useRef<number | null>(null)

  // Sizes available for the current fit (+ colour if multi-colour)
  const availableSizes = [...new Set(
    variants
      .filter((v) => !hasFits || !selectedFit || v.fit === selectedFit)
      .filter((v) => !multiColour || !selectedColour || v.colour === selectedColour)
      .map((v) => v.size),
  )]

  // Resolve the selected variant
  const selectedVariant = variants.find(
    (v) =>
      (!hasFits || v.fit === selectedFit) &&
      v.size === selectedSize &&
      (!multiColour || v.colour === selectedColour),
  ) ?? null

  const surcharge  = selectedVariant?.additional_cost_cents ?? 0
  const unitPrice  = product.price_cents + surcharge
  const totalPrice = unitPrice * qty

  const pnSurcharge = pnOpt?.additional_price_cents ?? 0
  const pnActive    = pnOpt?.enabled && playerName.trim().length > 0
  const displayPrice = unitPrice + (pnActive ? pnSurcharge : 0)

  const canReserve = isOpen && !!selectedVariant && (!hasFits || !!selectedFit)

  const reserveUrl = canReserve
    ? `/merch/${slug}/${campaign.slug}/${product.slug}/reserve?variant_id=${selectedVariant!.id}&qty=${qty}${pnOpt?.enabled && playerName.trim() ? `&player_name=${encodeURIComponent(playerName.trim())}` : ''}`
    : null

  const ctaLabel = !isOpen
    ? 'Campaign closed'
    : !selectedVariant
      ? hasFits && !selectedFit
        ? 'Select a fit to continue'
        : multiColour && !selectedColour
          ? 'Select a colour to continue'
          : 'Select a size to continue'
      : `Pre-Order Now — $${(displayPrice * qty / 100).toFixed(2)}`

  const images = product.images

  // Size chart for the current fit (or first available)
  const activeSizeChart: SizeChart | null =
    selectedFit ? (charts[selectedFit] ?? null) : (Object.values(charts)[0] ?? null)
  const hasSizeChart = activeSizeChart !== null || Object.keys(charts).length > 0

  // ── Touch swipe ───────────────────────────────────────────
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 48) {
      if (diff > 0) setActiveImage((i) => Math.min(images.length - 1, i + 1))
      else          setActiveImage((i) => Math.max(0, i - 1))
    }
    touchStartX.current = null
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
          <div>
            {/* Main image */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => images.length > 0 && setZoomed(true)}
              style={{
                position: 'relative', background: '#F3F6FA', borderRadius: '16px',
                overflow: 'hidden', aspectRatio: '1 / 1', marginBottom: '12px',
                cursor: images.length > 0 ? 'zoom-in' : 'default',
              }}
            >
              {images.length > 0 ? (
                <Image
                  key={activeImage}
                  src={images[activeImage]}
                  alt={product.name}
                  fill priority
                  style={{ objectFit: 'contain', padding: '40px' }}
                  sizes="(max-width: 820px) 100vw, 600px"
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '96px', opacity: 0.1 }}>
                  👕
                </div>
              )}

              {/* Mobile swipe dots */}
              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActiveImage(i) }}
                      aria-label={`Image ${i + 1}`}
                      style={{
                        width: activeImage === i ? '20px' : '8px', height: '8px',
                        borderRadius: '999px', border: 'none', padding: 0,
                        background: activeImage === i ? primary : 'rgba(11,31,77,0.25)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {images.map((img, i) => {
                  if (brokenImages.has(i)) return null
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      style={{
                        width: '80px', height: '80px', padding: 0, border: `2px solid ${activeImage === i ? accent : '#E2E8EF'}`,
                        borderRadius: '10px', overflow: 'hidden', background: '#F3F6FA',
                        cursor: 'pointer', position: 'relative', flexShrink: 0,
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <Image
                        src={img} alt="" fill
                        style={{ objectFit: 'contain', padding: '6px' }}
                        sizes="80px"
                        onError={() => setBrokenImages((prev) => new Set([...prev, i]))}
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Details panel ─────────────────────────────────── */}
          <div style={{ position: 'sticky', top: '100px' }}>

            {/* Status pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '5px 12px', borderRadius: '999px', marginBottom: '20px',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              background: !isOpen ? '#F1F5F9' : progress.isMet ? '#DCFCE7' : '#FFF7ED',
              color:      !isOpen ? '#64748B' : progress.isMet ? '#15803D' : '#92400E',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
              {!isOpen ? 'Campaign closed' : progress.isMet ? 'Minimum reached — proceeding' : 'Building to minimum'}
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 2.5vw, 36px)', fontWeight: 800, color: primary, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 12px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: primary, letterSpacing: '-0.02em' }}>
                ${(displayPrice / 100).toFixed(2)}
              </span>
              {surcharge > 0 && (
                <span style={{ fontSize: '13px', color: '#5A6B7E' }}>
                  incl. ${(surcharge / 100).toFixed(2)} size surcharge
                </span>
              )}
              {pnActive && pnSurcharge > 0 && (
                <span style={{ fontSize: '13px', color: '#5A6B7E' }}>
                  + ${(pnSurcharge / 100).toFixed(2)} personalisation
                </span>
              )}
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
                  Fit
                  {selectedFit && (
                    <span style={{ color: primary, marginLeft: '8px', textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>
                      — {fitLabel(selectedFit)}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {fits.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setSelectedFit(f); setSelectedSize('') }}
                      style={{
                        padding: '9px 18px', fontSize: '14px', fontWeight: 600,
                        border: `2px solid ${selectedFit === f ? accent : '#CBD5E1'}`,
                        background: selectedFit === f ? primary : '#fff',
                        color:      selectedFit === f ? '#fff' : '#374151',
                        borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.12s',
                      }}
                    >
                      {fitLabel(f)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Colour selector ───────────────────────────── */}
            {multiColour && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Colour
                  {selectedColour && (
                    <span style={{ color: primary, marginLeft: '8px', textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>
                      — {selectedColour}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {colours.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedColour(c); setSelectedSize('') }}
                      style={{
                        padding: '9px 18px', fontSize: '14px', fontWeight: 600,
                        border: `2px solid ${selectedColour === c ? accent : '#CBD5E1'}`,
                        background: selectedColour === c ? primary : '#fff',
                        color:      selectedColour === c ? '#fff' : '#374151',
                        borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.12s',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Size selector ─────────────────────────────── */}
            <div style={{ marginBottom: hasSizeChart ? '8px' : '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Size
                {selectedSize && (
                  <span style={{ color: primary, marginLeft: '8px', textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>
                    — {selectedSize}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      minWidth: '52px', height: '48px', padding: '0 14px',
                      fontSize: '14px', fontWeight: 700,
                      border: `2px solid ${selectedSize === sz ? accent : '#CBD5E1'}`,
                      background: selectedSize === sz ? primary : '#fff',
                      color:      selectedSize === sz ? '#fff' : '#374151',
                      borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.12s',
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Size guide link */}
            {hasSizeChart && (
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => setShowSizeChart(true)}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: '13px', fontWeight: 600, color: accent,
                    cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit',
                    textUnderlineOffset: '3px',
                  }}
                >
                  View Size Guide →
                </button>
              </div>
            )}

            {/* ── Player name personalisation ───────────────── */}
            {pnOpt?.enabled && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {pnOpt.label}
                  {!pnOpt.required && (
                    <span style={{ color: '#94A3B8', textTransform: 'none', letterSpacing: 0, fontWeight: 500, marginLeft: '6px' }}>
                      (optional)
                    </span>
                  )}
                  {pnSurcharge > 0 && (
                    <span style={{ color: accent, textTransform: 'none', letterSpacing: 0, fontWeight: 600, marginLeft: '6px' }}>
                      +${(pnSurcharge / 100).toFixed(2)}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      let val = e.target.value
                      if (pnOpt.uppercase_only) val = val.toUpperCase()
                      if (val.length <= pnOpt.max_chars) setPlayerName(val)
                    }}
                    placeholder={pnOpt.placeholder}
                    maxLength={pnOpt.max_chars}
                    style={{
                      width: '100%', padding: '12px 14px', fontSize: '15px',
                      border: '1.5px solid #CBD5E1', borderRadius: '8px',
                      background: '#fff', color: primary, fontFamily: 'inherit',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#94A3B8', pointerEvents: 'none' }}>
                    {playerName.length}/{pnOpt.max_chars}
                  </span>
                </div>
              </div>
            )}

            {/* ── Quantity ──────────────────────────────────── */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Quantity
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ width: '48px', height: '48px', fontSize: '22px', fontWeight: 400, border: 'none', borderRight: '1.5px solid #CBD5E1', background: '#F8FAFC', color: primary, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}
                >
                  −
                </button>
                <span style={{ minWidth: '56px', textAlign: 'center', fontSize: '18px', fontWeight: 700, color: primary }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  style={{ width: '48px', height: '48px', fontSize: '22px', fontWeight: 400, border: 'none', borderLeft: '1.5px solid #CBD5E1', background: '#F8FAFC', color: primary, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}
                >
                  +
                </button>
              </div>
            </div>

            {/* ── CTA ───────────────────────────────────────── */}
            {isOpen ? (
              <a
                href={canReserve ? reserveUrl! : undefined}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', padding: '18px 24px', boxSizing: 'border-box',
                  background: canReserve ? accent : '#94A3B8',
                  color: '#fff', textDecoration: 'none',
                  fontSize: '16px', fontWeight: 700, letterSpacing: '0.02em',
                  borderRadius: '10px', cursor: canReserve ? 'pointer' : 'default',
                  pointerEvents: canReserve ? 'auto' : 'none',
                  transition: 'opacity 0.15s',
                }}
              >
                {ctaLabel}
              </a>
            ) : (
              <div style={{ width: '100%', padding: '18px', background: '#F1F5F9', borderRadius: '10px', textAlign: 'center', fontSize: '15px', fontWeight: 600, color: '#64748B', boxSizing: 'border-box' }}>
                Campaign closed
              </div>
            )}

            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px', textAlign: 'center', lineHeight: 1.5 }}>
              {isOpen
                ? 'No payment required now — only charged if minimum quantity is reached.'
                : 'This campaign is no longer accepting orders.'}
            </p>

            <div style={{ borderTop: '1px solid #E2E8EF', margin: '28px 0' }} />

            {/* ── Progress ──────────────────────────────────── */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Order Progress
              </div>
              <MerchProgressBar
                current={progress.orderedQty}
                minimum={progress.minimumQty}
                primaryColor={primary}
                secondaryColor={accent}
              />
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

            {/* ── Countdown ─────────────────────────────────── */}
            {campaign.closes_at && isOpen && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Campaign closes in
                </div>
                <MerchCountdown
                  closingDate={campaign.closes_at}
                  primaryColor={primary}
                  secondaryColor={accent}
                />
              </div>
            )}

            {/* ── Delivery ──────────────────────────────────── */}
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

        {/* ── Product Details ─────────────────────────────────── */}
        {(product.features?.length || product.material || product.sizing_notes) && (
          <div style={{ marginTop: '72px', paddingTop: '48px', borderTop: '1px solid #E2E8EF' }}>
            <h2 style={{ fontSize: 'clamp(20px, 2vw, 26px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: '0 0 28px' }}>
              Product Details
            </h2>

            {product.features && product.features.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 0 }}>
                {product.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: accent, fontWeight: 800, fontSize: '18px', lineHeight: 1.4, flexShrink: 0 }}>·</span>
                    <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65 }}>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {product.material && (
              <p style={{ fontSize: '14px', color: '#5A6B7E', margin: '0 0 8px' }}>
                <strong style={{ color: primary }}>Material:</strong> {product.material}
              </p>
            )}

            {product.sizing_notes && (
              <p style={{ fontSize: '14px', color: '#5A6B7E', margin: '0 0 8px' }}>
                <strong style={{ color: primary }}>Sizing notes:</strong> {product.sizing_notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Zoom overlay ────────────────────────────────────────── */}
      {zoomed && images.length > 0 && (
        <div
          onClick={() => setZoomed(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out',
          }}
        >
          <div style={{ position: 'relative', width: '90vmin', height: '90vmin' }}>
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              sizes="90vmin"
            />
          </div>
          <button
            onClick={() => setZoomed(false)}
            aria-label="Close"
            style={{
              position: 'absolute', top: '20px', right: '20px',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: '#fff', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.max(0, i - 1)) }}
                aria-label="Previous image"
                style={{
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  color: '#fff', fontSize: '20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: activeImage === 0 ? 0.3 : 1,
                }}
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.min(images.length - 1, i + 1)) }}
                aria-label="Next image"
                style={{
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  color: '#fff', fontSize: '20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: activeImage === images.length - 1 ? 0.3 : 1,
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Size chart modal ────────────────────────────────────── */}
      {showSizeChart && (
        <div
          onClick={() => setShowSizeChart(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.55)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '16px', padding: '32px',
              maxWidth: '640px', width: '100%', maxHeight: '85vh', overflowY: 'auto',
              boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: primary, margin: 0 }}>
                {selectedFit ? `${fitLabel(selectedFit)} Size Guide` : 'Size Guide'}
              </h3>
              <button
                onClick={() => setShowSizeChart(false)}
                aria-label="Close"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#F1F5F9', border: 'none', cursor: 'pointer',
                  fontSize: '18px', color: '#374151', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Fit tabs (if multiple charts) */}
            {Object.keys(charts).length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {Object.keys(charts).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFit(f)}
                    style={{
                      padding: '6px 14px', fontSize: '13px', fontWeight: 600,
                      border: `2px solid ${selectedFit === f ? accent : '#E2E8EF'}`,
                      background: selectedFit === f ? primary : '#fff',
                      color: selectedFit === f ? '#fff' : '#374151',
                      borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {fitLabel(f)}
                  </button>
                ))}
              </div>
            )}

            {/* Chart table */}
            {activeSizeChart ? (
              <>
                {activeSizeChart.note && (
                  <p style={{ fontSize: '13px', color: '#5A6B7E', marginBottom: '16px', lineHeight: 1.6 }}>
                    {activeSizeChart.note}
                  </p>
                )}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr>
                        {activeSizeChart.headers.map((h) => (
                          <th key={h} style={{
                            padding: '10px 14px', background: primary, color: '#fff',
                            textAlign: 'left', fontWeight: 700, fontSize: '12px',
                            letterSpacing: '0.04em', whiteSpace: 'nowrap',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeSizeChart.rows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#F8FAFC' : '#fff' }}>
                          {row.map((cell, j) => (
                            <td key={j} style={{
                              padding: '10px 14px', color: '#374151',
                              fontWeight: j === 0 ? 700 : 400,
                              borderBottom: '1px solid #F1F5F9',
                            }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p style={{ color: '#5A6B7E', fontSize: '14px' }}>
                Select a fit above to view the size guide.
              </p>
            )}

            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '20px', lineHeight: 1.6 }}>
              Sizes are approximate. If between sizes, we recommend sizing up.
            </p>
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
        }
        /* Hide swipe dots on desktop */
        @media (min-width: 861px) {
          .product-layout > div:first-child button[aria-label^="Image"] {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
