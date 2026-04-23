"use client";

import { T } from "./shared";
import type { ProductBadge as Badge } from "@/lib/products/types";

const LABELS: Record<Badge, string> = {
  premium: "Premium",
  teamwear: "Teamwear",
  new: "New",
  sustainable: "Sustainable",
  bestseller: "Bestseller",
};

export function ProductBadge({ badge }: { badge: Badge }) {
  const isLime = badge === "new" || badge === "bestseller";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "22px",
        padding: "0 10px",
        borderRadius: "999px",
        border: isLime ? "none" : `1px solid ${T.borderStrong}`,
        background: isLime ? T.lime : "transparent",
        color: isLime ? "#080808" : T.text,
        fontFamily: T.font,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}
    >
      {LABELS[badge]}
    </span>
  );
}

export function BadgeRow({ badges }: { badges: Badge[] }) {
  if (!badges?.length) return null;
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
      {badges.map((b) => (
        <ProductBadge key={b} badge={b} />
      ))}
    </div>
  );
}
