'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { entityRegistry } from '@/lib/admin/registry/entity-registry'
import { searchRegistry, type SearchResult } from '@/lib/admin/registry/search-registry'

// ── Legacy alias — kept so callers using PaletteItem continue to compile ──
export type PaletteItem = SearchResult

type Props = {
  open:        boolean
  onClose:     () => void
  slug:        string
  extraItems?: SearchResult[]
}

// Build static nav items from the entity registry.
// These show when the query is empty and seed the search index.
function buildNavItems(slug: string): SearchResult[] {
  const base = `/merch/${slug}/admin`

  // From entity registry (registered modules + entities)
  const fromRegistry = entityRegistry.allNavItems().map((item) => {
    const path  = item.basePath ? `${base}/${item.basePath}` : base
    const label = item.kind === 'module' ? item.label : item.definition.namePlural
    const Icon  = item.kind === 'module' ? item.icon : item.definition.icon
    return {
      id:    `nav:${item.key}`,
      label,
      group: 'Navigate',
      url:   path,
      icon:  <Icon className="w-4 h-4" />,
    } satisfies SearchResult
  })

  // Also include results from any registered search providers (static nav items)
  const fromProviders = searchRegistry.navItems(slug)

  return [...fromRegistry, ...fromProviders]
}

export default function CommandPalette({ open, onClose, slug, extraItems = [] }: Props) {
  const router    = useRouter()
  const inputRef  = useRef<HTMLInputElement>(null)

  const [query,     setQuery]     = useState('')
  const [results,   setResults]   = useState<SearchResult[]>([])
  const [loading,   setLoading]   = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Static nav items — recomputed only when slug changes
  const navItems = useMemo(() => [...buildNavItems(slug), ...extraItems], [slug, extraItems])

  // ── Search ───────────────────────────────────────────────────────────────

  const runSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults(navItems)
        setLoading(false)
        return
      }
      // Optimistic client-side filter of nav items (instant feel)
      const ql = q.toLowerCase()
      const instant = navItems.filter(
        (item) =>
          item.label.toLowerCase().includes(ql) ||
          item.group?.toLowerCase().includes(ql) ||
          item.keywords?.some((k) => k.toLowerCase().includes(ql)),
      )
      setResults(instant)

      // Async provider search (debounced, runs in parallel)
      setLoading(true)
      try {
        const providerResults = await searchRegistry.search(q, slug)
        // Merge: provider results replace any nav items with the same id
        const providerIds = new Set(providerResults.map((r) => r.id))
        const merged = [
          ...providerResults,
          ...instant.filter((r) => !providerIds.has(r.id)),
        ]
        setResults(merged)
      } catch {
        // Keep instant results on error
      } finally {
        setLoading(false)
      }
    },
    [navItems, slug],
  )

  // Debounce async search by 200ms
  useEffect(() => {
    clearTimeout(searchTimer.current)
    if (!open) return
    searchTimer.current = setTimeout(() => runSearch(query), 200)
    return () => clearTimeout(searchTimer.current)
  }, [query, open, runSearch])

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults(navItems)
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => { setActiveIdx(0) }, [query])

  // ── Keyboard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter') {
        const item = results[activeIdx]
        if (item) select(item)
      }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results, activeIdx])

  function select(item: SearchResult) {
    onClose()
    if (item.action) { item.action(); return }
    if (item.url)    router.push(item.url)
  }

  if (!open) return null

  // Group results
  const groups = results.reduce<Record<string, SearchResult[]>>((acc, item) => {
    const g = item.group ?? 'Other'
    if (!acc[g]) acc[g] = []
    acc[g].push(item)
    return acc
  }, {})

  let flatIdx = 0

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]" role="dialog" aria-modal aria-label="Command palette">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/10">

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          {loading
            ? <Loader2 className="w-4 h-4 text-gray-400 flex-shrink-0 animate-spin" />
            : <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages and actions…"
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">No results</p>
          ) : (
            Object.entries(groups).map(([group, groupItems]) => (
              <div key={group}>
                <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{group}</p>
                {groupItems.map((item) => {
                  const idx  = flatIdx++
                  const active = idx === activeIdx
                  return (
                    <button
                      key={item.id}
                      onClick={() => select(item)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors',
                        active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50',
                      )}
                    >
                      {item.icon && (
                        <span className={active ? 'text-indigo-500' : 'text-gray-400'}>
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 text-sm">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded font-medium',
                          active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500',
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> select</span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
