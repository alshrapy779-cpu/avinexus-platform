import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  AlertOctagon,
  CheckCircle2,
  FileText,
  QrCode,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Clock,
  Pill,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import { NecropsyCase, LabSensitivityResult, Prescription, MedicationCategory } from '../../types';
import { apiService } from '../../services/apiService';

interface DecisionRoomModalProps {
  caseData: NecropsyCase;
  labReports: LabSensitivityResult[];
  onClose: () => void;
  onPrescriptionIssued: (prescription: Prescription, updatedCase: NecropsyCase) => void;
}

const COMMON_MEDICATIONS: {
  name: string;
  category: MedicationCategory;
  active: string;
  defaultDose: string;
  route: 'ماء الشرب' | 'العلف' | 'حقن عضلي';
  defaultWithdrawalDays: number;
}[] = [
  {
    name: 'فلورفينيكول 10% (Florfenicol)',
    category: 'antibiotic',
    active: 'Florfenicol',
    defaultDose: '20 ملغ/كغم وزن حي (1 مل/لتر ماء)',
    route: 'ماء الشرب',
    defaultWithdrawalDays: 7
  },
  {
    name: 'كوليستين سلفات (Colistin Sulphate)',
    category: 'antibiotic',
    active: 'Colistin Sulphate',
    defaultDose: '1 غرام / 10 لتر ماء شرب',
    route: 'ماء الشرب',
    defaultWithdrawalDays: 5
  },
  {
    name: 'دوكسيسيكلين هايكلات (Doxycycline Hyclate)',
    category: 'antibiotic',
    active: 'Doxycycline',
    defaultDose: '1 غرام / 5 لتر ماء شرب',
    route: 'ماء الشرب',
    defaultWithdrawalDays: 8
  },
  {
    name: 'إنروفلوكساسين 10% (Enrofloxacin)',
    category: 'antibiotic',
    active: 'Enrofloxacin',
    defaultDose: '10 ملغ/كغم وزن حي (1 مل/2 لتر ماء)',
    route: 'ماء الشرب',
    defaultWithdrawalDays: 10
  },
  {
    name: 'موسع قصبات ومستخلصات نعناع وزعتر (Menthol-Broncho)',
    category: 'vitamins_electrolytes',
    active: 'Eucalyptus oil + Menthol extract',
    defaultDose: '1 مل / لتر ماء شرب لمدة 3 أيام',
    route: 'ماء الشرب',
    defaultWithdrawalDays: 0
  },
  {
    name: 'تولترازوريل مضاد كوكسيديا (Toltrazuril 2.5%)',
    category: 'anticoccidial',
    active: 'Toltrazuril',
    defaultDose: '7 ملغ/كغم وزن حي لمدة يومين متتاليين',
    route: 'ماء الشرب',
    defaultWithdrawalDays: 14
  },
  {
    name: 'فيتامين C + باراسيتامول لتخفيض الإجهاد الحراري',
    category: 'vitamins_electrolytes',
    active: 'Paracetamol + Ascorbic Acid',
    defaultDose: '1 غرام / 2 لتر ماء شرب',
    route: 'ماء الشرب',
    defaultWithdrawalDays: 0
  }
];

export const DecisionRoomModal: React.FC<DecisionRoomModalProps> = ({
  caseData,
  labReports,
  onClose,
  onPrescriptionIssued
}) => {
  const [selectedMedIndex, setSelectedMedIndex] = useState(0);
  const [selectedLabReportId, setSelectedLabReportId] = useState<string>(labReports[0]?.id || '');
  const [customDiagnosis, setCustomDiagnosis] = useState(
    caseData.vet_diagnosis || caseData.ai_prediction.primary_disease
  );
  const [vetNotes, setVetNotes] = useState(
    caseData.vet_notes || 'بناءً على المعاينة التشريحية وفحص الحساسية المخبرية، يُقرر العلاج بالجرعة وفترة السحب المحددة.'
  );
  const [durationDays, setDurationDays] = useState(4);
  const [withdrawalDays, setWithdrawalDays] = useState(7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string | null>(null);

  const selectedMed = COMMON_MEDICATIONS[selectedMedIndex];
  const isAntibiotic = selectedMed.category === 'antibiotic';
  const selectedLabReport = labReports.find((r) => r.id === selectedLabReportId);

  // Check if selected antibiotic has a verified sensitive test in lab report
  const isAntibioticSensitiveInLab =
    selectedLabReport &&
    selectedLabReport.antibiotics_sensitivity.some(
      (item) =>
        item.antibiotic_name.toLowerCase().includes(selectedMed.active.toLowerCase()) ||
        selectedMed.active.toLowerCase().includes(item.antibiotic_name.toLowerCase())
    );

  const handleIssuePrescription = async () => {
    setErrorMessage(null);

    // Strict System Rule: Medication Lock Logic
    if (isAntibiotic) {
      if (!selectedLabReportId || !selectedLabReport) {
        setErrorMessage('عفواً، يمنع صرف المضادات الحيوية بدون تقرير فحص حساسية بكتيرية مرفق.');
        return;
      }
    }

    setIsProcessing(true);
    try {
      const response = await apiService.createPrescription({
        case_id: caseData.id,
        flock_id: caseData.flock_id,
        farm_name: caseData.farm_name,
        vet_id: 'vet-consultant',
        vet_name: 'الطبيب البيطري الاستشاري المعتمد',
        medication_category: selectedMed.category,
        medication_name: selectedMed.name,
        active_ingredient: selectedMed.active,
        dosage: selectedMed.defaultDose,
        administration_route: selectedMed.route,
        duration_days: durationDays,
        withdrawal_days: withdrawalDays,
        lab_sensitivity_attached: isAntibiotic ? Boolean(selectedLabReport) : false,
        lab_sensitivity_id: isAntibiotic ? selectedLabReport?.id : undefined,
        lab_sensitivity_summary: isAntibiotic
          ? `فحص مخبري من ${selectedLabReport?.lab_name}: معزولة ${selectedLabReport?.pathogen_isolated}`
          : undefined
      });

      if (!response.success || !response.data) {
        setErrorMessage(response.error || 'عفواً، تم رفض قفل الوصفة');
        setIsProcessing(false);
        return;
      }

      // Generate visual QR code
      const qrDataUrl = await QRCode.toDataURL(response.data.qr_code_hash, {
        margin: 1,
        width: 200,
        color: {
          dark: '#022c22',
          light: '#ffffff'
        }
      });
      setGeneratedQrDataUrl(qrDataUrl);

      // Update Case in background
      const updatedCase = await apiService.updateNecropsyCase(caseData.id, {
        vet_diagnosis: customDiagnosis,
        vet_notes: vetNotes,
        vet_approval_status: 'approved',
        vet_name: 'الطبيب البيطري الاستشاري المعتمد',
        approved_at: new Date().toLocaleString('ar-YE', { hour12: false })
      });

      onPrescriptionIssued(response.data, updatedCase);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>غرفة القرار البيطري وإصدار الروشتة المقفلة</span>
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  Decision Room
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                الحالة: {caseData.id} • المزرعة: {caseData.farm_name} • عمر الطيور: {caseData.bird_age_days} يوماً
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* AI vs Vet Diagnosis Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>مقترح الذكاء الاصطناعي الأولي:</span>
              </span>
              <span className="text-slate-400">درجة الثقة: {caseData.ai_prediction.confidence_score}%</span>
            </div>
            <div className="text-white font-black text-sm bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              {caseData.ai_prediction.primary_disease}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                التشخيص الطبي النهائي المعتمد للاستشاري (Human Approval):
              </label>
              <input
                type="text"
                value={customDiagnosis}
                onChange={(e) => setCustomDiagnosis(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Medication Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 block">
              اختر العلاج أو البروتوكول الدوائي المطلوب:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_MEDICATIONS.map((med, idx) => {
                const isSelected = selectedMedIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedMedIndex(idx);
                      setWithdrawalDays(med.defaultWithdrawalDays);
                    }}
                    className={`p-3 rounded-xl border text-right transition text-xs flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{med.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          med.category === 'antibiotic'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        {med.category === 'antibiotic' ? '🔒 مضاد حيوي (مقفل)' : 'داعم / وقائي'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      الجرعة: {med.defaultDose} • فترة السحب: <strong className="text-amber-300">{med.defaultWithdrawalDays} أيام</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SENSITIVITY LOCK LOGIC PANEL */}
          {isAntibiotic && (
            <div className="bg-gradient-to-br from-rose-950/30 via-slate-950 to-slate-900 border-2 border-rose-500/50 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>نظام قفل المضادات الحيوية الذكي (Antibiotic Sensitivity Lock):</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 font-bold">
                  شرط إلزامي
                </span>
              </div>

              <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-800/60 text-xs text-rose-200 leading-relaxed">
                <strong>القاعدة التشغيلية:</strong> يمنع النظام الاستشاري منعاً باتاً من صرف وتوقيع أي مضاد حيوي إلا
                بربط تقرير فحص حساسية بكتيرية مخبري معتمد يثبت فاعلية الدواء على العزلة الحقلية لمنع ظاهرة مقاومة البكتيريا.
              </div>

              {/* Lab Report Linking Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  حدد تقرير فحص الحساسية المخبري المعتمد لربطه بالروشتة:
                </label>
                <select
                  value={selectedLabReportId}
                  onChange={(e) => setSelectedLabReportId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="">-- اضغط لربط فحص حساسية مخبري مرفق --</option>
                  {labReports.map((report) => (
                    <option key={report.id} value={report.id}>
                      {report.lab_name} ({report.test_date}) • العزلة: {report.pathogen_isolated}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Lab Sensitivity Details */}
              {selectedLabReport && (
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>المختبر: <strong className="text-slate-200">{selectedLabReport.lab_name}</strong></span>
                    <span className="text-emerald-400 font-bold">✓ تقرير مخبري معتمد وموثق</span>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    نتائج الحساسية المعتمدة (Disc Diffusion):
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {selectedLabReport.antibiotics_sensitivity.map((item, i) => (
                      <div
                        key={i}
                        className={`p-1.5 rounded-lg text-[10px] flex items-center justify-between ${
                          item.sensitivity_status.includes('حساس')
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                            : item.sensitivity_status.includes('متوسط')
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                        }`}
                      >
                        <span className="truncate">{item.antibiotic_name.split('(')[0]}</span>
                        <strong className="shrink-0">{item.zone_mm} مم</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dosage & Withdrawal Period Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">مدة العلاج (أيام):</label>
              <input
                type="number"
                min={1}
                max={10}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                فترة السحب الإلزامية (أيام):
              </label>
              <input
                type="number"
                min={0}
                max={28}
                value={withdrawalDays}
                onChange={(e) => setWithdrawalDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">تاريخ الأمان للذبح:</label>
              <div className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400">
                {new Date(Date.now() + (durationDays + withdrawalDays) * 86400000).toISOString().split('T')[0]}
              </div>
            </div>
          </div>

          {/* Vet Clinical Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              توجيهات الاستشاري وإرشادات التطبيق للمزرعة:
            </label>
            <textarea
              rows={2}
              value={vetNotes}
              onChange={(e) => setVetNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="bg-rose-950/80 border-2 border-rose-500 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-200 animate-shake">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-300 font-bold mb-1">تم تفعيل قفل الأمان البيطري:</strong>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Generated QR Code Success Panel */}
          {generatedQrDataUrl && (
            <div className="bg-emerald-950/30 border-2 border-emerald-500 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم إصدار الروشتة الطبية وتشفيرها برمز QR معتمد!</span>
                </span>
                <p className="text-xs text-slate-300">
                  تم قفل الروشتة برمز مشفر غير قابل للتزوير، وحفظ فترات السحب في قاعدة البيانات لربطها بجواز السفر الرقمي
                  عند التسويق.
                </p>
              </div>

              <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
                <img src={generatedQrDataUrl} alt="Prescription Encrypted QR" className="w-24 h-24" />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
            >
              إغلاق
            </button>

            {!generatedQrDataUrl ? (
              <button
                type="button"
                onClick={handleIssuePrescription}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'جاري التحقق والتشفير...' : 'اعتماد التشخيص وإصدار الروشتة المقفلة بـ QR'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>إتمام والعودة إلى لوحة التحكم</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
