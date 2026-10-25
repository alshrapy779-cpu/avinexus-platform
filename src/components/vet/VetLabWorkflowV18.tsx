import React from 'react';
import { CheckCircle2, Clock3, FlaskConical, FileSignature, Send, ShieldCheck } from 'lucide-react';
import { SmartOperationsState, SampleTrackingCaseV18 } from '../../types';
import { canReleaseLabResultV18 } from '../../services/enterpriseIntelligenceV18';

interface Props { operations:SmartOperationsState; onUpdateOperations:(o:SmartOperationsState)=>void; }

export const VetLabWorkflowV18:React.FC<Props>=({operations,onUpdateOperations})=>{
  const e=operations.enterprise;
  const update=(items:SampleTrackingCaseV18[])=>onUpdateOperations({...operations,enterprise:{...e,sample_tracking_v18:items}});
  const patch=(id:string,p:Partial<SampleTrackingCaseV18>)=>update(e.sample_tracking_v18.map(x=>x.id===id?{...x,...p}:x));
  const cases=e.sample_tracking_v18;
  return <div className="space-y-4" dir="rtl">
    <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-4"><div className="flex gap-2 items-center"><FlaskConical className="w-5 h-5 text-cyan-400"/><h3 className="text-white font-black">V18 • حالات المختبر المسندة للطبيب</h3></div><p className="text-xs text-slate-300 mt-1">الطبيب يراجع سبب الفحص، تعليمات العينة، النتائج، ثم يوقع القرار قبل أي إصدار للعميل.</p></div>
    {cases.map(c=><div key={c.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 grid lg:grid-cols-12 gap-4">
      <div className="lg:col-span-4"><div className="text-sm font-black text-white">{c.tracking_number}</div><div className="text-xs text-slate-300">{c.farm_name} • عمر {c.bird_age_days} يوم</div><div className="text-[11px] text-slate-400 mt-2">{c.symptoms_summary}</div><div className="text-[11px] text-cyan-300 mt-2">الفحوص: {c.requested_tests.join('، ')}</div></div>
      <div className="lg:col-span-5 text-[11px] text-slate-300 space-y-1"><div><b>الحالة:</b> {c.status}</div><div><b>سبب الفحص:</b> {c.test_reason}</div><div><b>الحفظ:</b> {c.preservation_instructions}</div><div><b>النتيجة:</b> {c.lab_result_summary||'لم تصل بعد'}</div><div><b>تلخيص AI:</b> {c.ai_result_summary||'بانتظار النتيجة'}</div></div>
      <div className="lg:col-span-3 flex flex-col gap-2">
        <button onClick={()=>patch(c.id,{status:'sample_requested'})} className="px-3 py-2 rounded-xl bg-cyan-800 text-white text-xs font-bold flex gap-2"><Send className="w-4 h-4"/>اعتماد طلب العينة</button>
        <button onClick={()=>patch(c.id,{status:'under_lab_test',sample_received_at:new Date().toISOString(),chain_of_custody:[...c.chain_of_custody,'استلام العينة بالمختبر وتحديث الطبيب']})} className="px-3 py-2 rounded-xl bg-indigo-800 text-white text-xs font-bold flex gap-2"><Clock3 className="w-4 h-4"/>قيد الفحص</button>
        <button onClick={()=>patch(c.id,{vet_signed_by:c.assigned_vet_name,vet_signed_at:new Date().toISOString(),final_decision:c.final_decision||'برنامج علاج',status:'awaiting_vet_signature'})} className="px-3 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold flex gap-2"><FileSignature className="w-4 h-4"/>توقيع واعتماد</button>
        <button disabled={!canReleaseLabResultV18(c,e)} onClick={()=>patch(c.id,{status:'released_to_customer',customer_released_at:new Date().toISOString()})} className="px-3 py-2 rounded-xl bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold flex gap-2"><CheckCircle2 className="w-4 h-4"/>إصدار للعميل</button>
      </div>
    </div>)}
  </div>;
};
