import React, { useMemo, useState } from 'react';
import {
  AlertOctagon,
  BadgeCheck,
  Banknote,
  CalendarClock,
  CheckCircle2,
  MapPin,
  Megaphone,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Siren,
  X
} from 'lucide-react';
import {
  CustomerCreditAccount,
  EmergencyFieldRequest,
  ExchangeRateSettings,
  Farm,
  Flock,
  GovernorateCurrencyRule,
  PoultryDailyPrice,
  PoultrySaleRequest,
  Prescription,
  ZoneServicePrice,
  SupervisionServicePackage,
  SupervisionServiceRequest
} from '../../types';
import { convertReferenceYerOld, evaluateWithdrawalSafety, findZonePrice, getCurrencyMode } from '../../services/operationalRules';

interface CustomerOperationsPanelProps {
  farm: Farm;
  flock: Flock;
  prescriptions: Prescription[];
  creditAccount?: CustomerCreditAccount;
  exchangeRates: ExchangeRateSettings;
  currencyRules: GovernorateCurrencyRule[];
  zonePrices: ZoneServicePrice[];
  poultryPrices: PoultryDailyPrice[];
  onCreateSaleRequest: (request: PoultrySaleRequest) => void;
  onCreateEmergency: (request: EmergencyFieldRequest) => void;
  supervisionPackages: SupervisionServicePackage[];
  onCreateServiceRequest: (request: SupervisionServiceRequest) => void;
}

export const CustomerOperationsPanel: React.FC<CustomerOperationsPanelProps> = ({
  farm,
  flock,
  prescriptions,
  creditAccount,
  exchangeRates,
  currencyRules,
  zonePrices,
  poultryPrices,
  onCreateSaleRequest,
  onCreateEmergency,
  supervisionPackages,
  onCreateServiceRequest
}) => {
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(supervisionPackages[0]?.id || '');
  const [hangarsCount, setHangarsCount] = useState(1);
  const [feedback, setFeedback] = useState<string>('');
  const [birdCount, setBirdCount] = useState<number>(flock.current_count);
  const [averageWeight, setAverageWeight] = useState<number>(flock.target_market_weight_kg || 1.7);
  const [requestedPrice, setRequestedPrice] = useState<number>(0);
  const [mortalityToday, setMortalityToday] = useState<number>(0);
  const [symptoms, setSymptoms] = useState<string>('ارتفاع مفاجئ في النافق أو تدهور واضح في حالة القطيع.');

  const withdrawal = useMemo(
    () => evaluateWithdrawalSafety(prescriptions, flock.id),
    [prescriptions, flock.id]
  );

  const currencyMode = getCurrencyMode(farm.governorate, currencyRules);
  const zone = findZonePrice(farm.governorate, farm.location_name, zonePrices);

  const weightCategory: PoultryDailyPrice['weight_category'] =
    averageWeight < 1.3
      ? 'خفيف (أقل من 1.3 كجم)'
      : averageWeight > 1.8
      ? 'ثقيل (أكثر من 1.8 كجم)'
      : 'مثالي (1.3 - 1.8 كجم)';

  const marketPrice = poultryPrices.find(
    (p) => p.governorate.includes(farm.governorate) && p.weight_category === weightCategory
  ) || poultryPrices.find((p) => p.governorate.includes(farm.governorate));

  const regionalMarketPrice = marketPrice
    ? convertReferenceYerOld(marketPrice.farmgate_price_per_kg_yer, currencyMode, exchangeRates)
    : undefined;

  const regionalVisitFee = zone
    ? convertReferenceYerOld(zone.field_visit_fee_yer, currencyMode, exchangeRates)
    : undefined;

  const selectedPackage = supervisionPackages.find((p) => p.id === selectedPackageId) || supervisionPackages[0];
  const serviceFee = selectedPackage ? selectedPackage.base_fee_yer + selectedPackage.per_hangar_fee_yer * Math.max(1, hangarsCount) + selectedPackage.per_1000_birds_fee_yer * Math.ceil(flock.current_count / 1000) : 0;
  const servicePitch = selectedPackage ? `هذه الباقة تربط المتابعة اليومية بالعلف والماء والتهوية والأمان الحيوي مع النزول الميداني عند الحاجة ومتابعة اللقاحات والعلاجات المعتمدة حتى التسويق. لقطيعك الحالي (${flock.current_count.toLocaleString()} طائر) و${hangarsCount} هنجر، التكلفة المحسوبة ${serviceFee.toLocaleString()} ريال قبل أي أجرة منطقة إضافية تعتمدها الإدارة. الهدف تقليل الهدر واكتشاف الانحراف مبكراً، والقرار النهائي لك.` : '';

  const submitServiceRequest = () => {
    if (!selectedPackage) return;
    const request: SupervisionServiceRequest = {
      id: `svc-req-${Date.now()}`, created_at: new Date().toISOString(), customer_name: farm.owner_name, phone: farm.phone, address: farm.location_name, governorate: farm.governorate,
      district: farm.location_name.split('-')[1]?.trim() || farm.location_name, hangars_count: Math.max(1, hangarsCount), flock_size: flock.current_count,
      package_id: selectedPackage.id, package_name: selectedPackage.name, calculated_fee_yer: serviceFee, ai_pitch: servicePitch, customer_accepted: true, status: 'accepted'
    };
    onCreateServiceRequest(request);
    setFeedback('تم تسجيل طلب الإشراف والمتابعة وإرساله للإدارة لإسناده إلى مشرف/طبيب مداوم.');
    setServiceOpen(false);
  };

  const createMarketingRequest = () => {
    if (withdrawal.blocked) {
      setFeedback(withdrawal.message);
      setMarketingOpen(false);
      return;
    }

    const aiPrice = marketPrice?.farmgate_price_per_kg_yer || Math.max(1, requestedPrice);
    const request: PoultrySaleRequest = {
      id: `sale-${Date.now()}`,
      farmer_name: farm.owner_name,
      farm_name: farm.name,
      phone: farm.phone,
      governorate: farm.governorate,
      district: farm.location_name.split('-')[1]?.trim() || farm.location_name,
      flock_breed: flock.breed_type,
      bird_count: Number(birdCount),
      total_weight_kg: Number((birdCount * averageWeight).toFixed(2)),
      average_weight_kg: Number(averageWeight),
      images: [],
      farmer_requested_price_per_kg: Number(requestedPrice || aiPrice),
      ai_recommended_price_per_kg: aiPrice,
      ai_total_estimated_value_yer: Math.round(birdCount * averageWeight * aiPrice),
      status: requestedPrice > aiPrice ? 'rejected_escalated_to_admin' : 'pending_ai_evaluation',
      admin_notes: withdrawal.badge === 'withdrawal_completed'
        ? 'تم اجتياز بوابة فترة السحب. الطلب بانتظار مراجعة الإدارة والتسعير النهائي.'
        : 'لا توجد فترة سحب مضاد حيوي نشطة وفق السجل الحالي. بانتظار مراجعة الإدارة.',
      created_at: new Date().toISOString()
    };

    onCreateSaleRequest(request);
    setMarketingOpen(false);
    setFeedback('تم إنشاء طلب التسويق وتحويله للإدارة. السعر النهائي لا يعتمد إلا بعد مراجعة الإدارة.');
  };

  const createEmergencyRequest = async () => {
    let gps = farm.location_gps;
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        gps = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
            reject,
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
          );
        });
      } catch {
        // Fall back to the verified farm coordinates when live GPS is unavailable or denied.
      }
    }

    const request: EmergencyFieldRequest = {
      id: `emg-${Date.now()}`,
      created_at: new Date().toISOString(),
      customer_name: farm.owner_name,
      phone: farm.phone,
      farm_id: farm.id,
      farm_name: farm.name,
      flock_id: flock.id,
      governorate: farm.governorate,
      district: farm.location_name.split('-')[1]?.trim() || farm.location_name,
      gps,
      mortality_today: Number(mortalityToday),
      symptoms_summary: symptoms,
      image_urls: [],
      priority: mortalityToday >= Math.max(10, Math.round(flock.current_count * 0.003)) ? 'red_emergency' : 'high',
      status: 'new'
    };
    onCreateEmergency(request);
    setEmergencyOpen(false);
    setFeedback('تم رفع طلب النزول الميداني العاجل إلى مركز العمليات مع الموقع المسجل للمزرعة.');
  };

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white">الخدمات السريعة والسلامة التسويقية</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">التسويق والطوارئ والآجل مرتبطة تلقائياً بسجل القطيع وموقع المزرعة.</p>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full border font-bold ${
            withdrawal.badge === 'under_withdrawal'
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {withdrawal.badge === 'under_withdrawal' ? 'فترة سحب نشطة' : 'سلامة التسويق: مبدئياً مؤهل'}
          </span>
        </div>

        <div className={`rounded-xl p-3 border ${
          withdrawal.blocked
            ? 'bg-rose-950/40 border-rose-800/60'
            : 'bg-emerald-950/30 border-emerald-800/50'
        }`}>
          <div className="flex items-start gap-2">
            {withdrawal.blocked ? <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5" /> : <BadgeCheck className="w-4 h-4 text-emerald-400 mt-0.5" />}
            <div className="min-w-0">
              <div className={`text-xs font-bold ${withdrawal.blocked ? 'text-rose-300' : 'text-emerald-300'}`}>{withdrawal.message}</div>
              {withdrawal.safeDate && (
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <CalendarClock className="w-3 h-3" /> تاريخ الأمان المسجل: {withdrawal.safeDate}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => withdrawal.blocked ? setFeedback(withdrawal.message) : setMarketingOpen(true)}
            className={`p-3 rounded-xl border text-right transition ${
              withdrawal.blocked
                ? 'bg-slate-900 border-slate-800 text-slate-500'
                : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-200'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mb-2" />
            <div className="text-xs font-black">تسويق دواجن / بيع</div>
            <div className="text-[10px] mt-1 opacity-80">فحص فترة السحب قبل الإرسال</div>
          </button>

          <button
            onClick={() => setServiceOpen(true)}
            className="p-3 rounded-xl border bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-200 text-right transition"
          >
            <ShieldCheck className="w-5 h-5 mb-2" />
            <div className="text-xs font-black">إشراف بيطري ومتابعة</div>
            <div className="text-[10px] mt-1 opacity-80">من التشغيل واللقاحات حتى التسويق</div>
          </button>

          <button
            onClick={() => setEmergencyOpen(true)}
            className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20 text-rose-200 text-right transition"
          >
            <Siren className="w-5 h-5 mb-2" />
            <div className="text-xs font-black">طلب نزول ميداني عاجل</div>
            <div className="text-[10px] mt-1 opacity-80">يرسل GPS وحالة القطيع للإدارة</div>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold"><Banknote className="w-3.5 h-3.5 text-amber-400" /> حساب الآجل</div>
            {creditAccount ? (
              <div className="mt-2 space-y-1 text-slate-400">
                <div className="flex justify-between"><span>المديونية:</span><strong className="text-white">{creditAccount.current_debt_yer.toLocaleString()} ريال</strong></div>
                <div className="flex justify-between"><span>الحد:</span><strong className="text-white">{creditAccount.credit_limit_yer.toLocaleString()} ريال</strong></div>
                <div className={`font-bold ${creditAccount.status === 'blocked_over_limit' ? 'text-rose-400' : creditAccount.status === 'near_limit' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {creditAccount.status === 'blocked_over_limit' ? 'طلبات الآجل الجديدة تحتاج موافقة الإدارة' : creditAccount.status === 'near_limit' ? 'قريب من الحد الائتماني' : 'ضمن الحد المسموح'}
                </div>
              </div>
            ) : <div className="mt-2 text-slate-500">لا يوجد حساب آجل مرتبط.</div>}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> التسعير الجغرافي</div>
            <div className="mt-2 space-y-1 text-slate-400">
              <div>{currencyMode === 'YER_NEW_SAR' ? 'منطقة تسعير: ريال يمني جديد + سعودي' : 'منطقة تسعير: ريال يمني قديم + سعودي'}</div>
              {regionalVisitFee ? (
                <div>النزول الميداني: <strong className="text-white">{regionalVisitFee.localYer.toLocaleString()} {regionalVisitFee.label}</strong> / <strong className="text-emerald-400">{regionalVisitFee.sar} ر.س</strong></div>
              ) : <div className="text-amber-400">العنوان غير مسعّر بعد وسيحوّل للإدارة.</div>}
              {regionalMarketPrice && <div>سعر السوق الاسترشادي: <strong className="text-white">{regionalMarketPrice.localYer.toLocaleString()} / كجم</strong> أو <strong className="text-emerald-400">{regionalMarketPrice.sar} ر.س</strong></div>}
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-200">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="mr-auto text-blue-300 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {marketingOpen && (
        <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div><h3 className="font-black text-white">طلب تسويق القطيع</h3><p className="text-[11px] text-slate-400">السعر المقترح استرشادي فقط، والإدارة تعتمد الصفقة النهائية.</p></div>
              <button onClick={() => setMarketingOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1"><span className="text-slate-400">عدد الطيور</span><input type="number" value={birdCount} onChange={(e) => setBirdCount(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">متوسط الوزن كجم</span><input type="number" step="0.05" value={averageWeight} onChange={(e) => setAverageWeight(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" /></label>
              <label className="space-y-1 col-span-2"><span className="text-slate-400">السعر المطلوب للكيلو (اختياري)</span><input type="number" value={requestedPrice} onChange={(e) => setRequestedPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" /></label>
            </div>
            {marketPrice && <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">تسعيرة الإدارة المرجعية: <strong className="text-emerald-400">{marketPrice.farmgate_price_per_kg_yer.toLocaleString()} ريال/كجم</strong> • فئة الوزن: {weightCategory}</div>}
            <button onClick={createMarketingRequest} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2.5 font-black text-sm">إرسال الطلب للإدارة</button>
          </div>
        </div>
      )}

      {serviceOpen && (
        <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between"><div><h3 className="font-black text-cyan-200">طلب إشراف بيطري ومتابعة</h3><p className="text-[11px] text-slate-400">المساعد يحسب السعر حسب عدد الهناجر وحجم القطيع ويشرح لك قيمة الخدمة قبل الموافقة.</p></div><button onClick={()=>setServiceOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button></div>
            <label className="block text-xs space-y-1"><span className="text-slate-400">الباقة</span><select value={selectedPackageId} onChange={e=>setSelectedPackageId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">{supervisionPackages.filter(p=>p.active).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
            <label className="block text-xs space-y-1"><span className="text-slate-400">عدد الهناجر</span><input type="number" min={1} value={hangarsCount} onChange={e=>setHangarsCount(Math.max(1,Number(e.target.value)))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" /></label>
            {selectedPackage && <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-xl p-3 text-[11px] text-slate-300"><strong className="text-cyan-200 block mb-1">المساعد الذكي:</strong>{servicePitch}<div className="mt-2 text-emerald-300">تشمل: {selectedPackage.includes.join(' • ')}</div></div>}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center"><div className="text-[10px] text-slate-500">التكلفة المحسوبة للباقة</div><div className="text-xl font-black text-emerald-300">{serviceFee.toLocaleString()} ريال</div></div>
            <button onClick={submitServiceRequest} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-2.5 font-black text-sm">أوافق وأرسل طلب الإشراف</button>
          </div>
        </div>
      )}

      {emergencyOpen && (
        <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div><h3 className="font-black text-rose-300 flex items-center gap-2"><AlertOctagon className="w-5 h-5" /> نزول ميداني عاجل</h3><p className="text-[11px] text-slate-400">سيتم إرسال موقع المزرعة المسجل والحالة إلى مركز العمليات.</p></div>
              <button onClick={() => setEmergencyOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <label className="space-y-1 block text-xs"><span className="text-slate-400">النافق اليوم</span><input type="number" value={mortalityToday} onChange={(e) => setMortalityToday(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" /></label>
            <label className="space-y-1 block text-xs"><span className="text-slate-400">وصف الحالة</span><textarea rows={4} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white resize-none" /></label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 flex items-start gap-2"><MapPin className="w-4 h-4 text-cyan-400 mt-0.5" /><div>{farm.location_name}<br/><span className="font-mono text-slate-500">{farm.location_gps.lat}, {farm.location_gps.lng}</span></div></div>
            <button onClick={createEmergencyRequest} className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-2.5 font-black text-sm flex items-center justify-center gap-2"><Siren className="w-4 h-4" /> إرسال طوارئ حمراء</button>
          </div>
        </div>
      )}
    </div>
  );
};
