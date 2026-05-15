import type React from 'react'
import { getPortalConfig } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import { notFound } from 'next/navigation'
import { resolvePortalUiCopy, resolvePortalVisual } from '@/lib/portal/visual'

export default async function PortalHomePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getPortalConfig(slug)
  if (!config) notFound()

  const v = resolvePortalVisual(config)
  const ui = resolvePortalUiCopy(config)

  return (
    <div style={{ background: v.canvas, minHeight: 'calc(100vh - 64px)', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <PortalHeader config={config} slug={slug} />

      {/* Hero — minimal above the fold */}
      <div
        className="portal-px portal-hero"
        style={{
          padding: '72px 64px 64px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '22px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: v.inkFaint,
            }}
          >
            {config.clientName}
          </span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: v.limeSpot }} aria-hidden />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: v.accent,
            }}
          >
            {config.portalTitle}
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(36px, 5.5vw, 64px)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            color: v.ink,
            lineHeight: 1.02,
            marginBottom: '22px',
            maxWidth: '14ch',
          }}
        >
          {config.hero.tagline}
        </h1>
        <p
          style={{
            fontSize: '17px',
            color: v.inkMuted,
            lineHeight: 1.65,
            maxWidth: '560px',
            marginBottom: '36px',
          }}
        >
          {config.hero.subtitle}
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="#recommended-kits"
            className="portal-hero-primary-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              padding: '0 28px',
              background: v.accent,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '2px',
            }}
          >
            {ui.heroPrimaryCta}
          </a>
          <a
            href={`mailto:${config.contact.email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              padding: '0 24px',
              background: 'transparent',
              color: v.inkMuted,
              border: `1px solid ${v.border}`,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '2px',
            }}
          >
            {ui.heroSecondaryCta}
          </a>
        </div>
      </div>

      {/* Recommended kits — first content band (warm) */}
      {config.featuredCollections && config.featuredCollections.length > 0 && (
        <div style={{ background: v.warmSection }} id="recommended-kits">
          {config.featuredCollections.map((collection, idx) => {
            const category = config.categories.find((c) => c.slug === collection.categorySlug)
            if (!category) return null

            const products = collection.productIds
              .map((id) => category.products.find((p) => p.id === id))
              .filter((p): p is (typeof category.products)[0] => Boolean(p))

            return (
              <div
                key={collection.id}
                className="portal-px"
                style={{
                  padding: '72px 64px 80px',
                  maxWidth: '1200px',
                  margin: '0 auto',
                  borderBottom: idx < config.featuredCollections!.length - 1 ? `1px solid ${v.warmBorder}` : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '28px',
                    marginBottom: '36px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ maxWidth: '640px' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: v.accentSecondary,
                        marginBottom: '12px',
                      }}
                    >
                      {ui.collectionEyebrow}
                    </div>
                    <h2
                      style={{
                        fontSize: 'clamp(26px, 3vw, 40px)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: v.warmInk,
                        lineHeight: 1.08,
                        marginBottom: '12px',
                      }}
                    >
                      {collection.title}
                    </h2>
                    <p
                      style={{
                        fontSize: '15px',
                        color: v.warmInkMuted,
                        margin: 0,
                        lineHeight: 1.6,
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
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: v.accent,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      minHeight: '44px',
                    }}
                  >
                    {ui.collectionViewAll} →
                  </a>
                </div>

                <div className="portal-featured-grid">
                  {products.map((product) => (
                    <a
                      key={product.id}
                      href={`/portal/${slug}/${collection.categorySlug}/${product.slug}`}
                      className="portal-featured-product"
                      style={{
                        background: v.cardOnWarm,
                        border: `1px solid ${v.warmBorder}`,
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(28,39,56,0.06)',
                        '--portal-accent': v.accent,
                      } as React.CSSProperties}
                    >
                      <div
                        className="portal-featured-img"
                        style={{
                          background: v.imageWell,
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
                            width: '88%',
                            height: '88%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                      <div style={{ padding: '22px 22px 24px' }}>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: v.warmInk,
                            lineHeight: 1.25,
                            marginBottom: '16px',
                          }}
                        >
                          {product.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '18px',
                              fontWeight: 800,
                              color: v.warmInk,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            ${(product.priceCents / 100).toFixed(2)}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: v.warmInkMuted,
                              padding: '6px 12px',
                              borderRadius: '999px',
                              border: `1px solid ${v.warmBorder}`,
                              background: 'rgba(255,255,255,0.5)',
                            }}
                          >
                            {product.leadWeeks[0]}–{product.leadWeeks[1]} wk
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

      {/* Brand story — navy band */}
      {config.brandStory && (
        <div
          className="portal-px"
          style={{
            borderTop: `1px solid ${v.border}`,
            padding: '80px 64px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '72px',
              alignItems: 'start',
            }}
            className="portal-story-grid"
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(26px, 3vw, 44px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: v.ink,
                  lineHeight: 1.05,
                  marginBottom: '20px',
                }}
              >
                {config.brandStory.headline}
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: v.inkMuted,
                  lineHeight: 1.75,
                }}
              >
                {config.brandStory.body}
              </p>
            </div>

            {config.brandStory.pillars && config.brandStory.pillars.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {config.brandStory.pillars.map((pillar, i) => (
                  <div
                    key={pillar.title}
                    style={{
                      display: 'flex',
                      gap: '18px',
                      alignItems: 'flex-start',
                      paddingTop: i > 0 ? '28px' : undefined,
                      borderTop: i > 0 ? `1px solid ${v.border}` : undefined,
                    }}
                  >
                    <div
                      style={{
                        width: '3px',
                        height: '36px',
                        background: `linear-gradient(180deg, ${v.accent} 0%, ${v.accentSecondary} 100%)`,
                        flexShrink: 0,
                        marginTop: '2px',
                        borderRadius: '2px',
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: v.ink,
                          marginBottom: '8px',
                        }}
                      >
                        {pillar.title}
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: v.inkMuted,
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

      {/* Category grid — warm */}
      <div
        className="portal-px"
        style={{
          background: v.warmSection,
          borderTop: `1px solid ${v.warmBorder}`,
        }}
        id="categories"
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '72px 64px 96px',
          }}
        >
          <div style={{ marginBottom: '44px', maxWidth: '520px' }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: v.accent,
                marginBottom: '12px',
              }}
            >
              {ui.categoryIntroEyebrow}
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 3.2vw, 44px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: v.warmInk,
                lineHeight: 1.05,
              }}
            >
              {ui.categoryIntroTitle}
            </h2>
          </div>

          <div className="portal-home-cat-grid">
            {config.categories.map((cat) => (
              <a
                key={cat.id}
                href={`/portal/${slug}/${cat.slug}`}
                className="portal-cat-card"
                style={{
                  position: 'relative',
                  aspectRatio: '16/11',
                  display: 'block',
                  overflow: 'hidden',
                  background: v.warmInk,
                  textDecoration: 'none',
                  border: `1px solid ${v.warmBorder}`,
                  borderRadius: '4px',
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
                    filter: 'brightness(0.55)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(26,36,54,0.94) 0%, rgba(26,36,54,0.25) 50%, transparent 100%)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '28px 28px 32px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: v.limeSpot,
                      marginBottom: '10px',
                    }}
                  >
                    {cat.products.length} piece{cat.products.length !== 1 ? 's' : ''}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(18px, 2vw, 24px)',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: v.ink,
                      lineHeight: 1.1,
                      marginBottom: '10px',
                    }}
                  >
                    {cat.name}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: v.inkMuted,
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
      </div>

      {/* Contact strip */}
      <div
        style={{
          borderTop: `1px solid ${v.border}`,
          background: v.canvas,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '52px 64px 64px',
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
              color: v.inkFaint,
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: v.limeSpot,
                flexShrink: 0,
              }}
              aria-hidden
            />
            Account manager
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: v.ink,
              letterSpacing: '-0.02em',
              marginBottom: '6px',
            }}
          >
            {config.contact.manager}
          </div>
          <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', marginTop: '10px' }}>
            <a
              href={`mailto:${config.contact.email}`}
              style={{
                fontSize: '14px',
                color: v.inkMuted,
                textDecoration: 'none',
              }}
            >
              {config.contact.email}
            </a>
            {config.contact.phone && (
              <a
                href={`tel:${config.contact.phone}`}
                style={{
                  fontSize: '14px',
                  color: v.inkMuted,
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
              fontSize: '13px',
              color: v.inkFaint,
              lineHeight: 1.65,
              maxWidth: '400px',
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
