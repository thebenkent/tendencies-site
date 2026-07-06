# Runtime Extension Framework

The Extension Framework makes capabilities first-class runtime citizens. Instead of growing `EntityDefinition` with new top-level properties, every future capability contributes through a `RuntimeExtension`.

## Architecture

```
EntityDefinition.extensions[]
        │
        ▼
 useExtensionComposer
        │
        ├── extensionRegistry.getForEntity(entityKey)   ← plugin-contributed
        │
        ▼
  ComposedExtensions
        │
        ├── editorTabs       → CRUDEditor tabs (after schema + relationship tabs)
        ├── toolbarActions   → CRUDEditor footer buttons
        ├── validators       → run in handleSave() before persist
        ├── detailPanels     → right-hand inspector panel (toggle in header)
        ├── relationships    → RelationManager tabs (same as definition.relationships)
        ├── rowActions       → table row action menu
        ├── widgets          → dashboard
        ├── metrics          → analytics
        ├── activityPanels   → activity log sections
        └── commands         → command palette (entity-context)
```

## Quick Start

### Inline (in the entity definition file)

```typescript
import {
  relationshipExtension,
  validationExtension,
  toolbarExtension,
  metricsExtension,
} from '@/lib/admin/extensions'

export const campaignDefinition: EntityDefinition<CampaignAdminData> = {
  name: 'Campaign',
  namePlural: 'Campaigns',
  // ...
  extensions: [
    relationshipExtension(collectionsRelationship, { priority: 10 }),
    relationshipExtension(productsRelationship,    { priority: 20 }),

    validationExtension([
      {
        id: 'campaign:date-range',
        label: 'Date range validator',
        validate: async (data) => {
          if (data.opens_at && data.closes_at && data.opens_at >= data.closes_at) {
            return [{ field: 'closes_at', message: 'Must be after opens at', severity: 'error' }]
          }
          return []
        },
      },
    ]),

    metricsExtension([
      {
        id: 'campaign:order-count',
        label: 'Orders',
        format: 'number',
        load: async (tenantId) => ({ current: await getCampaignOrderCount(tenantId) }),
      },
    ]),
  ],
}
```

### Plugin (without modifying the definition file)

```typescript
// In your plugin's setup file (registered alongside entity setup):
import { registerExtension } from '@/lib/admin/plugins'

registerExtension({
  id:       'seo:campaigns',
  entity:   'campaigns',   // targets Campaigns editor; omit for all entities
  priority: 80,
  contributes: {
    editorTabs: [
      {
        key:     'seo',
        label:   'SEO',
        order:   90,
        content: (form) => <SeoMetaEditor form={form} />,
      },
    ],
    validators: [
      {
        id:       'seo:campaigns:meta-length',
        label:    'SEO meta length check',
        validate: async (data) => {
          if (data.meta_title && String(data.meta_title).length > 60) {
            return [{ field: 'meta_title', message: 'Keep under 60 chars for best results', severity: 'warning' }]
          }
          return []
        },
      },
    ],
  },
})
```

## RuntimeExtension type

```typescript
type RuntimeExtension = {
  id:          string              // unique, stable e.g. 'relationship:collections'
  entity?:     string              // entity key (namePlural.toLowerCase()); omit for global
  priority:    number              // lower = earlier. Ranges: 0-19 core, 20-49 primary, 50-99 secondary, 100+ plugins
  featureFlag?: string             // gated by this flag if provided
  contributes: ExtensionContributions
}
```

## Contribution types

| Key               | Type                         | Where rendered                                    |
|-------------------|------------------------------|---------------------------------------------------|
| `editorTabs`      | `EditorTabContribution[]`    | CRUDEditor tab bar (after schema + rel tabs)      |
| `toolbarActions`  | `ToolbarActionContribution[]`| CRUDEditor footer (between Delete and Cancel)     |
| `rowActions`      | `RowActionContribution[]`    | AdminTable row actions menu                       |
| `widgets`         | `WidgetContribution[]`       | Dashboard (via WidgetRegistry)                    |
| `metrics`         | `MetricContribution[]`       | Analytics dashboard                               |
| `validators`      | `ValidatorContribution[]`    | Run in handleSave(); errors block persist         |
| `activityPanels`  | `ActivityPanelContribution[]`| Activity log side panel                           |
| `detailPanels`    | `DetailPanelContribution[]`  | CRUDEditor right-hand inspector (toggle in header)|
| `commands`        | `CommandContribution[]`      | Command palette (entity-context)                  |
| `relationships`   | `RelationshipDefinition[]`   | CRUDEditor tab per relationship                   |

## Priority conventions

| Range  | Description                                           |
|--------|-------------------------------------------------------|
| 0–19   | Core runtime (relationships, workflow, lifecycle)     |
| 20–49  | Primary module tabs (general, content, ordering)      |
| 50–79  | Secondary tabs (analytics, SEO, attributes, settings) |
| 80–99  | Inspector / detail panels                             |
| 100+   | Third-party plugin contributions                      |

## Validators

Validators run before every save. The mode (`'create'` or `'update'`) is passed so validators can target one operation:

```typescript
{
  id:   'campaign:slug-unique',
  label: 'Slug uniqueness',
  when: 'create',     // only on create; omit for 'always'
  validate: async (data, tenantId) => {
    const exists = await checkSlugExists(String(data.slug), tenantId)
    return exists
      ? [{ field: 'slug', message: 'Slug already taken', severity: 'error' }]
      : []
  },
}
```

- `severity: 'error'` — blocks save, shown prominently
- `severity: 'warning'` — informational, save proceeds normally
- `field` — maps the issue to a specific form field (sets `form.errors[field]`)

## Detail panels

The detail panel is an overlay sidebar within the editor, toggled by the `PanelRight` info button in the editor header. It appears only when at least one `DetailPanelContribution` is active.

Each section receives `(form, tenantId)` and can display metadata, computed values, history, or related data from external services.

Multiple sections are navigated via pill tabs within the panel.

## Factory functions

All factories are in `lib/admin/extensions/built-ins.ts`:

| Factory               | Creates extension contributing...  |
|-----------------------|------------------------------------|
| `relationshipExtension` | `relationships`                  |
| `validationExtension`   | `validators`                     |
| `metricsExtension`      | `metrics`                        |
| `toolbarExtension`      | `toolbarActions`                 |
| `tabExtension`          | `editorTabs`                     |
| `detailPanelExtension`  | `detailPanels`                   |
| `activityExtension`     | `activityPanels`                 |
| `commandExtension`      | `commands`                       |
| `widgetExtension`       | `widgets`                        |

## Backwards compatibility

- `EntityDefinition.relationships[]` and `EntityDefinition.editorTabs[]` continue to work exactly as before
- `registerRelationship(entityKey, def)` continues to work exactly as before
- `CRUDEditor` accepts all new props as optional — existing call sites are unaffected
- Zero breaking changes to Campaign CMS or any existing module
