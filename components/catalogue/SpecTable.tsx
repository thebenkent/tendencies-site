"use client";

import { SectionLabel, T, useIsMobile } from "./shared";
import type { SpecRow } from "@/lib/products/types";

export function SpecTable({
  specs,
  sourcing,
}: {
  specs: SpecRow[];
  sourcing?: string;
}) {
  const isMobile = useIsMobile();
  if (!specs?.length) return null;

  return (
    <section
      style={{
        padding: isMobile ? "40px 0" : "56px 0",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.9fr) minmax(0, 1.1fr)",
          gap: isMobile ? "24px" : "56px",
          marginBottom: "24px",
        }}
      >
        <div>
          <SectionLabel>Specs</SectionLabel>
          <h2
            style={{
              fontFamily: T.font,
              fontSize: isMobile ? "32px" : "40px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.94,
              textTransform: "uppercase",
              color: T.text,
              margin: 0,
            }}
          >
            Material & build
            <span style={{ color: T.lime }}>.</span>
          </h2>
        </div>
        {sourcing && (
          <p
            style={{
              fontFamily: T.font,
              fontSize: "15px",
              lineHeight: 1.6,
              color: T.textMuted,
              margin: 0,
              alignSelf: "end",
              maxWidth: "460px",
            }}
          >
            {sourcing}
          </p>
        )}
      </div>

      <div
        style={{
          borderTop: `1px solid ${T.border}`,
        }}
      >
        {specs.map((row) => (
          <div
            key={row.label}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
              gap: isMobile ? "4px" : "40px",
              padding: "18px 0",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontFamily: T.font,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: T.textDim,
              }}
            >
              {row.label}
            </div>
            <div
              style={{
                fontFamily: T.font,
                fontSize: "14px",
                lineHeight: 1.5,
                color: T.text,
              }}
            >
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
