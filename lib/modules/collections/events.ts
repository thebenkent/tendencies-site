export const COLLECTION_EVENTS = {
  PRODUCT_ATTACHED:  'collection.product_attached',
  PRODUCT_DETACHED:  'collection.product_detached',
  PRODUCT_REORDERED: 'collection.product_reordered',
} as const

export type CollectionEventType = typeof COLLECTION_EVENTS[keyof typeof COLLECTION_EVENTS]
