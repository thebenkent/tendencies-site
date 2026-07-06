'use client'

/**
 * RelationPicker — search-and-attach modal.
 *
 * A SlideOver-based picker that supports:
 *   – Live search via onSearch callback
 *   – Multi-select with checkboxes
 *   – Keyboard navigation (↑↓ arrows, Space/Enter to toggle, Cmd+Enter to confirm, Esc to close)
 *   – Pagination of results
 *   – Already-attached items shown as checked (disabled from double-attaching)
 *   – Empty state when no results
 *
 * The picker never knows about DB or search providers directly —
 * the onSearch callback wires it to the SearchRegistry or a service call.
 */

import { useState, useEffect, useRef, useCallback, useTransition } from 'react'
import { Search, X, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'

const RESULTS_PER_PAGE = 20

type Props<Child extends Record<string, unknown>> = {
  open:          boolean
  onClose:       () => void
  definition:    RelationshipDefinition<Child>
  attachedIds:   Set<string>
  onAttach:      (selected: Child[]) => Promise<void>
  onSearch:      (query: string) => Promise<Child[]>
}

export default function RelationPicker<Child extends Record<string, unknown>>({
  open, onClose, definition, attachedIds, onAttach, onSearch,
}: Props<Child>) {
  const [query,      setQuery]      = useState('')
  const [results,    setResults]    = useState<Child[]>([])
  const [selected,   setSelected]   = useState<Map<string, Child>>(new Map())
  const [focusedIdx, setFocusedIdx] = useState(0)
  const [page,       setPage]       = useState(0)
  const [searching,  setSearching]  = useState(false)
  const [attaching,  setAttaching]  = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const inputRef   = useRef<HTMLInputElement>(null)
  const listRef    = useRef<HTMLUListElement>(null)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const rowKey     = definition.entity.rowKey
  const columns    = definition.columns ?? definition.entity.columns
  const previewCol = columns[0]

  // ── Focus management ──────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelected(new Map())
      setFocusedIdx(0)
      setPage(0)
      setError(null)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // ── Search ────────────────────────────────────────────────────────────
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const res = await onSearch(q)
      setResults(res)
      setPage(0)
      setFocusedIdx(0)
    } catch {
      setError('Search failed')
    } finally {
      setSearching(false)
    }
  }, [onSearch])

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (!query.trim()) { setResults([]); return }
    timerRef.current = setTimeout(() => runSearch(query), 200)
    return () => clearTimeout(timerRef.current)
  }, [query, runSearch])

  // ── Keyboard navigation ───────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent) {
    const pageItems = pagedResults()
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIdx((i) => Math.min(i + 1, pageItems.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIdx((i) => Math.max(i - 1, 0))
        break
      case ' ':
      case 'Enter':
        e.preventDefault()
        if (pageItems[focusedIdx]) toggle(pageItems[focusedIdx])
        break
      case 'Escape':
        onClose()
        break
    }
    // Cmd+Enter / Ctrl+Enter → confirm
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleAttach()
    }
  }

  // ── Toggle selection ──────────────────────────────────────────────────
  function toggle(item: Child) {
    const k = rowKey(item)
    if (attachedIds.has(k)) return // already attached
    setSelected((prev) => {
      const next = new Map(prev)
      if (next.has(k)) next.delete(k)
      else next.set(k, item)
      return next
    })
  }

  // ── Pagination ────────────────────────────────────────────────────────
  function pagedResults(): Child[] {
    const start = page * RESULTS_PER_PAGE
    return results.slice(start, start + RESULTS_PER_PAGE)
  }
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE)

  // ── Attach ────────────────────────────────────────────────────────────
  async function handleAttach() {
    if (selected.size === 0) return
    setAttaching(true)
    setError(null)
    try {
      await onAttach(Array.from(selected.values()))
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Attach failed')
    } finally {
      setAttaching(false)
    }
  }

  // ── Scroll focused item into view ─────────────────────────────────────
  useEffect(() => {
    const el = listRef.current?.children[focusedIdx] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [focusedIdx])

  if (!open) return null

  const pageItems = pagedResults()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:w-[480px] sm:max-w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">
            {definition.pickerTitle ?? `Attach ${definition.labelSingular}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded p-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={definition.pickerSearchPlaceholder ?? `Search ${definition.label.toLowerCase()}…`}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {error && (
            <div className="mx-4 mt-3 p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {searching && (
            <div className="py-8 text-center text-sm text-gray-400">Searching…</div>
          )}

          {!searching && query && pageItems.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">
              {definition.pickerEmptyText ?? `No ${definition.label.toLowerCase()} found`}
            </div>
          )}

          {!searching && !query && (
            <div className="py-8 text-center text-sm text-gray-400">
              Type to search {definition.label.toLowerCase()}…
            </div>
          )}

          {pageItems.length > 0 && (
            <ul ref={listRef} className="py-1">
              {pageItems.map((item, i) => {
                const k          = rowKey(item)
                const isAttached = attachedIds.has(k)
                const isSelected = selected.has(k)
                const isFocused  = focusedIdx === i

                return (
                  <li key={k}>
                    <button
                      onClick={() => toggle(item)}
                      disabled={isAttached}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        isFocused && !isAttached && 'bg-slate-50',
                        isAttached && 'opacity-50 cursor-not-allowed',
                        !isAttached && 'hover:bg-gray-50',
                      )}
                    >
                      {/* Checkbox */}
                      <div className={cn(
                        'w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center transition-colors',
                        isSelected ? 'bg-slate-900 border-slate-900' : 'border-gray-300',
                        isAttached && 'bg-gray-200 border-gray-200',
                      )}>
                        {(isSelected || isAttached) && (
                          <Check className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>

                      {/* Item content — use first two columns */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 truncate">
                          {previewCol?.render(item)}
                        </div>
                        {columns[1] && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {columns[1].render(item)}
                          </div>
                        )}
                      </div>

                      {isAttached && (
                        <span className="text-xs text-gray-400 flex-shrink-0">Attached</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-gray-400">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <span className="text-xs text-gray-500">
            {selected.size > 0
              ? `${selected.size} selected`
              : 'Select items to attach'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAttach}
              disabled={selected.size === 0 || attaching}
              className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {attaching ? 'Attaching…' : `Attach ${selected.size > 0 ? selected.size : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
