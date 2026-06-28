'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MerchProductWithVariants, MerchTenant } from '@/lib/merch/types'

type Props = {
  tenant:            MerchTenant
  product:           MerchProductWithVariants
  slug:              string
  campaignSlug:      string
  initialVariantId?: string | null
  initialQty?:       number
  initialPlayerName?: string
}

type FormErrors = Record<string, string>

export default function ReserveForm({
  tenant, product, slug, campaignSlug,
  initialVariantId, initialQty, initialPlayerName,
}: Props) {
  const router = useRouter()
  const [submitting,   setSubmitting]   = useState(false)
  const [errors,       setErrors]       = useState<FormErrors>({})
  const [serverError,  setServerError]  = useState<string | null>(null)

  const primary = tenant.primary_color
  const accent  = tenant.secondary_color

  const variants    = product.merch_product_variants.filter((v) => v.available)
  const colours     = [...new Set(variants.map((v) => v.colour).filter(Boolean))] as string[]
  const multiColour = colours.length > 1
  const fits        = [...new Set(variants.map((v) => v.fit).filter(Boolean))] as string[]
  const hasFits     = fits.length > 0

  const opts  = product.product_options ?? {}
  const pnOpt = opts.personalisation?.player_name

  const initialVariant = initialVariantId
    ? variants.find((v) => v.id === initialVariantId) ?? null
    : null

  const [form, setForm] = useState({
    first_name:       '',
    last_name:        '',
    email:            '',
    phone:            '',
    team:             '',
    grade:            '',
    player_name:      initialPlayerName ?? '',
    fit:              initialVariant
      ? (initialVariant.fit ?? (hasFits ? '' : ''))
      : (hasFits ? (fits.length === 1 ? fits[0] : '') : ''),
    colour:           initialVariant?.colour ?? (multiColour ? '' : (colours[0] ?? '')),
    size:             initialVariant?.size   ?? '',
    qty:              initialQty ?? 1,
    delivery_method:  'collect' as 'collect' | 'courier',
    delivery_address: '',
    understood_moq:   false,
  })

  const availableSizes = [...new Set(
    variants
      .filter((v) => !hasFits || !form.fit || v.fit === form.fit)
      .filter((v) => !multiColour || !form.colour || v.colour === form.colour)
      .map((v) => v.size),
  )]

  const selectedVariant = variants.find(
    (v) =>
      (!hasFits || v.fit === form.fit) &&
      v.size === form.size &&
      (!multiColour || v.colour === form.colour),
  )

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'fit')    next.size = ''
      if (key === 'colour') {
        const newSizes = [...new Set(
          variants
            .filter((v) => !hasFits || v.fit === prev.fit)
            .filter((v) => v.colour === String(value))
            .map((v) => v.size),
        )]
        if (!newSizes.includes(prev.size)) next.size = ''
      }
      return next
    })
    setErrors((prev) => { const e = { ...prev }; delete e[key as string]; return e })
  }

  const surcharge  = selectedVariant?.additional_cost_cents ?? 0
  const unitPrice  = product.price_cents + surcharge + (pnOpt?.additional_price_cents ?? 0)
  const totalPrice = unitPrice * form.qty

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.first_name.trim()) e.first_name = 'Required'
    if (!form.last_name.trim())  e.last_name  = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.trim().length < 6) e.phone = 'Required'
    if (hasFits && !form.fit)    e.fit    = 'Please select a fit'
    if (multiColour && !form.colour) e.colour = 'Please select a colour'
    if (!form.size) e.size = 'Please select a size'
    if (!selectedVariant) e.size = 'This combination is not available'
    if (form.qty < 1 || form.qty > 20) e.qty = 'Quantity must be 1–20'
    if (pnOpt?.required && !form.player_name.trim()) e.player_name = `${pnOpt.label} is required`
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
        method:  'POST',
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

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    display: 'block', width: '100%', padding: '12px 14px', fontSize: '15px',
    color: primary, background: '#fff',
    border: `1px solid ${hasError ? '#DC2626' : '#CBD5E1'}`,
    borderRadius: '6px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  })
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 600, color: primary, marginBottom: '6px',
  }
  const errorStyle: React.CSSProperties = { fontSize: '12px', color: '#DC2626', marginTop: '4px' }

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── Contact details ───────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: primary, margin: '0 0 20px' }}>Your Details</h3>
        <div className="reserve-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>First Name *</label>
            <input type="text" autoComplete="given-name" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} style={inputStyle(!!errors.first_name)} />
            {errors.first_name && <p style={errorStyle}>{errors.first_name}</p>}
          </div>
          <div>
            <label style={labelStyle}>Last Name *</label>
            <input type="text" autoComplete="family-name" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} style={inputStyle(!!errors.last_name)} />
            {errors.last_name && <p style={errorStyle}>{errors.last_name}</p>}
          </div>
        </div>
        <div className="reserve-grid-2" style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} style={inputStyle(!!errors.email)} />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>
          <div>
            <label style={labelStyle}>Mobile *</label>
            <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} style={inputStyle(!!errors.phone)} />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* ── Club details ─────────────────────────────────────────
          Team and grade fields — omitted if tenant does not use them.
          Player name appears here only when product_options does NOT
          configure it (legacy / unconfigured products).           */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: primary, margin: '0 0 20px' }}>Club Details</h3>
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
        {/* Show player name here only if not configured via product_options */}
        {!pnOpt?.enabled && (
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Player Name on Garment (optional)</label>
            <input type="text" placeholder="Leave blank if not required" value={form.player_name} onChange={(e) => set('player_name', e.target.value)} style={inputStyle()} />
          </div>
        )}
      </div>

      {/* ── Order details ─────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: primary, margin: '0 0 20px' }}>Your Order</h3>

        {/* Fit — only shown if not already pre-selected from product page */}
        {hasFits && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Fit *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {fits.map((f) => (
                <button key={f} type="button" onClick={() => set('fit', f)}
                  style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 600, border: `2px solid ${form.fit === f ? accent : '#CBD5E1'}`, background: form.fit === f ? primary : '#fff', color: form.fit === f ? '#fff' : '#374151', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {f === 'Mens' ? "Men's" : f === 'Womens' ? "Women's" : f}
                </button>
              ))}
            </div>
            {errors.fit && <p style={errorStyle}>{errors.fit}</p>}
          </div>
        )}

        {/* Colour */}
        {multiColour && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Colour *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {colours.map((c) => (
                <button key={c} type="button" onClick={() => set('colour', c)}
                  style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 600, border: `2px solid ${form.colour === c ? accent : '#CBD5E1'}`, background: form.colour === c ? primary : '#fff', color: form.colour === c ? '#fff' : '#374151', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>
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
                style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 600, border: `2px solid ${form.size === sz ? accent : '#CBD5E1'}`, background: form.size === sz ? primary : '#fff', color: form.size === sz ? '#fff' : '#374151', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {sz}
              </button>
            ))}
          </div>
          {errors.size && <p style={errorStyle}>{errors.size}</p>}
          {product.sizing_notes && (
            <p style={{ fontSize: '12px', color: '#5A6B7E', marginTop: '8px', lineHeight: 1.5 }}>{product.sizing_notes}</p>
          )}
        </div>

        {/* Player name — shown here when configured via product_options */}
        {pnOpt?.enabled && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              {pnOpt.label} {pnOpt.required ? '*' : '(optional)'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={pnOpt.placeholder}
                value={form.player_name}
                maxLength={pnOpt.max_chars}
                onChange={(e) => {
                  let val = e.target.value
                  if (pnOpt.uppercase_only) val = val.toUpperCase()
                  set('player_name', val)
                }}
                style={{ ...inputStyle(!!errors.player_name), paddingRight: '52px' }}
              />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#94A3B8', pointerEvents: 'none' }}>
                {form.player_name.length}/{pnOpt.max_chars}
              </span>
            </div>
            {errors.player_name && <p style={errorStyle}>{errors.player_name}</p>}
          </div>
        )}

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
              style={{ width: '40px', height: '40px', fontSize: '20px', fontWeight: 700, border: '1px solid #CBD5E1', background: '#F8FAFC', color: primary, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
            <span style={{ fontSize: '20px', fontWeight: 700, color: primary, minWidth: '24px', textAlign: 'center' }}>{form.qty}</span>
            <button type="button" onClick={() => set('qty', Math.min(20, form.qty + 1))}
              style={{ width: '40px', height: '40px', fontSize: '20px', fontWeight: 700, border: '1px solid #CBD5E1', background: '#F8FAFC', color: primary, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
          </div>
          {errors.qty && <p style={errorStyle}>{errors.qty}</p>}
        </div>
      </div>

      {/* ── Delivery ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: primary, margin: '0 0 20px' }}>Delivery</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(['collect', 'courier'] as const).map((method) => (
            <label key={method} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', border: `2px solid ${form.delivery_method === method ? accent : '#CBD5E1'}`, borderRadius: '8px', cursor: 'pointer', background: form.delivery_method === method ? '#F8FAFC' : '#fff' }}>
              <input type="radio" name="delivery_method" value={method} checked={form.delivery_method === method} onChange={() => set('delivery_method', method)} style={{ marginTop: '3px', accentColor: primary }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: primary }}>{method === 'collect' ? 'Collect from Club' : 'Courier Delivery'}</div>
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
            <textarea rows={3} placeholder="Street, City, Postcode" value={form.delivery_address} onChange={(e) => set('delivery_address', e.target.value)} style={{ ...inputStyle(!!errors.delivery_address), resize: 'vertical' }} />
            {errors.delivery_address && <p style={errorStyle}>{errors.delivery_address}</p>}
          </div>
        )}
      </div>

      {/* ── MOQ acknowledgement ──────────────────────────────── */}
      <div style={{ marginBottom: '32px', padding: '16px 20px', background: '#FFF8F8', border: `1px solid ${errors.understood_moq ? '#DC2626' : '#FECACA'}`, borderRadius: '8px' }}>
        <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
          <input type="checkbox" checked={form.understood_moq} onChange={(e) => set('understood_moq', e.target.checked)} style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: primary, flexShrink: 0 }} />
          <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
            I understand this order will only proceed if the minimum quantity of{' '}
            <strong>{product.minimum_qty} items</strong> is reached. No payment is required now.
          </span>
        </label>
        {errors.understood_moq && <p style={{ ...errorStyle, marginTop: '8px' }}>{errors.understood_moq}</p>}
      </div>

      {/* ── Order summary ────────────────────────────────────── */}
      <div style={{ marginBottom: '28px', padding: '16px 20px', background: '#F0F3FA', borderRadius: '8px', border: '1px solid #D1DCF0' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: primary, marginBottom: '10px' }}>Order Summary</div>
        <div style={{ fontSize: '14px', color: '#374151', lineHeight: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{product.name}</span>
            <span>${(product.price_cents / 100).toFixed(2)} ea</span>
          </div>
          {form.fit && hasFits && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Fit</span>
              <span>{form.fit === 'Mens' ? "Men's" : form.fit === 'Womens' ? "Women's" : form.fit}</span>
            </div>
          )}
          {form.colour && multiColour && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Colour</span><span>{form.colour}</span></div>
          )}
          {form.size && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Size</span><span>{form.size}</span></div>
          )}
          {form.player_name && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Name on garment</span><span>{form.player_name}</span></div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Quantity</span><span>{form.qty}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D1DCF0', paddingTop: '8px', marginTop: '8px', fontWeight: 700, fontSize: '16px', color: primary }}>
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
        style={{ width: '100%', height: '56px', background: submitting ? '#94A3B8' : accent, color: '#fff', fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em', border: 'none', borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
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
