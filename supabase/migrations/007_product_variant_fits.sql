-- ============================================================
-- 007 · Fit Dimension on Product Variants (schema only)
-- Adds the fit column and updates the unique constraint.
-- Customer seed data → seeds/te-atatu.sql
-- ============================================================

-- 1. Add fit column.
--    Empty string signals "no fit dimension" — no fit selector rendered.
ALTER TABLE merch_product_variants
  ADD COLUMN IF NOT EXISTS fit text NOT NULL DEFAULT '';

-- 2. Widen the unique constraint to include fit so that
--    Men's/Women's/Youth variants can share the same size + colour.
ALTER TABLE merch_product_variants
  DROP CONSTRAINT IF EXISTS merch_product_variants_campaign_product_id_size_colour_key;

ALTER TABLE merch_product_variants
  ADD CONSTRAINT merch_product_variants_campaign_product_id_fit_size_colour_key
  UNIQUE (campaign_product_id, fit, size, colour);
