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
    imgPosition: "center 20%",
    href: "/work/unilever-vest",
  },
  {
    client: "Corporate Apparel",
    tag: "Corporate",
    title: "Embroidered Knitwear",
    img: "/work-knitwear.jpg",
    imgPosition: "center 30%",
    href: "/work",
  },
];

function CaseCard({
  project,
  isMobile,
}: {
  project: (typeof CASES)[0] & { imgPosition?: string };
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
          height: isMobile ? "260px" : "360px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${project.img})`,
            backgroundSize: "cover",
            backgroundPosition: project.imgPosition ?? "center",
            transform: hovered ? "scale(1.05)" : "scale(1)",
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
            style={{ marginBottom: "4px" }}
          >
            {project.client} · {project.tag}
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "-0.025em",
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
          gap: isMobile ? "48px" : "24px",
        }}
      >
        {CASES.map((c) => (
          <CaseCard key={c.title} project={c} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}
