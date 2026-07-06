'use server'

/**
 * Server actions for campaign attribute management.
 * Called directly from the AttributeManager client component.
 */

import {
  findAllAttributesByCampaign,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  reorderAttributes,
  type AttributeInput,
} from './repository'
import { dispatch, AdminEvents } from '@/lib/admin/dispatcher'
import type { MerchCampaignAttribute } from '@/lib/merch/types'

export async function getAttributesAction(
  campaignId: string,
): Promise<MerchCampaignAttribute[]> {
  return findAllAttributesByCampaign(campaignId)
}

export async function createAttributeAction(
  campaignId: string,
  tenantId:   string,
  data:       AttributeInput,
): Promise<MerchCampaignAttribute> {
  const attr = await createAttribute(campaignId, tenantId, data)

  await dispatch(AdminEvents.ATTRIBUTE_CREATED, tenantId, {
    entityType:  'campaign',
    entityId:    campaignId,
    entityLabel: data.label,
    action:      'updated',
    after:       attr,
    metadata:    { attributeId: attr.id },
  })

  return attr
}

export async function updateAttributeAction(
  attrId:     string,
  tenantId:   string,
  campaignId: string,
  data:       Partial<AttributeInput>,
  label:      string,
): Promise<MerchCampaignAttribute> {
  const attr = await updateAttribute(attrId, tenantId, data)

  await dispatch(AdminEvents.ATTRIBUTE_UPDATED, tenantId, {
    entityType:  'campaign',
    entityId:    campaignId,
    entityLabel: label,
    action:      'updated',
    after:       attr,
    metadata:    { attributeId: attrId },
  })

  return attr
}

export async function deleteAttributeAction(
  attrId:     string,
  tenantId:   string,
  campaignId: string,
  label:      string,
): Promise<void> {
  await deleteAttribute(attrId, tenantId)

  await dispatch(AdminEvents.ATTRIBUTE_DELETED, tenantId, {
    entityType:  'campaign',
    entityId:    campaignId,
    entityLabel: label,
    action:      'updated',
    metadata:    { attributeId: attrId },
  })
}

export async function reorderAttributesAction(
  orderedIds: string[],
  tenantId:   string,
  campaignId: string,
): Promise<void> {
  await reorderAttributes(orderedIds, tenantId)

  await dispatch(AdminEvents.ATTRIBUTE_REORDERED, tenantId, {
    entityType:  'campaign',
    entityId:    campaignId,
    entityLabel: '',
    action:      'updated',
    metadata:    { orderedIds },
  })
}
