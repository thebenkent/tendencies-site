'use client'

import { cn } from '@/lib/utils'

type Props = {
  label:      string
  value:      number | ''
  onChange:   (v: number | '') => void
  hint?:      string
  error?:     string
  required?:  boolean
  disabled?:  boolean
  min?:       number
  max?:       number
  step?:      number
  prefix?:    string   // e.g. "$"
  suffix?:    string   // e.g. "px"
  className?: string
}

export default function NumberField({
  label, value, onChange, hint, error, required,
  disabled, min, max, step = 1, prefix, suffix, className,
}: Props) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-gray-400 pointer-events-none select-none">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? '' : Number(v))
          }}
          className={cn(
            'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400',
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-400'
              : 'border-gray-300 bg-white',
            disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
            prefix && 'pl-7',
            suffix && 'pr-10',
          )}
        />
        {suffix && (
          <span className="absolute right-3 text-sm text-gray-400 pointer-events-none select-none">{suffix}</span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
