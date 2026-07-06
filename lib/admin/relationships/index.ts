// Type exports
export type {
  RelationshipDefinition,
  RelationItem,
  FetchRelationFn,
  SearchRelationFn,
  AttachRelationFn,
  DetachRelationFn,
  ReorderRelationFn,
  UpdateMetadataFn,
} from './definition'

// Server-side helpers (call from admin service files, not from components)
export {
  executeAttach,
  executeDetach,
  executeReorder,
  executeBulkDetach,
} from './helpers'
