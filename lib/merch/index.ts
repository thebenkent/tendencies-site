// ── Types ─────────────────────────────────────────────────────
export type * from './types'

// ── Core ─────────────────────────────────────────────────────
export { getSupabase }                              from '@/lib/core/database'
export { getAdminContext, canWrite, createAuthClient } from '@/lib/core/auth'
export type { AdminContext }                        from '@/lib/core/auth'
export { eventBus }                                 from '@/lib/core/events'
export type { DomainEvent, EventHandler }           from '@/lib/core/events'

// ── Tenants ───────────────────────────────────────────────────
export { findTenantBySlug }                         from '@/lib/modules/tenants/repository'

// ── Campaigns ─────────────────────────────────────────────────
export {
  findCampaignsByTenant,
  findCampaignBySlug,
  findCampaignById,
  updateCampaignStatus,
}                                                   from '@/lib/modules/campaigns/repository'
export { closeCampaign }                            from '@/lib/modules/campaigns/service'

// ── Products ──────────────────────────────────────────────────
export {
  findProductsByCampaign,
  findProductBySlug,
  findVariantById,
  getProductProgress,
}                                                   from '@/lib/modules/products/repository'

// ── Orders ────────────────────────────────────────────────────
export {
  createOrder, createOrderLine,
  findOrderById, findOrdersByTenant,
  findOrdersByCampaignProduct,
  updateOrderStatus, updateOrdersStatus,
  appendOrderEvent, getAdminStats,
}                                                   from '@/lib/modules/orders/repository'
export { placeOrder }                               from '@/lib/modules/orders/service'
export type { PlaceOrderInput, PlaceOrderResult }   from '@/lib/modules/orders/service'

// ── Customers ─────────────────────────────────────────────────
export { upsertCustomer, findCustomersWithStats }   from '@/lib/modules/customers/repository'
export type { CustomerWithStats }                   from '@/lib/modules/customers/repository'

// ── Payments ──────────────────────────────────────────────────
export { createPayment, updatePaymentStatus }       from '@/lib/modules/payments/repository'

// ── Workflows ─────────────────────────────────────────────────
export {
  findWorkflowById, findWorkflowStates, findWorkflowTransitions,
  findTransitionsFromState, findTransitionsGrouped, findInitialState,
}                                                   from '@/lib/modules/workflows/repository'
export {
  getValidTransitions, getAllTransitionsForWorkflow,
  executeTransition, getInitialState,
}                                                   from '@/lib/modules/workflows/service'
export type { WorkflowAction }                      from '@/lib/modules/workflows/service'

// ── Rules ─────────────────────────────────────────────────────
export { getCampaignRules, getRule, setRule, RULE_DEFAULTS } from '@/lib/modules/rules/service'
export type { CampaignRuleKey, CampaignRules }      from '@/lib/modules/rules/types'

// ── Automations ───────────────────────────────────────────────
export { trigger as triggerAutomation, registerAutomationSubscriber } from '@/lib/modules/automations/service'
export type { MerchAutomation, MerchAutomationStep } from '@/lib/modules/automations/types'

// ── Branding ──────────────────────────────────────────────────
export { resolveBranding }                           from '@/lib/modules/branding/service'
export { findTenantBranding, upsertTenantBranding }  from '@/lib/modules/branding/repository'
export type { MerchCampaignBranding, ResolvedBranding } from '@/lib/modules/branding/types'

// ── Assets ────────────────────────────────────────────────────
export {
  findAssetsByCampaignProduct,
  findAssetsByMasterProduct,
  createAsset, deleteAsset, reorderAssets,
}                                                    from '@/lib/modules/assets/repository'
export type { CreateAssetInput }                     from '@/lib/modules/assets/types'

// ── Emails ────────────────────────────────────────────────────
export { sendEmail, configureEmailProvider }         from '@/lib/modules/emails/service'
export type { EmailTemplateType, SendEmailInput }    from '@/lib/modules/emails/types'

// ── Pricing ───────────────────────────────────────────────────
export { resolvePrice }                              from '@/lib/modules/pricing/service'
export type { ResolvedPrice }                        from '@/lib/modules/pricing/types'

// ── Analytics ─────────────────────────────────────────────────
export { getCampaignAnalytics, getTopProducts, getRevenueByStatus } from '@/lib/modules/analytics/service'
export type { CampaignAnalytics, TopProduct }        from '@/lib/modules/analytics/types'
