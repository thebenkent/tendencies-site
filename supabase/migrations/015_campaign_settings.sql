-- Campaign messaging and logistics fields
-- These appear in the admin CMS and are surfaced on the storefront

ALTER TABLE merch_campaigns
  ADD COLUMN IF NOT EXISTS success_message  text,
  ADD COLUMN IF NOT EXISTS failure_message  text,
  ADD COLUMN IF NOT EXISTS delivery_info    text,
  ADD COLUMN IF NOT EXISTS pickup_info      text,
  ADD COLUMN IF NOT EXISTS club_contact     text;
