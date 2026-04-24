"use client";

export default function CTA() {
  return (
    <section
      style={{
        background: "#b8f400",
        padding: "96px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          alignItems: "end",
          gap: "48px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(8,8,8,0.58)",
              marginBottom: "16px",
            }}
          >
            Start a project
          </div>

          <h2
            style={{
              fontSize: "clamp(64px, 10vw, 120px)",
              fontWeight: 900,
              lineHeight: 0.84,
              letterSpacing: "-0.06em",
              textTransform: "uppercase",
              margin: 0,
              color: "#080808",
            }}
          >
            LET&apos;S
            <br />
            BUILD
            <br />
            SOMETHING.
          </h2>
        </div>

        <div
          style={{
            textAlign: "right",
            maxWidth: "280px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
              fontWeight: 500,
              color: "rgba(8,8,8,0.66)",
              margin: "0 0 20px",
            }}
          >
            Big enough to deliver.
            <br />
            Small enough to care.
          </p>

          <a
            href="/start-a-project"
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