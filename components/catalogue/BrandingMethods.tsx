"use client";

import { SectionLabel, T, useIsMobile } from "./shared";
import { BRANDING_METHOD_META } from "@/lib/products/branding";
import type { BrandingMethod } from "@/lib/products/types";

export function BrandingMethods({ methods }: { methods: BrandingMethod[] }) {
  const isMobile = useIsMobile();
  if (!methods?.length) return null;

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
          <SectionLabel>Branding</SectionLabel>
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
            Branding methods
            <span style={{ color: T.lime }}>.</span>
          </h2>
        </div>
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
          Every method below is production-ready on this product. We'll
          recommend the best fit based on your artwork, run size, and feel.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1px",
          background: T.border,
          border: `1px solid ${T.border}`,
        }}
      >
        {methods.map((m) => {
          const meta = BRANDING_METHOD_META[m];
          return (
            <div
              key={m}
              style={{
                background: T.bg,
                padding: "22px",
                minHeight: "140px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: T.lime,
                  }}
                />
                <span
                  style={{
                    fontFamily: T.font,
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: T.text,
                  }}
                >
                  {meta.label}
                </span>
              </div>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "13px",
                  lineHeight: 1.55,
                  color: T.textMuted,
                  margin: 0,
                }}
              >
                {meta.blurb}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
