import type { PlatformCoreStateV195, PlatformRoleV195 } from '../platform/PlatformCoreV19_5';
import type { ManagedOperationsStateV197 } from '../managed/ManagedPoultryOperationsV19_7';
import type { V20State } from './EnterprisePoultryCoreV20';
import { executiveFarmRowsV20, ownerDailyDashboardV20, validateV20State } from './EnterprisePoultryCoreV20';

export type EnvironmentV202 = 'DEMO'|'DEVELOPMENT'|'STAGING'|'PRODUCTION';
export type EnterpriseCurrencyV202 = 'SAR'|'YER_OLD'|'YER_NEW'|'USD';
export type PayerV202 = 'platform'|'farm_owner'|'shared'|'contract_rule';
export type ExpenseTypeV202 = 'fuel'|'transportation'|'field_meals'|'generator'|'electricity'|'water'|'litter'|'disinfectant'|'maintenance'|'emergency_purchase'|'veterinary_visit'|'labor'|'laboratory'|'equipment'|'feed'|'medicine'|'vaccine'|'marketing'|'platform_fee'|'other';
export type TaskStatusV202 = 'pending'|'in_progress'|'completed'|'overdue'|'rejected'|'unable_to_execute'|'evidence_missing';
export type SpecialtyV202 = 'poultry_disease'|'nutrition'|'epidemiology'|'laboratory'|'general_veterinary';
export type AccountTypeV202 = 'asset'|'liability'|'equity'|'revenue'|'expense';

export interface OrganizationV202 { id:string; code:string; name:string; legal_name?:string; base_currency:'SAR'; active:boolean; }
export interface DepartmentV202 { id:string; code:string; name:string; parent_id?:string; active:boolean; }
export interface BranchV202 { id:string; code:string; name:string; governorate:string; district?:string; active:boolean; }
export interface RoleDefinitionV202 { id:string; code:string; name:string; department_code:string; permissions:string[]; approval_limit_sar:number; active:boolean; }
export interface UserScopeV202 { id:string; user_id:string; role_code:string; department_code:string; branch_ids:string[]; province_ids:string[]; farm_ids:string[]; flock_ids:string[]; manager_user_id?:string; valid_from?:string; valid_to?:string; active:boolean; }

export interface EmployeeV202 {
  id:string; employee_number:string; user_id?:string; full_name:string; job_title:string; department_code:string; branch_id?:string;
  supervisor_employee_id?:string; phone?:string; status:'active'|'leave'|'suspended'|'terminated'; assigned_farm_ids:string[]; assigned_flock_ids:string[];
  work_schedule:string; attendance_policy:string; documents:string[]; created_at:string;
}
export interface EmploymentContractV202 {
  id:string; contract_number:string; employee_id:string; start_date:string; end_date?:string; currency:EnterpriseCurrencyV202;
  compensation_model:'monthly_salary'|'per_visit'|'per_farm'|'per_cycle'|'combination'; base_salary:number; per_visit_fee:number; per_farm_fee:number; per_cycle_fee:number;
  transport_allowance:number; housing_allowance:number; other_allowance:number; payer:PayerV202; farm_owner_share_percent:number; platform_share_percent:number;
  status:'draft'|'active'|'expired'|'terminated';
}
export interface PayrollRecordV202 {
  id:string; payroll_number:string; employee_id:string; period:string; currency:EnterpriseCurrencyV202; base:number; allowances:number; visits:number; farms:number; cycles:number;
  bonuses:number; advances:number; deductions:number; gross:number; net:number; payer_breakdown:Array<{payer:'platform'|'farm_owner';amount:number}>;
  cost_center_id?:string; status:'draft'|'approved'|'paid'; journal_entry_id?:string; created_at:string;
}

export interface CostResponsibilityRuleV202 {
  id:string; code:string; expense_type:ExpenseTypeV202; payer:PayerV202; platform_percent:number; farm_owner_percent:number;
  applies_to_contract_id?:string; cost_center_required:boolean; approval_threshold_sar:number; active:boolean; note?:string;
}
export interface CostCenterV202 { id:string; code:string; name:string; farm_id?:string; flock_id?:string; parent_id?:string; category?:string; active:boolean; }
export interface ExpenseV202 {
  id:string; expense_number:string; farm_id?:string; flock_id?:string; cost_center_id:string; expense_type:ExpenseTypeV202; description:string;
  original_currency:EnterpriseCurrencyV202; original_amount:number; exchange_rate_to_sar:number; base_amount_sar:number; rate_date:string; rate_source:string; rate_approved_by?:string;
  payer:PayerV202; payer_breakdown:Array<{payer:'platform'|'farm_owner';percent:number;amount_sar:number}>; payment_method:'cash'|'bank'|'credit'|'transfer'|'other';
  requested_by:string; approved_by?:string; evidence_refs:string[]; invoice_number?:string; expense_date:string; reason:string;
  status:'pending'|'approved'|'rejected'|'paid'; journal_entry_id?:string; created_at:string;
}

export interface AccountV202 { id:string; code:string; name:string; type:AccountTypeV202; normal_balance:'debit'|'credit'; parent_code?:string; system:boolean; active:boolean; }
export interface JournalLineV202 { account_code:string; account_name:string; debit_sar:number; credit_sar:number; cost_center_id?:string; counterparty?:string; memo?:string; }
export interface JournalEntryV202 {
  id:string; journal_number:string; journal_date:string; description:string; source_type:string; source_id:string; original_currency?:EnterpriseCurrencyV202; original_amount?:number;
  exchange_rate_to_sar?:number; rate_date?:string; lines:JournalLineV202[]; status:'draft'|'posted'|'reversed'; created_by:string; approved_by?:string; created_at:string; reversed_by_id?:string;
}
export interface CashAccountV202 { id:string; code:string; name:string; kind:'cashbox'|'bank'|'exchange'; currency:EnterpriseCurrencyV202; balance:number; active:boolean; }
export interface OpenItemV202 { id:string; kind:'receivable'|'payable'; counterparty:string; reference:string; currency:EnterpriseCurrencyV202; original_amount:number; balance:number; due_date?:string; farm_id?:string; flock_id?:string; status:'open'|'partial'|'settled'|'overdue'; }
export interface FxRateV202 { id:string; from:EnterpriseCurrencyV202; to:'SAR'; rate:number; effective_date:string; source:string; approved_by:string; immutable_after_use:boolean; }
export interface BudgetV202 { id:string; period:string; cost_center_id:string; account_code:string; budget_sar:number; actual_sar:number; status:'draft'|'approved'|'closed'; }

export interface VeterinaryAssignmentV202 { id:string; user_id:string; specialty:SpecialtyV202; farm_ids:string[]; flock_ids:string[]; primary:boolean; active:boolean; }
export interface TomorrowPlanV202 {
  id:string; plan_number:string; farm_id:string; flock_id:string; plan_date:string; source_report_id?:string; issued_by_vet:string; issued_at:string; status:'draft'|'approved'|'in_execution'|'closed';
  feed_kg:number; feeding_times:string[]; target_temperature_min_c:number; target_temperature_max_c:number; humidity_min_pct:number; humidity_max_pct:number;
  weight_sample_time?:string; weight_sample_count?:number; weight_sample_condition?:'fasted'|'fed'; ventilation_instruction?:string; treatment_instruction?:string;
  vaccination_instruction?:string; litter_instruction?:string; maintenance_instruction?:string; required_items:string[]; vet_note?:string; task_ids:string[];
}
export interface RoleTaskV202 {
  id:string; task_number:string; source_type:string; source_id:string; title:string; instructions:string; assigned_user_id?:string; assigned_role:PlatformRoleV195|string;
  farm_id?:string; flock_id?:string; due_at:string; priority:'normal'|'high'|'critical'; evidence_required:boolean; evidence_refs:string[]; status:TaskStatusV202;
  completion_note?:string; completed_at?:string; created_by:string; created_at:string;
}

export interface EnterpriseReportSnapshotV202 { id:string; report_number:string; report_code:string; title:string; period_from:string; period_to:string; generated_at:string; generated_by:string; scope:Record<string,string|number|boolean|undefined>; data:Record<string,unknown>; status:'draft'|'final'; }
export interface EnterpriseAuditV202 { id:string; at:string; actor:string; actor_role:string; action:string; entity_type:string; entity_id:string; reason:string; before?:unknown; after?:unknown; }

export interface EnterpriseWebStateV202 {
  version:'20.2'; migrated_from:'20.1'; environment:EnvironmentV202;
  organizations:OrganizationV202[]; departments:DepartmentV202[]; branches:BranchV202[]; roles:RoleDefinitionV202[]; user_scopes:UserScopeV202[];
  employees:EmployeeV202[]; employment_contracts:EmploymentContractV202[]; payroll:PayrollRecordV202[];
  cost_responsibility_rules:CostResponsibilityRuleV202[]; cost_centers:CostCenterV202[]; expenses:ExpenseV202[];
  chart_of_accounts:AccountV202[]; journal_entries:JournalEntryV202[]; cash_accounts:CashAccountV202[]; open_items:OpenItemV202[]; fx_rates:FxRateV202[]; budgets:BudgetV202[];
  veterinary_assignments:VeterinaryAssignmentV202[]; tomorrow_plans:TomorrowPlanV202[]; role_tasks:RoleTaskV202[];
  report_snapshots:EnterpriseReportSnapshotV202[]; audit:EnterpriseAuditV202[];
  settings:{base_currency:'SAR'; require_balanced_journals:boolean; prohibit_historical_fx_revaluation:boolean; production_demo_data_allowed:false; legacy_modules_visible_to_standard_users:false; manager_can_override_specialist_actions:false;};
}

const iso=()=>new Date().toISOString();
const id=(p:string)=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const serial=(p:string)=>`${p}-YE-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;
const round=(n:number,d=2)=>Number((Number.isFinite(n)?n:0).toFixed(d));

const DEPARTMENTS:DepartmentV202[] = [
  ['EXEC','Executive Management'],['VET','Veterinary'],['CONS','Consultants'],['LAB','Laboratory'],['FIN','Finance'],['PROC','Procurement'],['SALES','Sales & Marketing'],['LOG','Logistics'],['HR','HR'],['FIELD','Field Operations'],['SUP','Supplier Relations'],['CS','Customer Service'],['IT','IT / System Administration']
].map(([code,name])=>({id:`dept-${String(code).toLowerCase()}`,code:String(code),name:String(name),active:true}));

const ROLES:RoleDefinitionV202[] = [
  {id:'role-owner-v202',code:'SYSTEM_OWNER',name:'System Owner',department_code:'EXEC',permissions:['*'],approval_limit_sar:Number.MAX_SAFE_INTEGER,active:true},
  {id:'role-manager-v202',code:'EXECUTIVE_MANAGER',name:'Executive / Manager',department_code:'EXEC',permissions:['view_command_center','approve_within_limit','view_finance_summary','view_performance'],approval_limit_sar:250000,active:true},
  {id:'role-vet-v202',code:'FIELD_VET',name:'Field Veterinarian',department_code:'VET',permissions:['view_assigned_farms','review_daily_reports','issue_tomorrow_plan','issue_medical_tasks'],approval_limit_sar:0,active:true},
  {id:'role-consult-v202',code:'SPECIALIST_CONSULTANT',name:'Specialist Consultant',department_code:'CONS',permissions:['view_referred_cases','issue_consultation'],approval_limit_sar:0,active:true},
  {id:'role-fin-v202',code:'FINANCE_OFFICER',name:'Finance Officer',department_code:'FIN',permissions:['view_finance','post_journal','process_expense','payroll'],approval_limit_sar:100000,active:true},
  {id:'role-worker-v202',code:'FARM_WORKER',name:'Farm Worker',department_code:'FIELD',permissions:['view_assigned_tasks','submit_daily_close','upload_evidence'],approval_limit_sar:0,active:true},
  {id:'role-ownerfarm-v202',code:'FARM_OWNER',name:'Farm Owner',department_code:'CS',permissions:['view_own_farm','approve_contract_expenses','view_own_financials'],approval_limit_sar:0,active:true},
];

const COA:AccountV202[] = [
  ['1000','Cash & Banks','asset','debit'],['1100','Accounts Receivable','asset','debit'],['1200','Inventory','asset','debit'],['2000','Accounts Payable','liability','credit'],['2100','Payroll Payable','liability','credit'],['3000','Equity','equity','credit'],['4000','Sales Revenue','revenue','credit'],['4100','Service Revenue','revenue','credit'],
  ['5000','Chick Cost','expense','debit'],['5100','Feed Cost','expense','debit'],['5200','Medicine Cost','expense','debit'],['5210','Vaccine Cost','expense','debit'],['5300','Labor Cost','expense','debit'],['5310','Veterinary Cost','expense','debit'],['5320','Laboratory Cost','expense','debit'],['5400','Transport Cost','expense','debit'],['5500','Utilities Cost','expense','debit'],['5600','Maintenance Cost','expense','debit'],['5700','Marketing Cost','expense','debit'],['5800','Other Farm Cost','expense','debit']
].map(([code,name,type,normal])=>({id:`coa-${code}`,code,name,type:type as AccountTypeV202,normal_balance:normal as 'debit'|'credit',system:true,active:true}));

const COST_RULES:CostResponsibilityRuleV202[] = [
  {id:'cr-labor',code:'LABOR',expense_type:'labor',payer:'contract_rule',platform_percent:0,farm_owner_percent:100,cost_center_required:true,approval_threshold_sar:0,active:true,note:'العقد يحدد من يتحمل راتب العامل.'},
  {id:'cr-vet',code:'VET',expense_type:'veterinary_visit',payer:'contract_rule',platform_percent:0,farm_owner_percent:100,cost_center_required:true,approval_threshold_sar:0,active:true,note:'راتب/زيارة الطبيب حسب سياسة العقد.'},
  {id:'cr-transport',code:'TRANSPORT',expense_type:'transportation',payer:'farm_owner',platform_percent:0,farm_owner_percent:100,cost_center_required:true,approval_threshold_sar:0,active:true},
  {id:'cr-lab',code:'LAB',expense_type:'laboratory',payer:'contract_rule',platform_percent:0,farm_owner_percent:100,cost_center_required:true,approval_threshold_sar:0,active:true},
  {id:'cr-med',code:'MED',expense_type:'medicine',payer:'farm_owner',platform_percent:0,farm_owner_percent:100,cost_center_required:true,approval_threshold_sar:0,active:true},
  {id:'cr-vaccine',code:'VACCINE',expense_type:'vaccine',payer:'farm_owner',platform_percent:0,farm_owner_percent:100,cost_center_required:true,approval_threshold_sar:0,active:true},
  {id:'cr-maint',code:'MAINT',expense_type:'maintenance',payer:'contract_rule',platform_percent:0,farm_owner_percent:100,cost_center_required:true,approval_threshold_sar:0,active:true},
  {id:'cr-marketing',code:'MKT',expense_type:'marketing',payer:'contract_rule',platform_percent:0,farm_owner_percent:100,cost_center_required:true,approval_threshold_sar:0,active:true},
];

export function buildEnterpriseWebStateV202(existing?:Partial<EnterpriseWebStateV202>,environment?:EnvironmentV202):EnterpriseWebStateV202 {
  const resolvedEnvironment:EnvironmentV202=environment||existing?.environment||'DEVELOPMENT';
  const base:EnterpriseWebStateV202={
    version:'20.2',migrated_from:'20.1',environment:resolvedEnvironment,
    organizations:[{id:'org-main',code:'AVINEXUS',name:'AviNexus Poultry Enterprise',base_currency:'SAR',active:true}],departments:DEPARTMENTS,branches:[],roles:ROLES,user_scopes:[],
    employees:[],employment_contracts:[],payroll:[],cost_responsibility_rules:COST_RULES,cost_centers:[],expenses:[],
    chart_of_accounts:COA,journal_entries:[],cash_accounts:[],open_items:[],fx_rates:[],budgets:[],veterinary_assignments:[],tomorrow_plans:[],role_tasks:[],report_snapshots:[],audit:[],
    settings:{base_currency:'SAR',require_balanced_journals:true,prohibit_historical_fx_revaluation:true,production_demo_data_allowed:false,legacy_modules_visible_to_standard_users:false,manager_can_override_specialist_actions:false}
  };
  if(!existing) return base;
  return {
    ...base,...existing,version:'20.2',migrated_from:'20.1',environment:resolvedEnvironment,
    organizations:existing.organizations||base.organizations,departments:existing.departments||base.departments,branches:existing.branches||[],roles:existing.roles||base.roles,user_scopes:existing.user_scopes||[],
    employees:existing.employees||[],employment_contracts:existing.employment_contracts||[],payroll:existing.payroll||[],cost_responsibility_rules:existing.cost_responsibility_rules||base.cost_responsibility_rules,cost_centers:existing.cost_centers||[],expenses:existing.expenses||[],
    chart_of_accounts:existing.chart_of_accounts||base.chart_of_accounts,journal_entries:existing.journal_entries||[],cash_accounts:existing.cash_accounts||[],open_items:existing.open_items||[],fx_rates:existing.fx_rates||[],budgets:existing.budgets||[],
    veterinary_assignments:existing.veterinary_assignments||[],tomorrow_plans:existing.tomorrow_plans||[],role_tasks:existing.role_tasks||[],report_snapshots:existing.report_snapshots||[],audit:existing.audit||[],settings:{...base.settings,...(existing.settings||{})}
  };
}

function audit(state:EnterpriseWebStateV202,actor:string,actorRole:string,action:string,entityType:string,entityId:string,reason:string,before?:unknown,after?:unknown):EnterpriseWebStateV202 {
  const row:EnterpriseAuditV202={id:id('AUD20'),at:iso(),actor,actor_role:actorRole,action,entity_type:entityType,entity_id:entityId,reason,before,after};
  return {...state,audit:[row,...state.audit].slice(0,10000)};
}

export function ensureCostCenterV202(state:EnterpriseWebStateV202,input:{farm_id?:string;flock_id?:string;category:string;name?:string}):EnterpriseWebStateV202 {
  const code=`${input.farm_id||'ORG'}:${input.flock_id||'GENERAL'}:${input.category.toUpperCase()}`;
  if(state.cost_centers.some(c=>c.code===code)) return state;
  const row:CostCenterV202={id:id('CC'),code,name:input.name||code,farm_id:input.farm_id,flock_id:input.flock_id,category:input.category,active:true};
  return {...state,cost_centers:[row,...state.cost_centers]};
}

export function resolveCostResponsibilityV202(state:EnterpriseWebStateV202,expenseType:ExpenseTypeV202,contract?:EmploymentContractV202):{payer:PayerV202;breakdown:Array<{payer:'platform'|'farm_owner';percent:number}>;rule?:CostResponsibilityRuleV202} {
  const rule=state.cost_responsibility_rules.find(r=>r.active&&r.expense_type===expenseType);
  if(rule?.payer==='contract_rule'&&contract){
    if(contract.payer==='platform') return {payer:'platform',breakdown:[{payer:'platform',percent:100}],rule};
    if(contract.payer==='farm_owner') return {payer:'farm_owner',breakdown:[{payer:'farm_owner',percent:100}],rule};
    if(contract.payer==='shared') return {payer:'shared',breakdown:[{payer:'platform',percent:contract.platform_share_percent},{payer:'farm_owner',percent:contract.farm_owner_share_percent}],rule};
  }
  if(!rule||rule.payer==='contract_rule') return {payer:'farm_owner',breakdown:[{payer:'farm_owner',percent:100}],rule};
  if(rule.payer==='shared') return {payer:'shared',breakdown:[{payer:'platform',percent:rule.platform_percent},{payer:'farm_owner',percent:rule.farm_owner_percent}],rule};
  return {payer:rule.payer,breakdown:[{payer:rule.payer==='platform'?'platform':'farm_owner',percent:100}],rule};
}

export function isBalancedJournalV202(entry:Pick<JournalEntryV202,'lines'>){
  const debit=round(entry.lines.reduce((s,l)=>s+Number(l.debit_sar||0),0));
  const credit=round(entry.lines.reduce((s,l)=>s+Number(l.credit_sar||0),0));
  return {balanced:Math.abs(debit-credit)<0.005,debit,credit,difference:round(debit-credit)};
}

export function postJournalV202(state:EnterpriseWebStateV202,input:Omit<JournalEntryV202,'id'|'journal_number'|'created_at'|'status'> & {status?:'draft'|'posted'},actorRole='finance'):EnterpriseWebStateV202 {
  const entry:JournalEntryV202={...input,id:id('JE'),journal_number:serial('JE'),created_at:iso(),status:input.status||'posted'};
  const check=isBalancedJournalV202(entry);
  if(state.settings.require_balanced_journals&&!check.balanced) throw new Error(`unbalanced_journal:${check.difference}`);
  if(entry.lines.some(l=>l.debit_sar<0||l.credit_sar<0||(l.debit_sar>0&&l.credit_sar>0))) throw new Error('invalid_journal_line');
  return audit({...state,journal_entries:[entry,...state.journal_entries]},input.created_by,actorRole,'post_journal','journal_entry',entry.id,entry.description,undefined,entry);
}

const expenseAccount=(t:ExpenseTypeV202)=>({feed:'5100',medicine:'5200',vaccine:'5210',labor:'5300',veterinary_visit:'5310',laboratory:'5320',transportation:'5400',fuel:'5500',electricity:'5500',water:'5500',maintenance:'5600',marketing:'5700'} as Partial<Record<ExpenseTypeV202,string>>)[t]||'5800';

export function createExpenseV202(state:EnterpriseWebStateV202,input:{farm_id?:string;flock_id?:string;cost_center_id:string;expense_type:ExpenseTypeV202;description:string;currency:EnterpriseCurrencyV202;amount:number;exchange_rate_to_sar:number;rate_date:string;rate_source:string;payment_method:ExpenseV202['payment_method'];requested_by:string;evidence_refs?:string[];invoice_number?:string;expense_date:string;reason:string;contract_id?:string}):EnterpriseWebStateV202 {
  if(input.amount<=0||input.exchange_rate_to_sar<=0) throw new Error('invalid_expense_amount_or_rate');
  if(!state.cost_centers.some(c=>c.id===input.cost_center_id)) throw new Error('cost_center_required');
  const contract=input.contract_id?state.employment_contracts.find(c=>c.id===input.contract_id):undefined;
  const responsibility=resolveCostResponsibilityV202(state,input.expense_type,contract);
  const base=round(input.amount*input.exchange_rate_to_sar);
  const row:ExpenseV202={id:id('EXP'),expense_number:serial('EXP'),farm_id:input.farm_id,flock_id:input.flock_id,cost_center_id:input.cost_center_id,expense_type:input.expense_type,description:input.description,original_currency:input.currency,original_amount:input.amount,exchange_rate_to_sar:input.exchange_rate_to_sar,base_amount_sar:base,rate_date:input.rate_date,rate_source:input.rate_source,payer:responsibility.payer,payer_breakdown:responsibility.breakdown.map(x=>({...x,amount_sar:round(base*x.percent/100)})),payment_method:input.payment_method,requested_by:input.requested_by,evidence_refs:input.evidence_refs||[],invoice_number:input.invoice_number,expense_date:input.expense_date,reason:input.reason,status:'pending',created_at:iso()};
  return audit({...state,expenses:[row,...state.expenses]},input.requested_by,'requester','create_expense','expense',row.id,input.reason,undefined,row);
}

export function decideExpenseV202(state:EnterpriseWebStateV202,expenseId:string,approved:boolean,actor:string,actorRole:string,reason:string):EnterpriseWebStateV202 {
  const expense=state.expenses.find(e=>e.id===expenseId); if(!expense) throw new Error('expense_not_found');
  if(expense.status!=='pending') throw new Error('expense_already_decided');
  const updated:ExpenseV202={...expense,status:approved?'approved':'rejected',approved_by:approved?actor:undefined};
  let next={...state,expenses:state.expenses.map(e=>e.id===expenseId?updated:e)};
  next=audit(next,actor,actorRole,approved?'approve_expense':'reject_expense','expense',expenseId,reason,expense,updated);
  if(approved){
    const acc=expenseAccount(expense.expense_type); const accName=next.chart_of_accounts.find(a=>a.code===acc)?.name||'Expense';
    const credit=expense.payment_method==='credit'?'2000':'1000'; const creditName=next.chart_of_accounts.find(a=>a.code===credit)?.name||'Settlement';
    next=postJournalV202(next,{journal_date:expense.expense_date,description:expense.description,source_type:'expense',source_id:expense.id,original_currency:expense.original_currency,original_amount:expense.original_amount,exchange_rate_to_sar:expense.exchange_rate_to_sar,rate_date:expense.rate_date,lines:[{account_code:acc,account_name:accName,debit_sar:expense.base_amount_sar,credit_sar:0,cost_center_id:expense.cost_center_id,memo:expense.reason},{account_code:credit,account_name:creditName,debit_sar:0,credit_sar:expense.base_amount_sar,cost_center_id:expense.cost_center_id}],created_by:actor,approved_by:actor},actorRole);
    const journal=next.journal_entries[0]; next={...next,expenses:next.expenses.map(e=>e.id===expenseId?{...e,journal_entry_id:journal.id}:e)};
  }
  return next;
}

export function addEmployeeV202(state:EnterpriseWebStateV202,input:Omit<EmployeeV202,'id'|'employee_number'|'created_at'>,actor:string,actorRole:string):EnterpriseWebStateV202 {
  const row:EmployeeV202={...input,id:id('EMP'),employee_number:serial('EMP'),created_at:iso()};
  return audit({...state,employees:[row,...state.employees]},actor,actorRole,'create_employee','employee',row.id,'إنشاء ملف موظف',undefined,row);
}

export function addEmploymentContractV202(state:EnterpriseWebStateV202,input:Omit<EmploymentContractV202,'id'|'contract_number'>,actor:string,actorRole:string):EnterpriseWebStateV202 {
  if(!state.employees.some(e=>e.id===input.employee_id)) throw new Error('employee_not_found');
  const row:EmploymentContractV202={...input,id:id('ECTR'),contract_number:serial('ECTR')};
  return audit({...state,employment_contracts:[row,...state.employment_contracts]},actor,actorRole,'create_employment_contract','employment_contract',row.id,'تعريف شروط التعويض وتحمل التكلفة',undefined,row);
}

export function createPayrollV202(state:EnterpriseWebStateV202,input:{employee_id:string;period:string;visits?:number;farms?:number;cycles?:number;bonuses?:number;advances?:number;deductions?:number;cost_center_id?:string},actor:string):EnterpriseWebStateV202 {
  const contract=state.employment_contracts.find(c=>c.employee_id===input.employee_id&&c.status==='active'); if(!contract) throw new Error('active_contract_not_found');
  const base=contract.compensation_model==='monthly_salary'||contract.compensation_model==='combination'?contract.base_salary:0;
  const variable=(input.visits||0)*contract.per_visit_fee+(input.farms||0)*contract.per_farm_fee+(input.cycles||0)*contract.per_cycle_fee;
  const allowances=contract.transport_allowance+contract.housing_allowance+contract.other_allowance;
  const gross=round(base+variable+allowances+(input.bonuses||0)); const net=round(gross-(input.advances||0)-(input.deductions||0));
  const resp=resolveCostResponsibilityV202(state,'labor',contract);
  const row:PayrollRecordV202={id:id('PAY'),payroll_number:serial('PAY'),employee_id:input.employee_id,period:input.period,currency:contract.currency,base,allowances,visits:input.visits||0,farms:input.farms||0,cycles:input.cycles||0,bonuses:input.bonuses||0,advances:input.advances||0,deductions:input.deductions||0,gross,net,payer_breakdown:resp.breakdown.map(x=>({payer:x.payer,amount:round(net*x.percent/100)})),cost_center_id:input.cost_center_id,status:'draft',created_at:iso()};
  return audit({...state,payroll:[row,...state.payroll]},actor,'finance','create_payroll','payroll',row.id,`Payroll ${input.period}`,undefined,row);
}

export function createTomorrowPlanV202(state:EnterpriseWebStateV202,input:Omit<TomorrowPlanV202,'id'|'plan_number'|'issued_at'|'status'|'task_ids'> & {status?:TomorrowPlanV202['status'];worker_user_id?:string},actorRole='field_vet'):EnterpriseWebStateV202 {
  if(!input.issued_by_vet.trim()) throw new Error('vet_approval_required');
  const planId=id('PLAN');
  const taskDefs:Array<{title:string;instructions:string;due:string;evidence:boolean;priority:'normal'|'high'|'critical'}> = [];
  taskDefs.push({title:'تنفيذ خطة التغذية',instructions:`${input.feed_kg} kg — ${input.feeding_times.join(' / ')}`,due:input.feeding_times[0]||'06:00',evidence:true,priority:'normal'});
  taskDefs.push({title:'ضبط البيئة',instructions:`الحرارة ${input.target_temperature_min_c}–${input.target_temperature_max_c}°C، الرطوبة ${input.humidity_min_pct}–${input.humidity_max_pct}%${input.ventilation_instruction?`، ${input.ventilation_instruction}`:''}`,due:'09:00',evidence:true,priority:'high'});
  if(input.weight_sample_count) taskDefs.push({title:'عينة الوزن',instructions:`${input.weight_sample_count} طائر، ${input.weight_sample_time||'07:00'}، ${input.weight_sample_condition||'fasted'}`,due:input.weight_sample_time||'07:00',evidence:true,priority:'normal'});
  if(input.treatment_instruction) taskDefs.push({title:'تنفيذ العلاج المعتمد',instructions:input.treatment_instruction,due:'12:00',evidence:true,priority:'critical'});
  if(input.vaccination_instruction) taskDefs.push({title:'تنفيذ برنامج اللقاح',instructions:input.vaccination_instruction,due:'10:00',evidence:true,priority:'critical'});
  if(input.litter_instruction) taskDefs.push({title:'الفرشة',instructions:input.litter_instruction,due:'15:00',evidence:true,priority:'normal'});
  if(input.maintenance_instruction) taskDefs.push({title:'الصيانة',instructions:input.maintenance_instruction,due:'14:00',evidence:true,priority:'high'});
  input.required_items.forEach((x,i)=>taskDefs.push({title:`احتياج مزرعة ${i+1}`,instructions:x,due:'14:00',evidence:false,priority:'high'}));
  const tasks:RoleTaskV202[]=taskDefs.map(t=>({id:id('TASK'),task_number:serial('TASK'),source_type:'tomorrow_plan',source_id:planId,title:t.title,instructions:t.instructions,assigned_user_id:input.worker_user_id,assigned_role:'worker',farm_id:input.farm_id,flock_id:input.flock_id,due_at:`${input.plan_date}T${t.due}:00`,priority:t.priority,evidence_required:t.evidence,evidence_refs:[],status:'pending',created_by:input.issued_by_vet,created_at:iso()}));
  const plan:TomorrowPlanV202={...input,id:planId,plan_number:serial('PLAN'),issued_at:iso(),status:input.status||'approved',task_ids:tasks.map(t=>t.id)};
  let next={...state,tomorrow_plans:[plan,...state.tomorrow_plans],role_tasks:[...tasks,...state.role_tasks]};
  next=audit(next,input.issued_by_vet,actorRole,'issue_tomorrow_plan','tomorrow_plan',plan.id,'خطة تشغيل اليوم التالي مع تحويلها إلى مهام',undefined,plan);
  return next;
}

export function updateRoleTaskV202(state:EnterpriseWebStateV202,taskId:string,status:TaskStatusV202,actor:string,actorRole:string,note?:string,evidenceRefs:string[]=[]):EnterpriseWebStateV202 {
  const current=state.role_tasks.find(t=>t.id===taskId); if(!current) throw new Error('task_not_found');
  if(current.evidence_required&&status==='completed'&&!(current.evidence_refs.length||evidenceRefs.length)) status='evidence_missing';
  const updated:RoleTaskV202={...current,status,completion_note:note||current.completion_note,evidence_refs:[...current.evidence_refs,...evidenceRefs],completed_at:status==='completed'?iso():current.completed_at};
  return audit({...state,role_tasks:state.role_tasks.map(t=>t.id===taskId?updated:t)},actor,actorRole,'update_task','role_task',taskId,note||status,current,updated);
}

export function createEnterpriseReportV202(state:EnterpriseWebStateV202,input:{report_code:string;title:string;period_from:string;period_to:string;generated_by:string;scope?:EnterpriseReportSnapshotV202['scope'];data:Record<string,unknown>;final?:boolean}):EnterpriseWebStateV202 {
  const row:EnterpriseReportSnapshotV202={id:id('RPT'),report_number:serial('RPT'),report_code:input.report_code,title:input.title,period_from:input.period_from,period_to:input.period_to,generated_at:iso(),generated_by:input.generated_by,scope:input.scope||{},data:input.data,status:input.final?'final':'draft'};
  return audit({...state,report_snapshots:[row,...state.report_snapshots]},input.generated_by,'reporting','generate_report','report_snapshot',row.id,row.title,undefined,row);
}

export interface TrialBalanceRowV202 { account_code:string; account_name:string; debit_sar:number; credit_sar:number; balance_sar:number; }
export function trialBalanceV202(state:EnterpriseWebStateV202):TrialBalanceRowV202[]{
  const totals=new Map<string,{debit:number;credit:number}>();
  state.journal_entries.filter(j=>j.status==='posted').forEach(j=>j.lines.forEach(l=>{const t=totals.get(l.account_code)||{debit:0,credit:0};t.debit+=l.debit_sar;t.credit+=l.credit_sar;totals.set(l.account_code,t);}));
  return state.chart_of_accounts.filter(a=>totals.has(a.code)).map(a=>{const t=totals.get(a.code)!;return {account_code:a.code,account_name:a.name,debit_sar:round(t.debit),credit_sar:round(t.credit),balance_sar:round(a.normal_balance==='debit'?t.debit-t.credit:t.credit-t.debit)};});
}

export function financialStatementsV202(state:EnterpriseWebStateV202){
  const trial=trialBalanceV202(state);
  const byType=(type:AccountTypeV202)=>trial.filter(r=>state.chart_of_accounts.find(a=>a.code===r.account_code)?.type===type).reduce((s,r)=>s+r.balance_sar,0);
  const assets=round(byType('asset')), liabilities=round(byType('liability')), equity=round(byType('equity')), revenue=round(byType('revenue')), expenses=round(byType('expense'));
  const net_income=round(revenue-expenses);
  const cashCodes=new Set(state.chart_of_accounts.filter(a=>a.code==='1000'||a.parent_code==='1000').map(a=>a.code));
  const cash_balance=round(trial.filter(r=>cashCodes.has(r.account_code)).reduce((s,r)=>s+r.balance_sar,0));
  return {trial_balance:trial,income_statement:{revenue_sar:revenue,expense_sar:expenses,net_income_sar:net_income},balance_sheet:{assets_sar:assets,liabilities_sar:liabilities,equity_sar:equity,retained_current_income_sar:net_income,accounting_check_sar:round(assets-(liabilities+equity+net_income))},cash_flow:{current_cash_balance_sar:cash_balance,note:'Direct cash-flow classification requires payment/cash journal tagging; balance is ledger-derived.'}};
}

export function costCenterSummaryV202(state:EnterpriseWebStateV202){
  const posted=state.journal_entries.filter(j=>j.status==='posted');
  return state.cost_centers.map(c=>{
    const lines=posted.flatMap(j=>j.lines).filter(l=>l.cost_center_id===c.id);
    const expenses=lines.filter(l=>state.chart_of_accounts.find(a=>a.code===l.account_code)?.type==='expense').reduce((s,l)=>s+l.debit_sar-l.credit_sar,0);
    const revenue=lines.filter(l=>state.chart_of_accounts.find(a=>a.code===l.account_code)?.type==='revenue').reduce((s,l)=>s+l.credit_sar-l.debit_sar,0);
    return {...c,cost_sar:round(expenses),revenue_sar:round(revenue),margin_sar:round(revenue-expenses)};
  });
}

export function managerCommandCenterV202(v202:EnterpriseWebStateV202,v20:V20State,managed:ManagedOperationsStateV197,platform:PlatformCoreStateV195){
  const rows=executiveFarmRowsV20(v20,managed); const tasks=v202.role_tasks;
  const currentBirds=rows.reduce((s,r)=>s+r.live_birds,0); const outstanding=rows.reduce((s,r)=>s+r.outstanding_sar,0);
  const mortalityToday=managed.daily_reports.filter(r=>r.report_date===new Date().toISOString().slice(0,10)).reduce((s,r)=>s+r.mortality,0);
  const debit=v202.journal_entries.filter(j=>j.status==='posted').flatMap(j=>j.lines).reduce((s,l)=>s+l.debit_sar,0);
  return {
    active_farms:managed.farms.filter(f=>f.status==='active').length,active_flocks:managed.flock_cycles.filter(f=>f.status==='active').length,current_birds:currentBirds,mortality_today:mortalityToday,
    reports_missing:rows.filter(r=>r.data_completeness<90).length,critical_medical_cases:managed.exceptions.filter(e=>e.status!=='resolved'&&e.severity==='critical').length,
    tasks_overdue:tasks.filter(t=>t.status==='overdue'||(t.status==='pending'&&new Date(t.due_at)<new Date())).length,farm_requirements_open:managed.requirements.filter(r=>r.procurement_status!=='closed').length,
    owner_approvals:managed.requirements.filter(r=>r.owner_decision==='pending').length,purchases_in_progress:managed.purchase_orders.filter(p=>!['received','cancelled'].includes(p.status)).length,
    receivables_sar:v202.open_items.filter(x=>x.kind==='receivable'&&x.status!=='settled').reduce((s,x)=>s+(x.currency==='SAR'?x.balance:0),0),payables_sar:v202.open_items.filter(x=>x.kind==='payable'&&x.status!=='settled').reduce((s,x)=>s+(x.currency==='SAR'?x.balance:0),0),
    outstanding_farm_sar:round(outstanding),posted_ledger_volume_sar:round(debit),pending_expenses:v202.expenses.filter(e=>e.status==='pending').length,contracts_expiring_30d:v202.employment_contracts.filter(c=>c.status==='active'&&c.end_date&&new Date(c.end_date).getTime()-Date.now()<=30*86400000).length,
    staff_active:v202.employees.filter(e=>e.status==='active').length,critical_exceptions:rows.reduce((s,r)=>s+r.open_exceptions,0),platform_users:platform.users.filter(u=>u.status==='active').length,system_health:validateV20State(v20,managed).length===0?'healthy':'attention'
  };
}

export function doctorWorkspaceV202(v202:EnterpriseWebStateV202,managed:ManagedOperationsStateV197,userId:string,userName:string){
  const contracts=managed.managed_contracts.filter(c=>c.assigned_vet_id===userId||c.assigned_vet_name===userName);
  const farmIds=new Set(contracts.map(c=>c.farm_id));
  const assignment=v202.veterinary_assignments.filter(a=>a.user_id===userId&&a.active); assignment.forEach(a=>a.farm_ids.forEach(f=>farmIds.add(f)));
  const reports=managed.daily_reports.filter(r=>farmIds.size===0||farmIds.has(r.farm_id));
  const reportIds=new Set(reports.map(r=>r.id));
  return {farm_ids:[...farmIds],flock_ids:managed.flock_cycles.filter(f=>farmIds.has(f.farm_id)).map(f=>f.id),reports_awaiting_review:reports.filter(r=>r.vet_review_status==='pending'),reports_action_required:reports.filter(r=>r.vet_review_status==='action_required'),critical_cases:managed.exceptions.filter(e=>(!e.farm_id||farmIds.has(e.farm_id))&&e.status!=='resolved'&&e.severity==='critical'),tomorrow_plans:v202.tomorrow_plans.filter(p=>farmIds.size===0||farmIds.has(p.farm_id)),tasks_issued:v202.role_tasks.filter(t=>t.source_type==='tomorrow_plan'&&v202.tomorrow_plans.some(p=>p.id===t.source_id&&p.issued_by_vet===userName)),source_report_count:reportIds.size};
}

export function ownerWorkspaceV202(v202:EnterpriseWebStateV202,v20:V20State,managed:ManagedOperationsStateV197,farmId:string){
  const flock=managed.flock_cycles.find(f=>f.farm_id===farmId&&f.status==='active')||managed.flock_cycles.find(f=>f.farm_id===farmId);
  const dashboard=flock?ownerDailyDashboardV20(v20,managed,flock.id):undefined;
  const expenses=v202.expenses.filter(e=>e.farm_id===farmId&&e.status!=='rejected');
  const paid=expenses.filter(e=>e.status==='paid').reduce((s,e)=>s+e.base_amount_sar,0); const debt=v202.open_items.filter(o=>o.farm_id===farmId&&o.status!=='settled').reduce((s,o)=>s+(o.currency==='SAR'?o.balance:0),0);
  return {farm:managed.farms.find(f=>f.id===farmId),flock,dashboard,cost_today_sar:expenses.filter(e=>e.expense_date===new Date().toISOString().slice(0,10)).reduce((s,e)=>s+e.base_amount_sar,0),cost_cumulative_sar:expenses.reduce((s,e)=>s+e.base_amount_sar,0),paid_sar:paid,debt_sar:debt,pending_approvals:managed.requirements.filter(r=>r.farm_id===farmId&&r.owner_decision==='pending'),tomorrow_plan:flock?v202.tomorrow_plans.find(p=>p.flock_id===flock.id):undefined};
}

export function validateEnterpriseWebStateV202(state:EnterpriseWebStateV202,v20?:V20State,managed?:ManagedOperationsStateV197):string[]{
  const issues:string[]=[];
  if(state.version!=='20.2')issues.push('invalid_version');
  if(state.environment==='PRODUCTION'&&state.settings.production_demo_data_allowed)issues.push('production_demo_data_must_be_disabled');
  state.journal_entries.filter(j=>j.status==='posted').forEach(j=>{if(!isBalancedJournalV202(j).balanced)issues.push(`unbalanced_journal:${j.id}`);});
  state.expenses.forEach(e=>{if(!state.cost_centers.some(c=>c.id===e.cost_center_id))issues.push(`expense_missing_cost_center:${e.id}`);if(e.exchange_rate_to_sar<=0)issues.push(`expense_invalid_fx:${e.id}`);});
  state.payroll.forEach(p=>{if(!state.employees.some(e=>e.id===p.employee_id))issues.push(`payroll_missing_employee:${p.id}`);});
  state.tomorrow_plans.forEach(p=>{if(!p.issued_by_vet)issues.push(`plan_missing_vet:${p.id}`);p.task_ids.forEach(t=>{if(!state.role_tasks.some(x=>x.id===t))issues.push(`plan_missing_task:${p.id}:${t}`);});});
  if(v20&&managed) issues.push(...validateV20State(v20,managed).map(x=>`v20_1:${x}`));
  return [...new Set(issues)];
}
