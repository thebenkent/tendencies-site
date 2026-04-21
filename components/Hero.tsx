"use client";

export default function Hero() {
  return (
    <section
      style={{
        padding: "140px 48px 80px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* TOP META */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "6px",
              }}
            >
              Since · 2009
            </div>

            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Auckland · Melbourne · Shenzhen
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.4,
              }}
            >
              Custom merch & apparel.
              <br />
              For brands that give a shit.
            </div>
          </div>
        </div>

        {/* HEADLINE */}
        <h1
          style={{
            fontSize: "clamp(72px, 10vw, 140px)",
            fontWeight: 900,
            letterSpacing: "-0.06em",
            lineHeight: 0.85,
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          DONE
          <br />
          PROPERLY
          <span style={{ color: "#b8f400" }}>.</span>
        </h1>

        {/* SUB + CTA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: "32px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.5)",
                margin: 0,
              }}
            >
              Custom merch and apparel. Designed to be re-used.
              <br />
              <span style={{ color: "#fff", fontWeight: 600 }}>
                Always delivering client expectations.
              </span>
            </p>
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "14px",
            }}
          >
            {/* PRIMARY */}
            <a
              href="/start-a-project"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 26px",
                borderRadius: "999px",
                background: "#b8f400",
                color: "#080808",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.opacity = "0.85")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity = "1")
              }
            >
              Start a Project
            </a>

            {/* SECONDARY */}
            <a
              href="/work"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 24px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.6)";
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.2)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              View Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}