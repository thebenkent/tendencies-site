'use server'

import { publishCampaign, archiveCampaign } from './admin-service'

export async function publishCampaignAction(
  id:       string,
  tenantId: string,
  label:    string,
): Promise<void> {
  return publishCampaign(id, tenantId, label)
}

export async function archiveCampaignAction(
  id:       string,
  tenantId: string,
  label:    string,
): Promise<void> {
  return archiveCampaign(id, tenantId, label)
}
