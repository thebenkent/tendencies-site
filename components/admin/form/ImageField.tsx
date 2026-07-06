'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  label:      string
  value:      string | null   // URL or null
  onChange:   (url: string | null) => void
  onUpload?:  (file: File) => Promise<string>   // returns uploaded URL
  hint?:      string
  error?:     string
  required?:  boolean
  disabled?:  boolean
  aspect?:    'square' | 'landscape' | 'portrait' | 'auto'
  className?: string
}

const ASPECT: Record<string, string> = {
  square:    'aspect-square',
  landscape: 'aspect-video',
  portrait:  'aspect-[3/4]',
  auto:      '',
}

export default function ImageField({
  label, value, onChange, onUpload, hint, error, required, disabled, aspect = 'landscape', className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!onUpload) return
    const url = await onUpload(file)
    onChange(url)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {value ? (
        <div className={cn('relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 w-full', ASPECT[aspect])}>
          <Image src={value} alt={label} fill className="object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
            ASPECT[aspect] || 'min-h-[120px]',
            error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/30',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          onClick={() => !disabled && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-6 h-6 text-gray-400" />
          <p className="text-sm text-gray-500">
            {onUpload ? 'Click or drag to upload' : 'Enter URL below'}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>
      )}

      {!onUpload && (
        <input
          type="url"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://…"
          disabled={disabled}
          className={cn(
            'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400',
            error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
            disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
          )}
        />
      )}

      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
