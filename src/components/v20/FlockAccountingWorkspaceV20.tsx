import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Bird, CalendarCheck2, ClipboardCheck, FileBarChart, History, Scale, Wheat, Waves, WalletCards } from 'lucide-react';
import type { PlatformRoleV195 } from '../../modules/platform/PlatformCoreV19_5';
import type { ManagedOperationsStateV197 } from '../../modules/managed/ManagedPoultryOperationsV19_7';
import {
  V20State,
  addReconciliationAdjustmentV20,
  approveReconciliationAdjustmentV20,
  buildFlockMasterRecordV20,
  buildPopulationLedgerV20,
  closeFlockDayV20,
  createReportSnapshotV20,
  dataCompletenessV20,
  endOfCycleReportV20,
  executiveFarmRowsV20,
  feedMetricsV20,
  ownerDailyDashboardV20,
  validateV20State,
  waterEnvironmentMetricsV20,
  weeklyPerformanceV20,
  weightMetricsV20,
} from '../../modules/v20/EnterprisePoultryCoreV20';

interface Props {
  v20:V20State;
  managed:ManagedOperationsStateV197;
  onChange:(next:V20State)=>void;
  currentUserName:string;
  currentUserRole:PlatformRoleV195;
}

type Tab='summary'|'ledger'|'close'|'reports'|'executive'|'audit';
const fmt=(n:number|undefined|null,d=2)=>new Intl.NumberFormat('ar-YE',{maximumFractionDigits:d}).format(n||0);
const pct=(n:number|undefined|null)=>`${fmt(n,2)}%`;
const statusArabic=(s:string)=>({incomplete:'غير مكتمل',awaiting_worker_confirmation:'بانتظار تأكيد العامل',awaiting_vet_review:'بانتظار الطبيب',closed:'مغلق',reopened:'أعيد فتحه',not_started:'لم يبدأ'} as Record<string,string>)[s]||s;

export const FlockAccountingWorkspaceV20:React.FC<Props>=({v20,managed,onChange,currentUserName,currentUserRole})=>{
  const [flockId,setFlockId]=useState(managed.flock_cycles.find(f=>['active','marketing','selling','ready_for_placement'].includes(f.status))?.id||managed.flock_cycles[0]?.id||'');
  const [tab,setTab]=useState<Tab>('summary');
  const [adjustment,setAdjustment]=useState({quantity:0,reason:''});
  const flock=managed.flock_cycles.find(f=>f.id===flockId);
  const farm=managed.farms.find(f=>f.id===flock?.farm_id);
  const master=useMemo(()=>flock?buildFlockMasterRecordV20(v20,managed,flock.id):undefined,[v20,managed,flock?.id]);
  const latestReport=useMemo(()=>flock?managed.daily_reports.filter(r=>r.flock_id===flock.id).sort((a,b)=>b.submitted_at.localeCompare(a.submitted_at))[0]:undefined,[managed,flock?.id]);
  const owner=useMemo(()=>flock?ownerDailyDashboardV20(v20,managed,flock.id):undefined,[v20,managed,flock?.id]);
  const ledger=useMemo(()=>flock?buildPopulationLedgerV20(v20,managed,flock.id):[],[v20,managed,flock?.id]);
  const issues=useMemo(()=>validateV20State(v20,managed),[v20,managed]);
  const canApprove=['system_owner','ceo','sector_manager','vet_consultant'].includes(currentUserRole);
  const canCloseAsVet=['system_owner','ceo','vet_consultant','field_vet','sector_manager'].includes(currentUserRole);

  const closeDay=()=>{
    if(!flock||!latestReport) return;
    try{onChange(closeFlockDayV20(v20,managed,{flock_id:flock.id,report_date:latestReport.report_date,worker:latestReport.entered_by,vet:canCloseAsVet?currentUserName:undefined}));}
    catch(e:any){alert(e.message)}
  };
  const requestAdjustment=()=>{
    if(!flock) return;
    try{onChange(addReconciliationAdjustmentV20(v20,managed,{flock_id:flock.id,quantity_delta:Number(adjustment.quantity),reason:adjustment.reason,requested_by:currentUserName,requested_by_role:currentUserRole}));setAdjustment({quantity:0,reason:''});}
    catch(e:any){alert(e.message)}
  };
  const snapshot=(kind:'daily'|'weekly'|'cycle')=>{if(!flock)return;try{onChange(createReportSnapshotV20(v20,managed,{kind,flock_id:flock.id,generated_by:currentUserName}))}catch(e:any){alert(e.message)}};

  return <div className="space-y-4" dir="rtl">
    <section className="rounded-[28px] border border-emerald-500/20 bg-gradient-to-l from-slate-950 via-emerald-950/20 to-cyan-950/20 p-5">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div><div className="text-[11px] font-black text-emerald-300">V20.1 • FLOCK ACCOUNTING & REPORTING</div><h2 className="text-2xl font-black text-white mt-1">السجل الرقمي المحاسبي للقطيع</h2><p className="text-xs text-slate-400 mt-2 max-w-4xl">كل طائر وحركة نافق واستبعاد وبيع ونقل وتصحيح تدخل دفتر حركة قابل للمصالحة والتدقيق، مع فصل نافق الوصول والمزرعة والنقل وعدم خلطها.</p></div>
        <select className="spp-field xl:max-w-xl" value={flockId} onChange={e=>setFlockId(e.target.value)}><option value="">اختر القطيع</option>{managed.flock_cycles.map(f=><option key={f.id} value={f.id}>{managed.farms.find(x=>x.id===f.farm_id)?.name||f.farm_id} — {f.flock_code} — يوم {f.age_days}</option>)}</select>
      </div>
    </section>

    {master&&<div className="sticky top-[118px] z-20 rounded-2xl border border-slate-700 bg-[#07171b]/95 backdrop-blur p-3 shadow-xl"><div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-10 gap-2">
      <Kpi label="العمر" value={`${master.age_days} يوم`}/><Kpi label="الابتدائي" value={fmt(master.initial_accepted,0)}/><Kpi label="الحي النظري" value={fmt(master.current_theoretical,0)}/><Kpi label="نافق اليوم" value={`${fmt(master.mortality_today,0)} / ${pct(master.mortality_today_percent)}`} danger={master.mortality_today_percent>=v20.settings.mortality_warning_percent}/><Kpi label="النافق التراكمي" value={`${fmt(master.farm_mortality_cumulative,0)} / ${pct(master.farm_mortality_percent)}`}/><Kpi label="الاستبعاد" value={fmt(master.culls_cumulative,0)}/><Kpi label="المبيع" value={fmt(master.sold_cumulative,0)}/><Kpi label="نافق النقل" value={fmt(master.transport_mortality_cumulative,0)}/><Kpi label="فرق المصالحة" value={fmt(master.population_discrepancy,0)} danger={master.population_discrepancy!==0}/><Kpi label="آخر تحديث" value={master.last_report_date||'—'}/>
    </div></div>}

    <div className="flex gap-2 overflow-x-auto pb-1">{([['summary','الملخص',<Activity/>],['ledger','دفتر حركة القطيع',<History/>],['close','إغلاق اليوم',<CalendarCheck2/>],['reports','مركز التقارير',<FileBarChart/>],['executive','رقابة المزارع',<BarChart3/>],['audit','التدقيق والتصحيح',<ClipboardCheck/>]] as Array<[Tab,string,React.ReactNode]>).map(([id,label,icon])=><button key={id} onClick={()=>setTab(id)} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black border flex items-center gap-2 ${tab===id?'bg-emerald-400 text-slate-950 border-emerald-300':'bg-slate-950 text-slate-300 border-slate-800'}`}>{React.cloneElement(icon as any,{className:'w-4 h-4'})}{label}</button>)}</div>

    {issues.length>0&&<div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-3"><b className="text-xs text-rose-300">Preservation/Data Integrity Gate</b><div className="text-[11px] text-rose-200/80 mt-2 space-y-1">{issues.slice(0,8).map((x,i)=><div key={i}>• {x}</div>)}</div></div>}

    {!flock?<Empty text="لا يوجد قطيع مُدار بعد. يتم إنشاء السجل تلقائيًا عند إنشاء دورة قطيع."/>:<>
      {tab==='summary'&&owner&&<Summary owner={owner} farmName={farm?.name||''}/>} 
      {tab==='ledger'&&<Ledger events={ledger}/>} 
      {tab==='close'&&<DailyClose v20={v20} managed={managed} flockId={flock.id} latestReport={latestReport} onClose={closeDay}/>} 
      {tab==='reports'&&<Reports v20={v20} managed={managed} flockId={flock.id} snapshots={v20.report_snapshots.filter(r=>r.flock_id===flock.id)} onSnapshot={snapshot}/>} 
      {tab==='executive'&&<Executive rows={executiveFarmRowsV20(v20,managed)}/>} 
      {tab==='audit'&&<Audit v20={v20} flockId={flock.id} canApprove={canApprove} currentUserName={currentUserName} currentUserRole={currentUserRole} adjustment={adjustment} setAdjustment={setAdjustment} requestAdjustment={requestAdjustment} onChange={onChange}/>} 
    </>}
  </div>
};

const Summary=({owner,farmName}:{owner:ReturnType<typeof ownerDailyDashboardV20>;farmName:string})=><div className="space-y-4">
  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3"><Info icon={<Bird/>} title="القطيع الحالي" value={fmt(owner.master.current_theoretical,0)} sub={`${farmName} • Livability ${pct(owner.master.livability_percent)}`}/><Info icon={<Scale/>} title="الوزن" value={owner.weight.avg_g?`${fmt(owner.weight.avg_g,0)} g`:'لم يُقاس'} sub={`CV ${pct(owner.weight.cv_percent)} • Uniformity ${pct(owner.weight.uniformity_percent)}`}/><Info icon={<Wheat/>} title="العلف" value={`${fmt(owner.feed.closing_kg,1)} كجم`} sub={`يكفي ${owner.feed.estimated_days_remaining===null?'—':fmt(owner.feed.estimated_days_remaining,2)} يوم • FCR ${owner.feed.operational_fcr??'—'}`}/><Info icon={<Waves/>} title="الماء" value={`${fmt(owner.environment.water_liters,0)} لتر`} sub={`Water/Feed ${owner.environment.water_feed_ratio??'—'} • ${owner.environment.temperature_avg_c??'—'}°C`}/></div>
  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3"><Info icon={<ClipboardCheck/>} title="اكتمال البيانات" value={`${owner.completeness.score}%`} sub={owner.completeness.missing.length?`ناقص: ${owner.completeness.missing.join('، ')}`:'الحقول الأساسية مكتملة'}/><Info icon={<WalletCards/>} title="التكلفة التراكمية" value={`${fmt(owner.cost_cumulative_sar)} SAR`} sub={`اليوم ${fmt(owner.cost_today_sar)} • مستحق ${fmt(owner.outstanding_sar)}`}/><Info icon={<AlertTriangle/>} title="الموافقات" value={owner.pending_owner_approvals} sub={`${owner.open_clinical_signals} إشارات تشغيلية/سريرية مفتوحة`}/><Info icon={<Activity/>} title="حالة الخطر" value={owner.mortality_warning?'تنبيه نافق':owner.feed_warning?'تنبيه علف':'مستقرة'} sub={`نافق اليوم ${pct(owner.master.mortality_today_percent)} • التراكمي ${pct(owner.master.farm_mortality_percent)}`}/></div>
</div>;

const Ledger=({events}:{events:ReturnType<typeof buildPopulationLedgerV20>})=><div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/70"><div className="p-4 border-b border-slate-800"><h3 className="font-black text-white">Flock Population Ledger</h3><p className="text-[10px] text-slate-500 mt-1">السجل مصدر الحقيقة لحركة العدد؛ نافق الوصول يظهر مستقلًا ولا يخصم ثانية من العدد المعتمد.</p></div><div className="overflow-x-auto"><table className="w-full text-xs"><thead className="bg-slate-900 text-slate-400"><tr><th className="p-3 text-right">الوقت</th><th className="p-3 text-right">النوع</th><th className="p-3 text-right">الكمية</th><th className="p-3 text-right">الأثر</th><th className="p-3 text-right">السبب</th><th className="p-3 text-right">المصدر</th></tr></thead><tbody>{events.map(e=><tr key={e.id} className="border-t border-slate-900"><td className="p-3 text-slate-500 whitespace-nowrap">{new Date(e.at).toLocaleString('ar-YE')}</td><td className="p-3 text-slate-200">{eventLabel(e.event_type)}</td><td className="p-3 font-black text-white">{fmt(e.quantity,0)}</td><td className={`p-3 font-black ${e.signed_quantity<0?'text-rose-300':e.signed_quantity>0?'text-emerald-300':'text-slate-500'}`}>{e.signed_quantity>0?'+':''}{fmt(e.signed_quantity,0)}</td><td className="p-3 text-slate-300">{e.reason}</td><td className="p-3 text-slate-500">{e.source_type}</td></tr>)}</tbody></table></div></div>;

const DailyClose=({v20,managed,flockId,latestReport,onClose}:{v20:V20State;managed:ManagedOperationsStateV197;flockId:string;latestReport:any;onClose:()=>void})=>{
  const close=latestReport?v20.daily_closures.find(c=>c.flock_id===flockId&&c.report_date===latestReport.report_date):undefined; const completeness=dataCompletenessV20(latestReport); const master=buildFlockMasterRecordV20(v20,managed,flockId,latestReport?.report_date);
  return <div className="grid lg:grid-cols-[1fr_360px] gap-4"><div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><h3 className="font-black text-white">بوابة إغلاق اليوم</h3>{!latestReport?<Empty text="لا يوجد تقرير يومي بعد."/>:<div className="mt-4 grid md:grid-cols-2 gap-3"><Row label="تاريخ التقرير" value={latestReport.report_date}/><Row label="اكتمال الحقول" value={`${completeness.score}%`}/><Row label="الحقول الناقصة" value={completeness.missing.join('، ')||'لا يوجد'}/><Row label="فرق المصالحة" value={master.population_discrepancy}/><Row label="حالة الإغلاق" value={statusArabic(close?.status||'not_started')}/><Row label="ملاحظات AI/Validation" value={close?.ai_issues?.join('، ')||'سيتم فحصها عند الإغلاق'}/></div>}</div><div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"><h4 className="font-black text-emerald-300">قاعدة الإغلاق</h4><p className="text-xs text-slate-300 mt-2 leading-6">العامل يرسل التقرير ← فحص آلي للمنطق والاكتمال ← مصالحة حركة القطيع ← مراجعة الطبيب ← إغلاق اليوم. اليوم المغلق لا يعدل بصمت.</p><button className="spp-button spp-button-primary w-full mt-4" onClick={onClose} disabled={!latestReport}>فحص وإغلاق آخر يوم</button></div></div>
};

const Reports=({v20,managed,flockId,snapshots,onSnapshot}:{v20:V20State;managed:ManagedOperationsStateV197;flockId:string;snapshots:V20State['report_snapshots'];onSnapshot:(k:'daily'|'weekly'|'cycle')=>void})=>{
  const weekly=weeklyPerformanceV20(v20,managed,flockId); const cycle=endOfCycleReportV20(v20,managed,flockId);
  return <div className="space-y-4"><div className="flex flex-wrap gap-2"><button className="spp-button spp-button-primary" onClick={()=>onSnapshot('daily')}>تثبيت تقرير يومي</button><button className="spp-button spp-button-secondary" onClick={()=>onSnapshot('weekly')}>تثبيت تقرير أسبوعي</button><button className="spp-button spp-button-secondary" onClick={()=>onSnapshot('cycle')}>تثبيت تقرير دورة</button></div><div className="grid lg:grid-cols-2 gap-4"><div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><h3 className="font-black text-white">ملخص 7 أيام</h3><div className="mt-3 grid grid-cols-2 gap-2"><Mini label="الفترة" value={`${weekly.period_from} → ${weekly.period_to}`}/><Mini label="النافق" value={`${weekly.mortality} / ${pct(weekly.mortality_percent)}`}/><Mini label="العلف" value={`${fmt(weekly.feed_kg)} كجم`}/><Mini label="الماء" value={`${fmt(weekly.water_liters)} لتر`}/><Mini label="FCR تشغيلي" value={weekly.operational_fcr??'—'}/><Mini label="اكتمال البيانات" value={`${weekly.data_completeness_avg}%`}/></div></div><div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><h3 className="font-black text-white">مؤشرات نهاية الدورة</h3><div className="mt-3 grid grid-cols-2 gap-2"><Mini label="العدد الابتدائي" value={fmt(cycle.master.initial_accepted,0)}/><Mini label="نافق المزرعة" value={`${fmt(cycle.master.farm_mortality_cumulative,0)} / ${pct(cycle.master.farm_mortality_percent)}`}/><Mini label="المبيع" value={fmt(cycle.master.sold_cumulative,0)}/><Mini label="المتبقي" value={fmt(cycle.master.current_theoretical,0)}/><Mini label="التكلفة" value={`${fmt(cycle.total_cost_sar)} SAR`}/><Mini label="الربح/الخسارة" value={`${fmt(cycle.profit_loss_sar)} SAR`}/></div></div></div><div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><h3 className="font-black text-white">لقطات التقارير المحفوظة</h3><div className="mt-3 space-y-2">{snapshots.length?snapshots.map(s=><div key={s.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3 flex justify-between gap-3"><div><b className="text-xs text-white">{s.report_number}</b><div className="text-[10px] text-slate-500">{s.kind} • {s.period_from} → {s.period_to}</div></div><span className="text-[10px] text-emerald-300">{s.status}</span></div>):<div className="text-xs text-slate-500">لم تحفظ لقطة تقرير بعد.</div>}</div></div></div>
};

const Executive=({rows}:{rows:ReturnType<typeof executiveFarmRowsV20>})=><div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/70"><div className="p-4 border-b border-slate-800"><h3 className="font-black text-white">Executive Farm Dashboard</h3><p className="text-[10px] text-slate-500 mt-1">ترتيب المزارع حسب الخطر والانحراف بدل قراءة كل السجلات اليومية.</p></div><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead className="bg-slate-900 text-slate-400"><tr>{['المزرعة/القطيع','العمر','الحي','نافق يومي','نافق تراكمي','الوزن','FCR','علف/يوم','Biosecurity','اكتمال','الدين SAR','استثناءات','إغلاق اليوم'].map(x=><th key={x} className="p-3 text-right whitespace-nowrap">{x}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.flock_id} className="border-t border-slate-900"><td className="p-3"><b className="text-white">{r.farm_name}</b><div className="text-slate-500">{r.flock_code}</div></td><td className="p-3">{r.age_days}</td><td className="p-3">{fmt(r.live_birds,0)}</td><td className="p-3">{pct(r.daily_mortality_percent)}</td><td className="p-3">{pct(r.cumulative_mortality_percent)}</td><td className="p-3">{r.avg_weight_g?`${fmt(r.avg_weight_g,0)}g`:'—'}</td><td className="p-3">{r.fcr??'—'}</td><td className="p-3">{r.feed_days_remaining??'—'}</td><td className="p-3">{r.biosecurity_score}%</td><td className="p-3">{r.data_completeness}%</td><td className="p-3">{fmt(r.outstanding_sar)}</td><td className="p-3">{r.open_exceptions}</td><td className="p-3">{statusArabic(r.daily_close_status)}</td></tr>)}</tbody></table></div></div>;

const Audit=({v20,flockId,canApprove,currentUserName,currentUserRole,adjustment,setAdjustment,requestAdjustment,onChange}:{v20:V20State;flockId:string;canApprove:boolean;currentUserName:string;currentUserRole:string;adjustment:{quantity:number;reason:string};setAdjustment:(x:{quantity:number;reason:string})=>void;requestAdjustment:()=>void;onChange:(x:V20State)=>void})=>{
  const adjustments=v20.reconciliation_adjustments.filter(a=>a.flock_id===flockId); const audit=v20.audit_mutations.filter(a=>a.entity_id===flockId||adjustments.some(x=>x.id===a.entity_id)).slice(0,50);
  return <div className="grid xl:grid-cols-[380px_1fr] gap-4"><div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><h3 className="font-black text-white">طلب تصحيح مصالحة</h3><p className="text-[10px] text-slate-500 mt-1">لا تعديل صامت للأيام السابقة؛ التصحيح يدخل كحركة مستقلة تنتظر اعتمادًا.</p><div className="mt-3 space-y-2"><input className="spp-field" type="number" value={adjustment.quantity} onChange={e=>setAdjustment({...adjustment,quantity:Number(e.target.value)})} placeholder="+/- عدد الطيور"/><textarea className="spp-field" value={adjustment.reason} onChange={e=>setAdjustment({...adjustment,reason:e.target.value})} placeholder="سبب التصحيح"/><button className="spp-button spp-button-primary w-full" onClick={requestAdjustment}>إرسال طلب التصحيح</button></div><div className="mt-4 space-y-2">{adjustments.map(a=><div key={a.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3"><div className="flex justify-between"><b className="text-xs text-white">{a.quantity_delta>0?'+':''}{a.quantity_delta}</b><span className="text-[10px] text-slate-500">{a.status}</span></div><div className="text-[10px] text-slate-400 mt-1">{a.reason}</div>{canApprove&&a.status==='pending'&&<div className="flex gap-2 mt-2"><button className="spp-button spp-button-primary !py-1.5" onClick={()=>onChange(approveReconciliationAdjustmentV20(v20,a.id,true,currentUserName,currentUserRole,'مراجعة واعتماد التصحيح'))}>اعتماد</button><button className="spp-button spp-button-danger !py-1.5" onClick={()=>onChange(approveReconciliationAdjustmentV20(v20,a.id,false,currentUserName,currentUserRole,'رفض التصحيح'))}>رفض</button></div>}</div>)}</div></div><div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><h3 className="font-black text-white">Audit Mutations</h3><div className="mt-3 space-y-2">{audit.length?audit.map(a=><div key={a.id} className="rounded-xl bg-slate-900 p-3"><div className="flex justify-between gap-3"><b className="text-xs text-white">{a.action}</b><span className="text-[9px] text-slate-500">{new Date(a.at).toLocaleString('ar-YE')}</span></div><div className="text-[10px] text-slate-400 mt-1">{a.actor} • {a.actor_role} • {a.reason}</div></div>):<div className="text-xs text-slate-500">لا توجد تعديلات مسجلة بعد.</div>}</div></div></div>
};

const Kpi=({label,value,danger=false}:{label:string;value:React.ReactNode;danger?:boolean})=><div className="rounded-xl bg-slate-950/80 border border-slate-800 px-2.5 py-2"><div className="text-[8px] text-slate-500">{label}</div><b className={`text-xs whitespace-nowrap ${danger?'text-rose-300':'text-slate-100'}`}>{value}</b></div>;
const Info=({icon,title,value,sub}:{icon:React.ReactNode;title:string;value:React.ReactNode;sub:string})=><div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><div className="flex items-center justify-between"><span className="text-xs text-slate-400">{title}</span>{React.cloneElement(icon as any,{className:'w-5 h-5 text-emerald-300'})}</div><div className="text-xl font-black text-white mt-3">{value}</div><div className="text-[10px] text-slate-500 mt-1 leading-5">{sub}</div></div>;
const Mini=({label,value}:{label:string;value:React.ReactNode})=><div className="rounded-xl bg-slate-900 p-3"><div className="text-[9px] text-slate-500">{label}</div><b className="text-sm text-white">{value}</b></div>;
const Row=({label,value}:{label:string;value:React.ReactNode})=><div className="rounded-xl bg-slate-900 p-3"><div className="text-[9px] text-slate-500">{label}</div><div className="text-xs text-slate-200 mt-1">{value}</div></div>;
const Empty=({text}:{text:string})=><div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-xs text-slate-500 mt-4">{text}</div>;
const eventLabel=(t:string)=>({placement:'بداية القطيع',arrival_mortality:'نافق الوصول',farm_mortality:'نافق المزرعة',cull:'استبعاد',sale:'بيع',transport_mortality:'نافق النقل',transfer_in:'إدخال',transfer_out:'تحويل خارج',reconciliation_adjustment:'تصحيح مصالحة'} as Record<string,string>)[t]||t;
