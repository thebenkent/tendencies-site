"use client";

import { useRef, useState } from "react";
import type { CatalogueProduct } from "@/lib/catalogue/products";

export default function FeaturedCard({
  product,
  large = false,
  disableParallax = false,
}: {
  product: CatalogueProduct;
  large?: boolean;
  disableParallax?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHovered(false), 80);
    setCursorPos({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disableParallax || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setCursorPos({ x, y });
  };

  const parallaxX = disableParallax ? 0 : cursorPos.x * 5;
  const parallaxY = disableParallax ? 0 : cursorPos.y * 5;

  return (
    <a
      ref={cardRef}
      href={product.href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: large ? "5 / 6" : "4 / 5",
        overflow: "hidden",
        background: "#0a0a0a",
        textDecoration: "none",
        border: hovered
          ? "1px solid rgba(184,244,0,0.28)"
          : "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.55s ease",
      }}
    >
      {/* Image with parallax */}
      <div
        style={{
          position: "absolute",
          inset: "-8px",
          transform: `scale(${hovered ? 1.06 : 1}) translate(${parallaxX}px, ${parallaxY}px)`,
          transition: hovered
            ? "transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform",
        }}
      >
        <img
          src={product.image}
          alt={`${product.name} — branded merchandise`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: hovered
              ? "brightness(0.78) saturate(1.1)"
              : "brightness(0.6) saturate(0.9)",
            transition: "filter 0.9s ease",
          }}
        />
      </div>

      {/* Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.22) 52%, transparent 100%)"
            : "linear-gradient(to top, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.38) 55%, transparent 100%)",
          transition: "background 0.7s ease",
          pointerEvents: "none",
        }}
      />

      {/* Type badge */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          background: "rgba(8,8,8,0.82)",
          color: "#b8f400",
          border: "1px solid rgba(255,255,255,0.12)",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "7px 10px",
          pointerEvents: "none",
        }}
      >
        {product.type}
      </div>

      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border: hovered
            ? "1px solid rgba(184,244,0,0.5)"
            : "1px solid rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? "#b8f400" : "rgba(255,255,255,0.55)",
          fontSize: "14px",
          opacity: hovered ? 1 : 0.6,
          transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)",
          transition:
            "border-color 0.4s ease, color 0.4s ease, opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: "none",
        }}
      >
        ↗
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: large ? "28px" : "22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: large
              ? "clamp(32px, 3vw, 44px)"
              : "clamp(24px, 2vw, 32px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.95,
            marginBottom: "8px",
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: hovered
              ? "rgba(255,255,255,0.75)"
              : "rgba(255,255,255,0.5)",
            lineHeight: 1.45,
            marginBottom: product.bestFor ? "6px" : "0",
            transition: "color 0.4s ease",
          }}
        >
          {product.line}
        </div>

        {product.bestFor && (
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: hovered
                ? "rgba(184,244,0,0.8)"
                : "rgba(184,244,0,0.5)",
              transition: "color 0.4s ease",
            }}
          >
            Best for: {product.bestFor}
          </div>
        )}
      </div>
    </a>
  );
}
