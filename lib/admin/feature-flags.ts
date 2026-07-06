/**
 * Feature Flag infrastructure.
 *
 * Flags are evaluated per-request with a context of (tenant, user, role, env).
 * The default resolver uses a simple in-memory map. Override with a DB-backed
 * resolver (Supabase row, LaunchDarkly, Posthog, etc.) via setResolver().
 *
 * Supports:
 *   - Global defaults (all tenants)
 *   - Per-tenant overrides
 *   - Role-based flags
 *   - Environment flags
 *   - Custom async resolver
 */

import type { MerchUserRole } from '@/lib/merch/types'

// ── Flag constants ────────────────────────────────────────────────────────

export const FeatureFlags = {
  // Commerce features
  PRODUCT_BUNDLES:      'enableProductBundles',
  WISHLIST:             'enableWishlist',
  SUPPLIER_PORTAL:      'enableSupplierPortal',
  QUOTES:               'enableQuotes',
  MULTI_CURRENCY:       'enableMultiCurrency',
  BARCODE_SCANNING:     'enableBarcodeScanning',
  CUSTOMER_SEGMENTS:    'enableCustomerSegments',

  // Admin features
  PRODUCT_IMPORTER:     'enableProductImporter',
  CAMPAIGN_SCHEDULING:  'enableCampaignScheduling',
  ANALYTICS_EXPORT:     'enableAnalyticsExport',
  BULK_PRODUCT_EDIT:    'enableBulkProductEdit',
  ADVANCED_FILTERS:     'enableAdvancedFilters',

  // Platform features
  AUDIT_LOG_UI:         'enableAuditLogUI',
  REVISION_HISTORY:     'enableRevisionHistory',
  AUTOSAVE:             'enableAutosave',
  BACKGROUND_JOBS_UI:   'enableBackgroundJobsUI',
} as const

export type FeatureFlag = typeof FeatureFlags[keyof typeof FeatureFlags]

// ── Evaluation context ────────────────────────────────────────────────────

export type FeatureFlagContext = {
  tenantId: string
  userId?:  string
  role?:    MerchUserRole
  env?:     string        // "production" | "staging" | "development"
}

// ── Resolver ──────────────────────────────────────────────────────────────

export type FlagResolver = (
  flag:    FeatureFlag,
  ctx:     FeatureFlagContext,
) => boolean | Promise<boolean>

// ── Registry ──────────────────────────────────────────────────────────────

class FeatureFlagRegistry {
  private _defaults: Partial<Record<FeatureFlag, boolean>> = {
    // Shipped features — on by default
    [FeatureFlags.WISHLIST]:          true,
    [FeatureFlags.ANALYTICS_EXPORT]:  true,
    [FeatureFlags.ADVANCED_FILTERS]:  true,
    [FeatureFlags.AUTOSAVE]:          false,  // experimental — opt-in
  }

  private _tenantOverrides = new Map<string, Partial<Record<FeatureFlag, boolean>>>()
  private _resolver?: FlagResolver

  /** Set global defaults for flags not covered by a resolver. */
  setDefaults(flags: Partial<Record<FeatureFlag, boolean>>): this {
    this._defaults = { ...this._defaults, ...flags }
    return this
  }

  /** Override flags for a specific tenant (e.g., beta features). */
  setTenantOverrides(tenantId: string, flags: Partial<Record<FeatureFlag, boolean>>): this {
    this._tenantOverrides.set(tenantId, {
      ...this._tenantOverrides.get(tenantId),
      ...flags,
    })
    return this
  }

  /**
   * Replace the default in-memory resolver with a custom one.
   * Called once at app startup with a DB-backed implementation.
   */
  setResolver(resolver: FlagResolver): this {
    this._resolver = resolver
    return this
  }

  /** Async evaluation — use on server or in async client code. */
  async isEnabled(flag: FeatureFlag, ctx: FeatureFlagContext): Promise<boolean> {
    // Custom resolver takes precedence
    if (this._resolver) {
      return this._resolver(flag, ctx)
    }

    // Per-tenant override
    const tenantFlags = this._tenantOverrides.get(ctx.tenantId)
    if (tenantFlags && flag in tenantFlags) {
      return tenantFlags[flag]!
    }

    // Global default
    return this._defaults[flag] ?? false
  }

  /** Sync evaluation — only uses in-memory state (no DB). */
  isEnabledSync(flag: FeatureFlag, ctx?: Pick<FeatureFlagContext, 'tenantId'>): boolean {
    if (ctx) {
      const tenantFlags = this._tenantOverrides.get(ctx.tenantId)
      if (tenantFlags && flag in tenantFlags) return tenantFlags[flag]!
    }
    return this._defaults[flag] ?? false
  }

  /** Evaluate multiple flags at once. */
  async evaluateAll(
    flags:  FeatureFlag[],
    ctx:    FeatureFlagContext,
  ): Promise<Record<FeatureFlag, boolean>> {
    const results = await Promise.all(flags.map((f) => this.isEnabled(f, ctx)))
    return Object.fromEntries(flags.map((f, i) => [f, results[i]])) as Record<FeatureFlag, boolean>
  }
}

export const featureFlags = new FeatureFlagRegistry()

// ── Convenience functions ─────────────────────────────────────────────────

export function isFeatureEnabled(flag: FeatureFlag, ctx: FeatureFlagContext): Promise<boolean> {
  return featureFlags.isEnabled(flag, ctx)
}

export function isFeatureEnabledSync(flag: FeatureFlag, tenantId?: string): boolean {
  return featureFlags.isEnabledSync(flag, tenantId ? { tenantId } : undefined)
}
