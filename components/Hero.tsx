"use client";

export default function Hero() {
  return (
    <section
      style={{
        padding: "120px 48px 72px",
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
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
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
                color: "rgba(255,255,255,0.58)",
              }}
            >
              Auckland · Melbourne · Shenzhen
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.55,
              }}
            >
              Custom merch & apparel.
              <br />
              Built to be used, not wasted.
            </div>
          </div>
        </div>

        {/* HEADLINE */}
        <h1
          style={{
            fontSize: "clamp(72px, 10vw, 140px)",
            fontWeight: 900,
            letterSpacing: "-0.065em",
            lineHeight: 0.84,
            textTransform: "uppercase",
            margin: "0 0 24px",
            color: "#f5f5f0",
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
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignItems: "end",
            gap: "32px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.56)",
                margin: "0 0 18px",
              }}
            >
              Custom merch and apparel. Designed to be re-used.
              <br />
              <span style={{ color: "#fff", fontWeight: 600 }}>
                Always delivering client expectations.
              </span>
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "30px",
                  padding: "0 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Custom merch
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "30px",
                  padding: "0 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Apparel
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "30px",
                  padding: "0 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Global production
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <a
              href="/start-a-project"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "46px",
                padding: "0 22px",
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
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Start a Project
            </a>

            <a
              href="/work"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "46px",
                padding: "0 22px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#fff",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
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