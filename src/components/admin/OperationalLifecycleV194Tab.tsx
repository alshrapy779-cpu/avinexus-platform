import React from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, PackageSearch, Plus, ShieldCheck, Stamp, XCircle } from 'lucide-react';
import { appendAuditV194, EMPTY_OPERATIONAL_LIFECYCLE_V194, entityNumberV194, OperationalLifecycleStateV194 } from '../../modules/lifecycle/OperationalLifecycleV19_4';

const loadState = (): OperationalLifecycleStateV194 => {
  try { const raw=localStorage.getItem('spp-operational-lifecycle-v19-4'); return raw ? { ...EMPTY_OPERATIONAL_LIFECYCLE_V194, ...JSON.parse(raw) } : EMPTY_OPERATIONAL_LIFECYCLE_V194; } catch { return EMPTY_OPERATIONAL_LIFECYCLE_V194; }
};

export const OperationalLifecycleV194Tab: React.FC = () => {
  const [section,setSection]=React.useState<'cases'|'lots'|'approvals'|'audit'>('cases');
  const [state,setState]=React.useState<OperationalLifecycleStateV194>(loadState);
  React.useEffect(()=>{ try{localStorage.setItem('spp-operational-lifecycle-v19-4',JSON.stringify(state));}catch{} },[state]);

  const addCase=()=>{
    const now=new Date().toISOString(); const id=`case-${Date.now()}`; const n=entityNumberV194('CASE');
    setState(prev=>appendAuditV194({...prev,cases:[{id,case_number:n,type:'veterinary',title:'حالة جديدة تحتاج التقييم',priority:'normal',status:'new',owner_role:'الاستشاري البيطري',created_at:now,updated_at:now,timeline:[{id:`evt-${Date.now()}`,at:now,actor:'النظام',action:'إنشاء الحالة'}]},...prev.cases]},'الإدارة','إنشاء حالة موحدة','case',id));
  };
  const addLot=()=>{
    const id=`lot-${Date.now()}`; const n=entityNumberV194('LOT');
    setState(prev=>appendAuditV194({...prev,lots:[{id,lot_number:n,item_name:'دفعة جديدة',category:'medicine',supplier_name:'مورد غير محدد',cold_chain_required:false,cold_chain_status:'not_required',quantity_received:0,quantity_available:0,unit:'وحدة',status:'active',created_at:new Date().toISOString()},...prev.lots]},'الإدارة','إنشاء دفعة تتبع','lot',id));
  };
  const addApproval=()=>{
    const now=new Date().toISOString(); const id=`apr-${Date.now()}`;
    setState(prev=>appendAuditV194({...prev,approvals:[{id,approval_number:entityNumberV194('APR'),subject_type:'other',subject_label:'طلب اعتماد جديد',requested_by:'الإدارة',required_steps:['مدير القسم','المالية','المدير العام'],completed_steps:[],status:'pending',created_at:now,updated_at:now},...prev.approvals]},'الإدارة','إنشاء طلب اعتماد','approval',id));
  };
  const advanceApproval=(id:string)=> setState(prev=>{
    const approvals=prev.approvals.map(a=>{if(a.id!==id||a.status!=='pending')return a; const next=[...a.completed_steps,a.required_steps[a.completed_steps.length]].filter(Boolean); return {...a,completed_steps:next,status:next.length>=a.required_steps.length?'approved' as const:'pending' as const,updated_at:new Date().toISOString()};});
    return appendAuditV194({...prev,approvals},'الإدارة','تحديث سلسلة الاعتماد','approval',id);
  });

  return <div className="space-y-4" dir="rtl">
    <div className="spp-section-card">
      <div className="flex flex-wrap justify-between gap-3"><div><div className="flex items-center gap-2 text-emerald-300 text-[10px] font-black"><ShieldCheck className="w-4 h-4"/>V19.4 • CLOSED LOOP OPERATIONS</div><h3 className="text-xl font-black text-white mt-1">مركز دورة التشغيل والتتبع</h3><p className="text-[11px] text-slate-500 mt-1">Case Management + Batch/Lot + Multi-Level Approvals + Audit foundation</p></div><div className="flex gap-2"><button className="spp-button spp-button-primary" onClick={section==='cases'?addCase:section==='lots'?addLot:section==='approvals'?addApproval:undefined} disabled={section==='audit'}><Plus className="w-4 h-4"/> إضافة سجل</button></div></div>
      <div className="grid grid-cols-4 gap-2 mt-4">{[['cases','الحالات',state.cases.length],['lots','الدفعات',state.lots.length],['approvals','الاعتمادات',state.approvals.length],['audit','التدقيق',state.audit.length]].map(([id,label,count])=><button key={String(id)} onClick={()=>setSection(id as any)} className={`rounded-xl border p-3 text-center ${section===id?'border-emerald-500/30 bg-emerald-500/10 text-emerald-200':'border-slate-800 bg-slate-950/30 text-slate-400'}`}><div className="text-base font-black">{count}</div><div className="text-[9px] mt-1">{label}</div></button>)}</div>
    </div>

    {section==='cases'&&<div className="space-y-2">{state.cases.length===0?<Empty text="لا توجد حالات موحدة بعد."/>:state.cases.map(c=><div key={c.id} className="spp-section-card"><div className="flex justify-between gap-3"><div><b className="text-white text-sm">{c.case_number} • {c.title}</b><div className="text-[10px] text-slate-500 mt-1">{c.type} • المسؤول: {c.owner_role}</div></div><span className="text-[9px] h-fit px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">{c.status}</span></div></div>)}</div>}
    {section==='lots'&&<div className="space-y-2">{state.lots.length===0?<Empty text="لا توجد دفعات مسجلة بعد."/>:state.lots.map(l=><div key={l.id} className="spp-section-card flex justify-between gap-3"><div><b className="text-white text-sm">{l.lot_number} • {l.item_name}</b><div className="text-[10px] text-slate-500 mt-1">{l.supplier_name} • متاح {l.quantity_available} {l.unit}</div></div><span className={`text-[9px] h-fit px-2 py-1 rounded-full border ${l.status==='recalled'?'bg-rose-500/10 text-rose-300 border-rose-500/20':'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}`}>{l.status}</span></div>)}</div>}
    {section==='approvals'&&<div className="space-y-2">{state.approvals.length===0?<Empty text="لا توجد طلبات اعتماد بعد."/>:state.approvals.map(a=><div key={a.id} className="spp-section-card"><div className="flex flex-wrap justify-between gap-3"><div><b className="text-white text-sm">{a.approval_number} • {a.subject_label}</b><div className="text-[10px] text-slate-500 mt-1">اكتمل {a.completed_steps.length} من {a.required_steps.length}: {a.required_steps.join(' ← ')}</div></div>{a.status==='pending'?<button onClick={()=>advanceApproval(a.id)} className="spp-button spp-button-secondary !min-h-0 !py-1.5"><Stamp className="w-3.5 h-3.5"/> اعتماد المرحلة التالية</button>:<span className="text-emerald-300 text-xs flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> معتمد</span>}</div></div>)}</div>}
    {section==='audit'&&<div className="space-y-2">{state.audit.length===0?<Empty text="سجل التدقيق فارغ."/>:state.audit.slice(0,50).map(a=><div key={a.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-[10px]"><div className="flex justify-between"><b className="text-slate-200">{a.action}</b><span className="text-slate-600">{new Date(a.at).toLocaleString('ar-YE')}</span></div><div className="text-slate-500 mt-1">{a.actor} • {a.entity_type}/{a.entity_id}</div></div>)}</div>}
  </div>;
};

const Empty:React.FC<{text:string}>=({text})=><div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-xs text-slate-500"><ClipboardList className="w-6 h-6 mx-auto mb-2 text-slate-600"/>{text}</div>;
