import { getPortalConfig, getPortalCategory } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import ProductOrderCard from '@/components/portal/ProductOrderCard'
import { notFound } from 'next/navigation'

const BG = '#080808'
const BORDER = 'rgba(255,255,255,0.07)'

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

  return (
    <div
      style={{
        background: BG,
        minHeight: 'calc(100vh - 64px)',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <PortalHeader config={config} slug={slug} />

      {/* Breadcrumb */}
      <div
        className="portal-px"
        style={{
          borderBottom: `1px solid ${BORDER}`,
          padding: '14px 64px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <a
          href={`/portal/${slug}`}
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
            textDecoration: 'none',
          }}
        >
          {config.clientName}
        </a>
        <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '12px' }}>›</span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#f5f5f0',
          }}
        >
          {category.name}
        </span>
      </div>

      {/* Category header */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '60px 64px 48px',
          borderBottom: `1px solid ${BORDER}`,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '40px',
          alignItems: 'end',
        }}
        className="portal-cat-header portal-px"
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: config.accentColor,
              marginBottom: '12px',
            }}
          >
            {category.products.length} item{category.products.length !== 1 ? 's' : ''}
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 60px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#f5f5f0',
              lineHeight: 0.92,
              marginBottom: '16px',
            }}
          >
            {category.name}
            <span style={{ color: '#b8f400' }}>.</span>
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: 0,
            }}
          >
            {category.description}
          </p>
        </div>
        <a
          href={`/portal/${slug}`}
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          ← Back to Portal
        </a>
      </div>

      {/* Product grid */}
      <div
        className="portal-px"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 64px 96px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '28px',
          }}
          className="portal-product-grid"
        >
          {category.products.map((product) => (
            <ProductOrderCard
              key={product.id}
              product={product}
              category={category}
              slug={slug}
              accentColor={config.accentColor}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
