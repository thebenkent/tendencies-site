import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTenant, getCampaign } from '@/lib/merch/db'
import CheckoutForm from '@/components/merch/CheckoutForm'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string; campaign: string }>
}) {
  const { slug, campaign: campaignSlug } = await params

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
  if (!campaign) notFound()

  const isOpen =
    campaign.status === 'open' &&
    (!campaign.closes_at || new Date(campaign.closes_at) > new Date())

  const navy = tenant.primary_color
  const red  = tenant.secondary_color

  if (!isOpen) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: navy }}>Campaign Closed</h1>
        <p style={{ color: '#5A6B7E', marginTop: '12px' }}>
          <a href={`/merch/${slug}/${campaignSlug}`} style={{ color: navy }}>← Back to campaign</a>
        </p>
      </div>
    )
  }

  return (
    <div>
      <header style={{ background: navy, padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '64px', zIndex: 40, borderBottom: `3px solid ${red}` }}>
        <a href={`/merch/${slug}/${campaignSlug}/cart`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ← Back to Cart
        </a>
        {tenant.logo_url
          ? <div style={{ position: 'relative', height: '32px', width: '120px' }}><Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain', objectPosition: 'center' }} /></div>
          : <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>{tenant.name}</span>}
        <div style={{ width: '120px' }} />
      </header>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: navy, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
          Checkout
        </h1>
        <p style={{ fontSize: '15px', color: '#5A6B7E', lineHeight: 1.6, margin: '0 0 32px' }}>
          No payment is taken now. You&apos;ll receive an email once the minimum order quantity is reached.
        </p>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #E2E8EF', boxShadow: '0 2px 12px rgba(11,31,77,0.06)' }}>
          <CheckoutForm
            tenant={tenant}
            campaign={campaign}
            slug={slug}
            campaignSlug={campaignSlug}
          />
        </div>
      </div>

      <footer style={{ background: navy, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
        <p style={{ margin: 0 }}>
          {tenant.name} · Merchandise powered by{' '}
          <a href="https://tendencies.co.nz" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tendencies</a>
        </p>
      </footer>
    </div>
  )
}
