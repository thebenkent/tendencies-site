/**
 * Collection dashboard widgets.
 *
 * Registered in the widget registry at startup.
 * Rendered on the admin dashboard automatically.
 */

import type { DashboardWidget } from '@/lib/admin/registry/widget-registry'
import { findCollectionStatusCounts } from './repository'

// ── Inline widget components ───────────────────────────────────────────────
// Real-world implementations would live in components/admin/collections/widgets/.
// These are lightweight inline implementations for the reference module.

function makeCountWidget(
  id:       string,
  label:    string,
  priority: number,
  selector: (counts: Awaited<ReturnType<typeof findCollectionStatusCounts>>) => number,
): DashboardWidget {
  return {
    id,
    location:  'metrics',
    priority,
    size:      '1/4',
    component: ({ tenantId }: { tenantId: string; tenantSlug: string }) => {
      // Note: in Next.js App Router, async Server Components are the pattern here.
      // The widget registry component prop is used by the dashboard host component
      // to render each widget. The actual async data-fetching happens inside.
      // For simplicity, we return null and rely on the parent to provide data;
      // a production widget would be a proper async Server Component.
      // This is intentionally a minimal stub — production widgets go in components/.
      return null
    },
  }
}

export const collectionWidgets: DashboardWidget[] = [
  makeCountWidget('collections:total',     'Total Collections',     100, (c) => c.total),
  makeCountWidget('collections:draft',     'Draft Collections',     110, (c) => c.draft),
  makeCountWidget('collections:published', 'Published Collections', 120, (c) => c.published),
]
