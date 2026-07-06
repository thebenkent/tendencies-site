/**
 * Settings Registry.
 *
 * Avoids a hard-coded settings page with fixed sections.
 * Future integrations register their own settings group.
 *
 * Groups render as sidebar sections on the settings page.
 * Each group provides its own page component.
 */

import type { ComponentType } from 'react'
import type { Permission } from '@/lib/admin/permissions'

export type SettingsGroup = {
  /** Unique key, e.g. "branding", "billing", "integrations" */
  id:           string
  label:        string
  description?: string
  /** Icon for sidebar navigation */
  icon?:        ComponentType<{ className?: string }>
  /** Priority — lower renders first in sidebar */
  priority:     number
  /** The settings page component for this group */
  component:    ComponentType<{ tenantId: string; tenantSlug: string }>
  /** Feature flag guard */
  featureFlag?: string
  /** Minimum permission required to view this section */
  permission?:  Permission
}

class SettingsRegistry {
  private readonly _groups = new Map<string, SettingsGroup>()

  register(group: SettingsGroup): this {
    this._groups.set(group.id, group)
    return this
  }

  all(): SettingsGroup[] {
    return Array.from(this._groups.values()).sort((a, b) => a.priority - b.priority)
  }

  get(id: string): SettingsGroup | undefined {
    return this._groups.get(id)
  }
}

export const settingsRegistry = new SettingsRegistry()

export function registerSettingsGroup(group: SettingsGroup) {
  settingsRegistry.register(group)
}
