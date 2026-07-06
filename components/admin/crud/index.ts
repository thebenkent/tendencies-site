export { default as CRUDPage }         from './CRUDPage'
export { default as CRUDTable }        from './CRUDTable'
export { default as CRUDToolbar }      from './CRUDToolbar'
export { default as CRUDEditor }       from './CRUDEditor'
export { default as CRUDDeleteDialog } from './CRUDDeleteDialog'
export { default as CRUDPagination }   from './CRUDPagination'
export { default as CRUDActions }      from './CRUDActions'

// Unified table (preferred over CRUDTable for new pages)
export { default as AdminTable }       from '@/components/admin/AdminTable'
export type { AdminTableColumn, AdminTableSort, AdminTableRowAction } from '@/components/admin/AdminTable'

// Entity definition types (schema-driven CRUD)
export type {
  EntityDefinition,
  FieldSchema,
  EditorTabDefinition,
  ColumnDefinition,
  FilterDefinition,
  ActionDefinition,
  SelectOption as DefinitionSelectOption,
} from '@/lib/admin/definitions'

// Legacy CRUD config types
export type {
  CRUDConfig,
  CRUDColumn,
  CRUDFilter,
  FilterOption,
  SortState,
  RowAction,
  BulkAction,
  EditorTab,
  FilterState,
  PageState,
} from './types'
