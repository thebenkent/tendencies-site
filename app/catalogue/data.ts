export type CatalogueProduct = {
  name: string;
  type: string;
  line: string;
  image: string;
  href: string;
  bestFor?: string;
};

export const FEATURED: CatalogueProduct[] = [
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

export const APPAREL: CatalogueProduct[] = [
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

export const PROMOTIONAL: CatalogueProduct[] = [
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

export const CUSTOM: CatalogueProduct[] = [
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

export type HeroProduct = {
  key: string;
  image: string;
  exclusivity: string;
  title: string[];
  body: string;
  href: string;
  cta: string;
};

export const HERO_PRODUCTS: HeroProduct[] = [
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
