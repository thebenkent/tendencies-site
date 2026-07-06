/**
 * Product command palette contributions.
 *
 * Registered via commandExtension() in the EntityDefinition.
 * These commands appear in the command palette when a product editor is open.
 */

import { Globe, Archive, Copy, Plus, Brush } from 'lucide-react'
import type { CommandContribution } from '@/lib/admin/extensions/definition'
import { Permissions } from '@/lib/admin/permissions'

export const productCommands: CommandContribution[] = [
  {
    id:      'products:publish',
    label:   'Publish Product',
    icon:    Globe,
    keywords: ['publish', 'go live', 'activate'],
    hidden: (data) => data['status'] === 'published' || data['status'] === 'archived',
    onClick: async (data, tenantId) => {
      const id    = String(data['id'] ?? '')
      const label = String(data['name'] ?? id)
      const cur   = String(data['status'] ?? 'draft')
      if (!id) return
      const { publishProduct } = await import('./admin-service')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await publishProduct(id, tenantId, label, cur as any)
    },
    permission: Permissions.PRODUCTS_PUBLISH,
  },
  {
    id:      'products:archive',
    label:   'Archive Product',
    icon:    Archive,
    keywords: ['archive', 'retire', 'deactivate'],
    hidden: (data) => data['status'] === 'archived',
    onClick: async (data, tenantId) => {
      const id    = String(data['id'] ?? '')
      const label = String(data['name'] ?? id)
      const cur   = String(data['status'] ?? 'published')
      if (!id) return
      const { archiveProduct } = await import('./admin-service')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await archiveProduct(id, tenantId, label, cur as any)
    },
    permission: Permissions.PRODUCTS_ARCHIVE,
  },
  {
    id:      'products:duplicate',
    label:   'Duplicate Product',
    icon:    Copy,
    keywords: ['duplicate', 'copy', 'clone'],
    hidden: (data) => !data['id'],
    onClick: async (data, tenantId) => {
      const id = String(data['id'] ?? '')
      if (!id) return
      const { duplicateProduct } = await import('./admin-service')
      await duplicateProduct(id, tenantId)
    },
    permission: Permissions.PRODUCTS_CREATE,
  },
  {
    id:      'products:add-variant',
    label:   'Add Variant',
    icon:    Plus,
    keywords: ['add variant', 'size', 'colour', 'color'],
    hidden: (data) => !data['id'],
    onClick: async (data, tenantId) => {
      const id = String(data['id'] ?? '')
      if (!id) return
      const { attachProductVariant } = await import('./admin-service')
      await attachProductVariant(id, [], tenantId)
    },
    permission: Permissions.PRODUCTS_UPDATE,
  },
  {
    id:      'products:add-branding',
    label:   'Add Branding Method',
    icon:    Brush,
    keywords: ['branding', 'print', 'embroidery', 'decoration'],
    hidden: (data) => !data['id'],
    onClick: async (data, tenantId) => {
      const id = String(data['id'] ?? '')
      if (!id) return
      const { attachProductBranding } = await import('./admin-service')
      await attachProductBranding(id, [], tenantId)
    },
    permission: Permissions.PRODUCTS_UPDATE,
  },
]
