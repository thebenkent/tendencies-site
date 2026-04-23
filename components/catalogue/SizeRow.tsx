"use client";

import { SectionLabel, T, useIsMobile } from "./shared";

export function SizeRow({ sizes }: { sizes: string[] }) {
  const isMobile = useIsMobile();
  if (!sizes?.length) return null;

  return (
    <section
      style={{
        padding: isMobile ? "32px 0" : "40px 0",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <SectionLabel>Size</SectionLabel>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {sizes.map((s) => (
          <span
            key={s}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "48px",
              height: "40px",
              padding: "0 14px",
              border: `1px solid ${T.borderStrong}`,
              borderRadius: "2px",
              fontFamily: T.font,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: T.text,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
