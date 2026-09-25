// AS Colour spec sheet measurements — garment dimensions (not body)
// Tolerance: ±2.5 cm (per AS Colour)

export type SizeRow = {
  size: string;
  width: number;  // body width (cm)
  length: number; // body length (cm)
};

export type ProductSizeGuide = {
  sizes: string[];
  chart: SizeRow[];
  note: string;
};

export type ProductKey = "staple-tee" | "maple-tee" | "classic-tank" | "martina-tank";

const NOTE = "Measurements can vary within 2.5 cm. When between sizes, size up.";

const GUIDES: Record<ProductKey, ProductSizeGuide> = {
  // AS Colour Staple Tee — XSM through 5XL
  "staple-tee": {
    sizes: ["XSM", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    chart: [
      { size: "XSM", width: 43,   length: 68   },
      { size: "S",   width: 47,   length: 71   },
      { size: "M",   width: 52,   length: 75   },
      { size: "L",   width: 56.5, length: 78.5 },
      { size: "XL",  width: 61,   length: 82   },
      { size: "2XL", width: 64,   length: 83.5 },
      { size: "3XL", width: 68,   length: 85   },
      { size: "4XL", width: 75,   length: 87   },
      { size: "5XL", width: 80,   length: 89   },
    ],
    note: NOTE,
  },

  // AS Colour Wo's Maple Tee — XSM through 3XL
  "maple-tee": {
    sizes: ["XSM", "S", "M", "L", "XL", "2XL", "3XL"],
    chart: [
      { size: "XSM", width: 45.5, length: 63.5 },
      { size: "S",   width: 48,   length: 64.5 },
      { size: "M",   width: 50.5, length: 65.5 },
      { size: "L",   width: 53,   length: 66.5 },
      { size: "XL",  width: 55.5, length: 67.5 },
      { size: "2XL", width: 58,   length: 68.5 },
      { size: "3XL", width: 60.5, length: 69.5 },
    ],
    note: NOTE,
  },

  // AS Colour Mens Classic Tank 5073 — S through 3XL (no XSM)
  "classic-tank": {
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    chart: [
      { size: "S",   width: 47.5, length: 70   },
      { size: "M",   width: 52,   length: 74   },
      { size: "L",   width: 56.5, length: 77.5 },
      { size: "XL",  width: 61,   length: 81   },
      { size: "2XL", width: 65.5, length: 84   },
      { size: "3XL", width: 70,   length: 87   },
    ],
    note: NOTE,
  },

  // AS Colour Wo's Martina Tank 4090 — XSM through 2XL
  "martina-tank": {
    sizes: ["XSM", "S", "M", "L", "XL", "2XL"],
    chart: [
      { size: "XSM", width: 43.5, length: 60 },
      { size: "S",   width: 46,   length: 61 },
      { size: "M",   width: 48.5, length: 62 },
      { size: "L",   width: 51,   length: 63 },
      { size: "XL",  width: 53.5, length: 64 },
      { size: "2XL", width: 56,   length: 65 },
    ],
    note: NOTE,
  },
};

export function sizesFor(product: ProductKey): string[] {
  return GUIDES[product].sizes;
}

export function guideFor(product: ProductKey): ProductSizeGuide {
  return GUIDES[product];
}
