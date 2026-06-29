'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/components/merch/CartContext'
import { cartLineTotal } from '@/lib/merch/cart'
import type { CartItem } from '@/lib/merch/cart'

type Props = {
  slug:         string
  campaignSlug: string
  primaryColor: string
  accentColor:  string
  tenantName:   string
  campaignName: string
}

const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`

const FIT_LABELS: Record<string, string> = {
  Mens: "Men's", Womens: "Women's", Youth: 'Youth', Unisex: 'Unisex', Kids: 'Kids',
}

function CartLineRow({
  item, primaryColor, accentColor, slug, campaignSlug, onRemove, onSetQty, onUpdatePersonalisation,
}: {
  item:                    CartItem
  primaryColor:            string
  accentColor:             string
  slug:                    string
  campaignSlug:            string
  onRemove:                () => void
  onSetQty:                (qty: number) => void
  onUpdatePersonalisation: (id: string, value: string) => void
}) {
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null)
  const [editValue,       setEditValue]       = useState('')

  const lineTotal = cartLineTotal(item)

  function startEdit(personId: string, currentValue: string) {
    setEditingPersonId(personId)
    setEditValue(currentValue)
  }

  function saveEdit(person: CartItem['personalisation'][number]) {
    let val = editValue.trim()
    if (person.uppercaseOnly) val = val.toUpperCase()
    if (person.maxLength && val.length > person.maxLength) val = val.slice(0, person.maxLength)
    onUpdatePersonalisation(person.id, val)
    setEditingPersonId(null)
  }

  return (
    <div style={{ display: 'flex', gap: '18px', padding: '24px 0', borderBottom: '1px solid #E8ECF2', alignItems: 'flex-start' }}>
      {/* Thumbnail */}
      <a href={`/merch/${slug}/${campaignSlug}/${item.productSlug}`}
        style={{ flexShrink: 0, width: '96px', height: '96px', borderRadius: '12px', background: '#F1F4FA', overflow: 'hidden', position: 'relative', display: 'block', border: '1px solid #E8ECF2' }}>
        {item.imageUrl
          ? <Image src={item.imageUrl} alt={item.productName} fill style={{ objectFit: 'contain', padding: '10px' }} sizes="96px" />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', opacity: 0.18 }}>👕</div>}
      </a>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <a href={`/merch/${slug}/${campaignSlug}/${item.productSlug}`}
          style={{ fontSize: '16px', fontWeight: 700, color: primaryColor, textDecoration: 'none', display: 'block', marginBottom: '10px', lineHeight: 1.25 }}>
          {item.productName}
        </a>

        {/* Selection detail — explicit labelled rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
          {item.fit && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ fontWeight: 600, color: '#5A6B7E', minWidth: '44px' }}>Fit</span>
              <span style={{ color: '#374151', fontWeight: 500 }}>{FIT_LABELS[item.fit] ?? item.fit}</span>
              <a href={`/merch/${slug}/${campaignSlug}/${item.productSlug}`}
                style={{ fontSize: '11px', color: accentColor, textDecoration: 'underline', textUnderlineOffset: '2px', marginLeft: '4px' }}>
                Change
              </a>
            </div>
          )}
          {item.size && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ fontWeight: 600, color: '#5A6B7E', minWidth: '44px' }}>Size</span>
              <span style={{ color: '#374151', fontWeight: 500 }}>{item.size}</span>
              <a href={`/merch/${slug}/${campaignSlug}/${item.productSlug}`}
                style={{ fontSize: '11px', color: accentColor, textDecoration: 'underline', textUnderlineOffset: '2px', marginLeft: '4px' }}>
                Change
              </a>
            </div>
          )}
          {item.colour && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ fontWeight: 600, color: '#5A6B7E', minWidth: '44px' }}>Colour</span>
              <span style={{ color: '#374151', fontWeight: 500 }}>{item.colour}</span>
            </div>
          )}
        </div>

        {/* Personalisation — inline editable */}
        {item.personalisation.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
            {item.personalisation.map((p) => {
              const isEditing = editingPersonId === p.id
              return (
                <div key={p.id}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600, color: '#5A6B7E', minWidth: '44px' }}>{p.label}</span>
                    {isEditing ? null : (
                      <>
                        <span style={{ color: '#374151', fontWeight: 500 }}>
                          {p.value || <span style={{ color: '#CBD5E1', fontStyle: 'italic' }}>not set</span>}
                        </span>
                        {p.priceCents > 0 && <span style={{ color: accentColor, fontWeight: 600, fontSize: '11px' }}>+{fmt(p.priceCents)}</span>}
                        <button
                          onClick={() => startEdit(p.id, p.value)}
                          style={{ fontSize: '11px', color: accentColor, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px', fontFamily: 'inherit', marginLeft: '4px' }}>
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                  {isEditing && (
                    <div style={{ marginTop: '6px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => {
                            let v = e.target.value
                            if (p.uppercaseOnly) v = v.toUpperCase()
                            if (p.maxLength && v.length > p.maxLength) return
                            setEditValue(v)
                          }}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(p); if (e.key === 'Escape') setEditingPersonId(null) }}
                          maxLength={p.maxLength ?? undefined}
                          placeholder={p.uppercaseOnly ? 'UPPERCASE' : ''}
                          style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: `1.5px solid ${accentColor}`, borderRadius: '6px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#1E293B', background: '#fff' }}
                        />
                        {p.maxLength && (
                          <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                            {editValue.length}/{p.maxLength}
                          </span>
                        )}
                      </div>
                      <button onClick={() => saveEdit(p)}
                        style={{ padding: '7px 12px', background: accentColor, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                        Save
                      </button>
                      <button onClick={() => setEditingPersonId(null)}
                        style={{ padding: '7px 10px', background: 'none', color: '#94A3B8', border: '1.5px solid #E2E8EF', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div style={{ fontSize: '13px', color: '#94A3B8' }}>
          {fmt(item.priceCents)}{item.personalisation.some(p => p.priceCents > 0) && ` + ${fmt(item.personalisation.reduce((s, p) => s + p.priceCents, 0))}`} each
        </div>
      </div>

      {/* Qty + total + remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '17px', color: primaryColor, letterSpacing: '-0.015em' }}>{fmt(lineTotal)}</div>

        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
          <button onClick={() => onSetQty(item.qty - 1)} aria-label="Decrease quantity"
            style={{ width: '34px', height: '34px', fontSize: '18px', border: 'none', borderRight: '1.5px solid #CBD5E1', background: '#F8FAFC', color: primaryColor, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}>−</button>
          <span style={{ minWidth: '36px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: primaryColor }}>{item.qty}</span>
          <button onClick={() => onSetQty(item.qty + 1)} aria-label="Increase quantity"
            style={{ width: '34px', height: '34px', fontSize: '18px', border: 'none', borderLeft: '1.5px solid #CBD5E1', background: '#F8FAFC', color: primaryColor, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}>+</button>
        </div>

        <button onClick={onRemove}
          style={{ background: 'none', border: 'none', fontSize: '12px', color: '#CBD5E1', cursor: 'pointer', fontFamily: 'inherit', padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px', transition: 'color 0.15s' }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#EF4444')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#CBD5E1')}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default function CartPageClient({
  slug, campaignSlug, primaryColor, accentColor, campaignName,
}: Props) {
  const { items, total, count, remove, setQty, update, clear } = useCart()
  const checkoutUrl = `/merch/${slug}/${campaignSlug}/checkout`

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F1F4FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 24px', opacity: 0.5 }}>🛒</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: primaryColor, marginBottom: '10px', letterSpacing: '-0.025em' }}>
          Your cart is empty
        </h1>
        <p style={{ fontSize: '16px', color: '#5A6B7E', marginBottom: '32px', lineHeight: 1.6 }}>
          Browse the {campaignName} collection and add items to get started.
        </p>
        <a href={`/merch/${slug}/${campaignSlug}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '14px 28px', background: primaryColor, color: '#fff', textDecoration: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', letterSpacing: '0.01em' }}>
          Browse Products →
        </a>
      </div>
    )
  }

  function handleUpdatePersonalisation(itemId: string, personId: string, value: string) {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const updated = item.personalisation.map(p => p.id === personId ? { ...p, value } : p)
    update(itemId, { personalisation: updated })
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px', gap: '16px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: primaryColor, letterSpacing: '-0.03em', margin: 0 }}>
          Your Cart
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>
            {count} item{count !== 1 ? 's' : ''}
          </span>
          <button onClick={clear}
            style={{ background: 'none', border: 'none', fontSize: '13px', color: '#CBD5E1', cursor: 'pointer', fontFamily: 'inherit', padding: 0, fontWeight: 500 }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#EF4444')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#CBD5E1')}>
            Clear all
          </button>
        </div>
      </div>

      <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px', marginTop: '6px' }}>{campaignName}</p>

      {/* Line items */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E8ECF2', padding: '0 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {items.map((item) => (
          <CartLineRow
            key={item.id}
            item={item}
            primaryColor={primaryColor}
            accentColor={accentColor}
            slug={slug}
            campaignSlug={campaignSlug}
            onRemove={() => remove(item.id)}
            onSetQty={(q) => setQty(item.id, q)}
            onUpdatePersonalisation={(personId, value) => handleUpdatePersonalisation(item.id, personId, value)}
          />
        ))}
        <div style={{ height: '8px' }} />
      </div>

      {/* Order summary */}
      <div style={{ marginTop: '20px', padding: '22px 24px', background: '#fff', borderRadius: '14px', border: '1px solid #E8ECF2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Order Summary</div>
        {items.map((item) => {
          const dims = [item.fit ? (FIT_LABELS[item.fit] ?? item.fit) : '', item.size].filter(Boolean).join(' · ')
          return (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '7px', fontSize: '14px' }}>
              <span style={{ color: '#374151', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.productName}
                {dims && <span style={{ color: '#94A3B8', marginLeft: '5px' }}>({dims})</span>}
                {item.qty > 1 && <span style={{ color: '#94A3B8', marginLeft: '4px' }}>× {item.qty}</span>}
              </span>
              <span style={{ fontWeight: 600, color: primaryColor, flexShrink: 0 }}>{fmt(cartLineTotal(item))}</span>
            </div>
          )
        })}
        <div style={{ borderTop: '2px solid #F1F4FA', paddingTop: '14px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: primaryColor }}>Order Total</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: primaryColor, letterSpacing: '-0.025em' }}>{fmt(total)}</span>
        </div>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px', lineHeight: 1.55, marginBottom: 0 }}>
          No payment taken now — you&apos;ll be invoiced once minimum order quantity is reached.
        </p>
      </div>

      {/* Actions */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <a href={checkoutUrl}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 24px', background: accentColor, color: '#fff', textDecoration: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '16px', letterSpacing: '0.02em', boxShadow: `0 4px 16px ${accentColor}44` }}>
          Proceed to Checkout →
        </a>
        <a href={`/merch/${slug}/${campaignSlug}`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 24px', background: 'transparent', color: primaryColor, textDecoration: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px', border: '1.5px solid #E2E8EF' }}>
          ← Continue Shopping
        </a>
      </div>
    </div>
  )
}
