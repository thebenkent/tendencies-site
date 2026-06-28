import { createClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createClient> | null = null

// Returns `any` intentionally — we don't generate Supabase database types.
// All queries are type-asserted in repositories against our own domain types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabase(): any {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }
  _client = createClient(url, key, { auth: { persistSession: false } })
  return _client
}
