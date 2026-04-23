"use client";

import { T, useIsMobile } from "./shared";
import { BRANDING_METHOD_META } from "@/lib/products/branding";
import type { Product } from "@/lib/products/types";

export function ProductFacts({ product }: { product: Product }) {
  const isMobile = useIsMobile();

  const brandingLabel =
    product.brandingMethods.length === 1
      ? BRANDING_METHOD_META[product.brandingMethods[0]].label
      : `${product.brandingMethods.length} methods`;

  const items: { label: string; value: string }[] = [
    {
      label: "Category",
      value: `${product.category[0].toUpperCase()}${product.category.slice(1)} · ${product.subcategory}`,
    },
    {
      label: "Minimum order",
      value: `${product.moq} units`,
    },
    {
      label: "Lead time",
      value: `${product.leadTimeWeeks[0]}–${product.leadTimeWeeks[1]} weeks`,
    },
    {
      label: "Branding",
      value: brandingLabel,
    },
  ];

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: "1px",
        background: T.border,
        border: `1px solid ${T.border}`,
        margin: isMobile ? "40px 0" : "56px 0",
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            background: T.bg,
            padding: "20px 22px",
            minHeight: "96px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontFamily: T.font,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: T.textDim,
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              fontFamily: T.font,
              fontSize: "15px",
              fontWeight: 700,
              color: T.text,
              letterSpacing: "-0.005em",
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </section>
  );
}
