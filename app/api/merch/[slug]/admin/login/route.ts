import { NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/merch/auth'
import { getSupabase } from '@/lib/merch/supabase'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json().catch(() => null)
  const { email, password } = body ?? {}

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  // Validate tenant exists
  const { data: tenant } = await getSupabase()
    .from('merch_tenants')
    .select('id')
    .eq('slug', slug)
    .single()
  if (!tenant) return NextResponse.json({ error: 'Portal not found' }, { status: 404 })
  const tenantId = (tenant as { id: string }).id

  // Sign in with Supabase Auth — this sets the session cookies via @supabase/ssr
  const supabase = await createAuthClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  // Verify this user has access to the tenant
  const { data: userRow } = await getSupabase()
    .from('merch_users')
    .select('role')
    .eq('id', data.user.id)
    .eq('tenant_id', tenantId)
    .single()

  if (!userRow) {
    // Sign them out — they authenticated but have no access to this tenant
    await supabase.auth.signOut()
    return NextResponse.json({ error: 'You do not have access to this portal' }, { status: 403 })
  }

  return NextResponse.json({ ok: true, role: (userRow as { role: string }).role })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await params // consume
  const supabase = await createAuthClient()
  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
