import { getSupabase } from '@/lib/core/database'
import type { MerchCustomer } from '@/lib/merch/types'

export type UpsertCustomerInput = {
  tenantId:  string
  email:     string
  firstName: string
  lastName:  string
  phone:     string
  team?:     string
  grade?:    string
}

export async function upsertCustomer(input: UpsertCustomerInput): Promise<MerchCustomer> {
  const { tenantId, email, firstName, lastName, phone, team, grade } = input

  const { data, error } = await getSupabase()
    .from('merch_customers')
    .upsert(
      {
        tenant_id:  tenantId,
        email:      email.trim().toLowerCase(),
        first_name: firstName.trim(),
        last_name:  lastName.trim(),
        phone:      phone.trim(),
        team:       team  ?? null,
        grade:      grade ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'tenant_id,email', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) throw new Error(`upsertCustomer failed: ${error.message}`)
  return data as MerchCustomer
}

export type CustomerWithStats = MerchCustomer & {
  orderCount:  number
  lastOrderAt: string | null
  totalSpent:  number
}

export async function findCustomersWithStats(
  tenantId: string,
  opts: { search?: string; limit?: number } = {},
): Promise<CustomerWithStats[]> {
  // Load customers + their orders in one go
  let q = getSupabase()
    .from('merch_customers')
    .select(`
      *,
      merch_orders (
        id, status, created_at,
        merch_order_lines ( qty, unit_price_cents )
      )
    `)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 200)

  const { data } = await q
  let rows: any[] = data ?? []

  if (opts.search) {
    const s = opts.search.toLowerCase()
    rows = rows.filter((r) =>
      r.first_name.toLowerCase().includes(s) ||
      r.last_name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      (r.team?.toLowerCase().includes(s) ?? false)
    )
  }

  return rows.map((r) => {
    const EXCLUDED = ['cancelled', 'refunded']
    const activeOrders = (r.merch_orders ?? []).filter((o: any) => !EXCLUDED.includes(o.status))
    const totalSpent = activeOrders.reduce((sum: number, o: any) =>
      sum + (o.merch_order_lines ?? []).reduce((s: number, l: any) => s + l.qty * l.unit_price_cents, 0), 0)
    const dates = activeOrders.map((o: any) => o.created_at).sort().reverse()

    const { merch_orders: _orders, ...customer } = r
    return {
      ...customer,
      orderCount:  activeOrders.length,
      lastOrderAt: dates[0] ?? null,
      totalSpent,
    } as CustomerWithStats
  })
}
