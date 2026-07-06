/**
 * Revision History Framework.
 *
 * Generic version history interfaces — entities opt in.
 * The framework stores before/after snapshots with user and timestamp.
 * No UI here — the editor drawer calls these to display a revision timeline.
 *
 * DB-backed implementation will live in a revisions repository.
 * These interfaces define the contract that all implementations must meet.
 */

// ── Revision record ───────────────────────────────────────────────────────

export type EntityRevision<T> = {
  id:         string
  entityType: string         // e.g. "campaign", "product"
  entityId:   string
  version:    number         // monotonically incrementing
  before:     Partial<T>     // snapshot before the change
  after:      Partial<T>     // snapshot after the change
  changedKeys: (keyof T)[]   // which fields changed
  userId:     string | null
  userName:   string | null
  createdAt:  string         // ISO timestamp
  label?:     string         // optional human label, e.g. "Published"
}

// ── Capability interface ──────────────────────────────────────────────────

export type RevisionsCapable = {
  /** Whether this entity version-histories all fields or only explicit fields */
  revisionMode: 'full' | 'tracked'
  /** Fields excluded from diff (e.g. updated_at) */
  excludeFromDiff?: string[]
}

// ── Repository interface ──────────────────────────────────────────────────

export type RevisionsRepository<T> = {
  getRevisions(entityType: string, entityId: string): Promise<EntityRevision<T>[]>
  getRevision(revisionId: string): Promise<EntityRevision<T> | null>
  createRevision(rev: Omit<EntityRevision<T>, 'id' | 'version' | 'createdAt'>): Promise<EntityRevision<T>>
  restoreRevision(revisionId: string, userId: string): Promise<void>
}

// ── Diff utility ──────────────────────────────────────────────────────────

export function diffEntities<T extends Record<string, unknown>>(
  before: T,
  after:  T,
  exclude: string[] = [],
): { before: Partial<T>; after: Partial<T>; changedKeys: (keyof T)[] } {
  const changedKeys: (keyof T)[] = []
  const beforeDiff: Partial<T>  = {}
  const afterDiff:  Partial<T>  = {}

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)])
  for (const key of allKeys) {
    if (exclude.includes(key)) continue
    const a = before[key]
    const b = after[key]
    // Simple deep comparison via JSON — sufficient for plain DTO objects
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changedKeys.push(key as keyof T)
      beforeDiff[key as keyof T] = a as T[keyof T]
      afterDiff[key as keyof T]  = b as T[keyof T]
    }
  }

  return { before: beforeDiff, after: afterDiff, changedKeys }
}

// ── Display helpers ───────────────────────────────────────────────────────

export function formatRevisionLabel(rev: EntityRevision<unknown>): string {
  if (rev.label) return rev.label
  const fields = rev.changedKeys.slice(0, 2).join(', ')
  const more = rev.changedKeys.length > 2 ? ` +${rev.changedKeys.length - 2} more` : ''
  return `Changed ${fields}${more}`
}
