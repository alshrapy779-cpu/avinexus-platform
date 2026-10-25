import type { EnterpriseWebStateV202 } from './EnterpriseWebPlatformV20_2';
import { financialStatementsV202 } from './EnterpriseWebPlatformV20_2';
import type { EnterpriseFoundationStateV2021 } from './EnterpriseFoundationV20_2_1';
import { veterinaryWorkloadV2021 } from './EnterpriseFoundationV20_2_1';
import type { VeterinaryFieldStateV2022 } from './VeterinaryFieldOperationsV20_2_2';
import { validateVeterinaryFieldStateV2022 } from './VeterinaryFieldOperationsV20_2_2';
import type { MultiBusinessEnterpriseStateV2023 } from './MultiBusinessEnterpriseV20_2_3';
import {
  businessUnitFinancialSummaryV2023,
  businessUnitDashboardV2023,
  customerBalanceV2023,
  supplierBalanceV2023,
  inventoryAvailableV2023,
  inventoryAverageCostV2023,
  treasuryBalanceV2023,
  validateMultiBusinessStateV2023,
} from './MultiBusinessEnterpriseV20_2_3';
import type { FeedFactoryOperationsStateV2024 } from './FeedFactoryOperationsV20_2_4';
import { factoryOperationsDashboardV2024, productionCostReportV2024, validateFeedFactoryStateV2024 } from './FeedFactoryOperationsV20_2_4';
import type { WorkforcePayrollStateV2025 } from './WorkforcePayrollManagedBusinessV20_2_5';
import { workforceDashboardV2025, validateWorkforcePayrollStateV2025 } from './WorkforcePayrollManagedBusinessV20_2_5';

export type IntelligenceSeverityV2026='info'|'normal'|'high'|'critical';
export type ControlExceptionStatusV2026='open'|'assigned'|'acknowledged'|'action_taken'|'verified'|'closed';
export type ReportFrequencyV2026='manual'|'daily'|'weekly'|'monthly';

export interface ControlExceptionV2026 {
  id:string; exception_number:string; type:string; severity:IntelligenceSeverityV2026; title:string; description:string;
  business_unit_id?:string; farm_id?:string; flock_id?:string; owner_user_id?:string; owner_role?:string;
  source_type:string; source_id:string; status:ControlExceptionStatusV2026; opened_at:string; due_at?:string; acknowledged_at?:string; action_taken_at?:string;
  verified_at?:string; closed_at?:string; resolution_note?:string; evidence_refs:string[]; last_seen_at:string;
}
export interface DataQualityFindingV2026 { id:string; check_code:string; severity:IntelligenceSeverityV2026; domain:string; entity_type:string; entity_id?:string; message:string; detected_at:string; resolved:boolean; }
export interface ReconciliationRunV2026 {
  id:string; run_number:string; run_at:string; run_by:string; business_unit_id?:string;
  ar_open_invoices_sar:number; ar_customer_ledger_sar:number; ar_difference_sar:number;
  ap_open_invoices_sar:number; ap_supplier_ledger_sar:number; ap_difference_sar:number;
  unbalanced_journals:number; negative_stock_rows:number; data_quality_findings:number; passed:boolean;
}
export interface ReportDefinitionV2026 { code:string; name_ar:string; name_en:string; category:'executive'|'finance'|'inventory'|'factory'|'veterinary'|'workforce'|'control'; default_frequency:ReportFrequencyV2026; active:boolean; }
export interface ReportScheduleV2026 { id:string; definition_code:string; business_unit_id?:string; frequency:Exclude<ReportFrequencyV2026,'manual'>; recipients:string[]; format:'json'|'csv'|'pdf'|'xlsx'; active:boolean; created_by:string; created_at:string; }
export interface IntelligenceReportSnapshotV2026 { id:string; report_number:string; definition_code:string; generated_at:string; generated_by:string; business_unit_id?:string; period_from:string; period_to:string; data:Record<string,unknown>; status:'final'; }
export interface IntelligenceAuditV2026 { id:string; at:string; actor:string; action:string; entity_type:string; entity_id:string; before?:unknown; after?:unknown; note?:string; }

export interface ExecutiveIntelligenceStateV2026 {
  version:'20.2.6'; migrated_from:'20.2.5'; exceptions:ControlExceptionV2026[]; data_quality_findings:DataQualityFindingV2026[];
  reconciliation_runs:ReconciliationRunV2026[]; report_definitions:ReportDefinitionV2026[]; report_schedules:ReportScheduleV2026[]; report_snapshots:IntelligenceReportSnapshotV2026[];
  audit:IntelligenceAuditV2026[]; settings:{receivable_overdue_grace_days:number; inventory_coverage_warning_days:number; contract_expiry_warning_days:number; exception_sla_hours:{normal:number;high:number;critical:number};};
}

const now=()=>new Date().toISOString();
const round=(n:number,d=2)=>Number((Number.isFinite(n)?n:0).toFixed(d));
const serial=(p:string)=>`${p}-${new Date().getFullYear()}-${String(Date.now()).slice(-9)}`;
const safe=(s:string)=>s.replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,120);
const dayDiff=(from:string,to:string)=>Math.floor((new Date(`${to.slice(0,10)}T00:00:00Z`).getTime()-new Date(`${from.slice(0,10)}T00:00:00Z`).getTime())/86400000);
const today=()=>now().slice(0,10);

const REPORT_DEFINITIONS:ReportDefinitionV2026[]=[
  {code:'EXEC_SUMMARY',name_ar:'الملخص التنفيذي',name_en:'Executive Summary',category:'executive',default_frequency:'daily',active:true},
  {code:'PROFITABILITY',name_ar:'الربحية حسب الوحدة',name_en:'Profitability by Business Unit',category:'executive',default_frequency:'monthly',active:true},
  {code:'AR_AGING',name_ar:'أعمار الذمم المدينة',name_en:'Receivables Aging',category:'finance',default_frequency:'weekly',active:true},
  {code:'AP_AGING',name_ar:'أعمار الذمم الدائنة',name_en:'Payables Aging',category:'finance',default_frequency:'weekly',active:true},
  {code:'CASH_POSITION',name_ar:'المركز النقدي',name_en:'Cash Position',category:'finance',default_frequency:'daily',active:true},
  {code:'INVENTORY_COVERAGE',name_ar:'تغطية المخزون',name_en:'Inventory Coverage',category:'inventory',default_frequency:'daily',active:true},
  {code:'FACTORY_PERFORMANCE',name_ar:'أداء المصنع',name_en:'Factory Performance',category:'factory',default_frequency:'daily',active:true},
  {code:'VET_EXCEPTIONS',name_ar:'الاستثناءات البيطرية',name_en:'Veterinary Exceptions',category:'veterinary',default_frequency:'daily',active:true},
  {code:'WORKFORCE_CONTROL',name_ar:'القوى العاملة والرواتب',name_en:'Workforce Control',category:'workforce',default_frequency:'monthly',active:true},
  {code:'DATA_QUALITY',name_ar:'جودة البيانات والمطابقة',name_en:'Data Quality & Reconciliation',category:'control',default_frequency:'daily',active:true},
];

export function buildExecutiveIntelligenceStateV2026(existing?:Partial<ExecutiveIntelligenceStateV2026>):ExecutiveIntelligenceStateV2026{
  const base:ExecutiveIntelligenceStateV2026={version:'20.2.6',migrated_from:'20.2.5',exceptions:[],data_quality_findings:[],reconciliation_runs:[],report_definitions:REPORT_DEFINITIONS,report_schedules:[],report_snapshots:[],audit:[],settings:{receivable_overdue_grace_days:0,inventory_coverage_warning_days:10,contract_expiry_warning_days:30,exception_sla_hours:{normal:72,high:24,critical:4}}};
  if(!existing)return base;
  return {...base,...existing,version:'20.2.6',migrated_from:'20.2.5',exceptions:existing.exceptions||[],data_quality_findings:existing.data_quality_findings||[],reconciliation_runs:existing.reconciliation_runs||[],report_definitions:existing.report_definitions?.length?existing.report_definitions:REPORT_DEFINITIONS,report_schedules:existing.report_schedules||[],report_snapshots:existing.report_snapshots||[],audit:existing.audit||[],settings:{...base.settings,...(existing.settings||{}),exception_sla_hours:{...base.settings.exception_sla_hours,...(existing.settings?.exception_sla_hours||{})}}};
}

function audit(state:ExecutiveIntelligenceStateV2026,actor:string,action:string,entityType:string,entityId:string,before?:unknown,after?:unknown,note?:string){const row:IntelligenceAuditV2026={id:`EIA-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,at:now(),actor,action,entity_type:entityType,entity_id:entityId,before,after,note};return {...state,audit:[row,...state.audit].slice(0,20000)};}

function agingBucket(days:number){if(days<=0)return 'current';if(days<=30)return '1_30';if(days<=60)return '31_60';if(days<=90)return '61_90';return '90_plus';}
export function receivablesAgingV2026(mb:MultiBusinessEnterpriseStateV2023,businessUnitId?:string,asOf=today()){
  const rows=mb.sales_invoices.filter(x=>x.status!=='cancelled'&&x.balance_sar>0&&(!businessUnitId||x.business_unit_id===businessUnitId)).map(x=>{const due=x.due_date||x.invoice_date;const overdueDays=Math.max(0,dayDiff(due,asOf));return {invoice_id:x.id,invoice_number:x.invoice_number,business_unit_id:x.business_unit_id,customer_id:x.customer_id,due_date:due,balance_sar:round(x.balance_sar),overdue_days:overdueDays,bucket:agingBucket(overdueDays)};});
  const totals={current:0,'1_30':0,'31_60':0,'61_90':0,'90_plus':0,total:0} as Record<string,number>;for(const r of rows){totals[r.bucket]=round((totals[r.bucket]||0)+r.balance_sar);totals.total=round(totals.total+r.balance_sar);}return {as_of:asOf,rows,totals};
}
export function payablesAgingV2026(mb:MultiBusinessEnterpriseStateV2023,businessUnitId?:string,asOf=today()){
  const rows=mb.purchase_invoices.filter(x=>x.status!=='cancelled'&&x.balance_sar>0&&(!businessUnitId||x.business_unit_id===businessUnitId)).map(x=>{const due=x.due_date||x.invoice_date;const overdueDays=Math.max(0,dayDiff(due,asOf));return {invoice_id:x.id,invoice_number:x.invoice_number,business_unit_id:x.business_unit_id,supplier_id:x.supplier_id,due_date:due,balance_sar:round(x.balance_sar),overdue_days:overdueDays,bucket:agingBucket(overdueDays)};});
  const totals={current:0,'1_30':0,'31_60':0,'61_90':0,'90_plus':0,total:0} as Record<string,number>;for(const r of rows){totals[r.bucket]=round((totals[r.bucket]||0)+r.balance_sar);totals.total=round(totals.total+r.balance_sar);}return {as_of:asOf,rows,totals};
}

export function inventoryIntelligenceV2026(mb:MultiBusinessEnterpriseStateV2023,businessUnitId?:string){
  const cutoff=Date.now()-30*86400000;const warehouses=mb.warehouses.filter(w=>w.active&&(!businessUnitId||w.business_unit_id===businessUnitId));const rows:any[]=[];
  for(const w of warehouses)for(const p of mb.products.filter(x=>x.active)){
    const available=inventoryAvailableV2023(mb,w.id,p.id);if(available===0&&!mb.inventory_movements.some(m=>m.warehouse_id===w.id&&m.product_id===p.id))continue;
    const issues=mb.inventory_movements.filter(m=>m.warehouse_id===w.id&&m.product_id===p.id&&['issue','transfer_out','return_out'].includes(m.kind)&&new Date(m.occurred_at).getTime()>=cutoff).reduce((s,m)=>s+m.quantity_base,0);
    const avgDaily=round(issues/30,4);const daysCover=avgDaily>0?round(available/avgDaily,1):null;const value=round(Math.max(0,available)*inventoryAverageCostV2023(mb,w.id,p.id));
    rows.push({business_unit_id:w.business_unit_id,warehouse_id:w.id,warehouse_name:w.name,product_id:p.id,sku:p.sku,product_name:p.name,category:p.category,available_base:round(available,4),minimum_stock_base:p.minimum_stock_base,avg_daily_issue_30d:avgDaily,days_cover:daysCover,inventory_value_sar:value,low_stock:available<=p.minimum_stock_base});
  }
  return {rows,inventory_value_sar:round(rows.reduce((s,r)=>s+r.inventory_value_sar,0)),low_stock_count:rows.filter(r=>r.low_stock).length,coverage_warning_count:rows.filter(r=>r.days_cover!==null&&r.days_cover<10).length};
}

export function profitabilityV2026(web:EnterpriseWebStateV202,mb:MultiBusinessEnterpriseStateV2023,workforce:WorkforcePayrollStateV2025){
  return mb.business_units.filter(u=>u.status==='active').map(u=>{const f=businessUnitFinancialSummaryV2023(mb,web,u.id),dash=businessUnitDashboardV2023(mb,u.id),wd=workforceDashboardV2025(workforce,mb,u.id);return {business_unit_id:u.id,code:u.code,name:u.name,type:u.type,revenue_sar:f.revenue_sar,expense_sar:f.expense_sar,profit_loss_sar:f.profit_loss_sar,margin_pct:f.revenue_sar?round(f.profit_loss_sar/f.revenue_sar*100,2):0,sales_sar:dash.sales_sar,receivables_sar:dash.receivables_sar,payables_sar:dash.payables_sar,inventory_value_sar:dash.inventory_value_sar,payroll_gross_sar:wd.payroll_gross_sar,payroll_outstanding_sar:wd.payroll_outstanding_sar};}).sort((a,b)=>b.profit_loss_sar-a.profit_loss_sar);
}

export function factoryIntelligenceV2026(feed:FeedFactoryOperationsStateV2024,mb:MultiBusinessEnterpriseStateV2023){
  const factories=mb.factories.filter(x=>x.active).map(f=>{const d=factoryOperationsDashboardV2024(feed,mb,f.id),costs=productionCostReportV2024(feed,f.id),lossKg=round(costs.reduce((s,x)=>s+x.loss_kg,0),3),costSar=round(costs.reduce((s,x)=>s+x.total_cost_sar,0)),outputKg=round(costs.reduce((s,x)=>s+x.actual_output_kg,0),3);return {factory_id:f.id,business_unit_id:f.business_unit_id,name:f.name,open_orders:d.open_orders,completed_orders:d.completed_orders,production_kg:d.production_kg,average_yield_pct:d.average_yield_pct,loss_kg:lossKg,total_production_cost_sar:costSar,weighted_cost_per_kg_sar:outputKg?round(costSar/outputKg,4):0,finished_goods_kg:d.finished_goods_kg,open_exceptions:d.open_exceptions};});
  return {factories,production_kg:round(factories.reduce((s,x)=>s+x.production_kg,0),3),loss_kg:round(factories.reduce((s,x)=>s+x.loss_kg,0),3),production_cost_sar:round(factories.reduce((s,x)=>s+x.total_production_cost_sar,0)),open_orders:factories.reduce((s,x)=>s+x.open_orders,0)};
}

export function veterinaryIntelligenceV2026(vet:VeterinaryFieldStateV2022,foundation:EnterpriseFoundationStateV2021,mb:MultiBusinessEnterpriseStateV2023,businessUnitId?:string){
  const farmIds=new Set(mb.farm_links.filter(x=>x.active&&(!businessUnitId||x.business_unit_id===businessUnitId)).map(x=>x.farm_id));const inScope=(farmId:string)=>!businessUnitId||farmIds.has(farmId);
  const cases=vet.medical_cases.filter(x=>inScope(x.farm_id));const open=cases.filter(x=>x.status!=='closed');const lab=vet.lab_orders.filter(x=>inScope(x.farm_id));const consultations=vet.consultations.filter(x=>inScope(x.farm_id));const escalations=vet.escalations.filter(x=>!x.farm_id||inScope(x.farm_id));const workload=veterinaryWorkloadV2021(foundation);
  const turnaround=lab.filter(x=>x.status==='closed'||x.status==='vet_reviewed').map(x=>{const end=x.reviewed_at||x.chain_of_custody[x.chain_of_custody.length-1]?.at;return end?Math.max(0,(new Date(end).getTime()-new Date(x.requested_at).getTime())/3600000):0});
  return {open_cases:open.length,critical_cases:open.filter(x=>x.severity==='critical').length,high_cases:open.filter(x=>x.severity==='high').length,open_escalations:escalations.filter(x=>!['closed','resolved'].includes(x.status)).length,lab_pending:lab.filter(x=>!['closed','vet_reviewed','rejected'].includes(x.status)).length,consultations_pending:consultations.filter(x=>!['closed','responded','cancelled'].includes(x.status)).length,withdrawal_locks:vet.medication_orders.filter(x=>x.safe_marketing_date&&x.safe_marketing_date>=today()&&['approved','active','completed'].includes(x.status)).length,average_lab_turnaround_hours:turnaround.length?round(turnaround.reduce((s,x)=>s+x,0)/turnaround.length,1):0,doctor_workload:workload,cases:open.slice(0,50)};
}

export function workforceIntelligenceV2026(workforce:WorkforcePayrollStateV2025,mb:MultiBusinessEnterpriseStateV2023,businessUnitId?:string){
  const d=workforceDashboardV2025(workforce,mb,businessUnitId);const todayStr=today();const absent=workforce.attendance.filter(x=>x.work_date===todayStr&&x.status==='absent'&&(!businessUnitId||x.business_unit_id===businessUnitId)).length;const overtime=round(workforce.attendance.filter(x=>!businessUnitId||x.business_unit_id===businessUnitId).reduce((s,x)=>s+x.overtime_hours,0),1);return {...d,absent_today:absent,overtime_hours:overtime,open_advances_sar:round(workforce.advances.filter(x=>x.balance_sar>0&&(!businessUnitId||x.business_unit_id===businessUnitId)).reduce((s,x)=>s+x.balance_sar,0))};
}

export function financeControlV2026(web:EnterpriseWebStateV202,mb:MultiBusinessEnterpriseStateV2023,businessUnitId?:string){
  const ar=receivablesAgingV2026(mb,businessUnitId),ap=payablesAgingV2026(mb,businessUnitId);const accounts=mb.treasury_accounts.filter(x=>x.active&&(!businessUnitId||x.business_unit_id===businessUnitId)).map(x=>({...x,current_balance:treasuryBalanceV2023(mb,x.id)}));const cash=round(accounts.reduce((s,x)=>s+x.current_balance*(x.currency==='SAR'?1:0),0));const statements=financialStatementsV202(web);return {receivables:ar,payables:ap,treasury_accounts:accounts,cash_position_sar:cash,financial_statements:statements};
}

export function executiveCommandCenterV2026(intel:ExecutiveIntelligenceStateV2026,web:EnterpriseWebStateV202,foundation:EnterpriseFoundationStateV2021,vet:VeterinaryFieldStateV2022,mb:MultiBusinessEnterpriseStateV2023,feed:FeedFactoryOperationsStateV2024,workforce:WorkforcePayrollStateV2025){
  const profit=profitabilityV2026(web,mb,workforce),finance=financeControlV2026(web,mb),inventory=inventoryIntelligenceV2026(mb),factory=factoryIntelligenceV2026(feed,mb),veterinary=veterinaryIntelligenceV2026(vet,foundation,mb),staff=workforceIntelligenceV2026(workforce,mb);const open=intel.exceptions.filter(x=>x.status!=='closed');return {generated_at:now(),business_units:mb.business_units.filter(x=>x.status==='active').length,farms:new Set(mb.farm_links.filter(x=>x.active).map(x=>x.farm_id)).size,customers:mb.customers.filter(x=>x.active).length,suppliers:mb.suppliers.filter(x=>x.active).length,revenue_sar:round(profit.reduce((s,x)=>s+x.revenue_sar,0)),expense_sar:round(profit.reduce((s,x)=>s+x.expense_sar,0)),profit_loss_sar:round(profit.reduce((s,x)=>s+x.profit_loss_sar,0)),receivables_sar:finance.receivables.totals.total,payables_sar:finance.payables.totals.total,cash_position_sar:finance.cash_position_sar,inventory_value_sar:inventory.inventory_value_sar,low_stock_count:inventory.low_stock_count,critical_medical_cases:veterinary.critical_cases,open_medical_cases:veterinary.open_cases,active_employees:staff.active_employees,payroll_outstanding_sar:staff.payroll_outstanding_sar,factory_production_kg:factory.production_kg,factory_loss_kg:factory.loss_kg,open_exceptions:open.length,critical_exceptions:open.filter(x=>x.severity==='critical').length,data_quality_open:intel.data_quality_findings.filter(x=>!x.resolved).length,unit_profitability:profit};
}

function exceptionKey(type:string,sourceType:string,sourceId:string){return `${type}|${sourceType}|${sourceId}`;}
function dueFor(severity:IntelligenceSeverityV2026,state:ExecutiveIntelligenceStateV2026){const hours=severity==='critical'?state.settings.exception_sla_hours.critical:severity==='high'?state.settings.exception_sla_hours.high:state.settings.exception_sla_hours.normal;return new Date(Date.now()+hours*3600000).toISOString();}
export function refreshControlExceptionsV2026(state:ExecutiveIntelligenceStateV2026,mb:MultiBusinessEnterpriseStateV2023,vet:VeterinaryFieldStateV2022,workforce:WorkforcePayrollStateV2025,actor:string){
  const candidates:Array<Omit<ControlExceptionV2026,'id'|'exception_number'|'status'|'opened_at'|'last_seen_at'|'evidence_refs'>>=[];
  for(const e of mb.exceptions.filter(x=>x.status!=='resolved'))candidates.push({type:e.type,severity:e.severity==='critical'?'critical':e.severity==='high'?'high':'normal',title:e.title,description:`Business exception ${e.exception_number}`,business_unit_id:e.business_unit_id,source_type:e.source_type,source_id:e.source_id,due_at:undefined});
  for(const i of mb.sales_invoices.filter(x=>x.balance_sar>0&&x.due_date&&x.due_date<today()))candidates.push({type:'overdue_receivable',severity:dayDiff(i.due_date!,today())>60?'high':'normal',title:`Overdue receivable ${i.invoice_number}`,description:`Outstanding SAR ${round(i.balance_sar)} overdue ${dayDiff(i.due_date!,today())} days`,business_unit_id:i.business_unit_id,source_type:'sales_invoice',source_id:i.id,due_at:undefined});
  for(const p of mb.purchase_invoices.filter(x=>x.balance_sar>0&&x.due_date&&x.due_date<today()))candidates.push({type:'overdue_payable',severity:dayDiff(p.due_date!,today())>60?'high':'normal',title:`Overdue payable ${p.invoice_number}`,description:`Outstanding SAR ${round(p.balance_sar)} overdue ${dayDiff(p.due_date!,today())} days`,business_unit_id:p.business_unit_id,source_type:'purchase_invoice',source_id:p.id,due_at:undefined});
  for(const c of vet.medical_cases.filter(x=>x.status!=='closed'&&['high','critical'].includes(x.severity)))candidates.push({type:'medical_case',severity:c.severity==='critical'?'critical':'high',title:`${c.severity.toUpperCase()} medical case ${c.case_number}`,description:c.presenting_problem,farm_id:c.farm_id,flock_id:c.flock_id,source_type:'medical_case',source_id:c.id,due_at:undefined});
  for(const c of workforce.compensation_contracts.filter(x=>x.status==='active'&&x.end_date&&dayDiff(today(),x.end_date)>=0&&dayDiff(today(),x.end_date)<=state.settings.contract_expiry_warning_days))candidates.push({type:'employee_contract_expiry',severity:'normal',title:`Contract expiry ${c.contract_number}`,description:`Contract expires ${c.end_date}`,business_unit_id:c.business_unit_id,source_type:'compensation_contract',source_id:c.id,due_at:c.end_date});
  let next={...state,exceptions:[...state.exceptions]};const seen=new Set<string>();for(const c of candidates){const key=exceptionKey(c.type,c.source_type,c.source_id);seen.add(key);const existing=next.exceptions.find(x=>exceptionKey(x.type,x.source_type,x.source_id)===key&&x.status!=='closed');if(existing){next={...next,exceptions:next.exceptions.map(x=>x.id===existing.id?{...x,last_seen_at:now(),severity:c.severity,title:c.title,description:c.description}:x)};}else{const row:ControlExceptionV2026={...c,id:`EXC-${safe(key)}`,exception_number:serial('EXC'),status:'open',opened_at:now(),last_seen_at:now(),due_at:c.due_at||dueFor(c.severity,state),evidence_refs:[]};next={...next,exceptions:[row,...next.exceptions]};}}
  return audit(next,actor,'refresh_exceptions','exception_center','all',undefined,{active_candidates:candidates.length},'Derived from operational source systems');
}

export function updateControlExceptionV2026(state:ExecutiveIntelligenceStateV2026,id:string,input:{status?:ControlExceptionStatusV2026;owner_user_id?:string;owner_role?:string;resolution_note?:string;evidence_refs?:string[]},actor:string){const old=state.exceptions.find(x=>x.id===id);if(!old)throw new Error('control_exception_not_found');const status=input.status||old.status;const patch:any={...old,...input,status,last_seen_at:now()};if(status==='acknowledged'&&!old.acknowledged_at)patch.acknowledged_at=now();if(status==='action_taken'&&!old.action_taken_at)patch.action_taken_at=now();if(status==='verified'&&!old.verified_at)patch.verified_at=now();if(status==='closed'&&!old.closed_at)patch.closed_at=now();const next={...state,exceptions:state.exceptions.map(x=>x.id===id?patch:x)};return audit(next,actor,'update_exception','control_exception',id,old,patch);}

export function runDataQualityScanV2026(state:ExecutiveIntelligenceStateV2026,web:EnterpriseWebStateV202,foundation:EnterpriseFoundationStateV2021,vet:VeterinaryFieldStateV2022,mb:MultiBusinessEnterpriseStateV2023,feed:FeedFactoryOperationsStateV2024,workforce:WorkforcePayrollStateV2025){
  const findings:DataQualityFindingV2026[]=[];const add=(code:string,domain:string,message:string,severity:IntelligenceSeverityV2026='high',entityType='state',entityId?:string)=>findings.push({id:`DQ-${safe(code+'-'+(entityId||message))}`,check_code:code,severity,domain,entity_type:entityType,entity_id:entityId,message,detected_at:now(),resolved:false});
  for(const x of validateMultiBusinessStateV2023(mb,web))add('MULTI_BUSINESS_VALIDATION','multi_business',x);
  for(const x of validateVeterinaryFieldStateV2022(vet,web,foundation))add('VETERINARY_VALIDATION','veterinary',x);
  for(const x of validateFeedFactoryStateV2024(feed,mb,web))add('FACTORY_VALIDATION','factory',x);
  for(const x of validateWorkforcePayrollStateV2025(workforce,mb,web,feed))add('WORKFORCE_VALIDATION','workforce',x);
  for(const j of web.journal_entries.filter(x=>x.status==='posted')){const d=round(j.lines.reduce((s,l)=>s+l.debit_sar,0)),c=round(j.lines.reduce((s,l)=>s+l.credit_sar,0));if(Math.abs(d-c)>0.01)add('UNBALANCED_JOURNAL','finance',`Journal ${j.journal_number} difference ${round(d-c)}`,'critical','journal',j.id);}
  for(const w of mb.warehouses)for(const p of mb.products){const qty=inventoryAvailableV2023(mb,w.id,p.id);if(qty<-0.0001)add('NEGATIVE_STOCK','inventory',`${w.name} / ${p.name}: ${qty}`,'critical','warehouse_product',`${w.id}:${p.id}`);}
  const next={...state,data_quality_findings:findings};return next;
}

export function runReconciliationV2026(state:ExecutiveIntelligenceStateV2026,web:EnterpriseWebStateV202,mb:MultiBusinessEnterpriseStateV2023,actor:string,businessUnitId?:string){
  const sales=mb.sales_invoices.filter(x=>x.status!=='cancelled'&&(!businessUnitId||x.business_unit_id===businessUnitId));const purchases=mb.purchase_invoices.filter(x=>x.status!=='cancelled'&&(!businessUnitId||x.business_unit_id===businessUnitId));const customerIds=mb.customers.filter(x=>!businessUnitId||x.business_unit_id===businessUnitId).map(x=>x.id);const supplierIds=mb.suppliers.filter(x=>!businessUnitId||x.business_unit_id===businessUnitId).map(x=>x.id);const arInvoices=round(sales.reduce((s,x)=>s+x.balance_sar,0)),arLedger=round(customerIds.reduce((s,id)=>s+customerBalanceV2023(mb,id),0)),apInvoices=round(purchases.reduce((s,x)=>s+x.balance_sar,0)),apLedger=round(supplierIds.reduce((s,id)=>s+supplierBalanceV2023(mb,id),0));const unbalanced=web.journal_entries.filter(x=>x.status==='posted'&&Math.abs(x.lines.reduce((s,l)=>s+l.debit_sar-l.credit_sar,0))>0.01).length;let negative=0;for(const w of mb.warehouses.filter(x=>!businessUnitId||x.business_unit_id===businessUnitId))for(const p of mb.products)if(inventoryAvailableV2023(mb,w.id,p.id)<-0.0001)negative++;const run:ReconciliationRunV2026={id:`REC-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,run_number:serial('REC'),run_at:now(),run_by:actor,business_unit_id:businessUnitId,ar_open_invoices_sar:arInvoices,ar_customer_ledger_sar:arLedger,ar_difference_sar:round(arInvoices-arLedger),ap_open_invoices_sar:apInvoices,ap_supplier_ledger_sar:apLedger,ap_difference_sar:round(apInvoices-apLedger),unbalanced_journals:unbalanced,negative_stock_rows:negative,data_quality_findings:state.data_quality_findings.filter(x=>!x.resolved).length,passed:Math.abs(arInvoices-arLedger)<=0.01&&Math.abs(apInvoices-apLedger)<=0.01&&unbalanced===0&&negative===0};let next={...state,reconciliation_runs:[run,...state.reconciliation_runs].slice(0,1000)};next=audit(next,actor,'run_reconciliation','reconciliation',run.id,undefined,run);return {state:next,run};
}

export function generateIntelligenceReportV2026(state:ExecutiveIntelligenceStateV2026,web:EnterpriseWebStateV202,foundation:EnterpriseFoundationStateV2021,vet:VeterinaryFieldStateV2022,mb:MultiBusinessEnterpriseStateV2023,feed:FeedFactoryOperationsStateV2024,workforce:WorkforcePayrollStateV2025,input:{definition_code:string;period_from:string;period_to:string;generated_by:string;business_unit_id?:string}){
  if(!state.report_definitions.some(x=>x.code===input.definition_code&&x.active))throw new Error('report_definition_not_found');let data:Record<string,unknown>={};switch(input.definition_code){case'EXEC_SUMMARY':data=executiveCommandCenterV2026(state,web,foundation,vet,mb,feed,workforce);break;case'PROFITABILITY':data={rows:profitabilityV2026(web,mb,workforce).filter(x=>!input.business_unit_id||x.business_unit_id===input.business_unit_id)};break;case'AR_AGING':data=receivablesAgingV2026(mb,input.business_unit_id,input.period_to);break;case'AP_AGING':data=payablesAgingV2026(mb,input.business_unit_id,input.period_to);break;case'CASH_POSITION':data=financeControlV2026(web,mb,input.business_unit_id);break;case'INVENTORY_COVERAGE':data=inventoryIntelligenceV2026(mb,input.business_unit_id);break;case'FACTORY_PERFORMANCE':data=factoryIntelligenceV2026(feed,mb);break;case'VET_EXCEPTIONS':data=veterinaryIntelligenceV2026(vet,foundation,mb,input.business_unit_id);break;case'WORKFORCE_CONTROL':data=workforceIntelligenceV2026(workforce,mb,input.business_unit_id);break;case'DATA_QUALITY':data={findings:state.data_quality_findings.filter(x=>!x.resolved),latest_reconciliation:state.reconciliation_runs[0]};break;default:throw new Error('report_generator_not_implemented');}
  const snap:IntelligenceReportSnapshotV2026={id:`RPT-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,report_number:serial('RPT'),definition_code:input.definition_code,generated_at:now(),generated_by:input.generated_by,business_unit_id:input.business_unit_id,period_from:input.period_from,period_to:input.period_to,data,status:'final'};let next={...state,report_snapshots:[snap,...state.report_snapshots].slice(0,5000)};next=audit(next,input.generated_by,'generate_report','intelligence_report',snap.id,undefined,{definition_code:snap.definition_code,business_unit_id:snap.business_unit_id});return {state:next,report:snap};
}

export function createReportScheduleV2026(state:ExecutiveIntelligenceStateV2026,input:Omit<ReportScheduleV2026,'id'|'created_at'>){if(!state.report_definitions.some(x=>x.code===input.definition_code&&x.active))throw new Error('report_definition_not_found');const row:ReportScheduleV2026={...input,id:`RPS-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,created_at:now()};return audit({...state,report_schedules:[row,...state.report_schedules]},input.created_by,'create_report_schedule','report_schedule',row.id,undefined,row);}

export function drilldownV2026(web:EnterpriseWebStateV202,vet:VeterinaryFieldStateV2022,mb:MultiBusinessEnterpriseStateV2023,feed:FeedFactoryOperationsStateV2024,workforce:WorkforcePayrollStateV2025,sourceType:string,sourceId:string){
  const find=(rows:any[])=>rows.find(x=>x.id===sourceId);const maps:Record<string,()=>unknown>={sales_invoice:()=>find(mb.sales_invoices),purchase_invoice:()=>find(mb.purchase_invoices),goods_receipt:()=>find(mb.goods_receipts),customer:()=>find(mb.customers),supplier:()=>find(mb.suppliers),medical_case:()=>find(vet.medical_cases),lab_order:()=>find(vet.lab_orders),manufacturing_order:()=>find(feed.manufacturing_orders),production_batch:()=>find(feed.production_batches),factory_dispatch:()=>find(feed.dispatches),employee:()=>workforce.profiles.find(x=>x.employee_id===sourceId||x.id===sourceId),payroll_line:()=>find(workforce.payroll_lines),journal:()=>find(web.journal_entries),role_task:()=>find(web.role_tasks)};const entity=maps[sourceType]?.();if(!entity)throw new Error('drilldown_source_not_found');return {source_type:sourceType,source_id:sourceId,entity};
}

export function validateExecutiveIntelligenceStateV2026(state:ExecutiveIntelligenceStateV2026):string[]{const issues:string[]=[];const uniq=(rows:string[],label:string)=>{const s=new Set<string>();for(const x of rows){if(s.has(x))issues.push(`${label}_duplicate:${x}`);s.add(x)}};uniq(state.report_definitions.map(x=>x.code),'report_definition');uniq(state.report_schedules.map(x=>x.id),'report_schedule');uniq(state.report_snapshots.map(x=>x.report_number),'report_number');uniq(state.reconciliation_runs.map(x=>x.run_number),'reconciliation_run');uniq(state.exceptions.map(x=>x.id),'control_exception_id');for(const e of state.exceptions)if(e.status==='closed'&&!e.closed_at)issues.push(`closed_exception_missing_timestamp:${e.id}`);for(const s of state.report_schedules)if(!state.report_definitions.some(x=>x.code===s.definition_code))issues.push(`schedule_orphan_definition:${s.id}`);return issues;}
