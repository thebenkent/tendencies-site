'use client'

/**
 * ValidationSummary — renders extension-contributed validation issues.
 *
 * Rendered below the editor tab bar, above the body content.
 * Errors are visually distinct from warnings.
 * Errors block save (enforced in CRUDPage.handleSave).
 */

import { AlertTriangle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ValidationIssue } from '@/lib/admin/extensions/definition'

type Props = {
  issues:    ValidationIssue[]
  onDismiss: () => void
}

export default function ValidationSummary({ issues, onDismiss }: Props) {
  if (issues.length === 0) return null

  const errors   = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warning')
  const hasErrors = errors.length > 0

  return (
    <div className={cn(
      'mx-6 mt-4 rounded-xl border p-3',
      hasErrors ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200',
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {hasErrors
            ? <AlertCircle   className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            : <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-semibold mb-1',
              hasErrors ? 'text-red-700' : 'text-amber-700',
            )}>
              {hasErrors
                ? `${errors.length} error${errors.length > 1 ? 's' : ''} must be fixed before saving`
                : `${warnings.length} warning${warnings.length > 1 ? 's' : ''}`}
            </p>
            <ul className={cn(
              'text-xs space-y-0.5',
              hasErrors ? 'text-red-600' : 'text-amber-600',
            )}>
              {issues.map((issue, i) => (
                <li key={i} className="flex items-baseline gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 mt-1.5" />
                  {issue.field && (
                    <span className="font-medium">{issue.field}:</span>
                  )}
                  {issue.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-0.5 rounded',
            hasErrors ? 'text-red-400 hover:text-red-600' : 'text-amber-400 hover:text-amber-600',
          )}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
