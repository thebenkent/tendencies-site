'use client'

import { useEffect, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open:         boolean
  entityLabel:  string    // e.g. "this campaign" or the entity name
  onClose:      () => void
  onConfirm:    () => void
  loading?:     boolean
  consequence?: string    // extra warning e.g. "All products will also be removed."
}

export default function CRUDDeleteDialog({
  open, entityLabel, onClose, onConfirm, loading = false, consequence,
}: Props) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    btnRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Delete {entityLabel}?</h3>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone.
              {consequence && <> {consequence}</>}
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            ref={btnRef}
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'px-3.5 py-2 text-sm font-medium rounded-lg text-white transition-colors',
              loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700',
            )}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
