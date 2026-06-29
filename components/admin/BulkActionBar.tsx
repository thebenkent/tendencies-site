'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Action = {
  label:    string
  onClick:  () => void
  variant?: 'default' | 'danger'
  icon?:    React.ReactNode
}

type Props = {
  count:    number
  actions:  Action[]
  onClear:  () => void
  className?: string
}

export default function BulkActionBar({ count, actions, onClear, className }: Props) {
  if (count === 0) return null

  return (
    <div className={cn(
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-3',
      'bg-slate-900 text-white rounded-xl shadow-2xl text-sm',
      className,
    )}>
      <button onClick={onClear} className="text-slate-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
      <span className="font-medium">{count} selected</span>
      <div className="w-px h-4 bg-slate-700" />
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            action.variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-white',
          )}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  )
}
