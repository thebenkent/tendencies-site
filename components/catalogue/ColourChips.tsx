"use client";

import { SectionLabel, T, useIsMobile } from "./shared";
import type { ColourOption } from "@/lib/products/types";

export function ColourChips({ colours }: { colours: ColourOption[] }) {
  const isMobile = useIsMobile();
  if (!colours?.length) return null;

  return (
    <section
      style={{
        padding: isMobile ? "32px 0" : "40px 0",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <SectionLabel>Colour</SectionLabel>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          rowGap: "24px",
        }}
      >
        {colours.map((c) => (
          <div
            key={c.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              aria-label={c.name}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: c.hex,
                border: `1px solid rgba(255,255,255,0.14)`,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)",
              }}
            />
            <span
              style={{
                fontFamily: T.font,
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: T.textMuted,
              }}
            >
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
