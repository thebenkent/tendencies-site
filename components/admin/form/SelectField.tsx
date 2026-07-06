'use client'

import { cn } from '@/lib/utils'

export type SelectOption = { label: string; value: string; disabled?: boolean }

type Props = {
  label:        string
  value:        string
  onChange:     (v: string) => void
  options:      SelectOption[]
  placeholder?: string
  hint?:        string
  error?:       string
  required?:    boolean
  disabled?:    boolean
  className?:   string
}

export default function SelectField({
  label, value, onChange, options, placeholder, hint, error, required, disabled, className,
}: Props) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 transition-colors appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400',
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-400'
            : 'border-gray-300 bg-white',
          disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
