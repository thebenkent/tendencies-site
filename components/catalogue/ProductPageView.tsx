"use client";

import { useRef, useState, useEffect } from "react";
import { T, useIsMobile } from "./shared";
import { Breadcrumb } from "./Breadcrumb";
import { ProductHero } from "./ProductHero";
import { ProductFacts } from "./ProductFacts";
import { ProductFeatures } from "./ProductFeatures";
import ProductGallery from "./ProductGallery";
import { BrandingMethods } from "./BrandingMethods";
import { ColourChips } from "./ColourChips";
import { SizeRow } from "./SizeRow";
import { SpecTable } from "./SpecTable";
import { UseCases } from "./UseCases";
import { RelatedProducts } from "./RelatedProducts";
import { EnquiryBar } from "./EnquiryBar";
import type { Product } from "@/lib/products/types";

const SHORTLIST_KEY = "tendencies:shortlist";

function addToShortlist(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(SHORTLIST_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(slug)) list.push(slug);
    window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(list));
  } catch {
    /* no-op */
  }
}

export function ProductPageView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const isMobile = useIsMobile();
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleShortlist = () => {
    addToShortlist(product.slug);
    setToast(`${product.title} added to shortlist`);
  };

  return (
    <section
      style={{
        background: T.bg,
        color: T.text,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: isMobile ? "72px 24px 0" : "96px 48px 0",
        }}
      >
        <Breadcrumb
          crumbs={[
            { label: "Catalogue", href: "/catalogue" },
            {
              label: product.subcategory,
              href: `/catalogue?category=${product.category}`,
            },
            { label: product.title },
          ]}
        />

        <ProductHero product={product} onShortlist={handleShortlist} />

        {/* Sentinel — when this leaves the viewport, the sticky CTA appears */}
        <div ref={heroSentinelRef} aria-hidden style={{ height: "1px" }} />

        <ProductFacts product={product} />

        <ProductFeatures
          description={product.shortDescription}
          features={product.features}
        />

        {product.gallery && product.gallery.length > 0 && (
          <ProductGallery images={product.gallery} />
        )}

        <BrandingMethods methods={product.brandingMethods} />

        {product.colours && product.colours.length > 0 && (
          <ColourChips colours={product.colours} />
        )}

        {product.sizes && product.sizes.length > 0 && (
          <SizeRow sizes={product.sizes} />
        )}

        <SpecTable specs={product.specs} sourcing={product.sourcing} />

        {product.useCases && product.useCases.length > 0 && (
          <UseCases useCases={product.useCases} />
        )}

        {related.length > 0 && <RelatedProducts products={related} />}
      </div>

      {/* Terminal CTA band — matches the lime band from the What We Do page */}
      <section
        style={{
          background: T.lime,
          color: "#080808",
          padding: isMobile ? "56px 24px" : "64px 48px",
          marginTop: isMobile ? "40px" : "64px",
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
          <h2
            style={{
              fontFamily: T.font,
              fontSize: isMobile
                ? "clamp(48px, 14vw, 80px)"
                : "clamp(64px, 8vw, 112px)",
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.86,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            BUILD IT
            <br />
            WITH US.
          </h2>

          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <p
              style={{
                fontFamily: T.font,
                fontSize: "14px",
                lineHeight: 1.55,
                color: "rgba(8,8,8,0.7)",
                maxWidth: "260px",
                margin: isMobile ? "0 0 18px 0" : "0 0 18px auto",
              }}
            >
              Tell us about your run — we'll handle sampling, sourcing, and
              delivery end-to-end.
            </p>

            <a
              href={`/start-a-project?product=${product.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 26px",
                borderRadius: "999px",
                border: "1px solid rgba(8,8,8,0.6)",
                color: "#080808",
                textDecoration: "none",
                fontFamily: T.font,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#080808";
                e.currentTarget.style.color = T.lime;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#080808";
              }}
            >
              Start a project
            </a>
          </div>
        </div>
      </section>

      <EnquiryBar
        product={product}
        sentinelRef={heroSentinelRef}
        onShortlist={handleShortlist}
      />

      {/* Shortlist toast */}
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: "90px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#080808",
            color: T.text,
            border: `1px solid ${T.borderStrong}`,
            padding: "10px 16px",
            borderRadius: "999px",
            fontFamily: T.font,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            zIndex: 60,
            boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
          }}
        >
          {toast}
        </div>
      )}
    </section>
  );
}
