'use client'

/**
 * DetailPanel — editor right-hand inspector panel.
 *
 * Rendered as a vertical sidebar within the CRUDEditor when detail panel
 * contributions exist. Toggled by an "Info" button in the editor header.
 *
 * Each section is independently selectable via a pill navigation.
 * Permissions and feature flags are respected per section.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useHasPermission } from '@/components/admin/Can'
import type { DetailPanelContribution } from '@/lib/admin/extensions/definition'
import type { AdminForm } from '@/lib/admin/form'
import type { Permission } from '@/lib/admin/permissions'

type Props = {
  panels:   DetailPanelContribution[]
  form:     AdminForm<Record<string, unknown>>
  tenantId: string
}

function PanelSection({
  panel, form, tenantId,
}: {
  panel:    DetailPanelContribution
  form:     AdminForm<Record<string, unknown>>
  tenantId: string
}) {
  const hasPermission = useHasPermission(panel.permission as Permission)
  const permitted     = !panel.permission || hasPermission

  if (!permitted) return null

  return <>{panel.content(form, tenantId)}</>
}

export default function DetailPanel({ panels, form, tenantId }: Props) {
  const [active, setActive] = useState(panels[0]?.id ?? '')

  if (panels.length === 0) return null

  const activePanel = panels.find((p) => p.id === active)

  return (
    <div className="w-72 border-l border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Section navigation */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2 border-b border-gray-100">
        <div className="flex flex-wrap gap-1">
          {panels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => setActive(panel.id)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-full transition-colors',
                active === panel.id
                  ? 'bg-slate-900 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
              )}
            >
              {panel.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active section content */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {activePanel && (
          <PanelSection
            key={activePanel.id}
            panel={activePanel}
            form={form}
            tenantId={tenantId}
          />
        )}
      </div>
    </div>
  )
}
