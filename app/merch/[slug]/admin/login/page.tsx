'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch(`/api/merch/${slug}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json().catch(() => ({}))

    if (res.ok) {
      router.push(`/merch/${slug}/admin`)
      router.refresh()
    } else {
      setError(data.error ?? 'Sign in failed. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    border: `1px solid ${hasError ? '#D71920' : '#CBD5E1'}`,
    borderRadius: '6px',
    marginBottom: '16px',
    fontFamily: 'inherit',
    color: '#0B1F4D',
    outline: 'none',
    boxSizing: 'border-box',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '12px', padding: '40px', border: '1px solid #E2E8EF', boxShadow: '0 4px 24px rgba(11,31,77,0.08)' }}>

        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#0B1F4D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '20px' }}>
          🔐
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0B1F4D', margin: '0 0 6px' }}>Admin Sign In</h1>
        <p style={{ fontSize: '14px', color: '#5A6B7E', margin: '0 0 28px', lineHeight: 1.6 }}>
          Sign in to manage your merchandise campaign.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0B1F4D', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            required
            placeholder="you@example.com"
            style={inputStyle()}
          />

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0B1F4D', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={inputStyle(Boolean(error))}
          />

          {error && (
            <p role="alert" style={{ fontSize: '13px', color: '#D71920', margin: '-8px 0 16px', lineHeight: 1.5 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', height: '48px', background: loading ? '#94A3B8' : '#0B1F4D', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginTop: '24px', lineHeight: 1.6 }}>
          Access is managed by your organisation admin.<br />
          Contact <a href="mailto:orders@tendencies.co.nz" style={{ color: '#5A6B7E', textDecoration: 'underline' }}>orders@tendencies.co.nz</a> if you need help.
        </p>
      </div>
    </div>
  )
}
