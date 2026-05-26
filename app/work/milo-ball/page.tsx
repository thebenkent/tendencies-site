"use client";

export default function MiloCaseStudy() {
  return (
    <>
      <style>{`
        .mb-page {
          background: #08090b;
          color: #f0ece6;
          font-family: Helvetica, Arial, sans-serif;
        }

        /* ─── HERO TEXT ─── */
        .mb-hero {
          padding: 136px 72px 96px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .mb-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.28);
          text-decoration: none;
          margin-bottom: 88px;
          transition: color 0.3s;
        }
        .mb-back:hover { color: rgba(240,236,230,0.6); }

        .mb-eyebrow {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.28);
          margin-bottom: 32px;
        }

        .mb-title {
          font-size: clamp(48px, 7.5vw, 108px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.91;
          text-transform: uppercase;
          color: #f0ece6;
          margin: 0 0 40px;
        }

        .mb-accent { color: #b8f400; }

        .mb-subline {
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.28);
          font-weight: 400;
          margin-bottom: 64px;
        }

        .mb-meta-row {
          display: flex;
          gap: 56px;
          flex-wrap: wrap;
          padding-top: 40px;
          border-top: 1px solid rgba(240,236,230,0.06);
        }

        .mb-meta-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mb-meta-label {
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.2);
          font-weight: 400;
        }

        .mb-meta-value {
          font-size: 12px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.6);
          font-weight: 600;
        }

        /* ─── HERO IMAGE ─── */
        .mb-hero-image {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #0d0e10;
        }

        .mb-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
          display: block;
        }

        .mb-hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,9,11,0.46) 0%,
            transparent 55%
          );
        }

        .mb-hero-caption {
          position: absolute;
          bottom: 28px;
          right: 40px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.22);
        }

        /* ─── CONTENT BLOCKS ─── */
        .mb-block {
          padding: 128px 72px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .mb-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .mb-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.18);
          margin-bottom: 16px;
        }

        .mb-section-label {
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 900;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          color: #f0ece6;
          line-height: 0.97;
          margin: 0;
        }

        .mb-copy {
          font-size: 17px;
          line-height: 1.88;
          color: rgba(240,236,230,0.44);
          font-weight: 400;
          max-width: 600px;
        }

        /* ─── BRIEF — text split + portrait image ─── */
        .mb-text-split {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }

        .mb-label-col {
          padding-top: 2px;
        }

        /* ─── DESIGN — full bleed with overlay ─── */
        .mb-design-band {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #0d0e10;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .mb-design-band img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        .mb-design-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(8,9,11,0.86) 0%,
            rgba(8,9,11,0.36) 52%,
            transparent 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 72px 80px;
        }

        .mb-design-copy {
          max-width: 440px;
        }

        .mb-design-copy h2 {
          font-size: clamp(26px, 3vw, 44px);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #f0ece6;
          margin: 0 0 18px;
          line-height: 0.93;
        }

        .mb-design-copy p {
          font-size: 15px;
          line-height: 1.72;
          color: rgba(240,236,230,0.52);
          max-width: 340px;
        }

        /* ─── PRODUCT — portrait image + text ─── */
        .mb-img-split {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 96px;
          align-items: center;
        }

        .mb-img-wrap {
          position: relative;
          overflow: hidden;
          background: #0d0e10;
        }

        .mb-img-portrait { aspect-ratio: 4 / 5; }

        .mb-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          transition: transform 1000ms ease;
        }

        .mb-img-wrap:hover img { transform: scale(1.025); }

        .mb-img-text {
          padding-left: 8px;
        }

        /* ─── CONTEXT — in-use full bleed ─── */
        .mb-context-band {
          position: relative;
          aspect-ratio: 21 / 9;
          overflow: hidden;
          background: #0d0e10;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .mb-context-band img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          display: block;
        }

        .mb-context-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,9,11,0.52) 0%,
            transparent 55%
          );
        }

        .mb-context-caption {
          position: absolute;
          bottom: 28px;
          right: 40px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.22);
        }

        /* ─── OUTCOME editorial ─── */
        .mb-editorial {
          padding: 136px 72px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .mb-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .mb-pull-quote {
          font-size: clamp(22px, 2.8vw, 38px);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.18;
          color: #f0ece6;
          max-width: 780px;
          margin: 0 0 88px;
          text-transform: uppercase;
        }

        .mb-outcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding-top: 48px;
          border-top: 1px solid rgba(240,236,230,0.06);
        }

        .mb-outcome-col .mb-copy {
          margin-top: 16px;
        }

        /* ─── CTA ─── */
        .mb-cta {
          background: #b8f400;
          padding: 120px 72px;
        }

        .mb-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }

        .mb-cta h2 {
          font-size: clamp(52px, 9vw, 120px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #080808;
          margin: 0;
        }

        .mb-cta-right {
          text-align: right;
        }

        .mb-cta-right p {
          font-size: 15px;
          color: rgba(8,8,8,0.52);
          line-height: 1.65;
          max-width: 220px;
          margin: 0 0 24px auto;
        }

        .mb-cta-btn {
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

        .mb-cta-btn:hover {
          background: rgba(8,8,8,0.07);
          border-color: rgba(8,8,8,0.32);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 980px) {
          .mb-hero      { padding: 96px 28px 72px; }
          .mb-block     { padding: 80px 28px; }
          .mb-editorial { padding: 80px 28px; }
          .mb-cta       { padding: 80px 28px; }

          .mb-hero-image    { aspect-ratio: 4 / 3; }
          .mb-design-band   { aspect-ratio: 4 / 3; }
          .mb-context-band  { aspect-ratio: 4 / 3; }
          .mb-design-overlay { padding: 36px; }

          .mb-text-split { grid-template-columns: 1fr; gap: 36px; }
          .mb-img-split  { grid-template-columns: 1fr; gap: 48px; }
          .mb-img-text   { padding-left: 0; }

          .mb-outcome-grid { grid-template-columns: 1fr; gap: 40px; }

          .mb-cta-inner { grid-template-columns: 1fr; }
          .mb-cta-right { text-align: left; }
          .mb-cta-right p { margin: 0 0 24px; }

          .mb-meta-row { gap: 28px; }
        }
      `}</style>

      <div className="mb-page">

        {/* ─── HERO TEXT ─── */}
        <div className="mb-hero">
          <a href="/work" className="mb-back">← Work</a>

          <p className="mb-eyebrow">Case Study</p>

          <h1 className="mb-title">
            Milo<br />
            Promo<br />
            Ball<span className="mb-accent">.</span>
          </h1>

          <p className="mb-subline">
            Promotional product &nbsp;·&nbsp; Nestlé Milo &nbsp;·&nbsp; Custom manufacture
          </p>

          <div className="mb-meta-row">
            <div className="mb-meta-item">
              <span className="mb-meta-label">Client</span>
              <span className="mb-meta-value">Nestlé Milo</span>
            </div>
            <div className="mb-meta-item">
              <span className="mb-meta-label">Category</span>
              <span className="mb-meta-value">Promotional</span>
            </div>
            <div className="mb-meta-item">
              <span className="mb-meta-label">Type</span>
              <span className="mb-meta-value">Custom Soccer Ball</span>
            </div>
            <div className="mb-meta-item">
              <span className="mb-meta-label">Scope</span>
              <span className="mb-meta-value">Design · Manufacture · Delivery</span>
            </div>
          </div>
        </div>

        {/* ─── HERO IMAGE ─── */}
        <div className="mb-hero-image">
          <img
            src="/milo-ball-in-use.jpg"
            alt="Milo promotional soccer ball in use"
            loading="eager"
            decoding="async"
          />
          <div className="mb-hero-image-overlay" />
          <span className="mb-hero-caption">Nestlé Milo · Promotional Ball</span>
        </div>

        {/* ─── BRIEF ─── */}
        <div className="mb-block">
          <div className="mb-block-inner">
            <div className="mb-text-split">
              <div className="mb-label-col">
                <p className="mb-num">01 — Brief</p>
                <h2 className="mb-section-label">
                  Fun.<br />
                  Durable.<br />
                  Actually used.
                </h2>
              </div>
              <div>
                <p className="mb-copy">
                  Create a promotional product that connected with families and
                  kids, reinforcing Milo's identity as an active, everyday brand.
                  The product needed to be genuinely engaging and durable enough
                  for real play — not destined for the back of a cupboard. A simple
                  brief with an unforgiving standard: it had to be something people
                  actually wanted to take home.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── DESIGN — full bleed ─── */}
        <div className="mb-design-band">
          <img
            src="/milo-ball-design.jpg"
            alt="Milo ball design development"
            loading="lazy"
            decoding="async"
          />
          <div className="mb-design-overlay">
            <div className="mb-design-copy">
              <p className="mb-num">02 — Design</p>
              <h2>
                Scale.<br />
                Colour.<br />
                Durability.
              </h2>
              <p>
                We developed a custom ball shaped by three constraints: brand
                colour accuracy, the right scale for the target age range, and
                materials suited to sustained outdoor play. Each decision
                reinforced the others.
              </p>
            </div>
          </div>
        </div>

        {/* ─── PRODUCT ─── */}
        <div className="mb-block">
          <div className="mb-block-inner">
            <div className="mb-img-split">
              <div className="mb-img-wrap mb-img-portrait">
                <img
                  src="/milo-ball-finished.jpg"
                  alt="Finished Milo promotional ball"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="mb-img-text">
                <p className="mb-num">03 — Product</p>
                <h2 className="mb-section-label" style={{ marginBottom: "28px" }}>
                  Manufactured<br />
                  for the real<br />
                  world.
                </h2>
                <p className="mb-copy">
                  Produced for consistency and durability at scale. The finished
                  ball balanced cost, quality, and brand visibility — delivering
                  full Milo brand livery without compromising on material
                  performance. Designed to be used, not displayed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CONTEXT — in-use wide ─── */}
        <div className="mb-context-band">
          <img
            src="/milo-brand-context.jpg"
            alt="Milo brand context — campaign environment"
            loading="lazy"
            decoding="async"
          />
          <div className="mb-context-overlay" />
          <span className="mb-context-caption">Nestlé Milo · Campaign Context</span>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="mb-editorial">
          <div className="mb-editorial-inner">
            <p className="mb-pull-quote">
              High engagement, strong brand recall,
              and a promotional item that stayed in
              circulation — not in the bin.
            </p>

            <div className="mb-outcome-grid">
              <div className="mb-outcome-col">
                <p className="mb-num">04 — Outcome</p>
                <p className="mb-copy">
                  A promotional product done with the same intent as any other
                  category. Milo brand recognition, practical everyday play,
                  and a piece that earned its place in the household rather
                  than being discarded at the door.
                </p>
              </div>
              <div className="mb-outcome-col">
                <p className="mb-num">Delivery</p>
                <p className="mb-copy">
                  Custom manufacture to Nestlé specification. Colour accuracy,
                  material quality, and production volumes all delivered to
                  brief — on time and ready for in-field campaign activation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="mb-cta">
          <div className="mb-cta-inner">
            <h2>
              Got<br />
              a brief?
            </h2>
            <div className="mb-cta-right">
              <p>Promotional product built to be used, not ignored.</p>
              <a href="/start-a-project" className="mb-cta-btn">
                Start a Project
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
