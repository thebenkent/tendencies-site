"use client";

export default function NeedHelp({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "72px",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "32px" : "64px",
          alignItems: "end",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b8f400",
              marginBottom: "16px",
            }}
          >
            Here to help
          </div>
          <h2
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: "0 0 20px",
            }}
          >
            Need help choosing
            <br />
            the right merch
            <span style={{ color: "#b8f400" }}>?</span>
          </h2>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "15px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 32px",
              maxWidth: "480px",
            }}
          >
            Send us the moment, audience, budget and deadline.
            We&apos;ll shape the shortlist.
          </p>
          <a
            href="/start-a-project"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              height: "48px",
              padding: "0 28px",
              borderRadius: "999px",
              background: "#b8f400",
              color: "#080808",
              textDecoration: "none",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.opacity = "0.88")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.opacity = "1")
            }
          >
            Start a Project →
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
          }}
        >
          {[
            { label: "The moment", desc: "A campaign, event, or launch." },
            { label: "The audience", desc: "Staff, customers, or community." },
            { label: "The budget", desc: "Per unit or total — either works." },
            { label: "The deadline", desc: "We'll tell you what's achievable." },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#0f0f0f",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#b8f400",
                  marginBottom: "6px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.42)",
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
