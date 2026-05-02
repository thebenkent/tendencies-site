"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

export default function CTA() {
  const isMobile = useIsMobile();

  return (
    <section
      style={{
        background: "#b8f400",
        padding: isMobile ? "56px 20px 64px" : "96px 48px",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) auto",
          alignItems: "end",
          gap: isMobile ? "32px" : "48px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(8,8,8,0.58)",
              marginBottom: "16px",
            }}
          >
            Start a project
          </div>

          <h2
            style={{
              fontSize: isMobile
                ? "clamp(52px, 16vw, 72px)"
                : "clamp(64px, 10vw, 120px)",
              fontWeight: 900,
              lineHeight: 0.84,
              letterSpacing: "-0.06em",
              textTransform: "uppercase",
              margin: 0,
              color: "#080808",
              wordBreak: "break-word",
            }}
          >
            LET&apos;S
            <br />
            BUILD
            <br />
            SOMETHING.
          </h2>
        </div>

        <div
          style={{
            textAlign: isMobile ? "left" : "right",
            maxWidth: isMobile ? "100%" : "280px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
              fontWeight: 500,
              color: "rgba(8,8,8,0.66)",
              margin: isMobile ? "0 0 24px" : "0 0 20px",
            }}
          >
            Big enough to deliver.
            <br />
            Small enough to care.
          </p>

          <a
            href="/start-a-project"
            style={{
              display: isMobile ? "flex" : "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "52px",
              padding: "0 28px",
              borderRadius: "999px",
              background: "#080808",
              color: "#b8f400",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              width: isMobile ? "100%" : "auto",
              maxWidth: isMobile ? "300px" : "none",
              boxSizing: "border-box",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              transform: "translateY(0)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={
              !isMobile
                ? (e) => {
                    e.currentTarget.style.opacity = "0.88";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                : undefined
            }
            onMouseLeave={
              !isMobile
                ? (e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                : undefined
            }
          >
            Start a Project →
          </a>
        </div>
      </div>
    </section>
  );
}