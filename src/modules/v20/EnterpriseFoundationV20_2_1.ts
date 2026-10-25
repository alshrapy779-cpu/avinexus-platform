import type { EnterpriseWebStateV202, SpecialtyV202 } from './EnterpriseWebPlatformV20_2';

export type FoundationLanguageV2021 = 'ar'|'en';
export type EnterpriseScopeTypeV2021 = 'global'|'governorate'|'district'|'branch'|'farm'|'flock';
export type VeterinaryCoverageRoleV2021 = 'primary'|'backup'|'on_call'|'consultant';
export type ApprovalRequestStatusV2021 = 'pending'|'approved'|'rejected'|'cancelled'|'expired';
export type ApprovalStepStatusV2021 = 'waiting'|'pending'|'approved'|'rejected'|'skipped';
export type DocumentClassificationV2021 = 'public'|'internal'|'confidential'|'medical'|'financial'|'hr';
export type NotificationChannelV2021 = 'in_app'|'push'|'email'|'sms'|'whatsapp';

export interface EnterpriseIdentityV2021 {
  id:string;
  user_id:string;
  display_name:string;
  role_code:string;
  department_code:string;
  branch_ids:string[];
  scope_ids:string[];
  permission_allow:string[];
  permission_deny:string[];
  locale:FoundationLanguageV2021;
  timezone:string;
  active:boolean;
  manager_user_id?:string;
  created_at:string;
  updated_at:string;
}

export interface EnterpriseScopeV2021 {
  id:string;
  code:string;
  name:string;
  type:EnterpriseScopeTypeV2021;
  governorate?:string;
  district?:string;
  branch_ids:string[];
  farm_ids:string[];
  flock_ids:string[];
  inherits_scope_ids:string[];
  active:boolean;
}

export interface VeterinaryTerritoryV2021 {
  id:string;
  code:string;
  name:string;
  governorate?:string;
  districts:string[];
  branch_ids:string[];
  farm_ids:string[];
  flock_ids:string[];
  active:boolean;
  created_at:string;
}

export interface VeterinaryCoverageAssignmentV2021 {
  id:string;
  assignment_number:string;
  vet_user_id:string;
  specialty:SpecialtyV202;
  coverage_role:VeterinaryCoverageRoleV2021;
  territory_id?:string;
  farm_ids:string[];
  flock_ids:string[];
  priority:number;
  workload_limit_farms?:number;
  workload_limit_flocks?:number;
  starts_at:string;
  ends_at?:string;
  status:'active'|'scheduled'|'suspended'|'ended';
  assigned_by:string;
  created_at:string;
}

export interface VeterinaryHandoverV2021 {
  id:string;
  handover_number:string;
  from_vet_user_id:string;
  to_vet_user_id:string;
  farm_ids:string[];
  flock_ids:string[];
  reason:string;
  effective_from:string;
  effective_until?:string;
  case_refs:string[];
  plan_refs:string[];
  lab_refs:string[];
  medication_refs:string[];
  note?:string;
  acknowledged_by_from?:string;
  acknowledged_by_to?:string;
  status:'draft'|'active'|'completed'|'cancelled';
  created_by:string;
  created_at:string;
}

export interface ApprovalWorkflowDefinitionV2021 {
  id:string;
  code:string;
  name:string;
  trigger_type:string;
  department_code?:string;
  currency:'SAR';
  tiers:Array<{
    id:string;
    min_amount_sar:number;
    max_amount_sar?:number;
    steps:Array<{
      order:number;
      role_code:string;
      permission:string;
      min_approvers:number;
      allow_delegation:boolean;
    }>;
  }>;
  active:boolean;
}

export interface ApprovalRequestV2021 {
  id:string;
  approval_number:string;
  workflow_code:string;
  source_type:string;
  source_id:string;
  title:string;
  amount_sar:number;
  requested_by:string;
  requested_at:string;
  context:{branch_id?:string;farm_id?:string;flock_id?:string;department_code?:string};
  steps:Array<{
    order:number;
    role_code:string;
    permission:string;
    min_approvers:number;
    allow_delegation:boolean;
    status:ApprovalStepStatusV2021;
    approvals:Array<{actor_user_id:string;decision:'approved'|'rejected';at:string;note?:string;delegated_from_user_id?:string}>;
  }>;
  status:ApprovalRequestStatusV2021;
  completed_at?:string;
}

export interface AuthorityDelegationV2021 {
  id:string;
  delegation_number:string;
  from_user_id:string;
  to_user_id:string;
  permission_codes:string[];
  max_amount_sar?:number;
  scope_ids:string[];
  valid_from:string;
  valid_to:string;
  reason:string;
  status:'scheduled'|'active'|'expired'|'revoked';
  approved_by:string;
  created_at:string;
}

export interface MasterDataEntryV2021 {
  id:string;
  domain:string;
  code:string;
  label_ar:string;
  label_en:string;
  parent_code?:string;
  sort_order:number;
  metadata:Record<string,string|number|boolean|null>;
  active:boolean;
  effective_from?:string;
  effective_to?:string;
}

export interface EvidenceDocumentV2021 {
  id:string;
  document_number:string;
  title:string;
  classification:DocumentClassificationV2021;
  entity_type:string;
  entity_id:string;
  file_name:string;
  mime_type:string;
  size_bytes:number;
  sha256:string;
  storage_provider:'local'|'s3'|'azure_blob'|'gcs'|'external';
  storage_key:string;
  uploaded_by:string;
  uploaded_at:string;
  immutable:boolean;
  retention_until?:string;
  status:'active'|'superseded'|'revoked';
}

export interface NotificationPolicyV2021 {
  id:string;
  code:string;
  event_type:string;
  severity:'info'|'warning'|'critical';
  target_role_codes:string[];
  channels:NotificationChannelV2021[];
  acknowledge_required:boolean;
  escalation_after_minutes?:number;
  escalate_to_role_codes:string[];
  active:boolean;
}

export interface EnterpriseNotificationV2021 {
  id:string;
  notification_number:string;
  event_type:string;
  severity:'info'|'warning'|'critical';
  title:string;
  body:string;
  source_type:string;
  source_id:string;
  target_user_ids:string[];
  target_role_codes:string[];
  channels:NotificationChannelV2021[];
  created_at:string;
  acknowledged_by:string[];
  status:'queued'|'sent'|'acknowledged'|'closed';
}

export interface FoundationAuditV2021 {
  id:string;
  at:string;
  actor_user_id:string;
  action:string;
  entity_type:string;
  entity_id:string;
  reason:string;
  before?:unknown;
  after?:unknown;
}

export interface EnterpriseFoundationStateV2021 {
  version:'20.2.1';
  migrated_from:'20.2';
  identities:EnterpriseIdentityV2021[];
  scopes:EnterpriseScopeV2021[];
  veterinary_territories:VeterinaryTerritoryV2021[];
  veterinary_coverage:VeterinaryCoverageAssignmentV2021[];
  veterinary_handovers:VeterinaryHandoverV2021[];
  approval_workflows:ApprovalWorkflowDefinitionV2021[];
  approval_requests:ApprovalRequestV2021[];
  delegations:AuthorityDelegationV2021[];
  master_data:MasterDataEntryV2021[];
  evidence_documents:EvidenceDocumentV2021[];
  notification_policies:NotificationPolicyV2021[];
  notifications:EnterpriseNotificationV2021[];
  audit:FoundationAuditV2021[];
  localization:{default_language:FoundationLanguageV2021;available_languages:FoundationLanguageV2021[];fallback_language:FoundationLanguageV2021;rtl_languages:FoundationLanguageV2021[];};
  settings:{scope_enforcement:boolean;deny_by_default:boolean;delegation_enabled:boolean;veterinary_handover_required:boolean;document_hash_required:boolean;approval_engine_enabled:boolean;};
}

export interface EnterpriseResourceContextV2021 {
  branch_id?:string;
  governorate?:string;
  district?:string;
  farm_id?:string;
  flock_id?:string;
}

const now=()=>new Date().toISOString();
const uid=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const serial=(prefix:string)=>`${prefix}-${new Date().getUTCFullYear()}-${String(Date.now()).slice(-8)}`;

const DEFAULT_WORKFLOWS:ApprovalWorkflowDefinitionV2021[]=[
  {
    id:'wf-expense-v2021',code:'EXPENSE_APPROVAL',name:'Expense Approval',trigger_type:'expense',currency:'SAR',active:true,
    tiers:[
      {id:'exp-tier-1',min_amount_sar:0,max_amount_sar:100000,steps:[{order:1,role_code:'FINANCE_OFFICER',permission:'finance.expense.approve',min_approvers:1,allow_delegation:true}]},
      {id:'exp-tier-2',min_amount_sar:100000.01,max_amount_sar:500000,steps:[{order:1,role_code:'FINANCE_OFFICER',permission:'finance.expense.approve',min_approvers:1,allow_delegation:true},{order:2,role_code:'EXECUTIVE_MANAGER',permission:'finance.high_value.approve',min_approvers:1,allow_delegation:true}]},
      {id:'exp-tier-3',min_amount_sar:500000.01,steps:[{order:1,role_code:'FINANCE_OFFICER',permission:'finance.expense.approve',min_approvers:1,allow_delegation:true},{order:2,role_code:'SYSTEM_OWNER',permission:'finance.executive.approve',min_approvers:1,allow_delegation:false}]}
    ]
  },
  {
    id:'wf-medical-v2021',code:'MEDICAL_EXCEPTION_APPROVAL',name:'Medical Exception Approval',trigger_type:'medical_exception',department_code:'VET',currency:'SAR',active:true,
    tiers:[{id:'med-tier-1',min_amount_sar:0,steps:[{order:1,role_code:'FIELD_VET',permission:'veterinary.decision.issue',min_approvers:1,allow_delegation:true},{order:2,role_code:'SPECIALIST_CONSULTANT',permission:'veterinary.exception.approve',min_approvers:1,allow_delegation:true}]}]
  }
];

const DEFAULT_NOTIFICATION_POLICIES:NotificationPolicyV2021[]=[
  {id:'np-critical-vet',code:'CRITICAL_VET_CASE',event_type:'veterinary.critical_case',severity:'critical',target_role_codes:['FIELD_VET','SPECIALIST_CONSULTANT'],channels:['in_app','push'],acknowledge_required:true,escalation_after_minutes:15,escalate_to_role_codes:['EXEC_MANAGER'],active:true},
  {id:'np-overdue-task',code:'OVERDUE_TASK',event_type:'task.overdue',severity:'warning',target_role_codes:['FARM_WORKER'],channels:['in_app','push'],acknowledge_required:false,escalation_after_minutes:60,escalate_to_role_codes:['FIELD_VET'],active:true}
];

const DEFAULT_MASTER_DATA:MasterDataEntryV2021[]=[
  ['EXPENSE_TYPE','FUEL','وقود','Fuel'],['EXPENSE_TYPE','TRANSPORT','نقل','Transport'],['EXPENSE_TYPE','LAB','مختبر','Laboratory'],['EXPENSE_TYPE','VET_VISIT','زيارة بيطرية','Veterinary Visit'],
  ['PAYMENT_METHOD','CASH','نقداً','Cash'],['PAYMENT_METHOD','BANK','بنك','Bank'],['PAYMENT_METHOD','TRANSFER','تحويل','Transfer'],
  ['SPECIALTY','POULTRY_DISEASE','أمراض الدواجن','Poultry Disease'],['SPECIALTY','NUTRITION','التغذية','Nutrition'],['SPECIALTY','EPIDEMIOLOGY','الوبائيات','Epidemiology'],['SPECIALTY','LABORATORY','المختبر','Laboratory']
].map(([domain,code,label_ar,label_en],index)=>({id:`md-${String(domain).toLowerCase()}-${String(code).toLowerCase()}`,domain:String(domain),code:String(code),label_ar:String(label_ar),label_en:String(label_en),sort_order:index+1,metadata:{},active:true}));

export function buildEnterpriseFoundationV2021(existing?:Partial<EnterpriseFoundationStateV2021>):EnterpriseFoundationStateV2021 {
  const base:EnterpriseFoundationStateV2021={
    version:'20.2.1',migrated_from:'20.2',identities:[],scopes:[],veterinary_territories:[],veterinary_coverage:[],veterinary_handovers:[],
    approval_workflows:DEFAULT_WORKFLOWS,approval_requests:[],delegations:[],master_data:DEFAULT_MASTER_DATA,evidence_documents:[],
    notification_policies:DEFAULT_NOTIFICATION_POLICIES,notifications:[],audit:[],
    localization:{default_language:'ar',available_languages:['ar','en'],fallback_language:'en',rtl_languages:['ar']},
    settings:{scope_enforcement:true,deny_by_default:true,delegation_enabled:true,veterinary_handover_required:true,document_hash_required:true,approval_engine_enabled:true}
  };
  if(!existing) return base;
  return {
    ...base,...existing,version:'20.2.1',migrated_from:'20.2',
    identities:existing.identities||[],scopes:existing.scopes||[],veterinary_territories:existing.veterinary_territories||[],veterinary_coverage:existing.veterinary_coverage||[],veterinary_handovers:existing.veterinary_handovers||[],
    approval_workflows:existing.approval_workflows||base.approval_workflows,approval_requests:existing.approval_requests||[],delegations:existing.delegations||[],master_data:existing.master_data||base.master_data,
    evidence_documents:existing.evidence_documents||[],notification_policies:existing.notification_policies||base.notification_policies,notifications:existing.notifications||[],audit:existing.audit||[],
    localization:{...base.localization,...(existing.localization||{})},settings:{...base.settings,...(existing.settings||{})}
  };
}

function withAudit(state:EnterpriseFoundationStateV2021,actor_user_id:string,action:string,entity_type:string,entity_id:string,reason:string,before?:unknown,after?:unknown):EnterpriseFoundationStateV2021{
  const row:FoundationAuditV2021={id:uid('AUD201'),at:now(),actor_user_id,action,entity_type,entity_id,reason,before,after};
  return {...state,audit:[row,...state.audit].slice(0,20000)};
}

export function upsertEnterpriseIdentityV2021(state:EnterpriseFoundationStateV2021,input:Omit<EnterpriseIdentityV2021,'id'|'created_at'|'updated_at'> & {id?:string},actor:string):EnterpriseFoundationStateV2021{
  const current=state.identities.find(x=>x.user_id===input.user_id||x.id===input.id);
  const row:EnterpriseIdentityV2021=current?{...current,...input,id:current.id,created_at:current.created_at,updated_at:now()}:{...input,id:input.id||uid('IDN201'),created_at:now(),updated_at:now()};
  const next={...state,identities:current?state.identities.map(x=>x.id===current.id?row:x):[row,...state.identities]};
  return withAudit(next,actor,current?'identity.update':'identity.create','enterprise_identity',row.id,'enterprise identity maintenance',current,row);
}

export function upsertEnterpriseScopeV2021(state:EnterpriseFoundationStateV2021,input:Omit<EnterpriseScopeV2021,'id'> & {id?:string},actor:string):EnterpriseFoundationStateV2021{
  const current=state.scopes.find(x=>x.id===input.id||x.code===input.code);
  const row:EnterpriseScopeV2021={id:current?.id||input.id||uid('SCOPE201'),code:input.code,name:input.name,type:input.type,governorate:input.governorate,district:input.district,branch_ids:input.branch_ids||[],farm_ids:input.farm_ids||[],flock_ids:input.flock_ids||[],inherits_scope_ids:input.inherits_scope_ids||[],active:input.active};
  const next={...state,scopes:current?state.scopes.map(x=>x.id===current.id?row:x):[row,...state.scopes]};
  return withAudit(next,actor,current?'scope.update':'scope.create','enterprise_scope',row.id,'scope maintenance',current,row);
}

function scopeMatches(state:EnterpriseFoundationStateV2021,scope:EnterpriseScopeV2021,context:EnterpriseResourceContextV2021,visited=new Set<string>()):boolean{
  if(!scope.active||visited.has(scope.id)) return false;
  visited.add(scope.id);
  if(scope.type==='global') return true;
  if(context.flock_id&&scope.flock_ids.includes(context.flock_id)) return true;
  if(context.farm_id&&scope.farm_ids.includes(context.farm_id)) return true;
  if(context.branch_id&&scope.branch_ids.includes(context.branch_id)) return true;
  if(context.district&&scope.district===context.district) return true;
  if(context.governorate&&scope.governorate===context.governorate) return true;
  return scope.inherits_scope_ids.some(id=>{const inherited=state.scopes.find(x=>x.id===id);return inherited?scopeMatches(state,inherited,context,visited):false;});
}

export function effectivePermissionsV2021(state:EnterpriseFoundationStateV2021,v202:EnterpriseWebStateV202,userId:string,at=new Date()):string[]{
  const identity=state.identities.find(x=>x.user_id===userId&&x.active); if(!identity) return [];
  const role=v202.roles.find(r=>r.code===identity.role_code&&r.active);
  const allow=new Set([...(role?.permissions||[]),...identity.permission_allow]);
  identity.permission_deny.forEach(p=>allow.delete(p));
  if(state.settings.delegation_enabled){
    state.delegations.filter(d=>d.to_user_id===userId&&d.status==='active'&&new Date(d.valid_from)<=at&&new Date(d.valid_to)>=at).forEach(d=>d.permission_codes.forEach(p=>allow.add(p)));
  }
  return [...allow];
}

export function authorizeEnterpriseActionV2021(state:EnterpriseFoundationStateV2021,v202:EnterpriseWebStateV202,userId:string,permission:string,context:EnterpriseResourceContextV2021={}):{allowed:boolean;reason:string;identity?:EnterpriseIdentityV2021}{
  const identity=state.identities.find(x=>x.user_id===userId&&x.active); if(!identity) return {allowed:false,reason:'identity_not_found_or_inactive'};
  const permissions=effectivePermissionsV2021(state,v202,userId);
  if(!(permissions.includes('*')||permissions.includes(permission))) return {allowed:false,reason:'permission_denied',identity};
  if(!state.settings.scope_enforcement) return {allowed:true,reason:'scope_enforcement_disabled',identity};
  const hasContext=Boolean(context.branch_id||context.governorate||context.district||context.farm_id||context.flock_id);
  if(!hasContext) return {allowed:true,reason:'no_resource_scope_required',identity};
  const scopes=state.scopes.filter(s=>identity.scope_ids.includes(s.id));
  if(scopes.some(s=>scopeMatches(state,s,context))) return {allowed:true,reason:'scope_match',identity};
  return {allowed:false,reason:'scope_denied',identity};
}

export function createVeterinaryTerritoryV2021(state:EnterpriseFoundationStateV2021,input:Omit<VeterinaryTerritoryV2021,'id'|'created_at'>,actor:string):EnterpriseFoundationStateV2021{
  if(state.veterinary_territories.some(t=>t.code===input.code&&t.active)) throw new Error('territory_code_exists');
  const row:VeterinaryTerritoryV2021={...input,id:uid('VTR201'),created_at:now()};
  return withAudit({...state,veterinary_territories:[row,...state.veterinary_territories]},actor,'veterinary_territory.create','veterinary_territory',row.id,'territory created',undefined,row);
}

function veterinaryCoverageOverlapsV2021(state:EnterpriseFoundationStateV2021,a:Pick<VeterinaryCoverageAssignmentV2021,'territory_id'|'farm_ids'|'flock_ids'|'starts_at'|'ends_at'>,b:Pick<VeterinaryCoverageAssignmentV2021,'territory_id'|'farm_ids'|'flock_ids'|'starts_at'|'ends_at'>):boolean{
  const aStart=new Date(a.starts_at).getTime(),bStart=new Date(b.starts_at).getTime();
  const aEnd=a.ends_at?new Date(a.ends_at).getTime():Number.POSITIVE_INFINITY,bEnd=b.ends_at?new Date(b.ends_at).getTime():Number.POSITIVE_INFINITY;
  if(aStart>bEnd||bStart>aEnd) return false;
  if(a.territory_id&&b.territory_id&&a.territory_id===b.territory_id) return true;
  const ta=a.territory_id?state.veterinary_territories.find(t=>t.id===a.territory_id&&t.active):undefined;
  const tb=b.territory_id?state.veterinary_territories.find(t=>t.id===b.territory_id&&t.active):undefined;
  const aFarms=new Set([...(a.farm_ids||[]),...(ta?.farm_ids||[])]),bFarms=new Set([...(b.farm_ids||[]),...(tb?.farm_ids||[])]);
  const aFlocks=new Set([...(a.flock_ids||[]),...(ta?.flock_ids||[])]),bFlocks=new Set([...(b.flock_ids||[]),...(tb?.flock_ids||[])]);
  if([...aFarms].some(x=>bFarms.has(x))||[...aFlocks].some(x=>bFlocks.has(x))) return true;
  if(ta&&tb){
    if(ta.branch_ids.some(x=>tb.branch_ids.includes(x))) return true;
    if(ta.governorate&&tb.governorate&&ta.governorate===tb.governorate){
      if(ta.districts.some(x=>tb.districts.includes(x))) return true;
      const aBroad=!ta.districts.length&&!ta.branch_ids.length&&!ta.farm_ids.length&&!ta.flock_ids.length;
      const bBroad=!tb.districts.length&&!tb.branch_ids.length&&!tb.farm_ids.length&&!tb.flock_ids.length;
      if(aBroad||bBroad) return true;
    }
  }
  return false;
}

export function assignVeterinarianV2021(state:EnterpriseFoundationStateV2021,input:Omit<VeterinaryCoverageAssignmentV2021,'id'|'assignment_number'|'created_at'>):EnterpriseFoundationStateV2021{
  if(!input.vet_user_id) throw new Error('vet_user_required');
  if(input.territory_id&&!state.veterinary_territories.some(t=>t.id===input.territory_id&&t.active)) throw new Error('territory_not_found');
  if(!input.territory_id&&!input.farm_ids.length&&!input.flock_ids.length) throw new Error('coverage_scope_required');
  if(input.coverage_role==='primary'){
    const conflict=state.veterinary_coverage.some(a=>['active','scheduled'].includes(a.status)&&a.coverage_role==='primary'&&a.specialty===input.specialty&&a.vet_user_id!==input.vet_user_id&&veterinaryCoverageOverlapsV2021(state,a,input));
    if(conflict) throw new Error('primary_veterinary_coverage_conflict');
  }
  const row:VeterinaryCoverageAssignmentV2021={...input,id:uid('VCA201'),assignment_number:serial('VCA'),created_at:now()};
  const next={...state,veterinary_coverage:[row,...state.veterinary_coverage]};
  return withAudit(next,input.assigned_by,'veterinary_coverage.assign','veterinary_coverage',row.id,'veterinary coverage assignment',undefined,row);
}

export function resolveVeterinaryCoverageV2021(state:EnterpriseFoundationStateV2021,context:EnterpriseResourceContextV2021,specialty:SpecialtyV202='general_veterinary',at=new Date()):VeterinaryCoverageAssignmentV2021[]{
  const active=state.veterinary_coverage.filter(a=>a.status==='active'&&a.specialty===specialty&&new Date(a.starts_at)<=at&&(!a.ends_at||new Date(a.ends_at)>=at));
  const matches=active.filter(a=>{
    if(context.flock_id&&a.flock_ids.includes(context.flock_id)) return true;
    if(context.farm_id&&a.farm_ids.includes(context.farm_id)) return true;
    if(a.territory_id){
      const territory=state.veterinary_territories.find(t=>t.id===a.territory_id&&t.active); if(!territory) return false;
      if(context.flock_id&&territory.flock_ids.includes(context.flock_id)) return true;
      if(context.farm_id&&territory.farm_ids.includes(context.farm_id)) return true;
      if(context.branch_id&&territory.branch_ids.includes(context.branch_id)) return true;
      if(context.district&&territory.districts.includes(context.district)) return true;
      if(context.governorate&&territory.governorate===context.governorate) return true;
    }
    return false;
  });
  const rank:Record<VeterinaryCoverageRoleV2021,number>={primary:1,backup:2,on_call:3,consultant:4};
  return matches.sort((a,b)=>rank[a.coverage_role]-rank[b.coverage_role]||a.priority-b.priority);
}

export function createVeterinaryHandoverV2021(state:EnterpriseFoundationStateV2021,input:Omit<VeterinaryHandoverV2021,'id'|'handover_number'|'status'|'created_at'> & {status?:VeterinaryHandoverV2021['status']}):EnterpriseFoundationStateV2021{
  if(input.from_vet_user_id===input.to_vet_user_id) throw new Error('handover_same_veterinarian');
  if(!input.farm_ids.length&&!input.flock_ids.length) throw new Error('handover_scope_required');
  const row:VeterinaryHandoverV2021={...input,id:uid('VHO201'),handover_number:serial('VHO'),status:input.status||'draft',created_at:now()};
  return withAudit({...state,veterinary_handovers:[row,...state.veterinary_handovers]},input.created_by,'veterinary_handover.create','veterinary_handover',row.id,input.reason,undefined,row);
}

export function createDelegationV2021(state:EnterpriseFoundationStateV2021,input:Omit<AuthorityDelegationV2021,'id'|'delegation_number'|'created_at'>):EnterpriseFoundationStateV2021{
  if(input.from_user_id===input.to_user_id) throw new Error('delegation_same_user');
  if(new Date(input.valid_to)<=new Date(input.valid_from)) throw new Error('delegation_invalid_period');
  if(!input.permission_codes.length) throw new Error('delegation_permissions_required');
  if(input.max_amount_sar!==undefined&&input.max_amount_sar<0) throw new Error('delegation_invalid_amount_limit');
  input.scope_ids.forEach(scopeId=>{if(!state.scopes.some(s=>s.id===scopeId&&s.active)) throw new Error(`delegation_scope_not_found:${scopeId}`);});
  const row:AuthorityDelegationV2021={...input,id:uid('DEL201'),delegation_number:serial('DEL'),created_at:now()};
  return withAudit({...state,delegations:[row,...state.delegations]},input.approved_by,'delegation.create','authority_delegation',row.id,input.reason,undefined,row);
}

export function createApprovalRequestV2021(state:EnterpriseFoundationStateV2021,input:{workflow_code:string;source_type:string;source_id:string;title:string;amount_sar:number;requested_by:string;context?:ApprovalRequestV2021['context']}):EnterpriseFoundationStateV2021{
  const workflow=state.approval_workflows.find(w=>w.code===input.workflow_code&&w.active); if(!workflow) throw new Error('approval_workflow_not_found');
  if(input.amount_sar<0) throw new Error('approval_amount_invalid');
  const tier=workflow.tiers.find(t=>input.amount_sar>=t.min_amount_sar&&(t.max_amount_sar===undefined||input.amount_sar<=t.max_amount_sar)); if(!tier) throw new Error('approval_tier_not_found');
  const ordered=[...tier.steps].sort((a,b)=>a.order-b.order);
  const firstOrder=ordered[0]?.order;
  const row:ApprovalRequestV2021={id:uid('APR201'),approval_number:serial('APR'),workflow_code:workflow.code,source_type:input.source_type,source_id:input.source_id,title:input.title,amount_sar:input.amount_sar,requested_by:input.requested_by,requested_at:now(),context:input.context||{},steps:ordered.map(s=>({...s,status:s.order===firstOrder?'pending':'waiting',approvals:[]})),status:'pending'};
  return withAudit({...state,approval_requests:[row,...state.approval_requests]},input.requested_by,'approval.request','approval_request',row.id,row.title,undefined,row);
}

export function actOnApprovalV2021(state:EnterpriseFoundationStateV2021,input:{approval_id:string;actor_user_id:string;actor_role_code:string;decision:'approved'|'rejected';note?:string;delegated_from_user_id?:string}):EnterpriseFoundationStateV2021{
  const current=state.approval_requests.find(a=>a.id===input.approval_id); if(!current) throw new Error('approval_request_not_found');
  if(current.status!=='pending') throw new Error('approval_request_not_pending');
  const step=current.steps.find(s=>s.status==='pending'); if(!step) throw new Error('approval_step_not_found');
  const requestContext:EnterpriseResourceContextV2021={branch_id:current.context.branch_id,farm_id:current.context.farm_id,flock_id:current.context.flock_id};
  const delegation=input.delegated_from_user_id&&step.allow_delegation?state.delegations.find(d=>{
    if(d.from_user_id!==input.delegated_from_user_id||d.to_user_id!==input.actor_user_id||d.status!=='active'||!d.permission_codes.includes(step.permission)||new Date(d.valid_from)>new Date()||new Date(d.valid_to)<new Date()) return false;
    if(d.max_amount_sar!==undefined&&current.amount_sar>d.max_amount_sar) return false;
    if(!d.scope_ids.length) return true;
    return d.scope_ids.some(scopeId=>{const scope=state.scopes.find(x=>x.id===scopeId);return scope?scopeMatches(state,scope,requestContext):false;});
  }):undefined;
  const delegated=Boolean(delegation);
  if(input.actor_role_code!==step.role_code&&!delegated) throw new Error('approval_actor_role_mismatch');
  if(step.approvals.some(a=>a.actor_user_id===input.actor_user_id)) throw new Error('approval_actor_already_decided');
  const decision={actor_user_id:input.actor_user_id,decision:input.decision,at:now(),note:input.note,delegated_from_user_id:input.delegated_from_user_id};
  const nextSteps=current.steps.map(s=>s.order===step.order?{...s,approvals:[...s.approvals,decision]}:s);
  let requestStatus:ApprovalRequestStatusV2021='pending';
  if(input.decision==='rejected'){
    requestStatus='rejected';
    nextSteps.forEach(s=>{if(s.status==='waiting')s.status='skipped';});
    const target=nextSteps.find(s=>s.order===step.order); if(target) target.status='rejected';
  }else{
    const target=nextSteps.find(s=>s.order===step.order)!;
    const approvals=target.approvals.filter(a=>a.decision==='approved').length;
    if(approvals>=target.min_approvers){
      target.status='approved';
      const next=nextSteps.filter(s=>s.status==='waiting').sort((a,b)=>a.order-b.order)[0];
      if(next) next.status='pending'; else requestStatus='approved';
    }
  }
  const updated:ApprovalRequestV2021={...current,steps:nextSteps,status:requestStatus,completed_at:requestStatus==='pending'?undefined:now()};
  const next={...state,approval_requests:state.approval_requests.map(a=>a.id===current.id?updated:a)};
  return withAudit(next,input.actor_user_id,`approval.${input.decision}`,'approval_request',current.id,input.note||input.decision,current,updated);
}

export function registerEvidenceDocumentV2021(state:EnterpriseFoundationStateV2021,input:Omit<EvidenceDocumentV2021,'id'|'document_number'|'uploaded_at'>):EnterpriseFoundationStateV2021{
  if(state.settings.document_hash_required&&!/^[a-fA-F0-9]{64}$/.test(input.sha256)) throw new Error('valid_sha256_required');
  if(input.size_bytes<0) throw new Error('invalid_document_size');
  const row:EvidenceDocumentV2021={...input,id:uid('DOC201'),document_number:serial('DOC'),uploaded_at:now()};
  return withAudit({...state,evidence_documents:[row,...state.evidence_documents]},input.uploaded_by,'document.register','evidence_document',row.id,row.title,undefined,row);
}

export function emitEnterpriseNotificationV2021(state:EnterpriseFoundationStateV2021,input:{event_type:string;title:string;body:string;source_type:string;source_id:string;target_user_ids?:string[]}):EnterpriseFoundationStateV2021{
  const policy=state.notification_policies.find(p=>p.event_type===input.event_type&&p.active); if(!policy) throw new Error('notification_policy_not_found');
  const row:EnterpriseNotificationV2021={id:uid('NOT201'),notification_number:serial('NOT'),event_type:input.event_type,severity:policy.severity,title:input.title,body:input.body,source_type:input.source_type,source_id:input.source_id,target_user_ids:input.target_user_ids||[],target_role_codes:policy.target_role_codes,channels:policy.channels,created_at:now(),acknowledged_by:[],status:'queued'};
  return {...state,notifications:[row,...state.notifications]};
}

export function validateEnterpriseFoundationV2021(state:EnterpriseFoundationStateV2021,v202?:EnterpriseWebStateV202):string[]{
  const issues:string[]=[];
  if(state.version!=='20.2.1') issues.push('invalid_foundation_version');
  if(!state.localization.available_languages.includes(state.localization.default_language)) issues.push('default_language_not_available');
  const duplicateScopeCodes=state.scopes.map(s=>s.code).filter((v,i,a)=>a.indexOf(v)!==i); if(duplicateScopeCodes.length) issues.push(`duplicate_scope_codes:${[...new Set(duplicateScopeCodes)].join(',')}`);
  state.identities.forEach(i=>{
    if(v202&&!v202.roles.some(r=>r.code===i.role_code&&r.active)) issues.push(`identity_role_missing:${i.user_id}:${i.role_code}`);
    i.scope_ids.forEach(s=>{if(!state.scopes.some(x=>x.id===s&&x.active)) issues.push(`identity_scope_missing:${i.user_id}:${s}`);});
  });
  state.veterinary_coverage.forEach(a=>{if(a.territory_id&&!state.veterinary_territories.some(t=>t.id===a.territory_id)) issues.push(`vet_assignment_territory_missing:${a.id}`);});
  state.delegations.forEach(d=>{if(new Date(d.valid_to)<=new Date(d.valid_from)) issues.push(`delegation_invalid_period:${d.id}`);});
  state.approval_requests.filter(a=>a.status==='pending').forEach(a=>{if(!a.steps.some(s=>s.status==='pending')) issues.push(`approval_pending_without_step:${a.id}`);});
  state.evidence_documents.forEach(d=>{if(state.settings.document_hash_required&&!/^[a-fA-F0-9]{64}$/.test(d.sha256)) issues.push(`document_invalid_hash:${d.id}`);});
  return [...new Set(issues)];
}

export function upsertBranchV2021(v202:EnterpriseWebStateV202,input:{id?:string;code:string;name:string;governorate:string;district?:string;active:boolean}):EnterpriseWebStateV202{
  if(!input.code.trim()||!input.name.trim()) throw new Error('branch_code_and_name_required');
  const current=v202.branches.find(b=>b.id===input.id||b.code===input.code);
  const row={id:current?.id||input.id||uid('BR201'),code:input.code.trim().toUpperCase(),name:input.name.trim(),governorate:input.governorate.trim(),district:input.district?.trim(),active:input.active};
  return {...v202,branches:current?v202.branches.map(b=>b.id===current.id?row:b):[row,...v202.branches]};
}

export function upsertDepartmentV2021(v202:EnterpriseWebStateV202,input:{id?:string;code:string;name:string;parent_id?:string;active:boolean}):EnterpriseWebStateV202{
  if(!input.code.trim()||!input.name.trim()) throw new Error('department_code_and_name_required');
  if(input.parent_id&&!v202.departments.some(d=>d.id===input.parent_id)) throw new Error('department_parent_not_found');
  const current=v202.departments.find(d=>d.id===input.id||d.code===input.code);
  const row={id:current?.id||input.id||uid('DEPT201'),code:input.code.trim().toUpperCase(),name:input.name.trim(),parent_id:input.parent_id,active:input.active};
  return {...v202,departments:current?v202.departments.map(d=>d.id===current.id?row:d):[row,...v202.departments]};
}

export function upsertRoleDefinitionV2021(v202:EnterpriseWebStateV202,input:{id?:string;code:string;name:string;department_code:string;permissions:string[];approval_limit_sar:number;active:boolean}):EnterpriseWebStateV202{
  if(!v202.departments.some(d=>d.code===input.department_code&&d.active)) throw new Error('role_department_not_found');
  if(input.approval_limit_sar<0) throw new Error('invalid_approval_limit');
  const current=v202.roles.find(r=>r.id===input.id||r.code===input.code);
  const row={id:current?.id||input.id||uid('ROLE201'),code:input.code.trim().toUpperCase(),name:input.name.trim(),department_code:input.department_code,permissions:[...new Set(input.permissions)],approval_limit_sar:input.approval_limit_sar,active:input.active};
  return {...v202,roles:current?v202.roles.map(r=>r.id===current.id?row:r):[row,...v202.roles]};
}

export function upsertMasterDataEntryV2021(state:EnterpriseFoundationStateV2021,input:Omit<MasterDataEntryV2021,'id'> & {id?:string},actor:string):EnterpriseFoundationStateV2021{
  if(!input.domain.trim()||!input.code.trim()||!input.label_ar.trim()||!input.label_en.trim()) throw new Error('master_data_required_fields_missing');
  const current=state.master_data.find(x=>x.id===input.id||(x.domain===input.domain&&x.code===input.code));
  const row:MasterDataEntryV2021={id:current?.id||input.id||uid('MD201'),domain:input.domain.trim().toUpperCase(),code:input.code.trim().toUpperCase(),label_ar:input.label_ar.trim(),label_en:input.label_en.trim(),parent_code:input.parent_code?.trim().toUpperCase(),sort_order:Number(input.sort_order||0),metadata:input.metadata||{},active:input.active,effective_from:input.effective_from,effective_to:input.effective_to};
  const next={...state,master_data:current?state.master_data.map(x=>x.id===current.id?row:x):[row,...state.master_data]};
  return withAudit(next,actor,current?'master_data.update':'master_data.create','master_data',row.id,`${row.domain}:${row.code}`,current,row);
}

export function updateLocalizationV2021(state:EnterpriseFoundationStateV2021,input:Partial<EnterpriseFoundationStateV2021['localization']>,actor:string):EnterpriseFoundationStateV2021{
  const updated={...state.localization,...input};
  if(!updated.available_languages.includes(updated.default_language)) throw new Error('default_language_must_be_available');
  if(!updated.available_languages.includes(updated.fallback_language)) throw new Error('fallback_language_must_be_available');
  return withAudit({...state,localization:updated},actor,'localization.update','foundation_settings','localization','localization settings updated',state.localization,updated);
}

export function veterinaryWorkloadV2021(state:EnterpriseFoundationStateV2021){
  const active=state.veterinary_coverage.filter(a=>a.status==='active'&&new Date(a.starts_at)<=new Date()&&(!a.ends_at||new Date(a.ends_at)>=new Date()));
  const users=[...new Set(active.map(a=>a.vet_user_id))];
  return users.map(user_id=>{
    const assignments=active.filter(a=>a.vet_user_id===user_id);
    const farms=new Set<string>(); const flocks=new Set<string>();
    assignments.forEach(a=>{
      a.farm_ids.forEach(x=>farms.add(x)); a.flock_ids.forEach(x=>flocks.add(x));
      if(a.territory_id){const t=state.veterinary_territories.find(x=>x.id===a.territory_id&&x.active);t?.farm_ids.forEach(x=>farms.add(x));t?.flock_ids.forEach(x=>flocks.add(x));}
    });
    const farmLimit=Math.max(0,...assignments.map(a=>a.workload_limit_farms||0));
    const flockLimit=Math.max(0,...assignments.map(a=>a.workload_limit_flocks||0));
    return {user_id,assignment_count:assignments.length,farm_count:farms.size,flock_count:flocks.size,primary_assignments:assignments.filter(a=>a.coverage_role==='primary').length,backup_assignments:assignments.filter(a=>a.coverage_role==='backup').length,on_call_assignments:assignments.filter(a=>a.coverage_role==='on_call').length,farm_limit:farmLimit||undefined,flock_limit:flockLimit||undefined,over_farm_limit:Boolean(farmLimit&&farms.size>farmLimit),over_flock_limit:Boolean(flockLimit&&flocks.size>flockLimit)};
  }).sort((a,b)=>b.farm_count-a.farm_count||b.flock_count-a.flock_count);
}
