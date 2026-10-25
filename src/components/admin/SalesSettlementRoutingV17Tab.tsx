import React, { useMemo, useState } from 'react';
import {
  ArrowRightLeft, BadgeDollarSign, Building2, CheckCircle2, CircleDollarSign, Clock3,
  FileCheck2, FileText, HandCoins, Landmark, MapPin, MessageCircle, PackageCheck,
  ReceiptText, RefreshCw, Route, Scale, Send, ShieldCheck, Store, Truck, Users
} from 'lucide-react';
import { SmartOperationsState, FlockSalePipelineV17, SupplierRoutingOrderV17 } from '../../types';
import {
  activateCurrentBrokerAttemptV17, buildBrokerQueueV17, buildSupplierQueueV17,
  calculateFlockSettlementV17, routeToNextBrokerV17, routeToNextSupplierV17,
  recalcLeaseListingV17
} from '../../services/transactionalRoutingV17';
import { printFlockSettlementV17, printSupplierOrderV17, printLeaseContractV17 } from '../../services/printDocumentsV17';

interface Props {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

type Section = 'flock_sales' | 'supplier_routing' | 'settlements' | 'reports' | 'leasing' | 'controls';
const money = (v:number) => new Intl.NumberFormat('ar-YE').format(Math.round(v || 0));

export const SalesSettlementRoutingV17Tab: React.FC<Props> = ({ operations, onUpdateOperations }) => {
  const e = operations.enterprise;
  const [section, setSection] = useState<Section>('flock_sales');
  const [notice, setNotice] = useState('');
  const [weightDrafts, setWeightDrafts] = useState<Record<string, Record<'large'|'medium'|'small', { birds:number; weight:number; price:number }>>>({});

  const updateEnterprise = (patch: Partial<typeof e>) => onUpdateOperations({ ...operations, enterprise: { ...e, ...patch } });

  const kpis = useMemo(() => ({
    activeSales: e.flock_sales_pipeline_v17.filter(x => !['completed','cancelled'].includes(x.status)).length,
    awaitingSettlement: e.flock_sale_settlements_v17.filter(x => !['closed'].includes(x.status)).length,
    supplierOrders: e.supplier_routing_orders_v17.filter(x => !['delivered','cancelled'].includes(x.status)).length,
    queuedReports: e.routed_reports_v17.filter(x => x.status === 'queued').length,
    leaseListings: e.farm_lease_listings_v17.filter(x => x.admin_review_status !== 'rejected').length
  }), [e]);

  const setPipeline = (updated:FlockSalePipelineV17) => updateEnterprise({ flock_sales_pipeline_v17: e.flock_sales_pipeline_v17.map(x => x.id === updated.id ? updated : x) });

  const startBrokerRouting = (p:FlockSalePipelineV17) => {
    let next=p;
    if (!next.broker_queue.length) {
      next={...next, broker_queue:buildBrokerQueueV17(e.poultry_marketer_contracts_v12,next.governorate,e.v17_config.flock_sale_broker_timeout_minutes),current_broker_index:0};
    }
    next=activateCurrentBrokerAttemptV17(next);
    setPipeline(next); setNotice(`تم إرسال العرض إلى ${next.broker_queue[next.current_broker_index]?.broker_name || 'مسؤول المبيعات للمراجعة'}.`);
  };

  const nextBroker = (p:FlockSalePipelineV17) => { const n=routeToNextBrokerV17(p); setPipeline(n); setNotice(n.status==='human_sales_intervention'?'انتهت قائمة المكاتب؛ تم تحويلها لتدخل مسؤول المبيعات.':`تم تحويل العرض إلى ${n.broker_queue[n.current_broker_index]?.broker_name}.`); };

  const acceptCurrentBroker = (p:FlockSalePipelineV17) => {
    const idx=p.current_broker_index; const cur=p.broker_queue[idx]; if(!cur)return;
    const price=cur.final_price_per_kg_yer || Math.round(p.bourse_price_per_kg_yer*1.01);
    const queue=p.broker_queue.map((x,i)=>i===idx?{...x,status:'accepted' as const,responded_at:new Date().toISOString(),final_price_per_kg_yer:price,settlement_days:x.settlement_days ?? 1,loading_at:x.loading_at || new Date(Date.now()+8*3600_000).toISOString()}:x);
    setPipeline({...p,broker_queue:queue,status:'broker_offer_ready',updated_at:new Date().toISOString()}); setNotice('تم تسجيل قبول المكتب؛ العرض جاهز لعرضه على العميل.');
  };

  const customerAccept = (p:FlockSalePipelineV17) => { setPipeline({...p,customer_final_accepted:true,status:'confirmed',updated_at:new Date().toISOString()}); setNotice('وافق العميل نهائياً؛ يمكن إنشاء التسوية وتجهيز التحميل.'); };
  const customerReject = (p:FlockSalePipelineV17) => {
    const attempts=p.negotiation_attempts+1; const human=attempts>e.v17_config.max_ai_negotiation_attempts;
    setPipeline({...p,negotiation_attempts:attempts,status:human?'human_sales_intervention':'customer_negotiation',updated_at:new Date().toISOString()});
    setNotice(human?'تم إيقاف محاولات الإقناع الآلي وتحويل العميل لمسؤول المبيعات.':'تم تسجيل تردد العميل؛ يسمح للمساعد بشرح الشروط مرة أخرى دون ضغط أو وعود غير مضمونة.');
  };

  const createSettlement = (p:FlockSalePipelineV17) => {
    const accepted=p.broker_queue.find(x=>x.status==='accepted'); if(!accepted?.final_price_per_kg_yer){setNotice('لا يوجد عرض مكتب مقبول بسعر نهائي.');return;}
    const draft=weightDrafts[p.id];
    const classified = draft ? (['large','medium','small'] as const).map((size,index)=>({
      id:`wline-${Date.now()}-${index}`,size_class:size,birds_count:Number(draft[size]?.birds||0),total_weight_kg:Number(draft[size]?.weight||0),price_per_kg_yer:Number(draft[size]?.price||accepted.final_price_per_kg_yer),line_total_yer:Math.round(Number(draft[size]?.weight||0)*Number(draft[size]?.price||accepted.final_price_per_kg_yer))
    })).filter(x=>x.birds_count>0||x.total_weight_kg>0) : [];
    const line={id:`wline-${Date.now()}`,size_class:'mixed' as const,birds_count:p.birds_count,total_weight_kg:p.estimated_live_weight_kg,price_per_kg_yer:accepted.final_price_per_kg_yer,line_total_yer:Math.round(p.estimated_live_weight_kg*accepted.final_price_per_kg_yer)};
    const invoiceLines=classified.length?classified:[line];
    const debt=e.customer_360_v16.find(c=>c.customer_name===p.customer_name)?.outstanding_debt_yer || 0;
    const settlement=calculateFlockSettlementV17(p,invoiceLines,Math.min(debt, Math.round(invoiceLines.reduce((sum,x)=>sum+x.line_total_yer,0)*0.05)),0);
    updateEnterprise({flock_sale_settlements_v17:[settlement,...e.flock_sale_settlements_v17],flock_sales_pipeline_v17:e.flock_sales_pipeline_v17.map(x=>x.id===p.id?{...x,settlement_id:settlement.id,status:'awaiting_broker_payment',updated_at:new Date().toISOString()}:x)});
    setNotice('تم إنشاء التسوية. لا تُحوّل مستحقات العميل حتى تتحقق المالية من وصول مبلغ المكتب.');
  };

  const verifyBrokerPayment = (id:string) => {
    const now=new Date().toISOString();
    const settlements=e.flock_sale_settlements_v17.map(s=>s.id===id?{...s,status:'settlement_ready' as const,broker_payment_reference:s.broker_payment_reference||`BR-${Date.now()}`,broker_payment_verified_by:'الإدارة المالية',broker_payment_verified_at:now}:s);
    const s=settlements.find(x=>x.id===id);
    updateEnterprise({flock_sale_settlements_v17:settlements,flock_sales_pipeline_v17:e.flock_sales_pipeline_v17.map(p=>p.settlement_id===id?{...p,status:'finance_settlement',updated_at:now}:p)});
    setNotice(`تحققت المالية من مبلغ المكتب${s?`؛ صافي العميل ${money(s.net_customer_yer)} ر.ي`:''}.`);
  };

  const payCustomer = (id:string) => {
    const now=new Date().toISOString();
    updateEnterprise({flock_sale_settlements_v17:e.flock_sale_settlements_v17.map(s=>s.id===id?{...s,status:'closed' as const,customer_transfer_reference:`CUST-${Date.now()}`,customer_transfer_at:now}:s),flock_sales_pipeline_v17:e.flock_sales_pipeline_v17.map(p=>p.settlement_id===id?{...p,status:'completed',updated_at:now}:p)});
    setNotice('تم تسجيل تحويل صافي المستحق للعميل وإغلاق التسوية.');
  };

  const setSupplierOrder=(o:SupplierRoutingOrderV17)=>updateEnterprise({supplier_routing_orders_v17:e.supplier_routing_orders_v17.map(x=>x.id===o.id?o:x)});
  const startSupplier=(o:SupplierRoutingOrderV17)=>{
    let q=o.supplier_queue;
    if(!q.length) q=buildSupplierQueueV17(e.partner_trade_contracts_v12,o.category,o.governorate,e.v17_config.supplier_timeout_minutes);
    if(!q.length){setSupplierOrder({...o,status:'sales_review'});setNotice('لا يوجد مورد متعاقد مناسب؛ حُوّل الطلب لمسؤول المبيعات.');return;}
    q=q.map((x,i)=>i===0?{...x,status:'offered' as const,offered_at:new Date().toISOString(),expires_at:new Date(Date.now()+o.supplier_timeout_minutes*60_000).toISOString()}:x);
    setSupplierOrder({...o,supplier_queue:q,current_supplier_index:0,status:'routing_suppliers'});setNotice(`تم توجيه الطلب إلى ${q[0].supplier_name}.`);
  };
  const acceptSupplier=(o:SupplierRoutingOrderV17)=>{const i=o.current_supplier_index;setSupplierOrder({...o,supplier_queue:o.supplier_queue.map((x,idx)=>idx===i?{...x,status:'accepted' as const,confirmed_quantity:o.quantity,confirmed_unit_price_yer:o.official_price_yer,eta_hours:6}:x),status:'supplier_confirmed',payment_status:'awaiting_customer'});};
  const nextSupplier=(o:SupplierRoutingOrderV17)=>{const n=routeToNextSupplierV17(o);setSupplierOrder(n);setNotice(n.status==='sales_review'?'انتهت قائمة الموردين؛ تدخل المبيعات مطلوب.':`انتقل الطلب إلى ${n.supplier_queue[n.current_supplier_index]?.supplier_name}.`);};
  const uploadCustomerPayment=(o:SupplierRoutingOrderV17)=>setSupplierOrder({...o,payment_status:'proof_uploaded',customer_payment_reference:`PAY-${Date.now()}`,status:'awaiting_payment'});
  const verifyCustomerPayment=(o:SupplierRoutingOrderV17)=>setSupplierOrder({...o,payment_status:'verified',finance_verified_by:'الإدارة المالية',finance_verified_at:new Date().toISOString(),invoice_number:o.invoice_number||`INV-V17-${Date.now().toString().slice(-7)}`,supplier_settlement_status:'pending',status:'preparing'});
  const paySupplier=(o:SupplierRoutingOrderV17)=>{if(o.payment_status!=='verified'){setNotice('لا يمكن تحويل مستحق المورد قبل تحقق المالية من دفع العميل للمنصة.');return;}setSupplierOrder({...o,supplier_settlement_status:'paid',supplier_payment_reference:`SUPPAY-${Date.now()}`,status:'preparing'});};

  const acknowledgeReport=(id:string)=>updateEnterprise({routed_reports_v17:e.routed_reports_v17.map(r=>r.id===id?{...r,status:'acknowledged' as const,acknowledged_at:new Date().toISOString()}:r)});
  const approveLease=(id:string)=>updateEnterprise({farm_lease_listings_v17:e.farm_lease_listings_v17.map(l=>l.id===id?recalcLeaseListingV17({...l,admin_review_status:'approved',published:true},e.v17_config.default_lease_commission_percent):l)});
  const createLeaseContract=(id:string)=>{
    const l=e.farm_lease_listings_v17.find(x=>x.id===id); if(!l)return;
    const first=Math.round(l.asking_price_yer*l.advance_payment_percent/100);
    const contract={id:`lease-contract-${Date.now()}`,contract_number:`LEC-${Date.now().toString().slice(-8)}`,listing_id:l.id,lessor_name:l.owner_name,lessee_name:'مستأجر بانتظار الإدخال',start_date:new Date().toISOString().slice(0,10),end_date:'',rent_value_yer:l.asking_price_yer,platform_commission_yer:l.platform_commission_yer,collection_method:'first_payment_escrow' as const,first_payment_yer:first,platform_received_yer:0,owner_net_yer:Math.max(0,first-l.platform_commission_yer),penalty_clause_summary:'البنود القانونية والجزاءات لا تُنشأ تلقائياً؛ تعتمد بعد مراجعة قانونية.',legal_review_status:'required' as const,lessor_signed:false,lessee_signed:false,platform_signed:false,contact_release_allowed:false,status:'awaiting_signatures' as const};
    updateEnterprise({lease_escrow_contracts_v17:[contract,...e.lease_escrow_contracts_v17]}); setNotice('تم إنشاء مسودة عقد إيجار بضمان مالي؛ أرقام التواصل تبقى محجوبة حتى التوقيع/السماح.');
  };

  const fileToDataUrl=(file:File,cb:(url:string)=>void)=>{const r=new FileReader();r.onload=()=>cb(String(r.result));r.readAsDataURL(file);};
  const attachBrokerProof=(id:string,file:File)=>fileToDataUrl(file,url=>updateEnterprise({flock_sale_settlements_v17:e.flock_sale_settlements_v17.map(s=>s.id===id?{...s,broker_payment_proof_url:url,status:s.status==='awaiting_broker_payment'?'payment_under_review':s.status}:s)}));
  const attachCustomerTransferProof=(id:string,file:File)=>fileToDataUrl(file,url=>updateEnterprise({flock_sale_settlements_v17:e.flock_sale_settlements_v17.map(s=>s.id===id?{...s,customer_transfer_proof_url:url}:s)}));

  const tabs:[Section,string,React.ReactNode][]=[
    ['flock_sales','تسويق القطيع',<Scale className="w-4 h-4"/>],['supplier_routing','توريد المدخلات',<PackageCheck className="w-4 h-4"/>],['settlements','المالية والتسويات',<Landmark className="w-4 h-4"/>],['reports','توجيه التقارير',<Send className="w-4 h-4"/>],['leasing','إيجار العنابر',<Building2 className="w-4 h-4"/>],['controls','الضوابط',<ShieldCheck className="w-4 h-4"/>]
  ];

  return <div className="space-y-5">
    <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-l from-slate-950 via-emerald-950/25 to-slate-950 p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div><div className="text-xs text-amber-300 font-black">V17 • Sales, Settlement & Routing Governance</div><h3 className="text-xl font-black text-white mt-1">التسويق والتوجيه التتابعي والتسوية المالية والإيجار</h3><p className="text-xs text-slate-400 mt-2 max-w-4xl">يفصل صلاحيات العميل، الذكاء الاصطناعي، المبيعات، مكاتب التسويق، الموردين والمالية. لا يدفع النظام للعميل قبل تحقق المالية من وصول مبلغ المكتب، ولا يصف الذكاء الاصطناعي مضاداً أو لقاحاً.</p></div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="bg-slate-900 p-3 rounded-xl"><b className="text-emerald-300 text-lg">{kpis.activeSales}</b><div>تسويق نشط</div></div><div className="bg-slate-900 p-3 rounded-xl"><b className="text-amber-300 text-lg">{kpis.awaitingSettlement}</b><div>تسويات</div></div><div className="bg-slate-900 p-3 rounded-xl"><b className="text-cyan-300 text-lg">{kpis.supplierOrders}</b><div>توريد</div></div></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-5">{tabs.map(([key,label,icon])=><button key={key} onClick={()=>setSection(key)} className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${section===key?'bg-amber-500 text-slate-950 border-amber-400':'bg-slate-900 text-slate-300 border-slate-800'}`}>{icon}{label}</button>)}</div>
    </div>
    {notice && <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 text-xs p-3 flex items-center justify-between"><span>{notice}</span><button onClick={()=>setNotice('')} className="text-slate-400">×</button></div>}

    {section==='flock_sales' && <div className="space-y-3">{e.flock_sales_pipeline_v17.map(p=>{const cur=p.broker_queue[p.current_broker_index];const accepted=p.broker_queue.find(x=>x.status==='accepted');return <div key={p.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex flex-wrap justify-between gap-3"><div><div className="text-white font-black">{p.request_number} • {p.customer_name}</div><div className="text-xs text-slate-400">{p.farm_name} • {p.governorate}/{p.district} • {p.birds_count.toLocaleString()} طائر • {p.average_weight_kg} كجم</div></div><span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">{p.status}</span></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs"><Info label="سعر البورصة" value={`${money(p.bourse_price_per_kg_yer)} ر.ي/كجم`}/><Info label="الوزن الحي التقديري" value={`${money(p.estimated_live_weight_kg)} كجم`}/><Info label="المكتب الحالي" value={cur?.broker_name||'-'}/><Info label="عرض المكتب" value={accepted?.final_price_per_kg_yer?`${money(accepted.final_price_per_kg_yer)} ر.ي/كجم`:'-'}/><Info label="السداد" value={accepted?.settlement_days!==undefined?`${accepted.settlement_days} يوم`:'-'}/></div>
      {accepted && <div className="text-xs bg-slate-900 rounded-xl p-3"><b className="text-amber-300">شروط المكتب:</b> تحميل {accepted.loading_at?new Date(accepted.loading_at).toLocaleString('ar-YE'):'يحدد لاحقاً'} • {accepted.mortality_terms}</div>}
      {accepted && <div className="bg-slate-900 rounded-xl p-3"><div className="text-[11px] font-bold text-slate-300 mb-2">فاتورة الوزن الفعلية من مكتب التسويق — كبير / وسط / صغير</div><div className="grid md:grid-cols-3 gap-2">{(['large','medium','small'] as const).map(size=>{const labels={large:'كبير',medium:'وسط',small:'صغير'};const d=weightDrafts[p.id]?.[size]||{birds:0,weight:0,price:accepted.final_price_per_kg_yer||0};const set=(field:'birds'|'weight'|'price',value:number)=>setWeightDrafts(prev=>({...prev,[p.id]:{large:prev[p.id]?.large||{birds:0,weight:0,price:accepted.final_price_per_kg_yer||0},medium:prev[p.id]?.medium||{birds:0,weight:0,price:accepted.final_price_per_kg_yer||0},small:prev[p.id]?.small||{birds:0,weight:0,price:accepted.final_price_per_kg_yer||0},[size]:{...d,[field]:value}}}));return <div key={size} className="bg-slate-950 p-2 rounded-lg text-[10px]"><b className="text-amber-300">{labels[size]}</b><div className="grid grid-cols-3 gap-1 mt-2"><input title="عدد الطيور" type="number" value={d.birds} onChange={ev=>set('birds',Number(ev.target.value))} className="bg-slate-900 border border-slate-700 rounded p-1"/><input title="الوزن كجم" type="number" value={d.weight} onChange={ev=>set('weight',Number(ev.target.value))} className="bg-slate-900 border border-slate-700 rounded p-1"/><input title="السعر/كجم" type="number" value={d.price} onChange={ev=>set('price',Number(ev.target.value))} className="bg-slate-900 border border-slate-700 rounded p-1"/></div></div>})}</div><div className="text-[10px] text-slate-500 mt-2">تُدخل الأرقام من كشف الوزن الحقيقي. إذا تُركت فارغة تُنشأ فاتورة مختلطة مؤقتة للتجربة.</div></div>}
      <div className="flex flex-wrap gap-2"><Btn onClick={()=>startBrokerRouting(p)} icon={<Route/>}>بدء/إعادة التوجيه</Btn><Btn onClick={()=>nextBroker(p)} icon={<RefreshCw/>}>المكتب التالي</Btn><Btn onClick={()=>acceptCurrentBroker(p)} icon={<CheckCircle2/>}>تسجيل قبول المكتب</Btn><Btn onClick={()=>customerAccept(p)} icon={<Users/>}>موافقة العميل</Btn><Btn onClick={()=>customerReject(p)} icon={<MessageCircle/>}>رفض/تردد العميل</Btn><Btn onClick={()=>createSettlement(p)} icon={<ReceiptText/>}>إنشاء التسوية</Btn></div>
    </div>})}</div>}

    {section==='supplier_routing' && <div className="space-y-3">{e.supplier_routing_orders_v17.map(o=>{const cur=o.supplier_queue[o.current_supplier_index];return <div key={o.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"><div className="flex justify-between gap-2"><div><b className="text-white">{o.order_number} • {o.product_name}</b><div className="text-xs text-slate-400">{o.customer_name} • {o.governorate}/{o.district} • {o.quantity} {o.unit_label}</div></div><span className="text-xs text-cyan-300">{o.status}</span></div><div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs"><Info label="سعر اليوم" value={`${money(o.official_price_yer)} ر.ي`}/><Info label="النقل" value={`${money(o.transport_fee_yer)} ر.ي`}/><Info label="المورد الحالي" value={cur?.supplier_name||'-'}/><Info label="اعتماد طبي" value={o.requires_doctor_approval?(o.doctor_approval_reference||'مطلوب'):'غير مطلوب'}/></div><div className="flex flex-wrap gap-2"><Btn onClick={()=>startSupplier(o)} icon={<Route/>}>توجيه للموردين</Btn><Btn onClick={()=>nextSupplier(o)} icon={<ArrowRightLeft/>}>المورد التالي</Btn><Btn onClick={()=>acceptSupplier(o)} icon={<Store/>}>قبول المورد</Btn><Btn onClick={()=>uploadCustomerPayment(o)} icon={<ReceiptText/>}>رفع/تسجيل سند العميل</Btn><Btn onClick={()=>verifyCustomerPayment(o)} icon={<Landmark/>}>المالية: اعتماد الدفع</Btn><Btn onClick={()=>paySupplier(o)} icon={<HandCoins/>}>تحويل مستحق المورد</Btn><Btn onClick={()=>printSupplierOrderV17(o)} icon={<FileText/>}>طباعة الفاتورة</Btn></div></div>})}</div>}

    {section==='settlements' && <div className="space-y-3">{e.flock_sale_settlements_v17.map(s=><div key={s.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"><div className="flex justify-between"><div><b className="text-white">{s.customer_name} ← {s.broker_name}</b><div className="text-xs text-slate-400">تسوية {s.sale_pipeline_id}</div></div><span className="text-xs text-amber-300">{s.status}</span></div><div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs"><Info label="إجمالي البيع" value={`${money(s.gross_sale_yer)} ر.ي`}/><Info label="أجر التسويق" value={`${money(s.marketing_fee_yer)} ر.ي`}/><Info label="عمولة المنصة" value={`${money(s.platform_fee_yer)} ر.ي`}/><Info label="خصم مديونية" value={`${money(s.debt_deduction_yer)} ر.ي`}/><Info label="صافي العميل" value={`${money(s.net_customer_yer)} ر.ي`}/></div><div className="overflow-auto"><table className="w-full text-xs"><thead className="text-slate-400"><tr><th>التصنيف</th><th>العدد</th><th>الوزن</th><th>السعر/كجم</th><th>الإجمالي</th></tr></thead><tbody>{s.invoice_lines.map(l=><tr key={l.id} className="border-t border-slate-800 text-slate-200"><td>{l.size_class}</td><td>{l.birds_count}</td><td>{money(l.total_weight_kg)}</td><td>{money(l.price_per_kg_yer)}</td><td>{money(l.line_total_yer)}</td></tr>)}</tbody></table></div><div className="grid md:grid-cols-2 gap-2 text-[10px]"><label className="bg-slate-900 p-2 rounded-lg">إثبات تحويل مكتب التسويق<input type="file" accept="image/*" onChange={ev=>{const f=ev.target.files?.[0];if(f)attachBrokerProof(s.id,f)}} className="block mt-1 w-full"/></label><label className="bg-slate-900 p-2 rounded-lg">سند تحويل العميل<input type="file" accept="image/*" onChange={ev=>{const f=ev.target.files?.[0];if(f)attachCustomerTransferProof(s.id,f)}} className="block mt-1 w-full"/></label></div><div className="flex gap-2 flex-wrap"><Btn onClick={()=>verifyBrokerPayment(s.id)} icon={<Landmark/>}>المالية: تحقق من مبلغ المكتب</Btn><Btn onClick={()=>payCustomer(s.id)} icon={<HandCoins/>}>تحويل صافي العميل</Btn><Btn onClick={()=>printFlockSettlementV17(s)} icon={<FileText/>}>طباعة الفاتورة/التسوية</Btn></div></div>)}</div>}

    {section==='reports' && <div className="grid lg:grid-cols-2 gap-4"><div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4"><h4 className="font-black text-white mb-3">قواعد التوجيه حسب التخصص</h4><div className="space-y-2">{e.report_routing_rules_v17.map(r=><div key={r.id} className="bg-slate-900 p-3 rounded-xl text-xs flex justify-between gap-3"><div><b className="text-white">{r.category} • {r.governorate}</b><div className="text-slate-400">{r.primary_staff_name} / {r.primary_role} • SLA {r.response_sla_minutes} دقيقة</div></div><div className="text-cyan-300">{r.app_notification?'APP ':''}{r.whatsapp_notification?'WA':''}</div></div>)}</div></div><div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4"><h4 className="font-black text-white mb-3">التقارير الموجهة</h4><div className="space-y-2">{e.routed_reports_v17.map(r=><div key={r.id} className="bg-slate-900 p-3 rounded-xl text-xs"><div className="flex justify-between"><b className="text-white">{r.reference} • {r.category}</b><span className="text-emerald-300">{r.status}</span></div><div className="text-slate-400 mt-1">إلى {r.assigned_to} ({r.assigned_role})</div><p className="text-slate-300 mt-2">{r.summary}</p>{r.status!=='acknowledged'&&<button onClick={()=>acknowledgeReport(r.id)} className="mt-2 text-cyan-300">تأكيد الاستلام</button>}</div>)}</div></div></div>}

    {section==='leasing' && <div className="space-y-4"><div className="space-y-3">{e.farm_lease_listings_v17.map(l=><div key={l.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"><div className="flex justify-between"><div><b className="text-white">{l.listing_number} • {l.governorate}/{l.district}</b><div className="text-xs text-slate-400">{l.hangars_count} عنبر • {l.length_m}×{l.width_m}م • {l.ventilation_type}</div></div><span className="text-xs text-amber-300">{l.admin_review_status}</span></div><div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs"><Info label="السعة التقديرية" value={`${money(l.estimated_capacity_birds)} طائر`}/><Info label="الإيجار" value={`${money(l.asking_price_yer)} ر.ي`}/><Info label="عمولة المنصة" value={`${money(l.platform_commission_yer)} ر.ي`}/><Info label="الصور/الفيديو" value={`${l.image_urls.length}/${l.video_urls.length}`}/><Info label="التواصل" value={l.contact_released?'مسموح':'محجوب'}/></div><div className="text-xs bg-slate-900 p-3 rounded-xl"><b className="text-cyan-300">تقييم أولي:</b> {l.ai_assessment_note||'بانتظار المراجعة'}</div><div className="flex gap-2 flex-wrap"><Btn onClick={()=>approveLease(l.id)} icon={<CheckCircle2/>}>اعتماد ونشر</Btn><Btn onClick={()=>createLeaseContract(l.id)} icon={<FileCheck2/>}>إنشاء عقد Escrow</Btn></div></div>)}</div><div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4"><h4 className="font-black text-white mb-3">عقود الإيجار والضمان</h4>{e.lease_escrow_contracts_v17.map(c=><div key={c.id} className="border-t border-slate-800 py-3 text-xs flex flex-wrap justify-between gap-2"><div><b className="text-white">{c.contract_number} • {c.lessor_name} / {c.lessee_name}</b><div className="text-slate-400">{money(c.rent_value_yer)} ر.ي • {c.collection_method} • قانونياً: {c.legal_review_status}</div></div><Btn onClick={()=>printLeaseContractV17(c)} icon={<FileText/>}>طباعة ملخص العقد</Btn></div>)}</div></div>}

    {section==='controls' && <div className="grid lg:grid-cols-2 gap-4"><div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"><h4 className="text-white font-black">ضوابط دورة البيع والمالية</h4><Config label="مهلة مكتب التسويق" value={`${e.v17_config.flock_sale_broker_timeout_minutes} دقيقة`}/><Config label="مهلة المورد" value={`${e.v17_config.supplier_timeout_minutes} دقيقة`}/><Config label="عمولة المنصة الافتراضية" value={`${e.v17_config.default_platform_sale_commission_percent}%`}/><Config label="محاولات AI للتفاوض" value={`${e.v17_config.max_ai_negotiation_attempts}`}/><Config label="الحساب الرئيسي" value={e.v17_config.platform_main_account_label}/></div><div className="bg-slate-950/70 border border-rose-500/20 rounded-2xl p-4 space-y-3"><h4 className="text-white font-black">حدود الذكاء الاصطناعي</h4><Config label="وصف مضاد حيوي" value="ممنوع"/><Config label="تقرير لقاح/برنامج تحصين مستقل" value="ممنوع"/><Config label="الفيتامينات والمقويات" value="فقط من بروتوكول معتمد من الطبيب"/><Config label="صرف مستحق العميل" value="بعد تحقق المالية من مبلغ مكتب التسويق"/><Config label="بيانات المؤجر/المستأجر" value="تحجب حتى العقد/الموافقة"/></div></div>}
  </div>;
};

const Info=({label,value}:{label:string,value:string})=><div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5"><div className="text-[10px] text-slate-500">{label}</div><div className="text-slate-200 font-bold mt-1 truncate" title={value}>{value}</div></div>;
const Config=({label,value}:{label:string,value:string})=><div className="flex justify-between gap-3 text-xs border-b border-slate-800 pb-2"><span className="text-slate-400">{label}</span><b className="text-slate-100 text-left">{value}</b></div>;
const Btn=({children,onClick,icon}:{children:React.ReactNode,onClick:()=>void,icon:React.ReactNode})=><button onClick={onClick} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5">{icon}{children}</button>;
