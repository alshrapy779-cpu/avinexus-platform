import React, { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, BrainCircuit, Camera, CloudOff, FileUp, FlaskConical,
  Gauge, MapPin, Mic, Save, Send, ShieldCheck, Stethoscope, Thermometer, Wind
} from 'lucide-react';
import {
  AIDiagnosticAssessmentV14,
  FieldDoctorVisitV14,
  FieldMediaQueueItemV14,
  FieldNecropsyObservationV14,
  SmartOperationsState
} from '../../types';
import { offlineDatabaseV15 } from '../../services/offlineDatabaseV15';

interface Props {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

const now = () => new Date().toISOString();
const todayCode = () => new Date().toISOString().slice(0, 10).replaceAll('-', '');

export const FieldDoctorWorkspaceV14: React.FC<Props> = ({ operations, onUpdateOperations }) => {
  const enterprise = operations.enterprise;
  const [selectedId, setSelectedId] = useState(enterprise.field_doctor_visits_v14[0]?.id || '');
  const selected = enterprise.field_doctor_visits_v14.find(v => v.id === selectedId) || enterprise.field_doctor_visits_v14[0];

  const patchEnterprise = (patch: Partial<typeof enterprise>) => {
    onUpdateOperations({ ...operations, enterprise: { ...enterprise, ...patch } });
  };

  const stats = useMemo(() => ({
    pendingSync: enterprise.field_doctor_visits_v14.filter(v => v.sync_status !== 'synced').length,
    escalated: enterprise.case_escalations_v14.filter(e => !['closed', 'decision_sent'].includes(e.status)).length,
    aiWaiting: enterprise.ai_diagnostic_assessments_v14.filter(a => a.status === 'ready_for_vet').length,
  }), [enterprise]);

  const createVisit = () => {
    const contract = enterprise.farm_management_contracts_v13.find(c => c.status === 'active');
    const id = `fdv-${Date.now()}`;
    const visit: FieldDoctorVisitV14 = {
      id,
      visit_number: `VIS-${todayCode()}-${String(Date.now()).slice(-4)}`,
      contract_id: contract?.id,
      farm_name: contract?.farm_name || 'مزرعة جديدة',
      customer_name: contract?.customer_name || 'عميل جديد',
      phone: contract?.phone || '',
      governorate: contract?.governorate || 'صنعاء',
      district: contract?.district || '',
      detailed_address: '',
      doctor_name: contract?.responsible_vet_name || 'الطبيب الميداني',
      supervisor_name: contract?.responsible_supervisor_name,
      visit_reason: 'routine',
      started_at: now(),
      offline_created: !navigator.onLine,
      sync_status: navigator.onLine ? 'queued' : 'local_pending',
      flock_size: contract?.flock_size || 10000,
      age_days: 1,
      mortality_today: 0,
      feed_kg: 0,
      water_liters: 0,
      temperature_celsius: 28,
      humidity_percent: 60,
      symptoms_description: '',
      barn_photos: [],
      droppings_photos: [],
      litter_photos: [],
      necropsy_observations: [],
      voice_notes: [],
      status: navigator.onLine ? 'draft' : 'offline_saved',
    };
    patchEnterprise({ field_doctor_visits_v14: [visit, ...enterprise.field_doctor_visits_v14] });
    setSelectedId(id);
  };

  const updateVisit = (patch: Partial<FieldDoctorVisitV14>) => {
    if (!selected) return;
    patchEnterprise({ field_doctor_visits_v14: enterprise.field_doctor_visits_v14.map(v => v.id === selected.id ? { ...v, ...patch } : v) });
  };

  const captureGps = () => {
    if (!selected || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => updateVisit({ gps_lat: pos.coords.latitude, gps_lng: pos.coords.longitude }),
      () => updateVisit({ sync_status: selected.sync_status }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const queueMedia = (file: File, mediaType: FieldMediaQueueItemV14['media_type']) => {
    if (!selected) return '';
    const preview = URL.createObjectURL(file);
    const item: FieldMediaQueueItemV14 = {
      id: `mq-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      visit_id: selected.id,
      media_type: mediaType,
      file_name: file.name,
      local_preview_url: preview,
      created_at: now(),
      status: enterprise.cloud_production_v14.media_storage_status === 'connected' ? 'queued' : 'local_only'
    };
    patchEnterprise({ field_media_queue_v14: [item, ...enterprise.field_media_queue_v14] });
    offlineDatabaseV15.cacheMedia(item.id, file, { visit_id: selected.id, media_type: mediaType, file_name: file.name }).catch(() => {});
    return preview;
  };

  const addPhoto = (file: File | undefined, kind: 'barn' | 'droppings' | 'litter') => {
    if (!file || !selected) return;
    const preview = queueMedia(file, kind);
    const key = kind === 'barn' ? 'barn_photos' : kind === 'droppings' ? 'droppings_photos' : 'litter_photos';
    updateVisit({ [key]: [...selected[key], preview] } as Partial<FieldDoctorVisitV14>);
  };

  const addNecropsyPhoto = (file: File | undefined, organName: string) => {
    if (!file || !selected) return;
    const preview = queueMedia(file, 'necropsy');
    const lower = organName.toLowerCase();
    const system: FieldNecropsyObservationV14['system'] = lower.includes('قصبة') || lower.includes('رئة') || lower.includes('هوائي') ? 'تنفسي' : lower.includes('أمعاء') || lower.includes('أعور') || lower.includes('كبد') ? 'هضمي' : 'عام';
    const obs: FieldNecropsyObservationV14 = {
      id: `obs-${Date.now()}`,
      organ_name: organName || 'عضو تشريحي',
      system,
      image_url: preview,
      image_name: file.name,
      image_quality: file.size > 120_000 ? 'clear' : 'needs_retake',
      lesion_tags: [],
      description: file.size > 120_000 ? 'الصورة مرفوعة للمراجعة البيطرية.' : 'جودة الملف منخفضة؛ يفضّل إعادة التصوير بإضاءة أفضل.'
    };
    updateVisit({ necropsy_observations: [...selected.necropsy_observations, obs] });
  };

  const addVoice = (file: File | undefined) => {
    if (!file || !selected) return;
    const preview = queueMedia(file, 'voice');
    updateVisit({ voice_notes: [...selected.voice_notes, {
      id: `voice-${Date.now()}`, recorded_at: now(), audio_url: preview, file_name: file.name,
      transcript_status: 'queued', note: 'محفوظ محلياً؛ التحويل الآلي إلى نص يحتاج خدمة STT خادمية.'
    }] });
  };

  const runDecisionSupport = () => {
    if (!selected) return;
    const t = selected.symptoms_description.toLowerCase();
    const conditions: AIDiagnosticAssessmentV14['suspected_conditions'] = [];
    const findings: string[] = [];
    const tests: string[] = [];
    const next: string[] = ['الحفاظ على الماء والتهوية وتقليل أي إجهاد غير ضروري', 'عدم بدء مضاد حيوي عشوائياً قبل مراجعة الطبيب المعتمد'];

    const waterFeedRatio = selected.feed_kg > 0 ? selected.water_liters / selected.feed_kg : 0;
    const mortalityRate = selected.flock_size > 0 ? (selected.mortality_today / selected.flock_size) * 100 : 0;
    const respiratory = /تنفس|شخر|عطس|كحة|قصبة|خرخرة/.test(t) || (selected.ammonia_ppm || 0) > 20;
    const enteric = /اسهال|إسهال|دم|أعور|أمعاء|كوكس/.test(t) || selected.droppings_photos.length > 0;
    const heat = selected.temperature_celsius >= 32 || waterFeedRatio > 2.4;

    if (respiratory) {
      conditions.push({ disease: 'متلازمة تنفسية متعددة العوامل', probability_percent: 68, rationale: 'أعراض تنفسية/بيئية تحتاج فحصاً تفريقياً وربطاً بالصوت والصور.' });
      tests.push('مسحات تنفسية حسب تقييم الطبيب (PCR/زراعة عند الحاجة)');
      findings.push('مؤشرات تنفسية تحتاج تقييم الطبيب وعدم الاعتماد على الصوت أو الصورة وحدهما.');
    }
    if (enteric) {
      conditions.push({ disease: 'اضطراب معوي/كوكسيديا ضمن التشخيص التفريقي', probability_percent: 58, rationale: 'وجود وصف/صور مرتبطة بالإسهال أو الأمعاء.' });
      tests.push('فحص براز/أمعاء مجهري أو فحص مختبري موجه حسب الطبيب');
      findings.push('وجود مؤشرات هضمية تستدعي مراجعة الفرشة والمياه والتشريح.');
    }
    if (heat) {
      conditions.push({ disease: 'إجهاد حراري/بيئي', probability_percent: 74, rationale: 'الحرارة أو نسبة الماء إلى العلف أعلى من المتوقع تشغيلياً.' });
      findings.push('مؤشر بيئي قد يفاقم الحالة الصحية.');
      next.push('مراجعة سرعة الهواء والتبريد وكثافة الطيور فوراً');
    }
    if (!conditions.length) {
      conditions.push({ disease: 'لا توجد إشارة نوعية كافية', probability_percent: 35, rationale: 'البيانات الحالية لا تكفي لتوجيه تشخيص تفريقي ضيق.' });
      next.push('استكمال صور الإسهال/التشريح والصوت والوزن قبل تضييق الاحتمالات');
    }
    if (mortalityRate >= 0.2) {
      findings.push(`النافق اليومي مرتفع نسبياً (${mortalityRate.toFixed(2)}%).`);
      next.unshift('تصعيد الحالة للطبيب/الاستشاري المناوب ومراجعة الحاجة لنزول عاجل');
    }

    const risk: AIDiagnosticAssessmentV14['risk_level'] = mortalityRate >= 0.5 ? 'critical' : mortalityRate >= 0.2 || respiratory ? 'high' : heat || enteric ? 'medium' : 'low';
    const assessment: AIDiagnosticAssessmentV14 = {
      id: `aida-${Date.now()}`, visit_id: selected.id, case_id: selected.case_id, created_at: now(), risk_level: risk,
      suspected_conditions: conditions, key_findings: findings, recommended_lab_tests: Array.from(new Set(tests)), recommended_next_steps: next,
      image_analysis_status: enterprise.cloud_production_v14.media_storage_status === 'connected' ? 'quality_only' : 'not_connected',
      audio_analysis_status: enterprise.cloud_production_v14.media_storage_status === 'connected' ? 'quality_only' : 'not_connected',
      senior_vet_required: risk === 'high' || risk === 'critical',
      medical_disclaimer: 'دعم قرار أولي فقط. لا يعتبر تشخيصاً نهائياً ولا يجيز وصف المضادات الحيوية دون اعتماد الطبيب البيطري.',
      status: 'ready_for_vet'
    };
    patchEnterprise({
      ai_diagnostic_assessments_v14: [assessment, ...enterprise.ai_diagnostic_assessments_v14],
      field_doctor_visits_v14: enterprise.field_doctor_visits_v14.map(v => v.id === selected.id ? { ...v, status: 'under_ai_review' } : v)
    });
  };

  const escalate = () => {
    if (!selected) return;
    const latest = enterprise.ai_diagnostic_assessments_v14.find(a => a.visit_id === selected.id);
    const item = {
      id:`esc-${Date.now()}`, case_id:selected.case_id, visit_id:selected.id, created_at:now(), escalated_by:selected.doctor_name,
      reason: latest?.key_findings.join(' • ') || 'الحالة تحتاج مراجعة استشاري بسبب عدم كفاية المعطيات أو ارتفاع الخطورة.',
      priority: latest?.risk_level === 'critical' ? 'critical' as const : latest?.risk_level === 'high' ? 'urgent' as const : 'normal' as const,
      assigned_senior_vet:'الاستشاري المناوب',
      attachment_summary:[`${selected.necropsy_observations.length} صور تشريح`, `${selected.voice_notes.length} ملاحظات صوتية`, 'بيانات البيئة والعلف والماء والنفوق'],
      status:'queued' as const
    };
    patchEnterprise({
      case_escalations_v14:[item, ...enterprise.case_escalations_v14],
      field_doctor_visits_v14:enterprise.field_doctor_visits_v14.map(v=>v.id===selected.id?{...v,status:'escalated'}:v)
    });
  };

  const saveOffline = () => {
    if (!selected) return;
    updateVisit({ offline_created:true, sync_status:'local_pending', status:'offline_saved' });
  };

  const submit = () => {
    if (!selected) return;
    updateVisit({ status:'submitted', sync_status:navigator.onLine?'queued':'local_pending', ended_at:now() });
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/40 p-5">
        <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-teal-300 text-xs font-black"><Stethoscope className="w-4 h-4"/> V14 • مساحة الطبيب الميداني</div>
            <h3 className="text-xl font-black text-white mt-1">زيارة ميدانية → تشريح وصوت → دعم قرار AI → تصعيد للاستشاري</h3>
            <p className="text-xs text-slate-300 mt-2 max-w-4xl">تعمل محلياً عند انقطاع الشبكة. الصور والصوت تبقى في طابور الرفع حتى يتم ربط Cloud Storage فعلي.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center min-w-[310px] text-[11px]">
            <Kpi label="غير متزامن" value={stats.pendingSync} tone="amber"/><Kpi label="تصعيدات نشطة" value={stats.escalated} tone="rose"/><Kpi label="AI للمراجعة" value={stats.aiWaiting} tone="cyan"/>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[330px_1fr] gap-4">
        <aside className="space-y-3">
          <button onClick={createVisit} className="w-full rounded-xl bg-teal-500 text-slate-950 font-black py-2.5">+ زيارة ميدانية جديدة</button>
          <div className="space-y-2 max-h-[650px] overflow-y-auto">
            {enterprise.field_doctor_visits_v14.map(v => <button key={v.id} onClick={()=>setSelectedId(v.id)} className={`w-full text-right rounded-xl border p-3 text-xs ${selected?.id===v.id?'border-teal-400 bg-teal-500/10':'border-slate-800 bg-slate-950/60'}`}>
              <div className="flex justify-between gap-2"><b className="text-white">{v.visit_number}</b><span className="text-[10px] text-teal-300">{v.status}</span></div>
              <div className="text-slate-300 mt-1">{v.farm_name}</div><div className="text-slate-500 mt-1">{v.doctor_name} • عمر {v.age_days} يوم</div>
            </button>)}
          </div>
        </aside>

        {selected ? <div className="space-y-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4"><h4 className="font-black text-white">بيانات الزيارة والقطيع</h4><div className="flex gap-2"><button onClick={captureGps} className="btn"><MapPin className="w-4 h-4"/> GPS</button><button onClick={saveOffline} className="btn"><CloudOff className="w-4 h-4"/> حفظ أوفلاين</button><button onClick={submit} className="btn-primary"><Send className="w-4 h-4"/> إرسال</button></div></div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
              <Input label="اسم العميل" value={selected.customer_name} onChange={v=>updateVisit({customer_name:v})}/><Input label="الهاتف" value={selected.phone} onChange={v=>updateVisit({phone:v})}/><Input label="المحافظة" value={selected.governorate} onChange={v=>updateVisit({governorate:v})}/><Input label="المديرية" value={selected.district} onChange={v=>updateVisit({district:v})}/>
              <NumberInput label="عدد القطيع" value={selected.flock_size} onChange={v=>updateVisit({flock_size:v})}/><NumberInput label="العمر / يوم" value={selected.age_days} onChange={v=>updateVisit({age_days:v})}/><NumberInput label="النافق اليوم" value={selected.mortality_today} onChange={v=>updateVisit({mortality_today:v})}/><NumberInput label="متوسط الوزن / جم" value={selected.average_weight_grams||0} onChange={v=>updateVisit({average_weight_grams:v})}/>
              <NumberInput label="العلف / كجم" value={selected.feed_kg} onChange={v=>updateVisit({feed_kg:v})}/><NumberInput label="الماء / لتر" value={selected.water_liters} onChange={v=>updateVisit({water_liters:v})}/><NumberInput label="الحرارة °C" value={selected.temperature_celsius} onChange={v=>updateVisit({temperature_celsius:v})}/><NumberInput label="الرطوبة %" value={selected.humidity_percent} onChange={v=>updateVisit({humidity_percent:v})}/>
              <NumberInput label="سرعة الهواء m/s" value={selected.air_speed_mps||0} onChange={v=>updateVisit({air_speed_mps:v})}/><NumberInput label="الأمونيا ppm" value={selected.ammonia_ppm||0} onChange={v=>updateVisit({ammonia_ppm:v})}/><NumberInput label="CO₂ ppm" value={selected.co2_ppm||0} onChange={v=>updateVisit({co2_ppm:v})}/><Input label="العنوان التفصيلي" value={selected.detailed_address} onChange={v=>updateVisit({detailed_address:v})}/>
            </div>
            <label className="block mt-3 text-xs text-slate-400">شرح الحالة<input className="field mt-1" value={selected.symptoms_description} onChange={e=>updateVisit({symptoms_description:e.target.value})} placeholder="اشرح التنفس، الإسهال، الشهية، الحركة وأي تغير واضح..."/></label>
          </section>

          <section className="grid xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <h4 className="font-black text-white flex items-center gap-2"><Camera className="w-4 h-4 text-cyan-300"/> الصور الميدانية والتشريح</h4>
              <div className="grid grid-cols-3 gap-2 mt-3"><FilePicker label="صورة العنبر" accept="image/*" capture="environment" onFile={f=>addPhoto(f,'barn')}/><FilePicker label="صورة الإسهال" accept="image/*" capture="environment" onFile={f=>addPhoto(f,'droppings')}/><FilePicker label="صورة الفرشة" accept="image/*" capture="environment" onFile={f=>addPhoto(f,'litter')}/></div>
              <div className="mt-3"><FilePicker label="التقاط صورة تشريح: القصبة الهوائية" accept="image/*" capture="environment" onFile={f=>addNecropsyPhoto(f,'القصبة الهوائية')}/></div>
              <div className="mt-3 grid sm:grid-cols-2 gap-2">{selected.necropsy_observations.map(o=><div key={o.id} className="rounded-xl border border-slate-800 p-2 text-xs"><div className="flex justify-between"><b>{o.organ_name}</b><span className={o.image_quality==='clear'?'text-emerald-300':'text-amber-300'}>{o.image_quality==='clear'?'واضحة':'أعد التصوير'}</span></div>{o.image_url&&<img src={o.image_url} className="mt-2 w-full h-36 object-contain rounded-lg bg-black/30"/>}<div className="text-slate-400 mt-1">{o.description}</div></div>)}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <h4 className="font-black text-white flex items-center gap-2"><Mic className="w-4 h-4 text-amber-300"/> التسجيل الصوتي والوصف اللحظي</h4>
              <FilePicker label="رفع/تسجيل ملف صوتي" accept="audio/*" capture="user" onFile={addVoice}/>
              <div className="space-y-2 mt-3">{selected.voice_notes.map(v=><div key={v.id} className="rounded-xl border border-slate-800 p-2 text-xs"><div className="flex justify-between"><b>{v.file_name||'تسجيل ميداني'}</b><span className="text-amber-300">{v.transcript_status}</span></div>{v.audio_url&&<audio controls src={v.audio_url} className="w-full mt-2"/>}<div className="text-slate-400 mt-1">{v.note}</div></div>)}</div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 mt-3 text-[11px] text-amber-100">تحويل الصوت إلى نص وتحليل أصوات الشخير/العطس الحقيقي يحتاج خدمة STT/نموذج صوتي على الخادم. الواجهة وطابور الملفات جاهزان.</div>
            </div>
          </section>

          <section className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4">
            <div className="flex flex-wrap gap-2 justify-between items-center"><div><h4 className="font-black text-white flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-teal-300"/> محرك دعم القرار التشخيصي</h4><p className="text-[11px] text-slate-400 mt-1">يولد تشخيصاً تفريقياً محافظاً ويقترح فحوصاً؛ لا يصدر وصفة ولا يعتمد المضاد.</p></div><div className="flex gap-2"><button onClick={runDecisionSupport} className="btn-primary"><BrainCircuit className="w-4 h-4"/> تحليل أولي</button><button onClick={escalate} className="btn-danger"><AlertTriangle className="w-4 h-4"/> تحويل للاستشاري</button></div></div>
            <div className="mt-3 space-y-2">{enterprise.ai_diagnostic_assessments_v14.filter(a=>a.visit_id===selected.id).slice(0,2).map(a=><div key={a.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs"><div className="flex justify-between"><b className="text-white">خطورة: {a.risk_level}</b><span className="text-teal-300">{a.status}</span></div>{a.suspected_conditions.map(c=><div key={c.disease} className="mt-2"><div className="flex justify-between"><span>{c.disease}</span><b>{c.probability_percent}%</b></div><div className="text-slate-500">{c.rationale}</div></div>)}<div className="text-amber-200 mt-2">{a.medical_disclaimer}</div></div>)}</div>
          </section>
        </div> : <div className="rounded-2xl border border-slate-800 p-8 text-center text-slate-400">أنشئ زيارة ميدانية للبدء.</div>}
      </div>
      <style>{`.field{width:100%;background:#020617;border:1px solid #334155;border-radius:.75rem;padding:.6rem .75rem;color:#fff}.btn,.btn-primary,.btn-danger{display:inline-flex;align-items:center;gap:.35rem;border-radius:.75rem;padding:.5rem .75rem;font-size:.75rem;font-weight:800}.btn{background:#0f172a;border:1px solid #334155;color:#cbd5e1}.btn-primary{background:#14b8a6;color:#042f2e}.btn-danger{background:rgba(244,63,94,.15);border:1px solid rgba(244,63,94,.35);color:#fda4af}`}</style>
    </div>
  );
};

const Input: React.FC<{label:string;value:string;onChange:(v:string)=>void}> = ({label,value,onChange}) => <label className="text-[11px] text-slate-400">{label}<input className="field mt-1" value={value} onChange={e=>onChange(e.target.value)}/></label>;
const NumberInput: React.FC<{label:string;value:number;onChange:(v:number)=>void}> = ({label,value,onChange}) => <label className="text-[11px] text-slate-400">{label}<input type="number" className="field mt-1" value={Number.isFinite(value)?value:0} onChange={e=>onChange(Number(e.target.value)||0)}/></label>;
const FilePicker: React.FC<{label:string;accept:string;capture?:'user'|'environment';onFile:(file:File|undefined)=>void}> = ({label,accept,capture,onFile}) => <label className="block cursor-pointer rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-3 text-center text-xs text-slate-300 hover:border-teal-500/50"><FileUp className="w-4 h-4 mx-auto mb-1"/>{label}<input type="file" accept={accept} capture={capture} className="hidden" onChange={e=>onFile(e.target.files?.[0])}/></label>;
const Kpi: React.FC<{label:string;value:number;tone:'amber'|'rose'|'cyan'}> = ({label,value,tone}) => <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2"><div className={`font-black text-lg ${tone==='amber'?'text-amber-300':tone==='rose'?'text-rose-300':'text-cyan-300'}`}>{value}</div><div className="text-slate-500">{label}</div></div>;
