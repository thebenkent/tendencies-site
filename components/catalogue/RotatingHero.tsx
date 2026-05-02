"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_PRODUCTS } from "@/lib/catalogue/products";

export default function RotatingHero({ isMobile }: { isMobile: boolean }) {
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
