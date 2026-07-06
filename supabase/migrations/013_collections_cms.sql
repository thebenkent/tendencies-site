-- ============================================================
-- 013 · Collections CMS
-- ============================================================
-- Extends merch_collections to support the full Collections CMS:
--   lifecycle status, hero/thumbnail images, SEO fields, tags,
--   featured flag, and scheduling (publish_at / archive_at).
-- Extends merch_collection_products junction with featured flag.
-- ============================================================

-- ── Lifecycle status ──────────────────────────────────────────────────────
ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'draft'
    CHECK (lifecycle_status IN ('draft', 'review', 'published', 'archived', 'hidden', 'scheduled'));

-- ── Media ─────────────────────────────────────────────────────────────────
-- image_url is already present (migration 010) — used as hero image.
-- thumbnail_url is a separate, smaller image for list views and cards.
ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- ── SEO ───────────────────────────────────────────────────────────────────
ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS seo_title       text,
  ADD COLUMN IF NOT EXISTS seo_description text;

-- ── Categorisation ────────────────────────────────────────────────────────
ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- ── Display flags ─────────────────────────────────────────────────────────
-- visible already present (migration 010).
ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- ── Scheduling ────────────────────────────────────────────────────────────
ALTER TABLE merch_collections
  ADD COLUMN IF NOT EXISTS publish_at   timestamptz,
  ADD COLUMN IF NOT EXISTS archive_at   timestamptz,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at  timestamptz;

-- ── Product junction: featured flag ───────────────────────────────────────
-- Marks certain products as "featured" within this collection.
ALTER TABLE merch_collection_products
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- ── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_merch_collections_tenant_status
  ON merch_collections (tenant_id, lifecycle_status);

CREATE INDEX IF NOT EXISTS idx_merch_collections_featured
  ON merch_collections (campaign_id, featured)
  WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_merch_collections_publish_at
  ON merch_collections (publish_at)
  WHERE lifecycle_status = 'scheduled';
