'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import WishlistButton from '@/components/merch/WishlistButton'
import type { MerchProductWithVariants, MerchCollection, ProductProgress, MerchProductBadge } from '@/lib/merch/types'

// ── Colour name → CSS map ─────────────────────────────────────
const COLOUR_CSS: Record<string, string> = {
  'black':          '#1a1a1a',
  'white':          '#f4f4f4',
  'off white':      '#f0ede8',
  'cream':          '#f5f0e8',
  'navy':           '#0B1F4D',
  'navy blue':      '#0B1F4D',
  'royal blue':     '#1e40af',
  'blue':           '#1D4ED8',
  'sky blue':       '#0ea5e9',
  'light blue':     '#bae6fd',
  'red':            '#DC2626',
  'crimson':        '#dc143c',
  'maroon':         '#7f1d1d',
  'burgundy':       '#7f1d1d',
  'green':          '#16a34a',
  'forest green':   '#166534',
  'olive':          '#4d7c0f',
  'teal':           '#0d9488',
  'yellow':         '#ca8a04',
  'gold':           '#b45309',
  'blue/yellow':    '#1A56DB',
  'orange':         '#ea580c',
  'purple':         '#7c3aed',
  'pink':           '#db2777',
  'hot pink':       '#ec4899',
  'grey':           '#6b7280',
  'gray':           '#6b7280',
  'light grey':     '#d1d5db',
  'charcoal':       '#374151',
  'silver':         '#94a3b8',
}

function colourCss(name: string): string {
  return COLOUR_CSS[name.toLowerCase()] ?? '#CBD5E1'
}

function isLightColour(css: string): boolean {
  return ['#f4f4f4', '#f0ede8', '#f5f0e8', '#bae6fd', '#d1d5db'].includes(css)
}

// ── Badge chip ────────────────────────────────────────────────
const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  default: { bg: '#F1F5F9', text: '#374151' },
  success: { bg: '#DCFCE7', text: '#15803D' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  danger:  { bg: '#FEE2E2', text: '#B91C1C' },
  info:    { bg: '#DBEAFE', text: '#1D4ED8' },
  dark:    { bg: 'rgba(0,0,0,0.75)', text: '#fff' },
}

function BadgeChip({ badge, primary }: { badge: MerchProductBadge; primary: string }) {
  const c = badge.badge_type === 'dark'
    ? { bg: primary, text: '#fff' }
    : (BADGE_COLORS[badge.badge_type] ?? BADGE_COLORS.default)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      padding: '2px 7px', borderRadius: '4px', fontSize: '9px',
      fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
      background: c.bg, color: c.text,
    }}>
      {badge.icon && <span style={{ fontSize: '10px' }}>{badge.icon}</span>}
      {badge.label}
    </span>
  )
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({
  product, prog, isOpen, slug, campaignSlug, primary, accent,
}: {
  product:      MerchProductWithVariants
  prog:         ProductProgress
  isOpen:       boolean
  slug:         string
  campaignSlug: string
  primary:      string
  accent:       string
}) {
  const closed         = !isOpen || prog.isExpired
  const badges         = product.badges.filter((b) => b.active)
  const variants       = product.merch_product_variants.filter((v) => v.available)
  const colours        = [...new Set(variants.map((v) => v.colour).filter(Boolean))] as string[]
  const hasPersonalise = product.personalisation?.some((p) => p.active) ?? false

  return (
    <div style={{ position: 'relative' }}>
      <a
        href={`/merch/${slug}/${campaignSlug}/${product.slug}`}
        className="product-card"
        aria-label={`${product.name} — $${(product.price_cents / 100).toFixed(2)}`}
        style={{
          display: 'flex', flexDirection: 'column',
          background: '#fff', borderRadius: '14px',
          border: '1px solid #E8ECF2', textDecoration: 'none', overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
          height: '100%',
        }}
      >
        {/* Image */}
        <div style={{
          aspectRatio: '4 / 5', background: '#F3F5F9',
          overflow: 'hidden', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="product-card-image" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.images[0]
              ? <Image src={product.images[0]} alt={product.name} fill
                  style={{ objectFit: 'contain', padding: '20px' }}
                  sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 280px" />
              : <span style={{ fontSize: '64px', opacity: 0.1 }}>👕</span>}
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
              {badges.slice(0, 2).map((b) => <BadgeChip key={b.id} badge={b} primary={primary} />)}
            </div>
          )}

          {/* Status pill */}
          {closed ? (
            <div style={{ position: 'absolute', top: '10px', right: '44px', background: 'rgba(55,65,81,0.85)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', zIndex: 2 }}>Closed</div>
          ) : prog.isMet ? (
            <div style={{ position: 'absolute', top: '10px', right: '44px', background: 'rgba(22,163,74,0.9)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', zIndex: 2 }}>Min. Reached ✓</div>
          ) : null}

          {/* Bottom gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to top, rgba(240,242,246,0.5), transparent)', pointerEvents: 'none' }} />
        </div>

        {/* Card footer */}
        <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: primary, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
              {product.name}
            </div>
            {product.description && (
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', lineHeight: 1.4 }}>
                {product.description.slice(0, 55)}{product.description.length > 55 ? '…' : ''}
              </div>
            )}
          </div>

          {/* Colour swatches */}
          {colours.length > 1 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {colours.slice(0, 7).map((c) => {
                const css     = colourCss(c)
                const isLight = isLightColour(css)
                return (
                  <span key={c} title={c} style={{
                    width: '11px', height: '11px', borderRadius: '50%',
                    background: css, flexShrink: 0,
                    border: isLight ? '1.5px solid #D1D9E4' : '1.5px solid transparent',
                    boxSizing: 'border-box',
                  }} />
                )
              })}
              {colours.length > 7 && <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>+{colours.length - 7}</span>}
            </div>
          )}

          {/* MOQ progress */}
          <div>
            <div style={{ height: '2px', background: '#E8ECF2', borderRadius: '999px', overflow: 'hidden', marginBottom: '4px' }}>
              <div style={{ height: '100%', width: `${Math.min(100, prog.percentage)}%`, background: prog.isMet ? '#16a34a' : `linear-gradient(90deg, ${primary}, ${accent})`, borderRadius: '999px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>
              <span>{prog.orderedQty} of {prog.minimumQty}</span>
              <span style={{ fontWeight: 600, color: prog.isMet ? '#16a34a' : '#94A3B8' }}>{prog.percentage}%</span>
            </div>
          </div>

          {/* Personalise badge */}
          {hasPersonalise && (
            <div style={{ fontSize: '10px', color: '#5A6B7E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px' }}>✏️</span>
              Personalise with your name
            </div>
          )}

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
            <span style={{ fontSize: '19px', fontWeight: 800, color: primary, letterSpacing: '-0.02em' }}>
              ${(product.price_cents / 100).toFixed(2)}
            </span>
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
              color: '#fff', background: closed ? '#94A3B8' : accent,
              padding: '5px 12px', borderRadius: '5px',
            }}>
              {closed ? 'Closed' : 'Shop →'}
            </span>
          </div>
        </div>
      </a>

      {/* Wishlist button — absolute over image */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 3 }}>
        <WishlistButton
          productId={product.id}
          tenantSlug={slug}
          campaignSlug={campaignSlug}
          accentColor={accent}
          size="sm"
        />
      </div>
    </div>
  )
}

// ── Filter bar ────────────────────────────────────────────────
function FilterBar({
  collections, allColours, allFits,
  filterCollection, filterColour, filterFit, search,
  onCollection, onColour, onFit, onSearch, onClear,
  primary, accent, resultCount,
}: {
  collections:      MerchCollection[]
  allColours:       string[]
  allFits:          string[]
  filterCollection: string | null
  filterColour:     string | null
  filterFit:        string | null
  search:           string
  onCollection:     (v: string | null) => void
  onColour:         (v: string | null) => void
  onFit:            (v: string | null) => void
  onSearch:         (v: string) => void
  onClear:          () => void
  primary:          string
  accent:           string
  resultCount:      number
}) {
  const activeCount = [filterCollection, filterColour, filterFit].filter(Boolean).length
  + (search ? 1 : 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
      {/* Search row */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '160px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '14px', pointerEvents: 'none' }}>🔍</span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            style={{
              width: '100%', padding: '10px 14px 10px 36px', fontSize: '14px',
              border: '1.5px solid #E2E8EF', borderRadius: '8px',
              background: '#fff', color: '#1E293B', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {resultCount} product{resultCount !== 1 ? 's' : ''}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onClear}
            style={{
              background: 'none', border: '1.5px solid #E2E8EF', borderRadius: '6px',
              padding: '7px 12px', fontSize: '12px', fontWeight: 600, color: '#5A6B7E',
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >
            Clear ({activeCount}) ✕
          </button>
        )}
      </div>

      {/* Filter chips row */}
      {(collections.length > 0 || allColours.length > 0 || allFits.length > 0) && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Collection filter */}
          {collections.length > 0 && (
            <>
              {collections.map((col) => {
                const active = filterCollection === col.id
                return (
                  <button
                    key={col.id}
                    onClick={() => onCollection(active ? null : col.id)}
                    aria-pressed={active}
                    style={{
                      padding: '6px 14px', fontSize: '12px', fontWeight: 600,
                      border: `1.5px solid ${active ? primary : '#E2E8EF'}`,
                      background: active ? primary : '#fff',
                      color: active ? '#fff' : '#374151',
                      borderRadius: '999px', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {col.name}
                  </button>
                )
              })}
              <div style={{ width: '1px', height: '20px', background: '#E2E8EF', flexShrink: 0 }} />
            </>
          )}

          {/* Colour swatches */}
          {allColours.map((c) => {
            const css     = colourCss(c)
            const isLight = isLightColour(css)
            const active  = filterColour === c
            return (
              <button
                key={c}
                onClick={() => onColour(active ? null : c)}
                aria-pressed={active}
                aria-label={`Filter by ${c}`}
                title={c}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: css, border: 'none', padding: 0,
                  cursor: 'pointer', flexShrink: 0,
                  boxShadow: active
                    ? `0 0 0 2px white, 0 0 0 4px ${accent}`
                    : isLight
                      ? `inset 0 0 0 1.5px #CBD5E1`
                      : `0 1px 3px rgba(0,0,0,0.2)`,
                  transition: 'box-shadow 0.15s, transform 0.15s',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                }}
              />
            )
          })}

          {/* Fit chips */}
          {allFits.map((f) => {
            const active = filterFit === f
            const FIT_LABELS: Record<string, string> = {
              Mens: "Men's", Womens: "Women's", Youth: 'Youth',
              Unisex: 'Unisex', Kids: 'Kids',
            }
            return (
              <button
                key={f}
                onClick={() => onFit(active ? null : f)}
                aria-pressed={active}
                style={{
                  padding: '5px 12px', fontSize: '12px', fontWeight: 600,
                  border: `1.5px solid ${active ? accent : '#E2E8EF'}`,
                  background: active ? accent : '#fff',
                  color: active ? '#fff' : '#374151',
                  borderRadius: '999px', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {FIT_LABELS[f] ?? f}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────
type Props = {
  products:      MerchProductWithVariants[]
  progressList:  ProductProgress[]
  isOpen:        boolean
  collections:   MerchCollection[]
  slug:          string
  campaignSlug:  string
  primary:       string
  accent:        string
}

export default function CampaignProductGrid({
  products, progressList, isOpen, collections, slug, campaignSlug, primary, accent,
}: Props) {
  const [search,           setSearch]           = useState('')
  const [filterCollection, setFilterCollection] = useState<string | null>(null)
  const [filterColour,     setFilterColour]     = useState<string | null>(null)
  const [filterFit,        setFilterFit]        = useState<string | null>(null)
  const [sortBy,           setSortBy]           = useState<'default' | 'price_asc' | 'price_desc' | 'popular'>('default')

  // Derive all unique colours + fits across all products
  const allColours = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) =>
      p.merch_product_variants.filter((v) => v.available && v.colour).forEach((v) => set.add(v.colour))
    )
    return [...set]
  }, [products])

  const allFits = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) =>
      p.merch_product_variants.filter((v) => v.available && v.fit).forEach((v) => set.add(v.fit))
    )
    return [...set]
  }, [products])

  // Filter + sort
  const filtered = useMemo(() => {
    let list = products.map((p, i) => ({ product: p, prog: progressList[i] }))

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(({ product: p }) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.merch_product_variants.some((v) => v.colour.toLowerCase().includes(q) || v.size.toLowerCase().includes(q))
      )
    }
    if (filterCollection) {
      list = list.filter(({ product: p }) => p.collection_id === filterCollection)
    }
    if (filterColour) {
      list = list.filter(({ product: p }) =>
        p.merch_product_variants.some((v) => v.available && v.colour === filterColour)
      )
    }
    if (filterFit) {
      list = list.filter(({ product: p }) =>
        p.merch_product_variants.some((v) => v.available && v.fit === filterFit)
      )
    }

    if (sortBy === 'price_asc')  list = [...list].sort((a, b) => a.product.price_cents - b.product.price_cents)
    if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.product.price_cents - a.product.price_cents)
    if (sortBy === 'popular')    list = [...list].sort((a, b) => b.prog.orderedQty - a.prog.orderedQty)

    return list
  }, [products, progressList, search, filterCollection, filterColour, filterFit, sortBy])

  function clearAll() {
    setSearch('')
    setFilterCollection(null)
    setFilterColour(null)
    setFilterFit(null)
    setSortBy('default')
  }

  return (
    <section>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '6px' }}>Shop</div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: 0 }}>
            All Products
          </h2>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          aria-label="Sort products"
          style={{
            padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: '#374151',
            border: '1.5px solid #E2E8EF', borderRadius: '8px', background: '#fff',
            fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="default">Featured</option>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>

      {/* Filter bar */}
      <FilterBar
        collections={collections}
        allColours={allColours}
        allFits={allFits}
        filterCollection={filterCollection}
        filterColour={filterColour}
        filterFit={filterFit}
        search={search}
        onCollection={setFilterCollection}
        onColour={setFilterColour}
        onFit={setFilterFit}
        onSearch={setSearch}
        onClear={clearAll}
        primary={primary}
        accent={accent}
        resultCount={filtered.length}
      />

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: '14px', border: '1px solid #E8ECF2' }}>
          <div style={{ fontSize: '40px', opacity: 0.2, marginBottom: '16px' }}>🔍</div>
          <p style={{ fontSize: '16px', color: '#94A3B8', margin: '0 0 16px' }}>No products match your filters.</p>
          <button onClick={clearAll} style={{ padding: '10px 20px', background: primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {filtered.map(({ product, prog }) => (
            <ProductCard
              key={product.id}
              product={product}
              prog={prog}
              isOpen={isOpen}
              slug={slug}
              campaignSlug={campaignSlug}
              primary={primary}
              accent={accent}
            />
          ))}
        </div>
      )}

      <style>{`
        .product-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.06);
        }
        .product-card-image { transition: transform 0.4s ease; }
        .product-card:hover .product-card-image { transform: scale(1.05); }
        @media (max-width: 480px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
      `}</style>
    </section>
  )
}
