'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open:       boolean
  onClose:    () => void
  onConfirm:  () => void
  title:      string
  description: string
  confirmLabel?: string
  variant?:   'danger' | 'warning' | 'default'
  loading?:   boolean
}

export default function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm', variant = 'danger', loading = false,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter') { e.preventDefault(); onConfirm() }
    }
    document.addEventListener('keydown', onKey)
    confirmRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, onConfirm])

  if (!open) return null

  const btnClass = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : variant === 'warning'
    ? 'bg-amber-600 hover:bg-amber-700 text-white'
    : 'bg-gray-900 hover:bg-gray-800 text-white'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex gap-4">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            variant === 'danger' ? 'bg-red-50' : variant === 'warning' ? 'bg-amber-50' : 'bg-gray-100',
          )}>
            <AlertTriangle className={cn(
              'w-5 h-5',
              variant === 'danger' ? 'text-red-600' : variant === 'warning' ? 'text-amber-600' : 'text-gray-600',
            )} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-60',
              btnClass,
            )}
          >
            {loading ? 'Loading…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
