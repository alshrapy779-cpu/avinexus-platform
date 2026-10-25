import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeDollarSign,
  BellRing,
  CheckCircle2,
  ClipboardList,
  Coins,
  CreditCard,
  Egg,
  MapPinned,
  Save,
  ShieldCheck,
  Siren,
  Star,
  Store,
  Truck,
  Users,
  Volume2,
  Images
} from 'lucide-react';
import {
  PoultrySaleRequest,
  PoultryDailyPrice,
  PushNotificationRecord,
  SmartOperationsState,
  StaffMember,
  AcousticAnalysisSession,
  NecropsyCase
} from '../../types';

interface SmartOperationsCenterProps {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
  saleRequests: PoultrySaleRequest[];
  onUpdateSaleRequests: (requests: PoultrySaleRequest[]) => void;
  poultryPrices: PoultryDailyPrice[];
  onUpdatePoultryPrices: (prices: PoultryDailyPrice[]) => void;
  staffMembers: StaffMember[];
  acousticSessions: AcousticAnalysisSession[];
  necropsyCases: NecropsyCase[];
}

type OperationsTab = 'queues' | 'purchases' | 'payments' | 'clinical' | 'services' | 'media' | 'credit' | 'emergency' | 'pricing' | 'directory' | 'jobs' | 'chicks' | 'notifications';

export const SmartOperationsCenter: React.FC<SmartOperationsCenterProps> = ({
  operations,
  onUpdateOperations,
  saleRequests,
  onUpdateSaleRequests,
  poultryPrices,
  onUpdatePoultryPrices,
  staffMembers,
  acousticSessions,
  necropsyCases
}) => {
  const [activeTab, setActiveTab] = useState<OperationsTab>('queues');
  const [rates, setRates] = useState(operations.exchange_rates);
  const [notificationBody, setNotificationBody] = useState('تم تحديث أسعار بورصة الدواجن والأعلاف اليوم.');
  const [notificationTitle, setNotificationTitle] = useState('تحديث الأسعار اليومية');

  const blockedCredits = operations.credit_accounts.filter((a) => a.status === 'blocked_over_limit').length;
  const openEmergencies = operations.emergency_requests.filter((e) => !['approved_closed'].includes(e.status)).length;
  const pendingSales = saleRequests.filter((r) => !['completed', 'approved_deal'].includes(r.status)).length;
  const pendingPurchases = operations.purchase_requests.filter((r) => !['confirmed', 'delivered', 'rejected'].includes(r.status)).length;

  const totalDebt = useMemo(
    () => operations.credit_accounts.reduce((sum, account) => sum + account.current_debt_yer, 0),
    [operations.credit_accounts]
  );

  const updateCreditStatus = (accountId: string, allowOverride: boolean) => {
    onUpdateOperations({
      ...operations,
      credit_accounts: operations.credit_accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              status: allowOverride ? 'admin_override' : account.current_debt_yer > account.credit_limit_yer ? 'blocked_over_limit' : 'within_limit',
              admin_override_note: allowOverride ? 'موافقة مباشرة من الإدارة على طلبات جديدة رغم تجاوز الحد.' : undefined,
              updated_at: new Date().toISOString()
            }
          : account
      )
    });
  };

  const saveExchangeRates = () => {
    onUpdateOperations({
      ...operations,
      exchange_rates: { ...rates, last_updated: new Date().toISOString(), updated_by: 'المدير العام' }
    });
  };

  const assignEmergency = (requestId: string, staffId: string) => {
    const staff = staffMembers.find((s) => s.id === staffId);
    onUpdateOperations({
      ...operations,
      emergency_requests: operations.emergency_requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              assigned_staff_id: staff?.id,
              assigned_staff_name: staff?.name,
              status: staff ? 'assigned' : 'new'
            }
          : req
      )
    });
  };

  const closeEmergency = (requestId: string) => {
    onUpdateOperations({
      ...operations,
      emergency_requests: operations.emergency_requests.map((req) =>
        req.id === requestId ? { ...req, status: 'approved_closed', admin_approved: true } : req
      )
    });
  };

  const updateSaleStatus = (requestId: string, status: PoultrySaleRequest['status']) => {
    const request = saleRequests.find((item) => item.id === requestId);
    onUpdateSaleRequests(
      saleRequests.map((item) =>
        item.id === requestId
          ? { ...item, status, resolved_at: ['approved_deal', 'completed'].includes(status) ? new Date().toISOString() : item.resolved_at }
          : item
      )
    );

    if (request && status === 'approved_deal') {
      const account = operations.credit_accounts.find((item) => item.customer_name === request.farmer_name);
      if (account && account.current_debt_yer > 0) {
        const deduction = Math.min(account.current_debt_yer, request.ai_total_estimated_value_yer);
        const remainingDebt = account.current_debt_yer - deduction;
        onUpdateOperations({
          ...operations,
          credit_accounts: operations.credit_accounts.map((item) =>
            item.id === account.id
              ? {
                  ...item,
                  current_debt_yer: remainingDebt,
                  status: remainingDebt > item.credit_limit_yer ? 'blocked_over_limit' : remainingDebt > item.credit_limit_yer * 0.85 ? 'near_limit' : 'within_limit',
                  updated_at: new Date().toISOString()
                }
              : item
          ),
          debt_ledger: [
            {
              id: `debt-${Date.now()}`,
              credit_account_id: account.id,
              date: new Date().toISOString(),
              type: 'marketing_deduction',
              category: 'تسويق دواجن',
              amount_yer: deduction,
              reference: request.id,
              status: remainingDebt === 0 ? 'settled' : 'open',
              notes: 'خصم آلي من مديونية العميل عند اعتماد صفقة تسويق القطيع.'
            },
            ...operations.debt_ledger
          ]
        });
      }
    }
  };

  const updateZone = (zoneId: string, field: 'transport_fee_yer' | 'field_visit_fee_yer' | 'marketing_fee_yer' | 'transport_cost_yer' | 'field_visit_cost_yer' | 'marketing_cost_yer', value: number) => {
    onUpdateOperations({
      ...operations,
      zone_service_prices: operations.zone_service_prices.map((zone) =>
        zone.id === zoneId
          ? { ...zone, [field]: Number(value), last_updated: new Date().toISOString() }
          : zone
      )
    });
  };

  const activateZone = (zoneId: string) => {
    onUpdateOperations({
      ...operations,
      zone_service_prices: operations.zone_service_prices.map((zone) =>
        zone.id === zoneId
          ? { ...zone, status: 'active', last_updated: new Date().toISOString() }
          : zone
      )
    });
  };

  const updatePoultryPrice = (id: string, field: 'farmgate_price_per_kg_yer' | 'consumer_price_per_kg_yer', value: number) => {
    onUpdatePoultryPrices(poultryPrices.map((p) => p.id === id ? { ...p, [field]: Number(value), date: new Date().toISOString().split('T')[0] } : p));
  };

  const updateChickPrice = (id: string, sar: number) => {
    onUpdateOperations({
      ...operations,
      chick_prices: operations.chick_prices.map((item) =>
        item.id === id
          ? {
              ...item,
              price_per_chick_sar: Number(sar),
              price_per_chick_yer_old: Math.round(Number(sar) * operations.exchange_rates.sar_to_yer_old),
              price_per_chick_yer_new: Math.round(Number(sar) * operations.exchange_rates.sar_to_yer_new),
              date: new Date().toISOString().split('T')[0]
            }
          : item
      )
    });
  };

  const sendNotification = () => {
    if (!notificationTitle.trim() || !notificationBody.trim()) return;
    const item: PushNotificationRecord = {
      id: `not-${Date.now()}`,
      created_at: new Date().toISOString(),
      title: notificationTitle.trim(),
      body: notificationBody.trim(),
      audience: 'all_customers',
      type: 'price_update',
      priority: 'normal',
      sent: true
    };
    onUpdateOperations({ ...operations, notifications: [item, ...operations.notifications] });
  };

  const updatePurchaseStatus = (requestId: string, action: 'approve_vet' | 'reject') => {
    onUpdateOperations({
      ...operations,
      purchase_requests: operations.purchase_requests.map((request) =>
        request.id === requestId
          ? action === 'approve_vet'
            ? { ...request, vet_approved: true, status: request.transport_fee_accepted ? 'awaiting_payment' : 'pending_customer_fee_acceptance' }
            : { ...request, status: 'rejected' }
          : request
      )
    });
  };

  const approvePayment = (verificationId: string, approved: boolean) => {
    const verification = operations.payment_verifications.find((v) => v.id === verificationId);
    if (!verification) return;
    const request = operations.purchase_requests.find((r) => r.id === verification.purchase_request_id);
    const now = new Date().toISOString();

    let enterprise = operations.enterprise;
    if (approved && request) {
      const lot = enterprise.inventory_lots.find((i) =>
        i.product_id === request.product_id &&
        (!request.assigned_branch_id || i.branch_id === request.assigned_branch_id) &&
        (i.quantity_on_hand - i.quantity_reserved) >= request.quantity &&
        !['expired','blocked'].includes(i.status)
      );
      const reserved = Boolean(lot);
      const inventory_lots = enterprise.inventory_lots.map((i) => i.id === lot?.id ? { ...i, quantity_reserved: i.quantity_reserved + request.quantity } : i);
      const exists = enterprise.order_lifecycle.some((o) => o.purchase_request_id === request.id);
      const order_lifecycle = exists ? enterprise.order_lifecycle : [{
        id: `ord-${Date.now()}`,
        purchase_request_id: request.id,
        customer_name: request.customer_name,
        product_summary: `${request.product_name} × ${request.quantity} ${request.unit_label}`,
        branch_name: request.assigned_branch_name || lot?.branch_name || 'بانتظار تحديد الفرع',
        total_amount_yer: request.grand_total_local,
        payment_status: 'paid' as const,
        fulfillment_status: 'paid' as const,
        reserved_inventory: reserved,
        invoice_number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        qr_reference: `ORDER:${request.id}:${String(Date.now()).slice(-6)}`,
        created_at: now,
        updated_at: now,
        delivery_fee_yer: request.transport_fee_local,
        paid_amount_yer: request.grand_total_local
      }, ...enterprise.order_lifecycle];
      enterprise = { ...enterprise, inventory_lots, order_lifecycle };
    }

    onUpdateOperations({
      ...operations,
      enterprise,
      payment_verifications: operations.payment_verifications.map((v) => v.id === verificationId ? { ...v, status: approved ? 'approved' : 'rejected', reviewed_by: 'المالية', reviewed_at: now, finance_note: approved ? 'تمت مطابقة الحوالة واعتماد وصول المبلغ.' : 'الحوالة تحتاج مراجعة/إعادة إثبات.' } : v),
      purchase_requests: operations.purchase_requests.map((r) => r.id === verification.purchase_request_id ? { ...r, finance_approved: approved, finance_approved_by: approved ? 'المالية' : undefined, finance_approved_at: approved ? now : undefined, status: approved ? 'payment_verified' : 'awaiting_payment' } : r)
    });
  };

  const updatePurchaseFulfilment = (requestId: string, status: 'preparing' | 'out_for_delivery' | 'delivered') => {
    const request = operations.purchase_requests.find((r) => r.id === requestId);
    const now = new Date().toISOString();
    let enterprise = {
      ...operations.enterprise,
      order_lifecycle: operations.enterprise.order_lifecycle.map((o) => o.purchase_request_id === requestId ? { ...o, fulfillment_status: status, updated_at: now } : o)
    };
    if (status === 'out_for_delivery' && request && !enterprise.deliveries.some((d) => d.order_id === enterprise.order_lifecycle.find((o) => o.purchase_request_id === requestId)?.id)) {
      const order = enterprise.order_lifecycle.find((o) => o.purchase_request_id === requestId);
      if (order) enterprise = { ...enterprise, deliveries: [{ id: `del-${Date.now()}`, order_id: order.id, driver_name: 'بانتظار تعيين المندوب', driver_phone: '-', branch_name: order.branch_name, destination_address: request.customer_address, eta_minutes: request.delivery_eta_hours ? request.delivery_eta_hours * 60 : 120, status: 'assigned' }, ...enterprise.deliveries] };
    }
    if (status === 'delivered' && request) {
      enterprise = { ...enterprise, inventory_lots: enterprise.inventory_lots.map((i) => i.product_id === request.product_id && (!request.assigned_branch_id || i.branch_id === request.assigned_branch_id) && i.quantity_reserved >= request.quantity ? { ...i, quantity_on_hand: Math.max(0, i.quantity_on_hand - request.quantity), quantity_reserved: Math.max(0, i.quantity_reserved - request.quantity) } : i), deliveries: enterprise.deliveries.map((d) => d.order_id === enterprise.order_lifecycle.find((o) => o.purchase_request_id === requestId)?.id ? { ...d, status: 'delivered', delivered_at: now } : d) };
    }
    onUpdateOperations({ ...operations, enterprise, purchase_requests: operations.purchase_requests.map((r) => r.id === requestId ? { ...r, status } : r) });
  };

  const updateZoneMeta = (zoneId: string, field: 'delivery_eta_hours' | 'branch_name' | 'branch_address', value: number | string) => {
    onUpdateOperations({ ...operations, zone_service_prices: operations.zone_service_prices.map((z) => z.id === zoneId ? { ...z, [field]: value, last_updated: new Date().toISOString() } : z) });
  };

  const updateBranch = (branchId: string, field: 'name' | 'address' | 'phone' | 'market_name' | 'governorate' | 'district', value: string) => {
    onUpdateOperations({ ...operations, branches: operations.branches.map((b) => b.id === branchId ? { ...b, [field]: value } : b) });
  };

  const assignService = (requestId: string) => {
    const req = operations.supervision_requests.find((r) => r.id === requestId);
    if (!req) return;
    const staff = staffMembers.filter((s) => s.status === 'نشط' && s.is_online && s.on_duty && s.permissions.can_order_field_visits).sort((a,b) => (a.governorate.includes(req.governorate) ? 0 : 1) - (b.governorate.includes(req.governorate) ? 0 : 1) || a.active_cases_count - b.active_cases_count)[0];
    onUpdateOperations({ ...operations, supervision_requests: operations.supervision_requests.map((r) => r.id === requestId ? { ...r, assigned_staff_id: staff?.id, assigned_staff_name: staff?.name, status: staff ? 'assigned' : 'accepted' } : r) });
  };

  const updateClinicalStatus = (id: string, status: 'awaiting_field_visit' | 'awaiting_lab' | 'under_vet_review' | 'closed') => {
    onUpdateOperations({
      ...operations,
      clinical_cases: operations.clinical_cases.map((c) => c.id === id ? { ...c, status } : c)
    });
  };

  const updateJob = (id: string, status: 'under_review' | 'approved_pool' | 'rejected') => {
    onUpdateOperations({ ...operations, job_applications: operations.job_applications.map((j) => j.id === id ? { ...j, status } : j) });
  };

  const updatePaymentAccount = (id: string, field: 'provider' | 'account_name' | 'account_number' | 'currency' | 'instructions', value: string) => {
    onUpdateOperations({ ...operations, payment_accounts: operations.payment_accounts.map((a) => a.id === id ? { ...a, [field]: value } : a) });
  };

  const addPaymentAccount = () => {
    onUpdateOperations({ ...operations, payment_accounts: [...operations.payment_accounts, { id: `pay-${Date.now()}`, provider: 'أخرى', account_name: 'حساب تحويل جديد', account_number: 'أدخل الرقم', currency: 'YER', active: true, instructions: 'يرفع العميل صورة الحوالة بعد التحويل.' }] });
  };

  const addBranch = () => {
    onUpdateOperations({ ...operations, branches: [...operations.branches, { id: `br-${Date.now()}`, name: 'فرع جديد', governorate: 'حدد المحافظة', district: 'حدد المديرية', address: 'أدخل العنوان', phone: 'أدخل الهاتف', active: true }] });
  };

  const updatePackage = (id: string, field: 'base_fee_yer' | 'per_hangar_fee_yer' | 'per_1000_birds_fee_yer', value: number) => {
    onUpdateOperations({ ...operations, supervision_packages: operations.supervision_packages.map((p) => p.id === id ? { ...p, [field]: Number(value) } : p) });
  };

  const updateLab = (id: string, field: 'name' | 'address' | 'phone' | 'governorate' | 'district' | 'sample_collection_fee_yer' | 'base_test_price_yer' | 'turnaround_hours', value: string | number) => {
    onUpdateOperations({ ...operations, laboratories: operations.laboratories.map((l) => l.id === id ? { ...l, [field]: value } : l) });
  };

  const addLab = () => {
    onUpdateOperations({ ...operations, laboratories: [...operations.laboratories, { id: `lab-${Date.now()}`, name: 'مختبر جديد', governorate: 'حدد المحافظة', district: 'حدد المديرية', address: 'أدخل العنوان', phone: 'أدخل الهاتف', tests: ['فحص بيطري أساسي'], sample_collection_fee_yer: 0, base_test_price_yer: 0, turnaround_hours: 24, active: true }] });
  };

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('تعذر قراءة الصورة')); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });

  const uploadGuideImage = async (guideId: string, file?: File) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    onUpdateOperations({ ...operations, necropsy_guides: operations.necropsy_guides.map((g) => g.id === guideId ? { ...g, image_url: url, approved_by_admin: true } : g) });
  };

  const tabs: { id: OperationsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'queues', label: 'طوابير الطلبات', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'purchases', label: `طلبات الشراء (${pendingPurchases})`, icon: <Store className="w-4 h-4" /> },
    { id: 'payments', label: `المالية والحوالات (${operations.payment_verifications.filter(v => v.status === 'under_finance_review').length})`, icon: <CreditCard className="w-4 h-4" /> },
    { id: 'clinical', label: `الحالات المرضية (${operations.clinical_cases.length})`, icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'services', label: 'الإشراف والمتابعة', icon: <Users className="w-4 h-4" /> },
    { id: 'media', label: 'الصوت وصور التشريح', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'credit', label: 'المديونيات والآجل', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'emergency', label: 'الطوارئ الميدانية', icon: <Siren className="w-4 h-4" /> },
    { id: 'pricing', label: 'العملات وأجور المناطق', icon: <Coins className="w-4 h-4" /> },
    { id: 'directory', label: 'الفروع والمختبرات', icon: <MapPinned className="w-4 h-4" /> },
    { id: 'jobs', label: `طلبات الوظائف (${operations.job_applications.length})`, icon: <Users className="w-4 h-4" /> },
    { id: 'chicks', label: 'بورصة الكتاكيت', icon: <Egg className="w-4 h-4" /> },
    { id: 'notifications', label: 'التنبيهات', icon: <BellRing className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-5" dir="rtl">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Metric icon={<Store className="w-5 h-5" />} label="طلبات التسويق المفتوحة" value={pendingSales.toString()} tone="emerald" />
        <Metric icon={<ClipboardList className="w-5 h-5" />} label="طلبات الشراء المعلقة" value={pendingPurchases.toString()} tone="cyan" />
        <Metric icon={<Siren className="w-5 h-5" />} label="طوارئ ميدانية نشطة" value={openEmergencies.toString()} tone="rose" />
        <Metric icon={<CreditCard className="w-5 h-5" />} label="حسابات متجاوزة للحد" value={blockedCredits.toString()} tone="amber" />
        <Metric icon={<BadgeDollarSign className="w-5 h-5" />} label="إجمالي المديونية" value={`${totalDebt.toLocaleString()} ر.ي`} tone="cyan" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === tab.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'}`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'queues' && (
        <section className="space-y-3">
          <SectionTitle icon={<Store className="w-4 h-4" />} title="طلبات تسويق الدواجن" subtitle="كل طلب يمر عبر بوابة السلامة ثم المراجعة الإدارية قبل اعتماد الصفقة." />
          <div className="space-y-3">
            {saleRequests.map((request) => (
              <div key={request.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid lg:grid-cols-[1.3fr_.8fr_auto] gap-4 items-center">
                <div>
                  <div className="font-black text-white text-sm">{request.farm_name}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{request.farmer_name} • {request.governorate} / {request.district} • {request.bird_count.toLocaleString()} طائر</div>
                  <div className="text-[11px] text-slate-400 mt-1">متوسط الوزن {request.average_weight_kg} كجم • قيمة استرشادية {request.ai_total_estimated_value_yer.toLocaleString()} ريال</div>
                </div>
                <div className="text-xs">
                  <div className="text-slate-400">السعر المطلوب / المقترح</div>
                  <div className="font-mono font-black text-white mt-1">{request.farmer_requested_price_per_kg.toLocaleString()} / <span className="text-emerald-400">{request.ai_recommended_price_per_kg.toLocaleString()}</span></div>
                  <StatusPill text={request.status} />
                </div>
                <div className="flex lg:flex-col gap-2">
                  <button onClick={() => updateSaleStatus(request.id, 'approved_deal')} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">اعتماد الصفقة</button>
                  <button onClick={() => updateSaleStatus(request.id, 'under_review_by_admin')} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">مراجعة الإدارة</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'purchases' && (
        <section className="space-y-3">
          <SectionTitle icon={<Store className="w-4 h-4" />} title="طلبات شراء العملاء" subtitle="يشمل شراء الأدوية والأعلاف والمعدات والكتاكيت، مع توثيق موافقة العميل على أجرة المنطقة وبوابة الطبيب للمضادات الحيوية." />
          <div className="space-y-3">
            {operations.purchase_requests.length === 0 && <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">لا توجد طلبات شراء حتى الآن.</div>}
            {operations.purchase_requests.map((request) => (
              <div key={request.id} className={`bg-slate-900 border rounded-2xl p-4 space-y-3 ${request.is_antibiotic ? 'border-rose-800/60' : 'border-slate-800'}`}>
                <div className="grid lg:grid-cols-[1.2fr_.9fr_auto] gap-4 items-start">
                  <div>
                    <div className="font-black text-white text-sm">{request.product_name}</div>
                    <div className="text-[11px] text-cyan-300 mt-1">{request.customer_name} • {request.phone}</div><div className="text-[10px] text-slate-500 mt-1">{request.customer_address}</div><div className="text-[11px] text-slate-400 mt-1">{request.category} • الكمية {request.quantity} {request.unit_label} • {request.governorate} / {request.district}</div>
                    <div className="text-[11px] text-slate-400 mt-1">الأصناف: {request.product_total_local.toLocaleString()} • النقل: {request.transport_fee_local.toLocaleString()} • الإجمالي: <strong className="text-emerald-300">{request.grand_total_local.toLocaleString()} {request.currency_label}</strong></div>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div className={request.transport_fee_accepted ? 'text-emerald-300' : 'text-amber-300'}>أجرة المنطقة: {request.transport_fee_accepted ? 'وافق العميل' : 'لم تعتمد من العميل بعد'}</div>
                    <StatusPill text={request.status} />
                    {request.is_antibiotic && <div className={request.vet_approved ? 'text-emerald-300' : 'text-rose-300'}>موافقة الطبيب: {request.vet_approved ? 'تم الاعتماد' : 'مطلوبة'}</div>}
                  </div>
                  <div className="flex flex-col gap-2">
                    {request.is_antibiotic && !request.vet_approved && request.status !== 'rejected' && <button onClick={() => updatePurchaseStatus(request.id, 'approve_vet')} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black">اعتماد الطبيب والسماح بالشراء</button>}
                    {request.status === 'payment_verified' && <button onClick={() => updatePurchaseFulfilment(request.id, 'preparing')} className="px-3 py-2 rounded-xl bg-cyan-600 text-white text-xs font-black">بدء التجهيز</button>}{request.status === 'preparing' && <button onClick={() => updatePurchaseFulfilment(request.id, 'out_for_delivery')} className="px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-black">خرج للتوصيل</button>}{request.status === 'out_for_delivery' && <button onClick={() => updatePurchaseFulfilment(request.id, 'delivered')} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black">تم التسليم</button>}{request.status !== 'rejected' && <button onClick={() => updatePurchaseStatus(request.id, 'reject')} className="px-3 py-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold">رفض الطلب</button>}
                  </div>
                </div>
                {request.antibiotic_case && (
                  <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 grid md:grid-cols-3 gap-2 text-[11px] text-slate-300">
                    <div><span className="text-slate-500">القطيع:</span> {request.antibiotic_case.flock_size.toLocaleString()} طائر • عمر {request.antibiotic_case.flock_age_days} يوم</div>
                    <div><span className="text-slate-500">النافق:</span> {request.antibiotic_case.mortality_today} • الحرارة {request.antibiotic_case.temperature_celsius}°</div>
                    <div><span className="text-slate-500">العلف/الماء:</span> {request.antibiotic_case.feed_consumption_kg} كجم / {request.antibiotic_case.water_consumption_liters} لتر</div>
                    <div className="md:col-span-3"><span className="text-slate-500">سبب الطلب:</span> {request.antibiotic_case.reason_for_request}</div>
                    <div className="md:col-span-3"><span className="text-slate-500">الأعراض:</span> {request.antibiotic_case.symptoms}</div>
                    <div className="md:col-span-3"><span className="text-slate-500">العنوان:</span> {request.antibiotic_case.farm_address}</div>
                    {(request.antibiotic_case.diarrhea_image_note || request.antibiotic_case.necropsy_image_note) && <div className="md:col-span-3 text-cyan-300">المرفقات: {request.antibiotic_case.diarrhea_image_note} {request.antibiotic_case.necropsy_image_note}</div>}
                    {(request.antibiotic_case.diarrhea_image_url || request.antibiotic_case.necropsy_image_urls?.length) ? (
                      <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        {request.antibiotic_case.diarrhea_image_url && (
                          <a href={request.antibiotic_case.diarrhea_image_url} target="_blank" rel="noreferrer" className="rounded-xl overflow-hidden border border-rose-900/50 bg-black/20">
                            <img src={request.antibiotic_case.diarrhea_image_url} alt="صورة الإسهال" className="w-full h-32 object-contain bg-black/20" />
                            <span className="block p-1 text-[9px] text-center text-rose-300">صورة الإسهال • فتح الأصل</span>
                          </a>
                        )}
                        {request.antibiotic_case.necropsy_image_urls?.map((url, index) => (
                          <a key={index} href={url} target="_blank" rel="noreferrer" className="rounded-xl overflow-hidden border border-cyan-900/50 bg-black/20">
                            <img src={url} alt={`صورة تشريح ${index + 1}`} className="w-full h-32 object-contain bg-black/20" />
                            <span className="block p-1 text-[9px] text-center text-cyan-300">تشريح {index + 1} • فتح الأصل</span>
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'payments' && (
        <section className="space-y-3">
          <SectionTitle icon={<CreditCard className="w-4 h-4" />} title="المالية والتحقق من الحوالات" subtitle="الإدارة تحدد حسابات التحويل، وكل إثبات دفع يبقى قيد المراجعة حتى تعتمد المالية وصول المبلغ فعلياً." />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"><div className="flex justify-between items-center"><div className="text-xs font-black text-white">حسابات ومحافظ التحويل التي تظهر للعملاء</div><button onClick={addPaymentAccount} className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-[11px] font-bold">إضافة حساب</button></div><div className="grid lg:grid-cols-2 gap-2">{operations.payment_accounts.map(a=><div key={a.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 grid grid-cols-2 gap-2 text-[10px]"><select value={a.provider} onChange={e=>updatePaymentAccount(a.id,'provider',e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"><option>الكريمي</option><option>جيب</option><option>حاسب</option><option>كاش</option><option>حوالة شبكية</option><option>أخرى</option></select><select value={a.currency} onChange={e=>updatePaymentAccount(a.id,'currency',e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"><option>YER</option><option>SAR</option></select><input value={a.account_name} onChange={e=>updatePaymentAccount(a.id,'account_name',e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" /><input value={a.account_number} onChange={e=>updatePaymentAccount(a.id,'account_number',e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono" /><input value={a.instructions || ''} onChange={e=>updatePaymentAccount(a.id,'instructions',e.target.value)} className="col-span-2 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" /></div>)}</div></div>
          {operations.payment_verifications.length === 0 ? <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">لا توجد حوالات مرفوعة.</div> : operations.payment_verifications.map((v) => <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid lg:grid-cols-[1fr_180px_auto] gap-4 items-center"><div><div className="font-black text-white">{v.customer_name} • {v.amount_local.toLocaleString()} {v.currency_label}</div><div className="text-[11px] text-slate-400 mt-1">{v.phone} • {v.payment_account_label}</div><div className="text-[10px] text-slate-500">مرجع: {v.reference_number || 'غير مدخل'} • {v.submitted_at}</div><StatusPill text={v.status} /></div><a href={v.proof_image_url} target="_blank" rel="noreferrer" className="block"><img src={v.proof_image_url} alt="إثبات الحوالة" className="w-full h-28 object-contain bg-slate-950 border border-slate-700 rounded-xl" /></a><div className="flex flex-col gap-2">{v.status === 'under_finance_review' && <><button onClick={() => approvePayment(v.id,true)} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black">اعتماد وصول المبلغ</button><button onClick={() => approvePayment(v.id,false)} className="px-3 py-2 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold">رفض الإثبات</button></>}</div></div>)}
        </section>
      )}

      {activeTab === 'clinical' && (
        <section className="space-y-3">
          <SectionTitle icon={<ShieldCheck className="w-4 h-4" />} title="ملفات الحالات المرضية المنفصلة" subtitle="كل مشكلة تصل كملف مستقل مع بيانات العميل والقطيع والصور والصوت والتوجيه التشريحي والموظف المداوم المسند." />
          {operations.clinical_cases.length === 0 ? <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">لم تُرسل حالة مرضية من المساعد بعد.</div> : operations.clinical_cases.map((c) => <div key={c.id} className="bg-slate-900 border border-rose-900/40 rounded-2xl p-4 space-y-3"><div className="grid lg:grid-cols-3 gap-3"><div><div className="font-black text-white">{c.case_number} • {c.customer_name}</div><div className="text-[11px] text-slate-400">{c.phone} • {c.governorate}/{c.district}</div><div className="text-[10px] text-slate-500">{c.detailed_address}</div></div><div className="text-[11px] text-slate-300">القطيع: {c.flock_size.toLocaleString()} • عمر {c.age_days} يوم • النافق {c.mortality_today}<br/>حرارة {c.temperature_celsius}° • رطوبة {c.humidity_percent}% • علف {c.feed_kg} كجم • ماء {c.water_liters} لتر</div><div className="text-[11px]"><div className="text-cyan-300">المسند: {c.assigned_staff_name || 'بانتظار موظف مداوم'}</div><div className="text-amber-300">التصنيف الأولي: {c.ai_suspected_group}</div><StatusPill text={c.status} /></div></div><div className="bg-slate-950 rounded-xl p-3 text-[11px] text-slate-300"><strong className="text-white">شرح العميل:</strong> {c.symptoms_description}<br/><strong className="text-cyan-300">ملاحظة الفرز:</strong> {c.ai_triage_note}<br/><strong className="text-amber-300">الأعضاء المطلوبة:</strong> {c.ai_requested_organs.join('، ') || 'يحددها الطبيب حسب الحالة'}{c.laboratory_recommended && <div className="text-violet-300 mt-1">يوصى بفحص مختبري: {c.lab_reason}<br/>{c.recommended_lab_name && <>المختبر: <strong>{c.recommended_lab_name}</strong> • {c.recommended_lab_address} • {c.recommended_lab_phone}<br/></>}{c.field_visit_for_sample_required && <span className="text-cyan-300">مطلوب تنسيق نزول ميداني/أخذ عينة تحت إشراف الطبيب.</span>}</div>}{c.remote_area_without_lab && <div className="text-amber-300 mt-1">منطقة بعيدة عن المختبر: القرار الميداني للطبيب بعد مراجعة الأدلة، وليس للمساعد الآلي.</div>}</div><div className="flex flex-wrap gap-2"><button onClick={()=>updateClinicalStatus(c.id,'under_vet_review')} className="px-3 py-1.5 rounded-lg bg-cyan-700 text-white text-[10px] font-bold">قيد مراجعة الطبيب</button>{c.laboratory_recommended && <><button onClick={()=>updateClinicalStatus(c.id,'awaiting_field_visit')} className="px-3 py-1.5 rounded-lg bg-violet-700 text-white text-[10px] font-bold">تنسيق نزول لأخذ العينة</button><button onClick={()=>updateClinicalStatus(c.id,'awaiting_lab')} className="px-3 py-1.5 rounded-lg bg-indigo-700 text-white text-[10px] font-bold">بانتظار المختبر</button></>}<button onClick={()=>updateClinicalStatus(c.id,'closed')} className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[10px] font-bold">إغلاق الحالة</button></div><div className="grid grid-cols-2 sm:grid-cols-5 gap-2">{[c.droppings_image_url,c.barn_image_url,c.litter_image_url,...c.necropsy_images.map(n=>n.image_url)].filter(Boolean).map((url,i)=><a key={i} href={url!} target="_blank" rel="noreferrer"><img src={url!} className="w-full h-32 object-contain bg-black/20 rounded-xl border border-slate-700" /></a>)}</div>{c.audio_url && <audio controls src={c.audio_url} className="w-full" />}</div>)}
        </section>
      )}

      {activeTab === 'services' && (
        <section className="space-y-4">
          <SectionTitle icon={<Users className="w-4 h-4" />} title="الإشراف البيطري والمتابعة حتى التسويق" subtitle="التسعير يُحسب حسب عدد الهناجر وحجم القطيع، والمساعد يشرح قيمة الخدمة للعميل قبل الموافقة." />
          <div className="grid md:grid-cols-2 gap-3">{operations.supervision_packages.map(p=><div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4"><div className="font-black text-white">{p.name}</div><div className="text-[11px] text-slate-400 mt-1">{p.description}</div><div className="grid grid-cols-3 gap-1 mt-3 text-[9px]"><label className="text-slate-500">أساس<input type="number" value={p.base_fee_yer} onChange={e=>updatePackage(p.id,'base_fee_yer',Number(e.target.value))} className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white" /></label><label className="text-slate-500">لكل هنجر<input type="number" value={p.per_hangar_fee_yer} onChange={e=>updatePackage(p.id,'per_hangar_fee_yer',Number(e.target.value))} className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white" /></label><label className="text-slate-500">لكل 1000 طائر<input type="number" value={p.per_1000_birds_fee_yer} onChange={e=>updatePackage(p.id,'per_1000_birds_fee_yer',Number(e.target.value))} className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white" /></label></div></div>)}</div>
          <div className="space-y-2">{operations.supervision_requests.map(r=><div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 justify-between"><div><div className="font-black text-white">{r.customer_name} • {r.package_name}</div><div className="text-[11px] text-slate-400">{r.phone} • {r.address} • {r.hangars_count} هنجر • {r.flock_size.toLocaleString()} طائر</div><div className="text-emerald-300 text-xs mt-1">{r.calculated_fee_yer.toLocaleString()} ريال</div><div className="text-[10px] text-cyan-300 mt-1">{r.assigned_staff_name ? `مسند إلى ${r.assigned_staff_name}` : 'بانتظار الإسناد'}</div></div>{r.status === 'accepted' && <button onClick={()=>assignService(r.id)} className="px-3 py-2 rounded-xl bg-cyan-600 text-white text-xs font-black">إسناد لمشرف مداوم</button>}</div>)}</div>
        </section>
      )}

      {activeTab === 'media' && (
        <section className="space-y-4">
          <SectionTitle icon={<Volume2 className="w-4 h-4" />} title="مركز الوسائط الطبية للمشرفين والإدارة" subtitle="الاستماع للتسجيلات الأصلية المرفوعة من العنبر، ومراجعة صور التشريح بالحجم الكامل دون ضغط داخل شاشة الحالة." />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"><div><div className="font-black text-white text-xs">مكتبة الصور التشريحية المرجعية المعتمدة</div><div className="text-[10px] text-slate-500 mt-1">ارفع فقط صوراً سريرية واضحة ومصرحاً باستخدامها؛ بعدها يستطيع المساعد عرض الصورة للعميل عندما يطلب تصوير العضو نفسه.</div></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">{operations.necropsy_guides.map(g=><div key={g.id} className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px]">{g.image_url ? <img src={g.image_url} alt={g.organ_name} className="w-full h-24 object-contain bg-white/95 rounded-lg" /> : <div className="h-24 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-600">لا توجد صورة</div>}<div className="font-bold text-white mt-2">{g.organ_name}</div><div className={g.approved_by_admin?'text-emerald-300':'text-amber-300'}>{g.approved_by_admin?'معتمدة للعرض':'تحتاج صورة معتمدة'}</div><label className="mt-2 block text-cyan-300 cursor-pointer">رفع/استبدال الصورة<input type="file" accept="image/*" className="hidden" onChange={e=>uploadGuideImage(g.id,e.target.files?.[0])} /></label></div>)}</div></div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="font-black text-white text-xs flex items-center gap-2"><Volume2 className="w-4 h-4 text-cyan-400" /> تسجيلات الشخير والعطس</div>
              {acousticSessions.map((session) => (
                <div key={session.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between"><span className="font-bold text-white">{session.recorded_at}</span><span className={session.severity === 'ضائقة حادة' ? 'text-rose-400' : 'text-amber-300'}>{session.severity}</span></div>
                  <div className="text-slate-400">شخير {session.snick_count} • عطس {session.sneeze_count} • مؤشر الضائقة {session.respiratory_distress_index}%</div>
                  {session.audio_file_url ? <audio controls src={session.audio_file_url} className="w-full h-9" /> : <div className="text-slate-600">الحالة التجريبية القديمة لا تحتوي ملفاً صوتياً أصلياً. التسجيلات الجديدة تحفظ الصوت للاستماع هنا.</div>}
                </div>
              ))}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="font-black text-white text-xs flex items-center gap-2"><Images className="w-4 h-4 text-emerald-400" /> صور التشريح الأصلية</div>
              {necropsyCases.map((caseItem) => (
                <div key={caseItem.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-bold text-white">{caseItem.farm_name} • عمر {caseItem.bird_age_days} يوم</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {caseItem.observations.map((obs) => obs.image_url ? (
                      <a key={obs.organ} href={obs.image_url} target="_blank" rel="noreferrer" className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                        <img src={obs.image_url} alt={obs.organ_name_ar} className="w-full h-32 object-contain bg-black/20" />
                        <span className="block p-1.5 text-[9px] text-cyan-300 text-center">{obs.organ_name_ar} • فتح الأصل</span>
                      </a>
                    ) : <div key={obs.organ} className="h-24 rounded-xl border border-dashed border-slate-800 flex items-center justify-center p-2 text-center text-[9px] text-slate-600">{obs.organ_name_ar}<br/>لا توجد صورة مرفوعة</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'credit' && (
        <section className="space-y-3">
          <SectionTitle icon={<CreditCard className="w-4 h-4" />} title="محرك المديونيات والآجل" subtitle="تجاوز الحد يمنع طلبات الآجل الجديدة ما لم تعتمد الإدارة استثناءً صريحاً." />
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full text-xs min-w-[900px]">
              <thead className="bg-slate-950 text-slate-400"><tr><th className="p-3 text-right">العميل</th><th>المديونية</th><th>الحد الائتماني</th><th>الاستحقاق</th><th>الحالة</th><th>تحكم الإدارة</th></tr></thead>
              <tbody>
                {operations.credit_accounts.map((account) => (
                  <tr key={account.id} className="border-t border-slate-800 text-center">
                    <td className="p-3 text-right"><div className="font-bold text-white">{account.customer_name}</div><div className="text-[10px] text-slate-500">{account.phone}</div></td>
                    <td className="font-mono text-rose-300">{account.current_debt_yer.toLocaleString()}</td>
                    <td className="font-mono text-white">{account.credit_limit_yer.toLocaleString()}</td>
                    <td className="text-slate-300">{account.due_date || '—'}</td>
                    <td><StatusPill text={account.status} /></td>
                    <td className="p-2">
                      {account.status === 'blocked_over_limit' ? (
                        <button onClick={() => updateCreditStatus(account.id, true)} className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black">موافقة استثنائية</button>
                      ) : account.status === 'admin_override' ? (
                        <button onClick={() => updateCreditStatus(account.id, false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-white">إلغاء الاستثناء</button>
                      ) : <span className="text-emerald-400">لا يحتاج تدخلاً</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'emergency' && (
        <section className="space-y-3">
          <SectionTitle icon={<Siren className="w-4 h-4" />} title="مركز الطوارئ والنزول الميداني" subtitle="الطلب الأحمر يحتفظ بإحداثيات GPS ويُسند للمشرف الميداني المخول." />
          <div className="space-y-3">
            {operations.emergency_requests.map((request) => (
              <div key={request.id} className={`rounded-2xl p-4 border ${request.priority === 'red_emergency' ? 'bg-rose-950/25 border-rose-700/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-4 items-center">
                  <div>
                    <div className="font-black text-white flex items-center gap-2"><Siren className="w-4 h-4 text-rose-400" /> {request.farm_name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{request.customer_name} • {request.governorate} / {request.district}</div>
                    <div className="text-[11px] text-rose-300 mt-2">النافق اليوم: {request.mortality_today} • {request.symptoms_summary}</div>
                  </div>
                  <div className="text-xs space-y-2">
                    <div className="flex items-center gap-2 text-cyan-300"><MapPinned className="w-4 h-4" /> {request.gps.lat}, {request.gps.lng}</div>
                    <select value={request.assigned_staff_id || ''} onChange={(e) => assignEmergency(request.id, e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white">
                      <option value="">إسناد للمشرف...</option>
                      {staffMembers.filter((staff) => staff.permissions.can_order_field_visits).map((staff) => <option key={staff.id} value={staff.id}>{staff.name} — {staff.governorate}</option>)}
                    </select>
                    <StatusPill text={request.status} />
                  </div>
                  <button onClick={() => closeEmergency(request.id)} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black">اعتماد وإغلاق</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'pricing' && (
        <section className="space-y-4">
          <SectionTitle icon={<Coins className="w-4 h-4" />} title="العملات وأجور المناطق" subtitle="المستخدم لا يغير الصرف أو الأجور؛ كل القيم هنا تحت تحكم الإدارة فقط." />
          <div className="grid md:grid-cols-2 gap-3">
            <label className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2"><span className="text-slate-400">1 ريال سعودي = ريال يمني قديم</span><input type="number" value={rates.sar_to_yer_old} onChange={(e) => setRates({ ...rates, sar_to_yer_old: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono" /></label>
            <label className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2"><span className="text-slate-400">1 ريال سعودي = ريال يمني جديد</span><input type="number" value={rates.sar_to_yer_new} onChange={(e) => setRates({ ...rates, sar_to_yer_new: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono" /></label>
          </div>
          <button onClick={saveExchangeRates} className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2"><Save className="w-4 h-4" /> حفظ سعر الصرف</button>
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full text-xs min-w-[1280px]"><thead className="bg-slate-950 text-slate-400"><tr><th className="p-3 text-right">المنطقة</th><th>نمط العملة</th><th>تكلفة النقل</th><th>أجرة النقل</th><th>تكلفة النزول</th><th>أجرة النزول</th><th>تكلفة التسويق</th><th>أجرة التسويق</th><th>الفرع</th><th>زمن التوصيل/س</th><th>الحالة</th></tr></thead><tbody>
              {operations.zone_service_prices.map((zone) => <tr key={zone.id} className="border-t border-slate-800 text-center"><td className="p-3 text-right font-bold text-white">{zone.governorate} / {zone.district}</td><td>{zone.currency_mode === 'YER_NEW_SAR' ? 'جديد + SAR' : 'قديم + SAR'}</td><td><input type="number" value={zone.transport_cost_yer || 0} onChange={(e) => updateZone(zone.id, 'transport_cost_yer', Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-amber-200 text-center" /></td><td><input type="number" value={zone.transport_fee_yer} onChange={(e) => updateZone(zone.id, 'transport_fee_yer', Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-center" /></td><td><input type="number" value={zone.field_visit_cost_yer || 0} onChange={(e) => updateZone(zone.id, 'field_visit_cost_yer', Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-amber-200 text-center" /></td><td><input type="number" value={zone.field_visit_fee_yer} onChange={(e) => updateZone(zone.id, 'field_visit_fee_yer', Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-center" /></td><td><input type="number" value={zone.marketing_cost_yer || 0} onChange={(e) => updateZone(zone.id, 'marketing_cost_yer', Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-amber-200 text-center" /></td><td><input type="number" value={zone.marketing_fee_yer} onChange={(e) => updateZone(zone.id, 'marketing_fee_yer', Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-center" /></td><td><input value={zone.branch_name || ''} onChange={(e) => updateZoneMeta(zone.id, 'branch_name', e.target.value)} className="w-32 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white" /></td><td><input type="number" value={zone.delivery_eta_hours || 0} onChange={(e) => updateZoneMeta(zone.id, 'delivery_eta_hours', Number(e.target.value))} className="w-20 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-center" /></td><td><StatusPill text={zone.status} />{zone.status === 'pending_new_location_pricing' && <button onClick={() => activateZone(zone.id)} className="block mx-auto mt-1 px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold">اعتماد التسعير</button>}</td></tr>)}
            </tbody></table>
          </div>
          <div className="space-y-2"><div className="text-xs font-black text-white">أسعار بيع الدواجن حسب المنطقة والوزن</div><div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl"><table className="w-full text-xs min-w-[850px]"><thead className="bg-slate-950 text-slate-400"><tr><th className="p-3 text-right">المنطقة</th><th>فئة الوزن</th><th>سعر المزرعة/كجم</th><th>سعر المستهلك/كجم</th><th>الاتجاه</th><th>التاريخ</th></tr></thead><tbody>{poultryPrices.map(p=><tr key={p.id} className="border-t border-slate-800 text-center"><td className="p-3 text-right text-white font-bold">{p.governorate}</td><td className="text-slate-300">{p.weight_category}</td><td><input type="number" value={p.farmgate_price_per_kg_yer} onChange={e=>updatePoultryPrice(p.id,'farmgate_price_per_kg_yer',Number(e.target.value))} className="w-28 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-center" /></td><td><input type="number" value={p.consumer_price_per_kg_yer} onChange={e=>updatePoultryPrice(p.id,'consumer_price_per_kg_yer',Number(e.target.value))} className="w-28 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-center" /></td><td>{p.market_trend}</td><td className="text-slate-500">{p.date}</td></tr>)}</tbody></table></div></div>
        </section>
      )}

      {activeTab === 'directory' && (
        <section className="space-y-4">
          <SectionTitle icon={<MapPinned className="w-4 h-4" />} title="الفروع والمختبرات المعتمدة" subtitle="الإدارة تحدد العناوين وأرقام التواصل والأسواق وتكاليف وزمن الخدمة؛ العميل لا يستطيع تعديلها." />
          <div className="grid lg:grid-cols-2 gap-4"><div className="space-y-2"><div className="flex justify-between items-center"><div className="text-xs font-black text-white">الفروع</div><button onClick={addBranch} className="px-2 py-1 rounded-lg bg-cyan-600 text-white text-[10px]">إضافة فرع</button></div>{operations.branches.map(b=><div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 grid grid-cols-2 gap-2 text-[11px]"><input value={b.name} onChange={e=>updateBranch(b.id,'name',e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><input value={b.phone} onChange={e=>updateBranch(b.id,'phone',e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><input value={b.address} onChange={e=>updateBranch(b.id,'address',e.target.value)} className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><input value={b.governorate} onChange={e=>updateBranch(b.id,'governorate',e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><input value={b.district} onChange={e=>updateBranch(b.id,'district',e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><input value={b.market_name || ''} onChange={e=>updateBranch(b.id,'market_name',e.target.value)} placeholder="اسم السوق/المركز" className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /></div>)}</div><div className="space-y-2"><div className="flex justify-between items-center"><div className="text-xs font-black text-white">المختبرات</div><button onClick={addLab} className="px-2 py-1 rounded-lg bg-violet-600 text-white text-[10px]">إضافة مختبر</button></div>{operations.laboratories.map(l=><div key={l.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 grid grid-cols-2 gap-2 text-[10px]"><input value={l.name} onChange={e=>updateLab(l.id,'name',e.target.value)} className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold" /><input value={l.governorate} onChange={e=>updateLab(l.id,'governorate',e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><input value={l.district} onChange={e=>updateLab(l.id,'district',e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><input value={l.address} onChange={e=>updateLab(l.id,'address',e.target.value)} className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><input value={l.phone} onChange={e=>updateLab(l.id,'phone',e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /><label className="text-slate-500">النتيجة/ساعة<input type="number" value={l.turnaround_hours} onChange={e=>updateLab(l.id,'turnaround_hours',Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /></label><label className="text-slate-500">جمع العينة<input type="number" value={l.sample_collection_fee_yer} onChange={e=>updateLab(l.id,'sample_collection_fee_yer',Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /></label><label className="text-slate-500">الفحص الأساسي<input type="number" value={l.base_test_price_yer} onChange={e=>updateLab(l.id,'base_test_price_yer',Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" /></label><div className="col-span-2 text-slate-500">{l.tests.join(' • ')}</div></div>)}</div></div>
        </section>
      )}

      {activeTab === 'jobs' && (
        <section className="space-y-3"><SectionTitle icon={<Users className="w-4 h-4" />} title="طلبات العمل تحت إشراف المنصة" subtitle="عامل أو مشرف أو طبيب يمكنه تقديم بيانات العمر والهوية والخبرة والهاتف والراتب المطلوب للمراجعة." />{operations.job_applications.length===0?<div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">لا توجد طلبات توظيف بعد.</div>:operations.job_applications.map(j=><div key={j.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 justify-between"><div><div className="font-black text-white">{j.full_name} • {j.role_requested}</div><div className="text-[11px] text-slate-400">{j.phone} • عمر {j.age} • خبرة {j.experience_years} سنة • {j.governorate}</div><div className="text-[11px] text-emerald-300">الراتب المطلوب: {j.desired_salary_yer.toLocaleString()} ريال</div><div className="text-[10px] text-slate-500">هوية: {j.national_id}</div></div><div className="flex gap-2"><button onClick={()=>updateJob(j.id,'under_review')} className="px-3 py-2 rounded-xl bg-cyan-950 text-cyan-300 text-xs">مراجعة</button><button onClick={()=>updateJob(j.id,'approved_pool')} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">اعتماد في قاعدة المرشحين</button><button onClick={()=>updateJob(j.id,'rejected')} className="px-3 py-2 rounded-xl bg-rose-950 text-rose-300 text-xs">رفض</button></div></div>)}</section>
      )}

      {activeTab === 'chicks' && (
        <section className="space-y-3">
          <SectionTitle icon={<Egg className="w-4 h-4" />} title="بورصة الكتاكيت اليومية" subtitle="سلالة، شركة وسعر مع عرض العملات الثلاث وفق صرف الإدارة." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {operations.chick_prices.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between"><div><div className="font-black text-white">{item.strain} <span className="text-[9px] text-cyan-300">({item.chick_type})</span></div><div className="text-[10px] text-slate-500">{item.company_name}</div></div><StatusPill text={item.market_trend} /></div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]"><PriceBox label="قديم" value={item.price_per_chick_yer_old.toLocaleString()} /><PriceBox label="جديد" value={item.price_per_chick_yer_new.toLocaleString()} /><label className="bg-slate-950 border border-slate-800 rounded-xl p-2"><div className="text-slate-500">SAR</div><input type="number" step="0.1" value={item.price_per_chick_sar} onChange={(e) => updateChickPrice(item.id, Number(e.target.value))} className="w-full bg-transparent text-center text-white font-black font-mono mt-1 outline-none" /></label></div>
                <div className="text-[10px] text-slate-500">آخر تسعير: {item.date}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'notifications' && (
        <section className="space-y-4">
          <SectionTitle icon={<BellRing className="w-4 h-4" />} title="محرك الإشعارات المخصصة" subtitle="حالياً محاكاة داخلية؛ ربط FCM/APNs يحتاج Backend وهوية مستخدمين فعلية." />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <input value={notificationTitle} onChange={(e) => setNotificationTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white" placeholder="عنوان الإشعار" />
            <textarea rows={3} value={notificationBody} onChange={(e) => setNotificationBody(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white resize-none" />
            <button onClick={sendNotification} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2"><BellRing className="w-4 h-4" /> إرسال لكل العملاء</button>
          </div>
          <div className="space-y-2">
            {operations.notifications.map((n) => <div key={n.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-start gap-3"><BellRing className={`w-4 h-4 mt-0.5 ${n.priority === 'critical' ? 'text-rose-400' : 'text-emerald-400'}`} /><div><div className="text-xs font-bold text-white">{n.title}</div><div className="text-[11px] text-slate-400 mt-1">{n.body}</div><div className="text-[10px] text-slate-600 mt-1">{n.created_at} • {n.audience}</div></div></div>)}
          </div>
        </section>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs font-black text-white"><Star className="w-4 h-4 text-amber-400" /> آخر التقييمات</div>
        <div className="grid md:grid-cols-2 gap-2 mt-3">{operations.ratings.slice(0, 4).map((rating) => <div key={rating.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px]"><div className="flex justify-between"><span className="font-bold text-white">{rating.target_name}</span><span className="text-amber-400 font-black">★ {rating.rating}/5</span></div><div className="text-slate-400 mt-1">{rating.category} • {rating.note}</div></div>)}</div>
      </div>
    </div>
  );
};

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string; tone: 'emerald' | 'rose' | 'amber' | 'cyan' }> = ({ icon, label, value, tone }) => {
  const toneClass = tone === 'emerald' ? 'text-emerald-400 border-emerald-500/20' : tone === 'rose' ? 'text-rose-400 border-rose-500/20' : tone === 'amber' ? 'text-amber-400 border-amber-500/20' : 'text-cyan-400 border-cyan-500/20';
  return <div className={`bg-slate-900 border rounded-2xl p-4 ${toneClass}`}><div className="flex items-center gap-2 text-[11px] text-slate-400">{icon}{label}</div><div className={`text-xl font-black mt-2 ${toneClass.split(' ')[0]}`}>{value}</div></div>;
};

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => <div className="flex items-start gap-2"><div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">{icon}</div><div><h3 className="text-sm font-black text-white">{title}</h3><p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p></div></div>;

const StatusPill: React.FC<{ text: string }> = ({ text }) => <span className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-bold">{text.replaceAll('_', ' ')}</span>;
const PriceBox: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="bg-slate-950 border border-slate-800 rounded-xl p-2"><div className="text-slate-500">{label}</div><div className="text-white font-black font-mono mt-1">{value}</div></div>;
