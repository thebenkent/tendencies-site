'use client'

/**
 * ExtensionToolbar — renders toolbar action contributions in the editor footer.
 *
 * Placed between the Delete button and the Cancel/Save buttons.
 * Each action is permission-gated, hidden/disabled dynamically, and
 * receives the current form data + tenantId when clicked.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useHasPermission } from '@/components/admin/Can'
import { useToast } from '@/components/admin/toast'
import type { ToolbarActionContribution } from '@/lib/admin/extensions/definition'
import type { Permission } from '@/lib/admin/permissions'

type Props = {
  actions:  ToolbarActionContribution[]
  data:     Record<string, unknown>
  tenantId: string
}

function ActionButton({
  action, data, tenantId,
}: {
  action:   ToolbarActionContribution
  data:     Record<string, unknown>
  tenantId: string
}) {
  const [running, setRunning] = useState(false)
  const { error: toastErr }   = useToast()
  const hasPermission = useHasPermission(action.permission as Permission)
  const permitted     = !action.permission || hasPermission

  if (!permitted) return null
  if (action.hidden?.(data)) return null

  const isDisabled = running || (action.disabled?.(data) ?? false)
  const Icon = action.icon

  async function handleClick() {
    setRunning(true)
    try {
      await action.onClick(data, tenantId)
    } catch (e) {
      toastErr(e instanceof Error ? e.message : `${action.label} failed`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50',
        action.variant === 'primary' && 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800',
        action.variant === 'danger'  && 'text-red-600 border-red-200 bg-white hover:bg-red-50',
        (!action.variant || action.variant === 'default') && 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50',
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {running ? `${action.label}…` : action.label}
    </button>
  )
}

export default function ExtensionToolbar({ actions, data, tenantId }: Props) {
  if (actions.length === 0) return null

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {actions.map((action) => (
        <ActionButton key={action.id} action={action} data={data} tenantId={tenantId} />
      ))}
    </div>
  )
}
