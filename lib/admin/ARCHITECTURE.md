# Admin Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ADMIN PLATFORM LAYERS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PLUGIN LAYER  (lib/admin/plugins.ts)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  registerEntity()  registerModule()  registerSearchProvider()       │   │
│  │  registerWidget()  registerMetric()  registerSettingsGroup()        │   │
│  │  registerImporter() registerExporter() registerJob()                │   │
│  │  registerWorkflowAdapter() registerAutomation()                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  REGISTRY LAYER  (lib/admin/registry/)                                      │
│  ┌──────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐             │
│  │ EntityRegistry│ │SearchRegist│ │WidgetRegist│ │MetricsReg │             │
│  │  modules       │ │  providers │ │  location  │ │ category  │             │
│  │  entities      │ │  search()  │ │  priority  │ │ load()    │             │
│  │  navByGroup()  │ │  navItems()│ │            │ │           │             │
│  └──────────────┘ └────────────┘ └────────────┘ └───────────┘             │
│  ┌──────────────────────────────┐                                           │
│  │       SettingsRegistry       │                                           │
│  │  groups, component, priority │                                           │
│  └──────────────────────────────┘                                           │
│                                    │                                        │
│  ENTITY DEFINITION LAYER  (lib/admin/definitions.ts)                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  EntityDefinition<T>                                                │   │
│  │    columns[]  filters[]  editorTabs[]  permissions{}               │   │
│  │    searchConfig  emptyState  extraActions[]                         │   │
│  │                                                                     │   │
│  │  FieldSchema (discriminated union — 12 variants)                    │   │
│  │    text | textarea | number | select | radio | checkbox | toggle    │   │
│  │    date | datetime | colour | slug | image | repeater               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  CRUD RUNTIME  (components/admin/crud/)                                     │
│  ┌────────────────────┐  ┌──────────────────────────────────────────┐      │
│  │  CRUDPage          │  │  AdminTable                              │      │
│  │  EntityDefinition→ │  │  columns, sort, select, row actions      │      │
│  │  table + editor    │  │  loading skeletons, sticky header        │      │
│  └────────────────────┘  └──────────────────────────────────────────┘      │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  FieldRenderer — switches on FieldSchema.component                 │    │
│  │  Wires form.data[key], form.errors[key], form.set(key, v)         │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  FORM & EDITOR RUNTIME  (lib/admin/form.ts, lib/admin/autosave.ts)         │
│  ┌──────────────────────┐  ┌──────────────────────────────────────────┐   │
│  │  useAdminForm<T>     │  │  useAutosave<T>                          │   │
│  │  dirty tracking      │  │  idle → pending → saving → saved/error   │   │
│  │  field-level errors  │  │  debounce, conflict detection            │   │
│  │  reset on row change │  │  saveNow() override                      │   │
│  └──────────────────────┘  └──────────────────────────────────────────┘   │
│                                    │                                        │
│  PERMISSIONS LAYER  (lib/admin/permissions.ts, components/admin/Can.tsx)   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Permission constants → ROLE_PERMISSIONS map (owner=ALL)            │   │
│  │  <Can permission="campaigns.publish"> — fail-closed gate            │   │
│  │  useHasPermission(), useHasAnyPermission()                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  LIFECYCLE & REVISIONS  (lib/admin/lifecycle.ts, lib/admin/revisions.ts)   │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐   │
│  │  LifecycleStatus             │  │  EntityRevision<T>               │   │
│  │  draft → review → published │  │  before, after, changedKeys      │   │
│  │  archived, hidden, scheduled │  │  diffEntities(), formatRevision  │   │
│  │  LifecyclePolicy             │  │  RevisionsRepository<T>          │   │
│  │  STANDARD_LIFECYCLE_POLICY  │  │  getRevisions, restoreRevision   │   │
│  └──────────────────────────────┘  └──────────────────────────────────┘   │
│                                    │                                        │
│  WORKFLOWS  (lib/admin/workflows.ts)                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  WorkflowAdapter<Entity>                                            │   │
│  │    states[]  transitions[]  getCurrentState()  applyTransition()   │   │
│  │    availableTransitions() — entity + role aware                     │   │
│  │  WorkflowRegistry — registerWorkflowAdapter()                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  EVENTS & AUDIT  (lib/core/events.ts, lib/admin/dispatcher.ts)             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  AdminService → dispatch(AdminEvents.X, payload)                   │   │
│  │    → eventBus.emit()                                                │   │
│  │      → auditSubscriber    writes merch_activity_log                │   │
│  │      → (future) notificationSubscriber                             │   │
│  │      → (future) webhookSubscriber                                  │   │
│  │      → (future) automationSubscriber                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  DOMAIN MODULE LAYER  (lib/modules/{entity}/)                               │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │  repository.ts   — DB queries only, no business logic            │      │
│  │  types.ts        — DTOs, TableRow, EditorData, mappers           │      │
│  │  admin-service.ts — prepares DTOs, dispatches events             │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                    │                                        │
│  FEATURE FLAGS  (lib/admin/feature-flags.ts)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  FeatureFlags constants (PRODUCT_BUNDLES, AUTOSAVE, etc.)           │   │
│  │  FeatureFlagRegistry — defaults, per-tenant overrides, resolver    │   │
│  │  isFeatureEnabled(flag, {tenantId, userId, role, env})             │   │
│  │  Pluggable: setResolver() accepts DB-backed or external provider   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  IMPORT / EXPORT  (lib/admin/importexport.ts)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Importer<Row>:  parse → validate → preview → import → rollback    │   │
│  │  Exporter<Row>:  extract → serialise → deliver                     │   │
│  │  ImportExportRegistry — registerImporter(), registerExporter()     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  BACKGROUND JOBS  (lib/admin/jobs.ts)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  JobDefinition<I,O>: type, label, validate, run                    │   │
│  │  JobContext: progress(), log(), signal (AbortSignal)               │   │
│  │  JobRegistry — registerJob()                                       │   │
│  │  enqueueJob() — delegated to setJobRunner() implementation         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  STORAGE / MEDIA  (lib/admin/media.ts, components/admin/media/)             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  MediaAsset: {id, url, alt, width, height, mime, size, focalPoint} │   │
│  │  MediaPicker — returns MediaAsset | null                           │   │
│  │  urlToAsset(), assetToUrl() helpers                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

DATA FLOW: User Action
  ↓ CRUDPage (EntityDefinition)
  ↓ useAdminForm / useAutosave
  ↓ AdminService.update()
    ↓ Repository (DB write via Supabase)
    ↓ dispatch(AdminEvents.X)
      ↓ auditSubscriber → merch_activity_log
      ↓ eventBus → future: notifications / webhooks / automations

NAVIGATION FLOW:
  lib/admin/registry/setup.ts → registerModule() → EntityRegistry
  lib/admin/entities/*.ts      → registerEntity() → EntityRegistry  (Phase 7B)
  AdminShell → entityRegistry.navByGroup() → renders sidebar

SEARCH FLOW:
  User types → CommandPalette → debounce 200ms
  → searchRegistry.search(query, slug)
    → all registered SearchProviders in parallel
    → merge results by group
    → render grouped list

SETTINGS FLOW:
  Integration/module → registerSettingsGroup() → SettingsRegistry
  /admin/settings page → settingsRegistry.all() → renders sections

PHASE MAP:
  7A   — CRUD runtime, form, table, toast, command palette, permissions, events, audit
  7A.5 — Domain architecture (modules/), entity definitions, schema-driven editors
  7A.75— Registry layer, lifecycle, revisions, autosave, jobs, import/export,
         workflows, feature flags, plugins, registry-driven nav + search
  7B   — Campaign CMS, Collection CMS, Product CMS, Bundle CMS, Asset Library
```
