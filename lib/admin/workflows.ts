/**
 * Workflow Adapter Interfaces.
 *
 * Consistent abstraction over the state machines for different entity types.
 * Each entity (campaign, order, production job, supplier RFQ) has its own
 * states and transitions — adapters normalise them to a common interface
 * so generic UI components (timeline, action buttons, status badges) work
 * across all entity types without entity-specific logic.
 *
 * Concrete adapters are implemented in Phase 7B next to each entity module.
 */

// ── Workflow state ────────────────────────────────────────────────────────

export type WorkflowState = {
  key:         string        // machine-readable state key
  label:       string        // human label
  description?: string
  terminal?:   boolean       // no further transitions possible
  variant:     'default' | 'info' | 'success' | 'warning' | 'error'
}

// ── Workflow transition ───────────────────────────────────────────────────

export type WorkflowTransition = {
  key:         string        // action key, e.g. "approve", "ship", "reject"
  label:       string        // button label
  from:        string | string[]   // state key(s) this transition is valid from
  to:          string        // target state key
  confirm?:    string        // if set, show a confirmation dialog with this text
  fields?:     WorkflowTransitionField[]  // extra inputs required for transition
  permission?: string        // Permission required to perform this transition
}

export type WorkflowTransitionField = {
  key:       string
  label:     string
  type:      'text' | 'textarea' | 'date' | 'select'
  required?: boolean
  options?:  Array<{ label: string; value: string }>
}

// ── Adapter interface ─────────────────────────────────────────────────────

export type WorkflowAdapter<Entity> = {
  /** Entity type this adapter handles */
  entity:      string

  /** All possible states for this workflow */
  states:      WorkflowState[]

  /** All possible transitions */
  transitions: WorkflowTransition[]

  /** Extract the current state key from an entity record */
  getCurrentState: (entity: Entity) => string

  /**
   * Apply a transition. Updates the entity's state fields.
   * Should also dispatch a domain event.
   */
  applyTransition: (
    entity:    Entity,
    transition: WorkflowTransition,
    fields:    Record<string, unknown>,
    userId:    string,
  ) => Promise<void>

  /**
   * Returns transitions available from the entity's current state.
   * May further filter based on entity-specific conditions
   * (e.g. "can't approve if no items").
   */
  availableTransitions: (entity: Entity, userRole?: string) => WorkflowTransition[]
}

// ── Specific workflow state sets (referenced by adapters) ─────────────────

/** Campaign workflow states */
export type CampaignWorkflowKey =
  | 'draft'
  | 'review'
  | 'approved'
  | 'active'
  | 'closing'
  | 'closed'
  | 'archived'

/** Order workflow states */
export type OrderWorkflowKey =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'in_production'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'refunded'
  | 'cancelled'

/** Production job workflow states */
export type ProductionWorkflowKey =
  | 'awaiting_approval'
  | 'approved'
  | 'in_progress'
  | 'quality_check'
  | 'completed'
  | 'rejected'

/** Supplier RFQ workflow states */
export type SupplierRFQWorkflowKey =
  | 'draft'
  | 'sent'
  | 'responded'
  | 'accepted'
  | 'declined'
  | 'expired'

// ── Registry ──────────────────────────────────────────────────────────────

class WorkflowRegistry {
  private readonly _adapters = new Map<string, WorkflowAdapter<unknown>>()

  register<E>(adapter: WorkflowAdapter<E>): this {
    this._adapters.set(adapter.entity, adapter as WorkflowAdapter<unknown>)
    return this
  }

  get<E = unknown>(entity: string): WorkflowAdapter<E> | undefined {
    return this._adapters.get(entity) as WorkflowAdapter<E> | undefined
  }

  all(): WorkflowAdapter<unknown>[] {
    return Array.from(this._adapters.values())
  }
}

export const workflowRegistry = new WorkflowRegistry()

export function registerWorkflowAdapter<E>(adapter: WorkflowAdapter<E>) {
  workflowRegistry.register(adapter)
}
