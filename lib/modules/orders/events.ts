// Domain event types emitted by the orders module.
// Consumers subscribe via eventBus.on(ORDER_EVENTS.CREATED, handler).

export const ORDER_EVENTS = {
  CREATED:        'order.created',
  STATUS_CHANGED: 'order.status_changed',
  CANCELLED:      'order.cancelled',
  COMPLETED:      'order.completed',
} as const

export type OrderEventType = typeof ORDER_EVENTS[keyof typeof ORDER_EVENTS]
