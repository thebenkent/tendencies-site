import { getPortalConfig } from '@/lib/portal/config'
import PortalHeader from '@/components/portal/PortalHeader'
import { notFound } from 'next/navigation'

const LIME = '#b8f400'
const BORDER = 'rgba(255,255,255,0.07)'

export default async function PortalSuccessPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getPortalConfig(slug)
  if (!config) notFound()

  return (
    <div
      style={{
        background: '#080808',
        minHeight: 'calc(100vh - 64px)',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <PortalHeader config={config} slug={slug} />

      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '96px 48px 80px',
          textAlign: 'center',
        }}
      >
        {/* Tick */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(184,244,0,0.1)',
            border: `1px solid rgba(184,244,0,0.3)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            fontSize: '22px',
          }}
        >
          ✓
        </div>

        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: LIME,
            marginBottom: '16px',
          }}
        >
          Order confirmed
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#f5f5f0',
            lineHeight: 0.92,
            marginBottom: '24px',
          }}
        >
          You&apos;re all done<span style={{ color: LIME }}>.</span>
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            marginBottom: '48px',
          }}
        >
          Your order has been received and is being processed by Tendencies. A confirmation
          email is on its way to you.
        </p>

        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            padding: '24px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '8px',
            }}
          >
            Questions?
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            Contact {config.contact.manager} at{' '}
            <a
              href={`mailto:${config.contact.email}`}
              style={{ color: LIME, textDecoration: 'none' }}
            >
              {config.contact.email}
            </a>
          </p>
        </div>

        <a
          href={`/portal/${slug}`}
          style={{
            display: 'inline-block',
            background: LIME,
            color: '#080808',
            padding: '14px 32px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Back to portal
        </a>
      </div>
    </div>
  )
}
