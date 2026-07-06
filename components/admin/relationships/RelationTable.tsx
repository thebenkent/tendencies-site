'use client'

/**
 * RelationTable — table layout for related items.
 *
 * Features:
 *   – Checkbox selection (bulk detach)
 *   – Sortable columns
 *   – Drag-and-drop row reorder (when definition.sortable)
 *   – Per-row: detach, edit metadata
 *   – Drop indicator styling during drag
 *
 * Intended for table-layout relationships (most cases).
 * For card layout, see RelationCard used directly in RelationManager.
 */

import { GripVertical, Trash2, Pencil, MoreHorizontal } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'
import type { UseRelationOrderResult } from './RelationOrder'

type Props<Child extends Record<string, unknown>> = {
  items:        Child[]
  definition:   RelationshipDefinition<Child>

  // Selection
  selected:     Set<string>
  onSelect:     (id: string) => void
  onSelectAll:  (all: boolean) => void

  // Actions
  onDetach?:    (id: string) => void
  onEditMeta?:  (item: Child) => void
  canDetach?:   boolean
  canSort?:     boolean
  canEditMeta?: boolean

  // DnD
  order:        UseRelationOrderResult<Child>
}

export default function RelationTable<Child extends Record<string, unknown>>({
  items, definition, selected, onSelect, onSelectAll,
  onDetach, onEditMeta, canDetach, canSort, canEditMeta,
  order,
}: Props<Child>) {
  const columns = definition.columns ?? definition.entity.columns
  const allSelected = items.length > 0 && items.every((r) => selected.has(definition.entity.rowKey(r)))

  const { localItems, dragHandlers, dragOverIndex } = order

  if (localItems.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {/* Drag handle column */}
            {canSort && <th className="w-8 px-3 py-2" />}
            {/* Checkbox */}
            {canDetach && (
              <th className="w-8 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-slate-900"
                />
              </th>
            )}
            {/* Data columns */}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider',
                  col.className,
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
            {/* Actions column */}
            {(canDetach || canEditMeta) && <th className="w-16 px-3 py-2" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {localItems.map((item, i) => {
            const rowKey   = definition.entity.rowKey(item)
            const isSelected = selected.has(rowKey)
            const handlers = dragHandlers(i)

            return (
              <tr
                key={rowKey}
                draggable={canSort}
                onDragStart={canSort ? handlers.onDragStart : undefined}
                onDragOver={canSort ? handlers.onDragOver : undefined}
                onDrop={canSort ? handlers.onDrop : undefined}
                onDragEnd={canSort ? handlers.onDragEnd : undefined}
                className={cn(
                  'group transition-colors',
                  isSelected && 'bg-slate-50',
                  dragOverIndex === i && 'border-t-2 border-slate-400 bg-slate-50/50',
                )}
              >
                {/* Drag handle */}
                {canSort && (
                  <td className="px-3 py-2 w-8">
                    <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 cursor-grab" />
                  </td>
                )}

                {/* Checkbox */}
                {canDetach && (
                  <td className="px-3 py-2 w-8">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(rowKey)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-slate-900"
                    />
                  </td>
                )}

                {/* Data cells */}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-3 py-2', col.className)}
                  >
                    {col.render(item)}
                  </td>
                ))}

                {/* Row actions */}
                {(canDetach || canEditMeta) && (
                  <td className="px-3 py-2 w-16">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canEditMeta && onEditMeta && (
                        <button
                          onClick={() => onEditMeta(item)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                          title="Edit details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canDetach && onDetach && (
                        <button
                          onClick={() => onDetach(rowKey)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
