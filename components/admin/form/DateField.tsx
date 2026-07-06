'use client'

import { cn } from '@/lib/utils'

type Props = {
  label:      string
  value:      string    // ISO date string "YYYY-MM-DD" or datetime-local "YYYY-MM-DDTHH:mm"
  onChange:   (v: string) => void
  type?:      'date' | 'datetime-local'
  hint?:      string
  error?:     string
  required?:  boolean
  disabled?:  boolean
  min?:       string
  max?:       string
  className?: string
}

export default function DateField({
  label, value, onChange, type = 'date', hint, error, required, disabled, min, max, className,
}: Props) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        className={cn(
          'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400',
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-400'
            : 'border-gray-300 bg-white',
          disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
        )}
      />
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
