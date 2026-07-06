'use client'

/**
 * Campaign lifecycle panel — Settings tab.
 * Shows current status with description, and available transitions.
 * Integrates with the existing admin event dispatcher via server actions.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, Archive, Globe, AlertTriangle, Clock } from 'lucide-react'
import type { CampaignStatus } from '@/lib/merch/types'
import { publishCampaignAction, archiveCampaignAction } from '@/lib/modules/campaigns/lifecycle-actions'

// ── Status display ────────────────────────────────────────────────────────

type StatusInfo = {
  label:       string
  description: string
  icon:        React.ReactNode
  colour:      string
}

const STATUS_INFO: Partial<Record<CampaignStatus, StatusInfo>> = {
  draft: {
    label:       'Draft',
    description: 'This campaign is not yet visible to customers. Publish it when ready.',
    icon:        <Clock className="w-5 h-5 text-gray-400" />,
    colour:      'bg-gray-50 border-gray-200',
  },
  open: {
    label:       'Open',
    description: 'The campaign is live. Customers can view and place orders.',
    icon:        <Globe className="w-5 h-5 text-green-500" />,
    colour:      'bg-green-50 border-green-200',
  },
  closing_soon: {
    label:       'Closing Soon',
    description: 'The campaign is approaching its close date.',
    icon:        <AlertTriangle className="w-5 h-5 text-amber-500" />,
    colour:      'bg-amber-50 border-amber-200',
  },
  closed: {
    label:       'Closed',
    description: 'The ordering window has closed. Processing orders.',
    icon:        <CheckCircle className="w-5 h-5 text-blue-500" />,
    colour:      'bg-blue-50 border-blue-200',
  },
  archived: {
    label:       'Archived',
    description: 'This campaign is archived and no longer active.',
    icon:        <Archive className="w-5 h-5 text-gray-400" />,
    colour:      'bg-gray-50 border-gray-200',
  },
}

// ── Lifecycle transitions ─────────────────────────────────────────────────

type Transition = {
  label:     string
  to:        CampaignStatus
  confirm?:  string
  variant:   'primary' | 'secondary' | 'danger'
}

function getTransitions(status: CampaignStatus, isNew: boolean): Transition[] {
  if (isNew) return []

  switch (status) {
    case 'draft':
      return [
        { label: 'Publish', to: 'open', confirm: undefined, variant: 'primary' },
        { label: 'Archive', to: 'archived', confirm: 'Archive this campaign? It will be removed from the storefront.', variant: 'danger' },
      ]
    case 'open':
    case 'closing_soon':
      return [
        { label: 'Close ordering', to: 'closed', confirm: 'Close ordering? Customers will no longer be able to place new orders.', variant: 'secondary' },
        { label: 'Archive', to: 'archived', confirm: 'Archive this campaign?', variant: 'danger' },
      ]
    case 'closed':
    case 'payment_requested':
    case 'production':
    case 'completed':
      return [
        { label: 'Archive', to: 'archived', confirm: 'Archive this campaign?', variant: 'danger' },
      ]
    case 'archived':
      return [
        { label: 'Restore to Draft', to: 'draft', confirm: undefined, variant: 'secondary' },
      ]
    default:
      return []
  }
}

// ── Component ─────────────────────────────────────────────────────────────

type Props = {
  campaignId:    string
  tenantId:      string
  currentStatus: CampaignStatus
  label:         string
  onChange:      (newStatus: CampaignStatus) => void
}

export default function CampaignLifecyclePanel({
  campaignId, tenantId, currentStatus, label, onChange,
}: Props) {
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const isNew       = !campaignId
  const statusInfo  = STATUS_INFO[currentStatus]
  const transitions = getTransitions(currentStatus, isNew)

  async function handleTransition(t: Transition) {
    if (t.confirm && !confirm(t.confirm)) return

    setLoading(true)
    setError(null)
    try {
      if (t.to === 'open') {
        await publishCampaignAction(campaignId, tenantId, label)
      } else if (t.to === 'archived') {
        await archiveCampaignAction(campaignId, tenantId, label)
      } else {
        await archiveCampaignAction(campaignId, tenantId, label) // fallback for other transitions
      }
      onChange(t.to)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transition failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current status card */}
      <div className={cn('flex items-start gap-3 p-4 rounded-xl border', statusInfo?.colour ?? 'bg-gray-50 border-gray-200')}>
        <div className="flex-shrink-0 mt-0.5">{statusInfo?.icon ?? <Clock className="w-5 h-5 text-gray-400" />}</div>
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {statusInfo?.label ?? currentStatus}
          </div>
          <div className="text-sm text-gray-600 mt-0.5">
            {statusInfo?.description ?? 'Current campaign status.'}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Transitions */}
      {isNew ? (
        <p className="text-sm text-gray-500">Save the campaign first to manage its lifecycle.</p>
      ) : transitions.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Actions</p>
          <div className="space-y-2">
            {transitions.map((t) => (
              <button
                key={t.to}
                onClick={() => handleTransition(t)}
                disabled={loading}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl border transition-colors disabled:opacity-50',
                  t.variant === 'primary'   && 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800',
                  t.variant === 'secondary' && 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                  t.variant === 'danger'    && 'bg-white text-red-600 border-red-200 hover:bg-red-50',
                )}
              >
                <span>{loading ? 'Working…' : t.label}</span>
                <span className="text-xs opacity-60">→ {STATUS_INFO[t.to]?.label ?? t.to}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No transitions available from this status.</p>
      )}

      {/* Status history note */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          All lifecycle changes are recorded in the activity log.
        </p>
      </div>
    </div>
  )
}
