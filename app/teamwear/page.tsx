"use client";

import { useEffect, useState } from "react";

// -----------------------------------------------------------------------------
// Teamwear hub — sport grid + 3D kit designer CTA.
// File path in repo: app/teamwear/page.tsx
// -----------------------------------------------------------------------------

type Sport = {
  name: string;
  image: string;
  href: string;
};

const TEAM_SPORTS: Sport[] = [
  { name: "Rugby League", image: "/sport-rugby-league.jpg", href: "/teamwear/rugby-league" },
  { name: "Rugby", image: "/sport-rugby.jpg", href: "/teamwear/rugby" },
  { name: "Netball", image: "/sport-netball.jpg", href: "/teamwear/netball" },
  { name: "Basketball", image: "/sport-basketball.jpg", href: "/teamwear/basketball" },
  { name: "Hockey", image: "/sport-hockey.jpg", href: "/teamwear/hockey" },
  { name: "Cricket", image: "/sport-cricket.jpg", href: "/teamwear/cricket" },
  { name: "Touch", image: "/sport-touch.jpg", href: "/teamwear/touch" },
  { name: "Baseball", image: "/sport-baseball.jpg", href: "/teamwear/baseball" },
  { name: "Bowls", image: "/sport-bowls.jpg", href: "/teamwear/bowls" },
];

const LEAVERS = {
  name: "Leavers",
  tag: "School · Class Of",
  line: "Graduation hoodies, senior tees, and class-specific kit — built to last longer than the yearbook.",
  image: "/sport-leavers.jpg",
  href: "/teamwear/leavers",
};

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
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
      {children}
    </a>
  );
}

function SecondaryButton({
  href,
  children,
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const borderBase = dark ? "rgba(8,8,8,0.2)" : "rgba(255,255,255,0.18)";
  const borderHover = dark ? "rgba(8,8,8,0.4)" : "rgba(255,255,255,0.32)";
  const bgHover = dark ? "rgba(8,8,8,0.04)" : "rgba(255,255,255,0.03)";
  const color = dark ? "#080808" : "#ffffff";

  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        padding: "0 24px",
        borderRadius: "999px",
        border: `1px solid ${borderBase}`,
        color,
        textDecoration: "none",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: "transparent",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = borderHover;
        e.currentTarget.style.background = bgHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderBase;
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </a>
  );
}

function SportCard({ sport }: { sport: Sport }) {
  return (
    <a
      href={sport.href}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0f0f0f",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.filter = "brightness(0.82)";
      }}
      onMouseLeave={(e) => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.filter = "brightness(0.7)";
      }}
    >
      <img
        src={sport.image}
        alt={`${sport.name} — custom teamwear`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.7)",
          transition: "filter 0.35s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(8,8,8,0.94) 0%, rgba(8,8,8,0.28) 58%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "13px",
        }}
      >
        ↗
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "clamp(22px, 1.9vw, 30px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.95,
          }}
        >
          {sport.name}
        </div>
      </div>
    </a>
  );
}

function LeaversCard({ isMobile }: { isMobile: boolean }) {
  return (
    <a
      href={LEAVERS.href}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        minHeight: isMobile ? "300px" : "340px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0f0f0f",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.filter = "brightness(0.78)";
      }}
      onMouseLeave={(e) => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.filter = "brightness(0.66)";
      }}
    >
      <img
        src={LEAVERS.image}
        alt="School leavers — custom hoodies and tees"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.66)",
          transition: "filter 0.35s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.35) 60%, rgba(8,8,8,0.08) 100%)"
            : "linear-gradient(90deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.55) 45%, rgba(8,8,8,0.15) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "18px",
          background: "rgba(8,8,8,0.82)",
          color: "#b8f400",
          border: "1px solid rgba(255,255,255,0.12)",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "8px 12px",
        }}
      >
        {LEAVERS.tag}
      </div>

      <div
        style={{
          position: "absolute",
          top: "18px",
          right: "18px",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "14px",
        }}
      >
        ↗
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: isMobile ? "24px" : "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
          minHeight: isMobile ? "300px" : "340px",
          maxWidth: isMobile ? "100%" : "640px",
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: isMobile ? "clamp(42px, 12vw, 64px)" : "clamp(48px, 6vw, 88px)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            color: "#f5f5f0",
            margin: "0 0 12px",
          }}
        >
          {LEAVERS.name}
          <span style={{ color: "#b8f400" }}>.</span>
        </div>

        <p
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "14px",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
            maxWidth: "480px",
          }}
        >
          {LEAVERS.line}
        </p>
      </div>
    </a>
  );
}

export default function TeamwearPage() {
  const isMobile = useIsMobile();

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
          padding: isMobile ? "84px 24px 0" : "96px 48px 0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            alignItems: "start",
            gap: isMobile ? "14px" : "24px",
            marginBottom: "18px",
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
              justifySelf: isMobile ? "start" : "end",
              textAlign: isMobile ? "left" : "right",
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
              Custom kit, your colours
              <br />
              designed live in 3D
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "22px" }}>
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
            Teamwear
          </div>

          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: isMobile ? "clamp(56px, 16vw, 92px)" : "clamp(72px, 10vw, 152px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            DESIGN
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            YOUR KIT
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: isMobile ? "20px" : "32px",
            alignItems: isMobile ? "start" : "center",
            paddingTop: "18px",
            paddingBottom: isMobile ? "44px" : "56px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "580px" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.48)",
                margin: 0,
              }}
            >
              Fully custom kit across nine sports, plus school leavers. Pick your cut, pick your colours, drop in your badge.
              <br />
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                Design it live. See it on-body. Approve once and we make it.
              </span>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: isMobile ? "flex-start" : "flex-end",
            }}
          >
            <PrimaryButton href="/teamwear/designer">Launch Designer</PrimaryButton>
            <SecondaryButton href="#sports">Browse Sports</SecondaryButton>
          </div>
        </div>

        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "24px",
            paddingBottom: isMobile ? "44px" : "56px",
          }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(184,244,0,0.28)",
              background:
                "linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 60%, #0f0f0f 100%)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.05fr 1fr",
                alignItems: "stretch",
                minHeight: isMobile ? "auto" : "460px",
              }}
            >
              <div
                style={{
                  padding: isMobile ? "24px" : "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#b8f400",
                      boxShadow: "0 0 14px rgba(184,244,0,0.6)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#b8f400",
                    }}
                  >
                    Live · 3D Kit Designer
                  </span>
                </div>

                <div>
                  <h2
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: isMobile ? "clamp(40px, 11vw, 64px)" : "clamp(48px, 6vw, 96px)",
                      fontWeight: 900,
                      letterSpacing: "-0.06em",
                      lineHeight: 0.88,
                      textTransform: "uppercase",
                      color: "#f5f5f0",
                      margin: "0 0 16px",
                    }}
                  >
                    BUILD IT
                    <span style={{ color: "#b8f400" }}>.</span>
                    <br />
                    SEE IT
                    <span style={{ color: "#b8f400" }}>.</span>
                    <br />
                    WEAR IT
                    <span style={{ color: "#b8f400" }}>.</span>
                  </h2>

                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.52)",
                      margin: "0 0 20px",
                      maxWidth: "480px",
                    }}
                  >
                    Spin the model. Try your colours. Drop in your logo. Preview every panel before anything goes into production — no back-and-forth, no guesswork.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    {["Rotate in 3D", "Your Pantone", "Logo Upload", "Live Preview", "Quote on Submit"].map(
                      (chip) => (
                        <span
                          key={chip}
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.72)",
                            border: "1px solid rgba(255,255,255,0.14)",
                            padding: "8px 12px",
                          }}
                        >
                          {chip}
                        </span>
                      )
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <PrimaryButton href="/teamwear/designer">Launch Designer →</PrimaryButton>
                    <SecondaryButton href="/contact">Talk To Us</SecondaryButton>
                  </div>
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: "#080808",
                  borderLeft: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
                  borderTop: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none",
                  minHeight: isMobile ? "320px" : "auto",
                }}
              >
                <img
                  src="/designer-preview.jpg"
                  alt="3D kit designer preview"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.85)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(8,8,8,0.6) 0%, transparent 50%)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    background: "rgba(8,8,8,0.78)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#b8f400",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#f5f5f0",
                    }}
                  >
                    Preview · Rugby League Cut
                  </span>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    right: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    360° · On-Body · To-Spec
                  </div>

                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#b8f400",
                    }}
                  >
                    Drag to rotate ↻
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="sports"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: isMobile ? "36px" : "40px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
              alignItems: "end",
              gap: isMobile ? "14px" : "32px",
              marginBottom: "22px",
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
                  marginBottom: "10px",
                }}
              >
                01 · Team Sports
              </div>

              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "clamp(34px, 10vw, 48px)" : "clamp(40px, 5vw, 72px)",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: 0,
                }}
              >
                Pick Your Code
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
            </div>

            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                textAlign: isMobile ? "left" : "right",
                maxWidth: "260px",
                lineHeight: 1.5,
              }}
            >
              Nine sports supported
              <br />
              more on request
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
              gap: "14px",
            }}
          >
            {TEAM_SPORTS.map((sport) => (
              <SportCard key={sport.name} sport={sport} />
            ))}
          </div>
        </section>

        <section
          style={{
            paddingTop: isMobile ? "44px" : "56px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
              alignItems: "end",
              gap: isMobile ? "14px" : "32px",
              marginBottom: "22px",
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
                  marginBottom: "10px",
                }}
              >
                02 · School & Special
              </div>

              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "clamp(34px, 10vw, 48px)" : "clamp(40px, 5vw, 72px)",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: 0,
                }}
              >
                Class Of
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
            </div>

            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                textAlign: isMobile ? "left" : "right",
                maxWidth: "260px",
                lineHeight: 1.5,
              }}
            >
              School leavers
              <br />
              &amp; year-group kit
            </div>
          </div>

          <LeaversCard isMobile={isMobile} />
        </section>

        <div
          style={{
            marginTop: "36px",
            marginBottom: isMobile ? "64px" : "80px",
            padding: isMobile ? "16px 18px" : "18px 22px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.64)",
              lineHeight: 1.5,
            }}
          >
            Don't see your sport? <span style={{ color: "#ffffff" }}>We can still build it.</span>
          </div>

          <a
            href="/contact"
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#b8f400",
              textDecoration: "none",
              borderBottom: "1px solid rgba(184,244,0,0.3)",
              paddingBottom: "3px",
              justifySelf: isMobile ? "start" : "end",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = "#b8f400";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = "rgba(184,244,0,0.3)";
            }}
          >
            Get in touch →
          </a>
        </div>
      </div>

      <section
        style={{
          background: "#b8f400",
          color: "#080808",
          padding: isMobile ? "56px 24px" : "84px 48px",
          marginTop: "8px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: isMobile ? "24px" : "32px",
            alignItems: "end",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: isMobile ? "clamp(52px, 15vw, 88px)" : "clamp(72px, 10vw, 140px)",
                fontWeight: 900,
                letterSpacing: "-0.065em",
                lineHeight: 0.84,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              KIT YOUR
              <br />
              TEAM
              <br />
              PROPERLY.
            </h2>
          </div>

          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "rgba(8,8,8,0.72)",
                maxWidth: "240px",
                margin: isMobile ? "0 0 18px 0" : "0 0 18px auto",
              }}
            >
              Design live. Approve once. We make it.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: isMobile ? "flex-start" : "flex-end",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/teamwear/designer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "48px",
                  padding: "0 26px",
                  borderRadius: "999px",
                  background: "#080808",
                  color: "#b8f400",
                  textDecoration: "none",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Launch Designer →
              </a>

              <SecondaryButton href="/start-a-project" dark>
                Start a Project
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}