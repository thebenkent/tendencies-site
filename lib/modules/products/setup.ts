/**
 * Products module runtime registrations.
 *
 * Imported for side-effects from lib/admin/registry/setup.ts.
 * The entity itself is registered there via registerEntity().
 * This file registers everything else: search, metrics, widgets, import/export.
 */

import { registerSearchProvider } from '@/lib/admin/registry/search-registry'
import { registerMetric }         from '@/lib/admin/registry/metrics-registry'
import { registerWidget }         from '@/lib/admin/registry/widget-registry'
import { registerImporter, registerExporter } from '@/lib/admin/importexport'

import { productSearchProvider }            from './search-provider'
import { productMetrics }                   from './metrics'
import { productWidgets }                   from './widgets'
import { productCsvImporter, productCsvExporter } from './importer'

// ── Search ────────────────────────────────────────────────────────────────
registerSearchProvider(productSearchProvider)

// ── Metrics ───────────────────────────────────────────────────────────────
productMetrics.forEach(registerMetric)

// ── Dashboard widgets ─────────────────────────────────────────────────────
productWidgets.forEach(registerWidget)

// ── Import / Export ───────────────────────────────────────────────────────
registerImporter(productCsvImporter)
registerExporter(productCsvExporter)
