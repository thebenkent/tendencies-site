/**
 * Relationship framework — server-side helpers.
 *
 * These utilities are called by admin service functions (never directly from
 * React components). Each helper:
 *   1. Delegates the actual DB operation to the caller-supplied function
 *   2. Dispatches the appropriate admin event via the existing dispatcher
 *
 * Relationship events flow through the dispatcher → audit subscriber →
 * merch_activity_log, exactly like any other admin operation.
 *
 * Usage (in a module admin service):
 *
 *   export async function attachCollection(
 *     campaignId: string, collectionIds: string[], tenantId: string,
 *   ) {
 *     await executeAttach({
 *       tenantId,
 *       parentId:    campaignId,
 *       parentLabel: 'Campaign',
 *       childIds:    collectionIds,
 *       entityType:  'campaign',
 *       relation:    'collections',
 *       events:      { attached: AdminEvents.RELATION_ATTACHED },
 *       doAttach:    (pid, cids, tid) => repo.attachCollections(pid, cids, tid),
 *     })
 *   }
 */

import { dispatch, AdminEvents } from '@/lib/admin/dispatcher'
import type { ActivityEntityType } from '@/lib/admin/audit'
import type { AdminEventType } from '@/lib/admin/dispatcher'

// ── Shared options ────────────────────────────────────────────────────────

type BaseOptions = {
  tenantId:    string
  parentId:    string
  parentLabel?: string
  entityType:  ActivityEntityType
  relation:    string      // "collections", "products", etc.
  userId?:     string
}

// ── executeAttach ──────────────────────────────────────────────────────────

type AttachOptions = BaseOptions & {
  childIds:  string[]
  events?:   { attached?: AdminEventType }
  doAttach:  (parentId: string, childIds: string[], tenantId: string) => Promise<void>
}

export async function executeAttach({
  tenantId, parentId, parentLabel, entityType, relation,
  childIds, events, doAttach, userId,
}: AttachOptions): Promise<void> {
  await doAttach(parentId, childIds, tenantId)

  await dispatch(
    events?.attached ?? AdminEvents.RELATION_ATTACHED,
    tenantId,
    {
      entityType,
      entityId:    parentId,
      entityLabel: parentLabel,
      action:      'linked',
      metadata:    { relation, childIds, count: childIds.length },
      userId,
    },
  )
}

// ── executeDetach ──────────────────────────────────────────────────────────

type DetachOptions = BaseOptions & {
  childId:   string
  childLabel?: string
  events?:   { detached?: AdminEventType }
  doDetach:  (parentId: string, childId: string, tenantId: string) => Promise<void>
}

export async function executeDetach({
  tenantId, parentId, parentLabel, entityType, relation,
  childId, childLabel, events, doDetach, userId,
}: DetachOptions): Promise<void> {
  await doDetach(parentId, childId, tenantId)

  await dispatch(
    events?.detached ?? AdminEvents.RELATION_DETACHED,
    tenantId,
    {
      entityType,
      entityId:    parentId,
      entityLabel: parentLabel,
      action:      'unlinked',
      metadata:    { relation, childId, childLabel },
      userId,
    },
  )
}

// ── executeReorder ─────────────────────────────────────────────────────────

type ReorderOptions = BaseOptions & {
  orderedIds:  string[]
  events?:     { reordered?: AdminEventType }
  doReorder:   (parentId: string, orderedIds: string[], tenantId: string) => Promise<void>
}

export async function executeReorder({
  tenantId, parentId, parentLabel, entityType, relation,
  orderedIds, events, doReorder, userId,
}: ReorderOptions): Promise<void> {
  await doReorder(parentId, orderedIds, tenantId)

  await dispatch(
    events?.reordered ?? AdminEvents.RELATION_REORDERED,
    tenantId,
    {
      entityType,
      entityId:    parentId,
      entityLabel: parentLabel,
      action:      'reordered',
      metadata:    { relation, count: orderedIds.length },
      userId,
    },
  )
}

// ── executeBulkDetach ──────────────────────────────────────────────────────

type BulkDetachOptions = BaseOptions & {
  childIds:  string[]
  events?:   { detached?: AdminEventType }
  doDetach:  (parentId: string, childId: string, tenantId: string) => Promise<void>
}

export async function executeBulkDetach({
  tenantId, parentId, parentLabel, entityType, relation,
  childIds, events, doDetach, userId,
}: BulkDetachOptions): Promise<void> {
  await Promise.all(childIds.map((id) => doDetach(parentId, id, tenantId)))

  await dispatch(
    events?.detached ?? AdminEvents.RELATION_DETACHED,
    tenantId,
    {
      entityType,
      entityId:    parentId,
      entityLabel: parentLabel,
      action:      'unlinked',
      metadata:    { relation, childIds, count: childIds.length },
      userId,
    },
  )
}
