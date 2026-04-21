"use client";

export default function MiloCaseStudy() {
  return (
    <>
      <style>{`
        .case-section {
          background: #080808;
          color: #fff;
        }

        .case-hero {
          padding: 105px 48px 96px;
          border-bottom: 1px solid #141414;
        }

        .case-inner {
          max-width: 1180px;
          margin: 0 auto;
        }

        .case-eyebrow {
          color: #b8f400;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .case-title {
          font-size: clamp(48px, 7vw, 96px);
          line-height: 0.9;
          font-weight: 900;
          letter-spacing: -0.04em;
          margin: 0 0 24px;
          text-transform: uppercase;
        }

        .case-dot {
          color: #b8f400;
        }

        .case-meta {
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8a8a8a;
        }

        .case-block {
          padding: 96px 48px;
          border-bottom: 1px solid #141414;
        }

        .case-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }

        .case-copy {
          max-width: 460px;
        }

        .case-copy h3 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 18px;
          text-transform: uppercase;
        }

        .case-copy p {
          color: #9a9a9a;
          line-height: 1.6;
          font-size: 16px;
        }

        .case-image {
          position: relative;
          aspect-ratio: 5 / 4;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          background: #111;
        }

        .case-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 600ms ease;
        }

        .case-image:hover img {
          transform: scale(1.04);
        }

        .case-full {
          margin-top: 40px;
          aspect-ratio: 16 / 9;
        }

        .case-cta {
          padding: 120px 48px;
          text-align: center;
        }

        .case-cta h2 {
          font-size: 42px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .case-button {
          display: inline-block;
          padding: 16px 32px;
          background: #b8f400;
          color: #000;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          border-radius: 999px;
          text-decoration: none;
        }

        .case-button:hover {
          opacity: 0.85;
        }

        @media (max-width: 900px) {
          .case-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .case-block {
            padding: 72px 28px;
          }

          .case-hero {
            padding: 72px 28px;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="case-section case-hero">
        <div className="case-inner">
          <p className="case-eyebrow">Case Study</p>

          <h1 className="case-title">
            Milo<br />
            Promo Ball<span className="case-dot">.</span>
          </h1>

          <p className="case-meta">
            Nestlé · Promotional Product · Custom Manufacture
          </p>
        </div>
      </section>

      {/* BRIEF */}
      <section className="case-section case-block">
        <div className="case-inner case-grid">
          <div className="case-copy">
            <h3>Brief</h3>
            <p>
              Create a promotional product that connects with families and kids,
              reinforcing Milo’s identity as an active, everyday brand.
              It needed to be fun, durable, and something that would actually be used —
              not thrown away.
            </p>
          </div>

          <div className="case-image">
            <img src="/work/milo-context.jpg" alt="Milo brand context" />
          </div>
        </div>
      </section>

      {/* DESIGN */}
      <section className="case-section case-block">
        <div className="case-inner case-grid">
          <div className="case-image">
            <img src="/work/milo-design.jpg" alt="Milo ball design development" />
          </div>

          <div className="case-copy">
            <h3>Design</h3>
            <p>
              We developed a custom Milo-branded ball designed for everyday play.
              Scale, colour, and material were tuned to match the brand while
              ensuring durability across repeated use.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCT */}
      <section className="case-section case-block">
        <div className="case-inner">
          <div className="case-copy">
            <h3>Product</h3>
            <p>
              Manufactured for consistency and durability at scale,
              the final product balanced cost, quality, and brand visibility.
              Designed to be taken home, used, and kept.
            </p>
          </div>

          <div className="case-image case-full">
            <img src="/work/milo-ball.jpg" alt="Finished Milo promotional ball" />
          </div>
        </div>
      </section>

      {/* OUTCOME */}
      <section className="case-section case-block">
        <div className="case-inner case-grid">
          <div className="case-copy">
            <h3>Outcome</h3>
            <p>
              A simple product done properly. High engagement, strong brand recall,
              and a promotional item that stayed in circulation — not in the bin.
            </p>
          </div>

          <div className="case-image">
            <img src="/work/milo-usage.jpg" alt="Milo ball in use" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="case-section case-cta">
        <h2>Got a brief?</h2>
        <a href="/contact" className="case-button">
          Start a Project
        </a>
      </section>
    </>
  );
}