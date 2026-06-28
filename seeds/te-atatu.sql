-- ============================================================
-- Te Atatū Netball Club — Seed Data
-- Run in the Supabase SQL editor AFTER migrations 007 and 008.
-- Safe to re-run: uses ON CONFLICT DO NOTHING / DO UPDATE.
--
-- Tenant slug: te-atatu
-- Tenant ID:   368e9fa2-a7f2-445c-a502-c8b448d0350d
-- Campaign ID: aa702f86-23fb-4ab9-b1dd-d94017775049
-- Hoodie ID:   a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf
-- ============================================================

-- ── Branding ──────────────────────────────────────────────────

UPDATE merch_branding
SET    secondary_color = '#D4A017'          -- Gold, replacing red
WHERE  tenant_id = '368e9fa2-a7f2-445c-a502-c8b448d0350d';

-- ── Club Hoodie — Fits ────────────────────────────────────────

-- Assign Men's fit to existing Navy variants (created before fit column existed)
UPDATE merch_product_variants
SET    fit = 'Mens'
WHERE  campaign_product_id = 'a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf'
  AND  colour = 'Navy'
  AND  fit    = '';

-- Women's variants
INSERT INTO merch_product_variants
  (campaign_product_id, fit,     size,  colour, additional_cost_cents, available, sort_order)
VALUES
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'XS',  'Navy', 0, true, 11),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'S',   'Navy', 0, true, 12),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'M',   'Navy', 0, true, 13),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'L',   'Navy', 0, true, 14),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'XL',  'Navy', 0, true, 15),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', '2XL', 'Navy', 0, true, 16)
ON CONFLICT (campaign_product_id, fit, size, colour) DO NOTHING;

-- Youth variants
INSERT INTO merch_product_variants
  (campaign_product_id, fit,     size, colour, additional_cost_cents, available, sort_order)
VALUES
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth', '8',  'Navy', 0, true, 21),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth', '10', 'Navy', 0, true, 22),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth', '12', 'Navy', 0, true, 23),
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth', '14', 'Navy', 0, true, 24)
ON CONFLICT (campaign_product_id, fit, size, colour) DO NOTHING;

-- ── Club Hoodie — Personalisation ────────────────────────────

INSERT INTO merch_product_personalisation
  (campaign_product_id,                     type,   label,             required, max_length,
   uppercase_only, additional_price_cents,   placeholder,                              sort_order)
VALUES
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'text', 'Name on Garment', false,    15,
   false,          0,                        'e.g. Smith (leave blank if not needed)', 1)
ON CONFLICT DO NOTHING;

-- ── Club Hoodie — Size Charts ─────────────────────────────────

INSERT INTO merch_size_charts
  (campaign_product_id,                     fit,      title,           chart_json, sort_order)
VALUES
  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Mens',   'Men''s Sizing', '{
    "note": "Measurements in centimetres. Relaxed unisex fit.",
    "headers": ["Size","Chest","Waist","Length"],
    "rows": [
      ["XS",  "88",  "73",  "67"],
      ["S",   "94",  "79",  "69"],
      ["M",   "100", "85",  "71"],
      ["L",   "106", "91",  "73"],
      ["XL",  "112", "97",  "75"],
      ["2XL", "120", "105", "77"],
      ["3XL", "128", "113", "79"]
    ]
  }'::jsonb, 1),

  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Womens', 'Women''s Sizing', '{
    "note": "Measurements in centimetres. Fitted cut.",
    "headers": ["Size","Bust","Waist","Hip","Length"],
    "rows": [
      ["XS",  "82",  "66",  "90",  "62"],
      ["S",   "88",  "72",  "96",  "64"],
      ["M",   "94",  "78",  "102", "66"],
      ["L",   "100", "84",  "108", "68"],
      ["XL",  "108", "92",  "116", "70"],
      ["2XL", "116", "100", "124", "72"]
    ]
  }'::jsonb, 2),

  ('a7f8c069-82e3-4ec0-9e8d-f6f5b1163ecf', 'Youth',  'Youth Sizing', '{
    "note": "Measurements in centimetres.",
    "headers": ["Size","Chest","Length","Approx. Age"],
    "rows": [
      ["8",  "66", "48", "7-8"],
      ["10", "71", "52", "9-10"],
      ["12", "76", "56", "11-12"],
      ["14", "81", "60", "13-14"]
    ]
  }'::jsonb, 3)

ON CONFLICT (campaign_product_id, fit) DO UPDATE
  SET title      = EXCLUDED.title,
      chart_json = EXCLUDED.chart_json;
