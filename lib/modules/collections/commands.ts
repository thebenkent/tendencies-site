/**
 * Collection command palette commands.
 *
 * These are entity-context commands registered via commandExtension()
 * in the EntityDefinition. They appear in the command palette when the
 * Collections editor is open.
 */

import type { CommandContribution } from '@/lib/admin/extensions/definition'
import { Permissions } from '@/lib/admin/permissions'
import { publishCollection, archiveCollection, duplicateCollection } from './admin-service'

export const collectionCommands: CommandContribution[] = [
  // ── Publish ─────────────────────────────────────────────────────────────
  {
    id:      'collections:publish',
    label:   'Publish Collection',
    keywords: ['publish', 'live', 'launch'],
    hidden:  (data) => data['status'] === 'published' || data['status'] === 'archived',
    onClick: async (data, tenantId) => {
      const id    = String(data['id'] ?? '')
      const label = String(data['name'] ?? id)
      if (!id) return
      await publishCollection(id, tenantId, label)
    },
    permission: Permissions.COLLECTIONS_UPDATE,
  },

  // ── Archive ─────────────────────────────────────────────────────────────
  {
    id:      'collections:archive',
    label:   'Archive Collection',
    keywords: ['archive', 'hide', 'remove'],
    hidden:  (data) => data['status'] === 'archived',
    onClick: async (data, tenantId) => {
      const id    = String(data['id'] ?? '')
      const label = String(data['name'] ?? id)
      if (!id) return
      await archiveCollection(id, tenantId, label)
    },
    permission: Permissions.COLLECTIONS_UPDATE,
  },

  // ── Duplicate ────────────────────────────────────────────────────────────
  {
    id:      'collections:duplicate',
    label:   'Duplicate Collection',
    keywords: ['duplicate', 'copy', 'clone'],
    hidden:  (data) => !data['id'],
    onClick: async (data, tenantId) => {
      const id = String(data['id'] ?? '')
      if (!id) return
      await duplicateCollection(id, tenantId)
    },
    permission: Permissions.COLLECTIONS_CREATE,
  },
]
