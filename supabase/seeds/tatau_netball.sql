-- Te Atatū Netball Club — Product Setup
--
-- Creates Club Hoodie and Club Tee with all fit/size variants and Player Name personalisation.
-- Safe to re-run: deletes and re-creates variants and personalisation only (orders are preserved).
--
-- BEFORE RUNNING:
--   1. Create the tenant and campaign through the admin UI
--   2. Find your campaign ID:
--        SELECT id, name FROM merch_campaigns WHERE tenant_id = (SELECT id FROM merch_tenants WHERE slug = 'your-slug');
--   3. Replace 'YOUR-CAMPAIGN-ID-HERE' below with the real UUID

DO $$
DECLARE
  v_campaign_id uuid := 'YOUR-CAMPAIGN-ID-HERE'; -- << SET THIS UUID
  v_tenant_id   uuid;
  v_hoodie_id   uuid;
  v_tee_id      uuid;
BEGIN
  -- Validate campaign and resolve tenant
  SELECT tenant_id INTO v_tenant_id
  FROM merch_campaigns
  WHERE id = v_campaign_id;

  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Campaign not found: %. Create it in the admin first.', v_campaign_id;
  END IF;

  -- ── Club Hoodie ────────────────────────────────────────────────────────────

  SELECT id INTO v_hoodie_id
  FROM merch_campaign_products
  WHERE campaign_id = v_campaign_id AND slug = 'club-hoodie';

  IF v_hoodie_id IS NOT NULL THEN
    UPDATE merch_campaign_products SET
      name              = 'Club Hoodie',
      price_cents       = 6000,
      minimum_qty       = 10,
      lead_time_days    = 21,
      active            = true,
      sort_order        = 1,
      lifecycle_status  = 'published'
    WHERE id = v_hoodie_id;
  ELSE
    INSERT INTO merch_campaign_products (
      id, tenant_id, campaign_id, slug, name,
      price_cents, minimum_qty, lead_time_days,
      active, sort_order, lifecycle_status, currency,
      embroidery_available, tags
    ) VALUES (
      gen_random_uuid(), v_tenant_id, v_campaign_id, 'club-hoodie', 'Club Hoodie',
      6000, 10, 21,
      true, 1, 'published', 'NZD',
      false, '{}'
    ) RETURNING id INTO v_hoodie_id;
  END IF;

  -- Clear existing variants and personalisation (safe when no orders exist yet)
  DELETE FROM merch_product_variants     WHERE campaign_product_id = v_hoodie_id;
  DELETE FROM merch_product_personalisation WHERE campaign_product_id = v_hoodie_id;

  -- Youth — sizes 6, 8, 10, 12, 14  (sort 1–5)
  INSERT INTO merch_product_variants (id, campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
  VALUES
    (gen_random_uuid(), v_hoodie_id, 'Youth', '6',  'Navy', 0, true, 1),
    (gen_random_uuid(), v_hoodie_id, 'Youth', '8',  'Navy', 0, true, 2),
    (gen_random_uuid(), v_hoodie_id, 'Youth', '10', 'Navy', 0, true, 3),
    (gen_random_uuid(), v_hoodie_id, 'Youth', '12', 'Navy', 0, true, 4),
    (gen_random_uuid(), v_hoodie_id, 'Youth', '14', 'Navy', 0, true, 5);

  -- Womens — sizes 6–24 (sort 10–19)
  INSERT INTO merch_product_variants (id, campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
  VALUES
    (gen_random_uuid(), v_hoodie_id, 'Womens', '6',  'Navy', 0, true, 10),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '8',  'Navy', 0, true, 11),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '10', 'Navy', 0, true, 12),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '12', 'Navy', 0, true, 13),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '14', 'Navy', 0, true, 14),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '16', 'Navy', 0, true, 15),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '18', 'Navy', 0, true, 16),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '20', 'Navy', 0, true, 17),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '22', 'Navy', 0, true, 18),
    (gen_random_uuid(), v_hoodie_id, 'Womens', '24', 'Navy', 0, true, 19);

  -- Mens — XS through 5XL (sort 20–27)
  INSERT INTO merch_product_variants (id, campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
  VALUES
    (gen_random_uuid(), v_hoodie_id, 'Mens', 'XS',  'Navy', 0, true, 20),
    (gen_random_uuid(), v_hoodie_id, 'Mens', 'S',   'Navy', 0, true, 21),
    (gen_random_uuid(), v_hoodie_id, 'Mens', 'M',   'Navy', 0, true, 22),
    (gen_random_uuid(), v_hoodie_id, 'Mens', 'L',   'Navy', 0, true, 23),
    (gen_random_uuid(), v_hoodie_id, 'Mens', 'XL',  'Navy', 0, true, 24),
    (gen_random_uuid(), v_hoodie_id, 'Mens', '2XL', 'Navy', 0, true, 25),
    (gen_random_uuid(), v_hoodie_id, 'Mens', '3XL', 'Navy', 0, true, 26),
    (gen_random_uuid(), v_hoodie_id, 'Mens', '5XL', 'Navy', 0, true, 27);

  -- Player Name personalisation (optional, max 20 chars, uppercase)
  INSERT INTO merch_product_personalisation (
    id, campaign_product_id, type, label, required,
    max_length, uppercase_only, additional_price_cents, placeholder, sort_order, active
  ) VALUES (
    gen_random_uuid(), v_hoodie_id, 'text', 'Player Name', false,
    20, true, 0, 'e.g. WILLIAMS', 1, true
  );

  RAISE NOTICE 'Club Hoodie ready — ID: %', v_hoodie_id;

  -- ── Club Tee ───────────────────────────────────────────────────────────────

  SELECT id INTO v_tee_id
  FROM merch_campaign_products
  WHERE campaign_id = v_campaign_id AND slug = 'club-tee';

  IF v_tee_id IS NOT NULL THEN
    UPDATE merch_campaign_products SET
      name              = 'Club Tee',
      price_cents       = 4200,
      minimum_qty       = 10,
      lead_time_days    = 21,
      active            = true,
      sort_order        = 2,
      lifecycle_status  = 'published'
    WHERE id = v_tee_id;
  ELSE
    INSERT INTO merch_campaign_products (
      id, tenant_id, campaign_id, slug, name,
      price_cents, minimum_qty, lead_time_days,
      active, sort_order, lifecycle_status, currency,
      embroidery_available, tags
    ) VALUES (
      gen_random_uuid(), v_tenant_id, v_campaign_id, 'club-tee', 'Club Tee',
      4200, 10, 21,
      true, 2, 'published', 'NZD',
      false, '{}'
    ) RETURNING id INTO v_tee_id;
  END IF;

  DELETE FROM merch_product_variants        WHERE campaign_product_id = v_tee_id;
  DELETE FROM merch_product_personalisation WHERE campaign_product_id = v_tee_id;

  -- Youth — sizes 6, 8, 10, 12, 14
  INSERT INTO merch_product_variants (id, campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
  VALUES
    (gen_random_uuid(), v_tee_id, 'Youth', '6',  'Navy', 0, true, 1),
    (gen_random_uuid(), v_tee_id, 'Youth', '8',  'Navy', 0, true, 2),
    (gen_random_uuid(), v_tee_id, 'Youth', '10', 'Navy', 0, true, 3),
    (gen_random_uuid(), v_tee_id, 'Youth', '12', 'Navy', 0, true, 4),
    (gen_random_uuid(), v_tee_id, 'Youth', '14', 'Navy', 0, true, 5);

  -- Womens — sizes 6–24
  INSERT INTO merch_product_variants (id, campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
  VALUES
    (gen_random_uuid(), v_tee_id, 'Womens', '6',  'Navy', 0, true, 10),
    (gen_random_uuid(), v_tee_id, 'Womens', '8',  'Navy', 0, true, 11),
    (gen_random_uuid(), v_tee_id, 'Womens', '10', 'Navy', 0, true, 12),
    (gen_random_uuid(), v_tee_id, 'Womens', '12', 'Navy', 0, true, 13),
    (gen_random_uuid(), v_tee_id, 'Womens', '14', 'Navy', 0, true, 14),
    (gen_random_uuid(), v_tee_id, 'Womens', '16', 'Navy', 0, true, 15),
    (gen_random_uuid(), v_tee_id, 'Womens', '18', 'Navy', 0, true, 16),
    (gen_random_uuid(), v_tee_id, 'Womens', '20', 'Navy', 0, true, 17),
    (gen_random_uuid(), v_tee_id, 'Womens', '22', 'Navy', 0, true, 18),
    (gen_random_uuid(), v_tee_id, 'Womens', '24', 'Navy', 0, true, 19);

  -- Mens — XS through 5XL
  INSERT INTO merch_product_variants (id, campaign_product_id, fit, size, colour, additional_cost_cents, available, sort_order)
  VALUES
    (gen_random_uuid(), v_tee_id, 'Mens', 'XS',  'Navy', 0, true, 20),
    (gen_random_uuid(), v_tee_id, 'Mens', 'S',   'Navy', 0, true, 21),
    (gen_random_uuid(), v_tee_id, 'Mens', 'M',   'Navy', 0, true, 22),
    (gen_random_uuid(), v_tee_id, 'Mens', 'L',   'Navy', 0, true, 23),
    (gen_random_uuid(), v_tee_id, 'Mens', 'XL',  'Navy', 0, true, 24),
    (gen_random_uuid(), v_tee_id, 'Mens', '2XL', 'Navy', 0, true, 25),
    (gen_random_uuid(), v_tee_id, 'Mens', '3XL', 'Navy', 0, true, 26),
    (gen_random_uuid(), v_tee_id, 'Mens', '5XL', 'Navy', 0, true, 27);

  -- Player Name personalisation
  INSERT INTO merch_product_personalisation (
    id, campaign_product_id, type, label, required,
    max_length, uppercase_only, additional_price_cents, placeholder, sort_order, active
  ) VALUES (
    gen_random_uuid(), v_tee_id, 'text', 'Player Name', false,
    20, true, 0, 'e.g. WILLIAMS', 1, true
  );

  RAISE NOTICE 'Club Tee ready — ID: %', v_tee_id;
  RAISE NOTICE 'Setup complete. Both products have 23 variants (Youth 5, Womens 10, Mens 8).';
END $$;
