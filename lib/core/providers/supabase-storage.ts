import { createClient } from '@supabase/supabase-js'
import type { StorageProvider, UploadResult } from '../storage'

export class SupabaseStorageProvider implements StorageProvider {
  private client: ReturnType<typeof createClient>
  private publicUrlBase: string

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
    this.client       = createClient(url, key, { auth: { persistSession: false } })
    this.publicUrlBase = url
  }

  async upload(
    bucket: string,
    path:   string,
    data:   Buffer | Uint8Array,
    mime:   string,
  ): Promise<UploadResult> {
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, data, { contentType: mime, upsert: true })
    if (error) throw new Error(`Storage upload failed: ${error.message}`)
    return {
      url:  this.publicUrl(bucket, path),
      path,
      size: data.byteLength,
    }
  }

  async delete(bucket: string, path: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([path])
    if (error) throw new Error(`Storage delete failed: ${error.message}`)
  }

  publicUrl(bucket: string, path: string): string {
    return `${this.publicUrlBase}/storage/v1/object/public/${bucket}/${path}`
  }
}
