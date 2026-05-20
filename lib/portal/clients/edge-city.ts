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
    canvas: '#222c3d',
    warmSection: '#f4efe6',
    panel: '#2a3448',
    panelElevated: '#323e56',
    ink: '#ede9e1',
    inkMuted: 'rgba(237,233,225,0.55)',
    inkFaint: 'rgba(237,233,225,0.32)',
    border: 'rgba(237,233,225,0.11)',
    imageWell: '#ebe4d9',
    accent: '#4a7ab8',
    accentSecondary: '#b83d32',
    limeSpot: '#c5e632',
    headerBg: '#1a2332',
    warmInk: '#243042',
    warmInkMuted: 'rgba(36,48,66,0.66)',
    warmBorder: 'rgba(36,48,66,0.1)',
    cardOnWarm: '#faf6ef',
  },
  uiCopy: {
    heroPrimaryCta: 'Recommended kits',
    heroSecondaryCta: 'Message Ben',
    collectionEyebrow: 'Recommended kits',
    collectionViewAll: 'Browse full category',
    featuredPieceCta: 'Configure & shortlist',
    categoryIntroEyebrow: 'Full catalogue',
    categoryIntroTitle: 'Browse by category',
    addToShortlist: 'Add to shortlist',
    addedToShortlist: 'On your shortlist',
    viewShortlist: 'View shortlist',
    cartNavLabel: 'Shortlist',
  },
  hero: {
    image: '/edge-city/hero-lifestyle.jpg',
    tagline: 'One programme. Pre-agreed terms. Ready when you are.',
    subtitle:
      'Hi-vis and site kit curated like a Tendencies proposal — clear pricing, realistic lead times, and a shortlist flow instead of a retail checkout.',
  },

  brandStory: {
    image: '/edge-city/hero-hoodie.jpg',
    headline: 'Built for the Site. Built to Last.',
    body: 'Start with the recommended kits below, then use the full catalogue when you need alternates or add-ons. Every piece is engineered for construction: durable fabrics, visibility where it counts, and fits that work on real jobs — from first site walk to handover.',
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
    phone: '+64 21 455 953',
  },

  emails: {
    internalTo: 'ben@tendencies.co.nz',
  },
}

export default EDGE_CITY
