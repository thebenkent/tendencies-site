'use client'

/**
 * useRelationOrder — reusable drag-and-drop ordering hook.
 *
 * Provides HTML5 native drag-and-drop for relation lists.
 * No third-party DnD library — consistent with BannerManager/AttributeManager patterns.
 *
 * Usage:
 *   const { localItems, dragHandlers } = useRelationOrder({ items, getKey, onReorder })
 *
 *   return localItems.map((item, i) => (
 *     <div key={getKey(item)} draggable {...dragHandlers(i)}>
 *       <GripVertical />
 *       {item.name}
 *     </div>
 *   ))
 */

import { useState, useRef, useEffect, useCallback } from 'react'

type UseRelationOrderOptions<T> = {
  items:     T[]
  getKey:    (item: T) => string
  onReorder: (orderedIds: string[]) => Promise<void>
  enabled?:  boolean
}

type DragHandlers = {
  onDragStart: (e: React.DragEvent) => void
  onDragOver:  (e: React.DragEvent) => void
  onDrop:      (e: React.DragEvent) => void
  onDragEnd:   (e: React.DragEvent) => void
}

export type UseRelationOrderResult<T> = {
  localItems:   T[]
  dragHandlers: (index: number) => DragHandlers
  isDragging:   boolean
  dragOverIndex: number | null
}

export function useRelationOrder<T>({
  items, getKey, onReorder, enabled = true,
}: UseRelationOrderOptions<T>): UseRelationOrderResult<T> {
  const [localItems, setLocalItems] = useState<T[]>(items)
  const [isDragging,    setIsDragging]    = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const dragIdx     = useRef<number | null>(null)
  const dragOverIdx = useRef<number | null>(null)

  // Sync when external items change (e.g. after a fetch)
  useEffect(() => { setLocalItems(items) }, [items])

  const dragHandlers = useCallback((index: number): DragHandlers => ({
    onDragStart: (e) => {
      if (!enabled) { e.preventDefault(); return }
      dragIdx.current = index
      setIsDragging(true)
      // Ghost image — use the element itself
      e.dataTransfer.effectAllowed = 'move'
    },
    onDragOver: (e) => {
      if (!enabled) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      dragOverIdx.current = index
      setDragOverIndex(index)
    },
    onDrop: async (e) => {
      if (!enabled) return
      e.preventDefault()
      const from = dragIdx.current
      const to   = dragOverIdx.current
      if (from === null || to === null || from === to) {
        setDragOverIndex(null)
        return
      }
      const reordered = [...localItems]
      const [moved]   = reordered.splice(from, 1)
      reordered.splice(to, 0, moved)
      setLocalItems(reordered)
      setDragOverIndex(null)
      setIsDragging(false)
      dragIdx.current     = null
      dragOverIdx.current = null
      await onReorder(reordered.map(getKey))
    },
    onDragEnd: () => {
      setIsDragging(false)
      setDragOverIndex(null)
      dragIdx.current     = null
      dragOverIdx.current = null
    },
  }), [enabled, localItems, getKey, onReorder])

  return { localItems, dragHandlers, isDragging, dragOverIndex }
}
