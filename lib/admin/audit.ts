import { getSupabase } from '@/lib/core/database'

export type ActivityAction =
  | 'created' | 'updated' | 'deleted' | 'archived' | 'restored'
  | 'published' | 'unpublished' | 'duplicated' | 'reordered'
  | 'linked' | 'unlinked'
  | 'status_changed' | 'login' | 'workflow_transition'

export type ActivityEntityType =
  | 'campaign' | 'product' | 'collection' | 'bundle' | 'banner'
  | 'order' | 'customer' | 'user' | 'workflow' | 'asset' | 'attribute'
  | 'supplier'

export type LogActivityParams = {
  tenantId:    string
  userId?:     string
  entityType:  ActivityEntityType
  entityId:    string
  entityLabel?: string
  action:      ActivityAction
  before?:     unknown
  after?:      unknown
  metadata?:   Record<string, unknown>
  ipAddress?:  string
  userAgent?:  string
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  const {
    tenantId, userId, entityType, entityId, entityLabel,
    action, before, after, metadata, ipAddress, userAgent,
  } = params

  // Derive changed keys from the diff (only for updates)
  let changedKeys: string[] | undefined
  if (action === 'updated' && before && after && typeof before === 'object' && typeof after === 'object') {
    changedKeys = Object.keys(after as object).filter((key) => {
      const b = (before as Record<string, unknown>)[key]
      const a = (after  as Record<string, unknown>)[key]
      return JSON.stringify(b) !== JSON.stringify(a)
    })
  }

  const { error } = await getSupabase()
    .from('merch_activity_log')
    .insert({
      tenant_id:    tenantId,
      user_id:      userId ?? null,
      entity_type:  entityType,
      entity_id:    entityId,
      entity_label: entityLabel ?? null,
      action,
      before_json:  before ?? null,
      after_json:   after  ?? null,
      changed_keys: changedKeys ?? null,
      metadata:     metadata ?? null,
      ip_address:   ipAddress ?? null,
      user_agent:   userAgent ?? null,
    })

  if (error) {
    // Never throw — audit failure must not break the main operation
    console.error('[audit] Failed to log activity:', error.message)
  }
}

export async function getActivityLog(
  tenantId: string,
  opts: {
    entityType?: ActivityEntityType
    entityId?:   string
    userId?:     string
    limit?:      number
    offset?:     number
  } = {},
): Promise<ActivityLogEntry[]> {
  let q = getSupabase()
    .from('merch_activity_log')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 50)

  if (opts.entityType) q = q.eq('entity_type', opts.entityType)
  if (opts.entityId)   q = q.eq('entity_id', opts.entityId)
  if (opts.userId)     q = q.eq('user_id', opts.userId)
  if (opts.offset)     q = q.range(opts.offset, opts.offset + (opts.limit ?? 50) - 1)

  const { data } = await q
  return (data ?? []) as ActivityLogEntry[]
}

export type ActivityLogEntry = {
  id:           string
  tenant_id:    string
  user_id:      string | null
  entity_type:  string
  entity_id:    string
  entity_label: string | null
  action:       string
  before_json:  unknown
  after_json:   unknown
  changed_keys: string[] | null
  metadata:     Record<string, unknown> | null
  ip_address:   string | null
  user_agent:   string | null
  created_at:   string
}
