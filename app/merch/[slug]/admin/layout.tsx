import type { ReactNode } from 'react'

// Auth is enforced by middleware via Supabase Auth (@supabase/ssr).
// No additional check needed here.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
