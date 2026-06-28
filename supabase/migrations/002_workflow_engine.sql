-- ============================================================
-- TENDENCIES COMMERCE PLATFORM — v5 WORKFLOW ENGINE
-- Configurable workflows via DB-driven state machine.
-- No production data exists — clean install on top of 001.
-- ============================================================

-- ── Workflows ────────────────────────────────────────────────
-- Named, reusable workflow definitions shared across campaigns.
CREATE TABLE IF NOT EXISTS merch_workflows (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  description text,
  active      boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Workflow States ──────────────────────────────────────────
-- Replace the old campaign_type-keyed table with a workflow_id-keyed one.
DROP TABLE IF EXISTS merch_workflow_states CASCADE;

CREATE TABLE merch_workflow_states (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id   uuid    NOT NULL REFERENCES merch_workflows(id) ON DELETE CASCADE,
  key           text    NOT NULL,
  label         text    NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  colour        text    NOT NULL DEFAULT '#6B7280',
  icon          text,
  terminal      boolean NOT NULL DEFAULT false,
  system        boolean NOT NULL DEFAULT false,
  UNIQUE(workflow_id, key)
);

-- ── Workflow Transitions ─────────────────────────────────────
-- Defines every allowed state movement for a workflow.
-- The UI reads this table to know which action buttons to render.
CREATE TABLE IF NOT EXISTS merch_workflow_transitions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id         uuid NOT NULL REFERENCES merch_workflows(id) ON DELETE CASCADE,
  from_state          text NOT NULL,
  to_state            text NOT NULL,
  action_name         text NOT NULL,
  requires_permission text,
  email_template      text,
  automation          jsonb,
  UNIQUE(workflow_id, from_state, to_state)
);

-- ── Campaigns: add workflow FK ────────────────────────────────
ALTER TABLE merch_campaigns
  ADD COLUMN IF NOT EXISTS workflow_id uuid
  REFERENCES merch_workflows(id) ON DELETE SET NULL;

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE merch_workflows            ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_workflow_states      ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_workflow_transitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflows_public_read"    ON merch_workflows            FOR SELECT USING (active = true);
CREATE POLICY "wf_states_public_read"   ON merch_workflow_states       FOR SELECT USING (true);
CREATE POLICY "wf_transitions_public"   ON merch_workflow_transitions   FOR SELECT USING (true);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_merch_wf_states_workflow ON merch_workflow_states(workflow_id);
CREATE INDEX IF NOT EXISTS idx_merch_wf_trans_workflow  ON merch_workflow_transitions(workflow_id, from_state);
CREATE INDEX IF NOT EXISTS idx_merch_campaigns_workflow ON merch_campaigns(workflow_id);

-- ============================================================
-- SEED — Workflow Definitions
-- Using deterministic UUIDs so UPDATE at the bottom can reference them.
-- ============================================================

INSERT INTO merch_workflows (id, name, description) VALUES
  ('a1000001-0000-0000-0000-000000000000', 'Reservation',      'Group buying with MOQ threshold. No payment until minimum quantity reached.'),
  ('a2000002-0000-0000-0000-000000000000', 'Pre-Order',        'Pre-orders with payment collected upfront before production.'),
  ('a3000003-0000-0000-0000-000000000000', 'Retail',           'Immediate purchase with payment and inventory.'),
  ('a4000004-0000-0000-0000-000000000000', 'Uniform',          'Manager-approved uniform allocation per employee.'),
  ('a5000005-0000-0000-0000-000000000000', 'Corporate',        'Corporate merchandise with approval workflow.'),
  ('a6000006-0000-0000-0000-000000000000', 'Event',            'Event merchandise with collection at venue.'),
  ('a7000007-0000-0000-0000-000000000000', 'Gift Redemption',  'Voucher/code-based gift redemption with fulfilment.')
ON CONFLICT (id) DO NOTHING;

-- ── Reservation Workflow ──────────────────────────────────────

INSERT INTO merch_workflow_states (workflow_id, key, label, display_order, colour, terminal, system) VALUES
  ('a1000001-0000-0000-0000-000000000000', 'reserved',          'Reserved',          0, '#2563EB', false, false),
  ('a1000001-0000-0000-0000-000000000000', 'confirmed',         'Confirmed',         1, '#7C3AED', false, false),
  ('a1000001-0000-0000-0000-000000000000', 'payment_requested', 'Payment Requested', 2, '#D97706', false, false),
  ('a1000001-0000-0000-0000-000000000000', 'paid',              'Paid',              3, '#059669', false, false),
  ('a1000001-0000-0000-0000-000000000000', 'production',        'In Production',     4, '#0284C7', false, false),
  ('a1000001-0000-0000-0000-000000000000', 'completed',         'Completed',         5, '#16A34A', true,  true),
  ('a1000001-0000-0000-0000-000000000000', 'cancelled',         'Cancelled',         6, '#DC2626', true,  true),
  ('a1000001-0000-0000-0000-000000000000', 'refunded',          'Refunded',          7, '#6B7280', true,  true)
ON CONFLICT (workflow_id, key) DO NOTHING;

INSERT INTO merch_workflow_transitions (workflow_id, from_state, to_state, action_name, requires_permission) VALUES
  ('a1000001-0000-0000-0000-000000000000', 'reserved',          'confirmed',         'Confirm Order',    'admin'),
  ('a1000001-0000-0000-0000-000000000000', 'reserved',          'cancelled',         'Cancel',           'admin'),
  ('a1000001-0000-0000-0000-000000000000', 'confirmed',         'payment_requested', 'Request Payment',  'finance'),
  ('a1000001-0000-0000-0000-000000000000', 'confirmed',         'cancelled',         'Cancel',           'admin'),
  ('a1000001-0000-0000-0000-000000000000', 'payment_requested', 'paid',              'Mark Paid',        'finance'),
  ('a1000001-0000-0000-0000-000000000000', 'payment_requested', 'cancelled',         'Cancel',           'admin'),
  ('a1000001-0000-0000-0000-000000000000', 'paid',              'production',        'Start Production', 'production'),
  ('a1000001-0000-0000-0000-000000000000', 'paid',              'refunded',          'Refund',           'finance'),
  ('a1000001-0000-0000-0000-000000000000', 'production',        'completed',         'Mark Completed',   'production'),
  ('a1000001-0000-0000-0000-000000000000', 'production',        'refunded',          'Refund',           'finance')
ON CONFLICT (workflow_id, from_state, to_state) DO NOTHING;

-- ── Pre-Order Workflow ────────────────────────────────────────

INSERT INTO merch_workflow_states (workflow_id, key, label, display_order, colour, terminal, system) VALUES
  ('a2000002-0000-0000-0000-000000000000', 'pre_ordered',       'Pre-ordered',       0, '#2563EB', false, false),
  ('a2000002-0000-0000-0000-000000000000', 'payment_collected', 'Payment Collected', 1, '#059669', false, false),
  ('a2000002-0000-0000-0000-000000000000', 'production',        'In Production',     2, '#0284C7', false, false),
  ('a2000002-0000-0000-0000-000000000000', 'shipped',           'Shipped',           3, '#7C3AED', false, false),
  ('a2000002-0000-0000-0000-000000000000', 'completed',         'Completed',         4, '#16A34A', true,  true),
  ('a2000002-0000-0000-0000-000000000000', 'cancelled',         'Cancelled',         5, '#DC2626', true,  true)
ON CONFLICT (workflow_id, key) DO NOTHING;

INSERT INTO merch_workflow_transitions (workflow_id, from_state, to_state, action_name, requires_permission) VALUES
  ('a2000002-0000-0000-0000-000000000000', 'pre_ordered',       'payment_collected', 'Collect Payment',  'finance'),
  ('a2000002-0000-0000-0000-000000000000', 'pre_ordered',       'cancelled',         'Cancel',           'admin'),
  ('a2000002-0000-0000-0000-000000000000', 'payment_collected', 'production',        'Start Production', 'production'),
  ('a2000002-0000-0000-0000-000000000000', 'production',        'shipped',           'Mark Shipped',     'production'),
  ('a2000002-0000-0000-0000-000000000000', 'shipped',           'completed',         'Mark Completed',   'production')
ON CONFLICT (workflow_id, from_state, to_state) DO NOTHING;

-- ── Retail Workflow ───────────────────────────────────────────

INSERT INTO merch_workflow_states (workflow_id, key, label, display_order, colour, terminal, system) VALUES
  ('a3000003-0000-0000-0000-000000000000', 'pending',    'Pending',       0, '#D97706', false, false),
  ('a3000003-0000-0000-0000-000000000000', 'paid',       'Paid',          1, '#059669', false, false),
  ('a3000003-0000-0000-0000-000000000000', 'production', 'In Production', 2, '#0284C7', false, false),
  ('a3000003-0000-0000-0000-000000000000', 'shipped',    'Shipped',       3, '#7C3AED', false, false),
  ('a3000003-0000-0000-0000-000000000000', 'completed',  'Completed',     4, '#16A34A', true,  true),
  ('a3000003-0000-0000-0000-000000000000', 'refunded',   'Refunded',      5, '#6B7280', true,  true)
ON CONFLICT (workflow_id, key) DO NOTHING;

INSERT INTO merch_workflow_transitions (workflow_id, from_state, to_state, action_name, requires_permission) VALUES
  ('a3000003-0000-0000-0000-000000000000', 'pending',    'paid',       'Mark Paid',        'finance'),
  ('a3000003-0000-0000-0000-000000000000', 'paid',       'production', 'Start Production', 'production'),
  ('a3000003-0000-0000-0000-000000000000', 'production', 'shipped',    'Mark Shipped',     'production'),
  ('a3000003-0000-0000-0000-000000000000', 'shipped',    'completed',  'Mark Completed',   'production'),
  ('a3000003-0000-0000-0000-000000000000', 'paid',       'refunded',   'Refund',           'finance')
ON CONFLICT (workflow_id, from_state, to_state) DO NOTHING;

-- ── Uniform Workflow ──────────────────────────────────────────

INSERT INTO merch_workflow_states (workflow_id, key, label, display_order, colour, terminal, system) VALUES
  ('a4000004-0000-0000-0000-000000000000', 'requested', 'Requested',     0, '#2563EB', false, false),
  ('a4000004-0000-0000-0000-000000000000', 'approved',  'Approved',      1, '#7C3AED', false, false),
  ('a4000004-0000-0000-0000-000000000000', 'production','In Production', 2, '#0284C7', false, false),
  ('a4000004-0000-0000-0000-000000000000', 'collected', 'Collected',     3, '#16A34A', true,  true),
  ('a4000004-0000-0000-0000-000000000000', 'cancelled', 'Cancelled',     4, '#DC2626', true,  true)
ON CONFLICT (workflow_id, key) DO NOTHING;

INSERT INTO merch_workflow_transitions (workflow_id, from_state, to_state, action_name, requires_permission) VALUES
  ('a4000004-0000-0000-0000-000000000000', 'requested', 'approved',   'Approve',          'admin'),
  ('a4000004-0000-0000-0000-000000000000', 'requested', 'cancelled',  'Reject',           'admin'),
  ('a4000004-0000-0000-0000-000000000000', 'approved',  'production', 'Start Production', 'production'),
  ('a4000004-0000-0000-0000-000000000000', 'production','collected',  'Mark Collected',   'production')
ON CONFLICT (workflow_id, from_state, to_state) DO NOTHING;

-- ── Corporate Workflow ────────────────────────────────────────

INSERT INTO merch_workflow_states (workflow_id, key, label, display_order, colour, terminal, system) VALUES
  ('a5000005-0000-0000-0000-000000000000', 'requested', 'Requested',     0, '#2563EB', false, false),
  ('a5000005-0000-0000-0000-000000000000', 'approved',  'Approved',      1, '#7C3AED', false, false),
  ('a5000005-0000-0000-0000-000000000000', 'production','In Production', 2, '#0284C7', false, false),
  ('a5000005-0000-0000-0000-000000000000', 'delivered', 'Delivered',     3, '#16A34A', true,  true),
  ('a5000005-0000-0000-0000-000000000000', 'cancelled', 'Cancelled',     4, '#DC2626', true,  true)
ON CONFLICT (workflow_id, key) DO NOTHING;

INSERT INTO merch_workflow_transitions (workflow_id, from_state, to_state, action_name, requires_permission) VALUES
  ('a5000005-0000-0000-0000-000000000000', 'requested', 'approved',   'Approve',          'admin'),
  ('a5000005-0000-0000-0000-000000000000', 'requested', 'cancelled',  'Reject',           'admin'),
  ('a5000005-0000-0000-0000-000000000000', 'approved',  'production', 'Start Production', 'production'),
  ('a5000005-0000-0000-0000-000000000000', 'production','delivered',  'Mark Delivered',   'production')
ON CONFLICT (workflow_id, from_state, to_state) DO NOTHING;

-- ── Event Workflow ────────────────────────────────────────────

INSERT INTO merch_workflow_states (workflow_id, key, label, display_order, colour, terminal, system) VALUES
  ('a6000006-0000-0000-0000-000000000000', 'reserved',  'Reserved',  0, '#2563EB', false, false),
  ('a6000006-0000-0000-0000-000000000000', 'confirmed', 'Confirmed', 1, '#7C3AED', false, false),
  ('a6000006-0000-0000-0000-000000000000', 'collected', 'Collected', 2, '#16A34A', true,  true),
  ('a6000006-0000-0000-0000-000000000000', 'cancelled', 'Cancelled', 3, '#DC2626', true,  true)
ON CONFLICT (workflow_id, key) DO NOTHING;

INSERT INTO merch_workflow_transitions (workflow_id, from_state, to_state, action_name, requires_permission) VALUES
  ('a6000006-0000-0000-0000-000000000000', 'reserved',  'confirmed', 'Confirm',        'admin'),
  ('a6000006-0000-0000-0000-000000000000', 'reserved',  'cancelled', 'Cancel',         'admin'),
  ('a6000006-0000-0000-0000-000000000000', 'confirmed', 'collected', 'Mark Collected', 'production')
ON CONFLICT (workflow_id, from_state, to_state) DO NOTHING;

-- ── Gift Redemption Workflow ──────────────────────────────────

INSERT INTO merch_workflow_states (workflow_id, key, label, display_order, colour, terminal, system) VALUES
  ('a7000007-0000-0000-0000-000000000000', 'redeemed',   'Redeemed',   0, '#2563EB', false, false),
  ('a7000007-0000-0000-0000-000000000000', 'processing', 'Processing', 1, '#D97706', false, false),
  ('a7000007-0000-0000-0000-000000000000', 'shipped',    'Shipped',    2, '#7C3AED', false, false),
  ('a7000007-0000-0000-0000-000000000000', 'completed',  'Completed',  3, '#16A34A', true,  true)
ON CONFLICT (workflow_id, key) DO NOTHING;

INSERT INTO merch_workflow_transitions (workflow_id, from_state, to_state, action_name, requires_permission) VALUES
  ('a7000007-0000-0000-0000-000000000000', 'redeemed',   'processing', 'Start Processing', 'production'),
  ('a7000007-0000-0000-0000-000000000000', 'processing', 'shipped',    'Mark Shipped',     'production'),
  ('a7000007-0000-0000-0000-000000000000', 'shipped',    'completed',  'Mark Completed',   'production')
ON CONFLICT (workflow_id, from_state, to_state) DO NOTHING;

-- ── Wire up Te Atatū campaign ────────────────────────────────
UPDATE merch_campaigns
SET workflow_id = 'a1000001-0000-0000-0000-000000000000'
WHERE slug = '2026-season'
  AND tenant_id = (SELECT id FROM merch_tenants WHERE slug = 'te-atatu');
