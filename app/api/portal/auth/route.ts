import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SEVEN_DAYS = 60 * 60 * 24 * 7

function getAccessCode(slug: string): string | undefined {
  return process.env[`PORTAL_${slug.toUpperCase().replace(/-/g, '_')}_CODE`]
}

export async function POST(req: Request) {
  const { slug, code } = await req.json()

  if (!slug || !code) {
    return NextResponse.json({ error: 'Missing slug or code.' }, { status: 400 })
  }

  const validCode = getAccessCode(slug)

  if (!validCode) {
    return NextResponse.json({ error: 'Portal not found.' }, { status: 404 })
  }

  if (code !== validCode) {
    return NextResponse.json({ error: 'Incorrect access code.' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(`ptl_${slug}`, validCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SEVEN_DAYS,
    path: `/portal/${slug}`,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const { slug } = await req.json()
  const cookieStore = await cookies()
  cookieStore.delete(`ptl_${slug}`)
  return NextResponse.json({ ok: true })
}
