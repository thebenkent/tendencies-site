/**
 * Collection service.
 *
 * Business rules, validation, and lifecycle transitions.
 * Delegates all DB operations to the repository.
 * Called by CollectionAdminService — never directly from components.
 */

import {
  isCollectionSlugTaken,
  findCollectionById,
  findProductsInCollection,
  updateCollectionStatus,
} from './repository'
import { canTransition, STANDARD_LIFECYCLE_POLICY } from '@/lib/admin/lifecycle'
import type { LifecycleStatus } from '@/lib/admin/lifecycle'

// ── Validation ────────────────────────────────────────────────────────────

export type CollectionValidationErrors = Partial<
  Record<'name' | 'slug' | 'campaign_id' | 'image_url' | 'publish_at' | 'archive_at' | '_global', string>
>

export async function validateCollection(
  data:       { name: string; slug: string; campaign_id: string; image_url?: string; publish_at?: string; archive_at?: string },
  campaignId: string,
  existingId?: string,
): Promise<CollectionValidationErrors> {
  const errors: CollectionValidationErrors = {}

  if (!data.name.trim())          errors.name = 'Name is required'
  if (data.name.length > 120)     errors.name = 'Name must be 120 characters or fewer'
  if (!data.slug.trim())          errors.slug = 'Slug is required'
  if (!data.campaign_id)          errors.campaign_id = 'Campaign is required'

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug))
    errors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens'

  if (data.publish_at && data.archive_at && data.publish_at >= data.archive_at)
    errors.archive_at = 'Archive date must be after publish date'

  // Slug uniqueness within the campaign
  if (data.slug && !errors.slug) {
    const taken = await isCollectionSlugTaken(campaignId, data.slug, existingId)
    if (taken) errors.slug = 'This slug is already used in this campaign'
  }

  return errors
}

// ── Business rules (used by extension validators) ─────────────────────────

/** True if the collection has at least one attached product. */
export async function hasProducts(collectionId: string): Promise<boolean> {
  const products = await findProductsInCollection(collectionId)
  return products.length > 0
}

/** True if the collection has a hero image set. */
export async function hasHeroImage(collectionId: string): Promise<boolean> {
  const col = await findCollectionById(collectionId)
  return !!(col?.image_url)
}

// ── Lifecycle transitions ─────────────────────────────────────────────────

/**
 * Transition a collection to a new lifecycle state.
 * Enforces valid transitions via STANDARD_LIFECYCLE_POLICY.
 * Timestamps published_at / archived_at on entry.
 */
export async function transitionCollectionStatus(
  collectionId: string,
  tenantId:     string,
  to:           LifecycleStatus,
): Promise<void> {
  const collection = await findCollectionById(collectionId)
  if (!collection) throw new Error('Collection not found')

  const from = collection.lifecycle_status as LifecycleStatus
  if (!canTransition(from, to, STANDARD_LIFECYCLE_POLICY)) {
    throw new Error(`Cannot transition collection from '${from}' to '${to}'`)
  }

  const extra: Record<string, string | null> = {}
  if (to === 'published') extra.published_at = new Date().toISOString()
  if (to === 'archived')  extra.archived_at  = new Date().toISOString()

  await updateCollectionStatus(collectionId, tenantId, to, extra)
}
