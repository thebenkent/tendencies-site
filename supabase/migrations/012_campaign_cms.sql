-- ── Phase 7B: Campaign CMS columns ───────────────────────────────────────
--
-- Adds per-campaign visibility flag and branding columns needed
-- for the Campaign CMS editor tabs.

-- Public/visibility flag on the campaign itself
ALTER TABLE merch_campaigns
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-- logo_url on per-campaign branding (tenant-level branding already has this)
ALTER TABLE merch_campaign_branding
  ADD COLUMN IF NOT EXISTS logo_url text;

-- Admin banner CRUD needs tenant_id for RLS and multi-tenant filtering
ALTER TABLE merch_campaign_banners
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES merch_tenants(id) ON DELETE CASCADE;

-- Back-fill tenant_id for existing rows from parent campaign
UPDATE merch_campaign_banners b
SET    tenant_id = c.tenant_id
FROM   merch_campaigns c
WHERE  b.campaign_id = c.id
AND    b.tenant_id IS NULL;

-- Make tenant_id NOT NULL after back-fill
ALTER TABLE merch_campaign_banners
  ALTER COLUMN tenant_id SET NOT NULL;

-- Same for campaign attributes
ALTER TABLE merch_campaign_attributes
  ADD COLUMN IF NOT EXISTS help_text text;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_merch_campaigns_tenant_updated
  ON merch_campaigns (tenant_id, updated_at DESC);
