'use client'

import { cn } from '@/lib/utils'

type Props = {
  label:       string
  description?: string
  checked:     boolean
  onChange:    (v: boolean) => void
  disabled?:   boolean
  error?:      string
  className?:  string
}

export default function CheckboxField({ label, description, checked, onChange, disabled, error, className }: Props) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        type="checkbox"
        id={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
      />
      <div>
        <label htmlFor={label} className={cn('text-sm font-medium', disabled ? 'text-gray-400' : 'text-gray-700', 'cursor-pointer')}>
          {label}
        </label>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      </div>
    </div>
  )
}
