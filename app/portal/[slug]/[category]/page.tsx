import { getPortalConfig, getPortalCategory } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import PortalProductCard from '@/components/portal/PortalProductCard'
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
        style={{
          borderBottom: `1px solid ${BORDER}`,
          padding: '16px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
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
            color: 'rgba(255,255,255,0.3)',
            textDecoration: 'none',
          }}
        >
          {config.clientName}
        </a>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>›</span>
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
          padding: '52px 48px 40px',
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: config.accentColor,
            marginBottom: '10px',
          }}
        >
          {category.products.length} item{category.products.length !== 1 ? 's' : ''}
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#f5f5f0',
            lineHeight: 0.92,
            marginBottom: '12px',
          }}
        >
          {category.name}
          <span style={{ color: '#b8f400' }}>.</span>
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.65,
            maxWidth: '480px',
          }}
        >
          {category.description}
        </p>
      </div>

      {/* Product grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 48px 80px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {category.products.map((product) => (
            <PortalProductCard
              key={product.id}
              product={product}
              slug={slug}
              categorySlug={categorySlug}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
