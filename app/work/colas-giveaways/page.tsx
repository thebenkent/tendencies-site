"use client";

export default function ColasGiveawaysCaseStudy() {
  return (
    <>
      <style>{`
        .co-page {
          background: #080808;
          color: #f5f5f0;
          font-family: Helvetica, Arial, sans-serif;
        }

        /* ─── HERO ─── */
        .co-hero {
          padding: 120px 64px 96px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .co-back {
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
        .co-back:hover { color: #b8f400; }

        .co-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #b8f400;
          margin-bottom: 24px;
        }

        .co-title {
          font-size: clamp(56px, 8.5vw, 120px);
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0 0 56px;
        }

        .co-accent { color: #b8f400; }

        .co-meta-row {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .co-meta-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .co-meta-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }

        .co-meta-value {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
        }

        /* ─── FULL-BLEED HERO IMAGE ─── */
        .co-hero-image {
          position: relative;
          aspect-ratio: 16 / 8;
          overflow: hidden;
          background: #111;
        }

        .co-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .co-hero-caption {
          position: absolute;
          bottom: 24px;
          right: 32px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        /* ─── CONTENT BLOCKS ─── */
        .co-block {
          padding: 112px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .co-block-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .co-num {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-bottom: 10px;
        }

        .co-section-label {
          font-size: clamp(26px, 2.8vw, 38px);
          font-weight: 900;
          letter-spacing: -0.035em;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0 0 24px;
          line-height: 0.95;
        }

        .co-copy {
          font-size: 16px;
          line-height: 1.72;
          color: rgba(255,255,255,0.5);
          max-width: 540px;
        }

        /* ─── SPLIT LAYOUT ─── */
        .co-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }

        /* ─── STAT ROW ─── */
        .co-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-top: 72px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .co-stat {
          padding: 40px 0;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .co-stat:last-child { border-right: none; }

        .co-stat-num {
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #b8f400;
          line-height: 1;
          margin-bottom: 8px;
        }

        .co-stat-label {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.36);
        }

        /* ─── EDITORIAL OUTCOME ─── */
        .co-editorial {
          padding: 120px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .co-editorial-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .co-pull-quote {
          font-size: clamp(24px, 3.2vw, 44px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.12;
          color: #f5f5f0;
          max-width: 860px;
          margin: 0 0 72px;
        }

        .co-outcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding-top: 48px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .co-outcome-col .co-copy {
          margin-top: 14px;
        }

        /* ─── CTA BAND ─── */
        .co-cta {
          background: #b8f400;
          padding: 120px 64px;
        }

        .co-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }

        .co-cta h2 {
          font-size: clamp(56px, 9vw, 128px);
          font-weight: 900;
          letter-spacing: -0.065em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #080808;
          margin: 0;
        }

        .co-cta-right {
          text-align: right;
        }

        .co-cta-right p {
          font-size: 15px;
          color: rgba(8,8,8,0.58);
          line-height: 1.6;
          max-width: 220px;
          margin: 0 0 24px auto;
        }

        .co-cta-btn {
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

        .co-cta-btn:hover {
          background: rgba(8,8,8,0.08);
          border-color: rgba(8,8,8,0.38);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 980px) {
          .co-hero      { padding: 96px 28px 72px; }
          .co-block     { padding: 72px 28px; }
          .co-editorial { padding: 72px 28px; }
          .co-cta       { padding: 80px 28px; }

          .co-hero-image { aspect-ratio: 4 / 3; }

          .co-split { grid-template-columns: 1fr; gap: 40px; }

          .co-stats { grid-template-columns: 1fr; }
          .co-stat  { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 32px 0; }
          .co-stat:last-child { border-bottom: none; }

          .co-outcome-grid { grid-template-columns: 1fr; gap: 36px; }

          .co-cta-inner { grid-template-columns: 1fr; }
          .co-cta-right { text-align: left; }
          .co-cta-right p { margin: 0 0 24px; }
        }
      `}</style>

      <div className="co-page">

        {/* ─── HERO ─── */}
        <div className="co-hero">
          <a href="/work" className="co-back">← Work</a>

          <p className="co-eyebrow">Case Study</p>

          <h1 className="co-title">
            Colas<br />
            Event Giveaways<span className="co-accent">.</span>
          </h1>

          <div className="co-meta-row">
            <div className="co-meta-item">
              <span className="co-meta-label">Client</span>
              <span className="co-meta-value">Colas</span>
            </div>
            <div className="co-meta-item">
              <span className="co-meta-label">Category</span>
              <span className="co-meta-value">Merchandise</span>
            </div>
            <div className="co-meta-item">
              <span className="co-meta-label">Type</span>
              <span className="co-meta-value">Event Giveaways</span>
            </div>
            <div className="co-meta-item">
              <span className="co-meta-label">Scope</span>
              <span className="co-meta-value">Design · Sourcing · Delivery</span>
            </div>
          </div>
        </div>

        {/* ─── HERO IMAGE ─── */}
        <div className="co-hero-image">
          <img
            src="/work-colas.jpg"
            alt="Colas Open Day event giveaway range"
            loading="eager"
            decoding="async"
          />
          <span className="co-hero-caption">Colas Open Day · Event Merchandise</span>
        </div>

        {/* ─── BRIEF ─── */}
        <div className="co-block">
          <div className="co-block-inner">
            <div className="co-split">
              <div>
                <p className="co-num">01 — Brief</p>
                <h2 className="co-section-label">
                  Bright.<br />
                  Useful.<br />
                  Brand-aligned.
                </h2>
              </div>
              <div>
                <p className="co-copy">
                  Premium event giveaways for the Colas Open Day. The products
                  needed to work as event giveaways while still feeling practical
                  enough to keep and use after the day — not thrown in a bag and
                  forgotten.
                </p>

                <div className="co-stats">
                  <div className="co-stat">
                    <div className="co-stat-num">01</div>
                    <div className="co-stat-label">Open Day Event</div>
                  </div>
                  <div className="co-stat">
                    <div className="co-stat-num">Multi</div>
                    <div className="co-stat-label">Product Range</div>
                  </div>
                  <div className="co-stat">
                    <div className="co-stat-num">100%</div>
                    <div className="co-stat-label">Brand-aligned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── APPROACH ─── */}
        <div className="co-block">
          <div className="co-block-inner">
            <div className="co-split">
              <div>
                <p className="co-num">02 — Approach</p>
                <h2 className="co-section-label">
                  Coordinated.<br />
                  Considered.
                </h2>
              </div>
              <div>
                <p className="co-copy">
                  This project was about creating a coordinated giveaway range
                  that felt cohesive across every product. Colour, branding
                  placement, and product selection were all chosen to reinforce
                  the Colas identity without feeling like a branded dump — every
                  item had a reason to be there.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="co-editorial">
          <div className="co-editorial-inner">
            <p className="co-pull-quote">
              A giveaway range that felt coordinated, useful, and worth keeping.
              Not shelf filler — product people actually wanted to take home.
            </p>

            <div className="co-outcome-grid">
              <div className="co-outcome-col">
                <p className="co-num">03 — Outcome</p>
                <p className="co-copy">
                  A cohesive merchandise range delivered on time for the Colas
                  Open Day. Each product carried the brand clearly without
                  feeling cluttered — practical items with staying power beyond
                  the event.
                </p>
              </div>
              <div className="co-outcome-col">
                <p className="co-num">Product</p>
                <p className="co-copy">
                  Sourced and decorated to brand specifications. Quality
                  materials selected to ensure the range felt premium at
                  event level — not disposable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="co-cta">
          <div className="co-cta-inner">
            <h2>
              Got<br />
              a brief?
            </h2>
            <div className="co-cta-right">
              <p>Ready to build something that actually gets used?</p>
              <a href="/start-a-project" className="co-cta-btn">
                Start a Project
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
