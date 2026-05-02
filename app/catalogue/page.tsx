"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

// ---------------------------------------------------------------------------
// Reveal wrapper
// ---------------------------------------------------------------------------
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.65,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay,
          },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Product = {
  name: string;
  type: string;
  line: string;
  image: string;
  href: string;
  bestFor?: string;
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const FEATURED: Product[] = [
  {
    name: "Heavyweight Tee",
    type: "Apparel",
    line: "Built to last. Cut to fit.",
    image: "/cat-tee-heavy.jpg",
    href: "/catalogue/heavyweight-tee",
    bestFor: "staff & retail",
  },
  {
    name: "Resin Keychains",
    type: "Custom Product",
    line: "Small format, high impact.",
    image: "/cat-keychain.jpg",
    href: "/catalogue/resin-keychains",
    bestFor: "campaigns & events",
  },
  {
    name: "Insulated Bottle",
    type: "Everyday Carry",
    line: "Premium steel, daily use.",
    image: "/cat-bottle.jpg",
    href: "/catalogue/insulated-bottle",
    bestFor: "staff & premium gifting",
  },
];

const APPAREL: Product[] = [
  {
    name: "Premium Hoodie",
    type: "Apparel",
    line: "Weighted fleece, considered cut.",
    image: "/cat-hoodie.jpg",
    href: "/catalogue/premium-hoodie",
    bestFor: "staff & retail",
  },
  {
    name: "Overshirt",
    type: "Apparel",
    line: "Midweight layer, finished properly.",
    image: "/cat-overshirt.jpg",
    href: "/catalogue/overshirt",
    bestFor: "campaigns & staff",
  },
  {
    name: "Structured Cap",
    type: "Headwear",
    line: "Low profile. Clean finish.",
    image: "/cat-cap.jpg",
    href: "/catalogue/structured-cap",
    bestFor: "campaigns & events",
  },
];

const PROMOTIONAL: Product[] = [
  {
    name: "Promo Ball",
    type: "Promotional",
    line: "Simple, useful, memorable.",
    image: "/cat-ball.jpg",
    href: "/catalogue/promo-ball",
    bestFor: "campaigns & retail",
  },
  {
    name: "Enamel Pin",
    type: "Promotional",
    line: "Hard enamel. Keepable.",
    image: "/cat-pin.jpg",
    href: "/catalogue/enamel-pin",
    bestFor: "events & gifting",
  },
  {
    name: "Hardcover Notebook",
    type: "Stationery",
    line: "Thick stock, brand-debossed.",
    image: "/cat-notebook.jpg",
    href: "/catalogue/hardcover-notebook",
    bestFor: "corporate & staff",
  },
];

const CUSTOM: Product[] = [
  {
    name: "Performance Jersey",
    type: "Teamwear",
    line: "Technical fabric, team-ready.",
    image: "/cat-jersey.jpg",
    href: "/catalogue/performance-jersey",
    bestFor: "sports & staff",
  },
  {
    name: "Training Shell",
    type: "Teamwear",
    line: "Weatherproof, sideline-proof.",
    image: "/cat-jacket.jpg",
    href: "/catalogue/training-shell",
    bestFor: "staff & outdoors",
  },
  {
    name: "Moulded Resin",
    type: "Custom Product",
    line: "Mould to hand, one-off or run.",
    image: "/cat-resin.jpg",
    href: "/catalogue/moulded-resin",
    bestFor: "campaigns & retail",
  },
];

// ---------------------------------------------------------------------------
// PrimaryButton
// ---------------------------------------------------------------------------
function PrimaryButton({
  href,
  children,
  fullWidth = false,
}: {
  href: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        padding: "0 26px",
        borderRadius: "999px",
        background: "#b8f400",
        color: "#080808",
        textDecoration: "none",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        transition: "opacity 0.2s ease",
        width: fullWidth ? "100%" : "auto",
        boxSizing: "border-box",
      }}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// SecondaryButton
// ---------------------------------------------------------------------------
function SecondaryButton({
  href,
  children,
  fullWidth = false,
}: {
  href: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        padding: "0 24px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "#ffffff",
        textDecoration: "none",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: "transparent",
        transition: "border-color 0.2s ease, background 0.2s ease",
        width: fullWidth ? "100%" : "auto",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// FeaturedCard — premium hover + cursor parallax
// ---------------------------------------------------------------------------
function FeaturedCard({
  product,
  large = false,
  disableParallax = false,
}: {
  product: Product;
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

// ---------------------------------------------------------------------------
// ProductCard
// ---------------------------------------------------------------------------
function ProductCard({ product }: { product: Product }) {
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
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) {
          img.style.transform = "scale(1.04)";
          img.style.filter = "brightness(0.85)";
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
          img.style.filter = "brightness(0.7)";
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
          filter: "brightness(0.7)",
          transform: "scale(1)",
          transition: "all 0.45s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.35) 60%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#b8f400",
          background: "rgba(8,8,8,0.8)",
          padding: "6px 10px",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "Helvetica, Arial, sans-serif",
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
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "13px",
          transition: "all 0.3s ease",
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
          padding: "20px",
        }}
      >
        <div
          style={{
            fontSize: "clamp(20px, 1.6vw, 26px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.95,
            marginBottom: "4px",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.06em",
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
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(184,244,0,0.55)",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            Best for: {product.bestFor}
          </div>
        )}
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// CategoryBlock
// ---------------------------------------------------------------------------
function CategoryBlock({
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
  items: Product[];
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
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Auto-rotating hero
// ---------------------------------------------------------------------------
const HERO_PRODUCTS = [
  {
    key: "cooler",
    image: "/cat-cricket-cooler.jpg",
    exclusivity: "Exclusive to Tendencies in New Zealand.",
    title: ["The Cricket", "Cooler"],
    body: "Built for campaigns that need a reason to engage. A functional, premium cooler that does the promotional work long after the campaign ends.",
    href: "/catalogue/cricket-cooler",
    cta: "View Product",
  },
  {
    key: "tee",
    image: "/cat-tee-heavy.jpg",
    exclusivity: "Apparel · Built to last.",
    title: ["Heavyweight", "Tee"],
    body: "Premium weight, considered cut. The kind of tee that earns its place in a regular rotation — not the bin.",
    href: "/catalogue/heavyweight-tee",
    cta: "View Product",
  },
  {
    key: "bottle",
    image: "/cat-bottle.jpg",
    exclusivity: "Everyday Carry · Staff & retail.",
    title: ["Insulated", "Bottle"],
    body: "Premium steel, daily use. The product that sits on the desk and does the brand work without asking.",
    href: "/catalogue/insulated-bottle",
    cta: "View Product",
  },
];

function RotatingHero({ isMobile }: { isMobile: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const product = HERO_PRODUCTS[active];

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_PRODUCTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#b8f400",
          }}
        >
          Featured Product
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {HERO_PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "20px" : "6px",
                height: "6px",
                borderRadius: "999px",
                background:
                  i === active ? "#b8f400" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.35s ease, background 0.35s ease",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "0" : "2px",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Image panel */}
        <div
          style={{
            position: "relative",
            aspectRatio: isMobile ? "4 / 3" : "5 / 4",
            background: "#0f0f0f",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={product.key + "-img"}
              src={product.image}
              alt={product.title.join(" ")}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.8)",
              }}
            />
          </AnimatePresence>
        </div>

        {/* Copy panel */}
        <div
          style={{
            background: "#0f0f0f",
            padding: isMobile ? "28px 20px" : "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "32px",
            minHeight: isMobile ? "auto" : "360px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={product.key + "-copy"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.32)",
                  marginBottom: "16px",
                }}
              >
                {product.exclusivity}
              </div>

              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 900,
                  letterSpacing: "-0.045em",
                  lineHeight: 0.92,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: "0 0 20px",
                }}
              >
                {product.title[0]}
                <br />
                {product.title[1]}
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>

              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  maxWidth: "360px",
                }}
              >
                {product.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div>
            <a
              href={product.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#b8f400",
                textDecoration: "none",
                borderBottom: "1px solid rgba(184,244,0,0.3)",
                paddingBottom: "4px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderBottomColor = "#b8f400")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderBottomColor =
                  "rgba(184,244,0,0.3)")
              }
            >
              {product.cta} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CataloguePage() {
  const isMobile = useIsMobile();
  const px = isMobile ? "20px" : "48px";

  return (
    <section style={{ background: "#080808", color: "#f5f5f0" }}>
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: `96px ${px} 0`,
        }}
      >
        {/* ── HERO META ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            alignItems: "start",
            gap: isMobile ? "8px" : "24px",
            marginBottom: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: "4px",
              }}
            >
              Since · 2009
            </div>
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Auckland · Melbourne · Shenzhen
            </div>
          </div>
          <div
            style={{
              justifySelf: isMobile ? "start" : "end",
              textAlign: isMobile ? "left" : "right",
              maxWidth: "360px",
            }}
          >
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.5,
              }}
            >
              An edited selection
              <br />
              not an endless feed
            </div>
          </div>
        </div>

        {/* ── H1 ── */}
        <div style={{ marginBottom: "20px" }}>
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
            Catalogue
          </div>
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "clamp(56px, 10vw, 152px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: "0 0 16px",
            }}
          >
            MERCH
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            WORTH KEEPING
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "15px",
              color: "rgba(255,255,255,0.42)",
              letterSpacing: "0.04em",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Merch worth keeping. Ideas worth backing.
          </p>
        </div>

        {/* ── HERO SUB-ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: isMobile ? "20px" : "32px",
            alignItems: "center",
            paddingTop: "18px",
            paddingBottom: "48px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "580px" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.48)",
                margin: 0,
              }}
            >
              An edited selection of apparel, giveaways, and branded product
              worth putting your name on.{" "}
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                Curated, not dumped. Custom always available.
              </span>
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "10px",
              alignItems: isMobile ? "stretch" : "center",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <PrimaryButton href="/start-a-project" fullWidth={isMobile}>
              Start a Project
            </PrimaryButton>
            <SecondaryButton href="/work" fullWidth={isMobile}>
              See Our Work
            </SecondaryButton>
          </div>
        </div>

        {/* ── ROTATING HERO ── */}
        <Reveal>
          <RotatingHero isMobile={isMobile} />
        </Reveal>

        {/* ── THE SHORTLIST — PINNED LEFT / SCROLLING RIGHT ── */}
        <Reveal>
          <section
            style={{
              paddingTop: "40px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ marginBottom: "32px", maxWidth: "720px" }}>
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
                Featured
              </div>
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "clamp(42px, 6vw, 96px)",
                  fontWeight: 900,
                  letterSpacing: "-0.055em",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: "0 0 12px",
                }}
              >
                The Shortlist
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.42)",
                  letterSpacing: "0.04em",
                  margin: 0,
                }}
              >
                Not everything. Just the right things.
              </p>
            </div>

            {isMobile ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "18px" }}
              >
                <FeaturedCard
                  product={FEATURED[0]}
                  large
                  disableParallax
                />
                <FeaturedCard product={FEATURED[1]} disableParallax />
                <FeaturedCard product={FEATURED[2]} disableParallax />
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: "18px",
                  alignItems: "start",
                }}
              >
                {/* LEFT — sticky */}
                <div
                  style={{
                    position: "sticky",
                    top: "100px",
                    height: "fit-content",
                  }}
                >
                  <FeaturedCard product={FEATURED[0]} large />
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.28)",
                      fontFamily: "Helvetica, Arial, sans-serif",
                    }}
                  >
                    Most requested · Always lands
                  </div>
                </div>

                {/* RIGHT — scrolls */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <FeaturedCard product={FEATURED[1]} />
                  <FeaturedCard product={FEATURED[2]} />
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: "60px",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)",
              }}
            />
          </section>
        </Reveal>

        {/* ── SHOP BY USE ── */}
        <Reveal>
          <section style={{ paddingTop: "56px", paddingBottom: "8px" }}>
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "40px",
              }}
            >
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
                Shop by use
              </div>
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "clamp(28px, 3.5vw, 48px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.92,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: "0 0 8px",
                }}
              >
                What are you building
                <span style={{ color: "#b8f400" }}>?</span>
              </h2>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.36)",
                  margin: "0 0 28px",
                  maxWidth: "480px",
                  lineHeight: 1.55,
                }}
              >
                Not sure where to start? Use this as a guide.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                  gap: "2px",
                }}
              >
                {[
                  {
                    label: "Campaigns & Promotions",
                    desc: "GWP, giveaways, product launches, and activation product. Built to move, built to be kept.",
                    examples:
                      "Promo balls · Keychains · Notebooks · Coolers",
                    href: "#promotional",
                  },
                  {
                    label: "Staff & Team",
                    desc: "Uniforms, apparel, and internal gear. Product your people will actually wear.",
                    examples:
                      "Tees · Hoodies · Caps · Performance jerseys",
                    href: "#apparel",
                  },
                  {
                    label: "Premium & High Impact",
                    desc: "Standout items and hero products for campaigns that need a centrepiece. Higher-value, longer-lasting.",
                    examples:
                      "Cricket Cooler · Moulded Resin · Custom development",
                    href: "#custom",
                  },
                ].map((tile) => (
                  <a
                    key={tile.label}
                    href={tile.href}
                    style={{
                      display: "block",
                      background: "#0f0f0f",
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: isMobile ? "24px 20px" : "32px 28px",
                      textDecoration: "none",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(184,244,0,0.25)";
                      e.currentTarget.style.background = "#111";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = "#0f0f0f";
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "#fff",
                        marginBottom: "10px",
                        lineHeight: 1.2,
                      }}
                    >
                      {tile.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.42)",
                        lineHeight: 1.6,
                        marginBottom: "14px",
                      }}
                    >
                      {tile.desc}
                    </div>
                    <div
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(184,244,0,0.55)",
                        lineHeight: 1.6,
                      }}
                    >
                      {tile.examples}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── CATEGORY BLOCKS ── */}
        <div id="apparel" style={{ paddingTop: "40px" }}>
          <Reveal>
            <CategoryBlock
              index="01"
              title="Apparel"
              subtitle="Designed to be worn. Not issued."
              items={APPAREL}
              viewAllHref="/catalogue/apparel"
              isMobile={isMobile}
            />
          </Reveal>
        </div>

        <div id="promotional" style={{ paddingTop: "40px" }}>
          <Reveal>
            <CategoryBlock
              index="02"
              title="Promotional"
              subtitle="Simple, useful, and built to be kept."
              items={PROMOTIONAL}
              viewAllHref="/catalogue/promotional"
              isMobile={isMobile}
            />
          </Reveal>
        </div>

        <div id="custom" style={{ paddingTop: "40px", paddingBottom: "64px" }}>
          <Reveal>
            <CategoryBlock
              index="03"
              title="Custom"
              subtitle="If it doesn&apos;t exist, we make it."
              items={CUSTOM}
              viewAllHref="/catalogue/custom"
              isMobile={isMobile}
            />
          </Reveal>
        </div>
      </div>

      {/* ── CTA BAND ── */}
      <section
        style={{
          background: "#b8f400",
          color: "#080808",
          padding: isMobile ? "60px 20px" : "80px 48px",
          marginTop: "12px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: "32px",
            alignItems: "end",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "clamp(56px, 10vw, 140px)",
                fontWeight: 900,
                letterSpacing: "-0.065em",
                lineHeight: 0.84,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              LET&apos;S
              <br />
              BUILD
              <br />
              SOMETHING.
            </h2>
          </div>
          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.55,
                color: "rgba(8,8,8,0.7)",
                maxWidth: "240px",
                margin: isMobile ? "0 0 20px" : "0 0 18px auto",
              }}
            >
              Big enough to deliver. Small enough to care.
            </p>
            <a
              href="/start-a-project"
              style={{
                display: isMobile ? "flex" : "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 26px",
                borderRadius: "999px",
                border: "1px solid rgba(8,8,8,0.6)",
                color: "#080808",
                textDecoration: "none",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                transition: "background 0.2s ease, color 0.2s ease",
                width: isMobile ? "100%" : "auto",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#080808";
                e.currentTarget.style.color = "#b8f400";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#080808";
              }}
            >
              Start a Project
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}