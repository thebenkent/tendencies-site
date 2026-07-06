/**
 * RuntimeExtension — the core contribution type for the Extension Framework.
 *
 * An extension is a self-contained bundle of contributions:
 *   editorTabs, toolbarActions, rowActions, widgets, metrics,
 *   validators, detailPanels, activityPanels, commands, relationships
 *
 * Extensions are collected by the runtime composition engine and merged
 * into the CRUD UI automatically — no module-specific wiring required.
 *
 * Any combination of contributions may be included in a single extension.
 * Extensions without an `entity` key contribute globally.
 *
 * Examples:
 *
 *   // Relationship as extension
 *   relationshipExtension(collectionsRelationship, { priority: 10 })
 *
 *   // Custom analytics tab
 *   analyticsExtension({ entity: 'campaigns', priority: 100 })
 *
 *   // Global activity panel on every entity
 *   activityExtension()
 */

import type { ReactNode, ComponentType } from 'react'
import type { FieldSchema } from '@/lib/admin/definitions'
import type { Permission } from '@/lib/admin/permissions'
import type { AdminForm } from '@/lib/admin/form'
import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'

// ─────────────────────────────────────────────────────────────────────────────
// Contribution types
// ─────────────────────────────────────────────────────────────────────────────

// ── Editor tab ────────────────────────────────────────────────────────────

export type EditorTabContribution = {
  key:         string
  label:       string
  icon?:       ComponentType<{ className?: string }>
  /** Lower = appears earlier after schema tabs */
  order?:      number
  content:     (form: AdminForm<Record<string, unknown>>) => ReactNode
  featureFlag?: string
  permission?:  Permission
}

// ── Toolbar action (editor footer) ────────────────────────────────────────

export type ToolbarActionContribution = {
  id:       string
  label:    string
  icon?:    ComponentType<{ className?: string }>
  variant?: 'default' | 'primary' | 'danger'
  order?:   number
  /** Hide based on current entity data */
  hidden?:  (data: Record<string, unknown>) => boolean
  /** Disable based on current entity data */
  disabled?: (data: Record<string, unknown>) => boolean
  onClick:  (data: Record<string, unknown>, tenantId: string) => Promise<void> | void
  permission?:  Permission
  featureFlag?: string
}

// ── Row action (table row actions menu) ───────────────────────────────────

export type RowActionContribution<T = Record<string, unknown>> = {
  id:       string
  label:    string
  icon?:    ComponentType<{ className?: string }>
  variant?: 'default' | 'danger'
  order?:   number
  hidden?:  (row: T) => boolean
  onClick:  (row: T) => Promise<void> | void
  permission?: Permission
}

// ── Dashboard widget ──────────────────────────────────────────────────────

export type WidgetContribution = {
  id:         string
  label:      string
  location:   'metrics' | 'operations' | 'charts' | 'activity'
  size?:      'sm' | 'md' | 'lg'
  /** Lower = appears first within its location */
  priority?:  number
  component:  ComponentType<{ tenantId: string }>
  featureFlag?: string
  permission?:  Permission
}

// ── Metric ────────────────────────────────────────────────────────────────

export type MetricContribution = {
  id:       string
  label:    string
  category?: string
  format?:  'currency' | 'number' | 'percent' | 'duration'
  load:     (tenantId: string) => Promise<{
    current:     number
    previous?:   number
    trend?:      'up' | 'down' | 'flat'
    trendLabel?: string
  }>
  featureFlag?: string
}

// ── Validator ─────────────────────────────────────────────────────────────

export type ValidatorContribution = {
  id:     string
  label:  string
  /** When to run — defaults to 'always' */
  when?:  'create' | 'update' | 'always'
  /**
   * Returns issues. An empty array means validation passed.
   * 'error' severity blocks save. 'warning' is informational.
   */
  validate: (data: Record<string, unknown>, tenantId: string) => Promise<ValidationIssue[]>
}

export type ValidationIssue = {
  /** If set, maps to a specific form field (sets form.errors[field]) */
  field?:   string
  message:  string
  severity: 'error' | 'warning'
}

// ── Activity panel section ────────────────────────────────────────────────

export type ActivityPanelContribution = {
  id:      string
  label:   string
  order?:  number
  content: (entityId: string, tenantId: string) => ReactNode
  featureFlag?: string
}

// ── Detail panel (editor right sidebar section) ───────────────────────────

export type DetailPanelContribution = {
  id:      string
  label:   string
  order?:  number
  content: (form: AdminForm<Record<string, unknown>>, tenantId: string) => ReactNode
  featureFlag?: string
  permission?:  Permission
}

// ── Command palette command ───────────────────────────────────────────────

export type CommandContribution = {
  id:       string
  label:    string
  icon?:    ComponentType<{ className?: string }>
  keywords?: string[]
  /** Hide command based on current entity data */
  hidden?:  (data: Record<string, unknown>) => boolean
  /** Called when command selected in palette */
  onClick:  (data: Record<string, unknown>, tenantId: string) => Promise<void> | void
  permission?: Permission
}

// ── Extension contributions object ────────────────────────────────────────

export type ExtensionContributions = {
  /** Additional editor tabs (appended after schema tabs and relationship tabs) */
  editorTabs?:     EditorTabContribution[]
  /** Buttons rendered in the CRUDEditor footer between Delete and Cancel */
  toolbarActions?: ToolbarActionContribution[]
  /** Items added to the table row actions menu */
  rowActions?:     RowActionContribution[]
  /** Dashboard widgets registered automatically */
  widgets?:        WidgetContribution[]
  /** Metrics contributed to the analytics dashboard */
  metrics?:        MetricContribution[]
  /** Validation rules run before every save */
  validators?:     ValidatorContribution[]
  /** Sections contributed to the activity log panel */
  activityPanels?: ActivityPanelContribution[]
  /** Sections in the editor right-hand detail panel */
  detailPanels?:   DetailPanelContribution[]
  /** Commands contributed to the command palette (entity-context) */
  commands?:       CommandContribution[]
  /**
   * Relationships. These are auto-converted to editor tabs by the runtime,
   * identical to EntityDefinition.relationships — just contributed as extensions
   * instead of declared inline. Use this to add relationships from plugins
   * without modifying the target entity's definition file.
   */
  relationships?:  RelationshipDefinition[]
}

// ─────────────────────────────────────────────────────────────────────────────
// RuntimeExtension
// ─────────────────────────────────────────────────────────────────────────────

export type RuntimeExtension = {
  /**
   * Unique identifier. Must be stable across renders.
   * Convention: 'namespace:name', e.g. 'relationship:collections', 'seo:meta'.
   */
  id: string

  /**
   * Entity key this extension targets, e.g. 'campaigns', 'products'.
   * When omitted, contributions apply to ALL entities (global extension).
   * Matches EntityRegistration.key and EntityDefinition.namePlural.toLowerCase().
   */
  entity?: string

  /**
   * Priority — lower numbers appear first.
   * Matches the convention used by SearchRegistry, WidgetRegistry, MetricsRegistry.
   * Recommended ranges:
   *   0–19:   core runtime contributions (relationships, workflow)
   *   20–49:  primary module tabs (general, content, ordering)
   *   50–99:  secondary tabs (analytics, SEO, settings)
   *   100+:   plugin/third-party contributions
   */
  priority: number

  /**
   * Feature flag ID — extension is inactive unless this flag is enabled.
   * Uses the existing FeatureFlags infrastructure.
   */
  featureFlag?: string

  /** The contributions this extension provides */
  contributes: ExtensionContributions
}
