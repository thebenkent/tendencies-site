'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle, PanelRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import ExtensionToolbar from '@/components/admin/extensions/ExtensionToolbar'
import ValidationSummary from '@/components/admin/extensions/ValidationSummary'
import DetailPanel from '@/components/admin/extensions/DetailPanel'
import type { AdminForm } from '@/lib/admin/form'
import type { EditorTab } from './types'
import type { ToolbarActionContribution, DetailPanelContribution, ValidationIssue } from '@/lib/admin/extensions/definition'

type Props<T extends Record<string, unknown>> = {
  open:      boolean
  onClose:   () => void
  onSave:    () => Promise<void>
  onDelete?: () => Promise<void>

  title:        string
  description?: string
  isNew?:       boolean
  dirty:        boolean
  saving?:      boolean
  deleting?:    boolean

  form:      AdminForm<T>
  tabs?:     EditorTab<T>[]
  children?: React.ReactNode   // single-tab mode (no tabs prop)

  width?: 'sm' | 'md' | 'lg'
  entityLabel?: string

  // ── Extension surfaces ────────────────────────────────────────────────────
  /** Toolbar action buttons rendered in the footer between Delete and Cancel */
  toolbarActions?:  ToolbarActionContribution[]
  /** Right-hand detail panel sections — toggled by Info button in header */
  detailPanels?:    DetailPanelContribution[]
  /** Validation issues to display — errors block save, warnings are informational */
  validationIssues?: ValidationIssue[]
  onDismissIssues?: () => void
}

const WIDTH: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
}

export default function CRUDEditor<T extends Record<string, unknown>>({
  open, onClose, onSave, onDelete,
  title, description, isNew, dirty, saving, deleting,
  form, tabs, children,
  width = 'md', entityLabel = 'item',
  toolbarActions = [], detailPanels = [], validationIssues = [], onDismissIssues,
}: Props<T>) {
  const [activeTab,     setActiveTab]     = useState(tabs?.[0]?.key ?? '')
  const [confirmClose,  setConfirmClose]  = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [panelOpen,     setPanelOpen]     = useState(false)

  // Reset active tab + panel state when editor opens to a new entity
  useEffect(() => {
    if (open) setActiveTab(tabs?.[0]?.key ?? '')
    setConfirmClose(false)
    setConfirmDelete(false)
    setPanelOpen(false)
  }, [open, tabs])

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); if (!saving) handleSave() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, saving, dirty])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleClose() {
    if (dirty) setConfirmClose(true)
    else onClose()
  }

  async function handleSave() {
    await onSave()
  }

  if (!open) return null

  const currentTab      = tabs?.find((t) => t.key === activeTab)
  const hasPanel        = detailPanels.length > 0
  const hasToolbar      = toolbarActions.length > 0
  const tenantId        = String((form.data as Record<string, unknown>)['tenantId'] ?? '')
  const formForPanel    = form as unknown as AdminForm<Record<string, unknown>>

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal aria-label={title}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* Panel */}
      <div className={cn(
        'absolute inset-y-0 right-0 flex flex-col bg-white shadow-2xl w-full',
        WIDTH[width],
      )}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              {!isNew && dirty && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 uppercase tracking-wider">
                  Unsaved
                </span>
              )}
            </div>
            {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
          </div>
          <div className="flex items-center gap-1 ml-4 flex-shrink-0">
            {/* Detail panel toggle — only shown when panels exist */}
            {hasPanel && (
              <button
                onClick={() => setPanelOpen((v) => !v)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  panelOpen
                    ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                )}
                aria-label={panelOpen ? 'Close info panel' : 'Open info panel'}
                title="Info panel"
              >
                <PanelRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        {tabs && tabs.length > 1 && (
          <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
                  activeTab === tab.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Validation summary — below tabs, above body */}
        {validationIssues.length > 0 && (
          <div className="flex-shrink-0">
            <ValidationSummary
              issues={validationIssues}
              onDismiss={onDismissIssues ?? (() => {})}
            />
          </div>
        )}

        {/* Body — flex row: main content + optional detail panel overlay */}
        <div className="flex-1 overflow-hidden relative">
          {/* Main content */}
          <div className="absolute inset-0 overflow-y-auto">
            <div className="px-6 py-5 space-y-5">
              {/* Global form error */}
              {form.errors['_global' as keyof T] && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {form.errors['_global' as keyof T]}
                </div>
              )}

              {tabs ? currentTab?.content(form) : children}
            </div>
          </div>

          {/* Detail panel — slides in from right, overlays content */}
          {hasPanel && (
            <div className={cn(
              'absolute inset-y-0 right-0 transition-transform duration-200',
              panelOpen ? 'translate-x-0' : 'translate-x-full',
            )}>
              <DetailPanel
                panels={detailPanels}
                form={formForPanel}
                tenantId={tenantId}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
          {/* Left: Delete */}
          <div>
            {!isNew && onDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={deleting || saving}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-40"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>

          {/* Middle: Extension toolbar actions */}
          {hasToolbar && (
            <ExtensionToolbar
              actions={toolbarActions}
              data={form.data as Record<string, unknown>}
              tenantId={tenantId}
            />
          )}

          {/* Right: Cancel + Save */}
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              disabled={saving}
              className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (!dirty && !isNew)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors',
                saving || (!dirty && !isNew)
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800',
              )}
            >
              {saving ? 'Saving…' : isNew ? 'Create' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Unsaved changes confirm */}
      {confirmClose && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex gap-3 items-start mb-5">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Discard unsaved changes?</p>
                <p className="text-sm text-gray-500 mt-1">Your changes will be lost.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmClose(false)} className="px-3.5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Keep editing
              </button>
              <button onClick={() => { form.reset(); onClose() }} className="px-3.5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800">
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && onDelete && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex gap-3 items-start mb-5">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4.5 h-4.5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Delete {entityLabel}?</p>
                <p className="text-sm text-gray-500 mt-1">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(false)} className="px-3.5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={async () => { setConfirmDelete(false); await onDelete() }} disabled={deleting}
                className="px-3.5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
