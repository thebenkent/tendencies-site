"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/work",        label: "Work"         },
  { href: "/what-we-do", label: "What We Do"   },
  { href: "/process",    label: "How It Works" },
  { href: "/catalogue",  label: "Catalogue"    },
  { href: "/teamwear",   label: "Teamwear"     },
];

const ACCENT = "#b8f400";
const BG     = "#080808";
const FONT   = "Helvetica, Arial, sans-serif";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handle = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (!e.matches) setOpen(false);
    };
    handle(mq);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const closeDrawer = () => setOpen(false);

  const barBase: React.CSSProperties = {
    display:         "block",
    width:           "22px",
    height:          "2px",
    background:      "#fff",
    borderRadius:    "2px",
    transformOrigin: "center",
    transition:      "transform 0.25s ease, opacity 0.25s ease",
  };

  return (
    <>
      <header style={{
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        zIndex:         1000,
        height:         "64px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        isMobile ? "0 20px" : "0 48px",
        background:     "rgba(8,8,8,0.94)",
        backdropFilter:       "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom:   "1px solid rgba(255,255,255,0.06)",
        boxSizing:      "border-box",
      }}>

        <a href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <img
            src="/tendencies-logo.svg"
            alt="Tendencies"
            style={{ height: isMobile ? "22px" : "30px", width: "auto", display: "block" }}
          />
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
            {NAV_LINKS.map((link) => (
              
                key={link.href}
                href={link.href}
                style={{
                  fontFamily:     FONT,
                  fontSize:       "12px",
                  letterSpacing:  "0.12em",
                  textTransform:  "uppercase",
                  color:          "rgba(255,255,255,0.62)",
                  textDecoration: "none",
                  whiteSpace:     "nowrap",
                  transition:     "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.62)")}
              >
                {link.label}
              </a>
            ))}
            
              href="/start-a-project"
              style={{
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
                whiteSpace:     "nowrap",
                flexShrink:     0,
                transition:     "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Start a Project
            </a>
          </nav>
        )}

        {isMobile && (
          <button
            onClick={() => setOpen((p) => !p)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center",
              gap: "5px", background: "none", border: "none",
              cursor: "pointer", minWidth: "44px", minHeight: "44px",
              padding: "11px", flexShrink: 0,
            }}
          >
            <span style={{ ...barBase, transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ ...barBase, opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }} />
            <span style={{ ...barBase, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        )}
      </header>

      {isMobile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          style={{
            position: "fixed", top: "64px", left: 0, right: 0, bottom: 0,
            zIndex: 999, background: BG,
            display: "flex", flexDirection: "column",
            padding: "8px 20px 40px", overflowY: "auto", boxSizing: "border-box",
            transform:  open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            visibility: open ? "visible" : "hidden",
          }}
        >
          <nav style={{ flex: 1 }}>
            {NAV_LINKS.map((link, i) => (
              
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "20px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  color: "#fff", textDecoration: "none",
                  fontFamily: FONT,
                  fontSize: "clamp(22px, 6vw, 28px)",
                  fontWeight: 800, letterSpacing: "-0.02em", textTransform: "uppercase",
                  opacity:   open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 0.28s ease ${i * 0.045 + 0.08}s, transform 0.28s ease ${i * 0.045 + 0.08}s`,
                }}
              >
                {link.label}
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "18px", flexShrink: 0 }}>→</span>
              </a>
            ))}
          </nav>
          
            href="/start-a-project"
            onClick={closeDrawer}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "56px", borderRadius: "999px",
              background: ACCENT, color: BG, textDecoration: "none",
              fontFamily: FONT, fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginTop: "28px", flexShrink: 0,
              opacity:   open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.28s ease ${NAV_LINKS.length * 0.045 + 0.12}s, transform 0.28s ease ${NAV_LINKS.length * 0.045 + 0.12}s`,
            }}
          >
            Start a Project
          </a>
        </div>
      )}
    </>
  );
}