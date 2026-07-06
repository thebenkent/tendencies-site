// Entity + module nav
export {
  entityRegistry,
  registerEntity,
  registerModule,
} from './entity-registry'
export type {
  EntityRegistration,
  ModuleRegistration,
  NavRegistration,
  NavGroup,
} from './entity-registry'

// Search providers
export {
  searchRegistry,
  registerSearchProvider,
} from './search-registry'
export type { SearchProvider, SearchResult } from './search-registry'

// Dashboard widgets
export {
  widgetRegistry,
  registerWidget,
} from './widget-registry'
export type { DashboardWidget, WidgetLocation, WidgetSize } from './widget-registry'

// Metrics
export {
  metricsRegistry,
  registerMetric,
} from './metrics-registry'
export type {
  MetricDefinition,
  MetricValue,
  MetricDateRange,
  MetricCategory,
  MetricFormat,
} from './metrics-registry'

// Settings groups
export {
  settingsRegistry,
  registerSettingsGroup,
} from './settings-registry'
export type { SettingsGroup } from './settings-registry'

// Relationships (plugin-contributed)
export {
  relationshipRegistry,
  registerRelationship,
} from './relationship-registry'

// Extensions
export {
  extensionRegistry,
  registerExtension,
  unregisterExtension,
} from '../extensions/registry'
export type {
  RuntimeExtension,
  ExtensionContributions,
  EditorTabContribution,
  ToolbarActionContribution,
  RowActionContribution,
  WidgetContribution,
  MetricContribution,
  ValidatorContribution,
  ValidationIssue,
  ActivityPanelContribution,
  DetailPanelContribution,
  CommandContribution,
} from '../extensions/definition'
