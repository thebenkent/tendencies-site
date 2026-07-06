'use client'

import { cn } from '@/lib/utils'

type RadioOption = { label: string; value: string; description?: string }

type Props = {
  label:      string
  value:      string
  onChange:   (v: string) => void
  options:    RadioOption[]
  hint?:      string
  error?:     string
  required?:  boolean
  disabled?:  boolean
  layout?:    'vertical' | 'horizontal'
  className?: string
}

export default function RadioField({
  label, value, onChange, options, hint, error, required, disabled,
  layout = 'vertical', className,
}: Props) {
  const name = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('space-y-2', className)}>
      <p className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </p>
      <div className={cn('flex gap-3', layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}>
        {options.map((opt) => (
          <label key={opt.value} className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              disabled={disabled}
              className="mt-0.5 text-indigo-600 border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
            />
            <div>
              <span className={cn('text-sm font-medium', disabled ? 'text-gray-400' : 'text-gray-700')}>
                {opt.label}
              </span>
              {opt.description && (
                <p className="text-xs text-gray-500">{opt.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
