'use client'

import { useState } from 'react'
import { useCart } from '@/components/portal/CartContext'
import type { ClientPortalConfig } from '@/lib/portal/types'
import { useRouter } from 'next/navigation'

const BG = '#080808'
const CARD = '#0d0d0d'
const BORDER = 'rgba(255,255,255,0.08)'
const LIME = '#b8f400'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(cents / 100)
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: '7px',
  fontFamily: 'Helvetica, Arial, sans-serif',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#080808',
  border: `1px solid ${BORDER}`,
  color: '#f5f5f0',
  fontSize: '14px',
  padding: '12px 14px',
  outline: 'none',
  fontFamily: 'Helvetica, Arial, sans-serif',
  boxSizing: 'border-box',
}

export default function CartClient({
  config,
  slug,
}: {
  config: ClientPortalConfig
  slug: string
}) {
  const { items, removeItem, updateQuantity, totalCents, itemCount, clearCart } = useCart()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [delivery, setDelivery] = useState(config.ordering.deliveryOptions[0]?.id ?? '')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canCheckout =
    items.length > 0 && name.trim() !== '' && email.trim() !== '' && delivery !== ''

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!canCheckout) return
    setLoading(true)
    setError('')

    const res = await fetch(`/api/portal/${slug}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        items,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim() || undefined,
        deliveryOptionId: delivery,
        notes: notes.trim() || undefined,
      }),
    })

    const data = await res.json()

    if (res.ok && data.url) {
      clearCart()
      window.location.href = data.url
    } else {
      setError(data.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 116px)',
          background: BG,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Helvetica, Arial, sans-serif',
          gap: '20px',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          Your cart is empty
        </div>
        <a
          href={`/portal/${slug}`}
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: LIME,
            textDecoration: 'none',
          }}
        >
          ← Browse garments
        </a>
      </div>
    )
  }

  return (
    <div
      style={{
        background: BG,
        minHeight: 'calc(100vh - 116px)',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 48px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Left: cart items */}
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '24px',
            }}
          >
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  padding: '18px 20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.3)',
                      marginBottom: '4px',
                    }}
                  >
                    {item.categoryName}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      color: '#f5f5f0',
                      marginBottom: '6px',
                    }}
                  >
                    {item.productName}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>{item.size}</span>
                    {item.colour && <span>{item.colour}</span>}
                    {item.staffName && <span>Name: {item.staffName}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#f5f5f0',
                    }}
                  >
                    {fmt(item.priceCents * item.quantity)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={smallQtyBtn}
                    >
                      −
                    </button>
                    <div
                      style={{
                        width: '36px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#080808',
                        border: `1px solid ${BORDER}`,
                        borderLeft: 'none',
                        borderRight: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#f5f5f0',
                      }}
                    >
                      {item.quantity}
                    </div>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={smallQtyBtn}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.25)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <a
            href={`/portal/${slug}`}
            style={{
              display: 'inline-block',
              marginTop: '24px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none',
            }}
          >
            ← Add more items
          </a>
        </div>

        {/* Right: order details + checkout */}
        <form onSubmit={handleCheckout}>
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              padding: '28px',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: '24px',
              }}
            >
              Your details
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Full name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = LIME }}
                  onBlur={(e) => { e.target.style.borderColor = BORDER }}
                />
              </div>
              <div>
                <label style={labelStyle}>Email address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = LIME }}
                  onBlur={(e) => { e.target.style.borderColor = BORDER }}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = LIME }}
                  onBlur={(e) => { e.target.style.borderColor = BORDER }}
                />
              </div>
            </div>

            {/* Delivery */}
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: '20px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                  marginBottom: '14px',
                }}
              >
                Delivery location
              </div>

              {config.ordering.deliveryOptions.map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 14px',
                    marginBottom: '4px',
                    background: delivery === opt.id ? 'rgba(184,244,0,0.06)' : 'transparent',
                    border: `1px solid ${delivery === opt.id ? 'rgba(184,244,0,0.3)' : BORDER}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.id}
                    checked={delivery === opt.id}
                    onChange={() => setDelivery(opt.id)}
                    style={{ accentColor: LIME, marginTop: '2px', flexShrink: 0 }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#f5f5f0',
                        marginBottom: '2px',
                      }}
                    >
                      {opt.label}
                    </div>
                    {opt.address && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {opt.address}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions…"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: 1.55,
                }}
                onFocus={(e) => { e.target.style.borderColor = LIME }}
                onBlur={(e) => { e.target.style.borderColor = BORDER }}
              />
            </div>

            {/* Order total */}
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: '18px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Total incl. GST
              </span>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#f5f5f0',
                }}
              >
                {fmt(totalCents)}
              </span>
            </div>

            {error && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  marginBottom: '12px',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canCheckout || loading}
              style={{
                width: '100%',
                background: !canCheckout || loading ? 'rgba(184,244,0,0.3)' : LIME,
                color: '#080808',
                border: 'none',
                padding: '16px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: canCheckout && !loading ? 'pointer' : 'not-allowed',
                fontFamily: 'Helvetica, Arial, sans-serif',
                transition: 'background 0.2s ease',
              }}
            >
              {loading ? 'Redirecting to payment…' : `Pay ${fmt(totalCents)} →`}
            </button>

            <p
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                textAlign: 'center',
                marginTop: '10px',
                lineHeight: 1.5,
              }}
            >
              Secure checkout via Stripe. Order processed by Tendencies.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

const smallQtyBtn: React.CSSProperties = {
  width: '32px',
  height: '32px',
  background: '#0d0d0d',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#f5f5f0',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Helvetica, Arial, sans-serif',
}
