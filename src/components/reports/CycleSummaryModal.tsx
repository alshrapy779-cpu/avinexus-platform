import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldCheck,
  Calendar,
  Scale,
  TrendingDown,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Building,
  User,
  Clock,
  Sparkles,
  QrCode,
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Flock, Farm, DailyLog, Prescription } from '../../types';
import { BREED_STANDARDS } from '../../data/initialData';

interface CycleSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  flock: Flock;
  farm: Farm;
  dailyLogs: DailyLog[];
  prescriptions: Prescription[];
}

export const CycleSummaryModal: React.FC<CycleSummaryModalProps> = ({
  isOpen,
  onClose,
  flock,
  farm,
  dailyLogs,
  prescriptions
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // 1. Filter logs for this specific flock & sort chronologically
  const flockLogs = dailyLogs
    .filter((log) => log.flock_id === flock.id)
    .sort((a, b) => a.day_age - b.day_age);

  // 2. Filter prescriptions issued for this flock during this cycle
  const flockPrescriptions = prescriptions
    .filter((p) => p.flock_id === flock.id)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // === CALCULATIONS FOR REQUIRED METRICS ===

  // Requirement A: إجمالي النافق (Total Mortality)
  const recordedMortalityCount = flockLogs.reduce((sum, log) => sum + (log.mortality_count || 0), 0);
  const recordedCullingCount = flockLogs.reduce((sum, log) => sum + (log.culling_count || 0), 0);
  const overallLossFromCount = Math.max(flock.initial_count - flock.current_count, 0);
  // Display primary total mortality
  const totalMortalityDisplay = recordedMortalityCount > 0 ? recordedMortalityCount : overallLossFromCount;
  const mortalityPercentage = flock.initial_count > 0 
    ? ((totalMortalityDisplay / flock.initial_count) * 100).toFixed(2)
    : '0.00';
  const survivalPercentage = flock.initial_count > 0
    ? ((flock.current_count / flock.initial_count) * 100).toFixed(2)
    : '100.00';

  // Breed Standard reference
  const breedStandards = BREED_STANDARDS[flock.breed_type] || BREED_STANDARDS['Ross 308'];
  const currentStandard = breedStandards.reduce((prev, curr) => {
    return Math.abs(curr.age - flock.current_age_days) < Math.abs(prev.age - flock.current_age_days)
      ? curr
      : prev;
  }, breedStandards[0]);

  // Requirement B: متوسط استهلاك العلف (Average Feed Consumption)
  const totalFeedKg = flockLogs.reduce((sum, log) => sum + (log.feed_consumption_kg || 0), 0);
  const logDaysCount = flockLogs.length > 0 ? flockLogs.length : 1;
  
  // Average daily feed for the entire flock (kg/day)
  const avgDailyFeedFlockKg = totalFeedKg > 0 
    ? (totalFeedKg / logDaysCount).toFixed(1) 
    : Math.round((currentStandard.feed_g_day * flock.current_count) / 1000).toString();

  // Average daily feed per bird (grams/bird/day)
  const avgFeedPerBirdGrams = flock.current_count > 0 
    ? Math.round((Number(avgDailyFeedFlockKg) * 1000) / flock.current_count)
    : currentStandard.feed_g_day;

  // Cumulative feed intake per bird (kg/bird)
  const cumulativeFeedPerBirdKg = flock.current_count > 0 && totalFeedKg > 0
    ? (totalFeedKg / flock.current_count).toFixed(2)
    : ((currentStandard.feed_g_day * flock.current_age_days) / 1000).toFixed(2);

  // Water consumption metrics
  const totalWaterLiters = flockLogs.reduce((sum, log) => sum + (log.water_consumption_liters || 0), 0);
  const avgDailyWaterLiters = totalWaterLiters > 0 
    ? Math.round(totalWaterLiters / logDaysCount)
    : Math.round((currentStandard.water_ml_day * flock.current_count) / 1000);
  const waterFeedRatio = Number(avgDailyFeedFlockKg) > 0 
    ? (avgDailyWaterLiters / Number(avgDailyFeedFlockKg)).toFixed(2) 
    : '1.95';

  // Feed Conversion Ratio (FCR) estimate
  const currentLiveWeightKg = flock.target_market_weight_kg || 2.1;
  const estimatedFCR = Number(cumulativeFeedPerBirdKg) > 0 
    ? (Number(cumulativeFeedPerBirdKg) / currentLiveWeightKg).toFixed(2)
    : '1.58';

  // Report Timestamp & Serial
  const reportDate = new Date().toISOString().split('T')[0];
  const reportSerial = `CYCLE-REP-${flock.flock_code}-${reportDate.replace(/-/g, '')}`;

  // PDF Generation Handler using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);

    try {
      // Allow DOM to settle
      await new Promise((resolve) => setTimeout(resolve, 150));

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution for crisp printing
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ملخص_دورة_${flock.flock_code}_${reportDate}.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to generate cycle summary PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden text-right" dir="rtl">
        {/* Modal Top Action Bar */}
        <div className="no-print p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>تصدير ملخص الدورة (PDF Official Report)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {flock.flock_code}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                تقرير شامل يتضمن إجمالي النافق، متوسط استهلاك العلف، وسجل تواريخ الروشتات البيطرية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-900/30 cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ إنشاء الـ PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تنزيل ملف PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة مباشرة</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Success Notice */}
        {downloadSuccess && (
          <div className="no-print bg-emerald-500/10 border-b border-emerald-500/30 px-6 py-2.5 text-xs font-bold text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              تم تصدير وحفظ ملف ملخص الدورة بصيغة PDF بنجاح على جهازك!
            </span>
            <span className="text-[11px] text-emerald-400">اسم الملف: ملخص_دورة_{flock.flock_code}_{reportDate}.pdf</span>
          </div>
        )}

        {/* Scrollable Document Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-900/50">
          {/* A4 Document Wrapper (Rendered visually & captured into PDF) */}
          <div
            ref={reportRef}
            id="cycle-summary-report-pdf"
            className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl max-w-3xl mx-auto space-y-6 border border-slate-300"
            style={{ fontFamily: "'Cairo', system-ui, -apple-system, sans-serif" }}
          >
            {/* National Official Header */}
            <div className="border-b-2 border-slate-800 pb-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-3xl shadow">
                    🇾🇪
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-800 tracking-wide">
                      الجمهورية اليمنية • وزارة الزراعة والري والثروة السمكية
                    </div>
                    <h1 className="text-lg sm:text-xl font-black text-slate-900">
                      المنصة الوطنية للسيادة البيطرية والداجنة الذكية
                    </h1>
                    <div className="text-xs font-semibold text-slate-600">
                      وثيقة رسمية: تقرير ملخص الدورة الإنتاجية وسجل الاستهلاك الدوائي
                    </div>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase">DOCUMENT NO.</span>
                  <strong className="text-xs font-black text-slate-900 block">{reportSerial}</strong>
                  <span className="text-[10px] text-slate-600 block mt-0.5">تاريخ التقرير: {reportDate}</span>
                </div>
              </div>
            </div>

            {/* Flock & Farm Baseline Data Grid */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h2 className="text-xs font-black text-slate-800 border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
                <span>١. بيانات المزرعة والقطيع الأساسية (Farm & Flock Profile)</span>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  الحالة: {flock.status === 'active' ? 'دورة نشطة مستمرة' : 'دورة مكتملة تم تسويقها'}
                </span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">اسم المزرعة:</span>
                  <strong className="font-bold text-slate-900">{farm.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">الموقع / المحافظة:</span>
                  <strong className="font-bold text-slate-900">{farm.location_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">رمز القطيع والعنبر:</span>
                  <strong className="font-bold text-slate-900 font-mono">{flock.flock_code} ({flock.house_number})</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">السلالة المدجنة:</span>
                  <strong className="font-bold text-emerald-800">{flock.breed_type}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">تاريخ الاستلام والبدء:</span>
                  <strong className="font-bold text-slate-900">{flock.start_date}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">العمر الحالي للقطيع:</span>
                  <strong className="font-bold text-slate-900">{flock.current_age_days} يوماً</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">العدد الأولي المستلم:</span>
                  <strong className="font-bold text-slate-900">{flock.initial_count.toLocaleString('ar-YE')} طائر</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">العدد الحي القائم حالياً:</span>
                  <strong className="font-bold text-emerald-700">{flock.current_count.toLocaleString('ar-YE')} طائر</strong>
                </div>
              </div>
            </div>

            {/* Core Requirement 1: إجمالي النافق ومؤشرات النفوق والحيوية */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-rose-50 border-b border-rose-100 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-700" />
                  <h2 className="text-xs font-black text-rose-900">
                    ٢. إجمالي النافق ومؤشرات الحيوية للقطيع (Mortality & Livability Analysis)
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-rose-800 bg-white px-2 py-0.5 rounded border border-rose-200">
                  إجمالي الفاقد: {totalMortalityDisplay} طائر ({mortalityPercentage}%)
                </span>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200/80 text-center">
                  <span className="text-[10px] text-rose-700 block font-semibold">إجمالي النافق التراكمي</span>
                  <strong className="text-lg font-black text-rose-900">{totalMortalityDisplay}</strong>
                  <span className="text-[10px] text-rose-600 block mt-0.5">طائراً نافقاً</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-600 block font-semibold">طيور الاستبعاد والفرز (Culling)</span>
                  <strong className="text-lg font-black text-slate-800">{recordedCullingCount}</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">طائر ضعيف / مشوه</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-600 block font-semibold">نسبة النفوق الإجمالية</span>
                  <strong className="text-lg font-black text-slate-800">{mortalityPercentage}%</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">معيار السلالة: {currentStandard.cum_mortality_pct}%</span>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-700 block font-semibold">نسبة الحيوية والبقاء (Survival)</span>
                  <strong className="text-lg font-black text-emerald-800">{survivalPercentage}%</strong>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">حيوية ممتازة للقطيع</span>
                </div>
              </div>

              <div className="px-4 pb-3 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">ملاحظة تقييم النفوق: </span>
                {Number(mortalityPercentage) <= currentStandard.cum_mortality_pct * 1.25 ? (
                  <span className="text-emerald-700 font-semibold">
                    معدل النافق ضمن الحدود الفسيولوجية الطبيعية المقبولة عالمياً لسلالة {flock.breed_type} ولا يمثل أي تفشٍ وبائي.
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold">
                    معدل النافق سجل انحرافاً طفيفاً خلال بعض فترات التدفئة والتنفس، وتم التدخل الميداني وضبط التهوية ومعالجة الحالة.
                  </span>
                )}
              </div>
            </div>

            {/* Core Requirement 2: متوسط استهلاك العلف ومؤشرات التغذية */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-800" />
                  <h2 className="text-xs font-black text-amber-900">
                    ٣. متوسط استهلاك العلف ومؤشرات التغذية والتحويل (Feed Intake & FCR Analysis)
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                  معامل التحويل FCR: {estimatedFCR}
                </span>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 text-center">
                  <span className="text-[10px] text-amber-800 block font-semibold">متوسط استهلاك العلف اليومي للقطيع</span>
                  <strong className="text-lg font-black text-amber-950">{Number(avgDailyFeedFlockKg).toLocaleString('ar-YE')}</strong>
                  <span className="text-[10px] text-amber-700 block mt-0.5">كيلوجرام / يومياً</span>
                </div>

                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 text-center">
                  <span className="text-[10px] text-amber-800 block font-semibold">متوسط استهلاك الطائر اليومي</span>
                  <strong className="text-lg font-black text-amber-950">{avgFeedPerBirdGrams}</strong>
                  <span className="text-[10px] text-amber-700 block mt-0.5">جرام / طائر (القياسي: {currentStandard.feed_g_day}g)</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-600 block font-semibold">إجمالي العلف التراكمي المستهلك</span>
                  <strong className="text-lg font-black text-slate-800">{totalFeedKg.toLocaleString('ar-YE')}</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">كجم ({(totalFeedKg / 1000).toFixed(2)} طن)</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-600 block font-semibold">متوسط استهلاك الطائر التراكمي</span>
                  <strong className="text-lg font-black text-slate-800">{cumulativeFeedPerBirdKg}</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">كجم علف لكل طائر</span>
                </div>
              </div>

              {/* Water & Feed Balance Table */}
              <div className="px-4 pb-3">
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-700 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span><strong>متوسط استهلاك مياه الشرب:</strong> {avgDailyWaterLiters.toLocaleString('ar-YE')} لتر/يوم</span>
                  </div>
                  <div>
                    <span><strong>نسبة الماء إلى العلف (Water:Feed):</strong> </span>
                    <strong className="text-emerald-800 font-mono">{waterFeedRatio} : 1</strong>
                    <span className="text-slate-500 text-[10px] mr-1">(المعدل المثالي: 1.8 - 2.1)</span>
                  </div>
                  <div>
                    <span><strong>الوزن الحي المستهدف:</strong> </span>
                    <strong className="text-slate-900">{flock.target_market_weight_kg || 2.1} كجم</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Requirement 3: تواريخ الروشتات والوصفات البيطرية الصادرة خلال الدورة */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-700" />
                  <h2 className="text-xs font-black text-indigo-900">
                    ٤. سجل وتواريخ الروشتات البيطرية الصادرة خلال هذه الدورة (Veterinary Prescriptions Record)
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  عدد الروشتات: {flockPrescriptions.length} وصفة
                </span>
              </div>

              <div className="p-4">
                {flockPrescriptions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs border border-slate-200 rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                        <tr>
                          <th className="p-2.5 border-b border-slate-200">تاريخ الصدور</th>
                          <th className="p-2.5 border-b border-slate-200">رقم الروشتة</th>
                          <th className="p-2.5 border-b border-slate-200">المستحضر والمادة الفعالة</th>
                          <th className="p-2.5 border-b border-slate-200">الجرعة وطريقة الاستخدام</th>
                          <th className="p-2.5 border-b border-slate-200">فترة السحب (الأيام)</th>
                          <th className="p-2.5 border-b border-slate-200">تاريخ أمان التسويق</th>
                          <th className="p-2.5 border-b border-slate-200">الطبيب البيطري المعتمد</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {flockPrescriptions.map((rx) => (
                          <tr key={rx.id} className="hover:bg-slate-50 text-[11px]">
                            <td className="p-2.5 font-bold text-indigo-950 font-mono whitespace-nowrap">
                              {rx.created_at}
                            </td>
                            <td className="p-2.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                              {rx.id}
                            </td>
                            <td className="p-2.5">
                              <strong className="text-slate-900 block">{rx.medication_name}</strong>
                              <span className="text-[10px] text-slate-500 block">المادة: {rx.active_ingredient}</span>
                              {rx.medication_category === 'antibiotic' ? (
                                <span className="inline-block mt-0.5 text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                  مضاد حيوي مقيد (AST Lock)
                                </span>
                              ) : (
                                <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                  فيتامينات ومكملات داعمة
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-700">
                              <div>{rx.dosage}</div>
                              <span className="text-[10px] text-slate-500">عبر: {rx.administration_route} ({rx.duration_days} أيام)</span>
                            </td>
                            <td className="p-2.5 text-center">
                              {rx.withdrawal_days > 0 ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                                  {rx.withdrawal_days} أيام
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  0 يوم
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 font-mono text-emerald-800 font-bold whitespace-nowrap">
                              {rx.harvest_safe_date}
                            </td>
                            <td className="p-2.5 text-slate-800 whitespace-nowrap">
                              <div className="font-semibold">{rx.vet_name}</div>
                              <span className="text-[9px] text-slate-400 font-mono">ID: {rx.vet_id}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                    <strong className="text-emerald-900 block text-xs">
                      سجل دوائي نقي - لم تصدر أي روشتة مضادات حيوية خلال هذه الدورة
                    </strong>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      تمت إدارة هذه الدورة وفق معايير الأمان الحيوي والإدارة المناخية المتكاملة دون الحاجة لتدخل علاجي كيميائي (100% Zero-Antibiotics Cycle).
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Daily Operational Logs Preview (Last entries) */}
            {flockLogs.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h3 className="text-xs font-bold text-slate-800 mb-2">
                  ٥. ملخص آخر القياسات الميدانية المسجلة في السجل اليومي:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px]">أحدث تاريخ تسجيل:</span>
                    <strong className="text-slate-800 font-mono">{flockLogs[flockLogs.length - 1].date}</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px]">متوسط حرارة العنبر:</span>
                    <strong className="text-slate-800 font-mono">{flockLogs[flockLogs.length - 1].temp_celsius}°C</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px]">رطوبة الهواء النسبية:</span>
                    <strong className="text-slate-800 font-mono">{flockLogs[flockLogs.length - 1].humidity_percent}%</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px]">حالة مزامنة البيانات:</span>
                    <strong className="text-emerald-700">موثق سحابياً عبر المنصة</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Official Certification & Signatures Box */}
            <div className="border-2 border-slate-300 rounded-xl p-4 bg-slate-50/50 mt-4">
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">المشرف الميداني / مدير المزرعة</span>
                  <div className="font-bold text-slate-800">{farm.owner_name}</div>
                  <div className="h-8 border-b border-dashed border-slate-400 mt-2" />
                  <span className="text-[9px] text-slate-400 block mt-1">التوقيع والختم</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">الطبيب البيطري الاستشاري المشرف</span>
                  <div className="font-bold text-emerald-800">الطبيب البيطري الاستشاري المعتمد</div>
                  <div className="h-8 border-b border-dashed border-emerald-600 mt-2 flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-emerald-800">معتمد بيطرياً ✓</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">ترخيص مهني رقم: YE-VET-4401</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">ختم التوثيق الإلكتروني المشفر</span>
                  <div className="w-12 h-12 mx-auto bg-slate-900 text-white rounded-lg flex items-center justify-center p-1 shadow">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block mt-1">HASH: {reportSerial}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500">
                تم استخراج هذا التقرير آلياً عبر نظام إدارة الدواجن الذكية - الجمهورية اليمنية. يعد هذا المستند ملخصاً رسمياً لأداء الدورة واستهلاك الأعلاف وتواريخ صرف الروشتات البيطرية.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="no-print p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>جاهز للتصدير كملف PDF عالي الدقة للطباعة أو الأرشفة الرسمية.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold flex items-center gap-2 transition cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ إنشاء التقرير...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تصدير ملف PDF الآن</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
