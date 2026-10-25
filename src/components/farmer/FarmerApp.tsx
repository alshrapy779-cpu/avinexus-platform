import React, { useState } from 'react';
import {
  PlusCircle,
  Mic,
  Activity,
  Camera,
  Award,
  Send,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Droplets,
  Scale,
  Thermometer,
  Calendar,
  AlertCircle,
  MapPin,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Layers,
  Bot,
  FileText,
  FileDown,
  BookOpen,
  ShieldCheck,
  UserPlus,
  DollarSign
} from 'lucide-react';
import {
  Farm,
  Flock,
  DailyLog,
  NecropsyCase,
  AcousticAnalysisSession,
  Prescription,
  SmartOperationsState,
  PoultryDailyPrice,
  PoultrySaleRequest,
  EmergencyFieldRequest,
  SupervisionServiceRequest
} from '../../types';
import { BREED_STANDARDS } from '../../data/initialData';
import { apiService } from '../../services/apiService';
import { NecropsyWizardModal } from './NecropsyWizardModal';
import { AcousticRecordingModal } from './AcousticRecordingModal';
import { FarmerAcademyModal } from './FarmerAcademyModal';
import { BiosecurityAuditModal } from '../biosecurity/BiosecurityAuditModal';
import { CycleSummaryModal } from '../reports/CycleSummaryModal';
import { CustomerOperationsPanel } from '../operations/CustomerOperationsPanel';
import { DiseaseBiosecurityAtlasModal } from './DiseaseBiosecurityAtlasModal';
import { ManagedFarmClientPortalV13 } from './ManagedFarmClientPortalV13';
import { BiosecurityChecklistV15Modal } from './BiosecurityChecklistV15Modal';
import { CustomerTradingV17 } from './CustomerTradingV17';
import { CustomerIntelligenceV18 } from './CustomerIntelligenceV18';
import type { MultiBusinessEnterpriseStateV2023 } from '../../modules/v20/MultiBusinessEnterpriseV20_2_3';

interface FarmerAppProps {
  farms: Farm[];
  flocks: Flock[];
  dailyLogs: DailyLog[];
  prescriptions?: Prescription[];
  isOnline: boolean;
  onAddDailyLog: (log: DailyLog) => void;
  onAddNecropsyCase: (newCase: NecropsyCase) => void;
  onAddAcousticSession: (session: AcousticAnalysisSession) => void;
  onUpdateFarmScore?: (farmId: string, newScore: number) => void;
  onSwitchToVet: () => void;
  onSwitchToCalculator: () => void;
  smartOperations: SmartOperationsState;
  poultryPrices: PoultryDailyPrice[];
  onCreateSaleRequest: (request: PoultrySaleRequest) => void;
  onCreateEmergency: (request: EmergencyFieldRequest) => void;
  onCreateServiceRequest: (request: SupervisionServiceRequest) => void;
  onUpdateSmartOperations: (operations: SmartOperationsState) => void;
  onOpenAIGuidance?: () => void;
  onRegisterCustomer?: () => void;
  multiBusiness?: MultiBusinessEnterpriseStateV2023;
}

export const FarmerApp: React.FC<FarmerAppProps> = ({
  farms,
  flocks,
  dailyLogs,
  prescriptions = [],
  isOnline,
  onAddDailyLog,
  onAddNecropsyCase,
  onAddAcousticSession,
  onUpdateFarmScore,
  onSwitchToVet,
  onSwitchToCalculator,
  smartOperations,
  poultryPrices,
  onCreateSaleRequest,
  onCreateEmergency,
  onCreateServiceRequest,
  onUpdateSmartOperations,
  onOpenAIGuidance,
  onRegisterCustomer,
  multiBusiness
}) => {
  const [selectedFlockId, setSelectedFlockId] = useState<string>(flocks[0]?.id || 'flock-101');

  // Modals state
  const [isNecropsyOpen, setIsNecropsyOpen] = useState(false);
  const [isAcousticOpen, setIsAcousticOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isCycleSummaryOpen, setIsCycleSummaryOpen] = useState(false);
  const [isAtlasOpen, setIsAtlasOpen] = useState(false);
  const [isBiosecurityV15Open, setIsBiosecurityV15Open] = useState(false);

  // New Daily Log Form State
  const [waterLiters, setWaterLiters] = useState<number>(3600);
  const [feedKg, setFeedKg] = useState<number>(1810);
  const [tempCelsius, setTempCelsius] = useState<number>(26.5);
  const [humidityPercent, setHumidityPercent] = useState<number>(57);
  const [mortalityCount, setMortalityCount] = useState<number>(14);
  const [cullingCount, setCullingCount] = useState<number>(3);
  const [logNotes, setLogNotes] = useState<string>('نشاط القطيع جيد، تم تشغيل التهوية الليلية.');

  // Voice Input Bridge State
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);

  const selectedFlock = flocks.find((f) => f.id === selectedFlockId) || flocks[0];
  const selectedFarm = farms.find((farm) => farm.id === selectedFlock?.farm_id) || farms[0];
  const isBundledDemoFarm = Boolean(selectedFarm && /أحمد صالح العنسي/.test(selectedFarm.owner_name || ''));
  const displayOwnerName = isBundledDemoFarm ? 'عميل المنصة' : (selectedFarm?.owner_name || 'عميل المنصة');
  const flockLogs = dailyLogs.filter((log) => log.flock_id === selectedFlock?.id);

  // Breed Standard comparisons for the current age
  const standardsForBreed = BREED_STANDARDS[selectedFlock?.breed_type] || BREED_STANDARDS['Ross 308'];
  const currentAgeStandard = standardsForBreed.reduce((prev, curr) => {
    return Math.abs(curr.age - (selectedFlock?.current_age_days || 30)) <
      Math.abs(prev.age - (selectedFlock?.current_age_days || 30))
      ? curr
      : prev;
  }, standardsForBreed[0]);

  // Expected standard feed for whole flock per day (grams * birds / 1000)
  const expectedDailyFeedKg = Math.round(
    (currentAgeStandard.feed_g_day * (selectedFlock?.current_count || 10000)) / 1000
  );
  const expectedDailyWaterLiters = Math.round(
    (currentAgeStandard.water_ml_day * (selectedFlock?.current_count || 10000)) / 1000
  );

  // Generate Compact SMS String for 2G/GSM offline fallback
  const smsPayload = `#SPP#${selectedFlock?.flock_code}#W${waterLiters}#F${feedKg}#T${tempCelsius}#H${humidityPercent}#M${mortalityCount}#`;

  // Submit Daily Log
  const handleSaveDailyLog = async (viaSms: boolean = false) => {
    const newLogPayload = {
      flock_id: selectedFlock.id,
      date: new Date().toISOString().split('T')[0],
      day_age: selectedFlock.current_age_days,
      water_consumption_liters: Number(waterLiters),
      feed_consumption_kg: Number(feedKg),
      temp_celsius: Number(tempCelsius),
      humidity_percent: Number(humidityPercent),
      mortality_count: Number(mortalityCount),
      culling_count: Number(cullingCount),
      notes: logNotes,
      synced: isOnline || viaSms,
      sync_method: (viaSms ? 'sms_fallback' : isOnline ? 'online' : 'pending') as any
    };

    try {
      const saved = await apiService.addDailyLog(newLogPayload);
      onAddDailyLog(saved);
      if (viaSms) {
        setSmsSentSuccess(true);
        setTimeout(() => {
          setSmsSentSuccess(false);
          setSmsModalOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Voice AI Parser
  const handleParseSpokenVoice = async (textToParse?: string) => {
    const text = textToParse || voiceInputText;
    if (!text.trim()) return;

    setIsParsingVoice(true);
    try {
      const parsed = await apiService.parseVoiceLogAI(text);
      if (parsed.water_consumption_liters) setWaterLiters(parsed.water_consumption_liters);
      if (parsed.feed_consumption_kg) setFeedKg(parsed.feed_consumption_kg);
      if (parsed.temp_celsius) setTempCelsius(parsed.temp_celsius);
      if (parsed.humidity_percent) setHumidityPercent(parsed.humidity_percent);
      if (parsed.mortality_count !== undefined) setMortalityCount(parsed.mortality_count);
      if (parsed.notes) setLogNotes(parsed.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsingVoice(false);
    }
  };

  const customerVisibleAccounts = (multiBusiness?.treasury_accounts || []).filter(a => a.active && a.customer_visible);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-3 sm:space-y-6">
      {/* V19.4 customer workspace header */}
      <div className="spp-customer-hero">
        <div className="relative z-10 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.75)]" />
            <span className="text-[10px] font-black tracking-wide text-emerald-300">CUSTOMER 360</span>
            <span className="text-[10px] sm:text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {isOnline ? 'متصل بالشبكة' : 'وضع أوفلاين'}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white">مرحبًا، {displayOwnerName}</h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5">
            {selectedFarm?.name || 'المزرعة'} • {selectedFarm?.governorate || ''} / {selectedFarm?.location_name || ''}{isBundledDemoFarm ? ' • بيانات نموذجية للاختبار' : ''}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-2 max-w-3xl">
            متابعة القطيع والسجلات اليومية والأمان الحيوي والخدمات الميدانية والملف البيطري من مساحة موحدة.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-2">
          {onRegisterCustomer && (
            <button type="button" onClick={onRegisterCustomer} className="spp-button spp-button-ghost">
              <UserPlus className="w-4 h-4" />
              تسجيل عميل / مزرعة
            </button>
          )}
          {onOpenAIGuidance && (
            <button type="button" onClick={onOpenAIGuidance} className="spp-button spp-button-secondary">
              <Bot className="w-4 h-4" />
              المساعد البيطري الذكي
            </button>
          )}
        </div>
      </div>

      {/* Main customer workspace: always real full-width responsive layout */}
      <div className="w-full" data-mobile-native="true">
        <div className="bg-slate-950/40 rounded-2xl border border-slate-800 p-2.5 sm:p-4 lg:p-6">
          {customerVisibleAccounts.length > 0 && (
        <section className="rounded-3xl border border-sky-500/20 bg-sky-500/5 p-4" dir="rtl">
          <div className="flex items-center gap-2 mb-3"><DollarSign className="w-4 h-4 text-sky-300"/><h3 className="text-sm font-black text-white">بيانات التحويل والدفع المعتمدة</h3></div>
          <p className="text-[11px] text-slate-400 mb-3">استخدم فقط الحسابات الظاهرة هنا. يتم إدخالها واعتمادها من الإدارة المالية.</p>
          <div className="grid md:grid-cols-2 gap-3">{customerVisibleAccounts.map(a=><div key={a.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-300"><div className="font-black text-white">{a.bank_name || a.name} • {a.currency}</div><div className="mt-2 space-y-1"><div>المستفيد: {a.beneficiary_name || '—'}</div><div>رقم الحساب: {a.account_number || '—'}</div><div>IBAN/المحفظة: {a.iban || a.wallet_phone || '—'}</div><div>طريقة التحويل/السحب: {a.transfer_instructions || 'حسب تعليمات الإدارة المالية'}</div></div></div>)}</div>
        </section>
      )}

      {/* App Body */}
          <div className="p-4 sm:p-5 space-y-5">
            {/* Farm & Flock Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedFarm.name}</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedFarm.location_name}
                </span>
              </div>

              {/* Selector */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  اختر القطيع النشط للمتابعة:
                </label>
                <select
                  value={selectedFlockId}
                  onChange={(e) => setSelectedFlockId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                >
                  {flocks.map((flk) => (
                    <option key={flk.id} value={flk.id}>
                      {flk.flock_code} • سلالة: {flk.breed_type} • العمر: {flk.current_age_days} يوم ({flk.house_number})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">العمر الحالي</span>
                  <strong className="text-xs font-black text-white">{selectedFlock.current_age_days} يوماً</strong>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">العدد الحي</span>
                  <strong className="text-xs font-black text-emerald-400">
                    {selectedFlock.current_count.toLocaleString('ar-YE')}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuditOpen(true)}
                  title="انقر لفتح فحص وتدقيق الأمان الحيوي الشامل"
                  className="bg-slate-950/70 hover:bg-slate-900/90 p-2 rounded-xl border border-slate-800/80 hover:border-emerald-500/40 transition text-center cursor-pointer group"
                >
                  <span className="text-[10px] text-slate-400 block group-hover:text-emerald-300">
                    الأمان الحيوي ⚙️
                  </span>
                  <strong
                    className={`text-xs font-black ${
                      selectedFarm.biosecurity_score >= 70 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {selectedFarm.biosecurity_score}%
                  </strong>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsBiosecurityV15Open(true)}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-xs font-bold flex items-center justify-between gap-2 transition"
              >
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> قائمة الأمن الحيوي اليومية V15</span>
                <ChevronRight className="w-4 h-4"/>
              </button>

              {/* Official Export Cycle Summary Button (زر تصدير ملخص الدورة) */}
              <button
                type="button"
                id="btn-export-cycle-summary"
                onClick={() => setIsCycleSummaryOpen(true)}
                className="w-full mt-2.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600/30 via-slate-900 to-indigo-600/30 hover:from-emerald-600/40 hover:to-indigo-600/40 text-white border border-emerald-500/40 hover:border-emerald-400 text-xs font-bold flex items-center justify-between gap-2 transition shadow-md group cursor-pointer"
                title="إنشاء وتنزيل ملف PDF رسمي يحتوي على إجمالي النافق ومتوسط استهلاك العلف وتواريخ الروشتات الصادرة"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-emerald-300 group-hover:text-white transition">تصدير ملخص الدورة (PDF)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800">
                  <FileDown className="w-3 h-3 text-emerald-400" />
                  <span>النافق • العلف • الروشتات</span>
                </div>
              </button>
            </div>

            <BiosecurityChecklistV15Modal
        isOpen={isBiosecurityV15Open}
        onClose={() => setIsBiosecurityV15Open(false)}
        operations={smartOperations}
        onUpdateOperations={onUpdateSmartOperations}
        farmName={selectedFarm?.name}
      />

      <ManagedFarmClientPortalV13
              farm={selectedFarm}
              operations={smartOperations}
              onUpdateOperations={onUpdateSmartOperations}
            />

            <CustomerTradingV17
              farm={selectedFarm}
              flock={selectedFlock}
              operations={smartOperations}
              onUpdateOperations={onUpdateSmartOperations}
            />

            {selectedFarm && selectedFlock && (
              <CustomerIntelligenceV18
                farm={selectedFarm}
                flock={selectedFlock}
                operations={smartOperations}
                onUpdateOperations={onUpdateSmartOperations}
              />
            )}

            <CustomerOperationsPanel
              farm={selectedFarm}
              flock={selectedFlock}
              prescriptions={prescriptions}
              creditAccount={smartOperations.credit_accounts.find((account) => account.customer_id === selectedFarm.id)}
              exchangeRates={smartOperations.exchange_rates}
              currencyRules={smartOperations.governorate_currency_rules}
              zonePrices={smartOperations.zone_service_prices}
              poultryPrices={poultryPrices}
              onCreateSaleRequest={onCreateSaleRequest}
              onCreateEmergency={onCreateEmergency}
              supervisionPackages={smartOperations.supervision_packages}
              onCreateServiceRequest={onCreateServiceRequest}
            />

            {/* AI Smart Action Launchers (Core Modules) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">أدوات التشخيص الذكي الميداني:</span>
              <div className="grid grid-cols-2 gap-2.5">
                {/* AI-Guided Necropsy Button */}
                <button
                  type="button"
                  id="btn-necropsy-wizard"
                  onClick={() => setIsNecropsyOpen(true)}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-right transition flex flex-col justify-between gap-2 shadow-lg shadow-emerald-950/30 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                      التشخيص التشريحي الذكي
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      معالج فحص الأعضاء الـ 5 بالذكاء الاصطناعي
                    </span>
                  </div>
                </button>

                {/* Acoustic AI Button */}
                <button
                  type="button"
                  id="btn-acoustic-ai"
                  onClick={() => setIsAcousticOpen(true)}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/40 hover:border-teal-400 text-right transition flex flex-col justify-between gap-2 shadow-lg shadow-teal-950/30 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-teal-300 transition">
                      الاستشعار الصوتي (30ث)
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      كشف الشخير والعطس الليلي المبكر
                    </span>
                  </div>
                </button>
              </div>

              {/* Secondary Launchers: Academy & Calculator */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAcademyOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-right transition flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block">أكاديمية العميل</span>
                    <span className="text-[9px] text-slate-400">تصحيح المفاهيم ونيل الوسام</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onSwitchToCalculator}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-right transition flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-600/10 text-amber-300 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block">حاسبة الهدر بالريال</span>
                    <span className="text-[9px] text-slate-400">كشف الخسائر الصامتة</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAtlasOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-600 text-right transition flex items-center gap-2.5 col-span-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-300 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block">أطلس الأمراض والأمان الحيوي</span>
                    <span className="text-[9px] text-slate-400">فيروسي • بكتيري • ميكوبلازما • طفيلي • فطري، مع صور تشريح معتمدة من الإدارة</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Daily Log Entry Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>تسجيل السجل اليومي للقطيع</span>
                </h3>
                <span className="text-[10px] text-slate-400">اليوم: {selectedFlock.current_age_days} يوماً</span>
              </div>

              {/* Spoken Voice Assistant (Voice Bridge) */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-3 rounded-xl border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    <span>مساعد الإدخال الصوتي بالعامية اليمنية (Voice Bridge):</span>
                  </span>
                  {isParsingVoice && (
                    <span className="text-[10px] text-emerald-400 animate-pulse font-medium">
                      جاري استخراج الأرقام...
                    </span>
                  )}
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={voiceInputText}
                    onChange={(e) => setVoiceInputText(e.target.value)}
                    placeholder="مثال: اليوم شربوا 3600 لتر وعلف 1810 كيلو والحرارة 26.5 ونافق 14 طير"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleParseSpokenVoice()}
                    disabled={isParsingVoice || !voiceInputText.trim()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تعبئة ذكية</span>
                  </button>
                </div>

                {/* Quick Colloquial Voice Samples */}
                <div className="flex items-center gap-1 text-[10px] text-slate-400 overflow-x-auto pt-1">
                  <span className="shrink-0 text-slate-500">نماذج صوتية سريعة:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const sample = 'سجل اليوم: ماء 3600 لتر، علف 1810 كجم، حرارة 26.1، رطوبة 57%، نافق 14 طير';
                      setVoiceInputText(sample);
                      handleParseSpokenVoice(sample);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
                  >
                    ملاحظة طبيعية
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const sample = 'انخفاض في الماء 2400 لتر والعلف 1200 كيلو والحرارة مرتفعة 32 درجة والنافق 45 طير';
                      setVoiceInputText(sample);
                      handleParseSpokenVoice(sample);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 whitespace-nowrap"
                  >
                    ملاحظة إجهاد حراري ونفوق
                  </button>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-2 gap-3">
                {/* Water */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" />
                      <span>الماء (لتر):</span>
                    </span>
                    <span className="text-[10px] text-slate-500">المعياري: {expectedDailyWaterLiters}</span>
                  </div>
                  <input
                    type="number"
                    value={waterLiters}
                    onChange={(e) => setWaterLiters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Feed */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-amber-400" />
                      <span>العلف (كجم):</span>
                    </span>
                    <span className="text-[10px] text-slate-500">المعياري: {expectedDailyFeedKg}</span>
                  </div>
                  <input
                    type="number"
                    value={feedKg}
                    onChange={(e) => setFeedKg(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Temp */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-rose-400" />
                    <span>الحرارة (°C):</span>
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    value={tempCelsius}
                    onChange={(e) => setTempCelsius(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Humidity */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <span>الرطوبة (%):</span>
                  </span>
                  <input
                    type="number"
                    value={humidityPercent}
                    onChange={(e) => setHumidityPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Mortality */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span>النافق اليومي (رؤوس):</span>
                  </span>
                  <input
                    type="number"
                    value={mortalityCount}
                    onChange={(e) => setMortalityCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Culling / الاستبعاد */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-300">الفرز والاستبعاد (سرده):</span>
                  <input
                    type="number"
                    value={cullingCount}
                    onChange={(e) => setCullingCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  ملاحظات العميل الإضافية (سلوك، فرشة، أصوات):
                </label>
                <input
                  type="text"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submission Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSaveDailyLog(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>حفظ ومزامنة السجل اليومي</span>
                </button>

                {/* Offline SMS Bridge Trigger */}
                <button
                  type="button"
                  onClick={() => setSmsModalOpen(true)}
                  title="إرسال البيانات عبر رسالة SMS مشفرة عند غياب الإنترنت"
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
              </div>
            </div>

            {/* Historical Daily Logs (Recent 4) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200">سجل الأيام السابقة للقطيع:</h4>
                <span className="text-[10px] text-slate-500">{flockLogs.length} سجلات مسجلة</span>
              </div>

              <div className="space-y-2">
                {flockLogs.slice(-4).reverse().map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span>يوم {log.day_age}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{log.date}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        ماء: <strong className="text-slate-200">{log.water_consumption_liters} لتر</strong> • علف:{' '}
                        <strong className="text-slate-200">{log.feed_consumption_kg} كجم</strong> • حرارة:{' '}
                        <strong className="text-slate-200">{log.temp_celsius}°C</strong>
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-[11px] font-bold text-rose-400">
                        نافق: {log.mortality_count}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5">
                        {log.sync_method === 'sms_fallback' ? (
                          <span className="text-amber-400">عبر SMS</span>
                        ) : (
                          <span className="text-emerald-400">مكتمل أونلاين</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Fallback Modal */}
      {smsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>إرسال السجل اليومي عبر رسائل SMS (الأوفلاين)</span>
              </h3>
              <button onClick={() => setSmsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              في حال انقطاع شبكة الإنترنت في المزرعة، يتم تشفير البيانات اليومية في رسالة نصية قصيرة قياسية تُرسل إلى بوابة
              المنصة (SMS Gateway) لفك تشفيرها وتحديث ملف القطيع فوراً.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 break-all select-all">
              {smsPayload}
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <div>• رقم بوابة الاستقبال: <strong>8800-POULTRY-YE</strong></div>
              <div>• تكلفة الإرسال: رسالة محلية عادية (شبكة يمن موبايل / يو / سبأفون)</div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setSmsModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleSaveDailyLog(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <span>{smsSentSuccess ? 'تم إرسال الـ SMS بنجاح!' : 'محاكاة الإرسال عبر SMS'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isNecropsyOpen && (
        <NecropsyWizardModal
          flock={selectedFlock}
          onClose={() => setIsNecropsyOpen(false)}
          onCaseCreated={(newCase) => {
            onAddNecropsyCase(newCase);
            setIsNecropsyOpen(false);
          }}
        />
      )}

      {isAcousticOpen && (
        <AcousticRecordingModal
          flock={selectedFlock}
          onClose={() => setIsAcousticOpen(false)}
          onSessionSaved={(session) => {
            onAddAcousticSession(session);
            setIsAcousticOpen(false);
          }}
        />
      )}

      {isAcademyOpen && (
        <FarmerAcademyModal
          onClose={() => setIsAcademyOpen(false)}
          farmerName={displayOwnerName}
          farmName={selectedFarm.name}
        />
      )}

      {isAtlasOpen && (
        <DiseaseBiosecurityAtlasModal
          onClose={() => setIsAtlasOpen(false)}
          guides={smartOperations.necropsy_guides}
        />
      )}

      {isAuditOpen && (
        <BiosecurityAuditModal
          farm={selectedFarm}
          onClose={() => setIsAuditOpen(false)}
          onUpdateScore={(farmId, newScore) => {
            if (onUpdateFarmScore) onUpdateFarmScore(farmId, newScore);
          }}
        />
      )}

      {/* Official Cycle Summary Report & PDF Generator Modal */}
      {isCycleSummaryOpen && (
        <CycleSummaryModal
          isOpen={isCycleSummaryOpen}
          onClose={() => setIsCycleSummaryOpen(false)}
          flock={selectedFlock}
          farm={selectedFarm}
          dailyLogs={dailyLogs}
          prescriptions={prescriptions}
        />
      )}
    </div>
  );
};
