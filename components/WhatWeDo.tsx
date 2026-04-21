"use client";

export default function WhatWeDo() {
  return (
    <>
      <style>{`
        .wwd-section {
          background: #080808;
          color: #fff;
        }

        /* ---------- HERO ---------- */
        .wwd-hero {
          padding: 105px 48px 112px;
          border-bottom: 1px solid #141414;
        }

        .wwd-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .wwd-meta-row {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          font-size: 12px;
          color: #8a8a8a;
          margin-bottom: 40px;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          line-height: 1.8;
          flex-wrap: wrap;
        }

        .wwd-meta-row > div:last-child {
          text-align: right;
        }

        .wwd-eyebrow {
          color: #b8f400;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin: 0 0 20px;
        }

        .wwd-h1 {
          font-size: clamp(72px, 11vw, 152px);
          line-height: 0.86;
          letter-spacing: -0.045em;
          margin: 0;
          font-weight: 900;
          text-transform: uppercase;
        }

        .wwd-dot {
          color: #b8f400;
          margin-left: 4px;
        }

        .wwd-hero-footer {
          margin-top: 48px;
          padding-top: 28px;
          border-top: 1px solid #171717;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 32px;
          flex-wrap: wrap;
        }

        .wwd-hero-lede {
          max-width: 480px;
          margin: 0;
          font-size: 17px;
          line-height: 1.55;
          color: #9a9a9a;
        }

        .wwd-hero-lede strong {
          color: #fff;
          font-weight: 600;
        }

        /* ---------- SHARED CTAs ---------- */
        .wwd-cta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .wwd-cta-primary,
        .wwd-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 14px 26px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: opacity 200ms ease, border-color 200ms ease, color 200ms ease, background 200ms ease;
        }

        .wwd-cta-primary {
          background: #b8f400;
          color: #000;
          border-color: #b8f400;
        }

        .wwd-cta-primary:hover {
          opacity: 0.86;
        }

        .wwd-cta-secondary {
          color: #fff;
          border-color: rgba(255,255,255,0.35);
        }

        .wwd-cta-secondary:hover {
          border-color: #b8f400;
          color: #b8f400;
        }

        /* ---------- CAPABILITY BLOCK ---------- */
        .wwd-block {
          padding: 112px 48px;
          border-bottom: 1px solid #141414;
        }

        .wwd-block-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 72px;
          align-items: center;
        }

        .wwd-block-inner.reverse {
          grid-template-columns: 1.2fr 1fr;
        }

        .wwd-block-inner.reverse .wwd-block-image {
          order: -1;
        }

        .wwd-numeral {
          font-size: clamp(96px, 14vw, 184px);
          line-height: 0.85;
          letter-spacing: -0.055em;
          font-weight: 900;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 20px;
        }

        .wwd-block-title {
          font-size: clamp(36px, 4.6vw, 56px);
          line-height: 0.95;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          font-weight: 900;
          margin: 0 0 24px;
          color: #fff;
        }

        .wwd-block-copy {
          font-size: 16px;
          line-height: 1.6;
          color: #9a9a9a;
          max-width: 460px;
          margin: 0 0 28px;
        }

        .wwd-block-copy strong {
          color: #fff;
          font-weight: 600;
        }

        .wwd-block-list {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
        }

        .wwd-block-list li {
          padding: 14px 0;
          border-top: 1px solid #1c1c1c;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #d4d4d4;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .wwd-block-list li::before {
          content: "";
          width: 6px;
          height: 6px;
          background: #b8f400;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .wwd-block-image {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 0;
          background: #111;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .wwd-block-image img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 700ms cubic-bezier(.2,.7,.2,1);
        }

        .wwd-block-image:hover img {
          transform: scale(1.03);
        }

        /* ---------- CASE DIPTYCH ---------- */
        .wwd-case {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          align-items: stretch;
        }

        .wwd-case-frame {
          position: relative;
          margin: 0;
          aspect-ratio: 5 / 4;
          overflow: hidden;
          border-radius: 0;
          background: #111;
          border: 1px solid rgba(255,255,255,0.06);
          isolation: isolate;
        }

        .wwd-case-frame img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 700ms cubic-bezier(.2,.7,.2,1);
        }

        .wwd-case-frame:hover img {
          transform: scale(1.035);
        }

        .wwd-case-label {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 0;
          background: rgba(8,8,8,0.78);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          line-height: 1;
        }

        .wwd-case-label::before {
          content: "";
          width: 6px;
          height: 6px;
          background: #b8f400;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .wwd-case-label.is-finished {
          background: #b8f400;
          color: #080808;
        }

        .wwd-case-label.is-finished::before {
          background: #080808;
        }

        .wwd-case-caption {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding-top: 14px;
          border-top: 1px solid #1c1c1c;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #9a9a9a;
          margin: 4px 0 0;
          flex-wrap: wrap;
        }

        .wwd-case-caption strong {
          color: #fff;
          font-weight: 700;
        }

        @media (max-width: 520px) {
          .wwd-case {
            grid-template-columns: 1fr;
          }

          .wwd-case-frame {
            aspect-ratio: 5 / 4;
          }
        }

        @media (max-width: 900px) {
          .wwd-hero {
            padding: 72px 28px 80px;
          }

          .wwd-block {
            padding: 80px 28px;
          }

          .wwd-block-inner,
          .wwd-block-inner.reverse {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .wwd-block-inner.reverse .wwd-block-image {
            order: 0;
          }
        }
      `}</style>

      <section className="wwd-section wwd-hero">
        <div className="wwd-inner">
          <div className="wwd-meta-row">
            <div>
              Since · 2009
              <br />
              Auckland · Melbourne · Shenzhen
            </div>
            <div>
              What we do
              <br />
              &amp; how we do it
            </div>
          </div>

          <p className="wwd-eyebrow">What We Do</p>

          <h1 className="wwd-h1">
            Design<span className="wwd-dot">.</span>
            <br />
            Source<span className="wwd-dot">.</span>
            <br />
            Deliver<span className="wwd-dot">.</span>
          </h1>

          <div className="wwd-hero-footer">
            <p className="wwd-hero-lede">
              Three capabilities, one team. We design product worth keeping,
              source it without cutting corners, and deliver it to where it
              needs to go. <strong>No handoffs. No excuses.</strong>
            </p>

            <div className="wwd-cta-row">
              <a href="/contact" className="wwd-cta-primary">
                Start a Project
              </a>
              <a href="/process" className="wwd-cta-secondary">
                See the Process
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="wwd-section wwd-block">
        <div className="wwd-block-inner">
          <div>
            <h2 className="wwd-numeral">
              01<span className="wwd-dot">.</span>
            </h2>
            <h3 className="wwd-block-title">
              Design
              <br />
              &amp; Develop
            </h3>
            <p className="wwd-block-copy">
              Product that earns its keep. We move from sketch to sampled
              prototype to finished run — shaping ideas into branded
              merchandise that&rsquo;s useful, on-brand, and built to be
              kept.{" "}
              <strong>
                If it won&rsquo;t get worn, carried, or kept, we don&rsquo;t
                make it.
              </strong>
            </p>

            <ul className="wwd-block-list">
              <li>Concept &amp; Ideation</li>
              <li>Industrial Design</li>
              <li>Mould &amp; Prototype</li>
              <li>Brand Integration</li>
            </ul>

            <a href="/work/streets-keychains" className="wwd-cta-secondary">
              See the Streets Case Study
            </a>
          </div>

          <figure className="wwd-case">
            <div className="wwd-case-frame">
              <span className="wwd-case-label">Prototype</span>
              <img
                src="/work/streets-prototype.jpg"
                alt="Streets Ice Cream — resin keychain prototypes, uncoloured cast"
              />
            </div>

            <div className="wwd-case-frame">
              <span className="wwd-case-label is-finished">Finished</span>
              <img
                src="/work/streets-finished.jpg"
                alt="Streets Ice Cream — finished resin keychains with brand livery"
              />
            </div>

            <figcaption className="wwd-case-caption">
              <span><strong>Streets Ice Cream</strong></span>
              <span>Resin Keychain · Mould → Delivered</span>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}