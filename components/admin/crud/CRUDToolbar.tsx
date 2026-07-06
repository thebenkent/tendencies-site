'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CRUDFilter, FilterState, SortState, CRUDColumn } from './types'

type Props<T> = {
  // Search
  searchable?:         boolean
  searchPlaceholder?:  string
  search:              string
  onSearchChange:      (v: string) => void

  // Filters
  filters?:            CRUDFilter[]
  filterState:         FilterState
  onFilterChange:      (key: string, value: string) => void
  onFilterClear:       () => void

  // Sort
  columns:             CRUDColumn<T>[]
  sort:                SortState
  onSortChange:        (sort: SortState) => void

  // Results
  resultCount:         number
  totalCount:          number

  // Actions
  onCreate?:           () => void
  createLabel?:        string
}

export default function CRUDToolbar<T>({
  searchable, searchPlaceholder, search, onSearchChange,
  filters, filterState, onFilterChange, onFilterClear,
  columns, sort, onSortChange,
  resultCount, totalCount,
  onCreate, createLabel = 'New',
}: Props<T>) {
  const activeFilterCount = Object.values(filterState).filter(Boolean).length
  const hasActiveFilters  = activeFilterCount > 0 || search.length > 0

  return (
    <div className="flex flex-col gap-3 px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder ?? 'Search…'}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
            {search && (
              <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Filters */}
        {filters && filters.map((filter) => {
          const active = filterState[filter.key]
          return (
            <div key={filter.key} className="relative">
              {filter.type === 'select' && (
                <select
                  value={active ?? ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className={cn(
                    'text-sm border rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 appearance-none',
                    active ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700',
                  )}
                >
                  <option value="">{filter.label}</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
              {filter.type === 'toggle' && (
                <button
                  onClick={() => onFilterChange(filter.key, active ? '' : '1')}
                  className={cn(
                    'text-sm border rounded-lg px-3 py-1.5 transition-colors',
                    active ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                  )}
                >
                  {filter.label}
                </button>
              )}
            </div>
          )
        })}

        {/* Sort */}
        {columns.some((c) => c.sortable) && (
          <div className="relative">
            <select
              value={sort ? `${sort.key}:${sort.dir}` : ''}
              onChange={(e) => {
                const v = e.target.value
                if (!v) { onSortChange(null); return }
                const [key, dir] = v.split(':')
                onSortChange({ key, dir: dir as 'asc' | 'desc' })
              }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 appearance-none text-gray-700"
            >
              <option value="">Sort</option>
              {columns.filter((c) => c.sortable).flatMap((c) => [
                <option key={`${c.key}:asc`}  value={`${c.key}:asc`}>{c.label} ↑</option>,
                <option key={`${c.key}:desc`} value={`${c.key}:desc`}>{c.label} ↓</option>,
              ])}
            </select>
          </div>
        )}

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={() => { onSearchChange(''); onFilterClear() }}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}

        <div className="flex-1" />

        {/* Result count */}
        <span className="text-xs text-gray-400">
          {resultCount === totalCount
            ? `${totalCount} total`
            : `${resultCount} of ${totalCount}`}
        </span>

        {/* Create */}
        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            + {createLabel}
          </button>
        )}
      </div>
    </div>
  )
}
