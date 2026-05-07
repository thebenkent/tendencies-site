import { getPortalConfig } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import { notFound } from 'next/navigation'

const BG = '#080808'
const BORDER = 'rgba(255,255,255,0.07)'

export default async function PortalHomePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getPortalConfig(slug)
  if (!config) notFound()

  return (
    <div style={{ background: BG, minHeight: 'calc(100vh - 64px)', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <PortalHeader config={config} slug={slug} />

      {/* Hero */}
      <div
        style={{
          padding: '72px 48px 64px',
          borderBottom: `1px solid ${BORDER}`,
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: config.accentColor,
            marginBottom: '16px',
          }}
        >
          {config.clientName}
        </div>
        <h1
          style={{
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#f5f5f0',
            lineHeight: 0.9,
            marginBottom: '20px',
          }}
        >
          {config.hero.tagline}
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            maxWidth: '480px',
          }}
        >
          {config.hero.subtitle}
        </p>
      </div>

      {/* Category grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '56px 48px 80px',
        }}
      >
        <div
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '32px',
          }}
        >
          Select a category
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2px',
          }}
        >
          {config.categories.map((cat) => (
            <a
              key={cat.id}
              href={`/portal/${slug}/${cat.slug}`}
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                display: 'block',
                overflow: 'hidden',
                background: '#111',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'border-color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
                const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
                if (img) {
                  img.style.transform = 'scale(1.05)'
                  img.style.filter = 'brightness(0.5)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
                if (img) {
                  img.style.transform = 'scale(1)'
                  img.style.filter = 'brightness(0.35)'
                }
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.35)',
                  transition: 'transform 0.5s ease, filter 0.3s ease',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.3) 60%, transparent 100%)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: config.accentColor,
                    marginBottom: '6px',
                  }}
                >
                  {cat.products.length} item{cat.products.length !== 1 ? 's' : ''}
                </div>
                <div
                  style={{
                    fontSize: 'clamp(18px, 2vw, 24px)',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                    color: '#f5f5f0',
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}
                >
                  {cat.name}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.5,
                  }}
                >
                  {cat.description}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Order info footer strip */}
      {config.ordering.orderNote && (
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            padding: '24px 48px',
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#b8f400',
              flexShrink: 0,
            }}
          >
            Note
          </div>
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.38)',
              lineHeight: 1.6,
            }}
          >
            {config.ordering.orderNote}
          </p>
        </div>
      )}
    </div>
  )
}
