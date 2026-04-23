"use client";

import { FramedImage, PrimaryButton, SecondaryButton, T, useIsMobile } from "./shared";
import { BadgeRow } from "./ProductBadge";
import type { Product } from "@/lib/products/types";

export function ProductHero({
  product,
  onShortlist,
}: {
  product: Product;
  onShortlist?: () => void;
}) {
  const isMobile = useIsMobile();

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
        gap: isMobile ? "28px" : "56px",
        alignItems: "stretch",
        paddingBottom: isMobile ? "40px" : "56px",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      {/* Image */}
      <div>
        <FramedImage
          src={product.hero.src}
          alt={product.hero.alt}
          label={product.hero.label}
          aspect={product.hero.aspect ?? "4/5"}
          brightness={0.95}
        />
      </div>

      {/* Copy */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: T.font,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: T.lime,
              marginBottom: "12px",
            }}
          >
            {product.category} · {product.subcategory}
          </div>

          <h1
            style={{
              fontFamily: T.font,
              fontSize: isMobile
                ? "clamp(48px, 12vw, 76px)"
                : "clamp(56px, 6vw, 96px)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.92,
              textTransform: "uppercase",
              color: T.text,
              margin: "0 0 18px",
            }}
          >
            {product.title}
            <span style={{ color: T.lime }}>.</span>
          </h1>

          <p
            style={{
              fontFamily: T.font,
              fontSize: "15px",
              lineHeight: 1.55,
              color: T.textMuted,
              margin: "0 0 20px",
              maxWidth: "460px",
            }}
          >
            {product.descriptor}
          </p>

          {product.badges && <BadgeRow badges={product.badges} />}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <PrimaryButton
            href={`/start-a-project?product=${product.slug}`}
            ariaLabel={`Enquire about ${product.title}`}
          >
            Enquire about this product
          </PrimaryButton>
          <SecondaryButton onClick={onShortlist} ariaLabel="Add to shortlist">
            + Add to shortlist
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
