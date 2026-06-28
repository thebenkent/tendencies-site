// Shared validation utilities using Zod.
// Import Zod schemas from here so API routes stay thin.

import { z } from 'zod/v4'

export { z }

// Common field schemas
export const uuidSchema   = z.string().uuid()
export const emailSchema  = z.email('Valid email required')
export const slugSchema   = z.string().min(1).regex(/^[a-z0-9-]+$/, 'Must be lowercase slug')
export const centsSchema  = z.number().int().min(0, 'Must be non-negative')
export const phoneSchema  = z.string().min(6, 'Phone number too short')

// Delivery
export const deliveryMethodSchema = z.enum(['collect', 'courier'])

// Pagination
export const paginationSchema = z.object({
  limit:  z.coerce.number().int().min(1).max(500).optional().default(100),
  offset: z.coerce.number().int().min(0).optional().default(0),
})

// Validates and throws a formatted error on failure.
// Use in API routes to keep validation one-liners.
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    throw Object.assign(new Error(`Validation failed: ${messages}`), { issues: result.error.issues, status: 422 })
  }
  return result.data
}
