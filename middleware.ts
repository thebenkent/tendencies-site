import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function getAccessCode(slug: string): string | undefined {
  return process.env[`PORTAL_${slug.toUpperCase().replace(/-/g, '_')}_CODE`]
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Merch admin protection ────────────────────────────────
  const merchMatch = pathname.match(/^\/merch\/([^/]+)\/admin(\/.*)?$/)
  if (merchMatch) {
    const slug    = merchMatch[1]
    const subPath = merchMatch[2] ?? '/'

    // Login path is always public
    if (subPath === '/login' || subPath.startsWith('/login/')) {
      return NextResponse.next()
    }

    // Validate Supabase Auth session
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: No code between createServerClient and getUser()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL(`/merch/${slug}/admin/login`, request.url))
    }

    return supabaseResponse
  }

  // ── Portal (B2B catalog) protection ──────────────────────
  const match = pathname.match(/^\/portal\/([^/]+)(\/.*)?$/)
  if (!match) return NextResponse.next()

  const slug    = match[1]
  const subPath = match[2] ?? '/'

  if (subPath === '/login' || subPath.startsWith('/login/')) {
    return NextResponse.next()
  }

  const accessCode = getAccessCode(slug)
  if (!accessCode) return NextResponse.next()

  const cookie = request.cookies.get(`ptl_${slug}`)
  if (!cookie || cookie.value !== accessCode) {
    return NextResponse.redirect(new URL(`/portal/${slug}/login`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/portal/:path*', '/merch/:path*/admin/:path*'],
}
