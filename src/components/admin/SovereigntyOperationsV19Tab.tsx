import React, { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, BadgeCheck, Banknote, Bot, Boxes, Building2, CheckCircle2, ChevronLeft,
  ClipboardCheck, Coins, Factory, FileCheck2, FileSignature, Gauge, HeartPulse, MapPinned, MessageSquareText,
  PackageCheck, RadioTower, RefreshCw, Route, ScanLine, ShieldCheck, Sparkles, Stethoscope, Truck, Users,
  WalletCards, Warehouse, Waves, Wheat, XCircle, Plus, Trash2
} from 'lucide-react';
import { SmartOperationsState, SovereigntyV19State } from '../../types';
import {
  canPublishHealthyLabelV19, chooseFreelanceVetV19, executiveMetricsV19, routeLogisticsV19,
  simulateDigitalTwinV19, buildDynamicPriceV19
} from '../../services/sovereigntyV19';

type Props = { operations: SmartOperationsState; onUpdateOperations: (next: SmartOperationsState) => void };
type Section = 'executive' | 'network' | 'logistics' | 'quality' | 'communications' | 'commercial' | 'ai';
const money = (n:number) => new Intl.NumberFormat('ar-YE').format(Math.round(n || 0));
const pct = (n:number) => `${Number(n || 0).toFixed(1)}%`;

const Badge:React.FC<{children:React.ReactNode;tone?:'green'|'amber'|'red'|'cyan'|'slate'}>=({children,tone='slate'})=>{
  const c={green:'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',amber:'border-amber-500/30 bg-amber-500/10 text-amber-300',red:'border-rose-500/30 bg-rose-500/10 text-rose-300',cyan:'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',slate:'border-slate-700 bg-slate-800/70 text-slate-300'}[tone];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black ${c}`}>{children}</span>;
};
const Panel:React.FC<{title:string;subtitle?:string;icon?:React.ReactNode;children:React.ReactNode;action?:React.ReactNode}>=({title,subtitle,icon,children,action})=><section className="sov-panel">
  <div className="flex items-start justify-between gap-4 mb-4"><div className="flex items-start gap-3"><div className="sov-icon">{icon}</div><div><h4 className="text-sm font-black text-white">{title}</h4>{subtitle&&<p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{subtitle}</p>}</div></div>{action}</div>{children}
</section>;
const Metric:React.FC<{label:string;value:string|number;note?:string;icon:React.ReactNode;tone?:string}>=({label,value,note,icon,tone='emerald'})=><div className="sov-metric">
  <div className={`sov-metric-icon text-${tone}-300`}>{icon}</div><div className="min-w-0"><div className="text-[10px] text-slate-500 font-bold">{label}</div><div className="text-xl font-black text-white mt-0.5 truncate">{value}</div>{note&&<div className="text-[10px] text-slate-500 mt-1 truncate">{note}</div>}</div>
</div>;

export const SovereigntyOperationsV19Tab:React.FC<Props>=({operations,onUpdateOperations})=>{
  const [section,setSection]=useState<Section>('executive');
  const [notice,setNotice]=useState('');
  const [networkEditor,setNetworkEditor]=useState<'none'|'governorate'|'office'|'warehouse'>('none');
  const [governorateDraft,setGovernorateDraft]=useState({name:'',code:'',notes:''});
  const [officeDraft,setOfficeDraft]=useState({governorate:'صنعاء',district:'',name:'',office_type:'marketing_market' as 'platform_office'|'marketing_market'|'collection_point',address:'',phone:'',manager_name:''});
  const [warehouseDraft,setWarehouseDraft]=useState({governorate:'صنعاء',district:'',name:'',owner_name:'',address:'',phone:'',capacity_label:'',cold_chain_capable:false});
  const v19=operations.enterprise.sovereignty_v19;
  const metrics=useMemo(()=>executiveMetricsV19(v19),[v19]);
  const update=(next:SovereigntyV19State)=>onUpdateOperations({...operations,enterprise:{...operations.enterprise,sovereignty_v19:next}});
  const patch=(p:Partial<SovereigntyV19State>)=>update({...v19,...p});

  const sections:{id:Section;label:string;icon:React.ReactNode;desc:string}[]=[
    {id:'executive',label:'القيادة التنفيذية',icon:<Gauge className="w-4 h-4"/>,desc:'CEO Command'},
    {id:'network',label:'الشبكة الميدانية',icon:<MapPinned className="w-4 h-4"/>,desc:'Offices & Vets'},
    {id:'logistics',label:'الذكاء اللوجستي',icon:<Route className="w-4 h-4"/>,desc:'Routing & Stock'},
    {id:'quality',label:'الجودة والأمان',icon:<ShieldCheck className="w-4 h-4"/>,desc:'Labels & Biosecurity'},
    {id:'communications',label:'الاتصال والتصعيد',icon:<MessageSquareText className="w-4 h-4"/>,desc:'AI Chat'},
    {id:'commercial',label:'الكتاكيت والمالية',icon:<Coins className="w-4 h-4"/>,desc:'Trade & Escrow'},
    {id:'ai',label:'محركات AI',icon:<Sparkles className="w-4 h-4"/>,desc:'Twin & Radar'}
  ];

  const activeGovernorates=(v19.governorates||[]).filter(g=>g.status!=='archived');
  const addGovernorate=()=>{
    const name=governorateDraft.name.trim();
    if(!name){setNotice('اكتب اسم المحافظة أولاً.');return;}
    if((v19.governorates||[]).some(g=>g.name===name&&g.status!=='archived')){setNotice('المحافظة موجودة بالفعل.');return;}
    patch({governorates:[...(v19.governorates||[]),{id:`gov19-${Date.now()}`,name,code:governorateDraft.code.trim()||undefined,status:'active',created_at:new Date().toISOString(),notes:governorateDraft.notes.trim()||undefined}]});
    setGovernorateDraft({name:'',code:'',notes:''});setNetworkEditor('none');setNotice(`تمت إضافة محافظة ${name} ويمكن الآن ربط الأسواق والمكاتب والمخازن بها.`);
  };
  const removeGovernorate=(id:string)=>{
    const gov=(v19.governorates||[]).find(g=>g.id===id);if(!gov)return;
    const linked=v19.market_offices.some(o=>o.governorate===gov.name&&o.status!=='archived')||v19.partner_branches.some(b=>b.governorate===gov.name&&b.status!=='archived')||(v19.warehouses||[]).some(w=>w.governorate===gov.name&&w.status!=='archived');
    if(linked){setNotice(`لا يمكن حذف ${gov.name} قبل حذف/أرشفة الأسواق والفروع والمخازن المرتبطة بها حفاظاً على سلامة السجل.`);return;}
    if(typeof window!=='undefined'&&!window.confirm(`حذف محافظة ${gov.name}؟`))return;
    patch({governorates:(v19.governorates||[]).filter(g=>g.id!==id)});
  };
  const addOffice=()=>{
    if(!officeDraft.name.trim()||!officeDraft.governorate.trim()||!officeDraft.district.trim()){setNotice('أكمل اسم السوق/المكتب والمحافظة والمديرية.');return;}
    patch({market_offices:[...v19.market_offices,{id:`off19-${Date.now()}`,governorate:officeDraft.governorate.trim(),district:officeDraft.district.trim(),name:officeDraft.name.trim(),office_type:officeDraft.office_type,address:officeDraft.address.trim()||'غير محدد',phone:officeDraft.phone.trim()||'غير محدد',status:'active',manager_name:officeDraft.manager_name.trim()||'غير معين'}]});
    setOfficeDraft({governorate:activeGovernorates[0]?.name||'صنعاء',district:'',name:'',office_type:'marketing_market',address:'',phone:'',manager_name:''});setNetworkEditor('none');setNotice('تمت إضافة السوق/المكتب وتفعيله.');
  };
  const deleteOffice=(id:string)=>{
    const office=v19.market_offices.find(o=>o.id===id);if(!office)return;
    const referenced=v19.proof_of_delivery.some(p=>p.office_id===id);
    if(referenced){patch({market_offices:v19.market_offices.map(o=>o.id===id?{...o,status:'archived'}:o)});setNotice('لوجود سجل تسليم مرتبط بهذا المكتب تم أرشفته بدلاً من الحذف النهائي حفاظاً على التدقيق المالي.');return;}
    if(typeof window!=='undefined'&&!window.confirm(`حذف ${office.name}؟`))return;
    patch({market_offices:v19.market_offices.filter(o=>o.id!==id)});
  };
  const addWarehouse=()=>{
    if(!warehouseDraft.name.trim()||!warehouseDraft.owner_name.trim()||!warehouseDraft.governorate.trim()||!warehouseDraft.district.trim()){setNotice('أكمل اسم المخزن والمالك والمحافظة والمديرية.');return;}
    patch({warehouses:[...(v19.warehouses||[]),{id:`wh19-${Date.now()}`,name:warehouseDraft.name.trim(),owner_name:warehouseDraft.owner_name.trim(),governorate:warehouseDraft.governorate.trim(),district:warehouseDraft.district.trim(),address:warehouseDraft.address.trim()||'غير محدد',phone:warehouseDraft.phone.trim()||'غير محدد',capacity_label:warehouseDraft.capacity_label.trim()||undefined,cold_chain_capable:warehouseDraft.cold_chain_capable,status:'pending_contract'}]});
    setWarehouseDraft({governorate:activeGovernorates[0]?.name||'صنعاء',district:'',name:'',owner_name:'',address:'',phone:'',capacity_label:'',cold_chain_capable:false});setNetworkEditor('none');setNotice('تم تسجيل المخزن بحالة «بانتظار العقد». لن يدخل المخزون أو التوجيه حتى توقيع واعتماد العقد.');
  };
  const approveWarehouseContract=(warehouseId:string)=>{
    const w=(v19.warehouses||[]).find(x=>x.id===warehouseId);if(!w)return;
    const now=new Date();const until=new Date(now);until.setFullYear(until.getFullYear()+1);
    const contractId=`whc19-${Date.now()}`;const contractNumber=`WHC-${now.getFullYear()}-${String(Date.now()).slice(-6)}`;
    patch({
      warehouse_contracts:[...(v19.warehouse_contracts||[]),{id:contractId,contract_number:contractNumber,warehouse_name:w.name,owner_name:w.owner_name,governorate:w.governorate,district:w.district,signed_at:now.toISOString(),valid_until:until.toISOString().slice(0,10),document_reference:`warehouse-contracts/${contractNumber}.pdf`,status:'approved',approved_by:'System Owner'}],
      warehouses:(v19.warehouses||[]).map(x=>x.id===warehouseId?{...x,contract_id:contractId,status:'active'}:x)
    });
    setNotice(`تم توقيع واعتماد العقد ${contractNumber} وتفعيل المخزن ${w.name}.`);
  };
  const toggleWarehouse=(id:string)=>{
    const w=(v19.warehouses||[]).find(x=>x.id===id);if(!w)return;
    const contract=(v19.warehouse_contracts||[]).find(c=>c.id===w.contract_id&&c.status==='approved'&&(!c.valid_until||new Date(c.valid_until).getTime()>=Date.now()));
    if(w.status!=='active'&&!contract){setNotice('لا يمكن تفعيل المخزن بدون عقد موقع ومعتمد وساري.');return;}
    patch({warehouses:(v19.warehouses||[]).map(x=>x.id===id?{...x,status:x.status==='active'?'suspended':'active'}:x)});
  };
  const deleteWarehouse=(id:string)=>{
    const w=(v19.warehouses||[]).find(x=>x.id===id);if(!w)return;
    if(typeof window!=='undefined'&&!window.confirm(`حذف/أرشفة المخزن ${w.name}؟`))return;
    const hasContract=Boolean(w.contract_id);
    if(hasContract){patch({warehouses:(v19.warehouses||[]).map(x=>x.id===id?{...x,status:'archived'}:x)});setNotice('تمت أرشفة المخزن لأن له عقداً مسجلاً؛ لا نحذف السجل التعاقدي من مسار التدقيق.');}
    else patch({warehouses:(v19.warehouses||[]).filter(x=>x.id!==id)});
  };
  const runInventoryAttestation=()=>{
    const now=new Date().toISOString();
    patch({stock_checks:v19.stock_checks.map(x=>({...x,checked_at:now,check_mode:'daily_attestation' as const,status:x.status==='blocked'?'blocked' as const:'confirmed' as const}))});
    setNotice('تم تحديث ختم التدقيق اليومي للمخزون. التكامل الإنتاجي سيطلب مصادقة مدير كل فرع فعلياً.');
  };
  const runRoute=()=>{
    const r=routeLogisticsV19(v19,{customer_name:'طلب تجريبي مباشر',governorate:'صنعاء',district:'بني حشيش',product_id:'vac-nd-a',product_name:'لقاح نيوكاسل - مورد A',category:'vaccine',quantity:4,criticality:'cold_chain_critical'});
    patch({logistics_routes:[r,...v19.logistics_routes]});setNotice(`نتيجة التوجيه: ${r.decision_reason}`);
  };
  const assignVet=()=>{
    const vet=chooseFreelanceVetV19(v19,'إب','يريم');
    setNotice(vet?`تم اختيار ${vet.name} كأفضل طبيب متاح وفق المنطقة والتحقق والترتيب التشغيلي. المكافأة لا تُعتمد إلا من الإدارة.`:'لا يوجد طبيب مستقل مؤهل ومتاح حالياً.');
  };
  const confirmPod=(id:string)=>{
    const now=new Date().toISOString();
    const pod=v19.proof_of_delivery.find(p=>p.id===id);if(!pod)return;
    const documentId=`fd19-pod-${Date.now()}`;
    patch({proof_of_delivery:v19.proof_of_delivery.map(p=>p.id===id?{...p,received_quantity:p.expected_quantity,confirmed_by:'مسؤول المكتب',confirmed_at:now,status:'settled',settlement_document_id:documentId}:p),financial_documents:[{id:documentId,document_number:`POD-${String(Date.now()).slice(-7)}`,created_at:now,type:'pod_settlement',counterparty:pod.office_name,reference:pod.shipment_reference,currency:'YER_OLD',gross_amount:0,platform_commission:0,net_amount:0,status:'issued',created_by:'النظام بعد تأكيد الوصول'},...v19.financial_documents]});
  };
  const toggleCertificate=(id:string)=>patch({healthy_certificates:v19.healthy_certificates.map(c=>c.id===id?{...c,public_status:c.public_status==='verified'?'revoked':'verified'}:c)});
  const acknowledgeIssue=(id:string)=>patch({executive_issues:v19.executive_issues.map(i=>i.id===id?{...i,status:i.status==='resolved'?'resolved':'acknowledged'}:i)});
  const simulateTwin=()=>{
    const t=simulateDigitalTwinV19({farm_name:'مزرعة وادي سبأ النموذجية للدواجن',flock_id:'flock-101',age_days:28,birds_alive:18400,temperature_c:24.2,humidity_percent:58,ventilation_index:79,feed_kg_day:2140,current_weight_g:1470,current_fcr:1.55});
    patch({digital_twins:[t,...v19.digital_twins]});setNotice('تم إنشاء محاكاة تشغيلية جديدة. النتائج إرشادية وتحتاج تحققاً ميدانياً.');
  };
  const generatePrice=()=>{
    const p=buildDynamicPriceV19({governorate:'صنعاء',category:'live_poultry',current_price:2150,currency:'YER_OLD',demand_index:78,supply_index:60,transport_index:55,fx_index:51,expected_margin_percent:12});
    patch({dynamic_pricing:[p,...v19.dynamic_pricing]});setNotice('تم إنشاء اقتراح سعر جديد كمسودة؛ لن يُنشر قبل اعتماد الإدارة.');
  };

  return <div className="space-y-5" dir="rtl">
    <div className="sov-hero">
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="max-w-4xl"><div className="flex flex-wrap gap-2 mb-3"><Badge tone="green">V19.5 • Operational Sovereignty</Badge><Badge tone="cyan">Human-in-the-Loop</Badge><Badge tone="amber">Supply Chain Command</Badge></div><h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">مركز السيادة التشغيلية وسلسلة الإمداد</h3><p className="text-sm text-slate-300 mt-2 leading-7">واجهة موحّدة لقيادة السوق، الأطباء، الفروع، المخزون، الجودة، الدردشة الميدانية، الكتاكيت، المالية ومحركات الذكاء الاصطناعي. كل قرار طبي نهائي للطبيب، وكل قرار مالي حساس يخضع لصلاحيات الإدارة.</p></div>
        <div className="grid grid-cols-2 gap-2 min-w-[300px]"><div className="sov-status"><span className="sov-dot bg-emerald-400"/>V19.5 مفعّل</div><div className="sov-status"><span className="sov-dot bg-cyan-400"/>Offline Queue</div><div className="sov-status"><span className="sov-dot bg-amber-400"/>QR Verification</div><div className="sov-status"><span className="sov-dot bg-rose-400"/>Vet Gatekeeper</div></div>
      </div>
    </div>

    <div className="sov-tabs">{sections.map(x=><button key={x.id} onClick={()=>setSection(x.id)} className={`sov-tab ${section===x.id?'sov-tab-active':''}`}><span className="sov-tab-icon">{x.icon}</span><span className="text-right"><b>{x.label}</b><small>{x.desc}</small></span></button>)}</div>
    {notice&&<div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-xs text-cyan-100 flex items-center justify-between gap-3"><span>{notice}</span><button onClick={()=>setNotice('')} className="p-1 rounded-lg hover:bg-white/10"><XCircle className="w-4 h-4"/></button></div>}

    {section==='executive'&&<div className="space-y-4">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3"><Metric label="المكاتب النشطة" value={metrics.activeOffices} note="قابلة للتوسع والتجميد" icon={<Building2 className="w-5 h-5"/>}/><Metric label="شهادات صحية قابلة للنشر" value={metrics.verifiedLabels} note="بعد المختبر وفترة السحب" icon={<BadgeCheck className="w-5 h-5"/>}/><Metric label="قضايا تنفيذية مفتوحة" value={metrics.openIssues} note="وبائية/مالية/توريد/جودة" icon={<AlertTriangle className="w-5 h-5"/>}/><Metric label="الحركة المالية الموثقة" value={`${money(metrics.financeVolume)} ر.ي`} note="مستندات V19" icon={<Banknote className="w-5 h-5"/>}/></div>
      <div className="grid xl:grid-cols-3 gap-4"><Panel title="Executive Issue Matrix" subtitle="الحالات التي تستحق انتباه الإدارة العليا فقط." icon={<RadioTower className="w-5 h-5"/>}>{v19.executive_issues.map(i=><div key={i.id} className="sov-row"><div className="min-w-0"><div className="flex gap-2 items-center"><b className="text-xs text-white">{i.title}</b><Badge tone={i.severity==='critical'?'red':'amber'}>{i.severity}</Badge></div><p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{i.summary}</p><div className="text-[10px] text-slate-500 mt-2">المالك: {i.owner} • الحالة: {i.status}</div></div><button onClick={()=>acknowledgeIssue(i.id)} className="sov-mini">استلام</button></div>)}</Panel>
      <Panel title="الرادار الوبائي التنفيذي" subtitle="قراءة مجمعة؛ لا تعني تشخيصاً مؤكداً." icon={<Waves className="w-5 h-5"/>}><div className="grid grid-cols-2 gap-3"><Metric label="إشارات نشطة" value={metrics.bio.active} icon={<Activity className="w-4 h-4"/>}/><Metric label="مؤشر المخاطر" value={`${metrics.bio.weightedRisk}/100`} icon={<HeartPulse className="w-4 h-4"/>}/></div>{v19.epidemic_signals.map(s=><div key={s.id} className="sov-row mt-3"><div><b className="text-xs text-white">{s.governorate} / {s.district}</b><div className="text-[10px] text-slate-400 mt-1">{s.disease_group} • {s.forecast_window_hours} ساعة • ثقة {s.confidence_percent}%</div></div><Badge tone={s.status==='critical'?'red':'amber'}>{s.status}</Badge></div>)}</Panel>
      <Panel title="سياسة النظام المغلقة" subtitle="الحواجز التي لا ينبغي تجاوزها بالذكاء الاصطناعي." icon={<ShieldCheck className="w-5 h-5"/>}><div className="space-y-2 text-xs"><div className="sov-check"><CheckCircle2/>القرار الطبي النهائي يتطلب طبيباً بشرياً.</div><div className="sov-check"><CheckCircle2/>العلامة الصحية تحتاج تحقق المختبر وفترة السحب.</div><div className="sov-check"><CheckCircle2/>المسارات الجديدة تخضع لفحص الربحية عند الحاجة.</div><div className="sov-check"><CheckCircle2/>وضع Offline يحفظ العمل الميداني للمزامنة.</div></div></Panel></div>
    </div>}

    {section==='network'&&<div className="space-y-4">
      <div className="grid xl:grid-cols-2 gap-4">
        <Panel title="إدارة المحافظات" subtitle="إضافة/تجميد/حذف المحافظات من لوحة الإدارة دون تعديل الكود." icon={<MapPinned className="w-5 h-5"/>} action={<button className="sov-btn" onClick={()=>setNetworkEditor(networkEditor==='governorate'?'none':'governorate')}><Plus className="w-3.5 h-3.5"/>محافظة</button>}>
          {networkEditor==='governorate'&&<div className="mb-3 rounded-2xl border border-cyan-900/50 bg-slate-950/50 p-3 grid md:grid-cols-3 gap-2">
            <input value={governorateDraft.name} onChange={e=>setGovernorateDraft({...governorateDraft,name:e.target.value})} placeholder="اسم المحافظة" className="sov-input"/>
            <input value={governorateDraft.code} onChange={e=>setGovernorateDraft({...governorateDraft,code:e.target.value})} placeholder="رمز اختياري" className="sov-input"/>
            <button className="sov-btn justify-center" onClick={addGovernorate}>حفظ المحافظة</button>
          </div>}
          <div className="space-y-2">{activeGovernorates.map(g=><div key={g.id} className="sov-row"><div><b className="text-xs text-white">{g.name}</b><div className="text-[10px] text-slate-500 mt-1">{g.code||'بدون رمز'} • {v19.market_offices.filter(o=>o.governorate===g.name&&o.status!=='archived').length} سوق/مكتب • {(v19.warehouses||[]).filter(w=>w.governorate===g.name&&w.status!=='archived').length} مخزن</div></div><div className="flex items-center gap-2"><button onClick={()=>patch({governorates:(v19.governorates||[]).map(x=>x.id===g.id?{...x,status:x.status==='active'?'paused':'active'}:x)})}><Badge tone={g.status==='active'?'green':'amber'}>{g.status==='active'?'فعالة':'موقوفة'}</Badge></button><button onClick={()=>removeGovernorate(g.id)} className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/10" title="حذف المحافظة"><Trash2 className="w-4 h-4"/></button></div></div>)}</div>
        </Panel>

        <Panel title="شبكة الأسواق والمكاتب" subtitle="إنشاء سوق أو مكتب أو نقطة تجميع وربطها بمحافظة ومديرية. الحذف يُمنع إذا كان السجل مرتبطاً بتسليم مالي." icon={<Building2 className="w-5 h-5"/>} action={<button className="sov-btn" onClick={()=>setNetworkEditor(networkEditor==='office'?'none':'office')}><Plus className="w-3.5 h-3.5"/>سوق/مكتب</button>}>
          {networkEditor==='office'&&<div className="mb-3 rounded-2xl border border-cyan-900/50 bg-slate-950/50 p-3 grid md:grid-cols-2 gap-2">
            <select value={officeDraft.governorate} onChange={e=>setOfficeDraft({...officeDraft,governorate:e.target.value})} className="sov-input">{activeGovernorates.map(g=><option key={g.id}>{g.name}</option>)}</select>
            <input value={officeDraft.district} onChange={e=>setOfficeDraft({...officeDraft,district:e.target.value})} placeholder="المديرية" className="sov-input"/>
            <input value={officeDraft.name} onChange={e=>setOfficeDraft({...officeDraft,name:e.target.value})} placeholder="اسم السوق/المكتب" className="sov-input"/>
            <select value={officeDraft.office_type} onChange={e=>setOfficeDraft({...officeDraft,office_type:e.target.value as typeof officeDraft.office_type})} className="sov-input"><option value="marketing_market">سوق تسويقي</option><option value="platform_office">مكتب منصة</option><option value="collection_point">نقطة تجميع</option></select>
            <input value={officeDraft.phone} onChange={e=>setOfficeDraft({...officeDraft,phone:e.target.value})} placeholder="رقم التواصل" className="sov-input"/>
            <input value={officeDraft.manager_name} onChange={e=>setOfficeDraft({...officeDraft,manager_name:e.target.value})} placeholder="المسؤول" className="sov-input"/>
            <input value={officeDraft.address} onChange={e=>setOfficeDraft({...officeDraft,address:e.target.value})} placeholder="العنوان" className="sov-input md:col-span-2"/>
            <button className="sov-btn justify-center md:col-span-2" onClick={addOffice}>حفظ وتفعيل السوق/المكتب</button>
          </div>}
          <div className="space-y-2">{v19.market_offices.filter(o=>o.status!=='archived').map(o=><div key={o.id} className="sov-row"><div><b className="text-xs text-white">{o.name}</b><div className="text-[10px] text-slate-400 mt-1">{o.governorate} • {o.district} • {o.phone}</div></div><div className="flex items-center gap-2"><button onClick={()=>patch({market_offices:v19.market_offices.map(x=>x.id===o.id?{...x,status:x.status==='active'?'paused':'active'}:x)})}><Badge tone={o.status==='active'?'green':'amber'}>{o.status==='active'?'فعال':'موقوف'}</Badge></button><button onClick={()=>deleteOffice(o.id)} className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/10"><Trash2 className="w-4 h-4"/></button></div></div>)}</div>
        </Panel>

        <Panel title="المخازن بعقود إلزامية" subtitle="أي مخزن جديد يبقى «بانتظار العقد» ولا يدخل المخزون أو التوجيه إلا بعد توقيع واعتماد عقد ساري." icon={<Warehouse className="w-5 h-5"/>} action={<button className="sov-btn" onClick={()=>setNetworkEditor(networkEditor==='warehouse'?'none':'warehouse')}><Plus className="w-3.5 h-3.5"/>مخزن</button>}>
          {networkEditor==='warehouse'&&<div className="mb-3 rounded-2xl border border-amber-900/50 bg-slate-950/50 p-3 grid md:grid-cols-2 gap-2">
            <select value={warehouseDraft.governorate} onChange={e=>setWarehouseDraft({...warehouseDraft,governorate:e.target.value})} className="sov-input">{activeGovernorates.map(g=><option key={g.id}>{g.name}</option>)}</select>
            <input value={warehouseDraft.district} onChange={e=>setWarehouseDraft({...warehouseDraft,district:e.target.value})} placeholder="المديرية" className="sov-input"/>
            <input value={warehouseDraft.name} onChange={e=>setWarehouseDraft({...warehouseDraft,name:e.target.value})} placeholder="اسم المخزن" className="sov-input"/>
            <input value={warehouseDraft.owner_name} onChange={e=>setWarehouseDraft({...warehouseDraft,owner_name:e.target.value})} placeholder="اسم مالك/شركة المخزن" className="sov-input"/>
            <input value={warehouseDraft.phone} onChange={e=>setWarehouseDraft({...warehouseDraft,phone:e.target.value})} placeholder="رقم التواصل" className="sov-input"/>
            <input value={warehouseDraft.capacity_label} onChange={e=>setWarehouseDraft({...warehouseDraft,capacity_label:e.target.value})} placeholder="نوع/سعة التخزين" className="sov-input"/>
            <input value={warehouseDraft.address} onChange={e=>setWarehouseDraft({...warehouseDraft,address:e.target.value})} placeholder="العنوان" className="sov-input md:col-span-2"/>
            <label className="text-[11px] text-slate-300 flex items-center gap-2"><input type="checkbox" checked={warehouseDraft.cold_chain_capable} onChange={e=>setWarehouseDraft({...warehouseDraft,cold_chain_capable:e.target.checked})}/> يدعم سلسلة التبريد</label>
            <button className="sov-btn justify-center" onClick={addWarehouse}>تسجيل المخزن بانتظار العقد</button>
          </div>}
          <div className="space-y-2">{(v19.warehouses||[]).filter(w=>w.status!=='archived').map(w=>{const contract=(v19.warehouse_contracts||[]).find(c=>c.id===w.contract_id);return <div key={w.id} className="sov-row"><div><b className="text-xs text-white">{w.name}</b><div className="text-[10px] text-slate-400 mt-1">{w.governorate}/{w.district} • {w.owner_name} • {w.cold_chain_capable?'Cold Chain':'Standard'}</div><div className="text-[10px] mt-1 text-amber-300">{contract?`العقد ${contract.contract_number} • ${contract.status} • حتى ${contract.valid_until||'-'}`:'لا يوجد عقد معتمد'}</div></div><div className="flex flex-wrap items-center justify-end gap-2">{w.status==='pending_contract'&&!contract&&<button className="sov-btn" onClick={()=>approveWarehouseContract(w.id)}><FileSignature className="w-3.5 h-3.5"/>توقيع واعتماد العقد</button>}<button onClick={()=>toggleWarehouse(w.id)}><Badge tone={w.status==='active'?'green':w.status==='pending_contract'?'amber':'slate'}>{w.status==='active'?'فعال':w.status==='pending_contract'?'بانتظار العقد':'موقوف'}</Badge></button><button onClick={()=>deleteWarehouse(w.id)} className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/10"><Trash2 className="w-4 h-4"/></button></div></div>})}</div>
        </Panel>

        <Panel title="الأطباء المستقلون عند الطلب" subtitle="ترشيح أقرب طبيب مؤهل، مع بقاء المكافأة والقبول تحت اعتماد الإدارة." icon={<Stethoscope className="w-5 h-5"/>} action={<button className="sov-btn" onClick={assignVet}>محاكاة تكليف</button>}>
          <div className="space-y-2">{v19.freelance_vets.map(v=><div key={v.id} className="sov-row"><div><b className="text-xs text-white">{v.name}</b><div className="text-[10px] text-slate-400 mt-1">{v.governorate} • {v.districts.join('، ')} • ⭐ {v.rating}</div><div className="text-[10px] text-slate-500 mt-1">مكافأة أساس: {money(v.base_reward_yer)} ر.ي • {v.completed_visits} زيارة</div></div><Badge tone={v.status==='available'?'green':'amber'}>{v.status}</Badge></div>)}</div>
        </Panel>

        <Panel title="فروع الشركات والشركاء" subtitle="أدوية، لقاحات، أعلاف، معدات، كتاكيت ومختبرات مع دعم التبريد." icon={<Factory className="w-5 h-5"/>}>{v19.partner_branches.map(b=><div key={b.id} className="sov-row"><div><b className="text-xs text-white">{b.company_name} — {b.branch_name}</b><div className="text-[10px] text-slate-400 mt-1">{b.governorate}/{b.district} • {b.category}</div></div><Badge tone={b.cold_chain_capable?'cyan':'slate'}>{b.cold_chain_capable?'Cold Chain':'Standard'}</Badge></div>)}</Panel>

        <Panel title="توزيع الشبكة" subtitle="ملخص حي لجميع المحافظات المضافة، وليس قائمة ثابتة في الكود." icon={<MapPinned className="w-5 h-5"/>}><div className="grid grid-cols-2 gap-3">{activeGovernorates.map(g=><div key={g.id} className="sov-region"><b>{g.name}</b><span>{v19.market_offices.filter(o=>o.governorate===g.name&&o.status==='active').length} سوق/مكتب</span><span>{(v19.warehouses||[]).filter(w=>w.governorate===g.name&&w.status==='active').length} مخزن متعاقد</span><span>{v19.partner_branches.filter(b=>b.governorate===g.name&&b.status==='active').length} فرع شريك</span></div>)}</div></Panel>
      </div>
    </div>}

    {section==='logistics'&&<div className="space-y-4">
      <div className="grid xl:grid-cols-3 gap-4"><Panel title="Hybrid Inventory Verification" subtitle="تدقيق يومي + تحقق لحظة الطلب." icon={<Warehouse className="w-5 h-5"/>} action={<button className="sov-btn" onClick={runInventoryAttestation}><RefreshCw className="w-3.5 h-3.5"/>تدقيق الآن</button>}><div className="space-y-2">{v19.stock_checks.map(s=><div key={s.id} className="sov-row"><div><b className="text-xs text-white">{s.product_name}</b><div className="text-[10px] text-slate-400 mt-1">{s.branch_name} • {s.quantity_available} {s.unit_label}</div></div><Badge tone={s.status==='confirmed'?'green':'amber'}>{s.status}</Badge></div>)}</div></Panel>
      <Panel title="AI Logistics Routing" subtitle="تحديد أقرب مخزون أو التحويل للمراجعة حسب حساسية الصنف." icon={<Route className="w-5 h-5"/>} action={<button className="sov-btn" onClick={runRoute}>تشغيل مثال</button>}><div className="space-y-2">{v19.logistics_routes.slice(0,5).map(r=><div key={r.id} className="sov-row"><div><b className="text-xs text-white">{r.requested_product_name}</b><div className="text-[10px] text-slate-400 mt-1">{r.governorate}/{r.district} → {r.selected_branch_name||'مراجعة بشرية'}</div><div className="text-[10px] text-slate-500 mt-1">{r.decision_reason}</div></div><Badge tone={r.route_status==='local_available'?'green':r.route_status==='manual_review'?'amber':'cyan'}>{r.route_status}</Badge></div>)}</div></Panel>
      <Panel title="Alternative Product Engine" subtitle="البديل لا يصبح قراراً علاجياً؛ المطابقة الطبية للطبيب." icon={<Boxes className="w-5 h-5"/>}>{v19.alternatives.map(a=><div key={a.id} className="sov-row"><div><b className="text-xs text-white">{a.requested_product_name}</b><div className="text-[10px] text-cyan-300 mt-1">↳ {a.alternative_product_name}</div><div className="text-[10px] text-slate-500 mt-1">{a.scientific_match_basis}</div></div><Badge tone={a.clinical_equivalence_requires_vet?'amber':'green'}>{a.clinical_equivalence_requires_vet?'Vet review':'Approved'}</Badge></div>)}</Panel></div>
    </div>}

    {section==='quality'&&<div className="grid xl:grid-cols-2 gap-4">
      <Panel title="Healthy Poultry Label" subtitle="شهادة تسويقية رقمية لا تُنشر إلا إذا اكتملت بوابات السلامة." icon={<BadgeCheck className="w-5 h-5"/>}>{v19.healthy_certificates.map(c=><div key={c.id} className="sov-cert"><div className="flex items-start justify-between gap-3"><div><div className="text-[10px] text-emerald-300 font-black">{c.certificate_number}</div><b className="text-sm text-white">{c.farm_name}</b><p className="text-[11px] text-slate-400 mt-1">{c.public_summary}</p></div><button onClick={()=>toggleCertificate(c.id)}><Badge tone={canPublishHealthyLabelV19(c)?'green':'red'}>{c.public_status}</Badge></button></div><div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-[10px]"><span className="sov-proof">مختبر {c.lab_verified?'✓':'×'}</span><span className="sov-proof">سحب دوائي {c.withdrawal_period_cleared?'✓':'×'}</span><span className="sov-proof">سموم {c.toxin_screen_cleared?'✓':'×'}</span><span className="sov-proof">توقيع طبيب {c.vet_signed?'✓':'×'}</span></div><div className="mt-3 text-[10px] font-mono text-cyan-300">QR: {c.qr_public_code}</div></div>)}</Panel>
      <Panel title="Biosecurity Transit Permits" subtitle="تصاريح نقل مرتبطة بالتعقيم والحالة الوبائية." icon={<Truck className="w-5 h-5"/>}>{v19.transit_permits.map(p=><div key={p.id} className="sov-row"><div><b className="text-xs text-white">{p.permit_number} • {p.vehicle_plate}</b><div className="text-[10px] text-slate-400 mt-1">{p.origin} ← {p.destination} • {p.vehicle_type}</div><div className="text-[10px] text-slate-500 mt-1">تعقيم: {p.disinfection_verified?'موثق':'غير موثق'}</div></div><Badge tone={p.status==='active'?'green':p.status==='blocked_by_outbreak'?'red':'amber'}>{p.status}</Badge></div>)}</Panel>
      <Panel title="Public Quality Verification" subtitle="واجهة البيانات العامة تعرض ما يلزم للتحقق دون كشف بيانات مالية أو حساسة." icon={<ScanLine className="w-5 h-5"/>}><div className="sov-public"><ScanLine className="w-12 h-12 text-emerald-300"/><div><b className="text-white">مسح QR للتحقق</b><p className="text-[11px] text-slate-400 mt-1">الشهادة، تاريخ الفحص، توقيع الطبيب، صلاحية فترة السحب، وحالة الاعتماد.</p></div></div></Panel>
      <Panel title="Epidemic Early Warning" subtitle="إشارات جغرافية وقائية تحتاج مراجعة بيطرية." icon={<AlertTriangle className="w-5 h-5"/>}>{v19.epidemic_signals.map(s=><div key={s.id} className="sov-row"><div><b className="text-xs text-white">{s.governorate}/{s.district} • {s.disease_group}</b><div className="text-[10px] text-slate-400 mt-1">خطر {s.risk_score}/100 • {s.suspected_cases} مشتبه • نطاق {s.radius_km} كم</div><div className="text-[10px] text-slate-500 mt-1">{s.prevention_message}</div></div><Badge tone={s.status==='critical'?'red':'amber'}>{s.status}</Badge></div>)}</Panel>
    </div>}

    {section==='communications'&&<div className="grid xl:grid-cols-3 gap-4">
      <Panel title="Smart Field Chat" subtitle="نص/صوت/صور/فيديو مع استخراج المؤشرات اليومية." icon={<MessageSquareText className="w-5 h-5"/>}>{v19.chat_threads.map(t=><div key={t.id} className="sov-thread"><div className="flex justify-between gap-2"><b className="text-xs text-white">{t.title}</b><Badge tone={t.priority==='emergency'?'red':t.priority==='high'?'amber':'slate'}>{t.priority}</Badge></div><p className="text-[11px] text-slate-400 mt-2">{t.ai_summary}</p><div className="flex flex-wrap gap-1.5 mt-3">{t.participants.map(p=><Badge key={p}>{p}</Badge>)}</div></div>)}</Panel>
      <Panel title="AI Data Parser" subtitle="يحوّل الصوت والنص إلى بيانات منظمة ولا يعتمد قراراً طبياً." icon={<Bot className="w-5 h-5"/>}>{v19.chat_messages.slice(0,6).map(m=><div key={m.id} className="sov-row"><div><b className="text-xs text-white">{m.sender_name}</b><div className="text-[10px] text-slate-400 mt-1">{m.transcript||m.text}</div><div className="flex flex-wrap gap-1 mt-2">{m.ai_extracted_fields?.map(f=><Badge key={f} tone="cyan">{f}</Badge>)}</div></div></div>)}</Panel>
      <Panel title="Emergency Consultation Engine" subtitle="تصعيد الحالات المعقدة إلى الاستشاريين مع قرار بشري نهائي." icon={<Users className="w-5 h-5"/>}>{v19.emergency_consultations.map(e=><div key={e.id} className="sov-row"><div><b className="text-xs text-white">{e.reason}</b><div className="text-[10px] text-slate-400 mt-1">{e.assigned_consultants.join('، ')}</div><div className="text-[10px] text-rose-300 mt-1">Human final decision required</div></div><Badge tone={e.severity==='critical'?'red':'amber'}>{e.status}</Badge></div>)}</Panel>
    </div>}

    {section==='commercial'&&<div className="space-y-4">
      <div className="grid xl:grid-cols-3 gap-4"><Panel title="Hatchery & Chicks Marketplace" subtitle="أسعار يومية متعددة العملات مع فحص ربحية النقل." icon={<Wheat className="w-5 h-5"/>}>{v19.chick_marketing_prices.map(p=><div key={p.id} className="sov-row"><div><b className="text-xs text-white">{p.hatchery_name} • {p.strain}</b><div className="text-[10px] text-slate-400 mt-1">{money(p.price_yer_old)} قديم • {money(p.price_yer_new)} جديد • {p.price_sar} ر.س</div><div className="text-[10px] text-slate-500 mt-1">متاح {money(p.available_quantity)} • نقل {money(p.freight_yer)}</div></div><Badge tone={p.finance_verified_profitable?'green':'red'}>{p.finance_verified_profitable?'مربح':'مراجعة'}</Badge></div>)}</Panel>
      <Panel title="Financial Policy & FX" subtitle="هامش الربح والعملات تحت تحكم الإدارة العليا." icon={<WalletCards className="w-5 h-5"/>}>{v19.financial_policy.map(r=><div key={r.id} className="sov-row"><div><b className="text-xs text-white">{r.scope}</b><div className="text-[10px] text-slate-400 mt-1">{r.profit_mode==='percent'?pct(r.profit_value):`${money(r.profit_value)} / وحدة`} • {r.currency}</div></div><Badge tone={r.active?'green':'slate'}>{r.active?'فعال':'متوقف'}</Badge></div>)}<div className="mt-3 border-t border-slate-800 pt-3">{v19.fx_rates.map(f=><div key={f.id} className="flex justify-between text-xs py-1"><span className="text-slate-400">{f.pair}</span><b className="text-cyan-300">{f.rate}</b></div>)}</div></Panel>
      <Panel title="Smart Escrow & Contracts" subtitle="إثبات التمويل وشروط الإفراج لمنع النزاعات." icon={<FileSignature className="w-5 h-5"/>}>{v19.escrow_contracts.map(e=><div key={e.id} className="sov-row"><div><b className="text-xs text-white">{e.contract_number}</b><div className="text-[10px] text-slate-400 mt-1">{e.party_a} ↔ {e.party_b}</div><div className="text-[10px] text-slate-500 mt-1">محتجز: {money(e.held_amount)} {e.currency}</div></div><Badge tone={e.status==='funded'?'green':'amber'}>{e.status}</Badge></div>)}</Panel></div>
      <div className="grid xl:grid-cols-2 gap-4"><Panel title="Proof of Delivery" subtitle="تأكيد الاستلام يولد مستند تسوية تلقائياً." icon={<PackageCheck className="w-5 h-5"/>}>{v19.proof_of_delivery.map(p=><div key={p.id} className="sov-row"><div><b className="text-xs text-white">{p.shipment_reference}</b><div className="text-[10px] text-slate-400 mt-1">{p.office_name} • المتوقع {money(p.expected_quantity)}</div></div>{p.status==='awaiting_arrival'?<button onClick={()=>confirmPod(p.id)} className="sov-btn">تأكيد الوصول</button>:<Badge tone="green">{p.status}</Badge>}</div>)}</Panel><Panel title="Financial Documents" subtitle="سند قبض/صرف وفواتير وتسويات POD." icon={<FileCheck2 className="w-5 h-5"/>}>{v19.financial_documents.slice(0,8).map(d=><div key={d.id} className="sov-row"><div><b className="text-xs text-white">{d.document_number}</b><div className="text-[10px] text-slate-400 mt-1">{d.counterparty} • {d.type}</div></div><div className="text-left"><b className="text-xs text-emerald-300">{money(d.gross_amount)}</b><div className="text-[9px] text-slate-500">{d.currency}</div></div></div>)}</Panel></div>
    </div>}

    {section==='ai'&&<div className="grid xl:grid-cols-2 gap-4">
      <Panel title="Digital Twin Simulator" subtitle="محاكاة وزن/FCR وهدر تشغيلي؛ ليست ضماناً للإنتاج." icon={<Activity className="w-5 h-5"/>} action={<button onClick={simulateTwin} className="sov-btn">محاكاة جديدة</button>}>{v19.digital_twins.slice(0,3).map(t=><div key={t.id} className="sov-ai-card"><div className="flex justify-between"><b className="text-white text-xs">{t.farm_name}</b><Badge tone="cyan">ثقة {t.confidence_percent}%</Badge></div><div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3"><span className="sov-proof">وزن 10 أيام<br/><b>{t.predicted_weight_10d_g} جم</b></span><span className="sov-proof">FCR<br/><b>{t.predicted_fcr_10d}</b></span><span className="sov-proof">توفير علف<br/><b>{money(t.projected_feed_saving_kg)} كجم</b></span><span className="sov-proof">أثر هامش<br/><b>{money(t.projected_margin_delta_yer)}</b></span></div><p className="text-[10px] text-slate-400 mt-3">{t.recommendation}</p></div>)}</Panel>
      <Panel title="Dynamic AI Pricing" subtitle="المحرك يقترح فقط، والنشر يحتاج اعتماد الإدارة." icon={<Coins className="w-5 h-5"/>} action={<button onClick={generatePrice} className="sov-btn">اقتراح جديد</button>}>{v19.dynamic_pricing.slice(0,5).map(p=><div key={p.id} className="sov-row"><div><b className="text-xs text-white">{p.governorate} • {p.category}</b><div className="text-[10px] text-slate-400 mt-1">{money(p.current_price)} → <span className="text-emerald-300 font-black">{money(p.suggested_price)}</span> {p.currency}</div><div className="text-[10px] text-slate-500 mt-1">طلب {p.demand_index} • عرض {p.supply_index} • نقل {p.transport_index}</div></div><button onClick={()=>patch({dynamic_pricing:v19.dynamic_pricing.map(x=>x.id===p.id?{...x,status:'approved'}:x)})}><Badge tone={p.status==='approved'?'green':'amber'}>{p.status}</Badge></button></div>)}</Panel>
      <Panel title="Predictive Bio-Radar" subtitle="يجمع الإشارات الميدانية والجغرافية ويصدر تحذيراً وقائياً، لا تشخيصاً." icon={<Waves className="w-5 h-5"/>}>{v19.epidemic_signals.map(s=><div key={s.id} className="sov-ai-card"><div className="flex justify-between"><b className="text-white text-xs">{s.disease_group}</b><Badge tone={s.status==='critical'?'red':'amber'}>{s.risk_score}/100</Badge></div><div className="text-[10px] text-slate-400 mt-2">{s.governorate}/{s.district} • نافذة {s.forecast_window_hours} ساعة • ثقة {s.confidence_percent}%</div><div className="flex flex-wrap gap-1 mt-2">{s.evidence_sources.map(x=><Badge key={x}>{x}</Badge>)}</div></div>)}</Panel>
      <Panel title="Voice AI & Corporate Advisor" subtitle="استخراج بيانات من اللهجة اليمنية + إشارات تخطيط للشركات." icon={<Bot className="w-5 h-5"/>}>{v19.voice_sessions.map(v=><div key={v.id} className="sov-row"><div><b className="text-xs text-white">{v.speaker_name} • {v.dialect}</b><div className="text-[10px] text-slate-400 mt-1">{v.transcript}</div><div className="text-[10px] text-cyan-300 mt-1">Intent: {v.extracted_intent}</div></div><Badge tone="green">{v.status}</Badge></div>)}<div className="border-t border-slate-800 mt-3 pt-3">{v19.investment_signals.map(i=><div key={i.id} className="sov-row"><div><b className="text-xs text-white">{i.governorate} • {i.category}</b><div className="text-[10px] text-slate-400 mt-1">فجوة طلب {pct(i.demand_gap_percent)} • توجيه {pct(i.recommended_allocation_percent)}</div><div className="text-[10px] text-slate-500 mt-1">{i.rationale}</div></div><ChevronLeft className="w-4 h-4 text-slate-600"/></div>)}</div></Panel>
    </div>}
  </div>;
};
