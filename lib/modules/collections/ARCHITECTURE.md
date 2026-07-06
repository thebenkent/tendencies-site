# Collections CMS — Architecture

Phase 8 reference implementation. Every future CMS module should follow this pattern.

---

## File map

```
lib/modules/collections/
├── events.ts           COLLECTION_EVENTS constants (audit event names)
├── repository.ts       All DB queries (Supabase). Never imported from React.
├── service.ts          Business logic: validation, lifecycle transitions
├── admin-service.ts    DTO preparation, event dispatch, bulk ops
├── validators.ts       ValidatorContribution[] for the runtime extension system
├── relationships.tsx   RelationshipDefinition<CollectionProductRow> for the Products tab
├── search-provider.ts  SearchProvider registered in the global command palette
├── widgets.ts          WidgetDefinition[] for the admin dashboard
├── metrics.ts          MetricDefinition[] for the metrics panel
├── commands.ts         CommandContribution[] for the command palette
├── importer.ts         CSV importer + exporter stubs
├── definition.tsx      EntityDefinition<CollectionAdminData> — the central config
├── setup.ts            Runtime registrations (search, metrics, widgets, import/export)
└── ARCHITECTURE.md     This file
```

The CMS page lives at:
```
app/merch/[slug]/admin/(app)/collections/page.tsx
```

---

## Data flow

```
Browser
  └─ CRUDPage (client) ──── composed extensions (validation, toolbar, commands)
       │
       │  'use server' callbacks
       ▼
  page.tsx (server component)
       │
       ▼
  admin-service.ts ──── DTO: CollectionAdminData
       │
       ├── dispatch(AdminEvents.X, tenantId, payload)  → eventBus → audit log
       │
       └── repository.ts ──── Supabase (merch_collections, merch_collection_products)
```

---

## EntityDefinition structure

```
collectionDefinition
├── columns: 7 columns (name/slug, status, campaign, product_count, visible, featured, updated_at)
├── defaultSort: updated_at desc
├── searchable: true (name, slug, description, campaign_name)
├── filters: status, visibility, featured
├── permissions: COLLECTIONS_CREATE/UPDATE/DELETE
├── editorTabs: General, Media, SEO, Display, Scheduling
├── relationships: [collectionProductsRelationship]  → "Products" editor tab
└── extensions:
    ├── validationExtension(collectionValidators, priority=5)
    ├── toolbarExtension([Publish, Archive, Duplicate], priority=30)
    └── commandExtension(collectionCommands, priority=40)
```

---

## Runtime extension wiring

```
useExtensionComposer(collectionDefinition)
  ├── editorTabs     ← General, Media, SEO, Display, Scheduling + Products (relationship)
  ├── toolbarActions ← Publish, Archive, Duplicate
  ├── validators     ← nameRequired, slugFormat, dateRange, heroImagePresent, atLeastOneProduct
  ├── relationships  ← collectionProductsRelationship
  └── commands       ← publish, archive, duplicate
```

All lifecycle mutation (Publish, Archive, Duplicate) goes through `admin-service.ts` server actions,
not directly from the toolbar action `onClick`. The toolbar action calls the server action and the
page re-validates/re-renders normally.

---

## Validation

Five validators in `validators.ts`:

| Rule | Severity | Mode |
|---|---|---|
| name required | error | create + update |
| slug format (`/^[a-z0-9-]+$/`) | error | create + update |
| date range (publish_at < archive_at) | error | create + update |
| hero image present | warning | update |
| at least one product (published collections) | warning | update |

Errors block save. Warnings show in `ValidationSummary` but allow save to proceed.

---

## Products relationship

`merch_collection_products` junction table: many-to-many, `sort_order`, `featured` metadata.

Product search is scoped to the parent collection's campaign:
```
RelationManager.handleSearch(query)
  → searchCollectionProducts(query, tenantId, excludeIds, parentId)
    → findCollectionCampaignId(parentId)
      → findAttachableProducts(campaignId, query, excludeIds)
```

`parentId` was added to `SearchRelationFn` as an optional fourth parameter (backward-compatible).

---

## Lifecycle

Uses `STANDARD_LIFECYCLE_POLICY` from `lib/admin/lifecycle.ts`.

Valid transitions:
- `draft → review → published → archived`
- `draft → published` (shortcut)
- `published → hidden`, `published → archived`
- `archived` is terminal

`transitionCollectionStatus` sets `published_at` / `archived_at` timestamps and dispatches the appropriate event.

---

## Campaign enrichment

The CMS page enriches `collectionDefinition` at request time by injecting live campaign options
into the `campaignId` field (converting it from `text` to `select`):

```typescript
const enrichedDefinition = {
  ...collectionDefinition,
  editorTabs: collectionDefinition.editorTabs?.map((tab) =>
    tab.key === 'general'
      ? { ...tab, fields: tab.fields?.map(f => f.key === 'campaignId' ? { ...f, component: 'select', options: campaignOptions } : f) }
      : tab,
  ),
}
```

This pattern is reusable for any field that needs server-side options without bespoke UI.

---

## Setup registrations

`setup.ts` is imported for side-effects from `lib/admin/registry/setup.ts`:

- `registerSearchProvider(collectionSearchProvider)` — command palette search
- `registerMetric(...)` × 4 — total, published, draft, archived + avg products
- `registerWidget(...)` × 3 — dashboard cards
- `registerImporter(collectionCsvImporter)` — CSV import UI
- `registerExporter(collectionCsvExporter)` — CSV download

Entity registration happens in `registry/setup.ts`:
```typescript
registerEntity({ key: 'collections', definition: collectionDefinition, basePath: 'collections', ... })
```

---

## Adding a new CMS module

1. Copy this module's file structure
2. Write `repository.ts` (Supabase queries only)
3. Write `service.ts` (business rules, lifecycle)
4. Write `admin-service.ts` (DTO, event dispatch)
5. Write `validators.ts`, `relationships.tsx`, `search-provider.ts`
6. Write `definition.tsx` (wire everything together)
7. Write `setup.ts` (register search/metrics/widgets/import-export)
8. Add page at `app/merch/[slug]/admin/(app)/<module>/page.tsx`
9. Register entity in `lib/admin/registry/setup.ts`
10. Add to navigation in `lib/admin/registry/setup.ts`

No new runtime infrastructure should be needed — the runtime is complete.
