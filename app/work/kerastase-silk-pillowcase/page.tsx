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

        /* ─── HERO ─── */
        .ks-hero {
          padding: 128px 72px 112px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .ks-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.3);
          text-decoration: none;
          margin-bottom: 80px;
          transition: color 0.3s;
        }
        .ks-back:hover { color: rgba(240,236,230,0.72); }

        .ks-eyebrow {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.38);
          margin-bottom: 28px;
        }

        .ks-title {
          font-size: clamp(52px, 8vw, 112px);
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #f0ece6;
          margin: 0 0 40px;
        }

        .ks-accent { color: #b8f400; }

        .ks-subline {
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.32);
          margin-bottom: 56px;
          font-weight: 400;
        }

        .ks-meta-row {
          display: flex;
          gap: 56px;
          flex-wrap: wrap;
          padding-top: 36px;
          border-top: 1px solid rgba(240,236,230,0.07);
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
          color: rgba(240,236,230,0.24);
          font-weight: 400;
        }

        .ks-meta-value {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.65);
          font-weight: 600;
        }

        /* ─── HERO IMAGE ─── */
        .ks-hero-image {
          position: relative;
          aspect-ratio: 16 / 8;
          overflow: hidden;
          background: #141210;
        }

        .ks-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          display: block;
        }

        .ks-hero-caption {
          position: absolute;
          bottom: 28px;
          right: 40px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.26);
        }

        /* ─── SECTION BLOCKS ─── */
        .ks-block {
          padding: 120px 72px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .ks-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ─── TEXT-ONLY SPLIT ─── */
        .ks-prose-split {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 96px;
          align-items: start;
        }

        .ks-label-col {
          padding-top: 4px;
        }

        .ks-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.2);
          margin-bottom: 14px;
        }

        .ks-section-label {
          font-size: clamp(24px, 2.6vw, 36px);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #f0ece6;
          line-height: 0.96;
          margin: 0;
        }

        .ks-copy {
          font-size: 17px;
          line-height: 1.82;
          color: rgba(240,236,230,0.48);
          font-weight: 400;
          max-width: 560px;
        }

        /* ─── IMAGE + TEXT SPLIT ─── */
        .ks-img-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .ks-img-wrap {
          position: relative;
          overflow: hidden;
          background: #141210;
          border: 1px solid rgba(240,236,230,0.04);
        }

        .ks-img-portrait { aspect-ratio: 3 / 4; }

        .ks-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
          transition: transform 900ms ease;
        }

        .ks-img-wrap:hover img { transform: scale(1.03); }

        /* ─── PRODUCT BAND ─── */
        .ks-product-band {
          background: #0d0b09;
          border-top: 1px solid rgba(240,236,230,0.05);
          border-bottom: 1px solid rgba(240,236,230,0.05);
          padding: 96px 72px;
        }

        .ks-product-band-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 48px;
        }

        .ks-product-col {
          padding-right: 48px;
          border-right: 1px solid rgba(240,236,230,0.06);
        }
        .ks-product-col:last-child {
          border-right: none;
          padding-right: 0;
        }

        .ks-product-col-label {
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.2);
          margin-bottom: 16px;
          font-weight: 400;
        }

        .ks-product-col-text {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(240,236,230,0.48);
        }

        /* ─── EDITORIAL OUTCOME ─── */
        .ks-editorial {
          padding: 128px 72px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .ks-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .ks-pull-quote {
          font-size: clamp(22px, 3vw, 42px);
          font-weight: 300;
          letter-spacing: -0.01em;
          line-height: 1.28;
          color: #f0ece6;
          max-width: 820px;
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
          padding: 120px 72px;
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

        .ks-cta-right {
          text-align: right;
        }

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
          .ks-hero      { padding: 96px 28px 72px; }
          .ks-block     { padding: 80px 28px; }
          .ks-editorial { padding: 80px 28px; }
          .ks-cta       { padding: 80px 28px; }
          .ks-product-band { padding: 72px 28px; }

          .ks-hero-image { aspect-ratio: 4 / 3; }

          .ks-prose-split { grid-template-columns: 1fr; gap: 40px; }
          .ks-img-split   { grid-template-columns: 1fr; gap: 48px; }

          .ks-product-band-inner { grid-template-columns: 1fr; gap: 0; }
          .ks-product-col {
            border-right: none;
            border-bottom: 1px solid rgba(240,236,230,0.06);
            padding-right: 0;
            padding-bottom: 36px;
            margin-bottom: 36px;
          }
          .ks-product-col:last-child {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
          }

          .ks-outcome-grid { grid-template-columns: 1fr; gap: 40px; }

          .ks-cta-inner { grid-template-columns: 1fr; }
          .ks-cta-right { text-align: left; }
          .ks-cta-right p { margin: 0 0 24px; }

          .ks-meta-row { gap: 28px; }
        }
      `}</style>

      <div className="ks-page">

        {/* ─── HERO ─── */}
        <div className="ks-hero">
          <a href="/work" className="ks-back">← Work</a>

          <p className="ks-eyebrow">Case Study</p>

          <h1 className="ks-title">
            Kérastase<br />
            Silk Pillowcase<span className="ks-accent">.</span>
          </h1>

          <p className="ks-subline">
            Premium salon gifting &nbsp;·&nbsp; Beauty retail &nbsp;·&nbsp; GWP execution
          </p>

          <div className="ks-meta-row">
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

        {/* ─── HERO IMAGE ─── */}
        <div className="ks-hero-image">
          <img
            src="/work-kerastase.jpg"
            alt="Kérastase silk pillowcase with tonal embossed branding"
            loading="eager"
            decoding="async"
          />
          <span className="ks-hero-caption">Kérastase · Silk Pillowcase GWP</span>
        </div>

        {/* ─── BRIEF ─── */}
        <div className="ks-block">
          <div className="ks-block-inner">
            <div className="ks-prose-split">
              <div className="ks-label-col">
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
                  campaign — not a throwaway, but an extension of the salon
                  experience into the home.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── DESIGN ─── */}
        <div className="ks-block">
          <div className="ks-block-inner">
            <div className="ks-img-split">
              <div className="ks-img-wrap ks-img-portrait">
                <img
                  src="/work-kerastase.jpg"
                  alt="Kérastase silk pillowcase — branding detail"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <p className="ks-num">02 — Design</p>
                <h2 className="ks-section-label">
                  Restraint<br />
                  as luxury.
                </h2>
                <p className="ks-copy" style={{ marginTop: "28px" }}>
                  The approach focused on restraint and material quality. Tonal
                  branding, soft colour selection, and clean finishing allowed
                  the product to feel considered rather than overtly
                  promotional — a piece you keep because it's genuinely
                  beautiful, not because it's branded.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PRODUCT ─── */}
        <div className="ks-product-band">
          <div className="ks-product-band-inner">
            <div className="ks-product-col">
              <p className="ks-product-col-label">03 — Product</p>
              <p className="ks-product-col-text">
                The silk pillowcase was developed to align with premium beauty
                and haircare positioning — balancing tactile softness,
                presentation quality, and practical everyday use.
              </p>
            </div>
            <div className="ks-product-col">
              <p className="ks-product-col-label">Material</p>
              <p className="ks-product-col-text">
                Soft-touch silk construction with tonal embossed branding.
                Lavender colourway selected for its alignment with the
                Kérastase brand palette and premium beauty positioning.
              </p>
            </div>
            <div className="ks-product-col">
              <p className="ks-product-col-label">Finish</p>
              <p className="ks-product-col-text">
                Delivered with premium gifting presentation. Clean finishing,
                subtle branding placement, and a tactile quality that
                communicated value before the product was even used.
              </p>
            </div>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="ks-editorial">
          <div className="ks-editorial-inner">
            <p className="ks-pull-quote">
              "A refined gifting piece that extended the salon experience beyond
              purchase — premium, brand-aligned, and highly giftable."
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
                  branding scale — was considered to ensure the product
                  lived up to the positioning it sat within.
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
