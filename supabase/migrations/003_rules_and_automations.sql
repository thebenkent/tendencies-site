-- ─────────────────────────────────────────────────────────────────────────────
-- 003  Rules Engine + Automation Engine tables
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Campaign Rules ────────────────────────────────────────────────────────────
-- Sparse key-value store. Only rows that differ from code defaults need entries.

create table if not exists merch_campaign_rules (
  id           uuid default gen_random_uuid() primary key,
  campaign_id  uuid not null references merch_campaigns (id) on delete cascade,
  rule_key     text not null,
  rule_value   jsonb not null,
  updated_at   timestamptz default now(),
  unique (campaign_id, rule_key)
);

create index if not exists merch_campaign_rules_campaign_id_idx
  on merch_campaign_rules (campaign_id);

-- ── Automations ───────────────────────────────────────────────────────────────

create table if not exists merch_automations (
  id             uuid default gen_random_uuid() primary key,
  tenant_id      uuid not null references merch_tenants (id) on delete cascade,
  campaign_id    uuid references merch_campaigns (id) on delete cascade,
  trigger_event  text not null,
  name           text not null,
  active         boolean not null default true,
  created_at     timestamptz default now()
);

create index if not exists merch_automations_tenant_event_idx
  on merch_automations (tenant_id, trigger_event);

create index if not exists merch_automations_campaign_idx
  on merch_automations (campaign_id)
  where campaign_id is not null;

-- ── Automation Steps ──────────────────────────────────────────────────────────

create table if not exists merch_automation_steps (
  id             uuid default gen_random_uuid() primary key,
  automation_id  uuid not null references merch_automations (id) on delete cascade,
  step_order     int  not null default 0,
  action_type    text not null,
  config         jsonb not null default '{}',
  created_at     timestamptz default now()
);

create index if not exists merch_automation_steps_automation_idx
  on merch_automation_steps (automation_id, step_order);
