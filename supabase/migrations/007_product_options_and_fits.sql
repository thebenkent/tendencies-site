-- ============================================================
-- Product Options, Fit Dimension, and Branding Update
-- Adds: fit column to variants, product_options JSONB to campaign
--       products, updates Te Atatu branding to gold.
-- ============================================================

-- ── Schema Changes ────────────────────────────────────────────

-- 1. Add fit column to merch_product_variants
--    Empty string means "no fit dimension" — no fit selector shown.
ALTER TABLE merch_product_variants
  ADD COLUMN IF NOT EXISTS fit text NOT NULL DEFAULT '';

-- 2. Replace unique constraint to include fit
--    Old: (campaign_product_id, size, colour)
--    New: (campaign_product_id, fit, size, colour)
ALTER TABLE merch_product_variants
  DROP CONSTRAINT IF EXISTS merch_product_variants_campaign_product_id_size_colour_key;

ALTER TABLE merch_product_variants
  ADD CONSTRAINT merch_product_variants_campaign_product_id_fit_size_colour_key
  UNIQUE (campaign_product_id, fit, size, colour);

-- 3. Add product_options JSONB column to campaign products
--    Schema: { personalisation?: { player_name?: PersonalisationOption, ... },
--              size_charts?: Record<fit, { note, headers, rows }> }
ALTER TABLE merch_campaign_products
  ADD COLUMN IF NOT EXISTS product_options jsonb NOT NULL DEFAULT '{}';

-- ── Te Atatū Netball Club — Branding ─────────────────────────

-- 4. Update accent colour from red to gold
UPDATE merch_branding
SET    secondary_color = '#D4A017'
WHERE  tenant_id = (SELECT id FROM merch_tenants WHERE slug = 'te-atatu');

-- ── Te Atatū Netball Club — Club Hoodie Fits ─────────────────

-- 5. Assign Men's fit to the existing Navy variants
UPDATE merch_product_variants
SET    fit = 'Mens'
WHERE  campaign_product_id = 'a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf'
  AND  colour = 'Navy';

-- 6. Insert Women's fit variants
INSERT INTO merch_product_variants
  (campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
VALUES
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'XS',  'Navy', 0, true, 11),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'S',   'Navy', 0, true, 12),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'M',   'Navy', 0, true, 13),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'L',   'Navy', 0, true, 14),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'XL',  'Navy', 0, true, 15),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', '2XL', 'Navy', 0, true, 16)
ON CONFLICT DO NOTHING;

-- 7. Insert Youth fit variants
INSERT INTO merch_product_variants
  (campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
VALUES
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth', '8',  'Navy', 0, true, 21),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth', '10', 'Navy', 0, true, 22),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth', '12', 'Navy', 0, true, 23),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth', '14', 'Navy', 0, true, 24)
ON CONFLICT DO NOTHING;

-- 8. Set product_options for the Club Hoodie:
--    - Player name personalisation (optional, max 15 chars)
--    - Size charts per fit
UPDATE merch_campaign_products
SET    product_options = '{
  "personalisation": {
    "player_name": {
      "enabled": true,
      "required": false,
      "max_chars": 15,
      "uppercase_only": false,
      "additional_price_cents": 0,
      "label": "Name on Garment",
      "placeholder": "e.g. Smith (leave blank if not needed)"
    }
  },
  "size_charts": {
    "Mens": {
      "note": "Measurements in centimetres. Relaxed unisex fit.",
      "headers": ["Size", "Chest", "Waist", "Length"],
      "rows": [
        ["XS",  "88",  "73",  "67"],
        ["S",   "94",  "79",  "69"],
        ["M",   "100", "85",  "71"],
        ["L",   "106", "91",  "73"],
        ["XL",  "112", "97",  "75"],
        ["2XL", "120", "105", "77"],
        ["3XL", "128", "113", "79"]
      ]
    },
    "Womens": {
      "note": "Measurements in centimetres. Fitted cut.",
      "headers": ["Size", "Bust", "Waist", "Hip", "Length"],
      "rows": [
        ["XS",  "82",  "66",  "90",  "62"],
        ["S",   "88",  "72",  "96",  "64"],
        ["M",   "94",  "78",  "102", "66"],
        ["L",   "100", "84",  "108", "68"],
        ["XL",  "108", "92",  "116", "70"],
        ["2XL", "116", "100", "124", "72"]
      ]
    },
    "Youth": {
      "note": "Measurements in centimetres.",
      "headers": ["Size", "Chest", "Length", "Approx. Age"],
      "rows": [
        ["8",  "66", "48", "7-8"],
        ["10", "71", "52", "9-10"],
        ["12", "76", "56", "11-12"],
        ["14", "81", "60", "13-14"]
      ]
    }
  }
}'::jsonb
WHERE  id = 'a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf';
