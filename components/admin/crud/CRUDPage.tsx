'use client'

import { useState, useMemo, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Package } from 'lucide-react'
import { useAdminForm } from '@/lib/admin/form'
import { useToast } from '@/components/admin/toast'
import Can from '@/components/admin/Can'
import AdminTable from '@/components/admin/AdminTable'
import type { AdminTableSort } from '@/components/admin/AdminTable'
import FieldRenderer from '@/components/admin/form/FieldRenderer'
import EmptyState   from '@/components/admin/EmptyState'
import BulkActionBar from '@/components/admin/BulkActionBar'
import CRUDToolbar    from './CRUDToolbar'
import CRUDEditor     from './CRUDEditor'
import CRUDDeleteDialog from './CRUDDeleteDialog'
import CRUDPagination from './CRUDPagination'
import RelationManager from '@/components/admin/relationships/RelationManager'
import { relationshipRegistry } from '@/lib/admin/registry/relationship-registry'
import { useExtensionComposer, runValidators } from '@/lib/admin/extensions/composition'
import type { EntityDefinition, FieldSchema } from '@/lib/admin/definitions'
import type { RelationshipDefinition } from '@/lib/admin/relationships/definition'
import type { ValidationIssue } from '@/lib/admin/extensions/definition'
import type { AdminForm } from '@/lib/admin/form'
import type { BulkAction, FilterState } from './types'

// ── Props ─────────────────────────────────────────────────────────────────

type Props<T extends Record<string, unknown>> = {
  // Pre-fetched data (Server Component fetches, passes down)
  data:         T[]

  // Entity definition — drives columns, filters, editor schema, permissions
  definition:   EntityDefinition<T>

  // CRUD callbacks — server actions or API wrappers
  onCreate?:    (data: T) => Promise<T>
  onUpdate?:    (id: string, data: T) => Promise<T>
  onDelete?:    (id: string) => Promise<void>
  onDuplicate?: (id: string) => Promise<T>
  onArchive?:   (id: string) => Promise<void>

  // Default form values for "new" entity
  defaultValues: T

  // Bulk actions
  bulkActions?: BulkAction<T>[]

  // Override editor with render prop (opt-out of schema-driven)
  renderEditor?: (form: AdminForm<T>) => React.ReactNode

  pageSize?: number
}

const PAGE_SIZES = [25, 50, 100]

// ── Component ─────────────────────────────────────────────────────────────

export default function CRUDPage<T extends Record<string, unknown>>({
  data, definition, onCreate, onUpdate, onDelete, onDuplicate, onArchive,
  defaultValues, bulkActions, renderEditor, pageSize: initPageSize = 25,
}: Props<T>) {
  const router   = useRouter()
  const { success: toastSuccess, error: toastError } = useToast()
  const [isPending, startTransition] = useTransition()

  // ── Filter / sort / page ──────────────────────────────────────────────
  const [search,      setSearch]      = useState('')
  const [filterState, setFilterState] = useState<FilterState>({})
  const [sort,        setSort]        = useState<AdminTableSort>(definition.defaultSort ?? null)
  const [page,        setPage]        = useState(1)
  const [pageSize,    setPageSize]    = useState(initPageSize)

  // ── Selection ─────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // ── Editor ────────────────────────────────────────────────────────────
  const [editorOpen,  setEditorOpen]  = useState(false)
  const [editingRow,  setEditingRow]  = useState<T | null>(null)
  const [saving,      setSaving]      = useState(false)
  const [deletingRow, setDeletingRow] = useState<T | null>(null)
  const [deleting,    setDeleting]    = useState(false)

  const form = useAdminForm<T>(editingRow ?? defaultValues)

  // ── Extension composition ─────────────────────────────────────────────
  // Merges EntityDefinition.extensions with any plugin-registered extensions.
  const composed = useExtensionComposer(definition)

  // Validation issues from extension validators — cleared on open/close
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([])

  // ── Client-side filter + sort + paginate ──────────────────────────────
  const filtered = useMemo(() => {
    let rows = [...data]

    if (search && definition.searchKeys) {
      const q = search.toLowerCase()
      rows = rows.filter((row) =>
        definition.searchKeys!.some((key) => {
          const v = row[key]
          return typeof v === 'string' && v.toLowerCase().includes(q)
        }),
      )
    }

    for (const [key, value] of Object.entries(filterState)) {
      if (!value) continue
      rows = rows.filter((row) => {
        const rv = row[key]
        if (typeof rv === 'boolean') return value === '1' ? rv : !rv
        return String(rv) === value
      })
    }

    if (sort) {
      rows.sort((a, b) => {
        const av = a[sort.key] as string | number
        const bv = b[sort.key] as string | number
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sort.dir === 'asc' ? cmp : -cmp
      })
    }

    return rows
  }, [data, search, filterState, sort, definition.searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged      = filtered.slice((page - 1) * pageSize, page * pageSize)

  // ── Handlers ──────────────────────────────────────────────────────────
  function refresh() {
    startTransition(() => router.refresh())
  }

  function openCreate() {
    setEditingRow(null)
    form.reset()
    setValidationIssues([])
    setEditorOpen(true)
  }

  function openEdit(row: T) {
    setEditingRow(row)
    setValidationIssues([])
    setEditorOpen(true)
  }

  function closeEditor() {
    setEditorOpen(false)
    setEditingRow(null)
    setValidationIssues([])
  }

  async function handleSave() {
    // Run extension validators before persisting
    if (composed.validators.length > 0) {
      const tenantId = String((form.data as Record<string, unknown>)['tenantId'] ?? '')
      const mode     = editingRow ? 'update' : 'create'
      const issues   = await runValidators(
        composed.validators,
        form.data as Record<string, unknown>,
        tenantId,
        mode,
      )
      if (issues.length > 0) {
        setValidationIssues(issues)
        // Field-specific errors → form state; block save on any error
        issues.forEach((issue) => {
          if (issue.field) form.setError(issue.field as keyof T, issue.message)
        })
        if (issues.some((i) => i.severity === 'error')) return
      } else {
        setValidationIssues([])
      }
    }

    setSaving(true)
    try {
      if (editingRow && onUpdate) {
        await onUpdate(definition.rowKey(editingRow), form.data)
        toastSuccess(`${definition.name} updated`)
      } else if (!editingRow && onCreate) {
        await onCreate(form.data)
        toastSuccess(`${definition.name} created`)
      }
      closeEditor()
      refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      toastError('Failed to save', msg)
      form.setError('_global' as keyof T, msg)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingRow || !onDelete) return
    setDeleting(true)
    try {
      await onDelete(definition.rowKey(deletingRow))
      toastSuccess(`${definition.name} deleted`)
      setDeletingRow(null)
      refresh()
    } catch (e) {
      toastError('Delete failed', e instanceof Error ? e.message : undefined)
    } finally {
      setDeleting(false)
    }
  }

  async function handleDuplicate(row: T) {
    if (!onDuplicate) return
    try {
      await onDuplicate(definition.rowKey(row))
      toastSuccess(`${definition.name} duplicated`)
      refresh()
    } catch (e) {
      toastError('Duplicate failed', e instanceof Error ? e.message : undefined)
    }
  }

  const toggleRow = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }, [])

  const toggleAll = useCallback((selectAll: boolean) => {
    setSelected(selectAll ? new Set(paged.map(definition.rowKey)) : new Set())
  }, [paged, definition.rowKey])

  const selectedRows = useMemo(
    () => data.filter((r) => selected.has(definition.rowKey(r))),
    [data, selected, definition.rowKey],
  )

  // ── Editor title ──────────────────────────────────────────────────────
  const editorTitle = definition.editorTitle
    ? definition.editorTitle(editingRow)
    : editingRow ? `Edit ${definition.name}` : `New ${definition.name}`

  // ── Schema-driven editor tabs ─────────────────────────────────────────
  const schemaTabs = definition.editorTabs?.map((tab) => ({
    key:   tab.key,
    label: tab.label,
    content: (f: AdminForm<T>) => {
      // Custom render function takes precedence over schema fields
      if (tab.content) return tab.content(f as AdminForm<Record<string, unknown>>)
      return (
        <div className="space-y-4">
          {(tab.fields ?? []).map((field: FieldSchema) => (
            <FieldRenderer key={field.key} field={field} form={f} />
          ))}
        </div>
      )
    },
  }))

  // ── Relationship tabs (auto-generated) ────────────────────────────────
  // Sources (in priority order):
  //   1. definition.relationships (inline) — sorted by tabOrder
  //   2. plugin contributions via registerRelationship(entityKey, def)
  //   3. extension contributions via composed.relationships (from extensions[])
  const entityKey = definition.namePlural.toLowerCase()
  const pluginRelationships = relationshipRegistry.getForEntity(entityKey)
  const allRelationships: RelationshipDefinition[] = [
    ...([...(definition.relationships ?? [])].sort(
      (a, b) => (a.tabOrder ?? 0) - (b.tabOrder ?? 0),
    )),
    ...pluginRelationships,
    ...composed.relationships,
  ]

  const relationshipTabs = allRelationships.map((rel) => ({
    key:   `_rel_${rel.relation}`,
    label: rel.label,
    content: (f: AdminForm<T>) => {
      const parentId = String(f.data['id'] ?? '')
      const tenantId = String(f.data['tenantId'] ?? '')
      return (
        <RelationManager
          parentId={parentId}
          tenantId={tenantId}
          definition={rel}
        />
      )
    },
  }))

  // ── Extension editor tabs ─────────────────────────────────────────────
  const extensionTabs = composed.editorTabs.map((tab) => ({
    key:     tab.key,
    label:   tab.label,
    content: (f: AdminForm<T>) =>
      tab.content(f as unknown as AdminForm<Record<string, unknown>>),
  }))

  // Final tab order: schema → relationships → extension tabs
  const allTabs = [...(schemaTabs ?? []), ...relationshipTabs, ...extensionTabs]

  // ── Permissions ───────────────────────────────────────────────────────
  const perms = definition.permissions
  const canCreate    = !perms?.create
  const canEdit_     = !perms?.update
  const canDelete_   = !perms?.delete
  const canDuplicate = !!onDuplicate && !perms?.duplicate
  const canArchive   = !!onArchive && !perms?.archive

  const createButton = (
    <button
      onClick={openCreate}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
    >
      + New {definition.name}
    </button>
  )

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <CRUDToolbar
        searchable={definition.searchable}
        searchPlaceholder={definition.searchPlaceholder}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        filters={definition.filters?.map((f) => ({
          key:     f.key,
          label:   f.label,
          type:    f.type,
          options: f.options,
        }))}
        filterState={filterState}
        onFilterChange={(key, value) => { setFilterState((p) => ({ ...p, [key]: value })); setPage(1) }}
        onFilterClear={() => setFilterState({})}
        columns={definition.columns.map((c) => ({
          key:      c.key,
          label:    c.label,
          sortable: c.sortable,
          render:   c.render,
        }))}
        sort={sort}
        onSortChange={(s) => { setSort(s); setPage(1) }}
        resultCount={filtered.length}
        totalCount={data.length}
        onCreate={canCreate && onCreate ? (perms?.create
          ? undefined  // wrapped below in <Can>
          : openCreate)
          : undefined}
        createLabel={`New ${definition.name}`}
      />

      {/* Permissions-gated create button overlay if permission defined */}
      {canCreate && onCreate && perms?.create && (
        <div className="px-4 pb-0 pt-3 flex justify-end -mt-12">
          <Can permission={perms.create}>{createButton}</Can>
        </div>
      )}

      {/* Table */}
      <AdminTable
        columns={definition.columns}
        data={paged}
        rowKey={definition.rowKey}
        sort={sort}
        onSortChange={(s) => { setSort(s); setPage(1) }}
        selectable={!!bulkActions?.length}
        selected={selected}
        onSelect={toggleRow}
        onSelectAll={toggleAll}
        onEdit={canEdit_ && onUpdate ? openEdit : undefined}
        onDelete={canDelete_ && onDelete ? (row) => setDeletingRow(row) : undefined}
        onDuplicate={canDuplicate ? handleDuplicate : undefined}
        onArchive={canArchive && onArchive ? (row) => onArchive(definition.rowKey(row)) : undefined}
        extraRowActions={definition.extraActions}
        canEdit={canEdit_}
        canDelete={canDelete_}
        canDuplicate={canDuplicate}
        canArchive={canArchive}
        loading={isPending}
        emptyState={
          <EmptyState
            icon={<definition.icon className="w-6 h-6" />}
            title={definition.emptyTitle ?? `No ${definition.namePlural} yet`}
            description={definition.emptyDescription}
            action={canCreate && onCreate
              ? <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                  + New {definition.name}
                </button>
              : undefined}
          />
        }
      />

      {/* Pagination */}
      <CRUDPagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={filtered.length}
        onPage={(p) => setPage(p)}
        onPageSize={(s) => { setPageSize(s); setPage(1) }}
        pageSizes={PAGE_SIZES}
      />

      {/* Editor */}
      <CRUDEditor
        key={editingRow ? definition.rowKey(editingRow) : 'new'}
        open={editorOpen}
        onClose={closeEditor}
        onSave={handleSave}
        onDelete={editingRow && onDelete ? async () => {
          setDeletingRow(editingRow)
          setEditorOpen(false)
        } : undefined}
        title={editorTitle}
        isNew={!editingRow}
        dirty={form.dirty}
        saving={saving}
        form={form}
        tabs={allTabs.length > 0 ? allTabs : undefined}
        width={definition.editorWidth ?? 'md'}
        entityLabel={definition.name}
        toolbarActions={composed.toolbarActions}
        detailPanels={composed.detailPanels}
        validationIssues={validationIssues}
        onDismissIssues={() => setValidationIssues([])}
      >
        {/* Flat field schema (no tabs) */}
        {!definition.editorTabs && definition.editorFields && (
          <div className="space-y-4">
            {definition.editorFields.map((field) => (
              <FieldRenderer key={field.key} field={field} form={form} />
            ))}
          </div>
        )}
        {/* Custom render prop override */}
        {!definition.editorTabs && !definition.editorFields && renderEditor?.(form)}
      </CRUDEditor>

      {/* Delete confirmation */}
      <CRUDDeleteDialog
        open={!!deletingRow}
        entityLabel={deletingRow
          ? String(deletingRow[definition.columns[0]?.key] ?? definition.name)
          : definition.name}
        onClose={() => setDeletingRow(null)}
        onConfirm={handleDelete}
        loading={deleting}
        consequence={definition.deleteConsequence}
      />

      {/* Bulk actions bar */}
      {bulkActions && selectedRows.length > 0 && (
        <BulkActionBar
          count={selectedRows.length}
          onClear={() => setSelected(new Set())}
          actions={bulkActions.map((action) => ({
            label:   action.label,
            variant: action.variant,
            onClick: async () => {
              await action.onClick(selectedRows)
              setSelected(new Set())
              refresh()
            },
          }))}
        />
      )}
    </div>
  )
}
