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

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0B1F4D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
        {number}
      </div>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0B1F4D', letterSpacing: '-0.01em' }}>{title}</h3>
    </div>
  )
}

const COURIER_FEE_CENTS = 1000

export default function CheckoutForm({ tenant, campaign, slug, campaignSlug }: Props) {
  const { items, total, count, clear } = useCart()
  const primary = tenant.primary_color
  const accent  = tenant.secondary_color

  const [firstName,     setFirstName]     = useState('')
  const [lastName,      setLastName]      = useState('')
  const [email,         setEmail]         = useState('')
  const [phone,         setPhone]         = useState('')
  const [team,          setTeam]          = useState('')
  const [grade,         setGrade]         = useState('')
  const [delivery,      setDelivery]      = useState<'collect' | 'courier'>('collect')
  const courierFee  = delivery === 'courier' ? COURIER_FEE_CENTS : 0
  const grandTotal  = total + courierFee
  const [address,       setAddress]       = useState('')
  const [notes,         setNotes]         = useState('')
  const [understoodMoq, setUnderstoodMoq] = useState(false)
  const [errors,        setErrors]        = useState<FormErrors>({})
  const [submitting,    setSubmitting]    = useState(false)
  const [serverError,   setServerError]   = useState<string | null>(null)

  const inputStyle = (hasErr: boolean): React.CSSProperties => ({
    width: '100%', padding: '12px 14px', fontSize: '15px',
    border: `1.5px solid ${hasErr ? '#EF4444' : '#D1D9E4'}`, borderRadius: '8px',
    background: '#fff', color: '#1E293B', fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
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
    if (!lastName.trim())  e.last_name  = 'Last name is required'
    if (!email.trim() || !email.includes('@')) e.email = 'Valid email is required'
    if (!phone.trim() || phone.trim().length < 6) e.phone = 'Phone number is required'
    if (delivery === 'courier' && !address.trim()) e.address = 'Delivery address is required for courier orders'
    if (!understoodMoq) e.moq = 'You must acknowledge the pre-order condition'
    if (items.length === 0) e.items = 'Your cart is empty'

    // Per-item validation
    for (const item of items) {
      if (!item.size.trim()) {
        e[`item_size_${item.id}`] = `${item.productName}: please select a size before checking out`
      }
      for (const p of item.personalisation) {
        if (p.maxLength && p.value.length > p.maxLength) {
          e[`item_person_${item.id}_${p.id}`] = `${item.productName} — ${p.label} must be ${p.maxLength} characters or fewer (currently ${p.value.length})`
        }
      }
    }

    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
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
          player_name:  item.personalisation.find(
            (p) => p.label.toLowerCase().includes('player') || p.label.toLowerCase().includes('name')
          )?.value,
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
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Section 1: Order Summary ─────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E8ECF2', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <SectionHeader number={1} title={`Order Summary (${count} item${count !== 1 ? 's' : ''})`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map((item) => {
            const dims = [item.fit, item.colour, item.size].filter(Boolean).join(' / ')
            const itemErrors = Object.entries(errors)
              .filter(([k]) => k.startsWith(`item_size_${item.id}`) || k.startsWith(`item_person_${item.id}_`))
              .map(([, v]) => v)
            return (
              <div key={item.id} style={{ padding: '6px 0', borderBottom: '1px solid #F5F7FA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '14px' }}>
                  <span style={{ color: '#374151', flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600 }}>{item.productName}</span>
                    {dims && <span style={{ color: '#94A3B8', marginLeft: '5px' }}>({dims})</span>}
                    {item.qty > 1 && <span style={{ color: '#94A3B8', marginLeft: '4px' }}>× {item.qty}</span>}
                  </span>
                  <span style={{ fontWeight: 700, color: primary, flexShrink: 0 }}>{fmt(cartLineTotal(item))}</span>
                </div>
                {itemErrors.map((msg) => (
                  <div key={msg} style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>⚠</span> {msg}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        <div style={{ paddingTop: '14px', marginTop: '8px', borderTop: '2px solid #F1F4FA' }}>
          {courierFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#5A6B7E' }}>Courier delivery</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#5A6B7E' }}>{fmt(courierFee)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: primary }}>Total</span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: primary, letterSpacing: '-0.025em' }}>{fmt(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Your Details ──────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E8ECF2', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <SectionHeader number={2} title="Your Details" />

        <div className="checkout-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
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

        <div className="checkout-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
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

        <div className="checkout-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Team <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.6 }}>(optional)</span></label>
            <input value={team} onChange={(e) => setTeam(e.target.value)} style={inputStyle(false)} />
          </div>
          <div>
            <label style={labelStyle}>Grade <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.6 }}>(optional)</span></label>
            <input value={grade} onChange={(e) => setGrade(e.target.value)} style={inputStyle(false)} />
          </div>
        </div>
      </div>

      {/* ── Section 3: Delivery ──────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E8ECF2', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <SectionHeader number={3} title="Delivery" />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(['collect', 'courier'] as const).map((method) => {
            const selected = delivery === method
            return (
              <label key={method} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '13px 18px', border: `2px solid ${selected ? accent : '#D1D9E4'}`,
                borderRadius: '10px', cursor: 'pointer', flex: '1 0 140px', minWidth: '140px',
                background: selected ? `${accent}0D` : '#FAFBFC',
                transition: 'border-color 0.15s, background 0.15s',
              }}>
                <input type="radio" name="delivery" value={method} checked={selected} onChange={() => setDelivery(method)} style={{ accentColor: accent }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: selected ? primary : '#374151' }}>
                      {method === 'collect' ? 'Collect' : 'Courier'}
                    </span>
                    {method === 'courier' && (
                      <span style={{ fontSize: '12px', fontWeight: 700, color: selected ? primary : '#64748B', background: selected ? `${primary}12` : '#F1F5F9', padding: '1px 7px', borderRadius: '999px' }}>
                        +$10.00
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>
                    {method === 'collect' ? 'Pick up from club' : 'Delivered to you'}
                  </div>
                </div>
              </label>
            )
          })}
        </div>

        {delivery === 'courier' && (
          <div style={{ marginBottom: '14px' }}>
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

        <div>
          <label style={labelStyle}>Order Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.6 }}>(optional)</span></label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            style={{ ...inputStyle(false), resize: 'vertical' }}
            placeholder="Any special requests or information for your order"
          />
        </div>
      </div>

      {/* ── MOQ acknowledgement ──────────────────────────────── */}
      <div style={{ padding: '20px', background: '#FFFBEB', borderRadius: '14px', border: '1px solid #FDE68A' }}>
        <label style={{ display: 'flex', gap: '14px', cursor: 'pointer', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            <input type="checkbox" checked={understoodMoq} onChange={(e) => setUnderstoodMoq(e.target.checked)} style={{ accentColor: accent, width: '16px', height: '16px' }} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>Pre-order acknowledgement</div>
            <span style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.65 }}>
              I understand this is a <strong>pre-order</strong> — no payment is taken now. My order is only confirmed and invoiced once the minimum order quantity is reached.
            </span>
          </div>
        </label>
        {errors.moq && <span style={{ ...errStyle, marginTop: '10px' }}>{errors.moq}</span>}
      </div>

      {/* ── Server error ──────────────────────────────────────── */}
      {serverError && (
        <div style={{ padding: '14px 18px', background: '#FEF2F2', borderRadius: '10px', border: '1px solid #FECACA', fontSize: '14px', color: '#B91C1C', fontWeight: 500 }}>
          {serverError}
        </div>
      )}

      {/* ── Submit ────────────────────────────────────────────── */}
      <button type="submit" disabled={submitting}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', padding: '19px 24px', boxSizing: 'border-box',
          background: submitting ? '#94A3B8' : accent, color: '#fff', border: 'none',
          fontSize: '16px', fontWeight: 700, letterSpacing: '0.02em', borderRadius: '12px',
          cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit',
          boxShadow: submitting ? 'none' : `0 4px 20px ${accent}44`,
          transition: 'background 0.15s, box-shadow 0.15s',
        }}>
        {submitting ? 'Placing Pre-Order…' : `Place Pre-Order — ${fmt(grandTotal)}`}
      </button>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', margin: '4px 0 0', lineHeight: 1.5 }}>
        Confirmation will be sent to {email || 'your email'}. No payment required now.
      </p>

      <style>{`
        @media (max-width: 520px) {
          .checkout-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  )
}
