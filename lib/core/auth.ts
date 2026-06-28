import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabase } from './database'
import type { MerchUserRole } from '@/lib/merch/types'

export async function createAuthClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: ()      => cookieStore.getAll(),
        setAll: (items) => {
          for (const { name, value, options } of items) {
            try { cookieStore.set(name, value, options) } catch { /* read-only in Server Components */ }
          }
        },
      },
    }
  )
}

export type AdminContext = {
  userId:   string
  tenantId: string
  role:     MerchUserRole
}

export async function getAdminContext(tenantSlug: string): Promise<AdminContext | null> {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: tenant } = await getSupabase()
    .from('merch_tenants')
    .select('id')
    .eq('slug', tenantSlug)
    .single()
  if (!tenant) return null
  const tenantId = (tenant as { id: string }).id

  const { data: userRow } = await getSupabase()
    .from('merch_users')
    .select('role')
    .eq('id', user.id)
    .eq('tenant_id', tenantId)
    .single()
  if (!userRow) return null

  return {
    userId:   user.id,
    tenantId,
    role:     (userRow as { role: string }).role as MerchUserRole,
  }
}

export function canWrite(role: MerchUserRole): boolean {
  return role !== 'viewer'
}
