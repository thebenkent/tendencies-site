import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTenant, getCampaign, getProducts, getProductProgress } from '@/lib/merch/db'
import MerchProgressBar from '@/components/merch/MerchProgressBar'
import MerchCountdown from '@/components/merch/MerchCountdown'

export const dynamic = 'force-dynamic'

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

  const products = await getProducts(campaign.id)
  const progressList = await Promise.all(products.map((p) => getProductProgress(p, campaign)))

  const navy = tenant.primary_color
  const red  = tenant.secondary_color
  const isOpen = campaign.status === 'open' && (!campaign.closes_at || new Date(campaign.closes_at) > new Date())

  // Aggregate progress across all products for the hero strip
  const totalCurrent = progressList.reduce((s, p) => s + p.orderedQty, 0)
  const totalMinimum = progressList.reduce((s, p) => s + p.minimumQty, 0)

  return (
    <div>
      {/* Header */}
      <header style={{ background: navy, padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '64px', zIndex: 40, borderBottom: `3px solid ${red}` }}>
        {tenant.logo_url
          ? <div style={{ position: 'relative', height: '36px', width: '140px' }}><Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain', objectPosition: 'left center' }} /></div>
          : <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>{tenant.name}</span>}
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Merchandise</span>
      </header>

      {/* Hero */}
      <div style={{ background: navy, padding: '56px 32px 64px', position: 'relative', overflow: 'hidden' }}>
        {tenant.hero_image && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${tenant.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center 20%', opacity: 0.18 }} />
        )}
        <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', background: red, color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '3px', marginBottom: '20px' }}>
            {tenant.name}
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 16px' }}>
            {campaign.name}
          </h1>
          <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, maxWidth: '560px', margin: 0 }}>
            {campaign.description ?? tenant.hero_subtitle}
          </p>
        </div>
      </div>

      {/* Progress + Countdown strip */}
      {(campaign.closes_at || totalMinimum > 0) && (
        <div style={{ background: '#fff', borderBottom: '1px solid #E2E8EF' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 32px', display: 'grid', gridTemplateColumns: campaign.closes_at ? '1fr auto' : '1fr', gap: '32px', alignItems: 'center' }} className="merch-hero-strip">
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A6B7E', marginBottom: '12px' }}>
                Overall Progress
              </div>
              <MerchProgressBar current={totalCurrent} minimum={totalMinimum} primaryColor={navy} secondaryColor={red} />
            </div>
            {campaign.closes_at && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A6B7E', marginBottom: '12px' }}>
                  {isOpen ? 'Order Closes In' : 'Campaign Closed'}
                </div>
                {isOpen
                  ? <MerchCountdown closingDate={campaign.closes_at} primaryColor={navy} secondaryColor={red} />
                  : <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>Closed</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px 80px' }}>
        <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: navy, letterSpacing: '-0.025em', marginBottom: '32px' }}>
          {campaign.name}
        </h2>

        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 32px', background: '#fff', borderRadius: '12px', border: '1px solid #E2E8EF', color: '#5A6B7E', fontSize: '16px' }}>
            No products available yet.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {products.map((product, i) => {
            const prog = progressList[i]
            const closed = !isOpen || prog.isExpired

            return (
              <a
                key={product.id}
                href={`/merch/${slug}/${campaignSlug}/${product.slug}`}
                style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #E2E8EF', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', boxShadow: '0 2px 8px rgba(11,31,77,0.06)' }}
              >
                {/* Image */}
                <div style={{ aspectRatio: '4/3', background: '#F0F3FA', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {product.images[0]
                    ? <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'contain', padding: '16px' }} sizes="(max-width: 900px) 50vw, 300px" />
                    : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${navy}22 0%, ${red}22 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', opacity: 0.3 }}>👕</div>}
                  {prog.isMet && !closed && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#16a34a', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '4px' }}>Min. Reached ✓</div>
                  )}
                  {closed && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#374151', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '4px' }}>Closed</div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: navy, marginBottom: '4px', letterSpacing: '-0.02em' }}>{product.name}</div>
                  <div style={{ fontSize: '14px', color: '#5A6B7E', marginBottom: '16px', lineHeight: 1.5, flex: 1 }}>
                    {(product.description ?? '').slice(0, 80)}{(product.description?.length ?? 0) > 80 ? '…' : ''}
                  </div>

                  {/* Mini progress */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ height: '6px', background: '#E2E8EF', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${prog.percentage}%`, background: prog.isMet ? '#16a34a' : `linear-gradient(90deg, ${navy} 0%, ${red} 100%)`, borderRadius: '999px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#5A6B7E' }}>{prog.orderedQty} / {prog.minimumQty} orders</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: navy }}>{prog.percentage}%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: navy }}>${(product.price_cents / 100).toFixed(2)}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: closed ? '#94A3B8' : red }}>
                      {closed ? 'Closed' : 'Pre-Order →'}
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      <footer style={{ background: navy, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
        <p style={{ margin: 0 }}>{tenant.name} · Merchandise powered by <a href="https://tendencies.co.nz" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tendencies</a></p>
        {tenant.contact_email && <p style={{ margin: '8px 0 0' }}>Questions? <a href={`mailto:${tenant.contact_email}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'underline' }}>{tenant.contact_email}</a></p>}
      </footer>
    </div>
  )
}
