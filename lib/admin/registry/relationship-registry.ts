/**
 * RelationshipRegistry.
 *
 * Plugins and modules register relationships against entity keys here.
 * CRUDPage merges registered relationships with those declared inline on
 * EntityDefinition.relationships, allowing plugins to add relationships
 * to existing entities without editing their definition files.
 *
 * Registration (in a plugin or module setup file):
 *
 *   registerRelationship('campaigns', landingPageRelationship)
 *
 * This causes the Campaign editor to gain a "Landing Pages" tab automatically,
 * without changing CampaignDefinition.
 *
 * Priority / ordering:
 *   Relationships from EntityDefinition.relationships appear first (in declaration
 *   order, then by tabOrder). Registry-contributed relationships appear after,
 *   also sorted by tabOrder.
 */

import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'

class RelationshipRegistry {
  private readonly _registry = new Map<string, RelationshipDefinition[]>()

  /**
   * Register a relationship for the given entity key.
   * entityKey matches the EntityRegistration.key (e.g. 'campaigns', 'products').
   */
  register(entityKey: string, def: RelationshipDefinition): this {
    const existing = this._registry.get(entityKey) ?? []
    // Prevent duplicate registration of the same relation key
    if (!existing.find((d) => d.relation === def.relation)) {
      this._registry.set(entityKey, [...existing, def])
    }
    return this
  }

  /** Remove a previously-registered relationship. */
  unregister(entityKey: string, relation: string): this {
    const existing = this._registry.get(entityKey) ?? []
    this._registry.set(entityKey, existing.filter((d) => d.relation !== relation))
    return this
  }

  /** Get all plugin-contributed relationships for an entity. */
  getForEntity(entityKey: string): RelationshipDefinition[] {
    const defs = this._registry.get(entityKey) ?? []
    return [...defs].sort((a, b) => (a.tabOrder ?? 999) - (b.tabOrder ?? 999))
  }

  /** All registered relationships keyed by entity. */
  all(): Map<string, RelationshipDefinition[]> {
    return new Map(this._registry)
  }

  /** True if any relationships are registered for the given entity. */
  has(entityKey: string): boolean {
    return (this._registry.get(entityKey)?.length ?? 0) > 0
  }
}

export const relationshipRegistry = new RelationshipRegistry()

export function registerRelationship(entityKey: string, def: RelationshipDefinition): void {
  relationshipRegistry.register(entityKey, def)
}
