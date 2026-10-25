import React, { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, BarChart3, BellRing, Bot, Boxes, BriefcaseBusiness,
  Building2, CalendarClock, CheckCircle2, ClipboardCheck, Cloud, Cpu, FileSignature,
  Gauge, HandCoins, HardDrive, HeartPulse, Mail, MapPin, PackagePlus, Radio,
  RefreshCw, Save, ShieldCheck, Smartphone, Truck, UserCheck, Users, WalletCards,
  Wifi, Wrench, Zap
} from 'lucide-react';
import {
  SmartOperationsState,
  FarmManagementContractV13,
  DailyExecutiveReportV13,
  ExpenseApprovalV13,
  PayrollRecordV13,
  PoultrySalesLotV13,
  AutoReorderRuleV13,
  IoTSensorDeviceV13,
  DigitalContractSignatureV13,
  ProfitSharingSettlementV13
} from '../../types';

interface Props {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

type Section = 'readiness' | 'contracts' | 'reports' | 'hr' | 'marketing' | 'transparency' | 'predictive' | 'supply' | 'iot' | 'legal';
const money = (n: number) => new Intl.NumberFormat('ar-YE').format(Math.round(Number(n) || 0));
const today = () => new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString();

const statusTone: Record<string, string> = {
  production_ready: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  configured: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  local_prototype: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  blocked_external: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  active: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  approved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  paid: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  sent: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  signed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  pending_owner: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  draft: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  not_connected: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  online: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

export const FarmManagementAutomationV13Tab: React.FC<Props> = ({ operations, onUpdateOperations }) => {
  const [section, setSection] = useState<Section>('readiness');
  const enterprise = operations.enterprise;

  const patchEnterprise = (patch: Partial<typeof enterprise>) => {
    onUpdateOperations({ ...operations, enterprise: { ...enterprise, ...patch } });
  };

  const activeContract = enterprise.farm_management_contracts_v13.find(c => c.status === 'active') || enterprise.farm_management_contracts_v13[0];
  const stats = useMemo(() => ({
    activeContracts: enterprise.farm_management_contracts_v13.filter(x => x.status === 'active').length,
    pendingExpenses: enterprise.expense_approvals_v13.filter(x => x.status === 'pending_owner').length,
    payrollDrafts: enterprise.payroll_records_v13.filter(x => x.status !== 'paid').length,
    iotOnline: enterprise.iot_sensors_v13.filter(x => x.status === 'online').length,
    externalBlocks: enterprise.deployment_readiness_v13.filter(x => x.status !== 'production_ready').length,
  }), [enterprise]);

  const tabs: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id:'readiness', label:'الجاهزية والهوية', icon:<Cloud className="w-4 h-4"/> },
    { id:'contracts', label:'إدارة المزارع', icon:<Building2 className="w-4 h-4"/> },
    { id:'reports', label:'التقارير اليومية', icon:<ClipboardCheck className="w-4 h-4"/> },
    { id:'hr', label:'الحضور والرواتب', icon:<Users className="w-4 h-4"/> },
    { id:'marketing', label:'التسويق والتوزيع', icon:<Truck className="w-4 h-4"/> },
    { id:'transparency', label:'الشفافية والموافقات', icon:<ShieldCheck className="w-4 h-4"/> },
    { id:'predictive', label:'AI التنبؤي', icon:<Bot className="w-4 h-4"/> },
    { id:'supply', label:'الإمداد والموردون', icon:<Boxes className="w-4 h-4"/> },
    { id:'iot', label:'IoT والتفتيش', icon:<Cpu className="w-4 h-4"/> },
    { id:'legal', label:'العقود والتصفية', icon:<FileSignature className="w-4 h-4"/> },
  ];

  const addManagementContract = () => {
    const item: FarmManagementContractV13 = {
      id:`fmc-${Date.now()}`, contract_number:`MGT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      customer_name:'عميل جديد', phone:'', farm_name:'مزرعة جديدة', governorate:'صنعاء', district:'', management_mode:'full_management', status:'draft',
      start_date:today(), end_date:`${new Date().getFullYear()+1}-${today().slice(5)}`, hangars_count:1, flock_size:10000, service_fee_yer:0,
      responsible_vet_name:'يحدد من الإدارة', responsible_supervisor_name:'يحدد من الإدارة', hr_manager_name:'مسؤول الموارد البشرية', marketing_manager_name:'مدير التسويق', daily_report_time:'20:00', report_channels:['app'], owner_approval_threshold_yer:250000,
      client_portal_permissions:{view_daily_reports:true,view_financials:true,view_activity_stream:true,approve_large_expenses:true,operational_editing:false}, liability_terms:'تراجع وتثبت في العقد قبل التفعيل.', performance_bonus_mode:'none', performance_bonus_value:0
    };
    patchEnterprise({ farm_management_contracts_v13:[item, ...enterprise.farm_management_contracts_v13] });
  };

  const updateManagementContract = (id:string, patch:Partial<FarmManagementContractV13>) => patchEnterprise({
    farm_management_contracts_v13: enterprise.farm_management_contracts_v13.map(x => x.id===id ? {...x,...patch} : x)
  });

  const generateDailyReport = () => {
    if (!activeContract) return;
    const latest = enterprise.daily_executive_reports_v13.find(r => r.contract_id === activeContract.id);
    const report: DailyExecutiveReportV13 = {
      id:`der-${Date.now()}`, contract_id:activeContract.id, date:today(), generated_at:now(),
      average_weight_grams:latest?.average_weight_grams || 1000, feed_kg:latest?.feed_kg || Math.round(activeContract.flock_size * 0.09), water_liters:latest?.water_liters || Math.round(activeContract.flock_size * 0.18),
      daily_mortality_count:latest?.daily_mortality_count || 0, cumulative_mortality_percent:latest?.cumulative_mortality_percent || 0, fcr:latest?.fcr || 1.6,
      health_summary:'تم إنشاء الملخص التنفيذي من بيانات التشغيل المتاحة. يحتاج اعتماد الطبيب إذا احتوى قراراً طبياً.', vet_recommendation:'مراجعة الطبيب المسؤول قبل أي قرار علاجي أو تغيير بروتوكول.', daily_expenses_yer:0, daily_sales_yer:0,
      alert_level:'normal', pdf_status:'generated', delivery_channels:activeContract.report_channels, delivery_status:'queued'
    };
    patchEnterprise({
      daily_executive_reports_v13:[report, ...enterprise.daily_executive_reports_v13],
      farm_activity_stream_v13:[{id:`act-${Date.now()}`,contract_id:activeContract.id,at:now(),actor_name:'النظام',actor_role:'Automated Daily Reports',category:'system',action:`تم إنشاء التقرير التنفيذي اليومي ${today()} وجدولته للقنوات: ${activeContract.report_channels.join('، ')}`,evidence_urls:[],immutable:true},...enterprise.farm_activity_stream_v13]
    });
  };

  const markReportSent = (id:string) => patchEnterprise({ daily_executive_reports_v13:enterprise.daily_executive_reports_v13.map(r => r.id===id ? {...r,delivery_status:'sent'} : r) });

  const setPayrollStatus = (id:string, status:PayrollRecordV13['status']) => patchEnterprise({ payroll_records_v13:enterprise.payroll_records_v13.map(p => p.id===id ? {...p,status} : p) });
  const setExpenseStatus = (id:string, status:ExpenseApprovalV13['status']) => patchEnterprise({ expense_approvals_v13:enterprise.expense_approvals_v13.map(e => e.id===id ? {...e,status,decided_at:now()} : e) });
  const setSalesStatus = (id:string, patch:Partial<PoultrySalesLotV13>) => patchEnterprise({ poultry_sales_lots_v13:enterprise.poultry_sales_lots_v13.map(s => s.id===id ? {...s,...patch} : s) });

  const runPredictiveUpdate = () => {
    const current = enterprise.predictive_forecasts_v13[0];
    if (!current) return;
    const age = current.age_days + 1;
    const dailyGain = Math.max(45, Math.round((current.predicted_weight_7d_grams-current.current_average_weight_grams)/7));
    const next = {...current,id:`forecast-${Date.now()}`,generated_at:now(),age_days:age,current_average_weight_grams:current.current_average_weight_grams+dailyGain,predicted_weight_3d_grams:current.current_average_weight_grams+dailyGain*4,predicted_weight_7d_grams:current.current_average_weight_grams+dailyGain*8,confidence_percent:Math.min(92,current.confidence_percent+1)};
    patchEnterprise({ predictive_forecasts_v13:[next,...enterprise.predictive_forecasts_v13] });
  };

  const triggerReorder = (rule:AutoReorderRuleV13) => patchEnterprise({
    auto_reorder_rules_v13:enterprise.auto_reorder_rules_v13.map(r => r.id===rule.id ? {...r,last_triggered_at:now(),draft_purchase_request_status:'ready_for_approval'} : r),
    pending_approvals:[{id:`appr-reorder-${Date.now()}`,created_at:now(),requested_by:'Auto-Reorder Engine',category:'product',title:`اعتماد طلب إعادة شراء ${rule.item_name} — ${rule.reorder_quantity} ${rule.unit}`,risk:'normal',status:'pending'},...enterprise.pending_approvals]
  });

  const updateSensor = (id:string, patch:Partial<IoTSensorDeviceV13>) => patchEnterprise({ iot_sensors_v13:enterprise.iot_sensors_v13.map(s => {
    if (s.id!==id) return s;
    const next={...s,...patch};
    const above = next.max_threshold !== undefined && next.last_value > next.max_threshold;
    const below = next.min_threshold !== undefined && next.last_value < next.min_threshold;
    return {...next, alert_active:above||below, last_read_at:now()};
  }) });

  const signContract = (sig:DigitalContractSignatureV13) => patchEnterprise({ digital_contract_signatures_v13:enterprise.digital_contract_signatures_v13.map(s => s.id===sig.id ? {...s,status:'signed',signed_at:now(),note:'توقيع Clickwrap تجريبي داخل النموذج. OTP/التوقيع القانوني الفعلي يحتاج مزود مصادقة وتوثيق.'} : s) });

  const recalcSettlement = (item:ProfitSharingSettlementV13) => {
    const costs=item.feed_cost_yer+item.chick_cost_yer+item.medicine_vaccine_cost_yer+item.payroll_cost_yer+item.logistics_cost_yer+item.other_cost_yer;
    const net=Math.max(0,item.gross_sales_yer-costs);
    const customer=Math.round(net*item.customer_share_percent/100);
    const platform=Math.round(net*item.platform_share_percent/100);
    patchEnterprise({ profit_sharing_settlements_v13:enterprise.profit_sharing_settlements_v13.map(x => x.id===item.id ? {...x,net_profit_yer:net,customer_share_yer:customer,platform_share_yer:platform} : x) });
  };

  return <div className="space-y-5">
    <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-l from-[#0A5C36]/30 via-slate-950/80 to-[#D4AF37]/10 p-5 shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div><div className="flex items-center gap-2"><BriefcaseBusiness className="w-5 h-5 text-amber-300"/><h3 className="text-lg font-black text-white">إدارة المزارع والأتمتة والتنبؤ V13</h3></div><p className="text-xs text-slate-300 mt-1 max-w-3xl">عقود الإدارة الشاملة، بوابة العميل، التقارير اليومية، HR/Payroll، التسويق، الشفافية، Predictive AI، سلاسل الإمداد، IoT والعقود الرقمية. ما يحتاج خدمة خارجية يبقى موسوماً بوضوح ولا يُقدّم كاتصال إنتاجي حقيقي.</p></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-[10px]">
          <Stat label="عقود نشطة" value={stats.activeContracts}/><Stat label="موافقات عميل" value={stats.pendingExpenses}/><Stat label="رواتب معلقة" value={stats.payrollDrafts}/><Stat label="IoT متصل" value={stats.iotOnline}/><Stat label="متطلبات إنتاج" value={stats.externalBlocks}/>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto mt-5 pb-1">{tabs.map(t=><button key={t.id} onClick={()=>setSection(t.id)} className={`shrink-0 px-3 py-2 rounded-xl border text-[11px] font-black flex items-center gap-2 ${section===t.id?'bg-emerald-500 text-slate-950 border-emerald-400':'bg-slate-950/60 text-slate-300 border-slate-800'}`}>{t.icon}{t.label}</button>)}</div>
    </div>

    {section==='readiness' && <div className="space-y-4">
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">{enterprise.deployment_readiness_v13.map(x=><div key={x.id} className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-950/55"><div className="flex items-center justify-between gap-2"><div className="font-black text-sm text-white">{x.area}</div><Badge text={x.status}/></div><div className="text-[11px] text-cyan-300 mt-2">الحالي: {x.current_mode}</div><div className="text-[10px] text-slate-400 mt-2 leading-relaxed">للإنتاج: {x.production_requirement}</div></div>)}</div>
      <div className="grid lg:grid-cols-2 gap-4"><div className="box"><div className="font-black text-white mb-3 flex gap-2"><Gauge className="w-4 h-4 text-amber-300"/>الهوية البصرية</div><div className="grid grid-cols-2 sm:grid-cols-4 gap-2"><ColorBox label="Primary" value={enterprise.ui_design_v13.primary_hex}/><ColorBox label="Accent" value={enterprise.ui_design_v13.accent_hex}/><ColorBox label="Light" value={enterprise.ui_design_v13.light_background_hex}/><ColorBox label="Dark" value={enterprise.ui_design_v13.dark_background_hex}/></div><div className="grid grid-cols-2 gap-2 mt-3">{(['glassmorphism_enabled','soft_material_enabled','auto_dark_mode','mobile_bottom_navigation','micro_interactions_enabled'] as const).map(k=><div key={k}><Toggle label={k.replaceAll('_',' ')} checked={Boolean(enterprise.ui_design_v13[k])} onChange={()=>patchEnterprise({ui_design_v13:{...enterprise.ui_design_v13,[k]:!enterprise.ui_design_v13[k]}})}/></div>)}</div></div><div className="box"><div className="font-black text-white mb-2">مبدأ الإطلاق</div><p className="text-[11px] text-slate-300 leading-relaxed">النسخة الحالية Working Prototype مؤسسية. تشغيل عدة مستخدمين من محافظات مختلفة يحتاج قاعدة بيانات سحابية، Auth/RBAC خادمي، Object Storage، FCM وتكاملات الدفع. الواجهة تعرض هذه الفجوات صراحةً للإدارة ولا تخفيها.</p></div></div>
    </div>}

    {section==='contracts' && <div className="space-y-3"><div className="flex justify-between"><div className="text-sm font-black text-white">عقود الإدارة الكاملة / الإدارة الذاتية</div><button onClick={addManagementContract} className="btn">+ عقد إدارة</button></div>{enterprise.farm_management_contracts_v13.map(c=><div key={c.id} className="box space-y-3"><div className="flex flex-col md:flex-row justify-between gap-2"><div><div className="font-black text-white">{c.contract_number} • {c.farm_name}</div><div className="text-[10px] text-slate-400">{c.customer_name} • {c.phone} • {c.governorate}/{c.district}</div></div><Badge text={c.status}/></div><div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-2"><Text label="الطبيب" value={c.responsible_vet_name} onChange={v=>updateManagementContract(c.id,{responsible_vet_name:v})}/><Text label="المشرف" value={c.responsible_supervisor_name} onChange={v=>updateManagementContract(c.id,{responsible_supervisor_name:v})}/><Num label="الهناجر" value={c.hangars_count} onChange={v=>updateManagementContract(c.id,{hangars_count:v})}/><Num label="القطيع" value={c.flock_size} onChange={v=>updateManagementContract(c.id,{flock_size:v})}/><Num label="قيمة العقد" value={c.service_fee_yer} onChange={v=>updateManagementContract(c.id,{service_fee_yer:v})}/><Num label="حد اعتماد المالك" value={c.owner_approval_threshold_yer} onChange={v=>updateManagementContract(c.id,{owner_approval_threshold_yer:v})}/></div><div className="grid sm:grid-cols-3 gap-2"><label className="field"><span>نمط الإدارة</span><select value={c.management_mode} onChange={e=>updateManagementContract(c.id,{management_mode:e.target.value as FarmManagementContractV13['management_mode']})}><option value="full_management">إدارة شاملة</option><option value="self_managed">إدارة ذاتية</option></select></label><Text label="وقت التقرير اليومي" value={c.daily_report_time} type="time" onChange={v=>updateManagementContract(c.id,{daily_report_time:v})}/><label className="field"><span>حالة العقد</span><select value={c.status} onChange={e=>updateManagementContract(c.id,{status:e.target.value as FarmManagementContractV13['status']})}><option value="draft">مسودة</option><option value="active">نشط</option><option value="paused">متوقف</option><option value="completed">مكتمل</option><option value="cancelled">ملغي</option></select></label></div><div className="rounded-xl bg-emerald-950/20 border border-emerald-800/30 p-3 text-[10px] text-slate-300">بوابة العميل: تقارير {c.client_portal_permissions.view_daily_reports?'✓':'×'} • مالية {c.client_portal_permissions.view_financials?'✓':'×'} • سجل نشاط {c.client_portal_permissions.view_activity_stream?'✓':'×'} • اعتماد مصروفات {c.client_portal_permissions.approve_large_expenses?'✓':'×'} • تعديل التشغيل {c.client_portal_permissions.operational_editing?'✓':'ممنوع في الإدارة الشاملة'}</div></div>)}</div>}

    {section==='reports' && <div className="space-y-3"><div className="flex justify-between items-center"><div><div className="text-sm font-black text-white">Automated Daily Executive Reports</div><div className="text-[10px] text-slate-400">App فعلي محلياً؛ WhatsApp/Email يحتاجان API خارجي.</div></div><button onClick={generateDailyReport} className="btn"><RefreshCw className="w-4 h-4"/>إنشاء تقرير الآن</button></div>{enterprise.daily_executive_reports_v13.map(r=><div key={r.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{r.date} • وزن {r.average_weight_grams} جم • FCR {r.fcr}</div><Badge text={r.delivery_status}/></div><div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3"><Info label="العلف" value={`${money(r.feed_kg)} كجم`}/><Info label="الماء" value={`${money(r.water_liters)} لتر`}/><Info label="النافق اليومي" value={String(r.daily_mortality_count)}/><Info label="النافق التراكمي" value={`${r.cumulative_mortality_percent}%`}/><Info label="مصروف اليوم" value={`${money(r.daily_expenses_yer)} ر.ي`}/></div><div className="mt-3 text-[11px] text-slate-300">{r.health_summary}<br/><span className="text-cyan-300">توصية الطبيب: {r.vet_recommendation}</span></div><div className="flex gap-2 mt-3"><span className="smallBtn">PDF: {r.pdf_status}</span><span className="smallBtn">{r.delivery_channels.join(' • ')}</span>{r.delivery_status!=='sent'&&<button onClick={()=>markReportSent(r.id)} className="smallBtn"><Mail className="w-3 h-3"/>محاكاة إرسال</button>}</div></div>)}</div>}

    {section==='hr' && <div className="grid lg:grid-cols-2 gap-4"><div className="space-y-3"><div className="text-sm font-black text-white">الحضور والشيفتات GPS</div>{enterprise.attendance_shifts_v13.map(a=><div key={a.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{a.staff_name} • {a.role}</div><Badge text={a.within_farm_geofence?'داخل نطاق المزرعة':'خارج النطاق'}/></div><div className="text-[10px] text-slate-400 mt-2">{a.farm_name} • دخول {new Date(a.check_in_at).toLocaleTimeString('ar-YE',{hour:'2-digit',minute:'2-digit'})} • {a.shift_hours} ساعة • GPS {a.gps_lat.toFixed(3)},{a.gps_lng.toFixed(3)}</div></div>)}</div><div className="space-y-3"><div className="text-sm font-black text-white">الرواتب والمسحوبات</div>{enterprise.payroll_records_v13.map(p=><div key={p.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{p.staff_name}</div><Badge text={p.status}/></div><div className="grid grid-cols-3 gap-2 mt-2"><Info label="أساسي" value={money(p.base_salary_yer)}/><Info label="بدلات+مكافآت" value={money(p.allowances_yer+p.bonuses_yer)}/><Info label="صافي" value={money(p.net_salary_yer)}/></div><div className="flex gap-2 mt-2"><button onClick={()=>setPayrollStatus(p.id,'approved')} className="smallBtn">اعتماد</button><button onClick={()=>setPayrollStatus(p.id,'paid')} className="smallBtn">تسجيل مدفوع</button></div></div>)}</div><div className="lg:col-span-2"><div className="text-sm font-black text-white mb-2">KPIs الفريق</div><div className="grid md:grid-cols-3 gap-3">{enterprise.staff_kpis_v13.map(k=><div key={k.id} className="box"><div className="font-black text-white">{k.staff_name}</div><div className="text-3xl font-black text-emerald-300 mt-2">{k.overall_score}%</div><div className="text-[10px] text-slate-400">FCR {k.fcr_score} • نفوق {k.mortality_control_score} • تقارير {k.report_timeliness_score} • Biosecurity {k.biosecurity_score}</div></div>)}</div></div></div>}

    {section==='marketing' && <div className="space-y-4"><div className="grid lg:grid-cols-3 gap-3">{enterprise.poultry_buyers_v13.map(b=><div key={b.id} className="box"><div className="font-black text-white">{b.buyer_name}</div><div className="text-[10px] text-slate-400">{b.phone} • {b.governorate}</div><div className="mt-2 flex gap-2"><Badge text={`تصنيف ${b.credit_rating}`}/><span className="smallBtn">سداد {b.settlement_days} يوم</span></div></div>)}</div>{enterprise.poultry_sales_lots_v13.map(s=><div key={s.id} className="box"><div className="flex justify-between gap-2"><div><div className="font-black text-white">{s.flock_code} • {s.farm_name}</div><div className="text-[10px] text-slate-400">{money(s.bird_count)} طائر • {s.average_weight_kg} كجم • {s.buyer_name}</div></div><Badge text={s.loading_status}/></div><div className="grid md:grid-cols-4 gap-2 mt-3"><Info label="السعر/كجم" value={money(s.agreed_price_per_kg_yer)}/><Info label="موعد التحميل" value={new Date(s.planned_loading_at).toLocaleString('ar-YE')}/><Info label="استحقاق السداد" value={s.settlement_due_date}/><Info label="الدفع" value={s.payment_status}/></div><div className="text-[10px] text-cyan-300 mt-2">{s.welfare_note}</div><div className="flex flex-wrap gap-2 mt-3"><button onClick={()=>setSalesStatus(s.id,{loading_status:'vehicle_assigned'})} className="smallBtn">تعيين مركبة</button><button onClick={()=>setSalesStatus(s.id,{loading_status:'dispatched'})} className="smallBtn">خرجت الشحنة</button><button onClick={()=>setSalesStatus(s.id,{loading_status:'delivered',payment_status:'paid'})} className="smallBtn">تسليم + سداد</button></div></div>)}</div>}

    {section==='transparency' && <div className="grid lg:grid-cols-2 gap-4"><div><div className="text-sm font-black text-white mb-2">Activity Stream غير قابل للتعديل</div><div className="space-y-2">{enterprise.farm_activity_stream_v13.map(a=><div key={a.id} className="box"><div className="flex justify-between"><span className="text-white font-bold">{a.actor_name} • {a.actor_role}</span><span className="text-[9px] text-slate-500">{new Date(a.at).toLocaleString('ar-YE')}</span></div><div className="text-[11px] text-slate-300 mt-1">{a.action}</div><div className="text-[9px] text-emerald-300 mt-1">{a.immutable?'Append-only / غير قابل للتعديل':'قابل للتعديل'}</div></div>)}</div></div><div><div className="text-sm font-black text-white mb-2">اعتماد المصروفات الكبيرة</div><div className="space-y-2">{enterprise.expense_approvals_v13.map(e=><div key={e.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{e.category} • {money(e.amount_yer)} ر.ي</div><Badge text={e.status}/></div><div className="text-[10px] text-slate-400 mt-1">{e.description}</div>{e.status==='pending_owner'&&<div className="flex gap-2 mt-2"><button onClick={()=>setExpenseStatus(e.id,'approved')} className="smallBtn">موافقة المالك</button><button onClick={()=>setExpenseStatus(e.id,'rejected')} className="smallBtn">رفض</button></div>}</div>)}</div></div></div>}

    {section==='predictive' && <div className="space-y-4"><div className="flex justify-between"><div><div className="text-sm font-black text-white">Weight & Harvest Predictor + Early Disease Signals</div><div className="text-[10px] text-slate-400">قرارات مساعدة؛ لا تعتبر ضماناً للإنتاج أو تشخيصاً طبياً.</div></div><button onClick={runPredictiveUpdate} className="btn"><Zap className="w-4 h-4"/>تحديث تنبؤ</button></div><div className="grid lg:grid-cols-2 gap-4"><div className="space-y-2">{enterprise.predictive_forecasts_v13.slice(0,5).map(f=><div key={f.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{f.flock_code} • عمر {f.age_days} يوم</div><Badge text={`ثقة ${f.confidence_percent}%`}/></div><div className="grid grid-cols-3 gap-2 mt-2"><Info label="الحالي" value={`${f.current_average_weight_grams} جم`}/><Info label="بعد 3 أيام" value={`${f.predicted_weight_3d_grams} جم`}/><Info label="بعد 7 أيام" value={`${f.predicted_weight_7d_grams} جم`}/></div><div className="text-[10px] text-amber-300 mt-2">موعد بيع مقترح: {f.recommended_sale_date} • {f.note}</div></div>)}</div><div className="space-y-2">{enterprise.early_disease_signals_v13.map(s=><div key={s.id} className="box border-amber-700/40"><div className="flex justify-between"><div className="font-black text-white">إنذار مبكر • {s.flock_code}</div><Badge text={s.risk_level}/></div><div className="grid grid-cols-4 gap-1 mt-2"><Info label="العلف" value={`${s.feed_change_percent}%`}/><Info label="الماء" value={`${s.water_change_percent}%`}/><Info label="النافق" value={`${s.mortality_change_percent}%`}/><Info label="Δ حرارة" value={`${s.temperature_delta_c}°`}/></div><div className="text-[10px] text-slate-300 mt-2">{s.trigger_summary}<br/><span className="text-cyan-300">المسند: {s.assigned_vet_name||'بانتظار طبيب'}</span></div></div>)}</div></div></div>}

    {section==='supply' && <div className="grid lg:grid-cols-2 gap-4"><div><div className="text-sm font-black text-white mb-2">Auto-Reorder</div><div className="space-y-2">{enterprise.auto_reorder_rules_v13.map(r=><div key={r.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{r.item_name} • {r.farm_or_branch_name}</div><Badge text={r.draft_purchase_request_status}/></div><div className="text-[10px] text-slate-400 mt-1">المتاح {r.current_stock} {r.unit} • حد الطلب {r.reorder_level} • كمية إعادة الطلب {r.reorder_quantity} • {r.preferred_supplier}</div><button onClick={()=>triggerReorder(r)} className="smallBtn mt-2"><PackagePlus className="w-3 h-3"/>إنشاء طلب اعتماد</button></div>)}</div></div><div><div className="text-sm font-black text-white mb-2">تقييم جودة الموردين</div><div className="space-y-2">{enterprise.supplier_quality_scores_v13.map(s=><div key={s.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{s.supplier_name}</div><div className="text-2xl font-black text-emerald-300">{s.overall_score}%</div></div><div className="text-[10px] text-slate-400">توصيل {s.delivery_score} • أداء حيوي {s.biological_performance_score} • شكاوى {s.complaint_score}{s.fcr_score!==undefined?` • FCR ${s.fcr_score}`:''}{s.chick_viability_score!==undefined?` • حيوية الكتاكيت ${s.chick_viability_score}`:''}</div></div>)}</div></div></div>}

    {section==='iot' && <div className="space-y-4"><div className="rounded-2xl border border-rose-800/40 bg-rose-950/20 p-3 text-[11px] text-rose-200">الأجهزة أدناه نماذج تشغيلية داخل النظام فقط. الاتصال اللحظي الحقيقي يحتاج Gateway/MQTT أو API من الحساسات. لا تظهر كلمة «متصل» إلا بعد وجود اتصال فعلي.</div><div className="grid md:grid-cols-3 gap-3">{enterprise.iot_sensors_v13.map(s=><div key={s.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{s.device_name}</div><Badge text={s.status}/></div><div className="text-3xl font-black text-cyan-300 mt-2">{s.last_value} <span className="text-xs">{s.unit}</span></div><div className="text-[10px] text-slate-400">{s.farm_name} • {s.hangar_name} • {s.sensor_type}</div><div className="flex gap-2 mt-2"><button onClick={()=>updateSensor(s.id,{status:s.status==='online'?'not_connected':'online'})} className="smallBtn">{s.status==='online'?'فصل تجريبي':'محاكاة اتصال'}</button><button onClick={()=>updateSensor(s.id,{last_value:s.last_value+1})} className="smallBtn">+ قراءة</button></div>{s.alert_active&&<div className="text-[10px] text-rose-300 mt-2">⚠ القراءة خارج الحد المحدد</div>}</div>)}</div><div><div className="text-sm font-black text-white mb-2">Remote Farm Audit</div>{enterprise.remote_farm_audits_v13.map(a=><div key={a.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{a.farm_name} • {a.auditor_name}</div><div className="text-2xl font-black text-emerald-300">{a.overall_score}%</div></div><div className="text-[10px] text-slate-400 mt-2">نظافة {a.cleanliness_score} • Biosecurity {a.biosecurity_score} • فرشة {a.litter_score} • تهوية {a.ventilation_score} • التزام العمال {a.worker_compliance_score}</div><div className="text-[10px] text-amber-300 mt-2">الملاحظات: {a.findings.join('، ')}<br/>الإجراءات: {a.corrective_actions.join('، ')}</div></div>)}</div></div>}

    {section==='legal' && <div className="grid lg:grid-cols-2 gap-4"><div><div className="text-sm font-black text-white mb-2">Digital Contracts</div><div className="space-y-2">{enterprise.digital_contract_signatures_v13.map(s=><div key={s.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{s.contract_id} • {s.signer_name}</div><Badge text={s.status}/></div><div className="text-[10px] text-slate-400 mt-1">{s.method} • Hash: {s.document_hash}</div>{s.status==='pending'&&<button onClick={()=>signContract(s)} className="smallBtn mt-2"><FileSignature className="w-3 h-3"/>توقيع تجريبي</button>}<div className="text-[9px] text-amber-300 mt-2">التوثيق القانوني الحقيقي يحتاج OTP/هوية/مزود توقيع مناسب ومراجعة قانونية محلية.</div></div>)}</div></div><div><div className="text-sm font-black text-white mb-2">Profit Sharing Calculator</div><div className="space-y-2">{enterprise.profit_sharing_settlements_v13.map(s=><div key={s.id} className="box"><div className="flex justify-between"><div className="font-black text-white">{s.cycle_label}</div><Badge text={s.status}/></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2"><Info label="المبيعات" value={money(s.gross_sales_yer)}/><Info label="صافي الربح" value={money(s.net_profit_yer)}/><Info label="حصة العميل" value={money(s.customer_share_yer)}/><Info label="حصة المنصة" value={money(s.platform_share_yer)}/></div><button onClick={()=>recalcSettlement(s)} className="smallBtn mt-2"><RefreshCw className="w-3 h-3"/>إعادة الحساب</button></div>)}</div></div></div>}
  </div>;
};

const Badge=({text}:{text:string})=><span className={`inline-flex px-2 py-1 rounded-full border text-[9px] font-black ${statusTone[text]||'bg-slate-800 text-slate-300 border-slate-700'}`}>{text}</span>;
const Stat=({label,value}:{label:string;value:number|string})=><div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2"><div className="text-slate-500">{label}</div><div className="text-lg font-black text-white">{value}</div></div>;
const Info=({label,value}:{label:string;value:string})=><div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2"><div className="text-[9px] text-slate-500">{label}</div><div className="text-[11px] font-bold text-slate-200 mt-0.5">{value}</div></div>;
const Text=({label,value,onChange,type='text'}:{label:string;value:string;onChange:(v:string)=>void;type?:string})=><label className="field text-[10px] text-slate-400"><span>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"/></label>;
const Num=({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void})=><label className="field text-[10px] text-slate-400"><span>{label}</span><input type="number" value={value} onChange={e=>onChange(Number(e.target.value)||0)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"/></label>;
const Toggle=({label,checked,onChange}:{label:string;checked:boolean;onChange:()=>void})=><button onClick={onChange} className={`flex items-center justify-between rounded-xl border p-2 text-[10px] ${checked?'bg-emerald-950/30 border-emerald-800/50 text-emerald-200':'bg-slate-950 border-slate-800 text-slate-400'}`}><span>{label}</span><span>{checked?'ON':'OFF'}</span></button>;
const ColorBox=({label,value}:{label:string;value:string})=><div className="rounded-xl border border-slate-800 p-2"><div className="h-8 rounded-lg border border-white/10" style={{background:value}}/><div className="text-[9px] text-slate-500 mt-1">{label}</div><div className="text-[10px] font-mono text-white">{value}</div></div>;
