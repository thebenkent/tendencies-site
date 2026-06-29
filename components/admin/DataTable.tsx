'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Column<T> = {
  key:        string
  label:      string
  sortable?:  boolean
  className?: string
  render:     (row: T, index: number) => React.ReactNode
}

type Props<T> = {
  columns:     Column<T>[]
  data:        T[]
  rowKey:      (row: T) => string
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pageSize?:   number
  emptyState?: React.ReactNode
  onRowClick?: (row: T) => void
  selectable?: boolean
  onSelection?: (selected: T[]) => void
  className?:  string
  isLoading?:  boolean
}

type SortState = { key: string; dir: 'asc' | 'desc' } | null

export default function DataTable<T extends Record<string, unknown>>({
  columns, data, rowKey, searchable, searchKeys, pageSize = 25,
  emptyState, onRowClick, selectable, onSelection, className, isLoading,
}: Props<T>) {
  const [sort,    setSort]    = useState<SortState>(null)
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let rows = [...data]
    if (search && searchKeys) {
      const q = search.toLowerCase()
      rows = rows.filter((row) =>
        searchKeys.some((key) => {
          const val = row[key]
          return typeof val === 'string' && val.toLowerCase().includes(q)
        })
      )
    }
    if (sort) {
      rows.sort((a, b) => {
        const av = a[sort.key] as string | number
        const bv = b[sort.key] as string | number
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sort.dir === 'asc' ? cmp : -cmp
      })
    }
    return rows
  }, [data, search, sort, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged      = filtered.slice((page - 1) * pageSize, page * pageSize)

  function toggleSort(key: string) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc')       return { key, dir: 'desc' }
      return null
    })
    setPage(1)
  }

  function toggleRow(key: string, row: T) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      if (onSelection) onSelection(data.filter((r) => next.has(rowKey(r))))
      return next
    })
  }

  function toggleAll() {
    if (selected.size === paged.length) {
      setSelected(new Set())
      onSelection?.([])
    } else {
      const keys = new Set(paged.map(rowKey))
      setSelected(keys)
      onSelection?.(paged)
    }
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Toolbar */}
      {searchable && (
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search…"
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size > 0 && selected.size === paged.length}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-gray-700',
                    col.className,
                  )}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      sort?.key === col.key
                        ? sort.dir === 'asc'
                          ? <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
                          : <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                        : <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {selectable && <td className="px-4 py-3"><div className="h-4 w-4 bg-gray-100 rounded animate-pulse" /></td>}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center text-sm text-gray-400">
                  {emptyState ?? 'No results'}
                </td>
              </tr>
            ) : (
              paged.map((row, i) => {
                const key = rowKey(row)
                return (
                  <tr
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      'group',
                      onRowClick && 'cursor-pointer hover:bg-gray-50',
                      selected.has(key) && 'bg-indigo-50',
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); toggleRow(key, row) }}>
                        <input
                          type="checkbox"
                          checked={selected.has(key)}
                          onChange={() => toggleRow(key, row)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3 text-gray-700', col.className)}>
                        {col.render(row, i)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white text-xs text-gray-500">
          <span>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} · page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ‹ Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
