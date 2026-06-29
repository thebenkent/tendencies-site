'use client'

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
  contactEmail?: string
  campaignName: string
}

const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`

function CartLineRow({
  item,
  primaryColor,
  accentColor,
  slug,
  campaignSlug,
  onRemove,
  onSetQty,
}: {
  item:         CartItem
  primaryColor: string
  accentColor:  string
  slug:         string
  campaignSlug: string
  onRemove:     () => void
  onSetQty:     (qty: number) => void
}) {
  const lineTotal = cartLineTotal(item)
  const dims = [item.fit, item.colour, item.size].filter(Boolean).join(' / ')

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '20px 0', borderBottom: '1px solid #E2E8EF', alignItems: 'flex-start' }}>
      {/* Image */}
      <a href={`/merch/${slug}/${campaignSlug}/${item.productSlug}`}
        style={{ flexShrink: 0, width: '80px', height: '80px', borderRadius: '10px', background: '#F0F3FA', overflow: 'hidden', position: 'relative', display: 'block' }}>
        {item.imageUrl
          ? <Image src={item.imageUrl} alt={item.productName} fill style={{ objectFit: 'contain', padding: '8px' }} sizes="80px" />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', opacity: 0.2 }}>👕</div>}
      </a>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <a href={`/merch/${slug}/${campaignSlug}/${item.productSlug}`}
          style={{ fontSize: '16px', fontWeight: 700, color: primaryColor, textDecoration: 'none', display: 'block', marginBottom: '4px', lineHeight: 1.2 }}>
          {item.productName}
        </a>
        {dims && (
          <div style={{ fontSize: '13px', color: '#5A6B7E', marginBottom: '6px' }}>{dims}</div>
        )}
        {item.personalisation.length > 0 && (
          <div style={{ fontSize: '12px', color: '#5A6B7E', marginBottom: '6px' }}>
            {item.personalisation.map((p) => `${p.label}: ${p.value}`).join(' · ')}
          </div>
        )}
        <div style={{ fontSize: '13px', color: '#5A6B7E' }}>
          {fmt(item.priceCents)} each
          {item.personalisation.length > 0 && (
            <span style={{ marginLeft: '4px', color: accentColor }}>
              {' '}+ {fmt(item.personalisation.reduce((s, p) => s + p.priceCents, 0))} personalisation
            </span>
          )}
        </div>
      </div>

      {/* Qty + remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '17px', color: primaryColor }}>{fmt(lineTotal)}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
          <button onClick={() => onSetQty(item.qty - 1)}
            style={{ width: '34px', height: '34px', fontSize: '18px', border: 'none', borderRight: '1.5px solid #CBD5E1', background: '#F8FAFC', color: primaryColor, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}>−</button>
          <span style={{ minWidth: '36px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: primaryColor }}>{item.qty}</span>
          <button onClick={() => onSetQty(item.qty + 1)}
            style={{ width: '34px', height: '34px', fontSize: '18px', border: 'none', borderLeft: '1.5px solid #CBD5E1', background: '#F8FAFC', color: primaryColor, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}>+</button>
        </div>
        <button onClick={onRemove}
          style={{ background: 'none', border: 'none', fontSize: '12px', color: '#94A3B8', cursor: 'pointer', fontFamily: 'inherit', padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default function CartPageClient({
  slug, campaignSlug, primaryColor, accentColor, tenantName, campaignName,
}: Props) {
  const { items, total, count, remove, setQty } = useCart()

  const checkoutUrl = `/merch/${slug}/${campaignSlug}/checkout`

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.2 }}>🛒</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: primaryColor, marginBottom: '12px', letterSpacing: '-0.025em' }}>
          Your cart is empty
        </h1>
        <p style={{ fontSize: '16px', color: '#5A6B7E', marginBottom: '32px', lineHeight: 1.6 }}>
          Browse the {campaignName} collection and add items to get started.
        </p>
        <a href={`/merch/${slug}/${campaignSlug}`}
          style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', background: primaryColor, color: '#fff', textDecoration: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px' }}>
          Browse Products →
        </a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: primaryColor, letterSpacing: '-0.03em', margin: 0 }}>
          Your Cart
        </h1>
        <span style={{ fontSize: '14px', color: '#5A6B7E', fontWeight: 500 }}>
          {count} item{count !== 1 ? 's' : ''}
        </span>
      </div>
      <p style={{ fontSize: '14px', color: '#5A6B7E', marginBottom: '32px' }}>
        {campaignName}
      </p>

      {/* Line items */}
      <div>
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
          />
        ))}
      </div>

      {/* Order total */}
      <div style={{ marginTop: '24px', padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8EF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#5A6B7E' }}>Subtotal ({count} item{count !== 1 ? 's' : ''})</span>
          <span style={{ fontSize: '14px', color: '#374151' }}>{fmt(total)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #E2E8EF' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: primaryColor }}>Order Total</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: primaryColor, letterSpacing: '-0.02em' }}>{fmt(total)}</span>
        </div>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px', lineHeight: 1.5, marginBottom: 0 }}>
          No payment taken now. You&apos;ll be invoiced once the minimum order quantity is reached.
        </p>
      </div>

      {/* Checkout CTA */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a href={checkoutUrl}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 24px', background: accentColor, color: '#fff', textDecoration: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '16px', letterSpacing: '0.02em' }}>
          Proceed to Checkout →
        </a>
        <a href={`/merch/${slug}/${campaignSlug}`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 24px', background: 'transparent', color: primaryColor, textDecoration: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px', border: '1.5px solid #CBD5E1' }}>
          ← Continue Shopping
        </a>
      </div>
    </div>
  )
}
