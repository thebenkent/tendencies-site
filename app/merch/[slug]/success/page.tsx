import Image from 'next/image'
import { findTenantBySlug } from '@/lib/merch/repositories/tenants'
import { findOrderById } from '@/lib/merch/repositories/orders'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ reservation?: string }>
}) {
  const { slug } = await params
  const { reservation: orderId } = await searchParams

  const tenant = await findTenantBySlug(slug).catch(() => null)
  if (!tenant) notFound()

  const order = orderId
    ? await findOrderById(orderId, tenant.id).catch(() => null)
    : null

  // First line carries the product/variant details for single-product orders
  const line    = order?.merch_order_lines?.[0] ?? null
  const product = line?.merch_products         ?? null
  const variant = line?.merch_product_variants ?? null

  const navy = tenant.primary_color
  const red  = tenant.secondary_color

  return (
    <div>
      <header style={{ background: navy, padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `3px solid ${red}` }}>
        {tenant.logo_url
          ? <div style={{ position: 'relative', height: '32px', width: '130px' }}><Image src={tenant.logo_url} alt={tenant.name} fill style={{ objectFit: 'contain', objectPosition: 'center' }} /></div>
          : <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>{tenant.name}</span>}
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '64px 32px 80px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '36px' }}>✓</div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: navy, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
          Thanks{order ? `, ${order.merch_customers.first_name}` : ''}!
        </h1>
        <p style={{ fontSize: '17px', color: '#374151', lineHeight: 1.7, marginBottom: order?.order_number ? '20px' : '32px' }}>
          Your pre-order has been placed. You&apos;ll receive an email once the minimum quantity is reached and your order is confirmed.
        </p>

        {order?.order_number && (
          <div style={{ display: 'inline-block', background: '#F0F3FA', border: `2px solid ${navy}`, borderRadius: '10px', padding: '12px 28px', marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#5A6B7E', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Pre-Order Reference</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: navy, letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums' }}>
              {order.order_number}
            </div>
          </div>
        )}

        {order && line && product && variant && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8EF', padding: '24px', textAlign: 'left', marginBottom: '32px', boxShadow: '0 2px 8px rgba(11,31,77,0.06)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: navy, marginBottom: '16px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your Pre-Order</div>
            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '14px' }}>
              {[
                { label: 'Name',     value: `${order.merch_customers.first_name} ${order.merch_customers.last_name}` },
                { label: 'Email',    value: order.merch_customers.email },
                { label: 'Product',  value: product.name },
                { label: 'Size',     value: variant.size },
                ...(variant.colour ? [{ label: 'Colour', value: variant.colour }] : []),
                { label: 'Quantity', value: String(line.qty) },
                { label: 'Delivery', value: order.delivery_method === 'collect' ? 'Collect from club' : 'Courier' },
                { label: 'Status',   value: 'Pre-Ordered' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt style={{ fontSize: '12px', color: '#5A6B7E', fontWeight: 600, marginBottom: '2px' }}>{label}</dt>
                  <dd style={{ margin: 0, color: navy, fontWeight: 600 }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div style={{ background: '#F0F3FA', borderRadius: '10px', padding: '20px 24px', textAlign: 'left', marginBottom: '32px', border: '1px solid #D1DCF0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: navy, marginBottom: '14px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>What Happens Next</div>
          {[
            'More members place their pre-orders.',
            'Once the minimum quantity is reached, you\'ll receive an email with payment instructions.',
            'Once payment is received, production begins.',
            'Your order is delivered or ready for collection.',
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: red, color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>

        <a href={`/merch/${slug}`} style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', background: navy, color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '15px' }}>
          ← Back to Store
        </a>
      </div>

      <footer style={{ background: navy, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
        <p style={{ margin: 0 }}>{tenant.name} · Merchandise powered by <a href="https://tendencies.co.nz" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tendencies</a></p>
      </footer>
    </div>
  )
}
