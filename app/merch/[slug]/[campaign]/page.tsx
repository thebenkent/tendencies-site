import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getTenant, getCampaign, getProducts, getProductProgress,
  getCollections, getCampaignBanners,
} from '@/lib/merch/db'
import MerchProgressBar from '@/components/merch/MerchProgressBar'
import MerchCountdown from '@/components/merch/MerchCountdown'
import { CartBadge } from '@/components/merch/CartContext'
import type { MerchProductWithVariants, MerchCollection, MerchCampaignBanner, MerchProductBadge, ProductProgress } from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

// ── Badge colours ─────────────────────────────────────────────
const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  default: { bg: '#F1F5F9', text: '#374151' },
  success: { bg: '#DCFCE7', text: '#15803D' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  danger:  { bg: '#FEE2E2', text: '#B91C1C' },
  info:    { bg: '#DBEAFE', text: '#1D4ED8' },
  dark:    { bg: 'rgba(0,0,0,0.6)', text: '#fff' },
}

function Badge({ badge, primary }: { badge: MerchProductBadge; primary: string }) {
  const colors = badge.badge_type === 'dark'
    ? { bg: primary, text: '#fff' }
    : (BADGE_COLORS[badge.badge_type] ?? BADGE_COLORS.default)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 8px', borderRadius: '4px', fontSize: '10px',
      fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      background: colors.bg, color: colors.text,
    }}>
      {badge.icon && <span>{badge.icon}</span>}
      {badge.label}
    </span>
  )
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({
  product, prog, isOpen, slug, campaignSlug, primary, accent,
}: {
  product: MerchProductWithVariants
  prog: ProductProgress
  isOpen: boolean
  slug: string
  campaignSlug: string
  primary: string
  accent: string
}) {
  const closed = !isOpen || prog.isExpired
  const colours = [...new Set(
    product.merch_product_variants.filter((v) => v.available && v.colour).map((v) => v.colour)
  )]
  const multiColour = colours.length > 1
  const activeBadges = product.badges.filter((b) => b.active)

  return (
    <a
      href={`/merch/${slug}/${campaignSlug}/${product.slug}`}
      className="product-card"
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: '14px',
        border: '1px solid #E8ECF2',
        textDecoration: 'none', overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
        position: 'relative',
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
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 320px" />
            : <div style={{ fontSize: '72px', opacity: 0.12 }}>👕</div>}
        </div>

        {/* Badges */}
        {activeBadges.length > 0 && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
            {activeBadges.map((b) => <Badge key={b.id} badge={b} primary={primary} />)}
          </div>
        )}

        {/* Status pill */}
        {closed && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(55,65,81,0.9)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '4px', zIndex: 2 }}>
            Closed
          </div>
        )}
        {prog.isMet && !closed && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(22,163,74,0.9)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '4px', zIndex: 2 }}>
            Min. Reached ✓
          </div>
        )}

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px', background: 'linear-gradient(to top, rgba(240,242,246,0.7), transparent)', pointerEvents: 'none' }} />
      </div>

      {/* Card footer */}
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Name */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: primary, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            {product.name}
          </div>
          {product.description && (
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', lineHeight: 1.45 }}>
              {product.description.slice(0, 60)}{product.description.length > 60 ? '…' : ''}
            </div>
          )}
        </div>

        {/* Colour swatches */}
        {multiColour && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {colours.slice(0, 6).map((c) => (
              <span key={c} title={c} style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: c.toLowerCase() === 'white' ? '#f8f8f8' :
                            c.toLowerCase() === 'black' ? '#1a1a1a' :
                            c.toLowerCase() === 'navy' || c.toLowerCase() === 'navy blue' ? '#0B1F4D' :
                            c.toLowerCase() === 'red' ? '#DC2626' :
                            c.toLowerCase() === 'grey' || c.toLowerCase() === 'gray' ? '#9CA3AF' : '#CBD5E1',
                border: '1.5px solid rgba(0,0,0,0.12)', flexShrink: 0,
              }} />
            ))}
            {colours.length > 6 && (
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>+{colours.length - 6}</span>
            )}
          </div>
        )}

        {/* Progress */}
        <div>
          <div style={{ height: '3px', background: '#E8ECF2', borderRadius: '999px', overflow: 'hidden', marginBottom: '5px' }}>
            <div style={{ height: '100%', width: `${Math.min(100, prog.percentage)}%`, background: prog.isMet ? '#16a34a' : `linear-gradient(90deg, ${primary}, ${accent})`, borderRadius: '999px', transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
            <span>{prog.orderedQty} of {prog.minimumQty} ordered</span>
            <span style={{ fontWeight: 600, color: prog.isMet ? '#16a34a' : '#94A3B8' }}>{prog.percentage}%</span>
          </div>
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
          <span style={{ fontSize: '20px', fontWeight: 800, color: primary, letterSpacing: '-0.02em' }}>
            ${(product.price_cents / 100).toFixed(2)}
          </span>
          <span className="product-card-cta" style={{
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
            color: '#fff', background: closed ? '#94A3B8' : accent,
            padding: '6px 14px', borderRadius: '6px',
            transition: 'opacity 0.15s, transform 0.15s',
          }}>
            {closed ? 'Closed' : 'Shop →'}
          </span>
        </div>
      </div>
    </a>
  )
}

// ── Collection Card ───────────────────────────────────────────
function CollectionCard({
  collection, productCount, slug, campaignSlug, primary,
}: {
  collection: MerchCollection
  productCount: number
  slug: string
  campaignSlug: string
  primary: string
}) {
  return (
    <a
      href={`/merch/${slug}/${campaignSlug}?collection=${collection.slug}`}
      className="collection-card"
      style={{
        display: 'block', borderRadius: '14px', overflow: 'hidden',
        textDecoration: 'none', position: 'relative', aspectRatio: '16 / 9',
        background: primary,
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      }}
    >
      {collection.image_url && (
        <Image src={collection.image_url} alt={collection.name} fill
          style={{ objectFit: 'cover', opacity: 0.6 }} sizes="(max-width: 768px) 100vw, 50vw" />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '24px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
          {productCount} {productCount === 1 ? 'product' : 'products'}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {collection.name}
        </div>
        {collection.description && (
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '6px', lineHeight: 1.5 }}>
            {collection.description.slice(0, 80)}{collection.description.length > 80 ? '…' : ''}
          </div>
        )}
        <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Browse Collection <span style={{ fontSize: '16px' }}>→</span>
        </div>
      </div>
    </a>
  )
}

// ── Banner Strip ──────────────────────────────────────────────
const BANNER_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  info:    { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  success: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  warning: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  urgent:  { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
  neutral: { bg: '#F8FAFC', text: '#374151', border: '#E2E8EF' },
}

function BannerStrip({ banners }: { banners: MerchCampaignBanner[] }) {
  if (banners.length === 0) return null
  return (
    <div>
      {banners.map((b) => {
        const style = BANNER_STYLES[b.banner_type] ?? BANNER_STYLES.neutral
        return (
          <div key={b.id} style={{
            background: style.bg, borderBottom: `1px solid ${style.border}`,
            padding: '10px 24px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '10px', textAlign: 'center',
          }}>
            {b.icon && <span style={{ fontSize: '16px' }}>{b.icon}</span>}
            <span style={{ fontSize: '13px', fontWeight: 600, color: style.text }}>{b.message}</span>
            {b.link_url && b.link_label && (
              <a href={b.link_url} style={{ fontSize: '13px', fontWeight: 700, color: style.text, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                {b.link_label} →
              </a>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string; campaign: string }>
}) {
  const { slug, campaign: campaignSlug } = await params

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
  if (!campaign) notFound()

  // Parallel data fetching
  const [products, collections, banners] = await Promise.all([
    getProducts(campaign.id) as Promise<MerchProductWithVariants[]>,
    getCollections(campaign.id).catch(() => [] as MerchCollection[]),
    getCampaignBanners(campaign.id).catch(() => [] as MerchCampaignBanner[]),
  ])

  const progressList = await Promise.all(products.map((p) => getProductProgress(p, campaign)))

  const primary = tenant.primary_color
  const accent  = tenant.secondary_color
  const isOpen  = campaign.status === 'open' && (!campaign.closes_at || new Date(campaign.closes_at) > new Date())

  const totalCurrent = progressList.reduce((s, p) => s + p.orderedQty, 0)
  const totalMinimum = progressList.reduce((s, p) => s + p.minimumQty, 0)

  // Map collection → product count
  const collectionProductCounts = new Map<string, number>()
  products.forEach((p) => {
    if (p.collection_id) {
      collectionProductCounts.set(p.collection_id, (collectionProductCounts.get(p.collection_id) ?? 0) + 1)
    }
  })

  return (
    <div style={{ background: '#F8F9FB', minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        background: primary, height: '64px',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: '64px',
        zIndex: 40, borderBottom: `3px solid ${accent}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
      }}>
        <a href={`/merch/${slug}`} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {tenant.logo_url
            ? <div style={{ position: 'relative', height: '36px', width: '140px' }}>
                <Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain', objectPosition: 'left center' }} />
              </div>
            : <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>{tenant.name}</span>}
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'none' }} className="merch-label">Merchandise</span>
          <CartBadge slug={slug} campaignSlug={campaignSlug} primaryColor={primary} accentColor={accent} />
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{
        background: primary, position: 'relative', overflow: 'hidden',
        minHeight: '480px', display: 'flex', alignItems: 'center',
      }}>
        {/* Background image */}
        {tenant.hero_image && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${tenant.hero_image})`,
            backgroundSize: 'cover', backgroundPosition: 'center 30%',
            opacity: 0.22,
          }} />
        )}
        {/* Geometric overlay pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 70% 50%, ${accent}18 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, ${primary}44 0%, transparent 50%)`,
        }} />
        {/* Bottom fade to content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: `linear-gradient(to bottom, transparent, ${primary}88)` }} />

        <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '72px 32px 80px' }}>
          {/* Tenant pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `${accent}22`, border: `1px solid ${accent}55`,
            color: accent, padding: '5px 14px', borderRadius: '999px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '24px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, display: 'inline-block' }} />
            {tenant.name}
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.0,
            margin: '0 0 20px', maxWidth: '800px',
          }}>
            {campaign.name}
          </h1>

          {(campaign.description ?? tenant.hero_subtitle) && (
            <p style={{
              fontSize: 'clamp(15px, 1.8vw, 19px)', color: 'rgba(255,255,255,0.68)',
              lineHeight: 1.65, maxWidth: '560px', margin: '0 0 36px',
            }}>
              {campaign.description ?? tenant.hero_subtitle}
            </p>
          )}

          {/* Hero stats bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Products</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{products.length}</div>
            </div>

            {totalMinimum > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Orders Placed</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{totalCurrent}</div>
              </div>
            )}

            {campaign.closes_at && isOpen && (
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 20px', minWidth: '160px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Closes In</div>
                <MerchCountdown closingDate={campaign.closes_at} primaryColor={primary} secondaryColor={accent} />
              </div>
            )}

            {!isOpen && (
              <div style={{ background: 'rgba(55,65,81,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 18px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Campaign Closed</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Campaign Banners ────────────────────────────────── */}
      <BannerStrip banners={banners} />

      {/* ── Overall progress strip ──────────────────────────── */}
      {totalMinimum > 0 && (
        <div style={{ background: '#fff', borderBottom: '1px solid #E8ECF2' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '10px' }}>
              Campaign Progress
            </div>
            <MerchProgressBar current={totalCurrent} minimum={totalMinimum} primaryColor={primary} secondaryColor={accent} />
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 96px' }}>

        {/* Collections section */}
        {collections.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '6px' }}>Browse</div>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: 0 }}>
                  Collections
                </h2>
              </div>
            </div>

            <div className="collection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {collections.map((col) => (
                <CollectionCard
                  key={col.id}
                  collection={col}
                  productCount={collectionProductCounts.get(col.id) ?? 0}
                  slug={slug}
                  campaignSlug={campaignSlug}
                  primary={primary}
                />
              ))}
            </div>
          </section>
        )}

        {/* Products section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '6px' }}>Shop</div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: 0 }}>
                All Products
              </h2>
            </div>
            <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 32px', background: '#fff', borderRadius: '14px', border: '1px solid #E8ECF2', color: '#94A3B8' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>👕</div>
              <p style={{ fontSize: '16px', margin: 0 }}>No products available yet.</p>
            </div>
          ) : (
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  prog={progressList[i]}
                  isOpen={isOpen}
                  slug={slug}
                  campaignSlug={campaignSlug}
                  primary={primary}
                  accent={accent}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ background: primary, padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {tenant.logo_url && (
            <div style={{ position: 'relative', height: '32px', width: '120px', margin: '0 auto 20px' }}>
              <Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain', objectPosition: 'center', filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
            </div>
          )}
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
            {tenant.name} · Merchandise powered by{' '}
            <a href="https://tendencies.co.nz" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Tendencies</a>
          </p>
          {tenant.contact_email && (
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
              Questions?{' '}
              <a href={`mailto:${tenant.contact_email}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                {tenant.contact_email}
              </a>
            </p>
          )}
        </div>
      </footer>

      {/* ── Hover styles ───────────────────────────────────── */}
      <style>{`
        .product-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
        }
        .product-card-image { transition: transform 0.4s ease; }
        .product-card:hover .product-card-image { transform: scale(1.05); }

        .collection-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .collection-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.18);
        }

        @media (max-width: 600px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .collection-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 380px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
