import { getPortalConfig, getPortalCategory, getPortalProduct } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import ProductOrderClient from './ProductOrderClient'
import { notFound } from 'next/navigation'
import { resolvePortalVisual } from '@/lib/portal/visual'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; category: string; product: string }>
}) {
  const { slug, category: categorySlug, product: productSlug } = await params

  const config = getPortalConfig(slug)
  if (!config) notFound()

  const category = getPortalCategory(config, categorySlug)
  if (!category) notFound()

  const product = getPortalProduct(config, categorySlug, productSlug)
  if (!product) notFound()

  const v = resolvePortalVisual(config)

  return (
    <div className="portal-root" style={{ background: v.canvas, minHeight: '100vh' }}>
      <PortalHeader config={config} slug={slug} />
      <ProductOrderClient
        config={config}
        product={product}
        slug={slug}
        categorySlug={categorySlug}
        categoryName={category.name}
      />
    </div>
  )
}
