import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/merch/db'
import AdminShell from '@/components/admin/AdminShell'
import type { ReactNode } from 'react'

export default async function AppAdminLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant   = await getTenant(slug).catch(() => null)
  if (!tenant) notFound()

  return (
    <AdminShell slug={slug} name={tenant.name} logoUrl={tenant.logo_url}>
      {children}
    </AdminShell>
  )
}
