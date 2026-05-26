"use client";

export default function SwireKnitwearCaseStudy() {
  return (
    <>
      <style>{`
        .sw-page {
          background: #08090b;
          color: #ece9e3;
          font-family: Helvetica, Arial, sans-serif;
        }

        /* ─── HERO TEXT ─── */
        .sw-hero {
          padding: 136px 72px 96px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .sw-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(236,233,227,0.28);
          text-decoration: none;
          margin-bottom: 88px;
          transition: color 0.3s;
        }
        .sw-back:hover { color: rgba(236,233,227,0.6); }

        .sw-eyebrow {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: rgba(236,233,227,0.28);
          margin-bottom: 32px;
        }

        .sw-title {
          font-size: clamp(48px, 7.5vw, 108px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.91;
          text-transform: uppercase;
          color: #ece9e3;
          margin: 0 0 40px;
        }

        .sw-accent { color: #b8f400; }

        .sw-subline {
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(236,233,227,0.28);
          font-weight: 400;
          margin-bottom: 64px;
        }

        .sw-meta-row {
          display: flex;
          gap: 56px;
          flex-wrap: wrap;
          padding-top: 40px;
          border-top: 1px solid rgba(236,233,227,0.06);
        }

        .sw-meta-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sw-meta-label {
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(236,233,227,0.2);
          font-weight: 400;
        }

        .sw-meta-value {
          font-size: 12px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(236,233,227,0.6);
          font-weight: 600;
        }

        /* ─── HERO IMAGE ─── */
        .sw-hero-image {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #0d0e10;
        }

        .sw-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
        }

        .sw-hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,9,11,0.38) 0%,
            transparent 45%
          );
        }

        .sw-hero-caption {
          position: absolute;
          bottom: 28px;
          right: 40px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(236,233,227,0.22);
        }

        /* ─── DIVIDER ─── */
        .sw-divider {
          border: none;
          border-top: 1px solid rgba(236,233,227,0.06);
          margin: 0;
        }

        /* ─── BRIEF — text split ─── */
        .sw-block {
          padding: 128px 72px;
          border-bottom: 1px solid rgba(236,233,227,0.05);
        }

        .sw-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .sw-text-split {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }

        .sw-label-col {
          padding-top: 2px;
        }

        .sw-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(236,233,227,0.18);
          margin-bottom: 16px;
        }

        .sw-section-label {
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 900;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          color: #ece9e3;
          line-height: 0.97;
          margin: 0;
        }

        .sw-copy {
          font-size: 17px;
          line-height: 1.88;
          color: rgba(236,233,227,0.44);
          font-weight: 400;
          max-width: 600px;
        }

        /* ─── PRODUCT — render on white card ─── */
        .sw-product-band {
          border-bottom: 1px solid rgba(236,233,227,0.05);
        }

        .sw-product-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 0 72px;
        }

        .sw-product-card {
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 72px;
          min-height: 540px;
        }

        .sw-product-card img {
          display: block;
          width: 100%;
          max-width: 420px;
          height: auto;
          object-fit: contain;
        }

        .sw-product-text {
          padding: 80px 80px 80px 96px;
          background: #08090b;
        }

        /* ─── DETAIL — close-up full bleed ─── */
        .sw-detail-band {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #0d0e10;
          border-bottom: 1px solid rgba(236,233,227,0.05);
        }

        .sw-detail-band img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          transition: transform 1200ms ease;
        }

        .sw-detail-band:hover img { transform: scale(1.02); }

        .sw-detail-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(8,9,11,0.82) 0%,
            rgba(8,9,11,0.32) 50%,
            transparent 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 72px 80px;
        }

        .sw-detail-copy {
          max-width: 420px;
        }

        .sw-detail-copy p.sw-num {
          margin-bottom: 14px;
        }

        .sw-detail-copy h2 {
          font-size: clamp(26px, 3vw, 44px);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #ece9e3;
          margin: 0 0 20px;
          line-height: 0.93;
        }

        .sw-detail-copy p.sw-copy {
          font-size: 15px;
          line-height: 1.72;
          color: rgba(236,233,227,0.52);
          max-width: 360px;
        }

        /* ─── OUTCOME editorial ─── */
        .sw-editorial {
          padding: 136px 72px;
          border-bottom: 1px solid rgba(236,233,227,0.05);
        }

        .sw-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .sw-pull-quote {
          font-size: clamp(22px, 2.8vw, 38px);
          font-weight: 300;
          font-style: italic;
          letter-spacing: -0.015em;
          line-height: 1.24;
          color: rgba(236,233,227,0.72);
          max-width: 800px;
          margin: 0 0 88px;
        }

        .sw-outcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding-top: 48px;
          border-top: 1px solid rgba(236,233,227,0.06);
        }

        .sw-outcome-col .sw-copy {
          margin-top: 16px;
        }

        /* ─── CTA ─── */
        .sw-cta {
          background: #b8f400;
          padding: 120px 72px;
        }

        .sw-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }

        .sw-cta h2 {
          font-size: clamp(52px, 9vw, 120px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #080808;
          margin: 0;
        }

        .sw-cta-right {
          text-align: right;
        }

        .sw-cta-right p {
          font-size: 15px;
          color: rgba(8,8,8,0.52);
          line-height: 1.65;
          max-width: 220px;
          margin: 0 0 24px auto;
        }

        .sw-cta-btn {
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

        .sw-cta-btn:hover {
          background: rgba(8,8,8,0.07);
          border-color: rgba(8,8,8,0.32);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 980px) {
          .sw-hero      { padding: 96px 28px 72px; }
          .sw-block     { padding: 80px 28px; }
          .sw-editorial { padding: 80px 28px; }
          .sw-cta       { padding: 80px 28px; }

          .sw-hero-image  { aspect-ratio: 4 / 3; }
          .sw-detail-band { aspect-ratio: 4 / 3; }
          .sw-detail-overlay { padding: 36px; }

          .sw-text-split { grid-template-columns: 1fr; gap: 36px; }

          .sw-product-inner { grid-template-columns: 1fr; padding: 0; }
          .sw-product-card  { padding: 56px 40px; min-height: 340px; }
          .sw-product-text  { padding: 56px 28px; }

          .sw-outcome-grid { grid-template-columns: 1fr; gap: 40px; }

          .sw-cta-inner { grid-template-columns: 1fr; }
          .sw-cta-right { text-align: left; }
          .sw-cta-right p { margin: 0 0 24px; }

          .sw-meta-row { gap: 28px; }
        }
      `}</style>

      <div className="sw-page">

        {/* ─── HERO TEXT ─── */}
        <div className="sw-hero">
          <a href="/work" className="sw-back">← Work</a>

          <p className="sw-eyebrow">Case Study</p>

          <h1 className="sw-title">
            Swire<br />
            Embroidered<br />
            Knitwear<span className="sw-accent">.</span>
          </h1>

          <p className="sw-subline">
            Premium corporate apparel &nbsp;·&nbsp; Merino knitwear &nbsp;·&nbsp; Embroidered branding
          </p>

          <div className="sw-meta-row">
            <div className="sw-meta-item">
              <span className="sw-meta-label">Client</span>
              <span className="sw-meta-value">Swire Shipping</span>
            </div>
            <div className="sw-meta-item">
              <span className="sw-meta-label">Category</span>
              <span className="sw-meta-value">Corporate Apparel</span>
            </div>
            <div className="sw-meta-item">
              <span className="sw-meta-label">Type</span>
              <span className="sw-meta-value">Embroidered Knitwear</span>
            </div>
            <div className="sw-meta-item">
              <span className="sw-meta-label">Scope</span>
              <span className="sw-meta-value">Design · Manufacture · Delivery</span>
            </div>
          </div>
        </div>

        {/* ─── HERO IMAGE ─── */}
        <div className="sw-hero-image">
          <img
            src="/swire-merino-hero.jpg"
            alt="Swire corporate knitwear — lifestyle"
            loading="eager"
            decoding="async"
          />
          <div className="sw-hero-image-overlay" />
          <span className="sw-hero-caption">Swire Shipping · Corporate Knitwear</span>
        </div>

        {/* ─── BRIEF ─── */}
        <div className="sw-block">
          <div className="sw-block-inner">
            <div className="sw-text-split">
              <div className="sw-label-col">
                <p className="sw-num">01 — Brief</p>
                <h2 className="sw-section-label">
                  Refined.<br />
                  Client-facing.<br />
                  Enduring.
                </h2>
              </div>
              <div>
                <p className="sw-copy">
                  Develop a premium knitwear garment suitable for corporate and
                  client-facing environments. The brief called for something
                  that sat naturally within a heritage shipping brand —
                  quality that communicated without announcing itself. Comfort,
                  durability, and understated presentation across repeated wear.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PRODUCT — render on white ─── */}
        <div className="sw-product-band">
          <div className="sw-product-inner">
            <div className="sw-product-card">
              <img
                src="/swire-merino01.jpg"
                alt="Swire embroidered merino knitwear — product render"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="sw-product-text">
              <p className="sw-num">02 — Product</p>
              <h2 className="sw-section-label" style={{ marginBottom: "28px" }}>
                Merino.<br />
                Constructed<br />
                to last.
              </h2>
              <p className="sw-copy">
                Merino construction selected for its durability, breathability,
                and resistance to pilling — qualities that matter across years
                of daily wear, not just the first impression. Softness and
                warmth without bulk. A garment built to represent the brand
                season after season.
              </p>
            </div>
          </div>
        </div>

        {/* ─── DETAIL — close-up full bleed ─── */}
        <div className="sw-detail-band">
          <img
            src="/swire-merino-close-up.jpg"
            alt="Swire knitwear — embroidery and merino texture detail"
            loading="lazy"
            decoding="async"
          />
          <div className="sw-detail-overlay">
            <div className="sw-detail-copy">
              <p className="sw-num">03 — Detail</p>
              <h2>
                Embroidery<br />
                at the right<br />
                scale.
              </h2>
              <p className="sw-copy">
                Small-scale embroidery placed with intention. The branding
                reads clearly at close range without dominating the garment
                — the kind of detail that earns respect rather than demanding
                attention.
              </p>
            </div>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="sw-editorial">
          <div className="sw-editorial-inner">
            <p className="sw-pull-quote">
              A garment that felt genuinely earned —
              not issued. The kind of piece people chose
              to keep wearing.
            </p>

            <div className="sw-outcome-grid">
              <div className="sw-outcome-col">
                <p className="sw-num">04 — Outcome</p>
                <p className="sw-copy">
                  Quiet branding, premium fabrication, and practical daily
                  wearability combined to produce a corporate apparel piece
                  that aligned naturally with the Swire brand identity.
                  Understated in the best way.
                </p>
              </div>
              <div className="sw-outcome-col">
                <p className="sw-num">Delivery</p>
                <p className="sw-copy">
                  Produced to specification and delivered on schedule.
                  Embroidery placement, colour matching, and garment
                  construction were held to Swire's corporate presentation
                  standards throughout.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="sw-cta">
          <div className="sw-cta-inner">
            <h2>
              Got<br />
              a brief?
            </h2>
            <div className="sw-cta-right">
              <p>Premium corporate apparel, gifting, and branded product.</p>
              <a href="/start-a-project" className="sw-cta-btn">
                Start a Project
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
