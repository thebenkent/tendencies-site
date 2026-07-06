'use client'

import { cn } from '@/lib/utils'

type Props = {
  label:        string
  description?: string
  checked:      boolean
  onChange:     (v: boolean) => void
  disabled?:    boolean
  className?:   string
}

export default function ToggleField({ label, description, checked, onChange, disabled, className }: Props) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div>
        <p className={cn('text-sm font-medium', disabled ? 'text-gray-400' : 'text-gray-700')}>{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-1',
          checked ? 'bg-indigo-600' : 'bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
            checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  )
}
