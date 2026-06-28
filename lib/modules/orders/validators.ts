import { z } from 'zod/v4'
import {
  uuidSchema, emailSchema, slugSchema, paginationSchema,
} from '@/lib/core/validation'

export const placeOrderSchema = z.object({
  campaign_slug:    slugSchema,
  product_slug:     slugSchema,
  variant_id:       uuidSchema,
  first_name:       z.string().min(1, 'First name is required'),
  last_name:        z.string().min(1, 'Last name is required'),
  email:            emailSchema,
  phone:            z.string().min(6, 'Phone number is required'),
  team:             z.string().optional(),
  grade:            z.string().optional(),
  player_name:      z.string().optional(),
  qty:              z.number().int().min(1).max(20),
  delivery_method:  z.enum(['collect', 'courier']),
  delivery_address: z.string().optional(),
  understood_moq:   z.boolean().refine((v) => v === true, {
    message: 'You must acknowledge the MOQ condition',
  }),
  notes:            z.string().optional(),
}).check((ctx) => {
  if (ctx.value.delivery_method === 'courier' && !ctx.value.delivery_address?.trim()) {
    ctx.issues.push({
      code:    'custom',
      input:   ctx.value.delivery_address,
      path:    ['delivery_address'],
      message: 'Delivery address is required for courier orders',
    })
  }
})

export type PlaceOrderRequest = z.infer<typeof placeOrderSchema>

export const orderListParamsSchema = z.object({
  campaign: z.string().optional(),
  status:   z.string().optional(),
  search:   z.string().optional(),
  product_id: uuidSchema.optional(),
}).merge(paginationSchema.partial())
