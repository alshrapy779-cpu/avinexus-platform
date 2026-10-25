import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, CalendarClock, CheckCircle2, FlaskConical, LineChart, PackagePlus, PhoneCall, ShieldCheck, TrendingUp, Wheat } from 'lucide-react';
import { Farm, Flock, SmartOperationsState } from '../../types';
import { calculateChickPackageV18, calculateFarmRecommendationV18, evaluateChickReadinessV18, findAdminStandardV18 } from '../../services/enterpriseIntelligenceV18';

interface Props { farm:Farm; flock:Flock; operations:SmartOperationsState; onUpdateOperations:(o:SmartOperationsState)=>void; }
const money=(v:number)=>new Intl.NumberFormat('ar-YE').format(Math.round(v||0));

export const CustomerIntelligenceV18:React.FC<Props>=({farm,flock,operations,onUpdateOperations})=>{
  const e=operations.enterprise; const [qty,setQty]=useState(10000); const [downtime,setDowntime]=useState(10); const [clean,setClean]=useState(true); const [closed,setClosed]=useState(true); const [currency,setCurrency]=useState<'YER'|'SAR'>('YER'); const [litterUnits,setLitterUnits]=useState(20); const [heaters,setHeaters]=useState(4); const [fans,setFans]=useState(8); const [feeders,setFeeders]=useState(80); const [drinkers,setDrinkers]=useState(100);
  const rule=useMemo(()=>findAdminStandardV18(e.breed_regional_standards_v18,flock.breed_type,farm.governorate,flock.current_age_days),[e.breed_regional_standards_v18,flock.breed_type,farm.governorate,flock.current_age_days]);
  const rec=calculateFarmRecommendationV18(rule,flock.current_count);
  const rate=operations.exchange_rates.sar_to_yer_old||1; const fmt=(v:number)=>currency==='SAR'?`${(v/rate).toFixed(2)} ر.س`:`${money(v)} ر.ي`;
  const lab=e.sample_tracking_v18.find(x=>x.farm_name===farm.name||x.customer_name===farm.owner_name);
  const alert=e.geo_outbreak_alerts_v18.find(x=>x.governorate===farm.governorate&&x.status==='published');
  const forecast=e.market_forecasts_v18.find(x=>x.governorate===farm.governorate&&x.approved_for_display);
  const score=e.credit_quality_scores_v18.find(x=>x.entity_type==='farm'&&(x.entity_id===farm.id||x.entity_name===farm.name));
  const feed=e.feed_replenishment_v18.find(x=>x.farm_id===farm.id||x.flock_id===flock.id);
  const costCfg=e.cost_calculator_configs_v18.find(x=>x.governorate===farm.governorate)||e.cost_calculator_configs_v18[0];
  const equipmentCost=costCfg?(litterUnits*costCfg.litter_price_per_unit_yer+heaters*costCfg.heater_unit_price_yer+fans*costCfg.fan_unit_price_yer+feeders*costCfg.feeder_unit_price_yer+drinkers*costCfg.drinker_unit_price_yer):0;
  const chickPrice=e.hatchery_prices_v18.find(x=>x.governorate===farm.governorate&&x.strain===flock.breed_type&&x.published)||e.hatchery_prices_v18.find(x=>x.governorate===farm.governorate&&x.published);
  const readiness=evaluateChickReadinessV18({farm_cleaned:clean,biosecurity_closed:closed,downtime_days:downtime,minimum_downtime_days:10});
  const base=(chickPrice?.price_per_chick_yer||0)*qty; const pkg=calculateChickPackageV18(base,180000,e.v18_config.chick_default_lab_reserve_percent,e.v18_config.chick_default_feed_reserve_percent,e.v18_config.chick_default_emergency_reserve_percent);

  const reserve=()=>{
    if(!chickPrice)return;
    const id=`cres18-${Date.now()}`;
    onUpdateOperations({...operations,enterprise:{...e,chick_reservations_v18:[{
      id,reservation_number:`CHICK-RES-${String(Date.now()).slice(-7)}`,created_at:new Date().toISOString(),customer_name:farm.owner_name,phone:farm.phone,farm_id:farm.id,farm_name:farm.name,governorate:farm.governorate,district:farm.location_name,address:farm.location_name,lat:farm.location_gps.lat,lng:farm.location_gps.lng,hatchery_name:chickPrice.hatchery_name,strain:chickPrice.strain,quantity:qty,requested_delivery_date:new Date(Date.now()+3*86400000).toISOString().slice(0,10),farm_cleaned:clean,biosecurity_closed:closed,downtime_days:downtime,minimum_downtime_days:10,readiness_score:readiness.score,readiness_status:readiness.status,chick_cost_yer:base,transport_yer:180000,...pkg,customer_accepted:true,finance_status:'unpaid',sales_status:readiness.status==='ready'?'sales_review':'draft',notes:'تم جمع بيانات الجاهزية. لا إطلاق للكتاكيت قبل مراجعة المبيعات والمالية.'
    },...e.chick_reservations_v18]}});
  };

  return <div className="space-y-3" dir="rtl">
    <div className="rounded-2xl border border-emerald-700/50 bg-gradient-to-l from-emerald-950/60 to-slate-950 p-4">
      <div className="flex items-center justify-between gap-3"><div><div className="text-[10px] font-bold text-emerald-300">V18 • العميل</div><h3 className="text-sm font-black text-white">مركز المتابعة الذكية والحجوزات</h3><p className="text-[10px] text-slate-400 mt-1">المساعد يستخدم معايير الإدارة المعتمدة فقط. لا يصدر وصفة مضاد أو لقاح من نفسه.</p></div><select value={currency} onChange={x=>setCurrency(x.target.value as any)} className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-white p-2"><option value="YER">ريال يمني</option><option value="SAR">ريال سعودي</option></select></div>
    </div>

    {alert&&<div className="rounded-2xl border border-rose-700/50 bg-rose-950/30 p-3 text-xs"><div className="flex gap-2 text-rose-300 font-black"><AlertTriangle className="w-4 h-4"/>تنبيه أمان حيوي في نطاق المنطقة</div><div className="text-slate-200 mt-1">{alert.biosecurity_message}</div><div className="text-[10px] text-slate-500 mt-1">النطاق {alert.radius_km} كم • {alert.lab_confirmed?'مؤكد مخبرياً':'اشتباه وقائي غير مؤكد'}</div></div>}

    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs"><div className="text-cyan-300 font-bold flex gap-1"><Wheat className="w-3.5 h-3.5"/>المعيار اليومي</div>{rec?<div className="mt-2 text-slate-300 space-y-1"><div>علف: <b className="text-white">{rec.feed_kg} كجم</b></div><div>ماء: <b className="text-white">{rec.water_liters} لتر</b></div><div>وزن هدف: {rec.target_weight_g} جم</div><div>حرارة: {rec.temperature_c}°C</div><div>نوع العلف: {rec.feed_form}</div><div>برنامج التحصين: {rec.vaccination_program_id||'يحدده الطبيب/الإدارة'}</div></div>:<div className="text-amber-300 mt-2">لا يوجد معيار إداري مطابق لهذه السلالة/المنطقة/العمر.</div>}</div>
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs"><div className="text-amber-300 font-bold flex gap-1"><TrendingUp className="w-3.5 h-3.5"/>التقييم والسوق</div><div className="mt-2 text-slate-300">درجة الجودة: <b className="text-white">{score?`${score.grade} / ${score.composite_score}`:'غير متاح'}</b></div>{forecast&&<><div className="text-slate-300 mt-1">اتجاه 30 يوم: <b className="text-white">{forecast.trend}</b></div><div className="text-[10px] text-slate-500">التوقع إرشادي وليس ضمان سعر.</div></>}</div>
    </div>

    {lab&&<div className="rounded-xl bg-slate-900 border border-cyan-800/50 p-3 text-xs"><div className="text-cyan-300 font-black flex gap-1"><FlaskConical className="w-4 h-4"/>تتبع العينة {lab.tracking_number}</div><div className="text-slate-300 mt-1">الحالة: {lab.status}</div><div className="text-slate-400">الطبيب المسند: {lab.assigned_vet_name} • {lab.assigned_vet_phone}</div><div className="text-slate-400">المختبر: {lab.laboratory_name}</div>{lab.final_decision&&<div className="mt-2 text-emerald-300">القرار المعتمد: {lab.final_decision}</div>}</div>}

    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 text-xs">
      <div className="flex items-center gap-2 font-black text-white mb-3"><Calculator className="w-4 h-4 text-cyan-400"/>حاسبة تجهيز المزرعة متعددة العملات</div>
      {costCfg?<><div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <label className="text-slate-400">الفرشة<input type="number" value={litterUnits} onChange={x=>setLitterUnits(Number(x.target.value))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"/></label>
        <label className="text-slate-400">دفايات<input type="number" value={heaters} onChange={x=>setHeaters(Number(x.target.value))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"/></label>
        <label className="text-slate-400">شفاطات<input type="number" value={fans} onChange={x=>setFans(Number(x.target.value))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"/></label>
        <label className="text-slate-400">معالف<input type="number" value={feeders} onChange={x=>setFeeders(Number(x.target.value))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"/></label>
        <label className="text-slate-400">سقايات<input type="number" value={drinkers} onChange={x=>setDrinkers(Number(x.target.value))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"/></label>
      </div><div className="mt-3 rounded-xl bg-slate-900 p-3 border border-slate-800 flex justify-between"><span className="text-slate-300">تكلفة التجهيز وفق أسعار الإدارة لمنطقة {costCfg.governorate}</span><b className="text-cyan-300">{fmt(equipmentCost)}</b></div><div className="text-[10px] text-slate-500 mt-1">الكميات يحددها العميل/المشرف. المساعد لا يفترض عدد المعدات دون بيانات العنبر.</div></>:<div className="text-amber-300">لا يوجد جدول تكلفة إداري لهذه المنطقة.</div>}
    </div>

    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 text-xs">
      <div className="flex items-center gap-2 font-black text-white mb-3"><PackagePlus className="w-4 h-4 text-amber-400"/>حجز كتاكيت وجاهزية المزرعة</div>
      {chickPrice?<><div className="text-slate-300 mb-2">{chickPrice.hatchery_name} • {chickPrice.strain} • السعر {fmt(chickPrice.price_per_chick_yer)} / كتكوت</div><div className="grid grid-cols-2 gap-2"><label className="text-slate-400">الكمية<input type="number" value={qty} onChange={x=>setQty(Number(x.target.value))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"/></label><label className="text-slate-400">أيام الفراغ<input type="number" value={downtime} onChange={x=>setDowntime(Number(x.target.value))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"/></label></div><div className="flex gap-3 mt-2"><label className="text-slate-300"><input type="checkbox" checked={clean} onChange={x=>setClean(x.target.checked)} className="ml-1"/>تم التطهير</label><label className="text-slate-300"><input type="checkbox" checked={closed} onChange={x=>setClosed(x.target.checked)} className="ml-1"/>إغلاق حيوي</label></div><div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800"><div className="flex justify-between"><span>جاهزية</span><b className={readiness.status==='ready'?'text-emerald-300':'text-amber-300'}>{readiness.score}% • {readiness.status}</b></div><div className="mt-2 text-slate-300">كتاكيت {fmt(base)} + نقل {fmt(180000)} + احتياط فحوص/علف/طوارئ = <b className="text-white">{fmt(pkg.total_package_yer)}</b></div></div><button onClick={reserve} className="w-full mt-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-black">إرسال طلب الحجز للمبيعات</button></>:<div className="text-amber-300">لا يوجد سعر كتاكيت منشور في منطقتك حالياً؛ يحول الطلب للمبيعات للتسعير.</div>}
    </div>

    {feed&&<div className="rounded-xl bg-orange-950/20 border border-orange-800/50 p-3 text-xs"><div className="font-black text-orange-300 flex gap-1"><Wheat className="w-4 h-4"/>تنبيه مخزون العلف</div><div className="text-slate-300 mt-1">المخزون الحالي يكفي نحو {feed.days_remaining} يوم. الطلب المقترح {money(feed.recommended_order_kg)} كجم.</div></div>}

    <div className="rounded-xl bg-teal-950/20 border border-teal-800/50 p-3 text-xs"><div className="font-black text-teal-300 flex gap-1"><PhoneCall className="w-4 h-4"/>الاستشارة البيطرية عن بعد</div><div className="text-slate-300 mt-1">يمكن طلب جلسة فيديو/صوت مع الطبيب المسند عند الحالات الطارئة. أي وصفة أو قرار علاجي يصدر من الطبيب فقط.</div></div>
  </div>;
};
