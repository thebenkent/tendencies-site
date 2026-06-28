import { getSupabase } from '@/lib/core/database'
import type { MerchWorkflow, MerchWorkflowState, MerchWorkflowTransition, WorkflowAction } from '@/lib/merch/types'

export async function findWorkflowById(id: string): Promise<MerchWorkflow | null> {
  const { data } = await getSupabase()
    .from('merch_workflows')
    .select('*')
    .eq('id', id)
    .single()
  return (data as MerchWorkflow | null) ?? null
}

export async function findWorkflowStates(workflowId: string): Promise<MerchWorkflowState[]> {
  const { data } = await getSupabase()
    .from('merch_workflow_states')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('display_order')
  return (data ?? []) as MerchWorkflowState[]
}

export async function findWorkflowTransitions(workflowId: string): Promise<MerchWorkflowTransition[]> {
  const { data } = await getSupabase()
    .from('merch_workflow_transitions')
    .select('*')
    .eq('workflow_id', workflowId)
  return (data ?? []) as MerchWorkflowTransition[]
}

export async function findTransitionsFromState(
  workflowId: string,
  fromState: string,
): Promise<MerchWorkflowTransition[]> {
  const { data } = await getSupabase()
    .from('merch_workflow_transitions')
    .select('*')
    .eq('workflow_id', workflowId)
    .eq('from_state', fromState)
  return (data ?? []) as MerchWorkflowTransition[]
}

export async function findTransitionsGrouped(
  workflowId: string,
): Promise<Record<string, WorkflowAction[]>> {
  const transitions = await findWorkflowTransitions(workflowId)
  const grouped: Record<string, WorkflowAction[]> = {}
  for (const t of transitions) {
    if (!grouped[t.from_state]) grouped[t.from_state] = []
    grouped[t.from_state].push({
      toState:            t.to_state,
      actionName:         t.action_name,
      requiresPermission: t.requires_permission,
    })
  }
  return grouped
}

export async function findInitialState(workflowId: string): Promise<string> {
  const states = await findWorkflowStates(workflowId)
  const initial = states.find((s) => !s.terminal)
  return initial?.key ?? 'reserved'
}
