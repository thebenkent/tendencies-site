import type { MerchUserRole } from '@/lib/merch/types'

// ── Permission constants ───────────────────────────────────────────────────
export const Permissions = {
  // Campaigns
  CAMPAIGNS_VIEW:    'campaigns.view',
  CAMPAIGNS_CREATE:  'campaigns.create',
  CAMPAIGNS_UPDATE:  'campaigns.update',
  CAMPAIGNS_DELETE:  'campaigns.delete',
  CAMPAIGNS_PUBLISH: 'campaigns.publish',
  CAMPAIGNS_CLOSE:   'campaigns.close',
  CAMPAIGNS_DUPLICATE:'campaigns.duplicate',

  // Collections
  COLLECTIONS_VIEW:   'collections.view',
  COLLECTIONS_CREATE: 'collections.create',
  COLLECTIONS_UPDATE: 'collections.update',
  COLLECTIONS_DELETE: 'collections.delete',
  COLLECTIONS_REORDER:'collections.reorder',

  // Products
  PRODUCTS_VIEW:    'products.view',
  PRODUCTS_CREATE:  'products.create',
  PRODUCTS_UPDATE:  'products.update',
  PRODUCTS_DELETE:  'products.delete',
  PRODUCTS_ARCHIVE: 'products.archive',
  PRODUCTS_PUBLISH: 'products.publish',

  // Bundles
  BUNDLES_VIEW:   'bundles.view',
  BUNDLES_CREATE: 'bundles.create',
  BUNDLES_UPDATE: 'bundles.update',
  BUNDLES_DELETE: 'bundles.delete',

  // Assets
  ASSETS_VIEW:   'assets.view',
  ASSETS_UPLOAD: 'assets.upload',
  ASSETS_DELETE: 'assets.delete',

  // Orders
  ORDERS_VIEW:   'orders.view',
  ORDERS_CANCEL: 'orders.cancel',
  ORDERS_REFUND: 'orders.refund',
  ORDERS_EXPORT: 'orders.export',

  // Production
  PRODUCTION_VIEW:   'production.view',
  PRODUCTION_UPDATE: 'production.update',

  // Customers
  CUSTOMERS_VIEW:   'customers.view',
  CUSTOMERS_EXPORT: 'customers.export',

  // Analytics
  ANALYTICS_VIEW: 'analytics.view',

  // Suppliers
  SUPPLIERS_VIEW:   'suppliers.view',
  SUPPLIERS_UPDATE: 'suppliers.update',

  // Settings
  SETTINGS_VIEW:   'settings.view',
  SETTINGS_UPDATE: 'settings.update',
  SETTINGS_USERS:  'settings.users',
} as const

export type Permission = typeof Permissions[keyof typeof Permissions]

// ── Role → permission mapping ──────────────────────────────────────────────
const ALL: Permission[] = Object.values(Permissions)

const ADMIN_PERMISSIONS: Permission[] = ALL.filter(
  (p) => !p.startsWith('settings.users'),
)

const PRODUCTION_PERMISSIONS: Permission[] = [
  Permissions.CAMPAIGNS_VIEW,
  Permissions.COLLECTIONS_VIEW,
  Permissions.PRODUCTS_VIEW,
  Permissions.BUNDLES_VIEW,
  Permissions.ASSETS_VIEW,
  Permissions.ORDERS_VIEW,
  Permissions.PRODUCTION_VIEW,
  Permissions.PRODUCTION_UPDATE,
]

const FINANCE_PERMISSIONS: Permission[] = [
  Permissions.CAMPAIGNS_VIEW,
  Permissions.ORDERS_VIEW,
  Permissions.ORDERS_REFUND,
  Permissions.ORDERS_EXPORT,
  Permissions.CUSTOMERS_VIEW,
  Permissions.CUSTOMERS_EXPORT,
  Permissions.ANALYTICS_VIEW,
]

const VIEWER_PERMISSIONS: Permission[] = [
  Permissions.CAMPAIGNS_VIEW,
  Permissions.COLLECTIONS_VIEW,
  Permissions.PRODUCTS_VIEW,
  Permissions.ORDERS_VIEW,
  Permissions.CUSTOMERS_VIEW,
  Permissions.ANALYTICS_VIEW,
]

export const ROLE_PERMISSIONS: Record<MerchUserRole, Permission[]> = {
  owner:      ALL,
  admin:      ADMIN_PERMISSIONS,
  production: PRODUCTION_PERMISSIONS,
  finance:    FINANCE_PERMISSIONS,
  viewer:     VIEWER_PERMISSIONS,
}

// ── Helpers ───────────────────────────────────────────────────────────────
export function hasPermission(role: MerchUserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: MerchUserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: MerchUserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

export function getPermissionsForRole(role: MerchUserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}
