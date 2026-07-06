'use server'

/**
 * Server actions for campaign banner management.
 * Called directly from the BannerManager client component.
 */

import {
  findAllBannersByCampaign,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  type BannerInput,
} from './repository'
import { dispatch, AdminEvents } from '@/lib/admin/dispatcher'
import type { MerchCampaignBanner } from '@/lib/merch/types'

export async function getBannersAction(
  campaignId: string,
): Promise<MerchCampaignBanner[]> {
  return findAllBannersByCampaign(campaignId)
}

export async function createBannerAction(
  campaignId: string,
  tenantId:   string,
  data:       BannerInput,
): Promise<MerchCampaignBanner> {
  const banner = await createBanner(campaignId, tenantId, data)

  await dispatch(AdminEvents.BANNER_CREATED, tenantId, {
    entityType:  'campaign',
    entityId:    campaignId,
    entityLabel: data.message.slice(0, 60),
    action:      'updated',
    after:       banner,
    metadata:    { bannerId: banner.id },
  })

  return banner
}

export async function updateBannerAction(
  bannerId:  string,
  tenantId:  string,
  campaignId: string,
  data:      Partial<BannerInput>,
  label:     string,
): Promise<MerchCampaignBanner> {
  const banner = await updateBanner(bannerId, tenantId, data)

  await dispatch(AdminEvents.BANNER_UPDATED, tenantId, {
    entityType:  'campaign',
    entityId:    campaignId,
    entityLabel: label,
    action:      'updated',
    after:       banner,
    metadata:    { bannerId },
  })

  return banner
}

export async function deleteBannerAction(
  bannerId:  string,
  tenantId:  string,
  campaignId: string,
  label:     string,
): Promise<void> {
  await deleteBanner(bannerId, tenantId)

  await dispatch(AdminEvents.BANNER_DELETED, tenantId, {
    entityType:  'campaign',
    entityId:    campaignId,
    entityLabel: label,
    action:      'updated',
    metadata:    { bannerId },
  })
}

export async function reorderBannersAction(
  orderedIds: string[],
  tenantId:   string,
  campaignId: string,
): Promise<void> {
  await reorderBanners(orderedIds, tenantId)

  await dispatch(AdminEvents.BANNER_REORDERED, tenantId, {
    entityType:  'campaign',
    entityId:    campaignId,
    entityLabel: '',
    action:      'updated',
    metadata:    { orderedIds },
  })
}
