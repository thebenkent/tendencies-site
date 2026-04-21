"use client";

type Logo = {
  name: string;
  src: string;
};

const LOGOS: Logo[] = [
  { name: "Colas", src: "/Colas.svg" },
  { name: "Dragon", src: "/Dragon.svg" },
  { name: "Hydroflow", src: "/Hydroflow.svg" },
  { name: "Kérastase", src: "/Kerastase.svg" },
  { name: "Parrotdog", src: "/Parrotdog.svg" },
  { name: "Solero", src: "/Solero.svg" },
  { name: "Streets", src: "/Streets.svg" },
  { name: "Swire", src: "/Swire.svg" },
  { name: "Unilever", src: "/Unilever.svg" },
  { name: "V", src: "/v.svg" },
];

const ITEMS = [...LOGOS, ...LOGOS];

export default function ClientMarquee() {
  return (
    <>
      <style>{`
        .tnd-marquee-section {
          background: #080808;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          padding: 10px 0;
        }

        .tnd-marquee-wrap {
          display: grid;
          grid-template-columns: 140px 1fr;
          max-width: 1440px;
          margin: 0 auto;
          align-items: stretch;
          position: relative;
        }

        .tnd-marquee-label {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 20px 20px 0 24px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .tnd-marquee-label span {
          font-family: Helvetica, Arial, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b8f400;
          line-height: 1.2;
          white-space: nowrap;
        }

        .tnd-marquee-shell {
          position: relative;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 56px,
            #000 calc(100% - 72px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 56px,
            #000 calc(100% - 72px),
            transparent 100%
          );
        }

        .tnd-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: tnd-marquee-scroll 22s linear infinite;
          will-change: transform;
        }

        .tnd-marquee-wrap:hover .tnd-marquee-track {
          animation-play-state: paused;
        }

        @keyframes tnd-marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .tnd-marquee-item {
          height: 148px;
          min-width: 220px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
        }

        .tnd-marquee-item img {
          height: 62px;
          width: auto;
          max-width: 200px;
          object-fit: contain;
          display: block;
          opacity: 1;
          filter: brightness(0) invert(1);
          transition: opacity 0.25s ease, transform 0.25s ease;
          user-select: none;
          -webkit-user-drag: none;
          transform: scale(1.08);
          transform-origin: center;
        }

        .tnd-marquee-item:hover img {
          opacity: 1;
          transform: scale(1.12);
        }

        @media (prefers-reduced-motion: reduce) {
          .tnd-marquee-track {
            animation: none;
          }
        }

        @media (max-width: 900px) {
          .tnd-marquee-wrap {
            grid-template-columns: 108px 1fr;
          }

          .tnd-marquee-label {
            padding: 16px 16px 0 16px;
          }

          .tnd-marquee-item {
            min-width: 150px;
            height: 96px;
            padding: 0 14px;
          }

          .tnd-marquee-item img {
            height: 34px;
            max-width: 120px;
            transform: scale(1.02);
          }

          .tnd-marquee-item:hover img {
            transform: scale(1.05);
          }
        }
      `}</style>

      <section className="tnd-marquee-section" aria-label="Trusted by">
        <div className="tnd-marquee-wrap">
          <div className="tnd-marquee-label">
            <span>
              Trusted
              <br />
              By
            </span>
          </div>

          <div className="tnd-marquee-shell">
            <div className="tnd-marquee-track">
              {ITEMS.map((logo, i) => (
                <div key={`${logo.name}-${i}`} className="tnd-marquee-item">
                  <img src={logo.src} alt={logo.name} draggable={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}