/**
 * Edge City Product Importer
 * ──────────────────────────
 * Reads data/edge-city-products.csv (or .xlsx) and generates
 * lib/portal/clients/edge-city-products.ts.
 *
 * Usage:
 *   npm run import:edge-city
 *
 * Required CSV columns:
 *   sku, name, category_id, category_name, description,
 *   colours, sizes, decoration, lead_min, lead_max,
 *   sell_price_nzd, requires_staff_name, active
 *
 * Optional columns:
 *   image, collections, buy_price_nzd, material, gender, notes
 *
 * Pipe-separated list columns:  colours, sizes, collections
 *   e.g.  "Navy|Khaki"   or   "Summer Site Essentials|Winter Site Kit"
 *
 * To add a product: add a row to the CSV, run this script, run npm run build.
 * To disable a product without deleting it: set active=false.
 *
 * XLSX support:
 *   Save the spreadsheet as data/edge-city-products.xlsx — the script
 *   prefers .xlsx over .csv when both are present.
 *   Sheet must be the first sheet; column headers must match the CSV schema above.
 *
 * Future: replace local file with Google Sheets API call by swapping
 *   the readRows() function — the rest of the pipeline is provider-agnostic.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as XLSX from 'xlsx'

// ── Path configuration ────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..')
const DATA_XLSX = path.join(ROOT, 'data', 'edge-city-products.xlsx')
const DATA_CSV = path.join(ROOT, 'data', 'edge-city-products.csv')
const OUTPUT = path.join(ROOT, 'lib', 'portal', 'clients', 'edge-city-products.ts')

// ── Category metadata (ordering + descriptions + hero images) ─────────────────
// Edit this map to control category order, description, and hero image.
// If a category_id appears in the CSV but not here, a fallback is generated.
const CATEGORY_META: Record<string, { order: number; description: string; image: string }> = {
  'hi-vis-essentials': {
    order: 1,
    description: 'Class D/N rated high-visibility wear. Meet site safety standards on day one.',
    image: '/edge-city/syzmik-hi-vis-zh320.png',
  },
  'tees-polos': {
    order: 2,
    description: 'Core workwear tees and polos. Comfortable for long days on site.',
    image: '/edge-city/syzmik-hi-vis-zh320.png',
  },
  'site-shorts': {
    order: 3,
    description: 'Cooling stretch shorts with multiple cargo pockets for site work.',
    image: '/edge-city/syzmik-hi-vis-zs235-khaki.png',
  },
  'site-pants': {
    order: 4,
    description: 'Durable work trousers with full pockets and reinforced wear points.',
    image: '/edge-city/syzmik-hi-vis-zs235-navy.png',
  },
  'hoodies-midlayers': {
    order: 5,
    description: 'Weather protection and layering. Keep crews warm and visible on site.',
    image: '/edge-city/syzmik-hi-vis-zt467.png',
  },
  headwear: {
    order: 6,
    description: 'Sun, rain, and brand protection. Complete the uniform programme.',
    image: '/edge-city/syzmik-hi-vis-zh320.png',
  },
}

// ── Featured collection metadata ───────────────────────────────────────────────
// Collections are assembled automatically from the CSV "collections" column.
// Define display titles/subtitles here. Products are resolved by their collection tag.
const COLLECTION_META: Record<string, { title: string; subtitle: string; categorySlug: string }> = {
  'Summer Site Essentials': {
    title: 'Summer Site Essentials',
    subtitle: 'Stay visible and cool in the warm months.',
    categorySlug: 'hi-vis-essentials',
  },
  'Winter Site Kit': {
    title: 'Layer Up: Winter Ready',
    subtitle: 'Weather protection from hi-vis to warm fleece.',
    categorySlug: 'hoodies-midlayers',
  },
  'Project Team Uniform': {
    title: 'Project Team Uniform',
    subtitle: 'Complete hi-vis programme for site-wide consistency.',
    categorySlug: 'hi-vis-essentials',
  },
  'Project Manager Kit': {
    title: 'Project Manager Kit',
    subtitle: 'Smart workwear for the office-to-site transition.',
    categorySlug: 'tees-polos',
  },
}

// ── Row type ──────────────────────────────────────────────────────────────────
type Row = Record<string, string>

// ── Read rows from XLSX or CSV ────────────────────────────────────────────────
function readRows(): Row[] {
  let workbook: XLSX.WorkBook

  if (fs.existsSync(DATA_XLSX)) {
    console.log(`Reading XLSX: ${DATA_XLSX}`)
    workbook = XLSX.readFile(DATA_XLSX)
  } else if (fs.existsSync(DATA_CSV)) {
    console.log(`Reading CSV: ${DATA_CSV}`)
    workbook = XLSX.readFile(DATA_CSV, { raw: false })
  } else {
    console.error('ERROR: No data file found.')
    console.error(`  Expected: ${DATA_XLSX}`)
    console.error(`       or: ${DATA_CSV}`)
    process.exit(1)
  }

  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  // Normalise every cell value to string so callers can always call .trim()
  const rows: Row[] = raw.map(r =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? '')]))
  )
  return rows
}

// ── Slugify ───────────────────────────────────────────────────────────────────
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Pipe-separated field → array ──────────────────────────────────────────────
function pipe(s: string): string[] {
  return s.split('|').map(v => v.trim()).filter(Boolean)
}

// ── Validate a row, return list of warnings ───────────────────────────────────
function validate(row: Row, rowIndex: number): string[] {
  const warnings: string[] = []
  const tag = `Row ${rowIndex + 2} (${row.sku || 'no-sku'})`

  if (!row.sku?.trim()) warnings.push(`${tag}: missing SKU`)
  if (!row.name?.trim()) warnings.push(`${tag}: missing name`)
  if (!row.category_id?.trim()) warnings.push(`${tag}: missing category_id`)

  const price = parseFloat(row.sell_price_nzd)
  if (!row.sell_price_nzd?.trim() || isNaN(price) || price <= 0) {
    warnings.push(`${tag}: missing or invalid sell_price_nzd ("${row.sell_price_nzd}")`)
  }

  if (!row.sizes?.trim()) warnings.push(`${tag}: missing sizes`)
  if (!row.decoration?.trim()) warnings.push(`${tag}: missing decoration`)

  return warnings
}

// ── Build a product object literal (as string) ────────────────────────────────
function buildProductLiteral(row: Row): string {
  const sku = row.sku.trim()
  const id = slugify(sku)
  const name = row.name.trim()
  const categoryId = row.category_id.trim()
  const description = row.description.trim().replace(/"/g, '\\"')
  const colours = pipe(row.colours)
  const sizes = pipe(row.sizes)
  const decoration = row.decoration.trim()
  const leadMin = parseInt(row.lead_min) || 2
  const leadMax = parseInt(row.lead_max) || 4
  const priceCents = Math.round(parseFloat(row.sell_price_nzd) * 100)
  const requiresStaffName = row.requires_staff_name?.toLowerCase() === 'true'
  const image = row.image?.trim()
  const fallbackImage = `/edge-city/placeholder.png`

  const coloursLiteral = colours.length
    ? `[\n        ${colours.map(c => `{ name: ${JSON.stringify(c)} }`).join(',\n        ')},\n      ]`
    : `[]`

  const sizesLiteral = `[${sizes.map(s => JSON.stringify(s)).join(', ')}]`

  return `  {
    id: ${JSON.stringify(id)},
    slug: ${JSON.stringify(id)},
    sku: ${JSON.stringify(sku)},
    name: ${JSON.stringify(name)},
    categoryId: ${JSON.stringify(categoryId)},
    description: ${JSON.stringify(description)},
    image: ${JSON.stringify(image || fallbackImage)},
    sizes: ${sizesLiteral},
    colours: ${coloursLiteral},
    decorationMethod: ${JSON.stringify(decoration)},
    leadWeeks: [${leadMin}, ${leadMax}],
    priceCents: ${priceCents},
    requiresStaffName: ${requiresStaffName},
  }`
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const rows = readRows()
  const allWarnings: string[] = []

  // Filter active rows
  const activeRows = rows.filter(row => {
    const active = row.active?.toLowerCase()
    return active !== 'false' && active !== '0' && active !== 'no'
  })

  console.log(`Total rows: ${rows.length}, active: ${activeRows.length}`)

  // Validate
  activeRows.forEach((row, i) => {
    const warnings = validate(row, i)
    allWarnings.push(...warnings)
  })

  if (allWarnings.length > 0) {
    console.warn('\n⚠ Validation warnings:')
    allWarnings.forEach(w => console.warn(' ', w))
    console.warn('')
  }

  // Track duplicate IDs
  const seenIds = new Set<string>()
  for (const row of activeRows) {
    const id = slugify(row.sku?.trim() || row.name?.trim())
    if (seenIds.has(id)) {
      console.error(`ERROR: Duplicate product ID "${id}" — check rows with same SKU`)
      process.exit(1)
    }
    seenIds.add(id)
  }

  // Group products by category
  const categoryProducts: Record<string, Row[]> = {}
  const categoryNames: Record<string, string> = {}

  for (const row of activeRows) {
    const catId = row.category_id.trim()
    const catName = row.category_name?.trim() || catId
    if (!categoryProducts[catId]) categoryProducts[catId] = []
    categoryProducts[catId].push(row)
    categoryNames[catId] = catName
  }

  // Sort categories by CATEGORY_META order, then alphabetically
  const sortedCategoryIds = Object.keys(categoryProducts).sort((a, b) => {
    const orderA = CATEGORY_META[a]?.order ?? 99
    const orderB = CATEGORY_META[b]?.order ?? 99
    return orderA - orderB
  })

  // Build featured collections: collect product IDs per collection tag
  const collectionProducts: Record<string, string[]> = {}
  for (const row of activeRows) {
    const tags = pipe(row.collections || '')
    const id = slugify(row.sku?.trim() || row.name?.trim())
    for (const tag of tags) {
      if (!collectionProducts[tag]) collectionProducts[tag] = []
      collectionProducts[tag].push(id)
    }
  }

  // ── Generate TypeScript ───────────────────────────────────────────────────
  const ts: string[] = []

  ts.push(`// ─────────────────────────────────────────────────────────────────────────────`)
  ts.push(`// AUTO-GENERATED — do not edit by hand.`)
  ts.push(`// Run: npm run import:edge-city`)
  ts.push(`// Source: data/edge-city-products.csv (or .xlsx)`)
  ts.push(`// Generated: ${new Date().toISOString()}`)
  ts.push(`// ─────────────────────────────────────────────────────────────────────────────`)
  ts.push(``)
  ts.push(`import type { PortalCategory, PortalProduct, PortalFeaturedCollection } from '../types'`)
  ts.push(``)

  // Emit flat product array
  ts.push(`export const EDGE_CITY_PRODUCTS: PortalProduct[] = [`)
  for (const row of activeRows) {
    ts.push(buildProductLiteral(row) + ',')
  }
  ts.push(`]`)
  ts.push(``)

  // Emit categories
  ts.push(`export const EDGE_CITY_CATEGORIES: PortalCategory[] = [`)
  for (const catId of sortedCategoryIds) {
    const meta = CATEGORY_META[catId]
    const catName = categoryNames[catId]
    const description = meta?.description ?? `${catName} products.`
    const image = meta?.image ?? `/edge-city/placeholder.png`
    const products = categoryProducts[catId].map(row => buildProductLiteral(row))

    ts.push(`  {`)
    ts.push(`    id: ${JSON.stringify(catId)},`)
    ts.push(`    slug: ${JSON.stringify(catId)},`)
    ts.push(`    name: ${JSON.stringify(catName)},`)
    ts.push(`    description: ${JSON.stringify(description)},`)
    ts.push(`    image: ${JSON.stringify(image)},`)
    ts.push(`    products: [`)
    ts.push(products.map(p => p.split('\n').map(l => '    ' + l).join('\n') + ',').join('\n'))
    ts.push(`    ],`)
    ts.push(`  },`)
  }
  ts.push(`]`)
  ts.push(``)

  // Emit featured collections
  ts.push(`export const EDGE_CITY_FEATURED_COLLECTIONS: PortalFeaturedCollection[] = [`)
  for (const [tag, productIds] of Object.entries(collectionProducts)) {
    const meta = COLLECTION_META[tag]
    const id = slugify(tag)
    const title = meta?.title ?? tag
    const subtitle = meta?.subtitle ?? ''
    const categorySlug = meta?.categorySlug ?? 'hi-vis-essentials'
    ts.push(`  {`)
    ts.push(`    id: ${JSON.stringify(id)},`)
    ts.push(`    title: ${JSON.stringify(title)},`)
    ts.push(`    subtitle: ${JSON.stringify(subtitle)},`)
    ts.push(`    categorySlug: ${JSON.stringify(categorySlug)},`)
    ts.push(`    productIds: ${JSON.stringify(productIds)},`)
    ts.push(`  },`)
  }
  ts.push(`]`)
  ts.push(``)

  fs.writeFileSync(OUTPUT, ts.join('\n'), 'utf8')
  console.log(`\n✓ Generated: ${OUTPUT}`)
  console.log(`  Categories: ${sortedCategoryIds.length}`)
  console.log(`  Products:   ${activeRows.length}`)
  console.log(`  Collections: ${Object.keys(collectionProducts).length}`)
  if (allWarnings.length > 0) {
    console.log(`  Warnings:   ${allWarnings.length} (see above)`)
  }
}

main()
