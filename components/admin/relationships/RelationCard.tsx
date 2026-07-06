'use client'

/**
 * RelationCard — card layout for a single related item.
 *
 * Used when RelationshipDefinition.layout === 'card'.
 * Supports image, title, fields, drag handle, detach, metadata edit.
 */

import { GripVertical, Trash2, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'

type Props<Child extends Record<string, unknown>> = {
  item:         Child
  definition:   RelationshipDefinition<Child>
  index:        number
  selected:     boolean
  onSelect?:    (id: string) => void
  onDetach?:    (id: string) => void
  onEditMeta?:  (item: Child) => void
  dragHandlers?: {
    onDragStart: (e: React.DragEvent) => void
    onDragOver:  (e: React.DragEvent) => void
    onDrop:      (e: React.DragEvent) => void
    onDragEnd:   (e: React.DragEvent) => void
  }
  isDragOver?:  boolean
  canDetach?:   boolean
  canSort?:     boolean
  canEditMeta?: boolean
}

export default function RelationCard<Child extends Record<string, unknown>>({
  item, definition, selected, onSelect, onDetach, onEditMeta,
  dragHandlers, isDragOver, canDetach, canSort, canEditMeta,
}: Props<Child>) {
  const key     = definition.entity.rowKey(item)
  const image   = definition.cardImage?.(item)
  const fields  = definition.cardFields ?? []
  const columns = definition.columns ?? definition.entity.columns

  // Derive display fields from columns if no cardFields defined
  const displayFields = fields.length > 0
    ? fields
    : columns.slice(0, 3).map((col) => ({
        key:    col.key as string & keyof Child,
        label:  col.label,
        render: undefined as undefined,
      }))

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 p-3 bg-white border rounded-xl transition-all',
        isDragOver ? 'border-slate-400 shadow-md' : 'border-gray-200',
        selected && 'ring-2 ring-slate-900/10',
      )}
      {...(dragHandlers ?? {})}
    >
      {/* Drag handle */}
      {canSort && dragHandlers && (
        <div
          draggable
          className="flex-shrink-0 mt-0.5 cursor-grab text-gray-300 hover:text-gray-400"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Selection checkbox */}
      {onSelect && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(key)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 flex-shrink-0 rounded border-gray-300 text-slate-900"
        />
      )}

      {/* Image */}
      {image && (
        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Fields */}
      <div className="flex-1 min-w-0 space-y-0.5">
        {displayFields.map((f, fi) => {
          const col = columns.find((c) => c.key === f.key)
          const rawValue = item[f.key]
          const content = f.render
            ? f.render(rawValue, item)
            : col?.render
              ? col.render(item)
              : String(rawValue ?? '')

          if (fi === 0) {
            return (
              <div key={String(f.key)} className="text-sm font-medium text-gray-900 truncate">
                {content}
              </div>
            )
          }
          return (
            <div key={String(f.key)} className="text-xs text-gray-500 truncate">
              {f.label && <span className="text-gray-400">{f.label}: </span>}
              {content}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {canEditMeta && onEditMeta && (
          <button
            onClick={() => onEditMeta(item)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Edit metadata"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
        {canDetach && onDetach && (
          <button
            onClick={() => onDetach(key)}
            className="p-1 text-gray-400 hover:text-red-500 rounded"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
