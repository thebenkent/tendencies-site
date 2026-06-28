'use client'

import { useState } from 'react'
import Image from 'next/image'
import MerchProgressBar from '@/components/merch/MerchProgressBar'
import MerchCountdown from '@/components/merch/MerchCountdown'
import type {
  MerchProductWithVariants,
  MerchTenant,
  MerchCampaign,
  ProductProgress,
} from '@/lib/merch/types'

type Props = {
  tenant: MerchTenant
  campaign: MerchCampaign
  product: MerchProductWithVariants
  progress: ProductProgress
  slug: string
}

export default function ProductDetail({ tenant, campaign, product, progress, slug }: Props) {
  const navy = tenant.primary_color
  const red  = tenant.secondary_color

  const isOpen = campaign.status === 'open' &&
    (!campaign.closes_at || new Date(campaign.closes_at) > new Date())

  const variants    = product.merch_product_variants.filter((v) => v.available)
  const colours     = [...new Set(variants.map((v) => v.colour).filter(Boolean))] as string[]
  const multiColour = colours.length > 1

  const [activeImage,    setActiveImage]    = useState(0)
  const [selectedColour, setSelectedColour] = useState(multiColour ? '' : (colours[0] ?? ''))
  const [selectedSize,   setSelectedSize]   = useState('')
  const [qty,            setQty]            = useState(1)
  const [brokenImages,   setBrokenImages]   = useState<Set<number>>(new Set())

  const availableSizes = [
    ...new Set(
      variants
        .filter((v) => !multiColour || !selectedColour || v.colour === selectedColour)
        .map((v) => v.size)
    ),
  ]

  const selectedVariant =
    variants.find(
      (v) => v.size === selectedSize && (!multiColour || v.colour === selectedColour)
    ) ?? null

  const surcharge  = selectedVariant?.additional_cost_cents ?? 0
  const unitPrice  = product.price_cents + surcharge
  const totalPrice = unitPrice * qty
  const canReserve = isOpen && !!selectedVariant

  const reserveUrl = selectedVariant
    ? `/merch/${slug}/${campaign.slug}/${product.slug}/reserve?variant_id=${selectedVariant.id}&qty=${qty}`
    : null

  const images = product.images

  const ctaLabel = canReserve
    ? `Pre-Order Now — $${(totalPrice / 100).toFixed(2)}`
    : multiColour && !selectedColour
      ? 'Select colour & size to continue'
      : !selectedSize
        ? 'Select a size to continue'
        : 'Select options to continue'

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #E2E8EF', padding: '14px 32px', background: '#FAFBFC' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', fontSize: '13px', color: '#5A6B7E', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <a href={`/merch/${slug}`} style={{ color: '#5A6B7E', textDecoration: 'none' }}>{tenant.name}</a>
          <span style={{ opacity: 0.4 }}>›</span>
          <a href={`/merch/${slug}/${campaign.slug}`} style={{ color: '#5A6B7E', textDecoration: 'none' }}>{campaign.name}</a>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: navy, fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* Page body */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px 32px 96px' }}>
        <div className="product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '72px', alignItems: 'start' }}>

          {/* ── Gallery ──────────────────────────────────────── */}
          <div>
            {/* Main image */}
            <div style={{ position: 'relative', background: '#F3F6FA', borderRadius: '16px', overflow: 'hidden', aspectRatio: '1 / 1', marginBottom: '12px' }}>
              {images.length > 0 ? (
                <Image
                  key={activeImage}
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  priority
                  style={{ objectFit: 'contain', padding: '40px' }}
                  sizes="(max-width: 820px) 100vw, 600px"
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '96px', opacity: 0.1 }}>
                  👕
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
                        width: '88px', height: '88px', padding: 0,
                        border: `2px solid ${activeImage === i ? navy : '#E2E8EF'}`,
                        borderRadius: '10px', overflow: 'hidden',
                        background: '#F3F6FA', cursor: 'pointer',
                        position: 'relative', flexShrink: 0,
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        style={{ objectFit: 'contain', padding: '8px' }}
                        sizes="88px"
                        onError={() => setBrokenImages((prev) => new Set([...prev, i]))}
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Details ──────────────────────────────────────── */}
          <div style={{ position: 'sticky', top: '100px' }}>

            {/* Status pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '5px 12px', borderRadius: '999px',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: '20px',
              background: !isOpen ? '#F1F5F9' : progress.isMet ? '#DCFCE7' : '#FFF7ED',
              color:      !isOpen ? '#64748B' : progress.isMet ? '#15803D' : '#92400E',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
              {!isOpen
                ? 'Campaign closed'
                : progress.isMet
                  ? 'Minimum reached — proceeding'
                  : 'Building to minimum'}
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 2.5vw, 36px)', fontWeight: 800, color: navy, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 12px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: navy, letterSpacing: '-0.02em' }}>
                ${(unitPrice / 100).toFixed(2)}
              </span>
              {surcharge > 0 && (
                <span style={{ fontSize: '13px', color: '#5A6B7E' }}>
                  incl. ${(surcharge / 100).toFixed(2)} surcharge
                </span>
              )}
            </div>

            {product.description && (
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.75, margin: '0 0 28px' }}>
                {product.description}
              </p>
            )}

            {/* Colour */}
            {multiColour && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Colour
                  {selectedColour && (
                    <span style={{ color: navy, marginLeft: '8px', textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>
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
                        border: `2px solid ${selectedColour === c ? navy : '#CBD5E1'}`,
                        background: selectedColour === c ? navy : '#fff',
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

            {/* Size */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Size
                {selectedSize && (
                  <span style={{ color: navy, marginLeft: '8px', textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>
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
                      border: `2px solid ${selectedSize === sz ? navy : '#CBD5E1'}`,
                      background: selectedSize === sz ? navy : '#fff',
                      color:      selectedSize === sz ? '#fff' : '#374151',
                      borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.12s',
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              {product.sizing_notes && (
                <p style={{ fontSize: '12px', color: '#5A6B7E', marginTop: '8px', lineHeight: 1.5 }}>
                  📏 {product.sizing_notes}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Quantity
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ width: '48px', height: '48px', fontSize: '22px', fontWeight: 400, border: 'none', borderRight: '1.5px solid #CBD5E1', background: '#F8FAFC', color: navy, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}
                >
                  −
                </button>
                <span style={{ minWidth: '56px', textAlign: 'center', fontSize: '18px', fontWeight: 700, color: navy }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  style={{ width: '48px', height: '48px', fontSize: '22px', fontWeight: 400, border: 'none', borderLeft: '1.5px solid #CBD5E1', background: '#F8FAFC', color: navy, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            {isOpen ? (
              <a
                href={canReserve ? reserveUrl! : undefined}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', padding: '18px 24px', boxSizing: 'border-box',
                  background: canReserve ? navy : '#94A3B8',
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
                : `This campaign is no longer accepting orders.`}
            </p>

            <div style={{ borderTop: '1px solid #E2E8EF', margin: '28px 0' }} />

            {/* Progress */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Order Progress
              </div>
              <MerchProgressBar
                current={progress.orderedQty}
                minimum={progress.minimumQty}
                primaryColor={navy}
                secondaryColor={red}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px' }}>
                {[
                  { label: 'Minimum', value: progress.minimumQty },
                  { label: 'Pre-Ordered', value: progress.orderedQty },
                  { label: 'Still needed', value: Math.max(0, progress.minimumQty - progress.orderedQty) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#F8FAFC', borderRadius: '8px', padding: '12px 8px', textAlign: 'center', border: '1px solid #E2E8EF' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: navy, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '11px', color: '#5A6B7E', marginTop: '4px', fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Countdown */}
            {campaign.closes_at && isOpen && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Campaign closes in
                </div>
                <MerchCountdown
                  closingDate={campaign.closes_at}
                  primaryColor={navy}
                  secondaryColor={red}
                />
              </div>
            )}

            {/* Delivery */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8EF' }}>
              <span style={{ fontSize: '20px', lineHeight: 1 }}>🚚</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: navy }}>Estimated delivery</div>
                <div style={{ fontSize: '13px', color: '#5A6B7E', marginTop: '2px', lineHeight: 1.5 }}>
                  {product.lead_time_days} days after campaign closes and minimum is reached
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features — full width */}
        {product.features && product.features.length > 0 && (
          <div style={{ marginTop: '72px', paddingTop: '48px', borderTop: '1px solid #E2E8EF' }}>
            <h2 style={{ fontSize: 'clamp(20px, 2vw, 26px)', fontWeight: 800, color: navy, letterSpacing: '-0.025em', margin: '0 0 28px' }}>
              Product Details
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0' }}>
              {product.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: red, fontWeight: 800, fontSize: '18px', lineHeight: 1.4, flexShrink: 0 }}>·</span>
                  <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65 }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
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
