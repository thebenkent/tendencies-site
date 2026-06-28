// Lightweight in-memory rate limiter.
// State is per serverless function instance (not shared across Vercel instances).
// Sufficient for MVP abuse prevention on low-traffic club stores.
// Upgrade to Upstash Redis rate limiter for high-traffic or multi-instance deployments.

type Record = { count: number; resetAt: number }

const store = new Map<string, Record>()

const WINDOW_MS = 10 * 60 * 1000  // 10-minute sliding window
const MAX_HITS  = 5                 // max submissions per IP per window

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const rec = store.get(ip)

  if (!rec || now > rec.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }

  if (rec.count >= MAX_HITS) {
    const retryAfter = Math.ceil((rec.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  rec.count++
  return { allowed: true, retryAfter: 0 }
}

export function getRateLimitIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}
