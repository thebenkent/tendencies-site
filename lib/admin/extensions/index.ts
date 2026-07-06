// Types
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
} from './definition'

// Registry
export {
  extensionRegistry,
  registerExtension,
  unregisterExtension,
} from './registry'

// Composition engine (client-only — 'use client' in composition.ts)
export {
  useExtensionComposer,
  runValidators,
} from './composition'
export type { ComposedExtensions } from './composition'

// Built-in factory functions
export {
  relationshipExtension,
  validationExtension,
  metricsExtension,
  toolbarExtension,
  tabExtension,
  detailPanelExtension,
  activityExtension,
  commandExtension,
  widgetExtension,
} from './built-ins'
