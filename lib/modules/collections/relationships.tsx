/**
 * Collection relationship definitions.
 *
 * Registered via EntityDefinition.relationships in definition.tsx.
 * CRUDPage automatically renders one tab per relationship.
 *
 * Products relationship:
 *   – Table layout with sort_order + featured metadata
 *   – Attach/detach/reorder all supported
 *   – Featured flag editable via metadata SlideOver
 *   – Search scoped to the collection's campaign via parentId
 */

import { Package } from 'lucide-react'
import { Permissions } from '@/lib/admin/permissions'
import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'
import type { CollectionProductRow } from './repository'
import {
  getCollectionProducts,
  searchCollectionProducts,
  attachCollectionProducts,
  detachCollectionProduct,
  reorderCollectionProductsAdmin,
  updateCollectionProductMetaAdmin,
} from './admin-service'

// ── Product row display helpers ───────────────────────────────────────────

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// ── Products relationship ─────────────────────────────────────────────────

export const collectionProductsRelationship: RelationshipDefinition<CollectionProductRow> = {
  // ── Child entity config ───────────────────────────────────────────────
  entity: {
    name:       'Product',
    namePlural: 'Products',
    icon:       Package,
    rowKey:     (row) => row.id,
    columns: [
      {
        key:    'name',
        label:  'Product',
        render: (row) => (
          <div>
            <div className="font-medium text-sm text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-400">{row.slug}</div>
          </div>
        ),
      },
      {
        key:    'price_cents',
        label:  'Price',
        render: (row) => (
          <span className="text-sm text-gray-600 tabular-nums">
            {formatPrice(row.price_cents)}
          </span>
        ),
      },
      {
        key:    'active',
        label:  'Status',
        render: (row) => (
          <span className={row.active ? 'text-green-600 text-xs font-medium' : 'text-gray-400 text-xs'}>
            {row.active ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        key:    'featured',
        label:  'Featured',
        render: (row) => (
          row.featured
            ? <span className="text-xs font-medium text-amber-600">Featured</span>
            : <span className="text-xs text-gray-300">—</span>
        ),
      },
    ],
    searchable:   true,
    searchKeys:   ['name', 'slug'],
  },

  // ── Relation config ───────────────────────────────────────────────────
  relation:      'products',
  label:         'Products',
  labelSingular: 'Product',
  tabOrder:      10,
  attachable:    true,
  detachable:    true,
  sortable:      true,
  sortKey:       'sort_order',
  layout:        'table',

  // ── Metadata (featured flag, editable in SlideOver) ───────────────────
  metadataFields: [
    {
      key:         'featured',
      component:   'toggle',
      label:       'Featured product',
      description: 'Show this product prominently within the collection.',
    },
  ],
  getMetadata: (row) => ({ featured: row.featured }),

  // ── Permissions ───────────────────────────────────────────────────────
  permissions: {
    attach:   Permissions.COLLECTIONS_UPDATE,
    detach:   Permissions.COLLECTIONS_UPDATE,
    reorder:  Permissions.COLLECTIONS_UPDATE,
  },

  // ── Events ────────────────────────────────────────────────────────────
  events: {
    attached:  'admin.collection.product_attached'  as const,
    detached:  'admin.collection.product_detached'  as const,
    reordered: 'admin.collection.product_reordered' as const,
  },

  // ── Empty state ───────────────────────────────────────────────────────
  emptyTitle:       'No products yet',
  emptyDescription: 'Attach products from this campaign to appear in the collection.',
  emptyIcon:        Package,

  // ── Picker ────────────────────────────────────────────────────────────
  pickerTitle:             'Attach Products',
  pickerSearchPlaceholder: 'Search products by name…',
  pickerEmptyText:         'No products found in this campaign',

  // ── Service callbacks ─────────────────────────────────────────────────
  fetch:          getCollectionProducts,
  search:         searchCollectionProducts,
  attach:         attachCollectionProducts,
  detach:         detachCollectionProduct,
  reorder:        reorderCollectionProductsAdmin,
  updateMetadata: updateCollectionProductMetaAdmin,
}
