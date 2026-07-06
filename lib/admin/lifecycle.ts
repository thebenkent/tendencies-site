/**
 * Draft/Publish Lifecycle Framework.
 *
 * Generic lifecycle interfaces — no entity-specific logic.
 * Entities opt in by implementing LifecycleCapable and declaring
 * their valid transitions in a LifecyclePolicy.
 *
 * Statuses:
 *   draft      — created, not yet ready for review
 *   review     — submitted for approval
 *   published  — live / active
 *   archived   — removed from active view, preserved in history
 *   hidden     — unpublished without archiving (admin-only visibility)
 *   scheduled  — will transition to 'published' at publish_at
 */

// ── Status ────────────────────────────────────────────────────────────────

export type LifecycleStatus =
  | 'draft'
  | 'review'
  | 'published'
  | 'archived'
  | 'hidden'
  | 'scheduled'

// ── Status labels + styles for the UI layer ───────────────────────────────

export const LIFECYCLE_LABELS: Record<LifecycleStatus, string> = {
  draft:     'Draft',
  review:    'In Review',
  published: 'Published',
  archived:  'Archived',
  hidden:    'Hidden',
  scheduled: 'Scheduled',
}

export const LIFECYCLE_VARIANTS: Record<
  LifecycleStatus,
  'default' | 'success' | 'warning' | 'error' | 'outline'
> = {
  draft:     'outline',
  review:    'warning',
  published: 'success',
  archived:  'default',
  hidden:    'default',
  scheduled: 'warning',
}

// ── Entity interface ──────────────────────────────────────────────────────

export type LifecycleCapable = {
  lifecycle_status: LifecycleStatus
  publish_at?:      string | null    // ISO datetime for scheduled transition
  published_at?:    string | null
  archived_at?:     string | null
  updated_by?:      string | null
}

// ── Transition ────────────────────────────────────────────────────────────

export type LifecycleTransition = {
  from:    LifecycleStatus | LifecycleStatus[]
  to:      LifecycleStatus
  label:   string                     // action label, e.g. "Publish"
  confirm?: string                    // optional confirmation prompt
  /** Permission required to perform this transition */
  permission?: string
}

// ── Policy ────────────────────────────────────────────────────────────────

export type LifecyclePolicy = {
  initial:     LifecycleStatus
  transitions: LifecycleTransition[]
}

/** Standard policy — used by Campaigns, Collections, Products unless overridden. */
export const STANDARD_LIFECYCLE_POLICY: LifecyclePolicy = {
  initial: 'draft',
  transitions: [
    { from: 'draft',     to: 'review',    label: 'Submit for Review' },
    { from: 'review',    to: 'draft',     label: 'Return to Draft' },
    { from: ['draft', 'review'], to: 'published', label: 'Publish', permission: 'campaigns.publish' },
    { from: 'published', to: 'hidden',    label: 'Unpublish' },
    { from: ['draft', 'review', 'published', 'hidden'], to: 'archived', label: 'Archive', confirm: 'Archive this item? It will be removed from active views.' },
    { from: ['draft', 'review'], to: 'scheduled', label: 'Schedule', permission: 'campaigns.publish' },
    { from: 'scheduled', to: 'draft',     label: 'Unschedule' },
    { from: 'archived',  to: 'draft',     label: 'Restore to Draft' },
  ],
}

// ── Helpers ───────────────────────────────────────────────────────────────

export function getAvailableTransitions(
  status:  LifecycleStatus,
  policy:  LifecyclePolicy = STANDARD_LIFECYCLE_POLICY,
): LifecycleTransition[] {
  return policy.transitions.filter((t) => {
    const froms = Array.isArray(t.from) ? t.from : [t.from]
    return froms.includes(status)
  })
}

export function canTransition(
  from:   LifecycleStatus,
  to:     LifecycleStatus,
  policy: LifecyclePolicy = STANDARD_LIFECYCLE_POLICY,
): boolean {
  return getAvailableTransitions(from, policy).some((t) => t.to === to)
}

export function isPubliclyVisible(status: LifecycleStatus): boolean {
  return status === 'published'
}

export function isEditable(status: LifecycleStatus): boolean {
  return status !== 'archived'
}
