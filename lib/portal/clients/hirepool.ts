import type { ClientPortalConfig } from '../types'

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

  categories: [
    {
      id: 'staff-apparel',
      slug: 'staff-apparel',
      name: 'Staff Apparel',
      description:
        'Everyday branded apparel for branch teams — polos, tees, hoodies, and caps in approved Hirepool styles.',
      image: '/edge-city/fashion-biz-p200ms-hero.png',
      products: [
        {
          id: 'hp-polo-01',
          name: 'Branch Polo',
          slug: 'branch-polo',
          description:
            'The core Hirepool uniform polo. Moisture-wicking performance fabric, embroidered chest logo, available in orange and charcoal. Suitable for counter, yard, and customer-facing roles.',
          image: '/edge-city/fashion-biz-p200ms-hero.png',
          images: [
            '/edge-city/fashion-biz-p200ms-navy-white-front.png',
            '/edge-city/fashion-biz-p200ms-navy-white-back.png',
          ],
          categoryId: 'staff-apparel',
          sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
          colours: [
            { name: 'Hirepool Orange', hex: '#F4611C' },
            { name: 'Charcoal', hex: '#3A3A3A' },
            { name: 'Black', hex: '#111111' },
          ],
          decorationMethod: 'Embroidery — chest logo + optional name',
          leadWeeks: [4, 6],
          priceCents: 5200,
          requiresStaffName: false,
        },
        {
          id: 'hp-tee-01',
          name: 'Staff Tee',
          slug: 'staff-tee',
          description:
            'Heavyweight 240gsm cotton tee. A step up from a standard promo shirt — holds its shape, holds a print, and gets worn outside of work. Suitable for yard staff, trade events, and internal merch.',
          image: '/edge-city/as-colour-1174-hero.png',
          images: [
            '/edge-city/as-colour-1174-black.png',
            '/edge-city/as-colour-1174-navy.png',
            '/edge-city/as-colour-1174-khaki.png',
          ],
          categoryId: 'staff-apparel',
          sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
          colours: [
            { name: 'Black', hex: '#111111' },
            { name: 'Navy', hex: '#1B2B4B' },
            { name: 'Stone', hex: '#B8A98A' },
          ],
          decorationMethod: 'Screen-print or DTF — front chest + back option',
          leadWeeks: [3, 5],
          priceCents: 3800,
          requiresStaffName: false,
        },
        {
          id: 'hp-hoodie-01',
          name: 'Team Hoodie',
          slug: 'team-hoodie',
          description:
            'Midweight brushed-back fleece hoodie. Embroidered chest logo and optional department/branch print on back. Works across site, office, and off-field — the item staff keep.',
          image: '/edge-city/syzmik-hoodie-zt467-hero.png',
          images: [
            '/edge-city/syzmik-hoodie-zt467-back.png',
            '/edge-city/syzmik-hoodie-Charcoal-Black.png',
            '/edge-city/syzmik-hoodie-Slate-Charcoal.jpeg',
          ],
          categoryId: 'staff-apparel',
          sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
          colours: [
            { name: 'Black / Charcoal', hex: '#1A1A1A' },
            { name: 'Slate / Charcoal', hex: '#596067' },
            { name: 'Navy / Charcoal', hex: '#1B2B4B' },
          ],
          decorationMethod: 'Embroidery — chest logo. Optional back print.',
          leadWeeks: [5, 7],
          priceCents: 8900,
          requiresStaffName: false,
        },
        {
          id: 'hp-cap-01',
          name: 'Branded Cap',
          slug: 'branded-cap',
          description:
            'Six-panel structured cap in heavy cotton twill. Embroidered Hirepool logo to front panel. Available in orange, black, and charcoal.',
          image: '/cat-cap.jpg',
          categoryId: 'staff-apparel',
          sizes: ['One size'],
          colours: [
            { name: 'Orange', hex: '#F4611C' },
            { name: 'Black', hex: '#111111' },
            { name: 'Charcoal', hex: '#3A3A3A' },
          ],
          decorationMethod: 'Embroidery — front panel',
          leadWeeks: [4, 6],
          priceCents: 4200,
          requiresStaffName: false,
        },
      ],
    },

    {
      id: 'safety-hi-vis',
      slug: 'safety-hi-vis',
      name: 'Safety & Hi-Vis',
      description:
        'Hi-vis rated apparel for site teams, yard operations, and compliance-required roles. All items meet AS/NZS standards.',
      image: '/edge-city/syzmik-hi-vis-ZH239-hero.png',
      products: [
        {
          id: 'hp-hv-vest-01',
          name: 'Hi-Vis Vest',
          slug: 'hi-vis-vest',
          description:
            'Class D day/night rated safety vest. Hirepool logo screen-printed to back. Lightweight, breathable mesh back, solid front panel. The standard site vest for visiting crews and contractors.',
          image: '/edge-city/syzmik-hi-vis-ZH239-hero.png',
          images: [
            '/edge-city/syzmik-hi-vis-ZH239-front.png',
            '/edge-city/syzmik-hi-vis-ZH239-back.png',
          ],
          categoryId: 'safety-hi-vis',
          sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
          colours: [
            { name: 'Orange', hex: '#FF5C00' },
            { name: 'Yellow', hex: '#FFD100' },
          ],
          decorationMethod: 'Screen-print — back panel (logo + optional text)',
          leadWeeks: [2, 4],
          priceCents: 3600,
          requiresStaffName: false,
        },
        {
          id: 'hp-hv-shirt-01',
          name: 'Hi-Vis Long Sleeve Shirt',
          slug: 'hi-vis-long-sleeve',
          description:
            'Lightweight cotton/poly blend hi-vis shirt. Two chest pockets, contrast tape shoulder-to-wrist. Embroidered logo to left chest. Suitable for branch and site operations year-round.',
          image: '/edge-city/syzmik-hi-vis-zh320-hero.png',
          images: [
            '/edge-city/syzmik-hi-vis-zh320-front.png',
            '/edge-city/syzmik-hi-vis-zh320-back.png',
          ],
          categoryId: 'safety-hi-vis',
          sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
          colours: [
            { name: 'Orange', hex: '#FF5C00' },
            { name: 'Yellow', hex: '#FFD100' },
          ],
          decorationMethod: 'Embroidery — left chest logo',
          leadWeeks: [3, 5],
          priceCents: 6500,
          requiresStaffName: false,
        },
        {
          id: 'hp-hv-polo-01',
          name: 'Hi-Vis Polo',
          slug: 'hi-vis-polo',
          description:
            'Hi-vis rated polo for customer-facing site and branch staff. Performance fabric with contrast reflective tape. Presents well in front of customers while meeting site requirements.',
          image: '/edge-city/syzmik-hi-vis-zt867-front.png',
          categoryId: 'safety-hi-vis',
          sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
          colours: [
            { name: 'Orange / Navy', hex: '#FF5C00' },
            { name: 'Yellow / Navy', hex: '#FFD100' },
          ],
          decorationMethod: 'Embroidery — left chest logo',
          leadWeeks: [3, 5],
          priceCents: 5800,
          requiresStaffName: false,
        },
      ],
    },

    {
      id: 'branch-kits',
      slug: 'branch-kits',
      name: 'Branch Kits',
      description:
        'Pre-built kits for new branch openings and branch refreshes. Everything needed to dress a new location consistently from day one.',
      image: '/edge-city/placeholder.png',
      products: [
        {
          id: 'hp-branch-kit-01',
          name: 'New Branch Opening Kit',
          slug: 'branch-opening-kit',
          description:
            'A curated starter kit for a new Hirepool branch opening. Includes branded polo (×4), staff tee (×4), hi-vis vest (×6), and branded cap (×4) — pre-decorated with Hirepool branding and ready to unbox. Quantity and styles are customisable per branch headcount.',
          image: '/edge-city/placeholder.png',
          categoryId: 'branch-kits',
          sizes: ['Kit — sizes specified at order'],
          colours: [{ name: 'Hirepool standard', hex: '#F4611C' }],
          decorationMethod: 'Per-item decoration as specified in kit',
          leadWeeks: [5, 7],
          priceCents: 18500,
          requiresStaffName: false,
          sku: 'HP-KIT-BRANCH-01',
        },
        {
          id: 'hp-counter-kit-01',
          name: 'Counter Essentials Kit',
          slug: 'counter-essentials-kit',
          description:
            'Smaller kit designed for counter and customer-facing staff at existing branches. Includes branded polo (×2), staff tee (×2), and cap (×2). Ideal for top-ups when new staff join or existing kit wears out.',
          image: '/edge-city/placeholder.png',
          categoryId: 'branch-kits',
          sizes: ['Kit — sizes specified at order'],
          colours: [{ name: 'Hirepool standard', hex: '#F4611C' }],
          decorationMethod: 'Per-item decoration as specified in kit',
          leadWeeks: [4, 6],
          priceCents: 14000,
          requiresStaffName: false,
          sku: 'HP-KIT-COUNTER-01',
        },
      ],
    },

    {
      id: 'trade-packs',
      slug: 'trade-packs',
      name: 'Trade Packs',
      description:
        'Branded merchandise packs for trade account customers, contractors, and key accounts. Keeps Hirepool front of mind on the job.',
      image: '/edge-city/placeholder.png',
      products: [
        {
          id: 'hp-trade-pack-01',
          name: 'Trade Account Welcome Pack',
          slug: 'trade-welcome-pack',
          description:
            'A curated branded pack for new or high-value trade account customers. Includes a branded tee, cap, and insulated bottle — items that get used on-site and keep Hirepool visible beyond the transaction. Packaged in a branded cotton tote.',
          image: '/edge-city/placeholder.png',
          categoryId: 'trade-packs',
          sizes: ['One size (tee sizing captured at fulfilment)'],
          colours: [{ name: 'Hirepool orange', hex: '#F4611C' }],
          decorationMethod: 'Screen-print (tee) · Embroidery (cap) · Laser-etch (bottle)',
          leadWeeks: [4, 6],
          priceCents: 8500,
          requiresStaffName: false,
          sku: 'HP-PACK-TRADE-01',
        },
        {
          id: 'hp-contractor-pack-01',
          name: 'Contractor Pack',
          slug: 'contractor-pack',
          description:
            'A safety-oriented branded pack for contractors working on or around Hirepool equipment. Includes a hi-vis vest (Hirepool-branded back), cap, and branded notebook. Reinforces safe-use messaging while putting Hirepool branding on-site.',
          image: '/edge-city/placeholder.png',
          categoryId: 'trade-packs',
          sizes: ['One size (vest sizing S–5XL, specified at order)'],
          colours: [{ name: 'Safety orange', hex: '#FF5C00' }],
          decorationMethod: 'Screen-print (vest) · Embroidery (cap) · Deboss (notebook)',
          leadWeeks: [4, 6],
          priceCents: 7200,
          requiresStaffName: false,
          sku: 'HP-PACK-CONTRACTOR-01',
        },
      ],
    },

    {
      id: 'event-campaign',
      slug: 'event-campaign',
      name: 'Event & Campaign',
      description:
        'Branded items for trade days, safety campaigns, sponsorships, and seasonal pushes. Flexible formats for short-run and repeat requirements.',
      image: '/edge-city/as-colour-1174-hero.png',
      products: [
        {
          id: 'hp-event-tee-01',
          name: 'Event Tee',
          slug: 'event-tee',
          description:
            'A campaign-specific tee for trade days, expos, and activation events. Heavier-weight than a standard promo shirt — people keep it. Available in quick turnaround from approved Hirepool artwork.',
          image: '/edge-city/as-colour-1174-hero.png',
          images: [
            '/edge-city/as-colour-1174-black.png',
            '/edge-city/as-colour-1174-navy.png',
          ],
          categoryId: 'event-campaign',
          sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
          colours: [
            { name: 'Black', hex: '#111111' },
            { name: 'Navy', hex: '#1B2B4B' },
            { name: 'Orange', hex: '#F4611C' },
          ],
          decorationMethod: 'Screen-print or DTF — front and/or back',
          leadWeeks: [2, 4],
          priceCents: 3800,
          requiresStaffName: false,
        },
        {
          id: 'hp-campaign-pack-01',
          name: 'Safety Campaign Pack',
          slug: 'safety-campaign-pack',
          description:
            'A bundled safety campaign pack for seasonal or compliance-driven pushes. Configurable contents — typically a hi-vis vest, printed tote, and campaign-specific notebook or printed card. Minimum 50 packs. Easily reordered with updated artwork each season.',
          image: '/edge-city/placeholder.png',
          categoryId: 'event-campaign',
          sizes: ['One size pack'],
          colours: [{ name: 'Campaign-specific', hex: '#F4611C' }],
          decorationMethod: 'Per-item — screen-print, pad-print, or laser-etch',
          leadWeeks: [4, 6],
          priceCents: 9500,
          requiresStaffName: false,
          sku: 'HP-PACK-CAMPAIGN-01',
        },
      ],
    },
  ],

  featuredCollections: [
    {
      id: 'branch-essentials',
      title: 'Branch Essentials',
      subtitle: 'The core uniform set for every branch — polo, tee, hi-vis, and cap.',
      categorySlug: 'staff-apparel',
      productIds: ['hp-polo-01', 'hp-tee-01', 'hp-hv-vest-01', 'hp-cap-01'],
    },
    {
      id: 'safety-programme',
      title: 'Safety Programme',
      subtitle: 'Hi-vis rated apparel for site, yard, and compliance-required roles.',
      categorySlug: 'safety-hi-vis',
      productIds: ['hp-hv-vest-01', 'hp-hv-shirt-01', 'hp-hv-polo-01'],
    },
    {
      id: 'trade-and-customer',
      title: 'Trade & Customer',
      subtitle: 'Branded packs for trade account customers and key contractors.',
      categorySlug: 'trade-packs',
      productIds: ['hp-trade-pack-01', 'hp-contractor-pack-01'],
    },
  ],

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
