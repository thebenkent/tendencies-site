-- ── Phase 9: Products CMS ────────────────────────────────────────────────────
--
-- Adds lifecycle management, merchandising, and SEO fields to the
-- existing merch_campaign_products table. Also introduces a dedicated
-- branding-methods table to replace the inline embroidery boolean.
--
-- Backward-compatible: all new columns have sensible defaults.
-- The storefront continues to function without changes.

-- ── Lifecycle & CMS columns ──────────────────────────────────────────────────

ALTER TABLE merch_campaign_products
  ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'draft'
    CHECK (lifecycle_status IN ('draft', 'review', 'published', 'archived', 'hidden', 'scheduled')),
  ADD COLUMN IF NOT EXISTS sku              text,
  ADD COLUMN IF NOT EXISTS cost_cents       integer CHECK (cost_cents >= 0),
  ADD COLUMN IF NOT EXISTS currency         text    NOT NULL DEFAULT 'NZD',
  ADD COLUMN IF NOT EXISTS supplier_sku     text,
  ADD COLUMN IF NOT EXISTS seo_title        text,
  ADD COLUMN IF NOT EXISTS seo_description  text,
  ADD COLUMN IF NOT EXISTS tags             text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS featured         boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publish_at       timestamptz,
  ADD COLUMN IF NOT EXISTS archive_at       timestamptz,
  ADD COLUMN IF NOT EXISTS published_at     timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at      timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at       timestamptz;

-- Back-fill updated_at for existing rows
UPDATE merch_campaign_products SET updated_at = created_at WHERE updated_at IS NULL;

-- Trigger: keep updated_at current on every update
CREATE OR REPLACE FUNCTION set_updated_at_campaign_products()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_campaign_products_updated_at ON merch_campaign_products;
CREATE TRIGGER trg_campaign_products_updated_at
  BEFORE UPDATE ON merch_campaign_products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_campaign_products();

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_merch_cp_tenant_status
  ON merch_campaign_products (tenant_id, lifecycle_status);

CREATE INDEX IF NOT EXISTS idx_merch_cp_tenant_updated
  ON merch_campaign_products (tenant_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_merch_cp_sku
  ON merch_campaign_products (tenant_id, sku)
  WHERE sku IS NOT NULL;

-- ── Product branding methods ───────────────────────────────────────────────────
--
-- Replaces the simplistic embroidery_available / embroidery_notes inline fields
-- with a structured table that supports multiple branding methods per product.
-- The legacy columns are retained for backward-compatibility.

CREATE TABLE IF NOT EXISTS merch_product_branding (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id   uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  method                text        NOT NULL
    CHECK (method IN ('screen_print','embroidery','pad_print','laser','uv','digital_transfer','sublimation','custom')),
  position              text,
  max_colours           integer     CHECK (max_colours > 0),
  artwork_notes         text,
  additional_cost_cents integer     NOT NULL DEFAULT 0 CHECK (additional_cost_cents >= 0),
  sort_order            integer     NOT NULL DEFAULT 0,
  active                boolean     NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_product_branding_product
  ON merch_product_branding (campaign_product_id)
  WHERE active = true;

-- RLS: match parent product's tenant isolation (tenant checked at query level)
ALTER TABLE merch_product_branding ENABLE ROW LEVEL SECURITY;
