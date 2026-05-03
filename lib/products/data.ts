// lib/products/data.ts
import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    slug: "heavyweight-hoodie",
    title: "Heavyweight Hoodie",
    category: "apparel",
    subcategory: "Hoodies",
    descriptor:
      "450gsm brushed-back cotton fleece. Retail-grade construction, teamwear-ready.",
    badges: ["premium", "teamwear", "bestseller"],

    hero: {
      src: "/catalogue/heavyweight-hoodie/hero.jpg",
      alt: "Tendencies heavyweight hoodie, coal colourway, front view",
      label: "Flagship",
      aspect: "4/5",
    },

    gallery: [
      {
        src: "/catalogue/heavyweight-hoodie/detail-embroidery.jpg",
        alt: "Embroidered chest detail on heavyweight hoodie",
        label: "Embroidery",
        aspect: "5/4",
      },
      {
        src: "/catalogue/heavyweight-hoodie/detail-cuff.jpg",
        alt: "Ribbed cuff and hem detail",
        label: "Construction",
        aspect: "5/4",
      },
      {
        src: "/catalogue/heavyweight-hoodie/in-use.jpg",
        alt: "Hoodie worn on location",
        label: "In use",
        aspect: "5/4",
      },
      {
        src: "/catalogue/heavyweight-hoodie/colour-range.jpg",
        alt: "Hoodie range in four colourways",
        label: "Range",
        aspect: "5/4",
      },
    ],

    shortDescription:
      "A retail-weight hoodie built for teamwear programmes that can't compromise on feel. Heavyweight brushed-back fleece, boxed shoulder, ribbed cuff and hem, twin-needle stitch throughout. Holds a strong embroidered crest and takes print cleanly — equally at home on a uniform, a staff kit, or a drop.",

    features: [
      "450gsm brushed-back cotton fleece",
      "Boxed shoulder · modern relaxed fit",
      "Twin-needle stitch construction",
      "Ribbed cuff + hem for shape retention",
      "Unlined hood with flat drawcords",
      "Retail-grade finish throughout",
    ],

    brandingMethods: [
      "embroidery",
      "screen-print",
      "dtf",
      "heat-transfer",
      "woven-label",
    ],

    colours: [
      { name: "Coal", hex: "#1a1a1a" },
      { name: "Bone", hex: "#f0ece2" },
      { name: "Moss", hex: "#3a4a2b" },
      { name: "Navy", hex: "#10203a" },
      { name: "Lime", hex: "#b8f400" },
    ],

    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    moq: 50,
    leadTimeWeeks: [6, 8],
    sourcing:
      "Produced through our established Vietnam partner factory. Sampling available before run.",

    specs: [
      { label: "Fabric", value: "100% cotton, brushed-back fleece" },
      { label: "Weight", value: "450gsm" },
      { label: "Fit", value: "Modern relaxed, boxed shoulder" },
      { label: "Construction", value: "Twin-needle stitch" },
      { label: "Trim", value: "Flat cotton drawcord, tipped ends" },
      { label: "Country of origin", value: "Vietnam" },
      { label: "Care", value: "Machine wash cold, line dry" },
    ],

    useCases: [
      "Teamwear uniform programmes",
      "Staff kit for premium brands",
      "Event & campaign merch drops",
      "Corporate gifting at scale",
    ],

    relatedSlugs: ["heavyweight-tee", "structured-cap", "field-bottle"],
    tags: ["apparel", "hoodie", "teamwear", "premium"],
  },

  {
    slug: "heavyweight-tee",
    title: "Heavyweight Tee",
    category: "apparel",
    subcategory: "Tees",
    descriptor: "260gsm single-jersey. Retail-weight, shape-holding.",

    hero: {
      src: "/catalogue/heavyweight-tee/hero.jpg",
      alt: "Heavyweight tee, coal colourway",
      aspect: "4/5",
    },

    shortDescription:
      "A 260gsm tee that holds its shape and takes branding cleanly. The teamwear baseline.",

    features: [
      "260gsm single jersey",
      "Shoulder-to-shoulder tape",
      "Ribbed collar",
    ],

    brandingMethods: ["screen-print", "dtf", "embroidery"],

    colours: [
      { name: "Coal", hex: "#1a1a1a" },
      { name: "Bone", hex: "#f0ece2" },
    ],

    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    moq: 50,
    leadTimeWeeks: [5, 7],

    specs: [
      { label: "Fabric", value: "100% cotton jersey" },
      { label: "Weight", value: "260gsm" },
    ],

    relatedSlugs: ["heavyweight-hoodie", "structured-cap", "field-bottle"],
    tags: ["apparel", "tee", "teamwear"],
  },

  {
    slug: "structured-cap",
    title: "Structured Cap",
    category: "headwear",
    subcategory: "Caps",
    descriptor: "Six-panel, mid-crown, cotton twill. Clean canvas for embroidery.",

    hero: {
      src: "/catalogue/structured-cap/hero.jpg",
      alt: "Structured six-panel cap",
      aspect: "1/1",
    },

    shortDescription:
      "A structured six-panel cap in heavy cotton twill. Pairs cleanly with any of the apparel set.",

    features: [
      "Six-panel structured crown",
      "Pre-curved brim",
      "Metal buckle back",
    ],

    brandingMethods: ["embroidery", "woven-label"],

    colours: [
      { name: "Coal", hex: "#1a1a1a" },
      { name: "Bone", hex: "#f0ece2" },
      { name: "Lime", hex: "#b8f400" },
    ],

    sizes: ["One size"],
    moq: 100,
    leadTimeWeeks: [5, 7],

    specs: [
      { label: "Fabric", value: "Heavy cotton twill" },
      { label: "Closure", value: "Metal buckle" },
    ],

    relatedSlugs: ["heavyweight-hoodie", "heavyweight-tee", "field-bottle"],
    tags: ["headwear", "cap", "teamwear"],
  },

  {
    slug: "union-mug",
    title: "Union Mug",
    category: "drinkware",
    subcategory: "Mugs",
    descriptor: "Heavy ceramic. Sits on the desk and stays there.",
    badges: ["premium"],

    hero: {
      src: "/cat-union-mug.jpg",
      alt: "Union Mug — branded ceramic mug, front view",
      aspect: "4/5",
    },

    shortDescription:
      "The Union Mug is built to replace whatever was already on the desk. Heavy ceramic body, clean cylindrical form, comfortable C-handle. Takes branding cleanly — pad-print for crisp graphics, laser-etch for permanence. Not a giveaway. A keeper.",

    features: [
      "Heavy ceramic body, 350ml",
      "Clean cylindrical form — full-wrap branding canvas",
      "Comfortable C-handle",
      "Gloss or matte glaze options",
      "Dishwasher-safe finish",
    ],

    brandingMethods: ["pad-print", "laser-etch"],

    moq: 72,
    leadTimeWeeks: [4, 6],
    sourcing: "Produced through our ceramics partner. Sampling available before run.",

    specs: [
      { label: "Capacity", value: "350ml" },
      { label: "Material", value: "Ceramic" },
      { label: "Finish", value: "Gloss or matte glaze" },
      { label: "Branding area", value: "Full wrap or spot — up to 120 × 80mm" },
      { label: "Dishwasher safe", value: "Yes" },
      { label: "MOQ", value: "72 units" },
    ],

    useCases: [
      "Staff and team gifting",
      "Café and hospitality merch",
      "Premium campaign drops",
      "Corporate welcome kits",
    ],

    relatedSlugs: ["field-bottle", "heavyweight-hoodie", "structured-cap"],
    tags: ["drinkware", "mug", "premium", "corporate-gifting"],
  },

  {
    slug: "field-bottle",
    title: "The Field Bottle",
    category: "drinkware",
    subcategory: "Bottles",
    descriptor: "Built to the spec you’d buy for yourself.",
    badges: ["premium"],

    hero: {
      src: "/catalogue/field-bottle/editorial-hero.jpeg",
      alt: "Field bottle",
      aspect: "4/5",
    },

    gallery: [
      {
        src: "/catalogue/field-bottle/studio.jpeg",
        alt: "Studio shot",
        label: "Studio",
        aspect: "5/4",
      },
      {
        src: "/catalogue/field-bottle/macro.jpeg",
        alt: "Finish detail",
        label: "Finish",
        aspect: "5/4",
      },
      {
        src: "/catalogue/field-bottle/branding-detail.jpg",
        alt: "Branding detail",
        label: "Branding",
        aspect: "5/4",
      },
      {
        src: "/catalogue/field-bottle/construction-detail.jpg",
        alt: "Construction detail",
        label: "Construction",
        aspect: "5/4",
      },
      {
        src: "/catalogue/field-bottle/scale-reference.jpg",
        alt: "Scale reference",
        label: "Scale",
        aspect: "5/4",
      },
    ],

    shortDescription:
      "The Field Bottle is built to the spec of the bottles you’d actually use — not the ones handed out at events. 18/8 food-grade stainless steel, double-walled with a full vacuum seal. Cold for 24 hours, hot for 12. A single-piece threaded lid with a silicone gasket. No straws. No moving parts. Finished in a matte powder-coat that won’t chip against a key and won’t fade in a dishwasher.",

    features: [
      "750ml insulated steel bottle",
      "18/8 food-grade stainless steel",
      "24 hours cold / 12 hours hot",
      "Matte powder-coated finish",
      "Single-piece threaded lid",
    ],

    brandingMethods: ["laser-etch", "pad-print"],

    colours: [
      { name: "Bone", hex: "#E8E1D5" },
      { name: "Fog", hex: "#BFC3C0" },
      { name: "Sage", hex: "#8E9B84" },
      { name: "Slate", hex: "#596067" },
      { name: "Oxblood", hex: "#4A161A" },
      { name: "Ink", hex: "#151B2D" },
      { name: "Black", hex: "#080808" },
    ],

    sizes: ["750ml"],
    moq: 100,
    leadTimeWeeks: [4, 8],
    sourcing: "Manufactured in Ningbo under audited conditions.",

    specs: [
      { label: "Capacity", value: "750ml" },
      { label: "Material", value: "18/8 food-grade stainless steel" },
      { label: "Insulation", value: "24 hours cold / 12 hours hot" },
      { label: "Finish", value: "Matte powder-coat" },
      { label: "Cap", value: "Threaded lid with silicone seal" },
      { label: "Weight", value: "340g empty" },
      { label: "Origin", value: "Ningbo, audited production" },
      { label: "Certifications", value: "LFGB, FDA, BPA-free" },
    ],

    useCases: [
      "Corporate kits",
      "Retail merchandise",
      "Event and conference gifting",
    ],

    relatedSlugs: ["structured-cap", "heavyweight-hoodie", "heavyweight-tee"],
    tags: ["drinkware", "bottle", "premium", "corporate-gifting"],
  },
];