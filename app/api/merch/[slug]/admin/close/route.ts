import { NextResponse } from 'next/server'
import { getTenant, getCampaign, closeCampaign } from '@/lib/merch/db'
import { getAdminContext, canWrite } from '@/lib/merch/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const adminCtx = await getAdminContext(slug)
  if (!adminCtx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(adminCtx.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body?.campaign_slug) return NextResponse.json({ error: 'campaign_slug required' }, { status: 400 })

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const campaign = await getCampaign(tenant.id, body.campaign_slug).catch(() => null)
  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

  const result = await closeCampaign(campaign.id, tenant.id)
  return NextResponse.json(result)
}
