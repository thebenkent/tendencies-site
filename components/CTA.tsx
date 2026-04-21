"use client";

export default function CTA() {
  return (
    <section
      style={{
        background: "#b8f400",
        padding: "120px 48px",
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
            color: "rgba(0,0,0,0.5)",
            marginBottom: "24px",
          }}
        >
          Big enough to deliver.<br />
          Small enough to care.
        </p>

        <a
          href="/contact"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            borderRadius: "999px",
            border: "2px solid #080808",
            textTransform: "uppercase",
            fontSize: "12px",
            fontWeight: 700,
            color: "#080808",
            textDecoration: "none",
          }}
        >
          Start a Project →
        </a>
      </div>
    </section>
  );
}