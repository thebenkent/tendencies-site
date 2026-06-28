import {
  findTransitionsFromState,
  findTransitionsGrouped,
  findInitialState,
} from './repository'
import { updateOrderStatus } from '@/lib/modules/orders/repository'
import { eventBus } from '@/lib/core/events'
import { WORKFLOW_EVENTS } from './events'
import type { WorkflowAction } from '@/lib/merch/types'

export type { WorkflowAction }

export async function getValidTransitions(
  workflowId: string,
  currentState: string,
): Promise<WorkflowAction[]> {
  const transitions = await findTransitionsFromState(workflowId, currentState)
  return transitions.map((t) => ({
    toState:            t.to_state,
    actionName:         t.action_name,
    requiresPermission: t.requires_permission,
  }))
}

export async function getAllTransitionsForWorkflow(
  workflowId: string,
): Promise<Record<string, WorkflowAction[]>> {
  return findTransitionsGrouped(workflowId)
}

export async function executeTransition(
  orderId:    string,
  tenantId:   string,
  workflowId: string,
  fromState:  string,
  toState:    string,
  actor:      string = 'admin',
): Promise<void> {
  const valid = await findTransitionsFromState(workflowId, fromState)
  const allowed = valid.some((t) => t.to_state === toState)
  if (!allowed) {
    throw new Error(`Transition ${fromState} → ${toState} is not allowed by workflow ${workflowId}`)
  }
  await updateOrderStatus(orderId, tenantId, toState, actor)

  await eventBus.emit(WORKFLOW_EVENTS.TRANSITION, {
    tenantId,
    orderId,
    payload: { workflowId, fromState, toState, actor },
  })
}

export async function getInitialState(workflowId: string): Promise<string> {
  return findInitialState(workflowId)
}
