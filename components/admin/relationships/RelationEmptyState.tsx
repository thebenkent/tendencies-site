'use client'

import { Link2 } from 'lucide-react'
import type { ComponentType } from 'react'

type Props = {
  title?:       string
  description?: string
  icon?:        ComponentType<{ className?: string }>
  onAttach?:    () => void
  attachLabel?: string
}

export default function RelationEmptyState({
  title       = 'Nothing here yet',
  description,
  icon: Icon  = Link2,
  onAttach,
  attachLabel = 'Attach',
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-center px-6">
      <Icon className="w-8 h-8 text-gray-300 mb-3" />
      <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
      {description && (
        <p className="text-xs text-gray-500 max-w-xs mb-4">{description}</p>
      )}
      {onAttach && (
        <button
          onClick={onAttach}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          {attachLabel}
        </button>
      )}
    </div>
  )
}
