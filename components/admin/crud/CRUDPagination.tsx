'use client'

import { cn } from '@/lib/utils'

type Props = {
  page:       number
  totalPages: number
  pageSize:   number
  totalCount: number
  onPage:     (p: number) => void
  onPageSize?: (size: number) => void
  pageSizes?: number[]
  className?: string
}

export default function CRUDPagination({
  page, totalPages, pageSize, totalCount, onPage, onPageSize,
  pageSizes = [25, 50, 100], className,
}: Props) {
  if (totalPages <= 1 && !onPageSize) return null

  const start = (page - 1) * pageSize + 1
  const end   = Math.min(page * pageSize, totalCount)

  // Build page numbers to show (max 7, with ellipsis)
  function pages(): Array<number | '...'> {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }

  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white text-xs text-gray-500', className)}>
      <div className="flex items-center gap-3">
        <span>{start}–{end} of {totalCount}</span>
        {onPageSize && (
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSize(Number(e.target.value))}
              className="border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {pageSizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          {pages().map((p, i) =>
            p === '...'
              ? <span key={`e-${i}`} className="px-1">…</span>
              : (
                <button
                  key={p}
                  onClick={() => onPage(p as number)}
                  className={cn(
                    'w-7 h-7 rounded text-xs font-medium transition-colors',
                    p === page
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-gray-100 text-gray-600',
                  )}
                >
                  {p}
                </button>
              )
          )}
          <button
            onClick={() => onPage(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
