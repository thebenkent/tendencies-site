// lib/products/types.ts
// Contract-first schema for the Tendencies catalogue.
// Keep this file small — bloat kills a schema.

export type ProductCategory =
  | "apparel"
  | "headwear"
  | "bags"
  | "drinkware"
  | "promo"
  | "teamwear"
  | "corporate";

export type BrandingMethod =
  | "embroidery"
  | "screen-print"
  | "dtf"
  | "heat-transfer"
  | "sublimation"
  | "deboss"
  | "laser-etch"
  | "engraving"
  | "woven-label"
  | "pad-print";

export type ProductBadge =
  | "premium"
  | "teamwear"
  | "new"
  | "sustainable"
  | "bestseller";

export interface ProductImage {
  src: string;
  alt: string;
  label?: string;                // optional corner tag, e.g. "Detail", "In use"
  aspect?: "5/4" | "4/5" | "1/1";
}

export interface ColourOption {
  name: string;                  // "Bone", "Lime", "Coal"
  hex: string;                   // "#f5f5f0"
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  title: string;
  category: ProductCategory;
  subcategory: string;           // "Hoodies", "Caps", "Bottles"
  descriptor: string;            // one line under the title
  badges?: ProductBadge[];

  hero: ProductImage;            // the single image that anchors the page
  gallery?: ProductImage[];      // 2–6 supporting shots

  shortDescription: string;      // 2–4 sentences — the "why it works"
  features: string[];            // bullet list

  brandingMethods: BrandingMethod[];
  colours?: ColourOption[];
  sizes?: string[];              // ["XS","S","M","L","XL","2XL"]

  moq: number;                   // minimum order quantity
  leadTimeWeeks: [number, number]; // [min, max]
  sourcing?: string;             // short note e.g. "Built in our partner factory, Vietnam"

  specs: SpecRow[];
  useCases?: string[];           // "Team uniforms", "Corporate gifting", "Event merch"

  relatedSlugs?: string[];       // 2–4 slugs
  tags?: string[];               // free-form for filtering later
}
