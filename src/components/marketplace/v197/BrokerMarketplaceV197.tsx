import React, { useMemo, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, Clock3, MapPin, PackageSearch, RefreshCw, Route, Search, ShieldCheck, ShoppingBag, Stethoscope, Truck, UserRound, XCircle } from 'lucide-react';
import type { CurrencyV195, PlatformRoleV195 } from '../../../modules/platform/PlatformCoreV19_5';
import {
  ManagedOperationsStateV197, MarketplaceAvailabilityRequestV197, SupplierAvailabilityOfferV197,
  AvailabilityAttestationV197, AvailabilityStateV197,
  buildDailyAvailabilityAttestationsV197, createMarketplaceRequestV197, findAlternativeOffersV197,
  markStaleOffersV197, routeMarketplaceRequestV197, submitAvailabilityAttestationV197, supplierRespondMarketplaceV197,
  customerConfirmMarketplaceRequestV197, recordMarketplacePaymentV197, dispatchMarketplaceOrderV197, completeMarketplaceDeliveryV197, escalateMarketplaceToOnCallVetV197
} from '../../../modules/managed/ManagedPoultryOperationsV19_7';
import { APP_RELEASE_LABEL } from '../../../config/appVersion';

interface Props {
  state:ManagedOperationsStateV197;
  onChange:(next:ManagedOperationsStateV197)=>void;
  currentUserRole:PlatformRoleV195;
  currentUserName:string;
  defaultCustomer?:{name:string;phone:string;governorate:string;district?:string;address?:string};
  onOpenVet?:()=>void;
}

type Tab='browse'|'requests'|'supplier';
const currency:Record<CurrencyV195,string>={SAR:'ر.س',YER_OLD:'ر.ي قديم',YER_NEW:'ر.ي جديد'};
const statusLabel:Record<string,string>={available:'متوفر',limited:'كمية محدودة',unconfirmed:'التوفر غير مؤكد',unavailable:'غير متوفر',paused:'موقوف'};
const statusClass=(s:string)=>s==='available'?'bg-emerald-500/15 text-emerald-300':s==='limited'?'bg-amber-500/15 text-amber-300':s==='unavailable'?'bg-rose-500/15 text-rose-300':'bg-slate-700/60 text-slate-300';

export const BrokerMarketplaceV197:React.FC<Props>=({state,onChange,currentUserRole,currentUserName,defaultCustomer,onOpenVet})=>{
  const [tab,setTab]=useState<Tab>('browse');
  const [q,setQ]=useState('');
  const [selected,setSelected]=useState<SupplierAvailabilityOfferV197|null>(null);
  const [form,setForm]=useState({name:defaultCustomer?.name||'',phone:defaultCustomer?.phone||'',gov:defaultCustomer?.governorate||'صنعاء',district:defaultCustomer?.district||'',address:defaultCustomer?.address||'',qty:1,urgency:'normal' as 'normal'|'urgent'|'critical',maxWait:24,age:21,flock:10000,mortality:0,symptoms:'',vaccines:'',treatments:''});
  const [category,setCategory]=useState('all');
  const offers=useMemo(()=>state.availability_offers.filter(o=>o.active&&(category==='all'||o.category===category)&&(`${o.product_name} ${o.company_name} ${o.scientific_name||''}`.toLowerCase().includes(q.trim().toLowerCase()))),[state.availability_offers,q,category]);
  const isSupplier=['supplier','warehouse','system_owner','ceo'].includes(currentUserRole);
  const canVet=['vet_consultant','field_vet','system_owner','ceo'].includes(currentUserRole);

  const submit=()=>{
    if(!selected||!form.name.trim()||!form.phone.trim()||!form.address.trim())return alert('استكمل الاسم والهاتف والعنوان.');
    const next=createMarketplaceRequestV197(state,{customer_name:form.name.trim(),phone:form.phone.trim(),governorate:form.gov.trim(),district:form.district.trim(),address:form.address.trim(),product_id:selected.product_id,product_name:selected.product_name,category:selected.category,requested_quantity:Number(form.qty),unit:selected.unit,urgency:form.urgency,max_wait_hours:Number(form.maxWait),farm_context:(selected.category==='medicine'||selected.category==='vaccine')?{flock_age_days:Number(form.age),flock_size:Number(form.flock),mortality_today:Number(form.mortality),symptoms:form.symptoms,vaccination_history:form.vaccines,treatment_history:form.treatments}:undefined});
    onChange(next);setSelected(null);setTab('requests');
  };

  return <div className="space-y-4" dir="rtl">
    <div className="rounded-[28px] border border-emerald-500/20 bg-gradient-to-l from-slate-950 via-emerald-950/25 to-cyan-950/20 p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"><div><div className="text-[11px] font-black text-emerald-300">BROKER MARKETPLACE • {APP_RELEASE_LABEL}</div><h3 className="text-2xl font-black text-white mt-1">شبكة عروض الشركات والتحقق من التوفر</h3><p className="text-xs text-slate-400 mt-2 max-w-3xl">المنصة وسيط وليست مالكة للمخزون. العرض يوضح آخر حالة توفر مؤكدة، ويتم التحقق مجددًا من الفرع الأقرب لحظة الطلب قبل إتمام البيع.</p></div><div className="grid grid-cols-3 gap-2"><Badge label="عروض" value={state.availability_offers.length}/><Badge label="طلبات مفتوحة" value={state.marketplace_requests.filter(r=>!['delivered','cancelled'].includes(r.status)).length}/><Badge label="تأكيدات اليوم" value={state.availability_attestations.filter(a=>a.date===new Date().toISOString().slice(0,10)&&a.status==='responded').length}/></div></div>
    </div>

    <div className="flex gap-2 overflow-x-auto"><button className={btn(tab==='browse')} onClick={()=>setTab('browse')}><ShoppingBag className="w-4 h-4"/> السوق</button><button className={btn(tab==='requests')} onClick={()=>setTab('requests')}><Route className="w-4 h-4"/> طلبات التحقق</button>{isSupplier&&<button className={btn(tab==='supplier')} onClick={()=>setTab('supplier')}><RefreshCw className="w-4 h-4"/> تأكيد الفروع</button>}</div>

    {tab==='browse'&&<>
      <div className="grid md:grid-cols-[1fr_230px] gap-2"><div className="relative"><Search className="w-4 h-4 absolute right-3 top-3 text-slate-500"/><input className="spp-field pr-10" value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن صنف، شركة، مادة فعالة..."/></div><select className="spp-field" value={category} onChange={e=>setCategory(e.target.value)}><option value="all">كل الفئات</option><option value="medicine">أدوية</option><option value="vaccine">لقاحات</option><option value="feed">أعلاف</option><option value="chicks">كتاكيت</option><option value="equipment">معدات</option><option value="disinfectant">مطهرات</option><option value="feed_additive">إضافات</option><option value="lab_service">مختبر</option><option value="transport_service">نقل</option></select></div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{offers.map(o=><div key={o.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><div className="flex items-start justify-between gap-2"><div><b className="text-white">{o.product_name}</b><div className="text-[10px] text-slate-500 mt-1">{o.company_name} • {o.branch_name}</div></div><span className={`text-[10px] px-2 py-1 rounded-full ${statusClass(o.status)}`}>{statusLabel[o.status]}</span></div>{o.scientific_name&&<div className="mt-2 text-[11px] text-cyan-300">{o.scientific_name}</div>}<div className="mt-3 flex flex-wrap gap-1">{o.prices.map(p=><span key={`${o.id}-${p.currency}`} className="rounded-lg bg-slate-900 px-2 py-1 text-[10px] text-slate-300">{new Intl.NumberFormat('ar-YE').format(p.amount)} {currency[p.currency]}</span>)}</div><div className="mt-3 text-[10px] text-slate-500"><MapPin className="w-3 h-3 inline ml-1"/>{o.governorate}/{o.district} • آخر تأكيد: {o.last_confirmed_at?new Date(o.last_confirmed_at).toLocaleString('ar-YE'):'لم يؤكد اليوم'}</div>{o.cold_chain_required&&<div className="mt-2 text-[10px] text-sky-300"><ShieldCheck className="w-3 h-3 inline ml-1"/> يتطلب سلسلة تبريد</div>}<button className="spp-button spp-button-primary w-full mt-3" onClick={()=>setSelected(o)}><PackageSearch className="w-4 h-4"/> طلب تحقق من التوفر</button></div>)}</div>
    </>}

    {tab==='requests'&&<div className="space-y-3">{state.marketplace_requests.length===0?<Empty text="لا توجد طلبات تحقق بعد."/>:state.marketplace_requests.map(r=><RequestCard key={r.id} r={r} state={state} onChange={onChange} currentUserRole={currentUserRole} currentUserName={currentUserName} canVet={canVet} onOpenVet={onOpenVet}/>)}</div>}

    {tab==='supplier'&&isSupplier&&<SupplierAttestation state={state} onChange={onChange} currentUserName={currentUserName}/>} 

    {selected&&<div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto" onClick={()=>setSelected(null)}><div className="max-w-2xl mx-auto mt-6 rounded-3xl border border-slate-700 bg-[#07191d] p-5 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="flex justify-between"><div><div className="text-[10px] text-cyan-300">AVAILABILITY REQUEST</div><h3 className="font-black text-white text-xl">{selected.product_name}</h3><p className="text-xs text-slate-500">{selected.company_name} • سيتم اختيار الفرع الأقرب والتحقق الفعلي.</p></div><button onClick={()=>setSelected(null)} className="spp-icon-button"><XCircle className="w-5 h-5"/></button></div><div className="grid md:grid-cols-2 gap-2 mt-4"><input className="spp-field" placeholder="الاسم" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input className="spp-field" placeholder="الهاتف/واتساب" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input className="spp-field" placeholder="المحافظة" value={form.gov} onChange={e=>setForm({...form,gov:e.target.value})}/><input className="spp-field" placeholder="المديرية" value={form.district} onChange={e=>setForm({...form,district:e.target.value})}/></div><input className="spp-field mt-2" placeholder="العنوان الكامل" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2"><input className="spp-field" type="number" min={1} value={form.qty} onChange={e=>setForm({...form,qty:Number(e.target.value)})}/><select className="spp-field" value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value as any})}><option value="normal">عادي</option><option value="urgent">مستعجل</option><option value="critical">طارئ</option></select><input className="spp-field" type="number" value={form.maxWait} onChange={e=>setForm({...form,maxWait:Number(e.target.value)})} placeholder="أقصى انتظار ساعة"/></div>{(selected.category==='medicine'||selected.category==='vaccine')&&<div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3"><div className="text-xs font-black text-amber-300 flex items-center gap-2"><Stethoscope className="w-4 h-4"/> بيانات الحالة عند العلاج/اللقاح</div><div className="grid grid-cols-3 gap-2 mt-2"><input className="spp-field" type="number" value={form.age} onChange={e=>setForm({...form,age:Number(e.target.value)})} placeholder="العمر"/><input className="spp-field" type="number" value={form.flock} onChange={e=>setForm({...form,flock:Number(e.target.value)})} placeholder="عدد القطيع"/><input className="spp-field" type="number" value={form.mortality} onChange={e=>setForm({...form,mortality:Number(e.target.value)})} placeholder="نافق اليوم"/></div><textarea className="spp-field mt-2" value={form.symptoms} onChange={e=>setForm({...form,symptoms:e.target.value})} placeholder="الأعراض وسبب الطلب"/><div className="grid md:grid-cols-2 gap-2 mt-2"><textarea className="spp-field" value={form.vaccines} onChange={e=>setForm({...form,vaccines:e.target.value})} placeholder="التحصينات السابقة"/><textarea className="spp-field" value={form.treatments} onChange={e=>setForm({...form,treatments:e.target.value})} placeholder="العلاجات السابقة"/></div><p className="text-[10px] text-slate-500 mt-2">الذكاء الاصطناعي ينظم البيانات ويرشح المسار؛ العلاج أو البديل الدوائي النهائي يحتاج اعتماد الطبيب.</p></div>}<button className="spp-button spp-button-primary w-full mt-4" onClick={submit}><Route className="w-4 h-4"/> بدء التحقق من الفرع الأقرب</button></div></div>}
  </div>
};

interface RequestCardProps {
  r: MarketplaceAvailabilityRequestV197;
  state: ManagedOperationsStateV197;
  onChange: (next: ManagedOperationsStateV197) => void;
  currentUserRole: PlatformRoleV195;
  currentUserName: string;
  canVet: boolean;
  onOpenVet?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({r,state,onChange,currentUserRole,currentUserName,canVet,onOpenVet})=>{
  const offer=state.availability_offers.find(o=>o.id===r.selected_offer_id); const alternatives=findAlternativeOffersV197(state,r.product_id,r.governorate); const canSupplier=['supplier','warehouse','system_owner','ceo'].includes(currentUserRole);
  const vetApprove=()=>onChange({...state,marketplace_requests:state.marketplace_requests.map(x=>x.id===r.id?{...x,vet_approved:true,vet_approved_by:currentUserName}:x)});
  const confirmCustomer=()=>{try{onChange(customerConfirmMarketplaceRequestV197(state,r.id))}catch(e:any){alert(e.message)}};
  const pay=()=>{try{onChange(recordMarketplacePaymentV197(state,r.id,true))}catch(e:any){alert(e.message)}};
  const dispatch=()=>{try{onChange(dispatchMarketplaceOrderV197(state,r.id))}catch(e:any){alert(e.message)}};
  const pod=()=>{try{onChange(completeMarketplaceDeliveryV197(state,r.id,`POD-${Date.now().toString().slice(-8)}`))}catch(e:any){alert(e.message)}};
  const escalate=()=>onChange(escalateMarketplaceToOnCallVetV197(state,r.id));
  return <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"><div><div className="text-[10px] font-mono text-cyan-300">{r.request_number}</div><b className="text-white">{r.product_name} — {r.requested_quantity} {r.unit}</b><div className="text-[10px] text-slate-500 mt-1"><UserRound className="w-3 h-3 inline ml-1"/>{r.customer_name} • {r.phone} • {r.governorate}/{r.district}</div></div><div className="flex gap-2 flex-wrap"><span className={`text-[10px] px-2 py-1 rounded-full ${r.urgency==='critical'?'bg-rose-500/15 text-rose-300':'bg-slate-800 text-slate-300'}`}>{r.urgency}</span><span className="text-[10px] px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300">{r.status}</span></div></div>
    <div className="mt-3 grid md:grid-cols-2 gap-3"><div className="rounded-xl bg-slate-900 p-3 text-xs"><b className="text-slate-300">التوجيه الحالي</b><div className="mt-2 text-slate-400">{r.selected_branch_name||'لم يتم اختيار فرع'}</div>{r.route_attempts.map((a,i)=><div key={i} className="mt-1 text-[10px] text-slate-500">{i+1}. {a.branch_name} — {a.status} {a.eta_hours?`• ETA ${a.eta_hours}h`:''}</div>)}</div><div className="rounded-xl bg-slate-900 p-3 text-xs"><b className="text-slate-300">التكلفة/الوصول</b><div className="mt-2 text-slate-400">{r.confirmed_price!==undefined?`${r.confirmed_price} ${r.confirmed_currency} × ${r.requested_quantity}`:'بانتظار تأكيد الفرع'}</div><div className="text-[10px] text-slate-500 mt-1">{r.estimated_arrival_at?`الوصول المتوقع ${new Date(r.estimated_arrival_at).toLocaleString('ar-YE')}`:'—'}</div></div></div>
    {canSupplier&&r.status==='checking'&&<div className="mt-3 flex flex-wrap gap-2"><button className="spp-button spp-button-primary" onClick={()=>onChange(supplierRespondMarketplaceV197(state,r.id,{confirmed:true,availability:'available',quantity_band:'sufficient',price:offer?.prices[0]?.amount||0,currency:offer?.prices[0]?.currency||'SAR',eta_hours:2,transport_cost:0,platform_commission:0,note:'تم التأكيد من الفرع'}))}><CheckCircle2 className="w-4 h-4"/> متوفر بالكمية</button><button className="spp-button spp-button-secondary" onClick={()=>onChange(supplierRespondMarketplaceV197(state,r.id,{confirmed:false,availability:'unavailable',note:'غير متوفر بالكمية المطلوبة'}))}><XCircle className="w-4 h-4"/> غير متوفر</button></div>}
    {r.status==='supplier_confirmed'&&r.vet_gate_required&&!r.vet_approved&&<div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"><div className="text-xs text-amber-300"><ShieldCheck className="w-4 h-4 inline ml-1"/> يحتاج بوابة الطبيب قبل تأكيد الاستخدام الطبي.</div>{canVet?<button className="spp-button spp-button-primary mt-2" onClick={vetApprove}>اعتماد الطبيب</button>:<button className="spp-button spp-button-secondary mt-2" onClick={onOpenVet}>إرسال للطبيب</button>}</div>}
    {r.status==='supplier_confirmed'&&(!r.vet_gate_required||r.vet_approved)&&<div className="mt-3 flex flex-wrap gap-2"><button className="spp-button spp-button-primary" onClick={confirmCustomer}>تأكيد العميل والسعر</button></div>}
    {r.status==='customer_confirmed'&&<div className="mt-3 flex flex-wrap gap-2"><button className="spp-button spp-button-primary" onClick={pay}>تسجيل الدفع</button><button className="spp-button spp-button-secondary" onClick={dispatch}>نقد/تحصيل عند التسليم — بدء الشحن</button></div>}
    {r.status==='paid'&&<div className="mt-3"><button className="spp-button spp-button-primary" onClick={dispatch}><Truck className="w-4 h-4"/> تجهيز وشحن</button></div>}
    {r.status==='out_for_delivery'&&<div className="mt-3"><button className="spp-button spp-button-primary" onClick={pod}><CheckCircle2 className="w-4 h-4"/> تأكيد الاستلام POD</button></div>}
    {r.status==='delivered'&&<div className="mt-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-emerald-300">اكتمل الطلب والتسليم. {r.notes||''}</div>}
    {(r.status==='needs_alternative'||r.status==='escalated_to_vet')&&<div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"><b className="text-xs text-amber-300">البدائل والمسار الطارئ</b>{alternatives.length?<div className="mt-2 grid md:grid-cols-2 gap-2">{alternatives.slice(0,6).map(a=><div key={a.id} className="rounded-lg bg-slate-900 p-2 text-[10px]"><b className="text-white">{a.product_name}</b><div className="text-slate-500">{a.company_name} • {a.branch_name}</div><div className="text-cyan-300">{a.scientific_name||'بديل حسب الفئة'}</div></div>)}</div>:<div className="text-[11px] text-slate-500 mt-2">لا يوجد بديل مطابق متاح حاليًا.</div>}{r.status==='escalated_to_vet'&&<div className="mt-2 text-xs text-rose-300"><AlertTriangle className="w-4 h-4 inline ml-1"/> الحالة طارئة؛ يجب تحويل الملف الكامل للطبيب المناوب بدل التجربة العشوائية.<button className="spp-button spp-button-danger mt-2" onClick={escalate}>إنشاء ملف طوارئ للطبيب المناوب</button></div>}</div>}
  </div>
};

interface SupplierAttestationProps {
  state: ManagedOperationsStateV197;
  onChange: (next: ManagedOperationsStateV197) => void;
  currentUserName: string;
}

const SupplierAttestation: React.FC<SupplierAttestationProps> = ({state,onChange,currentUserName})=>{
  const today=new Date().toISOString().slice(0,10); const rows=state.availability_attestations.filter(a=>a.date===today); const generate=()=>onChange(buildDailyAvailabilityAttestationsV197(markStaleOffersV197(state)));
  return <div className="space-y-3"><div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><div><b className="text-white">تأكيد التوفر اليومي للفروع</b><div className="text-[10px] text-slate-500">لا نعتبر الكميات ملكًا للمنصة؛ الفرع يؤكد هل العرض متوفر/محدود/غير متوفر.</div></div><button className="spp-button spp-button-primary" onClick={generate}><RefreshCw className="w-4 h-4"/> إنشاء/تحديث التأكيدات</button></div>{rows.length===0?<Empty text="أنشئ تأكيدات اليوم."/>:rows.map(a=><AttestationCard key={a.id} a={a} state={state} onChange={onChange} actor={currentUserName}/>)}</div>
};
interface AttestationCardProps {
  a: AvailabilityAttestationV197;
  state: ManagedOperationsStateV197;
  onChange: (next: ManagedOperationsStateV197) => void;
  actor: string;
}

const AttestationCard: React.FC<AttestationCardProps> = ({a,state,onChange,actor})=>{
  const [items,setItems]=useState<AvailabilityAttestationV197['items']>(a.items);
  const patch=(id:string,status:AvailabilityStateV197)=>setItems(current=>current.map(item=>item.offer_id===id?{...item,status}:item));
  return <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><div className="flex justify-between"><div><b className="text-white">{a.branch_name}</b><div className="text-[10px] text-slate-500">{a.attestation_number} • مهلة {new Date(a.due_at).toLocaleString('ar-YE')}</div></div><span className={`text-[10px] px-2 py-1 rounded-full ${a.status==='responded'?'bg-emerald-500/15 text-emerald-300':'bg-amber-500/15 text-amber-300'}`}>{a.status}</span></div><div className="mt-3 space-y-2">{items.map(i=><div key={i.offer_id} className="grid md:grid-cols-[1fr_200px] gap-2 items-center rounded-xl bg-slate-900 p-2"><span className="text-xs text-slate-300">{i.product_name}</span><select className="spp-field" value={i.status} onChange={e=>patch(i.offer_id,e.target.value as AvailabilityStateV197)}><option value="available">متوفر</option><option value="limited">محدود</option><option value="unconfirmed">غير مؤكد</option><option value="unavailable">غير متوفر</option><option value="paused">موقوف</option></select></div>)}</div>{a.status!=='responded'&&<button className="spp-button spp-button-primary mt-3" onClick={()=>onChange(submitAvailabilityAttestationV197(state,a.id,items,actor))}>اعتماد حالة التوفر</button>}</div>
};

const btn=(active:boolean)=>`shrink-0 rounded-xl px-3 py-2 text-xs font-black border flex items-center gap-2 ${active?'bg-emerald-400 text-slate-950 border-emerald-300':'bg-slate-950 text-slate-300 border-slate-800'}`;
const Badge=({label,value}:{label:string;value:React.ReactNode})=><div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-center"><div className="text-[9px] text-slate-500">{label}</div><b className="text-lg text-emerald-300">{value}</b></div>;
const Empty=({text}:{text:string})=><div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center text-sm text-slate-500">{text}</div>;
