import type { ClientPortalConfig, PortalUiCopy, PortalVisualTokens } from './types'

/** Defaults match the legacy dark portal when `visualTokens` is omitted. */
export const PORTAL_VISUAL_DEFAULT: PortalVisualTokens = {
  canvas: '#080808',
  warmSection: '#0c0c0c',
  panel: '#0e0e0e',
  panelElevated: '#111',
  ink: '#f5f5f0',
  inkMuted: 'rgba(245,245,240,0.5)',
  inkFaint: 'rgba(245,245,240,0.28)',
  border: 'rgba(255,255,255,0.08)',
  imageWell: '#f2f1ed',
  accent: '#f5a623',
  accentSecondary: '#c53030',
  limeSpot: '#b8f400',
  headerBg: '#0a0a0a',
  warmInk: '#1a2332',
  warmInkMuted: 'rgba(26,35,50,0.62)',
  warmBorder: 'rgba(26,35,50,0.1)',
  cardOnWarm: '#faf8f4',
}

export const PORTAL_UI_DEFAULT: Required<PortalUiCopy> = {
  heroPrimaryCta: 'Browse the range',
  heroSecondaryCta: 'Contact account manager',
  collectionEyebrow: 'Featured collection',
  collectionViewAll: 'View full category',
  categoryIntroEyebrow: 'Complete range',
  categoryIntroTitle: 'All categories',
  addToShortlist: 'Add to order',
  addedToShortlist: 'Added to order',
  viewShortlist: 'View cart',
  cartNavLabel: 'Cart',
}

export function resolvePortalVisual(config: ClientPortalConfig): PortalVisualTokens {
  return { ...PORTAL_VISUAL_DEFAULT, ...config.visualTokens }
}

export function resolvePortalUiCopy(config: ClientPortalConfig): Required<PortalUiCopy> {
  return { ...PORTAL_UI_DEFAULT, ...config.uiCopy }
}
