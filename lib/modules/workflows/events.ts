export const WORKFLOW_EVENTS = {
  TRANSITION: 'workflow.transition',
} as const

export type WorkflowEventType = typeof WORKFLOW_EVENTS[keyof typeof WORKFLOW_EVENTS]
