"use client";

export default function KerastasePillowcaseCaseStudy() {
  return (
    <>
      <style>{`
        .ks-page {
          background: #090807;
          color: #f0ece6;
          font-family: Helvetica, Arial, sans-serif;
        }

        /* ─── HERO — full-bleed retail image, left-side gradient ─── */
        .ks-hero {
          position: relative;
          aspect-ratio: 16 / 8;
          overflow: hidden;
          background: #141210;
        }

        .ks-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 50%;
          display: block;
        }

        /* Gradient only on left — preserves salon shelves on right */
        .ks-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(9,8,7,0.90) 0%,
            rgba(9,8,7,0.54) 36%,
            rgba(9,8,7,0.10) 58%,
            transparent 100%
          );
        }

        .ks-hero-back {
          position: absolute;
          top: 32px;
          left: 48px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.38);
          text-decoration: none;
          transition: color 0.3s;
          z-index: 2;
        }
        .ks-hero-back:hover { color: rgba(240,236,230,0.72); }

        .ks-hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 60px 64px;
          z-index: 2;
          max-width: 660px;
        }

        .ks-hero-eyebrow {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.44);
          margin-bottom: 22px;
        }

        .ks-hero-title {
          font-size: clamp(44px, 6.5vw, 96px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #f0ece6;
          margin: 0 0 24px;
        }

        .ks-accent { color: #b8f400; }

        .ks-hero-subline {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.34);
          font-weight: 400;
        }

        .ks-hero-caption {
          position: absolute;
          bottom: 28px;
          right: 40px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(10,9,8,0.38);
          z-index: 2;
        }

        /* ─── META BAND ─── */
        .ks-meta-band {
          border-bottom: 1px solid rgba(240,236,230,0.06);
        }

        .ks-meta-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 36px 64px;
          display: flex;
          gap: 56px;
          flex-wrap: wrap;
        }

        .ks-meta-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ks-meta-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.22);
          font-weight: 400;
        }

        .ks-meta-value {
          font-size: 12px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.62);
          font-weight: 600;
        }

        /* ─── CONTENT BLOCKS ─── */
        .ks-block {
          padding: 120px 64px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .ks-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ─── TEXT SPLIT ─── */
        .ks-text-split {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }

        .ks-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.18);
          margin-bottom: 16px;
        }

        .ks-section-label {
          font-size: clamp(24px, 2.6vw, 34px);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #f0ece6;
          line-height: 0.96;
          margin: 0;
        }

        .ks-copy {
          font-size: 17px;
          line-height: 1.84;
          color: rgba(240,236,230,0.44);
          font-weight: 400;
          max-width: 580px;
        }

        /* ─── PRODUCT PANEL — cream, pillowcase centered ─── */
        .ks-product-panel {
          background: #f5f0eb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 64px;
          border-top: 1px solid rgba(240,236,230,0.05);
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .ks-product-panel img {
          display: block;
          max-width: 820px;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .ks-product-caption {
          text-align: center;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(9,8,7,0.32);
          margin-top: 28px;
          font-weight: 400;
        }

        /* ─── IMAGE + TEXT SPLIT (design section) ─── */
        .ks-img-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 96px;
          align-items: center;
        }

        .ks-img-wrap {
          position: relative;
          overflow: hidden;
          background: #f5f0eb;
        }

        .ks-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          display: block;
          transition: transform 1000ms ease;
        }

        .ks-img-wrap:hover img { transform: scale(1.025); }

        .ks-img-portrait { aspect-ratio: 4 / 5; }

        /* ─── CONTEXT — hero image, tighter crop on sign ─── */
        .ks-context {
          position: relative;
          aspect-ratio: 16 / 6;
          overflow: hidden;
          background: #141210;
        }

        .ks-context img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 62% 60%;
          display: block;
        }

        .ks-context-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to left,
            rgba(9,8,7,0.82) 0%,
            rgba(9,8,7,0.38) 42%,
            transparent 68%
          );
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 64px 80px;
        }

        .ks-context-copy {
          max-width: 360px;
          text-align: right;
        }

        .ks-context-copy h2 {
          font-size: clamp(22px, 2.6vw, 36px);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #f0ece6;
          line-height: 0.95;
          margin: 0 0 16px;
        }

        .ks-context-copy p {
          font-size: 14px;
          line-height: 1.72;
          color: rgba(240,236,230,0.46);
          font-weight: 400;
        }

        /* ─── EDITORIAL OUTCOME ─── */
        .ks-editorial {
          padding: 128px 64px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .ks-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .ks-pull-quote {
          font-size: clamp(22px, 3vw, 40px);
          font-weight: 300;
          letter-spacing: -0.01em;
          line-height: 1.3;
          color: #f0ece6;
          max-width: 800px;
          margin: 0 0 80px;
          font-style: italic;
        }

        .ks-outcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding-top: 48px;
          border-top: 1px solid rgba(240,236,230,0.06);
        }

        .ks-outcome-col .ks-copy {
          margin-top: 16px;
        }

        /* ─── CTA ─── */
        .ks-cta {
          background: #b8f400;
          padding: 120px 64px;
        }

        .ks-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }

        .ks-cta h2 {
          font-size: clamp(52px, 9vw, 120px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #080808;
          margin: 0;
        }

        .ks-cta-right { text-align: right; }

        .ks-cta-right p {
          font-size: 15px;
          color: rgba(8,8,8,0.55);
          line-height: 1.65;
          max-width: 220px;
          margin: 0 0 24px auto;
        }

        .ks-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          padding: 0 28px;
          border-radius: 999px;
          border: 1.5px solid rgba(8,8,8,0.18);
          color: #080808;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          background: transparent;
          transition: background 0.25s, border-color 0.25s;
        }

        .ks-cta-btn:hover {
          background: rgba(8,8,8,0.07);
          border-color: rgba(8,8,8,0.32);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 980px) {
          .ks-hero         { aspect-ratio: 4 / 3; }
          .ks-hero-content { padding: 36px 28px; max-width: 100%; }
          .ks-hero-back    { top: 20px; left: 20px; }
          .ks-hero-caption { display: none; }

          .ks-meta-inner   { padding: 28px; gap: 24px; }

          .ks-block        { padding: 72px 28px; }
          .ks-editorial    { padding: 80px 28px; }
          .ks-cta          { padding: 80px 28px; }

          .ks-text-split   { grid-template-columns: 1fr; gap: 36px; }
          .ks-img-split    { grid-template-columns: 1fr; gap: 48px; }

          .ks-product-panel { padding: 48px 28px; }

          .ks-context      { aspect-ratio: 4 / 3; }
          .ks-context-overlay {
            padding: 32px 28px;
            justify-content: flex-start;
            background: linear-gradient(
              to top,
              rgba(9,8,7,0.88) 0%,
              rgba(9,8,7,0.28) 60%,
              transparent 100%
            );
            align-items: flex-end;
          }
          .ks-context-copy { text-align: left; max-width: 100%; }

          .ks-outcome-grid { grid-template-columns: 1fr; gap: 40px; }

          .ks-cta-inner    { grid-template-columns: 1fr; }
          .ks-cta-right    { text-align: left; }
          .ks-cta-right p  { margin: 0 0 24px; }

          .ks-meta-inner   { gap: 24px; }
        }
      `}</style>

      <div className="ks-page">

        {/* ─── HERO ─── */}
        <div className="ks-hero">
          <img
            src="/kerastase-hero.jpg"
            alt="Kérastase silk pillowcase GWP display at premium salon counter"
            loading="eager"
            decoding="async"
          />
          <div className="ks-hero-overlay" />

          <a href="/work" className="ks-hero-back">← Work</a>

          <div className="ks-hero-content">
            <p className="ks-hero-eyebrow">Case Study</p>
            <h1 className="ks-hero-title">
              Kérastase<br />
              Silk<br />
              Pillowcase<span className="ks-accent">.</span>
            </h1>
            <p className="ks-hero-subline">
              Luxury salon gifting &nbsp;·&nbsp; Retail activation &nbsp;·&nbsp; Premium GWP
            </p>
          </div>

          <span className="ks-hero-caption">Kérastase · In-Salon GWP Activation</span>
        </div>

        {/* ─── META BAND ─── */}
        <div className="ks-meta-band">
          <div className="ks-meta-inner">
            <div className="ks-meta-item">
              <span className="ks-meta-label">Client</span>
              <span className="ks-meta-value">Kérastase</span>
            </div>
            <div className="ks-meta-item">
              <span className="ks-meta-label">Category</span>
              <span className="ks-meta-value">Beauty GWP</span>
            </div>
            <div className="ks-meta-item">
              <span className="ks-meta-label">Type</span>
              <span className="ks-meta-value">Gift With Purchase</span>
            </div>
            <div className="ks-meta-item">
              <span className="ks-meta-label">Scope</span>
              <span className="ks-meta-value">Design · Sourcing · Delivery</span>
            </div>
          </div>
        </div>

        {/* ─── BRIEF ─── */}
        <div className="ks-block">
          <div className="ks-block-inner">
            <div className="ks-text-split">
              <div>
                <p className="ks-num">01 — Brief</p>
                <h2 className="ks-section-label">
                  Luxurious.<br />
                  Useful.<br />
                  Retainable.
                </h2>
              </div>
              <div>
                <p className="ks-copy">
                  Develop a premium gift-with-purchase item aligned with the
                  elevated Kérastase brand experience. The product needed to feel
                  luxurious, useful, and worthy of retaining beyond the initial
                  campaign — an extension of the salon experience into the home,
                  not a throwaway.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PRODUCT PANEL — pillowcase render, generous cream space ─── */}
        <div className="ks-product-panel">
          <div style={{ width: "100%", maxWidth: "860px" }}>
            <img
              src="/work-kerastase.jpg"
              alt="Kérastase silk pillowcase — lavender with tonal embossed branding"
              loading="lazy"
              decoding="async"
            />
            <p className="ks-product-caption">
              Kérastase Paris · Silk Pillowcase · Tonal Embossed Branding
            </p>
          </div>
        </div>

        {/* ─── DESIGN ─── */}
        <div className="ks-block">
          <div className="ks-block-inner">
            <div className="ks-text-split">
              <div>
                <p className="ks-num">02 — Design</p>
                <h2 className="ks-section-label">
                  Restraint<br />
                  as luxury.
                </h2>
              </div>
              <div>
                <p className="ks-copy">
                  The approach focused on restraint and material quality. Tonal
                  branding, soft lavender colour selection, and clean finishing
                  allowed the product to feel considered rather than overtly
                  promotional — a piece you keep because it is genuinely
                  beautiful, not because it is branded.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CONTEXT — hero image, tighter crop on the GWP sign ─── */}
        <div className="ks-context">
          <img
            src="/kerastase-hero.jpg"
            alt="Kérastase GWP display sign at salon counter"
            loading="lazy"
            decoding="async"
          />
          <div className="ks-context-overlay">
            <div className="ks-context-copy">
              <h2>
                The gift<br />
                at point<br />
                of purchase.
              </h2>
              <p>
                Presented in-salon at the counter — a product beautiful enough
                to communicate value before a word was read.
              </p>
            </div>
          </div>
        </div>

        {/* ─── PRODUCT DETAILS ─── */}
        <div className="ks-block">
          <div className="ks-block-inner">
            <div className="ks-text-split">
              <div>
                <p className="ks-num">03 — Product</p>
                <h2 className="ks-section-label">
                  Soft.<br />
                  Tactile.<br />
                  Considered.
                </h2>
              </div>
              <div>
                <p className="ks-copy">
                  The silk pillowcase was developed to align with premium beauty
                  and haircare positioning — balancing tactile softness,
                  presentation quality, and practical everyday use. Lavender
                  colourway selected for its alignment with Kérastase's brand
                  palette. Delivered with premium presentation to match the
                  salon environment it sat within.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="ks-editorial">
          <div className="ks-editorial-inner">
            <p className="ks-pull-quote">
              "A refined gifting piece that extended the salon experience
              beyond purchase — premium, brand-aligned, and highly giftable."
            </p>

            <div className="ks-outcome-grid">
              <div className="ks-outcome-col">
                <p className="ks-num">04 — Outcome</p>
                <p className="ks-copy">
                  A refined gifting piece that extended the salon experience
                  beyond purchase. The result felt premium, brand-aligned, and
                  highly giftable — while remaining practical enough for
                  ongoing everyday use.
                </p>
              </div>
              <div className="ks-outcome-col">
                <p className="ks-num">Delivery</p>
                <p className="ks-copy">
                  Sourced, decorated, and delivered to Kérastase's exacting
                  brand standards. Every detail — from material weight to
                  branding scale — was considered to ensure the product lived
                  up to the positioning it sat within.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="ks-cta">
          <div className="ks-cta-inner">
            <h2>
              Got<br />
              a brief?
            </h2>
            <div className="ks-cta-right">
              <p>Premium gifting, branded merchandise, and custom product.</p>
              <a href="/start-a-project" className="ks-cta-btn">
                Start a Project
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
