-- ============================================================
-- TENDENCIES COMMERCE PLATFORM — v4 SCHEMA
-- Multi-tenant · Campaign-centric · Configurable workflows
-- ============================================================
-- No production data exists — clean install.
-- ============================================================

-- ── Tenants ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merch_tenants (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        UNIQUE NOT NULL,
  name          text        NOT NULL,
  contact_email text,
  contact_phone text,
  active        boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── Branding ─────────────────────────────────────────────────
-- One row per tenant. Campaigns may override via merch_campaign_branding.
CREATE TABLE IF NOT EXISTS merch_branding (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid        UNIQUE NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  logo_url        text,
  favicon_url     text,
  primary_color   text        NOT NULL DEFAULT '#0B1F4D',
  secondary_color text        NOT NULL DEFAULT '#D71920',
  font_family     text        NOT NULL DEFAULT 'Inter, system-ui, sans-serif',
  button_style    text        NOT NULL DEFAULT 'rounded' CHECK (button_style IN ('rounded','pill','square')),
  border_radius   text        NOT NULL DEFAULT '6px',
  hero_image      text,
  hero_title      text,
  hero_subtitle   text,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Settings ─────────────────────────────────────────────────
-- Flexible per-tenant configuration.
CREATE TABLE IF NOT EXISTS merch_settings (
  tenant_id   uuid        PRIMARY KEY REFERENCES merch_tenants(id) ON DELETE CASCADE,
  settings    jsonb       NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Users ────────────────────────────────────────────────────
-- Extends Supabase Auth. One row per user per tenant.
CREATE TABLE IF NOT EXISTS merch_users (
  id          uuid   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id   uuid   NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  role        text   NOT NULL DEFAULT 'admin'
                     CHECK (role IN ('owner','admin','production','finance','viewer')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, tenant_id)
);

-- ── Locations ────────────────────────────────────────────────
-- Collection points, showrooms, or retail locations per tenant.
CREATE TABLE IF NOT EXISTS merch_locations (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  address    text,
  phone      text,
  active     boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Campaigns ────────────────────────────────────────────────
-- Primary operating object.
-- campaign_type drives the order workflow and checkout logic.
CREATE TABLE IF NOT EXISTS merch_campaigns (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  slug          text        NOT NULL,
  name          text        NOT NULL,
  description   text,
  campaign_type text        NOT NULL DEFAULT 'reservation'
                            CHECK (campaign_type IN (
                              'reservation','pre_order','retail',
                              'uniform','corporate','event','gift_redemption'
                            )),
  opens_at      timestamptz,
  closes_at     timestamptz,
  status        text        NOT NULL DEFAULT 'draft'
                            CHECK (status IN (
                              'draft','open','closing_soon','closed',
                              'payment_requested','production','completed','archived'
                            )),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

-- ── Per-Campaign Branding Override ───────────────────────────
CREATE TABLE IF NOT EXISTS merch_campaign_branding (
  campaign_id     uuid        PRIMARY KEY REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  primary_color   text,
  secondary_color text,
  hero_image      text,
  hero_title      text,
  hero_subtitle   text,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Workflow States ──────────────────────────────────────────
-- Metadata per campaign_type state. Transition logic lives in services/orders.ts.
CREATE TABLE IF NOT EXISTS merch_workflow_states (
  campaign_type text    NOT NULL,
  state         text    NOT NULL,
  label         text    NOT NULL,
  color         text    NOT NULL DEFAULT '#6B7280',
  sort_order    integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  is_terminal   boolean NOT NULL DEFAULT false,
  PRIMARY KEY (campaign_type, state)
);

-- ── Master Products ──────────────────────────────────────────
-- Reusable global catalog, not scoped to any tenant or campaign.
CREATE TABLE IF NOT EXISTS merch_master_products (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  description  text,
  material     text,
  weight_grams integer,
  base_sku     text,
  features     text[],
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Campaign Products ────────────────────────────────────────
-- Join between campaign and master product with campaign-specific config.
CREATE TABLE IF NOT EXISTS merch_campaign_products (
  id                   uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id          uuid    NOT NULL REFERENCES merch_campaigns(id)       ON DELETE CASCADE,
  master_product_id    uuid    NOT NULL REFERENCES merch_master_products(id) ON DELETE RESTRICT,
  tenant_id            uuid    NOT NULL REFERENCES merch_tenants(id)         ON DELETE CASCADE,
  slug                 text    NOT NULL,
  name                 text    NOT NULL,
  description          text,
  price_cents          integer NOT NULL CHECK (price_cents >= 0),
  minimum_qty          integer NOT NULL DEFAULT 10 CHECK (minimum_qty > 0),
  lead_time_days       integer NOT NULL DEFAULT 21,
  sizing_notes         text,
  embroidery_available boolean NOT NULL DEFAULT false,
  embroidery_notes     text,
  sort_order           integer NOT NULL DEFAULT 0,
  active               boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, slug)
);

-- ── Pricing ──────────────────────────────────────────────────
-- Extends campaign product: multi-currency, time-bound, sale prices.
CREATE TABLE IF NOT EXISTS merch_pricing (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id uuid        NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  currency            text        NOT NULL DEFAULT 'NZD',
  price_cents         integer     NOT NULL CHECK (price_cents >= 0),
  sale_price_cents    integer                CHECK (sale_price_cents >= 0),
  effective_from      timestamptz,
  effective_to        timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── Collections ──────────────────────────────────────────────
-- Product groupings within a campaign (e.g. "Tops", "Accessories").
CREATE TABLE IF NOT EXISTS merch_collections (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid        NOT NULL REFERENCES merch_campaigns(id) ON DELETE CASCADE,
  tenant_id   uuid        NOT NULL REFERENCES merch_tenants(id)   ON DELETE CASCADE,
  name        text        NOT NULL,
  slug        text        NOT NULL,
  description text,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, slug)
);

CREATE TABLE IF NOT EXISTS merch_collection_products (
  collection_id       uuid    NOT NULL REFERENCES merch_collections(id)       ON DELETE CASCADE,
  campaign_product_id uuid    NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  sort_order          integer NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, campaign_product_id)
);

-- ── Product Variants ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merch_product_variants (
  id                    uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_product_id   uuid    NOT NULL REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  sku                   text,
  size                  text    NOT NULL,
  colour                text    NOT NULL DEFAULT '',
  barcode               text,
  additional_cost_cents integer NOT NULL DEFAULT 0,
  available             boolean NOT NULL DEFAULT true,
  sort_order            integer NOT NULL DEFAULT 0,
  weight_grams          integer,
  stock_qty             integer,
  created_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign_product_id, size, colour)
);

-- ── Assets ───────────────────────────────────────────────────
-- Polymorphic — any entity can own unlimited assets.
CREATE TABLE IF NOT EXISTS merch_assets (
  id                  uuid   PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid   REFERENCES merch_tenants(id)           ON DELETE CASCADE,
  master_product_id   uuid   REFERENCES merch_master_products(id)   ON DELETE CASCADE,
  campaign_product_id uuid   REFERENCES merch_campaign_products(id) ON DELETE CASCADE,
  variant_id          uuid   REFERENCES merch_product_variants(id)  ON DELETE CASCADE,
  type                text   NOT NULL DEFAULT 'image'
                             CHECK (type IN ('image','video','pdf','size_chart','embroidery_guide','lifestyle','mockup')),
  url                 text   NOT NULL,
  alt_text            text,
  sort_order          integer NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── Customers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merch_customers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  email      text        NOT NULL,
  first_name text        NOT NULL,
  last_name  text        NOT NULL,
  phone      text        NOT NULL,
  team       text,
  grade      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, email)
);

-- ── Orders ───────────────────────────────────────────────────
-- Replaces merch_reservations. Line items in merch_order_lines.
-- status is a workflow state from merch_workflow_states.
CREATE TABLE IF NOT EXISTS merch_orders (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      uuid        NOT NULL REFERENCES merch_campaigns(id)  ON DELETE CASCADE,
  tenant_id        uuid        NOT NULL REFERENCES merch_tenants(id)    ON DELETE CASCADE,
  customer_id      uuid        NOT NULL REFERENCES merch_customers(id)  ON DELETE CASCADE,
  location_id      uuid                 REFERENCES merch_locations(id)  ON DELETE SET NULL,
  order_number     text,
  status           text        NOT NULL DEFAULT 'reserved',
  delivery_method  text        NOT NULL DEFAULT 'collect'
                               CHECK (delivery_method IN ('collect','courier')),
  delivery_address text,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Order Lines ──────────────────────────────────────────────
-- One row per product/variant. Supports multi-product orders.
-- unit_price_cents snapshots the price at order time.
CREATE TABLE IF NOT EXISTS merch_order_lines (
  id                  uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid    NOT NULL REFERENCES merch_orders(id)             ON DELETE CASCADE,
  campaign_product_id uuid    NOT NULL REFERENCES merch_campaign_products(id)  ON DELETE CASCADE,
  variant_id          uuid    NOT NULL REFERENCES merch_product_variants(id)   ON DELETE CASCADE,
  player_name         text,
  qty                 integer NOT NULL DEFAULT 1 CHECK (qty > 0),
  unit_price_cents    integer NOT NULL CHECK (unit_price_cents >= 0),
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── Order Events ─────────────────────────────────────────────
-- Immutable audit log.
CREATE TABLE IF NOT EXISTS merch_order_events (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   uuid        NOT NULL REFERENCES merch_orders(id)   ON DELETE CASCADE,
  tenant_id  uuid        NOT NULL REFERENCES merch_tenants(id)  ON DELETE CASCADE,
  event_type text        NOT NULL,
  actor      text        NOT NULL DEFAULT 'system',
  metadata   jsonb       NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Payments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merch_payments (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                 uuid        NOT NULL REFERENCES merch_orders(id)    ON DELETE CASCADE,
  tenant_id                uuid        NOT NULL REFERENCES merch_tenants(id)   ON DELETE CASCADE,
  customer_id              uuid        NOT NULL REFERENCES merch_customers(id) ON DELETE CASCADE,
  amount_cents             integer     NOT NULL CHECK (amount_cents >= 0),
  currency                 text        NOT NULL DEFAULT 'NZD',
  payment_link             text,
  stripe_payment_intent_id text,
  stripe_session_id        text,
  status                   text        NOT NULL DEFAULT 'pending'
                                       CHECK (status IN ('pending','succeeded','failed','refunded')),
  paid_at                  timestamptz,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- ── Email Templates ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merch_email_templates (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid        REFERENCES merch_tenants(id) ON DELETE CASCADE,
  type       text        NOT NULL,
  subject    text        NOT NULL,
  body_html  text        NOT NULL,
  body_text  text,
  variables  jsonb       NOT NULL DEFAULT '{}',
  enabled    boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, type)
);

-- ── updated_at triggers ──────────────────────────────────────
CREATE OR REPLACE FUNCTION merch_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DO $$ BEGIN
  CREATE TRIGGER merch_branding_updated_at          BEFORE UPDATE ON merch_branding          FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
  CREATE TRIGGER merch_settings_updated_at          BEFORE UPDATE ON merch_settings          FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
  CREATE TRIGGER merch_campaigns_updated_at         BEFORE UPDATE ON merch_campaigns         FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
  CREATE TRIGGER merch_campaign_branding_updated_at BEFORE UPDATE ON merch_campaign_branding FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
  CREATE TRIGGER merch_master_products_updated_at   BEFORE UPDATE ON merch_master_products   FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
  CREATE TRIGGER merch_customers_updated_at         BEFORE UPDATE ON merch_customers         FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
  CREATE TRIGGER merch_orders_updated_at            BEFORE UPDATE ON merch_orders            FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
  CREATE TRIGGER merch_payments_updated_at          BEFORE UPDATE ON merch_payments          FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
  CREATE TRIGGER merch_email_templates_updated_at   BEFORE UPDATE ON merch_email_templates   FOR EACH ROW EXECUTE FUNCTION merch_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Helper: total qty ordered for a campaign product ─────────
CREATE OR REPLACE FUNCTION merch_product_order_qty(
  p_campaign_product_id uuid,
  p_statuses            text[]
) RETURNS integer AS $$
  SELECT COALESCE(SUM(ol.qty)::integer, 0)
  FROM merch_order_lines ol
  JOIN merch_orders o ON o.id = ol.order_id
  WHERE ol.campaign_product_id = p_campaign_product_id
  AND   o.status = ANY(p_statuses);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_merch_branding_tenant      ON merch_branding(tenant_id);
CREATE INDEX IF NOT EXISTS idx_merch_campaigns_tenant     ON merch_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_merch_campaigns_status     ON merch_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_merch_campaigns_type       ON merch_campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_merch_cp_campaign          ON merch_campaign_products(campaign_id);
CREATE INDEX IF NOT EXISTS idx_merch_cp_tenant            ON merch_campaign_products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_merch_cp_master            ON merch_campaign_products(master_product_id);
CREATE INDEX IF NOT EXISTS idx_merch_collections_campaign ON merch_collections(campaign_id);
CREATE INDEX IF NOT EXISTS idx_merch_variants_cp          ON merch_product_variants(campaign_product_id);
CREATE INDEX IF NOT EXISTS idx_merch_assets_cp            ON merch_assets(campaign_product_id);
CREATE INDEX IF NOT EXISTS idx_merch_assets_master        ON merch_assets(master_product_id);
CREATE INDEX IF NOT EXISTS idx_merch_customers_tenant     ON merch_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_merch_customers_email      ON merch_customers(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_merch_orders_campaign      ON merch_orders(campaign_id);
CREATE INDEX IF NOT EXISTS idx_merch_orders_tenant        ON merch_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_merch_orders_customer      ON merch_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_merch_orders_status        ON merch_orders(status);
CREATE INDEX IF NOT EXISTS idx_merch_lines_order          ON merch_order_lines(order_id);
CREATE INDEX IF NOT EXISTS idx_merch_lines_cp             ON merch_order_lines(campaign_product_id);
CREATE INDEX IF NOT EXISTS idx_merch_events_order         ON merch_order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_merch_payments_order       ON merch_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_merch_users_tenant         ON merch_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_merch_locations_tenant     ON merch_locations(tenant_id);

-- ── Row-Level Security ───────────────────────────────────────
ALTER TABLE merch_tenants             ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_branding            ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_settings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_locations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_campaigns           ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_campaign_branding   ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_workflow_states     ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_master_products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_campaign_products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_pricing             ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_collections         ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_product_variants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_assets              ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_customers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_order_lines         ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_order_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_payments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_email_templates     ENABLE ROW LEVEL SECURITY;

-- Public read (store browsing) — service role bypasses RLS for all writes
CREATE POLICY "tenants_public_read"        ON merch_tenants           FOR SELECT USING (active = true);
CREATE POLICY "branding_public_read"       ON merch_branding          FOR SELECT USING (true);
CREATE POLICY "workflow_states_read"       ON merch_workflow_states   FOR SELECT USING (true);
CREATE POLICY "campaigns_public_read"      ON merch_campaigns         FOR SELECT USING (status NOT IN ('draft','archived'));
CREATE POLICY "campaign_branding_read"     ON merch_campaign_branding FOR SELECT USING (true);
CREATE POLICY "master_public_read"         ON merch_master_products   FOR SELECT USING (true);
CREATE POLICY "cp_public_read"             ON merch_campaign_products FOR SELECT USING (active = true);
CREATE POLICY "pricing_public_read"        ON merch_pricing           FOR SELECT USING (true);
CREATE POLICY "collections_public_read"    ON merch_collections       FOR SELECT USING (true);
CREATE POLICY "coll_products_read"         ON merch_collection_products FOR SELECT USING (true);
CREATE POLICY "variants_public_read"       ON merch_product_variants  FOR SELECT USING (true);
CREATE POLICY "assets_public_read"         ON merch_assets            FOR SELECT USING (true);
CREATE POLICY "locations_public_read"      ON merch_locations         FOR SELECT USING (active = true);

-- Authenticated admin policies
CREATE POLICY "users_self_read" ON merch_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "customers_admin_read" ON merch_customers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM merch_users u WHERE u.id = auth.uid() AND u.tenant_id = merch_customers.tenant_id
  ));

CREATE POLICY "orders_admin_read" ON merch_orders
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM merch_users u WHERE u.id = auth.uid() AND u.tenant_id = merch_orders.tenant_id
  ));

CREATE POLICY "order_lines_admin_read" ON merch_order_lines
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM merch_orders o
    JOIN merch_users u ON u.tenant_id = o.tenant_id
    WHERE o.id = merch_order_lines.order_id AND u.id = auth.uid()
  ));

CREATE POLICY "order_events_admin_read" ON merch_order_events
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM merch_users u WHERE u.id = auth.uid() AND u.tenant_id = merch_order_events.tenant_id
  ));

CREATE POLICY "payments_admin_read" ON merch_payments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM merch_users u WHERE u.id = auth.uid() AND u.tenant_id = merch_payments.tenant_id
  ));

CREATE POLICY "settings_admin_read" ON merch_settings
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM merch_users u WHERE u.id = auth.uid() AND u.tenant_id = merch_settings.tenant_id
  ));

CREATE POLICY "email_templates_admin_read" ON merch_email_templates
  FOR SELECT USING (
    tenant_id IS NULL
    OR EXISTS (SELECT 1 FROM merch_users u WHERE u.id = auth.uid() AND u.tenant_id = merch_email_templates.tenant_id)
  );

-- ============================================================
-- WORKFLOW STATES SEED
-- ============================================================

INSERT INTO merch_workflow_states (campaign_type, state, label, color, sort_order, is_active, is_terminal) VALUES
  ('reservation', 'reserved',          'Reserved',          '#2563EB', 0, true,  false),
  ('reservation', 'confirmed',         'Confirmed',         '#7C3AED', 1, true,  false),
  ('reservation', 'payment_requested', 'Payment Requested', '#D97706', 2, true,  false),
  ('reservation', 'paid',              'Paid',              '#059669', 3, true,  false),
  ('reservation', 'production',        'In Production',     '#0284C7', 4, true,  false),
  ('reservation', 'completed',         'Completed',         '#16A34A', 5, true,  true),
  ('reservation', 'cancelled',         'Cancelled',         '#DC2626', 6, false, true),
  ('reservation', 'refunded',          'Refunded',          '#6B7280', 7, false, true),
  ('pre_order', 'pre_ordered',       'Pre-ordered',       '#2563EB', 0, true,  false),
  ('pre_order', 'payment_collected', 'Payment Collected', '#059669', 1, true,  false),
  ('pre_order', 'production',        'In Production',     '#0284C7', 2, true,  false),
  ('pre_order', 'shipped',           'Shipped',           '#7C3AED', 3, true,  false),
  ('pre_order', 'completed',         'Completed',         '#16A34A', 4, true,  true),
  ('pre_order', 'cancelled',         'Cancelled',         '#DC2626', 5, false, true),
  ('retail', 'pending',    'Pending',       '#D97706', 0, true,  false),
  ('retail', 'paid',       'Paid',          '#059669', 1, true,  false),
  ('retail', 'production', 'In Production', '#0284C7', 2, true,  false),
  ('retail', 'shipped',    'Shipped',       '#7C3AED', 3, true,  false),
  ('retail', 'completed',  'Completed',     '#16A34A', 4, true,  true),
  ('retail', 'refunded',   'Refunded',      '#6B7280', 5, false, true),
  ('uniform', 'requested', 'Requested',     '#2563EB', 0, true,  false),
  ('uniform', 'approved',  'Approved',      '#7C3AED', 1, true,  false),
  ('uniform', 'production','In Production', '#0284C7', 2, true,  false),
  ('uniform', 'collected', 'Collected',     '#16A34A', 3, true,  true),
  ('uniform', 'cancelled', 'Cancelled',     '#DC2626', 4, false, true),
  ('corporate', 'requested', 'Requested',    '#2563EB', 0, true,  false),
  ('corporate', 'approved',  'Approved',     '#7C3AED', 1, true,  false),
  ('corporate', 'production','In Production','#0284C7', 2, true,  false),
  ('corporate', 'delivered', 'Delivered',    '#16A34A', 3, true,  true),
  ('corporate', 'cancelled', 'Cancelled',    '#DC2626', 4, false, true),
  ('event', 'reserved',  'Reserved',  '#2563EB', 0, true,  false),
  ('event', 'confirmed', 'Confirmed', '#7C3AED', 1, true,  false),
  ('event', 'collected', 'Collected', '#16A34A', 2, true,  true),
  ('event', 'cancelled', 'Cancelled', '#DC2626', 3, false, true),
  ('gift_redemption', 'redeemed',   'Redeemed',   '#2563EB', 0, true,  false),
  ('gift_redemption', 'processing', 'Processing', '#D97706', 1, true,  false),
  ('gift_redemption', 'shipped',    'Shipped',    '#7C3AED', 2, true,  false),
  ('gift_redemption', 'completed',  'Completed',  '#16A34A', 3, true,  true)
ON CONFLICT (campaign_type, state) DO NOTHING;

-- ============================================================
-- SEED — Te Atatū Netball Club · 2026 Season
-- ============================================================

INSERT INTO merch_tenants (slug, name, contact_email)
VALUES ('te-atatu', 'Te Atatū Netball Club', 'orders@tendencies.co.nz')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO merch_branding (tenant_id, primary_color, secondary_color, hero_title, hero_subtitle)
SELECT id, '#0B1F4D', '#D71920',
  'Official Club Merchandise',
  'Reserve your gear below. Orders are produced once minimum quantities are reached — no payment until then.'
FROM merch_tenants WHERE slug = 'te-atatu'
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO merch_locations (tenant_id, name, address)
SELECT id, 'Te Atatū Sports Hub', '1 Harbour View Road, Te Atatū Peninsula, Auckland'
FROM merch_tenants WHERE slug = 'te-atatu';

INSERT INTO merch_campaigns (tenant_id, slug, name, description, campaign_type, opens_at, closes_at, status)
SELECT id, '2026-season', '2026 Season',
  'Official Te Atatū Netball Club merchandise for the 2026 season.',
  'reservation', now(), now() + interval '21 days', 'open'
FROM merch_tenants WHERE slug = 'te-atatu'
ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO merch_master_products (name, description, material, weight_grams, base_sku, features)
VALUES (
  'Club Hoodie',
  'Premium mid-weight fleece hoodie with embroidered club crest.',
  '280gsm mid-weight fleece, 80% cotton 20% polyester', 520, 'HOODIE-001',
  ARRAY['Mid-weight 280gsm fleece','Embroidered club crest','Ribbed cuffs and hem','Front kangaroo pocket','Unisex fit']
);

INSERT INTO merch_campaign_products (
  campaign_id, master_product_id, tenant_id,
  slug, name, description, price_cents, minimum_qty, lead_time_days, sizing_notes, sort_order
)
SELECT c.id, mp.id, t.id,
  'hoodie', 'Club Hoodie',
  'The official Te Atatū Netball Club hoodie. Premium mid-weight fleece with embroidered club crest.',
  7500, 10, 21,
  'This hoodie runs true to size. If between sizes, size up for a relaxed fit.', 0
FROM merch_campaigns c
JOIN merch_tenants t ON t.id = c.tenant_id
CROSS JOIN merch_master_products mp
WHERE c.slug = '2026-season' AND t.slug = 'te-atatu' AND mp.base_sku = 'HOODIE-001'
LIMIT 1
ON CONFLICT (campaign_id, slug) DO NOTHING;

INSERT INTO merch_product_variants (campaign_product_id, size, colour, sort_order)
SELECT cp.id, v.size, 'Navy', v.ord
FROM merch_campaign_products cp
JOIN merch_campaigns c ON c.id = cp.campaign_id
JOIN merch_tenants t   ON t.id = cp.tenant_id
CROSS JOIN (VALUES ('XS',1),('S',2),('M',3),('L',4),('XL',5),('2XL',6),('3XL',7)) AS v(size, ord)
WHERE cp.slug = 'hoodie' AND c.slug = '2026-season' AND t.slug = 'te-atatu'
ON CONFLICT (campaign_product_id, size, colour) DO NOTHING;

INSERT INTO merch_assets (campaign_product_id, type, url, alt_text, sort_order)
SELECT cp.id, 'image', url, alt, ord
FROM merch_campaign_products cp
JOIN merch_campaigns c ON c.id = cp.campaign_id
JOIN merch_tenants t   ON t.id = cp.tenant_id
CROSS JOIN (VALUES
  ('/merch/te-atatu/hoodie-navy-front.jpg', 'Club Hoodie — Front', 1),
  ('/merch/te-atatu/hoodie-navy-back.jpg',  'Club Hoodie — Back',  2)
) AS v(url, alt, ord)
WHERE cp.slug = 'hoodie' AND c.slug = '2026-season' AND t.slug = 'te-atatu';

-- ============================================================
-- ADMIN USER SETUP (complete after running this migration)
-- ============================================================
-- 1. Supabase Dashboard → Authentication → Users → Add User
-- 2. Create user with email + password
-- 3. Copy their UUID
-- 4. Run:
--    INSERT INTO merch_users (id, tenant_id, role)
--    SELECT 'YOUR-AUTH-USER-UUID', id, 'owner'
--    FROM merch_tenants WHERE slug = 'te-atatu';
-- ============================================================
