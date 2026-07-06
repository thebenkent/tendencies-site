'use client'

import { cn } from '@/lib/utils'

type Props = {
  label:      string
  value:      string    // CSS hex colour e.g. "#c8a96e"
  onChange:   (v: string) => void
  hint?:      string
  error?:     string
  required?:  boolean
  disabled?:  boolean
  className?: string
}

export default function ColourField({ label, value, onChange, hint, error, required, disabled, className }: Props) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-9 w-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          placeholder="#000000"
          maxLength={7}
          disabled={disabled}
          className={cn(
            'block w-28 rounded-lg border px-3 py-2 text-sm text-gray-900 font-mono transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400',
            error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
            disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
          )}
        />
        {value && (
          <span className="text-xs text-gray-500">{value}</span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
