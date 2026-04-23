"use client";

import { SectionLabel, T, useIsMobile } from "./shared";

export function UseCases({ useCases }: { useCases: string[] }) {
  const isMobile = useIsMobile();
  if (!useCases?.length) return null;

  return (
    <section
      style={{
        padding: isMobile ? "40px 0" : "56px 0",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <SectionLabel>Ideal for</SectionLabel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : `repeat(${Math.min(useCases.length, 4)}, 1fr)`,
          gap: "1px",
          background: T.border,
          border: `1px solid ${T.border}`,
        }}
      >
        {useCases.map((c, i) => (
          <div
            key={c}
            style={{
              background: T.bg,
              padding: "24px 22px",
              minHeight: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "18px",
            }}
          >
            <div
              style={{
                fontFamily: T.font,
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: T.lime,
              }}
            >
              0{i + 1}
            </div>
            <div
              style={{
                fontFamily: T.font,
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "-0.005em",
                color: T.text,
                lineHeight: 1.3,
              }}
            >
              {c}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
