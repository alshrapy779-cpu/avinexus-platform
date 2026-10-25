import React from 'react';
import { CheckCircle2, Clock3, UserPlus, XCircle } from 'lucide-react';
import { CustomerRegistrationV194, customerStatusLabelV194 } from '../../modules/customer/CustomerLifecycleV19_4';

export const CustomerRegistrationAdminPanel: React.FC<{
  registrations:CustomerRegistrationV194[];
  onAdd:()=>void;
  onApprove:(id:string)=>void;
  onReject:(id:string)=>void;
}> = ({registrations,onAdd,onApprove,onReject}) => {
  const pending = registrations.filter(r=>['new','phone_verified','pending_review','needs_information'].includes(r.status));
  return <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5" dir="rtl">
    <div className="spp-section-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3"><div><h3 className="text-sm font-black text-white">تسجيل واعتماد العملاء والمزارع</h3><p className="text-[10px] text-slate-500 mt-1">Self-Service + إدخال مباشر من الإدارة مع منع التكرار ورقم موحد لكل كيان.</p></div><button className="spp-button spp-button-primary" onClick={onAdd}><UserPlus className="w-4 h-4"/> إضافة عميل جديد</button></div>
      {pending.length===0 ? <div className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-[11px] text-slate-500">لا توجد طلبات تسجيل بانتظار المراجعة.</div> : <div className="grid lg:grid-cols-2 gap-2">{pending.slice(0,6).map(r=><div key={r.id} className="rounded-xl border border-slate-800 bg-slate-950/45 p-3"><div className="flex justify-between gap-3"><div><div className="text-xs font-black text-white">{r.full_name}</div><div className="text-[10px] text-slate-500 mt-1">{r.customer_code} • {r.phone}</div></div><span className="text-[9px] px-2 py-1 h-fit rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20"><Clock3 className="inline w-3 h-3 ml-1"/>{customerStatusLabelV194[r.status]}</span></div><div className="text-[10px] text-slate-400 mt-2">{r.farm_name} • {r.governorate}/{r.district} • طاقة {r.capacity.toLocaleString('ar-YE')}</div><div className="flex gap-2 mt-3"><button className="spp-button spp-button-primary !py-1.5 !text-[10px]" onClick={()=>onApprove(r.id)}><CheckCircle2 className="w-3.5 h-3.5"/> اعتماد وربط الحساب</button><button className="spp-button spp-button-danger !py-1.5 !text-[10px]" onClick={()=>onReject(r.id)}><XCircle className="w-3.5 h-3.5"/> رفض</button></div></div>)}</div>}
    </div>
  </div>;
};
