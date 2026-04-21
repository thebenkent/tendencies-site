"use client";

// -----------------------------------------------------------------------------
// Case study: Streets Ice Cream — Resin Keychains
// File path in repo: app/work/streets-keychains/page.tsx
//
// Image mapping:
//   • /work-streets-prototype.jpg  → prototype diptych (left)
//   • /work-streets-finished.jpg   → finished diptych (right)
// -----------------------------------------------------------------------------

export default function StreetsCaseStudy() {
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
              Case Study
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
              Streets Ice Cream
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
              Resin keychains
              <br />
              mould to finished product
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
            Streets Keychains
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
            FROM
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            MOULD
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            TO HAND
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "32px",
            alignItems: "center",
            paddingTop: "22px",
            paddingBottom: "72px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.48)",
                margin: 0,
              }}
            >
              A custom resin keychain project for Streets Ice Cream, developed
              from early mould samples through to finished branded product.
              <br />
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                A simple piece, executed properly.
              </span>
            </p>
          </div>

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
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.86")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Start a Project
          </a>
        </div>

        {/* DIPTYCH */}
        <section
          style={{
            padding: "0 0 92px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              paddingTop: "28px",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "5 / 4",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0f0f0f",
              }}
            >
              <img
                src="/work-streets-prototype.jpg"
                alt="Streets Ice Cream — resin keychain prototypes, uncoloured cast"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.82)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  background: "rgba(8,8,8,0.86)",
                  color: "#f5f5f0",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "7px 10px",
                }}
              >
                • Prototype
              </div>
            </div>

            <div
              style={{
                position: "relative",
                aspectRatio: "5 / 4",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0f0f0f",
              }}
            >
              <img
                src="/work-streets-finished.jpg"
                alt="Streets Ice Cream — finished resin keychains with brand livery"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.95)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  background: "#b8f400",
                  color: "#080808",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "7px 10px",
                }}
              >
                • Finished
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "14px",
            }}
          >
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#f5f5f0",
                marginBottom: "10px",
              }}
            >
              Streets Ice Cream
            </div>

            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.44)",
              }}
            >
              Resin Keychain · Mould → Delivered
            </div>
          </div>
        </section>

        {/* PROJECT INFO */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "40px",
            padding: "0 0 92px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              paddingTop: "28px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "56px",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            01
            <span style={{ color: "#b8f400" }}>.</span>
          </div>

          <div style={{ paddingTop: "28px", maxWidth: "760px" }}>
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "26px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                textTransform: "uppercase",
                color: "#f5f5f0",
                marginBottom: "18px",
              }}
            >
              Brief
            </div>

            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.56)",
                margin: "0 0 18px",
              }}
            >
              Streets needed a custom resin keychain range that translated their
              ice cream brands into small-format branded product people would
              actually keep.
            </p>

            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.56)",
                margin: "0 0 18px",
              }}
            >
              The challenge was getting the forms, colours, and finish right so
              the final pieces still felt recognisable and clean at that scale.
            </p>

            <div
              style={{
                maxWidth: "520px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                marginTop: "28px",
              }}
            >
              {[
                "Custom Resin Product",
                "Mould Development",
                "Sampling & Refinement",
                "Final Production",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "#b8f400",
                      flex: "0 0 auto",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#f5f5f0",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* CTA BAND */}
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

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "rgba(8,8,8,0.72)",
                maxWidth: "240px",
                margin: "0 0 22px auto",
              }}
            >
              Big enough to deliver. Small enough to care.
            </p>

            <a
              href="/start-a-project"
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
                background: "transparent",
              }}
            >
              Start a Project
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
