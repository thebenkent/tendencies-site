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
          font-size: clamp(48px, 7.5vw, 108px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.91;
          text-transform: uppercase;
          color: #f0ece6;
          margin: 0 0 40px;
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

        /* ─── HERO IMAGE ─── */
        .sk-hero-image {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #0d0e10;
        }

        .sk-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          display: block;
        }

        .sk-hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,9,11,0.42) 0%,
            transparent 50%
          );
        }

        .sk-hero-caption {
          position: absolute;
          bottom: 28px;
          right: 40px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.22);
        }

        /* ─── CONTENT BLOCKS ─── */
        .sk-block {
          padding: 128px 72px;
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

        .sk-label-col {
          padding-top: 2px;
        }

        .sk-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(240,236,230,0.18);
          margin-bottom: 16px;
        }

        .sk-section-label {
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 900;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          color: #f0ece6;
          line-height: 0.97;
          margin: 0;
        }

        .sk-copy {
          font-size: 17px;
          line-height: 1.88;
          color: rgba(240,236,230,0.44);
          font-weight: 400;
          max-width: 600px;
        }

        /* ─── PROCESS — image + text split ─── */
        .sk-img-split {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 96px;
          align-items: center;
        }

        .sk-img-wrap {
          position: relative;
          overflow: hidden;
          background: #0d0e10;
        }

        .sk-img-portrait { aspect-ratio: 4 / 5; }

        .sk-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
          transition: transform 1000ms ease;
        }

        .sk-img-wrap:hover img { transform: scale(1.025); }

        .sk-img-text {
          padding-left: 8px;
        }

        /* ─── FINISH — full bleed with overlay ─── */
        .sk-finish-band {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #0d0e10;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .sk-finish-band img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 55%;
          display: block;
        }

        .sk-finish-overlay {
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

        .sk-finish-copy {
          max-width: 440px;
        }

        .sk-finish-copy h2 {
          font-size: clamp(26px, 3vw, 44px);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #f0ece6;
          margin: 0 0 18px;
          line-height: 0.93;
        }

        .sk-finish-copy p {
          font-size: 15px;
          line-height: 1.72;
          color: rgba(240,236,230,0.52);
          max-width: 340px;
        }

        /* ─── EDITORIAL / OUTCOME ─── */
        .sk-editorial {
          padding: 136px 72px;
          border-bottom: 1px solid rgba(240,236,230,0.05);
        }

        .sk-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .sk-pull-quote {
          font-size: clamp(22px, 2.8vw, 38px);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.18;
          color: #f0ece6;
          max-width: 760px;
          margin: 0 0 88px;
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

        .sk-cta-right {
          text-align: right;
        }

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
          .sk-hero      { padding: 96px 28px 72px; }
          .sk-block     { padding: 80px 28px; }
          .sk-editorial { padding: 80px 28px; }
          .sk-cta       { padding: 80px 28px; }

          .sk-hero-image  { aspect-ratio: 4 / 3; }
          .sk-finish-band { aspect-ratio: 4 / 3; }
          .sk-finish-overlay { padding: 36px; }

          .sk-text-split { grid-template-columns: 1fr; gap: 36px; }
          .sk-img-split  { grid-template-columns: 1fr; gap: 48px; }
          .sk-img-text   { padding-left: 0; }

          .sk-outcome-grid { grid-template-columns: 1fr; gap: 40px; }

          .sk-cta-inner { grid-template-columns: 1fr; }
          .sk-cta-right { text-align: left; }
          .sk-cta-right p { margin: 0 0 24px; }

          .sk-meta-row { gap: 28px; }
        }
      `}</style>

      <div className="sk-page">

        {/* ─── HERO TEXT ─── */}
        <div className="sk-hero">
          <a href="/work" className="sk-back">← Work</a>

          <p className="sk-eyebrow">Case Study</p>

          <h1 className="sk-title">
            From<br />
            Mould<br />
            to Hand<span className="sk-accent">.</span>
          </h1>

          <p className="sk-subline">
            Custom resin product &nbsp;·&nbsp; Streets Ice Cream &nbsp;·&nbsp; Mould to delivered
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

        {/* ─── HERO IMAGE ─── */}
        <div className="sk-hero-image">
          <img
            src="/work-streets-finished.jpg"
            alt="Streets Ice Cream — finished resin keychains"
            loading="eager"
            decoding="async"
          />
          <div className="sk-hero-image-overlay" />
          <span className="sk-hero-caption">Streets Ice Cream · Resin Keychains</span>
        </div>

        {/* ─── BRIEF ─── */}
        <div className="sk-block">
          <div className="sk-block-inner">
            <div className="sk-text-split">
              <div className="sk-label-col">
                <p className="sk-num">01 — Brief</p>
                <h2 className="sk-section-label">
                  Small format.<br />
                  Big brand.<br />
                  Actually kept.
                </h2>
              </div>
              <div>
                <p className="sk-copy">
                  Streets needed a custom resin keychain range that translated
                  their ice cream brands into small-format branded product
                  people would genuinely hold onto. The challenge was getting
                  forms, colours, and finish precise enough that the final
                  pieces still felt recognisable and clean at keychain scale
                  — not lost in translation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PROCESS ─── */}
        <div className="sk-block">
          <div className="sk-block-inner">
            <div className="sk-img-split">
              <div className="sk-img-wrap sk-img-portrait">
                <img
                  src="/work-streets-prototype.jpg"
                  alt="Streets Ice Cream — resin keychain prototypes, uncoloured cast"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="sk-img-text">
                <p className="sk-num">02 — Process</p>
                <h2 className="sk-section-label" style={{ marginBottom: "28px" }}>
                  Prototype.<br />
                  Refine.<br />
                  Commit.
                </h2>
                <p className="sk-copy">
                  Development started with uncoloured cast prototypes to
                  validate form and scale before committing to colour and
                  finish. Getting the silhouette right at this stage was
                  everything — small adjustments at prototype had large
                  consequences on the finished piece.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FINISH — full bleed ─── */}
        <div className="sk-finish-band">
          <img
            src="/work-streets-finished.jpg"
            alt="Streets Ice Cream — finished resin keychains, brand livery"
            loading="lazy"
            decoding="async"
          />
          <div className="sk-finish-overlay">
            <div className="sk-finish-copy">
              <p className="sk-num">03 — Finish</p>
              <h2>
                Colour.<br />
                Clarity.<br />
                Brand livery.
              </h2>
              <p>
                Final production locked in the colours, resin clarity, and
                branded detailing that made each keychain immediately
                recognisable as Streets. Simple product — executed with care.
              </p>
            </div>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="sk-editorial">
          <div className="sk-editorial-inner">
            <p className="sk-pull-quote">
              A simple piece, executed properly.<br />
              The kind of product people actually keep.
            </p>

            <div className="sk-outcome-grid">
              <div className="sk-outcome-col">
                <p className="sk-num">04 — Outcome</p>
                <p className="sk-copy">
                  From early mould samples through to finished product,
                  the project showed what happens when small-format branded
                  merchandise is treated with the same rigour as any other
                  product category. Recognised. Kept. Used.
                </p>
              </div>
              <div className="sk-outcome-col">
                <p className="sk-num">Delivery</p>
                <p className="sk-copy">
                  Sampling, refinement, and full production run completed
                  to brief. Colour matching and form accuracy were held
                  throughout, with final product delivered to specification
                  and on schedule.
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
              <p>Custom branded product, made to be kept.</p>
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
