import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTenant } from '@/lib/merch/db'
import type { ReactNode } from 'react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) return {}
  return {
    title: `${tenant.name} Merchandise`,
    description: `Official merchandise for ${tenant.name}`,
  }
}

export default async function MerchLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  return (
    <div style={{ background: '#F8F9FB', minHeight: '100vh', fontFamily: 'var(--font-inter, system-ui, sans-serif)' }}>
      {children}
    </div>
  )
}
