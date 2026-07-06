'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import MediaUploadDropzone from './MediaUploadDropzone'
import type { MediaAsset } from '@/lib/admin/media'

// Re-export for convenience so callers can import from here
export type { MediaAsset }

type Props = {
  open:       boolean
  onClose:    () => void
  onSelect:   (asset: MediaAsset) => void
  assets:     MediaAsset[]
  onUpload?:  (files: File[]) => Promise<void>
  title?:     string
}

export default function MediaBrowserModal({ open, onClose, onSelect, assets, onUpload, title = 'Media Library' }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!open) return null

  function confirm() {
    const asset = assets.find((a) => a.id === selectedId)
    if (asset) { onSelect(asset); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {onUpload && <MediaUploadDropzone onUpload={onUpload} />}
          <div className="grid grid-cols-4 gap-3">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedId(asset.id === selectedId ? null : asset.id)}
                className={cn(
                  'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                  selectedId === asset.id
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-transparent hover:border-gray-300',
                )}
              >
                <Image src={asset.url} alt={asset.alt} fill className="object-cover" />
                {selectedId === asset.id && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {assets.length === 0 && !onUpload && (
            <p className="text-center text-sm text-gray-400 py-8">No assets yet</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-3.5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={!selectedId}
            className="px-3.5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  )
}
