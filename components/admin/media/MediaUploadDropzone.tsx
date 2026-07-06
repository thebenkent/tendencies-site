'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  onUpload:   (files: File[]) => Promise<void>
  accept?:    string
  multiple?:  boolean
  disabled?:  boolean
  className?: string
}

export default function MediaUploadDropzone({ onUpload, accept = 'image/*', multiple = true, disabled, className }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleFiles(files: File[]) {
    if (!files.length) return
    setUploading(true)
    try { await onUpload(files) }
    finally { setUploading(false) }
  }

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 px-6 text-center transition-colors cursor-pointer',
        dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30',
        disabled && 'opacity-50 cursor-not-allowed',
        uploading && 'pointer-events-none',
        className,
      )}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
      }}
    >
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files ?? []))} />
      <Upload className="w-8 h-8 text-gray-400 mb-3" />
      <p className="text-sm font-medium text-gray-700">
        {uploading ? 'Uploading…' : 'Drop files here or click to upload'}
      </p>
      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP up to 10MB</p>
    </div>
  )
}
