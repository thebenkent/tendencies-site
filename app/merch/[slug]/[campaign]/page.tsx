import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getTenant, getCampaign, getProducts, getProductProgress,
  getCollections, getCampaignBanners,
} from '@/lib/merch/db'
import MerchProgressBar    from '@/components/merch/MerchProgressBar'
import MerchCountdown      from '@/components/merch/MerchCountdown'
import { CartBadge }       from '@/components/merch/CartContext'
import CampaignProductGrid from '@/components/merch/CampaignProductGrid'
import type {
  MerchProductWithVariants, MerchCollection, MerchCampaignBanner,
} from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

// ── Banner strip ─────────────────────────────────────────────
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
        const s = BANNER_STYLES[b.banner_type] ?? BANNER_STYLES.neutral
        return (
          <div key={b.id} style={{ background: s.bg, borderBottom: `1px solid ${s.border}`, padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textAlign: 'center' }}>
            {b.icon && <span style={{ fontSize: '15px' }}>{b.icon}</span>}
            <span style={{ fontSize: '13px', fontWeight: 600, color: s.text }}>{b.message}</span>
            {b.link_url && b.link_label && (
              <a href={b.link_url} style={{ fontSize: '13px', fontWeight: 700, color: s.text, textDecoration: 'underline', textUnderlineOffset: '2px' }}>{b.link_label} →</a>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Collection card ──────────────────────────────────────────
function CollectionCard({
  col, productCount, slug, campaignSlug, primary,
}: {
  col: MerchCollection; productCount: number; slug: string; campaignSlug: string; primary: string
}) {
  return (
    <a href={`/merch/${slug}/${campaignSlug}/collection/${col.slug}`}
      className="collection-card"
      style={{ display: 'block', borderRadius: '14px', overflow: 'hidden', textDecoration: 'none', position: 'relative', aspectRatio: '16 / 9', background: primary, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
      {col.image_url && (
        <Image src={col.image_url} alt={col.name} fill style={{ objectFit: 'cover', opacity: 0.55 }} sizes="(max-width: 768px) 100vw, 50vw" />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: '5px' }}>
          {productCount} {productCount === 1 ? 'product' : 'products'}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{col.name}</div>
        {col.description && (
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '5px', lineHeight: 1.5 }}>
            {col.description.slice(0, 80)}{col.description.length > 80 ? '…' : ''}
          </div>
        )}
        <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: 700, color: '#fff' }}>Browse Collection →</div>
      </div>
    </a>
  )
}

// ── Page ─────────────────────────────────────────────────────
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

  const [products, collections, banners] = await Promise.all([
    getProducts(campaign.id) as Promise<MerchProductWithVariants[]>,
    getCollections(campaign.id).catch(() => [] as MerchCollection[]),
    getCampaignBanners(campaign.id).catch(() => [] as MerchCampaignBanner[]),
  ])

  const progressList = await Promise.all(products.map((p) => getProductProgress(p, campaign)))

  const primary  = tenant.primary_color
  const accent   = tenant.secondary_color
  const isOpen   = campaign.status === 'open' && (!campaign.closes_at || new Date(campaign.closes_at) > new Date())
  const totalOrdered = progressList.reduce((s, p) => s + p.orderedQty, 0)
  const totalMinimum = progressList.reduce((s, p) => s + p.minimumQty, 0)

  const collectionProductCounts = new Map<string, number>()
  products.forEach((p) => {
    if (p.collection_id) {
      collectionProductCounts.set(p.collection_id, (collectionProductCounts.get(p.collection_id) ?? 0) + 1)
    }
  })

  return (
    <div style={{ background: '#F8F9FB', minHeight: '100vh' }}>

      {/* ── Sticky header ──────────────────────────────────── */}
      <header style={{
        background: primary, height: '64px', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: '64px', zIndex: 40,
        borderBottom: `3px solid ${accent}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
      }}>
        <a href={`/merch/${slug}`} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {tenant.logo_url
            ? <div style={{ position: 'relative', height: '44px', width: '44px' }}>
                <Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain' }} />
              </div>
            : <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>{tenant.name}</span>}
        </a>
        <CartBadge slug={slug} campaignSlug={campaignSlug} primaryColor={primary} accentColor={accent} />
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ background: primary, position: 'relative', overflow: 'hidden', minHeight: '460px', display: 'flex', alignItems: 'center' }}>
        {tenant.hero_image && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${tenant.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', opacity: 0.2 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${accent}1A 0%, transparent 60%)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: `linear-gradient(to bottom, transparent, ${primary}88)` }} />

        <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '72px 32px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: `${accent}20`, border: `1px solid ${accent}50`, color: accent, padding: '5px 14px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, display: 'inline-block' }} />
            {tenant.name}
          </div>

          <h1 style={{ fontSize: 'clamp(34px, 6vw, 68px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.0, margin: '0 0 18px', maxWidth: '760px' }}>
            {campaign.name}
          </h1>

          {campaign.description && (
            <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: '520px', margin: '0 0 32px' }}>
              {campaign.description}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            {[
              { label: 'Products', value: String(products.length) },
              ...(totalMinimum > 0 ? [{ label: 'Orders Placed', value: String(totalOrdered) }] : []),
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '3px' }}>{label}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</div>
              </div>
            ))}

            {campaign.closes_at && isOpen && (
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 20px', minWidth: '160px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '3px' }}>Closes In</div>
                <MerchCountdown closingDate={campaign.closes_at} primaryColor={primary} secondaryColor={accent} textColor="#fff" labelColor="rgba(255,255,255,0.55)" />
              </div>
            )}

            {!isOpen && (
              <div style={{ background: 'rgba(55,65,81,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 18px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Campaign Closed</span>
              </div>
            )}
          </div>
          </div>

          {tenant.logo_url && (
            <div style={{ flexShrink: 0, width: '200px', height: '200px', position: 'relative', opacity: 0.92, display: 'none' }} className="hero-logo">
              <Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain' }} sizes="200px" />
            </div>
          )}
        </div>
      </section>

      {/* ── Banners ─────────────────────────────────────────── */}
      <BannerStrip banners={banners} />

      {/* ── Progress ────────────────────────────────────────── */}
      {totalMinimum > 0 && (
        <div style={{ background: '#fff', borderBottom: '1px solid #E8ECF2' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '10px' }}>Campaign Progress</div>
            <MerchProgressBar current={totalOrdered} minimum={totalMinimum} primaryColor={primary} secondaryColor={accent} />
          </div>
        </div>
      )}

      {/* ── Main ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 96px' }}>

        {/* Collections */}
        {collections.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '6px' }}>Browse</div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: 0 }}>Collections</h2>
            </div>
            <div className="collection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {collections.map((col) => (
                <CollectionCard key={col.id} col={col}
                  productCount={collectionProductCounts.get(col.id) ?? 0}
                  slug={slug} campaignSlug={campaignSlug} primary={primary} />
              ))}
            </div>
          </section>
        )}

        {/* Products + filter — client component handles search/sort/filter */}
        <CampaignProductGrid
          products={products}
          progressList={progressList}
          isOpen={isOpen}
          collections={collections}
          slug={slug}
          campaignSlug={campaignSlug}
          primary={primary}
          accent={accent}
        />

        {/* How it works */}
        <section style={{ marginTop: '80px', padding: '48px 40px', background: '#fff', borderRadius: '20px', border: '1px solid #E8ECF2' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '8px' }}>Pre-Order Process</div>
            <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: primary, letterSpacing: '-0.025em', margin: 0 }}>How It Works</h2>
          </div>
          <div className="how-it-works" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { step: '01', icon: '🛍️', title: 'Browse & Order', body: 'Choose your products and place your pre-order. No payment required upfront.' },
              { step: '02', icon: '🎯', title: 'Minimum Reached', body: 'Once enough orders are collected, we confirm production and send invoices.' },
              { step: '03', icon: '📦', title: 'Delivered Fresh', body: `Your gear is produced and delivered once the campaign closes and minimum is reached.` },
            ].map(({ step, icon, title, body }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 14px' }}>{icon}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '5px' }}>Step {step}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: primary, marginBottom: '7px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#5A6B7E', lineHeight: 1.65 }}>{body}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Campaign info: delivery / pickup / contact ───────── */}
      {(campaign.delivery_info || campaign.pickup_info || campaign.club_contact) && (
        <div style={{ background: '#F8FAFC', borderTop: '1px solid #E8ECF2', padding: '48px 32px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '28px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {campaign.delivery_info && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '8px' }}>Delivery</div>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{campaign.delivery_info}</p>
              </div>
            )}
            {campaign.pickup_info && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '8px' }}>Pick-up</div>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{campaign.pickup_info}</p>
              </div>
            )}
            {campaign.club_contact && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '8px' }}>Contact</div>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{campaign.club_contact}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ background: primary, padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {tenant.logo_url && (
            <div style={{ position: 'relative', height: '28px', width: '110px', margin: '0 auto 16px' }}>
              <Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain', objectPosition: 'center', filter: 'brightness(0) invert(1)', opacity: 0.4 }} />
            </div>
          )}
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.32)' }}>
            {tenant.name} · Merchandise powered by{' '}
            <a href="https://tendencies.co.nz" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Tendencies</a>
          </p>
          {tenant.contact_email && (
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.32)' }}>
              Questions? <a href={`mailto:${tenant.contact_email}`} style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>{tenant.contact_email}</a>
            </p>
          )}
        </div>
      </footer>

      <style>{`
        .collection-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .collection-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.18); }
        @media (max-width: 640px) {
          .collection-grid { grid-template-columns: 1fr !important; }
          .how-it-works { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
        @media (max-width: 480px) {
          .how-it-works { gap: 16px !important; }
        }
      `}</style>
    </div>
  )
}
