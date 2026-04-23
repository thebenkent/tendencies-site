"use client";

import { useEffect, useRef, useState } from "react";
import FilterPill from "@/components/FilterPill";
import StyleCard from "@/components/StyleCard";

const PRIMARY_FILTERS = [
  "All",
  "Rugby",
  "League",
  "Netball",
  "Basketball",
  "Football",
  "Touch",
  "Hockey",
  "Off-Field",
];

const MORE_FILTERS = ["Cricket", "Baseball", "Lawn Bowls"];

const STYLE_CARDS = [
  {
    id: "touch-01",
    sport: "Touch",
    name: "Touch 01",
    desc: "Modern panel build · strong side seam",
    image: "/styles/touch-01.jpg",
  },
  {
    id: "touch-02",
    sport: "Touch",
    name: "Touch 02",
    desc: "Clean gradient fade · sponsor-friendly",
    image: "/styles/touch-02.jpg",
  },
  {
    id: "rugby-01",
    sport: "Rugby",
    name: "Rugby 01",
    desc: "Shoulder block · bold identity",
    image: "/styles/rugby-01.jpg",
  },
  {
    id: "league-01",
    sport: "League",
    name: "League 01",
    desc: "Angular chest block · built for sponsor clarity",
    image: "/styles/league-01.jpg",
  },
  {
    id: "netball-01",
    sport: "Netball",
    name: "Netball 01",
    desc: "Vertical contour · clean side structure",
    image: "/styles/netball-01.jpg",
  },
  {
    id: "basketball-01",
    sport: "Basketball",
    name: "Basketball 01",
    desc: "Side panel · full kit ready",
    image: "/styles/basketball-01.jpg",
  },
  {
    id: "football-01",
    sport: "Football",
    name: "Football 01",
    desc: "Clean chest zone · modern trim",
    image: "/styles/football-01.jpg",
  },
  {
    id: "hockey-01",
    sport: "Hockey",
    name: "Hockey 01",
    desc: "Sharp contrast panel · streamlined front",
    image: "/styles/hockey-01.jpg",
  },
  {
    id: "cricket-01",
    sport: "Cricket",
    name: "Cricket 01",
    desc: "Lightweight long-sleeve base · sponsor-led chest",
    image: "/styles/cricket-01.jpg",
  },
  {
    id: "baseball-01",
    sport: "Baseball",
    name: "Baseball 01",
    desc: "Button-front look · clean sleeve placement",
    image: "/styles/baseball-01.jpg",
  },
  {
    id: "lawn-bowls-01",
    sport: "Lawn Bowls",
    name: "Lawn Bowls 01",
    desc: "Polished club polo base · off-field crossover",
    image: "/styles/lawn-bowls-01.jpg",
  },
  {
    id: "off-field-01",
    sport: "Off-Field",
    name: "Off-Field 01",
    desc: "Hoodie · supporter and travel ready",
    image: "/styles/offfield-01.jpg",
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
function MoreDropdown({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (sport: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveMore = MORE_FILTERS.includes(active);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "40px",
          padding: "0 12px",
          borderRadius: "999px",
          border: hasActiveMore
            ? "1px solid #b8f400"
            : "1px solid rgba(255,255,255,0.18)",
          background: hasActiveMore ? "#b8f400" : "transparent",
          color: hasActiveMore ? "#080808" : "#ffffff",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        More
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: 0,
            minWidth: "180px",
            background: "#0f0f0f",
            border: "1px solid rgba(255,255,255,0.08)",
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          {MORE_FILTERS.map((sport) => (
            <button
              key={sport}
              onClick={() => {
                onSelect(sport);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                border: "none",
                borderBottom:
                  sport === MORE_FILTERS[MORE_FILTERS.length - 1]
                    ? "none"
                    : "1px solid rgba(255,255,255,0.06)",
                background: active === sport ? "rgba(184,244,0,0.08)" : "#0f0f0f",
                color: "#f5f5f0",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.04em",
                cursor: "pointer",
              }}
            >
              {sport}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamwearStylesPage() {
  const isMobile = useIsMobile();
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? STYLE_CARDS
      : STYLE_CARDS.filter((styleData) => styleData.sport === active);

  return (
    <section style={{ background: "#080808", color: "#f5f5f0" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "72px 24px" : "104px 56px",
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
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Start From A Style
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
              Proven starting points
              <br />
              built into full kit
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <Eyebrow>Teamwear · Styles</Eyebrow>

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
            START FROM
            <br />
            A STYLE
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
            Choose a proven base design, then we customise colours, logos,
            sponsor placement, and the wider range.
            <br />
            <span style={{ color: "#ffffff", fontWeight: 600 }}>
              Fastest path to kit.
            </span>
          </p>
        </div>

        <div
          style={{
            paddingTop: isMobile ? "16px" : "24px",
            paddingBottom: isMobile ? "32px" : "48px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.44)",
              marginBottom: "16px",
            }}
          >
            Filter by sport
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {PRIMARY_FILTERS.map((sport) => (
              <FilterPill
                key={sport}
                label={sport}
                active={active === sport}
                onClick={() => setActive(sport)}
              />
            ))}

            <MoreDropdown active={active} onSelect={(s) => setActive(s)} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "8px",
            paddingBottom: "20px",
            marginBottom: "24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#f5f5f0",
            }}
          >
            {active === "All" ? "All Styles" : `${active} Styles`}
            <span
              style={{
                color: "rgba(255,255,255,0.42)",
                marginLeft: "10px",
                fontWeight: 400,
              }}
            >
              · {filtered.length} {filtered.length === 1 ? "style" : "styles"}
            </span>
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
            Click a style to start a brief
          </div>
        </div>

        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: isMobile ? "16px" : "20px",
            }}
          >
            {filtered.map((styleData) => (
  <StyleCard key={styleData.id} styleData={styleData} />
))}
          </div>
        ) : (
          <div
            style={{
              padding: "64px 32px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f0f0f",
            }}
          >
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "20px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "#f5f5f0",
                marginBottom: "10px",
              }}
            >
              No styles yet for {active}
              <span style={{ color: "#b8f400" }}>.</span>
            </div>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.56)",
                maxWidth: "420px",
                margin: "0 auto 24px",
              }}
            >
              We kit this sport every season — the base styles just aren't live
              on the page yet. Send a brief and we'll put direction in front of
              you within the week.
            </p>

            <a
              href="/teamwear/brief"
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
              }}
            >
              Start a Brief
            </a>
          </div>
        )}

        <div
          style={{
            marginTop: isMobile ? "64px" : "96px",
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
              Nothing quite right?
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
              Design from scratch instead
              <span style={{ color: "#b8f400" }}>.</span>
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
            <a
              href="/teamwear/brief"
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
              }}
            >
              Start a Brief
            </a>

            <a
              href="/teamwear"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 24px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#ffffff",
                textDecoration: "none",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
              }}
            >
              Back to Teamwear
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}