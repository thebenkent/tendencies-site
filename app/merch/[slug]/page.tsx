import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { getTenant, getCampaigns } from '@/lib/merch/db'

export const dynamic = 'force-dynamic'

export default async function MerchHomePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaigns = await getCampaigns(tenant.id)

  // Single active campaign → redirect straight to it
  const open = campaigns.filter((c) => c.status === 'open')
  if (open.length === 1) redirect(`/merch/${slug}/${open[0].slug}`)

  const navy = tenant.primary_color
  const red  = tenant.secondary_color

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
      <div style={{ background: navy, padding: '56px 32px 64px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', background: red, color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '3px', marginBottom: '20px' }}>
            {tenant.name}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 16px' }}>
            Official Club Merchandise
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: 0 }}>
            Select a campaign below to browse and pre-order products.
          </p>
        </div>
      </div>

      {/* Campaigns */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 32px 80px' }}>
        {campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 32px', background: '#fff', borderRadius: '12px', border: '1px solid #E2E8EF', color: '#5A6B7E', fontSize: '16px' }}>
            No active campaigns right now. Check back soon.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {campaigns.map((campaign) => {
              const isClosed = campaign.status !== 'open'
              return (
                <a
                  key={campaign.id}
                  href={`/merch/${slug}/${campaign.slug}`}
                  style={{ display: 'block', background: '#fff', border: '1px solid #E2E8EF', borderRadius: '12px', padding: '28px 32px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(11,31,77,0.05)', transition: 'box-shadow 0.2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: navy, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                        {campaign.name}
                      </div>
                      {campaign.description && (
                        <div style={{ fontSize: '14px', color: '#5A6B7E', lineHeight: 1.5 }}>{campaign.description}</div>
                      )}
                      {campaign.closes_at && (
                        <div style={{ fontSize: '13px', color: isClosed ? '#94A3B8' : red, fontWeight: 600, marginTop: '10px' }}>
                          {isClosed ? 'Closed' : `Closes ${new Date(campaign.closes_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
                      background: isClosed ? '#F1F5F9' : '#DCFCE7',
                      color: isClosed ? '#64748B' : '#15803D',
                    }}>
                      {campaign.status === 'open' ? 'Open' : campaign.status === 'closing_soon' ? 'Closing Soon' : campaign.status === 'completed' ? 'Completed' : campaign.status === 'closed' ? 'Closed' : 'Archived'}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>

      <footer style={{ background: navy, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
        <p style={{ margin: 0 }}>{tenant.name} · Merchandise powered by <a href="https://tendencies.co.nz" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tendencies</a></p>
      </footer>
    </div>
  )
}
