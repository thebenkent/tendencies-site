import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Tendencies",
  description:
    "New Zealand-based merch, apparel and product sourcing partner. We help brands turn ideas into useful, well-made products.",
};

export default function AboutPage() {
  return (
    <>
      <style>{`
        .ab-page {
          background: #080808;
          color: #f5f5f0;
          font-family: Helvetica, Arial, sans-serif;
        }

        /* ─── OPENING ─── */
        .ab-opening {
          padding: 160px 64px 128px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-opening-inner {
          max-width: 1300px;
          margin: 0 auto;
        }
        .ab-eyebrow {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.26);
          margin-bottom: 52px;
        }
        .ab-headline-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .ab-h1 {
          font-size: clamp(40px, 5.2vw, 76px);
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0;
        }
        .ab-accent { color: #b8f400; }
        .ab-intro {
          font-size: 18px;
          line-height: 1.84;
          color: rgba(255,255,255,0.42);
          max-width: 520px;
          padding-top: 8px;
        }

        /* ─── FEATURE IMAGE ─── */
        .ab-feature {
          position: relative;
          aspect-ratio: 21 / 9;
          overflow: hidden;
          background: #0a0a08;
        }
        .ab-feature img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
          display: block;
        }
        .ab-feature-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,8,8,0.72) 0%,
            rgba(8,8,8,0.08) 38%,
            transparent 65%
          );
          display: flex;
          align-items: flex-end;
          padding: 44px 64px;
        }
        .ab-feature-label {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.24);
        }

        /* ─── WHAT WE DO ─── */
        .ab-what {
          background: #0a0907;
          padding: 128px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-what-inner {
          max-width: 1300px;
          margin: 0 auto;
        }
        .ab-section-label {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.26);
          margin-bottom: 64px;
        }
        .ab-services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .ab-service-card {
          padding: 44px 40px 44px 0;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .ab-service-card:last-child { border-right: none; }
        .ab-service-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.18);
          margin-bottom: 24px;
          display: block;
        }
        .ab-service-title {
          font-size: 19px;
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #f5f5f0;
          line-height: 1.0;
          margin: 0 0 16px;
        }
        .ab-service-desc {
          font-size: 13px;
          line-height: 1.68;
          color: rgba(255,255,255,0.36);
        }

        /* ─── HOW WE WORK ─── */
        .ab-how {
          padding: 128px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-how-inner {
          max-width: 1300px;
          margin: 0 auto;
        }
        .ab-how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-top: 64px;
        }
        .ab-how-col {
          padding: 56px 56px 56px 0;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .ab-how-col:last-child {
          border-right: none;
          padding-left: 56px;
          padding-right: 0;
        }
        .ab-how-col:nth-child(2) { padding-left: 56px; }
        .ab-how-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          color: rgba(255,255,255,0.18);
          margin-bottom: 20px;
          display: block;
        }
        .ab-how-title {
          font-size: clamp(24px, 2.8vw, 36px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0 0 20px;
          line-height: 0.95;
        }
        .ab-how-desc {
          font-size: 14px;
          line-height: 1.76;
          color: rgba(255,255,255,0.40);
          max-width: 320px;
        }

        /* ─── WHY IT WORKS ─── */
        .ab-why {
          background: #0c0b08;
          padding: 128px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-why-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 96px;
          align-items: start;
        }
        .ab-why-headline {
          font-size: clamp(32px, 3.6vw, 54px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f5f5f0;
          line-height: 0.92;
          margin: 0;
        }
        .ab-why-copy {
          font-size: 16px;
          line-height: 1.84;
          color: rgba(255,255,255,0.42);
          margin-bottom: 48px;
        }
        .ab-creds {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 36px;
        }
        .ab-cred-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.20);
          margin-bottom: 6px;
          display: block;
        }
        .ab-cred-value {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.56);
          display: block;
        }

        /* ─── PROOF ─── */
        .ab-proof {
          padding: 128px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-proof-inner {
          max-width: 1300px;
          margin: 0 auto;
        }
        .ab-proof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 64px;
        }
        .ab-case-card {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .ab-case-img {
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #111;
          margin-bottom: 20px;
        }
        .ab-case-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 900ms ease;
          filter: brightness(0.86);
        }
        .ab-case-card:hover .ab-case-img img {
          transform: scale(1.04);
          filter: brightness(0.96);
        }
        .ab-case-eyebrow {
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.24);
          margin-bottom: 8px;
        }
        .ab-case-title {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #f5f5f0;
          line-height: 1.0;
          margin: 0 0 10px;
          transition: color 0.25s;
        }
        .ab-case-card:hover .ab-case-title { color: #b8f400; }
        .ab-case-link {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.26);
          transition: color 0.25s;
        }
        .ab-case-card:hover .ab-case-link { color: rgba(255,255,255,0.50); }

        /* ─── CTA ─── */
        .ab-cta {
          background: #b8f400;
          padding: 120px 64px;
        }
        .ab-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }
        .ab-cta h2 {
          font-size: clamp(48px, 8.5vw, 112px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #080808;
          margin: 0;
        }
        .ab-cta-right { text-align: right; }
        .ab-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 52px;
          padding: 0 32px;
          border-radius: 999px;
          border: 1.5px solid rgba(8,8,8,0.20);
          color: #080808;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          text-decoration: none;
          background: transparent;
          transition: background 0.25s, border-color 0.25s;
        }
        .ab-cta-btn:hover {
          background: rgba(8,8,8,0.08);
          border-color: rgba(8,8,8,0.36);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1000px) {
          .ab-opening        { padding: 100px 28px 80px; }
          .ab-headline-split { grid-template-columns: 1fr; gap: 40px; }

          .ab-feature        { aspect-ratio: 16 / 9; }
          .ab-feature-overlay { padding: 28px; }

          .ab-what           { padding: 80px 28px; }
          .ab-services-grid  { grid-template-columns: 1fr 1fr; }
          .ab-service-card   { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 36px 0; }
          .ab-service-card:last-child { border-bottom: none; }

          .ab-how            { padding: 80px 28px; }
          .ab-how-grid       { grid-template-columns: 1fr; }
          .ab-how-col        { padding: 40px 0; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .ab-how-col:last-child { border-bottom: none; padding-left: 0; }
          .ab-how-col:nth-child(2) { padding-left: 0; }
          .ab-how-desc       { max-width: none; }

          .ab-why            { padding: 80px 28px; }
          .ab-why-inner      { grid-template-columns: 1fr; gap: 48px; }

          .ab-proof          { padding: 80px 28px; }
          .ab-proof-grid     { grid-template-columns: 1fr; gap: 48px; }

          .ab-cta            { padding: 80px 28px; }
          .ab-cta-inner      { grid-template-columns: 1fr; }
          .ab-cta-right      { text-align: left; }
        }

        @media (max-width: 600px) {
          .ab-services-grid  { grid-template-columns: 1fr; }
          .ab-feature        { aspect-ratio: 4 / 3; }
          .ab-creds          { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      <div className="ab-page">

        {/* ─── OPENING ─── */}
        <div className="ab-opening">
          <div className="ab-opening-inner">
            <p className="ab-eyebrow">About Tendencies</p>
            <div className="ab-headline-split">
              <div>
                <h1 className="ab-h1">
                  Big enough<br />
                  to deliver<span className="ab-accent">.</span><br />
                  Small enough<br />
                  to care<span className="ab-accent">.</span>
                </h1>
              </div>
              <div>
                <p className="ab-intro">
                  Tendencies is a New Zealand-based merch, apparel and product
                  sourcing partner. We help brands turn ideas into useful,
                  well-made products — from campaign giveaways and uniforms to
                  custom-built retail activations and premium gifting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FEATURE IMAGE ─── */}
        <div className="ab-feature">
          <img
            src="/streets-keychain-freezer.jpg"
            alt="Streets Ice Cream keychain GWP display at retail freezer"
            loading="lazy"
            decoding="async"
          />
          <div className="ab-feature-overlay">
            <span className="ab-feature-label">
              Streets Ice Cream · Retail Activation · Magnum GWP Keychains
            </span>
          </div>
        </div>

        {/* ─── WHAT WE DO ─── */}
        <div className="ab-what">
          <div className="ab-what-inner">
            <p className="ab-section-label">What We Do</p>
            <div className="ab-services-grid">
              <div className="ab-service-card">
                <span className="ab-service-num">01</span>
                <h3 className="ab-service-title">Branded<br />Merchandise</h3>
                <p className="ab-service-desc">
                  Campaign giveaways, event product, and brand collateral
                  that people actually want to keep.
                </p>
              </div>
              <div className="ab-service-card">
                <span className="ab-service-num">02</span>
                <h3 className="ab-service-title">Apparel &<br />Uniforms</h3>
                <p className="ab-service-desc">
                  Custom-designed workwear, branded apparel, and staff
                  uniforms built to spec and to brand.
                </p>
              </div>
              <div className="ab-service-card">
                <span className="ab-service-num">03</span>
                <h3 className="ab-service-title">Teamwear &<br />Portals</h3>
                <p className="ab-service-desc">
                  Club and corporate teamwear with managed online ordering
                  portals and fulfilment.
                </p>
              </div>
              <div className="ab-service-card">
                <span className="ab-service-num">04</span>
                <h3 className="ab-service-title">Custom Product<br />Development</h3>
                <p className="ab-service-desc">
                  End-to-end custom product — from industrial design and
                  moulding through to finished run.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── HOW WE WORK ─── */}
        <div className="ab-how">
          <div className="ab-how-inner">
            <p className="ab-section-label">How We Work</p>
            <div className="ab-how-grid">
              <div className="ab-how-col">
                <span className="ab-how-num">01</span>
                <h3 className="ab-how-title">Design</h3>
                <p className="ab-how-desc">
                  Shape the idea. Refine the product. Make sure it fits the
                  brand and the audience — before anything goes near a factory.
                </p>
              </div>
              <div className="ab-how-col">
                <span className="ab-how-num">02</span>
                <h3 className="ab-how-title">Source</h3>
                <p className="ab-how-desc">
                  Find the right product, material, factory and production
                  pathway. We navigate the sourcing so you don't have to.
                </p>
              </div>
              <div className="ab-how-col">
                <span className="ab-how-num">03</span>
                <h3 className="ab-how-title">Deliver</h3>
                <p className="ab-how-desc">
                  Manage sampling, production, freight, kitting and final
                  delivery — on time, on brand, and to the right place.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── WHY IT WORKS ─── */}
        <div className="ab-why">
          <div className="ab-why-inner">
            <div>
              <p className="ab-section-label">Why It Works</p>
              <h2 className="ab-why-headline">
                One partner.<br />
                The whole<br />
                process<span className="ab-accent">.</span>
              </h2>
            </div>
            <div>
              <p className="ab-why-copy">
                We sit between creative, sourcing and delivery — so clients
                don't have to manage disconnected suppliers, offshore factories,
                decorators and freight partners themselves. One brief in.
                Finished product out.
              </p>
              <div className="ab-creds">
                <div>
                  <span className="ab-cred-label">Based</span>
                  <span className="ab-cred-value">New Zealand</span>
                </div>
                <div>
                  <span className="ab-cred-label">Sourcing</span>
                  <span className="ab-cred-value">Shenzhen + Global</span>
                </div>
                <div>
                  <span className="ab-cred-label">Delivery</span>
                  <span className="ab-cred-value">Local + International</span>
                </div>
                <div>
                  <span className="ab-cred-label">Clients</span>
                  <span className="ab-cred-value">Brand + Agency</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PROOF IN THE WORK ─── */}
        <div className="ab-proof">
          <div className="ab-proof-inner">
            <p className="ab-section-label">Proof in the Work</p>
            <div className="ab-proof-grid">
              <a href="/work/streets-keychains" className="ab-case-card">
                <div className="ab-case-img">
                  <img
                    src="/work-streets-finished.jpg"
                    alt="Streets Ice Cream resin keychains — Magnum GWP"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="ab-case-eyebrow">Streets / Magnum</p>
                <h3 className="ab-case-title">Resin Keychains</h3>
                <span className="ab-case-link">View case study →</span>
              </a>
              <a href="/work/unilever-vest" className="ab-case-card">
                <div className="ab-case-img">
                  <img
                    src="/work-lynx.jpg"
                    alt="Unilever Lynx promotional vests"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="ab-case-eyebrow">Unilever / Lynx</p>
                <h3 className="ab-case-title">Promotional Vests</h3>
                <span className="ab-case-link">View case study →</span>
              </a>
              <a href="/work/milo-ball" className="ab-case-card">
                <div className="ab-case-img">
                  <img
                    src="/work-milo.jpg"
                    alt="Nestlé Milo branded promotional soccer ball"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="ab-case-eyebrow">Nestlé / Milo</p>
                <h3 className="ab-case-title">Branded Soccer Ball</h3>
                <span className="ab-case-link">View case study →</span>
              </a>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="ab-cta">
          <div className="ab-cta-inner">
            <h2>
              Let's build<br />
              something.
            </h2>
            <div className="ab-cta-right">
              <a href="/start-a-project" className="ab-cta-btn">
                Start a Project
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
