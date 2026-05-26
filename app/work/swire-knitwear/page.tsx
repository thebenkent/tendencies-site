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

        /* ─── HERO ─── */
        .sw-hero {
          padding: 136px 72px 120px;
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
          margin: 0 0 44px;
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
          object-position: center 35%;
          display: block;
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

        /* ─── CONTENT BLOCKS ─── */
        .sw-block {
          padding: 128px 72px;
          border-bottom: 1px solid rgba(236,233,227,0.05);
        }

        .sw-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ─── TEXT SPLIT (label | copy) ─── */
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

        /* ─── IMAGE + TEXT SPLIT ─── */
        .sw-img-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 96px;
          align-items: center;
        }

        .sw-img-wrap {
          position: relative;
          overflow: hidden;
          background: #0d0e10;
        }

        .sw-img-portrait { aspect-ratio: 3 / 4; }

        .sw-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          display: block;
          transition: transform 1000ms ease;
        }

        .sw-img-wrap:hover img { transform: scale(1.025); }

        .sw-img-text {
          padding-left: 16px;
        }

        /* ─── PRODUCT BAND (full-width text) ─── */
        .sw-product {
          padding: 112px 72px;
          border-bottom: 1px solid rgba(236,233,227,0.05);
          background: #060708;
        }

        .sw-product-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }

        /* ─── EDITORIAL / OUTCOME ─── */
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
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.18;
          color: #ece9e3;
          max-width: 760px;
          margin: 0 0 88px;
          text-transform: uppercase;
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
          .sw-product   { padding: 80px 28px; }
          .sw-editorial { padding: 80px 28px; }
          .sw-cta       { padding: 80px 28px; }

          .sw-hero-image { aspect-ratio: 4 / 3; }

          .sw-text-split    { grid-template-columns: 1fr; gap: 36px; }
          .sw-img-split     { grid-template-columns: 1fr; gap: 48px; }
          .sw-img-text      { padding-left: 0; }
          .sw-product-inner { grid-template-columns: 1fr; gap: 36px; }

          .sw-outcome-grid { grid-template-columns: 1fr; gap: 40px; }

          .sw-cta-inner { grid-template-columns: 1fr; }
          .sw-cta-right { text-align: left; }
          .sw-cta-right p { margin: 0 0 24px; }

          .sw-meta-row { gap: 28px; }
        }
      `}</style>

      <div className="sw-page">

        {/* ─── HERO ─── */}
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
            src="/work-knitwear.jpg"
            alt="Swire embroidered merino knitwear — navy V-neck"
            loading="eager"
            decoding="async"
          />
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
                  client-facing environments while maintaining comfort, durability,
                  and understated brand presentation. The product needed to sit
                  naturally within a heritage shipping brand — quality that spoke
                  for itself without announcing itself.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── DESIGN ─── */}
        <div className="sw-block">
          <div className="sw-block-inner">
            <div className="sw-img-split">
              <div className="sw-img-wrap sw-img-portrait">
                <img
                  src="/work-knitwear.jpg"
                  alt="Swire knitwear — embroidery detail"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="sw-img-text">
                <p className="sw-num">02 — Design</p>
                <h2 className="sw-section-label" style={{ marginBottom: "28px" }}>
                  Restraint<br />
                  over statement.
                </h2>
                <p className="sw-copy">
                  The garment was intentionally restrained. Small-scale
                  embroidery, deep navy merino, and clean construction allowed
                  the product to feel premium without relying on oversized
                  branding. The kind of piece you notice because of what it
                  doesn't do.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PRODUCT ─── */}
        <div className="sw-product">
          <div className="sw-product-inner">
            <div className="sw-label-col">
              <p className="sw-num">03 — Product</p>
              <h2 className="sw-section-label">
                Quality<br />
                that wears.
              </h2>
            </div>
            <div>
              <p className="sw-copy">
                The knitwear focused on material quality and wearability —
                balancing warmth, softness, and long-term presentation across
                repeated use. Merino construction selected for its durability,
                breathability, and resistance to pilling. A garment built to
                represent the brand across years, not seasons.
              </p>
            </div>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="sw-editorial">
          <div className="sw-editorial-inner">
            <p className="sw-pull-quote">
              Quiet branding. Premium fabrication.<br />
              A garment people genuinely wanted to keep wearing.
            </p>

            <div className="sw-outcome-grid">
              <div className="sw-outcome-col">
                <p className="sw-num">04 — Outcome</p>
                <p className="sw-copy">
                  A refined apparel piece that aligned naturally with the Swire
                  brand. The combination of quiet branding, premium fabrication,
                  and practical everyday wear created a garment that felt
                  genuinely earned — not issued.
                </p>
              </div>
              <div className="sw-outcome-col">
                <p className="sw-num">Delivery</p>
                <p className="sw-copy">
                  Produced to specification and delivered on schedule.
                  Embroidery placement, colour matching, and garment
                  construction were all aligned to Swire's corporate
                  presentation standards throughout.
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
