"use client";

import { useEffect, useState } from "react";

const ENTRY_PATHS = [
  {
    eyebrow: "01 · Style-Led",
    title: ["START", "FROM A STYLE"],
    copy: "Proven designs, your club colours. Fastest path to kit.",
    ctaLabel: "Browse Styles",
    ctaHref: "/teamwear/styles",
  },
  {
    eyebrow: "02 · Fully Custom",
    title: ["DESIGN", "FROM SCRATCH"],
    copy: "Your club, your brief. We design, sample, and sign it off properly.",
    ctaLabel: "Start a Brief",
    ctaHref: "/teamwear/brief",
  },
  {
    eyebrow: "03 · Team Store",
    title: ["TEAM STORE", "· REORDER"],
    copy: "Already kitted with us? Jump back in and reorder.",
    ctaLabel: "Find Your Store",
    ctaHref: "/teamwear/stores",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Choose a style or send a brief",
    time: "2–3 days",
  },
  {
    number: "02",
    title: "Design + pricing returned",
    time: "within a week",
  },
  {
    number: "03",
    title: "Sign-off + sampling",
    time: "1–2 weeks",
  },
  {
    number: "04",
    title: "Team store opens",
    time: "2 weeks",
  },
  {
    number: "05",
    title: "Production + delivery",
    time: "3–4 weeks",
  },
];

const STORE_BULLETS = [
  "Individual ordering",
  "Name & number capture",
  "Deadline control",
  "Grouped delivery",
];

const SECTORS = [
  {
    label: "Schools",
    detail: "Primary & secondary · house sport, rep teams, PE kit",
  },
  {
    label: "Sports Clubs",
    detail: "Rugby, netball, league, football, hockey, basketball",
  },
  {
    label: "Representative Teams",
    detail: "Zone, regional, and age-group rep teams",
  },
  {
    label: "Corporate & Event Teams",
    detail: "Sales teams, sponsor kit, event crews, and campaign apparel",
  },
];

const RECENT_KITS = [
  {
    image: "teamwear-te-atatu1.jpg",
    title: "Te Atatu Netball",
    meta: "Netball · 50 units · 5 week turnaround",
  },
  {
    image: "teamwear-pride-tee1.jpg",
    title: "Festival staff kit",
    meta: "Event · 50 units · 2 week turnaround",
  },
  {
    image: "/teamwear-wheellanders.jpg",
    title: "Otago Wheelchair Rugby",
    meta: "Team tees & hoodies · 30 units · 2 week turnaround",
  },
];

const FAQS = [
  {
    q: "What are minimum order quantities?",
    a: "Minimums depend on the garment — generally 20 units for fully custom jerseys, lower for tees and polos. We'll confirm exact minimums once we know the style and sport.",
  },
  {
    q: "Can players order individually?",
    a: "Yes. That's what the team store is for. Each player picks their own size, adds a name and number, and pays directly. No chasing from the club.",
  },
  {
    q: "How do names and numbers work?",
    a: "Captured at checkout inside the team store. We print exactly what's entered. You can lock a name list in advance if preferred.",
  },
  {
    q: "How does payment work?",
    a: "Either player-paid through the store, or club-paid on invoice once orders close. Most clubs split: players pay for personalisation, club covers base garment.",
  },
  {
    q: "What are the lead times?",
    a: "Typical full cycle is 8–10 weeks from brief to delivery. Rush options are available for in-season replacements.",
  },
  {
    q: "Can we reorder later?",
    a: "Yes. Your design and store stay active. Reorders skip the sampling step and typically ship in 4–5 weeks.",
  },
];

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

function SecondaryButton({
  href,
  children,
  onDark = true,
}: {
  href: string;
  children: React.ReactNode;
  onDark?: boolean;
}) {
  const base = onDark
    ? { border: "rgba(255,255,255,0.18)", color: "#ffffff" }
    : { border: "rgba(8,8,8,0.6)", color: "#080808" };

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
        border: `1px solid ${base.border}`,
        color: base.color,
        textDecoration: "none",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: "transparent",
        transition:
          "border-color 0.2s ease, background 0.2s ease, color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (onDark) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        } else {
          e.currentTarget.style.background = "#080808";
          e.currentTarget.style.color = "#b8f400";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = base.border;
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = base.color;
      }}
    >
      {children}
    </a>
  );
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

function Eyebrow({
  children,
  color = "#b8f400",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color,
        marginBottom: "16px",
      }}
    >
      {children}
    </div>
  );
}

export default function TeamwearPage() {
  const isMobile = useIsMobile();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section
      style={{
        background: "#080808",
        color: "#f5f5f0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "72px 24px 0" : "104px 56px 0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            alignItems: "start",
            gap: isMobile ? "16px" : "24px",
            marginBottom: "28px",
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
                marginBottom: "4px",
              }}
            >
              Tendencies · Teamwear
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
              Aotearoa · Season 2026
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
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.5,
              }}
            >
              Kit for clubs, schools
              <br />
              &amp; rep teams
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <Eyebrow>Teamwear</Eyebrow>

          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: isMobile
                ? "clamp(56px, 16vw, 92px)"
                : "clamp(72px, 10vw, 152px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            TEAMWEAR
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            BUILT FOR
            <br />
            THE SEASON
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: "32px",
            alignItems: isMobile ? "start" : "center",
            paddingTop: "22px",
            paddingBottom: isMobile ? "56px" : "72px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.48)",
                margin: 0,
              }}
            >
              Custom teamwear for New Zealand schools, clubs, and rep teams —
              with ordering, sizing, and delivery handled properly.
              <br />
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                One link. One deadline. One delivery.
              </span>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: isMobile ? "flex-start" : "flex-end",
            }}
          >
            <PrimaryButton href="/teamwear/start">Start a Kit</PrimaryButton>
            <SecondaryButton href="/teamwear/styles">
              Browse Styles
            </SecondaryButton>
            <SecondaryButton href="/teamwear/stores">
              Find Your Team Store
            </SecondaryButton>
          </div>
        </div>

        <section
          style={{
            padding: isMobile ? "64px 0" : "96px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 420px) 1fr",
              gap: isMobile ? "24px" : "80px",
              alignItems: "start",
              marginBottom: isMobile ? "40px" : "56px",
            }}
          >
            <div>
              <Eyebrow>Three Ways In</Eyebrow>
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "40px" : "56px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.94,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: 0,
                }}
              >
                THREE WAYS
                <br />
                TO KIT YOUR
                <br />
                TEAM
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
            </div>

            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.56)",
                maxWidth: "460px",
                margin: 0,
                paddingTop: isMobile ? 0 : "12px",
              }}
            >
              Pick the path that fits where your club or school is right now.
              Start fast with a proven style, build something fully custom, or
              jump back into a store we've already set up for you.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? "16px" : "20px",
            }}
          >
            {ENTRY_PATHS.map((path) => (
              <div
                key={path.eyebrow}
                style={{
                  position: "relative",
                  background: "#0f0f0f",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: isMobile ? "28px 24px" : "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: isMobile ? "auto" : "360px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#b8f400",
                    marginBottom: "20px",
                  }}
                >
                  {path.eyebrow}
                </div>

                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: isMobile ? "26px" : "30px",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    lineHeight: 0.94,
                    textTransform: "uppercase",
                    color: "#f5f5f0",
                    marginBottom: "18px",
                  }}
                >
                  {path.title[0]}
                  <br />
                  {path.title[1]}
                </div>

                <p
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.56)",
                    margin: "0 0 28px",
                    flex: 1,
                  }}
                >
                  {path.copy}
                </p>

                <div style={{ marginTop: "auto" }}>
                  <SecondaryButton href={path.ctaHref}>
                    {path.ctaLabel}
                  </SecondaryButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: isMobile ? "64px 0" : "96px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 420px) 1fr",
              gap: isMobile ? "24px" : "80px",
              alignItems: "start",
              marginBottom: isMobile ? "40px" : "56px",
            }}
          >
            <div>
              <Eyebrow>How It Works</Eyebrow>
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "40px" : "56px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.94,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: 0,
                }}
              >
                BRIEF
                <br />
                TO DELIVERY
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
            </div>

            <div
              style={{
                paddingTop: isMobile ? 0 : "12px",
                maxWidth: "460px",
              }}
            >
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.56)",
                  margin: "0 0 18px",
                }}
              >
                Five clear steps. No surprises mid-season. Every timeframe below
                is a real client average — not a best case.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  border: "1px solid rgba(184,244,0,0.4)",
                  background: "rgba(184,244,0,0.06)",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#b8f400",
                }}
              >
                Typical Turnaround · 8–10 Weeks
              </div>
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f0f0f",
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "64px 1fr" : "120px 1fr auto",
                  alignItems: "center",
                  gap: isMobile ? "16px" : "32px",
                  padding: isMobile ? "22px 20px" : "28px 32px",
                  borderTop:
                    i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: isMobile ? "32px" : "48px",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "#f5f5f0",
                  }}
                >
                  {step.number}
                  <span style={{ color: "#b8f400" }}>.</span>
                </div>

                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                    color: "#f5f5f0",
                    textTransform: "uppercase",
                  }}
                >
                  {step.title}
                  {isMobile && (
                    <div
                      style={{
                        marginTop: "6px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        color: "#b8f400",
                      }}
                    >
                      {step.time}
                    </div>
                  )}
                </div>

                {!isMobile && (
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#b8f400",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.time}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: isMobile ? "64px 0" : "96px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "minmax(0, 480px) minmax(0, 560px)",
              gap: isMobile ? "32px" : "80px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ maxWidth: "480px" }}>
              <Eyebrow>The Differentiator</Eyebrow>

              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "40px" : "56px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.94,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: "0 0 24px",
                }}
              >
                NO MORE
                <br />
                SPREADSHEETS
                <span style={{ color: "#b8f400" }}>.</span>
                <br />
                NO MORE
                <br />
                CHASING SIZES
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>

              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.56)",
                  margin: "0 0 28px",
                  maxWidth: "460px",
                }}
              >
                Each player orders their own kit through a private store —
                sizes, names, numbers, payment, deadlines. You send one link.
                We do the rest.
              </p>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: "28px",
                }}
              >
                {STORE_BULLETS.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px 0",
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

              <SecondaryButton href="/teamwear/stores">
                See a Sample Store
              </SecondaryButton>
            </div>

            <div style={{ width: "100%", maxWidth: "560px" }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#0f0f0f",
                }}
              >
                <img
                  src="/team-store.jpg"
                  alt="Team store interface — private ordering page for NZ clubs"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.92)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
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
                  • Team Store
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: isMobile ? "64px 0" : "96px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 420px) 1fr",
              gap: isMobile ? "24px" : "80px",
              alignItems: "start",
              marginBottom: isMobile ? "32px" : "48px",
            }}
          >
            <div>
              <Eyebrow>Who We Kit</Eyebrow>
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "40px" : "56px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.94,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: 0,
                }}
              >
                BUILT FOR
                <br />
                NZ CLUBS
                <br />
                AND SCHOOLS
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
            </div>

            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.56)",
                maxWidth: "460px",
                margin: 0,
                paddingTop: isMobile ? 0 : "12px",
              }}
            >
              From a single rep squad to a whole-of-school winter kit run — the
              process is the same. Size run, team store, delivery to the club.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: isMobile ? "12px" : "16px",
            }}
          >
            {SECTORS.map((sector) => (
              <div
                key={sector.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: isMobile ? "22px 20px" : "28px 28px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#0f0f0f",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#b8f400",
                    flex: "0 0 auto",
                    marginTop: "10px",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "18px",
                      fontWeight: 900,
                      letterSpacing: "-0.01em",
                      textTransform: "uppercase",
                      color: "#f5f5f0",
                      marginBottom: "6px",
                    }}
                  >
                    {sector.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "13px",
                      lineHeight: 1.55,
                      color: "rgba(255,255,255,0.52)",
                    }}
                  >
                    {sector.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: isMobile ? "64px 0" : "96px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 420px) 1fr",
              gap: isMobile ? "24px" : "80px",
              alignItems: "end",
              marginBottom: isMobile ? "32px" : "48px",
            }}
          >
            <div>
              <Eyebrow>Recent Kits</Eyebrow>
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "40px" : "56px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.94,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: 0,
                }}
              >
                SHIPPED
                <br />
                THIS SEASON
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
            </div>

            <div style={{ textAlign: isMobile ? "left" : "right" }}>
              <SecondaryButton href="/teamwear/work">
                View All Kits
              </SecondaryButton>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? "16px" : "20px",
            }}
          >
            {RECENT_KITS.map((kit) => (
              <div key={kit.title}>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#0f0f0f",
                    marginBottom: "14px",
                  }}
                >
                  <img
                    src={kit.image}
                    alt={kit.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.88)",
                    }}
                  />
                </div>

                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#f5f5f0",
                    marginBottom: "6px",
                  }}
                >
                  {kit.title}
                </div>

                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.44)",
                  }}
                >
                  {kit.meta}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: isMobile ? "64px 0" : "96px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 420px) 1fr",
              gap: isMobile ? "24px" : "80px",
              alignItems: "start",
            }}
          >
            <div>
              <Eyebrow>Pricing · Lead Times</Eyebrow>
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "40px" : "56px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.94,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: 0,
                }}
              >
                STRAIGHT
                <br />
                NUMBERS
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
            </div>

            <div
              style={{
                maxWidth: "520px",
                paddingTop: isMobile ? 0 : "12px",
              }}
            >
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.56)",
                  margin: "0 0 16px",
                }}
              >
                Pricing depends on garment type, quantity, and decoration. We'll
                confirm cost early, before sampling or production starts.
              </p>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.56)",
                  margin: "0 0 28px",
                }}
              >
                <span style={{ color: "#ffffff", fontWeight: 600 }}>
                  Typical lead time: 8–10 weeks from design to delivery.
                </span>{" "}
                We'll confirm exact pricing once we know the style, unit count,
                and timeline.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                {[
                  { label: "Minimum Units", value: "From 20" },
                  { label: "Sample Before Run", value: "Every Order" },
                  { label: "Standard Turnaround", value: "8–10 Weeks" },
                  { label: "Reorder Turnaround", value: "4–5 Weeks" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "#0f0f0f",
                      padding: "18px 20px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.48)",
                        marginBottom: "8px",
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "20px",
                        fontWeight: 900,
                        letterSpacing: "-0.02em",
                        color: "#f5f5f0",
                        textTransform: "uppercase",
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <SecondaryButton href="/teamwear/start">
                Get a Real Quote
              </SecondaryButton>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: isMobile ? "64px 0" : "96px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 420px) 1fr",
              gap: isMobile ? "24px" : "80px",
              alignItems: "start",
            }}
          >
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "40px" : "56px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.94,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: 0,
                }}
              >
                SIX QUICK
                <br />
                ANSWERS
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={faq.q}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        padding: "22px 0",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: isMobile ? "14px" : "16px",
                        fontWeight: 700,
                        letterSpacing: "-0.005em",
                        color: "#f5f5f0",
                      }}
                    >
                      <span>{faq.q}</span>
                      <span
                        style={{
                          color: "#b8f400",
                          fontSize: "18px",
                          fontWeight: 700,
                          marginLeft: "24px",
                          flex: "0 0 auto",
                        }}
                      >
                        {isOpen ? "–" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          paddingBottom: "22px",
                          paddingRight: "40px",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "14px",
                          lineHeight: 1.6,
                          color: "rgba(255,255,255,0.56)",
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <section
        style={{
          background: "#b8f400",
          color: "#080808",
          padding: isMobile ? "72px 24px" : "96px 56px",
          marginTop: 0,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: "32px",
            alignItems: "end",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: isMobile
                  ? "clamp(56px, 16vw, 96px)"
                  : "clamp(72px, 10vw, 140px)",
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
                fontSize: "14px",
                lineHeight: 1.6,
                color: "rgba(8,8,8,0.7)",
                maxWidth: "280px",
                margin: isMobile ? "0 0 18px 0" : "0 0 18px auto",
              }}
            >
              Tell us what you need — we'll come back with direction, pricing,
              and timeline. Usually within the week.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: isMobile ? "flex-start" : "flex-end",
              }}
            >
              <a
                href="/teamwear/start"
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
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.86")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Start a Kit
              </a>

              <a
                href="/teamwear/book-a-call"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "48px",
                  padding: "0 26px",
                  borderRadius: "999px",
                  border: "1px solid rgba(8,8,8,0.6)",
                  color: "#080808",
                  textDecoration: "none",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "transparent",
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#080808";
                  e.currentTarget.style.color = "#b8f400";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#080808";
                }}
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}