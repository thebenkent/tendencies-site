'use client'

import { cn } from '@/lib/utils'

type Props = {
  label:      string
  value:      string
  onChange:   (v: string) => void
  placeholder?: string
  hint?:      string
  error?:     string
  required?:  boolean
  disabled?:  boolean
  rows?:      number
  maxLength?: number
  className?: string
}

export default function TextAreaField({
  label, value, onChange, placeholder, hint, error, required,
  disabled, rows = 4, maxLength, className,
}: Props) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 resize-y transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400',
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-400'
            : 'border-gray-300 bg-white',
          disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
        )}
      />
      {maxLength && (
        <p className="text-xs text-gray-400 text-right">{value.length}/{maxLength}</p>
      )}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
