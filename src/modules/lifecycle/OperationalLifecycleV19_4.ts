export type CaseStatusV194 = 'new' | 'assigned' | 'under_review' | 'action_required' | 'resolved' | 'closed';
export type CasePriorityV194 = 'low' | 'normal' | 'high' | 'critical';

export interface UnifiedCaseV194 {
  id: string;
  case_number: string;
  type: 'veterinary' | 'complaint' | 'supply' | 'finance' | 'quality' | 'field_visit';
  title: string;
  customer_name?: string;
  farm_name?: string;
  flock_code?: string;
  priority: CasePriorityV194;
  status: CaseStatusV194;
  owner_role: string;
  owner_name?: string;
  created_at: string;
  updated_at: string;
  timeline: Array<{ id: string; at: string; actor: string; action: string; note?: string }>;
}

export interface TraceableLotV194 {
  id: string;
  lot_number: string;
  item_name: string;
  category: 'medicine' | 'vaccine' | 'feed' | 'chicks' | 'other';
  supplier_name: string;
  branch_name?: string;
  manufacture_date?: string;
  expiry_date?: string;
  cold_chain_required: boolean;
  cold_chain_status: 'not_required' | 'compliant' | 'breach' | 'pending_review';
  quantity_received: number;
  quantity_available: number;
  unit: string;
  status: 'active' | 'quarantined' | 'recalled' | 'expired';
  created_at: string;
}

export interface ApprovalRequestV194 {
  id: string;
  approval_number: string;
  subject_type: 'discount' | 'payment' | 'warehouse' | 'supplier' | 'medical' | 'contract' | 'other';
  subject_label: string;
  requested_by: string;
  amount?: number;
  currency?: string;
  required_steps: string[];
  completed_steps: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface WithdrawalGuardV194 {
  id: string;
  farm_name: string;
  flock_code: string;
  medication_name: string;
  last_dose_at: string;
  withdrawal_days: number;
  eligible_after: string;
  status: 'active_hold' | 'eligible' | 'vet_override_review';
}

export interface OperationalLifecycleStateV194 {
  cases: UnifiedCaseV194[];
  lots: TraceableLotV194[];
  approvals: ApprovalRequestV194[];
  withdrawal_guards: WithdrawalGuardV194[];
  audit: Array<{ id: string; at: string; actor: string; action: string; entity_type: string; entity_id: string }>;
}

export const EMPTY_OPERATIONAL_LIFECYCLE_V194: OperationalLifecycleStateV194 = {
  cases: [], lots: [], approvals: [], withdrawal_guards: [], audit: []
};

const suffix = () => `${Date.now()}`.slice(-7);
export const entityNumberV194 = (prefix: 'CASE'|'LOT'|'APR'|'DOC'|'ORD'|'SHP'|'INV'|'SMP') => `${prefix}-YE-${new Date().getFullYear()}-${suffix()}`;

export const appendAuditV194 = (state: OperationalLifecycleStateV194, actor: string, action: string, entity_type: string, entity_id: string): OperationalLifecycleStateV194 => ({
  ...state,
  audit: [{ id:`AUD-${Date.now()}`, at:new Date().toISOString(), actor, action, entity_type, entity_id }, ...state.audit].slice(0,500)
});

export const withdrawalEligibleDateV194 = (lastDoseAt: string, withdrawalDays: number) => {
  const date = new Date(lastDoseAt);
  date.setDate(date.getDate() + Math.max(0, withdrawalDays));
  return date.toISOString();
};

export const canIssueHealthyLabelV194 = (guards: WithdrawalGuardV194[], flockCode: string) => {
  const active = guards.filter(g => g.flock_code === flockCode && g.status === 'active_hold' && new Date(g.eligible_after).getTime() > Date.now());
  return { allowed: active.length === 0, blocking_guards: active };
};
