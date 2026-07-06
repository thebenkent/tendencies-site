-- ============================================================
-- Te Atatū Netball Club — Schema Migrations + Product Setup
-- Run this in the Supabase SQL Editor (one paste, one Run).
-- Safe to re-run: all statements are idempotent.
-- ============================================================

-- ── 007: Fit dimension on variants ───────────────────────────
ALTER TABLE merch_product_variants
  ADD COLUMN IF NOT EXISTS fit text NOT NULL DEFAULT '';

ALTER TABLE merch_product_variants
  DROP CONSTRAINT IF EXISTS merch_product_variants_campaign_product_id_size_colour_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'merch_product_variants'
      AND constraint_name = 'merch_product_variants_campaign_product_id_fit_size_colour_key'
  ) THEN
    ALTER TABLE merch_product_variants
      ADD CONSTRAINT merch_product_variants_campaign_product_id_fit_size_colour_key
      UNIQUE (campaign_product_id, fit, size, colour);
  END IF;
END
$$;

-- ── 008: Personalisation, size charts, product images ────────
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

ALTER TABLE merch_campaign_products
  DROP COLUMN IF EXISTS product_options;

-- ── 009: Collections, bundles, checkout questions ────────────
CREATE TABLE IF NOT EXISTS merch_collections (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid        NOT NULL REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  tenant_id    uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  name         text        NOT NULL,
  slug         text        NOT NULL,
  description  text,
  sort_order   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_merch_collections_campaign
  ON merch_collections (campaign_id, sort_order);

ALTER TABLE merch_campaign_products
  ADD COLUMN IF NOT EXISTS collection_id uuid REFERENCES merch_collections(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS merch_bundles (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid        NOT NULL REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  tenant_id    uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  name         text        NOT NULL,
  slug         text        NOT NULL,
  description  text,
  image_url    text,
  price_cents  integer,
  discount_pct integer     NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  active       boolean     NOT NULL DEFAULT true,
  sort_order   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, slug)
);

CREATE TABLE IF NOT EXISTS merch_bundle_items (
  id                   uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id            uuid    NOT NULL REFERENCES merch_bundles(id) ON DELETE CASCADE,
  campaign_product_id  uuid    NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  required_qty         integer NOT NULL DEFAULT 1 CHECK (required_qty >= 1),
  sort_order           integer NOT NULL DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bundle_id, campaign_product_id)
);

CREATE INDEX IF NOT EXISTS idx_merch_bundle_items_bundle
  ON merch_bundle_items (bundle_id, sort_order);

CREATE TABLE IF NOT EXISTS merch_checkout_questions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid        NOT NULL REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  tenant_id    uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  type         text        NOT NULL DEFAULT 'text'
               CHECK (type IN ('text', 'dropdown', 'checkbox', 'radio', 'date')),
  label        text        NOT NULL,
  placeholder  text,
  options      jsonb       DEFAULT NULL,
  required     boolean     NOT NULL DEFAULT false,
  applies_to   text        NOT NULL DEFAULT 'order'
               CHECK (applies_to IN ('order', 'line')),
  sort_order   integer     NOT NULL DEFAULT 0,
  active       boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_checkout_questions_campaign
  ON merch_checkout_questions (campaign_id, sort_order);

ALTER TABLE merch_orders
  ADD COLUMN IF NOT EXISTS question_answers jsonb NOT NULL DEFAULT '{}';

-- ── 010: Architecture refinement ─────────────────────────────
ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS image_url   text,
  ADD COLUMN IF NOT EXISTS visible     boolean     NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();

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

ALTER TABLE merch_bundles DROP COLUMN IF EXISTS discount_pct;
ALTER TABLE merch_bundle_items
  ADD COLUMN IF NOT EXISTS required boolean NOT NULL DEFAULT true;

-- Rename checkout_questions → campaign_attributes (skip if already renamed)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'merch_checkout_questions') THEN
    ALTER TABLE merch_checkout_questions RENAME TO merch_campaign_attributes;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_merch_checkout_questions_campaign') THEN
    ALTER INDEX idx_merch_checkout_questions_campaign
      RENAME TO idx_merch_campaign_attributes_campaign;
  END IF;
END
$$;

-- Rename question_answers → attribute_values (skip if already renamed)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merch_orders' AND column_name = 'question_answers'
  ) THEN
    ALTER TABLE merch_orders RENAME COLUMN question_answers TO attribute_values;
  END IF;
END
$$;

ALTER TABLE merch_orders
  ADD COLUMN IF NOT EXISTS attribute_values jsonb NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS merch_product_badges (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  tenant_id           uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  label               text        NOT NULL,
  badge_type          text        NOT NULL DEFAULT 'default'
                      CHECK (badge_type IN ('default', 'success', 'warning', 'danger', 'info', 'dark')),
  icon                text,
  active              boolean     NOT NULL DEFAULT true,
  sort_order          integer     NOT NULL DEFAULT 0,
  starts_at           timestamptz,
  ends_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_product_badges_product
  ON merch_product_badges (campaign_product_id, sort_order)
  WHERE active = true;

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

CREATE TABLE IF NOT EXISTS merch_product_content (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  section             text        NOT NULL CHECK (section IN (
                        'highlights', 'features', 'fabric', 'materials',
                        'sizing_notes', 'care_instructions', 'branding_details',
                        'delivery', 'returns', 'custom'
                      )),
  title               text,
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

CREATE TABLE IF NOT EXISTS merch_campaign_banners (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid        NOT NULL REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  tenant_id    uuid        REFERENCES merch_tenants(id) ON DELETE CASCADE,
  message      text        NOT NULL,
  link_url     text,
  link_label   text,
  banner_type  text        NOT NULL DEFAULT 'info'
               CHECK (banner_type IN ('info', 'success', 'warning', 'urgent', 'neutral')),
  icon         text,
  active       boolean     NOT NULL DEFAULT true,
  starts_at    timestamptz,
  ends_at      timestamptz,
  sort_order   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_campaign_banners_campaign
  ON merch_campaign_banners (campaign_id, sort_order)
  WHERE active = true;

-- ── 011: Activity log ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merch_activity_log (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  user_id      uuid,
  entity_type  text        NOT NULL,
  entity_id    text        NOT NULL,
  entity_label text,
  action       text        NOT NULL,
  before_json  jsonb,
  after_json   jsonb,
  changed_keys text[],
  metadata     jsonb,
  ip_address   text,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_activity_log_tenant
  ON merch_activity_log (tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_merch_activity_log_entity
  ON merch_activity_log (entity_type, entity_id, created_at DESC);

-- ── 012: Campaign CMS columns ─────────────────────────────────
ALTER TABLE merch_campaigns
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

ALTER TABLE merch_campaign_branding
  ADD COLUMN IF NOT EXISTS logo_url text;

ALTER TABLE merch_campaign_attributes
  ADD COLUMN IF NOT EXISTS help_text text;

-- ── 013: Collections CMS ──────────────────────────────────────
ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS thumbnail_url    text,
  ADD COLUMN IF NOT EXISTS seo_title        text,
  ADD COLUMN IF NOT EXISTS seo_description  text,
  ADD COLUMN IF NOT EXISTS tags             text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS featured         boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publish_at       timestamptz,
  ADD COLUMN IF NOT EXISTS archive_at       timestamptz,
  ADD COLUMN IF NOT EXISTS published_at     timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at      timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'merch_collections' AND constraint_name = 'merch_collections_lifecycle_status_check'
  ) THEN
    ALTER TABLE merch_collections
      ADD CONSTRAINT merch_collections_lifecycle_status_check
      CHECK (lifecycle_status IN ('draft', 'review', 'published', 'archived', 'hidden', 'scheduled'));
  END IF;
END
$$;

-- ── 014: Products CMS columns ─────────────────────────────────
ALTER TABLE merch_campaign_products
  ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'draft',
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'merch_campaign_products' AND constraint_name = 'merch_campaign_products_lifecycle_status_check'
  ) THEN
    ALTER TABLE merch_campaign_products
      ADD CONSTRAINT merch_campaign_products_lifecycle_status_check
      CHECK (lifecycle_status IN ('draft', 'review', 'published', 'archived', 'hidden', 'scheduled'));
  END IF;
END
$$;

UPDATE merch_campaign_products SET updated_at = created_at WHERE updated_at IS NULL;

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

CREATE INDEX IF NOT EXISTS idx_merch_cp_tenant_status
  ON merch_campaign_products (tenant_id, lifecycle_status);

CREATE INDEX IF NOT EXISTS idx_merch_cp_sku
  ON merch_campaign_products (tenant_id, sku)
  WHERE sku IS NOT NULL;

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

-- ── 015: Campaign settings (messaging + logistics) ────────────
ALTER TABLE merch_campaigns
  ADD COLUMN IF NOT EXISTS success_message  text,
  ADD COLUMN IF NOT EXISTS failure_message  text,
  ADD COLUMN IF NOT EXISTS delivery_info    text,
  ADD COLUMN IF NOT EXISTS pickup_info      text,
  ADD COLUMN IF NOT EXISTS club_contact     text;

-- ── merch_collection_products: add featured column (table exists from migration 001) ──
ALTER TABLE merch_collection_products
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- ── Enable RLS on all new tables ─────────────────────────────
ALTER TABLE merch_bundles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_bundle_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_campaign_attributes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_product_badges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_product_related      ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_product_content      ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_campaign_banners     ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_activity_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_product_branding     ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "bundles_public_read"      ON merch_bundles              FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "bundle_items_public_read" ON merch_bundle_items         FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "attributes_public_read"   ON merch_campaign_attributes  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "badges_public_read"       ON merch_product_badges       FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "related_public_read"      ON merch_product_related      FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "content_public_read"      ON merch_product_content      FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "banners_public_read"      ON merch_campaign_banners     FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "branding_public_read"     ON merch_product_branding     FOR SELECT USING (true);

-- ── Te Atatū Product Setup ────────────────────────────────────
-- Safe to re-run: uses DO blocks to check before inserting.
-- Tenant: te-atatu  (368e9fa2-a7f2-445c-a502-c8b448d0350d)
-- Campaign: 2026-season  (aa702f86-23fb-4ab9-b1dd-d94017775049)

DO $$
DECLARE
  v_tenant_id      uuid := '368e9fa2-a7f2-445c-a502-c8b448d0350d';
  v_campaign_id    uuid := 'aa702f86-23fb-4ab9-b1dd-d94017775049';
  v_hoodie_id      uuid := 'a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf';
  v_tee_id         uuid;
  v_tee_master_id  uuid;
BEGIN

  -- ── Fix hoodie price to $60 ──────────────────────────────────
  UPDATE merch_campaign_products
  SET    price_cents       = 6000,
         minimum_qty       = 10,
         lead_time_days    = 21,
         lifecycle_status  = 'published',
         active            = true
  WHERE  id = v_hoodie_id;

  -- ── Create Club Tee (if it doesn't exist) ───────────────────
  SELECT id INTO v_tee_id
  FROM   merch_campaign_products
  WHERE  campaign_id = v_campaign_id AND slug = 'tee';

  IF v_tee_id IS NULL THEN
    -- Create a master product record first (required by FK)
    INSERT INTO merch_master_products (name, description)
    VALUES ('Club Tee', 'Lightweight club tee with custom heat-transfer print.')
    RETURNING id INTO v_tee_master_id;

    INSERT INTO merch_campaign_products (
      id, campaign_id, master_product_id, tenant_id, slug, name, description,
      price_cents, minimum_qty, lead_time_days,
      lifecycle_status, active, sort_order, currency
    ) VALUES (
      gen_random_uuid(), v_campaign_id, v_tee_master_id, v_tenant_id,
      'tee', 'Club Tee',
      'Lightweight club tee with custom heat-transfer print. Available in Youth, Women''s, and Men''s fits.',
      4200, 10, 21,
      'published', true, 2, 'NZD'
    )
    RETURNING id INTO v_tee_id;
  ELSE
    UPDATE merch_campaign_products
    SET    price_cents       = 4200,
           minimum_qty       = 10,
           lead_time_days    = 21,
           lifecycle_status  = 'published',
           active            = true
    WHERE  id = v_tee_id;
  END IF;

  -- ── Images: Hoodie ───────────────────────────────────────────
  DELETE FROM merch_product_images WHERE campaign_product_id = v_hoodie_id;
  INSERT INTO merch_product_images (campaign_product_id, url, image_type, alt_text, display_order)
  VALUES
    (v_hoodie_id, '/tanc-hoodie-front.jpg',      'front',  'Club Hoodie — front', 0),
    (v_hoodie_id, '/tanc-hoodie-back.jpg',        'back',   'Club Hoodie — back',  1),
    (v_hoodie_id, '/tanc-hoodie-size-chart.png',  'detail', 'Hoodie size chart',   2);

  -- ── Images: Tee ──────────────────────────────────────────────
  DELETE FROM merch_product_images WHERE campaign_product_id = v_tee_id;
  INSERT INTO merch_product_images (campaign_product_id, url, image_type, alt_text, display_order)
  VALUES
    (v_tee_id, '/tanc-tee-front.jpg',      'front',  'Club Tee — front', 0),
    (v_tee_id, '/tanc-tee-back.jpg',        'back',   'Club Tee — back',  1),
    (v_tee_id, '/tanc-tee-size-chart.png',  'detail', 'Tee size chart',   2);

  -- ── Size charts ───────────────────────────────────────────────
  DELETE FROM merch_size_charts WHERE campaign_product_id IN (v_hoodie_id, v_tee_id);

  INSERT INTO merch_size_charts (campaign_product_id, fit, title, chart_json, image_url, sort_order)
  VALUES
    (v_hoodie_id, 'Youth',   'Youth Sizes',    '{}', '/tanc-hoodie-size-chart.png', 0),
    (v_hoodie_id, 'Womens',  'Women''s Sizes', '{}', '/tanc-hoodie-size-chart.png', 1),
    (v_hoodie_id, 'Mens',    'Men''s Sizes',   '{}', '/tanc-hoodie-size-chart.png', 2),
    (v_tee_id,    'Youth',   'Youth Sizes',    '{}', '/tanc-tee-size-chart.png',    0),
    (v_tee_id,    'Womens',  'Women''s Sizes', '{}', '/tanc-tee-size-chart.png',    1),
    (v_tee_id,    'Mens',    'Men''s Sizes',   '{}', '/tanc-tee-size-chart.png',    2);

  -- ── Personalisation: Player Name ──────────────────────────────
  DELETE FROM merch_product_personalisation WHERE campaign_product_id IN (v_hoodie_id, v_tee_id);
  INSERT INTO merch_product_personalisation (
    campaign_product_id, type, label, required, max_length,
    uppercase_only, additional_price_cents, placeholder, sort_order, active
  )
  VALUES
    (v_hoodie_id, 'text', 'Player Name', false, 20, true, 0, 'e.g. WILLIAMS', 0, true),
    (v_tee_id,    'text', 'Player Name', false, 20, true, 0, 'e.g. WILLIAMS', 0, true);

  -- ── Variants: Hoodie ─────────────────────────────────────────
  DELETE FROM merch_product_variants WHERE campaign_product_id = v_hoodie_id;
  INSERT INTO merch_product_variants
    (campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
  VALUES
    -- Youth
    (v_hoodie_id, 'Youth', '6',   'Navy', 0, true, 1),
    (v_hoodie_id, 'Youth', '8',   'Navy', 0, true, 2),
    (v_hoodie_id, 'Youth', '10',  'Navy', 0, true, 3),
    (v_hoodie_id, 'Youth', '12',  'Navy', 0, true, 4),
    (v_hoodie_id, 'Youth', '14',  'Navy', 0, true, 5),
    -- Womens
    (v_hoodie_id, 'Womens', '6',  'Navy', 0, true, 10),
    (v_hoodie_id, 'Womens', '8',  'Navy', 0, true, 11),
    (v_hoodie_id, 'Womens', '10', 'Navy', 0, true, 12),
    (v_hoodie_id, 'Womens', '12', 'Navy', 0, true, 13),
    (v_hoodie_id, 'Womens', '14', 'Navy', 0, true, 14),
    (v_hoodie_id, 'Womens', '16', 'Navy', 0, true, 15),
    (v_hoodie_id, 'Womens', '18', 'Navy', 0, true, 16),
    (v_hoodie_id, 'Womens', '20', 'Navy', 0, true, 17),
    (v_hoodie_id, 'Womens', '22', 'Navy', 0, true, 18),
    (v_hoodie_id, 'Womens', '24', 'Navy', 0, true, 19),
    -- Mens
    (v_hoodie_id, 'Mens', 'XS',  'Navy', 0, true, 20),
    (v_hoodie_id, 'Mens', 'S',   'Navy', 0, true, 21),
    (v_hoodie_id, 'Mens', 'M',   'Navy', 0, true, 22),
    (v_hoodie_id, 'Mens', 'L',   'Navy', 0, true, 23),
    (v_hoodie_id, 'Mens', 'XL',  'Navy', 0, true, 24),
    (v_hoodie_id, 'Mens', '2XL', 'Navy', 0, true, 25),
    (v_hoodie_id, 'Mens', '3XL', 'Navy', 0, true, 26),
    (v_hoodie_id, 'Mens', '5XL', 'Navy', 0, true, 27);

  -- ── Variants: Tee ────────────────────────────────────────────
  DELETE FROM merch_product_variants WHERE campaign_product_id = v_tee_id;
  INSERT INTO merch_product_variants
    (campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
  VALUES
    -- Youth
    (v_tee_id, 'Youth', '6',   'Navy', 0, true, 1),
    (v_tee_id, 'Youth', '8',   'Navy', 0, true, 2),
    (v_tee_id, 'Youth', '10',  'Navy', 0, true, 3),
    (v_tee_id, 'Youth', '12',  'Navy', 0, true, 4),
    (v_tee_id, 'Youth', '14',  'Navy', 0, true, 5),
    -- Womens
    (v_tee_id, 'Womens', '6',  'Navy', 0, true, 10),
    (v_tee_id, 'Womens', '8',  'Navy', 0, true, 11),
    (v_tee_id, 'Womens', '10', 'Navy', 0, true, 12),
    (v_tee_id, 'Womens', '12', 'Navy', 0, true, 13),
    (v_tee_id, 'Womens', '14', 'Navy', 0, true, 14),
    (v_tee_id, 'Womens', '16', 'Navy', 0, true, 15),
    (v_tee_id, 'Womens', '18', 'Navy', 0, true, 16),
    (v_tee_id, 'Womens', '20', 'Navy', 0, true, 17),
    (v_tee_id, 'Womens', '22', 'Navy', 0, true, 18),
    (v_tee_id, 'Womens', '24', 'Navy', 0, true, 19),
    -- Mens
    (v_tee_id, 'Mens', 'XS',  'Navy', 0, true, 20),
    (v_tee_id, 'Mens', 'S',   'Navy', 0, true, 21),
    (v_tee_id, 'Mens', 'M',   'Navy', 0, true, 22),
    (v_tee_id, 'Mens', 'L',   'Navy', 0, true, 23),
    (v_tee_id, 'Mens', 'XL',  'Navy', 0, true, 24),
    (v_tee_id, 'Mens', '2XL', 'Navy', 0, true, 25),
    (v_tee_id, 'Mens', '3XL', 'Navy', 0, true, 26),
    (v_tee_id, 'Mens', '5XL', 'Navy', 0, true, 27);

END $$;
