/**
 * Built-in extension factories.
 *
 * These functions convert existing platform concepts (relationships, workflow,
 * metrics, validators) into RuntimeExtension objects. They enable the
 * EntityDefinition.extensions: [...] declaration style alongside the legacy
 * EntityDefinition.relationships: [...] style — both are supported.
 *
 * Usage:
 *
 *   export const campaignDefinition: EntityDefinition<CampaignAdminData> = {
 *     ...
 *     extensions: [
 *       relationshipExtension(collectionsRelationship, { priority: 10 }),
 *       relationshipExtension(productsRelationship,    { priority: 20 }),
 *       validationExtension([slugValidator, dateRangeValidator], { priority: 5 }),
 *       metricsExtension([orderCountMetric, revenueMetric]),
 *     ],
 *   }
 *
 * Extension ID conventions:
 *   relationship:{relation}        e.g. 'relationship:collections'
 *   workflow:{entityKey}           e.g. 'workflow:campaigns'
 *   metrics:{entityKey}            e.g. 'metrics:campaigns'
 *   validation:{entityKey}         e.g. 'validation:campaigns'
 *   activity:{entityKey}           e.g. 'activity:campaigns'
 *   detail:{id}                    e.g. 'detail:publishing'
 *   command:{entityKey}            e.g. 'command:campaigns'
 */

import type { RuntimeExtension } from './definition'
import type {
  ValidatorContribution,
  MetricContribution,
  ToolbarActionContribution,
  EditorTabContribution,
  DetailPanelContribution,
  ActivityPanelContribution,
  CommandContribution,
  WidgetContribution,
} from './definition'
import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'

// ── Shared option type ────────────────────────────────────────────────────

type BaseOptions = {
  /** Entity key this extension targets — omit for global */
  entity?:      string
  /** Priority within the extension ordering */
  priority?:    number
  /** Feature flag ID — extension inactive unless flag is enabled */
  featureFlag?: string
}

// ── Relationship extension ────────────────────────────────────────────────

/**
 * Wrap a RelationshipDefinition as a RuntimeExtension.
 *
 * This enables the extensions: [] pattern for relationships, as an
 * alternative to the EntityDefinition.relationships: [] pattern.
 * Both coexist; this simply contributes via the extension pipeline.
 */
export function relationshipExtension(
  def:     RelationshipDefinition,
  options: BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `relationship:${def.relation}`,
    entity:      options.entity,
    priority:    options.priority ?? def.tabOrder ?? 50,
    featureFlag: options.featureFlag,
    contributes: {
      relationships: [def],
    },
  }
}

// ── Validation extension ──────────────────────────────────────────────────

/**
 * Bundle one or more validators into a RuntimeExtension.
 * Validators run before every save. 'error' severity blocks the save.
 */
export function validationExtension(
  validators: ValidatorContribution[],
  options:    BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `validation:${options.entity ?? 'global'}`,
    entity:      options.entity,
    priority:    options.priority ?? 5,
    featureFlag: options.featureFlag,
    contributes: { validators },
  }
}

// ── Metrics extension ─────────────────────────────────────────────────────

/**
 * Contribute metrics to the analytics dashboard.
 */
export function metricsExtension(
  metrics:  MetricContribution[],
  options:  BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `metrics:${options.entity ?? 'global'}:${metrics.map((m) => m.id).join('+')}`,
    entity:      options.entity,
    priority:    options.priority ?? 50,
    featureFlag: options.featureFlag,
    contributes: { metrics },
  }
}

// ── Toolbar actions extension ─────────────────────────────────────────────

/**
 * Contribute buttons to the editor footer toolbar.
 * Toolbar actions appear between the Delete button and Cancel/Save.
 */
export function toolbarExtension(
  actions:  ToolbarActionContribution[],
  options:  BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `toolbar:${options.entity ?? 'global'}:${actions.map((a) => a.id).join('+')}`,
    entity:      options.entity,
    priority:    options.priority ?? 30,
    featureFlag: options.featureFlag,
    contributes: { toolbarActions: actions },
  }
}

// ── Editor tab extension ──────────────────────────────────────────────────

/**
 * Contribute one or more custom editor tabs.
 * Tabs appear after schema tabs and relationship tabs, ordered by `order`.
 */
export function tabExtension(
  tabs:    EditorTabContribution[],
  options: BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `tab:${options.entity ?? 'global'}:${tabs.map((t) => t.key).join('+')}`,
    entity:      options.entity,
    priority:    options.priority ?? 60,
    featureFlag: options.featureFlag,
    contributes: { editorTabs: tabs },
  }
}

// ── Detail panel extension ────────────────────────────────────────────────

/**
 * Contribute sections to the editor's right-hand detail panel.
 * The panel is toggled by an "Info" button in the editor header.
 */
export function detailPanelExtension(
  panels:  DetailPanelContribution[],
  options: BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `detail:${options.entity ?? 'global'}:${panels.map((p) => p.id).join('+')}`,
    entity:      options.entity,
    priority:    options.priority ?? 80,
    featureFlag: options.featureFlag,
    contributes: { detailPanels: panels },
  }
}

// ── Activity panel extension ──────────────────────────────────────────────

/**
 * Contribute sections to the activity panel within the editor.
 */
export function activityExtension(
  panels:  ActivityPanelContribution[],
  options: BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `activity:${options.entity ?? 'global'}:${panels.map((p) => p.id).join('+')}`,
    entity:      options.entity,
    priority:    options.priority ?? 90,
    featureFlag: options.featureFlag,
    contributes: { activityPanels: panels },
  }
}

// ── Command extension ─────────────────────────────────────────────────────

/**
 * Contribute entity-context commands to the command palette.
 * Commands are available when the editor is open for the given entity.
 */
export function commandExtension(
  commands: CommandContribution[],
  options:  BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `command:${options.entity ?? 'global'}:${commands.map((c) => c.id).join('+')}`,
    entity:      options.entity,
    priority:    options.priority ?? 40,
    featureFlag: options.featureFlag,
    contributes: { commands },
  }
}

// ── Widget extension ──────────────────────────────────────────────────────

/**
 * Contribute dashboard widgets. Widgets are registered to the Widget Registry
 * and appear on the dashboard automatically.
 */
export function widgetExtension(
  widgets:  WidgetContribution[],
  options:  BaseOptions = {},
): RuntimeExtension {
  return {
    id:          `widget:${options.entity ?? 'global'}:${widgets.map((w) => w.id).join('+')}`,
    entity:      options.entity,
    priority:    options.priority ?? 70,
    featureFlag: options.featureFlag,
    contributes: { widgets },
  }
}
