import { getTenant, getCampaign, getReservationsForTenant } from '@/lib/merch/db'
import { getAdminContext } from '@/lib/merch/auth'

function esc(val: string | number | null | undefined): string {
  const s = val == null ? '' : String(val)
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
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

  const headers = [
    'Reference', 'Order ID', 'Date', 'First Name', 'Last Name', 'Email', 'Phone',
    'Team', 'Grade', 'Player Name', 'Product', 'Size', 'Colour', 'Qty',
    'Unit Price', 'Delivery', 'Status',
  ]

  // One CSV row per order line (expands multi-product orders)
  const rows: string[] = []
  for (const order of orders) {
    const c = order.merch_customers
    for (const line of order.merch_order_lines) {
      rows.push([
        order.order_number ?? '',
        order.id,
        new Date(order.created_at).toLocaleDateString('en-NZ'),
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.team  ?? '',
        c.grade ?? '',
        line.player_name ?? '',
        line.merch_products.name,
        line.merch_product_variants.size,
        line.merch_product_variants.colour,
        line.qty,
        `$${((line.unit_price_cents) / 100).toFixed(2)}`,
        order.delivery_method,
        order.status,
      ].map(esc).join(','))
    }
  }

  const csv = [headers.map(esc).join(','), ...rows].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${slug}-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
