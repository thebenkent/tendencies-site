"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Hero() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay: string): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  });

  return (
    <section
      style={{
        padding: isMobile
          ? "40px 20px 56px"
          : "clamp(72px, 10vw, 152px) clamp(20px, 5vw, 48px) 72px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        overflowX: "clip",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        
        {/* TOP META */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "space-between",
            marginBottom: isMobile ? "24px" : "36px",
            ...fade("0s"),
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: "6px",
              }}
            >
              Since · 2009
            </div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.58)",
              }}
            >
              Auckland · Melbourne · Shenzhen
            </div>
          </div>

          {!isMobile && (
            <div style={{ textAlign: "right", maxWidth: "320px" }}>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.55,
                }}
              >
                Custom merch & apparel.
                <br />
                Designed to be re-used.
              </div>
            </div>
          )}
        </div>

        {/* LIME ACCENT */}
        <div
          style={{
            width: isMobile ? "32px" : "48px",
            height: "2px",
            background: "#b8f400",
            marginBottom: isMobile ? "20px" : "28px",
            ...fade("0.1s"),
          }}
        />

        {/* HEADLINE */}
        <h1
          style={{
            fontSize: "clamp(72px, 10vw, 152px)",
            fontWeight: 900,
            letterSpacing: "-0.065em",
            lineHeight: 0.84,
            textTransform: "uppercase",
            margin: "0 0 24px",
            color: "#f5f5f0",
            maxWidth: "100%",
            ...fade("0.15s"),
          }}
        >
          DONE
          <br />
          PROPERLY
          <span style={{ color: "#b8f400" }}>.</span>
        </h1>

        {/* BOTTOM SECTION */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            gap: isMobile ? "28px" : "48px",
            ...fade("0.25s"),
          }}
        >
          <p
            style={{
              fontSize: isMobile ? "14px" : "15px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.52)",
              margin: 0,
              maxWidth: isMobile ? "300px" : "420px",
            }}
          >
            Merch and apparel built to last beyond the campaign.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "10px",
              width: isMobile ? "100%" : "auto",
              flexShrink: 0,
            }}
          >
            <a
              href="/start-a-project"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 24px",
                borderRadius: "999px",
                background: "#b8f400",
                color: "#080808",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                width: isMobile ? "100%" : "auto",
                maxWidth: isMobile ? "300px" : "none",
                boxSizing: "border-box",
              }}
            >
              Start a Project
            </a>

            <a
              href="/work"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 24px",
                borderRadius: "999px",
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.18)",
                whiteSpace: "nowrap",
                width: isMobile ? "100%" : "auto",
                maxWidth: isMobile ? "300px" : "none",
                boxSizing: "border-box",
              }}
            >
              View Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}