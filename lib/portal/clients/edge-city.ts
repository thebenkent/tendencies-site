import type { ClientPortalConfig } from '../types'
import {
  EDGE_CITY_CATEGORIES,
  EDGE_CITY_FEATURED_COLLECTIONS,
} from './edge-city-products'

const EDGE_CITY: ClientPortalConfig = {
  slug: 'edge-city',
  clientName: 'Edge City Builders',
  portalTitle: 'Uniform programme',

  logo: {
    type: 'image',
    src: '/edge-city-logo.png',
    alt: 'Edge City',
  },
  accentColor: '#3b6ea5',
  visualTokens: {
    canvas: '#1a2436',
    warmSection: '#f0ebe3',
    panel: '#243044',
    panelElevated: '#2c3c54',
    ink: '#f4f1ea',
    inkMuted: 'rgba(244,241,234,0.58)',
    inkFaint: 'rgba(244,241,234,0.3)',
    border: 'rgba(244,241,234,0.12)',
    imageWell: '#e8e2d8',
    accent: '#3b6ea5',
    accentSecondary: '#c23b2e',
    limeSpot: '#c5e632',
    headerBg: '#151f2e',
    warmInk: '#1c2738',
    warmInkMuted: 'rgba(28,39,56,0.68)',
    warmBorder: 'rgba(28,39,56,0.12)',
    cardOnWarm: '#faf7f1',
  },
  uiCopy: {
    heroPrimaryCta: 'View recommended kits',
    heroSecondaryCta: 'Email account manager',
    collectionEyebrow: 'Recommended kits',
    collectionViewAll: 'Browse full category',
    categoryIntroEyebrow: 'Full catalogue',
    categoryIntroTitle: 'Browse by category',
    addToShortlist: 'Add to shortlist',
    addedToShortlist: 'On your shortlist',
    viewShortlist: 'View shortlist',
    cartNavLabel: 'Shortlist',
  },
  hero: {
    tagline: 'Your crew. One programme. Zero guesswork.',
    subtitle:
      'Curated hi-vis and site kit with pre-agreed pricing and lead times — built like a Tendencies proposal portal, not a retail shelf. Review the recommended kits first, then dive into the full range when you are ready.',
  },

  brandStory: {
    headline: 'Built for the Site. Built to Last.',
    body: 'Every piece in the Edge City programme is engineered for construction—durable fabrics, high-visibility standards, and a fit that works for real jobs. From early site walks to final handovers, we keep your crew visible, comfortable, and professional.',
    pillars: [
      {
        title: 'Built for the Site',
        description: 'High-vis rated, reinforced seams, weather protection. Every item meets NZ work standards.',
      },
      {
        title: 'One Programme All Roles',
        description: 'Site managers, trades, admin. One ordering system fits every member of your team.',
      },
      {
        title: 'Ordered in Minutes',
        description: 'Pre-approved stock. Fast turnaround. No procurement headaches.',
      },
    ],
  },

  // Products and categories are generated from data/edge-city-products.csv
  // Run: npm run import:edge-city  to regenerate after spreadsheet changes
  categories: EDGE_CITY_CATEGORIES,

  featuredCollections: EDGE_CITY_FEATURED_COLLECTIONS,

  ordering: {
    requiresStaffName: false,
    requiresDeliveryAddress: false,
    deliveryOptions: [
      {
        id: 'head-office',
        label: 'Head Office — Auckland CBD',
        address: '1 Main St, Auckland, 1010',
      },
      {
        id: 'south-site',
        label: 'South Site — Manukau',
        address: '45 Industry Rd, Manukau, 2104',
      },
    ],
    orderNote:
      'All items are pre-approved. Orders are processed within 2 business days. For urgent requests contact your Tendencies account manager.',
  },

  contact: {
    manager: 'Ben',
    email: 'ben@tendencies.co.nz',
    phone: '+64 21 XXX XXXX',
  },

  emails: {
    internalTo: 'ben@tendencies.co.nz',
  },
}

export default EDGE_CITY
