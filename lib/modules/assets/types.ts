export type { MerchAsset, AssetType } from '@/lib/merch/types'

export type CreateAssetInput = {
  tenantId?:          string
  masterProductId?:   string
  campaignProductId?: string
  variantId?:         string
  type:               string
  url:                string
  altText?:           string
  sortOrder?:         number
}
