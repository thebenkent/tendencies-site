'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import s from './portal.module.css'
import {
  ADDRESSES, BRANDS, COST_CENTRES, ITEMS, SEED_ORDERS, STEPS,
  colours, money, sizes, type Item, type Line, type Order,
} from './data'

type View = 'shop' | 'product' | 'cart' | 'approvals' | 'orders' | 'order'
type Role = 'staff' | 'adm'
export type Layout = 'Sidebar' | 'Storefront'

const STAFF = { name: 'Sam Reid', org: 'Heineken NZ · Marketing', initials: 'SR' }
const ADM = { name: 'Issy Hellen', org: 'ADM Indicia', initials: 'IH' }
const WORDMARK = '/heineken/tendencies-wordmark-ink.svg'
const TODAY = '4 Oct'

const item = (r: number): Item | undefined => ITEMS.find(i => i.r === r)
const ccLabel = (code: string) => COST_CENTRES.find(c => c.code === code)?.label ?? code

function lineView(l: Line) {
  const i = item(l.r)
  const total = (i?.price ?? 0) * l.qty
  return { ...l, name: i?.name ?? '', img: i?.img ?? '', variant: [l.colour, l.size].filter(Boolean).join(' · '), total }
}

function orderView(o: Order) {
  const lines = o.lines.map(lineView)
  return { ...o, lines, total: lines.reduce((a, b) => a + b.total, 0) }
}

const statusTxt = (st: number) => (st < 0 ? 'Declined' : st === 0 ? 'Awaiting approval' : STEPS[st])

export default function HeinekenPortal({ layout = 'Sidebar', allowance = 800 }: { layout?: Layout; allowance?: number }) {
  const [role, setRole] = useState<Role>('staff')
  const [view, setView] = useState<View>('shop')
  const [pr, setPr] = useState<number | null>(null)
  const [sel, setSel] = useState<{ colour: string | null; size: string | null; qty: number }>({ colour: null, size: null, qty: 1 })
  const [brand, setBrand] = useState('All')
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const [cart, setCart] = useState<Line[]>([])
  const [toast, setToast] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [co, setCo] = useState({ cc: COST_CENTRES[0].code, po: '', addr: ADDRESSES[0] })
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const flash = (t: string) => {
    setToast(t)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3200)
  }
  const go = (v: View) => { window.scrollTo(0, 0); setView(v) }

  const staff = role === 'staff'
  const user = staff ? STAFF : ADM
  const sidebar = layout === 'Sidebar'

  const all = orders.map(orderView)
  const mine = all.filter(o => o.who === STAFF.name)
  const spent = mine.filter(o => o.status >= 0).reduce((a, o) => a + o.total, 0)
  const left = Math.max(allowance - spent, 0)
  const pending = all.filter(o => o.status === 0)
  const cartLines = cart.map(lineView)
  const cartTotal = cartLines.reduce((a, b) => a + b.total, 0)
  const cartCount = cart.reduce((a, l) => a + l.qty, 0)

  const navDefs: [View, string, number][] = staff
    ? [['shop', 'Catalogue', 0], ['orders', 'My orders', 0], ['cart', 'Cart', cartCount]]
    : [['shop', 'Catalogue', 0], ['approvals', 'Approvals', pending.length], ['orders', 'All orders', 0], ['cart', 'Cart', cartCount]]
  const navView = view === 'product' ? 'shop' : view === 'order' ? 'orders' : view

  const brands = ['All', ...BRANDS]
  const cats = ['All', ...Array.from(new Set(ITEMS.map(i => i.cat)))]
  const ql = q.trim().toLowerCase()
  const products = ITEMS.filter(i =>
    (brand === 'All' || i.brand === brand) && (cat === 'All' || i.cat === cat) && (!ql || i.name.toLowerCase().includes(ql)))

  const p = pr != null ? item(pr) : undefined
  const ord = all.find(o => o.id === orderId)

  const pickRole = (k: Role) => {
    setRole(k)
    if (view === 'approvals' && k === 'staff') setView('shop')
  }
  const pickBrand = (b: string) => { setBrand(b); setView('shop') }
  const openProduct = (i: Item) => {
    window.scrollTo(0, 0)
    setPr(i.r)
    setSel({ colour: colours(i)[0] ?? null, size: null, qty: 1 })
    setView('product')
  }
  const openOrder = (id: string) => { window.scrollTo(0, 0); setOrderId(id); setView('order') }
  const setStatus = (id: string, st: number) => setOrders(os => os.map(x => (x.id === id ? { ...x, status: st } : x)))

  const addToCart = () => {
    if (!p) return
    const sz = sel.size ?? (sizes(p).length === 1 ? 'One size' : null)
    if (!sz) return flash('Pick a size first.')
    setCart(c => [...c, { r: p.r, colour: sel.colour, size: sz, qty: sel.qty }])
    setView('shop')
    flash(`Added ${sel.qty} × ${p.name} to your cart.`)
  }

  const submit = () => {
    const id = `HK-${1054 + orders.length - SEED_ORDERS.length}`
    const n: Order = {
      id, who: user.name, site: staff ? 'Heineken House, Auckland' : 'ADM Indicia', date: TODAY,
      cc: co.cc, po: co.po, status: staff ? 0 : 1, addr: co.addr, lines: cart,
    }
    setOrders(os => [...os, n])
    setCart([])
    setOrderId(id)
    setView('order')
    flash(staff ? `${id} sent to ADM for approval.` : `${id} approved and sent to Tendencies.`)
  }

  const reorder = (o: Order) => {
    setCart(c => [...c, ...o.lines.map(l => ({ r: l.r, colour: l.colour, size: l.size, qty: l.qty }))])
    setView('cart')
    flash(`Items from ${o.id} added to your cart.`)
  }

  const shownOrders = (staff ? mine : all).slice().reverse()

  return (
    <div className={s.root}>
      {sidebar ? (
        <aside className={s.sidebar}>
          <Brandmark size={19} />
          <nav style={col(2)}>
            {navDefs.map(([k, label, c]) => {
              const active = navView === k
              return (
                <button key={k} onClick={() => go(k)} className={active ? undefined : s.navIdle}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 0, background: active ? 'var(--wash)' : 'transparent', borderRadius: 8, padding: '9px 10px', fontSize: 14, fontWeight: active ? 600 : 500, color: active ? 'var(--ink)' : 'var(--ink-3)', cursor: 'pointer', textAlign: 'left' }}>
                  {label}
                  {c > 0 && <span className={s.mono} style={{ fontSize: 12, background: active ? 'var(--lime)' : 'var(--line-2)', color: 'var(--ink)', borderRadius: 999, padding: '1px 7px' }}>{c}</span>}
                </button>
              )
            })}
          </nav>
          <div style={{ ...col(6), padding: '0 8px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-5)', letterSpacing: '.06em' }}>BRANDS</div>
            {brands.map(b => brand === b ? (
              <button key={b} onClick={() => pickBrand(b)} style={{ border: 0, background: 'transparent', padding: '4px 0', fontSize: 14, fontWeight: 600, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                <span style={{ width: 6, height: 6, flex: '0 0 6px', borderRadius: '50%', background: 'var(--lime)' }} />{brandLabel(b)}
              </button>
            ) : (
              <button key={b} onClick={() => pickBrand(b)} style={{ border: 0, background: 'transparent', padding: '4px 0 4px 14px', fontSize: 14, color: 'var(--ink-3)', textAlign: 'left', cursor: 'pointer', whiteSpace: 'nowrap' }}>{brandLabel(b)}</button>
            ))}
          </div>
          <div style={{ marginTop: 'auto', ...col(12) }}>
            {staff && (
              <div style={{ background: 'var(--wash)', borderRadius: 10, padding: 12, ...col(8) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)' }}><span>Uniform allowance</span><span className={s.mono}>FY27</span></div>
                <div className={s.display} style={{ fontWeight: 700, fontSize: 22 }}>
                  {money(left)} <span style={{ fontFamily: 'var(--hk-body)', fontWeight: 400, fontSize: 13, color: 'var(--ink-4)' }}>left of {money(allowance)}</span>
                </div>
                <div style={{ height: 6, background: 'var(--line)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--ink)', width: `${Math.round((left / allowance) * 100)}%` }} />
                </div>
              </div>
            )}
            <RoleSwitch role={role} onPick={pickRole} stretch />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
              <Avatar initials={user.initials} />
              <div style={{ ...col(0), minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.org}</div>
              </div>
            </div>
          </div>
        </aside>
      ) : (
        <header className={s.header}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <Brandmark size={18} oneLine />
            <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {navDefs.map(([k, label, c]) => {
                const active = navView === k
                return (
                  <button key={k} onClick={() => go(k)} className={active ? undefined : s.pillIdle}
                    style={{ border: 0, background: active ? 'var(--ink)' : 'transparent', color: active ? '#fff' : 'var(--ink-2)', borderRadius: 999, padding: '7px 14px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
                    {label}
                    {c > 0 && <span className={s.mono} style={{ fontSize: 12, color: active ? 'var(--lime)' : 'var(--lime-ink)' }}>{c}</span>}
                  </button>
                )
              })}
            </nav>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {staff && <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Allowance <span className={s.mono} style={{ fontWeight: 500, color: 'var(--ink)' }}>{money(left)}</span> / {money(allowance)}</div>}
              <RoleSwitch role={role} onPick={pickRole} />
              <Avatar initials={user.initials} />
            </div>
          </div>
        </header>
      )}

      <main className={`${s.main} ${sidebar ? s.withSidebar : ''}`}>
        <div className={s.mainInner}>
          {toast && (
            <div role="status" style={{ background: 'var(--ink)', color: '#fff', borderRadius: 10, padding: '12px 16px', fontSize: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)', flex: '0 0 8px' }} />{toast}
            </div>
          )}

          {view === 'shop' && (
            <div style={col(20)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
                <div style={col(6)}>
                  <H1>{brand === 'All' ? 'Catalogue' : brand}</H1>
                  <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Made to order. Every item is decorated after your order is approved.</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input placeholder="Search items" aria-label="Search items" value={q} onChange={e => setQ(e.target.value)}
                    style={{ height: 36, width: 220, maxWidth: '100%', boxSizing: 'border-box', border: '1px solid var(--line-3)', borderRadius: 8, padding: '0 12px', fontSize: 14, background: '#fff' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#b45309', background: '#fffbeb', padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>Sample prices</span>
                </div>
              </div>
              {!sidebar && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>
                  {brands.map(b => {
                    const active = brand === b
                    return (
                      <button key={b} onClick={() => pickBrand(b)}
                        style={{ border: `1px solid ${active ? 'var(--ink)' : 'var(--line-3)'}`, background: active ? 'var(--ink)' : '#fff', color: active ? '#fff' : 'var(--ink)', borderRadius: 999, padding: '7px 14px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                        {brandLabel(b)}
                      </button>
                    )
                  })}
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {cats.map(c => {
                  const active = cat === c
                  return (
                    <button key={c} onClick={() => setCat(c)}
                      style={{ border: 0, background: active ? 'var(--lime-wash)' : 'var(--line-2)', color: active ? '#173000' : 'var(--ink-2)', borderRadius: 6, padding: '5px 10px', fontSize: 13, fontWeight: active ? 600 : 500, cursor: 'pointer' }}>
                      {c === 'All' ? 'Everything' : c}
                    </button>
                  )
                })}
              </div>
              <div className={s.grid}>
                {products.map(i => (
                  <button key={i.r} onClick={() => openProduct(i)} className={s.card}
                    style={{ border: '1px solid var(--line)', background: '#fff', borderRadius: 12, padding: 0, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Thumb src={i.img} box={{ aspectRatio: '1 / 1', width: '100%', padding: 14 }} />
                    <div style={{ padding: '12px 14px 14px', ...col(6) }}>
                      <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{i.brand}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3, textWrap: 'pretty' }}>{i.name}</div>
                      <div className={s.mono} style={{ fontSize: 14, fontWeight: 500 }}>{money(i.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
              {products.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-4)', fontSize: 14 }}>No items match.</div>}
            </div>
          )}

          {view === 'product' && p && (
            <div style={col(18)}>
              <BackLink onClick={() => go('shop')}>← Back to catalogue</BackLink>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 36, alignItems: 'start' }}>
                <Thumb src={p.img} box={{ aspectRatio: '1 / 1', width: '100%', padding: 32, borderRadius: 14 }} />
                <div style={col(22)}>
                  <div style={col(8)}>
                    <div style={{ fontSize: 13, color: 'var(--ink-4)' }}>{p.brand} · {p.cat}</div>
                    <h1 className={s.display} style={{ margin: 0, fontWeight: 800, fontSize: 32, lineHeight: 1.08, letterSpacing: '-.02em', textWrap: 'balance' }}>{p.name}</h1>
                    <div className={s.mono} style={{ fontSize: 20, fontWeight: 500 }}>{money(p.price)}</div>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)' }}>Branding: {p.deco}.</div>
                  {colours(p).length > 0 && (
                    <OptionGroup label="Colour" options={colours(p)} value={sel.colour} onPick={c => setSel({ ...sel, colour: c })} />
                  )}
                  <OptionGroup label="Size" options={sizes(p)} value={sel.size} onPick={z => setSel({ ...sel, size: z })} minWidth={48} />
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-3)', borderRadius: 8, height: 44, background: '#fff' }}>
                      <button aria-label="Decrease quantity" onClick={() => setSel({ ...sel, qty: Math.max(1, sel.qty - 1) })} style={qtyBtn}>−</button>
                      <div className={s.mono} style={{ minWidth: 32, textAlign: 'center', fontSize: 15 }}>{sel.qty}</div>
                      <button aria-label="Increase quantity" onClick={() => setSel({ ...sel, qty: sel.qty + 1 })} style={qtyBtn}>+</button>
                    </div>
                    <button onClick={addToCart} className={s.darkBtn} style={{ ...darkBtn, height: 44, padding: '0 22px', fontSize: 15 }}>Add to cart</button>
                  </div>
                  <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, ...col(6), fontSize: 13, lineHeight: 1.5, color: 'var(--ink-3)' }}>
                    <div>Made to order after approval. Allow 10 working days.</div>
                    <div>Size chart and fit notes from the garment supplier.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'cart' && (
            <div style={col(20)}>
              <H1>Cart</H1>
              {cart.length === 0 ? (
                <div style={{ ...panel, padding: 40, ...col(12), alignItems: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
                  Your cart is empty.
                  <button onClick={() => go('shop')} className={s.darkBtn} style={{ ...darkBtn, padding: '10px 18px', fontSize: 14 }}>Browse catalogue</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 20, alignItems: 'start' }}>
                  <div style={{ ...panel, ...col(0) }}>
                    {cartLines.map((l, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 14, padding: '14px 16px', borderBottom: '1px solid var(--line-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Thumb src={l.img} box={{ width: 64, height: 64, flex: '0 0 64px', borderRadius: 8 }} />
                        <div style={{ flex: 1, minWidth: 120, ...col(3) }}>
                          <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{l.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{l.variant}</div>
                        </div>
                        <div className={s.mono} style={{ fontSize: 13, color: 'var(--ink-3)' }}>× {l.qty}</div>
                        <div className={s.mono} style={{ fontSize: 14, fontWeight: 500, minWidth: 72, textAlign: 'right' }}>{money(l.total)}</div>
                        <button onClick={() => setCart(c => c.filter((_, j) => j !== idx))} className={s.removeBtn}
                          style={{ border: 0, background: 'transparent', color: 'var(--ink-5)', fontSize: 13, cursor: 'pointer', padding: 6 }}>Remove</button>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16, fontSize: 15 }}>
                      <span style={{ fontWeight: 600 }}>Total</span>
                      <span className={s.mono} style={{ fontWeight: 600 }}>{money(cartTotal)}</span>
                    </div>
                  </div>
                  <div style={{ ...panel, padding: 20, ...col(16) }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Order details</div>
                    <label style={fieldLabel}>Cost centre
                      <select value={co.cc} onChange={e => setCo({ ...co, cc: e.target.value })} style={field}>
                        {COST_CENTRES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                    </label>
                    <label style={fieldLabel}>
                      <span>PO or reference <span style={{ fontWeight: 400, color: 'var(--ink-4)' }}>Optional</span></span>
                      <input value={co.po} onChange={e => setCo({ ...co, po: e.target.value })} placeholder="e.g. EVT-SUMMER-26" style={{ ...field, boxSizing: 'border-box' }} />
                    </label>
                    <label style={fieldLabel}>Deliver to
                      <select value={co.addr} onChange={e => setCo({ ...co, addr: e.target.value })} style={field}>
                        {ADDRESSES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </label>
                    {staff && (cartTotal > left ? (
                      <div style={{ fontSize: 13, lineHeight: 1.5, color: '#c5363b', background: '#fef2f2', borderRadius: 8, padding: '10px 12px' }}>
                        This order is {money(cartTotal - left)} over your remaining allowance. ADM can still approve it.
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, lineHeight: 1.5, color: '#3a6c0c', background: '#f3fce1', borderRadius: 8, padding: '10px 12px' }}>
                        Within allowance. {money(left - cartTotal)} left after this order.
                      </div>
                    ))}
                    <button onClick={submit} className={s.darkBtn} style={{ ...darkBtn, height: 44, fontSize: 15 }}>
                      {staff ? 'Submit for approval' : 'Place approved order'}
                    </button>
                    <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--ink-4)' }}>
                      {staff
                        ? 'ADM Indicia reviews every order. You’ll get an email when it’s approved and when it ships.'
                        : 'Orders placed by ADM skip approval and go straight to production.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'approvals' && (
            <div style={col(20)}>
              <div style={col(6)}>
                <H1>Approvals</H1>
                <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Orders go to production only after approval.</div>
              </div>
              {pending.length === 0 && <div style={{ ...panel, padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>Nothing waiting.</div>}
              {pending.map(o => (
                <div key={o.id} style={{ ...panel, padding: '18px 20px', ...col(14) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={col(4)}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                        <span className={s.mono} style={{ fontWeight: 500 }}>{o.id}</span>
                        <span style={{ fontSize: 13, color: 'var(--ink-4)' }}>{o.date}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{o.who} <span style={{ fontWeight: 400, color: 'var(--ink-4)' }}>· {o.site}</span></div>
                    </div>
                    <div className={s.mono} style={{ fontSize: 18, fontWeight: 600 }}>{money(o.total)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {o.lines.map((l, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--wash)', borderRadius: 8, padding: '6px 10px 6px 6px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={l.img} alt="" style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                        <div style={{ fontSize: 13, lineHeight: 1.3 }}>
                          <div>{l.name}</div>
                          <div style={{ color: 'var(--ink-4)' }}>{l.variant} × {l.qty}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--line-2)', paddingTop: 14 }}>
                    <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{ccLabel(o.cc)}{o.po && ` · PO ${o.po}`}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setStatus(o.id, -1); flash(`${o.id} declined.`) }}
                        style={{ height: 38, border: '1px solid var(--line-3)', background: '#fff', borderRadius: 8, padding: '0 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Decline</button>
                      <button onClick={() => { setStatus(o.id, 1); flash(`${o.id} approved. Tendencies will order blanks today.`) }} className={s.limeBtn}
                        style={{ height: 38, border: 0, background: 'var(--lime)', color: 'var(--ink)', borderRadius: 8, padding: '0 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'orders' && (
            <div style={col(20)}>
              <H1>{staff ? 'My orders' : 'All orders'}</H1>
              <div style={{ ...panel, overflowX: 'auto' }}>
                <div style={{ minWidth: 720 }}>
                  <div style={{ ...orderGrid, padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: 12, color: 'var(--ink-4)', fontWeight: 500, background: 'var(--canvas)' }}>
                    <div>Order</div><div>Date</div><div>Ordered by</div><div>Items</div><div style={{ textAlign: 'right' }}>Total</div><div>Status</div>
                  </div>
                  {shownOrders.map(o => (
                    <button key={o.id} onClick={() => openOrder(o.id)} className={s.rowBtn}
                      style={{ ...orderGrid, width: '100%', padding: '14px 16px', border: 0, borderBottom: '1px solid var(--line-2)', background: '#fff', textAlign: 'left', fontSize: 14, alignItems: 'center', cursor: 'pointer' }}>
                      <div className={s.mono} style={{ fontWeight: 500 }}>{o.id}</div>
                      <div style={{ color: 'var(--ink-3)' }}>{o.date}</div>
                      <div>{o.who}</div>
                      <div style={{ color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.lines.map(l => `${l.qty} × ${l.name}`).join(', ')}</div>
                      <div className={s.mono} style={{ textAlign: 'right' }}>{money(o.total)}</div>
                      <div><StatusPill status={o.status} /></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'order' && ord && (
            <div style={col(20)}>
              <BackLink onClick={() => go('orders')}>← Orders</BackLink>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={col(6)}>
                  <H1>Order {ord.id}</H1>
                  <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>{ord.who} · {ord.date} · {ccLabel(ord.cc)}</div>
                </div>
                <button onClick={() => reorder(ord)} className={s.outlineBtn}
                  style={{ height: 40, border: '1px solid var(--ink)', background: '#fff', borderRadius: 8, padding: '0 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Reorder</button>
              </div>
              <div style={{ ...panel, padding: '22px 20px', overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(90px, 1fr))', minWidth: 640 }}>
                  {STEPS.map((label, k) => {
                    const st = ord.status < 0 ? 0 : ord.status
                    const done = k < st || (k === st && st >= 5)
                    const current = k === st && st < 5
                    const sub = ({ 0: ord.date, 1: 'ADM Indicia', 2: 'From supplier', 3: 'Routed per item', 4: 'Tendencies', 5: 'NZ Couriers' } as Record<number, string>)[k] ?? ''
                    return (
                      <div key={label} style={col(10)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: 14, height: 14, flex: '0 0 14px', borderRadius: '50%', boxSizing: 'border-box',
                            ...(done ? { background: 'var(--lime)' } : current ? { background: 'var(--ink)', boxShadow: '0 0 0 4px var(--line)' } : { border: '2px solid var(--line-3)', background: '#fff' }),
                          }} />
                          {k < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: 'var(--line)' }} />}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, paddingRight: 8 }}>{k === 1 && ord.status < 0 ? 'Declined' : label}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-4)', paddingRight: 8, lineHeight: 1.4 }}>{sub}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={panel}>
                {ord.lines.map((l, j) => (
                  <div key={j} style={{ display: 'flex', gap: 14, padding: '14px 16px', borderBottom: '1px solid var(--line-2)', alignItems: 'center' }}>
                    <Thumb src={l.img} box={{ width: 56, height: 56, flex: '0 0 56px', borderRadius: 8 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{l.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{l.variant}</div>
                    </div>
                    <div className={s.mono} style={{ fontSize: 13, color: 'var(--ink-3)' }}>× {l.qty}</div>
                    <div className={s.mono} style={{ fontSize: 14, minWidth: 72, textAlign: 'right' }}>{money(l.total)}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', fontSize: 14, gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--ink-3)' }}>
                    Deliver to {ord.addr}
                    {ord.tracking && <> · Tracking <span className={s.mono} style={{ color: 'var(--ink)' }}>{ord.tracking}</span></>}
                  </span>
                  <span className={s.mono} style={{ fontWeight: 600 }}>{money(ord.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

/* ── Small pieces ─────────────────────────────────── */

const col = (gap: number): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap })
const panel: CSSProperties = { background: '#fff', border: '1px solid var(--line)', borderRadius: 12 }
const darkBtn: CSSProperties = { border: 0, background: 'var(--ink)', color: '#fff', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }
const qtyBtn: CSSProperties = { width: 44, height: 42, border: 0, background: 'transparent', fontSize: 18, cursor: 'pointer' }
const field: CSSProperties = { height: 40, border: '1px solid var(--line-3)', borderRadius: 8, padding: '0 10px', fontSize: 14, background: '#fff' }
const fieldLabel: CSSProperties = { ...col(6), fontSize: 13, fontWeight: 500 }
const orderGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '110px 100px minmax(160px,1fr) minmax(180px,1.4fr) 100px 150px', gap: 14 }

const brandLabel = (b: string) => (b === 'All' ? 'All brands' : b)

function H1({ children }: { children: ReactNode }) {
  return <h1 className={s.display} style={{ margin: 0, fontWeight: 800, fontSize: 34, letterSpacing: '-.02em' }}>{children}</h1>
}

function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} style={{ alignSelf: 'flex-start', border: 0, background: 'transparent', padding: 0, fontSize: 14, color: 'var(--ink-3)', cursor: 'pointer' }}>{children}</button>
}

function Brandmark({ size, oneLine }: { size: number; oneLine?: boolean }) {
  return (
    <div style={{ ...col(oneLine ? 2 : 4), padding: oneLine ? 0 : '0 8px' }}>
      <div className={s.display} style={{ fontWeight: 800, fontSize: size, letterSpacing: '-.01em', lineHeight: 1.1 }}>
        {oneLine ? 'Heineken Brands Uniform Store' : <>Heineken Brands<br />Uniform Store</>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: oneLine ? 11 : 12, color: 'var(--ink-4)' }}>
        by {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={WORDMARK} alt="Tendencies" style={{ height: oneLine ? 12 : 13 }} />
      </div>
    </div>
  )
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div style={{ width: 32, height: 32, flex: '0 0 32px', borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{initials}</div>
  )
}

function RoleSwitch({ role, onPick, stretch }: { role: Role; onPick: (r: Role) => void; stretch?: boolean }) {
  const roles: [Role, string][] = [['staff', 'Heineken staff'], ['adm', 'ADM']]
  return (
    <div role="group" aria-label="View as" style={{ display: 'flex', background: 'var(--line-2)', borderRadius: 8, padding: 3, gap: 2 }}>
      {roles.map(([k, label]) => {
        const active = role === k
        return (
          <button key={k} onClick={() => onPick(k)} aria-pressed={active}
            style={{ flex: stretch ? 1 : undefined, border: 0, background: active ? '#fff' : 'transparent', boxShadow: active ? '0 1px 2px rgba(0,0,0,.08)' : 'none', borderRadius: 6, padding: stretch ? '6px 4px' : '5px 10px', fontSize: 12, fontWeight: active ? 600 : 500, color: active ? 'var(--ink)' : 'var(--ink-3)', cursor: 'pointer' }}>
            {label}
          </button>
        )
      })}
    </div>
  )
}

function OptionGroup({ label, options, value, onPick, minWidth }: { label: string; options: string[]; value: string | null; onPick: (v: string) => void; minWidth?: number }) {
  return (
    <div style={col(8)}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => {
          const active = value === o
          return (
            <button key={o} onClick={() => onPick(o)} aria-pressed={active}
              style={{ minWidth, border: active ? '1.5px solid var(--ink)' : '1px solid var(--line-3)', background: '#fff', borderRadius: 8, padding: minWidth ? '8px 12px' : '8px 14px', fontSize: 14, fontWeight: active ? 600 : 400, color: active ? 'var(--ink)' : 'var(--ink-2)', cursor: 'pointer' }}>
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// The image is absolutely positioned inside the padding box so tall product
// shots can't stretch an aspect-ratio tile.
function Thumb({ src, box }: { src: string; box: CSSProperties }) {
  const { padding = 4, ...rest } = box
  return (
    <div style={{ position: 'relative', background: 'var(--wash)', overflow: 'hidden', flexShrink: 0, ...rest }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy"
        style={{ position: 'absolute', inset: padding, width: `calc(100% - ${typeof padding === 'number' ? padding * 2 : 0}px)`, height: `calc(100% - ${typeof padding === 'number' ? padding * 2 : 0}px)`, objectFit: 'contain', mixBlendMode: 'multiply' }} />
    </div>
  )
}

function StatusPill({ status }: { status: number }) {
  const [color, bg] =
    status < 0 ? ['#c5363b', '#fef2f2']
    : status === 0 ? ['#b45309', '#fffbeb']
    : status >= 5 ? ['#3a6c0c', 'var(--lime-wash)']
    : ['var(--ink)', 'var(--line-2)']
  return <span style={{ fontSize: 12, fontWeight: 600, color, background: bg, padding: '4px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>{statusTxt(status)}</span>
}
