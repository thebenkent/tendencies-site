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

        /* ─── HERO ─── */
        .ab-hero {
          position: relative;
          aspect-ratio: 16 / 8;
          overflow: hidden;
          background: #0e0d0a;
        }
        .ab-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 45%;
          display: block;
          filter: saturate(0.80) brightness(0.90);
        }
        .ab-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to right,
              rgba(8,8,8,0.88) 0%,
              rgba(8,8,8,0.52) 36%,
              rgba(8,8,8,0.14) 62%,
              rgba(8,8,8,0.06) 100%
            ),
            linear-gradient(
              to top,
              rgba(8,8,8,0.44) 0%,
              transparent 45%
            );
        }
        .ab-hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 64px;
          max-width: 720px;
          z-index: 2;
        }
        .ab-hero-eyebrow {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(245,245,240,0.40);
          margin-bottom: 28px;
        }
        .ab-hero-h1 {
          font-size: clamp(44px, 5.8vw, 88px);
          font-weight: 900;
          letter-spacing: -0.048em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0 0 28px;
        }
        .ab-accent { color: #b8f400; }
        .ab-hero-intro {
          font-size: 15px;
          line-height: 1.78;
          color: rgba(245,245,240,0.46);
          max-width: 460px;
          margin-bottom: 40px;
        }
        .ab-hero-ctas {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ab-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          padding: 0 28px;
          border-radius: 999px;
          background: #b8f400;
          color: #080808;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .ab-btn-primary:hover { opacity: 0.88; }
        .ab-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          padding: 0 28px;
          border-radius: 999px;
          border: 1px solid rgba(245,245,240,0.20);
          color: rgba(245,245,240,0.68);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .ab-btn-ghost:hover {
          border-color: rgba(245,245,240,0.40);
          color: #f5f5f0;
        }

        /* ─── SHARED UTILITY ─── */
        .ab-section-eyebrow {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.24);
          margin-bottom: 56px;
        }

        /* ─── WHO WE ARE ─── */
        .ab-who {
          padding: 144px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-who-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 96px;
          align-items: start;
        }
        .ab-who-headline {
          font-size: clamp(36px, 4vw, 60px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f5f5f0;
          line-height: 0.9;
          margin: 0;
        }
        .ab-who-copy {
          font-size: 16px;
          line-height: 1.86;
          color: rgba(255,255,255,0.40);
          max-width: 520px;
          margin: 0 0 48px;
        }
        .ab-who-facts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px 40px;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 36px;
        }
        .ab-fact-label {
          font-size: 10px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          margin-bottom: 5px;
          display: block;
        }
        .ab-fact-value {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.52);
          display: block;
        }

        /* ─── WHAT WE DO ─── */
        .ab-what {
          background: #0a0907;
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ab-what-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 128px 64px 0;
        }
        .ab-services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .ab-service-card {
          padding: 48px 40px 48px 0;
          border-right: 1px solid rgba(255,255,255,0.05);
          transition: opacity 0.3s;
        }
        .ab-service-card:last-child { border-right: none; }
        .ab-service-card:hover { opacity: 0.66; }
        .ab-service-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.16);
          margin-bottom: 24px;
          display: block;
        }
        .ab-service-title {
          font-size: 18px;
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
          color: rgba(255,255,255,0.32);
        }

        /* ─── CUSTOM PRODUCT SPLIT — full bleed inside ab-what ─── */
        .ab-custom-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: 64px;
        }
        .ab-custom-image {
          position: relative;
          overflow: hidden;
          background: #0c0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 64px;
          min-height: 480px;
        }
        .ab-custom-image img {
          display: block;
          width: 100%;
          max-width: 400px;
          height: auto;
          object-fit: contain;
          position: relative;
          z-index: 1;
        }
        .ab-custom-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 38%, rgba(12,10,15,0.80) 100%);
          pointer-events: none;
          z-index: 2;
        }
        .ab-custom-text {
          background: #111009;
          padding: 80px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ab-custom-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.16);
          margin-bottom: 20px;
          display: block;
        }
        .ab-custom-title {
          font-size: clamp(28px, 3vw, 44px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f5f5f0;
          line-height: 0.92;
          margin: 0 0 32px;
        }
        .ab-custom-copy {
          font-size: 15px;
          line-height: 1.82;
          color: rgba(255,255,255,0.38);
          max-width: 440px;
        }

        /* ─── DESIGN / SOURCE / DELIVER ─── */
        .ab-process {
          padding: 128px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-process-inner {
          max-width: 1300px;
          margin: 0 auto;
        }
        .ab-process-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-top: 56px;
        }
        .ab-process-col {
          padding: 56px 56px 56px 0;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .ab-process-col:last-child {
          border-right: none;
          padding-left: 56px;
          padding-right: 0;
        }
        .ab-process-col:nth-child(2) { padding-left: 56px; }
        .ab-process-num {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.28em;
          color: rgba(255,255,255,0.16);
          margin-bottom: 20px;
          display: block;
        }
        .ab-process-title {
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f5f5f0;
          line-height: 0.92;
          margin: 0 0 20px;
        }
        .ab-process-desc {
          font-size: 14px;
          line-height: 1.76;
          color: rgba(255,255,255,0.36);
          max-width: 280px;
        }

        /* ─── WHY CLIENTS WORK WITH US ─── */
        .ab-why {
          background: #0c0b08;
          padding: 128px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-why-inner {
          max-width: 1300px;
          margin: 0 auto;
        }
        .ab-why-statement {
          font-size: clamp(22px, 2.8vw, 38px);
          font-weight: 300;
          letter-spacing: -0.02em;
          line-height: 1.34;
          color: rgba(245,245,240,0.84);
          max-width: 880px;
          margin: 0 0 88px;
          font-style: italic;
        }
        .ab-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 56px;
        }
        .ab-why-point {
          padding-right: 56px;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .ab-why-point:last-child {
          border-right: none;
          padding-left: 56px;
          padding-right: 0;
        }
        .ab-why-point:nth-child(2) { padding-left: 56px; }
        .ab-why-point-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          margin-bottom: 12px;
          display: block;
        }
        .ab-why-point-copy {
          font-size: 14px;
          line-height: 1.74;
          color: rgba(255,255,255,0.36);
        }

        /* ─── FEATURED WORK ─── */
        .ab-work {
          padding-top: 128px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ab-work-header {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 64px 56px;
        }
        .ab-work-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .ab-work-card {
          display: block;
          text-decoration: none;
          color: inherit;
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          background: #0d0c0b;
        }
        .ab-work-card-img {
          position: absolute;
          inset: 0;
        }
        .ab-work-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          filter: brightness(0.82) saturate(0.90);
          transition: transform 1100ms ease, filter 800ms ease;
        }
        .ab-work-card:hover .ab-work-card-img img {
          transform: scale(1.06);
          filter: brightness(0.96) saturate(1.0);
        }
        .ab-work-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,8,8,0.90) 0%,
            rgba(8,8,8,0.28) 44%,
            transparent 72%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px 36px;
        }
        .ab-work-card-eyebrow {
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-bottom: 10px;
          transition: color 0.3s;
        }
        .ab-work-card:hover .ab-work-card-eyebrow { color: rgba(255,255,255,0.60); }
        .ab-work-card-title {
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #f5f5f0;
          line-height: 0.95;
          margin: 0 0 18px;
          transition: color 0.3s;
        }
        .ab-work-card:hover .ab-work-card-title { color: #b8f400; }
        .ab-work-card-link {
          font-size: 10px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s, gap 0.3s;
        }
        .ab-work-card:hover .ab-work-card-link {
          color: rgba(255,255,255,0.62);
          gap: 14px;
        }

        /* ─── CTA ─── */
        .ab-cta {
          padding: 140px 64px;
        }
        .ab-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 64px;
          align-items: end;
        }
        .ab-cta h2 {
          font-size: clamp(52px, 9vw, 120px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.84;
          text-transform: uppercase;
          color: #f5f5f0;
          margin: 0;
        }
        .ab-cta-right { text-align: right; }
        .ab-cta-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.26);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0 0 24px;
        }
        .ab-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 52px;
          padding: 0 32px;
          border-radius: 999px;
          background: #b8f400;
          color: #080808;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .ab-cta-btn:hover { opacity: 0.88; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1000px) {
          .ab-hero               { aspect-ratio: 4 / 3; }
          .ab-hero-content       { justify-content: flex-end; padding: 40px 28px; max-width: 100%; }

          .ab-who                { padding: 80px 28px; }
          .ab-who-inner          { grid-template-columns: 1fr; gap: 48px; }
          .ab-who-copy           { max-width: none; }
          .ab-section-eyebrow    { margin-bottom: 32px; }

          .ab-what-inner         { padding: 80px 28px 0; }
          .ab-services-grid      { grid-template-columns: 1fr 1fr; }
          .ab-service-card       {
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding: 36px 0;
          }
          .ab-service-card:last-child { border-bottom: none; }

          .ab-custom-split       { grid-template-columns: 1fr; }
          .ab-custom-image       { min-height: 300px; padding: 56px 28px; }
          .ab-custom-image img   { max-width: 280px; }
          .ab-custom-text        { padding: 56px 28px; }
          .ab-custom-copy        { max-width: none; }

          .ab-process            { padding: 80px 28px; }
          .ab-process-grid       { grid-template-columns: 1fr; }
          .ab-process-col        {
            padding: 40px 0;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .ab-process-col:last-child { border-bottom: none; padding-left: 0; }
          .ab-process-col:nth-child(2) { padding-left: 0; }
          .ab-process-desc       { max-width: none; }

          .ab-why                { padding: 80px 28px; }
          .ab-why-grid           { grid-template-columns: 1fr; padding-top: 40px; gap: 36px; }
          .ab-why-point          {
            padding-right: 0;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 36px;
          }
          .ab-why-point:last-child { border-bottom: none; padding-left: 0; padding-bottom: 0; }
          .ab-why-point:nth-child(2) { padding-left: 0; }

          .ab-work               { padding-top: 80px; }
          .ab-work-header        { padding: 0 28px 40px; }
          .ab-work-grid          { grid-template-columns: 1fr; gap: 2px; }
          .ab-work-card          { aspect-ratio: 3 / 2; }
          .ab-work-card-overlay  { padding: 28px 24px; }

          .ab-cta                { padding: 96px 28px; }
          .ab-cta-inner          { grid-template-columns: 1fr; gap: 40px; }
          .ab-cta-right          { text-align: left; }
        }

        @media (max-width: 600px) {
          .ab-who-facts          { grid-template-columns: 1fr; gap: 20px; }
          .ab-services-grid      { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ab-page">

        {/* ─── HERO ─── */}
        <div className="ab-hero">
          <img
            src="/parrotdog-shelf.jpg"
            alt="Parrotdog branded merchandise and apparel displayed on retail shelving"
            loading="eager"
            decoding="async"
          />
          <div className="ab-hero-overlay" />
          <div className="ab-hero-content">
            <p className="ab-hero-eyebrow">About Tendencies</p>
            <h1 className="ab-hero-h1">
              Big enough<br />
              to deliver<span className="ab-accent">.</span><br />
              Small enough<br />
              to care<span className="ab-accent">.</span>
            </h1>
            <p className="ab-hero-intro">
              Tendencies is a New Zealand-based merch, apparel and product
              sourcing partner. We help brands turn ideas into useful, well-made
              products — from uniforms and retail campaigns through to fully
              custom product development.
            </p>
            <div className="ab-hero-ctas">
              <a href="/start-a-project" className="ab-btn-primary">
                Start a Project
              </a>
              <a href="/work" className="ab-btn-ghost">
                View Work
              </a>
            </div>
          </div>
        </div>

        {/* ─── WHO WE ARE ─── */}
        <div className="ab-who">
          <div className="ab-who-inner">
            <div>
              <h2 className="ab-who-headline">
                Design-led<span className="ab-accent">.</span><br />
                Supply-chain<br />
                smart<span className="ab-accent">.</span>
              </h2>
            </div>
            <div>
              <p className="ab-section-eyebrow">Who We Are</p>
              <p className="ab-who-copy">
                We're a small team with direct factory relationships and
                sourcing capability out of Shenzhen. We sit between creative,
                sourcing and logistics — bridging the gap between what a brand
                imagines and what gets built, shipped, and delivered on time.
              </p>
              <div className="ab-who-facts">
                <div>
                  <span className="ab-fact-label">Based</span>
                  <span className="ab-fact-value">New Zealand</span>
                </div>
                <div>
                  <span className="ab-fact-label">Sourcing</span>
                  <span className="ab-fact-value">Shenzhen + Global</span>
                </div>
                <div>
                  <span className="ab-fact-label">Delivery</span>
                  <span className="ab-fact-value">Local + International</span>
                </div>
                <div>
                  <span className="ab-fact-label">Clients</span>
                  <span className="ab-fact-value">Brand + Agency</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── WHAT WE DO ─── */}
        <div className="ab-what">
          <div className="ab-what-inner">
            <p className="ab-section-eyebrow">What We Do</p>
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
                  End-to-end custom product — industrial design, moulding,
                  sampling and finished production run.
                </p>
              </div>
            </div>
          </div>

          {/* Custom Product feature — full bleed inside What We Do */}
          <div className="ab-custom-split">
            <div className="ab-custom-image">
              <img
                src="/parrotdog-cooler01.jpg"
                alt="Parrotdog branded cooler — custom product development"
                loading="lazy"
                decoding="async"
              />
              <div className="ab-custom-vignette" />
            </div>
            <div className="ab-custom-text">
              <span className="ab-custom-num">04 — Custom Product</span>
              <h3 className="ab-custom-title">
                Designed from<br />
                scratch<span className="ab-accent">.</span>
              </h3>
              <p className="ab-custom-copy">
                When off-the-shelf isn't enough, we build it from the ground up.
                From initial concept and industrial design through moulding,
                sampling and approved production run — with full factory
                oversight and quality control at every stage.
              </p>
            </div>
          </div>
        </div>

        {/* ─── DESIGN / SOURCE / DELIVER ─── */}
        <div className="ab-process">
          <div className="ab-process-inner">
            <p className="ab-section-eyebrow">How We Work</p>
            <div className="ab-process-grid">
              <div className="ab-process-col">
                <span className="ab-process-num">01</span>
                <h3 className="ab-process-title">Design</h3>
                <p className="ab-process-desc">
                  Concept, product refinement, branding and usability —
                  shaping the idea before anything goes near a factory.
                </p>
              </div>
              <div className="ab-process-col">
                <span className="ab-process-num">02</span>
                <h3 className="ab-process-title">Source</h3>
                <p className="ab-process-desc">
                  Materials, factories, production planning and approvals.
                  We navigate the sourcing so you don't have to.
                </p>
              </div>
              <div className="ab-process-col">
                <span className="ab-process-num">03</span>
                <h3 className="ab-process-title">Deliver</h3>
                <p className="ab-process-desc">
                  Freight, kitting, campaign rollout and fulfilment —
                  on time, on brand, to the right place.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── WHY CLIENTS WORK WITH US ─── */}
        <div className="ab-why">
          <div className="ab-why-inner">
            <p className="ab-why-statement">
              We sit between creative, sourcing and delivery — so clients
              don't have to manage disconnected suppliers, offshore factories,
              decorators and logistics partners themselves.
            </p>
            <div className="ab-why-grid">
              <div className="ab-why-point">
                <span className="ab-why-point-label">Premium Execution</span>
                <p className="ab-why-point-copy">
                  Products built to brand standards — not just functional,
                  but well-made enough to reflect where they come from.
                </p>
              </div>
              <div className="ab-why-point">
                <span className="ab-why-point-label">Practical Outcomes</span>
                <p className="ab-why-point-copy">
                  We focus on what gets used, kept, and worn — not what
                  looks good in a pitch deck and ends up in a cupboard.
                </p>
              </div>
              <div className="ab-why-point">
                <span className="ab-why-point-label">Operational Reliability</span>
                <p className="ab-why-point-copy">
                  Long-term supplier relationships, real lead times, and
                  honest communication from brief to delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FEATURED WORK ─── */}
        <div className="ab-work">
          <div className="ab-work-header">
            <p className="ab-section-eyebrow">Featured Work</p>
          </div>
          <div className="ab-work-grid">
            <a href="/work/streets-keychains" className="ab-work-card">
              <div className="ab-work-card-img">
                <img
                  src="/work-streets-finished.jpg"
                  alt="Streets Ice Cream resin keychains — Magnum GWP"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="ab-work-card-overlay">
                <p className="ab-work-card-eyebrow">Streets / Magnum</p>
                <h3 className="ab-work-card-title">Resin<br />Keychains</h3>
                <span className="ab-work-card-link">View case study →</span>
              </div>
            </a>
            <a href="/work/unilever-vest" className="ab-work-card">
              <div className="ab-work-card-img">
                <img
                  src="/work-lynx.jpg"
                  alt="Unilever Lynx promotional vests"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="ab-work-card-overlay">
                <p className="ab-work-card-eyebrow">Unilever / Lynx</p>
                <h3 className="ab-work-card-title">Promotional<br />Vests</h3>
                <span className="ab-work-card-link">View case study →</span>
              </div>
            </a>
            <a href="/work/milo-ball" className="ab-work-card">
              <div className="ab-work-card-img">
                <img
                  src="/milo-soccer-ball.png"
                  alt="Nestlé Milo branded promotional soccer ball"
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: "center 35%" }}
                />
              </div>
              <div className="ab-work-card-overlay">
                <p className="ab-work-card-eyebrow">Nestlé / Milo</p>
                <h3 className="ab-work-card-title">Branded<br />Soccer Ball</h3>
                <span className="ab-work-card-link">View case study →</span>
              </div>
            </a>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="ab-cta">
          <div className="ab-cta-inner">
            <h2>
              Let's build<br />
              something<span className="ab-accent">.</span>
            </h2>
            <div className="ab-cta-right">
              <p className="ab-cta-sub">Useful. On-brand. Made properly.</p>
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
