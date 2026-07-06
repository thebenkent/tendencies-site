'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, GripVertical, Pencil, Trash2, X, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getBannersAction,
  createBannerAction,
  updateBannerAction,
  deleteBannerAction,
  reorderBannersAction,
} from '@/lib/modules/campaigns/banner-actions'
import type { MerchCampaignBanner, BannerType } from '@/lib/merch/types'

// ── Types ─────────────────────────────────────────────────────────────────

type BannerForm = {
  message:     string
  banner_type: BannerType
  link_label:  string
  link_url:    string
  active:      boolean
  starts_at:   string
  ends_at:     string
}

const EMPTY_FORM: BannerForm = {
  message:     '',
  banner_type: 'info',
  link_label:  '',
  link_url:    '',
  active:      true,
  starts_at:   '',
  ends_at:     '',
}

const BANNER_TYPE_OPTS: { value: BannerType; label: string; colour: string }[] = [
  { value: 'info',    label: 'Info',    colour: 'bg-blue-50 border-blue-200 text-blue-800' },
  { value: 'success', label: 'Success', colour: 'bg-green-50 border-green-200 text-green-800' },
  { value: 'warning', label: 'Warning', colour: 'bg-amber-50 border-amber-200 text-amber-800' },
  { value: 'urgent',  label: 'Urgent',  colour: 'bg-red-50 border-red-200 text-red-800' },
  { value: 'neutral', label: 'Neutral', colour: 'bg-gray-50 border-gray-200 text-gray-700' },
]

// ── Preview ───────────────────────────────────────────────────────────────

function BannerPreview({ banner }: { banner: MerchCampaignBanner | BannerForm }) {
  const type  = (banner as MerchCampaignBanner).banner_type ?? (banner as BannerForm).banner_type ?? 'info'
  const style = BANNER_TYPE_OPTS.find((o) => o.value === type)?.colour ?? 'bg-gray-50 border-gray-200 text-gray-700'
  const link  = 'link_url' in banner ? banner.link_url : null
  const linkLabel = 'link_label' in banner ? banner.link_label : null

  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 rounded-lg border text-sm', style)}>
      <span className="flex-1">{banner.message || <em className="opacity-50">Banner message…</em>}</span>
      {(link || linkLabel) && (
        <a className="font-medium underline underline-offset-2 flex-shrink-0">
          {linkLabel || 'Learn more'}
        </a>
      )}
    </div>
  )
}

// ── Inline form ───────────────────────────────────────────────────────────

function BannerForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: BannerForm
  onSave:  (d: BannerForm) => Promise<void>
  onCancel: () => void
  saving:  boolean
}) {
  const [form, setForm] = useState<BannerForm>(initial)

  function set<K extends keyof BannerForm>(k: K, v: BannerForm[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50">
      {/* Preview */}
      <BannerPreview banner={form} />

      {/* Message */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Message <span className="text-red-500">*</span></label>
        <textarea
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          rows={2}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Banner message…"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
        <div className="flex flex-wrap gap-2">
          {BANNER_TYPE_OPTS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('banner_type', opt.value)}
              className={cn(
                'px-3 py-1 text-xs rounded-full border font-medium transition-all',
                opt.colour,
                form.banner_type === opt.value ? 'ring-2 ring-indigo-500 ring-offset-1' : 'opacity-60 hover:opacity-100',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">CTA label</label>
          <input
            value={form.link_label}
            onChange={(e) => set('link_label', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Learn more"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
          <input
            value={form.link_url}
            onChange={(e) => set('link_url', e.target.value)}
            type="url"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://…"
          />
        </div>
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Show from</label>
          <input type="datetime-local" value={form.starts_at} onChange={(e) => set('starts_at', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Show until</label>
          <input type="datetime-local" value={form.ends_at} onChange={(e) => set('ends_at', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      {/* Active toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <button
          type="button"
          role="switch"
          aria-checked={form.active}
          onClick={() => set('active', !form.active)}
          className={cn(
            'relative w-9 h-5 rounded-full transition-colors',
            form.active ? 'bg-indigo-600' : 'bg-gray-300',
          )}
        >
          <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.active && 'translate-x-4')} />
        </button>
        <span className="text-sm text-gray-700">Active</span>
      </label>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} disabled={saving}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="button" onClick={() => onSave(form)} disabled={saving || !form.message.trim()}
          className="px-3 py-1.5 text-sm text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1.5">
          {saving ? 'Saving…' : <><Check className="w-3.5 h-3.5" /> Save banner</>}
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

type Props = {
  campaignId: string
  tenantId:   string
}

export default function BannerManager({ campaignId, tenantId }: Props) {
  const [banners, setBanners] = useState<MerchCampaignBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [adding,  setAdding]  = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Drag state
  const dragIdx = useRef<number | null>(null)
  const dragOverIdx = useRef<number | null>(null)

  // New campaign — no ID yet
  const isNew = !campaignId

  useEffect(() => {
    if (!campaignId) return
    getBannersAction(campaignId)
      .then(setBanners)
      .catch(() => setError('Could not load banners'))
      .finally(() => setLoading(false))
  }, [campaignId])

  async function handleAdd(form: BannerForm) {
    setSaving(true)
    setError(null)
    try {
      const banner = await createBannerAction(campaignId, tenantId, {
        message:     form.message,
        banner_type: form.banner_type,
        link_label:  form.link_label || null,
        link_url:    form.link_url || null,
        active:      form.active,
        starts_at:   form.starts_at || null,
        ends_at:     form.ends_at || null,
        sort_order:  banners.length,
      })
      setBanners((p) => [...p, banner])
      setAdding(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(bannerId: string, form: BannerForm) {
    setSaving(true)
    setError(null)
    try {
      const updated = await updateBannerAction(bannerId, tenantId, campaignId, {
        message:     form.message,
        banner_type: form.banner_type,
        link_label:  form.link_label || null,
        link_url:    form.link_url || null,
        active:      form.active,
        starts_at:   form.starts_at || null,
        ends_at:     form.ends_at || null,
      }, form.message.slice(0, 60))
      setBanners((p) => p.map((b) => (b.id === bannerId ? updated : b)))
      setEditingId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(bannerId: string, label: string) {
    if (!confirm(`Delete banner "${label}"?`)) return
    setSaving(true)
    setError(null)
    try {
      await deleteBannerAction(bannerId, tenantId, campaignId, label)
      setBanners((p) => p.filter((b) => b.id !== bannerId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  // HTML5 drag-and-drop reorder
  function onDragStart(i: number) { dragIdx.current = i }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    dragOverIdx.current = i
  }
  async function onDrop() {
    const from = dragIdx.current
    const to   = dragOverIdx.current
    if (from === null || to === null || from === to) return
    const reordered = [...banners]
    const [item] = reordered.splice(from, 1)
    reordered.splice(to, 0, item)
    setBanners(reordered)
    dragIdx.current    = null
    dragOverIdx.current = null
    await reorderBannersAction(reordered.map((b) => b.id), tenantId, campaignId)
  }

  if (isNew) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Save the campaign first, then add banners.
      </div>
    )
  }

  if (loading) {
    return <div className="py-8 text-center text-sm text-gray-400">Loading banners…</div>
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Banner list */}
      {banners.length === 0 && !adding ? (
        <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-500 mb-3">No banners yet</p>
          <button onClick={() => setAdding(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Add the first banner
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {banners.map((banner, i) => (
            <div key={banner.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDrop={onDrop}
              className="group"
            >
              {editingId === banner.id ? (
                <BannerForm
                  initial={{
                    message:     banner.message,
                    banner_type: banner.banner_type,
                    link_label:  banner.link_label ?? '',
                    link_url:    banner.link_url ?? '',
                    active:      banner.active,
                    starts_at:   banner.starts_at ?? '',
                    ends_at:     banner.ends_at ?? '',
                  }}
                  onSave={(form) => handleUpdate(banner.id, form)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              ) : (
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 mt-3 text-gray-300 group-hover:text-gray-400 cursor-grab flex-shrink-0" />
                  <div className="flex-1">
                    <BannerPreview banner={banner} />
                    <div className="flex items-center gap-3 mt-1 px-1">
                      {!banner.active && (
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Inactive</span>
                      )}
                      {banner.starts_at && (
                        <span className="text-[10px] text-gray-400">
                          From {new Date(banner.starts_at).toLocaleDateString()}
                        </span>
                      )}
                      {banner.ends_at && (
                        <span className="text-[10px] text-gray-400">
                          Until {new Date(banner.ends_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2.5">
                    <button
                      onClick={() => setEditingId(banner.id)}
                      className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id, banner.message.slice(0, 40))}
                      className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {adding ? (
        <BannerForm
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
          Add banner
        </button>
      )}
    </div>
  )
}
