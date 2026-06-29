import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getTenant, getCampaign, getCollection, getProducts, getProductProgress,
} from '@/lib/merch/db'
import { CartBadge } from '@/components/merch/CartContext'
import CampaignProductGrid from '@/components/merch/CampaignProductGrid'
import type { MerchProductWithVariants, MerchCollection } from '@/lib/merch/types'

export const dynamic = 'force-dynamic'

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string; campaign: string; collection: string }>
}) {
  const { slug, campaign: campaignSlug, collection: collectionSlug } = await params

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
  if (!campaign) notFound()

  const collection = await getCollection(campaign.id, collectionSlug).catch(() => null)
  if (!collection) notFound()

  // Fetch all products, then filter to this collection
  const allProducts = await getProducts(campaign.id) as MerchProductWithVariants[]
  const products    = allProducts.filter((p) => p.collection_id === collection.id)

  const progressList = await Promise.all(products.map((p) => getProductProgress(p, campaign)))

  const primary = tenant.primary_color
  const accent  = tenant.secondary_color
  const isOpen  = campaign.status === 'open' && (!campaign.closes_at || new Date(campaign.closes_at) > new Date())

  return (
    <div style={{ background: '#F8F9FB', minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        background: primary, height: '64px', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: '64px', zIndex: 40,
        borderBottom: `3px solid ${accent}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
      }}>
        <a href={`/merch/${slug}/${campaignSlug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ← {campaign.name}
        </a>
        <CartBadge slug={slug} campaignSlug={campaignSlug} primaryColor={primary} accentColor={accent} />
      </header>

      {/* ── Collection hero ──────────────────────────────────── */}
      <section style={{ background: primary, position: 'relative', overflow: 'hidden', minHeight: '320px', display: 'flex', alignItems: 'center' }}>
        {collection.image_url && (
          <Image
            src={collection.image_url} alt={collection.name}
            fill style={{ objectFit: 'cover', opacity: 0.28 }}
            sizes="100vw" priority
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 60% 50%, ${accent}18 0%, transparent 60%)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: `linear-gradient(to bottom, transparent, ${primary}AA)` }} />

        <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '56px 32px 64px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 500, marginBottom: '16px' }}>
            <a href={`/merch/${slug}/${campaignSlug}`} style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{campaign.name}</a>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{collection.name}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.0, margin: '0 0 14px' }}>
            {collection.name}
          </h1>

          {collection.description && (
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, maxWidth: '480px', margin: '0 0 20px' }}>
              {collection.description}
            </p>
          )}

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </div>
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 96px' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: '16px', border: '1px solid #E8ECF2' }}>
            <div style={{ fontSize: '48px', opacity: 0.2, marginBottom: '16px' }}>👕</div>
            <p style={{ fontSize: '16px', color: '#94A3B8', margin: '0 0 20px' }}>No products in this collection yet.</p>
            <a href={`/merch/${slug}/${campaignSlug}`}
              style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: primary, color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
              Browse all products →
            </a>
          </div>
        ) : (
          <CampaignProductGrid
            products={products}
            progressList={progressList}
            isOpen={isOpen}
            collections={[]}
            slug={slug}
            campaignSlug={campaignSlug}
            primary={primary}
            accent={accent}
          />
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ background: primary, padding: '32px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.32)' }}>
          {tenant.name} · <a href={`/merch/${slug}/${campaignSlug}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Back to {campaign.name}</a>
        </p>
      </footer>
    </div>
  )
}
