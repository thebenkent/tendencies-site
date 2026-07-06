'use client'

/**
 * Autosave Framework.
 *
 * Debounced autosave hook for the editor.
 * Saves after a quiet period (debounceMs), detects conflicts, and
 * supports manual save override for the "Save now" button.
 *
 * Status flow:
 *   idle → (dirty) → pending → saving → saved/error → idle
 *
 * Conflict detection: the server save function should return a version
 * token. If the token changes between saves, a conflict is declared.
 * The editor is then responsible for showing a conflict resolution UI.
 */

import { useEffect, useRef, useCallback, useState } from 'react'

// ── Status ────────────────────────────────────────────────────────────────

export type AutosaveStatus =
  | 'idle'      // no unsaved changes
  | 'pending'   // changes exist, debounce timer running
  | 'saving'    // save in flight
  | 'saved'     // last save succeeded (briefly shown, then idle)
  | 'error'     // last save failed
  | 'conflict'  // server version differs from local version

// ── Config ────────────────────────────────────────────────────────────────

export type AutosaveConfig<T> = {
  data:        T
  dirty:       boolean
  /** Async save function. Return value is the new server version token. */
  onSave:      (data: T) => Promise<string | void>
  debounceMs?: number     // default 2000ms
  enabled?:    boolean    // default true — set false to disable autosave
  onStatusChange?: (status: AutosaveStatus) => void
  onConflict?: (local: T, serverVersion: string) => void
}

// ── Hook ─────────────────────────────────────────────────────────────────

export function useAutosave<T>({
  data,
  dirty,
  onSave,
  debounceMs = 2000,
  enabled = true,
  onStatusChange,
  onConflict,
}: AutosaveConfig<T>) {
  const [status, setStatus] = useState<AutosaveStatus>('idle')
  const timerRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const inFlight   = useRef(false)
  const versionRef = useRef<string | null>(null)  // last known server version

  const updateStatus = useCallback(
    (s: AutosaveStatus) => {
      setStatus(s)
      onStatusChange?.(s)
    },
    [onStatusChange],
  )

  const doSave = useCallback(
    async (snapshot: T) => {
      if (inFlight.current) return
      inFlight.current = true
      updateStatus('saving')

      try {
        const newVersion = await onSave(snapshot)

        if (newVersion && versionRef.current && newVersion !== versionRef.current) {
          // Server version changed — conflict
          versionRef.current = newVersion
          updateStatus('conflict')
          onConflict?.(snapshot, newVersion)
          return
        }

        if (newVersion) versionRef.current = newVersion
        updateStatus('saved')
        setTimeout(() => updateStatus('idle'), 2000)
      } catch (err) {
        console.error('[Autosave] save failed:', err)
        updateStatus('error')
      } finally {
        inFlight.current = false
      }
    },
    [onSave, updateStatus, onConflict],
  )

  // Debounced auto-trigger when data changes and dirty=true
  useEffect(() => {
    if (!enabled || !dirty) return

    updateStatus('pending')
    clearTimeout(timerRef.current)
    const snapshot = data   // capture current data for async closure

    timerRef.current = setTimeout(() => doSave(snapshot), debounceMs)

    return () => clearTimeout(timerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dirty, enabled, debounceMs])

  // Manual save — bypasses debounce, fires immediately
  const saveNow = useCallback(() => {
    clearTimeout(timerRef.current)
    if (!dirty) return
    void doSave(data)
  }, [data, dirty, doSave])

  return { status, saveNow }
}

// ── Display helpers ───────────────────────────────────────────────────────

export const AUTOSAVE_STATUS_LABELS: Record<AutosaveStatus, string> = {
  idle:     '',
  pending:  'Unsaved changes',
  saving:   'Saving…',
  saved:    'Saved',
  error:    'Save failed',
  conflict: 'Conflict detected',
}
