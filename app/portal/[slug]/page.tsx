import { getPortalConfig, getProductById } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import { notFound } from 'next/navigation'

const BG = '#080808'
const BORDER = 'rgba(255,255,255,0.07)'
const LIME = '#b8f400'

const ctaButtons = [
  { id: 'request-pricing', label: 'Request Pricing', emoji: '💬', href: '#contact' },
  { id: 'build-kit', label: 'Build a Staff Kit', emoji: '🛠', href: '#categories' },
  { id: 'branding', label: 'Discuss Branding', emoji: '✏️', href: '#contact' },
  { id: 'download', label: 'Download Range', emoji: '📥', href: '#collections' },
]

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

      {/* Brand story section */}
      {config.brandStory && (
        <div
          style={{
            borderBottom: `1px solid ${BORDER}`,
            padding: '64px 48px',
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#f5f5f0',
              lineHeight: 1,
              marginBottom: '20px',
              maxWidth: '700px',
            }}
          >
            {config.brandStory.headline}
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
              maxWidth: '640px',
              marginBottom: '48px',
            }}
          >
            {config.brandStory.body}
          </p>

          {/* Pillars grid */}
          {config.brandStory.pillars && config.brandStory.pillars.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
              }}
            >
              {config.brandStory.pillars.map((pillar) => (
                <div key={pillar.title}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: config.accentColor,
                      marginBottom: '12px',
                    }}
                  >
                    {pillar.title}
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.6,
                    }}
                  >
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA Section */}
      <div
        style={{
          borderBottom: `1px solid ${BORDER}`,
          padding: '56px 48px',
          maxWidth: '1280px',
          margin: '0 auto',
          background: 'rgba(184,244,0,0.03)',
        }}
        id="contact"
      >
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: LIME,
              marginBottom: '8px',
            }}
          >
            Ready to Order?
          </div>
          <h3
            style={{
              fontSize: 'clamp(24px, 3vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#f5f5f0',
              lineHeight: 1,
            }}
          >
            Get Started Today
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {ctaButtons.map((btn) => (
            <a
              key={btn.id}
              href={btn.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '24px 20px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${BORDER}`,
                borderRadius: '4px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(184,244,0,0.08)'
                e.currentTarget.style.borderColor = LIME
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.borderColor = BORDER
              }}
            >
              <div style={{ fontSize: '28px' }}>{btn.emoji}</div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: LIME,
                  textAlign: 'center',
                }}
              >
                {btn.label}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Featured collections */}
      {config.featuredCollections && config.featuredCollections.length > 0 && (
        <div style={{ borderBottom: `1px solid ${BORDER}` }} id="collections">
          {config.featuredCollections.map((collection, idx) => {
            const category = config.categories.find((c) => c.slug === collection.categorySlug)
            if (!category) return null

            const products = collection.productIds
              .map((id) => category.products.find((p) => p.id === id))
              .filter((p): p is typeof category.products[0] => Boolean(p))

            return (
              <div
                key={collection.id}
                style={{
                  padding: '56px 48px',
                  maxWidth: '1280px',
                  margin: '0 auto',
                  borderBottom: idx < config.featuredCollections!.length - 1 ? `1px solid ${BORDER}` : 'none',
                }}
              >
                <div style={{ marginBottom: '32px' }}>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.35)',
                      marginBottom: '8px',
                    }}
                  >
                    Featured Collection
                  </div>
                  <h3
                    style={{
                      fontSize: 'clamp(24px, 3vw, 42px)',
                      fontWeight: 900,
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                      color: '#f5f5f0',
                      lineHeight: 1.1,
                      marginBottom: '8px',
                    }}
                  >
                    {collection.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.45)',
                      marginBottom: '20px',
                    }}
                  >
                    {collection.subtitle}
                  </p>
                  <a
                    href={`/portal/${slug}/${collection.categorySlug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: LIME,
                      textDecoration: 'none',
                      transition: 'gap 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.gap = '12px'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.gap = '8px'
                    }}
                  >
                    View Full Category →
                  </a>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2px',
                  }}
                >
                  {products.map((product) => (
                    <a
                      key={product.id}
                      href={`/portal/${slug}/${collection.categorySlug}/${product.slug}`}
                      style={{
                        background: '#0f0f0f',
                        border: `1px solid ${BORDER}`,
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = config.accentColor
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = BORDER
                        e.currentTarget.style.background = '#0f0f0f'
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: '4/3',
                          background: '#1c1c1c',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '20px',
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: config.accentColor,
                            marginBottom: '4px',
                          }}
                        >
                          {product.sku}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 900,
                            letterSpacing: '-0.025em',
                            textTransform: 'uppercase',
                            color: '#f5f5f0',
                            lineHeight: 1.1,
                            marginBottom: '8px',
                          }}
                        >
                          {product.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: 900,
                              color: '#f5f5f0',
                            }}
                          >
                            ${(product.priceCents / 100).toFixed(2)}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255,255,255,0.28)',
                              letterSpacing: '0.08em',
                            }}
                          >
                            {product.leadWeeks[0]}–{product.leadWeeks[1]}wk
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Category grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '56px 48px 80px',
        }}
        id="categories"
      >
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '8px',
            }}
          >
            Complete Range
          </div>
          <h3
            style={{
              fontSize: 'clamp(24px, 3vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#f5f5f0',
              lineHeight: 1,
            }}
          >
            All Categories
          </h3>
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
              className="portal-cat-card"
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                display: 'block',
                overflow: 'hidden',
                background: '#111',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
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
              color: LIME,
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
