'use client'

import type { MerchProductPersonalisation } from '@/lib/merch/types'

type Props = {
  productName:     string
  fit:             string    // display label e.g. "Women's", or '' if not selected
  colour:          string
  size:            string
  personalisation: MerchProductPersonalisation[]
  personValues:    Record<string, string>         // id → value
  qty:             number
  basePriceCents:  number
  surchargeCents:  number
  primaryColor:    string
  accentColor:     string
}

export default function OrderSummary({
  productName, fit, colour, size, personalisation, personValues,
  qty, basePriceCents, surchargeCents, primaryColor, accentColor,
}: Props) {
  if (!size) return null

  const variantPrice = basePriceCents + surchargeCents

  // Active personalisation lines that have a non-empty value
  const personLines = personalisation.filter(
    (p) => (personValues[p.id] ?? '').trim().length > 0,
  )

  const personTotal = personLines.reduce(
    (sum, p) => sum + p.additional_price_cents * qty,
    0,
  )

  const total = variantPrice * qty + personTotal

  // Build selection description  e.g. "Women's · Medium · Navy"
  const selectionParts = [fit, size, colour].filter(Boolean)

  return (
    <div style={{
      marginBottom: '28px', borderRadius: '10px', overflow: 'hidden',
      border: `1.5px solid ${primaryColor}22`,
    }}>
      {/* Header */}
      <div style={{
        background: primaryColor, padding: '10px 16px',
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
      }}>
        Your Order
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', background: '#FAFBFD' }}>
        {/* Product + selection */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: primaryColor }}>
            {productName}
          </div>
          {selectionParts.length > 0 && (
            <div style={{ fontSize: '13px', color: '#5A6B7E', marginTop: '2px' }}>
              {selectionParts.join(' · ')}
            </div>
          )}
        </div>

        {/* Personalisation values */}
        {personLines.map((p) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
            <span style={{ color: '#5A6B7E' }}>{p.label}</span>
            <span style={{ fontWeight: 600, color: primaryColor }}>
              {(personValues[p.id] ?? '').trim()}
            </span>
          </div>
        ))}

        {/* Qty */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#374151', marginBottom: '14px' }}>
          <span style={{ color: '#5A6B7E' }}>Quantity</span>
          <span style={{ fontWeight: 600, color: primaryColor }}>{qty}</span>
        </div>

        {/* Price breakdown */}
        <div style={{ borderTop: `1px solid ${primaryColor}1A`, paddingTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
            <span>
              Product
              {qty > 1 && (
                <span style={{ color: '#94A3B8', marginLeft: '6px', fontSize: '12px' }}>
                  ${(variantPrice / 100).toFixed(2)} × {qty}
                </span>
              )}
            </span>
            <span>${(variantPrice * qty / 100).toFixed(2)}</span>
          </div>

          {personLines.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
              <span>
                {p.label}
                {qty > 1 && p.additional_price_cents > 0 && (
                  <span style={{ color: '#94A3B8', marginLeft: '6px', fontSize: '12px' }}>
                    ${(p.additional_price_cents / 100).toFixed(2)} × {qty}
                  </span>
                )}
              </span>
              <span>
                {p.additional_price_cents > 0
                  ? `$${(p.additional_price_cents * qty / 100).toFixed(2)}`
                  : 'Included'}
              </span>
            </div>
          ))}

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '15px', fontWeight: 800, color: primaryColor,
            borderTop: `1px solid ${primaryColor}1A`, paddingTop: '10px', marginTop: '6px',
          }}>
            <span>Total</span>
            <span style={{ color: accentColor }}>${(total / 100).toFixed(2)}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', textAlign: 'right' }}>
            only charged if minimum is reached
          </div>
        </div>
      </div>
    </div>
  )
}
