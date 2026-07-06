'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, Menu, ExternalLink, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastProvider } from '@/components/admin/toast'
import CommandPalette from '@/components/admin/CommandPalette'

// Side-effect: registers all platform modules into the entity registry
import '@/lib/admin/registry/setup'

import {
  entityRegistry,
  type NavRegistration,
  type NavGroup,
} from '@/lib/admin/registry/entity-registry'

const NAV_GROUP_LABELS: Partial<Record<NavGroup, string>> = {
  content:  'Content',
  platform: 'Platform',
}

type Props = {
  slug:     string
  name:     string
  logoUrl?: string | null
  children: React.ReactNode
}

export default function AdminShell({ slug, name, logoUrl, children }: Props) {
  const pathname   = usePathname()
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobile,      setMobile]      = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Cmd+K / Ctrl+K to open palette
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openPalette()
      }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [openPalette])

  // Persist sidebar state
  useEffect(() => {
    const stored = localStorage.getItem('admin_sidebar_collapsed')
    if (stored === 'true') setCollapsed(true)
  }, [])
  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', String(collapsed))
  }, [collapsed])

  function hrefForItem(item: NavRegistration): string {
    const base = `/merch/${slug}/admin`
    const path = item.basePath
    return path ? `${base}/${path}` : base
  }

  function isActive(item: NavRegistration): boolean {
    const href  = hrefForItem(item)
    const exact = item.kind === 'module' ? item.exact : false
    return exact ? pathname === href : pathname.startsWith(href)
  }

  const navByGroup = entityRegistry.navByGroup()
  const groups: [NavGroup, NavRegistration[]][] = [
    ['operations', navByGroup.operations],
    ['content',    navByGroup.content],
    ['platform',   navByGroup.platform],
  ]

  const sidebarW = collapsed ? 'w-16' : 'w-60'

  return (
    <ToastProvider>
    <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} slug={slug} />
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {mobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobile(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className={cn(
        'flex flex-col flex-shrink-0 h-full bg-slate-900 transition-all duration-200 ease-in-out z-50',
        sidebarW,
        mobile ? 'fixed inset-y-0 left-0' : 'relative',
        !mobile && 'hidden lg:flex',
      )}>
        {/* Logo / Tenant */}
        <div className={cn(
          'flex items-center h-14 border-b border-slate-800 flex-shrink-0',
          collapsed ? 'justify-center px-3' : 'px-4 gap-3',
        )}>
          {logoUrl ? (
            <div className="relative w-7 h-7 flex-shrink-0">
              <Image src={logoUrl} alt={name} fill className="object-contain" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{name.slice(0, 1).toUpperCase()}</span>
            </div>
          )}
          {!collapsed && (
            <span className="text-white text-sm font-semibold truncate">{name}</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-5">
          {groups.map(([group, items]) => {
            if (!items.length) return null
            const groupLabel = NAV_GROUP_LABELS[group]
            return (
              <div key={group}>
                {!collapsed && groupLabel && (
                  <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    {groupLabel}
                  </p>
                )}
                <div className="space-y-0.5 px-2">
                  {items.map((item) => {
                    const active = isActive(item)
                    const Icon   = item.kind === 'module' ? item.icon : item.definition.icon
                    const label  = item.kind === 'module' ? item.label : item.definition.namePlural
                    return (
                      <Link
                        key={item.key}
                        href={hrefForItem(item)}
                        title={collapsed ? label : undefined}
                        className={cn(
                          'flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors',
                          active
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100',
                          collapsed && 'justify-center px-0',
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && <span>{label}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="flex-shrink-0 border-t border-slate-800 p-2 space-y-1">
          {!collapsed && (
            <Link
              href={`/merch/${slug}`}
              target="_blank"
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View storefront
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center h-14 bg-white border-b border-gray-200 px-4 gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobile(true)}
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            {logoUrl ? (
              <div className="relative w-6 h-6">
                <Image src={logoUrl} alt={name} fill className="object-contain" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{name.slice(0, 1)}</span>
              </div>
            )}
            <span className="text-sm font-semibold text-gray-900">{name}</span>
          </div>

          {/* Command palette trigger */}
          <button
            onClick={openPalette}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search…</span>
            <kbd className="ml-2 text-[10px] text-gray-400 font-mono">⌘K</kbd>
          </button>

          <div className="flex-1" />

          <Link
            href={`/merch/${slug}`}
            target="_blank"
            className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Storefront
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </ToastProvider>
  )
}
