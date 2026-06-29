-- ============================================================
-- 010 · Architecture Refinement
-- ============================================================
-- Strengthens the platform for multi-tenant reuse across sports clubs,
-- schools, corporate uniform programs, and retail merchandise.
-- No customer-specific logic; all tables are tenant-scoped.
-- ============================================================

-- ── 1. Enhance Collections ────────────────────────────────────
-- Add visual asset, visibility flag, and audit timestamp.
-- Supports collection landing pages and featured collections.

ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS image_url   text,
  ADD COLUMN IF NOT EXISTS visible     boolean     NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();

-- Ensure the product FK is already present (added in 009 — idempotent here)
ALTER TABLE merch_campaign_products
  ADD COLUMN IF NOT EXISTS collection_id uuid REFERENCES merch_collections(id) ON DELETE SET NULL;

-- ── 2. Strengthen Bundle Architecture ────────────────────────
-- Replace flat discount_pct with a typed discount model.
-- Add collection_id to organise bundles within a collection.
-- required flag on bundle items: some are mandatory, some optional.

ALTER TABLE merch_bundles
  ADD COLUMN IF NOT EXISTS collection_id   uuid        REFERENCES merch_collections(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS discount_type   text        NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS discount_value  integer     NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'merch_bundles' AND constraint_name = 'merch_bundles_discount_type_check'
  ) THEN
    ALTER TABLE merch_bundles
      ADD CONSTRAINT merch_bundles_discount_type_check
      CHECK (discount_type IN ('none', 'percentage', 'fixed'));
  END IF;
END
$$;

-- Remove the coarse discount_pct column from 009 (superseded by discount_type + discount_value)
ALTER TABLE merch_bundles DROP COLUMN IF EXISTS discount_pct;

ALTER TABLE merch_bundle_items
  ADD COLUMN IF NOT EXISTS required boolean NOT NULL DEFAULT true;

-- ── 3. Campaign Attributes (renamed from Checkout Questions) ──
-- "Campaign Attributes" is the canonical internal term.
-- Configurable per-order fields: Team, Grade, Cost Centre, etc.
-- Supports any tenant type without hard-coded field names.

ALTER TABLE merch_checkout_questions RENAME TO merch_campaign_attributes;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_merch_checkout_questions_campaign') THEN
    ALTER INDEX idx_merch_checkout_questions_campaign
      RENAME TO idx_merch_campaign_attributes_campaign;
  END IF;
END
$$;

-- Rename stored answers column to match the renamed concept
ALTER TABLE merch_orders
  RENAME COLUMN question_answers TO attribute_values;

-- ── 4. Product Badges ─────────────────────────────────────────
-- Configurable badges per product: NEW, POPULAR, LIMITED, SALE, etc.
-- Time-bounded (starts_at / ends_at) for seasonal promotions.
-- badge_type controls the visual style via the design system.

CREATE TABLE IF NOT EXISTS merch_product_badges (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  tenant_id           uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  label               text        NOT NULL,
  badge_type          text        NOT NULL DEFAULT 'default'
                      CHECK (badge_type IN ('default', 'success', 'warning', 'danger', 'info', 'dark')),
  icon                text,       -- optional emoji or icon key
  active              boolean     NOT NULL DEFAULT true,
  sort_order          integer     NOT NULL DEFAULT 0,
  starts_at           timestamptz,  -- null = immediately active
  ends_at             timestamptz,  -- null = no expiry
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_product_badges_product
  ON merch_product_badges (campaign_product_id, sort_order)
  WHERE active = true;

-- ── 5. Related Products ───────────────────────────────────────
-- Supports: Related Products, Frequently Bought Together,
-- Complete the Look, Customers Also Purchased, Upsell.
-- Recommendation data is manually curated initially.

CREATE TABLE IF NOT EXISTS merch_product_related (
  id                 uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  source_product_id  uuid    NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  related_product_id uuid    NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  relation_type      text    NOT NULL DEFAULT 'related'
                     CHECK (relation_type IN (
                       'related', 'frequently_bought', 'complete_look',
                       'also_purchased', 'upsell'
                     )),
  sort_order         integer NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_product_id, related_product_id),
  CHECK (source_product_id != related_product_id)
);

CREATE INDEX IF NOT EXISTS idx_merch_product_related_source
  ON merch_product_related (source_product_id, relation_type, sort_order);

-- ── 6. Rich Product Content ───────────────────────────────────
-- Structured content sections replace the flat description field.
-- Each section has a type (text, list, table, html) and content JSONB.
-- Reusable across any merchandise type without hard-coding sections.
--
-- section:          canonical section key (or 'custom' for tenant-defined)
-- content_type:     how to render the content in the UI
-- content JSONB:
--   text  → { "body": "..." }
--   list  → { "items": ["..."] }
--   table → { "headers": ["..."], "rows": [[...]] }
--   html  → { "html": "..." }

CREATE TABLE IF NOT EXISTS merch_product_content (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  section             text        NOT NULL CHECK (section IN (
                        'highlights', 'features', 'fabric', 'materials',
                        'sizing_notes', 'care_instructions', 'branding_details',
                        'delivery', 'returns', 'custom'
                      )),
  title               text,         -- display title; null = use section default
  content_type        text        NOT NULL DEFAULT 'text'
                      CHECK (content_type IN ('text', 'list', 'table', 'html')),
  content             jsonb       NOT NULL DEFAULT '{}',
  sort_order          integer     NOT NULL DEFAULT 0,
  active              boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_product_content_product
  ON merch_product_content (campaign_product_id, sort_order)
  WHERE active = true;

-- ── 7. Campaign Banners ───────────────────────────────────────
-- Promotional banners displayed on the campaign storefront.
-- Supports: Order Closes Friday, Free Shipping, MOQ Reached, Sale Ends Sunday.
-- Multiple banners per campaign; ordered by sort_order.
-- Time-bounded to allow scheduled promotions.

CREATE TABLE IF NOT EXISTS merch_campaign_banners (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid        NOT NULL REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  tenant_id    uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  message      text        NOT NULL,
  link_url     text,         -- optional CTA link
  link_label   text,         -- optional CTA button label
  banner_type  text        NOT NULL DEFAULT 'info'
               CHECK (banner_type IN ('info', 'success', 'warning', 'urgent', 'neutral')),
  icon         text,         -- optional emoji or icon key
  active       boolean     NOT NULL DEFAULT true,
  starts_at    timestamptz,
  ends_at      timestamptz,
  sort_order   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_campaign_banners_campaign
  ON merch_campaign_banners (campaign_id, sort_order)
  WHERE active = true;
