/**
 * RelationshipDefinition — the central config type for the Relationship Framework.
 *
 * A RelationshipDefinition is fully self-contained: it carries both the display
 * configuration (columns, layout, permissions, empty state) AND the service
 * callbacks (fetch, search, attach, detach, reorder).
 *
 * This makes relationships a first-class runtime concept — identical to
 * FieldSchema, FilterDefinition, and ColumnDefinition — and enables automatic
 * rendering by CRUDPage without any module-specific UI code.
 *
 * Declaration (in a module definition file):
 *
 *   export const collectionsRelationship: RelationshipDefinition<CollectionRow> = {
 *     // Config
 *     entity:        collectionDefinition,
 *     relation:      'collections',
 *     label:         'Collections',
 *     labelSingular: 'Collection',
 *     attachable:    true,
 *     detachable:    true,
 *     sortable:      true,
 *     permissions: { attach: Permissions.COLLECTIONS_CREATE, detach: Permissions.COLLECTIONS_DELETE },
 *
 *     // Service (server actions — called by RelationManager automatically)
 *     fetch:    getCampaignCollectionsAction,
 *     search:   searchCollectionsAction,
 *     attach:   attachCollectionAction,
 *     detach:   detachCollectionAction,
 *     reorder:  reorderCollectionsAction,
 *   }
 *
 * Registration (in EntityDefinition):
 *
 *   export const campaignDefinition: EntityDefinition<CampaignAdminData> = {
 *     ...
 *     relationships: [collectionsRelationship, productsRelationship],
 *   }
 *
 * CRUDPage automatically creates one editor tab per relationship.
 * No manual <RelationManager /> wiring needed.
 */

import type { ComponentType } from 'react'
import type { EntityDefinition, ColumnDefinition, FieldSchema } from '@/lib/admin/definitions'
import type { Permission } from '@/lib/admin/permissions'
import type { AdminEventType } from '@/lib/admin/dispatcher'

// ── RelationItem ──────────────────────────────────────────────────────────
//
// The child entity row as returned by the fetch callback.
// When sortable, return items pre-sorted by sortKey.
// Junction metadata is flattened into the child object.

export type RelationItem<Child extends Record<string, unknown> = Record<string, unknown>> = Child

// ── Service callback types ─────────────────────────────────────────────────

/** Fetch all related items for a parent */
export type FetchRelationFn<Child extends Record<string, unknown>> =
  (parentId: string, tenantId: string) => Promise<RelationItem<Child>[]>

/**
 * Search candidates (items not yet attached) for the picker.
 *
 * parentId is available for context-aware searches — e.g. scoping a product
 * search to the collection's campaign without a separate lookup.
 * Implementations that don't need it may safely ignore the parameter.
 */
export type SearchRelationFn<Child extends Record<string, unknown>> =
  (query: string, tenantId: string, excludeIds: string[], parentId?: string) => Promise<Child[]>

/** Attach one or more children to the parent */
export type AttachRelationFn =
  (parentId: string, childIds: string[], tenantId: string) => Promise<void>

/** Detach a single child from the parent */
export type DetachRelationFn =
  (parentId: string, childId: string, tenantId: string) => Promise<void>

/** Persist a new item order for the related items */
export type ReorderRelationFn =
  (parentId: string, orderedIds: string[], tenantId: string) => Promise<void>

/** Update junction metadata for a single related item */
export type UpdateMetadataFn =
  (parentId: string, childId: string, meta: Record<string, unknown>, tenantId: string) => Promise<void>

// ── RelationshipDefinition ────────────────────────────────────────────────

export type RelationshipDefinition<
  Child extends Record<string, unknown> = Record<string, unknown>,
> = {
  // ── Child entity ──────────────────────────────────────────────────────
  /** Full EntityDefinition for the child type — drives columns, search config, icons */
  entity: EntityDefinition<Child>

  // ── Identity ──────────────────────────────────────────────────────────
  /** Unique key for this relationship within the parent entity, e.g. "collections" */
  relation: string
  /** Plural display label used in tab and toolbar, e.g. "Collections" */
  label: string
  /** Singular display label used in actions, e.g. "Collection" */
  labelSingular: string

  // ── Tab placement ─────────────────────────────────────────────────────
  /**
   * Order within the auto-generated relationship tabs (lower = earlier).
   * If omitted, tabs appear in declaration order.
   */
  tabOrder?: number
  /**
   * Optional group label shown as a separator in a future grouped tab UI.
   * Not rendered in the current flat tab bar.
   */
  tabGroup?: string

  // ── Operations ────────────────────────────────────────────────────────
  /** Show Attach button and picker — default false */
  attachable?: boolean
  /** Show Remove action on rows — default false */
  detachable?: boolean
  /** Enable drag-and-drop reorder — default false */
  sortable?: boolean
  /** Field key in Child data that holds the sort position, e.g. 'sort_order' */
  sortKey?: string & keyof Child

  // ── Layout ────────────────────────────────────────────────────────────
  /** Render mode — 'table' (default) or 'card' */
  layout?: 'table' | 'card'

  // ── Columns ───────────────────────────────────────────────────────────
  /**
   * Columns to show in the relation table.
   * Defaults to entity.columns. Override for a focused subset.
   */
  columns?: ColumnDefinition<Child>[]

  /**
   * Fields to show on each relation card (card layout only).
   * Defaults to the first 3 entity columns.
   */
  cardFields?: Array<{
    key:     string & keyof Child
    label?:  string
    render?: (value: Child[string & keyof Child], row: Child) => React.ReactNode
  }>

  /**
   * Return a thumbnail URL for card image display.
   * Receives the child row; return null to show no image.
   */
  cardImage?: (row: Child) => string | null | undefined

  // ── Metadata ──────────────────────────────────────────────────────────
  /**
   * Additional junction fields (e.g. quantity, discount, featured).
   * Rendered in a metadata editor SlideOver via the existing FieldRenderer.
   * Values are merged into the Child row before being passed to callbacks.
   */
  metadataFields?: FieldSchema[]

  /**
   * Extract metadata from a row to populate the metadata editor form.
   */
  getMetadata?: (row: Child) => Record<string, unknown>

  // ── Permissions ───────────────────────────────────────────────────────
  /**
   * Permission gates — matching the EntityDefinition.permissions pattern.
   * If a permission is omitted, that operation is permitted for all roles.
   */
  permissions?: {
    attach?:         Permission
    detach?:         Permission
    reorder?:        Permission
    updateMetadata?: Permission
  }

  // ── Events ────────────────────────────────────────────────────────────
  /**
   * Override the generic RELATION_ATTACHED / RELATION_DETACHED / RELATION_REORDERED
   * events with module-specific ones for finer-grained audit filtering.
   */
  events?: {
    attached?:  AdminEventType
    detached?:  AdminEventType
    reordered?: AdminEventType
  }

  // ── Empty state ───────────────────────────────────────────────────────
  emptyTitle?:       string
  emptyDescription?: string
  emptyIcon?:        ComponentType<{ className?: string }>

  // ── Picker ────────────────────────────────────────────────────────────
  pickerTitle?:             string   // defaults to "Attach {labelSingular}"
  pickerSearchPlaceholder?: string   // defaults to "Search {label}…"
  pickerEmptyText?:         string   // defaults to "No {label} found"

  // ── Pagination ────────────────────────────────────────────────────────
  /** Items per page in the relation table (default: 50) */
  pageSize?: number

  // ── Service callbacks ─────────────────────────────────────────────────
  //
  // Callbacks pointing to server actions (or service function wrappers).
  // Bundled in the definition so that CRUDPage can render RelationManager
  // automatically — no per-module wiring needed.
  //
  // Convention: point these at 'use server' action files.
  //   fetch:   getCampaignCollectionsAction,
  //   search:  searchCollectionsAction,
  //   attach:  attachCollectionAction,
  //   detach:  detachCollectionAction,
  //   reorder: reorderCollectionsAction,

  /** Fetch all related items for a given parent + tenant */
  fetch:    FetchRelationFn<Child>
  /** Search candidates for the attach picker (excludes already-attached IDs) */
  search:   SearchRelationFn<Child>
  /** Attach one or more children to the parent */
  attach:   AttachRelationFn
  /** Detach a single child from the parent */
  detach:   DetachRelationFn
  /** Persist a new order (optional — only needed when sortable: true) */
  reorder?: ReorderRelationFn
  /** Update junction metadata for a single child (optional) */
  updateMetadata?: UpdateMetadataFn
}
