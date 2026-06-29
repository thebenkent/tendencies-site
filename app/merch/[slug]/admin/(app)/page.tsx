import { notFound } from 'next/navigation'
import {
  getTenant, getCampaigns, getProducts, getAdminStats,
  getReservationsForTenant, getProductProgress,
} from '@/lib/merch/db'
import { getAllTransitionsForWorkflow }    from '@/lib/merch/services/workflow'
import { findCustomersWithStats }          from '@/lib/modules/customers/repository'
import { getCampaignAnalytics, queryOutstandingPayments } from '@/lib/modules/analytics/service'
import { findPaymentsByOrderIds }          from '@/lib/modules/payments/repository'
import { getInventoryByCampaignProduct }   from '@/lib/modules/inventory/service'
import type { VariantInventoryPosition }   from '@/lib/modules/inventory/types'
import AdminDashboardClient from '../AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ status?: string; search?: string; campaign?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaigns = await getCampaigns(tenant.id)

  const activeCampaign = sp.campaign
    ? (campaigns.find((c) => c.slug === sp.campaign) ?? campaigns[0])
    : campaigns[0]

  const products = activeCampaign ? await getProducts(activeCampaign.id) : []

  const progressList = await Promise.all(
    activeCampaign ? products.map((p) => getProductProgress(p, activeCampaign)) : []
  )

  const workflowTransitions = activeCampaign?.workflow_id
    ? await getAllTransitionsForWorkflow(activeCampaign.workflow_id)
    : {}

  const [stats, orders, customers, analytics, outstanding] = await Promise.all([
    getAdminStats(tenant.id, activeCampaign?.id),
    getReservationsForTenant(tenant.id, {
      status:     sp.status,
      campaignId: activeCampaign?.id,
      search:     sp.search,
    }),
    findCustomersWithStats(tenant.id, { search: sp.search }),
    activeCampaign
      ? getCampaignAnalytics(tenant.id, activeCampaign.id).catch(() => null)
      : Promise.resolve(null),
    queryOutstandingPayments(tenant.id, activeCampaign?.id),
  ])

  const payments     = await findPaymentsByOrderIds(orders.map((o) => o.id))
  const paymentLinks = Object.fromEntries(
    payments.filter((p) => p.payment_link).map((p) => [p.order_id, p.payment_link!])
  )

  const inventory: Record<string, VariantInventoryPosition[]> = {}
  if (activeCampaign) {
    await Promise.all(
      products.map(async (p) => {
        const positions = await getInventoryByCampaignProduct(p.id).catch(() => [])
        inventory[p.id] = positions
      })
    )
  }

  return (
    <AdminDashboardClient
      tenant={tenant}
      campaigns={campaigns}
      activeCampaign={activeCampaign ?? null}
      products={products}
      orders={orders}
      stats={stats}
      progressList={progressList}
      workflowTransitions={workflowTransitions}
      customers={customers}
      analytics={analytics}
      outstanding={outstanding}
      paymentLinks={paymentLinks}
      inventory={inventory}
      slug={slug}
      initialFilters={{ status: sp.status, search: sp.search, campaignSlug: sp.campaign }}
    />
  )
}
