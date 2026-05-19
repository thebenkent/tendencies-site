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
    <div className="portal-root" style={{ background: v.canvas, minHeight: '100vh' }}>
      <PortalHeader config={config} slug={slug} />

      {/* Hero — split layout with editorial image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {config.hero.image && (
          <div className="portal-hero-img-mobile">
            <img src={config.hero.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${v.canvas} 100%)` }} />
          </div>
        )}
        {config.hero.image && (
          <div className="portal-hero-img-desktop" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '42%', zIndex: 0 }}>
            <img src={config.hero.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${v.canvas} 0%, ${v.canvas}cc 22%, transparent 58%)` }} />
          </div>
        )}
        <div
          className="portal-px portal-hero"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '72px 64px 64px',
            maxWidth: '1120px',
            margin: '0 auto',
          }}
        >
        <div className={config.hero.image ? 'portal-hero-text-col' : undefined}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: v.inkMuted,
            margin: '0 0 28px',
            maxWidth: '520px',
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: v.ink }}>{config.clientName}</span>
          <span style={{ color: v.inkFaint, margin: '0 0.65em' }} aria-hidden>
            ·
          </span>
          <span style={{ color: v.accent }}>{config.portalTitle}</span>
        </p>
        <h1
          style={{
            fontSize: 'clamp(34px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.038em',
            color: v.ink,
            lineHeight: 1.05,
            margin: '0 0 20px',
            maxWidth: '18ch',
          }}
        >
          {config.hero.tagline}
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 1.35vw, 18px)',
            color: v.inkMuted,
            lineHeight: 1.6,
            maxWidth: '540px',
            margin: '0 0 32px',
          }}
        >
          {config.hero.subtitle}
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="#recommended-kits"
            className="portal-hero-primary-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '52px',
              padding: '0 32px',
              background: v.accent,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '3px',
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
              minHeight: '52px',
              padding: '0 28px',
              background: 'transparent',
              color: v.ink,
              border: `1px solid ${v.border}`,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '3px',
            }}
          >
            {ui.heroSecondaryCta}
          </a>
        </div>

        {/* Product teaser strip — pulls first 4 images from the first featured collection */}
        {(() => {
          const fc = config.featuredCollections?.[0]
          if (!fc) return null
          const cat = config.categories.find((c) => c.slug === fc.categorySlug)
          if (!cat) return null
          const thumbs = fc.productIds
            .map((id) => cat.products.find((p) => p.id === id))
            .filter((p): p is (typeof cat.products)[0] => Boolean(p))
            .slice(0, 4)
          if (thumbs.length === 0) return null
          return (
            <div
              style={{
                marginTop: '48px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {thumbs.map((p, i) => (
                <div
                  key={i}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: v.imageWell,
                    flexShrink: 0,
                    border: `1px solid ${v.border}`,
                  }}
                >
                  <img
                    src={p.image}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '6px',
                      opacity: 0.88,
                    }}
                  />
                </div>
              ))}
              <span
                style={{
                  fontSize: '11px',
                  color: v.inkFaint,
                  marginLeft: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.products.length} pieces in this range
              </span>
            </div>
          )
        })()}
        </div>
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
                  padding: '64px 64px 72px',
                  maxWidth: '1120px',
                  margin: '0 auto',
                  borderBottom: idx < config.featuredCollections!.length - 1 ? `1px solid ${v.warmBorder}` : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '32px',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ maxWidth: '640px', flex: '1 1 320px' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: v.accent,
                        marginBottom: '14px',
                      }}
                    >
                      {ui.collectionEyebrow}
                    </div>
                    <h2
                      style={{
                        fontSize: 'clamp(24px, 2.8vw, 36px)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: v.warmInk,
                        lineHeight: 1.08,
                        margin: '0 0 14px',
                      }}
                    >
                      {collection.title}
                    </h2>
                    <p
                      style={{
                        fontSize: '16px',
                        color: v.warmInkMuted,
                        margin: 0,
                        lineHeight: 1.65,
                      }}
                    >
                      {collection.subtitle}
                    </p>
                  </div>
                  <a
                    href={`/portal/${slug}/${collection.categorySlug}`}
                    className="portal-view-cat-link portal-kit-outline-cta"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: v.warmInk,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      minHeight: '48px',
                      padding: '0 22px',
                      border: `1px solid ${v.warmBorder}`,
                      borderRadius: '3px',
                      background: v.cardOnWarm,
                      '--portal-accent': v.accent,
                    } as React.CSSProperties}
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
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 14px 44px rgba(28,39,56,0.07)',
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
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '8% 12%',
                          }}
                        />
                      </div>
                      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div
                          style={{
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: v.warmInk,
                            lineHeight: 1.3,
                            marginBottom: '18px',
                          }}
                        >
                          {product.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: '14px',
                            flexWrap: 'wrap',
                            marginTop: 'auto',
                            paddingTop: '4px',
                            borderTop: `1px solid ${v.warmBorder}`,
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontSize: '20px',
                                fontWeight: 800,
                                color: v.warmInk,
                                letterSpacing: '-0.02em',
                              }}
                            >
                              ${(product.priceCents / 100).toFixed(2)}
                            </span>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: v.warmInkMuted,
                                marginTop: '4px',
                              }}
                            >
                              Lead {product.leadWeeks[0]}–{product.leadWeeks[1]} weeks
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.14em',
                              textTransform: 'uppercase',
                              color: v.accent,
                            }}
                          >
                            {ui.featuredPieceCta} →
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
            padding: '72px 64px',
            maxWidth: '1120px',
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
            {/* Left column: image when present, else headline + body */}
            {config.brandStory.image ? (
              <div
                className="portal-story-image"
                style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}
              >
                <img
                  src={config.brandStory.image}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                  }}
                />
              </div>
            ) : (
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
                <p style={{ fontSize: '16px', color: v.inkMuted, lineHeight: 1.75 }}>
                  {config.brandStory.body}
                </p>
              </div>
            )}

            {/* Right column: always contains text; pillars follow when image is used */}
            <div>
              {config.brandStory.image && (
                <>
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
                      marginBottom: config.brandStory.pillars?.length ? '40px' : '0',
                    }}
                  >
                    {config.brandStory.body}
                  </p>
                </>
              )}
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
                          background: `linear-gradient(180deg, ${v.accent} 0%, ${v.accentSecondary} 72%, ${v.limeSpot} 100%)`,
                          flexShrink: 0,
                          marginTop: '2px',
                          borderRadius: '2px',
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.01em',
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
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '64px 64px 88px',
          }}
        >
          <div style={{ marginBottom: '48px', maxWidth: '560px' }}>
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
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      color: v.accent,
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
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '72px 64px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '48px',
          alignItems: 'start',
        }}
        id="contact"
        className="portal-contact-strip portal-px"
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: v.inkFaint,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: v.accent,
                flexShrink: 0,
              }}
              aria-hidden
            />
            Your account manager
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: v.ink,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginBottom: '8px',
            }}
          >
            {config.contact.manager}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: v.inkMuted,
              marginBottom: '20px',
              lineHeight: 1.5,
            }}
          >
            Here for quotes, samples, and anything custom.
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <a
              href={`mailto:${config.contact.email}`}
              style={{
                fontSize: '15px',
                fontWeight: 500,
                color: v.ink,
                textDecoration: 'none',
                borderBottom: `1px solid ${v.border}`,
                paddingBottom: '2px',
              }}
            >
              {config.contact.email}
            </a>
            {config.contact.phone && (
              <a
                href={`tel:${config.contact.phone}`}
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
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
              lineHeight: 1.7,
              maxWidth: '360px',
              margin: 0,
              textAlign: 'right',
              paddingTop: '8px',
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
