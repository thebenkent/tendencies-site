"use client";

import { useState } from "react";

type EditorialProduct = {
  name: string;
  line: string;
  image: string;
  href: string;
  type: string;
};

const STAFF_PICKS: EditorialProduct[] = [
  {
    name: "Premium Hoodie",
    line: "Proper weight. Clean cut.",
    image: "/cat-hoodie.jpg",
    href: "/catalogue/premium-hoodie",
    type: "Apparel",
  },
  {
    name: "Insulated Bottle",
    line: "Steel. On the desk every day.",
    image: "/cat-bottle.jpg",
    href: "/catalogue/insulated-bottle",
    type: "Everyday Carry",
  },
  {
    name: "Enamel Pin",
    line: "Hard enamel. Stays on.",
    image: "/cat-pin.jpg",
    href: "/catalogue/enamel-pin",
    type: "Promotional",
  },
  {
    name: "Structured Cap",
    line: "Clean profile. No fuss.",
    image: "/cat-cap.jpg",
    href: "/catalogue/structured-cap",
    type: "Headwear",
  },
];

function EditorialCard({
  product,
  index,
  isMobile,
}: {
  product: EditorialProduct;
  index: number;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const num = String(index).padStart(2, "0");

  return (
    <a
      href={product.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        flexShrink: isMobile ? 0 : undefined,
        width: isMobile ? "240px" : undefined,
      }}
    >
      {/* Image frame */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3 / 4",
          overflow: "hidden",
          background: "#0f0f0f",
          marginBottom: "16px",
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
            filter: hovered ? "brightness(0.92)" : "brightness(0.78)",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "filter 0.6s ease, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />

        {/* Subtle bottom gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(8,8,8,0.55) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* Number */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: hovered ? "#b8f400" : "rgba(255,255,255,0.5)",
            transition: "color 0.3s ease",
          }}
        >
          {num}
        </div>

        {/* View indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#b8f400",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          View →
        </div>
      </div>

      {/* Copy */}
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "5px",
          }}
        >
          {product.type}
        </div>
        <div
          style={{
            fontSize: "clamp(16px, 1.4vw, 20px)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            textTransform: "uppercase",
            color: hovered ? "#f5f5f0" : "rgba(255,255,255,0.88)",
            lineHeight: 1,
            marginBottom: "5px",
            transition: "color 0.3s ease",
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.5,
            letterSpacing: "0.01em",
          }}
        >
          {product.line}
        </div>
      </div>
    </a>
  );
}

export default function EditorialSection({
  isMobile,
}: {
  isMobile: boolean;
}) {
  return (
    <section
      style={{
        paddingTop: "88px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
          alignItems: "end",
          gap: "16px",
          marginBottom: "40px",
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
              marginBottom: "12px",
            }}
          >
            Staff Picks
          </div>
          <h2
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "clamp(42px, 5.5vw, 80px)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            The ones
            <br />
            they kept
            <span style={{ color: "#b8f400" }}>.</span>
          </h2>
        </div>
        <a
          href="/catalogue"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.14)",
            paddingBottom: "3px",
            alignSelf: "flex-end",
            transition: "color 0.25s ease, border-color 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.45)";
            e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.14)";
          }}
        >
          View all →
        </a>
      </div>

      {/* Cards */}
      <div
        style={{
          display: isMobile ? "flex" : "grid",
          gridTemplateColumns: isMobile ? undefined : "repeat(4, 1fr)",
          flexDirection: isMobile ? "row" : undefined,
          gap: "24px",
          overflowX: isMobile ? "auto" : undefined,
          paddingBottom: isMobile ? "4px" : undefined,
          // hide scrollbar without a CSS class
          msOverflowStyle: "none",
        } as React.CSSProperties}
      >
        {STAFF_PICKS.map((pick, i) => (
          <EditorialCard
            key={pick.name}
            product={pick}
            index={i + 1}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}
