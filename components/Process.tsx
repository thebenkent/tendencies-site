"use client";

const STEPS = [
  {
    number: "01",
    title: "BRIEF",
    text: "We get clear on what you’re trying to achieve. Audience, use-case, quantity, timelines — no assumptions, no guesswork.",
  },
  {
    number: "02",
    title: "DESIGN",
    text: "Concepts, materials, and form. We design product that people actually want to keep — not just something to put a logo on.",
  },
  {
    number: "03",
    title: "PROTOTYPE",
    text: "We sample properly. Materials, finishes, branding — everything is tested before committing to production.",
  },
  {
    number: "04",
    title: "PRODUCE",
    text: "We move into production with the right factory, right materials, and clear oversight. No shortcuts.",
  },
  {
    number: "05",
    title: "DELIVER",
    text: "Packed, shipped, and delivered where it needs to go — whether that’s a warehouse, campaign, or straight to customers.",
  },
];

export default function Process() {
  return (
    <section
      style={{
        background: "#080808",
        color: "#f5f5f0",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "116px 48px 0",
        }}
      >
        {/* HERO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "start",
            gap: "24px",
            marginBottom: "26px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: "6px",
              }}
            >
              Since · 2009
            </div>

            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Auckland · Melbourne · Shenzhen
            </div>
          </div>

          <div
            style={{
              justifySelf: "end",
              textAlign: "right",
              maxWidth: "360px",
            }}
          >
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.45,
              }}
            >
              How we work
              <br />
              from start to finish
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b8f400",
              marginBottom: "18px",
            }}
          >
            Process
          </div>

          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "clamp(72px, 10vw, 152px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            BRIEF
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            DESIGN
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            DELIVER
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
        </div>

        <div
          style={{
            maxWidth: "520px",
            paddingTop: "22px",
            paddingBottom: "72px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "14px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.48)",
              margin: 0,
            }}
          >
            A clear process, executed properly. Every step is deliberate —
            nothing rushed, nothing left to chance.
          </p>
        </div>

        {/* STEPS */}
        {STEPS.map((step, i) => (
          <section
            key={step.number}
            style={{
              padding: "80px 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: "40px",
                alignItems: "start",
              }}
            >
              {/* NUMBER */}
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "88px",
                  fontWeight: 900,
                  letterSpacing: "-0.06em",
                  lineHeight: 0.9,
                }}
              >
                {step.number}
                <span style={{ color: "#b8f400" }}>.</span>
              </div>

              {/* CONTENT */}
              <div>
                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "24px",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                  }}
                >
                  {step.title}
                </div>

                <p
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.56)",
                    maxWidth: "560px",
                    margin: 0,
                  }}
                >
                  {step.text}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section
        style={{
          background: "#b8f400",
          color: "#080808",
          padding: "108px 48px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "32px",
            alignItems: "end",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "clamp(72px, 10vw, 140px)",
                fontWeight: 900,
                letterSpacing: "-0.065em",
                lineHeight: 0.84,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              LET’S
              <br />
              BUILD
              <br />
              SOMETHING.
            </h2>
          </div>

          <a
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              padding: "0 26px",
              borderRadius: "999px",
              border: "1px solid rgba(8,8,8,0.18)",
              color: "#080808",
              textDecoration: "none",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Start a Project
          </a>
        </div>
      </section>
    </section>
  );
}