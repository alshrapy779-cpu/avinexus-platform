import React, { useMemo, useState } from 'react';
import { Building2, CheckCircle2, MapPin, Phone, ShieldCheck, UserPlus, X } from 'lucide-react';
import { BreedType, SystemType } from '../../types';
import { buildCustomerRegistrationIdsV194, CustomerRegistrationSource, CustomerRegistrationV194 } from '../../modules/customer/CustomerLifecycleV19_4';

const systems: SystemType[] = ['مغلق أوتوماتيكي (Closed Modern)','نصف مغلق (Semi-closed)','مفتوح تقليدي (Open Standard)'];
const breeds: BreedType[] = ['Ross 308','Cobb 500','Hubbard Classic','Arbor Acres','Sasso','البلدي المحسن'];

export const CustomerOnboardingModal: React.FC<{
  open:boolean;
  mode:'self'|'admin';
  governorates:string[];
  onClose:()=>void;
  onSubmit:(registration:CustomerRegistrationV194)=>void;
}> = ({open,mode,governorates,onClose,onSubmit}) => {
  const ids = useMemo(() => buildCustomerRegistrationIdsV194(), [open]);
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({
    full_name:'', phone:'', whatsapp:'', governorate:governorates[0] || 'صنعاء', district:'', area:'', farm_name:'', farm_activity:'broiler' as CustomerRegistrationV194['farm_activity'],
    system_type: systems[0], hangars_count:1, capacity:10000, breed_type:'Ross 308' as BreedType, active_flock_count:10000, active_flock_age_days:1, chicks_source:'', identity_reference:'', notes:''
  });
  React.useEffect(()=>{ if(open){ setStep(1); setForm((f)=>({...f,governorate:governorates[0]||f.governorate})); } },[open]);
  if(!open) return null;
  const source: CustomerRegistrationSource = mode==='admin'?'admin':'self_service';
  const valid1 = form.full_name.trim().length>=3 && form.phone.trim().length>=7;
  const valid2 = form.farm_name.trim().length>=2 && form.district.trim().length>=2 && form.capacity>0;
  const submit = () => onSubmit({
    ...ids, source, status: mode==='admin'?'approved':'pending_review', created_at:new Date().toISOString(), approved_at:mode==='admin'?new Date().toISOString():undefined, approved_by:mode==='admin'?'الإدارة':undefined,
    full_name:form.full_name.trim(), phone:form.phone.trim(), whatsapp:form.whatsapp.trim()||form.phone.trim(), governorate:form.governorate, district:form.district.trim(), area:form.area.trim(), identity_reference:form.identity_reference.trim()||undefined,
    farm_name:form.farm_name.trim(), farm_activity:form.farm_activity, system_type:form.system_type, hangars_count:Number(form.hangars_count), capacity:Number(form.capacity), breed_type:form.breed_type,
    active_flock_count:Number(form.active_flock_count)||undefined, active_flock_age_days:Number(form.active_flock_age_days)||undefined, chicks_source:form.chicks_source.trim()||undefined, notes:form.notes.trim()||undefined
  });
  return <div className="fixed inset-0 z-[95] bg-slate-950/80 grid place-items-center p-3" dir="rtl" onMouseDown={onClose}>
    <div className="w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-[1.8rem] border border-emerald-500/25 bg-[#07171b] shadow-2xl" onMouseDown={e=>e.stopPropagation()}>
      <div className="sticky top-0 z-10 bg-[#07171b]/96 backdrop-blur border-b border-slate-800 px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3"><span className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 grid place-items-center"><UserPlus className="w-5 h-5"/></span><div><h2 className="font-black text-white">{mode==='admin'?'إضافة عميل ومزرعة بواسطة الإدارة':'تسجيل عميل / مزرعة جديدة'}</h2><p className="text-[10px] text-slate-500 mt-1">{ids.customer_code} • {ids.farm_code}</p></div></div>
        <button className="spp-icon-button" onClick={onClose}><X className="w-4 h-4"/></button>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-2 mb-6"><Step n={1} title="بيانات العميل" active={step===1} done={step>1}/><Step n={2} title="المزرعة والقطيع" active={step===2} done={step>2}/><Step n={3} title="المراجعة" active={step===3} done={false}/></div>
        {step===1 && <div className="grid sm:grid-cols-2 gap-3">
          <Field label="الاسم الكامل *" icon={<UserPlus/>}><input className="spp-field" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="مثال: محمد أحمد علي"/></Field>
          <Field label="رقم الهاتف *" icon={<Phone/>}><input className="spp-field" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="77xxxxxxx" inputMode="tel"/></Field>
          <Field label="واتساب"><input className="spp-field" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="يُستخدم رقم الهاتف إذا تُرك فارغًا"/></Field>
          <Field label="مرجع الهوية/الوثيقة"><input className="spp-field" value={form.identity_reference} onChange={e=>setForm({...form,identity_reference:e.target.value})}/></Field>
          <Field label="المحافظة *" icon={<MapPin/>}><select className="spp-field" value={form.governorate} onChange={e=>setForm({...form,governorate:e.target.value})}>{governorates.map(g=><option key={g}>{g}</option>)}</select></Field>
          <Field label="المديرية *"><input className="spp-field" value={form.district} onChange={e=>setForm({...form,district:e.target.value})}/></Field>
          <Field label="المنطقة/القرية"><input className="spp-field" value={form.area} onChange={e=>setForm({...form,area:e.target.value})}/></Field>
        </div>}
        {step===2 && <div className="grid sm:grid-cols-2 gap-3">
          <Field label="اسم المزرعة *" icon={<Building2/>}><input className="spp-field" value={form.farm_name} onChange={e=>setForm({...form,farm_name:e.target.value})}/></Field>
          <Field label="نوع النشاط"><select className="spp-field" value={form.farm_activity} onChange={e=>setForm({...form,farm_activity:e.target.value as any})}><option value="broiler">لاحم</option><option value="layer">بياض</option><option value="breeder">أمهات</option><option value="hatchery">فقاسة</option><option value="mixed">مختلط</option><option value="other">أخرى</option></select></Field>
          <Field label="نظام التربية"><select className="spp-field" value={form.system_type} onChange={e=>setForm({...form,system_type:e.target.value as SystemType})}>{systems.map(s=><option key={s}>{s}</option>)}</select></Field>
          <Field label="عدد العنابر"><input className="spp-field" type="number" min="1" value={form.hangars_count} onChange={e=>setForm({...form,hangars_count:Number(e.target.value)})}/></Field>
          <Field label="الطاقة الاستيعابية"><input className="spp-field" type="number" min="1" value={form.capacity} onChange={e=>setForm({...form,capacity:Number(e.target.value)})}/></Field>
          <Field label="السلالة الحالية"><select className="spp-field" value={form.breed_type} onChange={e=>setForm({...form,breed_type:e.target.value as BreedType})}>{breeds.map(b=><option key={b}>{b}</option>)}</select></Field>
          <Field label="عدد القطيع الحالي"><input className="spp-field" type="number" min="0" value={form.active_flock_count} onChange={e=>setForm({...form,active_flock_count:Number(e.target.value)})}/></Field>
          <Field label="عمر القطيع بالأيام"><input className="spp-field" type="number" min="0" value={form.active_flock_age_days} onChange={e=>setForm({...form,active_flock_age_days:Number(e.target.value)})}/></Field>
          <Field label="مصدر الصيصان"><input className="spp-field" value={form.chicks_source} onChange={e=>setForm({...form,chicks_source:e.target.value})}/></Field>
          <Field label="ملاحظات"><textarea className="spp-field min-h-20" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></Field>
        </div>}
        {step===3 && <div className="space-y-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex gap-3"><ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0"/><div><div className="text-sm font-black text-white">مراجعة التسجيل</div><p className="text-[11px] text-slate-400 mt-1">{mode==='admin'?'سيُعتمد الحساب مباشرة لأنه أُنشئ بواسطة الإدارة.':'سيُرسل الطلب للإدارة بحالة «قيد المراجعة»، ولن يصبح حسابًا تشغيليًا قبل الاعتماد.'}</p></div></div>
          <Review label="العميل" value={`${form.full_name} • ${form.phone}`}/><Review label="العنوان" value={`${form.governorate} / ${form.district}${form.area?` / ${form.area}`:''}`}/><Review label="المزرعة" value={`${form.farm_name} • ${form.hangars_count} عنبر • طاقة ${Number(form.capacity).toLocaleString('ar-YE')}`}/><Review label="القطيع" value={`${form.breed_type} • ${Number(form.active_flock_count).toLocaleString('ar-YE')} طائر • عمر ${form.active_flock_age_days} يوم`}/>
        </div>}
        <div className="flex justify-between gap-2 mt-6 pt-4 border-t border-slate-800">
          <button className="spp-button spp-button-ghost" onClick={()=>step===1?onClose():setStep(step-1)}>{step===1?'إلغاء':'السابق'}</button>
          {step<3 ? <button className="spp-button spp-button-primary" disabled={step===1?!valid1:!valid2} onClick={()=>setStep(step+1)}>التالي</button> : <button className="spp-button spp-button-primary" onClick={submit}><CheckCircle2 className="w-4 h-4"/>{mode==='admin'?'إنشاء واعتماد الحساب':'إرسال طلب التسجيل'}</button>}
        </div>
      </div>
    </div>
  </div>;
};

const Field: React.FC<{label:string;icon?:React.ReactNode;children:React.ReactNode}> = ({label,icon,children}) => <label className="block"><span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1.5">{icon&&<span className="[&>svg]:w-3 [&>svg]:h-3 text-emerald-400">{icon}</span>}{label}</span>{children}</label>;
const Step: React.FC<{n:number;title:string;active:boolean;done:boolean}> = ({n,title,active,done}) => <div className={`rounded-xl border px-2 py-2 text-center ${active?'border-emerald-500/40 bg-emerald-500/10':done?'border-cyan-500/30 bg-cyan-500/5':'border-slate-800 bg-slate-950/30'}`}><span className={`inline-grid place-items-center w-5 h-5 rounded-full text-[9px] font-black ${active?'bg-emerald-500 text-slate-950':done?'bg-cyan-500 text-slate-950':'bg-slate-800 text-slate-400'}`}>{done?'✓':n}</span><div className="text-[9px] sm:text-[10px] font-bold text-slate-300 mt-1">{title}</div></div>;
const Review: React.FC<{label:string;value:string}> = ({label,value}) => <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div className="text-[9px] text-slate-500">{label}</div><div className="text-xs font-bold text-slate-200 mt-1">{value}</div></div>;
