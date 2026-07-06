'use client'

/**
 * RelationManager — the primary relationship management component.
 *
 * Renders a full attach/detach/reorder/metadata interface from a
 * RelationshipDefinition. All service callbacks (fetch, search, attach,
 * detach, reorder, updateMetadata) are read from the definition — this
 * component requires no module-specific callback props.
 *
 * CRUDPage uses RelationManager automatically when EntityDefinition.relationships
 * is defined. Manual use is also supported for custom tab layouts.
 *
 * Usage (manual):
 *   <RelationManager
 *     parentId={campaignId}
 *     tenantId={tenantId}
 *     definition={collectionsRelationship}
 *   />
 *
 * Usage (automatic via EntityDefinition.relationships):
 *   export const campaignDefinition = {
 *     relationships: [collectionsRelationship, productsRelationship],
 *   }
 *   // CRUDPage creates one tab per relationship, no manual wiring.
 *
 * Modes
 *   – table (default): RelationTable with drag-and-drop reorder
 *   – card:            RelationCard grid with drag handles
 *
 * "parentId is empty" guard
 *   When parentId is falsy (unsaved parent), shows a prompt to save first.
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/admin/toast'
import { useHasPermission } from '@/components/admin/Can'
import { useAdminForm } from '@/lib/admin/form'
import FieldRenderer from '@/components/admin/form/FieldRenderer'
import SlideOver from '@/components/admin/SlideOver'
import RelationToolbar from './RelationToolbar'
import RelationTable from './RelationTable'
import RelationCard from './RelationCard'
import RelationPicker from './RelationPicker'
import RelationEmptyState from './RelationEmptyState'
import { useRelationOrder } from './RelationOrder'
import type { RelationshipDefinition, RelationItem } from '@/lib/admin/relationships/definition'
import type { Permission } from '@/lib/admin/permissions'

// ── Props ─────────────────────────────────────────────────────────────────

type Props<Child extends Record<string, unknown>> = {
  /** The parent entity's primary key (e.g. campaign.id). Empty string = unsaved. */
  parentId:   string
  /** Tenant ID, threaded through all service callbacks. */
  tenantId:   string
  /** Self-contained relationship configuration including service callbacks. */
  definition: RelationshipDefinition<Child>
}

// ── Component ─────────────────────────────────────────────────────────────

export default function RelationManager<Child extends Record<string, unknown>>({
  parentId, tenantId, definition,
}: Props<Child>) {
  const { success: toastOk, error: toastErr } = useToast()

  // ── Service callbacks (from definition) ───────────────────────────────
  const { fetch: onFetch, search: onSearch, attach: onAttach, detach: onDetach,
          reorder: onReorder, updateMetadata: onUpdateMetadata } = definition

  // ── Permission checks ─────────────────────────────────────────────────
  // useHasPermission returns false when no PermissionProvider is present.
  // The `|| !definition.permissions?.X` fallback means "allow if no permission defined".
  const _canAttach   = useHasPermission(definition.permissions?.attach as Permission)
  const _canDetach   = useHasPermission(definition.permissions?.detach as Permission)
  const _canReorder  = useHasPermission(definition.permissions?.reorder as Permission)
  const _canEditMeta = useHasPermission(definition.permissions?.updateMetadata as Permission)

  const canAttach   = _canAttach   || !definition.permissions?.attach
  const canDetach   = _canDetach   || !definition.permissions?.detach
  const canReorder  = _canReorder  || !definition.permissions?.reorder
  const canEditMeta = _canEditMeta || !definition.permissions?.updateMetadata

  // ── Data ──────────────────────────────────────────────────────────────
  const [items,   setItems]   = useState<RelationItem<Child>[]>([])
  const [loading, setLoading] = useState(false)

  const fetchItems = useCallback(async () => {
    if (!parentId) return
    setLoading(true)
    try {
      const data = await onFetch(parentId, tenantId)
      setItems(data)
    } catch {
      toastErr(`Failed to load ${definition.label.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }, [parentId, tenantId, onFetch, definition.label, toastErr])

  useEffect(() => { fetchItems() }, [fetchItems])

  // ── Table search (client-side filter of loaded items) ─────────────────
  const [tableSearch, setTableSearch] = useState('')
  const rowKey = definition.entity.rowKey
  const filteredItems = tableSearch
    ? items.filter((item) => {
        const q = tableSearch.toLowerCase()
        return (definition.entity.searchKeys ?? []).some((k) =>
          String(item[k] ?? '').toLowerCase().includes(q),
        )
      })
    : items

  // ── Selection ─────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll(all: boolean) {
    setSelected(all ? new Set(filteredItems.map(rowKey)) : new Set())
  }

  // ── Picker ────────────────────────────────────────────────────────────
  const [pickerOpen, setPickerOpen] = useState(false)
  const attachedIds = new Set(items.map(rowKey))

  async function handleSearch(query: string): Promise<Child[]> {
    return onSearch(query, tenantId, Array.from(attachedIds), parentId)
  }

  async function handleAttach(picked: Child[]) {
    const ids = picked.map(rowKey)
    await onAttach(parentId, ids, tenantId)
    await fetchItems()
    toastOk(`${picked.length} ${picked.length === 1 ? definition.labelSingular : definition.label} attached`)
  }

  // ── Detach ────────────────────────────────────────────────────────────
  const [detaching, setDetaching] = useState<string | null>(null)

  async function handleDetach(childId: string) {
    setDetaching(childId)
    try {
      await onDetach(parentId, childId, tenantId)
      setItems((prev) => prev.filter((i) => rowKey(i) !== childId))
      setSelected((prev) => { const next = new Set(prev); next.delete(childId); return next })
      toastOk(`${definition.labelSingular} removed`)
    } catch {
      toastErr(`Failed to remove ${definition.labelSingular.toLowerCase()}`)
    } finally {
      setDetaching(null)
    }
  }

  async function handleBulkDetach() {
    const ids = Array.from(selected)
    if (!ids.length) return
    try {
      await Promise.all(ids.map((id) => onDetach(parentId, id, tenantId)))
      setItems((prev) => prev.filter((i) => !selected.has(rowKey(i))))
      setSelected(new Set())
      toastOk(`${ids.length} ${definition.label.toLowerCase()} removed`)
    } catch {
      toastErr(`Failed to remove ${definition.label.toLowerCase()}`)
    }
  }

  // ── Reorder ───────────────────────────────────────────────────────────
  async function handleReorder(orderedIds: string[]) {
    if (!onReorder) return
    try {
      await onReorder(parentId, orderedIds, tenantId)
    } catch {
      toastErr('Failed to save order')
      await fetchItems() // restore server order
    }
  }

  const order = useRelationOrder({
    items:     filteredItems,
    getKey:    rowKey,
    onReorder: handleReorder,
    enabled:   !!(definition.sortable && canReorder && onReorder),
  })

  // ── Metadata editor ───────────────────────────────────────────────────
  const [metaRow,    setMetaRow]    = useState<Child | null>(null)
  const [metaSaving, setMetaSaving] = useState(false)
  const metaInitial = metaRow ? (definition.getMetadata?.(metaRow) ?? {}) : {}
  const metaForm    = useAdminForm<Record<string, unknown>>(metaInitial)

  async function handleSaveMeta() {
    if (!metaRow || !onUpdateMetadata) return
    setMetaSaving(true)
    try {
      await onUpdateMetadata(parentId, rowKey(metaRow), metaForm.data, tenantId)
      await fetchItems()
      setMetaRow(null)
      toastOk('Details saved')
    } catch {
      toastErr('Failed to save details')
    } finally {
      setMetaSaving(false)
    }
  }

  // ── Unsaved parent guard ──────────────────────────────────────────────
  if (!parentId) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Save the record first to manage {definition.label.toLowerCase()}.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  const layout = definition.layout ?? 'table'
  const showDetach   = definition.detachable && canDetach
  const showAttach   = definition.attachable && canAttach
  const showSort     = !!(definition.sortable && onReorder && canReorder)
  const showEditMeta = !!(definition.metadataFields?.length && canEditMeta && onUpdateMetadata)

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      {(showAttach || items.length > 0) && (
        <RelationToolbar
          searchValue={tableSearch}
          onSearchChange={setTableSearch}
          searchPlaceholder={`Filter ${definition.label.toLowerCase()}…`}
          onAttach={showAttach ? () => setPickerOpen(true) : undefined}
          attachLabel={`Attach ${definition.labelSingular}`}
          canAttach={canAttach}
          selectedCount={selected.size}
          onBulkDetach={showDetach ? handleBulkDetach : undefined}
          canDetach={canDetach}
        />
      )}

      {/* Items */}
      {filteredItems.length === 0 ? (
        <RelationEmptyState
          title={definition.emptyTitle ?? `No ${definition.label.toLowerCase()} yet`}
          description={definition.emptyDescription}
          icon={definition.emptyIcon}
          onAttach={showAttach ? () => setPickerOpen(true) : undefined}
          attachLabel={`Attach ${definition.labelSingular}`}
        />
      ) : layout === 'card' ? (
        <div className="grid grid-cols-2 gap-2">
          {order.localItems.map((item, i) => (
            <RelationCard
              key={rowKey(item)}
              item={item}
              definition={definition}
              index={i}
              selected={selected.has(rowKey(item))}
              onSelect={showDetach ? toggleSelect : undefined}
              onDetach={showDetach ? handleDetach : undefined}
              onEditMeta={showEditMeta ? setMetaRow : undefined}
              dragHandlers={showSort ? order.dragHandlers(i) : undefined}
              isDragOver={order.dragOverIndex === i}
              canDetach={canDetach}
              canSort={showSort}
              canEditMeta={showEditMeta}
            />
          ))}
        </div>
      ) : (
        <RelationTable
          items={filteredItems}
          definition={definition}
          selected={selected}
          onSelect={toggleSelect}
          onSelectAll={selectAll}
          onDetach={showDetach ? handleDetach : undefined}
          onEditMeta={showEditMeta ? setMetaRow : undefined}
          canDetach={canDetach}
          canSort={showSort}
          canEditMeta={showEditMeta}
          order={order}
        />
      )}

      {/* Attach picker */}
      <RelationPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        definition={definition}
        attachedIds={attachedIds}
        onAttach={handleAttach}
        onSearch={handleSearch}
      />

      {/* Metadata editor (uses existing FieldRenderer — no separate renderer) */}
      {definition.metadataFields && metaRow && (
        <SlideOver
          open
          onClose={() => setMetaRow(null)}
          title={`Edit ${definition.labelSingular} details`}
          width="sm"
          footer={
            <div className="flex justify-end gap-2 px-4 py-3">
              <button
                onClick={() => setMetaRow(null)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMeta}
                disabled={metaSaving}
                className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                {metaSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          }
        >
          <div className="p-4 space-y-4">
            {definition.metadataFields.map((field) => (
              <FieldRenderer key={field.key} field={field} form={metaForm} />
            ))}
          </div>
        </SlideOver>
      )}
    </div>
  )
}
