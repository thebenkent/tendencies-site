import { NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/core/auth'
import { getTenant } from '@/lib/merch/db'
import type { MerchUserRole } from '@/lib/merch/types'

export type RouteContext = {
  slug:     string
  tenantId: string
  userId:   string
  role:     MerchUserRole
}

type Handler = (req: Request, ctx: RouteContext) => Promise<NextResponse>

/**
 * Authenticated admin route handler.
 * Validates Supabase Auth session and resolves tenant, then calls handler.
 */
export function adminRoute(handler: Handler) {
  return async function (
    req: Request,
    { params }: { params: Promise<{ slug: string }> },
  ): Promise<NextResponse> {
    try {
      const { slug } = await params

      const auth = await getAdminContext(slug)
      if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const tenant = await getTenant(slug).catch(() => null)
      if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
      }

      const ctx: RouteContext = {
        slug,
        tenantId: tenant.id,
        userId:   auth.userId,
        role:     auth.role,
      }

      return await handler(req, ctx)
    } catch (err) {
      console.error('[adminRoute]', err)
      const message = err instanceof Error ? err.message : 'Internal server error'
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
}

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

export function err(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status })
}
