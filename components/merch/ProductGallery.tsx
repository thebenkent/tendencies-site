'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { MerchProductImage } from '@/lib/merch/types'

export type ProductGalleryProps = {
  images:        string[]
  productImages: MerchProductImage[]
  productName:   string
  primaryColor:  string
  accentColor:   string
  aspectRatio?:  string
}

const IMAGE_TYPE_LABELS: Record<string, string> = {
  front:     'Front',
  back:      'Back',
  side:      'Side',
  detail:    'Detail',
  lifestyle: 'Lifestyle',
}

export default function ProductGallery({
  images, productImages, productName, primaryColor, accentColor,
  aspectRatio = '1 / 1',
}: ProductGalleryProps) {
  const [active,       setActive]       = useState(0)
  const [lightbox,     setLightbox]     = useState(false)
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set())
  const touchStartX = useRef<number | null>(null)
  const thumbnailRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation for main gallery
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (lightbox) {
      if (e.key === 'ArrowLeft')  setActive((p) => Math.max(0, p - 1))
      if (e.key === 'ArrowRight') setActive((p) => Math.min(images.length - 1, p + 1))
      if (e.key === 'Escape')     setLightbox(false)
    }
  }, [lightbox, images.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbnailRef.current
    if (!container) return
    const btn = container.children[active] as HTMLElement | undefined
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 48) {
      setActive((prev) => diff > 0
        ? Math.min(images.length - 1, prev + 1)
        : Math.max(0, prev - 1))
    }
    touchStartX.current = null
  }

  const goTo = (i: number) => setActive(Math.max(0, Math.min(images.length - 1, i)))

  return (
    <>
      {/* ── Main image ──────────────────────────────────────── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => images.length > 0 && setLightbox(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft')  goTo(active - 1)
          if (e.key === 'ArrowRight') goTo(active + 1)
          if (e.key === 'Enter')      setLightbox(true)
        }}
        tabIndex={0}
        role="group"
        aria-label={`Product gallery, ${images.length} images. Press Enter to open fullscreen, arrow keys to navigate.`}
        style={{
          position: 'relative', background: '#F3F6FA', borderRadius: '16px',
          overflow: 'hidden', aspectRatio, marginBottom: '12px',
          cursor: images.length > 0 ? 'zoom-in' : 'default',
          outline: 'none',
        }}
      >
        {images.length > 0 ? (
          <Image
            key={active}
            src={images[active]}
            alt={productImages[active]?.alt_text ?? productName}
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
          <div style={{
            position: 'absolute', bottom: '12px', right: '12px',
            background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(4px)',
            color: '#fff', fontSize: '11px', fontWeight: 600,
            padding: '4px 8px', borderRadius: '6px', pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zm1.5-.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-13zM3 6.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0zm3.5-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
            Zoom
          </div>
        )}

        {/* Dot navigation */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: '14px', left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: '5px',
            paddingRight: '64px',
          }} aria-hidden>
            {images.map((_, i) => (
              <button key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i) }}
                aria-label={`Image ${i + 1}`}
                style={{
                  width: active === i ? '18px' : '7px', height: '7px',
                  borderRadius: '999px', border: 'none', padding: 0,
                  background: active === i ? primaryColor : 'rgba(11,31,77,0.3)',
                  cursor: 'pointer', transition: 'width 0.2s, background 0.2s',
                  flexShrink: 0,
                }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ──────────────────────────────────── */}
      {images.length > 1 && (
        <div
          ref={thumbnailRef}
          role="list"
          aria-label="Image thumbnails"
          style={{
            display: 'flex', gap: '8px', overflowX: 'auto',
            paddingBottom: '4px', scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {images.map((img, i) => {
            if (brokenImages.has(i)) return null
            const imgObj = productImages[i]
            const label  = imgObj ? (IMAGE_TYPE_LABELS[imgObj.image_type] ?? null) : null
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                role="listitem"
                aria-label={label ?? `Image ${i + 1}`}
                aria-pressed={active === i}
                title={label ?? undefined}
                style={{
                  flexShrink: 0, width: '76px', padding: 0,
                  border: `2px solid ${active === i ? accentColor : '#E2E8EF'}`,
                  borderRadius: '10px', overflow: 'hidden',
                  background: '#F3F6FA', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: '64px' }}>
                  <Image
                    src={img} alt={label ?? ''}
                    fill style={{ objectFit: 'contain', padding: '6px' }}
                    sizes="76px"
                    onError={() => setBrokenImages((prev) => new Set([...prev, i]))}
                  />
                </div>
                {label && (
                  <div style={{
                    fontSize: '9px', fontWeight: 700, textAlign: 'center',
                    padding: '3px 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em',
                    color: active === i ? accentColor : '#94A3B8',
                    flexShrink: 0,
                  }}>
                    {label}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────── */}
      {lightbox && images.length > 0 && (
        <div
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal
          aria-label={`${productName} — image ${active + 1} of ${images.length}`}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          {/* Main lightbox image */}
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ position: 'relative', width: '90vmin', height: '90vmin', cursor: 'default' }}
          >
            <Image
              src={images[active]}
              alt={productImages[active]?.alt_text ?? productName}
              fill style={{ objectFit: 'contain' }}
              sizes="90vmin"
              priority
            />
          </div>

          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            style={{
              position: 'absolute', top: '16px', right: '16px',
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: 'none',
              color: '#fff', fontSize: '20px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
          >✕</button>

          {/* Prev */}
          {active > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goTo(active - 1) }}
              aria-label="Previous image"
              style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: 'none',
                color: '#fff', fontSize: '24px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >‹</button>
          )}

          {/* Next */}
          {active < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goTo(active + 1) }}
              aria-label="Next image"
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: 'none',
                color: '#fff', fontSize: '24px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >›</button>
          )}

          {/* Dot counter */}
          <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {images.map((_, i) => (
              <button key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i) }}
                aria-label={`Image ${i + 1}`}
                style={{
                  width: active === i ? '22px' : '8px', height: '8px', borderRadius: '999px',
                  border: 'none', padding: 0,
                  background: active === i ? '#fff' : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }} />
            ))}
          </div>

          {/* Image type label */}
          {productImages[active]?.image_type && (
            <div style={{
              position: 'absolute', top: '20px', left: '20px',
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)',
              color: '#fff', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '5px 10px', borderRadius: '5px',
            }}>
              {IMAGE_TYPE_LABELS[productImages[active].image_type] ?? productImages[active].image_type}
            </div>
          )}
        </div>
      )}
    </>
  )
}
