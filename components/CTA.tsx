"use client";

export default function CTA() {
  return (
    <section
      style={{
        background: "#b8f400",
        padding: "88px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "48px",
        }}
      >
        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(64px, 10vw, 120px)",
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            margin: 0,
            color: "#080808",
          }}
        >
          LET'S
          <br />
          BUILD
          <br />
          SOMETHING.
        </h2>

        {/* Right */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.45,
              fontWeight: 500,
              color: "rgba(0,0,0,0.6)",
              margin: "0 0 18px",
            }}
          >
            Big enough to deliver.
            <br />
            Small enough to care.
          </p>

          <a
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "52px",
              padding: "0 28px",
              borderRadius: "999px",
              background: "#080808",
              color: "#b8f400",
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
            Start a Project →
          </a>
        </div>
      </div>
    </section>
  );
}
