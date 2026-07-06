/**
 * ExtensionRegistry — central store for all RuntimeExtension registrations.
 *
 * Parallel to SearchRegistry, WidgetRegistry, RelationshipRegistry.
 *
 * Extensions are registered at module load time (in setup files or plugin
 * entry points). CRUDPage reads them via useExtensionComposer() on each render.
 *
 * Deduplication: registering an extension with the same ID replaces the prior
 * registration. This allows hot-reload and plugin versioning.
 */

import type { RuntimeExtension, ExtensionContributions } from './definition'

class ExtensionRegistry {
  private readonly _extensions = new Map<string, RuntimeExtension>()

  /** Register an extension. Replaces any existing registration with the same id. */
  register(ext: RuntimeExtension): this {
    this._extensions.set(ext.id, ext)
    return this
  }

  /** Remove an extension by id. */
  unregister(id: string): this {
    this._extensions.delete(id)
    return this
  }

  /** Retrieve a specific extension by id. */
  get(id: string): RuntimeExtension | undefined {
    return this._extensions.get(id)
  }

  /**
   * Get all extensions applicable to an entity.
   *
   * Returns global extensions (entity === undefined) AND
   * entity-specific extensions (entity === entityKey),
   * sorted by priority ascending.
   */
  getForEntity(entityKey: string): RuntimeExtension[] {
    return this.sorted().filter(
      (ext) => !ext.entity || ext.entity === entityKey,
    )
  }

  /**
   * Get all extensions that contribute a specific type.
   *
   * @param type  key of ExtensionContributions (e.g. 'editorTabs', 'validators')
   * @param entityKey  optional — filter to entity-applicable extensions
   */
  getByType<K extends keyof ExtensionContributions>(
    type: K,
    entityKey?: string,
  ): RuntimeExtension[] {
    const exts = entityKey ? this.getForEntity(entityKey) : this.sorted()
    return exts.filter((ext) => (ext.contributes[type]?.length ?? 0) > 0)
  }

  /** All registered extensions, sorted by priority. */
  all(): RuntimeExtension[] {
    return this.sorted()
  }

  /** True if any extensions are registered for the given entity (or globally). */
  has(entityKey: string): boolean {
    return this.getForEntity(entityKey).length > 0
  }

  private sorted(): RuntimeExtension[] {
    return Array.from(this._extensions.values())
      .sort((a, b) => a.priority - b.priority)
  }
}

export const extensionRegistry = new ExtensionRegistry()

/** Register an extension globally or for a specific entity. */
export function registerExtension(ext: RuntimeExtension): void {
  extensionRegistry.register(ext)
}

/** Remove a previously-registered extension. */
export function unregisterExtension(id: string): void {
  extensionRegistry.unregister(id)
}
