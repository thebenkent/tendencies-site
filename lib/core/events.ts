// Lightweight in-process event bus.
// Services emit typed domain events; subscribers respond without tight coupling.
// In a future production setup, emit() would publish to a durable queue (SQS, Inngest, etc.).

export type DomainEvent = {
  type:       string
  tenantId:   string
  campaignId?: string
  orderId?:   string
  payload:    Record<string, unknown>
  timestamp:  string
}

export type EventHandler = (event: DomainEvent) => Promise<void>

class EventBus {
  private handlers = new Map<string, EventHandler[]>()

  on(eventType: string, handler: EventHandler): () => void {
    const arr = this.handlers.get(eventType) ?? []
    arr.push(handler)
    this.handlers.set(eventType, arr)
    return () => {
      this.handlers.set(eventType, (this.handlers.get(eventType) ?? []).filter((h) => h !== handler))
    }
  }

  async emit(
    eventType: string,
    data: Omit<DomainEvent, 'type' | 'timestamp'>,
  ): Promise<void> {
    const event: DomainEvent = { type: eventType, ...data, timestamp: new Date().toISOString() }

    const specific  = this.handlers.get(eventType) ?? []
    const wildcards = this.handlers.get('*') ?? []
    const results = await Promise.allSettled(
      [...specific, ...wildcards].map((h) => h(event))
    )
    for (const r of results) {
      if (r.status === 'rejected') {
        console.error(`[EventBus] handler for ${eventType} threw:`, r.reason)
      }
    }
  }
}

export const eventBus = new EventBus()
