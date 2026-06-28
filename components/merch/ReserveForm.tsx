'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MerchProductWithVariants, MerchTenant } from '@/lib/merch/types'

type Props = {
  tenant: MerchTenant
  product: MerchProductWithVariants
  slug: string
  campaignSlug: string
  initialVariantId?: string | null
  initialQty?: number
}

const inputStyle = (error?: string): React.CSSProperties => ({
  display: 'block',
  width: '100%',
  padding: '12px 14px',
  fontSize: '15px',
  color: '#0B1F4D',
  background: '#fff',
  border: `1px solid ${error ? '#D71920' : '#CBD5E1'}`,
  borderRadius: '6px',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
})

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#0B1F4D',
  marginBottom: '6px',
}

const errorStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#D71920',
  marginTop: '4px',
}

type FormErrors = Record<string, string>

export default function ReserveForm({ tenant, product, slug, campaignSlug, initialVariantId, initialQty }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors]         = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const variants = product.merch_product_variants.filter((v) => v.available)
  const colours  = [...new Set(variants.map((v) => v.colour).filter(Boolean))] as string[]
  const multiColour = colours.length > 1

  // Pre-populate from the product page selection if variant_id was passed
  const initialVariant = initialVariantId
    ? variants.find((v) => v.id === initialVariantId) ?? null
    : null

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    team: '',
    grade: '',
    player_name: '',
    colour: initialVariant?.colour ?? (multiColour ? '' : (colours[0] ?? '')),
    size:   initialVariant?.size   ?? '',
    qty:    initialQty ?? 1,
    delivery_method: 'collect' as 'collect' | 'courier',
    delivery_address: '',
    understood_moq: false,
  })

  // Sizes available for currently selected colour
  const availableSizes = [...new Set(
    variants
      .filter((v) => !multiColour || !form.colour || v.colour === form.colour)
      .map((v) => v.size)
  )]

  // Resolve variant_id from current size + colour selection
  const selectedVariant = variants.find(
    (v) => v.size === form.size && (!multiColour || v.colour === form.colour)
  )

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      // When colour changes, clear size if it's no longer valid for the new colour
      if (key === 'colour') {
        const newSizes = [...new Set(variants.filter((v) => v.colour === value).map((v) => v.size))]
        if (!newSizes.includes(prev.size)) next.size = ''
      }
      return next
    })
    setErrors((prev) => { const e = { ...prev }; delete e[key as string]; return e })
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.first_name.trim()) e.first_name = 'Required'
    if (!form.last_name.trim())  e.last_name  = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.trim().length < 6) e.phone = 'Required'
    if (multiColour && !form.colour) e.colour = 'Please select a colour'
    if (!form.size) e.size = 'Please select a size'
    if (!selectedVariant) e.size = 'This combination is not available'
    if (form.qty < 1 || form.qty > 20) e.qty = 'Quantity must be 1–20'
    if (form.delivery_method === 'courier' && !form.delivery_address.trim()) e.delivery_address = 'Address required for courier'
    if (!form.understood_moq) e.understood_moq = 'Please acknowledge this condition'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch(`/api/merch/${slug}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_slug:    campaignSlug,
          product_slug:     product.slug,
          variant_id:       selectedVariant!.id,
          first_name:       form.first_name,
          last_name:        form.last_name,
          email:            form.email,
          phone:            form.phone,
          team:             form.team,
          grade:            form.grade,
          player_name:      form.player_name,
          qty:              form.qty,
          delivery_method:  form.delivery_method,
          delivery_address: form.delivery_address,
          understood_moq:   form.understood_moq,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setServerError(data.error ?? 'Something went wrong. Please try again.'); return }
      router.push(`/merch/${slug}/success?reservation=${data.reservation_id}`)
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const navy = tenant.primary_color
  const red  = tenant.secondary_color

  // Variant cost surcharge
  const surcharge = selectedVariant?.additional_cost_cents ?? 0
  const unitPrice = product.price_cents + surcharge
  const totalPrice = unitPrice * form.qty

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Contact */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: navy, margin: '0 0 20px' }}>Your Details</h3>
        <div className="reserve-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>First Name *</label>
            <input type="text" autoComplete="given-name" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} style={inputStyle(errors.first_name)} />
            {errors.first_name && <p style={errorStyle}>{errors.first_name}</p>}
          </div>
          <div>
            <label style={labelStyle}>Last Name *</label>
            <input type="text" autoComplete="family-name" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} style={inputStyle(errors.last_name)} />
            {errors.last_name && <p style={errorStyle}>{errors.last_name}</p>}
          </div>
        </div>
        <div className="reserve-grid-2" style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} style={inputStyle(errors.email)} />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>
          <div>
            <label style={labelStyle}>Mobile *</label>
            <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} style={inputStyle(errors.phone)} />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Club */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: navy, margin: '0 0 20px' }}>Club Details</h3>
        <div className="reserve-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Team</label>
            <input type="text" placeholder="e.g. Senior A" value={form.team} onChange={(e) => set('team', e.target.value)} style={inputStyle()} />
          </div>
          <div>
            <label style={labelStyle}>Grade</label>
            <input type="text" placeholder="e.g. Premier" value={form.grade} onChange={(e) => set('grade', e.target.value)} style={inputStyle()} />
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <label style={labelStyle}>Player Name on Garment (optional)</label>
          <input type="text" placeholder="Leave blank if not required" value={form.player_name} onChange={(e) => set('player_name', e.target.value)} style={inputStyle()} />
        </div>
      </div>

      {/* Variant selection */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: navy, margin: '0 0 20px' }}>Your Order</h3>

        {/* Colour — only if multiple */}
        {multiColour && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Colour *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {colours.map((c) => (
                <button key={c} type="button" onClick={() => set('colour', c)}
                  style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 600, border: `2px solid ${form.colour === c ? navy : '#CBD5E1'}`, background: form.colour === c ? navy : '#fff', color: form.colour === c ? '#fff' : '#374151', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {c}
                </button>
              ))}
            </div>
            {errors.colour && <p style={errorStyle}>{errors.colour}</p>}
          </div>
        )}

        {/* Size */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Size *</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableSizes.map((sz) => (
              <button key={sz} type="button" onClick={() => set('size', sz)}
                style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 600, border: `2px solid ${form.size === sz ? navy : '#CBD5E1'}`, background: form.size === sz ? navy : '#fff', color: form.size === sz ? '#fff' : '#374151', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {sz}
              </button>
            ))}
          </div>
          {errors.size && <p style={errorStyle}>{errors.size}</p>}
          {product.sizing_notes && (
            <p style={{ fontSize: '12px', color: '#5A6B7E', marginTop: '8px', lineHeight: 1.5 }}>{product.sizing_notes}</p>
          )}
        </div>

        {/* Surcharge notice */}
        {surcharge > 0 && (
          <div style={{ padding: '10px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', fontSize: '13px', color: '#78350F', marginBottom: '16px' }}>
            +${(surcharge / 100).toFixed(2)} size surcharge applies to this variant
          </div>
        )}

        {/* Quantity */}
        <div>
          <label style={labelStyle}>Quantity *</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button type="button" onClick={() => set('qty', Math.max(1, form.qty - 1))}
              style={{ width: '40px', height: '40px', fontSize: '20px', fontWeight: 700, border: '1px solid #CBD5E1', background: '#F8FAFC', color: navy, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
            <span style={{ fontSize: '20px', fontWeight: 700, color: navy, minWidth: '24px', textAlign: 'center' }}>{form.qty}</span>
            <button type="button" onClick={() => set('qty', Math.min(20, form.qty + 1))}
              style={{ width: '40px', height: '40px', fontSize: '20px', fontWeight: 700, border: '1px solid #CBD5E1', background: '#F8FAFC', color: navy, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
          </div>
          {errors.qty && <p style={errorStyle}>{errors.qty}</p>}
        </div>
      </div>

      {/* Delivery */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: navy, margin: '0 0 20px' }}>Delivery</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(['collect', 'courier'] as const).map((method) => (
            <label key={method} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', border: `2px solid ${form.delivery_method === method ? navy : '#CBD5E1'}`, borderRadius: '8px', cursor: 'pointer', background: form.delivery_method === method ? '#F0F3FA' : '#fff' }}>
              <input type="radio" name="delivery_method" value={method} checked={form.delivery_method === method} onChange={() => set('delivery_method', method)} style={{ marginTop: '3px', accentColor: navy }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: navy }}>{method === 'collect' ? 'Collect from Club' : 'Courier Delivery'}</div>
                <div style={{ fontSize: '12px', color: '#5A6B7E', marginTop: '2px' }}>
                  {method === 'collect' ? 'Free — pick up at the club when order is ready' : 'Cost to be confirmed — we will contact you'}
                </div>
              </div>
            </label>
          ))}
        </div>
        {form.delivery_method === 'courier' && (
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Delivery Address *</label>
            <textarea rows={3} placeholder="Street, City, Postcode" value={form.delivery_address} onChange={(e) => set('delivery_address', e.target.value)} style={{ ...inputStyle(errors.delivery_address), resize: 'vertical' }} />
            {errors.delivery_address && <p style={errorStyle}>{errors.delivery_address}</p>}
          </div>
        )}
      </div>

      {/* MOQ acknowledgement */}
      <div style={{ marginBottom: '32px', padding: '16px 20px', background: '#FFF8F8', border: `1px solid ${errors.understood_moq ? red : '#FECACA'}`, borderRadius: '8px' }}>
        <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
          <input type="checkbox" checked={form.understood_moq} onChange={(e) => set('understood_moq', e.target.checked)} style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: navy, flexShrink: 0 }} />
          <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
            I understand this order will only proceed if the minimum quantity of{' '}
            <strong>{product.minimum_qty} items</strong> is reached. No payment is required now.
          </span>
        </label>
        {errors.understood_moq && <p style={{ ...errorStyle, marginTop: '8px' }}>{errors.understood_moq}</p>}
      </div>

      {/* Order summary */}
      <div style={{ marginBottom: '28px', padding: '16px 20px', background: '#F0F3FA', borderRadius: '8px', border: '1px solid #D1DCF0' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: navy, marginBottom: '10px' }}>Order Summary</div>
        <div style={{ fontSize: '14px', color: '#374151', lineHeight: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{product.name}</span>
            <span>${(unitPrice / 100).toFixed(2)} ea</span>
          </div>
          {form.colour && multiColour && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Colour</span><span>{form.colour}</span></div>}
          {form.size && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Size</span><span>{form.size}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Quantity</span><span>{form.qty}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D1DCF0', paddingTop: '8px', marginTop: '8px', fontWeight: 700, fontSize: '16px', color: navy }}>
            <span>Total (if order proceeds)</span>
            <span>${(totalPrice / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div role="alert" style={{ marginBottom: '20px', padding: '14px 16px', background: '#FFF0F0', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '14px', color: '#991B1B' }}>
          {serverError}
        </div>
      )}

      <button type="submit" disabled={submitting}
        style={{ width: '100%', height: '56px', background: submitting ? '#94A3B8' : navy, color: '#fff', fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em', border: 'none', borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
        {submitting ? 'Submitting…' : 'Place Pre-Order →'}
      </button>
      <p style={{ fontSize: '12px', color: '#5A6B7E', marginTop: '12px', textAlign: 'center', lineHeight: 1.5 }}>
        No payment required. You will only be charged if the minimum quantity is reached.
      </p>

      <style>{`
        @media (max-width: 600px) {
          .reserve-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  )
}
