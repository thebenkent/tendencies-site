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
        position: "relative",
        padding: isMobile
          ? "64px 20px 72px"
          : "96px 48px 96px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        overflowX: "clip",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 75% 20%, rgba(184,244,0,0.09), transparent 28%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.045), transparent 24%)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 70%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(72px, 10vw, 152px)",
            fontWeight: 900,
            letterSpacing: "-0.065em",
            lineHeight: 0.84,
            textTransform: "uppercase",
            margin: "0 0 28px",
            color: "#f5f5f0",
            maxWidth: "100%",
            ...fade("0.15s"),
          }}
        >
          PROMO MERCH.
          <br />
          KEPT AND USED
          <span style={{ color: "#b8f400" }}>.</span>
        </h1>

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
              maxWidth: isMobile ? "100%" : "420px",
            }}
          >
            We design and source branded product people actually keep.
          </p>

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
              flexShrink: 0,
            }}
          >
            Start a Project →
          </a>
        </div>
      </div>
    </section>
  );
}
