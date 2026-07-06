/**
 * Import/Export Pipeline Framework.
 *
 * Reusable pipeline interfaces for structured data import and export.
 *
 * Import pipeline: parse → validate → preview → import → (rollback on failure)
 * Export pipeline: query → transform → serialise → deliver
 *
 * Concrete implementations (ProductImporter, OrderExporter, etc.)
 * live under each entity's module in Phase 7B+.
 */

// ── Shared ────────────────────────────────────────────────────────────────

export type ValidationError = {
  row?:    number
  field?:  string
  message: string
}

export type ValidationResult = {
  valid:   boolean
  errors:  ValidationError[]
  warnings?: ValidationError[]
}

// ── Import pipeline ───────────────────────────────────────────────────────

/** Importer metadata — registered so the UI can discover available importers. */
export type ImporterDefinition = {
  key:          string        // e.g. "products_csv"
  label:        string
  description?: string
  entity:       string        // "products" | "campaigns" | "orders" | …
  formats:      ('csv' | 'xlsx' | 'json')[]
  templateUrl?: string        // download link for blank template
  maxRowsPreview?: number     // default 20
}

/** The actual importer implementation. */
export type Importer<Row = Record<string, unknown>> = ImporterDefinition & {
  /**
   * Parse raw file buffer into typed rows.
   * Throw on parse failure (bad encoding, wrong format, etc.).
   */
  parse: (file: File | Buffer) => Promise<Row[]>

  /**
   * Validate parsed rows before committing anything.
   * Should not write to DB.
   */
  validate: (rows: Row[], tenantId: string) => Promise<ValidationResult>

  /**
   * Preview: return a sample of the rows after light enrichment
   * (e.g. resolve references to labels). Used to show the user what
   * will be created before they confirm.
   */
  preview: (rows: Row[], tenantId: string) => Promise<ImportPreview<Row>>

  /**
   * Commit all rows. If any row fails, the entire batch should roll back.
   * Return the count of created / updated records.
   */
  import: (rows: Row[], tenantId: string, userId: string) => Promise<ImportResult>

  /**
   * Undo a completed import by jobId. Optional — only supported if the
   * importer tracks imported IDs.
   */
  rollback?: (jobId: string, tenantId: string) => Promise<void>
}

export type ImportPreview<Row> = {
  totalRows:    number
  previewRows:  Row[]           // first N rows (maxRowsPreview)
  summary?:     string          // e.g. "12 products will be created, 3 updated"
  warnings?:    ValidationError[]
}

export type ImportResult = {
  created: number
  updated: number
  skipped: number
  errors:  ValidationError[]
  jobId?:  string              // background job ID if run async
}

// ── Export pipeline ───────────────────────────────────────────────────────

export type ExporterDefinition = {
  key:          string
  label:        string
  description?: string
  entity:       string
  formats:      ('csv' | 'xlsx' | 'json')[]
}

export type Exporter<Row = Record<string, unknown>> = ExporterDefinition & {
  /** Query and transform DB records into export rows. */
  extract: (filters: Record<string, unknown>, tenantId: string) => Promise<Row[]>

  /** Serialise rows into the requested format and return a download URL or blob. */
  serialise: (rows: Row[], format: 'csv' | 'xlsx' | 'json') => Promise<Blob | string>
}

export type ExportResult = {
  rowCount: number
  url?:     string    // presigned S3/Supabase storage URL for large exports
  blob?:    Blob      // in-browser download for small exports
}

// ── Registry ──────────────────────────────────────────────────────────────

class ImportExportRegistry {
  private readonly _importers = new Map<string, Importer>()
  private readonly _exporters = new Map<string, Exporter>()

  registerImporter<R>(imp: Importer<R>): this {
    this._importers.set(imp.key, imp as Importer)
    return this
  }

  registerExporter<R>(exp: Exporter<R>): this {
    this._exporters.set(exp.key, exp as Exporter)
    return this
  }

  getImporter(key: string): Importer | undefined {
    return this._importers.get(key)
  }

  getExporter(key: string): Exporter | undefined {
    return this._exporters.get(key)
  }

  getImportersFor(entity: string): Importer[] {
    return Array.from(this._importers.values()).filter((i) => i.entity === entity)
  }

  getExportersFor(entity: string): Exporter[] {
    return Array.from(this._exporters.values()).filter((e) => e.entity === entity)
  }
}

export const importExportRegistry = new ImportExportRegistry()

export function registerImporter<R = Record<string, unknown>>(imp: Importer<R>) {
  importExportRegistry.registerImporter(imp)
}

export function registerExporter<R = Record<string, unknown>>(exp: Exporter<R>) {
  importExportRegistry.registerExporter(exp)
}
