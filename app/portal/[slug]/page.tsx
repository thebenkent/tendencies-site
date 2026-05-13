import type React from 'react'
import { getPortalConfig, getProductById } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import { notFound } from 'next/navigation'

const BG = '#080808'
const BORDER = 'rgba(255,255,255,0.07)'
const LIME = '#b8f400'
const IMG_BG = '#f2f1ed'

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
        className="portal-px"
        style={{
          padding: '88px 64px 72px',
          borderBottom: `1px solid ${BORDER}`,
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: config.accentColor,
            marginBottom: '20px',
          }}
        >
          {config.clientName} · Staff Uniform Programme
        </div>
        <h1
          style={{
            fontSize: 'clamp(44px, 6.5vw, 88px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#f5f5f0',
            lineHeight: 0.9,
            marginBottom: '28px',
            maxWidth: '900px',
          }}
        >
          {config.hero.tagline}
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.52)',
            lineHeight: 1.7,
            maxWidth: '520px',
          }}
        >
          {config.hero.subtitle}
        </p>

        <div style={{ marginTop: '40px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="#categories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '13px 28px',
              background: LIME,
              color: '#080808',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Browse the Range
          </a>
          <a
            href={`mailto:${config.contact.email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '13px 28px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.55)',
              border: `1px solid rgba(255,255,255,0.12)`,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Contact Account Manager
          </a>
        </div>
      </div>

      {/* Brand story section */}
      {config.brandStory && (
        <div
          className="portal-px"
          style={{
            borderBottom: `1px solid ${BORDER}`,
            padding: '72px 64px',
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '80px',
              alignItems: 'start',
            }}
            className="portal-story-grid"
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(28px, 3.5vw, 48px)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  color: '#f5f5f0',
                  lineHeight: 1,
                  marginBottom: '20px',
                }}
              >
                {config.brandStory.headline}
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.75,
                }}
              >
                {config.brandStory.body}
              </p>
            </div>

            {config.brandStory.pillars && config.brandStory.pillars.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {config.brandStory.pillars.map((pillar, i) => (
                  <div
                    key={pillar.title}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start',
                      paddingTop: i > 0 ? '32px' : undefined,
                      borderTop: i > 0 ? `1px solid ${BORDER}` : undefined,
                    }}
                  >
                    <div
                      style={{
                        width: '2px',
                        height: '32px',
                        background: config.accentColor,
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: '#f5f5f0',
                          marginBottom: '8px',
                        }}
                      >
                        {pillar.title}
                      </div>
                      <p
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.45)',
                          lineHeight: 1.65,
                          margin: 0,
                        }}
                      >
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
                className="portal-px"
                style={{
                  padding: '64px 64px 72px',
                  maxWidth: '1280px',
                  margin: '0 auto',
                  borderBottom: idx < config.featuredCollections!.length - 1 ? `1px solid ${BORDER}` : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '24px',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                        marginBottom: '10px',
                      }}
                    >
                      Featured Collection
                    </div>
                    <h3
                      style={{
                        fontSize: 'clamp(22px, 2.8vw, 40px)',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        textTransform: 'uppercase',
                        color: '#f5f5f0',
                        lineHeight: 1.05,
                        marginBottom: '8px',
                      }}
                    >
                      {collection.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.42)',
                        margin: 0,
                      }}
                    >
                      {collection.subtitle}
                    </p>
                  </div>
                  <a
                    href={`/portal/${slug}/${collection.categorySlug}`}
                    className="portal-view-cat-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: LIME,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    View Full Category →
                  </a>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {products.map((product) => (
                    <a
                      key={product.id}
                      href={`/portal/${slug}/${collection.categorySlug}/${product.slug}`}
                      className="portal-featured-product"
                      style={{
                        background: '#111',
                        border: `1px solid ${BORDER}`,
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s ease',
                        '--portal-accent': config.accentColor,
                      } as React.CSSProperties}
                    >
                      <div
                        style={{
                          aspectRatio: '1/1',
                          background: IMG_BG,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '85%',
                            height: '85%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                      <div style={{ padding: '18px 20px 20px' }}>
                        <div
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: config.accentColor,
                            marginBottom: '5px',
                          }}
                        >
                          {product.sku}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            color: '#f5f5f0',
                            lineHeight: 1.15,
                            marginBottom: '12px',
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
                              fontSize: '15px',
                              fontWeight: 900,
                              color: '#f5f5f0',
                            }}
                          >
                            ${(product.priceCents / 100).toFixed(2)}
                          </span>
                          <span
                            style={{
                              fontSize: '9px',
                              color: 'rgba(255,255,255,0.28)',
                              letterSpacing: '0.06em',
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
        className="portal-px"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '64px 64px 88px',
        }}
        id="categories"
      >
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '10px',
            }}
          >
            Complete Range
          </div>
          <h3
            style={{
              fontSize: 'clamp(24px, 3vw, 44px)',
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
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
                border: '1px solid rgba(255,255,255,0.07)',
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
                  filter: 'brightness(0.32)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.2) 55%, transparent 100%)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '28px',
                }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: config.accentColor,
                    marginBottom: '8px',
                  }}
                >
                  {cat.products.length} item{cat.products.length !== 1 ? 's' : ''}
                </div>
                <div
                  style={{
                    fontSize: 'clamp(16px, 1.8vw, 22px)',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                    color: '#f5f5f0',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}
                >
                  {cat.name}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.42)',
                    lineHeight: 1.55,
                  }}
                >
                  {cat.description}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contact strip */}
      <div
        style={{
          borderTop: `1px solid ${BORDER}`,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 64px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '48px',
          alignItems: 'center',
        }}
        id="contact"
        className="portal-contact-strip portal-px"
      >
        <div>
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
            Account Manager
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#f5f5f0',
              letterSpacing: '-0.01em',
              marginBottom: '4px',
            }}
          >
            {config.contact.manager}
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
            <a
              href={`mailto:${config.contact.email}`}
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
              }}
            >
              {config.contact.email}
            </a>
            {config.contact.phone && (
              <a
                href={`tel:${config.contact.phone}`}
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'none',
                }}
              >
                {config.contact.phone}
              </a>
            )}
          </div>
        </div>
        {config.ordering.orderNote && (
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.3)',
              lineHeight: 1.65,
              maxWidth: '380px',
              margin: 0,
              textAlign: 'right',
            }}
            className="portal-note-text"
          >
            {config.ordering.orderNote}
          </p>
        )}
      </div>
    </div>
  )
}
