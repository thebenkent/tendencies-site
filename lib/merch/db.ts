// Backward-compat shim — re-exports from the modular structure.
// Prefer importing directly from '@/lib/merch' or the specific module.

export {
  findTenantBySlug           as getTenant,
  findCampaignBySlug         as getCampaign,
  findCampaignsByTenant      as getCampaigns,
  updateCampaignStatus,
  findCollectionsByCampaign  as getCollections,
  findCollectionBySlug       as getCollection,
  findBannersByCampaign      as getCampaignBanners,
} from './repositories/tenants'

export {
  findProductsByCampaign as getProducts,
  findProductBySlug      as getProduct,
  findVariantById        as getVariant,
  getProductProgress,
  findRelatedProducts    as getRelatedProducts,
} from './repositories/products'

export {
  upsertCustomer,
} from './repositories/customers'

export {
  findOrdersByTenant as getReservationsForTenant,
  findOrderById      as getReservation,
  updateOrderStatus  as updateReservationStatus,
  appendOrderEvent,
  getAdminStats,
} from './repositories/orders'

export { closeCampaign } from './services/campaigns'
export { placeOrder }    from './services/orders'
export {
  getAllTransitionsForWorkflow,
  executeTransition,
  getValidTransitions,
} from './services/workflow'
export type { WorkflowAction } from './services/workflow'
