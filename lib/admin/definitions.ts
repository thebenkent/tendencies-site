import type { ComponentType, ReactNode } from 'react'
import type { Permission } from './permissions'
import type { SortState } from '@/components/admin/crud/types'
import type { AdminForm } from './form'
import type { RelationshipDefinition } from './relationships/definition'
import type { RuntimeExtension } from './extensions/definition'

// ── Field schema ──────────────────────────────────────────────────────────

export type FieldComponent =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'date'
  | 'datetime'
  | 'colour'
  | 'slug'
  | 'image'
  | 'repeater'

export type SelectOption = { label: string; value: string; disabled?: boolean }

type BaseFieldSchema = {
  key:          string
  label:        string
  required?:    boolean
  disabled?:    boolean
  hint?:        string
  placeholder?: string
  // Which editor tab this field belongs to (if editor uses tabs)
  tab?:         string
  // Validation
  minLength?:   number
  maxLength?:   number
  min?:         number
  max?:         number
}

export type TextFieldSchema = BaseFieldSchema & {
  component: 'text'
  type?:     'text' | 'email' | 'url' | 'tel'
}

export type TextAreaFieldSchema = BaseFieldSchema & {
  component: 'textarea'
  rows?:     number
}

export type NumberFieldSchema = BaseFieldSchema & {
  component: 'number'
  step?:     number
  prefix?:   string
  suffix?:   string
}

export type SelectFieldSchema = BaseFieldSchema & {
  component: 'select'
  options:   SelectOption[] | (() => SelectOption[])
}

export type RadioFieldSchema = BaseFieldSchema & {
  component: 'radio'
  options:   SelectOption[]
  layout?:   'vertical' | 'horizontal'
}

export type CheckboxFieldSchema = BaseFieldSchema & {
  component:    'checkbox'
  description?: string
}

export type ToggleFieldSchema = BaseFieldSchema & {
  component:    'toggle'
  description?: string
}

export type DateFieldSchema = BaseFieldSchema & {
  component: 'date' | 'datetime'
  minDate?:  string
  maxDate?:  string
}

export type ColourFieldSchema = BaseFieldSchema & {
  component: 'colour'
}

export type SlugFieldSchema = BaseFieldSchema & {
  component:      'slug'
  prefix?:        string
  autoSlugFrom?:  string   // key of sibling field to auto-generate from
}

export type ImageFieldSchema = BaseFieldSchema & {
  component: 'image'
  aspect?:   'square' | 'landscape' | 'portrait'
}

export type RepeaterFieldSchema = BaseFieldSchema & {
  component:  'repeater'
  itemFields: FieldSchema[]
  maxItems?:  number
  addLabel?:  string
}

export type FieldSchema =
  | TextFieldSchema
  | TextAreaFieldSchema
  | NumberFieldSchema
  | SelectFieldSchema
  | RadioFieldSchema
  | CheckboxFieldSchema
  | ToggleFieldSchema
  | DateFieldSchema
  | ColourFieldSchema
  | SlugFieldSchema
  | ImageFieldSchema
  | RepeaterFieldSchema

// ── Editor tab ────────────────────────────────────────────────────────────

export type EditorTabDefinition = {
  key:      string
  label:    string
  /** Schema-driven fields. Rendered via FieldRenderer. */
  fields?:  FieldSchema[]
  /**
   * Custom render function — takes precedence over fields[].
   * Use for tabs that require complex UIs (e.g. BannerManager, AttributeManager).
   */
  content?: (form: AdminForm<Record<string, unknown>>) => ReactNode
}

// ── Column definition ─────────────────────────────────────────────────────

export type ColumnDefinition<T> = {
  key:        string
  label:      string
  sortable?:  boolean
  width?:     string
  className?: string
  render:     (row: T) => React.ReactNode
}

// ── Filter definition ─────────────────────────────────────────────────────

export type FilterDefinition = {
  key:      string
  label:    string
  type:     'select' | 'toggle'
  options?: SelectOption[]
}

// ── Row action ────────────────────────────────────────────────────────────

export type ActionDefinition<T> = {
  key:       string
  label:     string
  icon?:     React.ReactNode
  variant?:  'default' | 'danger'
  hidden?:   (row: T) => boolean
  onClick:   (row: T) => void
  permission?: Permission
}

// ── Entity definition ─────────────────────────────────────────────────────

export type EntityDefinition<T extends Record<string, unknown> = Record<string, unknown>> = {
  // Identity
  name:        string       // singular: "Campaign"
  namePlural:  string       // plural:   "Campaigns"
  icon:        ComponentType<{ className?: string }>

  // Routing key in row (used as URL key, e.g. "id")
  rowKey: (row: T) => string

  // Table
  columns:          ColumnDefinition<T>[]
  defaultSort?:     SortState

  // Search
  searchable?:      boolean
  searchPlaceholder?: string
  searchKeys?:      (keyof T)[]

  // Filters
  filters?:         FilterDefinition[]

  // Permissions
  permissions?: {
    create?:    Permission
    update?:    Permission
    delete?:    Permission
    duplicate?: Permission
    archive?:   Permission
  }

  // Editor
  editorTitle?:     (row: T | null) => string
  editorWidth?:     'sm' | 'md' | 'lg'
  editorTabs?:      EditorTabDefinition[]
  // Flat fields mode (no tabs)
  editorFields?:    FieldSchema[]

  // Row actions beyond default edit/delete
  extraActions?:    ActionDefinition<T>[]

  // Empty state
  emptyTitle?:      string
  emptyDescription?: string

  // Plural entity label for delete confirmation
  deleteConsequence?: string

  /**
   * Relationships — each becomes an automatic editor tab.
   *
   * Each RelationshipDefinition is self-contained: it carries both config
   * (columns, layout, permissions, empty state) and service callbacks
   * (fetch, search, attach, detach, reorder).
   *
   * CRUDPage renders one tab per relationship, in tabOrder, after the
   * editorTabs. Plugins can contribute additional relationships via
   * registerRelationship(entityKey, def) without editing this file.
   *
   * Example:
   *   relationships: [
   *     collectionsRelationship,   // → "Collections" tab
   *     productsRelationship,      // → "Products" tab
   *     assetsRelationship,        // → "Assets" tab
   *   ]
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relationships?: RelationshipDefinition<any>[]

  /**
   * Extensions — the primary future extension point.
   *
   * Each RuntimeExtension contributes one or more of:
   *   editorTabs, toolbarActions, rowActions, widgets, metrics,
   *   validators, detailPanels, activityPanels, commands, relationships
   *
   * The runtime composition engine (useExtensionComposer) collects all
   * contributions from inline extensions AND any registered via
   * registerExtension(ext) in plugins, then merges them into the UI.
   *
   * Extensions supersede direct EntityDefinition properties for new
   * capabilities — avoid adding new top-level fields to this type.
   *
   * Example:
   *   extensions: [
   *     relationshipExtension(collectionsRelationship, { priority: 10 }),
   *     validationExtension([slugValidator, dateRangeValidator]),
   *     toolbarExtension([publishAction, archiveAction]),
   *     metricsExtension([orderCountMetric]),
   *   ]
   */
  extensions?: RuntimeExtension[]
}
