import React, { useMemo, useState } from 'react';
import {
  Server, Database, Warehouse, PackageCheck, Truck, FlaskConical, Stethoscope,
  BrainCircuit, Radar, LineChart, CircleDollarSign, Building2, BriefcaseBusiness,
  BellRing, BadgeCheck, ShieldCheck, Crown, ClipboardCheck, RefreshCw, AlertTriangle,
  CheckCircle2, XCircle, LockKeyhole, Boxes, History, Smartphone, FileCheck2, MapPin
} from 'lucide-react';
import { SmartOperationsState, EnterpriseOperationsV11State } from '../../types';

interface Props {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

type Section =
  | 'infrastructure' | 'inventory' | 'orders' | 'clinical' | 'ai'
  | 'epidemic_prices' | 'finance_vendors' | 'hr_push' | 'approvals_security' | 'owner_qa';

const money = (n: number) => new Intl.NumberFormat('ar-YE').format(Math.round(n));

export const EnterpriseOperationsV11Tab: React.FC<Props> = ({ operations, onUpdateOperations }) => {
  const [section, setSection] = useState<Section>('infrastructure');
  const enterprise = operations.enterprise;

  const updateEnterprise = (patch: Partial<EnterpriseOperationsV11State>) => {
    onUpdateOperations({ ...operations, enterprise: { ...enterprise, ...patch } });
  };

  const stats = useMemo(() => ({
    lowStock: enterprise.inventory_lots.filter(i => i.status === 'low_stock' || i.status === 'near_expiry').length,
    activeOrders: enterprise.order_lifecycle.filter(o => !['delivered','cancelled','returned'].includes(o.fulfillment_status)).length,
    labPending: enterprise.lab_orders.filter(l => !['completed','cancelled'].includes(l.status)).length,
    approvals: enterprise.pending_approvals.filter(a => a.status === 'pending').length,
    qaPending: enterprise.launch_qa.filter(q => q.status !== 'passed').length,
    securityReady: Object.values(enterprise.production_security).filter(Boolean).length,
  }), [enterprise]);

  const tabs: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'infrastructure', label: 'Backend والمزامنة', icon: <Server className="w-4 h-4"/> },
    { id: 'inventory', label: 'المخزون والفروع', icon: <Warehouse className="w-4 h-4"/> },
    { id: 'orders', label: 'الطلبات والتوصيل', icon: <Truck className="w-4 h-4"/> },
    { id: 'clinical', label: 'الطب والمختبر', icon: <Stethoscope className="w-4 h-4"/> },
    { id: 'ai', label: 'الذكاء متعدد المراحل', icon: <BrainCircuit className="w-4 h-4"/> },
    { id: 'epidemic_prices', label: 'الأوبئة والأسعار', icon: <Radar className="w-4 h-4"/> },
    { id: 'finance_vendors', label: 'المالية والشركات', icon: <CircleDollarSign className="w-4 h-4"/> },
    { id: 'hr_push', label: 'الموارد والتنبيهات', icon: <BriefcaseBusiness className="w-4 h-4"/> },
    { id: 'approvals_security', label: 'الموافقات والأمان', icon: <ShieldCheck className="w-4 h-4"/> },
    { id: 'owner_qa', label: 'المالك واختبارات الإطلاق', icon: <Crown className="w-4 h-4"/> },
  ];

  const setApproval = (id: string, status: 'approved'|'rejected') => updateEnterprise({
    pending_approvals: enterprise.pending_approvals.map(a => a.id === id ? { ...a, status, approved_by: 'المدير العام' } : a)
  });

  const setQA = (id: string, status: 'passed'|'failed') => updateEnterprise({
    launch_qa: enterprise.launch_qa.map(q => q.id === id ? { ...q, status, last_run_at: new Date().toISOString() } : q)
  });

  const toggleSecurity = (key: keyof typeof enterprise.production_security) => updateEnterprise({
    production_security: { ...enterprise.production_security, [key]: !enterprise.production_security[key] }
  });

  const toggleOwner = (key: keyof Omit<typeof enterprise.owner_controls, 'owner_only_modules'>) => updateEnterprise({
    owner_controls: { ...enterprise.owner_controls, [key]: !enterprise.owner_controls[key] }
  });

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 p-5 shadow-xl">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold"><Boxes className="w-4 h-4"/> V11 • مركز التشغيل المؤسسي الكامل</div>
            <h3 className="text-xl font-black text-white mt-1">جميع إضافات ما قبل الإطلاق في مركز واحد</h3>
            <p className="text-xs text-slate-300 mt-2 max-w-4xl leading-6">يغطي Backend والمزامنة، RBAC، المخزون، الطلبات، التوصيل، الحالات والمختبر، المضادات، الذكاء، رادار الأوبئة، الأسعار، المالية، الموردين، الموارد البشرية، FCM، الموافقات، الأمان، لوحة المالك واختبارات الإطلاق.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] min-w-[330px]">
            <div className="bg-slate-950/70 rounded-xl p-2 border border-slate-800"><div className="text-amber-300 font-black text-lg">{stats.lowStock}</div><div className="text-slate-400">تنبيهات مخزون</div></div>
            <div className="bg-slate-950/70 rounded-xl p-2 border border-slate-800"><div className="text-cyan-300 font-black text-lg">{stats.activeOrders}</div><div className="text-slate-400">طلبات نشطة</div></div>
            <div className="bg-slate-950/70 rounded-xl p-2 border border-slate-800"><div className="text-rose-300 font-black text-lg">{stats.approvals}</div><div className="text-slate-400">موافقات معلقة</div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-10 gap-2">
        {tabs.map(t => <button key={t.id} onClick={() => setSection(t.id)} className={`rounded-xl border px-3 py-2 text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${section===t.id?'bg-emerald-500 text-slate-950 border-emerald-400':'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-emerald-500/50'}`}>{t.icon}{t.label}</button>)}
      </div>

      {section === 'infrastructure' && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="1) Backend + قاعدة البيانات والمزامنة" icon={<Database className="w-5 h-5"/>}>
            <Info label="وضع الخادم" value={enterprise.backend_runtime.mode}/><Info label="API" value={enterprise.backend_runtime.api_base_url}/><Info label="حالة قاعدة البيانات" value={enterprise.backend_runtime.database_status}/><Info label="التخزين" value={enterprise.backend_runtime.storage_status}/><Info label="Offline Queue" value={enterprise.backend_runtime.offline_queue_enabled?'مفعل':'متوقف'}/><Info label="عمليات تنتظر المزامنة" value={String(enterprise.backend_runtime.pending_offline_actions)}/>
            <p className="text-[11px] text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-3">{enterprise.backend_runtime.note}</p>
          </Card>
          <Card title="2) Login/RBAC + سجل التدقيق" icon={<LockKeyhole className="w-5 h-5"/>}>
            <Info label="مزود الدخول" value={operations.integrations.auth_security.provider}/><Info label="RBAC خادمي" value={operations.integrations.auth_security.backend_rbac_enforced?'مفعل':'بانتظار Backend'}/><Info label="MFA للمدير" value={operations.integrations.auth_security.require_mfa_for_admins?'مطلوب':'غير مطلوب'}/><Info label="سجل التدقيق" value={`${operations.audit_log.length} حدثاً`}/>
            <div className="mt-3 text-[11px] text-slate-400">الواجهة تمنع الوصول حسب الدور، والإنتاج يجب أن يفرض نفس القواعد في الخادم وقاعدة البيانات.</div>
          </Card>
        </div>
      )}

      {section === 'inventory' && (
        <div className="space-y-4">
          <Card title="3) مخزون كل فرع + التشغيلة والصلاحية والحجز" icon={<Warehouse className="w-5 h-5"/>}>
            <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-slate-400 border-b border-slate-800"><Th>الفرع</Th><Th>الصنف</Th><Th>Lot</Th><Th>الصلاحية</Th><Th>متاح</Th><Th>محجوز</Th><Th>إعادة طلب</Th><Th>الحالة</Th></tr></thead><tbody>{enterprise.inventory_lots.map(i=><tr key={i.id} className="border-b border-slate-900"><Td>{i.branch_name}</Td><Td>{i.product_name}</Td><Td>{i.lot_number}</Td><Td>{i.expiry_date||'-'}</Td><Td>{i.quantity_on_hand}</Td><Td>{i.quantity_reserved}</Td><Td>{i.reorder_level}</Td><Td><Badge status={i.status}/></Td></tr>)}</tbody></table></div>
          </Card>
          <Card title="تحويل المخزون بين الفروع" icon={<RefreshCw className="w-5 h-5"/>}>
            {enterprise.stock_transfers.map(t=><div key={t.id} className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 text-xs flex flex-wrap gap-3 justify-between"><span>{t.product_name} • {t.quantity} {t.unit_label}</span><span>{t.from_branch_name} ← {t.to_branch_name}</span><Badge status={t.status}/></div>)}
          </Card>
        </div>
      )}

      {section === 'orders' && (
        <div className="grid xl:grid-cols-2 gap-4">
          <Card title="4) دورة الطلب الكاملة + الفاتورة وQR والمرتجعات" icon={<PackageCheck className="w-5 h-5"/>}>
            {enterprise.order_lifecycle.map(o=><div key={o.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 mb-2 text-xs"><div className="flex justify-between gap-2"><b className="text-white">{o.invoice_number}</b><Badge status={o.fulfillment_status}/></div><div className="text-slate-300 mt-1">{o.customer_name} • {o.product_summary}</div><div className="text-emerald-300 mt-1">{money(o.total_amount_yer)} ر.ي • {o.payment_status}</div><div className="text-[10px] text-slate-500 mt-1">حجز مخزون: {o.reserved_inventory?'نعم':'لا'} • QR: {o.qr_reference}</div></div>)}
          </Card>
          <Card title="5) التوصيل واللوجستيات وإثبات التسليم" icon={<Truck className="w-5 h-5"/>}>
            {enterprise.deliveries.map(d=><div key={d.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 mb-2 text-xs"><div className="flex justify-between"><b>{d.driver_name}</b><Badge status={d.status}/></div><div className="text-slate-300 mt-1"><MapPin className="inline w-3 h-3"/> {d.destination_address}</div><div className="text-cyan-300 mt-1">ETA: {d.eta_minutes} دقيقة • {d.driver_phone}</div></div>)}
          </Card>
        </div>
      )}

      {section === 'clinical' && (
        <div className="space-y-4">
          <div className="grid xl:grid-cols-2 gap-4">
            <Card title="6) Case Management الطبي" icon={<Stethoscope className="w-5 h-5"/>}>
              <Info label="الحالات السريرية" value={String(operations.clinical_cases.length)}/><Info label="الحالات قيد المختبر" value={String(stats.labPending)}/><Info label="صور/صوت/تشريح" value="مرتبطة بكل Case مستقل"/><Info label="قرار العلاج" value="Human-in-the-loop فقط"/>
            </Card>
            <Card title="7) محرك المضادات والسلامة والتتبع" icon={<ShieldCheck className="w-5 h-5"/>}>
              {enterprise.antibiotic_safety.map(a=><div key={a.id} className="text-xs rounded-xl border border-slate-800 p-3 bg-slate-950/60"><b className="text-white">{a.medication_name}</b><div className="text-slate-300 mt-1">{a.active_ingredient} • {a.vet_name}</div><div className="text-amber-300 mt-1">تسويق آمن بعد: {a.safe_marketing_date}</div><div className="mt-1">قفل التسويق: {a.marketing_locked?'مفعل':'مفتوح'} • شارة بدون مضاد: {a.antibiotic_free_badge_eligible?'مؤهل':'غير مؤهل'}</div><div className="text-[10px] text-slate-500">QR: {a.qr_trace_code}</div></div>)}
            </Card>
          </div>
          <Card title="8) المختبرات: طلب الفحص وسلسلة حفظ العينة" icon={<FlaskConical className="w-5 h-5"/>}>
            {enterprise.lab_orders.map(l=><div key={l.id} className="grid md:grid-cols-5 gap-2 p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs"><div><b>{l.case_number}</b><br/>{l.laboratory_name}</div><div>{l.sample_type}<br/>{l.sample_count} عينات</div><div>{l.requested_tests.join('، ')}</div><div>{money(l.estimated_cost_yer)} ر.ي</div><div><Badge status={l.status}/></div></div>)}
          </Card>
        </div>
      )}

      {section === 'ai' && (
        <div className="grid xl:grid-cols-2 gap-4">
          <Card title="9) مساعد Stateful لا يكرر الأسئلة" icon={<BrainCircuit className="w-5 h-5"/>}>
            {enterprise.ai_conversations.map(s=><div key={s.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs"><div className="flex justify-between"><b>{s.customer_name}</b><Badge status={s.status}/></div><div className="mt-2 text-cyan-300">المرحلة: {s.current_step}</div><div className="mt-1 text-slate-300">تم جمع: {s.collected_fields.join('، ')}</div><div className="mt-1 text-amber-300">متبقي: {s.missing_fields.join('، ')}</div><div className="mt-2 text-slate-400">{s.last_message}</div></div>)}
          </Card>
          <Card title="10) تحليل الصور والصوت + فحص الجودة" icon={<Smartphone className="w-5 h-5"/>}>
            {enterprise.media_ai_analyses.map(m=><div key={m.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs mb-2"><div className="flex justify-between"><b>{m.target_label}</b><Badge status={m.status}/></div><div className="mt-1">جودة: {m.quality_score}% • الهدف الصحيح: {m.correct_target_detected?'نعم':'لا'} • ثقة المؤشر: {m.confidence}%</div><div className="text-slate-400 mt-1">{m.ai_findings.join(' • ')}</div><div className="text-amber-300 mt-1">تأكيد الطبيب: {m.clinician_confirmation_required?'إلزامي':'غير مطلوب'}</div></div>)}
          </Card>
        </div>
      )}

      {section === 'epidemic_prices' && (
        <div className="grid xl:grid-cols-2 gap-4">
          <Card title="11) رادار الأوبئة والبؤر الجغرافية" icon={<Radar className="w-5 h-5"/>}>
            {enterprise.outbreak_clusters.map(c=><div key={c.id} className="rounded-xl border border-slate-800 p-3 bg-slate-950/60 text-xs"><div className="flex justify-between"><b>{c.disease_name}</b><Badge status={c.risk_level}/></div><div className="mt-1">{c.governorate} / {c.district} • مشتبه: {c.suspected_cases} • مؤكد مختبرياً: {c.lab_confirmed_cases}</div><div className="mt-1 text-rose-300">Heat score: {c.heat_score}/100 • مزارع مجاورة: {c.nearby_farms_count}</div><div className="text-slate-400 mt-1">{c.prevention_message}</div></div>)}
          </Card>
          <Card title="12) سجل الأسعار والبورصة حسب المنطقة" icon={<LineChart className="w-5 h-5"/>}>
            <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-slate-400 border-b border-slate-800"><Th>التاريخ</Th><Th>المنطقة</Th><Th>الصنف</Th><Th>قديم</Th><Th>جديد</Th><Th>SAR</Th><Th>اعتماد</Th></tr></thead><tbody>{enterprise.regional_price_history.map(p=><tr key={p.id} className="border-b border-slate-900"><Td>{p.date}</Td><Td>{p.governorate}</Td><Td>{p.item_name}</Td><Td>{p.price_yer_old?money(p.price_yer_old):'-'}</Td><Td>{p.price_yer_new?money(p.price_yer_new):'-'}</Td><Td>{p.price_sar||'-'}</Td><Td>{p.published?'منشور':'مسودة'}</Td></tr>)}</tbody></table></div>
          </Card>
        </div>
      )}

      {section === 'finance_vendors' && (
        <div className="space-y-4">
          <Card title="13) التقارير المالية الحقيقية حسب الفرع والتكلفة" icon={<CircleDollarSign className="w-5 h-5"/>}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs"><Kpi l="إجمالي الإيراد" v={`${money(enterprise.financial_kpis.gross_revenue_yer)} ر.ي`}/><Kpi l="مجمل الربح" v={`${money(enterprise.financial_kpis.gross_profit_yer)} ر.ي`}/><Kpi l="صافي الربح" v={`${money(enterprise.financial_kpis.net_profit_yer)} ر.ي`}/><Kpi l="الذمم" v={`${money(enterprise.financial_kpis.receivables_yer)} ر.ي`}/></div>
            <div className="mt-3 grid md:grid-cols-2 gap-2">{enterprise.financial_kpis.branch_profitability.map(b=><div key={b.branch_name} className="rounded-xl border border-slate-800 p-3 text-xs"><b>{b.branch_name}</b><div className="text-slate-400 mt-1">إيراد {money(b.revenue_yer)} • تكلفة {money(b.cost_yer)}</div><div className="text-emerald-300">ربح {money(b.profit_yer)} ر.ي</div></div>)}</div>
          </Card>
          <Card title="14) تقارير الشركات والموردين المنفصلة" icon={<Building2 className="w-5 h-5"/>}>
            <div className="grid xl:grid-cols-2 gap-2">{enterprise.vendor_reports.map(v=><div key={v.company_id} className="rounded-xl border border-slate-800 p-3 bg-slate-950/60 text-xs"><b>{v.company_name}</b><div className="text-slate-400 mt-1">{v.category} • {v.products_count} أصناف • {v.units_sold} وحدة</div><div className="mt-1">مبيعات: {money(v.sales_yer)} • عمولة: {money(v.commission_yer)}</div><div className="text-amber-300">مستحق الشركة: {money(v.settlement_due_yer)} ر.ي • الأعلى: {v.top_governorate}</div></div>)}</div>
          </Card>
        </div>
      )}

      {section === 'hr_push' && (
        <div className="grid xl:grid-cols-2 gap-4">
          <Card title="15) التوظيف والموارد البشرية" icon={<BriefcaseBusiness className="w-5 h-5"/>}>
            {enterprise.recruitment_pipeline.map(h=><div key={h.id} className="rounded-xl border border-slate-800 p-3 bg-slate-950/60 text-xs"><div className="flex justify-between"><b>{h.applicant_name}</b><Badge status={h.status}/></div><div>{h.role} • {h.governorate} • خبرة {h.experience_years} سنوات</div><div className="text-amber-300">راتب مطلوب: {money(h.requested_salary_yer)} ر.ي • هوية: {h.identity_verified?'موثقة':'غير موثقة'}</div></div>)}
          </Card>
          <Card title="16) Push Notifications / FCM Campaigns" icon={<BellRing className="w-5 h-5"/>}>
            {enterprise.push_campaigns.map(p=><div key={p.id} className="rounded-xl border border-slate-800 p-3 bg-slate-950/60 text-xs mb-2"><div className="flex justify-between"><b>{p.title}</b><Badge status={p.status}/></div><div className="text-slate-400">{p.body}</div><div className="mt-1">الجمهور: {p.audience}{p.target?` • ${p.target}`:''} • المشغل: {p.trigger}</div></div>)}
            <p className="text-[10px] text-amber-300 mt-2">الإرسال الحقيقي يحتاج FCM متصل عبر Backend؛ الحملات وقواعد الاستهداف موجودة هنا.</p>
          </Card>
        </div>
      )}

      {section === 'approvals_security' && (
        <div className="space-y-4">
          <Card title="17) مركز الموافقات الموحد" icon={<BadgeCheck className="w-5 h-5"/>}>
            {enterprise.pending_approvals.map(a=><div key={a.id} className="grid md:grid-cols-[1fr_auto] gap-3 items-center rounded-xl border border-slate-800 p-3 bg-slate-950/60 text-xs mb-2"><div><div className="flex gap-2 items-center"><b>{a.title}</b><Badge status={a.risk}/><Badge status={a.status}/></div><div className="text-slate-400 mt-1">{a.category} • طلب بواسطة {a.requested_by}{a.amount_yer?` • ${money(a.amount_yer)} ر.ي`:''}</div></div>{a.status==='pending'&&<div className="flex gap-2"><button onClick={()=>setApproval(a.id,'approved')} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold">اعتماد</button><button onClick={()=>setApproval(a.id,'rejected')} className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">رفض</button></div>}</div>)}
          </Card>
          <Card title="18) Security Production Checklist" icon={<ShieldCheck className="w-5 h-5"/>}>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">{Object.entries(enterprise.production_security).map(([k,v])=><button key={k} onClick={()=>toggleSecurity(k as keyof typeof enterprise.production_security)} className={`text-right rounded-xl border p-3 text-xs ${v?'border-emerald-500/30 bg-emerald-500/10':'border-rose-500/30 bg-rose-500/10'}`}><div className="flex items-center justify-between"><span className="font-bold">{securityLabel(k)}</span>{v?<CheckCircle2 className="w-4 h-4 text-emerald-400"/>:<XCircle className="w-4 h-4 text-rose-400"/>}</div></button>)}</div>
            <p className="text-[10px] text-slate-500 mt-3">المفاتيح السرية والتشفير وRate Limiting وApp Check يجب تفعيلها فعلياً في Backend قبل الإنتاج؛ الأزرار هنا تمثل سياسة النظام وحالة الجاهزية.</p>
          </Card>
        </div>
      )}

      {section === 'owner_qa' && (
        <div className="space-y-4">
          <Card title="19) لوحة System Owner المنفصلة" icon={<Crown className="w-5 h-5"/>}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {(['maintenance_mode','disable_marketplace','disable_ai_assistant','disable_payments','allow_new_registrations','require_owner_approval_for_admins'] as const).map(k=><button key={k} onClick={()=>toggleOwner(k)} className="rounded-xl p-3 border border-slate-800 bg-slate-950/60 text-xs flex justify-between"><span>{ownerLabel(k)}</span><b className={enterprise.owner_controls[k]?'text-emerald-300':'text-slate-500'}>{enterprise.owner_controls[k]?'مفعل':'متوقف'}</b></button>)}
            </div>
            <div className="mt-3 text-xs"><b className="text-amber-300">وحدات للمالك فقط:</b> {enterprise.owner_controls.owner_only_modules.join(' • ')}</div>
          </Card>
          <Card title="20) اختبارات ما قبل الإطلاق" icon={<ClipboardCheck className="w-5 h-5"/>}>
            <div className="grid xl:grid-cols-2 gap-2">{enterprise.launch_qa.map(q=><div key={q.id} className="rounded-xl border border-slate-800 p-3 bg-slate-950/60 text-xs"><div className="flex justify-between gap-2"><b>{q.scenario}</b><Badge status={q.status}/></div><div className="text-slate-400 mt-1">المتوقع: {q.expected_result}</div><div className="flex gap-2 mt-2"><button onClick={()=>setQA(q.id,'passed')} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">نجح</button><button onClick={()=>setQA(q.id,'failed')} className="px-2 py-1 rounded bg-rose-500/20 text-rose-300">فشل</button></div></div>)}</div>
          </Card>
        </div>
      )}
    </div>
  );
};

const Card: React.FC<{title:string; icon?:React.ReactNode; children:React.ReactNode}> = ({title,icon,children}) => <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg"><div className="flex items-center gap-2 text-white font-black mb-3">{icon}<h4>{title}</h4></div>{children}</section>;
const Info: React.FC<{label:string;value:string}> = ({label,value}) => <div className="flex justify-between gap-3 py-1.5 text-xs border-b border-slate-800/60"><span className="text-slate-400">{label}</span><span className="text-slate-100 font-bold text-left">{value}</span></div>;
const Kpi: React.FC<{l:string;v:string}> = ({l,v}) => <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3"><div className="text-slate-400 text-[10px]">{l}</div><div className="text-emerald-300 font-black mt-1">{v}</div></div>;
const Th: React.FC<{children:React.ReactNode}> = ({children}) => <th className="text-right py-2 px-2 whitespace-nowrap">{children}</th>;
const Td: React.FC<{children:React.ReactNode}> = ({children}) => <td className="py-2 px-2 text-slate-300 whitespace-nowrap">{children}</td>;
const Badge: React.FC<{status:string}> = ({status}) => <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-[10px]">{status.replaceAll('_',' ')}</span>;

function securityLabel(k:string){return ({otp_enabled:'OTP للهاتف',admin_mfa_required:'MFA للمدير',api_keys_server_only:'مفاتيح API في الخادم فقط',storage_rules_enforced:'قواعد Storage',rate_limiting_enabled:'Rate Limiting',app_check_enabled:'App Check',jwt_rotation_enabled:'JWT Rotation',device_registration_enabled:'تسجيل الأجهزة',remote_session_revoke_enabled:'إلغاء جلسة جهاز',pii_encryption_enabled:'تشفير البيانات الحساسة',immutable_audit_log_enabled:'Audit Log غير قابل للتعديل',automated_backup_enabled:'نسخ احتياطي آلي'} as Record<string,string>)[k]||k;}
function ownerLabel(k:string){return ({maintenance_mode:'وضع الصيانة',disable_marketplace:'إيقاف السوق',disable_ai_assistant:'إيقاف المساعد الذكي',disable_payments:'إيقاف المدفوعات',allow_new_registrations:'السماح بالتسجيل الجديد',require_owner_approval_for_admins:'موافقة المالك لإنشاء مدير'} as Record<string,string>)[k]||k;}
