/**
 * Admin event dispatcher.
 *
 * Sits between admin services and the core eventBus.
 * Admin actions dispatch typed domain events; subscribers (audit, notifications,
 * automations, webhooks) react without coupling to business logic.
 *
 * Flow:
 *   AdminService.update(...)
 *     → dispatch(AdminEvents.CAMPAIGN_UPDATED, payload)
 *       → eventBus.emit(...)
 *         → auditSubscriber   (writes merch_activity_log)
 *         → future: notificationSubscriber, webhookSubscriber, ...
 */

import { eventBus, type DomainEvent } from '@/lib/core/events'
import { logActivity, type ActivityEntityType, type ActivityAction } from './audit'

// ── Admin event type catalogue ─────────────────────────────────────────────
export const AdminEvents = {
  // Campaigns
  CAMPAIGN_CREATED:    'admin.campaign.created',
  CAMPAIGN_UPDATED:    'admin.campaign.updated',
  CAMPAIGN_DELETED:    'admin.campaign.deleted',
  CAMPAIGN_DUPLICATED: 'admin.campaign.duplicated',
  CAMPAIGN_PUBLISHED:  'admin.campaign.published',
  CAMPAIGN_ARCHIVED:   'admin.campaign.archived',

  // Campaign Banners
  BANNER_CREATED:      'admin.banner.created',
  BANNER_UPDATED:      'admin.banner.updated',
  BANNER_DELETED:      'admin.banner.deleted',
  BANNER_REORDERED:    'admin.banner.reordered',

  // Campaign Attributes
  ATTRIBUTE_CREATED:   'admin.attribute.created',
  ATTRIBUTE_UPDATED:   'admin.attribute.updated',
  ATTRIBUTE_DELETED:   'admin.attribute.deleted',
  ATTRIBUTE_REORDERED: 'admin.attribute.reordered',

  // Collections
  COLLECTION_CREATED:    'admin.collection.created',
  COLLECTION_UPDATED:    'admin.collection.updated',
  COLLECTION_DELETED:    'admin.collection.deleted',
  COLLECTION_DUPLICATED: 'admin.collection.duplicated',
  COLLECTION_PUBLISHED:  'admin.collection.published',
  COLLECTION_ARCHIVED:   'admin.collection.archived',
  COLLECTION_REORDERED:  'admin.collection.reordered',

  // Collection relationships
  COLLECTION_PRODUCT_ATTACHED:  'admin.collection.product_attached',
  COLLECTION_PRODUCT_DETACHED:  'admin.collection.product_detached',
  COLLECTION_PRODUCT_REORDERED: 'admin.collection.product_reordered',

  // Products
  PRODUCT_CREATED:         'admin.product.created',
  PRODUCT_UPDATED:         'admin.product.updated',
  PRODUCT_DELETED:         'admin.product.deleted',
  PRODUCT_ARCHIVED:        'admin.product.archived',
  PRODUCT_PUBLISHED:       'admin.product.published',
  PRODUCT_DUPLICATED:      'admin.product.duplicated',
  PRODUCT_VARIANT_ADDED:   'admin.product.variant_added',
  PRODUCT_VARIANT_REMOVED: 'admin.product.variant_removed',
  PRODUCT_BRANDING_ADDED:   'admin.product.branding_added',
  PRODUCT_BRANDING_REMOVED: 'admin.product.branding_removed',

  // Assets
  ASSET_UPLOADED: 'admin.asset.uploaded',
  ASSET_DELETED:  'admin.asset.deleted',

  // Orders
  ORDER_CANCELLED: 'admin.order.cancelled',
  ORDER_REFUNDED:  'admin.order.refunded',

  // Relationships (generic — used by RelationshipFramework helpers)
  RELATION_ATTACHED:  'admin.relation.attached',
  RELATION_DETACHED:  'admin.relation.detached',
  RELATION_REORDERED: 'admin.relation.reordered',

  // Users
  USER_LOGGED_IN: 'admin.user.login',
} as const

export type AdminEventType = typeof AdminEvents[keyof typeof AdminEvents]

// ── Admin event payload ───────────────────────────────────────────────────
export type AdminEventPayload = {
  entityType:  ActivityEntityType
  entityId:    string
  entityLabel?: string
  action:      ActivityAction
  before?:     unknown
  after?:      unknown
  metadata?:   Record<string, unknown>
  userId?:     string
  ipAddress?:  string
  userAgent?:  string
}

export type AdminDomainEvent = DomainEvent & {
  type:     AdminEventType
  payload:  AdminEventPayload
}

// ── Dispatcher ────────────────────────────────────────────────────────────
export async function dispatch(
  type:     AdminEventType,
  tenantId: string,
  payload:  AdminEventPayload,
): Promise<void> {
  await eventBus.emit(type, {
    tenantId,
    payload: payload as Record<string, unknown>,
  })
}

// ── Audit subscriber (auto-registered) ───────────────────────────────────
// Subscribes to all admin.* events and writes to merch_activity_log.
function registerAuditSubscriber() {
  eventBus.on('*', async (event) => {
    if (!event.type.startsWith('admin.')) return

    const p = event.payload as AdminEventPayload

    await logActivity({
      tenantId:    event.tenantId,
      userId:      p.userId,
      entityType:  p.entityType,
      entityId:    p.entityId,
      entityLabel: p.entityLabel,
      action:      p.action,
      before:      p.before,
      after:       p.after,
      metadata:    p.metadata,
      ipAddress:   p.ipAddress,
      userAgent:   p.userAgent,
    })
  })
}

// Register once at module load time.
// In a Next.js server environment this runs when the module is first imported.
registerAuditSubscriber()
