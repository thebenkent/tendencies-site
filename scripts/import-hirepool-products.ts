/**
 * Hirepool Product Importer
 * ─────────────────────────
 * Reads data/hirepool-products.csv (or .xlsx) and optionally
 * data/hirepool-order-history.csv (or .xlsx), then generates
 * lib/portal/clients/hirepool-products.ts.
 *
 * Usage:
 *   npm run import:hirepool
 *
 * Required CSV columns (hirepool-products):
 *   sku, name, category_id, category_name, description,
 *   colours, sizes, decoration, lead_min, lead_max,
 *   sell_price_nzd, requires_staff_name, active
 *
 * Optional columns:
 *   image, images, collections, buy_price_nzd, material, moq, tags, notes
 *
 * Pipe-separated list columns:  colours, sizes, images, collections, tags
 *   e.g.  "Navy|Orange"   or   "Branch Essentials|Safety Programme"
 *
 * Order history CSV columns (hirepool-order-history):
 *   order_ref, date, sku, client, qty, unit_price_nzd, total_nzd, notes
 *   Order rows are linked to products by SKU and embedded as orderHistory[].
 *
 * XLSX support:
 *   Save as data/hirepool-products.xlsx — the script prefers .xlsx over .csv.
 *   Same for data/hirepool-order-history.xlsx.
 *
 * To add a product: add a row to the CSV, run this script, run npm run build.
 * To disable a product without deleting it: set active=false.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as XLSX from 'xlsx'

// ── Path configuration ────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..')
const DATA_XLSX = path.join(ROOT, 'data', 'hirepool-products.xlsx')
const DATA_CSV = path.join(ROOT, 'data', 'hirepool-products.csv')
const ORDERS_XLSX = path.join(ROOT, 'data', 'hirepool-order-history.xlsx')
const ORDERS_CSV = path.join(ROOT, 'data', 'hirepool-order-history.csv')
const OUTPUT = path.join(ROOT, 'lib', 'portal', 'clients', 'hirepool-products.ts')

// ── Category metadata (ordering + descriptions + hero images) ─────────────────
const CATEGORY_META: Record<string, { order: number; description: string; image: string }> = {
  'staff-apparel': {
    order: 1,
    description:
      'Everyday branded apparel for branch teams — polos, tees, hoodies, and caps in approved Hirepool styles.',
    image: '/edge-city/fashion-biz-p200ms-hero.png',
  },
  'safety-hi-vis': {
    order: 2,
    description:
      'Hi-vis rated apparel for site teams, yard operations, and compliance-required roles. All items meet AS/NZS standards.',
    image: '/edge-city/syzmik-hi-vis-ZH239-hero.png',
  },
  'branch-kits': {
    order: 3,
    description:
      'Pre-built kits for new branch openings and branch refreshes. Everything needed to dress a new location consistently from day one.',
    image: '/edge-city/placeholder.png',
  },
  'trade-packs': {
    order: 4,
    description:
      'Branded merchandise packs for trade account customers, contractors, and key accounts. Keeps Hirepool front of mind on the job.',
    image: '/edge-city/placeholder.png',
  },
  'event-campaign': {
    order: 5,
    description:
      'Branded items for trade days, safety campaigns, sponsorships, and seasonal pushes. Flexible formats for short-run and repeat requirements.',
    image: '/edge-city/as-colour-1174-hero.png',
  },
}

// ── Featured collection metadata ──────────────────────────────────────────────
const COLLECTION_META: Record<string, { title: string; subtitle: string; categorySlug: string }> = {
  'Branch Essentials': {
    title: 'Branch Essentials',
    subtitle: 'The core uniform set for every branch — polo, tee, hi-vis, and cap.',
    categorySlug: 'staff-apparel',
  },
  'Safety Programme': {
    title: 'Safety Programme',
    subtitle: 'Hi-vis rated apparel for site, yard, and compliance-required roles.',
    categorySlug: 'safety-hi-vis',
  },
  'Trade & Customer': {
    title: 'Trade & Customer',
    subtitle: 'Branded packs for trade account customers and key contractors.',
    categorySlug: 'trade-packs',
  },
}

// ── Row types ─────────────────────────────────────────────────────────────────
type Row = Record<string, string>

type OrderRow = {
  orderRef: string
  date: string
  sku: string
  client: string
  qty: number
  unitPriceCents: number
  totalCents: number
  notes: string
}

// ── Read rows from XLSX or CSV ────────────────────────────────────────────────
function readRows(xlsxPath: string, csvPath: string, label: string): Row[] {
  let workbook: XLSX.WorkBook

  if (fs.existsSync(xlsxPath)) {
    console.log(`Reading XLSX: ${xlsxPath}`)
    workbook = XLSX.readFile(xlsxPath)
  } else if (fs.existsSync(csvPath)) {
    console.log(`Reading CSV: ${csvPath}`)
    // Read as buffer with UTF-8 codepage to preserve em-dashes and special chars
    const buf = fs.readFileSync(csvPath)
    workbook = XLSX.read(buf, { type: 'buffer', codepage: 65001 })
  } else {
    console.error(`ERROR: No ${label} file found.`)
    console.error(`  Expected: ${xlsxPath}`)
    console.error(`       or: ${csvPath}`)
    process.exit(1)
  }

  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  // raw: false returns formatted values (keeps dates as strings, not serial numbers)
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false })
  return rows.map(r =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? '')]))
  )
}

function normaliseDate(raw: string): string {
  // Convert M/D/YY or M/D/YYYY → YYYY-MM-DD; pass through anything already ISO-shaped
  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (slash) {
    const [, m, d, y] = slash
    const year = y.length === 2 ? (parseInt(y) < 50 ? 2000 + parseInt(y) : 1900 + parseInt(y)) : parseInt(y)
    return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return raw.trim()
}

function readOrderRows(): OrderRow[] {
  if (!fs.existsSync(ORDERS_XLSX) && !fs.existsSync(ORDERS_CSV)) {
    console.log('No order history file found — skipping order history.')
    return []
  }

  const rows = readRows(ORDERS_XLSX, ORDERS_CSV, 'order history')
  return rows
    .filter(r => r.sku?.trim() && r.order_ref?.trim())
    .map(r => ({
      orderRef: r.order_ref.trim(),
      date: normaliseDate(r.date),
      sku: r.sku.trim(),
      client: r.client?.trim() || '',
      qty: parseInt(r.qty) || 0,
      unitPriceCents: Math.round(parseFloat(r.unit_price_nzd) * 100) || 0,
      totalCents: Math.round(parseFloat(r.total_nzd) * 100) || 0,
      notes: r.notes?.trim() || '',
    }))
}

// ── Slugify ───────────────────────────────────────────────────────────────────
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Pipe-separated field → array ──────────────────────────────────────────────
function pipe(s: string): string[] {
  return s.split('|').map(v => v.trim()).filter(Boolean)
}

// ── Validate a row ────────────────────────────────────────────────────────────
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

// ── Build order history literal ───────────────────────────────────────────────
function buildOrderHistoryLiteral(orders: OrderRow[]): string {
  if (!orders.length) return ''
  const entries = orders.map(o => {
    const parts: string[] = [
      `orderRef: ${JSON.stringify(o.orderRef)}`,
      `date: ${JSON.stringify(o.date)}`,
      `qty: ${o.qty}`,
      `unitPriceCents: ${o.unitPriceCents}`,
      `totalCents: ${o.totalCents}`,
    ]
    if (o.client) parts.push(`client: ${JSON.stringify(o.client)}`)
    if (o.notes) parts.push(`notes: ${JSON.stringify(o.notes)}`)
    return `      { ${parts.join(', ')} }`
  })
  return `\n    orderHistory: [\n${entries.join(',\n')},\n    ],`
}

// ── Build a product object literal (as string) ────────────────────────────────
function buildProductLiteral(row: Row, orderHistory: OrderRow[]): string {
  const sku = row.sku.trim()
  const id = slugify(sku)
  const name = row.name.trim()
  const categoryId = row.category_id.trim()
  const description = row.description.trim().replace(/"/g, '\\"')
  const colours = pipe(row.colours)
  const sizes = pipe(row.sizes)
  const tags = pipe(row.tags || '')
  const decoration = row.decoration.trim()
  const leadMin = parseInt(row.lead_min) || 2
  const leadMax = parseInt(row.lead_max) || 4
  const priceCents = Math.round(parseFloat(row.sell_price_nzd) * 100)
  const requiresStaffName = row.requires_staff_name?.toLowerCase() === 'true'
  const image = row.image?.trim()
  const fallbackImage = `/hirepool/placeholder.png`
  const additionalImages = pipe(row.images || '')
  const moq = row.moq?.trim() ? parseInt(row.moq) : undefined
  const material = row.material?.trim()

  const coloursLiteral = colours.length
    ? `[\n        ${colours.map(c => `{ name: ${JSON.stringify(c)} }`).join(',\n        ')},\n      ]`
    : `[]`

  const sizesLiteral = `[${sizes.map(s => JSON.stringify(s)).join(', ')}]`

  const imagesLine = additionalImages.length > 0
    ? `\n    images: [${additionalImages.map(i => JSON.stringify(i)).join(', ')}],`
    : ''

  const moqLine = moq != null ? `\n    moq: ${moq},` : ''
  const materialLine = material ? `\n    material: ${JSON.stringify(material)},` : ''
  const tagsLine = tags.length ? `\n    tags: ${JSON.stringify(tags)},` : ''

  const productOrders = orderHistory.filter(o => o.sku === sku)
  const orderHistoryLine = buildOrderHistoryLiteral(productOrders)

  return `  {
    id: ${JSON.stringify(id)},
    slug: ${JSON.stringify(id)},
    sku: ${JSON.stringify(sku)},
    name: ${JSON.stringify(name)},
    categoryId: ${JSON.stringify(categoryId)},
    description: ${JSON.stringify(description)},
    image: ${JSON.stringify(image || fallbackImage)},${imagesLine}
    sizes: ${sizesLiteral},
    colours: ${coloursLiteral},
    decorationMethod: ${JSON.stringify(decoration)},
    leadWeeks: [${leadMin}, ${leadMax}],
    priceCents: ${priceCents},
    requiresStaffName: ${requiresStaffName},${moqLine}${materialLine}${tagsLine}${orderHistoryLine}
  }`
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const rows = readRows(DATA_XLSX, DATA_CSV, 'products')
  const orderHistory = readOrderRows()
  const allWarnings: string[] = []

  const activeRows = rows.filter(row => {
    const active = row.active?.toLowerCase()
    return active !== 'false' && active !== '0' && active !== 'no'
  })

  console.log(`Products — total: ${rows.length}, active: ${activeRows.length}`)
  console.log(`Order history entries: ${orderHistory.length}`)

  activeRows.forEach((row, i) => {
    const warnings = validate(row, i)
    allWarnings.push(...warnings)
  })

  if (allWarnings.length > 0) {
    console.warn('\n⚠ Validation warnings:')
    allWarnings.forEach(w => console.warn(' ', w))
    console.warn('')
  }

  const seenIds = new Set<string>()
  for (const row of activeRows) {
    const id = slugify(row.sku?.trim() || row.name?.trim())
    if (seenIds.has(id)) {
      console.error(`ERROR: Duplicate product ID "${id}" — check rows with same SKU`)
      process.exit(1)
    }
    seenIds.add(id)
  }

  const categoryProducts: Record<string, Row[]> = {}
  const categoryNames: Record<string, string> = {}

  for (const row of activeRows) {
    const catId = row.category_id.trim()
    const catName = row.category_name?.trim() || catId
    if (!categoryProducts[catId]) categoryProducts[catId] = []
    categoryProducts[catId].push(row)
    categoryNames[catId] = catName
  }

  const sortedCategoryIds = Object.keys(categoryProducts).sort((a, b) => {
    const orderA = CATEGORY_META[a]?.order ?? 99
    const orderB = CATEGORY_META[b]?.order ?? 99
    return orderA - orderB
  })

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
  ts.push(`// Run: npm run import:hirepool`)
  ts.push(`// Source: data/hirepool-products.csv (or .xlsx)`)
  ts.push(`//         data/hirepool-order-history.csv (or .xlsx)`)
  ts.push(`// Generated: ${new Date().toISOString()}`)
  ts.push(`// ─────────────────────────────────────────────────────────────────────────────`)
  ts.push(``)
  ts.push(`import type { PortalCategory, PortalProduct, PortalFeaturedCollection } from '../types'`)
  ts.push(``)

  ts.push(`export const HIREPOOL_PRODUCTS: PortalProduct[] = [`)
  for (const row of activeRows) {
    ts.push(buildProductLiteral(row, orderHistory) + ',')
  }
  ts.push(`]`)
  ts.push(``)

  ts.push(`export const HIREPOOL_CATEGORIES: PortalCategory[] = [`)
  for (const catId of sortedCategoryIds) {
    const meta = CATEGORY_META[catId]
    const catName = categoryNames[catId]
    const description = meta?.description ?? `${catName} products.`
    const image = meta?.image ?? `/hirepool/placeholder.png`
    const products = categoryProducts[catId].map(row =>
      buildProductLiteral(row, orderHistory)
    )

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

  ts.push(`export const HIREPOOL_FEATURED_COLLECTIONS: PortalFeaturedCollection[] = [`)
  for (const [tag, productIds] of Object.entries(collectionProducts)) {
    const meta = COLLECTION_META[tag]
    const id = slugify(tag)
    const title = meta?.title ?? tag
    const subtitle = meta?.subtitle ?? ''
    const categorySlug = meta?.categorySlug ?? 'staff-apparel'
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
  console.log(`  Categories:  ${sortedCategoryIds.length}`)
  console.log(`  Products:    ${activeRows.length}`)
  console.log(`  Collections: ${Object.keys(collectionProducts).length}`)
  if (allWarnings.length > 0) {
    console.log(`  Warnings:    ${allWarnings.length} (see above)`)
  }
}

main()
