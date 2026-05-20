import Link from "next/link";

const PILLARS = [
  {
    label: "Design",
    copy:
      "Concepts built around how product gets used, not just how it photographs.",
  },
  {
    label: "Source",
    copy:
      "Factory relationships and materials sourced to survive beyond the campaign.",
  },
  {
    label: "Deliver",
    copy:
      "End-to-end project management with real timelines and no surprises.",
  },
];

export default function AboutIntro() {
  return (
    <section
      className="section"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "48px",
            maxWidth: "1440px",
            margin: "0 auto",
          }}
        >
          {PILLARS.map((pillar, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: "clamp(28px, 4vw, 36px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  marginBottom: "16px",
                  lineHeight: 0.9,
                }}
              >
                {pillar.label}.
              </div>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.56)",
                  margin: 0,
                }}
              >
                {pillar.copy}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "32px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Link

  href="/about"

  className="about-link"

  style={{
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(255,255,255,0.14)",
    paddingBottom: "2px",
    whiteSpace: "nowrap",
    transition: "color 0.2s ease",
  }}
>
  How we work →
</Link>
        </div>
      </div>
    </section>
  );
}
