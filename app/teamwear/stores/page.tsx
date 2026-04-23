// /app/teamwear/stores/page.tsx
"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
const STORE_BULLETS = [
  {
    label: "Players Order Individually",
    detail: "Each player picks their own size, name, and number through a private link.",
  },
  {
    label: "Names & Numbers; Numbers Captured",
    detail: "No more chasing a spreadsheet — data lands exactly how it'll be printed.",
  },
  {
    label: "Deadline Control",
    detail: "You set the cutoff. The store closes automatically when orders lock.",
  },
  {
    label: "Grouped Delivery",
    detail: "Kit arrives sorted and bagged by player, shipped to the club in one drop.",
  },
];

const STEPS = [
  { number: "01", title: "Kit signed off, store built", time: "1–2 weeks" },
  { number: "02", title: "You share one private link", time: "Same day" },
  { number: "03", title: "Players order their own gear", time: "2 weeks open" },
  { number: "04", title: "We produce + deliver grouped", time: "3–4 weeks" },
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

export default function TeamwearStoresPage() {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");
  const [lookupState, setLookupState] = useState<"idle" | "searching" | "notfound">("idle");

  const onLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLookupState("searching");
    setTimeout(() => setLookupState("notfound"), 500);
  };

  return (
    <section style={{ background: "#080808", color: "#f5f5f0", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "72px 24px" : "104px 56px",
        }}
      >
        {/* HERO */}
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
              Team Stores
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
              One link.
              <br />
              One deadline. One delivery.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <Eyebrow>Team Stores</Eyebrow>
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
            TEAM STORES
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            SORTED
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
        </div>

        <div
          style={{
            maxWidth: "520px",
            paddingTop: "18px",
            paddingBottom: isMobile ? "40px" : "56px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.56)",
              margin: 0,
            }}
          >
            No spreadsheets. No chasing sizes. Every player orders their own
            kit through a private store — sizes, names, numbers, payment,
            deadlines.
            <br />
            <span style={{ color: "#ffffff", fontWeight: 600 }}>
              You send one link. We do the rest.
            </span>
          </p>
        </div>

        {/* EXPLANATION */}
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
              <Eyebrow>What's In A Store</Eyebrow>
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
                THE WAY CLUBS
                <br />
                ACTUALLY ORDER
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
              Every team store is private to your club. Only the people with
              the link can order — and you control when it opens and closes.
            </p>
          </div>

          <div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
    gap: isMobile ? "12px" : "16px",
  }}
>
  {STORE_BULLETS.map((bullet) => (
    <div
      key={bullet.label}
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
            fontSize: "16px",
            fontWeight: 900,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "#f5f5f0",
            marginBottom: "6px",
          }}
        >
          {bullet.label}
        </div>

        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "13px",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.56)",
          }}
        >
          {bullet.detail}
        </div>
      </div>
    </div>
  ))}
</div>
        </section>

        {/* HOW IT WORKS */}
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
                LINK OUT
                <br />
                KIT BACK
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
              Four steps. Most of the work happens before the link goes out —
              once it does, the club stops being the middle-person.
            </p>
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
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
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

        {/* FIND YOUR STORE */}
        <section
          style={{
            padding: isMobile ? "64px 0" : "96px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 420px) minmax(0, 560px)",
              gap: isMobile ? "32px" : "80px",
              alignItems: "start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Eyebrow>Find Your Store</Eyebrow>
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
                ALREADY
                <br />
                KITTED WITH US
                <span style={{ color: "#b8f400" }}>?</span>
              </h2>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.56)",
                  margin: "0 0 24px",
                  maxWidth: "480px",
                }}
              >
                Search your club or team to jump back to your store. If you're
                a player, your store link usually comes directly from your club
                admin.
              </p>

              <form
                onSubmit={onLookup}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (lookupState !== "idle") setLookupState("idle");
                  }}
                  placeholder="Enter your team or club"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "52px",
                    padding: "0 20px",
                    background: "#0f0f0f",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "999px",
                    color: "#f5f5f0",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(184,244,0,0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <button
                  type="submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "52px",
                    padding: "0 28px",
                    borderRadius: "999px",
                    background: "#b8f400",
                    color: "#080808",
                    border: "none",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.86")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Find Store
                </button>
              </form>

              {lookupState === "notfound" && (
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#0f0f0f",
                    padding: "18px 20px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  <span style={{ color: "#b8f400", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: "11px", display: "block", marginBottom: "6px" }}>
                    No public match
                  </span>
                  Stores are private — the direct link usually comes from your
                  club admin or coach. If you haven't been kitted with us yet,
                  start a kit below and we'll build one.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FALLBACK CTA */}
        <div
          style={{
            marginTop: isMobile ? "32px" : "40px",
            paddingTop: isMobile ? "40px" : "56px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
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
              No store yet?
            </div>
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: isMobile ? "26px" : "32px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                textTransform: "uppercase",
                color: "#f5f5f0",
              }}
            >
              Start a kit and we'll build one
              <span style={{ color: "#b8f400" }}>.</span>
            </div>
          </div>

          
        </div>
        <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: isMobile ? "flex-start" : "flex-end",
  }}
>
  <Button href="/teamwear/brief">Start a Kit</Button>

  <Button href="/teamwear" variant="secondary">
    Back to Teamwear
  </Button>
</div>
      </div>
    </section>
  );
}