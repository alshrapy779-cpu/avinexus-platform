import React, { useMemo, useState } from 'react';
import { Building2, CheckCircle2, Clock3, MapPin, MessageCircle, Scale, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Farm, Flock, SmartOperationsState, FlockSalePipelineV17, FarmLeaseListingV17 } from '../../types';
import { buildBrokerQueueV17, recalcLeaseListingV17, resolvePublishedBourseRateV17 } from '../../services/transactionalRoutingV17';

interface Props {
  farm: Farm;
  flock: Flock;
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

const money=(v:number)=>new Intl.NumberFormat('ar-YE').format(Math.round(v||0));

export const CustomerTradingV17:React.FC<Props>=({farm,flock,operations,onUpdateOperations})=>{
  const e=operations.enterprise;
  const [birds,setBirds]=useState(flock.current_count);
  const [avgWeight,setAvgWeight]=useState(flock.target_market_weight_kg || 1.8);
  const [district,setDistrict]=useState('غير محدد');
  const [address,setAddress]=useState(farm.location_name);
  const [message,setMessage]=useState('');
  const [leaseMode,setLeaseMode]=useState(false);
  const [lengthM,setLengthM]=useState(80); const [widthM,setWidthM]=useState(12); const [heightM,setHeightM]=useState(3.2); const [rent,setRent]=useState(1200000);
  const [ventilation,setVentilation]=useState<'open'|'closed'|'tunnel'>('tunnel');
  const [leaseImages,setLeaseImages]=useState<string[]>([]);

  const rate=useMemo(()=>resolvePublishedBourseRateV17(e.poultry_marketing_rates_v12,farm.governorate,district,avgWeight),[e.poultry_marketing_rates_v12,farm.governorate,district,avgWeight]);
  const mine=e.flock_sales_pipeline_v17.filter(x=>x.phone===farm.phone || x.customer_name===farm.owner_name);
  const mySupplierOrders=e.supplier_routing_orders_v17.filter(x=>x.phone===farm.phone || x.customer_name===farm.owner_name);

  const createSale=()=>{
    if(!rate){setMessage('لا يوجد سعر بورصة منشور لهذه المنطقة حالياً. تمهيداً للطلب، تواصل مع المبيعات لتحديث السعر أولاً.');return;}
    const queue=buildBrokerQueueV17(e.poultry_marketer_contracts_v12,farm.governorate,e.v17_config.flock_sale_broker_timeout_minutes);
    const p:FlockSalePipelineV17={
      id:`flocksale-v17-${Date.now()}`,request_number:`FSALE-${Date.now().toString().slice(-8)}`,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),customer_name:farm.owner_name,phone:farm.phone,farm_name:farm.name,flock_code:flock.flock_code,governorate:farm.governorate,district,address,lat:farm.location_gps.lat,lng:farm.location_gps.lng,birds_count:birds,average_weight_kg:avgWeight,estimated_live_weight_kg:Math.round(birds*avgWeight),weight_category:rate.weight_category,bourse_price_per_kg_yer:rate.buy_price_per_kg_yer,bourse_reference:`${rate.date} • ${rate.marketer_name}`,customer_price_accepted:true,sales_manager_name:'مسؤول المبيعات المختص',marketing_fee_mode:'fixed_per_kg',marketing_fee_value:rate.fee_yer_per_kg || 0,platform_commission_percent:e.v17_config.default_platform_sale_commission_percent,broker_timeout_minutes:e.v17_config.flock_sale_broker_timeout_minutes,broker_queue:queue,current_broker_index:0,negotiation_attempts:0,customer_final_accepted:false,loading_evidence_urls:[],status:'sales_manager_review',notes:'وافق العميل على سعر البورصة المبدئي؛ السعر النهائي وشروط المكتب تُعرض للموافقة قبل التأكيد.'
    };
    onUpdateOperations({...operations,enterprise:{...e,flock_sales_pipeline_v17:[p,...e.flock_sales_pipeline_v17]}});setMessage('تم إرسال طلب بيع القطيع لمسؤول المبيعات. لن يتم تأكيد البيع إلا بعد عرض شروط مكتب التسويق عليك وموافقتك النهائية.');
  };

  const finalDecision=(id:string,accept:boolean)=>{
    onUpdateOperations({...operations,enterprise:{...e,flock_sales_pipeline_v17:e.flock_sales_pipeline_v17.map(p=>p.id===id?{...p,customer_final_accepted:accept,status:accept?'confirmed':(p.negotiation_attempts<e.v17_config.max_ai_negotiation_attempts?'customer_negotiation':'human_sales_intervention'),negotiation_attempts:accept?p.negotiation_attempts:p.negotiation_attempts+1,updated_at:new Date().toISOString()}:p)}});
    setMessage(accept?'تمت موافقتك النهائية؛ سيظهر لك موعد التحميل ومسؤول المبيعات.':'تم تسجيل رفضك. سيشرح المساعد الشروط دون ضغط، وإذا بقي الرفض سيحوّلك لمسؤول المبيعات مباشرة.');
  };

  const toDataUrl=(files:FileList|null)=>{if(!files)return;Array.from(files).slice(0,6).forEach(f=>{const r=new FileReader();r.onload=()=>setLeaseImages(prev=>[...prev,String(r.result)]);r.readAsDataURL(f);});};
  const createLease=()=>{
    let l:FarmLeaseListingV17={id:`lease-list-${Date.now()}`,listing_number:`LEASE-${Date.now().toString().slice(-8)}`,created_at:new Date().toISOString(),owner_name:farm.owner_name,owner_phone:farm.phone,governorate:farm.governorate,district,address,lat:farm.location_gps.lat,lng:farm.location_gps.lng,hangars_count:1,length_m:lengthM,width_m:widthM,height_m:heightM,ventilation_type:ventilation,target_density_birds_m2:12,estimated_capacity_birds:0,equipment_items:[],equipment_gaps:[],image_urls:leaseImages,video_urls:[],media_quality_status:leaseImages.length>=3?'needs_review':'missing',rent_mode:'per_cycle',asking_price_yer:rent,advance_payment_percent:30,platform_commission_percent:e.v17_config.default_lease_commission_percent,platform_commission_yer:0,admin_review_status:'pending_review',published:false,contact_released:false,ai_assessment_note:'السعة تقديرية فقط حتى تراجع الإدارة الصور والمعدات والكثافة المعتمدة.'};
    l=recalcLeaseListingV17(l,e.v17_config.default_lease_commission_percent);
    onUpdateOperations({...operations,enterprise:{...e,farm_lease_listings_v17:[l,...e.farm_lease_listings_v17]}});setMessage('تم إرسال العنبر للإدارة للمراجعة. رقم التواصل يبقى محجوباً عن المستأجرين حتى اعتماد العرض والعقد.');
  };

  return <div className="space-y-4 mt-5">
    <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-4"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-white">التسويق والتعاقد V17</h3><p className="text-[11px] text-slate-400 mt-1">بيع القطيع بسعر البورصة، متابعة مكتب التسويق والتسوية، أو عرض عنبر للإيجار بضمان المنصة.</p></div><Scale className="w-6 h-6 text-amber-400"/></div><div className="grid grid-cols-2 gap-2 mt-3"><button onClick={()=>setLeaseMode(false)} className={`p-2 rounded-xl text-xs font-bold ${!leaseMode?'bg-amber-500 text-slate-950':'bg-slate-800 text-slate-300'}`}>بيع القطيع</button><button onClick={()=>setLeaseMode(true)} className={`p-2 rounded-xl text-xs font-bold ${leaseMode?'bg-emerald-500 text-slate-950':'bg-slate-800 text-slate-300'}`}>عرض عنبر للإيجار</button></div></div>

    {message&&<div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs">{message}</div>}

    {!leaseMode ? <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"><div className="grid grid-cols-2 gap-2"><Field label="عدد الطيور" value={birds} set={v=>setBirds(Number(v))}/><Field label="متوسط الوزن كجم" value={avgWeight} set={v=>setAvgWeight(Number(v))} step="0.05"/><TextField label="المديرية" value={district} set={setDistrict}/><TextField label="العنوان" value={address} set={setAddress}/></div><div className="bg-slate-950 rounded-xl p-3 text-xs"><div className="flex justify-between"><span className="text-slate-400">سعر البورصة المنشور</span><b className="text-amber-300">{rate?`${money(rate.buy_price_per_kg_yer)} ر.ي/كجم`:'غير متاح'}</b></div>{rate&&<div className="text-[10px] text-slate-500 mt-1">{rate.date} • {rate.weight_category} • سداد {rate.settlement_days} يوم • {rate.mortality_terms}</div>}</div><button onClick={createSale} className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4"/>أوافق على سعر البورصة المبدئي وأرسل للمبيعات</button></div>
      <div className="space-y-2">{mine.map(p=>{const offer=p.broker_queue.find(x=>x.status==='accepted');return <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs"><div className="flex justify-between"><b className="text-white">{p.request_number}</b><span className="text-emerald-300">{p.status}</span></div><div className="text-slate-400 mt-1">{p.birds_count.toLocaleString()} طائر • {p.average_weight_kg} كجم • بورصة {money(p.bourse_price_per_kg_yer)} ر.ي/كجم</div>{offer&&<div className="bg-slate-950 p-2 rounded-lg mt-2"><b className="text-amber-300">عرض المكتب: {money(offer.final_price_per_kg_yer||0)} ر.ي/كجم</b><div className="text-slate-400 mt-1">السداد {offer.settlement_days} يوم • {offer.mortality_terms}</div><div className="flex gap-2 mt-2"><button onClick={()=>finalDecision(p.id,true)} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold">أوافق</button><button onClick={()=>finalDecision(p.id,false)} className="px-3 py-1.5 rounded-lg bg-slate-700 text-white">لا أوافق</button></div></div>}</div>})}</div>
    </> : <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"><div className="grid grid-cols-2 gap-2"><Field label="الطول م" value={lengthM} set={v=>setLengthM(Number(v))}/><Field label="العرض م" value={widthM} set={v=>setWidthM(Number(v))}/><Field label="الارتفاع م" value={heightM} set={v=>setHeightM(Number(v))}/><Field label="الإيجار للدورة ر.ي" value={rent} set={v=>setRent(Number(v))}/><TextField label="المديرية" value={district} set={setDistrict}/><div><label className="text-[10px] text-slate-400">التهوية</label><select value={ventilation} onChange={x=>setVentilation(x.target.value as any)} className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs"><option value="open">مفتوح</option><option value="closed">مغلق</option><option value="tunnel">نفق</option></select></div></div><label className="block text-[10px] text-slate-400">صور إلزامية للعنبر والمعدات</label><input type="file" accept="image/*" multiple onChange={x=>toDataUrl(x.target.files)} className="w-full text-xs"/><div className="grid grid-cols-3 gap-2">{leaseImages.slice(0,6).map((x,i)=><img key={i} src={x} className="h-20 w-full object-cover rounded-lg border border-slate-700"/>)}</div><div className="text-xs text-slate-400 bg-slate-950 p-2 rounded-lg">عمولة المنصة الافتراضية: {e.v17_config.default_lease_commission_percent}% • التواصل المباشر لا يُكشف قبل مسار العقد.</div><button onClick={createLease} className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2"><Building2 className="w-4 h-4"/>إرسال العرض لمراجعة الإدارة</button></div>}

    {mySupplierOrders.length>0&&<div className="bg-slate-900 border border-slate-800 rounded-2xl p-3"><div className="text-xs font-black text-white mb-2">طلبات المدخلات الموجهة للموردين</div>{mySupplierOrders.slice(0,3).map(o=><div key={o.id} className="text-[11px] border-t border-slate-800 py-2 flex justify-between"><span>{o.product_name} • {o.quantity} {o.unit_label}</span><span className="text-cyan-300">{o.status}</span></div>)}</div>}

    <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-3 text-[11px] text-slate-300 flex gap-2"><ShieldCheck className="w-4 h-4 text-rose-300 shrink-0"/><span><b className="text-rose-200">ضابط طبي:</b> المساعد لا يصف مضاداً حيوياً أو لقاحاً. الفيتامينات/الإلكتروليتات لا تُعرض إلا من بروتوكول اعتمده الطبيب، وأي مرض أو نافق يُحوّل للطبيب.</span></div>
  </div>;
};

const Field=({label,value,set,step}:{label:string,value:number,set:(v:string)=>void,step?:string})=><div><label className="text-[10px] text-slate-400">{label}</label><input type="number" step={step||'1'} value={value} onChange={e=>set(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs"/></div>;
const TextField=({label,value,set}:{label:string,value:string,set:(v:string)=>void})=><div><label className="text-[10px] text-slate-400">{label}</label><input value={value} onChange={e=>set(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs"/></div>;
