import { NextResponse } from 'next/server'
import { getTenant, getCampaign, getProducts, getProductProgress } from '@/lib/merch/db'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const url = new URL(req.url)
  const campaignSlug = url.searchParams.get('campaign')
  if (!campaignSlug) {
    return NextResponse.json({ error: 'campaign query param required' }, { status: 400 })
  }

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return NextResponse.json({ error: 'Portal not found' }, { status: 404 })

  const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

  const products = await getProducts(campaign.id)
  const progress = await Promise.all(products.map((p) => getProductProgress(p, campaign)))

  return NextResponse.json({ progress })
}
