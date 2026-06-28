import { notFound } from 'next/navigation'
import { getTenant, getCampaign, getProduct, getProductProgress } from '@/lib/merch/db'
import ReserveForm from '@/components/merch/ReserveForm'
import MerchProgressBar from '@/components/merch/MerchProgressBar'

export const dynamic = 'force-dynamic'

export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; campaign: string; product: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { slug, campaign: campaignSlug, product: productSlug } = await params
  const sp = await searchParams

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
  if (!campaign) notFound()

  const isOpen =
    campaign.status === 'open' &&
    (!campaign.closes_at || new Date(campaign.closes_at) > new Date())

  if (!isOpen) {
    const navy = tenant.primary_color
    return (
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: navy }}>Campaign Closed</h1>
        <p style={{ color: '#5A6B7E', marginTop: '12px' }}>
          <a href={`/merch/${slug}/${campaignSlug}`} style={{ color: navy }}>
            ← Back to campaign
          </a>
        </p>
      </div>
    )
  }

  const product = await getProduct(campaign.id, productSlug).catch(() => null)
  if (!product) notFound()

  const progress = await getProductProgress(product, campaign)

  const navy = tenant.primary_color
  const red  = tenant.secondary_color

  const initialVariantId = sp.variant_id ?? null
  const initialQty = sp.qty
    ? Math.max(1, Math.min(20, parseInt(sp.qty, 10) || 1))
    : 1

  // Collect personalisation values from URL: product page passes ?<p.id>=<value>
  // for each personalisation option that was filled in.
  const knownParams = new Set(['variant_id', 'qty'])
  const initialPersonValues: Record<string, string> = {}
  for (const [key, val] of Object.entries(sp)) {
    if (!knownParams.has(key) && typeof val === 'string' && val) {
      initialPersonValues[key] = decodeURIComponent(val)
    }
  }

  return (
    <div>
      <header style={{ background: navy, padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '64px', zIndex: 40, borderBottom: `3px solid ${red}` }}>
        <a href={`/merch/${slug}/${campaignSlug}/${productSlug}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ← Back
        </a>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>Place Pre-Order</span>
        <div style={{ width: '60px' }} />
      </header>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 32px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: navy, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            Pre-Order: {product.name}
          </h1>
          <p style={{ fontSize: '15px', color: '#5A6B7E', lineHeight: 1.6, margin: 0 }}>
            No payment is taken now. We&apos;ll contact you when the minimum order quantity is reached.
          </p>
        </div>

        <div style={{ background: '#F0F3FA', borderRadius: '10px', padding: '20px', marginBottom: '32px', border: '1px solid #D1DCF0' }}>
          <MerchProgressBar
            current={progress.orderedQty}
            minimum={progress.minimumQty}
            primaryColor={navy}
            secondaryColor={red}
          />
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #E2E8EF', boxShadow: '0 2px 12px rgba(11,31,77,0.06)' }}>
          <ReserveForm
            tenant={tenant}
            product={product}
            campaignSlug={campaignSlug}
            slug={slug}
            initialVariantId={initialVariantId}
            initialQty={initialQty}
            initialPersonValues={initialPersonValues}
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
