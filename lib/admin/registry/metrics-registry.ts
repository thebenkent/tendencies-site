/**
 * Metrics Registry.
 *
 * Future analytics/KPI cards register themselves here.
 * Avoids hard-coded metric lists in the analytics page.
 *
 * Metric categories:
 *   "revenue"     — financial KPIs
 *   "orders"      — order volume / pipeline
 *   "production"  — production progress, lead times
 *   "engagement"  — conversion, traffic (future)
 *   "custom"      — tenant-specific metrics
 */

export type MetricCategory = 'revenue' | 'orders' | 'production' | 'engagement' | 'custom'

export type MetricFormat = 'currency' | 'number' | 'percentage' | 'duration' | 'text'

export type MetricDefinition = {
  /** Unique key, e.g. "total_revenue", "moq_pct", "avg_lead_time" */
  key:       string
  label:     string
  category:  MetricCategory
  format:    MetricFormat
  priority:  number
  /** Currency code for 'currency' format (defaults to "NZD") */
  currency?: string
  /** Description shown in tooltip */
  description?: string
  /** Whether this metric supports time-range comparison */
  comparable?: boolean
  /** Async loader — fetches the metric value */
  load:      (tenantId: string, range: MetricDateRange) => Promise<MetricValue>
}

export type MetricDateRange = {
  from: string   // ISO date
  to:   string
}

export type MetricValue = {
  current:    number
  previous?:  number      // for trend calculation
  label?:     string      // formatted display value override
  trend?:     number      // % change vs previous
  trendLabel?: string     // e.g. "vs last month"
}

class MetricsRegistry {
  private readonly _metrics = new Map<string, MetricDefinition>()

  register(metric: MetricDefinition): this {
    this._metrics.set(metric.key, metric)
    return this
  }

  getByCategory(category: MetricCategory): MetricDefinition[] {
    return Array.from(this._metrics.values())
      .filter((m) => m.category === category)
      .sort((a, b) => a.priority - b.priority)
  }

  get(key: string): MetricDefinition | undefined {
    return this._metrics.get(key)
  }

  all(): MetricDefinition[] {
    return Array.from(this._metrics.values()).sort((a, b) => a.priority - b.priority)
  }
}

export const metricsRegistry = new MetricsRegistry()

export function registerMetric(metric: MetricDefinition) {
  metricsRegistry.register(metric)
}
