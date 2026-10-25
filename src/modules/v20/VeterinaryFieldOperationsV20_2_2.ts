import type { EnterpriseFoundationStateV2021, EnterpriseResourceContextV2021 } from './EnterpriseFoundationV20_2_1';
import { resolveVeterinaryCoverageV2021 } from './EnterpriseFoundationV20_2_1';
import type { EnterpriseWebStateV202, SpecialtyV202, TomorrowPlanV202 } from './EnterpriseWebPlatformV20_2';
import { createTomorrowPlanV202, updateRoleTaskV202 } from './EnterpriseWebPlatformV20_2';

export type ClinicalRiskV2022='low'|'medium'|'high'|'critical';
export type DailyClosingStatusV2022='draft'|'submitted'|'needs_correction'|'validated'|'analysis_ready'|'reviewed'|'closed';
export type VetReviewDispositionV2022='routine'|'monitor'|'action_required'|'critical'|'open_case';
export type MedicalCaseStatusV2022='open'|'under_investigation'|'awaiting_lab'|'treatment'|'monitoring'|'resolved'|'closed';
export type ConsultationStatusV2022='requested'|'accepted'|'in_review'|'responded'|'closed'|'cancelled';
export type LabSampleStatusV2022='requested'|'collection_scheduled'|'collected'|'in_transit'|'received'|'testing'|'result_ready'|'vet_reviewed'|'closed'|'rejected';
export type MedicationOrderStatusV2022='draft'|'approved'|'active'|'completed'|'stopped'|'cancelled';
export type FieldExecutionStatusV2022='submitted'|'accepted'|'rejected'|'needs_evidence';
export type EscalationStatusV2022='open'|'acknowledged'|'resolved'|'closed';

export interface WorkerDailyClosingV2022{
  id:string; closing_number:string; farm_id:string; flock_id:string; report_date:string; shift:'day'|'night'|'full_day'; worker_user_id:string;
  submitted_at:string; mortality_count:number; cull_count:number; feed_used_kg:number; water_liters?:number; avg_weight_g?:number; weight_sample_count?:number;
  temperature_min_c?:number; temperature_max_c?:number; temperature_avg_c?:number; humidity_min_pct?:number; humidity_max_pct?:number;
  observations:string; symptom_tags:string[]; feed_change_note?:string; water_change_note?:string; evidence_refs:string[];
  status:DailyClosingStatusV2022; validation_errors:string[]; validated_at?:string; validated_by?:string;
}

export interface AIClinicalAnalysisV2022{
  id:string; analysis_number:string; closing_id:string; farm_id:string; flock_id:string; generated_at:string;
  risk_level:ClinicalRiskV2022; signals:Array<{code:string;label:string;severity:ClinicalRiskV2022;value?:number|string}>;
  suggested_differentials:string[]; recommended_human_actions:string[]; confidence_percent:number; requires_veterinary_review:boolean;
  model_label:string; human_decision_required:true; status:'generated'|'superseded'|'reviewed';
}

export interface VeterinaryDailyReviewV2022{
  id:string; review_number:string; closing_id:string; analysis_id?:string; farm_id:string; flock_id:string; vet_user_id:string;
  reviewed_at:string; disposition:VetReviewDispositionV2022; findings:string; decision_note:string; approved_signal_codes:string[];
  rejected_signal_codes:string[]; requires_lab:boolean; requires_consultation:boolean; next_review_at?:string; case_id?:string; status:'final';
}

export interface MedicalTimelineEventV2022{
  id:string; case_id:string; occurred_at:string; event_type:'case_opened'|'worker_closing'|'ai_analysis'|'vet_review'|'consultation'|'lab'|'diagnosis'|'medication'|'vaccination'|'task_execution'|'follow_up'|'case_closed';
  title:string; summary:string; actor_user_id:string; source_type:string; source_id:string; evidence_refs:string[];
}

export interface MedicalCaseV2022{
  id:string; case_number:string; farm_id:string; flock_id:string; opened_at:string; opened_by:string; primary_vet_user_id:string;
  consultant_user_ids:string[]; severity:ClinicalRiskV2022; status:MedicalCaseStatusV2022; presenting_problem:string; onset_date?:string;
  differential_diagnoses:string[]; final_diagnosis?:string; diagnostic_basis:string[]; lab_order_ids:string[]; consultation_ids:string[];
  medication_order_ids:string[]; vaccination_order_ids:string[]; timeline_event_ids:string[]; next_follow_up_at?:string; resolved_at?:string; closed_at?:string;
}

export interface SpecialistConsultationV2022{
  id:string; consultation_number:string; case_id:string; farm_id:string; flock_id:string; specialty:SpecialtyV202; urgency:ClinicalRiskV2022;
  requested_by_vet_user_id:string; requested_at:string; assigned_consultant_user_id?:string; accepted_at?:string; question:string; clinical_summary:string;
  recommendation?:string; response_at?:string; status:ConsultationStatusV2022;
}

export interface ChainOfCustodyEventV2022{
  id:string; at:string; action:'requested'|'collection_scheduled'|'collected'|'sealed'|'handed_over'|'received'|'rejected'|'testing_started'|'result_issued'|'vet_reviewed';
  actor_user_id:string; location?:string; note?:string; evidence_refs:string[];
}

export interface LabSampleOrderV2022{
  id:string; lab_order_number:string; case_id:string; farm_id:string; flock_id:string; requested_by_vet_user_id:string; requested_at:string;
  sample_type:string; sample_count:number; requested_tests:string[]; collection_instructions:string; assigned_collector_user_id?:string; laboratory_id?:string;
  urgency:ClinicalRiskV2022; status:LabSampleStatusV2022; chain_of_custody:ChainOfCustodyEventV2022[]; result_summary?:string; result_document_refs:string[];
  reviewed_by_vet_user_id?:string; reviewed_at?:string;
}

export interface MedicationOrderV2022{
  id:string; medication_number:string; case_id?:string; farm_id:string; flock_id:string; order_type:'treatment'|'vaccination'; item_name:string;
  active_ingredient?:string; dose:string; route:string; frequency?:string; duration_days?:number; start_date:string; end_date?:string;
  restricted_antibiotic:boolean; sensitivity_report_ref?:string; emergency_override_reason?:string; meat_withdrawal_days:number; egg_withdrawal_days?:number;
  safe_marketing_date?:string; issued_by_vet_user_id:string; approved_at?:string; status:MedicationOrderStatusV2022; notes?:string;
}

export interface FieldTaskExecutionV2022{
  id:string; execution_number:string; task_id:string; farm_id?:string; flock_id?:string; submitted_by_user_id:string; submitted_at:string;
  note:string; measurements:Record<string,string|number|boolean>; evidence_refs:string[]; status:FieldExecutionStatusV2022; reviewed_by_user_id?:string; reviewed_at?:string; rejection_reason?:string;
}

export interface VeterinaryFollowUpV2022{
  id:string; followup_number:string; case_id:string; farm_id:string; flock_id:string; scheduled_at:string; completed_at?:string; assigned_vet_user_id:string;
  status:'scheduled'|'completed'|'missed'|'cancelled'; findings?:string; outcome?:string;
}

export interface ClinicalEscalationV2022{
  id:string; escalation_number:string; source_type:'closing'|'analysis'|'case'|'lab'|'task'|'consultation'; source_id:string; farm_id?:string; flock_id?:string;
  severity:ClinicalRiskV2022; reason:string; stage:number; target_user_ids:string[]; target_role_codes:string[]; opened_at:string; next_escalation_at?:string;
  acknowledged_by?:string; acknowledged_at?:string; resolved_by?:string; resolved_at?:string; status:EscalationStatusV2022;
}

export interface VeterinaryFieldAuditV2022{ id:string; at:string; actor:string; action:string; entity_type:string; entity_id:string; reason:string; before?:unknown; after?:unknown; }

export interface VeterinaryFieldStateV2022{
  version:'20.2.2'; migrated_from:'20.2.1'; worker_daily_closings:WorkerDailyClosingV2022[]; ai_clinical_analyses:AIClinicalAnalysisV2022[];
  veterinary_reviews:VeterinaryDailyReviewV2022[]; medical_cases:MedicalCaseV2022[]; timeline_events:MedicalTimelineEventV2022[];
  consultations:SpecialistConsultationV2022[]; lab_orders:LabSampleOrderV2022[]; medication_orders:MedicationOrderV2022[];
  task_executions:FieldTaskExecutionV2022[]; followups:VeterinaryFollowUpV2022[]; escalations:ClinicalEscalationV2022[]; audit:VeterinaryFieldAuditV2022[];
  settings:{require_worker_closing_before_plan:boolean;require_vet_review_for_high_risk:boolean;require_evidence_for_critical_tasks:boolean;restricted_antibiotic_requires_sensitivity_or_override:boolean;critical_escalation_minutes:number;high_escalation_minutes:number;human_in_the_loop_required:true;};
}

const now=()=>new Date().toISOString();
const nid=(p:string)=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const serial=(p:string)=>`${p}-YE-${new Date().getUTCFullYear()}-${String(Date.now()).slice(-8)}`;
const addDays=(date:string,days:number)=>{const d=new Date(`${date}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+Math.max(0,days));return d.toISOString().slice(0,10)};
const audit=(state:VeterinaryFieldStateV2022,actor:string,action:string,entity_type:string,entity_id:string,reason:string,before?:unknown,after?:unknown):VeterinaryFieldStateV2022=>({...state,audit:[{id:nid('VAUD'),at:now(),actor,action,entity_type,entity_id,reason,before,after},...state.audit]});

export function buildVeterinaryFieldStateV2022(existing?:Partial<VeterinaryFieldStateV2022>):VeterinaryFieldStateV2022{
  const base:VeterinaryFieldStateV2022={version:'20.2.2',migrated_from:'20.2.1',worker_daily_closings:[],ai_clinical_analyses:[],veterinary_reviews:[],medical_cases:[],timeline_events:[],consultations:[],lab_orders:[],medication_orders:[],task_executions:[],followups:[],escalations:[],audit:[],settings:{require_worker_closing_before_plan:true,require_vet_review_for_high_risk:true,require_evidence_for_critical_tasks:true,restricted_antibiotic_requires_sensitivity_or_override:true,critical_escalation_minutes:15,high_escalation_minutes:60,human_in_the_loop_required:true}};
  if(!existing)return base;
  return {...base,...existing,version:'20.2.2',migrated_from:'20.2.1',worker_daily_closings:existing.worker_daily_closings||[],ai_clinical_analyses:existing.ai_clinical_analyses||[],veterinary_reviews:existing.veterinary_reviews||[],medical_cases:existing.medical_cases||[],timeline_events:existing.timeline_events||[],consultations:existing.consultations||[],lab_orders:existing.lab_orders||[],medication_orders:existing.medication_orders||[],task_executions:existing.task_executions||[],followups:existing.followups||[],escalations:existing.escalations||[],audit:existing.audit||[],settings:{...base.settings,...(existing.settings||{})}};
}

export function createWorkerDailyClosingV2022(state:VeterinaryFieldStateV2022,input:Omit<WorkerDailyClosingV2022,'id'|'closing_number'|'submitted_at'|'status'|'validation_errors'|'validated_at'|'validated_by'>):VeterinaryFieldStateV2022{
  if(!input.farm_id||!input.flock_id||!input.worker_user_id||!input.report_date)throw new Error('closing_required_fields_missing');
  if(state.worker_daily_closings.some(x=>x.flock_id===input.flock_id&&x.report_date===input.report_date&&x.shift===input.shift&&x.status!=='needs_correction'))throw new Error('daily_closing_already_exists');
  if(input.mortality_count<0||input.cull_count<0||input.feed_used_kg<0)throw new Error('closing_negative_values_not_allowed');
  const row:WorkerDailyClosingV2022={...input,id:nid('CLOSE'),closing_number:serial('FDC'),submitted_at:now(),status:'submitted',validation_errors:[]};
  return audit({...state,worker_daily_closings:[row,...state.worker_daily_closings]},input.worker_user_id,'worker_closing_submit','worker_daily_closing',row.id,'worker submitted daily closing',undefined,row);
}

export function validateWorkerDailyClosingV2022(state:VeterinaryFieldStateV2022,closingId:string,actor:string):VeterinaryFieldStateV2022{
  const row=state.worker_daily_closings.find(x=>x.id===closingId);if(!row)throw new Error('daily_closing_not_found');
  const errors:string[]=[];
  if(row.mortality_count>100000)errors.push('mortality_out_of_range');
  if(row.feed_used_kg===0)errors.push('feed_usage_missing_or_zero');
  if(row.temperature_min_c!==undefined&&row.temperature_max_c!==undefined&&row.temperature_min_c>row.temperature_max_c)errors.push('temperature_min_above_max');
  if(row.humidity_min_pct!==undefined&&(row.humidity_min_pct<0||row.humidity_min_pct>100))errors.push('humidity_min_out_of_range');
  if(row.humidity_max_pct!==undefined&&(row.humidity_max_pct<0||row.humidity_max_pct>100))errors.push('humidity_max_out_of_range');
  if(row.avg_weight_g!==undefined&&row.avg_weight_g<=0)errors.push('weight_invalid');
  const nextRow={...row,status:(errors.length?'needs_correction':'validated') as DailyClosingStatusV2022,validation_errors:errors,validated_at:now(),validated_by:actor};
  const next={...state,worker_daily_closings:state.worker_daily_closings.map(x=>x.id===closingId?nextRow:x)};
  return audit(next,actor,'worker_closing_validate','worker_daily_closing',closingId,errors.length?'validation failed':'validation passed',row,nextRow);
}

export function analyzeWorkerClosingV2022(state:VeterinaryFieldStateV2022,closingId:string,actor='system_ai'):VeterinaryFieldStateV2022{
  const closing=state.worker_daily_closings.find(x=>x.id===closingId);if(!closing)throw new Error('daily_closing_not_found');
  if(!['validated','analysis_ready'].includes(closing.status))throw new Error('daily_closing_must_be_validated_before_analysis');
  const signals:AIClinicalAnalysisV2022['signals']=[];
  let score=0;
  if(closing.mortality_count>=50){signals.push({code:'MORTALITY_HIGH',label:'High mortality reported',severity:'critical',value:closing.mortality_count});score+=4}
  else if(closing.mortality_count>=15){signals.push({code:'MORTALITY_ELEVATED',label:'Elevated mortality reported',severity:'high',value:closing.mortality_count});score+=3}
  else if(closing.mortality_count>=5){signals.push({code:'MORTALITY_WATCH',label:'Mortality requires trend review',severity:'medium',value:closing.mortality_count});score+=1}
  if(closing.temperature_max_c!==undefined&&closing.temperature_max_c>=32){signals.push({code:'HEAT_STRESS_RISK',label:'High temperature signal',severity:'high',value:closing.temperature_max_c});score+=2}
  if(closing.temperature_min_c!==undefined&&closing.temperature_min_c<=18){signals.push({code:'COLD_STRESS_RISK',label:'Low temperature signal',severity:'high',value:closing.temperature_min_c});score+=2}
  if(closing.humidity_max_pct!==undefined&&closing.humidity_max_pct>=80){signals.push({code:'HUMIDITY_HIGH',label:'High humidity signal',severity:'medium',value:closing.humidity_max_pct});score+=1}
  if(closing.symptom_tags.length){signals.push({code:'SYMPTOMS_REPORTED',label:'Worker reported clinical symptoms',severity:closing.symptom_tags.length>=3?'high':'medium',value:closing.symptom_tags.join(', ')});score+=Math.min(3,closing.symptom_tags.length)}
  const risk:ClinicalRiskV2022=score>=6?'critical':score>=4?'high':score>=2?'medium':'low';
  const differentials:string[]=[];
  if(closing.symptom_tags.some(x=>/respir|cough|breath|تنفس|كحة/i.test(x)))differentials.push('Respiratory disease complex');
  if(closing.symptom_tags.some(x=>/diarr|enter|اسهال|إسهال/i.test(x)))differentials.push('Enteric disease / feed-water disorder');
  if(closing.mortality_count>=15)differentials.push('Infectious / management / environmental differential required');
  if(!differentials.length)differentials.push('No specific differential generated; trend review required');
  const analysis:AIClinicalAnalysisV2022={id:nid('AIA'),analysis_number:serial('AIA'),closing_id:closing.id,farm_id:closing.farm_id,flock_id:closing.flock_id,generated_at:now(),risk_level:risk,signals,suggested_differentials:differentials,recommended_human_actions:risk==='critical'?['Immediate veterinary review','Verify mortality count and environment','Consider necropsy and laboratory sampling']:risk==='high'?['Veterinary review same shift','Review feed/water/environment trends']:['Routine veterinary review','Continue monitoring'],confidence_percent:Math.min(90,55+signals.length*7),requires_veterinary_review:true,model_label:'V20.2.2 deterministic clinical triage engine',human_decision_required:true,status:'generated'};
  const next={...state,ai_clinical_analyses:[analysis,...state.ai_clinical_analyses],worker_daily_closings:state.worker_daily_closings.map(x=>x.id===closing.id?{...x,status:'analysis_ready' as DailyClosingStatusV2022}:x)};
  return audit(next,actor,'closing_ai_analysis','ai_clinical_analysis',analysis.id,'AI triage generated; human veterinary decision required',undefined,analysis);
}

function appendTimeline(state:VeterinaryFieldStateV2022,input:Omit<MedicalTimelineEventV2022,'id'>):VeterinaryFieldStateV2022{
  const event:MedicalTimelineEventV2022={...input,id:nid('TML')};
  return {...state,timeline_events:[event,...state.timeline_events],medical_cases:state.medical_cases.map(c=>c.id===input.case_id?{...c,timeline_event_ids:[event.id,...c.timeline_event_ids]}:c)};
}

export function openMedicalCaseV2022(state:VeterinaryFieldStateV2022,input:{farm_id:string;flock_id:string;opened_by:string;primary_vet_user_id:string;severity:ClinicalRiskV2022;presenting_problem:string;onset_date?:string;differential_diagnoses?:string[];source_type?:string;source_id?:string}):VeterinaryFieldStateV2022{
  if(!input.primary_vet_user_id)throw new Error('primary_vet_required');
  const c:MedicalCaseV2022={id:nid('CASE'),case_number:serial('VCASE'),farm_id:input.farm_id,flock_id:input.flock_id,opened_at:now(),opened_by:input.opened_by,primary_vet_user_id:input.primary_vet_user_id,consultant_user_ids:[],severity:input.severity,status:'open',presenting_problem:input.presenting_problem,onset_date:input.onset_date,differential_diagnoses:input.differential_diagnoses||[],diagnostic_basis:[],lab_order_ids:[],consultation_ids:[],medication_order_ids:[],vaccination_order_ids:[],timeline_event_ids:[]};
  let next={...state,medical_cases:[c,...state.medical_cases]};
  next=appendTimeline(next,{case_id:c.id,occurred_at:now(),event_type:'case_opened',title:'Medical case opened',summary:input.presenting_problem,actor_user_id:input.opened_by,source_type:input.source_type||'manual',source_id:input.source_id||c.id,evidence_refs:[]});
  return audit(next,input.opened_by,'medical_case_open','medical_case',c.id,'medical case opened',undefined,c);
}

export function submitVeterinaryReviewV2022(state:VeterinaryFieldStateV2022,input:{closing_id:string;vet_user_id:string;disposition:VetReviewDispositionV2022;findings:string;decision_note:string;approved_signal_codes?:string[];rejected_signal_codes?:string[];requires_lab?:boolean;requires_consultation?:boolean;next_review_at?:string;open_case?:boolean}):VeterinaryFieldStateV2022{
  const closing=state.worker_daily_closings.find(x=>x.id===input.closing_id);if(!closing)throw new Error('daily_closing_not_found');
  if(!['analysis_ready','validated'].includes(closing.status))throw new Error('closing_not_ready_for_veterinary_review');
  const analysis=state.ai_clinical_analyses.find(x=>x.closing_id===closing.id&&x.status==='generated');
  let next=state;let caseId:string|undefined;
  const shouldOpen=input.open_case||input.disposition==='open_case'||input.disposition==='critical'||Boolean(input.requires_lab)||Boolean(input.requires_consultation);
  if(shouldOpen){
    next=openMedicalCaseV2022(next,{farm_id:closing.farm_id,flock_id:closing.flock_id,opened_by:input.vet_user_id,primary_vet_user_id:input.vet_user_id,severity:input.disposition==='critical'?'critical':analysis?.risk_level||'medium',presenting_problem:input.findings||closing.observations,differential_diagnoses:analysis?.suggested_differentials,source_type:'worker_daily_closing',source_id:closing.id});
    caseId=next.medical_cases[0]?.id;
  }
  const review:VeterinaryDailyReviewV2022={id:nid('VREV'),review_number:serial('VREV'),closing_id:closing.id,analysis_id:analysis?.id,farm_id:closing.farm_id,flock_id:closing.flock_id,vet_user_id:input.vet_user_id,reviewed_at:now(),disposition:input.disposition,findings:input.findings,decision_note:input.decision_note,approved_signal_codes:input.approved_signal_codes||analysis?.signals.map(s=>s.code)||[],rejected_signal_codes:input.rejected_signal_codes||[],requires_lab:Boolean(input.requires_lab),requires_consultation:Boolean(input.requires_consultation),next_review_at:input.next_review_at,case_id:caseId,status:'final'};
  next={...next,veterinary_reviews:[review,...next.veterinary_reviews],worker_daily_closings:next.worker_daily_closings.map(x=>x.id===closing.id?{...x,status:'reviewed' as DailyClosingStatusV2022}:x),ai_clinical_analyses:next.ai_clinical_analyses.map(x=>x.id===analysis?.id?{...x,status:'reviewed' as const}:x)};
  if(caseId)next=appendTimeline(next,{case_id:caseId,occurred_at:review.reviewed_at,event_type:'vet_review',title:'Veterinary review',summary:`${review.disposition}: ${review.decision_note}`,actor_user_id:input.vet_user_id,source_type:'veterinary_review',source_id:review.id,evidence_refs:[]});
  return audit(next,input.vet_user_id,'veterinary_review_finalize','veterinary_review',review.id,'veterinary review finalized',undefined,review);
}

export function requestSpecialistConsultationV2022(state:VeterinaryFieldStateV2022,foundation:EnterpriseFoundationStateV2021,input:{case_id:string;specialty:SpecialtyV202;urgency:ClinicalRiskV2022;requested_by_vet_user_id:string;question:string;clinical_summary:string}):VeterinaryFieldStateV2022{
  const c=state.medical_cases.find(x=>x.id===input.case_id);if(!c)throw new Error('medical_case_not_found');
  const coverage=resolveVeterinaryCoverageV2021(foundation,{farm_id:c.farm_id,flock_id:c.flock_id},input.specialty).filter(x=>x.coverage_role==='consultant'||x.coverage_role==='backup'||x.coverage_role==='on_call');
  const assigned=coverage[0]?.vet_user_id;
  const q:SpecialistConsultationV2022={id:nid('CONS'),consultation_number:serial('CONS'),case_id:c.id,farm_id:c.farm_id,flock_id:c.flock_id,specialty:input.specialty,urgency:input.urgency,requested_by_vet_user_id:input.requested_by_vet_user_id,requested_at:now(),assigned_consultant_user_id:assigned,question:input.question,clinical_summary:input.clinical_summary,status:'requested'};
  let next={...state,consultations:[q,...state.consultations],medical_cases:state.medical_cases.map(x=>x.id===c.id?{...x,consultation_ids:[q.id,...x.consultation_ids],consultant_user_ids:assigned&&!x.consultant_user_ids.includes(assigned)?[assigned,...x.consultant_user_ids]:x.consultant_user_ids}:x)};
  next=appendTimeline(next,{case_id:c.id,occurred_at:q.requested_at,event_type:'consultation',title:`Consultation requested: ${input.specialty}`,summary:input.question,actor_user_id:input.requested_by_vet_user_id,source_type:'consultation',source_id:q.id,evidence_refs:[]});
  return audit(next,input.requested_by_vet_user_id,'consultation_request','consultation',q.id,assigned?'consultation routed':'consultation awaiting manual routing',undefined,q);
}

export function respondToConsultationV2022(state:VeterinaryFieldStateV2022,input:{consultation_id:string;consultant_user_id:string;recommendation:string;close?:boolean}):VeterinaryFieldStateV2022{
  const q=state.consultations.find(x=>x.id===input.consultation_id);if(!q)throw new Error('consultation_not_found');
  if(q.assigned_consultant_user_id&&q.assigned_consultant_user_id!==input.consultant_user_id)throw new Error('consultation_not_assigned_to_actor');
  const updated={...q,assigned_consultant_user_id:q.assigned_consultant_user_id||input.consultant_user_id,recommendation:input.recommendation,response_at:now(),status:(input.close?'closed':'responded') as ConsultationStatusV2022};
  let next={...state,consultations:state.consultations.map(x=>x.id===q.id?updated:x)};
  next=appendTimeline(next,{case_id:q.case_id,occurred_at:updated.response_at!,event_type:'consultation',title:'Consultant recommendation',summary:input.recommendation,actor_user_id:input.consultant_user_id,source_type:'consultation',source_id:q.id,evidence_refs:[]});
  return audit(next,input.consultant_user_id,'consultation_response','consultation',q.id,'consultant response recorded',q,updated);
}

export function requestLabSampleV2022(state:VeterinaryFieldStateV2022,input:{case_id:string;requested_by_vet_user_id:string;sample_type:string;sample_count:number;requested_tests:string[];collection_instructions:string;assigned_collector_user_id?:string;laboratory_id?:string;urgency:ClinicalRiskV2022}):VeterinaryFieldStateV2022{
  const c=state.medical_cases.find(x=>x.id===input.case_id);if(!c)throw new Error('medical_case_not_found');
  if(input.sample_count<=0||!input.requested_tests.length)throw new Error('lab_sample_request_incomplete');
  const order:LabSampleOrderV2022={id:nid('LAB'),lab_order_number:serial('LAB'),case_id:c.id,farm_id:c.farm_id,flock_id:c.flock_id,requested_by_vet_user_id:input.requested_by_vet_user_id,requested_at:now(),sample_type:input.sample_type,sample_count:input.sample_count,requested_tests:input.requested_tests,collection_instructions:input.collection_instructions,assigned_collector_user_id:input.assigned_collector_user_id,laboratory_id:input.laboratory_id,urgency:input.urgency,status:input.assigned_collector_user_id?'collection_scheduled':'requested',chain_of_custody:[{id:nid('COC'),at:now(),action:'requested',actor_user_id:input.requested_by_vet_user_id,note:input.collection_instructions,evidence_refs:[]}],result_document_refs:[]};
  let next={...state,lab_orders:[order,...state.lab_orders],medical_cases:state.medical_cases.map(x=>x.id===c.id?{...x,lab_order_ids:[order.id,...x.lab_order_ids],status:'awaiting_lab' as MedicalCaseStatusV2022}:x)};
  next=appendTimeline(next,{case_id:c.id,occurred_at:order.requested_at,event_type:'lab',title:'Laboratory sample requested',summary:`${order.sample_type} × ${order.sample_count} — ${order.requested_tests.join(', ')}`,actor_user_id:input.requested_by_vet_user_id,source_type:'lab_order',source_id:order.id,evidence_refs:[]});
  return audit(next,input.requested_by_vet_user_id,'lab_request','lab_order',order.id,'laboratory order created',undefined,order);
}

const labTransitions:Record<LabSampleStatusV2022,LabSampleStatusV2022[]>={requested:['collection_scheduled','collected','rejected'],collection_scheduled:['collected','rejected'],collected:['in_transit','received','rejected'],in_transit:['received','rejected'],received:['testing','rejected'],testing:['result_ready','rejected'],result_ready:['vet_reviewed'],vet_reviewed:['closed'],closed:[],rejected:[]};
export function advanceLabSampleV2022(state:VeterinaryFieldStateV2022,input:{lab_order_id:string;to_status:LabSampleStatusV2022;actor_user_id:string;location?:string;note?:string;evidence_refs?:string[];result_summary?:string;result_document_refs?:string[]}):VeterinaryFieldStateV2022{
  const order=state.lab_orders.find(x=>x.id===input.lab_order_id);if(!order)throw new Error('lab_order_not_found');
  if(!labTransitions[order.status].includes(input.to_status))throw new Error('invalid_lab_status_transition');
  if(input.to_status==='result_ready'&&!(input.result_summary||input.result_document_refs?.length))throw new Error('lab_result_required');
  const actionMap:Partial<Record<LabSampleStatusV2022,ChainOfCustodyEventV2022['action']>>={collection_scheduled:'collection_scheduled',collected:'collected',in_transit:'handed_over',received:'received',testing:'testing_started',result_ready:'result_issued',vet_reviewed:'vet_reviewed',rejected:'rejected'};
  const event:ChainOfCustodyEventV2022={id:nid('COC'),at:now(),action:actionMap[input.to_status]||'received',actor_user_id:input.actor_user_id,location:input.location,note:input.note,evidence_refs:input.evidence_refs||[]};
  const updated:LabSampleOrderV2022={...order,status:input.to_status,chain_of_custody:[...order.chain_of_custody,event],result_summary:input.result_summary??order.result_summary,result_document_refs:input.result_document_refs?[...order.result_document_refs,...input.result_document_refs]:order.result_document_refs,reviewed_by_vet_user_id:input.to_status==='vet_reviewed'?input.actor_user_id:order.reviewed_by_vet_user_id,reviewed_at:input.to_status==='vet_reviewed'?now():order.reviewed_at};
  let next={...state,lab_orders:state.lab_orders.map(x=>x.id===order.id?updated:x),medical_cases:state.medical_cases.map(c=>c.id===order.case_id&&input.to_status==='vet_reviewed'?{...c,status:'under_investigation' as MedicalCaseStatusV2022,diagnostic_basis:updated.result_summary?[...c.diagnostic_basis,updated.result_summary]:c.diagnostic_basis}:c)};
  next=appendTimeline(next,{case_id:order.case_id,occurred_at:event.at,event_type:'lab',title:`Laboratory: ${input.to_status}`,summary:input.result_summary||input.note||input.to_status,actor_user_id:input.actor_user_id,source_type:'lab_order',source_id:order.id,evidence_refs:event.evidence_refs});
  return audit(next,input.actor_user_id,'lab_status_transition','lab_order',order.id,`${order.status} -> ${input.to_status}`,order,updated);
}

export function prescribeMedicationV2022(state:VeterinaryFieldStateV2022,input:{case_id?:string;farm_id:string;flock_id:string;order_type:'treatment'|'vaccination';item_name:string;active_ingredient?:string;dose:string;route:string;frequency?:string;duration_days?:number;start_date:string;restricted_antibiotic?:boolean;sensitivity_report_ref?:string;emergency_override_reason?:string;meat_withdrawal_days?:number;egg_withdrawal_days?:number;issued_by_vet_user_id:string;notes?:string}):VeterinaryFieldStateV2022{
  if(!input.item_name||!input.dose||!input.route||!input.issued_by_vet_user_id)throw new Error('medication_order_incomplete');
  const restricted=Boolean(input.restricted_antibiotic);
  if(state.settings.restricted_antibiotic_requires_sensitivity_or_override&&restricted&&!input.sensitivity_report_ref&&!input.emergency_override_reason)throw new Error('restricted_antibiotic_requires_sensitivity_or_emergency_override');
  const duration=Math.max(0,Number(input.duration_days||0));const endDate=duration>0?addDays(input.start_date,Math.max(0,duration-1)):undefined;
  const withdrawal=Math.max(0,Number(input.meat_withdrawal_days||0));const safe=withdrawal>0?addDays(endDate||input.start_date,withdrawal):undefined;
  const row:MedicationOrderV2022={id:nid(input.order_type==='vaccination'?'VAC':'MED'),medication_number:serial(input.order_type==='vaccination'?'VAC':'MED'),case_id:input.case_id,farm_id:input.farm_id,flock_id:input.flock_id,order_type:input.order_type,item_name:input.item_name,active_ingredient:input.active_ingredient,dose:input.dose,route:input.route,frequency:input.frequency,duration_days:duration||undefined,start_date:input.start_date,end_date:endDate,restricted_antibiotic:restricted,sensitivity_report_ref:input.sensitivity_report_ref,emergency_override_reason:input.emergency_override_reason,meat_withdrawal_days:withdrawal,egg_withdrawal_days:input.egg_withdrawal_days,safe_marketing_date:safe,issued_by_vet_user_id:input.issued_by_vet_user_id,approved_at:now(),status:'approved',notes:input.notes};
  let next={...state,medication_orders:[row,...state.medication_orders],medical_cases:state.medical_cases.map(c=>c.id===input.case_id?{...c,status:input.order_type==='treatment'?'treatment':c.status,[input.order_type==='treatment'?'medication_order_ids':'vaccination_order_ids']:[row.id,...(input.order_type==='treatment'?c.medication_order_ids:c.vaccination_order_ids)]}:c)} as VeterinaryFieldStateV2022;
  if(input.case_id&&next.medical_cases.some(c=>c.id===input.case_id))next=appendTimeline(next,{case_id:input.case_id,occurred_at:now(),event_type:input.order_type==='vaccination'?'vaccination':'medication',title:`${input.order_type}: ${input.item_name}`,summary:`${input.dose} · ${input.route}${safe?` · safe marketing ${safe}`:''}`,actor_user_id:input.issued_by_vet_user_id,source_type:'medication_order',source_id:row.id,evidence_refs:input.sensitivity_report_ref?[input.sensitivity_report_ref]:[]});
  return audit(next,input.issued_by_vet_user_id,'medication_order_issue','medication_order',row.id,'veterinary medication/vaccination order issued',undefined,row);
}

export function recordTaskExecutionV2022(field:VeterinaryFieldStateV2022,web:EnterpriseWebStateV202,input:{task_id:string;submitted_by_user_id:string;note:string;measurements?:Record<string,string|number|boolean>;evidence_refs?:string[]}):{field:VeterinaryFieldStateV2022;web:EnterpriseWebStateV202}{
  const task=web.role_tasks.find(t=>t.id===input.task_id);if(!task)throw new Error('task_not_found');
  if(task.assigned_user_id&&task.assigned_user_id!==input.submitted_by_user_id)throw new Error('task_not_assigned_to_actor');
  const evidence=input.evidence_refs||[];
  const needsEvidence=task.evidence_required&&evidence.length===0;
  const execution:FieldTaskExecutionV2022={id:nid('EXEC'),execution_number:serial('EXEC'),task_id:task.id,farm_id:task.farm_id,flock_id:task.flock_id,submitted_by_user_id:input.submitted_by_user_id,submitted_at:now(),note:input.note,measurements:input.measurements||{},evidence_refs:evidence,status:needsEvidence?'needs_evidence':'submitted'};
  let nextField={...field,task_executions:[execution,...field.task_executions]};
  const nextWeb=updateRoleTaskV202(web,task.id,needsEvidence?'evidence_missing':'completed',input.submitted_by_user_id,'worker',input.note,evidence);
  nextField=audit(nextField,input.submitted_by_user_id,'task_execution_submit','field_task_execution',execution.id,needsEvidence?'evidence missing':'task execution submitted',undefined,execution);
  return {field:nextField,web:nextWeb};
}

export function reviewTaskExecutionV2022(field:VeterinaryFieldStateV2022,input:{execution_id:string;reviewer_user_id:string;accepted:boolean;reason?:string}):VeterinaryFieldStateV2022{
  const e=field.task_executions.find(x=>x.id===input.execution_id);if(!e)throw new Error('task_execution_not_found');
  if(e.status==='needs_evidence'&&input.accepted)throw new Error('cannot_accept_execution_without_required_evidence');
  const updated={...e,status:(input.accepted?'accepted':'rejected') as FieldExecutionStatusV2022,reviewed_by_user_id:input.reviewer_user_id,reviewed_at:now(),rejection_reason:input.accepted?undefined:input.reason||'rejected by reviewer'};
  return audit({...field,task_executions:field.task_executions.map(x=>x.id===e.id?updated:x)},input.reviewer_user_id,'task_execution_review','field_task_execution',e.id,input.accepted?'accepted':'rejected',e,updated);
}

export function scheduleVeterinaryFollowUpV2022(state:VeterinaryFieldStateV2022,input:{case_id:string;scheduled_at:string;assigned_vet_user_id:string;actor:string}):VeterinaryFieldStateV2022{
  const c=state.medical_cases.find(x=>x.id===input.case_id);if(!c)throw new Error('medical_case_not_found');
  const row:VeterinaryFollowUpV2022={id:nid('FUP'),followup_number:serial('FUP'),case_id:c.id,farm_id:c.farm_id,flock_id:c.flock_id,scheduled_at:input.scheduled_at,assigned_vet_user_id:input.assigned_vet_user_id,status:'scheduled'};
  return audit({...state,followups:[row,...state.followups],medical_cases:state.medical_cases.map(x=>x.id===c.id?{...x,next_follow_up_at:input.scheduled_at,status:x.status==='open'?'monitoring':x.status}:x)},input.actor,'followup_schedule','veterinary_followup',row.id,'follow-up scheduled',undefined,row);
}

export function completeVeterinaryFollowUpV2022(state:VeterinaryFieldStateV2022,input:{followup_id:string;vet_user_id:string;findings:string;outcome:string;resolve_case?:boolean}):VeterinaryFieldStateV2022{
  const f=state.followups.find(x=>x.id===input.followup_id);if(!f)throw new Error('followup_not_found');
  if(f.assigned_vet_user_id!==input.vet_user_id)throw new Error('followup_not_assigned_to_actor');
  const updated={...f,status:'completed' as const,completed_at:now(),findings:input.findings,outcome:input.outcome};
  let next={...state,followups:state.followups.map(x=>x.id===f.id?updated:x),medical_cases:state.medical_cases.map(c=>c.id===f.case_id?{...c,status:input.resolve_case?'resolved':c.status,resolved_at:input.resolve_case?now():c.resolved_at,next_follow_up_at:undefined}:c)};
  next=appendTimeline(next,{case_id:f.case_id,occurred_at:updated.completed_at!,event_type:'follow_up',title:'Veterinary follow-up',summary:`${input.findings} — ${input.outcome}`,actor_user_id:input.vet_user_id,source_type:'followup',source_id:f.id,evidence_refs:[]});
  return audit(next,input.vet_user_id,'followup_complete','veterinary_followup',f.id,'follow-up completed',f,updated);
}

export function closeMedicalCaseV2022(state:VeterinaryFieldStateV2022,input:{case_id:string;vet_user_id:string;final_diagnosis:string;diagnostic_basis:string[];note:string}):VeterinaryFieldStateV2022{
  const c=state.medical_cases.find(x=>x.id===input.case_id);if(!c)throw new Error('medical_case_not_found');
  if(c.primary_vet_user_id!==input.vet_user_id)throw new Error('only_primary_vet_can_close_case');
  if(c.lab_order_ids.some(id=>{const l=state.lab_orders.find(x=>x.id===id);return l&&!['vet_reviewed','closed','rejected'].includes(l.status)}))throw new Error('case_has_unreviewed_lab_orders');
  const updated={...c,status:'closed' as const,final_diagnosis:input.final_diagnosis,diagnostic_basis:[...c.diagnostic_basis,...input.diagnostic_basis],closed_at:now(),resolved_at:c.resolved_at||now()};
  let next={...state,medical_cases:state.medical_cases.map(x=>x.id===c.id?updated:x)};
  next=appendTimeline(next,{case_id:c.id,occurred_at:updated.closed_at!,event_type:'case_closed',title:'Medical case closed',summary:`${input.final_diagnosis}: ${input.note}`,actor_user_id:input.vet_user_id,source_type:'medical_case',source_id:c.id,evidence_refs:[]});
  return audit(next,input.vet_user_id,'medical_case_close','medical_case',c.id,'medical case closed',c,updated);
}

export function issueTomorrowPlanFromVeterinaryReviewV2022(field:VeterinaryFieldStateV2022,web:EnterpriseWebStateV202,input:{review_id:string;plan_date:string;issued_by_vet:string;worker_user_id?:string;feed_kg:number;feeding_times:string[];target_temperature_min_c:number;target_temperature_max_c:number;humidity_min_pct:number;humidity_max_pct:number;weight_sample_time?:string;weight_sample_count?:number;weight_sample_condition?:'fasted'|'fed';ventilation_instruction?:string;treatment_instruction?:string;vaccination_instruction?:string;litter_instruction?:string;maintenance_instruction?:string;required_items:string[];vet_note?:string}):{field:VeterinaryFieldStateV2022;web:EnterpriseWebStateV202;plan:TomorrowPlanV202}{
  const review=field.veterinary_reviews.find(x=>x.id===input.review_id);if(!review)throw new Error('veterinary_review_not_found');
  const nextWeb=createTomorrowPlanV202(web,{farm_id:review.farm_id,flock_id:review.flock_id,plan_date:input.plan_date,source_report_id:review.closing_id,issued_by_vet:input.issued_by_vet,feed_kg:input.feed_kg,feeding_times:input.feeding_times,target_temperature_min_c:input.target_temperature_min_c,target_temperature_max_c:input.target_temperature_max_c,humidity_min_pct:input.humidity_min_pct,humidity_max_pct:input.humidity_max_pct,weight_sample_time:input.weight_sample_time,weight_sample_count:input.weight_sample_count,weight_sample_condition:input.weight_sample_condition,ventilation_instruction:input.ventilation_instruction,treatment_instruction:input.treatment_instruction,vaccination_instruction:input.vaccination_instruction,litter_instruction:input.litter_instruction,maintenance_instruction:input.maintenance_instruction,required_items:input.required_items,vet_note:input.vet_note,worker_user_id:input.worker_user_id},'field_vet');
  const plan=nextWeb.tomorrow_plans[0];
  const nextField=audit(field,input.issued_by_vet,'tomorrow_plan_issue','tomorrow_plan',plan.id,'plan issued from veterinary review',undefined,{review_id:review.id,plan_id:plan.id,task_ids:plan.task_ids});
  return {field:nextField,web:nextWeb,plan};
}

export function openClinicalEscalationV2022(state:VeterinaryFieldStateV2022,input:{source_type:ClinicalEscalationV2022['source_type'];source_id:string;farm_id?:string;flock_id?:string;severity:ClinicalRiskV2022;reason:string;target_user_ids?:string[];target_role_codes?:string[]}):VeterinaryFieldStateV2022{
  if(state.escalations.some(x=>x.source_type===input.source_type&&x.source_id===input.source_id&&['open','acknowledged'].includes(x.status)))return state;
  const minutes=input.severity==='critical'?state.settings.critical_escalation_minutes:input.severity==='high'?state.settings.high_escalation_minutes:0;
  const e:ClinicalEscalationV2022={id:nid('ESC'),escalation_number:serial('ESC'),source_type:input.source_type,source_id:input.source_id,farm_id:input.farm_id,flock_id:input.flock_id,severity:input.severity,reason:input.reason,stage:1,target_user_ids:input.target_user_ids||[],target_role_codes:input.target_role_codes||['FIELD_VET'],opened_at:now(),next_escalation_at:minutes?new Date(Date.now()+minutes*60000).toISOString():undefined,status:'open'};
  return audit({...state,escalations:[e,...state.escalations]},'system','clinical_escalation_open','clinical_escalation',e.id,input.reason,undefined,e);
}

export function runAutomaticClinicalEscalationsV2022(state:VeterinaryFieldStateV2022,web?:EnterpriseWebStateV202):VeterinaryFieldStateV2022{
  let next=state;
  const latestByClosing=new Map(state.ai_clinical_analyses.map(a=>[a.closing_id,a]));
  for(const closing of state.worker_daily_closings){const a=latestByClosing.get(closing.id);if(a&&['high','critical'].includes(a.risk_level)&&!state.veterinary_reviews.some(r=>r.closing_id===closing.id))next=openClinicalEscalationV2022(next,{source_type:'analysis',source_id:a.id,farm_id:a.farm_id,flock_id:a.flock_id,severity:a.risk_level,reason:'high/critical analysis awaiting veterinary review',target_role_codes:['FIELD_VET','SPECIALIST_CONSULTANT']});}
  if(web){for(const t of web.role_tasks){if((t.status==='pending'||t.status==='in_progress'||t.status==='evidence_missing')&&new Date(t.due_at)<new Date()&&(t.priority==='high'||t.priority==='critical'))next=openClinicalEscalationV2022(next,{source_type:'task',source_id:t.id,farm_id:t.farm_id,flock_id:t.flock_id,severity:t.priority==='critical'?'critical':'high',reason:'high-priority field task overdue',target_role_codes:['FIELD_VET','FIELD_OPERATIONS']});}}
  return next;
}

export function acknowledgeClinicalEscalationV2022(state:VeterinaryFieldStateV2022,input:{escalation_id:string;actor_user_id:string;resolve?:boolean}):VeterinaryFieldStateV2022{
  const e=state.escalations.find(x=>x.id===input.escalation_id);if(!e)throw new Error('escalation_not_found');
  const updated={...e,status:(input.resolve?'resolved':'acknowledged') as EscalationStatusV2022,acknowledged_by:input.actor_user_id,acknowledged_at:now(),resolved_by:input.resolve?input.actor_user_id:e.resolved_by,resolved_at:input.resolve?now():e.resolved_at};
  return audit({...state,escalations:state.escalations.map(x=>x.id===e.id?updated:x)},input.actor_user_id,'clinical_escalation_action','clinical_escalation',e.id,input.resolve?'resolved':'acknowledged',e,updated);
}

function coverageContextMatches(context:EnterpriseResourceContextV2021,farmId:string,flockId:string){return (!context.farm_id||context.farm_id===farmId)&&(!context.flock_id||context.flock_id===flockId)};

export function veterinaryDailyQueueV2022(state:VeterinaryFieldStateV2022,foundation:EnterpriseFoundationStateV2021,userId:string){
  const assigned=foundation.veterinary_coverage.filter(x=>x.vet_user_id===userId&&x.status==='active');
  const territoryById=new Map(foundation.veterinary_territories.map(t=>[t.id,t]));
  const allowed=(farmId:string,flockId:string)=>assigned.some(a=>{const t=a.territory_id?territoryById.get(a.territory_id):undefined;const farms=new Set([...(a.farm_ids||[]),...(t?.farm_ids||[])]),flocks=new Set([...(a.flock_ids||[]),...(t?.flock_ids||[])]);return (!farms.size||farms.has(farmId))&&(!flocks.size||flocks.has(flockId));});
  const closings=state.worker_daily_closings.filter(c=>allowed(c.farm_id,c.flock_id));
  const waitingReview=closings.filter(c=>['validated','analysis_ready'].includes(c.status)&&!state.veterinary_reviews.some(r=>r.closing_id===c.id));
  const cases=state.medical_cases.filter(c=>allowed(c.farm_id,c.flock_id)&&(c.primary_vet_user_id===userId||c.consultant_user_ids.includes(userId))&&!['closed'].includes(c.status));
  const labs=state.lab_orders.filter(l=>allowed(l.farm_id,l.flock_id)&&['result_ready'].includes(l.status));
  const consultations=state.consultations.filter(c=>c.assigned_consultant_user_id===userId&&['requested','accepted','in_review'].includes(c.status));
  const followups=state.followups.filter(f=>f.assigned_vet_user_id===userId&&f.status==='scheduled');
  const escalations=state.escalations.filter(e=>['open','acknowledged'].includes(e.status)&&(e.target_user_ids.includes(userId)||Boolean(e.farm_id&&e.flock_id&&allowed(e.farm_id,e.flock_id))));
  return {farm_ids:[...new Set(assigned.flatMap(a=>[...a.farm_ids,...(a.territory_id?territoryById.get(a.territory_id)?.farm_ids||[]:[])]))],flock_ids:[...new Set(assigned.flatMap(a=>[...a.flock_ids,...(a.territory_id?territoryById.get(a.territory_id)?.flock_ids||[]:[])]))],waiting_review:waitingReview,critical_closings:waitingReview.filter(c=>state.ai_clinical_analyses.find(a=>a.closing_id===c.id)?.risk_level==='critical'),open_cases:cases,lab_results_waiting_review:labs,consultations_waiting:consultations,followups_due:followups,open_escalations:escalations};
}

export function caseTimelineV2022(state:VeterinaryFieldStateV2022,caseId:string){return state.timeline_events.filter(x=>x.case_id===caseId).sort((a,b)=>a.occurred_at.localeCompare(b.occurred_at));}

export function withdrawalLocksV2022(state:VeterinaryFieldStateV2022,atDate=new Date().toISOString().slice(0,10)){
  return state.medication_orders.filter(m=>m.safe_marketing_date&&m.safe_marketing_date>atDate&&['approved','active','completed'].includes(m.status)).map(m=>({medication_order_id:m.id,farm_id:m.farm_id,flock_id:m.flock_id,item_name:m.item_name,safe_marketing_date:m.safe_marketing_date!,reason:'meat withdrawal period active'}));
}

export function validateVeterinaryFieldStateV2022(state:VeterinaryFieldStateV2022,web?:EnterpriseWebStateV202,foundation?:EnterpriseFoundationStateV2021):string[]{
  const issues:string[]=[];
  const closingIds=new Set(state.worker_daily_closings.map(x=>x.id));const caseIds=new Set(state.medical_cases.map(x=>x.id));const labIds=new Set(state.lab_orders.map(x=>x.id));
  for(const a of state.ai_clinical_analyses)if(!closingIds.has(a.closing_id))issues.push(`analysis_orphan:${a.id}`);
  for(const r of state.veterinary_reviews)if(!closingIds.has(r.closing_id))issues.push(`review_orphan_closing:${r.id}`);
  for(const r of state.veterinary_reviews)if(r.case_id&&!caseIds.has(r.case_id))issues.push(`review_orphan_case:${r.id}`);
  for(const c of state.consultations)if(!caseIds.has(c.case_id))issues.push(`consultation_orphan_case:${c.id}`);
  for(const l of state.lab_orders)if(!caseIds.has(l.case_id))issues.push(`lab_orphan_case:${l.id}`);
  for(const c of state.medical_cases)for(const id of c.lab_order_ids)if(!labIds.has(id))issues.push(`case_lab_reference_missing:${c.id}:${id}`);
  for(const e of state.task_executions)if(web&&!web.role_tasks.some(t=>t.id===e.task_id))issues.push(`task_execution_orphan:${e.id}`);
  if(state.settings.human_in_the_loop_required!==true)issues.push('human_in_the_loop_must_remain_enabled');
  if(foundation){for(const c of state.medical_cases){const coverage=resolveVeterinaryCoverageV2021(foundation,{farm_id:c.farm_id,flock_id:c.flock_id},'general_veterinary');if(coverage.length&& !coverage.some(x=>x.vet_user_id===c.primary_vet_user_id))issues.push(`case_primary_vet_outside_current_coverage:${c.id}`)}}
  return issues;
}
