import React, { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, BadgeDollarSign, BellRing, Building2, Calculator, CheckCircle2,
  ChevronRight, ClipboardCheck, Crosshair, DollarSign, FileText, Gauge, GitBranch, HandCoins,
  HeartPulse, LocateFixed, MapPinned, MessageCircle, Navigation, PackageCheck, PhoneCall,
  RefreshCw, Route, Send, ShieldCheck, Target, TrendingUp, Truck, UserRound, Users, Wallet
} from 'lucide-react';
import { SmartOperationsState, AISmartBranchRouteV16, CommunicationMessageV16, FieldInspectionV16 } from '../../types';

interface Props {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

type Section = 'war_room' | 'governance_finance' | 'vendor_mesh' | 'crm' | 'field_force' | 'communications';

export const LeadershipCRMFieldV16Tab: React.FC<Props> = ({ operations, onUpdateOperations }) => {
  const enterprise = operations.enterprise;
  const [section, setSection] = useState<Section>('war_room');
  const [routingProduct, setRoutingProduct] = useState(enterprise.inventory_lots[0]?.product_name || '');
  const [routingCustomer, setRoutingCustomer] = useState(enterprise.customer_360_v16[0]?.customer_name || 'عميل جديد');
  const [routingGov, setRoutingGov] = useState(enterprise.customer_360_v16[0]?.governorate || 'صنعاء');
  const [routeMessage, setRouteMessage] = useState('');
  const [fieldMessage, setFieldMessage] = useState('');
  const [commMessage, setCommMessage] = useState('');

  const updateEnterprise = (patch: Partial<typeof enterprise>) => {
    onUpdateOperations({ ...operations, enterprise: { ...enterprise, ...patch } });
  };

  const kpis = useMemo(() => {
    const b = enterprise.branch_accounting_v16;
    return {
      revenue: b.reduce((s, x) => s + x.revenue_mtd_yer, 0),
      profit: b.reduce((s, x) => s + x.net_profit_mtd_yer, 0),
      receivables: b.reduce((s, x) => s + x.receivables_yer, 0),
      overdue: b.reduce((s, x) => s + x.debt_overdue_yer, 0),
      openAlerts: enterprise.owner_change_alerts_v16.filter(x => !x.acknowledged).length,
      onlineField: enterprise.field_staff_positions_v16.filter(x => x.movement_status !== 'offline').length,
      crmValue: enterprise.crm_opportunities_v16.filter(x => !['won','lost'].includes(x.stage)).reduce((s,x)=>s+x.expected_value_yer,0),
      pipelineWeighted: enterprise.crm_opportunities_v16.filter(x => !['won','lost'].includes(x.stage)).reduce((s,x)=>s+x.expected_value_yer*(x.probability_percent/100),0)
    };
  }, [enterprise]);

  const acknowledgeOwnerAlert = (id: string) => updateEnterprise({
    owner_change_alerts_v16: enterprise.owner_change_alerts_v16.map(x => x.id === id ? { ...x, acknowledged: true, acknowledged_at: new Date().toISOString() } : x)
  });

  const refreshWarRoom = () => {
    const branches = enterprise.owner_war_room_v16.branches.map(b => {
      const account = enterprise.branch_accounting_v16.find(x => x.branch_id === b.branch_id || x.branch_name === b.branch_name);
      return account ? { ...b, sales_today_yer: Math.round(account.revenue_mtd_yer / 15), collected_today_yer: Math.round((account.revenue_mtd_yer - account.receivables_yer) / 15) } : b;
    });
    updateEnterprise({ owner_war_room_v16: {
      ...enterprise.owner_war_room_v16,
      last_refreshed_at: new Date().toISOString(),
      sales_today_yer: branches.reduce((s,b)=>s+b.sales_today_yer,0),
      collected_today_yer: branches.reduce((s,b)=>s+b.collected_today_yer,0),
      active_field_staff: enterprise.field_staff_positions_v16.filter(x=>x.movement_status!=='offline').length,
      active_deliveries: enterprise.deliveries.filter(x=>!['delivered','failed'].includes(x.status)).length,
      open_critical_cases: operations.clinical_cases.filter(x=>!['closed'].includes(x.status) && ((x.mortality_today/(x.flock_size||1))*100)>0.1).length,
      epidemic_risk_regions: enterprise.outbreak_clusters.filter(x=>['high','critical'].includes(x.risk_level)).length,
      overdue_receivables_yer: kpis.overdue,
      branches
    }});
  };

  const postAutoJournal = () => {
    const order = enterprise.order_lifecycle.find(x => x.payment_status === 'paid');
    if (!order) return;
    const entry = {
      id:`je-${Date.now()}`, date:new Date().toISOString().slice(0,10), branch_name:order.branch_name,
      reference:order.invoice_number, debit_account:'الصندوق / البنك', credit_account:'إيرادات المبيعات',
      amount_yer:order.paid_amount_yer || order.total_amount_yer, description:`قيد آلي من ${order.invoice_number}`,
      created_by:'محرك القيود التلقائية V16', status:'posted' as const
    };
    updateEnterprise({ accounting_journal_v16:[entry, ...enterprise.accounting_journal_v16] });
  };

  const toggleRole = (id: string, field: 'active'|'requires_mfa') => updateEnterprise({
    governance_roles_v16: enterprise.governance_roles_v16.map(r => r.id===id ? { ...r, [field]: !r[field] } : r)
  });

  const setDiscount = (id: string, discount: number) => updateEnterprise({
    regional_pricing_rules_v16: enterprise.regional_pricing_rules_v16.map(r => r.id===id ? { ...r, discount_percent:Math.max(0,Math.min(100,discount)), net_price_yer:Math.round(r.base_price_yer*(1-Math.max(0,Math.min(100,discount))/100)) } : r)
  });

  const createSmartRoute = () => {
    const customer = enterprise.customer_360_v16.find(c => c.customer_name === routingCustomer);
    const candidates = enterprise.vendor_branches_v16.filter(b => b.active && (b.governorate === routingGov || !routingGov));
    const fallback = enterprise.vendor_branches_v16.filter(b => b.active);
    const list = candidates.length ? candidates : fallback;
    if (!list.length) { setRouteMessage('لا توجد فروع متعاقدة نشطة.'); return; }
    const scored = list.map(b => {
      const base = b.linked_platform_branch_id;
      const lot = enterprise.inventory_lots.find(l => l.branch_id === base && l.product_name === routingProduct) || enterprise.inventory_lots.find(l => l.branch_id === base);
      const stock = lot ? Math.max(0, lot.quantity_on_hand-lot.quantity_reserved) : 0;
      const regionPenalty = b.governorate === routingGov ? 0 : 120;
      return { b, stock, score: (stock>0?0:500)+regionPenalty };
    }).sort((a,b)=>a.score-b.score);
    const pick = scored[0];
    const route: AISmartBranchRouteV16 = {
      id:`route-${Date.now()}`, created_at:new Date().toISOString(), customer_name:routingCustomer,
      governorate:routingGov, district:customer?.district || 'غير محدد', prescribed_product:routingProduct,
      doctor_approval_reference:'يتطلب مرجع الطبيب إذا كان المنتج علاجياً/مضاداً', branch_id:pick.b.id,
      branch_name:pick.b.branch_name, company_name:pick.b.company_name, stock_available:pick.stock,
      eta_minutes: pick.b.governorate===routingGov ? 60 : 180,
      routing_reason: pick.stock>0 ? 'اختيار فرع نشط في المنطقة مع توفر مخزون. للأدوية العلاجية يعتمد التوجيه بعد اعتماد الطبيب.' : 'أقرب فرع متاح إدارياً، لكن المخزون يحتاج تأكيد/تحويل بين الفروع.',
      status:'suggested'
    };
    updateEnterprise({ ai_smart_routes_v16:[route, ...enterprise.ai_smart_routes_v16] });
    setRouteMessage(`تم ترشيح ${route.branch_name} — المخزون المتاح ${route.stock_available}.`);
  };

  const advanceOpportunity = (id:string) => {
    const order = ['lead','qualified','proposal','negotiation','won'] as const;
    updateEnterprise({ crm_opportunities_v16: enterprise.crm_opportunities_v16.map(o=>{
      if(o.id!==id || o.stage==='won'||o.stage==='lost') return o;
      const idx=order.indexOf(o.stage as any); return {...o, stage:order[Math.min(order.length-1,idx+1)]};
    })});
  };

  const queueCampaign = (id:string) => {
    const campaign=enterprise.targeted_campaigns_v16.find(c=>c.id===id); if(!campaign)return;
    const msg: CommunicationMessageV16={id:`comm-${Date.now()}`,created_at:new Date().toISOString(),channel:campaign.channels.includes('whatsapp')?'whatsapp':'push',recipient_name:'شريحة عملاء مستهدفة',audience_group:campaign.audience_rule,template_key:'campaign',subject:campaign.name,body:campaign.message,priority:'normal',status:enterprise.whatsapp_hub_v16.connection_status==='connected'?'queued':'simulation'};
    updateEnterprise({ targeted_campaigns_v16:enterprise.targeted_campaigns_v16.map(c=>c.id===id?{...c,status:'scheduled'}:c), communication_queue_v16:[msg,...enterprise.communication_queue_v16] });
  };

  const updateMyPosition = () => {
    if (!navigator.geolocation) { setFieldMessage('الموقع الجغرافي غير متاح على هذا الجهاز.'); return; }
    setFieldMessage('جارٍ قراءة GPS...');
    navigator.geolocation.getCurrentPosition(pos=>{
      const first=enterprise.field_staff_positions_v16[0]; if(!first)return;
      updateEnterprise({field_staff_positions_v16:enterprise.field_staff_positions_v16.map(x=>x.id===first.id?{...x,lat:pos.coords.latitude,lng:pos.coords.longitude,last_ping_at:new Date().toISOString(),movement_status:'on_site',geofence_valid:true}:x)});
      setFieldMessage(`تم تحديث موقع ${first.staff_name} بدقة تقريبية ${Math.round(pos.coords.accuracy)} متر.`);
    },()=>setFieldMessage('تعذر الحصول على إذن الموقع.'));
  };

  const createOfflineInspection = () => {
    const staff=enterprise.field_staff_positions_v16[0];
    const inspection: FieldInspectionV16={id:`insp-${Date.now()}`,visit_number:`VIS-${Date.now().toString().slice(-8)}`,staff_name:staff?.staff_name||'مشرف ميداني',farm_name:'زيارة ميدانية جديدة',customer_name:'عميل ميداني',governorate:'غير محدد',district:'غير محدد',checked_in_at:new Date().toISOString(),geofence_distance_m:0,geofence_verified:Boolean(staff?.geofence_valid),biosecurity_score_percent:0,media_urls:[],offline_created:!navigator.onLine,sync_status:navigator.onLine?'synced':'queued',inspection_items:[{label:'الأمن الحيوي',value:'بانتظار التعبئة',status:'warning'},{label:'الفرشة والتهوية',value:'بانتظار التعبئة',status:'warning'}]};
    updateEnterprise({field_inspections_v16:[inspection,...enterprise.field_inspections_v16]});
  };

  const toggleWhatsapp = () => updateEnterprise({ whatsapp_hub_v16:{...enterprise.whatsapp_hub_v16,enabled:!enterprise.whatsapp_hub_v16.enabled,provider:enterprise.whatsapp_hub_v16.provider==='not_configured'?'meta_cloud':enterprise.whatsapp_hub_v16.provider,api_mode:enterprise.whatsapp_hub_v16.api_mode==='simulation'?'simulation':enterprise.whatsapp_hub_v16.api_mode} });

  const queueCeoDigest = () => {
    const d=enterprise.ceo_daily_digests_v16[0]; if(!d)return;
    const msg:CommunicationMessageV16={id:`ceo-${Date.now()}`,created_at:new Date().toISOString(),channel:'whatsapp',recipient_name:'مالك النظام / CEO',audience_group:'system_owner',template_key:'ceo_daily_digest',subject:`الملخص القيادي ${d.date}`,body:d.summary_text,priority:d.critical_alerts_count?'high':'normal',status:enterprise.whatsapp_hub_v16.connection_status==='connected'?'queued':'simulation'};
    updateEnterprise({communication_queue_v16:[msg,...enterprise.communication_queue_v16],ceo_daily_digests_v16:enterprise.ceo_daily_digests_v16.map(x=>x.id===d.id?{...x,whatsapp_status:msg.status==='queued'?'queued':'simulation'}:x)});
    setCommMessage(msg.status==='simulation'?'تمت إضافة الملخص إلى محاكاة WhatsApp. الربط الحقيقي يحتاج API في الخادم.':'تم إدراج الملخص في طابور الإرسال.');
  };

  const sections:{id:Section;label:string;sub:string;icon:React.ReactNode}[]=[
    {id:'war_room',label:'غرفة سيادة المالك',sub:'مراقبة حية وتنبيهات',icon:<Gauge className="w-4 h-4"/>},
    {id:'governance_finance',label:'الحوكمة والمالية',sub:'أدوار • قيود • ذمم',icon:<ShieldCheck className="w-4 h-4"/>},
    {id:'vendor_mesh',label:'الشركات والفروع',sub:'أسعار إقليمية • توجيه',icon:<GitBranch className="w-4 h-4"/>},
    {id:'crm',label:'CRM والمبيعات',sub:'Customer 360 • Targets',icon:<Target className="w-4 h-4"/>},
    {id:'field_force',label:'القوة الميدانية',sub:'GPS • Geofence • تفتيش',icon:<Navigation className="w-4 h-4"/>},
    {id:'communications',label:'WhatsApp والاتصالات',sub:'فواتير • طوارئ • CEO',icon:<MessageCircle className="w-4 h-4"/>}
  ];

  return <div className="space-y-4" dir="rtl">
    <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-l from-emerald-950/80 via-slate-950 to-slate-900 p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3"><div><div className="text-xs text-emerald-300 font-bold">V16 • Enterprise Leadership & Field Commerce</div><h3 className="text-xl font-black text-white mt-1">القيادة المؤسسية • CRM • القوة الميدانية • شبكة الشركات • الاتصالات</h3><p className="text-xs text-slate-400 mt-1">التوجيه الدوائي الآلي لا يختار مضاداً مستقلاً؛ يوجّه المنتج/الخطة المعتمدة من الطبيب إلى أقرب مخزون متاح.</p></div><div className="flex gap-2 flex-wrap"><Badge ok={navigator.onLine}>الشبكة {navigator.onLine?'متصلة':'أوفلاين'}</Badge><Badge ok={enterprise.whatsapp_hub_v16.connection_status==='connected'}>WhatsApp {enterprise.whatsapp_hub_v16.connection_status}</Badge><Badge ok>{kpis.openAlerts} تنبيه مالك</Badge></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2 mt-4"><Kpi l="مبيعات الفروع MTD" v={`${money(kpis.revenue)} ر.ي`}/><Kpi l="صافي الربح MTD" v={`${money(kpis.profit)} ر.ي`}/><Kpi l="الذمم" v={`${money(kpis.receivables)} ر.ي`}/><Kpi l="المتأخر" v={`${money(kpis.overdue)} ر.ي`}/><Kpi l="الفريق الميداني" v={`${kpis.onlineField}`}/><Kpi l="قيمة Pipeline" v={`${money(kpis.crmValue)} ر.ي`}/><Kpi l="Weighted Pipeline" v={`${money(kpis.pipelineWeighted)} ر.ي`}/><Kpi l="تنبيهات غير مقروءة" v={`${kpis.openAlerts}`}/></div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">{sections.map(s=><button key={s.id} onClick={()=>setSection(s.id)} className={`rounded-2xl border p-3 text-right transition ${section===s.id?'bg-emerald-500 text-slate-950 border-emerald-300':'bg-slate-900/70 border-slate-800 text-slate-200 hover:border-slate-600'}`}><div className="flex gap-2 items-center font-black text-xs">{s.icon}{s.label}</div><div className="text-[10px] opacity-70 mt-1">{s.sub}</div></button>)}</div>

    {section==='war_room' && <div className="grid xl:grid-cols-[1.3fr_.7fr] gap-4">
      <Card title="1) Live Operations Map / War Room" icon={<MapPinned className="w-5 h-5"/>}><div className="flex justify-between gap-2 mb-3"><div className="text-xs text-slate-400">آخر تحديث: {fmt(enterprise.owner_war_room_v16.last_refreshed_at)}</div><button onClick={refreshWarRoom} className="mini"><RefreshCw className="w-3 h-3"/> تحديث</button></div><OperationsMap operations={operations}/><div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3"><Kpi l="مبيعات اليوم" v={`${money(enterprise.owner_war_room_v16.sales_today_yer)} ر.ي`}/><Kpi l="المحصل" v={`${money(enterprise.owner_war_room_v16.collected_today_yer)} ر.ي`}/><Kpi l="حالات حرجة" v={`${enterprise.owner_war_room_v16.open_critical_cases}`}/><Kpi l="مناطق خطر وبائي" v={`${enterprise.owner_war_room_v16.epidemic_risk_regions}`}/></div></Card>
      <Card title="تنبيهات السيادة" icon={<BellRing className="w-5 h-5"/>}>{enterprise.owner_change_alerts_v16.map(a=><div key={a.id} className={`box ${a.acknowledged?'opacity-50':''}`}><div className="flex justify-between gap-2"><Badge ok={a.severity==='info'}>{a.severity}</Badge><span className="text-[10px] text-slate-500">{fmt(a.created_at)}</span></div><div className="text-sm font-bold text-white mt-2">{a.action}</div><div className="text-[11px] text-slate-400">{a.actor_name} • {a.module} • {a.reference}</div>{!a.acknowledged&&<button onClick={()=>acknowledgeOwnerAlert(a.id)} className="mini mt-2"><CheckCircle2 className="w-3 h-3"/> تم الاطلاع</button>}</div>)}</Card>
    </div>}

    {section==='governance_finance' && <div className="space-y-4">
      <div className="grid xl:grid-cols-2 gap-4"><Card title="2) Multi-Tier Governance" icon={<Users className="w-5 h-5"/>}>{enterprise.governance_roles_v16.map(r=><div className="box" key={r.id}><div className="flex justify-between gap-2"><div><b className="text-sm text-white">{r.name}</b><div className="text-[11px] text-slate-500">{r.description}</div></div><button onClick={()=>toggleRole(r.id,'active')} className="mini">{r.active?'مفعّل':'موقوف'}</button></div><div className="flex flex-wrap gap-1 mt-2"><Badge ok={r.can_view_finance}>مالية</Badge><Badge ok={r.can_edit_prices}>تعديل سعر</Badge><Badge ok={r.can_approve_discounts}>خصومات</Badge><Badge ok={r.can_view_live_locations}>GPS</Badge><button onClick={()=>toggleRole(r.id,'requires_mfa')} className="text-[10px] px-2 py-1 rounded-full border border-slate-700">MFA {r.requires_mfa?'مطلوب':'اختياري'}</button></div></div>)}</Card>
      <Card title="3) المحاسبة والذمم" icon={<Calculator className="w-5 h-5"/>}><div className="grid grid-cols-2 gap-2 mb-3"><Kpi l="إجمالي النقدية" v={`${money(enterprise.branch_accounting_v16.reduce((s,x)=>s+x.cash_yer,0))} ر.ي`}/><Kpi l="إجمالي المخزون" v={`${money(enterprise.branch_accounting_v16.reduce((s,x)=>s+x.inventory_yer,0))} ر.ي`}/></div><button onClick={postAutoJournal} className="btn mb-3"><FileText className="w-4 h-4"/> إنشاء قيد تلقائي من طلب مدفوع</button>{enterprise.branch_accounting_v16.map(b=><div key={b.branch_id} className="box"><div className="font-bold text-sm text-white">{b.branch_name}</div><div className="grid grid-cols-2 text-xs gap-1 mt-2"><Info l="الإيرادات MTD" v={money(b.revenue_mtd_yer)}/><Info l="الربح" v={money(b.net_profit_mtd_yer)}/><Info l="الذمم" v={money(b.receivables_yer)}/><Info l="متأخر" v={money(b.debt_overdue_yer)}/></div></div>)}</Card></div>
      <Card title="P&L / Balance Snapshot المقارن" icon={<Wallet className="w-5 h-5"/>}><div className="grid md:grid-cols-2 gap-3">{enterprise.branch_accounting_v16.map(b=>{const assets=b.cash_yer+b.receivables_yer+b.inventory_yer;const liabilities=b.payables_yer;const equity=assets-liabilities;return <div key={b.branch_id} className="box"><b className="text-white text-sm">{b.branch_name}</b><div className="grid grid-cols-2 gap-1 mt-2"><Info l="الأصول التشغيلية" v={money(assets)}/><Info l="الالتزامات" v={money(liabilities)}/><Info l="صافي المركز" v={money(equity)}/><Info l="ربح MTD" v={money(b.net_profit_mtd_yer)}/><Info l="هامش الربح" v={`${b.revenue_mtd_yer?((b.net_profit_mtd_yer/b.revenue_mtd_yer)*100).toFixed(1):'0'}%`}/><Info l="ذمم متأخرة" v={money(b.debt_overdue_yer)}/></div></div>})}</div><p className="text-[10px] text-slate-500 mt-2">هذه لقطة تشغيلية للإدارة وليست قوائم مالية قانونية مدققة؛ النظام المحاسبي الإنتاجي يحتاج دليل حسابات وسياسة إقفال وفترات محاسبية.</p></Card>

      <Card title="آخر القيود اليومية" icon={<BadgeDollarSign className="w-5 h-5"/>}><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-slate-500"><th className="p-2 text-right">التاريخ</th><th>الفرع</th><th>المرجع</th><th>مدين</th><th>دائن</th><th>المبلغ</th><th>الحالة</th></tr></thead><tbody>{enterprise.accounting_journal_v16.slice(0,10).map(j=><tr className="border-t border-slate-800" key={j.id}><td className="p-2">{j.date}</td><td>{j.branch_name}</td><td>{j.reference}</td><td>{j.debit_account}</td><td>{j.credit_account}</td><td>{money(j.amount_yer)}</td><td><Badge ok={j.status==='posted'}>{j.status}</Badge></td></tr>)}</tbody></table></div></Card>
    </div>}

    {section==='vendor_mesh' && <div className="space-y-4">
      <div className="grid xl:grid-cols-2 gap-4"><Card title="4) Pharma / Feed / Equipment Branch Mesh" icon={<Building2 className="w-5 h-5"/>}>{enterprise.vendor_branches_v16.map(v=><div key={v.id} className="box"><div className="flex justify-between"><div><b className="text-white text-sm">{v.company_name}</b><div className="text-xs text-emerald-300">{v.branch_name}</div></div><Badge ok={v.active}>{v.active?'نشط':'موقوف'}</Badge></div><div className="text-[11px] text-slate-400 mt-2">{v.governorate} / {v.district} • {v.address} • {v.phone}</div></div>)}</Card>
      <Card title="5) Regional Pricing & Discounts" icon={<HandCoins className="w-5 h-5"/>}>{enterprise.regional_pricing_rules_v16.map(r=><div key={r.id} className="box"><div className="font-bold text-sm text-white">{r.product_name}</div><div className="text-[11px] text-slate-400">{r.company_name} • {r.governorate} • {r.customer_tier}</div><div className="grid grid-cols-[1fr_95px] gap-2 mt-2 items-center"><div className="text-xs"><span className="line-through text-slate-500">{money(r.base_price_yer)}</span> <b className="text-emerald-300">{money(r.net_price_yer)} ر.ي</b></div><input type="number" min="0" max="100" value={r.discount_percent} onChange={e=>setDiscount(r.id,Number(e.target.value))} className="input py-1"/></div></div>)}</Card></div>
      <Card title="6) AI Smart Routing — المنتج/العلاج المعتمد إلى أقرب مخزون" icon={<Route className="w-5 h-5"/>}><div className="grid md:grid-cols-4 gap-2"><select value={routingCustomer} onChange={e=>{setRoutingCustomer(e.target.value);const c=enterprise.customer_360_v16.find(x=>x.customer_name===e.target.value);if(c)setRoutingGov(c.governorate)}} className="input">{enterprise.customer_360_v16.map(c=><option key={c.id}>{c.customer_name}</option>)}</select><select value={routingProduct} onChange={e=>setRoutingProduct(e.target.value)} className="input">{Array.from(new Set(enterprise.inventory_lots.map(x=>x.product_name))).map(x=><option key={x}>{x}</option>)}</select><input value={routingGov} onChange={e=>setRoutingGov(e.target.value)} className="input" placeholder="المحافظة"/><button onClick={createSmartRoute} className="btn"><LocateFixed className="w-4 h-4"/> ترشيح الفرع</button></div>{routeMessage&&<div className="box mt-3 text-xs text-cyan-200">{routeMessage}</div>}<p className="text-[11px] text-amber-300 mt-2">المضادات/العلاجات المقيدة لا يختارها AI من تلقاء نفسه؛ المسار يبدأ بعد وصفة/اعتماد الطبيب، ثم يحدد الفرع المتاح والأجرة والزمن.</p>{enterprise.ai_smart_routes_v16.slice(0,5).map(r=><div key={r.id} className="box mt-2 text-xs"><b>{r.customer_name}</b> ← {r.prescribed_product} ← <span className="text-emerald-300">{r.branch_name}</span> • مخزون {r.stock_available} • ETA {r.eta_minutes} دقيقة</div>)}</Card>
    </div>}

    {section==='crm' && <div className="grid xl:grid-cols-2 gap-4">
      <Card title="7) Customer 360" icon={<UserRound className="w-5 h-5"/>}>{enterprise.customer_360_v16.map(c=><div key={c.id} className="box"><div className="flex justify-between"><div><b className="text-white">{c.customer_name}</b><div className="text-xs text-slate-400">{c.phone} • {c.governorate}/{c.district}</div></div><Badge ok={c.customer_tier!=='standard'}>{c.customer_tier}</Badge></div><div className="grid grid-cols-2 gap-1 mt-2"><Info l="مبيعات تاريخية" v={money(c.lifetime_sales_yer)}/><Info l="الدين" v={money(c.outstanding_debt_yer)}/><Info l="قطعان نشطة" v={`${c.active_flocks}`}/><Info l="المندوب" v={c.assigned_sales_rep||'-'}/></div><div className="text-[11px] text-slate-500 mt-2">حالات سابقة: {c.previous_disease_events.join(' • ')}</div></div>)}</Card>
      <Card title="8) Sales Pipeline & Targets" icon={<TrendingUp className="w-5 h-5"/>}>{enterprise.crm_opportunities_v16.map(o=><div key={o.id} className="box"><div className="flex justify-between"><div><b className="text-white text-sm">{o.title}</b><div className="text-[11px] text-slate-400">{o.customer_name} • {o.owner_name}</div></div><Badge ok={o.stage==='won'}>{o.stage}</Badge></div><div className="flex justify-between text-xs mt-2"><span>{money(o.expected_value_yer)} ر.ي</span><span>{o.probability_percent}%</span></div><div className="text-[11px] text-cyan-200 mt-1">التالي: {o.next_action}</div>{!['won','lost'].includes(o.stage)&&<button onClick={()=>advanceOpportunity(o.id)} className="mini mt-2">تقدم المرحلة <ChevronRight className="w-3 h-3"/></button>}</div>)}<div className="mt-4 border-t border-slate-800 pt-3">{enterprise.sales_targets_v16.map(t=><div key={t.id} className="mb-3"><div className="flex justify-between text-xs"><b>{t.rep_name} — {t.region}</b><span>{Math.round((t.achieved_yer/t.target_yer)*100)}%</span></div><div className="h-2 bg-slate-800 rounded-full mt-1"><div className="h-2 bg-emerald-500 rounded-full" style={{width:`${Math.min(100,(t.achieved_yer/t.target_yer)*100)}%`}}/></div></div>)}</div></Card>
      <Card title="9) Targeted Campaigns" icon={<Send className="w-5 h-5"/>}>{enterprise.targeted_campaigns_v16.map(c=><div key={c.id} className="box"><div className="flex justify-between"><b className="text-sm text-white">{c.name}</b><Badge ok={c.status==='sent'}>{c.status}</Badge></div><div className="text-[11px] text-slate-400 mt-1">{c.audience_rule} • {c.target_count} مستهدف</div><div className="text-xs mt-2">{c.message}</div><button onClick={()=>queueCampaign(c.id)} className="mini mt-2"><Send className="w-3 h-3"/> اعتماد/جدولة</button></div>)}</Card>
      <Card title="سياسة البيع المسؤول" icon={<HeartPulse className="w-5 h-5"/>}><div className="space-y-2 text-xs text-slate-300"><p className="box">البيع يبدأ بفهم احتياج القطيع والعمر والوزن والمنطقة، وليس دفع العميل لشراء صنف غير ضروري.</p><p className="box">العروض الصحية لا تستغل الخوف من المرض، والمضادات الحيوية تحتاج قرار الطبيب وفترة سحب واضحة.</p><p className="box">التوعية تشرح مخاطر الاستخدام العشوائي: المقاومة البكتيرية، فشل السيطرة، بقايا الدواء وخسارة التسويق.</p></div></Card>
    </div>}

    {section==='field_force' && <div className="space-y-4">
      <div className="grid xl:grid-cols-2 gap-4"><Card title="10) Field Force GPS Tracking" icon={<Navigation className="w-5 h-5"/>}><div className="flex gap-2 mb-3"><button onClick={updateMyPosition} className="btn"><Crosshair className="w-4 h-4"/> تحديث GPS للجهاز الحالي</button><button onClick={createOfflineInspection} className="btn"><ClipboardCheck className="w-4 h-4"/> بدء تفتيش جديد</button></div>{fieldMessage&&<div className="box text-xs text-cyan-200 mb-2">{fieldMessage}</div>}{enterprise.field_staff_positions_v16.map(p=><div key={p.id} className="box"><div className="flex justify-between"><div><b className="text-sm text-white">{p.staff_name}</b><div className="text-[11px] text-slate-400">{p.staff_role} • {p.phone}</div></div><Badge ok={p.geofence_valid}>{p.movement_status}</Badge></div><div className="text-[11px] mt-2 text-cyan-200">GPS {p.lat.toFixed(4)}, {p.lng.toFixed(4)} • {p.assigned_route}</div></div>)}</Card>
      <Card title="11) Digital Inspection Forms" icon={<ClipboardCheck className="w-5 h-5"/>}>{enterprise.field_inspections_v16.slice(0,6).map(v=><div key={v.id} className="box"><div className="flex justify-between"><div><b className="text-white text-sm">{v.visit_number}</b><div className="text-[11px] text-slate-400">{v.farm_name} • {v.staff_name}</div></div><Badge ok={v.geofence_verified}>{v.sync_status}</Badge></div><div className="grid grid-cols-2 gap-1 mt-2"><Info l="Geofence" v={`${v.geofence_distance_m}m`}/><Info l="Biosecurity" v={`${v.biosecurity_score_percent}%`}/></div>{v.inspection_items.map((i,idx)=><div key={idx} className="text-[11px] mt-1"><span className={i.status==='ok'?'text-emerald-300':i.status==='critical'?'text-rose-300':'text-amber-300'}>●</span> {i.label}: {i.value}</div>)}</div>)}</Card></div>
      <Card title="12) Offline Field Mode" icon={<PackageCheck className="w-5 h-5"/>}><div className="grid grid-cols-2 md:grid-cols-4 gap-2"><Kpi l="IndexedDB" v={enterprise.offline_sync_v15.indexeddb_enabled?'مفعّل':'موقوف'}/><Kpi l="Pending Actions" v={`${enterprise.offline_sync_v15.pending_actions}`}/><Kpi l="Pending Media" v={`${enterprise.offline_sync_v15.pending_media}`}/><Kpi l="Conflict Strategy" v={enterprise.offline_sync_v15.conflict_strategy}/></div></Card>
    </div>}

    {section==='communications' && <div className="grid xl:grid-cols-2 gap-4">
      <Card title="13) WhatsApp & Communication Hub" icon={<MessageCircle className="w-5 h-5"/>}><div className="grid grid-cols-2 gap-2"><Kpi l="Provider" v={enterprise.whatsapp_hub_v16.provider}/><Kpi l="Status" v={enterprise.whatsapp_hub_v16.connection_status}/><Kpi l="CEO Digest" v={enterprise.whatsapp_hub_v16.ceo_digest_time}/><Kpi l="الوضع" v={enterprise.whatsapp_hub_v16.api_mode}/></div><div className="flex gap-2 mt-3"><button onClick={toggleWhatsapp} className="btn"><MessageCircle className="w-4 h-4"/> {enterprise.whatsapp_hub_v16.enabled?'إيقاف':'تفعيل'} المركز</button><button onClick={queueCeoDigest} className="btn"><Send className="w-4 h-4"/> إرسال ملخص المالك</button></div>{commMessage&&<div className="box mt-3 text-xs text-cyan-200">{commMessage}</div>}<p className="text-[11px] text-slate-500 mt-3">المفتاح السري لا يُحفظ في التطبيق. الربط الحقيقي يتم من Backend عبر WhatsApp Business/Cloud API أو مزود معتمد.</p></Card>
      <Card title="14) قنوات الإرسال التلقائي" icon={<PhoneCall className="w-5 h-5"/>}>{enterprise.communication_queue_v16.slice(0,10).map(m=><div key={m.id} className="box"><div className="flex justify-between"><div><b className="text-white text-sm">{m.subject}</b><div className="text-[11px] text-slate-500">{m.recipient_name} • {m.channel}</div></div><Badge ok={m.status==='sent'||m.status==='delivered'}>{m.status}</Badge></div><div className="text-xs mt-2">{m.body}</div></div>)}</Card>
      <Card title="15) Daily CEO WhatsApp Digest" icon={<Wallet className="w-5 h-5"/>}>{enterprise.ceo_daily_digests_v16.map(d=><div key={d.id} className="box"><div className="flex justify-between"><b>{d.date}</b><Badge ok={d.whatsapp_status==='sent'}>{d.whatsapp_status}</Badge></div><div className="text-xs mt-2 text-slate-300">{d.summary_text}</div><div className="grid grid-cols-2 gap-1 mt-2"><Info l="المبيعات" v={money(d.gross_sales_yer)}/><Info l="المحصل" v={money(d.collected_yer)}/><Info l="زيارات" v={`${d.field_visits_count}`}/><Info l="تنبيهات حرجة" v={`${d.critical_alerts_count}`}/></div></div>)}</Card>
      <Card title="جاهزية التكامل" icon={<AlertTriangle className="w-5 h-5"/>}><div className="text-xs space-y-2"><p className="box"><b className="text-emerald-300">جاهز برمجياً:</b> قوالب الفواتير/السندات، طابور الرسائل، رسائل الطوارئ، ملخص CEO، دليل الفريق.</p><p className="box"><b className="text-amber-300">يحتاج اتصال خارجي:</b> حساب WhatsApp Business، API credentials على الخادم، webhook وحالة التسليم.</p></div></Card>
    </div>}
  </div>;
};

const Card:React.FC<{title:string;icon?:React.ReactNode;children:React.ReactNode}>=({title,icon,children})=><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg"><div className="flex gap-2 items-center text-white font-black mb-3">{icon}<h4>{title}</h4></div>{children}</section>;
const Kpi:React.FC<{l:string;v:string}>=({l,v})=><div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3"><div className="text-[10px] text-slate-500">{l}</div><div className="text-sm font-black text-emerald-300 mt-1 break-words">{v}</div></div>;
const Info:React.FC<{l:string;v:string}>=({l,v})=><div className="flex justify-between gap-2 border-b border-slate-800 py-1"><span className="text-slate-500">{l}</span><b className="text-slate-200">{v}</b></div>;
const Badge:React.FC<{children:React.ReactNode;ok?:boolean}>=({children,ok})=><span className={`px-2 py-1 rounded-full text-[10px] border ${ok?'text-emerald-300 border-emerald-500/30 bg-emerald-500/10':'text-amber-300 border-amber-500/30 bg-amber-500/10'}`}>{children}</span>;
function money(v:number){return Math.round(v||0).toLocaleString('en-US');}
function fmt(v?:string){if(!v)return '-';try{return new Date(v).toLocaleString('ar-YE',{hour12:false})}catch{return v}}

const OperationsMap:React.FC<{operations:SmartOperationsState}>=({operations})=>{
  const points=[...operations.enterprise.owner_war_room_v16.branches.map(b=>({name:b.branch_name,lat:b.lat,lng:b.lng,type:'branch'})),...operations.enterprise.field_staff_positions_v16.map(p=>({name:p.staff_name,lat:p.lat,lng:p.lng,type:p.staff_role}))];
  const lats=points.map(p=>p.lat), lngs=points.map(p=>p.lng); const minLat=Math.min(...lats),maxLat=Math.max(...lats),minLng=Math.min(...lngs),maxLng=Math.max(...lngs); const latSpan=maxLat-minLat||1,lngSpan=maxLng-minLng||1;
  return <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative h-72"><div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(#334155 1px,transparent 1px),linear-gradient(90deg,#334155 1px,transparent 1px)',backgroundSize:'32px 32px'}}/><svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full">{points.map((p,i)=>{const x=6+((p.lng-minLng)/lngSpan)*88;const y=54-((p.lat-minLat)/latSpan)*48;return <g key={i}><circle cx={x} cy={y} r={p.type==='branch'?2.4:1.6} className={p.type==='branch'?'fill-amber-400':'fill-emerald-400'}/><text x={x+2.5} y={y+1} fontSize="2.5" className="fill-slate-200">{p.name.slice(0,18)}</text></g>})}</svg><div className="absolute bottom-2 right-2 text-[10px] bg-slate-900/90 rounded-lg px-2 py-1 text-slate-400">مخطط جغرافي تشغيلي من GPS المسجل • الخرائط الطرقية الفعلية تحتاج Maps API</div></div>
};
