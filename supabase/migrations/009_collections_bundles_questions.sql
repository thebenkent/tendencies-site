-- ============================================================
-- 009 · Collections, Bundles, Checkout Questions
-- ============================================================

-- ── 1. Product Collections ────────────────────────────────────
-- Groups products within a campaign (e.g., Playing Uniform, Training, Supporter).

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

-- Assign products to a collection
ALTER TABLE merch_campaign_products
  ADD COLUMN IF NOT EXISTS collection_id uuid REFERENCES merch_collections(id) ON DELETE SET NULL;

-- ── 2. Bundle Architecture ────────────────────────────────────
-- Bundles group products with required quantities and optional discounts.
-- Examples: Starter Pack, Supporter Pack, Coach Pack.
-- Pricing logic is a future milestone; architecture ships now.

CREATE TABLE IF NOT EXISTS merch_bundles (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid        NOT NULL REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  tenant_id    uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  name         text        NOT NULL,
  slug         text        NOT NULL,
  description  text,
  image_url    text,
  -- null price = sum of component prices (auto-calculated at checkout)
  price_cents  integer,
  -- 0-100 percentage discount applied to the calculated sum
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

-- ── 3. Campaign Checkout Questions ────────────────────────────
-- Questions asked once per order (not per product line).
-- Applies to sports clubs, schools, corporate stores.
-- Examples: Team, Grade, Coach, Department, Cost Centre.

CREATE TABLE IF NOT EXISTS merch_checkout_questions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid        NOT NULL REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  tenant_id    uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  type         text        NOT NULL DEFAULT 'text'
               CHECK (type IN ('text', 'dropdown', 'checkbox', 'radio', 'date')),
  label        text        NOT NULL,
  placeholder  text,
  -- JSON array of option strings for dropdown/radio types
  options      jsonb       DEFAULT NULL,
  required     boolean     NOT NULL DEFAULT false,
  -- 'order' = once per checkout; 'line' = per product line (future)
  applies_to   text        NOT NULL DEFAULT 'order'
               CHECK (applies_to IN ('order', 'line')),
  sort_order   integer     NOT NULL DEFAULT 0,
  active       boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_checkout_questions_campaign
  ON merch_checkout_questions (campaign_id, sort_order);

-- ── 4. Store question answers on orders ───────────────────────
ALTER TABLE merch_orders
  ADD COLUMN IF NOT EXISTS question_answers jsonb NOT NULL DEFAULT '{}';
