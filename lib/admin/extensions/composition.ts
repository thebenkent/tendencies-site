'use client'

/**
 * useExtensionComposer — runtime composition engine.
 *
 * Collects and merges all extensions applicable to an entity from:
 *   1. EntityDefinition.extensions  (inline, declared in the definition file)
 *   2. extensionRegistry             (plugin-contributed at runtime)
 *
 * All contribution arrays are sorted by their respective priority/order field.
 * Returns a stable ComposedExtensions object (memoised on definition identity).
 *
 * Usage (in CRUDPage):
 *
 *   const composed = useExtensionComposer(definition)
 *
 *   // composed.editorTabs     — append to allTabs
 *   // composed.toolbarActions — pass to CRUDEditor
 *   // composed.validators     — run in handleSave
 *   // composed.detailPanels   — pass to CRUDEditor
 *   // composed.rowActions     — merge with extraRowActions
 */

import { useMemo } from 'react'
import { extensionRegistry } from './registry'
import type { RuntimeExtension, ExtensionContributions } from './definition'
import type { EntityDefinition } from '@/lib/admin/definitions'

export type ComposedExtensions = {
  editorTabs:     NonNullable<ExtensionContributions['editorTabs']>
  toolbarActions: NonNullable<ExtensionContributions['toolbarActions']>
  rowActions:     NonNullable<ExtensionContributions['rowActions']>
  widgets:        NonNullable<ExtensionContributions['widgets']>
  metrics:        NonNullable<ExtensionContributions['metrics']>
  validators:     NonNullable<ExtensionContributions['validators']>
  activityPanels: NonNullable<ExtensionContributions['activityPanels']>
  detailPanels:   NonNullable<ExtensionContributions['detailPanels']>
  commands:       NonNullable<ExtensionContributions['commands']>
  relationships:  NonNullable<ExtensionContributions['relationships']>
}

const EMPTY: ComposedExtensions = {
  editorTabs:     [],
  toolbarActions: [],
  rowActions:     [],
  widgets:        [],
  metrics:        [],
  validators:     [],
  activityPanels: [],
  detailPanels:   [],
  commands:       [],
  relationships:  [],
}

export function useExtensionComposer<T extends Record<string, unknown>>(
  definition: EntityDefinition<T>,
): ComposedExtensions {
  const entityKey = definition.namePlural.toLowerCase()

  return useMemo((): ComposedExtensions => {
    const inline  = (definition.extensions ?? []) as RuntimeExtension[]
    const plugins = extensionRegistry.getForEntity(entityKey)

    if (inline.length === 0 && plugins.length === 0) return EMPTY

    // Merge inline (higher precedence at same priority) with plugin contributions.
    // Deduplicate by extension ID — inline wins over registry if same ID.
    const seen = new Set<string>()
    const merged: RuntimeExtension[] = []
    for (const ext of [...inline, ...plugins]) {
      if (!seen.has(ext.id)) {
        seen.add(ext.id)
        merged.push(ext)
      }
    }
    merged.sort((a, b) => a.priority - b.priority)

    return {
      editorTabs:     merged.flatMap((e) => e.contributes.editorTabs     ?? [])
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      toolbarActions: merged.flatMap((e) => e.contributes.toolbarActions ?? [])
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      rowActions:     merged.flatMap((e) => e.contributes.rowActions     ?? [])
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      widgets:        merged.flatMap((e) => e.contributes.widgets        ?? [])
                            .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
      metrics:        merged.flatMap((e) => e.contributes.metrics        ?? []),
      validators:     merged.flatMap((e) => e.contributes.validators     ?? []),
      activityPanels: merged.flatMap((e) => e.contributes.activityPanels ?? [])
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      detailPanels:   merged.flatMap((e) => e.contributes.detailPanels   ?? [])
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      commands:       merged.flatMap((e) => e.contributes.commands       ?? []),
      relationships:  merged.flatMap((e) => e.contributes.relationships  ?? [])
                            .sort((a, b) => (a.tabOrder ?? 0) - (b.tabOrder ?? 0)),
    }
  }, [definition, entityKey])
}

/**
 * Run all validators for the current entity data.
 * Returns all issues. Callers block save when any 'error' severity issue exists.
 */
export async function runValidators(
  validators: NonNullable<ExtensionContributions['validators']>,
  data:       Record<string, unknown>,
  tenantId:   string,
  mode:       'create' | 'update',
): Promise<import('./definition').ValidationIssue[]> {
  if (validators.length === 0) return []

  const applicable = validators.filter(
    (v) => !v.when || v.when === 'always' || v.when === mode,
  )

  const results = await Promise.allSettled(
    applicable.map((v) => v.validate(data, tenantId)),
  )

  return results.flatMap((r, i) => {
    if (r.status === 'rejected') {
      console.warn(`[ExtensionRegistry] validator "${applicable[i].id}" threw:`, r.reason)
      return []
    }
    return r.value
  })
}
