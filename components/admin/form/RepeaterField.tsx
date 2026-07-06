'use client'

import { GripVertical, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props<T> = {
  label:        string
  value:        T[]
  onChange:     (items: T[]) => void
  renderItem:   (item: T, index: number, onChange: (item: T) => void) => React.ReactNode
  newItem:      () => T
  hint?:        string
  error?:       string
  disabled?:    boolean
  maxItems?:    number
  addLabel?:    string
  className?:   string
}

export default function RepeaterField<T>({
  label, value, onChange, renderItem, newItem, hint, error, disabled,
  maxItems, addLabel = 'Add item', className,
}: Props<T>) {
  function add() {
    onChange([...value, newItem()])
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  function update(i: number, item: T) {
    onChange(value.map((v, idx) => idx === i ? item : v))
  }

  const canAdd = !maxItems || value.length < maxItems

  return (
    <div className={cn('space-y-2', className)}>
      <p className="block text-sm font-medium text-gray-700">{label}</p>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-gray-200 p-3 bg-white">
            <GripVertical className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0">
              {renderItem(item, i, (updated) => update(i, updated))}
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-gray-400 hover:text-red-500 flex-shrink-0 mt-0.5 transition-colors"
                aria-label="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {canAdd && !disabled && (
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}

      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
