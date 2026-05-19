import { getPortalConfig, getPortalCategory } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import ProductOrderCard from '@/components/portal/ProductOrderCard'
import { notFound } from 'next/navigation'
import { resolvePortalVisual } from '@/lib/portal/visual'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; category: string }>
}) {
  const { slug, category: categorySlug } = await params
  const config = getPortalConfig(slug)
  if (!config) notFound()

  const category = getPortalCategory(config, categorySlug)
  if (!category) notFound()

  const v = resolvePortalVisual(config)

  return (
    <div
      style={{
        background: v.canvas,
        minHeight: '100vh',
      }}
      className="portal-root"
    >
      <PortalHeader config={config} slug={slug} />

      <div style={{ background: v.headerBg, borderBottom: `1px solid ${v.border}` }}>
        <div
          className="portal-px portal-cat-breadcrumb"
          style={{
            padding: '18px 64px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '1120px',
            margin: '0 auto',
          }}
        >
          <a
            href={`/portal/${slug}`}
            className="portal-crumb-link"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: v.inkFaint,
              textDecoration: 'none',
              minHeight: '48px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {config.clientName}
          </a>
          <span style={{ color: v.inkFaint, fontSize: '12px' }} aria-hidden>
            ›
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: v.ink,
            }}
          >
            {category.name}
          </span>
        </div>
      </div>

      <div style={{ background: v.canvas }}>
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '48px 64px 40px',
          }}
          className="portal-cat-header portal-px"
        >
          <div style={{ maxWidth: '720px' }}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: v.accent,
                margin: '0 0 14px',
              }}
            >
              {category.products.length} style{category.products.length !== 1 ? 's' : ''} in this group
            </p>
            <h1
              style={{
                fontSize: 'clamp(30px, 4vw, 46px)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: v.ink,
                lineHeight: 1.05,
                margin: '0 0 20px',
              }}
            >
              {category.name}
            </h1>
            <p
              style={{
                fontSize: '17px',
                color: v.inkMuted,
                lineHeight: 1.65,
                margin: 0,
                maxWidth: '640px',
              }}
            >
              {category.description}
            </p>
          </div>
          <div style={{ marginTop: '28px' }}>
            <a
              href={`/portal/${slug}`}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: v.accent,
                textDecoration: 'none',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ← Back to overview
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          background: v.warmSection,
          borderTop: `1px solid ${v.warmBorder}`,
        }}
      >
        <div
          className="portal-px portal-cat-product-wrap"
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '48px 64px 88px',
          }}
        >
          <div className="portal-product-grid">
            {category.products.map((product) => (
              <ProductOrderCard
                key={product.id}
                product={product}
                category={category}
                slug={slug}
                visual={v}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
