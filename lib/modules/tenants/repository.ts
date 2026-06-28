import { getSupabase } from '@/lib/core/database'
import type { MerchTenant } from '@/lib/merch/types'

export async function findTenantBySlug(slug: string): Promise<MerchTenant | null> {
  const { data, error } = await getSupabase()
    .from('merch_tenants')
    .select(`
      *,
      merch_branding (
        logo_url, favicon_url, primary_color, secondary_color,
        font_family, button_style, border_radius,
        hero_image, hero_title, hero_subtitle
      )
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null

  const b = data.merch_branding ?? {}
  return {
    id:              data.id,
    slug:            data.slug,
    name:            data.name,
    contact_email:   data.contact_email ?? null,
    contact_phone:   data.contact_phone ?? null,
    active:          data.active,
    created_at:      data.created_at,
    logo_url:        b.logo_url        ?? null,
    favicon_url:     b.favicon_url     ?? null,
    primary_color:   b.primary_color   ?? '#0B1F4D',
    secondary_color: b.secondary_color ?? '#D71920',
    font_family:     b.font_family     ?? 'Inter, system-ui, sans-serif',
    button_style:    b.button_style    ?? 'rounded',
    border_radius:   b.border_radius   ?? '6px',
    hero_image:      b.hero_image      ?? null,
    hero_title:      b.hero_title      ?? null,
    hero_subtitle:   b.hero_subtitle   ?? null,
  }
}
