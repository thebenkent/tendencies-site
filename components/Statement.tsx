"use client";

const lines = [
  { text: "GOOD DESIGN.", type: "outline" },
  { text: "BETTER PRODUCT.", type: "solid" },
  { text: "BEST OUTCOME.", type: "accent" },
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
            padding: "120px 48px",
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
                marginBottom: "6px",
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
            padding: "120px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Copy */}
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.4)",
              maxWidth: "320px",
              margin: 0,
            }}
          >
            Most promo merch gets issued and ignored.  
            We build things people actually want to keep.  
            The framework is simple — the execution is what sets us apart.
          </p>

          {/* Metrics */}
          <div style={{ marginTop: "48px" }}>
            {[
              { value: "200+", label: "Projects delivered" },
              { value: "50+", label: "Brand partners" },
              { value: "3", label: "Global locations" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 0",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 900,
                    color: "#b8f400",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.value}
                </span>

                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
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