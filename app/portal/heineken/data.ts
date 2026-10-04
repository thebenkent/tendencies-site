// Catalogue for the Heineken Brands uniform store, from the
// "Heineken Brands Uniforms QUOTE.xlsx" sheet (adm Indicia). `r` is the sheet
// row and keys the product image. Prices are sample retail prices (NZD).
// Decoration costs and supplier routing from the quote are deliberately
// omitted — this module ships to the browser.

export type Item = {
  r: number
  name: string
  brand: string
  cat: string
  deco: string
  desc: string
  price: number
  img: string
}

// Item descriptions, from adm Indicia's "Heineken Brands Uniforms QUOTE.xlsx" (typos fixed), keyed by sheet row.
const DESC: Record<number, string> = {
  4: "Ribbed knit cuffed hem and longer body for warmth. One size fits all. Printed Branding.",
  5: "Ribbed knit cuffed hem and longer body for warmth. One size fits all. Stitch Panel Branded.",
  6: "Regular fit. Heavy weight 235 GSM 100% cotton flannel. Check design with double chest pockets, long sleeve button up, adjustable cuffs. Right Chest Embroidered.",
  7: "Regular fit. Heavy weight 300 GSM 100% cotton corduroy. Long sleeve button up, double chest pockets, tonal corozo nut buttons, adjustable cuffs. Left chest embroidered.",
  8: "Fully lined with taffeta. Quilted stitch detailing with poly-fill padding. Water repellent rating 10,000mm. Padded collar with removable 3 piece padded hood. Full front blind zippered placket with internal storm flap. Zippered internal chest pocket with internal audio port. Two blind zippered side pockets. Elastic cuffs. Rubber zip pullers. Adjustable draw cord on tailored hem. Left chest embroidered.",
  9: "Five panel with a flat peak. Quick-dry fabric. Adjustable plastic fastener. Embroidered Logo. One size. Circumference 61cm.",
  10: "Modern casual fit. 100% cotton. Fashion collar, buttoned cuffs, chest pocket, contoured hemline. Left Chest Embroidered.",
  11: "Modern Tapered fit. 100% cotton. Button down collar, fold up cuffs, chest pocket. Left Chest Embroidered.",
  12: "Modern casual fit. 100% cotton. Fashion collar, buttoned cuffs, chest pocket, contoured hemline. Left Chest Embroidered.",
  13: "Relaxed fit with heavy weight 203 GSM 100% cotton. Left chest printed.",
  14: "Relaxed fit with heavy weight 203 GSM 100% cotton. Left chest printed.",
  15: "Modern Tapered fit. 100% cotton. Button down collar, fold up cuffs, chest pocket. Left Chest Embroidered.",
  16: "Regular fit with heavy weight 240 GSM 100% cotton.",
  17: "Regular fit with heavy weight 240 GSM 100% cotton.",
  18: "Regular fit. Heavy weight 258 GSM. Front middle branded.",
  19: "Relaxed fit with mid weight 180 GSM 100% cotton. Front middle branded.",
  20: "Relaxed fit with mid weight 180 GSM 100% cotton.",
  21: "The Canvas Half Apron is made from heavy-weight 365 GSM 100% cotton duck canvas. It features self-fabric waist ties, a front patch pocket, and top stitch detailing, all preshrunk to minimise shrinkage.",
  22: "Classic fit. Long sleeve button up shirt, button down collar, one red button.",
  23: "Classic fit. Long sleeve button up shirt, button down collar, one red button.",
  24: "5 panel Cap with flat peak, adjustable metal clasp fastener. One size fits all.",
  25: "Relaxed oversized fit with heavy weight 400 GSM 80% cotton 20% recycled polyester CVC fleece.",
  26: "A boxy oversized fit with heavy weight 280 GSM 100% carded cotton.",
  27: "A boxy oversized fit with heavy weight 280 GSM 100% carded cotton.",
  28: "Loose oversized fit with heavy weight 400 GSM. Left arm printed.",
  29: "Regular fit Mid weight 145 GSM 100% woven cotton. Long sleeve button up shirt, button down collar, chest pocket, one red button.",
  30: "Regular fit Mid weight 145 GSM 100% woven cotton. Long sleeve button up shirt, button down collar, chest pocket, one red button.",
  31: "A boxy oversized fit with heavy weight 280 GSM 100% carded cotton. Front branded, right side, stitched label bottom left.",
  32: "A boxy oversized fit with heavy weight 280 GSM 100% carded cotton. Printed front middle.",
  33: "A boxy oversized fit with heavy weight 280 GSM 100% carded cotton. Printed front middle. White or Black.",
  34: "Relaxed fit, light weight 156 GSM. Left arm branded and back branded.",
  35: "A durable and functional essential for professionals and enthusiasts alike. Crafted from high-quality canvas material, this apron offers reliability and comfort in a compact design. The upper centre pocket provides convenient storage for tools and utensils, keeping you organized and focused. Built for durability, it withstands everyday use with sturdy construction, making it ideal for various tasks.",
  36: "Classic fit, 100% ZQ certified traceable NZ merino wool. High 1/4 jet zip. Stitched Chest Branding.",
  37: "Fully lined with taffeta. Quilted stitch detailing with poly-fill padding. Water repellent rating 10,000mm. Padded collar with removable 3 piece padded hood. Full front blind zippered placket with internal storm flap. Zippered internal chest pocket with internal audio port. Two blind zippered side pockets. Elastic cuffs. Rubber zip pullers. Adjustable draw cord on tailored hem. Stitched chest branding.",
  38: "Tapered fit, 100% cotton. V neck style open check with fashion collar, contoured hemline. Embroidered chest.",
  39: "Tapered fit, 100% cotton. Button down fashion collar, single breast pocket, adjustable cuff and cuff link facility. Embroidered chest.",
  40: "Relaxed fit, light weight 175 GSM 100% cotton. Left Sleeve & Back Branding.",
  41: "Relaxed fit with heavy weight 220 GSM 100% combed cotton. Front chest & Back middle branding. Blue Option, White Option.",
  42: "Relaxed fit with heavy weight 220 GSM 100% combed cotton. Front Chest & Side Branding.",
  43: "Regular fit mid weight. Front Chest Branding & Low Back Branding.",
  44: "Five panel with a flat peak. Quick-dry fabric. Plastic snapback fastener. Branding Printed Right Side Front Cap. One size. Circumference 60.5cm.",
  45: "Regular Fit. 180 GSM 100% combed cotton. Front Middle Branding & Back Top Centre Branding.",
  46: "Mid profile snapback design with a curved peak. 100% cotton on front and back peak with breathable 100% polyester mesh on the back. Plastic snapback closure and tonal under peak lining for all day comfort. One Size - Front Embroidered Cap.",
}

const R = (r: number, name: string, brand: string, cat: string, deco: string, price: number): Item => ({
  r, name, brand, cat, deco, desc: DESC[r] ?? '', price, img: `/heineken/p/r${r}.png`,
})

export const ITEMS: Item[] = [
  R(4, 'Export Beanie', 'Export', 'Headwear', 'Printed branding, cuff', 28),
  R(5, 'Heineken & Monteiths Beanie', 'Heineken', 'Headwear', 'Stitch panel, cuff', 30),
  R(6, 'Export Check Shirt', 'Export', 'Shirts', 'Right chest embroidered', 65),
  R(7, 'Export Cord Shirt', 'Export', 'Shirts', 'Left chest embroidered', 70),
  R(8, 'Export Edge Puffa Jacket', 'Export', 'Outerwear', 'Left chest embroidered', 120),
  R(9, 'Export, Export Ultra (Black) & Tiger Finn Cap', 'Export', 'Headwear', 'Front embroidered logo', 32),
  R(10, 'Export Ultra Ladies Restore Shirt', 'Export Ultra', 'Shirts', 'Left chest embroidered', 60),
  R(11, 'Export Men Restore Shirt', 'Export', 'Shirts', 'Left chest embroidered', 60),
  R(12, 'Export Ladies Restore Shirt', 'Export', 'Shirts', 'Left chest embroidered', 60),
  R(13, 'Export Longsleeve Tee', 'Export', 'Tees', 'Left chest printed', 40),
  R(14, 'Export Ultra Longsleeve Tee', 'Export Ultra', 'Tees', 'Left chest printed', 40),
  R(15, 'Export Ultra Men Restore Shirt', 'Export Ultra', 'Shirts', 'Left chest embroidered', 60),
  R(16, 'Export Polo', 'Export', 'Polos', 'Left chest, tonal (from image)', 48),
  R(17, 'Export Ultra Polo', 'Export Ultra', 'Polos', 'Left chest (from image)', 48),
  R(18, 'Export Reflex Crew Sweatshirt', 'Export', 'Fleece', 'Front middle', 58),
  R(19, 'Export Tee - Option 1 Front Only', 'Export', 'Tees', 'Front middle', 34),
  R(20, 'Export Tee - Option 2 Front & Back Branding', 'Export', 'Tees', 'Front + back', 38),
  R(21, 'Heineken Apron', 'Heineken', 'Aprons', 'Small front print (from image)', 42),
  R(22, 'Heineken Camden Ladies Shirt', 'Heineken', 'Shirts', 'Chest patch + one red button', 68),
  R(23, 'Heineken Camden Mens Shirt', 'Heineken', 'Shirts', 'Chest patch + one red button', 68),
  R(24, 'Heineken Cap', 'Heineken', 'Headwear', 'Woven patch, front (from image)', 32),
  R(25, 'Heineken Crew Sweatshirt', 'Heineken', 'Fleece', 'Front print + woven label, hem', 70),
  R(26, 'Heineken Cropped Heavy Tee', 'Heineken', 'Tees', 'Large front print (from image)', 40),
  R(27, 'Heineken Heavy Tee - White & Black', 'Heineken', 'Tees', 'Chest print (from image)', 40),
  R(28, 'Heineken Hoodie', 'Heineken', 'Fleece', 'Left arm', 78),
  R(29, 'Heineken Oxford Ladies Shirt - White & Black', 'Heineken', 'Shirts', 'Lower front print + one red button', 62),
  R(30, 'Heineken Oxford Mens Shirt - White & Black', 'Heineken', 'Shirts', 'Lower front print + one red button', 62),
  R(31, 'Heineken Racetrack Heavy Tee', 'Heineken', 'Tees', 'Front right side + stitched label, bottom left', 42),
  R(32, 'Heineken Silver Cropped Heavy Tee', 'Heineken Silver', 'Tees', 'Front middle', 40),
  R(33, 'Heineken Silver Heavy Tee - White & Black', 'Heineken Silver', 'Tees', 'Front middle', 40),
  R(34, 'Monteiths Button Tee', 'Monteith’s', 'Tees', 'Left arm + back', 40),
  R(35, 'Monteiths Canvas Apron', 'Monteith’s', 'Aprons', 'Leather patch, bib (from image)', 55),
  R(36, 'Monteiths Highlander Merino', 'Monteith’s', 'Knitwear', 'Stitched chest patch', 115),
  R(37, 'Monteiths Invert Puffa Jacket', 'Monteith’s', 'Outerwear', 'Stitched chest patch', 120),
  R(38, 'Monteiths Ladies Norfolk Shirt', 'Monteith’s', 'Shirts', 'Chest embroidered', 65),
  R(39, 'Monteiths Mens Norfolk Shirt', 'Monteith’s', 'Shirts', 'Chest embroidered', 65),
  R(40, 'Montiths Suede Tee', 'Monteith’s', 'Tees', 'Left sleeve + back', 40),
  R(41, 'Tiger Classic Tee - Blue & White Options', 'Tiger', 'Tees', 'Front chest + back middle', 38),
  R(42, 'Tiger Classic Tee', 'Tiger', 'Tees', 'Front chest + side', 38),
  R(43, 'Tiger Suppy Hoodie', 'Tiger', 'Fleece', 'Front chest + low back', 75),
  R(44, 'Tiger Surf Snapback', 'Tiger', 'Headwear', 'Printed right side, front', 32),
  R(45, 'Tuatara Tee', 'Tuatara', 'Tees', 'Front middle + back top centre', 36),
  R(46, 'Tuatara Trucker Cap', 'Tuatara', 'Headwear', 'Front embroidered', 34),
]

export const BRANDS = ['Export', 'Export Ultra', 'Heineken', 'Heineken Silver', 'Monteith’s', 'Tiger', 'Tuatara']

export const COST_CENTRES = [
  { code: 'HNZ-MKT-410', label: 'HNZ-MKT-410 · Marketing' },
  { code: 'HNZ-TRD-220', label: 'HNZ-TRD-220 · Trade sales' },
  { code: 'HNZ-EVT-115', label: 'HNZ-EVT-115 · Events' },
]

export const ADDRESSES = [
  'Heineken House, 3 Tanner St, Auckland',
  'Monteith’s Brewery, Greymouth',
  'Events store, 14 Pukaki Rd, Mangere',
]

export const STEPS = ['Placed', 'Approved', 'Blanks ordered', 'Decorating', 'QC and packed', 'Dispatched', 'Delivered']

// Order status is an index into STEPS once approved: 0 = awaiting approval,
// 1–6 = progress, -1 = declined.
export type Line = { r: number; colour?: string | null; size: string; qty: number }
export type Order = {
  id: string
  who: string
  site: string
  date: string
  cc: string
  po: string
  status: number
  addr: string
  tracking?: string
  lines: Line[]
}

export const SEED_ORDERS: Order[] = [
  { id: 'HK-1042', who: 'Sam Reid', site: 'Heineken House, Auckland', date: '28 Sep', cc: 'HNZ-MKT-410', po: '', status: 5, addr: 'Heineken House, 3 Tanner St, Auckland', tracking: 'NZC 88213 4410', lines: [{ r: 27, colour: 'Black', size: 'L', qty: 2 }, { r: 24, size: 'One size', qty: 1 }] },
  { id: 'HK-1047', who: 'Sam Reid', site: 'Heineken House, Auckland', date: '2 Oct', cc: 'HNZ-MKT-410', po: '', status: 3, addr: 'Heineken House, 3 Tanner St, Auckland', lines: [{ r: 43, size: 'M', qty: 1 }] },
  { id: 'HK-1051', who: 'Jordan Tui', site: 'Tiger events team', date: '3 Oct', cc: 'HNZ-EVT-115', po: 'EVT-SUMMER-26', status: 0, addr: 'Events store, 14 Pukaki Rd, Mangere', lines: [{ r: 41, colour: 'Blue', size: 'M', qty: 6 }, { r: 44, size: 'One size', qty: 6 }] },
  { id: 'HK-1053', who: 'Mere Walker', site: 'Monteith’s Brewery, Greymouth', date: '4 Oct', cc: 'HNZ-TRD-220', po: '', status: 0, addr: 'Monteith’s Brewery, Greymouth', lines: [{ r: 36, size: 'M', qty: 1 }, { r: 38, size: '12', qty: 1 }] },
]

export function colours(i: Item): string[] {
  if (/White & Black/.test(i.name)) return ['White', 'Black']
  if (/Blue & White/.test(i.name)) return ['Blue', 'White']
  return []
}

export function sizes(i: Item): string[] {
  if (i.cat === 'Headwear' || i.cat === 'Aprons') return ['One size']
  if (/Ladies/.test(i.name)) return ['8', '10', '12', '14', '16', '18']
  return ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
}

export const money = (n: number) => '$' + n.toFixed(2).replace(/\.00$/, '')
