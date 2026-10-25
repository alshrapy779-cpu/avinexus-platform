import React, { useMemo, useState } from 'react';
import { AlertTriangle, Beaker, CheckCircle2, ClipboardList, FlaskConical, HeartPulse, ListChecks, Pill, ShieldAlert, Stethoscope, Syringe } from 'lucide-react';
import type { PlatformRoleV195 } from '../../modules/platform/PlatformCoreV19_5';
import type { ManagedOperationsStateV197 } from '../../modules/managed/ManagedPoultryOperationsV19_7';
import type { EnterpriseWebStateV202 } from '../../modules/v20/EnterpriseWebPlatformV20_2';
import type { EnterpriseFoundationStateV2021 } from '../../modules/v20/EnterpriseFoundationV20_2_1';
import {
  analyzeWorkerClosingV2022,
  advanceLabSampleV2022,
  buildVeterinaryFieldStateV2022,
  createWorkerDailyClosingV2022,
  issueTomorrowPlanFromVeterinaryReviewV2022,
  prescribeMedicationV2022,
  recordTaskExecutionV2022,
  requestLabSampleV2022,
  requestSpecialistConsultationV2022,
  submitVeterinaryReviewV2022,
  validateVeterinaryFieldStateV2022,
  validateWorkerDailyClosingV2022,
  veterinaryDailyQueueV2022,
  withdrawalLocksV2022,
  type ClinicalRiskV2022,
  type VeterinaryFieldStateV2022,
} from '../../modules/v20/VeterinaryFieldOperationsV20_2_2';

interface Props{
  state:VeterinaryFieldStateV2022;
  foundation:EnterpriseFoundationStateV2021;
  web:EnterpriseWebStateV202;
  managed:ManagedOperationsStateV197;
  currentUser:{id:string;name:string;role:PlatformRoleV195};
  onFieldChange:(next:VeterinaryFieldStateV2022)=>void;
  onWebChange:(next:EnterpriseWebStateV202)=>void;
}

const today=()=>new Date().toISOString().slice(0,10);
const tomorrow=()=>{const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().slice(0,10)};
const num=(v:string)=>Number(v||0);

export const VeterinaryFieldOperationsV2022:React.FC<Props>=({state:rawState,foundation,web,managed,currentUser,onFieldChange,onWebChange})=>{
  const state=buildVeterinaryFieldStateV2022(rawState);
  const queue=useMemo(()=>veterinaryDailyQueueV2022(state,foundation,currentUser.id),[state,foundation,currentUser.id]);
  const validation=useMemo(()=>validateVeterinaryFieldStateV2022(state,web,foundation),[state,web,foundation]);
  const locks=useMemo(()=>withdrawalLocksV2022(state),[state]);
  const isWorker=currentUser.role==='worker';
  const canVet=['system_owner','ceo','field_vet','vet_consultant'].includes(currentUser.role);
  const canLab=['system_owner','ceo','laboratory','field_vet','vet_consultant'].includes(currentUser.role);
  const [selectedFlock,setSelectedFlock]=useState(managed.flock_cycles.find(x=>x.status==='active')?.id||managed.flock_cycles[0]?.id||'');
  const flock=managed.flock_cycles.find(x=>x.id===selectedFlock);
  const [mortality,setMortality]=useState('0');const[feed,setFeed]=useState('0');const[obs,setObs]=useState('');const[symptoms,setSymptoms]=useState('');
  const [message,setMessage]=useState('');

  const submitClosing=()=>{
    if(!flock){setMessage('لا يوجد قطيع محدد.');return;}
    try{
      let next=createWorkerDailyClosingV2022(state,{farm_id:flock.farm_id,flock_id:flock.id,report_date:today(),shift:'full_day',worker_user_id:currentUser.id,mortality_count:num(mortality),cull_count:0,feed_used_kg:num(feed),observations:obs,symptom_tags:symptoms.split(',').map(x=>x.trim()).filter(Boolean),evidence_refs:[]});
      const id=next.worker_daily_closings[0].id;
      next=validateWorkerDailyClosingV2022(next,id,currentUser.id);
      if(next.worker_daily_closings[0].status==='validated')next=analyzeWorkerClosingV2022(next,id);
      onFieldChange(next);setMessage(next.worker_daily_closings[0].status==='needs_correction'?'تم الحفظ ويحتاج تصحيح البيانات.':'تم إغلاق اليوم والتحليل الأولي، وبانتظار الطبيب.');
    }catch(e){setMessage(e instanceof Error?e.message:'تعذر إغلاق اليوم');}
  };

  const reviewFirst=()=>{
    const closing=queue.waiting_review[0];if(!closing){setMessage('لا يوجد تقرير ينتظر المراجعة.');return;}
    const analysis=state.ai_clinical_analyses.find(a=>a.closing_id===closing.id);const risk=analysis?.risk_level||'medium';
    try{const next=submitVeterinaryReviewV2022(state,{closing_id:closing.id,vet_user_id:currentUser.id,disposition:risk==='critical'?'critical':risk==='high'?'action_required':'monitor',findings:closing.observations||'مراجعة التقرير اليومي',decision_note:'تمت المراجعة البشرية بواسطة الطبيب المسؤول.',requires_lab:risk==='critical',requires_consultation:risk==='critical',open_case:['high','critical'].includes(risk)});onFieldChange(next);setMessage('تم اعتماد المراجعة البيطرية.');}catch(e){setMessage(e instanceof Error?e.message:'تعذر اعتماد المراجعة');}
  };

  const createPlan=()=>{
    const review=state.veterinary_reviews.find(r=>r.vet_user_id===currentUser.id)||state.veterinary_reviews[0];if(!review){setMessage('يجب وجود مراجعة بيطرية أولاً.');return;}
    const cycle=managed.flock_cycles.find(f=>f.id===review.flock_id);const worker=managed.managed_contracts.find(c=>c.farm_id===review.farm_id)?.assigned_worker_ids?.[0];
    try{const result=issueTomorrowPlanFromVeterinaryReviewV2022(state,web,{review_id:review.id,plan_date:tomorrow(),issued_by_vet:currentUser.id,worker_user_id:worker,feed_kg:Math.max(1,Math.round((cycle?.current_count||1000)*0.12)),feeding_times:['06:00','12:00','18:00'],target_temperature_min_c:25,target_temperature_max_c:26,humidity_min_pct:55,humidity_max_pct:65,weight_sample_time:'07:00',weight_sample_count:60,weight_sample_condition:'fasted',ventilation_instruction:'مراجعة الحد الأدنى للتهوية حسب حالة القطيع.',litter_instruction:'معالجة أي مناطق رطبة في الفرشة.',maintenance_instruction:'فحص المراوح وخطوط المياه.',required_items:[],vet_note:'خطة الغد صادرة بعد المراجعة البيطرية.'});onFieldChange(result.field);onWebChange(result.web);setMessage(`صدرت خطة ${result.plan.plan_number} وتحولت إلى مهام.`);}catch(e){setMessage(e instanceof Error?e.message:'تعذر إصدار خطة الغد');}
  };

  const requestLab=()=>{const c=state.medical_cases.find(x=>x.primary_vet_user_id===currentUser.id)||state.medical_cases[0];if(!c){setMessage('لا توجد حالة طبية مفتوحة.');return;}try{onFieldChange(requestLabSampleV2022(state,{case_id:c.id,requested_by_vet_user_id:currentUser.id,sample_type:'عينات تشخيصية',sample_count:4,requested_tests:['PCR / Culture as indicated'],collection_instructions:'جمع العينات وتوثيق وقت السحب وإغلاق العبوة وإرفاق الدليل.',urgency:c.severity}));setMessage('تم إنشاء طلب المختبر مع Chain of Custody.');}catch(e){setMessage(e instanceof Error?e.message:'تعذر إنشاء طلب المختبر');}};
  const requestConsult=()=>{const c=state.medical_cases.find(x=>x.primary_vet_user_id===currentUser.id)||state.medical_cases[0];if(!c){setMessage('لا توجد حالة طبية مفتوحة.');return;}try{onFieldChange(requestSpecialistConsultationV2022(state,foundation,{case_id:c.id,specialty:'poultry_disease',urgency:c.severity,requested_by_vet_user_id:currentUser.id,question:'مراجعة التشخيص التفريقي وخطة المتابعة.',clinical_summary:c.presenting_problem}));setMessage('تم رفع الاستشارة وتوجيهها حسب التغطية المتاحة.');}catch(e){setMessage(e instanceof Error?e.message:'تعذر إنشاء الاستشارة');}};
  const prescribe=()=>{const c=state.medical_cases.find(x=>x.primary_vet_user_id===currentUser.id)||state.medical_cases[0];if(!c){setMessage('لا توجد حالة طبية مفتوحة.');return;}try{onFieldChange(prescribeMedicationV2022(state,{case_id:c.id,farm_id:c.farm_id,flock_id:c.flock_id,order_type:'treatment',item_name:'Vet-approved treatment',dose:'حسب اعتماد الطبيب',route:'مياه الشرب',frequency:'حسب البروتوكول',duration_days:3,start_date:today(),meat_withdrawal_days:5,issued_by_vet_user_id:currentUser.id,notes:'مثال تشغيلي؛ يجب إدخال المنتج والجرعة الفعلية قبل الاستخدام الحقيقي.'}));setMessage('تم إنشاء أمر علاج وربط فترة السحب بالحالة.');}catch(e){setMessage(e instanceof Error?e.message:'تعذر إنشاء أمر العلاج');}};

  const nextLab=(id:string)=>{const l=state.lab_orders.find(x=>x.id===id);if(!l)return;const transitions:any={requested:'collection_scheduled',collection_scheduled:'collected',collected:'in_transit',in_transit:'received',received:'testing',testing:'result_ready',result_ready:'vet_reviewed',vet_reviewed:'closed'};const to=transitions[l.status];if(!to)return;try{onFieldChange(advanceLabSampleV2022(state,{lab_order_id:id,to_status:to,actor_user_id:currentUser.id,note:`Advance to ${to}`,result_summary:to==='result_ready'?'Laboratory result recorded; veterinary interpretation required.':undefined,result_document_refs:to==='result_ready'?['lab-result-reference']:undefined,evidence_refs:to==='collected'?['sample-collection-evidence']:[]}));}catch(e){setMessage(e instanceof Error?e.message:'تعذر تحديث المختبر');}};

  const executeTask=(taskId:string)=>{try{const result=recordTaskExecutionV2022(state,web,{task_id:taskId,submitted_by_user_id:currentUser.id,note:'تم التنفيذ ميدانيًا.',evidence_refs:['field-evidence-reference']});onFieldChange(result.field);onWebChange(result.web);setMessage('تم تسجيل التنفيذ والدليل.');}catch(e){setMessage(e instanceof Error?e.message:'تعذر تسجيل التنفيذ');}};

  const assignedTasks=web.role_tasks.filter(t=>t.assigned_user_id===currentUser.id||(!t.assigned_user_id&&t.assigned_role===currentUser.role)).filter(t=>!['completed','rejected'].includes(t.status));

  return <section className="rounded-3xl border border-slate-800 bg-[#07171b]/80 p-4 sm:p-5 shadow-xl">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4"><div><div className="text-[10px] text-emerald-300 font-black">V20.2.2 · VETERINARY & FIELD OPERATIONS</div><h2 className="text-xl font-black text-white mt-1">التشغيل البيطري والميداني</h2><p className="text-xs text-slate-400 mt-1 leading-6">Worker Closing → Validation → Analysis → Vet Review → Case/Lab/Consultation → Tomorrow Plan → Task Evidence → Follow-up</p></div><div className="text-[10px] text-slate-500">Human-in-the-Loop: <b className="text-emerald-300">ENFORCED</b></div></div>
    {message&&<div className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-100">{message}</div>}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Metric icon={<Stethoscope className="w-4 h-4"/>} label="تنتظر مراجعة الطبيب" value={queue.waiting_review.length} warn={queue.waiting_review.length>0}/><Metric icon={<ShieldAlert className="w-4 h-4"/>} label="حرجة" value={queue.critical_closings.length} warn={queue.critical_closings.length>0}/><Metric icon={<HeartPulse className="w-4 h-4"/>} label="حالات مفتوحة" value={queue.open_cases.length}/><Metric icon={<FlaskConical className="w-4 h-4"/>} label="نتائج مختبر تنتظر الطبيب" value={queue.lab_results_waiting_review.length}/>
      <Metric icon={<ClipboardList className="w-4 h-4"/>} label="استشارات" value={queue.consultations_waiting.length}/><Metric icon={<ListChecks className="w-4 h-4"/>} label="مهامي المفتوحة" value={assignedTasks.length}/><Metric icon={<AlertTriangle className="w-4 h-4"/>} label="تصعيدات مفتوحة" value={queue.open_escalations.length} warn={queue.open_escalations.length>0}/><Metric icon={<Pill className="w-4 h-4"/>} label="Withdrawal Locks" value={locks.length} warn={locks.length>0}/>
    </div>

    <div className="grid xl:grid-cols-2 gap-4 mt-4">
      <Panel title="Worker Daily Closing">
        <div className="grid sm:grid-cols-2 gap-2">
          <select className="input" value={selectedFlock} onChange={e=>setSelectedFlock(e.target.value)}>{managed.flock_cycles.map(f=><option key={f.id} value={f.id}>{f.flock_code} · {managed.farms.find(x=>x.id===f.farm_id)?.name||f.farm_id}</option>)}</select>
          <input className="input" value={mortality} onChange={e=>setMortality(e.target.value)} placeholder="Mortality" type="number"/>
          <input className="input" value={feed} onChange={e=>setFeed(e.target.value)} placeholder="Feed kg" type="number"/>
          <input className="input" value={symptoms} onChange={e=>setSymptoms(e.target.value)} placeholder="Symptoms comma-separated"/>
          <textarea className="input sm:col-span-2 min-h-20" value={obs} onChange={e=>setObs(e.target.value)} placeholder="الملاحظات الميدانية"/>
        </div><button className="btn-primary mt-3" onClick={submitClosing}>{isWorker?'إغلاق اليوم وإرساله للطبيب':'تسجيل إغلاق يوم اختباري'}</button>
      </Panel>
      <Panel title="Veterinary Decision Queue">
        <div className="flex flex-wrap gap-2 mb-3"><button className="btn-primary" disabled={!canVet} onClick={reviewFirst}>مراجعة أول تقرير</button><button className="action-btn" disabled={!canVet} onClick={createPlan}>إصدار خطة الغد</button><button className="action-btn" disabled={!canVet} onClick={requestLab}><Beaker className="w-3.5 h-3.5"/> طلب مختبر</button><button className="action-btn" disabled={!canVet} onClick={requestConsult}>استشارة</button><button className="action-btn" disabled={!canVet} onClick={prescribe}><Syringe className="w-3.5 h-3.5"/> علاج</button></div>
        <SimpleTable headers={['Closing','Flock','Status','Risk']} rows={queue.waiting_review.slice(0,8).map(c=>[c.closing_number,c.flock_id,c.status,state.ai_clinical_analyses.find(a=>a.closing_id===c.id)?.risk_level||'—'])}/>
      </Panel>
    </div>

    <div className="grid xl:grid-cols-2 gap-4 mt-4">
      <Panel title="Medical Cases"><SimpleTable headers={['Case','Flock','Severity','Status','Primary Vet']} rows={state.medical_cases.slice(0,12).map(c=>[c.case_number,c.flock_id,c.severity,c.status,c.primary_vet_user_id])}/></Panel>
      <Panel title="Laboratory & Chain of Custody"><div className="space-y-2">{state.lab_orders.slice(0,10).map(l=><div key={l.id} className="rounded-xl border border-slate-800 p-3"><div className="flex justify-between gap-2"><div><div className="text-xs font-black text-white">{l.lab_order_number} · {l.sample_type}</div><div className="text-[10px] text-slate-500 mt-1">{l.status} · COC {l.chain_of_custody.length} events</div></div>{canLab&&<button className="action-btn" onClick={()=>nextLab(l.id)}>المرحلة التالية</button>}</div></div>)}{!state.lab_orders.length&&<Empty/>}</div></Panel>
    </div>

    <div className="grid xl:grid-cols-2 gap-4 mt-4">
      <Panel title="Worker Tasks & Evidence"><div className="space-y-2">{assignedTasks.slice(0,12).map(t=><div key={t.id} className="rounded-xl border border-slate-800 p-3 flex items-start justify-between gap-3"><div><div className="text-xs font-black text-white">{t.title}</div><div className="text-[10px] text-slate-500 mt-1">{t.status} · {t.due_at} · Evidence {t.evidence_required?'Required':'Optional'}</div></div><button className="action-btn" onClick={()=>executeTask(t.id)}>تنفيذ + دليل</button></div>)}{!assignedTasks.length&&<Empty/>}</div></Panel>
      <Panel title="Safety & Validation"><div className="space-y-2 text-xs"><Row label="Clinical state validation" value={validation.length?`${validation.length} issue(s)`:'PASS'} warn={validation.length>0}/><Row label="Withdrawal active" value={String(locks.length)} warn={locks.length>0}/><Row label="Restricted antibiotic gate" value={state.settings.restricted_antibiotic_requires_sensitivity_or_override?'ENFORCED':'OFF'} warn={!state.settings.restricted_antibiotic_requires_sensitivity_or_override}/><Row label="Human decision required" value={state.settings.human_in_the_loop_required?'YES':'NO'} warn={!state.settings.human_in_the_loop_required}/></div></Panel>
    </div>
  </section>;
};

const Panel:React.FC<{title:string;children:React.ReactNode}>=({title,children})=><div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3"><div className="text-xs font-black text-slate-200 mb-3">{title}</div>{children}</div>;
const Metric:React.FC<{icon:React.ReactNode;label:string;value:React.ReactNode;warn?:boolean}>=({icon,label,value,warn})=><div className={`rounded-2xl border p-3 ${warn?'border-amber-500/30 bg-amber-500/5':'border-slate-800 bg-slate-950/50'}`}><div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">{icon}{label}</div><div className={`text-lg font-black mt-1 ${warn?'text-amber-300':'text-white'}`}>{value}</div></div>;
const SimpleTable:React.FC<{headers:string[];rows:Array<Array<React.ReactNode>>}>=({headers,rows})=><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-slate-800">{headers.map(h=><th key={h} className="text-right py-2 px-2 text-slate-500 font-black whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i} className="border-b border-slate-900">{r.map((c,j)=><td key={j} className="py-2 px-2 text-slate-300 whitespace-nowrap">{c}</td>)}</tr>):<tr><td colSpan={headers.length} className="py-6 text-center text-slate-600">لا توجد بيانات بعد.</td></tr>}</tbody></table></div>;
const Row:React.FC<{label:string;value:string;warn?:boolean}>=({label,value,warn})=><div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 p-2"><span className="text-slate-500">{label}</span><span className={warn?'text-amber-300 font-black':'text-emerald-300 font-black'}>{value}</span></div>;
const Empty=()=> <div className="py-6 text-center text-xs text-slate-600"><CheckCircle2 className="w-4 h-4 mx-auto mb-2"/>لا توجد عناصر.</div>;
