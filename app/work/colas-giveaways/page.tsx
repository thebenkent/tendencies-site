"use client";

export default function ColasGiveawaysCaseStudy() {
  return (
    <>
      <style>{`
        .cl-page {
          background: #080808;
          color: #f0ede6;
          font-family: Helvetica, Arial, sans-serif;
        }

        /* ─── HERO — full-bleed image with overlay ─── */
        .cl-hero {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #0c0c0a;
        }

        @media (max-width: 980px) {
          .cl-hero { aspect-ratio: 4 / 3; }
        }

        .cl-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
        }

        .cl-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,8,8,0.96) 0%,
            rgba(8,8,8,0.52) 44%,
            rgba(8,8,8,0.08) 100%
          );
        }

        .cl-hero-back {
          position: absolute;
          top: 32px;
          left: 40px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.4);
          text-decoration: none;
          transition: color 0.2s;
          z-index: 2;
        }
        .cl-hero-back:hover { color: rgba(240,237,230,0.8); }

        .cl-hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 56px 64px;
          z-index: 2;
        }

        .cl-hero-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #b8f400;
          margin-bottom: 20px;
        }

        .cl-hero-title {
          font-size: clamp(48px, 7.5vw, 108px);
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.89;
          text-transform: uppercase;
          color: #f0ede6;
          margin: 0 0 24px;
        }

        .cl-hero-subline {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.4);
          font-weight: 400;
        }

        /* ─── META BAND ─── */
        .cl-meta-band {
          border-bottom: 1px solid rgba(240,237,230,0.06);
        }

        .cl-meta-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 36px 64px;
          display: flex;
          gap: 56px;
          flex-wrap: wrap;
        }

        .cl-meta-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .cl-meta-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.22);
          font-weight: 400;
        }

        .cl-meta-value {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.62);
          font-weight: 600;
        }

        /* ─── BRIEF ─── */
        .cl-brief {
          padding: 112px 64px;
          border-bottom: 1px solid rgba(240,237,230,0.06);
        }

        .cl-brief-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 80px;
          align-items: start;
        }

        .cl-num {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.2);
          margin-bottom: 14px;
        }

        .cl-section-label {
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #f0ede6;
          line-height: 0.96;
          margin: 0;
        }

        .cl-copy {
          font-size: 17px;
          line-height: 1.78;
          color: rgba(240,237,230,0.46);
          font-weight: 400;
          max-width: 580px;
        }

        /* ─── PRODUCT BLOCKS ─── */

        /* Shared product section wrapper */
        .cl-product {
          border-bottom: 1px solid rgba(240,237,230,0.06);
          overflow: hidden;
        }

        /* Product image panel — cream tearsheet */
        .cl-product-panel {
          background: #f2ede4;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          min-height: 480px;
        }

        .cl-product-panel img {
          display: block;
          max-width: 100%;
          max-height: 520px;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        /* Product text panel */
        .cl-product-text {
          padding: 80px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cl-product-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.2);
          margin-bottom: 14px;
        }

        .cl-product-title {
          font-size: clamp(28px, 3.2vw, 46px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f0ede6;
          line-height: 0.93;
          margin: 0 0 28px;
        }

        .cl-product-copy {
          font-size: 16px;
          line-height: 1.76;
          color: rgba(240,237,230,0.44);
          max-width: 380px;
        }

        /* ─── BOTTLE — image left (large), text right ─── */
        .cl-bottle-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
        }

        /* ─── UMBRELLA — text left, image right ─── */
        .cl-umbrella-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
        }

        /* ─── BAG — image left (wide), text right ─── */
        .cl-bag-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ─── PEN — thin horizontal band ─── */
        .cl-pen-band {
          border-bottom: 1px solid rgba(240,237,230,0.06);
          display: grid;
          grid-template-columns: 320px 1fr;
        }

        .cl-pen-panel {
          background: #f2ede4;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 48px;
        }

        .cl-pen-panel img {
          display: block;
          max-height: 280px;
          width: auto;
          object-fit: contain;
        }

        .cl-pen-text {
          padding: 56px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 1px solid rgba(240,237,230,0.06);
        }

        /* ─── CONTEXT — hero image reused, tighter crop ─── */
        .cl-context {
          position: relative;
          aspect-ratio: 16 / 7;
          overflow: hidden;
          background: #0c0c0a;
        }

        .cl-context img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 45% 55%;
          display: block;
        }

        .cl-context-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(8,8,8,0.88) 0%,
            rgba(8,8,8,0.44) 50%,
            transparent 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 72px 80px;
        }

        .cl-context-copy {
          max-width: 440px;
        }

        .cl-context-copy h2 {
          font-size: clamp(26px, 3.2vw, 44px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f0ede6;
          line-height: 0.93;
          margin: 0 0 18px;
        }

        .cl-context-copy p {
          font-size: 15px;
          line-height: 1.68;
          color: rgba(240,237,230,0.52);
          max-width: 320px;
        }

        /* ─── OUTCOME ─── */
        .cl-outcome {
          padding: 120px 64px;
          border-bottom: 1px solid rgba(240,237,230,0.06);
        }

        .cl-outcome-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .cl-pull-quote {
          font-size: clamp(22px, 3vw, 40px);
          font-weight: 900;
          letter-spacing: -0.035em;
          line-height: 1.1;
          text-transform: uppercase;
          color: #f0ede6;
          max-width: 820px;
          margin: 0 0 80px;
        }

        .cl-outcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding-top: 48px;
          border-top: 1px solid rgba(240,237,230,0.07);
        }

        .cl-outcome-col .cl-copy {
          margin-top: 16px;
        }

        /* ─── CTA ─── */
        .cl-cta {
          background: #b8f400;
          padding: 120px 64px;
        }

        .cl-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }

        .cl-cta h2 {
          font-size: clamp(52px, 9vw, 120px);
          font-weight: 900;
          letter-spacing: -0.065em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #080808;
          margin: 0;
        }

        .cl-cta-right { text-align: right; }

        .cl-cta-right p {
          font-size: 15px;
          color: rgba(8,8,8,0.55);
          line-height: 1.65;
          max-width: 220px;
          margin: 0 0 24px auto;
        }

        .cl-cta-btn {
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
        .cl-cta-btn:hover {
          background: rgba(8,8,8,0.08);
          border-color: rgba(8,8,8,0.34);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 980px) {
          .cl-hero-content   { padding: 36px 28px; }
          .cl-hero-back      { top: 20px; left: 20px; }
          .cl-meta-inner     { padding: 28px; gap: 24px; }
          .cl-brief          { padding: 72px 28px; }
          .cl-outcome        { padding: 80px 28px; }
          .cl-cta            { padding: 80px 28px; }

          .cl-brief-inner    { grid-template-columns: 1fr; gap: 36px; }

          .cl-bottle-grid,
          .cl-umbrella-grid,
          .cl-bag-grid       { grid-template-columns: 1fr; }

          /* On mobile: image always comes first */
          .cl-umbrella-grid .cl-product-text { order: 2; }
          .cl-umbrella-grid .cl-product-panel { order: 1; }

          .cl-product-panel  { min-height: 340px; padding: 36px 28px; }
          .cl-product-text   { padding: 48px 28px; }

          .cl-pen-band       { grid-template-columns: 1fr; }
          .cl-pen-panel      { padding: 40px 28px; }
          .cl-pen-text       { padding: 40px 28px; border-left: none; border-top: 1px solid rgba(240,237,230,0.06); }

          .cl-context        { aspect-ratio: 4 / 3; }
          .cl-context-overlay { padding: 32px 28px; }

          .cl-outcome-grid   { grid-template-columns: 1fr; gap: 40px; }

          .cl-cta-inner      { grid-template-columns: 1fr; }
          .cl-cta-right      { text-align: left; }
          .cl-cta-right p    { margin: 0 0 24px; }
        }
      `}</style>

      <div className="cl-page">

        {/* ─── HERO ─── */}
        <div className="cl-hero">
          <img
            src="/colas-hero.png"
            alt="Colas workers at asphalt plant Open Day carrying branded merchandise"
            loading="eager"
            decoding="async"
          />
          <div className="cl-hero-overlay" />

          <a href="/work" className="cl-hero-back">← Work</a>

          <div className="cl-hero-content">
            <p className="cl-hero-eyebrow">Case Study</p>
            <h1 className="cl-hero-title">
              Colas<br />
              Event<br />
              Giveaways.
            </h1>
            <p className="cl-hero-subline">
              Open Day merchandise &nbsp;·&nbsp; Industrial branding &nbsp;·&nbsp; Utility-focused products
            </p>
          </div>
        </div>

        {/* ─── META BAND ─── */}
        <div className="cl-meta-band">
          <div className="cl-meta-inner">
            <div className="cl-meta-item">
              <span className="cl-meta-label">Client</span>
              <span className="cl-meta-value">Colas NZ</span>
            </div>
            <div className="cl-meta-item">
              <span className="cl-meta-label">Category</span>
              <span className="cl-meta-value">Event Merchandise</span>
            </div>
            <div className="cl-meta-item">
              <span className="cl-meta-label">Type</span>
              <span className="cl-meta-value">Branded Giveaways</span>
            </div>
            <div className="cl-meta-item">
              <span className="cl-meta-label">Scope</span>
              <span className="cl-meta-value">Design · Sourcing · Delivery</span>
            </div>
          </div>
        </div>

        {/* ─── BRIEF ─── */}
        <div className="cl-brief">
          <div className="cl-brief-inner">
            <div>
              <p className="cl-num">01 — Brief</p>
              <h2 className="cl-section-label">
                Useful.<br />
                Durable.<br />
                Branded.
              </h2>
            </div>
            <div>
              <p className="cl-copy">
                Develop a coordinated giveaway range for the COLAS Open Day that
                balanced visibility, practicality, and long-term usability within
                an industrial environment. Products needed to earn their place in
                people's hands — not end up in a bin at the gate.
              </p>
            </div>
          </div>
        </div>

        {/* ─── DRINK BOTTLE — image left, text right ─── */}
        <div className="cl-product cl-bottle-grid">
          <div className="cl-product-panel">
            <img
              src="/colas-drink-bottle.jpg"
              alt="Colas branded orange drink bottle"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="cl-product-text">
            <p className="cl-product-label">02 — Drink Bottle</p>
            <h2 className="cl-product-title">
              Built for<br />
              the shift.
            </h2>
            <p className="cl-product-copy">
              An insulated stainless steel bottle in Colas orange. Practical on
              site, useful off it — the kind of product that travels home and
              stays in rotation long after the event.
            </p>
          </div>
        </div>

        {/* ─── UMBRELLA — text left, image right ─── */}
        <div className="cl-product cl-umbrella-grid">
          <div className="cl-product-text">
            <p className="cl-product-label">03 — Umbrella</p>
            <h2 className="cl-product-title">
              Any<br />
              weather.
            </h2>
            <p className="cl-product-copy">
              A full-size branded umbrella that matched the Colas palette without
              needing to announce it. Orange is already the brand — the product
              wore it naturally.
            </p>
          </div>
          <div className="cl-product-panel">
            <img
              src="/colas-umbrella.jpg"
              alt="Colas branded orange umbrella"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* ─── TOTE BAG — image left, text right ─── */}
        <div className="cl-product cl-bag-grid">
          <div className="cl-product-panel">
            <img
              src="/colas-bag.jpg"
              alt="Colas branded jute tote bag"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="cl-product-text">
            <p className="cl-product-label">04 — Tote Bag</p>
            <h2 className="cl-product-title">
              Carry<br />
              everything.
            </h2>
            <p className="cl-product-copy">
              A natural jute tote — earthy contrast to the orange range. Clean
              branding, practical size, and a product people already had a use
              for by the time they left the site.
            </p>
          </div>
        </div>

        {/* ─── PEN — horizontal band ─── */}
        <div className="cl-pen-band">
          <div className="cl-pen-panel">
            <img
              src="/colas-pen.jpg"
              alt="Colas branded orange pen"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="cl-pen-text">
            <p className="cl-product-label">05 — Pen</p>
            <h2 className="cl-product-title" style={{ fontSize: "clamp(22px, 2.4vw, 34px)", marginBottom: "16px" }}>
              The one that stays in the pocket.
            </h2>
            <p className="cl-product-copy">
              A branded pen in Colas orange. Every range needs one. This is the
              product that gets used on day one and is still around six months
              later.
            </p>
          </div>
        </div>

        {/* ─── CONTEXT — hero image reused, tight crop ─── */}
        <div className="cl-context">
          <img
            src="/colas-hero.png"
            alt="Colas Open Day — workers carrying branded merchandise on site"
            loading="lazy"
            decoding="async"
          />
          <div className="cl-context-overlay">
            <div className="cl-context-copy">
              <h2>
                Products<br />
                that stayed.
              </h2>
              <p>
                Practical merchandise designed to remain useful long after the
                Open Day — out of the bag and into everyday use.
              </p>
            </div>
          </div>
        </div>

        {/* ─── OUTCOME ─── */}
        <div className="cl-outcome">
          <div className="cl-outcome-inner">
            <p className="cl-pull-quote">
              Bright colour, useful products,<br />
              clean branding. Merchandise<br />
              people actually kept.
            </p>

            <div className="cl-outcome-grid">
              <div className="cl-outcome-col">
                <p className="cl-num">06 — Outcome</p>
                <p className="cl-copy">
                  The final range delivered a cohesive event merchandise system
                  that felt relevant to the environment and practical for ongoing
                  use. Bright colour application, useful product selection, and
                  clean branding helped create merchandise people actually kept.
                </p>
              </div>
              <div className="cl-outcome-col">
                <p className="cl-num">Range</p>
                <p className="cl-copy">
                  Drink bottle · Umbrella · Tote bag · Pen. Four products,
                  one colour system, one clear brand identity. A coordinated
                  range that worked together without feeling forced.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="cl-cta">
          <div className="cl-cta-inner">
            <h2>
              Got<br />
              a brief?
            </h2>
            <div className="cl-cta-right">
              <p>Event merchandise, branded product, and corporate gifting.</p>
              <a href="/start-a-project" className="cl-cta-btn">
                Start a Project
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
