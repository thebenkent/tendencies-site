// ⚠️ Measurements sourced from supplier spec sheet — verify before launch
// All values in centimetres. Tolerance: ±2.5cm

export type SizeRow = {
  size: string;
  chest: number; // half-chest (cm)
  length: number; // body length (cm)
};

export type ProductSizeGuide = {
  sizes: string[];
  chart: SizeRow[];
  note: string;
};

const ALL_SIZES = ["XSM", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

const TEE_CHART: SizeRow[] = [
  { size: "XSM", chest: 44, length: 63 },
  { size: "S",   chest: 47, length: 66 },
  { size: "M",   chest: 50, length: 69 },
  { size: "L",   chest: 53, length: 72 },
  { size: "XL",  chest: 56, length: 75 },
  { size: "2XL", chest: 60, length: 77 },
  { size: "3XL", chest: 64, length: 79 },
  { size: "4XL", chest: 68, length: 81 },
  { size: "5XL", chest: 72, length: 83 },
];

const TANK_CHART: SizeRow[] = [
  { size: "XSM", chest: 43, length: 62 },
  { size: "S",   chest: 46, length: 65 },
  { size: "M",   chest: 49, length: 68 },
  { size: "L",   chest: 52, length: 71 },
  { size: "XL",  chest: 55, length: 74 },
  { size: "2XL", chest: 59, length: 76 },
  { size: "3XL", chest: 63, length: 78 },
];

const NOTE = "All measurements are approximate (±2.5 cm). When between sizes, size up.";

export type ProductKey = "staple-tee" | "maple-tee" | "staple-tank" | "maple-tank";

const GUIDES: Record<ProductKey, ProductSizeGuide> = {
  "staple-tee": {
    sizes: ALL_SIZES,
    chart: TEE_CHART,
    note: NOTE,
  },
  "maple-tee": {
    // No 4XL or 5XL
    sizes: ["XSM", "S", "M", "L", "XL", "2XL", "3XL"],
    chart: TEE_CHART.filter((r) => !["4XL", "5XL"].includes(r.size)),
    note: NOTE,
  },
  "staple-tank": {
    // No XSM, 4XL, or 5XL
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    chart: TANK_CHART.filter((r) => !["XSM", "4XL", "5XL"].includes(r.size)),
    note: NOTE,
  },
  "maple-tank": {
    // No 3XL, 4XL, or 5XL
    sizes: ["XSM", "S", "M", "L", "XL", "2XL"],
    chart: TANK_CHART.filter((r) => !["3XL", "4XL", "5XL"].includes(r.size)),
    note: NOTE,
  },
};

export function sizesFor(product: ProductKey): string[] {
  return GUIDES[product].sizes;
}

export function guideFor(product: ProductKey): ProductSizeGuide {
  return GUIDES[product];
}
