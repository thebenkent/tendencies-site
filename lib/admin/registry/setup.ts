/**
 * Platform registry setup.
 *
 * Registers all admin pages (modules + entities) so the entity registry
 * is complete from startup. Navigation, command palette, and search all
 * derive from this file — no hardcoded lists elsewhere.
 *
 * Import once at the admin shell level for its side-effects.
 *
 * Phase map:
 *   Module placeholder  — registered here as a basic module (nav only)
 *   EntityRegistration  — registered here with full EntityDefinition (7B+)
 */

import {
  LayoutDashboard, ShoppingBag, Factory,
  Layers, Package, Boxes, FolderOpen,
  BarChart3, Users, Truck, Settings,
} from 'lucide-react'
import { registerModule, registerEntity } from './entity-registry'
import { registerSearchProvider } from './search-registry'

// ── Operations ────────────────────────────────────────────────────────────
registerModule({ key: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, basePath: '',           navGroup: 'operations', navPriority: 0,  exact: true })
registerModule({ key: 'orders',     label: 'Orders',     icon: ShoppingBag,     basePath: 'orders',     navGroup: 'operations', navPriority: 10 })
registerModule({ key: 'production', label: 'Production', icon: Factory,          basePath: 'production', navGroup: 'operations', navPriority: 20 })

// ── Content: Campaigns (Phase 7B — full EntityRegistration) ───────────────
import { campaignDefinition } from '@/lib/modules/campaigns/definition'
import { campaignSearchProvider } from '@/lib/modules/campaigns/search-provider'

registerEntity({
  key:         'campaigns',
  definition:  campaignDefinition,
  basePath:    'campaigns',
  navGroup:    'content',
  navPriority: 10,
})

registerSearchProvider(campaignSearchProvider)

// ── Content: Collections (Phase 8 — full EntityRegistration) ─────────────
import { collectionDefinition } from '@/lib/modules/collections/definition'
import '@/lib/modules/collections/setup'   // metrics, widgets, importer/exporter

registerEntity({
  key:         'collections',
  definition:  collectionDefinition,
  basePath:    'collections',
  navGroup:    'content',
  navPriority: 20,
})
// ── Content: Products (Phase 9 — full EntityRegistration) ─────────────────
import { productDefinition } from '@/lib/modules/products/definition'
import '@/lib/modules/products/setup'   // search, metrics, widgets, import/export

registerEntity({
  key:         'products',
  definition:  productDefinition,
  basePath:    'products',
  navGroup:    'content',
  navPriority: 30,
})
registerModule({ key: 'bundles',     label: 'Bundles',     icon: Boxes,      basePath: 'bundles',     navGroup: 'content', navPriority: 40 })
registerModule({ key: 'assets',      label: 'Assets',      icon: FolderOpen, basePath: 'assets',      navGroup: 'content', navPriority: 50 })

// ── Platform ──────────────────────────────────────────────────────────────
registerModule({ key: 'analytics',  label: 'Analytics',  icon: BarChart3, basePath: 'analytics',  navGroup: 'platform', navPriority: 0  })
registerModule({ key: 'customers',  label: 'Customers',  icon: Users,     basePath: 'customers',  navGroup: 'platform', navPriority: 10 })
registerModule({ key: 'suppliers',  label: 'Suppliers',  icon: Truck,     basePath: 'suppliers',  navGroup: 'platform', navPriority: 20 })
registerModule({ key: 'settings',   label: 'Settings',   icon: Settings,  basePath: 'settings',   navGroup: 'platform', navPriority: 30 })
