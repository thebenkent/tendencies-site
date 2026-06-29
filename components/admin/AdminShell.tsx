'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard, ShoppingBag, Factory,
  Megaphone, Layers, Package, Boxes, FolderOpen,
  BarChart3, Users, Settings, Truck, ChevronLeft, Menu,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  label:   string
  href:    (slug: string) => string
  icon:    React.ComponentType<{ className?: string }>
  exact?:  boolean
}
type NavGroup = {
  label?: string
  items:  NavItem[]
}

const NAV: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard',   href: (s) => `/merch/${s}/admin`,          icon: LayoutDashboard, exact: true },
      { label: 'Orders',      href: (s) => `/merch/${s}/admin/orders`,    icon: ShoppingBag },
      { label: 'Production',  href: (s) => `/merch/${s}/admin/production`, icon: Factory },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Campaigns',   href: (s) => `/merch/${s}/admin/campaigns`,   icon: Megaphone },
      { label: 'Collections', href: (s) => `/merch/${s}/admin/collections`, icon: Layers },
      { label: 'Products',    href: (s) => `/merch/${s}/admin/products`,    icon: Package },
      { label: 'Bundles',     href: (s) => `/merch/${s}/admin/bundles`,     icon: Boxes },
      { label: 'Assets',      href: (s) => `/merch/${s}/admin/assets`,      icon: FolderOpen },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Analytics',  href: (s) => `/merch/${s}/admin/analytics`,  icon: BarChart3 },
      { label: 'Customers',  href: (s) => `/merch/${s}/admin/customers`,  icon: Users },
      { label: 'Suppliers',  href: (s) => `/merch/${s}/admin/suppliers`,  icon: Truck },
      { label: 'Settings',   href: (s) => `/merch/${s}/admin/settings`,   icon: Settings },
    ],
  },
]

type Props = {
  slug:     string
  name:     string
  logoUrl?: string | null
  children: React.ReactNode
}

export default function AdminShell({ slug, name, logoUrl, children }: Props) {
  const pathname   = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobile,    setMobile]    = useState(false)

  // Persist sidebar state
  useEffect(() => {
    const stored = localStorage.getItem('admin_sidebar_collapsed')
    if (stored === 'true') setCollapsed(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', String(collapsed))
  }, [collapsed])

  function isActive(item: NavItem): boolean {
    const href = item.href(slug)
    if (item.exact) return pathname === href
    return pathname.startsWith(href)
  }

  const sidebarW = collapsed ? 'w-16' : 'w-60'

  return (
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
          {NAV.map((group, gi) => (
            <div key={gi}>
              {!collapsed && group.label && (
                <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const active = isActive(item)
                  const Icon   = item.icon
                  return (
                    <Link
                      key={item.label}
                      href={item.href(slug)}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100',
                        collapsed && 'justify-center px-0',
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
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
  )
}
