import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTenant, getCampaign } from '@/lib/merch/db'
import CartPageClient from '@/components/merch/CartPageClient'
import { CartBadge } from '@/components/merch/CartContext'

export const dynamic = 'force-dynamic'

export default async function CartPage({
  params,
}: {
  params: Promise<{ slug: string; campaign: string }>
}) {
  const { slug, campaign: campaignSlug } = await params

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
  if (!campaign) notFound()

  const navy = tenant.primary_color
  const red  = tenant.secondary_color

  return (
    <div>
      <header style={{ background: navy, padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '64px', zIndex: 40, borderBottom: `3px solid ${red}` }}>
        <a href={`/merch/${slug}/${campaignSlug}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ← Continue shopping
        </a>
        {tenant.logo_url
          ? <div style={{ position: 'relative', height: '32px', width: '120px' }}><Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain', objectPosition: 'center' }} /></div>
          : <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>{tenant.name}</span>}
        <div style={{ width: '120px' }} />
      </header>

      <CartPageClient
        slug={slug}
        campaignSlug={campaignSlug}
        primaryColor={navy}
        accentColor={red}
        tenantName={tenant.name}
        campaignName={campaign.name}
      />

      <footer style={{ background: navy, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
        <p style={{ margin: 0 }}>{tenant.name} · Merchandise powered by <a href="https://tendencies.co.nz" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tendencies</a></p>
      </footer>
    </div>
  )
}
