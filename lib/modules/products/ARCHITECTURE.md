# Products CMS — Architecture

Phase 9 reference implementation for complex business entities.
Demonstrates every part of the runtime with richer merchandising requirements than Collections.

---

## File map

```
lib/modules/products/
├── events.ts           PRODUCT_EVENTS constants (audit event names)
├── repository.ts       All DB queries. Lower half (line ~250+) = CMS admin queries.
│                       Upper half = unchanged storefront queries from pre-Phase 9.
├── service.ts          Business logic: validation, lifecycle transitions
├── admin-service.ts    Unified ProductAdminData DTO, CRUD, event dispatch, bulk ops
│                       + relationship callbacks (variants, branding)
├── validators.ts       ValidatorContribution[] (4 errors + 4 warnings)
├── relationships.tsx   productVariantsRelationship, productBrandingRelationship
├── search-provider.ts  SearchProvider (name, SKU, slug, supplier SKU)
├── widgets.ts          3 DashboardWidget entries (Published, Draft, Missing Images)
├── metrics.ts          4 MetricDefinition entries (avg price, active, draft, no-variants)
├── commands.ts         5 CommandContribution entries (lifecycle + add variant + add branding)
├── importer.ts         CSV importer + exporter stubs
├── definition.tsx      EntityDefinition<ProductAdminData> — the central config
├── setup.ts            Side-effect registrations (search, metrics, widgets, import/export)
└── ARCHITECTURE.md     This file
```

The CMS page lives at:
```
app/merch/[slug]/admin/(app)/products/page.tsx
```

---

## Data model

The Products CMS uses existing tables from migrations 001–010, plus new columns
added in migration 014:

### Primary table: merch_campaign_products

Existing:
- `name`, `slug`, `description`, `price_cents`, `minimum_qty`, `lead_time_days`
- `embroidery_available`, `embroidery_notes`, `sizing_notes`
- `sort_order`, `active`, `collection_id`

Added in Phase 9 (014_products_cms.sql):
- `lifecycle_status` — 'draft'|'review'|'published'|'archived'|'hidden'|'scheduled'
- `sku`, `cost_cents`, `currency`, `supplier_sku`
- `seo_title`, `seo_description`, `tags`, `featured`
- `publish_at`, `archive_at`, `published_at`, `archived_at`
- `updated_at` (with trigger)

### Relationship tables (pre-existing)

- `merch_product_variants` — size/colour/fit matrix
- `merch_product_images` — gallery images
- `merch_product_personalisation` — custom checkout fields
- `merch_size_charts` — fit-specific size guides
- `merch_product_badges` — promotional labels
- `merch_product_content` — rich content sections
- `merch_product_related` — cross-sell/upsell

### New in Phase 9

- `merch_product_branding` — branding methods (screen print, embroidery, etc.)

---

## EntityDefinition structure

```
productDefinition
├── columns: 9 columns (thumbnail, name/sku, status, campaign, price, moq, variants, lead time, updated)
├── defaultSort: updated_at desc
├── searchable: true (name, slug, sku, supplier_sku, campaign_name)
├── filters: status, active, featured
├── permissions: PRODUCTS_CREATE/UPDATE/DELETE/PUBLISH/ARCHIVE
├── editorTabs: General, Pricing, Operations, Media, SEO, Display, Scheduling
├── relationships: [productVariantsRelationship, productBrandingRelationship]
└── extensions:
    ├── validationExtension(productValidators, priority=5)
    ├── toolbarExtension([Publish, Archive, Duplicate, Add Variant, Add Branding], priority=30)
    └── commandExtension(productCommands, priority=40)
```

---

## Inline child relationships (Variants & Branding)

Variants and Branding are **inline child records** — they belong exclusively to one product
and cannot be shared. This is different from the Collections→Products many-to-many.

The RelationshipDefinition handles them with:

```typescript
attachable: false   // no search picker
detachable: true    // row can be removed (deletes the child record)
sortable:   true    // drag to reorder
metadataFields: [...]  // all child fields editable via metadata editor
```

Adding new records is handled by toolbar actions ("Add Variant", "Add Branding") that call
`attachProductVariant` / `attachProductBranding` server actions, which create blank records
in the DB. The user then edits them via the metadata editor.

This is the canonical pattern for inline children in the Tendencies runtime.

---

## Validation

8 validators in `validators.ts`:

| Rule | Severity | Mode |
|---|---|---|
| name required | error | always |
| slug format | error | always |
| price non-negative | error | always |
| date range (publish < archive) | error | always |
| no images | warning | update |
| no variants | warning | update |
| no collection | warning | update |
| missing SEO title | warning | update |

---

## Campaign enrichment pattern

The CMS page injects live campaign options at request time:

```typescript
const enrichedDefinition = {
  ...productDefinition,
  editorTabs: productDefinition.editorTabs?.map(tab =>
    tab.key === 'general'
      ? { ...tab, fields: tab.fields?.map(f =>
          f.key === 'campaignId'
            ? { ...f, component: 'select', options: campaignOptions }
            : f
        )}
      : tab
  )
}
```

This avoids a bespoke campaign picker component. Documented in Collections ARCHITECTURE.md.

---

## Extending this module

Future enhancements that fit within the existing runtime:

1. **Personalisation** — add `productPersonalisationRelationship` in `relationships.tsx`
2. **Size Charts** — add `productSizeChartRelationship`
3. **Rich Content** — add `productContentRelationship`
4. **Related Products** — true M:M via `merch_product_related`, using search+attach flow
5. **Price Breaks** — add `price_breaks jsonb` to `merch_campaign_products`
6. **Supplier select** — enrich definition at page level (same as campaign options pattern)

None of these require new runtime infrastructure.

---

## Adding a new business module

Products is the canonical reference. The pattern:

1. Check what DB tables already exist for the entity
2. Run a migration to add CMS fields (lifecycle_status, seo_*, tags, etc.)
3. Write `repository.ts` — extend existing, don't replace
4. Write `service.ts` — business rules only
5. Write `admin-service.ts` — unified DTO, mutations, relationship callbacks
6. Write `validators.ts`, `relationships.tsx`, `search-provider.ts`
7. Write `definition.tsx` — wire everything together
8. Write `setup.ts`, `widgets.ts`, `metrics.ts`, `commands.ts`, `importer.ts`
9. Add page at `app/merch/[slug]/admin/(app)/<entity>/page.tsx`
10. Register entity + import setup in `lib/admin/registry/setup.ts`
