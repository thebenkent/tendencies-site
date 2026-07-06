/**
 * Collections module runtime registrations.
 *
 * Called once at admin shell startup (imported for side-effects).
 * Registers everything with all runtime registries — no individual
 * component or page needs to know about the registries directly.
 */

import { registerSearchProvider } from '@/lib/admin/registry/search-registry'
import { registerMetric }         from '@/lib/admin/registry/metrics-registry'
import { registerWidget }         from '@/lib/admin/registry/widget-registry'
import { registerImporter, registerExporter } from '@/lib/admin/importexport'

import { collectionSearchProvider } from './search-provider'
import { collectionMetrics }        from './metrics'
import { collectionWidgets }        from './widgets'
import { collectionCsvImporter, collectionCsvExporter } from './importer'

// ── Search ────────────────────────────────────────────────────────────────
registerSearchProvider(collectionSearchProvider)

// ── Metrics ───────────────────────────────────────────────────────────────
collectionMetrics.forEach(registerMetric)

// ── Dashboard widgets ─────────────────────────────────────────────────────
collectionWidgets.forEach(registerWidget)

// ── Import / Export ───────────────────────────────────────────────────────
registerImporter(collectionCsvImporter)
registerExporter(collectionCsvExporter)

// Note: the entity itself (collectionDefinition) is registered in
// lib/admin/registry/setup.ts via registerEntity().
// Extensions (validators, toolbar actions, commands) are declared
// inline in the EntityDefinition.extensions[] and composed at runtime
// by useExtensionComposer — no additional registration needed.
