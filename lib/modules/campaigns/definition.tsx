/**
 * Campaign EntityDefinition.
 *
 * Central configuration driving the entire Campaign CMS:
 *   – List columns, search, filters, sort
 *   – Bulk actions (publish, archive, duplicate, delete)
 *   – Editor tabs (General, Storefront, Ordering, Branding, Banners, Attributes, Settings)
 *   – Schema-driven fields (FieldSchema → FieldRenderer)
 *   – Custom tab content (BannerManager, AttributeManager, LifecyclePanel)
 *   – Permission gating
 *
 * Reference implementation for all future CMS modules.
 *
 * Extension points:
 *   – editorTabs[].content — inject any React component into an editor tab
 *   – extraActions         — row-level actions beyond edit/delete
 *   – bulkActions          — multi-row operations
 *   – filters              — sidebar/toolbar filter definitions
 */

'use client'

import { Megaphone } from 'lucide-react'
import StatusBadge, { statusVariant } from '@/components/admin/StatusBadge'
import BannerManager from '@/components/admin/campaigns/BannerManager'
import AttributeManager from '@/components/admin/campaigns/AttributeManager'
import CampaignLifecyclePanel from '@/components/admin/campaigns/CampaignLifecyclePanel'
import { Permissions } from '@/lib/admin/permissions'
import type { EntityDefinition } from '@/lib/admin/definitions'
import type { CampaignAdminData } from './admin-service'
import type { CampaignStatus, CampaignType } from '@/lib/merch/types'

// ── Display helpers ───────────────────────────────────────────────────────

const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  reservation:    'Reservation',
  pre_order:      'Pre-Order',
  retail:         'Retail',
  uniform:        'Uniform',
  corporate:      'Corporate',
  event:          'Event',
  gift_redemption:'Gift',
}

const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft:              'Draft',
  open:               'Open',
  closing_soon:       'Closing',
  closed:             'Closed',
  payment_requested:  'Payment',
  production:         'Production',
  completed:          'Completed',
  archived:           'Archived',
}

function fmt(date: string | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── EntityDefinition ──────────────────────────────────────────────────────

export const campaignDefinition: EntityDefinition<CampaignAdminData> = {
  name:        'Campaign',
  namePlural:  'Campaigns',
  icon:        Megaphone,
  rowKey:      (row) => row.id,

  // ── Table columns ──────────────────────────────────────────────────────
  columns: [
    {
      key:      'name',
      label:    'Campaign',
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
          variant={statusVariant(row.status)}
          dot
        />
      ),
    },
    {
      key:    'campaign_type',
      label:  'Type',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {CAMPAIGN_TYPE_LABELS[row.campaign_type] ?? row.campaign_type}
        </span>
      ),
    },
    {
      key:      'opens_at',
      label:    'Opens',
      sortable: true,
      render:   (row) => <span className="text-sm text-gray-600 tabular-nums">{fmt(row.opens_at)}</span>,
    },
    {
      key:      'closes_at',
      label:    'Closes',
      sortable: true,
      render:   (row) => <span className="text-sm text-gray-600 tabular-nums">{fmt(row.closes_at)}</span>,
    },
    {
      key:    'collection_count',
      label:  'Collections',
      render: (row) => (
        <span className="text-sm text-gray-500 tabular-nums">{row.collection_count}</span>
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
      key:    'order_count',
      label:  'Orders',
      render: (row) => (
        <span className="text-sm text-gray-500 tabular-nums">{row.order_count}</span>
      ),
    },
    {
      key:    'is_public',
      label:  'Visible',
      render: (row) => (
        <span className={row.is_public ? 'text-green-600 text-xs font-medium' : 'text-gray-400 text-xs'}>
          {row.is_public ? 'Public' : 'Hidden'}
        </span>
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
  searchable:         true,
  searchPlaceholder:  'Search campaigns…',
  searchKeys:         ['name', 'slug', 'description'],

  // ── Filters ────────────────────────────────────────────────────────────
  filters: [
    {
      key:   'status',
      label: 'Status',
      type:  'select',
      options: [
        { label: 'Draft',      value: 'draft' },
        { label: 'Open',       value: 'open' },
        { label: 'Closing',    value: 'closing_soon' },
        { label: 'Closed',     value: 'closed' },
        { label: 'Production', value: 'production' },
        { label: 'Completed',  value: 'completed' },
        { label: 'Archived',   value: 'archived' },
      ],
    },
    {
      key:   'campaign_type',
      label: 'Type',
      type:  'select',
      options: [
        { label: 'Reservation',    value: 'reservation' },
        { label: 'Pre-Order',      value: 'pre_order' },
        { label: 'Retail',         value: 'retail' },
        { label: 'Uniform',        value: 'uniform' },
        { label: 'Corporate',      value: 'corporate' },
        { label: 'Event',          value: 'event' },
        { label: 'Gift Redemption', value: 'gift_redemption' },
      ],
    },
    {
      key:  'is_public',
      label: 'Visibility',
      type:  'select',
      options: [
        { label: 'Public', value: 'true' },
        { label: 'Hidden', value: 'false' },
      ],
    },
  ],

  // ── Permissions ────────────────────────────────────────────────────────
  permissions: {
    create:    Permissions.CAMPAIGNS_CREATE,
    update:    Permissions.CAMPAIGNS_UPDATE,
    delete:    Permissions.CAMPAIGNS_DELETE,
    duplicate: Permissions.CAMPAIGNS_DUPLICATE,
    archive:   Permissions.CAMPAIGNS_CLOSE,
  },

  // ── Empty state ────────────────────────────────────────────────────────
  emptyTitle:       'No campaigns yet',
  emptyDescription: 'Create your first campaign to start taking orders.',
  deleteConsequence: 'Deleting a campaign also removes all associated orders, collections, and products.',

  // ── Editor ─────────────────────────────────────────────────────────────
  editorTitle:  (row) => row ? row.name : 'New Campaign',
  editorWidth:  'lg',

  editorTabs: [
    // ── General ──────────────────────────────────────────────────────────
    {
      key:   'general',
      label: 'General',
      fields: [
        { key: 'name',          component: 'text',     label: 'Name',          required: true, maxLength: 120, placeholder: 'e.g. Winter Uniform 2025' },
        { key: 'slug',          component: 'slug',     label: 'Slug',          required: true, autoSlugFrom: 'name' },
        { key: 'description',   component: 'textarea', label: 'Description',   rows: 3,        placeholder: 'Describe this campaign…' },
        {
          key:       'campaign_type',
          component: 'select',
          label:     'Campaign type',
          required:  true,
          options:   [
            { label: 'Reservation',     value: 'reservation' },
            { label: 'Pre-Order',       value: 'pre_order' },
            { label: 'Retail',          value: 'retail' },
            { label: 'Uniform',         value: 'uniform' },
            { label: 'Corporate',       value: 'corporate' },
            { label: 'Event',           value: 'event' },
            { label: 'Gift Redemption', value: 'gift_redemption' },
          ],
        },
      ],
    },

    // ── Storefront ────────────────────────────────────────────────────────
    {
      key:   'storefront',
      label: 'Storefront',
      fields: [
        { key: 'hero_image',    component: 'image',    label: 'Hero image',    aspect: 'landscape', hint: 'Displayed at the top of the campaign page. Recommended: 1920×1080px.' },
        { key: 'hero_title',    component: 'text',     label: 'Hero title',    placeholder: 'e.g. Your new uniforms are here' },
        { key: 'hero_subtitle', component: 'textarea', label: 'Hero subtitle', rows: 2, placeholder: 'Short supporting text beneath the hero title…' },
      ],
    },

    // ── Ordering ──────────────────────────────────────────────────────────
    {
      key:   'ordering',
      label: 'Ordering',
      fields: [
        { key: 'opens_at',  component: 'datetime', label: 'Opens at',  hint: 'When customers can start placing orders.' },
        { key: 'closes_at', component: 'datetime', label: 'Closes at', hint: 'After this time, no new orders are accepted.' },
        { key: 'is_public', component: 'toggle',   label: 'Public visibility', description: 'When off, the campaign is hidden from the storefront.' },
      ],
    },

    // ── Branding ──────────────────────────────────────────────────────────
    {
      key:   'branding',
      label: 'Branding',
      fields: [
        { key: 'logo_url',        component: 'image',  label: 'Campaign logo',     aspect: 'square', hint: 'Overrides the tenant logo on this campaign\'s storefront.' },
        { key: 'primary_colour',  component: 'colour', label: 'Primary colour',    hint: 'Primary button and accent colour. Leave blank to inherit from tenant branding.' },
        { key: 'secondary_colour', component: 'colour', label: 'Secondary colour', hint: 'Secondary accent. Leave blank to inherit from tenant branding.' },
      ],
    },

    // ── Messaging ────────────────────────────────────────────────────────
    {
      key:   'messaging',
      label: 'Messaging',
      fields: [
        { key: 'success_message', component: 'textarea', label: 'Success message',  rows: 3, placeholder: 'Shown on the order confirmation page after a customer places their order…' },
        { key: 'failure_message', component: 'textarea', label: 'Failure message',  rows: 3, placeholder: 'Shown if the campaign does not reach minimum order quantity…' },
        { key: 'delivery_info',   component: 'textarea', label: 'Delivery info',    rows: 3, placeholder: 'Delivery details, estimated timeframes, courier options…' },
        { key: 'pickup_info',     component: 'textarea', label: 'Pick-up info',     rows: 3, placeholder: 'Where and when customers can collect their order…' },
        { key: 'club_contact',    component: 'textarea', label: 'Club contact',     rows: 2, placeholder: 'Contact details for queries about this campaign…' },
      ],
    },

    // ── Banners ───────────────────────────────────────────────────────────
    {
      key:     'banners',
      label:   'Banners',
      content: (form) => {
        const id       = form.data['id'] as string
        const tenantId = form.data['tenantId'] as string
        return <BannerManager campaignId={id} tenantId={tenantId} />
      },
    },

    // ── Attributes ────────────────────────────────────────────────────────
    {
      key:     'attributes',
      label:   'Attributes',
      content: (form) => {
        const id       = form.data['id'] as string
        const tenantId = form.data['tenantId'] as string
        return <AttributeManager campaignId={id} tenantId={tenantId} />
      },
    },

    // ── Settings / Lifecycle ──────────────────────────────────────────────
    {
      key:     'settings',
      label:   'Settings',
      content: (form) => {
        const id       = form.data['id'] as string
        const tenantId = form.data['tenantId'] as string
        const status   = form.data['status'] as CampaignAdminData['status']
        const name     = form.data['name'] as string
        return (
          <CampaignLifecyclePanel
            campaignId={id}
            tenantId={tenantId}
            currentStatus={status}
            label={name}
            onChange={(newStatus) => form.set('status', newStatus as CampaignAdminData['status'])}
          />
        )
      },
    },
  ],
}
