'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'

const BG = '#080808'
const LIME = '#b8f400'
const BORDER = 'rgba(255,255,255,0.08)'
const CARD = '#0d0d0d'

export default function PortalLoginPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/portal/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, code }),
    })

    if (res.ok) {
      router.push(`/portal/${slug}`)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Incorrect access code.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            Tendencies
          </div>
        </div>

        <div
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            padding: '40px 36px',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '10px',
            }}
          >
            Uniform Portal
          </div>

          <h1
            style={{
              fontSize: '30px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#f5f5f0',
              lineHeight: 0.95,
              marginBottom: '32px',
            }}
          >
            Staff access<span style={{ color: LIME }}>.</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <label
              style={{
                display: 'block',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                marginBottom: '8px',
              }}
            >
              Access code
            </label>

            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your access code"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                background: '#080808',
                border: `1px solid ${error ? '#ef4444' : BORDER}`,
                color: '#f5f5f0',
                fontSize: '14px',
                padding: '13px 14px',
                outline: 'none',
                fontFamily: 'Helvetica, Arial, sans-serif',
                boxSizing: 'border-box',
                marginBottom: '6px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = LIME
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? '#ef4444' : BORDER
              }}
            />

            {error && (
              <div
                style={{
                  fontSize: '11px',
                  color: '#ef4444',
                  marginBottom: '12px',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code}
              style={{
                width: '100%',
                background: loading || !code ? 'rgba(184,244,0,0.4)' : LIME,
                color: '#080808',
                border: 'none',
                padding: '14px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: loading || !code ? 'not-allowed' : 'pointer',
                fontFamily: 'Helvetica, Arial, sans-serif',
                marginTop: error ? '0' : '10px',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.08em',
          }}
        >
          Need access? Contact your account manager.
        </p>
      </div>
    </div>
  )
}
