-- ============================================================
-- 011 · Activity & Audit Log
-- ============================================================
-- Central audit trail for every admin action.
-- Tenant-scoped, immutable append-only table.
-- Supports: who changed what, when, and what the diff was.
-- ============================================================

CREATE TABLE IF NOT EXISTS merch_activity_log (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid        NOT NULL REFERENCES merch_tenants(id) ON DELETE CASCADE,
  user_id      uuid,                     -- null for system/workflow actions
  entity_type  text        NOT NULL,     -- 'campaign' | 'product' | 'collection' | 'order' | 'bundle' | 'banner' | 'user' | 'workflow'
  entity_id    text        NOT NULL,     -- uuid of the affected record (text to support composite keys)
  entity_label text,                     -- human-readable identifier (e.g. product name, campaign slug)
  action       text        NOT NULL,     -- 'created' | 'updated' | 'deleted' | 'archived' | 'published' | 'status_changed' | 'duplicated' | 'reordered' | 'login'
  before_json  jsonb,                    -- state before change (null for creates)
  after_json   jsonb,                    -- state after change (null for deletes)
  changed_keys text[],                   -- which fields were changed (derived from diff)
  metadata     jsonb,                    -- additional context (e.g. { reason: 'MOQ met', workflow: 'transition' })
  ip_address   text,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merch_activity_log_tenant
  ON merch_activity_log (tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_merch_activity_log_entity
  ON merch_activity_log (entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_merch_activity_log_user
  ON merch_activity_log (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;
