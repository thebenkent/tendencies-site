import { findTenantBranding, findCampaignBranding } from './repository'
import type { ResolvedBranding } from './types'

const DEFAULTS: ResolvedBranding = {
  primary_color:   '#0B1F4D',
  secondary_color: '#D71920',
  font_family:     'Inter, system-ui, sans-serif',
  button_style:    'rounded',
  border_radius:   '6px',
  hero_image:      null,
  hero_title:      null,
  hero_subtitle:   null,
  logo_url:        null,
  favicon_url:     null,
}

// Resolves effective branding for a campaign by merging:
// hardcoded defaults → tenant branding → campaign branding overrides
export async function resolveBranding(
  tenantId:   string,
  campaignId?: string,
): Promise<ResolvedBranding> {
  const [tenant, campaign] = await Promise.all([
    findTenantBranding(tenantId),
    campaignId ? findCampaignBranding(campaignId) : Promise.resolve(null),
  ])

  const fromTenant: Partial<ResolvedBranding> = tenant
    ? {
        primary_color:   tenant.primary_color,
        secondary_color: tenant.secondary_color,
        font_family:     tenant.font_family,
        button_style:    tenant.button_style,
        border_radius:   tenant.border_radius,
        hero_image:      tenant.hero_image,
        hero_title:      tenant.hero_title,
        hero_subtitle:   tenant.hero_subtitle,
        logo_url:        tenant.logo_url,
        favicon_url:     tenant.favicon_url,
      }
    : {}

  const fromCampaign: Partial<ResolvedBranding> = campaign
    ? {
        ...(campaign.primary_color   ? { primary_color:   campaign.primary_color   } : {}),
        ...(campaign.secondary_color ? { secondary_color: campaign.secondary_color } : {}),
        ...(campaign.hero_image      ? { hero_image:      campaign.hero_image      } : {}),
        ...(campaign.hero_title      ? { hero_title:      campaign.hero_title      } : {}),
        ...(campaign.hero_subtitle   ? { hero_subtitle:   campaign.hero_subtitle   } : {}),
      }
    : {}

  return { ...DEFAULTS, ...fromTenant, ...fromCampaign }
}
