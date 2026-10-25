import type { CurrencyV195, PlatformRoleV195 } from '../platform/PlatformCoreV19_5';
import type { ManagedOperationsStateV197 } from '../managed/ManagedPoultryOperationsV19_7';

export type FarmPartyTypeV2029='person'|'organization'|'government';
export type FarmAssignmentRoleV2029='farm_manager'|'supervisor'|'worker'|'doctor'|'consultant'|'accountant'|'vet_assistant'|'lab_technician'|'regional_manager';
export type FarmEventStatusV2029='draft'|'submitted'|'approved'|'posted'|'voided';
export type FarmAlertSeverityV2029='info'|'warning'|'high'|'critical';
export type FarmTaskStatusV2029='pending'|'in_progress'|'blocked'|'completed'|'cancelled';
export type OfflineOperationStatusV2029='queued'|'syncing'|'synced'|'conflict'|'failed';
export type MediaKindV2029='photo'|'video'|'audio'|'document';
export type ClinicalCaseStatusV2029='open'|'under_review'|'treatment'|'monitoring'|'closed';
export type ConsultantEscalationStatusV2029='none'|'requested'|'accepted'|'responded'|'closed';
export type LabSampleStatusV2029='registered'|'collected'|'in_transit'|'received'|'testing'|'result_ready'|'final'|'rejected';
export type QualityDecisionV2029='pass'|'conditional'|'fail';
export type FarmExpenseSettlementModeV2029='cash'|'bank_transfer'|'credit'|'payroll'|'owner_funded'|'platform_funded';

export interface FarmOwnerRelationshipV2029 {
  id:string; farm_id:string; party_id:string; party_type:FarmPartyTypeV2029; display_name:string;
  ownership_percent:number; is_primary:boolean; effective_from:string; effective_to?:string; status:'active'|'inactive'; created_at:string; created_by:string;
}
export interface FarmStaffAssignmentV2029 {
  id:string; farm_id:string; house_id?:string; cycle_id?:string; user_id:string; user_name:string; role:FarmAssignmentRoleV2029;
  effective_from:string; effective_to?:string; primary:boolean; on_call:boolean; status:'active'|'inactive'; created_at:string; created_by:string;
}
export interface DoctorAssignmentV2029 extends FarmStaffAssignmentV2029 {
  role:'doctor'|'consultant'; clinical_scope:'primary'|'backup'|'consultant'; license_reference?:string;
}
export interface BirdPopulationEventV2029 {
  id:string; farm_id:string; house_id:string; cycle_id:string; event_type:'placement'|'mortality'|'cull'|'transfer_in'|'transfer_out'|'sale'|'reconciliation';
  quantity_delta:number; event_date:string; captured_at:string; server_received_at:string; reason?:string; source_document?:string;
  actor_id:string; actor_name:string; actor_role:string; evidence_refs:string[]; status:FarmEventStatusV2029; idempotency_key:string;
}
export interface MortalityCullDetailV2029 {
  id:string; population_event_id:string; farm_id:string; house_id:string; cycle_id:string; kind:'mortality'|'cull'; count:number; date:string;
  suspected_cause?:string; necropsy_required:boolean; necropsy_case_id?:string; disposal_method?:string; evidence_refs:string[];
}
export interface FeedConsumptionRecordV2029 {
  id:string; farm_id:string; house_id:string; cycle_id:string; date:string; feed_item_id?:string; feed_name:string; stage:'starter'|'grower'|'finisher'|'other';
  opening_kg:number; received_kg:number; consumed_kg:number; closing_kg:number; wastage_kg:number; inventory_issue_reference_id?:string;
  entered_by:string; captured_at:string; server_received_at:string; idempotency_key:string;
}
export interface WaterConsumptionRecordV2029 {
  id:string; farm_id:string; house_id:string; cycle_id:string; date:string; source:string; meter_opening?:number; meter_closing?:number; consumed_liters:number;
  flush_liters:number; medication_water_liters:number; entered_by:string; captured_at:string; server_received_at:string; idempotency_key:string;
}
export interface EnvironmentReadingV2029 {
  id:string; farm_id:string; house_id:string; cycle_id?:string; measured_at:string; captured_at:string; server_received_at:string;
  source:'manual'|'sensor'; sensor_id?:string; temperature_c?:number; humidity_pct?:number; ammonia_ppm?:number; co2_ppm?:number;
  air_speed_mps?:number; static_pressure_pa?:number; light_lux?:number; water_temp_c?:number; note?:string; immutable:true;
}
export interface BiosecurityInspectionV2029 {
  id:string; farm_id:string; house_id?:string; date:string; inspection_type:'entry'|'daily'|'weekly'|'cycle_preparation'|'incident'; inspector:string;
  visitor_control:number; vehicle_control:number; footbath:number; pest_control:number; carcass_disposal:number; cleaning_disinfection:number;
  score:number; findings:string[]; corrective_actions:string[]; evidence_refs:string[]; status:'open'|'corrected'|'verified';
}
export interface WaterQualityTestV2029 {
  id:string; farm_id:string; house_id?:string; sample_date:string; source:string; ph?:number; tds_ppm?:number; hardness_ppm?:number;
  chlorine_ppm?:number; coliform_cfu?:number; ecoli_detected?:boolean; lab_reference?:string; decision:QualityDecisionV2029; action_required?:string; reviewed_by?:string;
}
export interface FeedQualityTestV2029 {
  id:string; farm_id:string; cycle_id?:string; feed_item_id?:string; feed_name:string; batch_lot?:string; sample_date:string;
  moisture_pct?:number; protein_pct?:number; aflatoxin_ppb?:number; pellet_quality_pct?:number; sensory_findings?:string;
  lab_reference?:string; decision:QualityDecisionV2029; action_required?:string; reviewed_by?:string;
}
export interface ClinicalCaseV2029 {
  id:string; case_number:string; farm_id:string; house_id?:string; cycle_id:string; opened_at:string; opened_by:string; status:ClinicalCaseStatusV2029;
  consultant_escalation_status:ConsultantEscalationStatusV2029; complaint:string; signs:string[]; differential_diagnoses:string[]; final_diagnosis?:string;
  assigned_doctor_id?:string; assigned_doctor_name?:string; consultant_id?:string; consultant_name?:string; withdrawal_restriction_active:boolean;
  withdrawal_until?:string; marketing_block_reason?:string; closed_at?:string; closed_by?:string;
}
export interface MedicationAdministrationV2029 {
  id:string; farm_id:string; house_id?:string; cycle_id:string; clinical_case_id?:string; prescription_reference_id:string; date:string;
  inventory_item_id?:string; medication_name:string; active_ingredient?:string; quantity:number; unit:string; route:string; batch_lot?:string;
  withdrawal_days:number; withdrawal_until?:string; administered_by:string; authorized_by_doctor:string; inventory_issue_event_id:string; evidence_refs:string[];
}
export interface VaccinationAdministrationV2029 {
  id:string; farm_id:string; house_id?:string; cycle_id:string; vaccination_plan_reference_id:string; date:string; inventory_item_id?:string;
  vaccine_name:string; quantity:number; unit:string; batch_lot?:string; expiry_date?:string; cold_chain_ok:boolean; administered_by:string;
  authorized_by_doctor:string; inventory_issue_event_id:string; evidence_refs:string[];
}
export interface LabFacilityV2029 {
  id:string; partner_party_id?:string; name:string; facility_type:'internal'|'partner'; governorate:string; district?:string; address?:string;
  contact_phone?:string; accreditation_reference?:string; supported_tests:string[]; active:boolean;
}
export interface LabSampleV2029 {
  id:string; sample_number:string; clinical_case_id:string; farm_id:string; cycle_id:string; facility_id:string; sample_type:string; collected_at?:string;
  collected_by?:string; chain_of_custody:string[]; requested_tests:string[]; status:LabSampleStatusV2029; received_at?:string; rejected_reason?:string;
}
export interface LabResultVersionV2029 {
  id:string; sample_id:string; version:number; result_text:string; findings:Record<string,string|number|boolean>; status:'draft'|'final'|'amended';
  prepared_by:string; reviewed_by_lab_reviewer?:string; reviewed_at?:string; amendment_reason?:string; supersedes_result_id?:string; created_at:string;
}
export interface FarmMediaEvidenceV2029 {
  id:string; farm_id:string; house_id?:string; cycle_id?:string; entity_type:string; entity_id:string; kind:MediaKindV2029; file_name:string;
  encrypted:true; provider:'shared_media_service'; local_queue_id?:string; captured_at:string; server_received_at?:string; uploaded:boolean; checksum?:string;
}
export interface OfflineQueueOperationV2029 {
  id:string; device_id:string; user_id:string; entity_type:string; entity_id:string; operation:'create'|'update'|'append'; payload_hash:string;
  idempotency_key:string; captured_at:string; server_received_at?:string; device_clock_drift_ms?:number; status:OfflineOperationStatusV2029;
  conflict_fields:string[]; conflict_resolution?:Record<string,string>; last_error?:string; retry_count:number;
}
export interface FarmAlertV2029 {
  id:string; farm_id:string; house_id?:string; cycle_id?:string; category:'population'|'feed'|'water'|'environment'|'biosecurity'|'clinical'|'lab'|'finance'|'task'|'sync';
  severity:FarmAlertSeverityV2029; title:string; message:string; opened_at:string; source_entity_type:string; source_entity_id:string; assigned_role?:string;
  status:'open'|'acknowledged'|'resolved'; acknowledged_by?:string; resolved_by?:string; resolved_at?:string;
}
export interface FarmTaskV2029 {
  id:string; farm_id:string; house_id?:string; cycle_id?:string; title:string; instructions:string; assigned_user_id?:string; assigned_role?:FarmAssignmentRoleV2029;
  due_at:string; priority:'low'|'normal'|'high'|'critical'; evidence_required:boolean; evidence_refs:string[]; status:FarmTaskStatusV2029;
  source_entity_type?:string; source_entity_id?:string; created_at:string; completed_at?:string; completed_by?:string;
}
export interface FarmExpenseClaimV2029 {
  id:string; claim_number:string; farm_id:string; house_id?:string; cycle_id?:string; category:string; description:string; date:string; amount:number;
  currency:CurrencyV195; requested_by:string; settlement_mode:FarmExpenseSettlementModeV2029; counterparty?:string; payment_reference?:string;
  status:'draft'|'submitted'|'approved'|'rejected'|'sent_to_accounting'|'settled'; accounting_event_id?:string; evidence_refs:string[];
}
export type FarmFinancialDocumentTypeV2029='supplier_invoice'|'goods_receipt'|'expense_voucher'|'payment_request'|'receipt_advice'|'owner_funding'|'supplier_statement'|'owner_statement'|'cycle_cost_sheet';
export interface FarmFinancialDocumentV2029 {
  id:string; document_number:string; farm_id:string; house_id?:string; cycle_id?:string; type:FarmFinancialDocumentTypeV2029; date:string;
  title:string; party_name?:string; amount?:number; currency?:CurrencyV195; source_entity_type:string; source_entity_id:string;
  status:'draft'|'issued'|'pending_s12'|'posted_s12'|'voided'; prepared_by:string; approved_by?:string; accounting_event_id?:string;
  accounting_reference_id?:string; notes?:string; created_at:string;
}
export interface FarmRoleHandoffV2029 {
  id:string; farm_id:string; house_id?:string; cycle_id?:string; from_role:string; to_role:string; subject:string;
  source_entity_type:string; source_entity_id:string; payload_summary:string; priority:'normal'|'high'|'critical';
  status:'pending'|'accepted'|'completed'|'returned'; created_at:string; created_by:string; accepted_at?:string; accepted_by?:string; completed_at?:string; completed_by?:string; note?:string;
}
export interface MarketPriceSnapshotV2029 {
  id:string; date:string; governorate:string; district?:string; commodity:'live_bird'|'chick'|'feed'|'other'; item_name:string; unit:string;
  currency:CurrencyV195; price:number; source_type:'provider'|'manual'; provider_name?:string; entered_by?:string; approved:boolean;
}
export interface FarmBenchmarkSnapshotV2029 {
  id:string; date:string; farm_id:string; house_id?:string; cycle_id?:string; scope:'cycle'|'house'|'farm'; breed?:string; age_days?:number;
  mortality_pct?:number; fcr?:number; avg_weight_g?:number; feed_cost_per_kg_gain?:number; cost_per_bird?:number; rank_percentile?:number; reference_group:string;
}
export interface FarmReferenceVersionV2029 {
  id:string; reference_type:'breed_standard'|'hatchery_profile'|'clinical_reference'|'biosecurity_template'|'water_standard'|'feed_standard'|'daily_template';
  code:string; name:string; version:number; effective_from:string; effective_to?:string; payload:Record<string,unknown>; status:'draft'|'active'|'superseded'; approved_by?:string;
}
export interface FarmInventoryIntegrationEventV2029 {
  id:string; farm_id:string; cycle_id?:string; event_type:'farm_consumption_issue'|'administration_issue'|'farm_transfer_request'|'farm_receipt_reference';
  source_entity_type:string; source_entity_id:string; inventory_owner:'SECTION_7'; status:'pending_s7'|'posted_s7'|'rejected_s7'; inventory_movement_reference_id?:string; created_at:string;
}
export interface FarmAccountingIntegrationEventV2029 {
  id:string; farm_id:string; house_id?:string; cycle_id?:string; event_type:'expense_claim'|'payroll_cost'|'inventory_cost'|'sales_revenue'|'cycle_close';
  source_entity_type:string; source_entity_id:string; accounting_owner:'SECTION_12'; status:'pending_s12'|'posted_s12'|'rejected_s12'; accounting_reference_id?:string; created_at:string;
}
export interface FarmAuditEventV2029 {
  id:string; at:string; actor:string; actor_role:string; action:string; entity_type:string; entity_id:string; before_hash?:string; after_hash?:string; reason?:string;
}
export interface FarmDivisionSettingsV2029 {
  min_completeness_percent:90; durable_offline_queue_required:true; media_encryption_required:true; field_conflict_strategy:'field_specific';
  sensor_readings_append_only:true; lab_final_requires_reviewer:true; no_duplicate_financial_ledger:true; no_duplicate_inventory_ledger:true;
  android_deferred_until_windows_closure:true; screen_floor:82; currency_codes:CurrencyV195[];
}
export interface FarmDivisionStateV2029 {
  version:'20.2.9-FARM-R4'; migrated_from:'20.2.9-FACTORY-R3'; owner_relationships:FarmOwnerRelationshipV2029[]; staff_assignments:FarmStaffAssignmentV2029[];
  doctor_assignments:DoctorAssignmentV2029[]; population_events:BirdPopulationEventV2029[]; mortality_cull_details:MortalityCullDetailV2029[];
  feed_records:FeedConsumptionRecordV2029[]; water_records:WaterConsumptionRecordV2029[]; environment_readings:EnvironmentReadingV2029[];
  biosecurity_inspections:BiosecurityInspectionV2029[]; water_quality_tests:WaterQualityTestV2029[]; feed_quality_tests:FeedQualityTestV2029[];
  clinical_cases:ClinicalCaseV2029[]; medication_administrations:MedicationAdministrationV2029[]; vaccination_administrations:VaccinationAdministrationV2029[];
  lab_facilities:LabFacilityV2029[]; lab_samples:LabSampleV2029[]; lab_results:LabResultVersionV2029[]; media:FarmMediaEvidenceV2029[];
  offline_queue:OfflineQueueOperationV2029[]; alerts:FarmAlertV2029[]; tasks:FarmTaskV2029[]; expense_claims:FarmExpenseClaimV2029[];
  financial_documents:FarmFinancialDocumentV2029[]; role_handoffs:FarmRoleHandoffV2029[];
  market_prices:MarketPriceSnapshotV2029[]; benchmarks:FarmBenchmarkSnapshotV2029[]; reference_versions:FarmReferenceVersionV2029[];
  inventory_integration_events:FarmInventoryIntegrationEventV2029[]; accounting_integration_events:FarmAccountingIntegrationEventV2029[]; audit:FarmAuditEventV2029[];
  shared_report_execution_owner:'SECTION_14'; shared_governance_owner:'SECTION_15'; settings:FarmDivisionSettingsV2029;
}

const iso=()=>new Date().toISOString();
const uid=(p:string)=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const serial=(p:string)=>`${p}-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;
const hash=(v:unknown)=>{try{return JSON.stringify(v).split('').reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),2166136261).toString(16)}catch{return 'na'}};
const audit=(state:FarmDivisionStateV2029,actor:string,role:string,action:string,entity_type:string,entity_id:string,before?:unknown,after?:unknown,reason?:string):FarmDivisionStateV2029=>({...state,audit:[{id:uid('FAUD'),at:iso(),actor,actor_role:role,action,entity_type,entity_id,before_hash:before===undefined?undefined:hash(before),after_hash:after===undefined?undefined:hash(after),reason},...state.audit]});

const defaultReferences:FarmReferenceVersionV2029[]=[
  {id:'farm-ref-breed-ross308-v1',reference_type:'breed_standard',code:'ROSS308',name:'Ross 308 Standard',version:1,effective_from:'2026-01-01',payload:{source:'versioned farm reference data',metrics:['weight','feed','fcr','mortality'],configured:true},status:'active',approved_by:'System Seed'},
  {id:'farm-ref-breed-cobb500-v1',reference_type:'breed_standard',code:'COBB500',name:'Cobb 500 Standard',version:1,effective_from:'2026-01-01',payload:{source:'versioned farm reference data',metrics:['weight','feed','fcr','mortality'],configured:true},status:'active',approved_by:'System Seed'},
  {id:'farm-ref-breed-hubbard-v1',reference_type:'breed_standard',code:'HUBBARD',name:'Hubbard Broiler Standard',version:1,effective_from:'2026-01-01',payload:{source:'versioned farm reference data',metrics:['weight','feed','fcr','mortality'],configured:true},status:'active',approved_by:'System Seed'},
  {id:'farm-ref-breed-arbor-v1',reference_type:'breed_standard',code:'ARBOR-ACRES',name:'Arbor Acres Standard',version:1,effective_from:'2026-01-01',payload:{source:'versioned farm reference data',metrics:['weight','feed','fcr','mortality'],configured:true},status:'active',approved_by:'System Seed'},
  {id:'farm-ref-breed-sasso-v1',reference_type:'breed_standard',code:'SASSO',name:'Sasso Broiler Standard',version:1,effective_from:'2026-01-01',payload:{source:'versioned farm reference data',metrics:['weight','feed','fcr','mortality'],configured:true},status:'active',approved_by:'System Seed'},
  {id:'farm-ref-clinical-support-v1',reference_type:'clinical_reference',code:'CLINICAL-SUPPORT',name:'Veterinary Supportive Treatment Categories',version:1,effective_from:'2026-01-01',payload:{categories:['no_treatment','supportive','anti_inflammatory','antipyretic','anticoccidial','antibiotic','vaccine','lab_investigation'],human_vet_gate:true},status:'active',approved_by:'System Seed'},
  {id:'farm-ref-daily-template-v1',reference_type:'daily_template',code:'DAILY-BROILER',name:'Broiler Daily Field Template',version:1,effective_from:'2026-01-01',payload:{required:['population','feed','water','environment','mortality','tasks']},status:'active',approved_by:'System Seed'},
  {id:'farm-ref-water-v1',reference_type:'water_standard',code:'WATER-BROILER',name:'Farm Water Quality Standard',version:1,effective_from:'2026-01-01',payload:{ph_min:6,ph_max:8,ecoli:false},status:'active',approved_by:'System Seed'},
  {id:'farm-ref-bio-v1',reference_type:'biosecurity_template',code:'BIO-DAILY',name:'Daily Biosecurity Standard',version:1,effective_from:'2026-01-01',payload:{sections:['entry','vehicles','footbath','pest','carcass','cleaning']},status:'active',approved_by:'System Seed'}
];

export function buildFarmDivisionStateV2029(existing?:Partial<FarmDivisionStateV2029>):FarmDivisionStateV2029{
  const base:FarmDivisionStateV2029={
    version:'20.2.9-FARM-R4',migrated_from:'20.2.9-FACTORY-R3',owner_relationships:[],staff_assignments:[],doctor_assignments:[],population_events:[],mortality_cull_details:[],feed_records:[],water_records:[],environment_readings:[],biosecurity_inspections:[],water_quality_tests:[],feed_quality_tests:[],clinical_cases:[],medication_administrations:[],vaccination_administrations:[],lab_facilities:[],lab_samples:[],lab_results:[],media:[],offline_queue:[],alerts:[],tasks:[],expense_claims:[],financial_documents:[],role_handoffs:[],market_prices:[],benchmarks:[],reference_versions:defaultReferences,inventory_integration_events:[],accounting_integration_events:[],audit:[],shared_report_execution_owner:'SECTION_14',shared_governance_owner:'SECTION_15',
    settings:{min_completeness_percent:90,durable_offline_queue_required:true,media_encryption_required:true,field_conflict_strategy:'field_specific',sensor_readings_append_only:true,lab_final_requires_reviewer:true,no_duplicate_financial_ledger:true,no_duplicate_inventory_ledger:true,android_deferred_until_windows_closure:true,screen_floor:82,currency_codes:['SAR','YER_NEW','YER_OLD']}
  };
  if(!existing)return base;
  const arrays=(key:keyof FarmDivisionStateV2029, fallback:any[])=>Array.isArray((existing as any)[key])?(existing as any)[key]:fallback;
  return {...base,...existing,version:'20.2.9-FARM-R4',migrated_from:'20.2.9-FACTORY-R3',owner_relationships:arrays('owner_relationships',[]),staff_assignments:arrays('staff_assignments',[]),doctor_assignments:arrays('doctor_assignments',[]),population_events:arrays('population_events',[]),mortality_cull_details:arrays('mortality_cull_details',[]),feed_records:arrays('feed_records',[]),water_records:arrays('water_records',[]),environment_readings:arrays('environment_readings',[]),biosecurity_inspections:arrays('biosecurity_inspections',[]),water_quality_tests:arrays('water_quality_tests',[]),feed_quality_tests:arrays('feed_quality_tests',[]),clinical_cases:arrays('clinical_cases',[]),medication_administrations:arrays('medication_administrations',[]),vaccination_administrations:arrays('vaccination_administrations',[]),lab_facilities:arrays('lab_facilities',[]),lab_samples:arrays('lab_samples',[]),lab_results:arrays('lab_results',[]),media:arrays('media',[]),offline_queue:arrays('offline_queue',[]),alerts:arrays('alerts',[]),tasks:arrays('tasks',[]),expense_claims:arrays('expense_claims',[]),financial_documents:arrays('financial_documents',[]),role_handoffs:arrays('role_handoffs',[]),market_prices:arrays('market_prices',[]),benchmarks:arrays('benchmarks',[]),reference_versions:arrays('reference_versions',defaultReferences).length?arrays('reference_versions',defaultReferences):defaultReferences,inventory_integration_events:arrays('inventory_integration_events',[]),accounting_integration_events:arrays('accounting_integration_events',[]),audit:arrays('audit',[]),settings:{...base.settings,...(existing.settings||{}),no_duplicate_financial_ledger:true,no_duplicate_inventory_ledger:true,android_deferred_until_windows_closure:true}};
}

export function createFarmOwnerRelationshipV2029(state:FarmDivisionStateV2029,input:Omit<FarmOwnerRelationshipV2029,'id'|'created_at'|'status'>,actor:string,role:string){
  if(input.ownership_percent<=0||input.ownership_percent>100)throw new Error('Ownership percent must be > 0 and <= 100.');
  const row:FarmOwnerRelationshipV2029={...input,id:uid('FOWN'),created_at:iso(),status:'active'};
  let next={...state,owner_relationships:input.is_primary?[...state.owner_relationships.map(x=>x.farm_id===input.farm_id&&x.status==='active'?{...x,is_primary:false}:x),row]:[...state.owner_relationships,row]};
  return audit(next,actor,role,'create_owner_relationship','farm_owner_relationship',row.id,undefined,row);
}
export function createFarmStaffAssignmentV2029(state:FarmDivisionStateV2029,input:Omit<FarmStaffAssignmentV2029,'id'|'created_at'|'status'>,actor:string,role:string){
  const row:FarmStaffAssignmentV2029={...input,id:uid('FASN'),created_at:iso(),status:'active'};
  let next={...state,staff_assignments:[...state.staff_assignments,row]};
  return audit(next,actor,role,'create_staff_assignment','farm_staff_assignment',row.id,undefined,row);
}
export function createDoctorAssignmentV2029(state:FarmDivisionStateV2029,input:Omit<DoctorAssignmentV2029,'id'|'created_at'|'status'>,actor:string,role:string){
  const row:DoctorAssignmentV2029={...input,id:uid('FDOC'),created_at:iso(),status:'active'};
  const baseRow:FarmStaffAssignmentV2029={...row};
  let next={...state,doctor_assignments:[...state.doctor_assignments,row],staff_assignments:[...state.staff_assignments,baseRow]};
  return audit(next,actor,role,'create_doctor_assignment','doctor_assignment',row.id,undefined,row);
}
export function endFarmAssignmentV2029(state:FarmDivisionStateV2029,id:string,effective_to:string,actor:string,role:string){
  const before=state.staff_assignments.find(x=>x.id===id)||state.doctor_assignments.find(x=>x.id===id); if(!before)return state;
  const next:FarmDivisionStateV2029={...state,staff_assignments:state.staff_assignments.map(x=>x.id===id?{...x,effective_to,status:'inactive' as const}:x),doctor_assignments:state.doctor_assignments.map(x=>x.id===id?{...x,effective_to,status:'inactive' as const}:x)};
  return audit(next,actor,role,'end_assignment','farm_assignment',id,before,next.staff_assignments.find(x=>x.id===id)||next.doctor_assignments.find(x=>x.id===id));
}
export function recordBirdPopulationEventV2029(state:FarmDivisionStateV2029,input:Omit<BirdPopulationEventV2029,'id'|'captured_at'|'server_received_at'|'status'>,actorRole:string){
  const duplicate=state.population_events.find(x=>x.idempotency_key===input.idempotency_key); if(duplicate)return state;
  const row:BirdPopulationEventV2029={...input,id:uid('FPOP'),captured_at:iso(),server_received_at:iso(),status:'posted'};
  let next={...state,population_events:[...state.population_events,row]};
  return audit(next,input.actor_name,actorRole,'append_population_event','bird_population_event',row.id,undefined,row);
}
export function recordMortalityOrCullV2029(state:FarmDivisionStateV2029,input:{farm_id:string;house_id:string;cycle_id:string;kind:'mortality'|'cull';count:number;date:string;suspected_cause?:string;necropsy_required?:boolean;disposal_method?:string;evidence_refs?:string[];actor_id:string;actor_name:string;actor_role:string;idempotency_key:string}){
  if(input.count<=0)throw new Error('Count must be greater than zero.');
  let next=recordBirdPopulationEventV2029(state,{farm_id:input.farm_id,house_id:input.house_id,cycle_id:input.cycle_id,event_type:input.kind,quantity_delta:-Math.abs(input.count),event_date:input.date,reason:input.suspected_cause,actor_id:input.actor_id,actor_name:input.actor_name,actor_role:input.actor_role,evidence_refs:input.evidence_refs||[],idempotency_key:input.idempotency_key},input.actor_role);
  const pop=next.population_events.find(x=>x.idempotency_key===input.idempotency_key)!;
  if(next.mortality_cull_details.some(x=>x.population_event_id===pop.id))return next;
  const detail:MortalityCullDetailV2029={id:uid('FMOR'),population_event_id:pop.id,farm_id:input.farm_id,house_id:input.house_id,cycle_id:input.cycle_id,kind:input.kind,count:input.count,date:input.date,suspected_cause:input.suspected_cause,necropsy_required:Boolean(input.necropsy_required),disposal_method:input.disposal_method,evidence_refs:input.evidence_refs||[]};
  return {...next,mortality_cull_details:[...next.mortality_cull_details,detail]};
}
export function populationProjectionV2029(state:FarmDivisionStateV2029,managed:ManagedOperationsStateV197,cycleId:string){
  const cycle=managed.flock_cycles.find(x=>x.id===cycleId); const legacyInitial=cycle?.initial_count||0;
  const events=state.population_events.filter(x=>x.cycle_id===cycleId&&x.status==='posted');
  const hasPlacement=events.some(x=>x.event_type==='placement'); const eventInitial=events.filter(x=>x.event_type==='placement').reduce((s,x)=>s+x.quantity_delta,0);
  const delta=events.filter(x=>x.event_type!=='placement').reduce((s,x)=>s+x.quantity_delta,0);
  const initial=hasPlacement?eventInitial:legacyInitial;
  return {initial,current:Math.max(0,initial+delta),events:events.length,legacy_projection_current:cycle?.current_count||0,reconciled:events.length?Math.max(0,initial+delta)===(cycle?.current_count||0):true};
}
export function recordFeedConsumptionV2029(state:FarmDivisionStateV2029,input:Omit<FeedConsumptionRecordV2029,'id'|'captured_at'|'server_received_at'|'inventory_issue_reference_id'>){
  if(state.feed_records.some(x=>x.idempotency_key===input.idempotency_key))return state;
  const row:FeedConsumptionRecordV2029={...input,id:uid('FFEED'),captured_at:iso(),server_received_at:iso()};
  const evt:FarmInventoryIntegrationEventV2029={id:uid('FINV'),farm_id:input.farm_id,cycle_id:input.cycle_id,event_type:'farm_consumption_issue',source_entity_type:'feed_consumption',source_entity_id:row.id,inventory_owner:'SECTION_7',status:'pending_s7',created_at:iso()};
  return {...state,feed_records:[...state.feed_records,row],inventory_integration_events:[...state.inventory_integration_events,evt]};
}
export function recordWaterConsumptionV2029(state:FarmDivisionStateV2029,input:Omit<WaterConsumptionRecordV2029,'id'|'captured_at'|'server_received_at'>){
  if(state.water_records.some(x=>x.idempotency_key===input.idempotency_key))return state;
  const row:WaterConsumptionRecordV2029={...input,id:uid('FWATER'),captured_at:iso(),server_received_at:iso()}; return {...state,water_records:[...state.water_records,row]};
}
export function appendEnvironmentReadingV2029(state:FarmDivisionStateV2029,input:Omit<EnvironmentReadingV2029,'id'|'captured_at'|'server_received_at'|'immutable'>){
  const row:EnvironmentReadingV2029={...input,id:uid('FENV'),captured_at:iso(),server_received_at:iso(),immutable:true}; return {...state,environment_readings:[...state.environment_readings,row]};
}
export function recordBiosecurityInspectionV2029(state:FarmDivisionStateV2029,input:Omit<BiosecurityInspectionV2029,'id'|'score'>){
  const score=Math.round((input.visitor_control+input.vehicle_control+input.footbath+input.pest_control+input.carcass_disposal+input.cleaning_disinfection)/6);
  const row:BiosecurityInspectionV2029={...input,id:uid('FBIO'),score};
  let next={...state,biosecurity_inspections:[...state.biosecurity_inspections,row]};
  if(score<70)next=createFarmAlertV2029(next,{farm_id:input.farm_id,house_id:input.house_id,category:'biosecurity',severity:score<50?'critical':'high',title:'Biosecurity score below threshold',message:`Biosecurity score ${score}% requires corrective action.`,source_entity_type:'biosecurity_inspection',source_entity_id:row.id});
  return next;
}
export function recordWaterQualityTestV2029(state:FarmDivisionStateV2029,input:Omit<WaterQualityTestV2029,'id'>){const row={...input,id:uid('FWQ')} as WaterQualityTestV2029; return {...state,water_quality_tests:[...state.water_quality_tests,row]};}
export function recordFeedQualityTestV2029(state:FarmDivisionStateV2029,input:Omit<FeedQualityTestV2029,'id'>){const row={...input,id:uid('FFQ')} as FeedQualityTestV2029; return {...state,feed_quality_tests:[...state.feed_quality_tests,row]};}
export function createClinicalCaseV2029(state:FarmDivisionStateV2029,input:Omit<ClinicalCaseV2029,'id'|'case_number'|'opened_at'|'status'|'consultant_escalation_status'|'withdrawal_restriction_active'>){
  const row:ClinicalCaseV2029={...input,id:uid('FCASE'),case_number:serial('FCASE'),opened_at:iso(),status:'open',consultant_escalation_status:'none',withdrawal_restriction_active:false}; return {...state,clinical_cases:[row,...state.clinical_cases]};
}
export function escalateClinicalCaseV2029(state:FarmDivisionStateV2029,caseId:string,consultant:{id:string;name:string}){return {...state,clinical_cases:state.clinical_cases.map(x=>x.id===caseId?{...x,consultant_id:consultant.id,consultant_name:consultant.name,consultant_escalation_status:'requested'}:x)};}
export function closeClinicalCaseV2029(state:FarmDivisionStateV2029,caseId:string,actor:string){return {...state,clinical_cases:state.clinical_cases.map(x=>x.id===caseId?{...x,status:'closed',closed_at:iso(),closed_by:actor}:x)};}
export function setWithdrawalRestrictionV2029(state:FarmDivisionStateV2029,caseId:string,active:boolean,until?:string,reason?:string){return {...state,clinical_cases:state.clinical_cases.map(x=>x.id===caseId?{...x,withdrawal_restriction_active:active,withdrawal_until:until,marketing_block_reason:active?reason:undefined}:x)};}
export function recordMedicationAdministrationV2029(state:FarmDivisionStateV2029,input:Omit<MedicationAdministrationV2029,'id'|'inventory_issue_event_id'>){
  const rowId=uid('FMED'); const evt:FarmInventoryIntegrationEventV2029={id:uid('FINV'),farm_id:input.farm_id,cycle_id:input.cycle_id,event_type:'administration_issue',source_entity_type:'medication_administration',source_entity_id:rowId,inventory_owner:'SECTION_7',status:'pending_s7',created_at:iso()};
  const row:MedicationAdministrationV2029={...input,id:rowId,inventory_issue_event_id:evt.id}; let next={...state,medication_administrations:[...state.medication_administrations,row],inventory_integration_events:[...state.inventory_integration_events,evt]};
  if(input.clinical_case_id&&input.withdrawal_days>0){const d=new Date(input.date);d.setDate(d.getDate()+input.withdrawal_days);next=setWithdrawalRestrictionV2029(next,input.clinical_case_id,true,input.withdrawal_until||d.toISOString().slice(0,10),'Medication withdrawal period');}
  return next;
}
export function recordVaccinationAdministrationV2029(state:FarmDivisionStateV2029,input:Omit<VaccinationAdministrationV2029,'id'|'inventory_issue_event_id'>){
  const rowId=uid('FVAC');const evt:FarmInventoryIntegrationEventV2029={id:uid('FINV'),farm_id:input.farm_id,cycle_id:input.cycle_id,event_type:'administration_issue',source_entity_type:'vaccination_administration',source_entity_id:rowId,inventory_owner:'SECTION_7',status:'pending_s7',created_at:iso()};
  const row:VaccinationAdministrationV2029={...input,id:rowId,inventory_issue_event_id:evt.id};return {...state,vaccination_administrations:[...state.vaccination_administrations,row],inventory_integration_events:[...state.inventory_integration_events,evt]};
}
export function createLabFacilityV2029(state:FarmDivisionStateV2029,input:Omit<LabFacilityV2029,'id'>){const row={...input,id:uid('FLABF')} as LabFacilityV2029;return {...state,lab_facilities:[...state.lab_facilities,row]};}
export function createLabSampleV2029(state:FarmDivisionStateV2029,input:Omit<LabSampleV2029,'id'|'sample_number'|'status'|'chain_of_custody'>){const row:LabSampleV2029={...input,id:uid('FSAMP'),sample_number:serial('FSAMP'),status:'registered',chain_of_custody:[`Registered ${iso()}`]};return {...state,lab_samples:[row,...state.lab_samples]};}
export function updateLabSampleStatusV2029(state:FarmDivisionStateV2029,sampleId:string,status:LabSampleStatusV2029,actor:string,note=''){return {...state,lab_samples:state.lab_samples.map(x=>x.id===sampleId?{...x,status,chain_of_custody:[...x.chain_of_custody,`${status} by ${actor} ${iso()} ${note}`.trim()],received_at:status==='received'?iso():x.received_at}:x)};}
export function saveLabResultV2029(state:FarmDivisionStateV2029,input:{sample_id:string;result_text:string;findings:Record<string,string|number|boolean>;prepared_by:string;finalize:boolean;lab_reviewer?:string;amend_result_id?:string;amendment_reason?:string}){
  if(input.finalize&&!input.lab_reviewer)throw new Error('Final lab result requires an authorized LabReviewer.');
  const prev=state.lab_results.filter(x=>x.sample_id===input.sample_id).sort((a,b)=>b.version-a.version)[0]; const version=(prev?.version||0)+1;
  const row:LabResultVersionV2029={id:uid('FLABR'),sample_id:input.sample_id,version,result_text:input.result_text,findings:input.findings,status:input.amend_result_id?'amended':input.finalize?'final':'draft',prepared_by:input.prepared_by,reviewed_by_lab_reviewer:input.lab_reviewer,reviewed_at:input.lab_reviewer?iso():undefined,amendment_reason:input.amendment_reason,supersedes_result_id:input.amend_result_id,created_at:iso()};
  return {...state,lab_results:[row,...state.lab_results],lab_samples:state.lab_samples.map(x=>x.id===input.sample_id?{...x,status:input.finalize?'final':'result_ready'}:x)};
}
export function addFarmMediaEvidenceV2029(state:FarmDivisionStateV2029,input:Omit<FarmMediaEvidenceV2029,'id'|'encrypted'|'provider'|'uploaded'>){const row:FarmMediaEvidenceV2029={...input,id:uid('FMEDIA'),encrypted:true,provider:'shared_media_service',uploaded:Boolean(input.server_received_at)};return {...state,media:[row,...state.media]};}
export function queueOfflineOperationV2029(state:FarmDivisionStateV2029,input:Omit<OfflineQueueOperationV2029,'id'|'status'|'conflict_fields'|'retry_count'>){
  const existing=state.offline_queue.find(x=>x.idempotency_key===input.idempotency_key); if(existing)return state;
  const row:OfflineQueueOperationV2029={...input,id:uid('FOFF'),status:'queued',conflict_fields:[],retry_count:0};return {...state,offline_queue:[row,...state.offline_queue]};
}
export function markOfflineOperationSyncedV2029(state:FarmDivisionStateV2029,id:string,serverReceivedAt=iso()){return {...state,offline_queue:state.offline_queue.map(x=>x.id===id?{...x,status:'synced',server_received_at:serverReceivedAt}:x)};}
export function markOfflineConflictV2029(state:FarmDivisionStateV2029,id:string,fields:string[],resolution?:Record<string,string>){return {...state,offline_queue:state.offline_queue.map(x=>x.id===id?{...x,status:resolution?'synced':'conflict',conflict_fields:fields,conflict_resolution:resolution,retry_count:x.retry_count+1}:x)};}
export function createFarmAlertV2029(state:FarmDivisionStateV2029,input:Omit<FarmAlertV2029,'id'|'opened_at'|'status'>){const row:FarmAlertV2029={...input,id:uid('FALT'),opened_at:iso(),status:'open'};return {...state,alerts:[row,...state.alerts]};}
export function resolveFarmAlertV2029(state:FarmDivisionStateV2029,id:string,actor:string){return {...state,alerts:state.alerts.map(x=>x.id===id?{...x,status:'resolved',resolved_by:actor,resolved_at:iso()}:x)};}
export function createFarmTaskV2029(state:FarmDivisionStateV2029,input:Omit<FarmTaskV2029,'id'|'created_at'|'status'|'evidence_refs'> & {evidence_refs?:string[]}){const row:FarmTaskV2029={...input,id:uid('FTASK'),created_at:iso(),status:'pending',evidence_refs:input.evidence_refs||[]};return {...state,tasks:[row,...state.tasks]};}
export function completeFarmTaskV2029(state:FarmDivisionStateV2029,id:string,actor:string,evidenceRefs:string[]=[]){const t=state.tasks.find(x=>x.id===id);if(!t)return state;if(t.evidence_required&&!evidenceRefs.length&&!t.evidence_refs.length)throw new Error('Task evidence is required.');return {...state,tasks:state.tasks.map(x=>x.id===id?{...x,status:'completed',completed_at:iso(),completed_by:actor,evidence_refs:[...x.evidence_refs,...evidenceRefs]}:x)};}
export function createFarmExpenseClaimV2029(state:FarmDivisionStateV2029,input:Omit<FarmExpenseClaimV2029,'id'|'claim_number'|'status'|'accounting_event_id'>){const row:FarmExpenseClaimV2029={...input,id:uid('FEXP'),claim_number:serial('FEXP'),status:'submitted'};return {...state,expense_claims:[row,...state.expense_claims]};}
export function approveFarmExpenseClaimV2029(state:FarmDivisionStateV2029,id:string,approved:boolean){const claim=state.expense_claims.find(x=>x.id===id);if(!claim)return state;if(!approved)return {...state,expense_claims:state.expense_claims.map(x=>x.id===id?{...x,status:'rejected'}:x)};const evt:FarmAccountingIntegrationEventV2029={id:uid('FACC'),farm_id:claim.farm_id,house_id:claim.house_id,cycle_id:claim.cycle_id,event_type:'expense_claim',source_entity_type:'farm_expense_claim',source_entity_id:claim.id,accounting_owner:'SECTION_12',status:'pending_s12',created_at:iso()};return {...state,expense_claims:state.expense_claims.map(x=>x.id===id?{...x,status:'sent_to_accounting',accounting_event_id:evt.id}:x),accounting_integration_events:[...state.accounting_integration_events,evt]};}

export function createFarmFinancialDocumentV2029(state:FarmDivisionStateV2029,input:Omit<FarmFinancialDocumentV2029,'id'|'document_number'|'created_at'|'status'|'accounting_event_id'> & {status?:FarmFinancialDocumentV2029['status']}){
  const needsAccounting=['payment_request','receipt_advice','owner_funding'].includes(input.type);
  const row:FarmFinancialDocumentV2029={...input,id:uid('FDOC'),document_number:serial('FDOC'),created_at:iso(),status:input.status|| (needsAccounting?'pending_s12':'issued')};
  if(!needsAccounting)return audit({...state,financial_documents:[row,...state.financial_documents]},input.prepared_by,'accountant','create_financial_document','farm_financial_document',row.id,undefined,row);
  const evt:FarmAccountingIntegrationEventV2029={id:uid('FACC'),farm_id:row.farm_id,house_id:row.house_id,cycle_id:row.cycle_id,event_type:'expense_claim',source_entity_type:'farm_financial_document',source_entity_id:row.id,accounting_owner:'SECTION_12',status:'pending_s12',created_at:iso()};
  const withEvent={...row,accounting_event_id:evt.id};
  return audit({...state,financial_documents:[withEvent,...state.financial_documents],accounting_integration_events:[evt,...state.accounting_integration_events]},input.prepared_by,'accountant','create_financial_document_pending_s12','farm_financial_document',row.id,undefined,withEvent);
}
export function markFarmFinancialDocumentPostedV2029(state:FarmDivisionStateV2029,id:string,accountingReference:string,actor:string){
  const before=state.financial_documents.find(x=>x.id===id);if(!before)return state;
  let next:FarmDivisionStateV2029={...state,financial_documents:state.financial_documents.map(x=>x.id===id?{...x,status:'posted_s12' as const,accounting_reference_id:accountingReference}:x)};
  if(before.accounting_event_id)next=markFarmAccountingIntegrationPostedV2029(next,before.accounting_event_id,accountingReference);
  return audit(next,actor,'accountant','post_financial_document_s12','farm_financial_document',id,before,next.financial_documents.find(x=>x.id===id));
}
export function createFarmRoleHandoffV2029(state:FarmDivisionStateV2029,input:Omit<FarmRoleHandoffV2029,'id'|'status'|'created_at'>){
  const row:FarmRoleHandoffV2029={...input,id:uid('FHAND'),status:'pending',created_at:iso()};
  return audit({...state,role_handoffs:[row,...state.role_handoffs]},input.created_by,input.from_role,'create_role_handoff','farm_role_handoff',row.id,undefined,row);
}
export function acceptFarmRoleHandoffV2029(state:FarmDivisionStateV2029,id:string,actor:string){const before=state.role_handoffs.find(x=>x.id===id);if(!before)return state;const next={...state,role_handoffs:state.role_handoffs.map(x=>x.id===id?{...x,status:'accepted' as const,accepted_at:iso(),accepted_by:actor}:x)};return audit(next,actor,before.to_role,'accept_role_handoff','farm_role_handoff',id,before,next.role_handoffs.find(x=>x.id===id));}
export function completeFarmRoleHandoffV2029(state:FarmDivisionStateV2029,id:string,actor:string,note?:string){const before=state.role_handoffs.find(x=>x.id===id);if(!before)return state;const next={...state,role_handoffs:state.role_handoffs.map(x=>x.id===id?{...x,status:'completed' as const,completed_at:iso(),completed_by:actor,note}:x)};return audit(next,actor,before.to_role,'complete_role_handoff','farm_role_handoff',id,before,next.role_handoffs.find(x=>x.id===id));}

export function recordMarketPriceV2029(state:FarmDivisionStateV2029,input:Omit<MarketPriceSnapshotV2029,'id'>){const row={...input,id:uid('FMKT')} as MarketPriceSnapshotV2029;return {...state,market_prices:[row,...state.market_prices]};}
export function createBenchmarkSnapshotV2029(state:FarmDivisionStateV2029,input:Omit<FarmBenchmarkSnapshotV2029,'id'>){const row={...input,id:uid('FBENCH')} as FarmBenchmarkSnapshotV2029;return {...state,benchmarks:[row,...state.benchmarks]};}
export function createFarmReferenceVersionV2029(state:FarmDivisionStateV2029,input:Omit<FarmReferenceVersionV2029,'id'|'version'|'status'>){const latest=state.reference_versions.filter(x=>x.reference_type===input.reference_type&&x.code===input.code).sort((a,b)=>b.version-a.version)[0];const row:FarmReferenceVersionV2029={...input,id:uid('FREF'),version:(latest?.version||0)+1,status:'draft'};return {...state,reference_versions:[row,...state.reference_versions]};}
export function activateFarmReferenceVersionV2029(state:FarmDivisionStateV2029,id:string,actor:string){const target=state.reference_versions.find(x=>x.id===id);if(!target)return state;return {...state,reference_versions:state.reference_versions.map(x=>x.reference_type===target.reference_type&&x.code===target.code?(x.id===id?{...x,status:'active',approved_by:actor}:{...x,status:x.status==='active'?'superseded':x.status}):x)};}
export function markFarmInventoryIntegrationPostedV2029(state:FarmDivisionStateV2029,id:string,movementReference:string){return {...state,inventory_integration_events:state.inventory_integration_events.map(x=>x.id===id?{...x,status:'posted_s7',inventory_movement_reference_id:movementReference}:x)};}
export function markFarmAccountingIntegrationPostedV2029(state:FarmDivisionStateV2029,id:string,accountingReference:string):FarmDivisionStateV2029{return {...state,accounting_integration_events:state.accounting_integration_events.map(x=>x.id===id?{...x,status:'posted_s12' as const,accounting_reference_id:accountingReference}:x)};}

export function farmFinancialKpisV2029(state:FarmDivisionStateV2029,managed:ManagedOperationsStateV197,farmId:string,cycleId?:string){
  const legacyCosts=managed.cost_entries.filter(x=>x.farm_id===farmId&&(!cycleId||x.flock_id===cycleId)).reduce((s,x)=>s+(x.debit_credit==='debit'?x.amount_sar:-x.amount_sar),0);
  const claims=state.expense_claims.filter(x=>x.farm_id===farmId&&(!cycleId||x.cycle_id===cycleId)&&!['rejected'].includes(x.status));
  const claimSar=claims.reduce((s,x)=>s+(x.currency==='SAR'?x.amount:0),0);
  const latestMarket=state.market_prices.find(x=>x.commodity==='live_bird'&&x.approved);
  const cycle=cycleId?managed.flock_cycles.find(x=>x.id===cycleId):undefined; const pop=cycle?populationProjectionV2029(state,managed,cycle.id):undefined;
  const estimatedRevenue=latestMarket&&pop?latestMarket.price*pop.current:0; const totalCost=legacyCosts+claimSar;
  return {legacy_cost_sar:legacyCosts,operational_claims_sar:claimSar,total_cost_sar:totalCost,estimated_revenue_sar:estimatedRevenue,margin_sar:estimatedRevenue-totalCost,break_even_per_live_bird_sar:pop?.current?totalCost/pop.current:0};
}
export function farmRoleDashboardV2029(state:FarmDivisionStateV2029,managed:ManagedOperationsStateV197,role:PlatformRoleV195|string,userId:string){
  const assignments=state.staff_assignments.filter(x=>x.user_id===userId&&x.status==='active'); const farmIds=new Set(assignments.map(x=>x.farm_id));
  const farms=role==='system_owner'||role==='ceo'||role==='sector_manager'?managed.farms:managed.farms.filter(x=>farmIds.has(x.id));
  const cycles=managed.flock_cycles.filter(x=>farms.some(f=>f.id===x.farm_id));
  return {role,user_id:userId,farm_count:farms.length,cycle_count:cycles.length,open_alerts:state.alerts.filter(x=>farms.some(f=>f.id===x.farm_id)&&x.status!=='resolved').length,pending_tasks:state.tasks.filter(x=>(x.assigned_user_id===userId||x.assigned_role===role)&&x.status!=='completed').length,offline_conflicts:state.offline_queue.filter(x=>x.user_id===userId&&x.status==='conflict').length,lab_pending:state.lab_samples.filter(x=>['registered','collected','in_transit','received','testing','result_ready'].includes(x.status)).length,clinical_open:state.clinical_cases.filter(x=>farms.some(f=>f.id===x.farm_id)&&x.status!=='closed').length};
}

export function validateFarmDivisionV2029(state:FarmDivisionStateV2029,managed:ManagedOperationsStateV197):string[]{
  const issues:string[]=[];
  if(state.settings.min_completeness_percent<90)issues.push('completeness_gate_below_90');
  if(!state.settings.durable_offline_queue_required)issues.push('durable_offline_queue_required');
  if(!state.settings.media_encryption_required)issues.push('media_encryption_required');
  if(!state.settings.sensor_readings_append_only)issues.push('sensor_readings_must_be_append_only');
  if(!state.settings.lab_final_requires_reviewer)issues.push('lab_final_reviewer_required');
  if(!state.settings.no_duplicate_financial_ledger||state.shared_report_execution_owner!=='SECTION_14')issues.push('shared_finance_report_ownership_violation');
  if(!state.settings.no_duplicate_inventory_ledger)issues.push('duplicate_inventory_ledger_forbidden');
  if(state.accounting_integration_events.some(x=>x.accounting_owner!=='SECTION_12'))issues.push('accounting_owner_must_be_section_12');
  if(state.inventory_integration_events.some(x=>x.inventory_owner!=='SECTION_7'))issues.push('inventory_owner_must_be_section_7');
  if(state.lab_results.some(x=>x.status==='final'&&!x.reviewed_by_lab_reviewer))issues.push('unreviewed_final_lab_result');
  if(state.environment_readings.some(x=>x.immutable!==true))issues.push('mutable_environment_reading');
  if(new Set(state.population_events.map(x=>x.idempotency_key)).size!==state.population_events.length)issues.push('duplicate_population_idempotency_key');
  if(new Set(state.offline_queue.map(x=>x.idempotency_key)).size!==state.offline_queue.length)issues.push('duplicate_offline_idempotency_key');
  const farmIds=new Set(managed.farms.map(x=>x.id));
  for(const row of [...state.owner_relationships,...state.staff_assignments,...state.population_events,...state.feed_records,...state.water_records,...state.biosecurity_inspections,...state.clinical_cases,...state.expense_claims])if(row.farm_id&&!farmIds.has(row.farm_id))issues.push(`orphan_farm_reference:${row.farm_id}`);
  return [...new Set(issues)];
}

export const FARM_DIVISION_ACCEPTANCE_V2029=[
  'Farm hierarchy uses managed farm/house/cycle as projections and source-linked records',
  'Owner relationship supports person/organization/government',
  'Effective-dated staff assignments and DoctorAssignment extension',
  'BirdPopulationEvent canonical population changes',
  'Mortality/culling detail feeds population events',
  'Feed/water/environment detailed canonical records',
  'Environment sensor readings append-only',
  'Biosecurity inspections and corrective actions',
  'Water quality workflow',
  'Feed quality workflow',
  'Clinical cases with orthogonal consultant escalation',
  'Clinical case can close while withdrawal restriction remains active',
  'Medication administration triggers Section 7 inventory integration',
  'Vaccination administration triggers Section 7 inventory integration',
  'Lab facility/partner model',
  'Lab chain of custody',
  'Final lab result requires LabReviewer',
  'Lab amendments are versioned',
  'Shared encrypted media service abstraction',
  'Encrypted durable offline queue contract',
  'Idempotency and device clock drift tracking',
  'Field-specific conflict resolution',
  'FarmAlert shared domain entity',
  'FarmTask shared domain entity',
  'FarmExpense is operational claim only',
  'Windows role handoffs connect responsibilities without duplicate workflow engines',
  'Farm financial documents are operational documents and Section 12 remains accounting owner',
  'Section 12 owns accounting posting/payment',
  'Section 7 owns farm inventory movements',
  'Market price provider/manual abstraction',
  'Break-even and margin KPI functions',
  'Cycle/house/farm benchmark snapshots',
  'Versioned breed/clinical/quality/template reference data',
  'Shared Section 14 report execution ownership',
  'Shared Section 15 governance ownership',
  'Currency master codes SAR/YER_NEW/YER_OLD',
  'Android deferred until Windows closure',
  'Append-only audit history'
] as const;
