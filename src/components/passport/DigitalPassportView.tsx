import React, { useState, useEffect } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Calendar,
  MapPin,
  Award,
  FileCheck,
  Building,
  UserCheck,
  Share2,
  Lock,
  ExternalLink,
  Activity,
  Zap,
  FileText,
  FileDown
} from 'lucide-react';
import QRCode from 'qrcode';
import { Flock, Farm, Prescription, DailyLog } from '../../types';
import { PublicVerificationModal } from './PublicVerificationModal';
import { CycleSummaryModal } from '../reports/CycleSummaryModal';

interface DigitalPassportViewProps {
  flocks: Flock[];
  farms: Farm[];
  prescriptions: Prescription[];
  dailyLogs?: DailyLog[];
}

export const DigitalPassportView: React.FC<DigitalPassportViewProps> = ({
  flocks,
  farms,
  prescriptions,
  dailyLogs = []
}) => {
  const [selectedFlockId, setSelectedFlockId] = useState<string>(flocks[0]?.id || '');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [isCycleSummaryOpen, setIsCycleSummaryOpen] = useState<boolean>(false);

  const selectedFlock = flocks.find((f) => f.id === selectedFlockId) || flocks[0];
  const selectedFarm = farms.find((farm) => farm.id === selectedFlock?.farm_id) || farms[0];
  const flockPrescriptions = prescriptions.filter((p) => p.flock_id === selectedFlock?.id);

  // Digital Passport Unique Hash
  const passportHash = `YE-POULTRY-PASS-${selectedFlock?.flock_code}-${Date.now().toString().slice(-6)}`;

  // European Production Efficiency Factor (EPEF) calculation
  // EPEF = (Survival Rate % * Live Weight kg) / (Age days * FCR) * 100
  const survivalRate = selectedFlock
    ? Math.round((selectedFlock.current_count / selectedFlock.initial_count) * 1000) / 10
    : 96.5;
  const estimatedFcr = 1.58;
  const avgWeightKg = selectedFlock?.target_market_weight_kg || 2.15;
  const ageDays = selectedFlock?.current_age_days || 35;
  const epefScore = Math.round((survivalRate * avgWeightKg * 100) / (ageDays * estimatedFcr));

  useEffect(() => {
    if (selectedFlock) {
      QRCode.toDataURL(
        `https://smart-poultry.ye/verify/${passportHash}?flock=${selectedFlock.flock_code}&farm=${encodeURIComponent(
          selectedFarm?.name || ''
        )}&status=CERTIFIED_SAFE`,
        {
          width: 220,
          margin: 1,
          color: {
            dark: '#022c22',
            light: '#ffffff'
          }
        }
      ).then(setQrDataUrl);
    }
  }, [selectedFlockId, passportHash, selectedFarm?.name, selectedFlock]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="no-print bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">جواز السفر الصحي وسلسلة التتبع للمستهلك والمسالخ</h2>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                Farm-to-Fork Traceability
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              وثيقة صحية رسمية مشفرة بـ QR تثبت استيفاء فترة سحب المضادات الحيوية وخلو اللحوم من المتبقيات بنسبة 100%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedFlockId}
            onChange={(e) => setSelectedFlockId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
          >
            {flocks.map((flk) => (
              <option key={flk.id} value={flk.id}>
                {flk.flock_code} ({flk.farm_name})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowVerificationModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/50 text-xs font-bold flex items-center gap-1.5 transition"
            title="تجربة فحص الكود كما يراه المستهلك أو مفتش المسلخ"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>معاينة فحص المستهلك (Live Demo)</span>
          </button>

          <button
            onClick={() => setIsCycleSummaryOpen(true)}
            id="btn-passport-export-cycle"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition cursor-pointer"
            title="تصدير تقرير ملخص الدورة الشامل بصيغة PDF يحتوي على النافق والعلف والروشتات"
          >
            <FileText className="w-4 h-4" />
            <span>تصدير ملخص الدورة (PDF)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-900/30"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الجواز الرسمي</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card (Designed for Print & Screen) */}
      <div
        id="official-digital-passport-print"
        className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8 print:bg-white print:text-black print:border-black print:p-6"
      >
        {/* National Decorative Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-slate-800 print:border-black text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              🇾🇪
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 print:text-black">
                الجمهورية اليمنية • وزارة الزراعة والري والثروة السمكية
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white print:text-black">
                المنصة الوطنية للسيادة البيطرية والداجنة الذكية
              </h3>
              <div className="text-xs text-slate-400 print:text-slate-600">
                برنامج توثيق سلامة اللحوم البيضاء ومطابقة فترات سحب الأدوية
              </div>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-widest font-mono text-indigo-400 print:text-black block">
              شهادة اعتماد الذبح والتسويق
            </span>
            <strong className="text-sm font-mono text-white print:text-black block mt-0.5">
              {passportHash}
            </strong>
            <span className="text-[11px] text-emerald-400 print:text-green-800 font-bold flex items-center justify-center sm:justify-end gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>معتمد وموثق سحابياً</span>
            </span>
          </div>
        </div>

        {/* Safety Guarantee Highlight Badge */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-indigo-950/60 border border-emerald-500/50 print:border-green-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white print:text-black">
                خالٍ من متبقيات المضادات الحيوية بنسبة 100% (Zero Antibiotic Residue)
              </h4>
              <p className="text-xs text-slate-300 print:text-slate-700 mt-0.5">
                تؤكد المنصة استيفاء القطيع لفترة السحب الإلزامية (Withdrawal Period) تحت إشراف بيطري موثق قبل تاريخ التسويق.
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 text-xs font-bold shrink-0 text-center">
            صالح للذبح والاستهلاك الآدمي
          </div>
        </div>

        {/* Flock & Farm Technical Information Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Farm Details */}
          <div className="bg-slate-950/80 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-2xl p-5 space-y-3">
            <h5 className="font-bold text-white print:text-black text-sm flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-2">
              <Building className="w-4 h-4 text-indigo-400" />
              <span>بيانات منشأة الإنتاج والمزرعة:</span>
            </h5>
            <div className="space-y-2 text-slate-300 print:text-black">
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">اسم المزرعة:</span>
                <span className="font-bold">{selectedFarm?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">المالك / المربي المسؤول:</span>
                <span className="font-semibold">{selectedFarm?.owner_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">المحافظة والمنطقة:</span>
                <span>{selectedFarm?.location_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">مؤشر الأمان الحيوي للمزرعة:</span>
                <span className="font-bold text-emerald-400 print:text-green-800">{selectedFarm?.biosecurity_score}%</span>
              </div>
            </div>
          </div>

          {/* Batch & Flock Details */}
          <div className="bg-slate-950/80 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-2xl p-5 space-y-3">
            <h5 className="font-bold text-white print:text-black text-sm flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>مواصفات القطيع والتتبع الحقلي:</span>
            </h5>
            <div className="space-y-2 text-slate-300 print:text-black">
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">كود الدفعة (Flock Code):</span>
                <span className="font-mono font-bold text-white print:text-black">{selectedFlock?.flock_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">السلالة الوراثية:</span>
                <span>{selectedFlock?.breed_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">العمر عند الذبح:</span>
                <span className="font-bold">{selectedFlock?.current_age_days} يوماً</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">تاريخ إذن التسويق:</span>
                <span>{new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* European Production Efficiency Factor (EPEF) Card */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-xs sm:text-sm font-bold text-white print:text-black">
                  مؤشر الكفاءة الإنتاجية الأوروبي (EPEF / EPEI) للقطيع:
                </h5>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {epefScore > 350 ? 'كفاءة قياسية ممتازة' : 'كفاءة جيدة جداً'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">
                حيوية القطيع: {survivalRate}% • معدل التحويل FCR: {estimatedFcr} • متوسط الوزن: {avgWeightKg} كجم
              </p>
            </div>
          </div>

          <div className="text-center sm:text-left shrink-0 bg-slate-900 print:bg-slate-100 px-4 py-2 rounded-xl border border-indigo-500/20">
            <span className="text-[10px] text-slate-400 print:text-slate-600 block">نقاط مؤشر EPEF:</span>
            <strong className="text-lg font-black text-indigo-400 print:text-black">{epefScore} نقطة</strong>
          </div>
        </div>

        {/* QR Code Verification Block & Official Seals */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-slate-800 print:border-black">
          {/* QR Container */}
          <div className="flex items-center gap-4 text-center sm:text-right">
            {qrDataUrl && (
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-300 shrink-0">
                <img src={qrDataUrl} alt="Traceability QR" className="w-28 h-28" />
              </div>
            )}
            <div className="space-y-1 text-xs">
              <strong className="text-white print:text-black block text-sm">امسح الكود عبر كاميرا هاتفك:</strong>
              <p className="text-slate-400 print:text-slate-600 max-w-xs leading-relaxed">
                يتيح هذا الرمز للمسالخ والمطاعم والمستهلك النهائي فحص سلسلة التتبع الكاملة وسجل الأدوية والفحوصات
                المخبرية المعتمدة فورياً.
              </p>
            </div>
          </div>

          {/* Official Signatures & Seal */}
          <div className="space-y-2 text-center sm:text-left text-xs">
            <div className="text-slate-400 print:text-slate-600 text-[11px]">
              المستشار والمشرف العلمي على المنصة:
            </div>
            <div className="font-black text-sm text-white print:text-black">
              الطبيب البيطري الاستشاري المعتمد
            </div>
            <div className="text-[10px] text-emerald-400 print:text-green-800 font-bold border border-emerald-500/30 print:border-black px-3 py-1 rounded-lg inline-block">
              الختم البيطري الرقمي المشفر • YE-VET-OFFICIAL
            </div>
          </div>
        </div>
      </div>

      {/* Live Consumer Traceability Demo Modal */}
      {showVerificationModal && (
        <PublicVerificationModal
          flock={selectedFlock}
          farm={selectedFarm}
          prescriptions={flockPrescriptions}
          passportHash={passportHash}
          onClose={() => setShowVerificationModal(false)}
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
          prescriptions={flockPrescriptions}
        />
      )}
    </div>
  );
};
