-- ============================================================
-- 008 · Product Architecture — Relational Product Tables
-- Replaces the product_options JSONB blob with proper tables.
-- New tables: merch_product_personalisation, merch_size_charts,
--             merch_product_images
-- ============================================================

-- ── 1. Personalisation options ────────────────────────────────
-- Configures per-product custom text fields shown during checkout.
-- Examples: Player Name, Player Number, Initials, Department, Employee ID.

CREATE TABLE IF NOT EXISTS merch_product_personalisation (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id   uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  type                  text        NOT NULL DEFAULT 'text'
                                    CHECK (type IN ('text', 'number', 'select')),
  label                 text        NOT NULL,
  required              boolean     NOT NULL DEFAULT false,
  max_length            integer,
  uppercase_only        boolean     NOT NULL DEFAULT false,
  additional_price_cents integer    NOT NULL DEFAULT 0,
  placeholder           text,
  sort_order            integer     NOT NULL DEFAULT 0,
  active                boolean     NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_product_personalisation_product
  ON merch_product_personalisation (campaign_product_id, sort_order);

-- ── 2. Size charts ────────────────────────────────────────────
-- Stores measurement tables per fit (Men's, Women's, Youth, Unisex).
-- chart_json schema: { note?: string, headers: string[], rows: string[][] }
-- Optionally links to a hosted image or PDF for richer guides.

CREATE TABLE IF NOT EXISTS merch_size_charts (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id  uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  fit                  text        NOT NULL DEFAULT '',
  title                text        NOT NULL,
  chart_json           jsonb       NOT NULL DEFAULT '{}',
  image_url            text,
  pdf_url              text,
  sort_order           integer     NOT NULL DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_product_id, fit)
);

CREATE INDEX IF NOT EXISTS idx_merch_size_charts_product
  ON merch_size_charts (campaign_product_id, sort_order);

-- ── 3. Product images ─────────────────────────────────────────
-- Structured image table with explicit image_type.
-- Supplements merch_assets (which remains for legacy + non-image assets).
-- When rows exist here, the storefront prefers this over merch_assets images.

CREATE TABLE IF NOT EXISTS merch_product_images (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id  uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  url                  text        NOT NULL,
  image_type           text        NOT NULL DEFAULT 'front'
                                   CHECK (image_type IN ('front', 'back', 'side', 'detail', 'lifestyle')),
  alt_text             text,
  display_order        integer     NOT NULL DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_product_images_product
  ON merch_product_images (campaign_product_id, display_order);

-- ── 4. Clean up product_options JSONB if migration 007 was run
--       before it was revised to be schema-only.
ALTER TABLE merch_campaign_products
  DROP COLUMN IF EXISTS product_options;
