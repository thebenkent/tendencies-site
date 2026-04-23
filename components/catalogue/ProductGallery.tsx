"use client";

import { FramedImage, SectionLabel, T, useIsMobile } from "./shared";
import type { ProductImage } from "@/lib/products/types";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const isMobile = useIsMobile();

  if (!images || images.length === 0) return null;

  return (
    <section
      style={{
        padding: isMobile ? "40px 0" : "56px 0",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <SectionLabel>Detail</SectionLabel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : images.length === 2
            ? "1fr 1fr"
            : "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {images.map((img) => (
          <FramedImage
            key={img.src}
            src={img.src}
            alt={img.alt}
            label={img.label}
            aspect={img.aspect ?? "5/4"}
            brightness={0.95}
          />
        ))}
      </div>
    </section>
  );
}
