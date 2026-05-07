import { CartProvider } from '@/components/portal/CartContext'
import { getPortalConfig } from '@/lib/portal/config'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

export default async function PortalLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getPortalConfig(slug)
  if (!config) notFound()

  return (
    <CartProvider slug={slug}>
      {children}
    </CartProvider>
  )
}
