import type { ClientPortalConfig } from '../types'
import {
  HIREPOOL_CATEGORIES,
  HIREPOOL_FEATURED_COLLECTIONS,
} from './hirepool-products'

const HIREPOOL: ClientPortalConfig = {
  slug: 'hirepool',
  clientName: 'Hirepool',
  portalTitle: 'Brand Room',

  logo: {
    type: 'image',
    src: '/hirepool/hirepool-logo.svg',
    alt: 'Hirepool',
  },

  accentColor: '#e64325',

  visualTokens: {
    canvas: '#1b315e',
    warmSection: '#f2f0ed',
    panel: '#233a6e',
    panelElevated: '#2c4880',
    ink: '#ffffff',
    inkMuted: 'rgba(255,255,255,0.58)',
    inkFaint: 'rgba(255,255,255,0.30)',
    border: 'rgba(255,255,255,0.10)',
    imageWell: '#e4e8f2',
    accent: '#e64325',
    accentSecondary: '#c02e18',
    limeSpot: '#e64325',
    headerBg: '#142448',
    warmInk: '#1b315e',
    warmInkMuted: 'rgba(27,49,94,0.62)',
    warmBorder: 'rgba(27,49,94,0.10)',
    cardOnWarm: '#faf8f5',
  },

  uiCopy: {
    heroPrimaryCta: 'Browse the range',
    heroSecondaryCta: 'Talk to Ben',
    collectionEyebrow: 'Recommended for your team',
    collectionViewAll: 'Browse full category',
    featuredPieceCta: 'View & shortlist',
    categoryIntroEyebrow: 'Brand Room',
    categoryIntroTitle: 'Browse by category',
    addToShortlist: 'Add to shortlist',
    addedToShortlist: 'On your shortlist',
    viewShortlist: 'View shortlist',
    cartNavLabel: 'Shortlist',
  },

  hero: {
    tagline: 'Your brand. Ready when the team needs it.',
    subtitle:
      'Approved Hirepool kit in one place — browse, shortlist, and brief new requirements without starting from scratch every time.',
  },

  brandStory: {
    headline: 'Consistent brand. Every branch. Every team.',
    body: 'From the counter to the site, your team is your brand. The Hirepool Brand Room keeps your approved kit in one place — ready to shortlist for a new branch opening, reorder proven items, or brief a safety campaign without hunting through old proposals.',
    pillars: [
      {
        title: 'One place for everything',
        description:
          'Branch kits, trade packs, safety apparel, and event support — curated and approved before it lands here.',
      },
      {
        title: 'Brief new requirements fast',
        description:
          'Shortlist items, add a note, and send to the team in a single step. No PDFs. No back-and-forth.',
      },
      {
        title: 'Consistent across branches',
        description:
          'Pre-agreed styles and decoration spec ensure every branch presents the same Hirepool brand, every time.',
      },
    ],
  },

  categories: HIREPOOL_CATEGORIES,

  featuredCollections: HIREPOOL_FEATURED_COLLECTIONS,

  ordering: {
    requiresStaffName: false,
    requiresDeliveryAddress: true,
    deliveryOptions: [
      {
        id: 'head-office',
        label: 'Head Office — East Tamaki, Auckland',
        address: '50 Stonedon Drive, East Tamaki, Auckland 2013',
      },
      {
        id: 'branch-delivery',
        label: 'Branch delivery — specify branch at checkout',
      },
    ],
    orderNote:
      'This Brand Room is a shortlist tool — submitting your shortlist sends it to your Tendencies contact for review, sizing, pricing confirmation, and lead time before any order is placed. Prices shown are indicative at standard quantities.',
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

export default HIREPOOL
