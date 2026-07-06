'use client'

import { cn } from '@/lib/utils'
import CRUDActions from './CRUDActions'
import type { CRUDColumn, RowAction, SortState } from './types'

type Props<T> = {
  columns:      CRUDColumn<T>[]
  data:         T[]
  rowKey:       (row: T) => string

  // Sort (controlled)
  sort?:        SortState
  onSortChange?: (sort: SortState) => void

  // Selection
  selectable?:  boolean
  selected?:    Set<string>
  onSelect?:    (key: string, row: T) => void
  onSelectAll?: () => void

  // Actions
  onEdit?:       (row: T) => void
  onDelete?:     (row: T) => void
  onDuplicate?:  (row: T) => void
  onArchive?:    (row: T) => void
  extraRowActions?: RowAction<T>[]

  canEdit?:      boolean
  canDelete?:    boolean
  canDuplicate?: boolean
  canArchive?:   boolean

  // States
  loading?:     boolean
  emptyState?:  React.ReactNode
  onRowClick?:  (row: T) => void

  // Sticky header
  stickyHeader?: boolean
  maxHeight?:    string
}

export default function CRUDTable<T extends Record<string, unknown>>({
  columns, data, rowKey,
  sort, onSortChange,
  selectable, selected = new Set(), onSelect, onSelectAll,
  onEdit, onDelete, onDuplicate, onArchive, extraRowActions,
  canEdit = true, canDelete = true, canDuplicate = false, canArchive = false,
  loading, emptyState, onRowClick,
  stickyHeader = false, maxHeight,
}: Props<T>) {
  const hasActions = canEdit || canDelete || canDuplicate || canArchive || (extraRowActions?.length ?? 0) > 0

  function handleSort(key: string) {
    if (!onSortChange) return
    if (sort?.key === key) {
      if (sort.dir === 'asc') onSortChange({ key, dir: 'desc' })
      else onSortChange(null)
    } else {
      onSortChange({ key, dir: 'asc' })
    }
  }

  const allSelected = data.length > 0 && data.every((r) => selected.has(rowKey(r)))
  const someSelected = data.some((r) => selected.has(rowKey(r))) && !allSelected

  return (
    <div className={cn('overflow-x-auto', maxHeight && 'overflow-y-auto')} style={maxHeight ? { maxHeight } : undefined}>
      <table className="w-full text-sm">
        <thead className={cn('bg-gray-50 border-b border-gray-200', stickyHeader && 'sticky top-0 z-10')}>
          <tr>
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected }}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap',
                  col.sortable && onSortChange && 'cursor-pointer select-none hover:text-gray-700',
                  col.className,
                  col.width,
                )}
                onClick={col.sortable && onSortChange ? () => handleSort(col.key) : undefined}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sort?.key === col.key && (
                    <span className="text-indigo-600">{sort.dir === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </span>
              </th>
            ))}
            {hasActions && <th className="w-10 px-4 py-3" />}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {selectable && <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-100 rounded animate-pulse" /></td>}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: `${50 + (i * 13 + col.key.length * 7) % 40}%` }} />
                  </td>
                ))}
                {hasActions && <td className="px-4 py-3" />}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)} className="py-16 text-center">
                {emptyState ?? <span className="text-sm text-gray-400">No results</span>}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const key    = rowKey(row)
              const isSel  = selected.has(key)
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'group transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSel ? 'bg-indigo-50' : onRowClick ? 'hover:bg-gray-50' : '',
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); onSelect?.(key, row) }}>
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => onSelect?.(key, row)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3 text-gray-700', col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-3 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <CRUDActions
                        row={row}
                        onEdit={onEdit      ? () => onEdit(row)      : undefined}
                        onDelete={onDelete  ? () => onDelete(row)    : undefined}
                        onDuplicate={onDuplicate ? () => onDuplicate(row) : undefined}
                        onArchive={onArchive ? () => onArchive(row)  : undefined}
                        extraActions={extraRowActions}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        canDuplicate={canDuplicate}
                        canArchive={canArchive}
                      />
                    </td>
                  )}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
