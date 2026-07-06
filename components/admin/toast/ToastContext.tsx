'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, AlertTriangle, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'loading' | 'info'

export type Toast = {
  id:       string
  type:     ToastType
  title:    string
  message?: string
  duration: number    // ms; 0 = persistent until manually dismissed
}

type ToastContextValue = {
  toast:   (opts: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
  success: (title: string, message?: string) => string
  error:   (title: string, message?: string) => string
  warning: (title: string, message?: string) => string
  loading: (title: string, message?: string) => string
  info:    (title: string, message?: string) => string
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ── Icons per type ────────────────────────────────────────────
const TOAST_ICON: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle  className="w-4 h-4 text-green-500 flex-shrink-0" />,
  error:   <XCircle      className="w-4 h-4 text-red-500 flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
  loading: <Loader2      className="w-4 h-4 text-blue-500 flex-shrink-0 animate-spin" />,
  info:    <CheckCircle  className="w-4 h-4 text-blue-500 flex-shrink-0" />,
}

const TOAST_BG: Record<ToastType, string> = {
  success: 'border-green-200  bg-green-50',
  error:   'border-red-200    bg-red-50',
  warning: 'border-amber-200  bg-amber-50',
  loading: 'border-blue-200   bg-blue-50',
  info:    'border-blue-200   bg-blue-50',
}

// ── Single toast item ─────────────────────────────────────────
function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <div className={cn(
      'flex items-start gap-3 w-full max-w-sm rounded-xl border shadow-lg px-4 py-3 bg-white',
      TOAST_BG[t.type],
      'animate-in slide-in-from-right-5 fade-in duration-200',
    )}>
      {TOAST_ICON[t.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{t.title}</p>
        {t.message && (
          <p className="text-xs text-gray-600 mt-0.5 leading-snug">{t.message}</p>
        )}
      </div>
      {t.duration !== 0 && (
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0 -mr-1">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

// ── Provider ─────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((opts: Omit<Toast, 'id'>): string => {
    const id = Math.random().toString(36).slice(2)
    const entry: Toast = { ...opts, id }
    setToasts((prev) => [...prev.slice(-4), entry])   // max 5 visible

    if (opts.duration !== 0) {
      const ms = opts.duration ?? 4000
      timers.current.set(id, setTimeout(() => dismiss(id), ms))
    }
    return id
  }, [dismiss])

  const make = useCallback(
    (type: ToastType, dur: number) =>
      (title: string, message?: string) =>
        toast({ type, title, message, duration: dur }),
    [toast],
  )

  const ctx: ToastContextValue = {
    toast,
    dismiss,
    success: make('success', 4000),
    error:   make('error',   6000),
    warning: make('warning', 5000),
    loading: make('loading', 0),
    info:    make('info',    4000),
  }

  const container = (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  )

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {typeof document !== 'undefined' && createPortal(container, document.body)}
    </ToastContext.Provider>
  )
}
