"use client";

import type { CatalogueProduct } from "@/lib/catalogue/products";
import CatalogueProductCard from "./CatalogueProductCard";

export default function CategoryBlock({
  index,
  title,
  subtitle,
  items,
  viewAllHref,
  isMobile,
}: {
  index: string;
  title: string;
  subtitle: string;
  items: CatalogueProduct[];
  viewAllHref: string;
  isMobile: boolean;
}) {
  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
          alignItems: "end",
          gap: isMobile ? "12px" : "32px",
          marginBottom: "22px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b8f400",
              marginBottom: "10px",
            }}
          >
            {index}
          </div>
          <h2
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: "0 0 8px",
            }}
          >
            {title}
            <span style={{ color: "#b8f400" }}>.</span>
          </h2>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.38)",
              letterSpacing: "0.02em",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        </div>
        <a
          href={viewAllHref}
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            paddingBottom: "3px",
            alignSelf: isMobile ? "flex-start" : "flex-end",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.2)";
          }}
        >
          View all →
        </a>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "14px",
        }}
      >
        {items.map((product) => (
          <CatalogueProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}
