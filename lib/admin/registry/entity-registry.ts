/**
 * Entity Registry.
 *
 * Central source of truth for every navigable entity and module in the admin.
 * Navigation, command palette, breadcrumbs, search, audit labels, and
 * permissions all derive from registrations — never from hard-coded arrays.
 *
 * Two registration types:
 *   EntityRegistration — a full CRUD entity (Campaigns, Products, Collections…)
 *   ModuleRegistration — a custom page (Dashboard, Orders, Analytics…)
 */

import type { ComponentType } from 'react'
import type { EntityDefinition } from '@/lib/admin/definitions'

// ── Nav grouping ──────────────────────────────────────────────────────────

export type NavGroup = 'operations' | 'content' | 'platform'

// ── Entity registration ───────────────────────────────────────────────────

export type EntityRegistration<T extends Record<string, unknown> = Record<string, unknown>> = {
  readonly kind:        'entity'
  readonly key:         string                       // unique slug, e.g. "campaigns"
  readonly definition:  EntityDefinition<T>
  readonly basePath:    string                       // URL segment, e.g. "campaigns"
  readonly navGroup:    NavGroup
  readonly navPriority: number                       // lower = higher in group
  readonly navHidden?:  boolean                      // registered but invisible in nav
}

// ── Module registration (non-CRUD custom page) ────────────────────────────

export type ModuleRegistration = {
  readonly kind:        'module'
  readonly key:         string
  readonly label:       string
  readonly icon:        ComponentType<{ className?: string }>
  readonly basePath:    string
  readonly navGroup:    NavGroup
  readonly navPriority: number
  readonly exact?:      boolean                      // match path exactly (for root Dashboard)
  readonly badge?:      string | (() => string | null) // e.g. unread count
}

export type NavRegistration = EntityRegistration | ModuleRegistration

// ── Registry ──────────────────────────────────────────────────────────────

class EntityRegistry {
  private readonly _entities = new Map<string, EntityRegistration>()
  private readonly _modules  = new Map<string, ModuleRegistration>()

  // Registration
  entity<T extends Record<string, unknown>>(reg: Omit<EntityRegistration<T>, 'kind'>): this {
    this._entities.set(reg.key, { kind: 'entity', ...reg } as EntityRegistration)
    return this
  }

  module(reg: Omit<ModuleRegistration, 'kind'>): this {
    this._modules.set(reg.key, { kind: 'module', ...reg })
    return this
  }

  // Queries
  getEntity(key: string): EntityRegistration | undefined {
    return this._entities.get(key)
  }

  getEntityByPath(basePath: string): EntityRegistration | undefined {
    return Array.from(this._entities.values()).find((e) => e.basePath === basePath)
  }

  getModule(key: string): ModuleRegistration | undefined {
    return this._modules.get(key)
  }

  allEntities(): EntityRegistration[] {
    return Array.from(this._entities.values())
  }

  allModules(): ModuleRegistration[] {
    return Array.from(this._modules.values())
  }

  /** All visible nav items (entities + modules), sorted by priority within each group. */
  navByGroup(): Record<NavGroup, NavRegistration[]> {
    const all: NavRegistration[] = [
      ...Array.from(this._entities.values()).filter((e) => !e.navHidden),
      ...Array.from(this._modules.values()),
    ]

    const sorted = (g: NavGroup) =>
      all.filter((n) => n.navGroup === g).sort((a, b) => a.navPriority - b.navPriority)

    return {
      operations: sorted('operations'),
      content:    sorted('content'),
      platform:   sorted('platform'),
    }
  }

  /** Flat list ordered by group then priority — for command palette. */
  allNavItems(): NavRegistration[] {
    const { operations, content, platform } = this.navByGroup()
    return [...operations, ...content, ...platform]
  }

  isEntityNav(item: NavRegistration): item is EntityRegistration {
    return item.kind === 'entity'
  }

  isModuleNav(item: NavRegistration): item is ModuleRegistration {
    return item.kind === 'module'
  }
}

export const entityRegistry = new EntityRegistry()

// ── Convenience registration functions ───────────────────────────────────

export function registerEntity<T extends Record<string, unknown>>(
  reg: Omit<EntityRegistration<T>, 'kind'>,
) {
  entityRegistry.entity(reg)
}

export function registerModule(reg: Omit<ModuleRegistration, 'kind'>) {
  entityRegistry.module(reg)
}
