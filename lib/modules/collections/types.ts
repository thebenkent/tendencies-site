// Re-export admin DTO as the canonical collection type for this module.
// The unified CollectionAdminData supersedes the old split TableRow/EditorData approach.
export type { CollectionAdminData, COLLECTION_DEFAULTS } from './admin-service'
export type { CollectionProductRow } from './repository'
