'use client'

import { createContext, useContext } from 'react'
import { hasPermission, hasAnyPermission, type Permission } from '@/lib/admin/permissions'
import type { MerchUserRole } from '@/lib/merch/types'

// ── Context ───────────────────────────────────────────────────────────────
type PermissionContextValue = {
  role: MerchUserRole
}

const PermissionContext = createContext<PermissionContextValue | null>(null)

export function PermissionProvider({
  role,
  children,
}: {
  role: MerchUserRole
  children: React.ReactNode
}) {
  return (
    <PermissionContext.Provider value={{ role }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions(): PermissionContextValue {
  const ctx = useContext(PermissionContext)
  if (!ctx) throw new Error('usePermissions must be used within PermissionProvider')
  return ctx
}

export function useHasPermission(permission: Permission): boolean {
  const ctx = useContext(PermissionContext)
  if (!ctx) return false
  return hasPermission(ctx.role, permission)
}

export function useHasAnyPermission(permissions: Permission[]): boolean {
  const ctx = useContext(PermissionContext)
  if (!ctx) return false
  return hasAnyPermission(ctx.role, permissions)
}

// ── Can gate component ────────────────────────────────────────────────────

type CanProps = {
  permission:  Permission | Permission[]
  fallback?:   React.ReactNode
  children:    React.ReactNode
}

/**
 * Renders children only when the current user has the given permission(s).
 * Accepts a single permission string or an array (any-match).
 *
 * Usage:
 *   <Can permission="campaigns.publish">
 *     <PublishButton />
 *   </Can>
 *
 *   <Can permission={["campaigns.update", "campaigns.publish"]}>
 *     <EditControls />
 *   </Can>
 */
export default function Can({ permission, fallback = null, children }: CanProps) {
  const ctx = useContext(PermissionContext)

  // If no provider: render nothing (fail-closed)
  if (!ctx) return <>{fallback}</>

  const allowed = Array.isArray(permission)
    ? hasAnyPermission(ctx.role, permission)
    : hasPermission(ctx.role, permission)

  return allowed ? <>{children}</> : <>{fallback}</>
}
