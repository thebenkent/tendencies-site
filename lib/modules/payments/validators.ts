import { z } from 'zod/v4'
import { uuidSchema, centsSchema } from '@/lib/core/validation'

export const createPaymentLinkSchema = z.object({
  order_id: uuidSchema,
})

export const refundSchema = z.object({
  order_id:     uuidSchema,
  amount_cents: centsSchema.optional(),  // omit to refund full amount
  reason:       z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
})

export const transitionOrderSchema = z.object({
  order_id:       uuidSchema.optional(),
  reservation_id: uuidSchema.optional(),
  to_state:       z.string().min(1),
  status:         z.string().optional(),
}).refine((d) => d.order_id ?? d.reservation_id, {
  message: 'order_id or reservation_id is required',
})
