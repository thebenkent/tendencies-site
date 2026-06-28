'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type {
  MerchTenant, MerchCampaign, MerchProduct,
  MerchOrderExpanded, ProductProgress, AdminStats,
} from '@/lib/merch/types'
import type { WorkflowAction } from '@/lib/merch/services/workflow'
import type { CustomerWithStats } from '@/lib/modules/customers/repository'
import type { CampaignAnalytics } from '@/lib/modules/analytics/types'
import type { VariantInventoryPosition } from '@/lib/modules/inventory/types'

type Props = {
  tenant:              MerchTenant
  campaigns:           MerchCampaign[]
  activeCampaign:      MerchCampaign | null
  products:            MerchProduct[]
  orders:              MerchOrderExpanded[]
  stats:               AdminStats
  progressList:        ProductProgress[]
  workflowTransitions: Record<string, WorkflowAction[]>
  customers:           CustomerWithStats[]
  analytics:           CampaignAnalytics | null
  outstanding:         { count: number; total_cents: number }
  paymentLinks:        Record<string, string>
  inventory:           Record<string, VariantInventoryPosition[]>   // productId → positions
  slug:                string
  initialFilters:      { status?: string; search?: string; campaignSlug?: string }
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  reserved:          { bg: '#DBEAFE', text: '#1E40AF' },
  confirmed:         { bg: '#EDE9FE', text: '#5B21B6' },
  payment_requested: { bg: '#FEF3C7', text: '#92400E' },
  paid:              { bg: '#DCFCE7', text: '#15803D' },
  production:        { bg: '#DBEAFE', text: '#0369A1' },
  completed:         { bg: '#DCFCE7', text: '#15803D' },
  cancelled:         { bg: '#FEE2E2', text: '#991B1B' },
  refunded:          { bg: '#F1F5F9', text: '#475569' },
}

const STATUS_DISPLAY: Partial<Record<string, string>> = {
  reserved:          'Pre-Ordered',
  confirmed:         'MOQ Confirmed',
  payment_requested: 'Payment Requested',
  paid:              'Paid',
  production:        'In Production',
  completed:         'Completed',
  cancelled:         'Cancelled',
  refunded:          'Refunded',
}

const CAMPAIGN_TYPE_DISPLAY: Record<string, string> = {
  reservation: 'Pre-Order',
  pre_order:   'Pre-Order',
}

function campaignTypeLabel(type: string | null | undefined): string {
  if (!type) return 'Workflow'
  return CAMPAIGN_TYPE_DISPLAY[type] ?? type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function StateLabel({ state }: { state: string }) {
  const s = STATUS_STYLE[state] ?? { bg: '#F3F4F6', text: '#374151' }
  const label = STATUS_DISPLAY[state] ?? state.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}
    >
      {label}
    </span>
  )
}

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default function AdminDashboardClient({
  tenant, campaigns, activeCampaign, products, orders,
  stats, progressList, workflowTransitions, customers, analytics, outstanding,
  paymentLinks: initialPaymentLinks,
  inventory,
  slug, initialFilters,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch]           = useState(initialFilters.search ?? '')
  const [statusFilter, setStatus]     = useState(initialFilters.status ?? '')
  const [closeLoading, setCloseLoading] = useState(false)
  const [closeResult, setCloseResult]   = useState<{ moqResults: { productName: string; moqMet: boolean; orderedQty: number }[] } | null>(null)
  const [transitionLoading, setTransitionLoading] = useState<string | null>(null)
  const [paymentLinks, setPaymentLinks] = useState<Record<string, string>>(initialPaymentLinks)
  const [copied, setCopied] = useState<string | null>(null)

  const navy = tenant.primary_color
  const red  = tenant.secondary_color

  function applyFilters(overrides?: { search?: string; status?: string; campaign?: string }) {
    const s  = overrides?.search   ?? search
    const st = overrides?.status   ?? statusFilter
    const c  = overrides?.campaign ?? activeCampaign?.slug ?? ''
    const p  = new URLSearchParams()
    if (s)  p.set('search', s)
    if (st) p.set('status', st)
    if (c)  p.set('campaign', c)
    startTransition(() => router.push(`/merch/${slug}/admin?${p}`))
  }

  async function handleClose() {
    if (!activeCampaign) return
    if (!confirm(`Close "${activeCampaign.name}"? This will evaluate MOQ for all products.`)) return
    setCloseLoading(true)
    try {
      const res = await fetch(`/api/merch/${slug}/admin/close`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ campaign_slug: activeCampaign.slug }),
      })
      setCloseResult(await res.json())
      router.refresh()
    } finally {
      setCloseLoading(false)
    }
  }

  async function handleTransition(orderId: string, toState: string) {
    // Require confirmation for destructive or irreversible financial actions
    if (toState === 'refunded') {
      if (!confirm('Issue a Stripe refund for this order? This cannot be undone.')) return
    }
    if (toState === 'cancelled') {
      if (!confirm('Cancel this order? This cannot be undone.')) return
    }
    setTransitionLoading(orderId)
    try {
      const res = await fetch(`/api/merch/${slug}/admin/orders`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ order_id: orderId, to_state: toState }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.error ?? 'Failed to update order')
        return
      }
      const data = await res.json().catch(() => ({}))
      // If a Stripe checkout URL was generated, store it locally so admin can copy it immediately
      if (data.checkout_url) {
        setPaymentLinks((prev) => ({ ...prev, [orderId]: data.checkout_url }))
      }
      router.refresh()
    } finally {
      setTransitionLoading(null)
    }
  }

  async function copyPaymentLink(orderId: string) {
    const link = paymentLinks[orderId]
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(orderId)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Fallback: open in new tab so admin can copy from address bar
      window.open(link, '_blank')
    }
  }

  async function handleLogout() {
    await fetch(`/api/merch/${slug}/admin/login`, { method: 'DELETE' })
    router.push(`/merch/${slug}/admin/login`)
  }

  const exportUrl = `/api/merch/${slug}/admin/export${activeCampaign ? `?campaign=${activeCampaign.slug}` : ''}`
  const availableStatuses = [...new Set(orders.map((o) => o.status))].sort()

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Sticky header */}
      <header
        className="sticky top-16 z-40 flex h-16 items-center justify-between border-b-[3px] px-8"
        style={{ background: navy, borderBottomColor: red }}
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-white">{tenant.name}</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`/merch/${slug}`}
            target="_blank"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            View Store →
          </a>
          <button
            onClick={handleLogout}
            className="rounded border border-white/30 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:border-white/50 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Campaign selector */}
        {campaigns.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {campaigns.map((c) => (
              <button
                key={c.id}
                onClick={() => applyFilters({ campaign: c.slug })}
                className="rounded-lg px-4 py-2 text-sm font-semibold border-2 transition-colors cursor-pointer"
                style={{
                  borderColor:  activeCampaign?.id === c.id ? navy : '#CBD5E1',
                  background:   activeCampaign?.id === c.id ? navy : '#fff',
                  color:        activeCampaign?.id === c.id ? '#fff' : navy,
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Close campaign result */}
        {closeResult && (
          <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4">
            {closeResult.moqResults.map((r) => (
              <p key={r.productName} className={`text-sm font-semibold mb-1 ${r.moqMet ? 'text-green-700' : 'text-red-700'}`}>
                {r.moqMet ? '✓' : '✗'} {r.productName}: {r.orderedQty} pre-orders — {r.moqMet ? 'MOQ met, confirmed' : 'MOQ not met, cancelled'}
              </p>
            ))}
            <button onClick={() => setCloseResult(null)} className="mt-2 text-xs text-gray-500 underline cursor-pointer">Dismiss</button>
          </div>
        )}

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign</TabsTrigger>
            <TabsTrigger value="orders">Pre-Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ───────────────────────────── */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Total Pre-Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold tracking-tight" style={{ color: navy }}>{stats.totalOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Confirmed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold tracking-tight text-purple-700">{stats.confirmedOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Awaiting MOQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold tracking-tight text-amber-600">{stats.pendingOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Outstanding Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-extrabold tracking-tight" style={{ color: red }}>
                    {fmt(outstanding.total_cents)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{outstanding.count} order{outstanding.count !== 1 ? 's' : ''}</p>
                </CardContent>
              </Card>
            </div>

            {/* Workflow legend */}
            {Object.keys(workflowTransitions).length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{campaignTypeLabel(activeCampaign?.campaign_type)} Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(workflowTransitions).map(([state, actions]) => (
                      <div key={state} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                        <StateLabel state={state} />
                        <span className="text-gray-400">→</span>
                        <div className="flex gap-1">
                          {actions.map((a) => (
                            <span key={a.toState} className="text-xs text-gray-600 font-medium">{a.actionName}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Campaign Tab ────────────────────────────── */}
          <TabsContent value="campaigns">
            {activeCampaign ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: navy }}>{activeCampaign.name}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {campaignTypeLabel(activeCampaign.campaign_type)} ·{' '}
                      <StateLabel state={activeCampaign.status} />
                      {activeCampaign.closes_at && (
                        <> · Closes {new Date(activeCampaign.closes_at).toLocaleDateString('en-NZ')}</>
                      )}
                    </p>
                  </div>
                  {activeCampaign.status === 'open' && (
                    <Button
                      onClick={handleClose}
                      disabled={closeLoading}
                      style={{ background: closeLoading ? '#94A3B8' : red }}
                      className="text-white border-0 hover:opacity-90"
                    >
                      {closeLoading ? 'Processing…' : 'Close Campaign'}
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {products.map((product, i) => {
                    const prog = progressList[i]
                    if (!prog) return null
                    const remaining = Math.max(0, prog.minimumQty - prog.orderedQty)
                    return (
                      <Card key={product.id}>
                        <CardContent className="pt-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold" style={{ color: navy }}>{product.name}</span>
                            {prog.isMet
                              ? <Badge className="bg-green-100 text-green-700 border-0">MOQ Reached ✓</Badge>
                              : <Badge className="bg-amber-100 text-amber-700 border-0">{remaining} more needed</Badge>}
                          </div>
                          <div className="h-2 rounded-full bg-gray-200 overflow-hidden mb-2">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${prog.percentage}%`,
                                background: prog.isMet
                                  ? '#16a34a'
                                  : `linear-gradient(90deg, ${navy} 0%, ${red} 100%)`,
                              }}
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            <strong style={{ color: navy }}>{prog.orderedQty}</strong>
                            {' '}of{' '}
                            <strong style={{ color: navy }}>{prog.minimumQty}</strong>
                            {' '}minimum · {prog.percentage}%
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No campaigns found.</p>
            )}
          </TabsContent>

          {/* ── Orders Tab ──────────────────────────────── */}
          <TabsContent value="orders">
            <div className="flex flex-wrap gap-3 mb-4">
              <Input
                type="search"
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="max-w-xs"
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }) }}
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All States</option>
                {availableStatuses.map((v) => (
                  <option key={v} value={v}>
                    {STATUS_DISPLAY[v] ?? v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => applyFilters()}
                style={{ background: navy }}
                className="text-white border-0 hover:opacity-90"
              >
                {isPending ? 'Loading…' : 'Search'}
              </Button>
              {(search || statusFilter) && (
                <Button
                  variant="outline"
                  onClick={() => { setSearch(''); setStatus(''); applyFilters({ search: '', status: '' }) }}
                >
                  Clear
                </Button>
              )}
              <div className="ml-auto">
                <a
                  href={exportUrl}
                  className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ↓ Export CSV
                </a>
              </div>
            </div>

            <Card>
              {orders.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">No orders found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const line       = order.merch_order_lines[0]
                      const product    = line?.merch_products
                      const variant    = line?.merch_product_variants
                      const actions    = workflowTransitions[order.status] ?? []
                      const isLoading  = transitionLoading === order.id
                      const paymentUrl = paymentLinks[order.id]
                      const isCopied   = copied === order.id

                      return (
                        <TableRow key={order.id} className={isLoading ? 'opacity-50' : ''}>
                          <TableCell>
                            <span className="font-mono text-xs font-semibold" style={{ color: navy }}>
                              {order.order_number ?? '—'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold" style={{ color: navy }}>
                              {order.merch_customers.first_name} {order.merch_customers.last_name}
                            </div>
                            {order.merch_customers.team && (
                              <div className="text-xs text-gray-400">{order.merch_customers.team}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{order.merch_customers.email}</div>
                            <div className="text-xs text-gray-400">{order.merch_customers.phone}</div>
                          </TableCell>
                          <TableCell className="font-medium">{product?.name ?? '—'}</TableCell>
                          <TableCell>
                            {variant ? (
                              <span className="text-sm">{variant.size}{variant.colour ? ` / ${variant.colour}` : ''}</span>
                            ) : '—'}
                          </TableCell>
                          <TableCell className="text-center">{line?.qty ?? 1}</TableCell>
                          <TableCell className="capitalize text-sm">{order.delivery_method}</TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {new Date(order.created_at).toLocaleDateString('en-NZ')}
                          </TableCell>
                          <TableCell>
                            <StateLabel state={order.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {actions.map((action) => (
                                <button
                                  key={action.toState}
                                  disabled={isLoading}
                                  onClick={() => handleTransition(order.id, action.toState)}
                                  className={`rounded px-2.5 py-1 text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
                                    action.toState === 'cancelled' || action.toState === 'rejected'
                                      ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {action.actionName}
                                </button>
                              ))}
                              {paymentUrl && (
                                <button
                                  onClick={() => copyPaymentLink(order.id)}
                                  title={paymentUrl}
                                  className="rounded px-2.5 py-1 text-xs font-semibold border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  {isCopied ? '✓ Copied' : '⎘ Payment Link'}
                                </button>
                              )}
                              {!actions.length && !paymentUrl && (
                                <span className="text-xs text-gray-300 italic">—</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-400">
                {orders.length} pre-order{orders.length !== 1 ? 's' : ''}{(search || statusFilter) ? ' (filtered)' : ''}
              </div>
            </Card>
          </TabsContent>

          {/* ── Customers Tab ───────────────────────────── */}
          <TabsContent value="customers">
            <Card>
              {customers.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">No customers yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">Orders</TableHead>
                      <TableHead className="text-right">Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <span className="font-semibold" style={{ color: navy }}>
                            {c.first_name} {c.last_name}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{c.email}</TableCell>
                        <TableCell className="text-sm text-gray-500">{c.phone}</TableCell>
                        <TableCell className="text-sm text-gray-500">{c.team ?? '—'}</TableCell>
                        <TableCell className="text-center font-semibold">{c.orderCount}</TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          {c.totalSpent > 0 ? fmt(c.totalSpent) : '—'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                          {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString('en-NZ') : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-400">
                {customers.length} customer{customers.length !== 1 ? 's' : ''}
              </div>
            </Card>
          </TabsContent>

          {/* ── Inventory Tab ───────────────────────────── */}
          <TabsContent value="inventory">
            {products.length === 0 ? (
              <p className="text-gray-400 text-sm">No products in this campaign.</p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => {
                  const positions = inventory[product.id] ?? []
                  const hasTrackedStock = positions.some((p) => p.stock_qty !== null)
                  return (
                    <Card key={product.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold" style={{ color: navy }}>{product.name}</CardTitle>
                          {hasTrackedStock ? (
                            <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">Stock tracked</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">Made-to-order</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {positions.length === 0 ? (
                          <p className="px-5 pb-4 text-sm text-gray-400">No variant inventory data.</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Variant</TableHead>
                                <TableHead className="text-center">Stock</TableHead>
                                <TableHead className="text-center">Allocated</TableHead>
                                <TableHead className="text-center">Available</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Adjust</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {positions.map((pos) => (
                                <TableRow key={pos.variant_id}>
                                  <TableCell className="font-medium text-sm">
                                    {pos.size}{pos.colour ? ` / ${pos.colour}` : ''}
                                  </TableCell>
                                  <TableCell className="text-center text-sm">
                                    {pos.stock_qty === null ? '∞' : pos.stock_qty}
                                  </TableCell>
                                  <TableCell className="text-center text-sm text-gray-500">
                                    {pos.stock_reserved}
                                  </TableCell>
                                  <TableCell className="text-center text-sm font-semibold">
                                    {pos.stock_available === null ? '∞' : pos.stock_available}
                                  </TableCell>
                                  <TableCell>
                                    {pos.stock_qty === null ? (
                                      <span className="text-xs text-gray-400">—</span>
                                    ) : pos.is_low_stock ? (
                                      <Badge className="bg-red-50 text-red-700 border-0 text-xs">Low stock</Badge>
                                    ) : (
                                      <Badge className="bg-green-50 text-green-700 border-0 text-xs">In stock</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <button
                                      onClick={async () => {
                                        const delta = prompt(`Adjust stock for ${pos.size}${pos.colour ? ` / ${pos.colour}` : ''} (use negative to reduce):`)
                                        if (!delta) return
                                        const n = parseInt(delta, 10)
                                        if (isNaN(n) || n === 0) return
                                        const notes = prompt('Reason for adjustment:') ?? 'Manual adjustment'
                                        const res = await fetch(`/api/merch/${slug}/admin/inventory`, {
                                          method:  'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body:    JSON.stringify({ variant_id: pos.variant_id, delta: n, notes }),
                                        })
                                        if (res.ok) router.refresh()
                                        else alert('Adjustment failed')
                                      }}
                                      className="rounded px-2.5 py-1 text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                      Adjust
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* ── Analytics Tab ───────────────────────────── */}
          <TabsContent value="analytics">
            {!analytics ? (
              <p className="text-gray-400 text-sm">Select a campaign to see analytics.</p>
            ) : (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-xs">Revenue</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-2xl font-extrabold tracking-tight" style={{ color: navy }}>
                        {fmt(analytics.totalRevenue)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-xs">Total Pre-Orders</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-2xl font-extrabold tracking-tight" style={{ color: navy }}>
                        {analytics.totalOrders}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-xs">Avg Order Value</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-2xl font-extrabold tracking-tight text-purple-700">
                        {fmt(analytics.averageOrderValue)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-xs">Conversion Rate</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-2xl font-extrabold tracking-tight text-green-600">
                        {analytics.conversionRate}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top products table */}
                {analytics.topProducts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Top Products</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">Orders</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                            <TableHead>MOQ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics.topProducts.map((p) => (
                            <TableRow key={p.productId}>
                              <TableCell className="font-medium">{p.productName}</TableCell>
                              <TableCell className="text-center">{p.orderCount}</TableCell>
                              <TableCell className="text-right">{fmt(p.revenue)}</TableCell>
                              <TableCell>
                                {p.moqMet
                                  ? <Badge className="bg-green-100 text-green-700 border-0">Met</Badge>
                                  : <Badge className="bg-amber-100 text-amber-700 border-0">Pending</Badge>}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
