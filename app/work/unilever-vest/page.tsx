"use client";

export default function UnileverVestCaseStudy() {
  return (
    <>
      <style>{`
        .uv-page {
          background: #080808;
          color: #f5f5f0;
          font-family: Helvetica, Arial, sans-serif;
        }

        /* ─── HERO ─── */
        .uv-hero {
          padding: 120px 64px 96px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .uv-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.36);
          text-decoration: none;
          margin-bottom: 72px;
          transition: color 0.2s;
        }
        .uv-back:hover { color: #b8f400; }

        .uv-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #b8f400;
          margin-bottom: 24px;
        }

        .uv-title {
          font-size: clamp(56px, 8.5vw, 120px);
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0 0 56px;
        }

        .uv-accent { color: #b8f400; }

        .uv-meta-row {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .uv-meta-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .uv-meta-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }

        .uv-meta-value {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
        }

        /* ─── FULL-BLEED HERO IMAGE ─── */
        .uv-hero-image {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #111;
        }

        .uv-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .uv-hero-caption {
          position: absolute;
          bottom: 24px;
          right: 32px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        /* ─── CONTENT BLOCKS ─── */
        .uv-block {
          padding: 112px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .uv-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .uv-split {
          display: grid;
          gap: 80px;
          align-items: center;
        }

        .uv-split-text-img {
          grid-template-columns: 1fr 1.3fr;
        }

        .uv-split-img-text {
          grid-template-columns: 1.3fr 1fr;
        }

        .uv-num {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-bottom: 10px;
        }

        .uv-section-label {
          font-size: clamp(26px, 2.8vw, 38px);
          font-weight: 900;
          letter-spacing: -0.035em;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0 0 24px;
          line-height: 0.95;
        }

        .uv-copy {
          font-size: 16px;
          line-height: 1.72;
          color: rgba(255,255,255,0.5);
          max-width: 400px;
        }

        .uv-img {
          position: relative;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .uv-img-tall  { aspect-ratio: 4 / 5; }
        .uv-img-landscape { aspect-ratio: 5 / 4; }

        .uv-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 700ms ease;
        }

        .uv-img:hover img { transform: scale(1.04); }

        /* ─── FULL-BLEED PRODUCT SECTION ─── */
        .uv-product-bleed {
          position: relative;
          aspect-ratio: 21 / 9;
          overflow: hidden;
          background: #111;
        }

        .uv-product-bleed img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .uv-product-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(8,8,8,0.85) 0%,
            rgba(8,8,8,0.42) 50%,
            transparent 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 72px 80px;
        }

        .uv-product-copy {
          max-width: 460px;
        }

        .uv-product-copy h2 {
          font-size: clamp(32px, 4vw, 60px);
          font-weight: 900;
          letter-spacing: -0.045em;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0 0 16px;
          line-height: 0.9;
        }

        .uv-product-copy p {
          font-size: 15px;
          line-height: 1.65;
          color: rgba(255,255,255,0.56);
          max-width: 340px;
        }

        /* ─── EDITORIAL OUTCOME ─── */
        .uv-editorial {
          padding: 120px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .uv-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .uv-pull-quote {
          font-size: clamp(24px, 3.2vw, 44px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.12;
          color: #f5f5f0;
          max-width: 860px;
          margin: 0 0 72px;
        }

        .uv-outcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding-top: 48px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .uv-outcome-col .uv-copy {
          margin-top: 14px;
        }

        /* ─── CTA BAND ─── */
        .uv-cta {
          background: #b8f400;
          padding: 120px 64px;
        }

        .uv-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }

        .uv-cta h2 {
          font-size: clamp(56px, 9vw, 128px);
          font-weight: 900;
          letter-spacing: -0.065em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #080808;
          margin: 0;
        }

        .uv-cta-right {
          text-align: right;
        }

        .uv-cta-right p {
          font-size: 15px;
          color: rgba(8,8,8,0.58);
          line-height: 1.6;
          max-width: 220px;
          margin: 0 0 24px auto;
        }

        .uv-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          padding: 0 28px;
          border-radius: 999px;
          border: 1.5px solid rgba(8,8,8,0.2);
          color: #080808;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          background: transparent;
          transition: background 0.2s, border-color 0.2s;
        }

        .uv-cta-btn:hover {
          background: rgba(8,8,8,0.08);
          border-color: rgba(8,8,8,0.38);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 980px) {
          .uv-hero        { padding: 96px 28px 72px; }
          .uv-block       { padding: 72px 28px; }
          .uv-editorial   { padding: 72px 28px; }
          .uv-cta         { padding: 80px 28px; }

          .uv-split-text-img,
          .uv-split-img-text { grid-template-columns: 1fr; gap: 40px; }

          .uv-hero-image    { aspect-ratio: 4 / 3; }
          .uv-product-bleed { aspect-ratio: 4 / 3; }
          .uv-product-overlay { padding: 36px; }

          .uv-outcome-grid { grid-template-columns: 1fr; gap: 36px; }

          .uv-cta-inner { grid-template-columns: 1fr; }
          .uv-cta-right { text-align: left; }
          .uv-cta-right p { margin: 0 0 24px; }
        }
      `}</style>

      <div className="uv-page">

        {/* ─── HERO ─── */}
        <div className="uv-hero">
          <a href="/work" className="uv-back">← Work</a>

          <p className="uv-eyebrow">Case Study</p>

          <h1 className="uv-title">
            Unilever<br />
            Brand Vest<span className="uv-accent">.</span>
          </h1>

          <div className="uv-meta-row">
            <div className="uv-meta-item">
              <span className="uv-meta-label">Client</span>
              <span className="uv-meta-value">Unilever</span>
            </div>
            <div className="uv-meta-item">
              <span className="uv-meta-label">Category</span>
              <span className="uv-meta-value">Apparel</span>
            </div>
            <div className="uv-meta-item">
              <span className="uv-meta-label">Type</span>
              <span className="uv-meta-value">Multi-Brand Execution</span>
            </div>
            <div className="uv-meta-item">
              <span className="uv-meta-label">Scope</span>
              <span className="uv-meta-value">Design · Manufacture · Delivery</span>
            </div>
          </div>
        </div>

        {/* ─── HERO IMAGE ─── */}
        <div className="uv-hero-image">
          <img
            src="/unilever-in-use01.png"
            alt="Unilever field team wearing branded vest"
            loading="eager"
            decoding="async"
          />
          <span className="uv-hero-caption">Field Operations · Branded Vest</span>
        </div>

        {/* ─── BRIEF ─── */}
        <div className="uv-block">
          <div className="uv-block-inner">
            <div className="uv-split uv-split-text-img">
              <div>
                <p className="uv-num">01 — Brief</p>
                <h2 className="uv-section-label">
                  Multi-brand.<br />
                  One garment.
                </h2>
                <p className="uv-copy">
                  Develop branded apparel that could represent multiple Unilever
                  brands in-field. The product needed to balance visibility,
                  durability, and comfort across long working days.
                </p>
              </div>
              <div className="uv-img uv-img-tall">
                <img
                  src="/unilever-in-use02.png"
                  alt="Unilever field team vest in use"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── DESIGN ─── */}
        <div className="uv-block">
          <div className="uv-block-inner">
            <div className="uv-split uv-split-img-text">
              <div className="uv-img uv-img-tall">
                <img
                  src="/unilever-close-up.png"
                  alt="Unilever vest branding close-up"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <p className="uv-num">02 — Design</p>
                <h2 className="uv-section-label">
                  Placement.<br />
                  Scale.<br />
                  Balance.
                </h2>
                <p className="uv-copy">
                  We structured the garment to carry multiple brand identities
                  without feeling cluttered. Placement, scale, and colour balance
                  were critical — ensuring each brand remained clear while the
                  overall product stayed clean and wearable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PRODUCT — FULL BLEED ─── */}
        <div className="uv-product-bleed">
          <img
            src="/unilever-in-use03.png"
            alt="Unilever vest — operational field use"
            loading="lazy"
            decoding="async"
          />
          <div className="uv-product-overlay">
            <div className="uv-product-copy">
              <h2>Built for<br />the field.</h2>
              <p>
                Durable materials suited to daily wear. Embroidery and print
                methods selected to maintain brand integrity through sustained
                field use — not just presentation.
              </p>
            </div>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="uv-editorial">
          <div className="uv-editorial-inner">
            <p className="uv-pull-quote">
              A practical piece of apparel that worked hard in the field.
              Clear brand visibility, consistent presentation — and a product
              teams actually wanted to wear.
            </p>

            <div className="uv-outcome-grid">
              <div className="uv-outcome-col">
                <p className="uv-num">03 — Outcome</p>
                <p className="uv-copy">
                  Designed to be used, not admired. The vest delivered
                  field-ready performance with clean brand execution across
                  multiple Unilever identities.
                </p>
              </div>
              <div className="uv-outcome-col">
                <p className="uv-num">Product</p>
                <p className="uv-copy">
                  Durable materials. Embroidery and print techniques chosen
                  for longevity. Wearable branding that holds its integrity
                  through real-world FMCG field operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="uv-cta">
          <div className="uv-cta-inner">
            <h2>
              Got<br />
              a brief?
            </h2>
            <div className="uv-cta-right">
              <p>Ready to build something that actually gets used?</p>
              <a href="/start-a-project" className="uv-cta-btn">
                Start a Project
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
