import { NextResponse } from 'next/server'
import { getTenant } from '@/lib/merch/db'
import { getAdminContext, canWrite } from '@/lib/merch/auth'
import { adjustStock, getInventoryByCampaignProduct } from '@/lib/modules/inventory/service'
import { getSupabase } from '@/lib/core/database'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const adminCtx = await getAdminContext(slug)
  if (!adminCtx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const url               = new URL(req.url)
  const campaignProductId = url.searchParams.get('campaign_product_id')
  if (!campaignProductId) {
    return NextResponse.json({ error: 'campaign_product_id required' }, { status: 400 })
  }

  const positions = await getInventoryByCampaignProduct(campaignProductId)
  return NextResponse.json({ inventory: positions })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const adminCtx = await getAdminContext(slug)
  if (!adminCtx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canWrite(adminCtx.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body?.variant_id || body?.delta == null || !body?.notes) {
    return NextResponse.json({ error: 'variant_id, delta, and notes are required' }, { status: 400 })
  }

  // Verify the variant belongs to this tenant's campaign
  const { data: variant } = await getSupabase()
    .from('merch_product_variants')
    .select('id, merch_campaign_products(merch_campaigns(tenant_id))')
    .eq('id', body.variant_id)
    .maybeSingle()

  const variantTenantId =
    (variant as any)?.merch_campaign_products?.merch_campaigns?.tenant_id
  if (!variantTenantId || variantTenantId !== tenant.id) {
    return NextResponse.json({ error: 'Variant not found for this tenant' }, { status: 404 })
  }

  await adjustStock(body.variant_id, tenant.id, body.delta, body.notes, adminCtx.userId)
  return NextResponse.json({ ok: true })
}
