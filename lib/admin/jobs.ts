/**
 * Background Job Framework.
 *
 * Generic task interfaces — no workers are wired here.
 * Job types register themselves; a future job runner (Inngest, Vercel Cron,
 * or a Supabase Edge Function) will pick these up and execute them.
 *
 * This module is the contract layer: it defines what a job looks like,
 * how to enqueue one, and how to query its status.
 */

// ── Status ────────────────────────────────────────────────────────────────

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'

// ── Job record ────────────────────────────────────────────────────────────

export type JobRecord = {
  id:         string
  type:       string
  tenantId:   string
  userId:     string | null
  /** Serialised input — job-type specific */
  input:      Record<string, unknown>
  status:     JobStatus
  progress:   number       // 0–100
  result?:    Record<string, unknown>
  error?:     string
  createdAt:  string
  startedAt?: string
  finishedAt?: string
}

// ── Job definition ────────────────────────────────────────────────────────

export type JobDefinition<Input, Output = unknown> = {
  /** Unique type string, e.g. "products.import", "images.optimise" */
  type:        string
  label:       string
  description?: string
  /** Whether to show this job type in the background jobs UI */
  visible?:    boolean
  /** Schema validation — returns error string or null if valid */
  validate?:   (input: Input) => string | null
  /** The actual work — implemented by the runner, not here */
  run?:        (input: Input, ctx: JobContext) => Promise<Output>
}

export type JobContext = {
  jobId:      string
  tenantId:   string
  userId:     string | null
  /** Report progress 0–100 */
  progress:   (pct: number, message?: string) => Promise<void>
  /** Write a log line without changing status */
  log:        (message: string) => void
  /** Signal early termination */
  signal?:    AbortSignal
}

// ── Registry ──────────────────────────────────────────────────────────────

class JobRegistry {
  private readonly _definitions = new Map<string, JobDefinition<unknown>>()

  register<I, O>(def: JobDefinition<I, O>): this {
    this._definitions.set(def.type, def as JobDefinition<unknown>)
    return this
  }

  get(type: string): JobDefinition<unknown> | undefined {
    return this._definitions.get(type)
  }

  all(): JobDefinition<unknown>[] {
    return Array.from(this._definitions.values())
  }

  visible(): JobDefinition<unknown>[] {
    return this.all().filter((d) => d.visible !== false)
  }
}

export const jobRegistry = new JobRegistry()

export function registerJob<I, O = unknown>(def: JobDefinition<I, O>) {
  jobRegistry.register(def)
}

// ── Well-known job types ───────────────────────────────────────────────────

export const JobTypes = {
  PRODUCTS_IMPORT:      'products.import',
  PRODUCTS_EXPORT:      'products.export',
  IMAGES_OPTIMISE:      'images.optimise',
  ORDERS_EXPORT:        'orders.export',
  ANALYTICS_REPORT:     'analytics.report',
  SUPPLIER_RFQ_SEND:    'supplier.rfq.send',
  CAMPAIGN_PUBLISH:     'campaign.publish',
  INVENTORY_SYNC:       'inventory.sync',
} as const

// ── Enqueueing contract ────────────────────────────────────────────────────

export type EnqueueInput<I = Record<string, unknown>> = {
  type:     string
  tenantId: string
  userId:   string | null
  input:    I
}

/**
 * Stub enqueue function — replaced by an actual implementation when a
 * job runner is wired (Inngest, Supabase Edge Functions, etc.).
 */
export type JobEnqueuer = (job: EnqueueInput) => Promise<string>  // returns jobId

let _enqueue: JobEnqueuer = async () => {
  throw new Error('[JobRegistry] No job runner wired. Call setJobRunner() first.')
}

export function setJobRunner(enqueue: JobEnqueuer) {
  _enqueue = enqueue
}

export function enqueueJob<I = Record<string, unknown>>(job: EnqueueInput<I>): Promise<string> {
  return _enqueue(job as EnqueueInput)
}
