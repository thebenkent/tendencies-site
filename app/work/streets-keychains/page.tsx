"use client";

export default function StreetsCaseStudy() {
  return (
    <>
      <style>{`
        .sk-page {
          background: #08090b;
          color: #f0ece6;
          font-family: Helvetica, Arial, sans-serif;
        }

        /* ─── HERO TEXT ─── */
        .sk-hero {
          padding: 136px 72px 96px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .sk-back {
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
        .sk-back:hover { color: rgba(240,236,230,0.6); }

        .sk-eyebrow {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.28);
          margin-bottom: 32px;
        }

        .sk-title {
          font-size: clamp(40px, 6vw, 88px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.93;
          text-transform: uppercase;
          color: #f0ece6;
          margin: 0 0 40px;
          max-width: 820px;
        }

        .sk-accent { color: #b8f400; }

        .sk-subline {
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.28);
          font-weight: 400;
          margin-bottom: 64px;
        }

        .sk-meta-row {
          display: flex;
          gap: 56px;
          flex-wrap: wrap;
          padding-top: 40px;
          border-top: 1px solid rgba(240,236,230,0.06);
        }

        .sk-meta-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sk-meta-label {
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.2);
          font-weight: 400;
        }

        .sk-meta-value {
          font-size: 12px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.6);
          font-weight: 600;
        }

        /* ─── HERO IMAGE — finished product on neutral ─── */
        .sk-hero-image {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #f0ece6;
        }

        .sk-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        .sk-hero-caption {
          position: absolute;
          bottom: 24px;
          right: 32px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(8,9,11,0.32);
        }

        /* ─── SECTION BLOCKS ─── */
        .sk-block {
          padding: 96px 72px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .sk-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .sk-text-split {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }

        .sk-label-col { padding-top: 2px; }

        .sk-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.18);
          margin-bottom: 16px;
        }

        .sk-section-label {
          font-size: clamp(20px, 2.2vw, 30px);
          font-weight: 900;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          color: #f0ece6;
          line-height: 0.97;
          margin: 0;
        }

        .sk-copy {
          font-size: 16px;
          line-height: 1.82;
          color: rgba(240,236,230,0.44);
          font-weight: 400;
          max-width: 600px;
        }

        /* ─── PROCESS STRIP ─── */
        .sk-process-block {
          padding: 96px 72px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
          background: #060708;
        }

        .sk-process-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .sk-process-header {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
          margin-bottom: 64px;
        }

        /* Three-step process row */
        .sk-process-steps {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 3px;
        }

        .sk-step {
          position: relative;
          overflow: hidden;
          background: #0d0e10;
        }

        .sk-step-img {
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #1a1a1a;
          position: relative;
        }

        .sk-step-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          transition: transform 900ms ease;
        }

        .sk-step:hover .sk-step-img img { transform: scale(1.03); }

        .sk-step-label {
          padding: 20px 24px 24px;
          background: #0d0e10;
          border-top: 1px solid rgba(240,236,230,0.06);
        }

        .sk-step-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.3);
          margin-bottom: 6px;
        }

        .sk-step-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.72);
          line-height: 1.2;
        }

        /* ─── IN MARKET — freezer full width ─── */
        .sk-market-block {
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .sk-market-image {
          position: relative;
          aspect-ratio: 16 / 8;
          overflow: hidden;
          background: #0d0e10;
        }

        .sk-market-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        .sk-market-caption-bar {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
          padding: 32px 72px 48px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .sk-market-caption-bar .sk-num {
          padding-top: 2px;
        }

        .sk-market-caption-bar p {
          font-size: 15px;
          line-height: 1.72;
          color: rgba(240,236,230,0.44);
          max-width: 520px;
        }

        /* ─── OUTCOME ─── */
        .sk-editorial {
          padding: 96px 72px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .sk-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .sk-pull-quote {
          font-size: clamp(20px, 2.4vw, 32px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.22;
          color: #f0ece6;
          max-width: 700px;
          margin: 0 0 72px;
          text-transform: uppercase;
        }

        .sk-outcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding-top: 48px;
          border-top: 1px solid rgba(240,236,230,0.06);
        }

        .sk-outcome-col .sk-copy {
          margin-top: 16px;
        }

        /* ─── CTA ─── */
        .sk-cta {
          background: #b8f400;
          padding: 120px 72px;
        }

        .sk-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }

        .sk-cta h2 {
          font-size: clamp(52px, 9vw, 120px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #080808;
          margin: 0;
        }

        .sk-cta-right { text-align: right; }

        .sk-cta-right p {
          font-size: 15px;
          color: rgba(8,8,8,0.52);
          line-height: 1.65;
          max-width: 220px;
          margin: 0 0 24px auto;
        }

        .sk-cta-btn {
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

        .sk-cta-btn:hover {
          background: rgba(8,8,8,0.07);
          border-color: rgba(8,8,8,0.32);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 980px) {
          .sk-hero          { padding: 96px 28px 72px; }
          .sk-block         { padding: 64px 28px; }
          .sk-process-block { padding: 64px 28px; }
          .sk-editorial     { padding: 64px 28px; }
          .sk-cta           { padding: 80px 28px; }

          .sk-hero-image    { aspect-ratio: 4 / 3; }
          .sk-market-image  { aspect-ratio: 4 / 3; }

          .sk-text-split    { grid-template-columns: 1fr; gap: 36px; }
          .sk-process-header { grid-template-columns: 1fr; gap: 36px; margin-bottom: 40px; }
          .sk-process-steps  { grid-template-columns: 1fr; gap: 3px; }
          .sk-step-img       { aspect-ratio: 3 / 2; }

          .sk-market-caption-bar { grid-template-columns: 1fr; gap: 16px; padding: 24px 28px 40px; }

          .sk-outcome-grid  { grid-template-columns: 1fr; gap: 40px; }

          .sk-cta-inner     { grid-template-columns: 1fr; }
          .sk-cta-right     { text-align: left; }
          .sk-cta-right p   { margin: 0 0 24px; }

          .sk-meta-row { gap: 28px; }
        }
      `}</style>

      <div className="sk-page">

        {/* ─── HERO TEXT ─── */}
        <div className="sk-hero">
          <a href="/work" className="sk-back">← Work</a>

          <p className="sk-eyebrow">Case Study</p>

          <h1 className="sk-title">
            Collectible FMCG<br />
            merchandise designed<br />
            for real-world retail<span className="sk-accent">.</span>
          </h1>

          <p className="sk-subline">
            Custom resin product &nbsp;·&nbsp; Streets Ice Cream &nbsp;·&nbsp; Retail activation
          </p>

          <div className="sk-meta-row">
            <div className="sk-meta-item">
              <span className="sk-meta-label">Client</span>
              <span className="sk-meta-value">Streets Ice Cream</span>
            </div>
            <div className="sk-meta-item">
              <span className="sk-meta-label">Category</span>
              <span className="sk-meta-value">Custom Product</span>
            </div>
            <div className="sk-meta-item">
              <span className="sk-meta-label">Type</span>
              <span className="sk-meta-value">Resin Keychains</span>
            </div>
            <div className="sk-meta-item">
              <span className="sk-meta-label">Scope</span>
              <span className="sk-meta-value">Mould Dev · Sampling · Production</span>
            </div>
          </div>
        </div>

        {/* ─── HERO IMAGE — finished product ─── */}
        <div className="sk-hero-image">
          <img
            src="/work-streets-finished.jpg"
            alt="Streets Ice Cream — finished resin keychains"
            loading="eager"
            decoding="async"
          />
          <span className="sk-hero-caption">Streets Ice Cream · Finished Product</span>
        </div>

        {/* ─── THE CHALLENGE ─── */}
        <div className="sk-block">
          <div className="sk-block-inner">
            <div className="sk-text-split">
              <div className="sk-label-col">
                <p className="sk-num">01 — Challenge</p>
                <h2 className="sk-section-label">
                  Instantly<br />
                  recognisable<br />
                  at any scale.
                </h2>
              </div>
              <div>
                <p className="sk-copy">
                  Streets needed a collectible giveaway that turned their
                  most iconic ice cream products into small-format branded
                  merchandise — instantly recognisable, manufacturable at
                  scale, and suited to supermarket and convenience retail
                  rollout. The constraint was demanding: translate a
                  full-size product into keychain form without losing the
                  details that made it recognisable in the first place.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── DEVELOPMENT PROCESS ─── */}
        <div className="sk-process-block">
          <div className="sk-process-inner">
            <div className="sk-process-header">
              <div className="sk-label-col">
                <p className="sk-num">02 — Development</p>
                <h2 className="sk-section-label">
                  Prototype.<br />
                  Refine.<br />
                  Produce.
                </h2>
              </div>
              <div>
                <p className="sk-copy">
                  Development moved through three distinct stages: uncoloured
                  cast prototypes to validate form and proportion; mould
                  refinement to tighten the detail; and final coloured
                  production to confirm the brand livery held at scale.
                  Small adjustments at prototype stage had large consequences
                  on the finished piece — getting it right early was critical.
                </p>
              </div>
            </div>

            <div className="sk-process-steps">
              <div className="sk-step">
                <div className="sk-step-img">
                  <img
                    src="/work-streets-prototype.jpg"
                    alt="Streets keychains — prototype cast"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="sk-step-label">
                  <p className="sk-step-tag">Stage 01</p>
                  <p className="sk-step-title">Prototype Cast</p>
                </div>
              </div>

              <div className="sk-step">
                <div className="sk-step-img">
                  <img
                    src="/work-streets-mold.jpg"
                    alt="Streets keychains — mould development"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="sk-step-label">
                  <p className="sk-step-tag">Stage 02</p>
                  <p className="sk-step-title">Mould Refinement</p>
                </div>
              </div>

              <div className="sk-step">
                <div className="sk-step-img">
                  <img
                    src="/work-streets-finished.jpg"
                    alt="Streets keychains — finished production"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="sk-step-label">
                  <p className="sk-step-tag">Stage 03</p>
                  <p className="sk-step-title">Final Production</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── IN MARKET ─── */}
        <div className="sk-market-block">
          <div className="sk-market-image">
            <img
              src="/streets-keychain-freezer.jpg"
              alt="Streets Ice Cream keychain display — retail freezer activation"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="sk-market-caption-bar">
            <div className="sk-label-col">
              <p className="sk-num">03 — In Market</p>
              <h2 className="sk-section-label" style={{ marginTop: "4px" }}>
                Retail.<br />
                Activated.
              </h2>
            </div>
            <p>
              The finished keychains deployed at point of sale alongside
              the Streets freezer — collectible product attached directly
              to the retail moment. Immediate brand recognition, clear
              product tie-in, and a reason to engage beyond the purchase.
            </p>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="sk-editorial">
          <div className="sk-editorial-inner">
            <p className="sk-pull-quote">
              A simple piece of branded merchandise,
              treated with the same rigour as a product launch.
            </p>

            <div className="sk-outcome-grid">
              <div className="sk-outcome-col">
                <p className="sk-num">04 — Outcome</p>
                <p className="sk-copy">
                  Collectible, recognisable, and ready for retail. The
                  project demonstrated what happens when FMCG giveaway
                  merchandise is approached as a genuine product design
                  challenge — from mould to shelf without compromise.
                </p>
              </div>
              <div className="sk-outcome-col">
                <p className="sk-num">Delivery</p>
                <p className="sk-copy">
                  Prototype development, mould refinement, colour sampling,
                  and full production run delivered to specification.
                  Suitable for supermarket and convenience retail rollout
                  at scale, on time, and on brief.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="sk-cta">
          <div className="sk-cta-inner">
            <h2>
              Got<br />
              a brief?
            </h2>
            <div className="sk-cta-right">
              <p>Custom branded product built for real-world activation.</p>
              <a href="/start-a-project" className="sk-cta-btn">
                Start a Project
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
