import { getTenant, getCampaign, getReservationsForTenant } from '@/lib/merch/db'
import { getAdminContext } from '@/lib/merch/auth'

// Statuses that represent real demand (exclude speculative reservations and cancellations)
const PRODUCTION_STATUSES = ['confirmed', 'payment_requested', 'paid', 'production', 'completed']

// Display order for fits in the export
const FIT_ORDER = ['Youth', 'Womens', 'Mens', 'Unisex', 'Kids', '']

function esc(val: string | number | null | undefined): string {
  const s = val == null ? '' : String(val)
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

function fitRank(fit: string): number {
  const idx = FIT_ORDER.indexOf(fit)
  return idx === -1 ? FIT_ORDER.length : idx
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const adminCtx = await getAdminContext(slug)
  if (!adminCtx) return new Response('Unauthorized', { status: 401 })

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return new Response('Not found', { status: 404 })

  const url          = new URL(req.url)
  const campaignSlug = url.searchParams.get('campaign') ?? undefined
  let campaignId: string | undefined
  if (campaignSlug) {
    const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
    campaignId = campaign?.id
  }

  const orders = await getReservationsForTenant(tenant.id, { campaignId })

  type ProductionRow = {
    customer:   string
    product:    string
    fit:        string
    size:       string
    playerName: string
    qty:        number
    totalCents: number
  }

  const rows: ProductionRow[] = []

  for (const order of orders) {
    if (!PRODUCTION_STATUSES.includes(order.status)) continue
    const c        = order.merch_customers
    const customer = `${c.first_name} ${c.last_name}`.trim()

    for (const line of order.merch_order_lines) {
      rows.push({
        customer,
        product:    line.merch_products.name,
        fit:        line.merch_product_variants.fit,
        size:       line.merch_product_variants.size,
        playerName: line.player_name ?? '',
        qty:        line.qty,
        totalCents: line.unit_price_cents * line.qty,
      })
    }
  }

  // Sort by product name → fit order → size
  rows.sort((a, b) => {
    if (a.product !== b.product) return a.product.localeCompare(b.product)
    const fitDiff = fitRank(a.fit) - fitRank(b.fit)
    if (fitDiff !== 0) return fitDiff
    return a.size.localeCompare(b.size, undefined, { numeric: true })
  })

  const headers = ['Customer', 'Product', 'Fit', 'Size', 'Player Name', 'Quantity', 'Total']

  const csvRows = rows.map((r) =>
    [
      r.customer,
      r.product,
      r.fit,
      r.size,
      r.playerName,
      r.qty,
      `$${(r.totalCents / 100).toFixed(2)}`,
    ]
      .map(esc)
      .join(','),
  )

  const csv      = [headers.map(esc).join(','), ...csvRows].join('\n')
  const filename = `${slug}-production-${new Date().toISOString().slice(0, 10)}.csv`

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
