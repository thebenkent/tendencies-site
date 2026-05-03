"use client";

import type { CatalogueProduct } from "@/lib/catalogue/products";

export default function CatalogueProductCard({
  product,
}: {
  product: CatalogueProduct;
}) {
  return (
    <a
      href={product.href}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "#0f0f0f",
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "transform 0.35s ease, border-color 0.35s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(184,244,0,0.22)";
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) {
          img.style.transform = "scale(1.04)";
          img.style.filter = "brightness(0.92)";
        }
        const arrow = e.currentTarget.querySelector(".arrow");
        if (arrow) (arrow as HTMLElement).style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) {
          img.style.transform = "scale(1)";
          img.style.filter = "brightness(0.82)";
        }
        const arrow = e.currentTarget.querySelector(".arrow");
        if (arrow) (arrow as HTMLElement).style.transform = "translateX(0)";
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.82)",
          transform: "scale(1)",
          transition: "transform 0.45s ease, filter 0.45s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.18) 55%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          fontSize: "9px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#b8f400",
          background: "rgba(8,8,8,0.75)",
          padding: "5px 9px",
          border: "1px solid rgba(184,244,0,0.18)",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 700,
        }}
      >
        {product.type}
      </div>
      <div
        className="arrow"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "13px",
          transition: "transform 0.3s ease",
        }}
      >
        →
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "18px",
        }}
      >
        <div
          style={{
            fontSize: "clamp(18px, 1.5vw, 24px)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 1,
            marginBottom: "4px",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.5,
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {product.line}
        </div>
        {product.bestFor && (
          <div
            style={{
              marginTop: "5px",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(184,244,0,0.45)",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {product.bestFor}
          </div>
        )}
      </div>
    </a>
  );
}
