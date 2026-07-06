/**
 * Product domain event name constants.
 *
 * Used as the `type` argument to dispatch() throughout the products module.
 * All names must exist in AdminEvents (lib/admin/dispatcher.ts).
 */

import { AdminEvents } from '@/lib/admin/dispatcher'

export const PRODUCT_EVENTS = {
  CREATED:          AdminEvents.PRODUCT_CREATED,
  UPDATED:          AdminEvents.PRODUCT_UPDATED,
  DELETED:          AdminEvents.PRODUCT_DELETED,
  ARCHIVED:         AdminEvents.PRODUCT_ARCHIVED,
  PUBLISHED:        AdminEvents.PRODUCT_PUBLISHED,
  DUPLICATED:       AdminEvents.PRODUCT_DUPLICATED,
  VARIANT_ADDED:    AdminEvents.PRODUCT_VARIANT_ADDED,
  VARIANT_REMOVED:  AdminEvents.PRODUCT_VARIANT_REMOVED,
  BRANDING_ADDED:   AdminEvents.PRODUCT_BRANDING_ADDED,
  BRANDING_REMOVED: AdminEvents.PRODUCT_BRANDING_REMOVED,
} as const
