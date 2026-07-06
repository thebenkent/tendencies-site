'use client'

import { cn } from '@/lib/utils'

function toSlug(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

type Props = {
  label:       string
  value:       string
  onChange:    (v: string) => void
  prefix?:     string   // display prefix e.g. "tendencies.co/m/"
  hint?:       string
  error?:      string
  required?:   boolean
  disabled?:   boolean
  autoSlugFrom?: string   // when set, auto-generates slug from this string when field is untouched
  className?:  string
}

export default function SlugField({
  label, value, onChange, prefix, hint, error, required, disabled, autoSlugFrom, className,
}: Props) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400"
        style={{ borderColor: error ? '#f87171' : '#d1d5db' }}>
        {prefix && (
          <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-300 whitespace-nowrap select-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(toSlug(e.target.value))}
          disabled={disabled}
          placeholder={autoSlugFrom ? toSlug(autoSlugFrom) : 'my-slug'}
          className={cn(
            'flex-1 px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none bg-white',
            disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
            error && 'bg-red-50',
          )}
        />
      </div>
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
