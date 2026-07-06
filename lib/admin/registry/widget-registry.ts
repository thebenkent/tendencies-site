/**
 * Dashboard Widget Registry.
 *
 * Widgets plug into the dashboard rather than being hard-coded.
 * Future modules register their own KPI cards, charts, and tables.
 *
 * Locations:
 *   "metrics"    — top row of KPI cards
 *   "operations" — mid-page operational cards (orders due, production tasks…)
 *   "charts"     — analytics charts
 *   "activity"   — activity feed / timeline
 */

import type { ComponentType } from 'react'

export type WidgetLocation = 'metrics' | 'operations' | 'charts' | 'activity'

export type WidgetSize = '1/4' | '1/3' | '1/2' | '2/3' | '3/4' | 'full'

export type DashboardWidget = {
  /** Unique key, e.g. "orders_due", "revenue_mtd" */
  id:          string
  location:    WidgetLocation
  /** Priority — lower renders first within location */
  priority:    number
  size?:       WidgetSize
  /** Async server component or client component that renders the widget */
  component:   ComponentType<{ tenantId: string; tenantSlug: string }>
  /** Feature flag guard — widget hidden when flag is disabled */
  featureFlag?: string
  /** Permission guard */
  permission?:  string
}

class WidgetRegistry {
  private readonly _widgets = new Map<string, DashboardWidget>()

  register(widget: DashboardWidget): this {
    this._widgets.set(widget.id, widget)
    return this
  }

  unregister(id: string): this {
    this._widgets.delete(id)
    return this
  }

  getByLocation(location: WidgetLocation): DashboardWidget[] {
    return Array.from(this._widgets.values())
      .filter((w) => w.location === location)
      .sort((a, b) => a.priority - b.priority)
  }

  all(): DashboardWidget[] {
    return Array.from(this._widgets.values()).sort((a, b) => a.priority - b.priority)
  }
}

export const widgetRegistry = new WidgetRegistry()

export function registerWidget(widget: DashboardWidget) {
  widgetRegistry.register(widget)
}
