import type { ReactNode } from 'react'
import type { AdminForm } from '@/lib/admin/form'

// ── Column definitions ────────────────────────────────────────
export type CRUDColumn<T> = {
  key:        string
  label:      string
  sortable?:  boolean
  width?:     string
  className?: string
  render:     (row: T) => ReactNode
}

// ── Filter definitions ────────────────────────────────────────
export type FilterOption = { label: string; value: string }

export type CRUDFilter = {
  key:         string
  label:       string
  type:        'select' | 'toggle' | 'date_range'
  options?:    FilterOption[]
}

// ── Sort state ────────────────────────────────────────────────
export type SortState = { key: string; dir: 'asc' | 'desc' } | null

// ── Row action ───────────────────────────────────────────────
export type RowAction<T> = {
  key:      string
  label:    string
  icon?:    ReactNode
  variant?: 'default' | 'danger'
  hidden?:  (row: T) => boolean
  onClick:  (row: T) => void
}

// ── Bulk action ──────────────────────────────────────────────
export type BulkAction<T> = {
  key:     string
  label:   string
  variant?: 'default' | 'danger'
  onClick: (rows: T[]) => Promise<void> | void
}

// ── Editor tab ───────────────────────────────────────────────
export type EditorTab<T extends Record<string, unknown>> = {
  key:      string
  label:    string
  content:  (form: AdminForm<T>) => ReactNode
}

// ── Main CRUD config ─────────────────────────────────────────
export type CRUDConfig<T extends Record<string, unknown>> = {
  // Identity
  entity:          string      // singular: "campaign"
  entityPlural:    string      // plural:   "campaigns"

  // Table
  columns:         CRUDColumn<T>[]
  rowKey:          (row: T) => string

  // Search
  searchable?:     boolean
  searchPlaceholder?: string
  searchKeys?:     (keyof T)[]

  // Filters
  filters?:        CRUDFilter[]

  // Sort
  defaultSort?:    SortState

  // Permissions
  canCreate?:      boolean
  canEdit?:        boolean
  canDelete?:      boolean
  canDuplicate?:   boolean
  canArchive?:     boolean

  // Editor
  editorTitle?:    (row: T | null) => string  // null = new
  editorWidth?:    'sm' | 'md' | 'lg'
  editorTabs?:     EditorTab<T>[]

  // Bulk
  bulkActions?:    BulkAction<T>[]

  // Row actions (appended to default edit/delete)
  extraRowActions?: RowAction<T>[]

  // Empty state
  emptyTitle?:     string
  emptyDescription?: string
}

// ── Active filter state ──────────────────────────────────────
export type FilterState = Record<string, string>

// ── Page state passed to server pagination ────────────────────
export type PageState = {
  page:     number
  pageSize: number
  sort:     SortState
  search:   string
  filters:  FilterState
}
