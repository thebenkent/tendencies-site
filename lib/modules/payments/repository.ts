import { getSupabase } from '@/lib/core/database'
import type { MerchPayment, PaymentStatus } from '@/lib/merch/types'

export type CreatePaymentInput = {
  orderId:         string
  tenantId:        string
  customerId:      string
  amountCents:     number
  currency?:       string
  paymentLink?:    string
  stripeSessionId?: string
}

export async function createPayment(input: CreatePaymentInput): Promise<MerchPayment> {
  const { data, error } = await getSupabase()
    .from('merch_payments')
    .insert({
      order_id:          input.orderId,
      tenant_id:         input.tenantId,
      customer_id:       input.customerId,
      amount_cents:      input.amountCents,
      currency:          input.currency          ?? 'NZD',
      payment_link:      input.paymentLink        ?? null,
      stripe_session_id: input.stripeSessionId   ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(`createPayment failed: ${error.message}`)
  return data as MerchPayment
}

export async function findPaymentByOrderId(orderId: string): Promise<MerchPayment | null> {
  const { data } = await getSupabase()
    .from('merch_payments')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data as MerchPayment | null) ?? null
}

export async function findPaymentsByOrderIds(orderIds: string[]): Promise<MerchPayment[]> {
  if (!orderIds.length) return []
  const { data } = await getSupabase()
    .from('merch_payments')
    .select('*')
    .in('order_id', orderIds)
    .order('created_at', { ascending: false })
  return (data ?? []) as MerchPayment[]
}

export async function findPaymentByStripeSession(stripeSessionId: string): Promise<MerchPayment | null> {
  const { data } = await getSupabase()
    .from('merch_payments')
    .select('*')
    .eq('stripe_session_id', stripeSessionId)
    .maybeSingle()
  return (data as MerchPayment | null) ?? null
}

export async function updatePaymentStatus(
  paymentId: string,
  status:    PaymentStatus,
  paidAt?:   string,
): Promise<void> {
  await getSupabase()
    .from('merch_payments')
    .update({ status, paid_at: paidAt ?? null })
    .eq('id', paymentId)
}

export async function updatePaymentStripe(
  paymentId:             string,
  stripeSessionId:       string,
  stripePaymentIntentId?: string,
): Promise<void> {
  await getSupabase()
    .from('merch_payments')
    .update({
      stripe_session_id:        stripeSessionId,
      stripe_payment_intent_id: stripePaymentIntentId ?? null,
    })
    .eq('id', paymentId)
}
