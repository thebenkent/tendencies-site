/**
 * Plugin Architecture.
 *
 * The single entry point for all registration APIs.
 * Future modules and integrations call functions from here to extend
 * the admin without touching core code.
 *
 * Extension points:
 *   registerEntity()         — CRUD entity (adds nav + search + permissions)
 *   registerModule()         — custom admin page (adds nav)
 *   registerSearchProvider() — contributes to command palette search
 *   registerWidget()         — contributes to dashboard
 *   registerMetric()         — contributes to analytics
 *   registerSettingsGroup()  — contributes a settings section
 *   registerImporter()       — contributes a CSV/XLSX import flow
 *   registerExporter()       — contributes an export format
 *   registerJob()            — declares a background job type
 *   registerWorkflowAdapter()— registers workflow state machine for an entity
 *
 * Automation registrations (future):
 *   registerAutomation()     — declarative automation trigger → action
 */

// ── Re-export all registration functions from one place ───────────────────

export { registerEntity, registerModule }       from './registry/entity-registry'
export { registerSearchProvider }               from './registry/search-registry'
export { registerWidget }                       from './registry/widget-registry'
export { registerMetric }                       from './registry/metrics-registry'
export { registerSettingsGroup }                from './registry/settings-registry'
export { registerRelationship }                 from './registry/relationship-registry'
export { registerExtension, unregisterExtension } from './extensions/registry'
export { registerImporter, registerExporter }   from './importexport'
export { registerJob }                          from './jobs'
export { registerWorkflowAdapter }              from './workflows'

// ── Automation (stub — wired in a future phase) ───────────────────────────

export type AutomationTrigger =
  | { type: 'event'; eventType: string }
  | { type: 'schedule'; cron: string }
  | { type: 'webhook'; path: string }

export type AutomationAction =
  | { type: 'notify'; channel: 'email' | 'slack'; template: string }
  | { type: 'job'; jobType: string; input: Record<string, unknown> }
  | { type: 'webhook'; url: string; method: 'POST' | 'PATCH' }
  | { type: 'function'; fn: (payload: unknown) => Promise<void> }

export type AutomationDefinition = {
  key:       string
  label:     string
  trigger:   AutomationTrigger
  actions:   AutomationAction[]
  enabled?:  boolean
}

class AutomationRegistry {
  private readonly _automations = new Map<string, AutomationDefinition>()

  register(automation: AutomationDefinition): this {
    this._automations.set(automation.key, automation)
    return this
  }

  all(): AutomationDefinition[] {
    return Array.from(this._automations.values())
  }

  get(key: string): AutomationDefinition | undefined {
    return this._automations.get(key)
  }
}

export const automationRegistry = new AutomationRegistry()

export function registerAutomation(automation: AutomationDefinition) {
  automationRegistry.register(automation)
}
