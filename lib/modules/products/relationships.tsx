'use client'

/**
 * Product relationship definitions.
 *
 * Variants and Branding are inline child records (not many-to-many).
 * The relationship framework renders them as editor tabs automatically.
 *
 * UI pattern for inline children:
 *   – attachable: false  → no search picker
 *   – detachable: true   → remove button on each row
 *   – sortable: true     → drag-to-reorder
 *   – metadataFields     → inline editing of all child fields
 *   – "Add" action via toolbarExtension command, not the picker flow
 */

import { Layers, Brush } from 'lucide-react'
import { Permissions } from '@/lib/admin/permissions'
import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'
import type { ProductVariantAdminRow, ProductBrandingAdminRow } from './repository'
import {
  getProductVariants,
  searchProductVariants,
  attachProductVariant,
  detachProductVariant,
  reorderProductVariants,
  updateProductVariantMeta,
  getProductBranding,
  searchProductBranding,
  attachProductBranding,
  detachProductBranding,
  reorderProductBranding,
  updateProductBrandingMeta,
} from './admin-service'
import { AdminEvents } from '@/lib/admin/dispatcher'

function fmtPrice(cents: number): string {
  if (!cents) return '—'
  return `+$${(cents / 100).toFixed(2)}`
}

// ── Variants ──────────────────────────────────────────────────────────────

export const productVariantsRelationship: RelationshipDefinition<ProductVariantAdminRow> = {
  entity: {
    name:       'Variant',
    namePlural: 'Variants',
    icon:       Layers,
    rowKey:     (row) => row.id,
    columns: [
      {
        key:   'colour',
        label: 'Colour',
        render: (row) => (
          <span className="text-sm font-medium text-gray-900">{row.colour || '—'}</span>
        ),
      },
      {
        key:   'size',
        label: 'Size',
        render: (row) => (
          <span className="text-sm text-gray-700">{row.size || '—'}</span>
        ),
      },
      {
        key:   'fit',
        label: 'Fit',
        render: (row) => (
          <span className="text-sm text-gray-500">{row.fit || 'Universal'}</span>
        ),
      },
      {
        key:   'sku',
        label: 'SKU',
        render: (row) => (
          <span className="text-xs text-gray-400 font-mono">{row.sku || '—'}</span>
        ),
      },
      {
        key:   'additional_cost_cents',
        label: 'Add. cost',
        render: (row) => (
          <span className="text-sm text-gray-500 tabular-nums">{fmtPrice(row.additional_cost_cents)}</span>
        ),
      },
      {
        key:   'available',
        label: 'Available',
        render: (row) => (
          <span className={row.available ? 'text-green-600 text-xs font-medium' : 'text-gray-400 text-xs'}>
            {row.available ? 'Yes' : 'No'}
          </span>
        ),
      },
    ],
  },

  relation:      'variants',
  label:         'Variants',
  labelSingular: 'Variant',
  tabOrder:      10,

  attachable: false,  // variants created via toolbar "Add Variant" action
  detachable: true,
  sortable:   true,
  sortKey:    'sort_order',

  layout: 'table',

  metadataFields: [
    { key: 'colour',                component: 'text',   label: 'Colour' },
    { key: 'size',                  component: 'text',   label: 'Size',      required: true },
    { key: 'fit',                   component: 'select', label: 'Fit',
      options: [
        { label: 'Universal', value: '' },
        { label: 'Mens',      value: 'Mens' },
        { label: 'Womens',    value: 'Womens' },
        { label: 'Youth',     value: 'Youth' },
        { label: 'Unisex',    value: 'Unisex' },
      ],
    },
    { key: 'sku',                   component: 'text',   label: 'SKU' },
    { key: 'barcode',               component: 'text',   label: 'Barcode' },
    { key: 'additional_cost_cents', component: 'number', label: 'Additional cost (cents)', min: 0 },
    { key: 'available',             component: 'toggle', label: 'Available' },
    { key: 'stock_qty',             component: 'number', label: 'Stock qty',    hint: 'Leave blank for unlimited.' },
  ],

  getMetadata: (row) => ({
    colour:                row.colour,
    size:                  row.size,
    fit:                   row.fit,
    sku:                   row.sku ?? '',
    barcode:               row.barcode ?? '',
    additional_cost_cents: row.additional_cost_cents,
    available:             row.available,
    stock_qty:             row.stock_qty ?? '',
  }),

  permissions: {
    detach:         Permissions.PRODUCTS_UPDATE,
    reorder:        Permissions.PRODUCTS_UPDATE,
    updateMetadata: Permissions.PRODUCTS_UPDATE,
  },

  events: {
    detached:  AdminEvents.PRODUCT_VARIANT_REMOVED,
  },

  emptyTitle:       'No variants yet',
  emptyDescription: 'Click "Add Variant" in the toolbar to add a size, colour, or fit option.',
  emptyIcon:        Layers,

  fetch:          getProductVariants,
  search:         searchProductVariants,
  attach:         attachProductVariant,
  detach:         detachProductVariant,
  reorder:        reorderProductVariants,
  updateMetadata: updateProductVariantMeta,
}

// ── Branding methods ──────────────────────────────────────────────────────

const BRANDING_METHOD_LABELS: Record<string, string> = {
  screen_print:     'Screen Print',
  embroidery:       'Embroidery',
  pad_print:        'Pad Print',
  laser:            'Laser',
  uv:               'UV Print',
  digital_transfer: 'Digital Transfer',
  sublimation:      'Sublimation',
  custom:           'Custom',
}

export const productBrandingRelationship: RelationshipDefinition<ProductBrandingAdminRow> = {
  entity: {
    name:       'Branding',
    namePlural: 'Branding',
    icon:       Brush,
    rowKey:     (row) => row.id,
    columns: [
      {
        key:   'method',
        label: 'Method',
        render: (row) => (
          <span className="text-sm font-medium text-gray-900">
            {BRANDING_METHOD_LABELS[row.method] ?? row.method}
          </span>
        ),
      },
      {
        key:   'position',
        label: 'Position',
        render: (row) => (
          <span className="text-sm text-gray-600">{row.position || '—'}</span>
        ),
      },
      {
        key:   'max_colours',
        label: 'Max colours',
        render: (row) => (
          <span className="text-sm text-gray-500 tabular-nums">{row.max_colours ?? '—'}</span>
        ),
      },
      {
        key:   'additional_cost_cents',
        label: 'Add. cost',
        render: (row) => (
          <span className="text-sm text-gray-500 tabular-nums">{fmtPrice(row.additional_cost_cents)}</span>
        ),
      },
    ],
  },

  relation:      'branding',
  label:         'Branding',
  labelSingular: 'Branding method',
  tabOrder:      20,

  attachable: false,  // created via "Add Branding Method" toolbar action
  detachable: true,
  sortable:   true,
  sortKey:    'sort_order',

  layout: 'table',

  metadataFields: [
    { key: 'method',   component: 'select', label: 'Method', required: true,
      options: Object.entries(BRANDING_METHOD_LABELS).map(([v, l]) => ({ value: v, label: l })),
    },
    { key: 'position',              component: 'text',   label: 'Position',      hint: 'E.g. Left chest, Back, Sleeve' },
    { key: 'max_colours',           component: 'number', label: 'Max colours',   min: 1 },
    { key: 'artwork_notes',         component: 'textarea', label: 'Artwork notes', rows: 3 },
    { key: 'additional_cost_cents', component: 'number', label: 'Setup cost (cents)', min: 0 },
  ],

  getMetadata: (row) => ({
    method:                row.method,
    position:              row.position ?? '',
    max_colours:           row.max_colours ?? '',
    artwork_notes:         row.artwork_notes ?? '',
    additional_cost_cents: row.additional_cost_cents,
  }),

  permissions: {
    detach:         Permissions.PRODUCTS_UPDATE,
    reorder:        Permissions.PRODUCTS_UPDATE,
    updateMetadata: Permissions.PRODUCTS_UPDATE,
  },

  events: {
    detached: AdminEvents.PRODUCT_BRANDING_REMOVED,
  },

  emptyTitle:       'No branding methods',
  emptyDescription: 'Click "Add Branding" in the toolbar to specify decoration options.',
  emptyIcon:        Brush,

  fetch:          getProductBranding,
  search:         searchProductBranding,
  attach:         attachProductBranding,
  detach:         detachProductBranding,
  reorder:        reorderProductBranding,
  updateMetadata: updateProductBrandingMeta,
}
