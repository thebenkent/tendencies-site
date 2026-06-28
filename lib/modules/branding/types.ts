export type { MerchBranding } from '@/lib/merch/types'

export type MerchCampaignBranding = {
  campaign_id:     string
  primary_color:   string | null
  secondary_color: string | null
  hero_image:      string | null
  hero_title:      string | null
  hero_subtitle:   string | null
  updated_at:      string
}

// Effective branding: campaign overrides merged onto tenant defaults
export type ResolvedBranding = {
  primary_color:   string
  secondary_color: string
  font_family:     string
  button_style:    string
  border_radius:   string
  hero_image:      string | null
  hero_title:      string | null
  hero_subtitle:   string | null
  logo_url:        string | null
  favicon_url:     string | null
}
