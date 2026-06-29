'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import MerchProgressBar from '@/components/merch/MerchProgressBar'
import MerchCountdown  from '@/components/merch/MerchCountdown'
import OrderSummary    from '@/components/merch/OrderSummary'
import { useCart }     from '@/components/merch/CartContext'
import type {
  MerchProductWithVariants, MerchTenant, MerchCampaign, ProductProgress,
} from '@/lib/merch/types'

const FIT_LABELS: Record<string, string> = {
  Mens:   "Men's",
  Womens: "Women's",
  Youth:  'Youth',
  Unisex: 'Unisex',
  Kids:   'Kids',
}
const fitLabel = (fit: string) => FIT_LABELS[fit] ?? fit

const IMAGE_TYPE_LABELS: Record<string, string> = {
  front: 'Front', back: 'Back', side: 'Side', detail: 'Detail', lifestyle: 'Lifestyle',
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
  const [activeImage,    setActiveImage]    = useState(0)
  const [zoomed,         setZoomed]         = useState(false)
  const [brokenImages,   setBrokenImages]   = useState<Set<number>>(new Set())
  const [selectedFit,    setSelectedFit]    = useState<string>(fits.length === 1 ? fits[0] : '')
  const [selectedColour, setSelectedColour] = useState<string>(multiColour ? '' : (colours[0] ?? ''))
  const [selectedSize,   setSelectedSize]   = useState('')
  const [qty,            setQty]            = useState(1)
  const [personValues,   setPersonValues]   = useState<Record<string, string>>({})
  const [showSizeChart,  setShowSizeChart]  = useState(false)
  const [addedToCart,    setAddedToCart]    = useState(false)
  const touchStartX = useRef<number | null>(null)
  const cart = useCart()

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
          id:         p.id,
          label:      p.label,
          value:      (personValues[p.id] ?? '').trim(),
          priceCents: p.additional_price_cents,
        })),
    })
    setAddedToCart(true)
  }

  const images = product.images

  const activeSizeChart =
    size_charts.find((c) => c.fit === selectedFit) ??
    size_charts.find((c) => c.fit === '') ??
    (size_charts.length > 0 ? size_charts[0] : null)
  const hasSizeChart = size_charts.length > 0

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
          <div>
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
                  alt={product.product_images[activeImage]?.alt_text ?? product.name}
                  fill priority
                  style={{ objectFit: 'contain', padding: '40px' }}
                  sizes="(max-width: 820px) 100vw, 600px"
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '96px', opacity: 0.1 }}>
                  👕
                </div>
              )}

              {images.length > 0 && (
                <div style={{ position: 'absolute', bottom: '14px', right: '14px', background: 'rgba(0,0,0,0.35)', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', pointerEvents: 'none' }}>
                  Click to zoom
                </div>
              )}

              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '14px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImage(i) }} aria-label={`Image ${i + 1}`}
                      style={{ width: activeImage === i ? '20px' : '8px', height: '8px', borderRadius: '999px', border: 'none', padding: 0, background: activeImage === i ? primary : 'rgba(11,31,77,0.25)', cursor: 'pointer', transition: 'all 0.2s' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {images.map((img, i) => {
                  if (brokenImages.has(i)) return null
                  const imgObj = product.product_images[i]
                  const label  = imgObj ? IMAGE_TYPE_LABELS[imgObj.image_type] : undefined
                  return (
                    <button key={i} onClick={() => setActiveImage(i)} aria-label={label ?? `Image ${i + 1}`} title={label}
                      style={{ width: '80px', padding: 0, border: `2px solid ${activeImage === i ? accent : '#E2E8EF'}`, borderRadius: '10px', overflow: 'hidden', background: '#F3F6FA', cursor: 'pointer', flexShrink: 0, transition: 'border-color 0.15s' }}>
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
                        <Image src={img} alt={label ?? ''} fill style={{ objectFit: 'contain', padding: '6px' }} sizes="80px"
                          onError={() => setBrokenImages((prev) => new Set([...prev, i]))} />
                      </div>
                      {label && (
                        <div style={{ fontSize: '9px', fontWeight: 700, color: activeImage === i ? accent : '#94A3B8', textAlign: 'center', padding: '3px 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {label}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Details panel ─────────────────────────────────── */}
          <div style={{ position: 'sticky', top: '100px' }}>

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

            {/* ── Colour selector ───────────────────────────── */}
            {multiColour && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Colour {selectedColour && <span style={{ color: primary, textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>— {selectedColour}</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {colours.map((c) => (
                    <button key={c} onClick={() => { setSelectedColour(c); setSelectedSize('') }}
                      style={{ padding: '9px 18px', fontSize: '14px', fontWeight: 600, border: `2px solid ${selectedColour === c ? accent : '#CBD5E1'}`, background: selectedColour === c ? primary : '#fff', color: selectedColour === c ? '#fff' : '#374151', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}>
                      {c}
                    </button>
                  ))}
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
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', fontWeight: 600, color: accent, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', textUnderlineOffset: '3px' }}>
                  View Size Guide →
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
              <button onClick={handleAddToCart} disabled={!canAdd}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '18px 24px', boxSizing: 'border-box', background: canAdd ? accent : '#94A3B8', color: '#fff', border: 'none', fontSize: '16px', fontWeight: 700, letterSpacing: '0.02em', borderRadius: '10px', cursor: canAdd ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'opacity 0.15s' }}>
                {ctaLabel}
              </button>
            ) : (
              <div style={{ width: '100%', padding: '18px', background: '#F1F5F9', borderRadius: '10px', textAlign: 'center', fontSize: '15px', fontWeight: 600, color: '#64748B', boxSizing: 'border-box' }}>
                Campaign closed
              </div>
            )}

            {isOpen && (
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px', textAlign: 'center', lineHeight: 1.5 }}>
                No payment required now — only charged if minimum quantity is reached.
              </p>
            )}

            <div style={{ borderTop: '1px solid #E2E8EF', margin: '28px 0' }} />

            {/* ── Progress ──────────────────────────────────── */}
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
        {(product.features?.length || product.material || product.sizing_notes) && (
          <div style={{ marginTop: '72px', paddingTop: '48px', borderTop: '1px solid #E2E8EF' }}>
            <h2 style={{ fontSize: 'clamp(20px, 2vw, 26px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: '0 0 28px' }}>Product Details</h2>
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
            {product.material && <p style={{ fontSize: '14px', color: '#5A6B7E', margin: '0 0 8px' }}><strong style={{ color: primary }}>Material:</strong> {product.material}</p>}
            {product.sizing_notes && <p style={{ fontSize: '14px', color: '#5A6B7E', margin: '0 0 8px' }}><strong style={{ color: primary }}>Sizing notes:</strong> {product.sizing_notes}</p>}
          </div>
        )}
      </div>

      {/* ── Zoom overlay ────────────────────────────────────────── */}
      {zoomed && images.length > 0 && (
        <div onClick={() => setZoomed(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <div style={{ position: 'relative', width: '90vmin', height: '90vmin' }}>
            <Image src={images[activeImage]} alt={product.product_images[activeImage]?.alt_text ?? product.name} fill style={{ objectFit: 'contain' }} sizes="90vmin" />
          </div>
          <button onClick={() => setZoomed(false)} aria-label="Close" style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.max(0, i - 1)) }} aria-label="Previous image" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeImage === 0 ? 0.3 : 1 }}>‹</button>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.min(images.length - 1, i + 1)) }} aria-label="Next image" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeImage === images.length - 1 ? 0.3 : 1 }}>›</button>
            </>
          )}
        </div>
      )}

      {/* ── Size chart modal ────────────────────────────────────── */}
      {showSizeChart && (
        <div onClick={() => setShowSizeChart(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '640px', width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
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
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr>
                        {activeSizeChart.chart_json.headers.map((h) => (
                          <th key={h} style={{ padding: '10px 14px', background: primary, color: '#fff', textAlign: 'left', fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeSizeChart.chart_json.rows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#F8FAFC' : '#fff' }}>
                          {row.map((cell, j) => (
                            <td key={j} style={{ padding: '10px 14px', color: '#374151', fontWeight: j === 0 ? 700 : 400, borderBottom: '1px solid #F1F5F9' }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(activeSizeChart.image_url || activeSizeChart.pdf_url) && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    {activeSizeChart.image_url && <a href={activeSizeChart.image_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: accent, fontWeight: 600 }}>View chart image →</a>}
                    {activeSizeChart.pdf_url   && <a href={activeSizeChart.pdf_url}   target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: accent, fontWeight: 600 }}>Download PDF →</a>}
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
        }
      `}</style>
    </>
  )
}
