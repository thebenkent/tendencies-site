'use client'

/**
 * Product EntityDefinition.
 *
 * Reference implementation for complex business entities — follows the same
 * patterns as Collections (Phase 8) but with richer merchandising data.
 *
 * Exercises every part of the runtime:
 *   – 7 editor tabs (General, Pricing, Operations, Media, SEO, Display, Scheduling)
 *   – 2 relationship tabs (Variants, Branding)
 *   – Extension framework (validation, lifecycle toolbar, commands)
 *   – Permissions, search, metrics, widgets, import/export
 *   – Campaign enrichment pattern (select options injected at page level)
 */

import { Package, Globe, Archive, Copy, Plus, Brush } from 'lucide-react'
import Image from 'next/image'
import StatusBadge from '@/components/admin/StatusBadge'
import { Permissions } from '@/lib/admin/permissions'
import {
  validationExtension,
  toolbarExtension,
  commandExtension,
} from '@/lib/admin/extensions/built-ins'
import type { EntityDefinition } from '@/lib/admin/definitions'
import type { ProductAdminData } from './types'
import { productValidators }            from './validators'
import { productVariantsRelationship, productBrandingRelationship } from './relationships'
import { productCommands }              from './commands'
import { publishProduct, archiveProduct, duplicateProduct, attachProductVariant, attachProductBranding } from './admin-service'

// ── Display helpers ───────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  draft:     'Draft',
  review:    'In Review',
  published: 'Published',
  archived:  'Archived',
  hidden:    'Hidden',
  scheduled: 'Scheduled',
}

const STATUS_VARIANTS: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted'> = {
  draft:     'muted',
  review:    'info',
  published: 'success',
  archived:  'muted',
  hidden:    'default',
  scheduled: 'warning',
}

function fmtPrice(cents: number): string {
  if (!cents && cents !== 0) return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function fmt(date: string | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── EntityDefinition ──────────────────────────────────────────────────────

export const productDefinition: EntityDefinition<ProductAdminData> = {
  name:       'Product',
  namePlural: 'Products',
  icon:       Package,
  rowKey:     (row) => row.id,

  // ── Table columns ──────────────────────────────────────────────────────
  columns: [
    {
      key:   'thumbnail_url',
      label: '',
      render: (row) => (
        <div className="w-9 h-9 rounded bg-gray-100 overflow-hidden relative flex-shrink-0">
          {row.thumbnail_url ? (
            <Image
              src={row.thumbnail_url}
              alt={row.name}
              fill
              className="object-contain p-0.5"
              sizes="36px"
            />
          ) : (
            <span className="flex items-center justify-center h-full text-gray-300 text-base">□</span>
          )}
        </div>
      ),
    },
    {
      key:      'name',
      label:    'Product',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 text-sm">{row.name}</div>
          <div className="text-xs text-gray-400 font-mono mt-0.5">{row.sku || row.slug}</div>
        </div>
      ),
    },
    {
      key:    'status',
      label:  'Status',
      render: (row) => (
        <StatusBadge
          label={STATUS_LABELS[row.status] ?? row.status}
          variant={STATUS_VARIANTS[row.status] ?? 'default'}
          dot
        />
      ),
    },
    {
      key:    'campaign_name',
      label:  'Campaign',
      render: (row) => (
        <span className="text-sm text-gray-500">{row.campaign_name || '—'}</span>
      ),
    },
    {
      key:    'price_cents',
      label:  'Price',
      sortable: true,
      render: (row) => (
        <span className="text-sm tabular-nums">{fmtPrice(row.price_cents)}</span>
      ),
    },
    {
      key:    'minimum_qty',
      label:  'MOQ',
      render: (row) => (
        <span className="text-sm text-gray-500 tabular-nums">{row.minimum_qty}</span>
      ),
    },
    {
      key:    'variant_count',
      label:  'Variants',
      render: (row) => (
        <span className="text-sm text-gray-500 tabular-nums">{row.variant_count}</span>
      ),
    },
    {
      key:    'lead_time_days',
      label:  'Lead time',
      render: (row) => (
        <span className="text-xs text-gray-400">{row.lead_time_days ? `${row.lead_time_days}d` : '—'}</span>
      ),
    },
    {
      key:      'updated_at',
      label:    'Updated',
      sortable: true,
      render:   (row) => <span className="text-xs text-gray-400 tabular-nums">{fmt(row.updated_at)}</span>,
    },
  ],

  defaultSort: { key: 'updated_at', dir: 'desc' },

  // ── Search ─────────────────────────────────────────────────────────────
  searchable:        true,
  searchPlaceholder: 'Search by name, SKU, slug…',
  searchKeys:        ['name', 'slug', 'sku', 'supplier_sku', 'campaign_name'],

  // ── Filters ────────────────────────────────────────────────────────────
  filters: [
    {
      key:     'status',
      label:   'Status',
      type:    'select',
      options: [
        { label: 'Draft',     value: 'draft' },
        { label: 'In Review', value: 'review' },
        { label: 'Published', value: 'published' },
        { label: 'Archived',  value: 'archived' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
    },
    {
      key:     'active',
      label:   'Active',
      type:    'select',
      options: [
        { label: 'Active',   value: 'true' },
        { label: 'Inactive', value: 'false' },
      ],
    },
    {
      key:     'featured',
      label:   'Featured',
      type:    'select',
      options: [
        { label: 'Featured only', value: 'true' },
        { label: 'Not featured',  value: 'false' },
      ],
    },
  ],

  // ── Permissions ────────────────────────────────────────────────────────
  permissions: {
    create:    Permissions.PRODUCTS_CREATE,
    update:    Permissions.PRODUCTS_UPDATE,
    delete:    Permissions.PRODUCTS_DELETE,
    duplicate: Permissions.PRODUCTS_CREATE,
  },

  // ── Empty state ────────────────────────────────────────────────────────
  emptyTitle:        'No products yet',
  emptyDescription:  'Create a product to start building your catalogue.',
  deleteConsequence: 'Deleting a product removes it and all its variants permanently.',

  // ── Editor ─────────────────────────────────────────────────────────────
  editorTitle: (row) => row ? row.name : 'New Product',
  editorWidth: 'lg',

  editorTabs: [
    // ── General ──────────────────────────────────────────────────────────
    {
      key:   'general',
      label: 'General',
      fields: [
        { key: 'name',          component: 'text',     label: 'Name',           required: true, maxLength: 120 },
        { key: 'slug',          component: 'slug',     label: 'Slug',           required: true, autoSlugFrom: 'name' },
        { key: 'sku',           component: 'text',     label: 'SKU',            hint: 'Internal product SKU. Must be unique within this campaign.' },
        { key: 'description',   component: 'textarea', label: 'Description',    rows: 5 },
        // campaignId becomes a select at page level (enriched with live campaign options)
        {
          key:      'campaignId',
          component: 'text',
          label:     'Campaign',
          required:  true,
          hint:      'Campaign this product belongs to.',
        },
        { key: 'collection_id', component: 'text',     label: 'Collection ID',  hint: 'Optional: assign to a collection within this campaign.' },
        { key: 'active',        component: 'toggle',   label: 'Active',         description: 'Inactive products are hidden from customers.' },
      ],
    },

    // ── Pricing ───────────────────────────────────────────────────────────
    {
      key:   'pricing',
      label: 'Pricing',
      fields: [
        { key: 'price_cents',  component: 'number', label: 'Sell price (cents)', required: true, min: 0, hint: 'E.g. 4900 = $49.00' },
        { key: 'cost_cents',   component: 'number', label: 'Cost price (cents)',  min: 0,         hint: 'Internal cost. Not shown to customers.' },
        { key: 'currency',     component: 'select', label: 'Currency',
          options: [
            { label: 'NZD — New Zealand Dollar', value: 'NZD' },
            { label: 'AUD — Australian Dollar',  value: 'AUD' },
            { label: 'USD — US Dollar',          value: 'USD' },
            { label: 'GBP — British Pound',      value: 'GBP' },
          ],
        },
        { key: 'minimum_qty',  component: 'number', label: 'Minimum order qty',  min: 1, hint: 'MOQ — customers must order at least this many.' },
      ],
    },

    // ── Operations ────────────────────────────────────────────────────────
    {
      key:   'operations',
      label: 'Operations',
      fields: [
        { key: 'lead_time_days', component: 'number', label: 'Lead time (days)', min: 0, hint: 'Production + delivery time.' },
        { key: 'supplier_sku',   component: 'text',   label: 'Supplier SKU',     hint: 'Supplier reference number.' },
        { key: 'sizing_notes',   component: 'textarea', label: 'Sizing notes',   rows: 3, hint: 'Shown in size guide context.' },
        { key: 'embroidery_available', component: 'toggle', label: 'Embroidery available' },
        { key: 'embroidery_notes',     component: 'textarea', label: 'Embroidery notes', rows: 3 },
      ],
    },

    // ── Media ─────────────────────────────────────────────────────────────
    {
      key:   'media',
      label: 'Media',
      fields: [
        { key: 'thumbnail_url', component: 'image', label: 'Thumbnail',  aspect: 'square',    hint: 'Compact image for lists and cards. Recommended: 400×400px.' },
      ],
    },

    // ── SEO ───────────────────────────────────────────────────────────────
    {
      key:   'seo',
      label: 'SEO',
      fields: [
        { key: 'seo_title',       component: 'text',     label: 'SEO title',       maxLength: 60,  hint: 'Recommended: 50–60 characters.' },
        { key: 'seo_description', component: 'textarea', label: 'SEO description', rows: 3, maxLength: 160, hint: 'Recommended: 150–160 characters.' },
      ],
    },

    // ── Display ───────────────────────────────────────────────────────────
    {
      key:   'display',
      label: 'Display',
      fields: [
        { key: 'sort_order', component: 'number',  label: 'Sort order', hint: 'Lower numbers appear first.', min: 0 },
        { key: 'featured',   component: 'toggle',  label: 'Featured product', description: 'Highlights this product in featured sections.' },
      ],
    },

    // ── Scheduling ────────────────────────────────────────────────────────
    {
      key:   'scheduling',
      label: 'Scheduling',
      fields: [
        { key: 'publish_at', component: 'datetime', label: 'Publish at', hint: 'Auto-publish at this time. Leave blank to publish manually.' },
        { key: 'archive_at', component: 'datetime', label: 'Archive at', hint: 'Auto-archive at this time. Leave blank to archive manually.' },
      ],
    },
  ],

  // ── Relationships ──────────────────────────────────────────────────────
  // Each RelationshipDefinition becomes an automatic editor tab.
  relationships: [
    productVariantsRelationship as never,  // inline child — not a true many-to-many
    productBrandingRelationship as never,
  ],

  // ── Extensions ────────────────────────────────────────────────────────
  extensions: [

    // Validation — runs before every save
    validationExtension(productValidators, {
      entity:   'products',
      priority: 5,
    }),

    // Lifecycle toolbar actions
    toolbarExtension(
      [
        {
          id:      'products:publish',
          label:   'Publish',
          icon:    Globe,
          variant: 'primary',
          order:   10,
          hidden:  (data) => data['status'] === 'published' || data['status'] === 'archived',
          onClick: async (data, tenantId) => {
            const id    = String(data['id'] ?? '')
            const label = String(data['name'] ?? id)
            const cur   = String(data['status'] ?? 'draft')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (id) await publishProduct(id, tenantId, label, cur as any)
          },
          permission: Permissions.PRODUCTS_PUBLISH,
        },
        {
          id:      'products:archive',
          label:   'Archive',
          icon:    Archive,
          variant: 'danger',
          order:   20,
          hidden:  (data) => data['status'] === 'archived',
          onClick: async (data, tenantId) => {
            const id    = String(data['id'] ?? '')
            const label = String(data['name'] ?? id)
            const cur   = String(data['status'] ?? 'published')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (id) await archiveProduct(id, tenantId, label, cur as any)
          },
          permission: Permissions.PRODUCTS_ARCHIVE,
        },
        {
          id:      'products:duplicate',
          label:   'Duplicate',
          icon:    Copy,
          order:   30,
          hidden:  (data) => !data['id'],
          onClick: async (data, tenantId) => {
            const id = String(data['id'] ?? '')
            if (id) await duplicateProduct(id, tenantId)
          },
          permission: Permissions.PRODUCTS_CREATE,
        },
        {
          id:      'products:add-variant',
          label:   'Add Variant',
          icon:    Plus,
          order:   40,
          hidden:  (data) => !data['id'],
          onClick: async (data, tenantId) => {
            const id = String(data['id'] ?? '')
            if (id) await attachProductVariant(id, [], tenantId)
          },
          permission: Permissions.PRODUCTS_UPDATE,
        },
        {
          id:      'products:add-branding',
          label:   'Add Branding',
          icon:    Brush,
          order:   50,
          hidden:  (data) => !data['id'],
          onClick: async (data, tenantId) => {
            const id = String(data['id'] ?? '')
            if (id) await attachProductBranding(id, [], tenantId)
          },
          permission: Permissions.PRODUCTS_UPDATE,
        },
      ],
      { entity: 'products', priority: 30 },
    ),

    // Command palette
    commandExtension(productCommands, {
      entity:   'products',
      priority: 40,
    }),
  ],
}
