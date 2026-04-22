"use client";

const lines = [
  { text: "GOOD DESIGN.", type: "outline" },
  { text: "BETTER PRODUCT.", type: "solid" },
  { text: "BEST OUTCOME.", type: "accent" },
];

const metrics = [
  { value: "200+", label: "Projects delivered" },
  { value: "50+", label: "Brand partners" },
  { value: "3", label: "Global locations" },
];

export default function Statement() {
  return (
    <section
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* LEFT — TYPE */}
        <div
          style={{
            padding: "88px 48px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {lines.map((l, i) => (
            <div
              key={i}
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "clamp(48px, 6vw, 80px)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                marginBottom: i === lines.length - 1 ? 0 : "2px",
                textTransform: "uppercase",

                ...(l.type === "outline"
                  ? {
                      color: "transparent",
                      WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                    }
                  : l.type === "accent"
                  ? {
                      color: "#b8f400",
                    }
                  : {
                      color: "#fff",
                    }),
              }}
            >
              {l.text}
            </div>
          ))}
        </div>

        {/* RIGHT — COPY + METRICS */}
        <div
          style={{
            padding: "88px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "48px",
          }}
        >
          {/* Copy */}
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.45)",
              maxWidth: "340px",
              margin: 0,
            }}
          >
            Most promo merch gets issued and ignored. We build things people
            actually want to keep. The framework is simple — the execution is
            what sets us apart.
          </p>

          {/* Metrics */}
          <div>
            {metrics.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "14px 0",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  ...(i === metrics.length - 1
                    ? { borderBottom: "1px solid rgba(255,255,255,0.06)" }
                    : {}),
                }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: 900,
                    color: "#b8f400",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </span>

                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
