'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import MediaBrowserModal from './MediaBrowserModal'
import type { MediaAsset } from '@/lib/admin/media'

type Props = {
  value?:     MediaAsset | null
  onChange:   (asset: MediaAsset | null) => void
  assets:     MediaAsset[]
  onUpload?:  (files: File[]) => Promise<void>
  label?:     string
  error?:     string
  hint?:      string
  disabled?:  boolean
  aspect?:    'square' | 'landscape' | 'portrait'
  className?: string
}

const ASPECT = { square: 'aspect-square', landscape: 'aspect-video', portrait: 'aspect-[3/4]' }

export default function MediaPicker({
  value, onChange, assets, onUpload, label, error, hint, disabled, aspect = 'landscape', className,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      <div
        className={cn(
          'relative w-full rounded-xl border overflow-hidden cursor-pointer transition-colors',
          ASPECT[aspect],
          value
            ? 'border-gray-200'
            : cn(
                'border-dashed border-gray-300 bg-gray-50',
                !disabled && 'hover:border-indigo-400 hover:bg-indigo-50/30',
              ),
          disabled && 'pointer-events-none opacity-50',
        )}
        onClick={() => !disabled && setOpen(true)}
        role="button"
        aria-label={label ? `Choose ${label}` : 'Choose image'}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) } }}
      >
        {value ? (
          <>
            <Image src={value.url} alt={value.alt || label || 'Media'} fill className="object-cover" />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(null) }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-400">
            <ImagePlus className="w-7 h-7" />
            <p className="text-xs font-medium">Choose image</p>
          </div>
        )}
      </div>

      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}

      <MediaBrowserModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(asset) => { onChange(asset); setOpen(false) }}
        assets={assets}
        onUpload={onUpload}
      />
    </div>
  )
}
