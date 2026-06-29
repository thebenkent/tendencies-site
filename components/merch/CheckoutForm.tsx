'use client'

import { useState } from 'react'
import { useCart } from '@/components/merch/CartContext'
import { cartLineTotal } from '@/lib/merch/cart'
import type { MerchTenant, MerchCampaign } from '@/lib/merch/types'

type Props = {
  tenant:       MerchTenant
  campaign:     MerchCampaign
  slug:         string
  campaignSlug: string
}

const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`

type FormErrors = Record<string, string>

export default function CheckoutForm({ tenant, campaign, slug, campaignSlug }: Props) {
  const { items, total, count, clear } = useCart()
  const primary = tenant.primary_color
  const accent  = tenant.secondary_color

  const [firstName,    setFirstName]    = useState('')
  const [lastName,     setLastName]     = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [team,         setTeam]         = useState('')
  const [grade,        setGrade]        = useState('')
  const [delivery,     setDelivery]     = useState<'collect' | 'courier'>('collect')
  const [address,      setAddress]      = useState('')
  const [notes,        setNotes]        = useState('')
  const [understoodMoq, setUnderstoodMoq] = useState(false)
  const [errors,       setErrors]       = useState<FormErrors>({})
  const [submitting,   setSubmitting]   = useState(false)
  const [serverError,  setServerError]  = useState<string | null>(null)

  const inputStyle = (hasErr: boolean): React.CSSProperties => ({
    width: '100%', padding: '11px 14px', fontSize: '15px',
    border: `1.5px solid ${hasErr ? '#EF4444' : '#CBD5E1'}`, borderRadius: '8px',
    background: '#fff', color: primary, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
  })
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 700, color: '#5A6B7E',
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '7px',
  }
  const errStyle: React.CSSProperties = {
    fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block',
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!firstName.trim()) e.first_name = 'First name is required'
    if (!lastName.trim()) e.last_name = 'Last name is required'
    if (!email.trim() || !email.includes('@')) e.email = 'Valid email is required'
    if (!phone.trim() || phone.trim().length < 6) e.phone = 'Phone number is required'
    if (delivery === 'courier' && !address.trim()) e.address = 'Delivery address is required for courier orders'
    if (!understoodMoq) e.moq = 'You must acknowledge the MOQ condition'
    if (items.length === 0) e.items = 'Your cart is empty'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setServerError(null)
    setSubmitting(true)

    try {
      const body = {
        campaign_slug:    campaignSlug,
        items: items.map((item) => ({
          product_slug: item.productSlug,
          variant_id:   item.variantId,
          qty:          item.qty,
          player_name:  item.personalisation.find((p) => p.label.toLowerCase().includes('player') || p.label.toLowerCase().includes('name'))?.value,
        })),
        first_name:       firstName.trim(),
        last_name:        lastName.trim(),
        email:            email.trim().toLowerCase(),
        phone:            phone.trim(),
        team:             team.trim() || undefined,
        grade:            grade.trim() || undefined,
        delivery_method:  delivery,
        delivery_address: delivery === 'courier' ? address.trim() : undefined,
        notes:            notes.trim() || undefined,
        understood_moq:   understoodMoq,
      }

      const res = await fetch(`/api/merch/${slug}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      clear()
      window.location.href = `/merch/${slug}/success?reservation=${data.order_id}`
    } catch {
      setServerError('Network error. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ fontSize: '16px', color: '#5A6B7E', marginBottom: '20px' }}>Your cart is empty.</p>
        <a href={`/merch/${slug}/${campaignSlug}`}
          style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: primary, color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
          Browse Products →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Cart summary */}
      <div style={{ marginBottom: '32px', padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8EF' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Order Summary ({count} item{count !== 1 ? 's' : ''})
        </div>
        {items.map((item) => {
          const dims = [item.fit, item.colour, item.size].filter(Boolean).join(' / ')
          return (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: '#374151' }}>
                {item.productName}
                {dims && <span style={{ color: '#94A3B8', marginLeft: '6px' }}>({dims})</span>}
                {item.qty > 1 && <span style={{ color: '#94A3B8', marginLeft: '4px' }}>× {item.qty}</span>}
              </span>
              <span style={{ fontWeight: 600, color: primary, flexShrink: 0 }}>{fmt(cartLineTotal(item))}</span>
            </div>
          )
        })}
        <div style={{ borderTop: '1px solid #E2E8EF', paddingTop: '10px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, color: primary, fontSize: '15px' }}>Total</span>
          <span style={{ fontWeight: 800, color: primary, fontSize: '18px' }}>{fmt(total)}</span>
        </div>
      </div>

      {/* Contact details */}
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: primary, margin: '0 0 20px', letterSpacing: '-0.01em' }}>Your Details</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="checkout-name-grid">
        <div>
          <label style={labelStyle}>First Name *</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle(!!errors.first_name)} />
          {errors.first_name && <span style={errStyle}>{errors.first_name}</span>}
        </div>
        <div>
          <label style={labelStyle}>Last Name *</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle(!!errors.last_name)} />
          {errors.last_name && <span style={errStyle}>{errors.last_name}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="checkout-contact-grid">
        <div>
          <label style={labelStyle}>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle(!!errors.email)} />
          {errors.email && <span style={errStyle}>{errors.email}</span>}
        </div>
        <div>
          <label style={labelStyle}>Phone *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle(!!errors.phone)} />
          {errors.phone && <span style={errStyle}>{errors.phone}</span>}
        </div>
      </div>

      {/* Team / Grade — optional contextual fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }} className="checkout-team-grid">
        <div>
          <label style={labelStyle}>Team <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <input value={team} onChange={(e) => setTeam(e.target.value)} style={inputStyle(false)} />
        </div>
        <div>
          <label style={labelStyle}>Grade <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <input value={grade} onChange={(e) => setGrade(e.target.value)} style={inputStyle(false)} />
        </div>
      </div>

      {/* Delivery */}
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: primary, margin: '0 0 16px', letterSpacing: '-0.01em' }}>Delivery</h3>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['collect', 'courier'] as const).map((method) => (
          <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', border: `2px solid ${delivery === method ? accent : '#CBD5E1'}`, borderRadius: '8px', cursor: 'pointer', flex: '1 0 140px', minWidth: '140px', background: delivery === method ? `${accent}0D` : '#fff' }}>
            <input type="radio" name="delivery" value={method} checked={delivery === method} onChange={() => setDelivery(method)} style={{ accentColor: accent }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: delivery === method ? primary : '#374151' }}>
              {method === 'collect' ? '🏠 Collect from club' : '📦 Courier delivery'}
            </span>
          </label>
        ))}
      </div>

      {delivery === 'courier' && (
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Delivery Address *</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            style={{ ...inputStyle(!!errors.address), resize: 'vertical' }}
            placeholder="Street address, suburb, city, postcode"
          />
          {errors.address && <span style={errStyle}>{errors.address}</span>}
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          style={{ ...inputStyle(false), resize: 'vertical' }}
          placeholder="Any special requests or information for your order"
        />
      </div>

      {/* MOQ acknowledgement */}
      <div style={{ marginBottom: '28px', padding: '16px', background: '#FFF7ED', borderRadius: '10px', border: '1px solid #FED7AA' }}>
        <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
          <input type="checkbox" checked={understoodMoq} onChange={(e) => setUnderstoodMoq(e.target.checked)} style={{ marginTop: '2px', accentColor: accent, flexShrink: 0 }} />
          <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
            I understand this is a <strong>pre-order</strong> — no payment is taken now. My order is only confirmed and charged once the minimum order quantity is reached.
          </span>
        </label>
        {errors.moq && <span style={{ ...errStyle, marginTop: '8px' }}>{errors.moq}</span>}
      </div>

      {serverError && (
        <div style={{ marginBottom: '20px', padding: '14px 16px', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA', fontSize: '14px', color: '#B91C1C' }}>
          {serverError}
        </div>
      )}

      <button type="submit" disabled={submitting}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '18px 24px', background: submitting ? '#94A3B8' : accent, color: '#fff', border: 'none', fontSize: '16px', fontWeight: 700, letterSpacing: '0.02em', borderRadius: '10px', cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit', boxSizing: 'border-box' }}>
        {submitting ? 'Placing Pre-Order…' : `Place Pre-Order — ${fmt(total)}`}
      </button>

      <style>{`
        @media (max-width: 520px) {
          .checkout-name-grid, .checkout-contact-grid, .checkout-team-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </form>
  )
}
