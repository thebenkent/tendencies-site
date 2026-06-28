// Shim — canonical code lives in lib/modules/tenants/repository and lib/modules/campaigns/repository
export { findTenantBySlug } from '@/lib/modules/tenants/repository'
export {
  findCampaignsByTenant,
  findCampaignBySlug,
  findCampaignById,
  updateCampaignStatus,
} from '@/lib/modules/campaigns/repository'
