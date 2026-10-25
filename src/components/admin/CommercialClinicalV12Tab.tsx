import React, { useMemo, useState } from 'react';
import {
  BrainCircuit, Building2, BadgePercent, Handshake, LineChart, WalletCards,
  Stethoscope, ClipboardCheck, FlaskConical, Plus, ShieldAlert, ToggleLeft,
  ToggleRight, CalendarDays, Clock3, Scale, UserRoundCheck, Truck, Save,
  AlertTriangle, CheckCircle2, CircleDollarSign
} from 'lucide-react';
import {
  SmartOperationsState,
  PartnerTradeContractV12,
  PoultryMarketerContractV12,
  PoultryMarketingDailyRateV12,
  TradeFinanceContractV12,
  FarmSupervisionContractV12,
  SupervisionDailyReportV12,
  LaboratoryPartnerContractV12,
  LaboratoryTestPriceV12
} from '../../types';

interface Props {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

type Section = 'advisor' | 'partners' | 'marketing' | 'finance' | 'supervision' | 'labs';
const money = (n: number) => new Intl.NumberFormat('ar-YE').format(Math.round(Number(n) || 0));
const today = () => new Date().toISOString().slice(0, 10);

export const CommercialClinicalV12Tab: React.FC<Props> = ({ operations, onUpdateOperations }) => {
  const [section, setSection] = useState<Section>('advisor');
  const enterprise = operations.enterprise;
  const advisor = enterprise.ai_advisor_v12;

  const updateEnterprise = (patch: Partial<typeof enterprise>) => {
    onUpdateOperations({ ...operations, enterprise: { ...enterprise, ...patch } });
  };

  const stats = useMemo(() => ({
    partnerContracts: enterprise.partner_trade_contracts_v12.filter(x => x.status === 'active').length,
    marketers: enterprise.poultry_marketer_contracts_v12.filter(x => x.status === 'active').length,
    finance: enterprise.trade_finance_contracts_v12.filter(x => ['active','awaiting_upfront','due'].includes(x.status)).length,
    supervision: enterprise.farm_supervision_contracts_v12.filter(x => x.status === 'active').length,
    labs: enterprise.laboratory_partner_contracts_v12.filter(x => x.status === 'active').length,
  }), [enterprise]);

  const tabs: {id: Section; label: string; icon: React.ReactNode}[] = [
    { id:'advisor', label:'المستشار الذكي والبيع', icon:<BrainCircuit className="w-4 h-4"/> },
    { id:'partners', label:'عقود الشركات والمكاتب', icon:<Building2 className="w-4 h-4"/> },
    { id:'marketing', label:'عقود تسويق الدواجن', icon:<LineChart className="w-4 h-4"/> },
    { id:'finance', label:'60% مقدم + 40% آجل', icon:<WalletCards className="w-4 h-4"/> },
    { id:'supervision', label:'عقود الإشراف اليومي', icon:<Stethoscope className="w-4 h-4"/> },
    { id:'labs', label:'عقود المختبرات', icon:<FlaskConical className="w-4 h-4"/> },
  ];

  const toggleAdvisor = (key: 'enabled'|'poultry_specialist_mode'|'sales_consultant_mode'|'customer_education_mode'|'anti_random_antibiotics_policy'|'require_vet_for_antibiotic_use') => {
    updateEnterprise({ ai_advisor_v12: { ...advisor, [key]: !advisor[key], last_updated: new Date().toISOString(), updated_by: 'المدير العام' } });
  };

  const updatePartner = (id: string, patch: Partial<PartnerTradeContractV12>) => updateEnterprise({
    partner_trade_contracts_v12: enterprise.partner_trade_contracts_v12.map(c => c.id === id ? { ...c, ...patch } : c)
  });

  const addPartnerContract = () => {
    const item: PartnerTradeContractV12 = {
      id:`ptc-${Date.now()}`, partner_name:'شريك تجاري جديد', business_type:'شركة أدوية', contract_number:`PART-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      start_date:today(), end_date:`${new Date().getFullYear()+1}-${today().slice(5)}`, status:'draft', governorates:['صنعاء'], customer_discount_percent:0,
      platform_commission_percent:5, settlement_days:14, show_prices_to_customers:true, show_discount_badge:true, customer_visible:false, require_admin_product_approval:true,
      price_list_note:'يتم إدخال قائمة الأسعار والصور ثم اعتمادها من الإدارة قبل الظهور للعميل.'
    };
    updateEnterprise({ partner_trade_contracts_v12:[item, ...enterprise.partner_trade_contracts_v12] });
  };

  const updateMarketer = (id: string, patch: Partial<PoultryMarketerContractV12>) => updateEnterprise({
    poultry_marketer_contracts_v12: enterprise.poultry_marketer_contracts_v12.map(c => c.id === id ? { ...c, ...patch } : c)
  });

  const addMarketerContract = () => {
    const item: PoultryMarketerContractV12 = {
      id:`pmc-${Date.now()}`, marketer_name:'مسوق جديد', company_name:'', phone:'', governorates:['صنعاء'], contract_number:`MKT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      start_date:today(), end_date:`${new Date().getFullYear()+1}-${today().slice(5)}`, status:'draft', fee_mode:'fixed_per_kg', fee_value:0, settlement_days:1, daily_price_update_required:true,
      mortality_liability:'none', mortality_liability_hours:0, pickup_deadline_hours:6, payment_terms:'تحدد الإدارة شروط وموعد السداد قبل تفعيل العقد.', notes:'تراجع مسؤولية النافق والتسليم تعاقدياً قبل التفعيل.'
    };
    updateEnterprise({ poultry_marketer_contracts_v12:[item, ...enterprise.poultry_marketer_contracts_v12] });
  };

  const updateMarketingRate = (id:string, patch:Partial<PoultryMarketingDailyRateV12>) => updateEnterprise({
    poultry_marketing_rates_v12: enterprise.poultry_marketing_rates_v12.map(x => x.id===id ? {...x,...patch,approved_by:'المدير العام'} : x)
  });

  const updateSupervision = (id:string, patch:Partial<FarmSupervisionContractV12>) => updateEnterprise({
    farm_supervision_contracts_v12: enterprise.farm_supervision_contracts_v12.map(x => x.id===id ? {...x,...patch} : x)
  });

  const updateLab = (id:string, patch:Partial<LaboratoryPartnerContractV12>) => updateEnterprise({
    laboratory_partner_contracts_v12: enterprise.laboratory_partner_contracts_v12.map(x => x.id===id ? {...x,...patch} : x)
  });

  const updateLabTest = (id:string, patch:Partial<LaboratoryTestPriceV12>) => updateEnterprise({
    laboratory_test_prices_v12: enterprise.laboratory_test_prices_v12.map(x => {
      if (x.id !== id) return x;
      const next = {...x,...patch};
      const base = Math.max(0, Number(next.base_price_yer) || 0);
      const discount = Math.max(0, Math.min(100, Number(next.discount_percent) || 0));
      return {...next, base_price_yer:base, discount_percent:discount, customer_price_yer:Math.round(base*(1-discount/100))};
    })
  });

  const addMarketingRate = () => {
    const c = enterprise.poultry_marketer_contracts_v12.find(x => x.status === 'active') || enterprise.poultry_marketer_contracts_v12[0];
    if (!c) return;
    const item: PoultryMarketingDailyRateV12 = {
      id:`pmr-${Date.now()}`, date:today(), governorate:c.governorates[0] || 'صنعاء', district:'يحدد من الإدارة', weight_category:'1.3 - 1.8 كجم',
      marketer_contract_id:c.id, marketer_name:c.marketer_name, buy_price_per_kg_yer:0, target_sell_price_per_kg_yer:0,
      fee_yer_per_kg:c.fee_mode==='fixed_per_kg' ? c.fee_value : undefined, settlement_days:c.settlement_days,
      mortality_terms:mortalityText(c), approved_by:'بانتظار اعتماد المدير', published:false
    };
    updateEnterprise({ poultry_marketing_rates_v12:[item, ...enterprise.poultry_marketing_rates_v12] });
  };

  const addFinanceContract = () => {
    const total = 1000000;
    const item: TradeFinanceContractV12 = {
      id:`tfc-${Date.now()}`, customer_name:'عميل جديد', phone:'', farm_name:'مزرعة جديدة', governorate:'صنعاء', contract_number:`FIN-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      total_value_yer:total, upfront_percent:60, upfront_amount_yer:total*.6, deferred_percent:40, deferred_amount_yer:total*.4,
      expected_marketing_date:today(), due_rule:'first_sale_proceeds', collateral_type:'ضامن تجاري', collateral_description:'تحدد الضمانة وتراجع مستنداتها قبل التفعيل.',
      medical_supervision_required:true, external_purchase_requires_notice:true, first_sale_proceeds_to_platform:true, status:'draft', legal_review_status:'review_required',
      notes:'لا يفعّل العقد التجاري الحقيقي قبل مراجعة الصياغة والضمانات من مختص قانوني محلي.'
    };
    updateEnterprise({ trade_finance_contracts_v12:[item, ...enterprise.trade_finance_contracts_v12] });
  };

  const updateFinance = (id:string, patch:Partial<TradeFinanceContractV12>) => {
    updateEnterprise({ trade_finance_contracts_v12:enterprise.trade_finance_contracts_v12.map(x => {
      if (x.id !== id) return x;
      const next = { ...x, ...patch };
      const up = Math.max(0, Math.min(100, Number(next.upfront_percent)));
      next.upfront_percent = up;
      next.deferred_percent = 100 - up;
      next.upfront_amount_yer = Math.round(next.total_value_yer * up / 100);
      next.deferred_amount_yer = next.total_value_yer - next.upfront_amount_yer;
      return next;
    }) });
  };

  const addSupervisionContract = () => {
    const item: FarmSupervisionContractV12 = {
      id:`fsc-${Date.now()}`, contract_number:`SUP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`, customer_name:'عميل جديد', phone:'', farm_name:'مزرعة جديدة', governorate:'صنعاء', district:'', hangars_count:1, flock_size:10000,
      package_name:'إشراف كامل حتى التسويق', contract_fee_yer:0, start_date:today(), end_date:today(), responsible_vet_name:'يحدد من الإدارة', daily_report_time:'19:00',
      scope:['العلف والماء','الحرارة والرطوبة','التهوية والفرشة','التحصينات','مراجعة العلاجات','النزول الميداني','المتابعة حتى التسويق'], status:'draft'
    };
    updateEnterprise({ farm_supervision_contracts_v12:[item, ...enterprise.farm_supervision_contracts_v12] });
  };

  const addDailyReport = (contract: FarmSupervisionContractV12) => {
    const report: SupervisionDailyReportV12 = {
      id:`sdr-${Date.now()}`, contract_id:contract.id, date:today(), submitted_at:new Date().toISOString(), submitted_by:'المشرف/العميل', feed_kg:0, water_liters:0, mortality_count:0,
      temperature_celsius:27, humidity_percent:60, ventilation_note:'بانتظار الإدخال اليومي', litter_note:'بانتظار الإدخال اليومي', ai_summary:'تم إنشاء تقرير يومي جديد وسيظهر للطبيب المسؤول فور استكمال البيانات.', alert_level:'watch', sent_to_vet:true, sent_to_vet_at:new Date().toISOString()
    };
    updateEnterprise({
      supervision_daily_reports_v12:[report, ...enterprise.supervision_daily_reports_v12],
      farm_supervision_contracts_v12:enterprise.farm_supervision_contracts_v12.map(x => x.id===contract.id ? {...x,last_daily_report_at:report.submitted_at,next_daily_report_due_at:nextDayAt(x.daily_report_time)} : x)
    });
  };

  const addLabContract = () => {
    const item: LaboratoryPartnerContractV12 = {
      id:`lpc-${Date.now()}`, laboratory_name:'مختبر جديد', contract_number:`LAB-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`, governorate:'صنعاء', district:'', address:'', phone:'',
      start_date:today(), end_date:`${new Date().getFullYear()+1}-${today().slice(5)}`, status:'draft', default_discount_percent:0, sample_collection_discount_percent:0, settlement_days:7, customer_visible:false
    };
    updateEnterprise({ laboratory_partner_contracts_v12:[item, ...enterprise.laboratory_partner_contracts_v12] });
  };

  const addLabTest = (labId?:string) => {
    const lab = enterprise.laboratory_partner_contracts_v12.find(x => x.id===labId) || enterprise.laboratory_partner_contracts_v12[0];
    if (!lab) return;
    const base = 30000, discount = lab.default_discount_percent;
    const item: LaboratoryTestPriceV12 = { id:`ltp-${Date.now()}`, lab_contract_id:lab.id, test_name:'فحص جديد', category:'أخرى', sample_type:'يحدد من المختبر', base_price_yer:base, discount_percent:discount, customer_price_yer:Math.round(base*(1-discount/100)), turnaround_hours:24, active:true };
    updateEnterprise({ laboratory_test_prices_v12:[item, ...enterprise.laboratory_test_prices_v12] });
  };

  return <div className="space-y-5" dir="rtl">
    <div className="rounded-3xl border border-cyan-700/30 bg-gradient-to-l from-[#071b27] via-[#0b2533] to-[#071b27] p-5">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div><div className="text-cyan-300 text-xs font-black">V12 • الإدارة التجارية والبيطرية المتقدمة</div><h3 className="text-xl text-white font-black mt-1">المستشار الذكي • العقود • التسويق • التمويل • الإشراف • المختبرات</h3><p className="text-xs text-slate-400 mt-1 max-w-4xl">كل الشروط والأسعار والخصومات والمسؤوليات لا تظهر للعميل إلا بعد اعتماد الإدارة. القرارات الطبية النهائية والمضادات تبقى تحت الطبيب.</p></div>
        <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]"><MiniKpi n={stats.partnerContracts} l="شركاء"/><MiniKpi n={stats.marketers} l="مسوقون"/><MiniKpi n={stats.finance} l="تمويل"/><MiniKpi n={stats.supervision} l="إشراف"/><MiniKpi n={stats.labs} l="مختبرات"/></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 mt-5">{tabs.map(t=><button key={t.id} onClick={()=>setSection(t.id)} className={`rounded-xl px-3 py-2.5 text-xs font-bold flex items-center gap-2 ${section===t.id?'bg-cyan-500 text-slate-950':'bg-slate-950/60 text-slate-300 border border-slate-800'}`}>{t.icon}{t.label}</button>)}</div>
    </div>

    {section==='advisor' && <div className="space-y-4">
      <Card title="المستشار الذكي المتخصص في الدواجن والبيع" icon={<BrainCircuit className="w-5 h-5"/>}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{([
          ['enabled','تشغيل المستشار الذكي'],['poultry_specialist_mode','وضع اختصاص دواجن متقدم'],['sales_consultant_mode','مستشار بيع وإقناع مهني'],['customer_education_mode','التوعية وتصحيح الممارسات'],['anti_random_antibiotics_policy','منع تشجيع المضادات العشوائية'],['require_vet_for_antibiotic_use','اعتماد الطبيب قبل استخدام المضاد']
        ] as const).map(([k,l])=><button key={k} onClick={()=>toggleAdvisor(k)} className={`rounded-xl border p-3 text-xs flex justify-between gap-2 ${advisor[k]?'border-emerald-600/40 bg-emerald-950/20':'border-slate-800 bg-slate-950/60'}`}><span>{l}</span>{advisor[k]?<ToggleRight className="w-5 h-5 text-emerald-400"/>:<ToggleLeft className="w-5 h-5 text-slate-500"/>}</button>)}</div>
        <div className="grid lg:grid-cols-3 gap-3 mt-4"><ListBox title="أهداف المستشار" items={advisor.primary_objectives}/><ListBox title="منهج الإقناع والبيع" items={advisor.sales_playbook}/><ListBox title="ضوابط السلامة" items={advisor.safety_guardrails}/></div>
        <div className="mt-3 rounded-xl border border-amber-700/30 bg-amber-950/20 p-3 text-[11px] text-amber-100"><b>رسالة التوعية الأساسية:</b> المضاد الحيوي ليس حلاً افتراضياً. الاستخدام العشوائي قد يزيد مقاومة المضادات، يخفي السبب الحقيقي للمشكلة، يعقّد السيطرة على العدوى ويضيف مخاطر فترة السحب؛ لذلك يوجّه النظام العميل إلى البيانات والفحص ومراجعة الطبيب.</div>
      </Card>
    </div>}

    {section==='partners' && <div className="space-y-4">
      <div className="flex justify-end"><button onClick={addPartnerContract} className="btn"><Plus className="w-4 h-4"/> عقد شريك جديد</button></div>
      <div className="grid xl:grid-cols-2 gap-3">{enterprise.partner_trade_contracts_v12.map(c=><Card key={c.id} title={c.partner_name} icon={<Handshake className="w-5 h-5"/>}>
        <div className="grid sm:grid-cols-2 gap-2 mb-3"><Text label="اسم الشركة/المكتب" value={c.partner_name} onChange={v=>updatePartner(c.id,{partner_name:v})}/><label className="text-[10px] text-slate-400"><span>نوع النشاط</span><select value={c.business_type} onChange={e=>updatePartner(c.id,{business_type:e.target.value as PartnerTradeContractV12['business_type']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option>شركة أدوية</option><option>مكتب أدوية</option><option>مصنع/مطبخ أعلاف</option><option>مورد معدات</option><option>وكيل لقاحات</option><option>مفرخ كتاكيت</option></select></label></div>
        <div className="grid sm:grid-cols-3 gap-2"><Text label="رقم العقد" value={c.contract_number} onChange={v=>updatePartner(c.id,{contract_number:v})}/><Text label="المحافظات (بفواصل)" value={c.governorates.join('،')} onChange={v=>updatePartner(c.id,{governorates:v.split(/[،,]/).map(x=>x.trim()).filter(Boolean)})}/><Num label="تسوية/يوم" value={c.settlement_days} onChange={v=>updatePartner(c.id,{settlement_days:v})}/></div>
        <div className="grid sm:grid-cols-3 gap-2 mt-3"><Num label="خصم العميل %" value={c.customer_discount_percent} onChange={v=>updatePartner(c.id,{customer_discount_percent:Math.max(0,Math.min(100,v))})}/><Num label="عمولة المنصة %" value={c.platform_commission_percent} onChange={v=>updatePartner(c.id,{platform_commission_percent:Math.max(0,Math.min(100,v))})}/><label className="text-[10px] text-slate-400"><span>حالة العقد</span><select value={c.status} onChange={e=>updatePartner(c.id,{status:e.target.value as PartnerTradeContractV12['status']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option value="draft">مسودة</option><option value="active">نشط</option><option value="suspended">معلّق</option><option value="expired">منتهي</option></select></label></div>
        <div className="grid sm:grid-cols-3 gap-2 mt-3"><Toggle label="إظهار الأسعار" value={c.show_prices_to_customers} onChange={v=>updatePartner(c.id,{show_prices_to_customers:v})}/><Toggle label="إظهار الخصم" value={c.show_discount_badge} onChange={v=>updatePartner(c.id,{show_discount_badge:v})}/><Toggle label="ظاهر للعملاء" value={c.customer_visible} onChange={v=>updatePartner(c.id,{customer_visible:v})}/></div>
        <div className="mt-3 grid sm:grid-cols-2 gap-2"><Text label="رابط شعار الشركة" value={c.logo_url||''} onChange={v=>updatePartner(c.id,{logo_url:v})}/><Text label="صورة عرض/بانر" value={c.showcase_image_url||''} onChange={v=>updatePartner(c.id,{showcase_image_url:v})}/></div>
        {(c.logo_url||c.showcase_image_url)&&<div className="grid grid-cols-2 gap-2 mt-3">{c.logo_url&&<img src={c.logo_url} alt={`${c.partner_name} logo`} className="h-24 w-full object-contain bg-white rounded-xl p-2"/>}{c.showcase_image_url&&<img src={c.showcase_image_url} alt={c.partner_name} className="h-24 w-full object-contain bg-slate-950 rounded-xl p-2"/>}</div>}
        <div className="mt-3"><Text label="ملاحظات قائمة الأسعار/العرض" value={c.price_list_note||''} onChange={v=>updatePartner(c.id,{price_list_note:v})}/></div>
        <div className="mt-3 flex flex-wrap gap-2"><Badge>{c.status}</Badge>{c.require_admin_product_approval&&<Badge>المنتجات بعد اعتماد الإدارة فقط</Badge>}<button onClick={()=>updatePartner(c.id,{status:c.status==='active'?'suspended':'active'})} className="smallBtn">{c.status==='active'?'تعليق العقد':'تفعيل العقد'}</button></div>
      </Card>)}</div>
    </div>}

    {section==='marketing' && <div className="space-y-4">
      <div className="flex justify-end gap-2"><button onClick={addMarketerContract} className="btn"><Plus className="w-4 h-4"/> عقد مسوق جديد</button><button onClick={addMarketingRate} className="btn"><Plus className="w-4 h-4"/> سعر يومي جديد</button></div>
      <Card title="عقود المسوقين وشروط الاستلام والسداد" icon={<Truck className="w-5 h-5"/>}><div className="grid xl:grid-cols-2 gap-3">{enterprise.poultry_marketer_contracts_v12.map(c=><div key={c.id} className="box">
        <div className="grid sm:grid-cols-2 gap-2"><Text label="اسم المسوق" value={c.marketer_name} onChange={v=>updateMarketer(c.id,{marketer_name:v})}/><Text label="الشركة/المكتب" value={c.company_name||''} onChange={v=>updateMarketer(c.id,{company_name:v})}/><Text label="الهاتف" value={c.phone} onChange={v=>updateMarketer(c.id,{phone:v})}/><Text label="المحافظات (بفواصل)" value={c.governorates.join('،')} onChange={v=>updateMarketer(c.id,{governorates:v.split(/[،,]/).map(x=>x.trim()).filter(Boolean)})}/></div>
        <div className="grid sm:grid-cols-4 gap-2 mt-2"><Num label="الأجرة" value={c.fee_value} onChange={v=>updateMarketer(c.id,{fee_value:v})}/><label className="text-[10px] text-slate-400"><span>نوع الأجرة</span><select value={c.fee_mode} onChange={e=>updateMarketer(c.id,{fee_mode:e.target.value as PoultryMarketerContractV12['fee_mode']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option value="fixed_per_kg">ر.ي/كجم</option><option value="fixed_per_load">ر.ي/حمولة</option><option value="percent_of_sale">% من البيع</option></select></label><Num label="السداد/يوم" value={c.settlement_days} onChange={v=>updateMarketer(c.id,{settlement_days:v})}/><Num label="مهلة الاستلام/ساعة" value={c.pickup_deadline_hours} onChange={v=>updateMarketer(c.id,{pickup_deadline_hours:v})}/></div>
        <div className="grid sm:grid-cols-3 gap-2 mt-2"><label className="text-[10px] text-slate-400"><span>تحمل النافق</span><select value={c.mortality_liability} onChange={e=>updateMarketer(c.id,{mortality_liability:e.target.value as PoultryMarketerContractV12['mortality_liability']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option value="none">لا يتحمل</option><option value="limited_window">لفترة محددة</option><option value="full_until_handover">حتى التسليم المعتمد</option></select></label><Num label="مدة تحمل النافق/ساعة" value={c.mortality_liability_hours} onChange={v=>updateMarketer(c.id,{mortality_liability_hours:v})}/><Num label="حد النافق %" value={c.mortality_liability_cap_percent||0} onChange={v=>updateMarketer(c.id,{mortality_liability_cap_percent:v})}/></div>
        <div className="mt-2"><Text label="شروط السداد" value={c.payment_terms} onChange={v=>updateMarketer(c.id,{payment_terms:v})}/></div>
        <div className="mt-2 flex flex-wrap gap-2"><Badge>{mortalityText(c)}</Badge><button onClick={()=>updateMarketer(c.id,{status:c.status==='active'?'suspended':'active'})} className="smallBtn">{c.status==='active'?'تعليق العقد':'تفعيل العقد'}</button><Toggle label="تحديث السعر يومياً" value={c.daily_price_update_required} onChange={v=>updateMarketer(c.id,{daily_price_update_required:v})}/></div>
      </div>)}</div></Card>
      <Card title="الأسعار اليومية لتسويق الدواجن" icon={<LineChart className="w-5 h-5"/>}><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-slate-400 border-b border-slate-800"><Th>التاريخ</Th><Th>المنطقة</Th><Th>المسوق</Th><Th>الوزن</Th><Th>شراء/كجم</Th><Th>بيع مستهدف</Th><Th>السداد</Th><Th>النافق</Th><Th>نشر</Th></tr></thead><tbody>{enterprise.poultry_marketing_rates_v12.map(r=><tr key={r.id} className="border-b border-slate-900"><Td><input type="date" value={r.date} onChange={e=>updateMarketingRate(r.id,{date:e.target.value})} className="inputNum"/></Td><Td><div className="flex gap-1"><input value={r.governorate} onChange={e=>updateMarketingRate(r.id,{governorate:e.target.value})} className="inputNum w-20"/><input value={r.district} onChange={e=>updateMarketingRate(r.id,{district:e.target.value})} className="inputNum w-24"/></div></Td><Td>{r.marketer_name}</Td><Td><input value={r.weight_category} onChange={e=>updateMarketingRate(r.id,{weight_category:e.target.value})} className="inputNum w-28"/></Td><Td><input type="number" value={r.buy_price_per_kg_yer} onChange={e=>updateMarketingRate(r.id,{buy_price_per_kg_yer:Number(e.target.value)})} className="inputNum"/></Td><Td><input type="number" value={r.target_sell_price_per_kg_yer||0} onChange={e=>updateMarketingRate(r.id,{target_sell_price_per_kg_yer:Number(e.target.value)})} className="inputNum"/></Td><Td><input type="number" value={r.settlement_days} onChange={e=>updateMarketingRate(r.id,{settlement_days:Number(e.target.value)})} className="inputNum"/></Td><Td className="max-w-[240px] whitespace-normal">{r.mortality_terms}</Td><Td><button onClick={()=>updateMarketingRate(r.id,{published:!r.published})} className="smallBtn">{r.published?'منشور':'مسودة'}</button></Td></tr>)}</tbody></table></div></Card>
    </div>}

    {section==='finance'  && <div className="space-y-4">
      <div className="flex justify-end"><button onClick={addFinanceContract} className="btn"><Plus className="w-4 h-4"/> عقد تمويل جديد</button></div>
      <div className="rounded-xl border border-amber-700/30 bg-amber-950/20 p-3 text-[11px] text-amber-100"><AlertTriangle className="w-4 h-4 inline ml-1"/>هذه الوحدة تدير النموذج التجاري والدفعات والضمانات رقمياً، لكنها لا تجعل صياغة الرهن/السند/الشيك صحيحة قانونياً تلقائياً؛ يجب مراجعة المستندات والعقود من مختص قانوني محلي قبل التفعيل.</div>
      <div className="grid xl:grid-cols-2 gap-3">{enterprise.trade_finance_contracts_v12.map(c=><Card key={c.id} title={`${c.customer_name} — ${c.contract_number}`} icon={<WalletCards className="w-5 h-5"/>}>
        <div className="grid sm:grid-cols-3 gap-2"><Text label="اسم العميل" value={c.customer_name} onChange={v=>updateFinance(c.id,{customer_name:v})}/><Text label="الهاتف" value={c.phone} onChange={v=>updateFinance(c.id,{phone:v})}/><Text label="المزرعة" value={c.farm_name} onChange={v=>updateFinance(c.id,{farm_name:v})}/><Num label="قيمة العقد" value={c.total_value_yer} onChange={v=>updateFinance(c.id,{total_value_yer:v})}/><Num label="المقدم %" value={c.upfront_percent} onChange={v=>updateFinance(c.id,{upfront_percent:v})}/><Text label="تاريخ التسويق المتوقع" value={c.expected_marketing_date} onChange={v=>updateFinance(c.id,{expected_marketing_date:v})} type="date"/></div>
        <div className="grid grid-cols-2 gap-2 mt-3"><Kpi l={`المقدم ${c.upfront_percent}%`} v={`${money(c.upfront_amount_yer)} ر.ي`}/><Kpi l={`الآجل ${c.deferred_percent}%`} v={`${money(c.deferred_amount_yer)} ر.ي`}/></div>
        <div className="grid sm:grid-cols-3 gap-2 mt-3"><label className="text-[10px] text-slate-400"><span>نوع الضمانة</span><select value={c.collateral_type} onChange={e=>updateFinance(c.id,{collateral_type:e.target.value as TradeFinanceContractV12['collateral_type']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option>ضامن تجاري</option><option>سند لأمر</option><option>شيك آجل</option><option>رهن منقول</option><option>رهن عقاري</option><option>أخرى</option></select></label><Text label="تفاصيل الضمانة" value={c.collateral_description} onChange={v=>updateFinance(c.id,{collateral_description:v})}/><Text label="اسم الضامن" value={c.guarantor_name||''} onChange={v=>updateFinance(c.id,{guarantor_name:v})}/></div>
        <div className="grid sm:grid-cols-2 gap-2 mt-2"><label className="text-[10px] text-slate-400"><span>حالة العقد</span><select value={c.status} onChange={e=>updateFinance(c.id,{status:e.target.value as TradeFinanceContractV12['status']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option value="draft">مسودة</option><option value="awaiting_upfront">بانتظار المقدم</option><option value="active">نشط</option><option value="due">مستحق</option><option value="settled">مسدد</option><option value="defaulted">متعثر</option><option value="cancelled">ملغي</option></select></label><label className="text-[10px] text-slate-400"><span>المراجعة القانونية</span><select value={c.legal_review_status} onChange={e=>updateFinance(c.id,{legal_review_status:e.target.value as TradeFinanceContractV12['legal_review_status']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option value="review_required">تحتاج مراجعة</option><option value="not_reviewed">لم تراجع</option><option value="reviewed">تمت المراجعة</option></select></label></div>
        <div className="mt-2 grid sm:grid-cols-3 gap-2"><Toggle label="إشراف طبي إلزامي" value={c.medical_supervision_required} onChange={v=>updateFinance(c.id,{medical_supervision_required:v})}/><Toggle label="الإبلاغ عن الشراء الخارجي" value={c.external_purchase_requires_notice} onChange={v=>updateFinance(c.id,{external_purchase_requires_notice:v})}/><Toggle label="السداد من أول بيع" value={c.first_sale_proceeds_to_platform} onChange={v=>updateFinance(c.id,{first_sale_proceeds_to_platform:v})}/></div>
      </Card>)}</div>
    </div>}

    {section==='supervision' && <div className="space-y-4">
      <div className="flex justify-end"><button onClick={addSupervisionContract} className="btn"><Plus className="w-4 h-4"/> عقد إشراف جديد</button></div>
      {enterprise.farm_supervision_contracts_v12.map(c=><Card key={c.id} title={`${c.farm_name} — ${c.customer_name}`} icon={<UserRoundCheck className="w-5 h-5"/>}>
        <div className="grid sm:grid-cols-3 gap-2"><Text label="اسم العميل" value={c.customer_name} onChange={v=>updateSupervision(c.id,{customer_name:v})}/><Text label="الهاتف" value={c.phone} onChange={v=>updateSupervision(c.id,{phone:v})}/><Text label="المزرعة" value={c.farm_name} onChange={v=>updateSupervision(c.id,{farm_name:v})}/><Text label="المحافظة" value={c.governorate} onChange={v=>updateSupervision(c.id,{governorate:v})}/><Text label="المديرية" value={c.district} onChange={v=>updateSupervision(c.id,{district:v})}/><Text label="الطبيب المسؤول" value={c.responsible_vet_name} onChange={v=>updateSupervision(c.id,{responsible_vet_name:v})}/></div>
        <div className="grid sm:grid-cols-5 gap-2 mt-2"><Num label="الهناجر" value={c.hangars_count} onChange={v=>updateSupervision(c.id,{hangars_count:v})}/><Num label="حجم القطيع" value={c.flock_size} onChange={v=>updateSupervision(c.id,{flock_size:v})}/><Num label="قيمة العقد" value={c.contract_fee_yer} onChange={v=>updateSupervision(c.id,{contract_fee_yer:v})}/><Text label="وقت التقرير" value={c.daily_report_time} onChange={v=>updateSupervision(c.id,{daily_report_time:v})} type="time"/><label className="text-[10px] text-slate-400"><span>الحالة</span><select value={c.status} onChange={e=>updateSupervision(c.id,{status:e.target.value as FarmSupervisionContractV12['status']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option value="draft">مسودة</option><option value="active">نشط</option><option value="paused">متوقف مؤقتاً</option><option value="completed">مكتمل</option><option value="cancelled">ملغي</option></select></label></div>
        <div className="mt-2 text-[11px] text-slate-400">النطاق: {c.scope.join(' • ')}</div><div className="mt-3 flex gap-2"><button onClick={()=>addDailyReport(c)} className="smallBtn"><ClipboardCheck className="w-3.5 h-3.5"/> إنشاء تقرير اليوم وإرساله للطبيب</button><Badge>{c.status}</Badge><Badge>موعد يومي {c.daily_report_time}</Badge></div>
        <div className="mt-3 space-y-2">{enterprise.supervision_daily_reports_v12.filter(r=>r.contract_id===c.id).slice(0,4).map(r=><div key={r.id} className="box"><div className="flex justify-between"><b>{r.date} — {r.submitted_by}</b><Badge>{r.alert_level}</Badge></div><div className="text-slate-400 mt-1">علف {r.feed_kg} كجم • ماء {r.water_liters} لتر • نافق {r.mortality_count} • {r.temperature_celsius}°C • رطوبة {r.humidity_percent}%</div><div className="text-cyan-200 mt-1">{r.ai_summary}</div><div className="text-[10px] text-emerald-300 mt-1">{r.sent_to_vet?'تم إرساله للطبيب المسؤول':'لم يرسل بعد'}</div></div>)}</div>
      </Card>)}
    </div>}

    {section==='labs' && <div className="space-y-4">
      <div className="flex justify-end gap-2"><button onClick={addLabContract} className="btn"><Plus className="w-4 h-4"/> عقد مختبر جديد</button><button onClick={()=>addLabTest()} className="btn"><Plus className="w-4 h-4"/> فحص جديد</button></div>
      <div className="grid xl:grid-cols-2 gap-3">{enterprise.laboratory_partner_contracts_v12.map(l=><Card key={l.id} title={l.laboratory_name} icon={<FlaskConical className="w-5 h-5"/>}>
        <div className="grid sm:grid-cols-2 gap-2"><Text label="اسم المختبر" value={l.laboratory_name} onChange={v=>updateLab(l.id,{laboratory_name:v})}/><Text label="رقم العقد" value={l.contract_number} onChange={v=>updateLab(l.id,{contract_number:v})}/><Text label="المحافظة" value={l.governorate} onChange={v=>updateLab(l.id,{governorate:v})}/><Text label="المديرية" value={l.district} onChange={v=>updateLab(l.id,{district:v})}/><Text label="العنوان" value={l.address} onChange={v=>updateLab(l.id,{address:v})}/><Text label="الهاتف" value={l.phone} onChange={v=>updateLab(l.id,{phone:v})}/></div>
        <div className="grid sm:grid-cols-3 gap-2 mt-2"><Num label="خصم الفحوص %" value={l.default_discount_percent} onChange={v=>updateLab(l.id,{default_discount_percent:Math.max(0,Math.min(100,v))})}/><Num label="خصم أخذ العينة %" value={l.sample_collection_discount_percent} onChange={v=>updateLab(l.id,{sample_collection_discount_percent:Math.max(0,Math.min(100,v))})}/><Num label="التسوية/يوم" value={l.settlement_days} onChange={v=>updateLab(l.id,{settlement_days:v})}/></div>
        <div className="grid sm:grid-cols-2 gap-2 mt-2"><Text label="رابط شعار المختبر" value={l.logo_url||''} onChange={v=>updateLab(l.id,{logo_url:v})}/><label className="text-[10px] text-slate-400"><span>حالة العقد</span><select value={l.status} onChange={e=>updateLab(l.id,{status:e.target.value as LaboratoryPartnerContractV12['status']})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"><option value="draft">مسودة</option><option value="active">نشط</option><option value="suspended">معلّق</option><option value="expired">منتهي</option></select></label></div>
        <div className="mt-2 flex items-center gap-2"><Toggle label="ظاهر للعملاء" value={l.customer_visible} onChange={v=>updateLab(l.id,{customer_visible:v})}/><button onClick={()=>addLabTest(l.id)} className="smallBtn"><Plus className="w-3.5 h-3.5"/> إضافة فحص لهذا المختبر</button></div>
        {l.logo_url?<img src={l.logo_url} alt={l.laboratory_name} className="mt-3 h-20 w-full object-contain bg-white rounded-xl p-2"/>:<div className="mt-3 h-16 border border-dashed border-slate-700 rounded-xl flex items-center justify-center text-[10px] text-slate-500">شعار المختبر يرفع من الإدارة</div>}
        <div className="mt-3 overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="text-slate-400"><Th>الفحص</Th><Th>العينة</Th><Th>الأساسي</Th><Th>الخصم</Th><Th>للعميل</Th><Th>الوقت</Th><Th>فعال</Th></tr></thead><tbody>{enterprise.laboratory_test_prices_v12.filter(t=>t.lab_contract_id===l.id).map(t=><tr key={t.id} className="border-t border-slate-800"><Td><input value={t.test_name} onChange={e=>updateLabTest(t.id,{test_name:e.target.value})} className="inputNum w-28"/></Td><Td><input value={t.sample_type} onChange={e=>updateLabTest(t.id,{sample_type:e.target.value})} className="inputNum w-28"/></Td><Td><input type="number" value={t.base_price_yer} onChange={e=>updateLabTest(t.id,{base_price_yer:Number(e.target.value)})} className="inputNum"/></Td><Td><input type="number" value={t.discount_percent} onChange={e=>updateLabTest(t.id,{discount_percent:Number(e.target.value)})} className="inputNum"/></Td><Td className="text-emerald-300">{money(t.customer_price_yer)}</Td><Td><input type="number" value={t.turnaround_hours} onChange={e=>updateLabTest(t.id,{turnaround_hours:Number(e.target.value)})} className="inputNum"/></Td><Td><button onClick={()=>updateLabTest(t.id,{active:!t.active})} className="smallBtn">{t.active?'نعم':'لا'}</button></Td></tr>)}</tbody></table></div>
      </Card>)}</div>
    </div>}
  </div>;
};

const Card: React.FC<{title:string;icon?:React.ReactNode;children:React.ReactNode}> = ({title,icon,children}) => <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4 shadow-lg"><div className="flex items-center gap-2 text-white font-black mb-3">{icon}<h4>{title}</h4></div>{children}</section>;
const MiniKpi=({n,l}:{n:number;l:string})=><div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2"><div className="text-lg font-black text-cyan-300">{n}</div><div className="text-slate-500">{l}</div></div>;
const ListBox=({title,items}:{title:string;items:string[]})=><div className="box"><b className="text-white">{title}</b><ul className="mt-2 space-y-1 text-[11px] text-slate-300 list-disc pr-4">{items.map((x,i)=><li key={i}>{x}</li>)}</ul></div>;
const Badge=({children}:{children:React.ReactNode})=><span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-200 text-[10px]">{children}</span>;
const Info=({l,v}:{l:string;v:string})=><div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2 text-[11px]"><div className="text-slate-500">{l}</div><div className="text-slate-200 font-bold mt-0.5">{v}</div></div>;
const Kpi=({l,v}:{l:string;v:string})=><div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3"><div className="text-slate-500 text-[10px]">{l}</div><div className="text-emerald-300 font-black mt-1">{v}</div></div>;
const Num=({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void})=><label className="text-[10px] text-slate-400"><span>{label}</span><input type="number" value={value} onChange={e=>onChange(Number(e.target.value))} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white outline-none focus:border-cyan-500"/></label>;
const Text=({label,value,onChange,type='text'}:{label:string;value:string;onChange:(v:string)=>void;type?:string})=><label className="text-[10px] text-slate-400"><span>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white outline-none focus:border-cyan-500"/></label>;
const Toggle=({label,value,onChange}:{label:string;value:boolean;onChange:(v:boolean)=>void})=><button onClick={()=>onChange(!value)} className={`rounded-lg border p-2 text-[10px] flex justify-between ${value?'border-emerald-600/40 bg-emerald-950/20 text-emerald-200':'border-slate-800 bg-slate-950/60 text-slate-400'}`}><span>{label}</span>{value?<CheckCircle2 className="w-3.5 h-3.5"/>:<ToggleLeft className="w-3.5 h-3.5"/>}</button>;
const Th:React.FC<{children:React.ReactNode}>=({children})=><th className="text-right py-2 px-2 whitespace-nowrap">{children}</th>;
const Td:React.FC<{children:React.ReactNode;className?:string}>=({children,className=''})=><td className={`py-2 px-2 text-slate-300 whitespace-nowrap ${className}`}>{children}</td>;
const mortalityText=(c:{mortality_liability:string;mortality_liability_hours:number;mortality_liability_cap_percent?:number})=>c.mortality_liability==='none'?'لا يتحمل النافق':c.mortality_liability==='full_until_handover'?'حتى التسليم المعتمد':`محدود ${c.mortality_liability_hours} ساعة${c.mortality_liability_cap_percent!=null?` وبحد ${c.mortality_liability_cap_percent}%`:''}`;
const feeModeLabel=(x:string)=>x==='fixed_per_kg'?'ر.ي/كجم':x==='fixed_per_load'?'ر.ي/حمولة':'% من البيع';
const nextDayAt=(hhmm:string)=>{const d=new Date();d.setDate(d.getDate()+1);const [h,m]=hhmm.split(':').map(Number);d.setHours(h||19,m||0,0,0);return d.toISOString();};
