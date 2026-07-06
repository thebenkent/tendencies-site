'use client'

import { Search, Plus, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  // Search
  searchValue:     string
  onSearchChange:  (value: string) => void
  searchPlaceholder?: string

  // Attach
  onAttach?:       () => void
  attachLabel?:    string
  canAttach?:      boolean

  // Bulk detach
  selectedCount:   number
  onBulkDetach?:   () => void
  canDetach?:      boolean

  // Status
  saving?:         boolean
  className?:      string
}

export default function RelationToolbar({
  searchValue, onSearchChange, searchPlaceholder = 'Search…',
  onAttach, attachLabel = 'Attach', canAttach = true,
  selectedCount, onBulkDetach, canDetach = true,
  saving, className,
}: Props) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900/30"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex-1" />

      {/* Bulk detach */}
      {selectedCount > 0 && canDetach && onBulkDetach && (
        <button
          onClick={onBulkDetach}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove {selectedCount}
        </button>
      )}

      {/* Attach */}
      {onAttach && canAttach && (
        <button
          onClick={onAttach}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {attachLabel}
        </button>
      )}
    </div>
  )
}
