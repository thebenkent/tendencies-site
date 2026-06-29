import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTenant, getCampaign, getProduct, getProductProgress } from '@/lib/merch/db'
import ProductDetail from '@/components/merch/ProductDetail'
import { CartBadge } from '@/components/merch/CartContext'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; campaign: string; product: string }>
}) {
  const { slug, campaign: campaignSlug, product: productSlug } = await params

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
  if (!campaign) notFound()

  const product = await getProduct(campaign.id, productSlug).catch(() => null)
  if (!product) notFound()

  const progress = await getProductProgress(product, campaign)

  const navy = tenant.primary_color
  const red  = tenant.secondary_color

  return (
    <div>
      <header style={{ background: navy, padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '64px', zIndex: 40, borderBottom: `3px solid ${red}` }}>
        <a href={`/merch/${slug}/${campaignSlug}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ← Back
        </a>
        {tenant.logo_url
          ? (
            <div style={{ position: 'relative', height: '36px', width: '140px' }}>
              <Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain', objectPosition: 'center' }} />
            </div>
          )
          : <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>{tenant.name}</span>}
        <CartBadge slug={slug} campaignSlug={campaignSlug} primaryColor={navy} accentColor={red} />
      </header>

      <ProductDetail
        tenant={tenant}
        campaign={campaign}
        product={product}
        progress={progress}
        slug={slug}
      />

      <footer style={{ background: navy, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
        <p style={{ margin: 0 }}>
          {tenant.name} · Merchandise powered by{' '}
          <a href="https://tendencies.co.nz" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tendencies</a>
        </p>
        {tenant.contact_email && (
          <p style={{ margin: '8px 0 0' }}>
            Questions?{' '}
            <a href={`mailto:${tenant.contact_email}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'underline' }}>
              {tenant.contact_email}
            </a>
          </p>
        )}
      </footer>
    </div>
  )
}
