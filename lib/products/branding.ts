// lib/products/branding.ts
// Centralised copy for branding methods so every product page is consistent.

import type { BrandingMethod } from "./types";

export const BRANDING_METHOD_META: Record<
  BrandingMethod,
  { label: string; blurb: string }
> = {
  embroidery: {
    label: "Embroidery",
    blurb:
      "Stitched thread branding. Premium feel, built to last, best on heavier fabrics.",
  },
  "screen-print": {
    label: "Screen Print",
    blurb:
      "Classic plastisol or water-based print. Bold, flat colour, economical at volume.",
  },
  dtf: {
    label: "DTF Transfer",
    blurb:
      "Direct-to-film transfer. Photographic detail, vibrant colour, low MOQ friendly.",
  },
  "heat-transfer": {
    label: "Heat Transfer",
    blurb:
      "Vinyl or plastisol transfers. Clean edges, strong for names and numbers.",
  },
  sublimation: {
    label: "Sublimation",
    blurb:
      "Dye-infused print on performance fabric. Full-colour, edge-to-edge, no hand feel.",
  },
  deboss: {
    label: "Deboss",
    blurb:
      "Recessed, toneless branding. Considered, tactile, very on-brand for premium.",
  },
  "laser-etch": {
    label: "Laser Etch",
    blurb:
      "Surface burn on metal or wood. Permanent, clean, no ink.",
  },
  engraving: {
    label: "Engraving",
    blurb:
      "Precision-cut branding on hard surfaces. Permanent and elevated.",
  },
  "woven-label": {
    label: "Woven Label",
    blurb:
      "Loomed label sewn into the garment. The retail-grade finish.",
  },
  "pad-print": {
    label: "Pad Print",
    blurb:
      "Small-format print for curved or awkward surfaces. Reliable on promo product.",
  },
};
