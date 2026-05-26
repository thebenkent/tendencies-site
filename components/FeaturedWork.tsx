"use client";

import { useState } from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function FeaturedWork() {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section
      style={{
        padding: isMobile ? "80px 20px 0" : "144px 48px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div
          className="eyebrow"
          style={{ marginBottom: isMobile ? "32px" : "48px" }}
        >
          Featured Work
        </div>

        <Link
          href="/work/milo-ball"
          style={{ display: "block", textDecoration: "none" }}
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={() => !isMobile && setHovered(false)}
        >
          {/* Primary image */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              height: isMobile ? "320px" : "560px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url(/milo-soccer-ball.png)",
                backgroundSize: "cover",
                backgroundPosition: "center 38%",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>

          {/* Caption */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingTop: "20px",
              marginTop: "0",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <div
                className="meta"
                style={{ marginBottom: "6px" }}
              >
                Nestlé Milo · Campaign Merch
              </div>
              <div
                style={{
                  fontSize: isMobile
                    ? "clamp(20px, 5.5vw, 26px)"
                    : "clamp(22px, 2vw, 30px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                Promotional Soccer Ball
              </div>
            </div>
            <div
              style={{
                fontSize: "18px",
                color: hovered ? "#b8f400" : "rgba(255,255,255,0.3)",
                transition: "color 0.2s ease",
                flexShrink: 0,
                paddingLeft: "24px",
              }}
            >
              →
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
