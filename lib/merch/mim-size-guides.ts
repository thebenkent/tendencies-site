// Mates in Motors 2026 — size guides (source: AS Colour spec sheets)
// Measurements in cm, garment laid flat. AS Colour tolerance: ±2.5cm.

export type SizeCode = 'XSM' | 'SML' | 'MED' | 'LRG' | 'XLG' | '2XL' | '3XL' | '4XL' | '5XL';

export interface SizeGuide {
  title: string;
  sizes: SizeCode[];
  bodyWidth: number[];  // armpit to armpit
  bodyLength: number[]; // high point shoulder to hem
}

export const SIZE_GUIDES: Record<string, SizeGuide> = {
  'staple-tee': {
    title: 'Staple Tee',
    sizes: ['XSM', 'SML', 'MED', 'LRG', 'XLG', '2XL', '3XL', '4XL', '5XL'],
    bodyWidth:  [43,  47,  52,   56.5, 61,  64,   68,   75,   80 ],
    bodyLength: [68,  71,  75,   78.5, 82,  83.5, 85,   87,   89 ],
  },
  'maple-tee': {
    title: "Wo's Maple Tee",
    sizes: ['XSM', 'SML', 'MED', 'LRG', 'XLG', '2XL', '3XL'], // no 4XL/5XL
    bodyWidth:  [45.5, 48,  50.5, 53,   55.5, 58,   60.5],
    bodyLength: [63.5, 64.5, 65.5, 66.5, 67.5, 68.5, 69.5],
  },
  'staple-tank': {
    title: 'Mens Staple Tank (5090)',
    sizes: ['SML', 'MED', 'LRG', 'XLG', '2XL', '3XL'], // no XSM, 4XL, 5XL
    bodyWidth:  [47,  52,  56.5, 61,  64,   68 ],
    bodyLength: [71,  75,  78.5, 82,  83.5, 85 ],
  },
  'maple-tank': {
    title: "Wo's Maple Tank (4017)",
    sizes: ['XSM', 'SML', 'MED', 'LRG', 'XLG', '2XL'], // no 3XL, 4XL, 5XL
    bodyWidth:  [43.5, 46,  48.5, 51,  53.5, 56],
    bodyLength: [64,   65,  66,   67,  68,   69],
  },
};

export const SIZE_GUIDE_NOTE = 'Measurements can vary within 2.5cm.';

// The size dropdown for each product only offers sizes from its guide.
export const sizesFor = (productId: string): SizeCode[] =>
  SIZE_GUIDES[productId]?.sizes ?? ['XSM', 'SML', 'MED', 'LRG', 'XLG', '2XL', '3XL', '4XL', '5XL'];
