import { notFound } from 'next/navigation'
import { getTenant, getCampaign } from '@/lib/merch/db'
import { CartProvider } from '@/components/merch/CartContext'

export default async function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string; campaign: string }>
}) {
  const { slug, campaign: campaignSlug } = await params

  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  const campaign = await getCampaign(tenant.id, campaignSlug).catch(() => null)
  if (!campaign) notFound()

  return (
    <CartProvider tenantSlug={slug} campaignSlug={campaignSlug}>
      {children}
    </CartProvider>
  )
}
