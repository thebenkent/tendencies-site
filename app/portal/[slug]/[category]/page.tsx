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
        minHeight: 'calc(100vh - 64px)',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <PortalHeader config={config} slug={slug} />

      {/* Breadcrumb */}
      <div
        className="portal-px"
        style={{
          borderBottom: `1px solid ${v.border}`,
          padding: '16px 64px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '1200px',
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
            minHeight: '44px',
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

      {/* Category header */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '56px 64px 48px',
          borderBottom: `1px solid ${v.border}`,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '40px',
          alignItems: 'end',
        }}
        className="portal-cat-header portal-px"
      >
        <div style={{ maxWidth: '720px' }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: v.accent,
              marginBottom: '14px',
            }}
          >
            {category.products.length} style{category.products.length !== 1 ? 's' : ''} in this group
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: v.ink,
              lineHeight: 1.02,
              marginBottom: '18px',
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
            }}
          >
            {category.description}
          </p>
        </div>
        <a
          href={`/portal/${slug}`}
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: v.inkFaint,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          ← Back
        </a>
      </div>

      {/* Product grid — max 3 columns */}
      <div
        className="portal-px"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '56px 64px 96px',
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
              config={config}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
