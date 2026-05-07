import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getAccessCode(slug: string): string | undefined {
  return process.env[`PORTAL_${slug.toUpperCase().replace(/-/g, '_')}_CODE`]
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const match = pathname.match(/^\/portal\/([^/]+)(\/.*)?$/)
  if (!match) return NextResponse.next()

  const slug = match[1]
  const subPath = match[2] ?? '/'

  // Always allow the login page through
  if (subPath === '/login' || subPath.startsWith('/login/')) {
    return NextResponse.next()
  }

  const accessCode = getAccessCode(slug)
  if (!accessCode) {
    // Portal not configured — let the page handle the 404
    return NextResponse.next()
  }

  const cookie = request.cookies.get(`ptl_${slug}`)

  if (!cookie || cookie.value !== accessCode) {
    const loginUrl = new URL(`/portal/${slug}/login`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/portal/:path*'],
}
