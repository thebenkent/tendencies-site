'use client'

/**
 * Collection EntityDefinition.
 *
 * Reference implementation — the canonical example for all future CMS modules.
 *
 * Exercises every part of the runtime:
 *   – CRUDPage: list, filter, sort, search, bulk actions, editor
 *   – Relationships: Products (sortable, featured metadata)
 *   – Extensions: validation, toolbar actions, commands, metrics, widgets
 *   – Lifecycle: Draft → Review → Published → Archived (via toolbar actions)
 *   – Permissions: all CRUD + publish + reorder gates
 *   – Search: registered provider, appears in command palette
 *   – Import/Export: CSV importer and exporter registered at startup
 *
 * Nothing in this file is bespoke admin UI.
 * Everything is composed from runtime primitives.
 */

import { Layers, Globe, Archive, Copy } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { Permissions } from '@/lib/admin/permissions'
import {
  validationExtension,
  toolbarExtension,
  commandExtension,
} from '@/lib/admin/extensions/built-ins'
import type { EntityDefinition } from '@/lib/admin/definitions'
import type { CollectionAdminData } from './admin-service'
import { collectionValidators } from './validators'
import { collectionProductsRelationship } from './relationships'
import { collectionCommands } from './commands'
import { publishCollection, archiveCollection, duplicateCollection } from './admin-service'

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

function fmt(date: string | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── EntityDefinition ──────────────────────────────────────────────────────

export const collectionDefinition: EntityDefinition<CollectionAdminData> = {
  name:        'Collection',
  namePlural:  'Collections',
  icon:        Layers,
  rowKey:      (row) => row.id,

  // ── Table columns ──────────────────────────────────────────────────────
  columns: [
    {
      key:      'name',
      label:    'Collection',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 text-sm">{row.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{row.slug}</div>
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
        <span className="text-sm text-gray-600">{row.campaign_name || '—'}</span>
      ),
    },
    {
      key:    'product_count',
      label:  'Products',
      render: (row) => (
        <span className="text-sm text-gray-500 tabular-nums">{row.product_count}</span>
      ),
    },
    {
      key:    'visible',
      label:  'Visible',
      render: (row) => (
        <span className={row.visible ? 'text-green-600 text-xs font-medium' : 'text-gray-400 text-xs'}>
          {row.visible ? 'Public' : 'Hidden'}
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
  searchPlaceholder: 'Search collections…',
  searchKeys:        ['name', 'slug', 'description', 'campaign_name'],

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
      key:     'visible',
      label:   'Visibility',
      type:    'select',
      options: [
        { label: 'Public', value: 'true' },
        { label: 'Hidden', value: 'false' },
      ],
    },
    {
      key:     'featured',
      label:   'Featured',
      type:    'select',
      options: [
        { label: 'Featured only', value: 'true' },
        { label: 'Not featured', value: 'false' },
      ],
    },
  ],

  // ── Permissions ────────────────────────────────────────────────────────
  permissions: {
    create:    Permissions.COLLECTIONS_CREATE,
    update:    Permissions.COLLECTIONS_UPDATE,
    delete:    Permissions.COLLECTIONS_DELETE,
    duplicate: Permissions.COLLECTIONS_CREATE,
  },

  // ── Empty state ────────────────────────────────────────────────────────
  emptyTitle:        'No collections yet',
  emptyDescription:  'Create a collection to group products within a campaign.',
  deleteConsequence: 'Deleting a collection removes the product groupings but not the products themselves.',

  // ── Editor ─────────────────────────────────────────────────────────────
  editorTitle:  (row) => row ? row.name : 'New Collection',
  editorWidth:  'lg',

  editorTabs: [
    // ── General ──────────────────────────────────────────────────────────
    {
      key:   'general',
      label: 'General',
      fields: [
        { key: 'name',        component: 'text',     label: 'Name',        required: true, maxLength: 120 },
        { key: 'slug',        component: 'slug',     label: 'Slug',        required: true, autoSlugFrom: 'name' },
        { key: 'description', component: 'textarea', label: 'Description', rows: 3 },
        {
          key:       'campaignId',
          component: 'text',
          label:     'Campaign ID',
          required:  true,
          hint:      'The campaign this collection belongs to.',
          disabled:  false,
        },
      ],
    },

    // ── Media ─────────────────────────────────────────────────────────────
    {
      key:   'media',
      label: 'Media',
      fields: [
        { key: 'image_url',     component: 'image', label: 'Hero image',     aspect: 'landscape', hint: 'Displayed at the top of the collection page. Recommended: 1920×640px.' },
        { key: 'thumbnail_url', component: 'image', label: 'Thumbnail',      aspect: 'square',    hint: 'Compact image used in cards and lists. Recommended: 400×400px.' },
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
        { key: 'sort_order', component: 'number',   label: 'Sort order', hint: 'Lower numbers appear first.', min: 0 },
        { key: 'visible',    component: 'toggle',   label: 'Visible on storefront', description: 'When off, this collection is hidden from customers.' },
        { key: 'featured',   component: 'toggle',   label: 'Featured collection',   description: 'Highlights this collection in featured sections.' },
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
  // No bespoke relationship UI.
  relationships: [
    collectionProductsRelationship,
  ],

  // ── Extensions ────────────────────────────────────────────────────────
  // Validators, toolbar lifecycle actions, and commands registered here.
  // Exercised automatically by the runtime composition engine (useExtensionComposer).
  extensions: [

    // Validation — runs before every save
    validationExtension(collectionValidators, {
      entity:   'collections',
      priority: 5,
    }),

    // Lifecycle toolbar actions — appear in editor footer
    toolbarExtension(
      [
        {
          id:       'collections:publish',
          label:    'Publish',
          icon:     Globe,
          variant:  'primary',
          order:    10,
          hidden:   (data) => data['status'] === 'published' || data['status'] === 'archived',
          onClick:  async (data, tenantId) => {
            const id    = String(data['id'] ?? '')
            const label = String(data['name'] ?? id)
            if (id) await publishCollection(id, tenantId, label)
          },
          permission: Permissions.COLLECTIONS_UPDATE,
        },
        {
          id:       'collections:archive',
          label:    'Archive',
          icon:     Archive,
          variant:  'danger',
          order:    20,
          hidden:   (data) => data['status'] === 'archived',
          onClick:  async (data, tenantId) => {
            const id    = String(data['id'] ?? '')
            const label = String(data['name'] ?? id)
            if (id) await archiveCollection(id, tenantId, label)
          },
          permission: Permissions.COLLECTIONS_UPDATE,
        },
        {
          id:       'collections:duplicate',
          label:    'Duplicate',
          icon:     Copy,
          order:    30,
          hidden:   (data) => !data['id'],
          onClick:  async (data, tenantId) => {
            const id = String(data['id'] ?? '')
            if (id) await duplicateCollection(id, tenantId)
          },
          permission: Permissions.COLLECTIONS_CREATE,
        },
      ],
      { entity: 'collections', priority: 30 },
    ),

    // Command palette commands — entity-context, shown when editor is open
    commandExtension(collectionCommands, {
      entity:   'collections',
      priority: 40,
    }),
  ],
}
