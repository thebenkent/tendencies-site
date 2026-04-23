// lib/products/data.ts
// Static product catalogue. Swap this file for a CMS fetch later —
// the rest of the code only consumes the helpers in ./index.ts.

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

    relatedSlugs: ["crew-sweat", "heavyweight-tee", "structured-cap"],
    tags: ["apparel", "hoodie", "teamwear", "premium"],
  },

  // --- Stubs for related product rail (fill these out later) ------------------
  {
    slug: "crew-sweat",
    title: "Crew Sweat",
    category: "apparel",
    subcategory: "Sweats",
    descriptor: "380gsm loopback cotton. The versatile companion to the hoodie.",
    badges: ["teamwear"],
    hero: {
      src: "/catalogue/crew-sweat/hero.jpg",
      alt: "Crew sweat, bone colourway",
      aspect: "4/5",
    },
    shortDescription:
      "A mid-weight crew sweat in loopback cotton. Built to sit alongside the Heavyweight Hoodie in any teamwear set.",
    features: [
      "380gsm loopback cotton",
      "Classic set-in sleeve",
      "Ribbed neck, cuff, hem",
      "Retail-grade finish",
    ],
    brandingMethods: ["embroidery", "screen-print", "dtf"],
    colours: [
      { name: "Bone", hex: "#f0ece2" },
      { name: "Coal", hex: "#1a1a1a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    moq: 50,
    leadTimeWeeks: [6, 8],
    specs: [
      { label: "Fabric", value: "100% cotton loopback" },
      { label: "Weight", value: "380gsm" },
    ],
    relatedSlugs: ["heavyweight-hoodie", "heavyweight-tee"],
    tags: ["apparel", "sweat", "teamwear"],
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
    features: ["260gsm single jersey", "Shoulder-to-shoulder tape", "Ribbed collar"],
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
    relatedSlugs: ["heavyweight-hoodie", "crew-sweat"],
    tags: ["apparel", "tee"],
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
    features: ["Six-panel structured crown", "Pre-curved brim", "Metal buckle back"],
    brandingMethods: ["embroidery", "woven-label"],
    colours: [
      { name: "Coal", hex: "#1a1a1a" },
      { name: "Bone", hex: "#f0ece2" },
      { name: "Lime", hex: "#b8f400" },
    ],
    moq: 100,
    leadTimeWeeks: [5, 7],
    specs: [
      { label: "Fabric", value: "Heavy cotton twill" },
      { label: "Closure", value: "Metal buckle" },
    ],
    relatedSlugs: ["heavyweight-hoodie"],
    tags: ["headwear", "cap"],
  },
];
