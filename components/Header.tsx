"use client";

import { useState, useEffect } from "react";

// ─── Nav link data ────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "/work",         label: "Work"         },
  { href: "/what-we-do",  label: "What We Do"   },
  { href: "/process",     label: "How It Works" },
  { href: "/catalogue",   label: "Catalogue"    },
  { href: "/teamwear",    label: "Teamwear"     },
];

// ─── Shared token values ──────────────────────────────────────────────────────
const ACCENT   = "#b8f400";
const BG       = "#080808";
const FONT     = "Helvetica, Arial, sans-serif";

export default function Header() {
  // ── Responsive state ───────────────────────────────────────────────────────
  // isMobile drives which UI is rendered. Defaults to false (desktop) so
  // Next.js SSR output is never empty — a minor rehydration paint on
  // narrow viewports is acceptable; no layout shift on desktop.
  const [isMobile, setIsMobile] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (!e.matches) setOpen(false); // close drawer on resize to desktop
    };

    handleChange(mq);                        // run once on mount
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // ── Lock body scroll while drawer is open ──────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const closeDrawer = () => setOpen(false);

  // ── Shared style objects ───────────────────────────────────────────────────
  const desktopNavLink: React.CSSProperties = {
    fontFamily:     FONT,
    fontSize:       "12px",
    letterSpacing:  "0.12em",
    textTransform:  "uppercase",
    color:          "rgba(255,255,255,0.62)",
    textDecoration: "none",
    transition:     "color 0.2s ease",
    padding:        "4px 0",   // extra tap clearance without visual change
  };

  const ctaPill: React.CSSProperties = {
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    height:         "38px",
    padding:        "0 18px",
    borderRadius:   "999px",
    background:     ACCENT,
    color:          BG,
    textDecoration: "none",
    fontFamily:     FONT,
    fontSize:       "12px",
    fontWeight:     700,
    letterSpacing:  "0.08em",
    textTransform:  "uppercase",
    transition:     "opacity 0.2s ease",
    whiteSpace:     "nowrap",
    flexShrink:     0,
  };

  // ── Bar dimensions for the hamburger icon ─────────────────────────────────
  // 3 bars × 2 px tall, 5 px gap  →  center-to-center = 7 px
  // translateY(±7px) + rotate(±45deg) forms a clean ✕
  const barBase: React.CSSProperties = {
    display:         "block",
    width:           "22px",
    height:          "2px",
    background:      "#ffffff",
    borderRadius:    "2px",
    transformOrigin: "center",
    transition:      "transform 0.25s ease, opacity 0.25s ease",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Fixed bar ──────────────────────────────────────────────────────── */}
      <header
        style={{
          position:     "fixed",
          top:          0,
          left:         0,
          right:        0,
          zIndex:       1000,
          height:       "64px",
          // Tighter padding on mobile so nothing overflows
          padding: isMobile ? "0 16px" : "0 48px",
          alignItems:   "center",
          justifyContent: "space-between",
          background:   "rgba(8,8,8,0.94)",
          backdropFilter:       "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxSizing:    "border-box",
          overflow:     "hidden",
        }}
        >
        {/* Logo */}
        <a
          href="/"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            textDecoration: "none",
            flexShrink:     0,
          }}
        >
          <img
            src="/tendencies-logo.svg"
            alt="Tendencies"
            style={{ height: "30px",
            width: "auto",
          maxWidth: isMobile ? "210px" : "260px",
          display: "block" }}
          />
        </a>

        {/* ── Desktop nav (≥768 px) ───────────────────────────────────────── */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={desktopNavLink}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.62)")}
              >
                {link.label}
              </a>
            ))}

            <a
              href="/start-a-project"
              style={ctaPill}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Start a Project
            </a>
          </nav>
        )}

        {/* ── Hamburger button (<768 px) ──────────────────────────────────── */}
        {isMobile && (
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              display:        "flex",
              flexDirection:  "column",
              justifyContent: "center",
              alignItems:     "center",
              gap:            "5px",
              background:     "none",
              border:         "none",
              cursor:         "pointer",
              // 44 × 44 px minimum tap target
              minWidth:  "44px",
              minHeight: "44px",
              padding:   "11px",
              flexShrink: 0,
            }}
          >
            {/* Bar 0 — rotates to form top arm of ✕ */}
            <span style={{
              ...barBase,
              transform: open ? "translateY(7px) rotate(45deg)" : "none",
            }} />
            {/* Bar 1 — fades out when open */}
            <span style={{
              ...barBase,
              opacity:   open ? 0 : 1,
              transform: open ? "scaleX(0)" : "none",
            }} />
            {/* Bar 2 — rotates to form bottom arm of ✕ */}
            <span style={{
              ...barBase,
              transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            }} />
          </button>
        )}
      </header>

      {/* ── Mobile drawer (<768 px) ─────────────────────────────────────────── */}
      {isMobile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          style={{
            position:   "fixed",
            top:        "64px",     // sits flush under the fixed bar
            left:       0,
            right:      0,
            bottom:     0,
            zIndex:     999,
            background: BG,
            display:    "flex",
            flexDirection: "column",
            padding:    "8px 20px 40px",
            overflowY:  "auto",
            boxSizing:  "border-box",
            // Slide in from the right
            transform:  open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            // Keep it off-screen but mounted so the transition plays
            visibility: open ? "visible" : "hidden",
          }}
        >
          {/* Nav links */}
          <nav style={{ flex: 1 }}>
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  padding:        "20px 0",
                  borderBottom:   "1px solid rgba(255,255,255,0.06)",
                  color:          "#ffffff",
                  textDecoration: "none",
                  fontFamily:     FONT,
                  // Fluid size between 22–28 px
                  fontSize:       "clamp(22px, 6vw, 28px)",
                  fontWeight:     800,
                  letterSpacing:  "-0.02em",
                  textTransform:  "uppercase",
                  // Staggered entrance per link
                  opacity:        open ? 1 : 0,
                  transform:      open ? "translateX(0)" : "translateX(20px)",
                  transition: [
                    `opacity  0.28s ease ${i * 0.045 + 0.08}s`,
                    `transform 0.28s ease ${i * 0.045 + 0.08}s`,
                  ].join(", "),
                }}
              >
                {link.label}
                <span style={{
                  color:    "rgba(255,255,255,0.2)",
                  fontSize: "18px",
                  flexShrink: 0,
                }}>
                  →
                </span>
              </a>
            ))}
          </nav>

          {/* CTA — staggered after the last nav link */}
          <a
            href="/start-a-project"
            onClick={closeDrawer}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              height:         "56px",
              borderRadius:   "999px",
              background:     ACCENT,
              color:          BG,
              textDecoration: "none",
              fontFamily:     FONT,
              fontSize:       "13px",
              fontWeight:     700,
              letterSpacing:  "0.08em",
              textTransform:  "uppercase",
              marginTop:      "28px",
              flexShrink:     0,
              // Entrance after nav links finish
              opacity:        open ? 1 : 0,
              transform:      open ? "translateY(0)" : "translateY(10px)",
              transition: [
                `opacity   0.28s ease ${NAV_LINKS.length * 0.045 + 0.12}s`,
                `transform 0.28s ease ${NAV_LINKS.length * 0.045 + 0.12}s`,
              ].join(", "),
            }}
          >
            Start a Project
          </a>
        </div>
      )}
    </>
  );
}
