"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const PROJECTS = [
  {
    id: "milo",
    client: "Nestlé Milo",
    title: "Promotional Soccer Ball",
    outcome:
      "High-impact giveaway designed to drive engagement and brand recall.",
    tag: "Campaign Merch",
    img: "/work-milo.jpg",
  },
  {
    id: "lynx",
    client: "Unilever / Lynx",
    title: "Promotional Vest",
    outcome:
      "Multi-brand apparel built for real-world activation. Issued — and actually worn.",
    tag: "Branded Apparel",
    img: "/work-lynx.jpg",
  },
  {
    id: "knitwear",
    client: "Corporate Apparel",
    title: "Embroidered Knitwear",
    outcome:
      "Clean, elevated teamwear designed to be worn well beyond day one.",
    tag: "Corporate Apparel",
    img: "/work-knitwear.jpg",
  },
];

function Card({
  project,
  large = false,
  isMobile = false,
}: {
  project: (typeof PROJECTS)[0];
  large?: boolean;
  isMobile?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={!isMobile ? () => setHovered(true) : undefined}
      onMouseLeave={!isMobile ? () => setHovered(false) : undefined}
      onMouseMove={!isMobile ? onMove : undefined}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        minHeight: large
          ? isMobile
            ? "320px"
            : "560px"
          : isMobile
          ? "240px"
          : "274px",
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.06)",
        transition:
  "border-color 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        borderColor: hovered
          ? "rgba(184,244,0,0.25)"
          : "rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        transform: hovered && !isMobile ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {hovered && !isMobile && (
        <div
          style={{
            position: "absolute",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(184,244,0,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
            left: mousePos.x - 140,
            top: mousePos.y - 140,
            zIndex: 1,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
         backgroundImage: `url(${project.img})`,
backgroundSize: "cover",
backgroundPosition: "center",
transform: hovered && !isMobile ? "scale(1.08)" : "scale(1)",

transition:
  "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease",

filter: hovered && !isMobile
  ? "brightness(0.42) contrast(1.1) saturate(1.05)"
  : "brightness(0.32) contrast(1.08) saturate(1.02)", }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: large
            ? "linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.28) 52%, transparent 100%)"
            : "linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.42) 55%, transparent 100%)",
          zIndex: 2,
        }}
      />
<div
  style={{
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url('https://grainy-gradients.vercel.app/noise.svg')",
    opacity: 0.06,
    mixBlendMode: "overlay",
    zIndex: 2,
    pointerEvents: "none",
  }}
/>
      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "18px",
          zIndex: 4,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: hovered ? "#000" : "#b8f400",
          background: hovered ? "#b8f400" : "rgba(184,244,0,0.1)",
          border: "1px solid rgba(184,244,0,0.25)",
          padding: "5px 10px",
          borderRadius: "2px",
          transition: "all 0.25s ease",
        }}
      >
        {project.tag}
      </div>

      <div
        style={{
          position: "absolute",
          top: "18px",
          right: "18px",
          zIndex: 4,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: hovered ? "#000" : "#fff",
          background: hovered ? "#b8f400" : "transparent",
          opacity: hovered && !isMobile ? 1 : 0,
          transition: "all 0.25s ease",
          transform:
            hovered && !isMobile ? "scale(1)" : "scale(0.8)",
        }}
      >
        ↗
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          padding: isMobile ? "20px" : large ? "28px" : "22px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            marginBottom: "6px",
          }}
        >
          {project.client}
        </div>

        <div
          style={{
            fontSize: large
              ? "clamp(28px, 2.4vw, 38px)"
              : isMobile
              ? "clamp(20px, 5.5vw, 28px)"
              : "22px",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.95,
            marginBottom: "10px",
            maxWidth: large ? "440px" : "100%",
            wordBreak: "break-word",
          }}
        >
          {project.title}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.68)",
            lineHeight: 1.55,
            maxWidth: large ? "340px" : "100%",
            opacity: hovered ? 1 : 0.76,
            transform:
              hovered && !isMobile
                ? "translateY(0)"
                : "translateY(4px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {project.outcome}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedWork() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#080808",
        padding: isMobile ? "52px 20px 64px" : "88px 48px 96px",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: isMobile ? "12px" : "24px",
            marginBottom: isMobile ? "24px" : "36px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b8f400",
                marginBottom: "10px",
              }}
            >
              Featured Work
            </div>

            <h2
              style={{
                fontSize: "clamp(48px, 6.2vw, 88px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 0.9,
                color: "#fff",
              }}
            >
              Work That
              <br />
              Gets Used.
            </h2>
          </div>

          <a
            href="/work"
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.14)",
              paddingBottom: "2px",
              whiteSpace: "nowrap",
            }}
          >
            All case studies →
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr",
            gap: "12px",
            alignItems: "stretch",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.9s ease 0.12s, transform 0.9s ease 0.12s",
          }}
        >
          <Card project={PROJECTS[0]} large isMobile={isMobile} />

          <div
            style={{
              display: "grid",
              gridTemplateRows: isMobile ? "auto" : "1fr 1fr",
              gap: "12px",
            }}
          >
            <Card project={PROJECTS[1]} isMobile={isMobile} />
            <Card project={PROJECTS[2]} isMobile={isMobile} />
          </div>
        </div>
      </div>
    </section>
  );
}