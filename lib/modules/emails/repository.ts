import { getSupabase } from '@/lib/core/database'
import type { MerchEmailTemplate, EmailTemplateType } from './types'

export async function findEmailTemplate(
  type:     EmailTemplateType,
  tenantId?: string,
): Promise<MerchEmailTemplate | null> {
  // Prefer tenant-specific template; fall back to global (null tenant)
  if (tenantId) {
    const { data } = await getSupabase()
      .from('merch_email_templates')
      .select('*')
      .eq('type', type)
      .eq('tenant_id', tenantId)
      .eq('enabled', true)
      .maybeSingle()
    if (data) return data as MerchEmailTemplate
  }

  const { data } = await getSupabase()
    .from('merch_email_templates')
    .select('*')
    .eq('type', type)
    .is('tenant_id', null)
    .eq('enabled', true)
    .maybeSingle()
  return (data as MerchEmailTemplate | null) ?? null
}

export async function upsertEmailTemplate(
  type:     EmailTemplateType,
  tenantId: string | null,
  patch:    Pick<MerchEmailTemplate, 'subject' | 'body_html'> & Partial<Pick<MerchEmailTemplate, 'body_text' | 'variables' | 'enabled'>>,
): Promise<void> {
  await getSupabase()
    .from('merch_email_templates')
    .upsert({
      tenant_id: tenantId,
      type,
      ...patch,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'tenant_id,type' })
}
