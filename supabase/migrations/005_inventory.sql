-- Migration 005: Inventory ledger + atomic stock management RPCs

-- Track how many units are currently allocated to open orders
ALTER TABLE merch_product_variants
  ADD COLUMN IF NOT EXISTS stock_reserved     integer NOT NULL DEFAULT 0 CHECK (stock_reserved >= 0),
  ADD COLUMN IF NOT EXISTS stock_low_threshold integer;

-- Audit log for every inventory movement
CREATE TABLE IF NOT EXISTS merch_inventory_events (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id  uuid        NOT NULL REFERENCES merch_product_variants(id) ON DELETE CASCADE,
  tenant_id   uuid        NOT NULL REFERENCES merch_tenants(id)          ON DELETE CASCADE,
  order_id    uuid        REFERENCES merch_orders(id)                    ON DELETE SET NULL,
  event_type  text        NOT NULL
              CHECK (event_type IN ('allocate','release','adjust','receive','write_off')),
  delta       integer     NOT NULL,
  notes       text,
  actor       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS merch_inventory_events_variant_idx ON merch_inventory_events(variant_id);
CREATE INDEX IF NOT EXISTS merch_inventory_events_order_idx   ON merch_inventory_events(order_id);
CREATE INDEX IF NOT EXISTS merch_inventory_events_tenant_idx  ON merch_inventory_events(tenant_id);

-- ── Atomic reserve: increments stock_reserved, enforces limit when stock_qty is set
CREATE OR REPLACE FUNCTION merch_reserve_stock(
  p_variant_id uuid,
  p_qty        integer
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_stock_qty      integer;
  v_stock_reserved integer;
BEGIN
  SELECT stock_qty, stock_reserved
    INTO v_stock_qty, v_stock_reserved
    FROM merch_product_variants
   WHERE id = p_variant_id
     FOR UPDATE;  -- row lock for concurrent safety

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant % not found', p_variant_id;
  END IF;

  -- stock_qty IS NULL means unlimited (reservation-based campaigns)
  IF v_stock_qty IS NOT NULL AND (v_stock_qty - v_stock_reserved) < p_qty THEN
    RAISE EXCEPTION 'Insufficient stock: % available, % requested',
      (v_stock_qty - v_stock_reserved), p_qty;
  END IF;

  UPDATE merch_product_variants
     SET stock_reserved = stock_reserved + p_qty
   WHERE id = p_variant_id;
END;
$$;

-- ── Atomic release: decrements stock_reserved (floor 0)
CREATE OR REPLACE FUNCTION merch_release_stock(
  p_variant_id uuid,
  p_qty        integer
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE merch_product_variants
     SET stock_reserved = GREATEST(0, stock_reserved - p_qty)
   WHERE id = p_variant_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant % not found', p_variant_id;
  END IF;
END;
$$;

-- ── Atomic adjust: changes stock_qty by delta (floor 0, NULL stays NULL)
CREATE OR REPLACE FUNCTION merch_adjust_stock(
  p_variant_id uuid,
  p_delta      integer
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE merch_product_variants
     SET stock_qty = CASE
           WHEN stock_qty IS NULL THEN NULL
           ELSE GREATEST(0, stock_qty + p_delta)
         END
   WHERE id = p_variant_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant % not found', p_variant_id;
  END IF;
END;
$$;

-- ── Convenience view: current inventory position per variant
CREATE OR REPLACE VIEW merch_variant_inventory AS
SELECT
  v.id                AS variant_id,
  v.campaign_product_id,
  v.size,
  v.colour,
  v.stock_qty,
  v.stock_reserved,
  v.stock_low_threshold,
  CASE
    WHEN v.stock_qty IS NULL THEN NULL   -- unlimited
    ELSE v.stock_qty - v.stock_reserved
  END                 AS stock_available,
  CASE
    WHEN v.stock_qty IS NULL THEN false
    WHEN v.stock_qty - v.stock_reserved <= COALESCE(v.stock_low_threshold, 3) THEN true
    ELSE false
  END                 AS is_low_stock
FROM merch_product_variants v;
