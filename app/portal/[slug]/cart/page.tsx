import { getPortalConfig } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import CartClient from './CartClient'
import { notFound } from 'next/navigation'

export default async function CartPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getPortalConfig(slug)
  if (!config) notFound()

  return (
    <div style={{ background: '#080808', minHeight: 'calc(100vh - 64px)', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <PortalHeader config={config} slug={slug} />

      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '16px 48px',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <a
          href={`/portal/${slug}`}
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            textDecoration: 'none',
          }}
        >
          {config.clientName}
        </a>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>›</span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#f5f5f0',
          }}
        >
          Cart
        </span>
      </div>

      <CartClient config={config} slug={slug} />
    </div>
  )
}
