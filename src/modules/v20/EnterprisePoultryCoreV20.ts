import type { CurrencyV195, PlatformRoleV195 } from '../platform/PlatformCoreV19_5';
import type {
  DailyFarmReportV197,
  ManagedOperationsStateV197,
  PoultrySaleV197,
  PlacementReceiptV197,
} from '../managed/ManagedPoultryOperationsV19_7';

export type V20ReportStatus = 'incomplete'|'awaiting_worker_confirmation'|'awaiting_vet_review'|'closed'|'reopened';
export type PopulationEventTypeV20 = 'placement'|'arrival_mortality'|'farm_mortality'|'cull'|'sale'|'transport_mortality'|'transfer_in'|'transfer_out'|'reconciliation_adjustment';
export type ReportKindV20 = 'daily'|'weekly'|'cycle'|'finance'|'clinical'|'biosecurity'|'procurement'|'sales'|'audit';

export interface PopulationLedgerEventV20 {
  id:string;
  flock_id:string;
  farm_id:string;
  at:string;
  event_type:PopulationEventTypeV20;
  quantity:number;
  signed_quantity:number;
  source_type:string;
  source_id:string;
  actor?:string;
  reason:string;
  evidence_refs:string[];
  immutable_source:boolean;
}

export interface FlockReconciliationAdjustmentV20 {
  id:string;
  flock_id:string;
  farm_id:string;
  at:string;
  quantity_delta:number;
  reason:string;
  requested_by:string;
  requested_by_role:PlatformRoleV195|string;
  approved_by?:string;
  status:'pending'|'approved'|'rejected'|'reversed';
  evidence_refs:string[];
  reversal_of_id?:string;
}

export interface DailyFlockClosureV20 {
  id:string;
  closure_number:string;
  flock_id:string;
  farm_id:string;
  report_date:string;
  status:V20ReportStatus;
  completeness_score:number;
  missing_fields:string[];
  population_reconciled:boolean;
  population_discrepancy:number;
  worker_submitted_by:string;
  worker_submitted_at:string;
  ai_checked_at?:string;
  ai_issues:string[];
  vet_reviewed_by?:string;
  vet_reviewed_at?:string;
  closed_at?:string;
  reopened_at?:string;
  reopen_reason?:string;
}

export interface ReportSnapshotV20 {
  id:string;
  report_number:string;
  kind:ReportKindV20;
  farm_id?:string;
  flock_id?:string;
  period_from:string;
  period_to:string;
  generated_at:string;
  generated_by:string;
  status:'draft'|'final';
  data:Record<string,unknown>;
}

export interface AuditMutationV20 {
  id:string;
  at:string;
  actor:string;
  actor_role:string;
  device_id?:string;
  gps?:{lat:number;lng:number};
  entity_type:string;
  entity_id:string;
  action:string;
  old_value?:unknown;
  new_value?:unknown;
  reason:string;
  approval_ref?:string;
  evidence_refs:string[];
}

export interface V20State {
  version:'20.1';
  migrated_from:'19.7';
  reconciliation_adjustments:FlockReconciliationAdjustmentV20[];
  daily_closures:DailyFlockClosureV20[];
  report_snapshots:ReportSnapshotV20[];
  audit_mutations:AuditMutationV20[];
  settings:{
    minimum_daily_completeness_percent:number;
    require_population_reconciliation:boolean;
    weight_uniformity_band_percent:number;
    feed_days_warning:number;
    mortality_warning_percent:number;
    mortality_critical_percent:number;
    lock_closed_day:boolean;
    require_vet_close:boolean;
    preserve_v19_routes:boolean;
  };
}

export interface FlockMasterRecordV20 {
  flock_id:string;
  flock_code:string;
  farm_id:string;
  farm_name:string;
  house_id:string;
  house_name?:string;
  breed:string;
  hatchery_name:string;
  hatch_date?:string;
  placement_date?:string;
  age_days:number;
  document_count:number;
  received_count:number;
  arrival_mortality:number;
  initial_accepted:number;
  current_recorded:number;
  current_theoretical:number;
  population_discrepancy:number;
  farm_mortality_cumulative:number;
  farm_mortality_percent:number;
  mortality_today:number;
  mortality_today_percent:number;
  culls_cumulative:number;
  sold_cumulative:number;
  transport_mortality_cumulative:number;
  approved_adjustment_net:number;
  livability_percent:number;
  last_report_date?:string;
  last_updated_at?:string;
  status:string;
}

export interface WeightMetricsV20 {
  measured:boolean;
  sample_count:number;
  avg_g?:number;
  median_g?:number;
  min_g?:number;
  max_g?:number;
  cv_percent?:number;
  uniformity_percent?:number;
  daily_gain_g?:number;
  expected_weight_g?:number;
  variance_percent?:number;
  condition?:string;
  time?:string;
  sampling_locations:string[];
}

export interface FeedMetricsV20 {
  opening_kg:number;
  received_kg:number;
  used_kg:number;
  closing_kg:number;
  cumulative_used_kg:number;
  feed_per_bird_g:number;
  estimated_days_remaining:number|null;
  operational_fcr:number|null;
  fcr_formula:'cumulative_feed/live_biomass'|'not_available';
}

export interface WaterEnvironmentMetricsV20 {
  water_liters:number;
  cumulative_water_liters:number;
  water_per_bird_liters:number;
  water_feed_ratio:number|null;
  temperature_min_c:number|null;
  temperature_max_c:number|null;
  temperature_avg_c:number|null;
  humidity_min_pct:number|null;
  humidity_max_pct:number|null;
}

export interface DataCompletenessV20 {
  score:number;
  complete:boolean;
  missing:string[];
  checked_fields:string[];
}

export interface OwnerDailyDashboardV20 {
  master:FlockMasterRecordV20;
  weight:WeightMetricsV20;
  feed:FeedMetricsV20;
  environment:WaterEnvironmentMetricsV20;
  completeness:DataCompletenessV20;
  cost_today_sar:number;
  cost_cumulative_sar:number;
  outstanding_sar:number;
  paid_sar:number;
  pending_owner_approvals:number;
  open_clinical_signals:number;
  feed_warning:boolean;
  mortality_warning:boolean;
}

export interface ExecutiveFarmRowV20 {
  farm_id:string;
  farm_name:string;
  flock_id:string;
  flock_code:string;
  age_days:number;
  live_birds:number;
  cumulative_mortality_percent:number;
  daily_mortality_percent:number;
  avg_weight_g?:number;
  weight_variance_percent?:number;
  fcr:number|null;
  feed_days_remaining:number|null;
  biosecurity_score:number;
  compliance_score:number;
  data_completeness:number;
  outstanding_sar:number;
  open_exceptions:number;
  daily_close_status:V20ReportStatus|'not_started';
}

const nowIso=()=>new Date().toISOString();
const uid=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const serial=(prefix:string)=>`${prefix}-YE-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;
const round=(n:number,d=2)=>Number((Number.isFinite(n)?n:0).toFixed(d));

export function buildV20State(existing?:Partial<V20State>):V20State {
  const base:V20State={
    version:'20.1',
    migrated_from:'19.7',
    reconciliation_adjustments:[],
    daily_closures:[],
    report_snapshots:[],
    audit_mutations:[],
    settings:{
      minimum_daily_completeness_percent:90,
      require_population_reconciliation:true,
      weight_uniformity_band_percent:10,
      feed_days_warning:2,
      mortality_warning_percent:0.25,
      mortality_critical_percent:0.5,
      lock_closed_day:true,
      require_vet_close:true,
      preserve_v19_routes:true,
    }
  };
  if(!existing) return base;
  return {
    ...base,
    ...existing,
    version:'20.1',
    migrated_from:'19.7',
    reconciliation_adjustments:existing.reconciliation_adjustments||[],
    daily_closures:existing.daily_closures||[],
    report_snapshots:existing.report_snapshots||[],
    audit_mutations:existing.audit_mutations||[],
    settings:{...base.settings,...(existing.settings||{})},
  };
}

function reportMortality(report:DailyFarmReportV197){
  if(Number.isFinite(report.mortality)) return Math.max(0,report.mortality||0);
  return Math.max(0,(report.mortality_morning||0)+(report.mortality_evening||0));
}

function latestReportForFlock(managed:ManagedOperationsStateV197,flockId:string){
  return managed.daily_reports.filter(r=>r.flock_id===flockId).sort((a,b)=>`${b.report_date} ${b.submitted_at}`.localeCompare(`${a.report_date} ${a.submitted_at}`))[0];
}

function latestReportDate(managed:ManagedOperationsStateV197,flockId:string){
  return latestReportForFlock(managed,flockId)?.report_date;
}

function placementForFlock(managed:ManagedOperationsStateV197,flockId:string):PlacementReceiptV197|undefined {
  return managed.placements.filter(p=>p.flock_id===flockId).sort((a,b)=>b.received_at.localeCompare(a.received_at))[0];
}

export function buildPopulationLedgerV20(v20:V20State,managed:ManagedOperationsStateV197,flockId:string):PopulationLedgerEventV20[] {
  const flock=managed.flock_cycles.find(f=>f.id===flockId);
  if(!flock) return [];
  const farm=managed.farms.find(f=>f.id===flock.farm_id);
  const events:PopulationLedgerEventV20[]=[];
  const placement=placementForFlock(managed,flockId);
  if(placement){
    events.push({id:`ledger-placement-${placement.id}`,flock_id:flockId,farm_id:flock.farm_id,at:placement.received_at,event_type:'placement',quantity:placement.accepted_initial_count,signed_quantity:placement.accepted_initial_count,source_type:'placement_receipt',source_id:placement.id,actor:placement.received_by,reason:'العدد المعتمد كبداية للدورة بعد نافق الوصول',evidence_refs:[...placement.documents,...placement.photo_refs],immutable_source:true});
    if(placement.arrival_mortality>0){
      events.push({id:`ledger-arrival-${placement.id}`,flock_id:flockId,farm_id:flock.farm_id,at:placement.received_at,event_type:'arrival_mortality',quantity:placement.arrival_mortality,signed_quantity:0,source_type:'placement_receipt',source_id:placement.id,actor:placement.received_by,reason:'نافق الوصول مسجل بصورة مستقلة ولا يخصم مرة ثانية من العدد المعتمد',evidence_refs:placement.photo_refs,immutable_source:true});
    }
  } else if(flock.initial_count>0){
    events.push({id:`ledger-initial-${flock.id}`,flock_id:flockId,farm_id:flock.farm_id,at:flock.placement_date||nowIso(),event_type:'placement',quantity:flock.initial_count,signed_quantity:flock.initial_count,source_type:'flock_cycle',source_id:flock.id,reason:'عدد ابتدائي مرحّل من V19.7 لعدم وجود سند استلام تفصيلي',evidence_refs:[],immutable_source:true});
  }
  managed.daily_reports.filter(r=>r.flock_id===flockId).forEach(r=>{
    const mortality=reportMortality(r);
    if(mortality>0) events.push({id:`ledger-mort-${r.id}`,flock_id:flockId,farm_id:flock.farm_id,at:r.submitted_at,event_type:'farm_mortality',quantity:mortality,signed_quantity:-mortality,source_type:'daily_report',source_id:r.id,actor:r.entered_by,reason:`نافق المزرعة — ${r.report_date} / ${r.shift}`,evidence_refs:r.media_refs,immutable_source:true});
    if((r.culls||0)>0) events.push({id:`ledger-cull-${r.id}`,flock_id:flockId,farm_id:flock.farm_id,at:r.submitted_at,event_type:'cull',quantity:r.culls,signed_quantity:-r.culls,source_type:'daily_report',source_id:r.id,actor:r.entered_by,reason:`استبعاد/Cull — ${r.report_date}`,evidence_refs:r.media_refs,immutable_source:true});
  });
  managed.poultry_sales.filter(s=>s.flock_id===flockId&&['delivered','settled'].includes(s.status)).forEach((s:PoultrySaleV197)=>{
    const delivered=Math.max(0,s.delivered_birds||0);
    const transport=Math.max(0,s.transport_mortality||0);
    if(delivered>0) events.push({id:`ledger-sale-${s.id}`,flock_id:flockId,farm_id:flock.farm_id,at:s.arrived_at||s.departed_at||nowIso(),event_type:'sale',quantity:delivered,signed_quantity:-delivered,source_type:'poultry_sale',source_id:s.id,actor:s.receiver_name||s.buyer_name,reason:`بيع وتسليم ${s.sale_number}`,evidence_refs:s.pod_reference?[s.pod_reference]:[],immutable_source:true});
    if(transport>0) events.push({id:`ledger-transmort-${s.id}`,flock_id:flockId,farm_id:flock.farm_id,at:s.arrived_at||nowIso(),event_type:'transport_mortality',quantity:transport,signed_quantity:-transport,source_type:'poultry_sale',source_id:s.id,actor:s.driver_name,reason:`نافق النقل — ${s.sale_number}`,evidence_refs:s.pod_reference?[s.pod_reference]:[],immutable_source:true});
  });
  v20.reconciliation_adjustments.filter(a=>a.flock_id===flockId&&a.status==='approved').forEach(a=>events.push({id:`ledger-adj-${a.id}`,flock_id:flockId,farm_id:a.farm_id,at:a.at,event_type:'reconciliation_adjustment',quantity:Math.abs(a.quantity_delta),signed_quantity:a.quantity_delta,source_type:'reconciliation_adjustment',source_id:a.id,actor:a.approved_by||a.requested_by,reason:a.reason,evidence_refs:a.evidence_refs,immutable_source:false}));
  return events.sort((a,b)=>a.at.localeCompare(b.at)||a.id.localeCompare(b.id));
}

export function buildFlockMasterRecordV20(v20:V20State,managed:ManagedOperationsStateV197,flockId:string,asOfDate?:string):FlockMasterRecordV20 {
  const flock=managed.flock_cycles.find(f=>f.id===flockId);
  if(!flock) throw new Error('القطيع غير موجود');
  const farm=managed.farms.find(f=>f.id===flock.farm_id);
  const house=managed.houses.find(h=>h.id===flock.house_id);
  const placement=placementForFlock(managed,flockId);
  const ledger=buildPopulationLedgerV20(v20,managed,flockId).filter(e=>!asOfDate||e.at.slice(0,10)<=asOfDate);
  const initial=placement?.accepted_initial_count||flock.initial_count||0;
  const farmMort=ledger.filter(e=>e.event_type==='farm_mortality').reduce((s,e)=>s+e.quantity,0);
  const culls=ledger.filter(e=>e.event_type==='cull').reduce((s,e)=>s+e.quantity,0);
  const sold=ledger.filter(e=>e.event_type==='sale').reduce((s,e)=>s+e.quantity,0);
  const transport=ledger.filter(e=>e.event_type==='transport_mortality').reduce((s,e)=>s+e.quantity,0);
  const adjustment=ledger.filter(e=>e.event_type==='reconciliation_adjustment').reduce((s,e)=>s+e.signed_quantity,0);
  const theoretical=Math.max(0,initial-farmMort-culls-sold-transport+adjustment);
  const reportDate=asOfDate||latestReportDate(managed,flockId);
  const mortalityToday=reportDate?managed.daily_reports.filter(r=>r.flock_id===flockId&&r.report_date===reportDate).reduce((s,r)=>s+reportMortality(r),0):0;
  const activeBeforeSales=Math.max(0,initial-farmMort-culls);
  const reports=managed.daily_reports.filter(r=>r.flock_id===flockId).sort((a,b)=>b.submitted_at.localeCompare(a.submitted_at));
  const lastReport=reports[0];
  return {
    flock_id:flock.id,flock_code:flock.flock_code,farm_id:flock.farm_id,farm_name:farm?.name||'',house_id:flock.house_id,house_name:house?.name,
    breed:flock.breed,hatchery_name:flock.hatchery_name,hatch_date:placement?.hatch_date,placement_date:placement?.received_at||flock.placement_date,age_days:flock.age_days,
    document_count:placement?.document_count||initial,received_count:placement?.received_count||initial,arrival_mortality:placement?.arrival_mortality||0,initial_accepted:initial,
    current_recorded:flock.current_count,current_theoretical:theoretical,population_discrepancy:flock.current_count-theoretical,farm_mortality_cumulative:farmMort,
    farm_mortality_percent:initial?round(farmMort/initial*100,3):0,mortality_today:mortalityToday,mortality_today_percent:initial?round(mortalityToday/initial*100,3):0,
    culls_cumulative:culls,sold_cumulative:sold,transport_mortality_cumulative:transport,approved_adjustment_net:adjustment,
    livability_percent:initial?round(activeBeforeSales/initial*100,2):0,last_report_date:lastReport?.report_date,last_updated_at:lastReport?.submitted_at,status:flock.status,
  };
}

function median(values:number[]){
  if(!values.length) return undefined;
  const s=[...values].sort((a,b)=>a-b); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2;
}

export function weightMetricsV20(managed:ManagedOperationsStateV197,flockId:string,uniformityBandPercent=10):WeightMetricsV20 {
  const reports=managed.daily_reports.filter(r=>r.flock_id===flockId&&r.sample_weights_g?.length).sort((a,b)=>b.submitted_at.localeCompare(a.submitted_at));
  const r=reports[0]; if(!r) return {measured:false,sample_count:0,sampling_locations:[]};
  const values=r.sample_weights_g.filter(x=>Number.isFinite(x)&&x>0); if(!values.length) return {measured:false,sample_count:0,sampling_locations:r.sampling_locations||[]};
  const avg=values.reduce((s,x)=>s+x,0)/values.length; const med=median(values)!; const variance=values.reduce((s,x)=>s+Math.pow(x-avg,2),0)/values.length; const sd=Math.sqrt(variance); const cv=avg?sd/avg*100:0; const band=avg*uniformityBandPercent/100; const within=values.filter(x=>x>=avg-band&&x<=avg+band).length;
  const previous=reports[1]?.avg_weight_g || (reports[1]?.sample_weights_g?.length?reports[1].sample_weights_g.reduce((s,x)=>s+x,0)/reports[1].sample_weights_g.length:undefined);
  return {measured:true,sample_count:values.length,avg_g:round(avg,1),median_g:round(med,1),min_g:Math.min(...values),max_g:Math.max(...values),cv_percent:round(cv,2),uniformity_percent:round(within/values.length*100,1),daily_gain_g:previous!==undefined?round(avg-previous,1):r.daily_gain_g,expected_weight_g:r.expected_weight_g,variance_percent:r.expected_weight_g?round((avg-r.expected_weight_g)/r.expected_weight_g*100,2):r.weight_variance_percent,condition:r.weight_condition,time:r.weight_time,sampling_locations:r.sampling_locations||[]};
}

export function feedMetricsV20(v20:V20State,managed:ManagedOperationsStateV197,flockId:string):FeedMetricsV20 {
  const reports=managed.daily_reports.filter(r=>r.flock_id===flockId).sort((a,b)=>a.submitted_at.localeCompare(b.submitted_at));
  const last=reports[reports.length-1]; const cumulative=reports.reduce((s,r)=>s+Math.max(0,r.feed_used_kg||0),0); const recent=reports.slice(-3).map(r=>Math.max(0,r.feed_used_kg||0)).filter(x=>x>0); const avgRecent=recent.length?recent.reduce((s,x)=>s+x,0)/recent.length:0;
  const master=buildFlockMasterRecordV20(v20,managed,flockId); const wm=weightMetricsV20(managed,flockId,v20.settings.weight_uniformity_band_percent); const biomass=wm.avg_g?master.current_theoretical*wm.avg_g/1000:0;
  return {opening_kg:last?.feed_opening_kg||0,received_kg:last?.feed_received_kg||0,used_kg:last?.feed_used_kg||0,closing_kg:last?.feed_closing_kg||0,cumulative_used_kg:round(cumulative,2),feed_per_bird_g:last&&last.opening_birds?round(last.feed_used_kg*1000/last.opening_birds,1):0,estimated_days_remaining:avgRecent>0?round((last?.feed_closing_kg||0)/avgRecent,2):null,operational_fcr:biomass>0?round(cumulative/biomass,3):null,fcr_formula:biomass>0?'cumulative_feed/live_biomass':'not_available'};
}

export function waterEnvironmentMetricsV20(managed:ManagedOperationsStateV197,flockId:string):WaterEnvironmentMetricsV20 {
  const reports=managed.daily_reports.filter(r=>r.flock_id===flockId).sort((a,b)=>a.submitted_at.localeCompare(b.submitted_at)); const last=reports[reports.length-1]; const water=reports.reduce((s,r)=>s+Math.max(0,r.water_liters||0),0); const feed=last?.feed_used_kg||0; const temp=last?.temperature_points_c?.filter(Number.isFinite)||[]; const avgTemp=temp.length?temp.reduce((s,x)=>s+x,0)/temp.length:null;
  return {water_liters:last?.water_liters||0,cumulative_water_liters:round(water,1),water_per_bird_liters:last?.opening_birds?round(last.water_liters/last.opening_birds,4):0,water_feed_ratio:feed>0?round((last?.water_liters||0)/feed,2):null,temperature_min_c:last?last.temperature_min_c:null,temperature_max_c:last?last.temperature_max_c:null,temperature_avg_c:avgTemp===null?null:round(avgTemp,2),humidity_min_pct:last?last.humidity_min_pct:null,humidity_max_pct:last?last.humidity_max_pct:null};
}

export function dataCompletenessV20(report:DailyFarmReportV197|undefined):DataCompletenessV20 {
  const checks:Array<[string,boolean]>=[
    ['عدد أول اليوم',Boolean(report&&report.opening_birds>=0)],['النافق',Boolean(report&&report.mortality>=0)],['الاستبعاد',Boolean(report&&report.culls>=0)],['عدد آخر اليوم',Boolean(report&&report.closing_birds>=0)],
    ['العلف أول اليوم',Boolean(report&&report.feed_opening_kg>=0)],['العلف المستهلك',Boolean(report&&report.feed_used_kg>=0)],['العلف المتبقي',Boolean(report&&report.feed_closing_kg>=0)],['الماء',Boolean(report&&report.water_liters>=0)],
    ['الحرارة الدنيا',Boolean(report&&Number.isFinite(report.temperature_min_c))],['الحرارة العليا',Boolean(report&&Number.isFinite(report.temperature_max_c))],['الرطوبة',Boolean(report&&Number.isFinite(report.humidity_min_pct)&&Number.isFinite(report.humidity_max_pct))],['ملاحظات الفرشة',Boolean(report&&String(report.litter_condition||'').trim())],
  ];
  if(report?.weight_condition&&report.weight_condition!=='not_measured') checks.push(['عينة الوزن',Boolean(report.sample_weights_g?.length)]);
  const missing=checks.filter(([,ok])=>!ok).map(([label])=>label); const score=round((checks.length-missing.length)/checks.length*100,0);
  return {score,complete:missing.length===0,missing,checked_fields:checks.map(([label])=>label)};
}

export function addReconciliationAdjustmentV20(v20:V20State,managed:ManagedOperationsStateV197,input:{flock_id:string;quantity_delta:number;reason:string;requested_by:string;requested_by_role:PlatformRoleV195|string;evidence_refs?:string[]}):V20State {
  const flock=managed.flock_cycles.find(f=>f.id===input.flock_id); if(!flock) throw new Error('القطيع غير موجود'); if(!input.reason.trim()) throw new Error('سبب التصحيح إلزامي'); if(!Number.isFinite(input.quantity_delta)||input.quantity_delta===0) throw new Error('قيمة التصحيح يجب ألا تكون صفرًا');
  const adjustment:FlockReconciliationAdjustmentV20={id:uid('ADJ20'),flock_id:flock.id,farm_id:flock.farm_id,at:nowIso(),quantity_delta:input.quantity_delta,reason:input.reason,requested_by:input.requested_by,requested_by_role:input.requested_by_role,status:'pending',evidence_refs:input.evidence_refs||[]};
  return {...v20,reconciliation_adjustments:[adjustment,...v20.reconciliation_adjustments],audit_mutations:[{id:uid('AUD20'),at:nowIso(),actor:input.requested_by,actor_role:String(input.requested_by_role),entity_type:'flock_reconciliation',entity_id:adjustment.id,action:'request_adjustment',new_value:adjustment,reason:input.reason,evidence_refs:adjustment.evidence_refs},...v20.audit_mutations]};
}

export function approveReconciliationAdjustmentV20(v20:V20State,adjustmentId:string,approved:boolean,actor:string,actorRole:string,reason:string):V20State {
  const current=v20.reconciliation_adjustments.find(a=>a.id===adjustmentId); if(!current) throw new Error('طلب التصحيح غير موجود'); const next={...current,status:approved?'approved' as const:'rejected' as const,approved_by:actor};
  return {...v20,reconciliation_adjustments:v20.reconciliation_adjustments.map(a=>a.id===adjustmentId?next:a),audit_mutations:[{id:uid('AUD20'),at:nowIso(),actor,actor_role:actorRole,entity_type:'flock_reconciliation',entity_id:adjustmentId,action:approved?'approve_adjustment':'reject_adjustment',old_value:current,new_value:next,reason,evidence_refs:current.evidence_refs},...v20.audit_mutations]};
}

export function closeFlockDayV20(v20:V20State,managed:ManagedOperationsStateV197,input:{flock_id:string;report_date:string;worker:string;vet?:string;forceReopen?:boolean;reason?:string}):V20State {
  const flock=managed.flock_cycles.find(f=>f.id===input.flock_id); if(!flock) throw new Error('القطيع غير موجود'); const reports=managed.daily_reports.filter(r=>r.flock_id===input.flock_id&&r.report_date===input.report_date); if(!reports.length) throw new Error('لا توجد تقارير لهذا اليوم');
  const existing=v20.daily_closures.find(c=>c.flock_id===input.flock_id&&c.report_date===input.report_date);
  if(existing?.status==='closed'&&v20.settings.lock_closed_day&&!input.forceReopen) throw new Error('اليوم مغلق. يلزم إعادة فتح موثقة قبل التعديل.');
  const latest=reports.sort((a,b)=>b.submitted_at.localeCompare(a.submitted_at))[0]; const completeness=dataCompletenessV20(latest); const aiIssues:string[]=[];
  reports.forEach(r=>{const expected=Math.max(0,r.opening_birds-reportMortality(r)-r.culls); if(expected!==r.closing_birds) aiIssues.push(`تقرير ${r.report_number}: عدد آخر اليوم لا يطابق الحركة`); if(r.feed_closing_kg<0) aiIssues.push(`تقرير ${r.report_number}: رصيد العلف سالب`); if(r.feed_used_kg>r.feed_opening_kg+r.feed_received_kg) aiIssues.push(`تقرير ${r.report_number}: استهلاك العلف أكبر من المتاح`);});
  const master=buildFlockMasterRecordV20(v20,managed,input.flock_id,input.report_date); const populationReconciled=master.population_discrepancy===0 || !v20.settings.require_population_reconciliation; const sufficient=completeness.score>=v20.settings.minimum_daily_completeness_percent;
  let status:V20ReportStatus='incomplete'; if(sufficient&&populationReconciled&&!aiIssues.length) status=v20.settings.require_vet_close?(input.vet?'closed':'awaiting_vet_review'):'closed';
  const closure:DailyFlockClosureV20={id:existing?.id||uid('CLOSE20'),closure_number:existing?.closure_number||serial('CLOSE20'),flock_id:flock.id,farm_id:flock.farm_id,report_date:input.report_date,status,completeness_score:completeness.score,missing_fields:completeness.missing,population_reconciled:populationReconciled,population_discrepancy:master.population_discrepancy,worker_submitted_by:input.worker,worker_submitted_at:latest.submitted_at,ai_checked_at:nowIso(),ai_issues:aiIssues,vet_reviewed_by:input.vet,vet_reviewed_at:input.vet?nowIso():undefined,closed_at:status==='closed'?nowIso():undefined,reopened_at:input.forceReopen?nowIso():existing?.reopened_at,reopen_reason:input.forceReopen?input.reason:existing?.reopen_reason};
  return {...v20,daily_closures:[closure,...v20.daily_closures.filter(c=>c.id!==closure.id)],audit_mutations:[{id:uid('AUD20'),at:nowIso(),actor:input.vet||input.worker,actor_role:input.vet?'vet':'worker',entity_type:'daily_flock_closure',entity_id:closure.id,action:input.forceReopen?'reopen_and_recalculate':'daily_close',old_value:existing,new_value:closure,reason:input.reason||'إغلاق يوم التشغيل وفق بوابة الاكتمال والمصالحة',evidence_refs:reports.flatMap(r=>r.media_refs||[])},...v20.audit_mutations]};
}

export function ownerDailyDashboardV20(v20:V20State,managed:ManagedOperationsStateV197,flockId:string):OwnerDailyDashboardV20 {
  const master=buildFlockMasterRecordV20(v20,managed,flockId); const weight=weightMetricsV20(managed,flockId,v20.settings.weight_uniformity_band_percent); const feed=feedMetricsV20(v20,managed,flockId); const environment=waterEnvironmentMetricsV20(managed,flockId); const last=latestReportForFlock(managed,flockId); const completeness=dataCompletenessV20(last); const costs=managed.cost_entries.filter(c=>c.flock_id===flockId); const latestDate=last?.report_date; const costToday=costs.filter(c=>c.date===latestDate&&c.debit_credit==='debit').reduce((s,c)=>s+c.amount_sar,0); const costCum=costs.filter(c=>c.debit_credit==='debit').reduce((s,c)=>s+c.amount_sar,0); const outstanding=costs.filter(c=>c.payment_status==='credit').reduce((s,c)=>s+c.amount_sar,0); const paid=costs.filter(c=>['paid','settled'].includes(c.payment_status)).reduce((s,c)=>s+c.amount_sar,0); const pending=managed.requirements.filter(r=>r.flock_id===flockId&&r.owner_decision==='pending').length; const openClinical=managed.exceptions.filter(e=>e.flock_id===flockId&&e.status==='open'&&['mortality','water','temperature'].includes(e.category)).length;
  return {master,weight,feed,environment,completeness,cost_today_sar:round(costToday,2),cost_cumulative_sar:round(costCum,2),outstanding_sar:round(outstanding,2),paid_sar:round(paid,2),pending_owner_approvals:pending,open_clinical_signals:openClinical,feed_warning:feed.estimated_days_remaining!==null&&feed.estimated_days_remaining<v20.settings.feed_days_warning,mortality_warning:master.mortality_today_percent>=v20.settings.mortality_warning_percent};
}

export function executiveFarmRowsV20(v20:V20State,managed:ManagedOperationsStateV197):ExecutiveFarmRowV20[] {
  return managed.flock_cycles.filter(f=>['active','marketing','selling','ready_for_placement'].includes(f.status)).map(f=>{
    const master=buildFlockMasterRecordV20(v20,managed,f.id); const weight=weightMetricsV20(managed,f.id,v20.settings.weight_uniformity_band_percent); const feed=feedMetricsV20(v20,managed,f.id); const last=latestReportForFlock(managed,f.id); const completeness=dataCompletenessV20(last); const farm=managed.farms.find(x=>x.id===f.farm_id); const closureDate=last?.report_date; const close=closureDate?v20.daily_closures.find(c=>c.flock_id===f.id&&c.report_date===closureDate):undefined; const costs=managed.cost_entries.filter(c=>c.flock_id===f.id&&c.payment_status==='credit').reduce((s,c)=>s+c.amount_sar,0); const open=managed.exceptions.filter(e=>e.flock_id===f.id&&e.status==='open').length;
    return {farm_id:f.farm_id,farm_name:farm?.name||'',flock_id:f.id,flock_code:f.flock_code,age_days:f.age_days,live_birds:master.current_theoretical,cumulative_mortality_percent:master.farm_mortality_percent,daily_mortality_percent:master.mortality_today_percent,avg_weight_g:weight.avg_g,weight_variance_percent:weight.variance_percent,fcr:feed.operational_fcr,feed_days_remaining:feed.estimated_days_remaining,biosecurity_score:farm?.biosecurity_score||0,compliance_score:farm?.compliance_score||0,data_completeness:completeness.score,outstanding_sar:round(costs,2),open_exceptions:open,daily_close_status:(close?.status||'not_started') as ExecutiveFarmRowV20['daily_close_status']};
  }).sort((a,b)=>b.cumulative_mortality_percent-a.cumulative_mortality_percent||b.open_exceptions-a.open_exceptions);
}

export function weeklyPerformanceV20(v20:V20State,managed:ManagedOperationsStateV197,flockId:string,endDate?:string){
  const reports=managed.daily_reports.filter(r=>r.flock_id===flockId).sort((a,b)=>a.report_date.localeCompare(b.report_date)); const end=endDate||reports[reports.length-1]?.report_date||new Date().toISOString().slice(0,10); const endMs=new Date(`${end}T23:59:59`).getTime(); const start=new Date(endMs-6*86400000).toISOString().slice(0,10); const period=reports.filter(r=>r.report_date>=start&&r.report_date<=end); const mortality=period.reduce((s,r)=>s+reportMortality(r),0); const feed=period.reduce((s,r)=>s+r.feed_used_kg,0); const water=period.reduce((s,r)=>s+r.water_liters,0); const weights=period.filter(r=>r.avg_weight_g!==undefined).map(r=>({date:r.report_date,avg_weight_g:r.avg_weight_g,expected_weight_g:r.expected_weight_g,variance:r.weight_variance_percent})); const master=buildFlockMasterRecordV20(v20,managed,flockId,end); const fm=feedMetricsV20(v20,managed,flockId); return {period_from:start,period_to:end,flock_id:flockId,mortality,mortality_percent:master.initial_accepted?round(mortality/master.initial_accepted*100,3):0,cumulative_mortality_percent:master.farm_mortality_percent,feed_kg:round(feed,2),water_liters:round(water,1),weights,operational_fcr:fm.operational_fcr,data_completeness_avg:period.length?round(period.reduce((s,r)=>s+dataCompletenessV20(r).score,0)/period.length,1):0};
}

export function endOfCycleReportV20(v20:V20State,managed:ManagedOperationsStateV197,flockId:string){
  const master=buildFlockMasterRecordV20(v20,managed,flockId); const weight=weightMetricsV20(managed,flockId,v20.settings.weight_uniformity_band_percent); const feed=feedMetricsV20(v20,managed,flockId); const env=waterEnvironmentMetricsV20(managed,flockId); const settlement=managed.settlements.find(s=>s.flock_id===flockId); const perf=managed.cycle_performance.find(p=>p.flock_id===flockId); const costs=managed.cost_entries.filter(c=>c.flock_id===flockId); const medication=managed.daily_reports.filter(r=>r.flock_id===flockId).flatMap(r=>r.medication_entries); const vaccines=managed.daily_reports.filter(r=>r.flock_id===flockId).flatMap(r=>r.vaccination_entries); const closures=v20.daily_closures.filter(c=>c.flock_id===flockId); const completeness=closures.length?round(closures.reduce((s,c)=>s+c.completeness_score,0)/closures.length,1):0;
  return {generated_at:nowIso(),master,weight,feed,environment:env,medications_count:medication.length,vaccinations_count:vaccines.length,total_cost_sar:perf?.total_cost_sar||costs.filter(c=>c.debit_credit==='debit').reduce((s,c)=>s+c.amount_sar,0),revenue_sar:perf?.revenue_sar||settlement?.gross_sales_sar||0,profit_loss_sar:perf?.profit_loss_sar??((settlement?.gross_sales_sar||0)-(perf?.total_cost_sar||0)),cost_per_bird_sar:perf?.cost_per_bird_sar,cost_per_kg_sar:perf?.cost_per_kg_sar,settlement,performance:perf,average_data_completeness:completeness,biosecurity_score:managed.farms.find(f=>f.id===master.farm_id)?.biosecurity_score||0,compliance_score:managed.farms.find(f=>f.id===master.farm_id)?.compliance_score||0,population_reconciled:master.population_discrepancy===0,recommendations:perf?.recommendations||[]};
}

export function createReportSnapshotV20(v20:V20State,managed:ManagedOperationsStateV197,input:{kind:ReportKindV20;flock_id:string;generated_by:string;period_from?:string;period_to?:string}):V20State {
  const flock=managed.flock_cycles.find(f=>f.id===input.flock_id); if(!flock) throw new Error('القطيع غير موجود'); const latest=latestReportDate(managed,input.flock_id)||new Date().toISOString().slice(0,10); let data:Record<string,unknown>={};
  if(input.kind==='weekly') data=weeklyPerformanceV20(v20,managed,input.flock_id,input.period_to);
  else if(input.kind==='cycle') data=endOfCycleReportV20(v20,managed,input.flock_id);
  else data=ownerDailyDashboardV20(v20,managed,input.flock_id) as unknown as Record<string,unknown>;
  const report:ReportSnapshotV20={id:uid('RPT20'),report_number:serial(`RPT-${input.kind.toUpperCase()}`),kind:input.kind,farm_id:flock.farm_id,flock_id:flock.id,period_from:input.period_from||input.period_to||latest,period_to:input.period_to||latest,generated_at:nowIso(),generated_by:input.generated_by,status:'final',data};
  return {...v20,report_snapshots:[report,...v20.report_snapshots],audit_mutations:[{id:uid('AUD20'),at:nowIso(),actor:input.generated_by,actor_role:'reporting',entity_type:'report_snapshot',entity_id:report.id,action:'generate_report',new_value:{kind:report.kind,report_number:report.report_number},reason:'إنشاء لقطة تقرير ثابتة للتدقيق',evidence_refs:[]},...v20.audit_mutations]};
}

export function validateV20State(v20:V20State,managed:ManagedOperationsStateV197):string[] {
  const issues:string[]=[];
  managed.flock_cycles.forEach(f=>{try{const m=buildFlockMasterRecordV20(v20,managed,f.id); if(m.population_discrepancy!==0) issues.push(`${f.flock_code}: فرق عدد ${m.population_discrepancy} بين السجل النظري والعدد المسجل`);}catch(e:any){issues.push(`${f.flock_code}: ${e.message}`);}});
  v20.daily_closures.forEach(c=>{if(c.status==='closed'&&c.completeness_score<v20.settings.minimum_daily_completeness_percent)issues.push(`${c.closure_number}: مغلق رغم أن الاكتمال ${c.completeness_score}%`); if(c.status==='closed'&&v20.settings.require_population_reconciliation&&!c.population_reconciled)issues.push(`${c.closure_number}: مغلق مع فرق في عدد القطيع`);});
  return issues;
}
