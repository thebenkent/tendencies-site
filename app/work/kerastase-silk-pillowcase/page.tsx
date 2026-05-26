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
        .ks-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(9,8,7,0.92) 0%,
            rgba(9,8,7,0.56) 36%,
            rgba(9,8,7,0.12) 58%,
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
        .ks-meta-item { display: flex; flex-direction: column; gap: 6px; }
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

        /* ─── BRIEF ─── */
        .ks-block {
          padding: 160px 64px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }
        .ks-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }
        .ks-text-split {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 96px;
          align-items: start;
        }
        .ks-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.18);
          margin-bottom: 20px;
        }
        .ks-section-label {
          font-size: clamp(32px, 3.2vw, 48px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f0ece6;
          line-height: 0.9;
          margin: 0;
        }
        .ks-copy {
          font-size: 17px;
          line-height: 1.92;
          color: rgba(240,236,230,0.42);
          font-weight: 400;
          max-width: 560px;
        }

        /* ─── RETAIL ACTIVATION — cinematic full-bleed feature ─── */
        .ks-retail {
          position: relative;
          aspect-ratio: 21 / 9;
          overflow: hidden;
          background: #0d0b0a;
        }
        .ks-retail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 55% 40%;
          display: block;
        }
        .ks-retail-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(9,8,7,0.80) 0%,
            rgba(9,8,7,0.10) 35%,
            transparent 60%
          );
          display: flex;
          align-items: flex-end;
          padding: 48px 64px;
        }
        .ks-retail-label {
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.28);
          font-weight: 400;
        }

        /* ─── DESIGN — product on deep plum, editorial split ─── */
        .ks-design {
          border-top: 1px solid rgba(240,236,230,0.04);
          border-bottom: 1px solid rgba(240,236,230,0.04);
        }
        .ks-design-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 640px;
          align-items: stretch;
        }
        .ks-design-image {
          position: relative;
          overflow: hidden;
          background: #07050d;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 72px 56px;
        }
        .ks-design-image img {
          display: block;
          width: 100%;
          max-width: 440px;
          height: auto;
          object-fit: contain;
          position: relative;
          z-index: 1;
        }
        .ks-design-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 42%, rgba(7,5,13,0.82) 100%);
          pointer-events: none;
          z-index: 2;
        }
        .ks-design-text {
          background: #0e0b14;
          padding: 120px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ks-design-text .ks-section-label {
          margin-bottom: 40px;
        }
        .ks-design-text .ks-copy {
          max-width: 480px;
        }

        /* ─── DETAIL — warm charcoal ─── */
        .ks-detail {
          background: #0f0d09;
          padding: 160px 64px;
          border-bottom: 1px solid rgba(240,236,230,0.04);
        }
        .ks-detail-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ─── EDITORIAL OUTCOME ─── */
        .ks-editorial {
          padding: 160px 64px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }
        .ks-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }
        .ks-pull-quote {
          font-size: clamp(24px, 3.2vw, 46px);
          font-weight: 300;
          letter-spacing: -0.02em;
          line-height: 1.28;
          color: rgba(240,236,230,0.86);
          max-width: 900px;
          margin: 0 0 96px;
          font-style: italic;
        }
        .ks-outcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding-top: 56px;
          border-top: 1px solid rgba(240,236,230,0.06);
        }
        .ks-outcome-col .ks-copy { margin-top: 16px; }

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

          .ks-meta-inner   { padding: 24px 28px; gap: 24px; }

          .ks-block        { padding: 96px 28px; }
          .ks-text-split   { grid-template-columns: 1fr; gap: 40px; }

          .ks-retail       { aspect-ratio: 4 / 3; }
          .ks-retail-overlay { padding: 28px; }

          .ks-design-inner { grid-template-columns: 1fr; min-height: auto; }
          .ks-design-image { padding: 52px 36px; min-height: 300px; }
          .ks-design-image img { max-width: 300px; }
          .ks-design-text  { padding: 64px 28px; }
          .ks-design-text .ks-copy { max-width: none; }

          .ks-detail       { padding: 96px 28px; }

          .ks-editorial    { padding: 96px 28px; }
          .ks-pull-quote   { margin-bottom: 64px; }
          .ks-outcome-grid { grid-template-columns: 1fr; gap: 40px; }

          .ks-cta          { padding: 80px 28px; }
          .ks-cta-inner    { grid-template-columns: 1fr; }
          .ks-cta-right    { text-align: left; }
          .ks-cta-right p  { margin: 0 0 24px; max-width: none; }
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

        {/* ─── RETAIL ACTIVATION — cinematic full-bleed feature ─── */}
        <div className="ks-retail">
          <img
            src="/kerastase-hero.jpg"
            alt="Kérastase GWP silk pillowcase activation at premium salon retail counter"
            loading="lazy"
            decoding="async"
          />
          <div className="ks-retail-overlay">
            <span className="ks-retail-label">
              In-Salon Retail Activation &nbsp;·&nbsp; Gift With Purchase Display
            </span>
          </div>
        </div>

        {/* ─── DESIGN — pillowcase on deep plum, editorial split ─── */}
        <div className="ks-design">
          <div className="ks-design-inner">
            <div className="ks-design-image">
              <img
                src="/work-kerastase.jpg"
                alt="Kérastase silk pillowcase — lavender with tonal embossed branding"
                loading="lazy"
                decoding="async"
              />
              <div className="ks-design-vignette" />
            </div>
            <div className="ks-design-text">
              <p className="ks-num">02 — Design</p>
              <h2 className="ks-section-label">
                Restraint<br />
                as luxury.
              </h2>
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

        {/* ─── PRODUCT DETAIL — warm charcoal ─── */}
        <div className="ks-detail">
          <div className="ks-detail-inner">
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
              A refined gifting piece that extended the salon experience
              beyond purchase — premium, brand-aligned,
              and highly giftable.
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
