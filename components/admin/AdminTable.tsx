'use client'

/**
 * AdminTable — single reusable table for all admin views.
 *
 * Replaces both DataTable and CRUDTable. Supports:
 *   - Client-side + server-side pagination
 *   - Sortable columns (click header)
 *   - Row selection + bulk actions
 *   - Row actions menu (edit, delete, custom)
 *   - Loading skeleton
 *   - Empty state
 *   - Sticky header
 *   - Future: column visibility, saved views, virtualisation
 */

import { useState, useRef } from 'react'
import { MoreHorizontal, Pencil, Trash2, Copy, Archive, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────

export type AdminTableColumn<T> = {
  key:        string
  label:      string
  sortable?:  boolean
  width?:     string
  className?: string
  render:     (row: T) => React.ReactNode
}

export type AdminTableSort = { key: string; dir: 'asc' | 'desc' } | null

export type AdminTableRowAction<T> = {
  key:      string
  label:    string
  icon?:    React.ReactNode
  variant?: 'default' | 'danger'
  hidden?:  (row: T) => boolean
  onClick:  (row: T) => void
}

type Props<T extends Record<string, unknown>> = {
  // Data
  columns:  AdminTableColumn<T>[]
  data:     T[]
  rowKey:   (row: T) => string

  // Sort (controlled — parent owns sort state)
  sort?:        AdminTableSort
  onSortChange?: (sort: AdminTableSort) => void

  // Selection
  selectable?:  boolean
  selected?:    Set<string>
  onSelect?:    (key: string) => void
  onSelectAll?: (selectAll: boolean) => void

  // Row actions
  onEdit?:    (row: T) => void
  onDelete?:  (row: T) => void
  onDuplicate?: (row: T) => void
  onArchive?: (row: T) => void
  extraRowActions?: AdminTableRowAction<T>[]
  canEdit?:   boolean
  canDelete?: boolean
  canDuplicate?: boolean
  canArchive?: boolean

  // Click on row (alternative to edit)
  onRowClick?: (row: T) => void

  // States
  loading?:     boolean
  emptyState?:  React.ReactNode

  // Layout
  stickyHeader?: boolean
  maxHeight?:    string
  className?:    string
}

// ── Row action menu ───────────────────────────────────────────────────────

function RowActionMenu<T>({
  row, onEdit, onDelete, onDuplicate, onArchive, extraActions,
  canEdit, canDelete, canDuplicate, canArchive,
}: {
  row: T
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onArchive?: () => void
  extraActions?: AdminTableRowAction<T>[]
  canEdit?: boolean
  canDelete?: boolean
  canDuplicate?: boolean
  canArchive?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const items: Array<{ icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean } | 'divider'> = []

  if (canEdit && onEdit)           items.push({ icon: <Pencil className="w-3.5 h-3.5" />,  label: 'Edit',      onClick: onEdit })
  if (canDuplicate && onDuplicate) items.push({ icon: <Copy className="w-3.5 h-3.5" />,    label: 'Duplicate', onClick: onDuplicate })
  if (canArchive && onArchive)     items.push({ icon: <Archive className="w-3.5 h-3.5" />, label: 'Archive',   onClick: onArchive })

  for (const action of extraActions ?? []) {
    if (action.hidden?.(row)) continue
    items.push({ icon: action.icon, label: action.label, onClick: () => action.onClick(row), danger: action.variant === 'danger' })
  }

  if (canDelete && onDelete) {
    if (items.length > 0) items.push('divider')
    items.push({ icon: <Trash2 className="w-3.5 h-3.5" />, label: 'Delete', onClick: onDelete, danger: true })
  }

  if (items.length === 0) return null

  return (
    <div className="relative inline-block" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Row actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
            {items.map((item, i) =>
              item === 'divider'
                ? <div key={i} className="h-px bg-gray-100 my-1" />
                : (
                  <button
                    key={item.label}
                    onClick={() => { setOpen(false); item.onClick() }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors',
                      item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50',
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ── AdminTable ────────────────────────────────────────────────────────────

export default function AdminTable<T extends Record<string, unknown>>({
  columns, data, rowKey,
  sort, onSortChange,
  selectable, selected = new Set(), onSelect, onSelectAll,
  onEdit, onDelete, onDuplicate, onArchive, extraRowActions,
  canEdit = true, canDelete = true, canDuplicate = false, canArchive = false,
  onRowClick,
  loading, emptyState,
  stickyHeader = false, maxHeight, className,
}: Props<T>) {
  const hasActions = (canEdit && !!onEdit) || (canDelete && !!onDelete) ||
    (canDuplicate && !!onDuplicate) || (canArchive && !!onArchive) ||
    (extraRowActions?.length ?? 0) > 0

  function handleSort(key: string) {
    if (!onSortChange) return
    if (sort?.key === key) {
      onSortChange(sort.dir === 'asc' ? { key, dir: 'desc' } : null)
    } else {
      onSortChange({ key, dir: 'asc' })
    }
  }

  const allSelected = data.length > 0 && data.every((r) => selected.has(rowKey(r)))
  const someSelected = !allSelected && data.some((r) => selected.has(rowKey(r)))

  return (
    <div
      className={cn('overflow-x-auto', maxHeight && 'overflow-y-auto', className)}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table className="w-full text-sm">
        <thead className={cn('bg-gray-50 border-b border-gray-200', stickyHeader && 'sticky top-0 z-10')}>
          <tr>
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected }}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap',
                  col.sortable && onSortChange && 'cursor-pointer select-none hover:text-gray-700',
                  col.className,
                )}
                onClick={col.sortable && onSortChange ? () => handleSort(col.key) : undefined}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    sort?.key === col.key
                      ? sort.dir === 'asc'
                        ? <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
                        : <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                      : <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100" />
                  )}
                </span>
              </th>
            ))}
            {hasActions && <th className="w-10 px-4 py-3" />}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                {selectable && <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-100 rounded animate-pulse" /></td>}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div
                      className="h-4 rounded bg-gray-100 animate-pulse"
                      style={{ width: `${48 + (i * 17 + col.key.length * 11) % 38}%` }}
                    />
                  </td>
                ))}
                {hasActions && <td className="px-4 py-3" />}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}
                className="py-16 text-center"
              >
                {emptyState ?? <span className="text-sm text-gray-400">No records found</span>}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const key   = rowKey(row)
              const isSel = selected.has(key)
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'group transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSel ? 'bg-indigo-50' : onRowClick ? 'hover:bg-gray-50' : 'hover:bg-gray-50/50',
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); onSelect?.(key) }}>
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => onSelect?.(key)}
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
                      <RowActionMenu
                        row={row}
                        onEdit={onEdit ? () => onEdit(row) : undefined}
                        onDelete={onDelete ? () => onDelete(row) : undefined}
                        onDuplicate={onDuplicate ? () => onDuplicate(row) : undefined}
                        onArchive={onArchive ? () => onArchive(row) : undefined}
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
