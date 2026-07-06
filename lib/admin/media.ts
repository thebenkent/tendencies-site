/**
 * Admin media types.
 *
 * MediaPicker returns MediaAsset objects — not bare URLs.
 * This decouples the UI from the underlying storage implementation.
 * Supabase Storage, S3, Cloudinary all plug in without changing components.
 */

export type FocalPoint = {
  x: number   // 0–1
  y: number   // 0–1
}

export type MediaAsset = {
  id:          string
  url:         string
  alt:         string
  width:       number | null
  height:      number | null
  mime:        string | null
  size:        number | null      // bytes
  focalPoint?: FocalPoint
  metadata?:   Record<string, unknown>
  createdAt:   string
}

// Used when creating a new asset record after upload
export type MediaAssetInput = Omit<MediaAsset, 'id' | 'createdAt'>

// Resolved from an existing URL (when migrating bare-URL fields to asset objects)
export function urlToAsset(url: string, partial?: Partial<MediaAsset>): MediaAsset {
  return {
    id:        url,   // url as surrogate key until a real asset record exists
    url,
    alt:       partial?.alt ?? '',
    width:     partial?.width ?? null,
    height:    partial?.height ?? null,
    mime:      partial?.mime ?? null,
    size:      partial?.size ?? null,
    createdAt: partial?.createdAt ?? new Date().toISOString(),
    ...partial,
  }
}

// Convenience: extract just the URL from an asset (for DB fields that still store bare URLs)
export function assetToUrl(asset: MediaAsset | null | undefined): string | null {
  return asset?.url ?? null
}
