// Storage interface for file uploads (product images, assets).
// Currently a stub — wire a real provider (Supabase Storage, Cloudflare R2, etc.)
// by implementing StorageProvider and returning it from getStorage().

export type UploadResult = {
  url:  string
  path: string
  size: number
}

export interface StorageProvider {
  upload(
    bucket: string,
    path:   string,
    data:   Buffer | Uint8Array,
    mime:   string,
  ): Promise<UploadResult>

  delete(bucket: string, path: string): Promise<void>

  publicUrl(bucket: string, path: string): string
}

// Null/stub implementation — logs operations without actually storing.
class NullStorageProvider implements StorageProvider {
  async upload(bucket: string, path: string, data: Buffer | Uint8Array, mime: string): Promise<UploadResult> {
    console.warn(`[Storage] upload stub: ${bucket}/${path} (${mime}, ${data.byteLength}b)`)
    return { url: `/placeholder/${path}`, path, size: data.byteLength }
  }

  async delete(bucket: string, path: string): Promise<void> {
    console.warn(`[Storage] delete stub: ${bucket}/${path}`)
  }

  publicUrl(bucket: string, path: string): string {
    return `/placeholder/${bucket}/${path}`
  }
}

let _provider: StorageProvider | null = null

export function getStorage(): StorageProvider {
  if (!_provider) {
    // Auto-configure Supabase Storage if env is present
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { SupabaseStorageProvider } = require('./providers/supabase-storage')
        _provider = new SupabaseStorageProvider()
      } catch {
        _provider = new NullStorageProvider()
      }
    } else {
      _provider = new NullStorageProvider()
    }
  }
  return _provider!
}

export function configureStorage(provider: StorageProvider): void {
  _provider = provider
}
