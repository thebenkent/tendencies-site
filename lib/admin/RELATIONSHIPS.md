# Relationship Framework

Generic, configuration-driven attach/detach/reorder UI for every CMS module.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RelationshipDefinition<Child>                        │
│  entity · relation · label · attachable · sortable · columns · permissions  │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ drives everything
                    ┌──────────────▼──────────────┐
                    │        RelationManager        │
                    │  owns: items, selection,      │
                    │  picker state, metadata state  │
                    └──┬──────────┬────────┬───────┘
                       │          │        │
              ┌────────▼──┐  ┌───▼───┐  ┌─▼──────────────┐
              │RelationTable│  │Relation│  │  RelationPicker │
              │(table mode) │  │Card    │  │ (SlideOver     │
              │             │  │(card   │  │  modal)        │
              │useRelation  │  │ mode)  │  │  search + multi │
              │Order (DnD)  │  │        │  │  select + attach│
              └─────────────┘  └────────┘  └────────────────┘
                       │
              ┌────────▼──────┐
              │RelationToolbar │
              │search + attach │
              │+ bulk detach   │
              └────────────────┘

Server layer:
  Admin Service → lib/admin/relationships/helpers.ts
    → executeAttach / executeDetach / executeReorder / executeBulkDetach
      → dispatch(AdminEvents.RELATION_ATTACHED, …)
        → eventBus → auditSubscriber → merch_activity_log
```

## File Map

```
lib/admin/relationships/
  definition.ts   RelationshipDefinition type + callback types
  helpers.ts      Server-side executeAttach/Detach/Reorder
  index.ts        Barrel export

components/admin/relationships/
  RelationManager.tsx       Main component (orchestrator)
  RelationTable.tsx         Table layout with DnD rows
  RelationCard.tsx          Card layout for visual entities
  RelationPicker.tsx        Attach modal with search + multi-select
  RelationToolbar.tsx       Search + Attach button + Bulk detach
  RelationEmptyState.tsx    Empty state with optional Attach CTA
  RelationOrder.tsx         useRelationOrder hook (HTML5 DnD)
```

## RelationshipDefinition

```typescript
const collectionRelationship: RelationshipDefinition<CollectionRow> = {
  // Required
  entity:        collectionDefinition,   // EntityDefinition<CollectionRow>
  relation:      'collections',          // DB/URL key
  label:         'Collections',          // plural display
  labelSingular: 'Collection',           // singular display

  // Operations
  attachable: true,    // show Attach button
  detachable: true,    // show Remove action
  sortable:   true,    // drag-and-drop reorder
  sortKey:    'sort_order',  // field that stores the order

  // Layout ('table' | 'card')
  layout: 'table',

  // Columns — defaults to entity.columns; override to show a subset
  columns: [nameColumn, statusColumn, productCountColumn],

  // Junction metadata fields (renders in a metadata editor SlideOver)
  metadataFields: [
    { key: 'featured', component: 'toggle', label: 'Featured' },
    { key: 'sort_override', component: 'number', label: 'Sort override' },
  ],
  getMetadata: (row) => ({ featured: row.featured, sort_override: row.sort_override }),

  // Permissions — if omitted, all operations are permitted
  permissions: {
    attach:   Permissions.COLLECTIONS_CREATE,
    detach:   Permissions.COLLECTIONS_DELETE,
    reorder:  Permissions.COLLECTIONS_REORDER,
  },

  // Override default generic events
  events: {
    attached:  AdminEvents.COLLECTION_ATTACHED,  // (add to dispatcher if needed)
    detached:  AdminEvents.COLLECTION_DETACHED,
    reordered: AdminEvents.COLLECTION_REORDERED,
  },

  // Empty state
  emptyTitle:       'No collections',
  emptyDescription: 'Attach collections to this campaign.',

  // Picker
  pickerTitle:             'Attach Collection',
  pickerSearchPlaceholder: 'Search collections…',
}
```

## Using RelationManager in an Editor Tab

```typescript
// In an EntityDefinition editorTabs:
{
  key:   'collections',
  label: 'Collections',
  content: (form) => {
    const id       = form.data['id'] as string
    const tenantId = form.data['tenantId'] as string
    return (
      <RelationManager
        parentId={id}
        tenantId={tenantId}
        definition={collectionRelationship}
        onFetch={getCampaignCollectionsAction}
        onSearch={searchCollectionsAction}
        onAttach={attachCollectionAction}
        onDetach={detachCollectionAction}
        onReorder={reorderCampaignCollectionsAction}
      />
    )
  },
}
```

## Admin Service Pattern

Module admin services wrap the repository + helpers. Components never
touch repositories or dispatch events directly.

```typescript
// lib/modules/campaigns/admin-service.ts

import { executeAttach, executeDetach, executeReorder } from '@/lib/admin/relationships/helpers'
import * as repo from './repository'

export async function attachCollection(
  campaignId:   string,
  collectionIds: string[],
  tenantId:     string,
): Promise<void> {
  await executeAttach({
    tenantId,
    parentId:    campaignId,
    entityType:  'campaign',
    relation:    'collections',
    childIds:    collectionIds,
    doAttach:    (pid, cids, tid) => repo.attachCollections(pid, cids, tid),
  })
}

export async function detachCollection(
  campaignId:   string,
  collectionId: string,
  tenantId:     string,
): Promise<void> {
  await executeDetach({
    tenantId,
    parentId:    campaignId,
    entityType:  'campaign',
    relation:    'collections',
    childId:     collectionId,
    doDetach:    (pid, cid, tid) => repo.detachCollection(pid, cid, tid),
  })
}

export async function reorderCollections(
  campaignId:  string,
  orderedIds:  string[],
  tenantId:    string,
): Promise<void> {
  await executeReorder({
    tenantId,
    parentId:   campaignId,
    entityType: 'campaign',
    relation:   'collections',
    orderedIds,
    doReorder:  (pid, oids, tid) => repo.reorderCollections(pid, oids, tid),
  })
}
```

## Server Actions

Server actions (in `*-actions.ts` files) are thin wrappers around the
admin service. This keeps `'use server'` out of library code.

```typescript
// lib/modules/campaigns/collection-actions.ts
'use server'
import { attachCollection, detachCollection, reorderCollections } from './admin-service'

export async function attachCollectionAction(
  campaignId: string, collectionIds: string[], tenantId: string,
) {
  return attachCollection(campaignId, collectionIds, tenantId)
}
// … detach, reorder, search
```

## Event Flow

```
RelationManager.handleAttach()
  → onAttach(parentId, childIds, tenantId)          ← server action
    → CampaignAdminService.attachCollection()        ← service
      → executeAttach({ doAttach: repo.attachCollections })
        → repo.attachCollections()                   ← DB
        → dispatch(RELATION_ATTACHED, tenantId, …)   ← event
          → auditSubscriber
            → logActivity(action: 'linked', …)       ← audit log
```

## Permission Flow

```
RelationshipDefinition.permissions.attach  →  useHasPermission()
                                           →  canAttach: boolean
                                           →  Attach button rendered only if true
```

If no permissions are defined on the definition, all operations are
permitted (fail-open for unconfigured relationships).

## Drag-and-Drop

Uses the HTML5 native `draggable` API via `useRelationOrder` hook.
No external DnD library.

```
dragStart → record dragIdx
dragOver  → record dragOverIdx + drop indicator
drop      → splice items array → setLocalItems (optimistic)
           → onReorder(newOrderIds)
dragEnd   → clear refs
```

If `onReorder` throws, `fetchItems()` is called to restore server state.

## Metadata Editor

When `definition.metadataFields` is non-empty, each row gets an Edit (✏️)
action. Clicking opens a SlideOver with the fields rendered via `FieldRenderer`.
On save, `onUpdateMetadata(parentId, childId, meta, tenantId)` is called.

```
Row edit action clicked
  → setMetaRow(item)
    → SlideOver opens
      → FieldRenderer renders definition.metadataFields
        → user edits
          → handleSaveMeta()
            → onUpdateMetadata(parentId, childId, formData, tenantId)
              → admin service patches junction table
              → dispatch event
```

## Extension Points

| Point | How |
|---|---|
| Virtual scrolling | Replace `<ul>` in RelationPicker with a windowed list |
| Server-side pagination | Add `onFetchPage` prop; RelationManager uses it instead of `onFetch` |
| Lazy loading | Wrap `onFetch` with IntersectionObserver in a future hook |
| Optimistic updates | Already partially implemented (setItems on detach) |
| Autosave | Pass `onReorder` with debounce wrapper |
| Import/Export | Add bulk import action to RelationToolbar |
| Feature flags | Wrap `attachable` / `sortable` with `isFeatureEnabled()` in the definition |

## Supported Relationship Types

| Type | Example | Configuration |
|---|---|---|
| One-to-many | Campaign → Collections | `attachable: true`, `sortable: true` |
| Many-to-many | Bundle → Products | `attachable: true`, `detachable: true` |
| Ordered | Campaign Banner | `sortable: true`, `sortKey: 'sort_order'` |
| With metadata | Bundle Item (quantity) | `metadataFields: [...]` |
| Media assets | Product → Images | `cardImage: (row) => row.url` |
| View-only | Order → Products | `attachable: false`, `detachable: false` |
