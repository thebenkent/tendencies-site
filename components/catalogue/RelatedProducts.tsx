"use client";

import { FramedImage, SectionLabel, T, useIsMobile } from "./shared";
import type { Product } from "@/lib/products/types";

export function RelatedProducts({ products }: { products: Product[] }) {
  const isMobile = useIsMobile();
  if (!products?.length) return null;

  const visible = products.slice(0, 3);

  return (
    <section
      style={{
        padding: isMobile ? "40px 0" : "64px 0",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <SectionLabel>Related product</SectionLabel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : `repeat(${visible.length}, 1fr)`,
          gap: "20px",
        }}
      >
        {visible.map((p) => (
          <a
            key={p.slug}
            href={`/catalogue/${p.slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.86")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            <FramedImage
              src={p.hero.src}
              alt={p.hero.alt}
              aspect="5/4"
              brightness={0.92}
            />
            <div style={{ paddingTop: "14px" }}>
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: T.textDim,
                  marginBottom: "6px",
                }}
              >
                {p.subcategory}
              </div>
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "16px",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  color: T.text,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: T.textMuted,
                  marginTop: "4px",
                }}
              >
                {p.descriptor}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
