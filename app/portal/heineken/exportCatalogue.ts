// Catalogue downloads (Excel + PDF), built in the browser from the items the
// shopper is currently viewing. Libraries are imported on click so they stay
// out of the page bundle.
import { colours, money, sizes, type Item } from './data'

const STORE = 'Heineken Brands Uniform Store'
const PRICE_NOTE = 'Sample prices, NZD'

function stamp() {
  return new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fileName(scope: string, ext: string) {
  const slug = `${STORE} ${scope}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${slug}.${ext}`
}

export async function downloadCatalogueXlsx(items: Item[], scope: string) {
  const XLSX = await import('xlsx')
  const header = ['Brand', 'Item', 'Category', 'Description', 'Branding', 'Sizes', 'Colours', 'Price (NZD)', 'Image']
  const origin = window.location.origin
  const rows = items.map(i => [
    i.brand, i.name, i.cat, i.desc, i.deco, sizes(i).join(', '), colours(i).join(', '), i.price, origin + i.img,
  ])
  const ws = XLSX.utils.aoa_to_sheet([
    [`${STORE} — ${scope}`],
    [`${PRICE_NOTE} · ${items.length} items · ${stamp()}`],
    [],
    header,
    ...rows,
  ])
  ws['!cols'] = [14, 40, 12, 70, 30, 24, 14, 12, 50].map(wch => ({ wch }))
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }]
  rows.forEach((_, n) => {
    const cell = ws[XLSX.utils.encode_cell({ r: 4 + n, c: 7 })]
    if (cell) cell.z = '"$"#,##0.00'
  })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Catalogue')
  XLSX.writeFile(wb, fileName(scope, 'xlsx'))
}

// Product shots are large PNGs; redraw each onto a white canvas at print size
// and embed as JPEG so the PDF stays small enough to email.
async function loadImage(src: string): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src
    })
    const scale = Math.min(1, 600 / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.fillStyle = '#f5f5f6'; ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    return { data: canvas.toDataURL('image/jpeg', 0.82), w, h }
  } catch {
    return null
  }
}

export async function downloadCataloguePdf(items: Item[], scope: string) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, H = 297, M = 14, GAP = 8
  const COLS = 2, ROWS = 3, PER = COLS * ROWS
  const cardW = (W - 2 * M - GAP) / COLS
  const top = 32, bottom = 14
  const cardH = (H - top - bottom - GAP * (ROWS - 1)) / ROWS
  const imgH = 38
  const images = await Promise.all(items.map(i => loadImage(i.img)))
  const pages = Math.max(1, Math.ceil(items.length / PER))

  const chrome = (page: number) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(17, 17, 19)
    doc.text(STORE, M, 16)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(113, 113, 122)
    doc.text(`${scope} · ${PRICE_NOTE} · ${stamp()} · by Tendencies`, M, 22)
    doc.setDrawColor(229, 229, 232); doc.line(M, 26, W - M, 26)
    doc.text(`Page ${page} of ${pages}`, W - M, H - 7, { align: 'right' })
  }

  items.forEach((item, n) => {
    const slot = n % PER
    if (slot === 0) { if (n > 0) doc.addPage(); chrome(n / PER + 1) }
    const x = M + (slot % COLS) * (cardW + GAP)
    const y = top + Math.floor(slot / COLS) * (cardH + GAP)

    doc.setDrawColor(229, 229, 232); doc.roundedRect(x, y, cardW, cardH, 2, 2)
    doc.setFillColor(245, 245, 246); doc.rect(x + 0.3, y + 0.3, cardW - 0.6, imgH, 'F')
    const img = images[n]
    if (img) {
      const s = Math.min((cardW - 8) / img.w, (imgH - 6) / img.h)
      const w = img.w * s, h = img.h * s
      doc.addImage(img.data, 'JPEG', x + (cardW - w) / 2, y + (imgH - h) / 2, w, h)
    }

    let ty = y + imgH + 6
    const tx = x + 4, tw = cardW - 8
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(113, 113, 122)
    doc.text(`${item.brand} · ${item.cat}`, tx, ty)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(17, 17, 19)
    doc.text(money(item.price), x + cardW - 4, ty + 0.5, { align: 'right' })
    ty += 5
    const name = doc.splitTextToSize(item.name, tw).slice(0, 2)
    doc.text(name, tx, ty)
    ty += name.length * 4.6
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(63, 63, 70)
    const room = Math.max(1, Math.floor((y + cardH - 9 - ty) / 3.6))
    let desc: string[] = doc.splitTextToSize(item.desc, tw)
    if (desc.length > room) { desc = desc.slice(0, room); desc[room - 1] = desc[room - 1].replace(/\s*\S*$/, '') + '…' }
    doc.text(desc, tx, ty + 1)
    doc.setFontSize(7.5); doc.setTextColor(113, 113, 122)
    doc.text(doc.splitTextToSize(`Branding: ${item.deco}`, tw).slice(0, 1), tx, y + cardH - 4)
  })

  doc.save(fileName(scope, 'pdf'))
}
