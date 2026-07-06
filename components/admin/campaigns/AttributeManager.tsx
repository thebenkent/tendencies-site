'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, GripVertical, Pencil, Trash2, X, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getAttributesAction,
  createAttributeAction,
  updateAttributeAction,
  deleteAttributeAction,
  reorderAttributesAction,
} from '@/lib/modules/campaigns/attribute-actions'
import type { MerchCampaignAttribute, CampaignAttributeType } from '@/lib/merch/types'

// ── Types ─────────────────────────────────────────────────────────────────

type AttrForm = {
  type:        CampaignAttributeType
  label:       string
  placeholder: string
  help_text:   string
  options:     string    // comma-separated, parsed on save
  required:    boolean
  applies_to:  'order' | 'line'
  active:      boolean
}

const EMPTY_FORM: AttrForm = {
  type:        'text',
  label:       '',
  placeholder: '',
  help_text:   '',
  options:     '',
  required:    false,
  applies_to:  'order',
  active:      true,
}

const ATTR_TYPES: { value: CampaignAttributeType; label: string; hasOptions: boolean }[] = [
  { value: 'text',     label: 'Text',     hasOptions: false },
  { value: 'textarea', label: 'Textarea', hasOptions: false },
  { value: 'number',   label: 'Number',   hasOptions: false },
  { value: 'date',     label: 'Date',     hasOptions: false },
  { value: 'dropdown', label: 'Dropdown', hasOptions: true  },
  { value: 'radio',    label: 'Radio',    hasOptions: true  },
  { value: 'checkbox', label: 'Checkbox', hasOptions: false },
]

const APPLIES_OPTS: { value: 'order' | 'line'; label: string; hint: string }[] = [
  { value: 'order', label: 'Per order',   hint: 'Asked once at checkout' },
  { value: 'line',  label: 'Per product', hint: 'Asked for each product' },
]

// ── Inline form ───────────────────────────────────────────────────────────

function AttrFormPanel({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial:  AttrForm
  onSave:   (d: AttrForm) => Promise<void>
  onCancel: () => void
  saving:   boolean
}) {
  const [form, setForm] = useState<AttrForm>(initial)

  function set<K extends keyof AttrForm>(k: K, v: AttrForm[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  const typeInfo = ATTR_TYPES.find((t) => t.value === form.type)

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50">

      {/* Type pills */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Field type</label>
        <div className="flex flex-wrap gap-1.5">
          {ATTR_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('type', opt.value)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-full border font-medium transition-all',
                form.type === opt.value
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Label <span className="text-red-500">*</span></label>
        <input
          value={form.label}
          onChange={(e) => set('label', e.target.value)}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Delivery instructions"
        />
      </div>

      {/* Options (for dropdown/radio) */}
      {typeInfo?.hasOptions && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Options (comma-separated)</label>
          <input
            value={form.options}
            onChange={(e) => set('options', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      {/* Placeholder */}
      {['text', 'textarea', 'number'].includes(form.type) && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Placeholder</label>
          <input
            value={form.placeholder}
            onChange={(e) => set('placeholder', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional hint text…"
          />
        </div>
      )}

      {/* Help text */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Help text</label>
        <input
          value={form.help_text}
          onChange={(e) => set('help_text', e.target.value)}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Additional instructions for the customer…"
        />
      </div>

      {/* Applies to */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Applies to</label>
        <div className="grid grid-cols-2 gap-2">
          {APPLIES_OPTS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('applies_to', opt.value)}
              className={cn(
                'flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg border text-left transition-all',
                form.applies_to === opt.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400',
              )}
            >
              <span className="text-xs font-medium text-gray-800">{opt.label}</span>
              <span className="text-[11px] text-gray-500">{opt.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Required + Active */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.required}
            onChange={(e) => set('required', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Required</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={form.active}
            onClick={() => set('active', !form.active)}
            className={cn('relative w-9 h-5 rounded-full transition-colors', form.active ? 'bg-indigo-600' : 'bg-gray-300')}
          >
            <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.active && 'translate-x-4')} />
          </button>
          <span className="text-sm text-gray-700">Active</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} disabled={saving}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="button" onClick={() => onSave(form)} disabled={saving || !form.label.trim()}
          className="px-3 py-1.5 text-sm text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1.5">
          {saving ? 'Saving…' : <><Check className="w-3.5 h-3.5" /> Save attribute</>}
        </button>
      </div>
    </div>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────

function AttrRow({
  attr,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  attr:        MerchCampaignAttribute
  onEdit:      () => void
  onDelete:    () => void
  onDragStart: () => void
  onDragOver:  (e: React.DragEvent) => void
  onDrop:      () => void
}) {
  const typeLabel = ATTR_TYPES.find((t) => t.value === attr.type)?.label ?? attr.type

  return (
    <div
      className="group flex items-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-lg"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 cursor-grab flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800 truncate">{attr.label}</span>
          {attr.required && (
            <span className="text-[10px] font-semibold text-red-500 flex-shrink-0">required</span>
          )}
          {!attr.active && (
            <span className="text-[10px] text-gray-400 flex-shrink-0">inactive</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-gray-400">{typeLabel}</span>
          <span className="text-[11px] text-gray-300">·</span>
          <span className="text-[11px] text-gray-400">{attr.applies_to === 'order' ? 'per order' : 'per product'}</span>
          {attr.options && attr.options.length > 0 && (
            <>
              <span className="text-[11px] text-gray-300">·</span>
              <span className="text-[11px] text-gray-400">{attr.options.slice(0, 3).join(', ')}{attr.options.length > 3 && '…'}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────

type Props = {
  campaignId: string
  tenantId:   string
}

export default function AttributeManager({ campaignId, tenantId }: Props) {
  const [attrs,    setAttrs]    = useState<MerchCampaignAttribute[]>([])
  const [loading,  setLoading]  = useState(true)
  const [adding,   setAdding]   = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const dragIdx     = useRef<number | null>(null)
  const dragOverIdx = useRef<number | null>(null)

  const isNew = !campaignId

  useEffect(() => {
    if (!campaignId) return
    getAttributesAction(campaignId)
      .then(setAttrs)
      .catch(() => setError('Could not load attributes'))
      .finally(() => setLoading(false))
  }, [campaignId])

  function formToInput(form: AttrForm, sortOrder: number) {
    return {
      type:        form.type,
      label:       form.label.trim(),
      placeholder: form.placeholder.trim() || null,
      help_text:   form.help_text.trim() || null,
      options:     form.options.trim()
        ? form.options.split(',').map((o) => o.trim()).filter(Boolean)
        : null,
      required:    form.required,
      applies_to:  form.applies_to,
      sort_order:  sortOrder,
      active:      form.active,
    }
  }

  async function handleAdd(form: AttrForm) {
    setSaving(true)
    setError(null)
    try {
      const attr = await createAttributeAction(campaignId, tenantId, formToInput(form, attrs.length))
      setAttrs((p) => [...p, attr])
      setAdding(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(attrId: string, form: AttrForm) {
    setSaving(true)
    setError(null)
    const attr = attrs.find((a) => a.id === attrId)
    try {
      const updated = await updateAttributeAction(attrId, tenantId, campaignId, formToInput(form, attr?.sort_order ?? 0), form.label)
      setAttrs((p) => p.map((a) => (a.id === attrId ? updated : a)))
      setEditingId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(attrId: string, label: string) {
    if (!confirm(`Delete "${label}"?`)) return
    setSaving(true)
    setError(null)
    try {
      await deleteAttributeAction(attrId, tenantId, campaignId, label)
      setAttrs((p) => p.filter((a) => a.id !== attrId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  function onDragStart(i: number) { dragIdx.current = i }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    dragOverIdx.current = i
  }
  async function onDrop() {
    const from = dragIdx.current
    const to   = dragOverIdx.current
    if (from === null || to === null || from === to) return
    const reordered = [...attrs]
    const [item] = reordered.splice(from, 1)
    reordered.splice(to, 0, item)
    setAttrs(reordered)
    dragIdx.current     = null
    dragOverIdx.current = null
    await reorderAttributesAction(reordered.map((a) => a.id), tenantId, campaignId)
  }

  if (isNew) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Save the campaign first, then add attributes.
      </div>
    )
  }

  if (loading) {
    return <div className="py-8 text-center text-sm text-gray-400">Loading attributes…</div>
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* List */}
      {attrs.length === 0 && !adding ? (
        <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-500 mb-3">No attributes yet</p>
          <p className="text-xs text-gray-400 mb-4">Attributes are additional fields customers fill in at checkout.</p>
          <button onClick={() => setAdding(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Add the first attribute
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {attrs.map((attr, i) => (
            editingId === attr.id ? (
              <AttrFormPanel
                key={attr.id}
                initial={{
                  type:        attr.type,
                  label:       attr.label,
                  placeholder: attr.placeholder ?? '',
                  help_text:   attr.help_text ?? '',
                  options:     attr.options?.join(', ') ?? '',
                  required:    attr.required,
                  applies_to:  attr.applies_to,
                  active:      attr.active,
                }}
                onSave={(form) => handleUpdate(attr.id, form)}
                onCancel={() => setEditingId(null)}
                saving={saving}
              />
            ) : (
              <AttrRow
                key={attr.id}
                attr={attr}
                onEdit={() => setEditingId(attr.id)}
                onDelete={() => handleDelete(attr.id, attr.label)}
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDrop={onDrop}
              />
            )
          ))}
        </div>
      )}

      {/* Add form */}
      {adding ? (
        <AttrFormPanel
          initial={EMPTY_FORM}
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
          saving={saving}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 border border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add attribute
        </button>
      )}
    </div>
  )
}
