"use client";

export default function Hero() {
  return (
    <section
      style={{
        padding: "clamp(72px, 10vw, 152px) clamp(20px, 5vw, 48px) 72px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        overflowX: "clip",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "space-between",
            marginBottom: "36px",
          }}
        >
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: "6px" }}>
              Since · 2009
            </div>
            <div style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)" }}>
              Auckland · Melbourne · Shenzhen
            </div>
          </div>

          <div style={{ textAlign: "right", maxWidth: "320px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>
              Custom merch & apparel.
              <br />
              Designed to be re-used.
            </div>
          </div>
        </div>

        <h1
          style={{
           fontSize: "clamp(72px, 10vw, 152px)",
            fontWeight: 900,
            letterSpacing: "-0.065em",
            lineHeight: 0.84,
            textTransform: "uppercase",
            margin: "0 0 24px",
            color: "#f5f5f0",
            maxWidth: "100%",
          }}
        >
          DONE
          <br />
          PROPERLY
          <span style={{ color: "#b8f400" }}>.</span>
        </h1>

        <div
          className="hero-bottom"
        >
          <div style={{ maxWidth: "560px" }}>
            <p style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(255,255,255,0.56)", margin: "0 0 18px" }}>
              Always delivering client expectations.
               </p>
              <br />
          </div>

          <div className="hero-buttons">
            <a href="/start-a-project" className="btn btn-primary">
              Start a Project
            </a>
            <a href="/work" className="btn btn-secondary">
              View Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}