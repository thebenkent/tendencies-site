'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Pencil, Trash2, Copy, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RowAction } from './types'

type Props<T> = {
  row:         T
  onEdit?:     () => void
  onDelete?:   () => void
  onDuplicate?: () => void
  onArchive?:  () => void
  extraActions?: RowAction<T>[]
  canEdit?:    boolean
  canDelete?:  boolean
  canDuplicate?: boolean
  canArchive?: boolean
}

export default function CRUDActions<T>({
  row, onEdit, onDelete, onDuplicate, onArchive, extraActions,
  canEdit = true, canDelete = true, canDuplicate = false, canArchive = false,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const items: Array<{ icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }> = []

  if (canEdit && onEdit)           items.push({ icon: <Pencil className="w-3.5 h-3.5" />,    label: 'Edit',      onClick: onEdit })
  if (canDuplicate && onDuplicate) items.push({ icon: <Copy className="w-3.5 h-3.5" />,      label: 'Duplicate', onClick: onDuplicate })
  if (canArchive && onArchive)     items.push({ icon: <Archive className="w-3.5 h-3.5" />,   label: 'Archive',   onClick: onArchive })

  for (const action of extraActions ?? []) {
    if (action.hidden?.(row)) continue
    items.push({ icon: action.icon, label: action.label, onClick: () => action.onClick(row), danger: action.variant === 'danger' })
  }

  if (canDelete && onDelete) {
    if (items.length > 0) items.push({ icon: null, label: '---', onClick: () => {}, danger: false }) // divider sentinel
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
        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
          {items.map((item, i) =>
            item.label === '---' ? (
              <div key={i} className="h-px bg-gray-100 my-1" />
            ) : (
              <button
                key={item.label}
                onClick={() => { setOpen(false); item.onClick() }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors',
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
