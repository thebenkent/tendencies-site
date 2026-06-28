import { getSupabase } from '@/lib/core/database'
import type { MerchAutomation, MerchAutomationStep } from './types'

export async function findAutomationsByEvent(
  tenantId:      string,
  triggerEvent:  string,
  campaignId?:   string,
): Promise<MerchAutomation[]> {
  let q = getSupabase()
    .from('merch_automations')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('trigger_event', triggerEvent)
    .eq('active', true)

  // Include tenant-wide automations (no campaign) and campaign-specific ones
  if (campaignId) {
    q = q.or(`campaign_id.is.null,campaign_id.eq.${campaignId}`)
  } else {
    q = q.is('campaign_id', null)
  }

  const { data } = await q
  return (data ?? []) as MerchAutomation[]
}

export async function findStepsByAutomation(automationId: string): Promise<MerchAutomationStep[]> {
  const { data } = await getSupabase()
    .from('merch_automation_steps')
    .select('*')
    .eq('automation_id', automationId)
    .order('step_order')
  return (data ?? []) as MerchAutomationStep[]
}
