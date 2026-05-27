"use client";

import { useState } from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";

const CASES = [
  {
    client: "Unilever",
    tag: "Branded Apparel",
    title: "Promotional Vest",
    img: "/work-lynx.jpg",
    bg: "#dcdad8",
    imgSize: "148%",
    imgPosition: "26% 44%",
    href: "/work/unilever-vest",
  },
  {
    client: "Corporate Apparel",
    tag: "Corporate",
    title: "Embroidered Knitwear",
    img: "/work-knitwear.jpg",
    bg: "#cccece",
    imgSize: "230%",
    imgPosition: "50% 38%",
    href: "/work",
  },
];

function CaseCard({
  project,
  isMobile,
}: {
  project: (typeof CASES)[0];
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={project.href}
      style={{ display: "block", textDecoration: "none" }}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: isMobile ? "300px" : "440px",
          backgroundColor: project.bg,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${project.img})`,
            backgroundSize: project.imgSize,
            backgroundRepeat: "no-repeat",
            backgroundPosition: project.imgPosition,
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
      <div
        style={{
          paddingTop: "16px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <div
            className="meta"
            style={{ marginBottom: "6px" }}
          >
            {project.client} · {project.tag}
          </div>
          <div
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {project.title}
          </div>
        </div>
        <div
          style={{
            color: hovered ? "#b8f400" : "rgba(255,255,255,0.3)",
            transition: "color 0.2s ease",
            paddingLeft: "16px",
            flexShrink: 0,
            fontSize: "16px",
          }}
        >
          →
        </div>
      </div>
    </Link>
  );
}

export default function SupportingWork() {
  const isMobile = useIsMobile();

  return (
    <section
      style={{
        padding: isMobile ? "0 20px 64px" : "0 48px 96px",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "40px" : "8px",
        }}
      >
        {CASES.map((c) => (
          <CaseCard key={c.title} project={c} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}
