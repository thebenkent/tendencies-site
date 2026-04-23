"use client";

import { SectionLabel, T, useIsMobile } from "./shared";

export function ProductFeatures({
  title = "Why it works",
  description,
  features,
}: {
  title?: string;
  description: string;
  features: string[];
}) {
  const isMobile = useIsMobile();

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.9fr) minmax(0, 1.1fr)",
        gap: isMobile ? "28px" : "56px",
        padding: isMobile ? "40px 0" : "56px 0",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <div>
        <SectionLabel>Product</SectionLabel>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: isMobile ? "32px" : "40px",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.94,
            textTransform: "uppercase",
            color: T.text,
            margin: "0 0 20px",
          }}
        >
          {title}
          <span style={{ color: T.lime }}>.</span>
        </h2>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "15px",
            lineHeight: 1.6,
            color: T.textMuted,
            margin: 0,
            maxWidth: "460px",
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          borderTop: `1px solid ${T.border}`,
        }}
      >
        {features.map((f) => (
          <div
            key={f}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 0",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: T.lime,
                flex: "0 0 auto",
              }}
            />
            <span
              style={{
                fontFamily: T.font,
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: T.text,
              }}
            >
              {f}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
