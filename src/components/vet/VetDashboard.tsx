import React, { useState } from 'react';
import {
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  Droplets,
  Scale,
  Thermometer,
  Calendar,
  CheckCircle2,
  Clock,
  QrCode,
  Lock,
  ChevronRight,
  Eye,
  Filter,
  Sparkles,
  MapPin,
  TrendingDown,
  Printer,
  Radio,
  ClipboardCheck,
  FlaskConical
} from 'lucide-react';
import { Farm, Flock, DailyLog, NecropsyCase, Prescription, LabSensitivityResult, AcousticAnalysisSession, EpidemiologicalOutbreak, SmartOperationsState } from '../../types';
import { DecisionRoomModal } from './DecisionRoomModal';
import { EpidemiologicalMapModal } from '../epidemiology/EpidemiologicalMapModal';
import { BiosecurityAuditModal } from '../biosecurity/BiosecurityAuditModal';
import { CycleSummaryModal } from '../reports/CycleSummaryModal';
import { FieldDoctorWorkspaceV14 } from './FieldDoctorWorkspaceV14';
import { VetLabWorkflowV18 } from './VetLabWorkflowV18';
import { INITIAL_OUTBREAKS } from '../../data/initialData';

interface VetDashboardProps {
  farms: Farm[];
  flocks: Flock[];
  dailyLogs: DailyLog[];
  necropsyCases: NecropsyCase[];
  prescriptions: Prescription[];
  labReports: LabSensitivityResult[];
  acousticSessions: AcousticAnalysisSession[];
  outbreaks?: EpidemiologicalOutbreak[];
  smartOperations?: SmartOperationsState;
  onUpdateSmartOperations?: (operations: SmartOperationsState) => void;
  onPrescriptionIssued: (prescription: Prescription, updatedCase: NecropsyCase) => void;
  onUpdateFarmScore?: (farmId: string, newScore: number) => void;
  onBroadcastAlert?: (outbreakId: string) => void;
}

export const VetDashboard: React.FC<VetDashboardProps> = ({
  farms,
  flocks,
  dailyLogs,
  necropsyCases,
  prescriptions,
  labReports,
  acousticSessions,
  outbreaks = INITIAL_OUTBREAKS,
  smartOperations,
  onUpdateSmartOperations,
  onPrescriptionIssued,
  onUpdateFarmScore,
  onBroadcastAlert
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(necropsyCases[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [activeModalCase, setActiveModalCase] = useState<NecropsyCase | null>(null);
  const [activeTab, setActiveTab] = useState<'cases' | 'digital_twin' | 'prescriptions' | 'supervision' | 'field_v14' | 'lab_v18'>('cases');
  const [showOutbreakMap, setShowOutbreakMap] = useState<boolean>(false);
  const [auditFarm, setAuditFarm] = useState<Farm | null>(null);
  const [isCycleSummaryOpen, setIsCycleSummaryOpen] = useState<boolean>(false);
  const [selectedNecropsyImage, setSelectedNecropsyImage] = useState<string>('');

  const filteredCases = necropsyCases.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.vet_approval_status === filterStatus;
  });

  const selectedCase = necropsyCases.find((c) => c.id === selectedCaseId) || filteredCases[0];
  const caseFlock = flocks.find((f) => f.id === selectedCase?.flock_id);
  const caseFarm = farms.find((f) => f.id === caseFlock?.farm_id);
  const caseFlockLogs = dailyLogs.filter((l) => l.flock_id === selectedCase?.flock_id);
  const caseAcoustic = acousticSessions.find((s) => s.flock_id === selectedCase?.flock_id);

  // Farms with risk index < 70%
  const highRiskFarms = farms.filter((f) => f.biosecurity_score < 70);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Vet Identity & Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">لوحة تحكم الطبيب والاستشاري البيطري</h2>
              <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold">
                Senior Vet Console
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              الإشراف العام وتطبيق سياسة حوكمة الأدوية: <strong>الطبيب البيطري الاستشاري المعتمد</strong> • نظام دعم القرار
              البيطري (Human-in-the-Loop)
            </p>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'cases' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ملفات الحالات الموحدة</span>
          </button>
          <button
            onClick={() => setActiveTab('digital_twin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'digital_twin' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>رادار المخاطر والتوأم الرقمي</span>
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'prescriptions' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>الروشتات المقفلة بـ QR</span>
          </button>
          <button
            onClick={() => setActiveTab('supervision')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'supervision' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>عقود الإشراف والتقارير اليومية</span>
            {smartOperations && (
              <span className="bg-cyan-900/80 text-cyan-200 text-[9px] px-1.5 py-0.5 rounded-full">
                {smartOperations.enterprise.farm_supervision_contracts_v12?.filter((c) => c.status === 'active').length || 0}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('field_v14')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'field_v14' ? 'bg-cyan-500 text-slate-950' : 'text-cyan-300 hover:text-white border border-cyan-800/60'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>مساحة الطبيب الميداني V14</span>
            {smartOperations && <span className="bg-slate-950/80 text-cyan-200 text-[9px] px-1.5 py-0.5 rounded-full">{smartOperations.enterprise.field_doctor_visits_v14?.length || 0}</span>}
          </button>
          <button
            onClick={() => setActiveTab('lab_v18')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'lab_v18' ? 'bg-cyan-500 text-slate-950' : 'text-cyan-300 hover:text-white border border-cyan-800/60'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>المختبر والعينات V18</span>
            {smartOperations && <span className="bg-slate-950/80 text-cyan-200 text-[9px] px-1.5 py-0.5 rounded-full">{smartOperations.enterprise.sample_tracking_v18?.length || 0}</span>}
          </button>
          <button
            onClick={() => setShowOutbreakMap(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-rose-950/70 text-rose-300 border border-rose-600/50 hover:bg-rose-900/60"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>رادار الأوبئة والإنذار المبكر</span>
            <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
              {outbreaks.length} بؤر
            </span>
          </button>
        </div>
      </div>

      {/* High-Risk Farms Alert Banner (if biosecurity or health < 70%) */}
      {highRiskFarms.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-4 flex items-start justify-between gap-3 text-xs text-rose-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-rose-300 font-bold mb-0.5">
                تنبيه رادار المخاطر الحيوي (Farms Below 70% Threshold):
              </strong>
              تم رصد {highRiskFarms.length} مزرعة تحت الحد الآمن للأمان الحيوي (مثل{' '}
              {highRiskFarms.map((f) => f.name).join('، ')}). يوصى بتشديد الرقابة الميدانية وفحص العزل الفوري.
            </div>
          </div>
          <button
            onClick={() => setActiveTab('digital_twin')}
            className="px-3 py-1 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 font-bold shrink-0"
          >
            معاينة الرادار
          </button>
        </div>
      )}

      {activeTab === 'field_v14' && smartOperations && onUpdateSmartOperations && (
        <FieldDoctorWorkspaceV14 operations={smartOperations} onUpdateOperations={onUpdateSmartOperations} />
      )}

      {activeTab === 'lab_v18' && smartOperations && onUpdateSmartOperations && (
        <VetLabWorkflowV18 operations={smartOperations} onUpdateOperations={onUpdateSmartOperations} />
      )}

      {/* TAB 1: Unified Case File View (ملف الحالة الموحد) */}
      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Cases List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-teal-400" />
                <span>الحالات الواردة من الميدان:</span>
              </h3>

              {/* Status Filter */}
              <div className="flex items-center gap-1 text-[11px] bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2 py-0.5 rounded ${
                    filterStatus === 'all' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-2 py-0.5 rounded ${
                    filterStatus === 'pending' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  معلق
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`px-2 py-0.5 rounded ${
                    filterStatus === 'approved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  معتمد
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredCases.map((caseItem) => {
                const isSelected = selectedCase?.id === caseItem.id;
                const isPending = caseItem.vet_approval_status === 'pending';
                return (
                  <button
                    key={caseItem.id}
                    type="button"
                    onClick={() => setSelectedCaseId(caseItem.id)}
                    className={`w-full p-3.5 rounded-2xl border text-right transition flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-teal-950/50 border-teal-500 text-white ring-1 ring-teal-500'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">
                        {caseItem.farm_name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isPending ? 'بانتظار قرار الطبيب' : 'معتمد بالروشتة'}
                      </span>
                    </div>

                    <div className="text-xs text-teal-300 font-semibold truncate">
                      {caseItem.ai_prediction.primary_disease}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>القطيع: {caseItem.flock_code} (عمر {caseItem.bird_age_days} يوم)</span>
                      <span>تطابق AI: {caseItem.ai_prediction.confidence_score}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Comprehensive Unified Case Details */}
          <div className="lg:col-span-8 space-y-5">
            {selectedCase ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
                {/* Case Header with Quick Decision Trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{selectedCase.farm_name}</h3>
                      <span className="text-xs text-slate-400 font-mono">({selectedCase.id})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      القطيع: {selectedCase.flock_code} • العمر: {selectedCase.bird_age_days} يوماً • تم فحص{' '}
                      {selectedCase.sample_count} طيور مشرحة
                    </p>
                  </div>

                  {/* Decision Action Button */}
                  <button
                    type="button"
                    onClick={() => setActiveModalCase(selectedCase)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 shrink-0"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {selectedCase.vet_approval_status === 'pending'
                        ? 'الدخول لغرفة القرار وإصدار الروشتة'
                        : 'معاينة / تعديل الروشتة المعتمدة'}
                    </span>
                  </button>
                </div>

                {/* AI Differential Prediction vs Senior Approval */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI Prediction Summary */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-teal-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>تحليل الذكاء الاصطناعي الأولي:</span>
                      </span>
                      <span className="text-xs font-bold text-white bg-teal-950 px-2 py-0.5 rounded-lg border border-teal-800">
                        {selectedCase.ai_prediction.confidence_score}% ثقة
                      </span>
                    </div>

                    <div className="text-base font-black text-white">
                      {selectedCase.ai_prediction.primary_disease}
                    </div>

                    <div className="text-xs text-slate-400">
                      مستوى الطوارئ: <strong className="text-rose-400">{selectedCase.ai_prediction.emergency_level}</strong>
                    </div>

                    <div className="space-y-1 pt-1 text-xs">
                      <span className="text-slate-400 text-[11px] block">التشخيص التفريقي:</span>
                      {selectedCase.ai_prediction.differential_diagnoses?.map((diff, i) => (
                        <div key={i} className="flex justify-between text-[11px] text-slate-300">
                          <span>{diff.disease}</span>
                          <span className="text-teal-400 font-bold">{diff.probability}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Senior Vet Diagnosis Confirmation */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4" />
                        <span>قرار الطبيب الاستشاري المعتمد:</span>
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          selectedCase.vet_approval_status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {selectedCase.vet_approval_status === 'approved' ? 'معتمد رسمياً' : 'بانتظار الاعتماد'}
                      </span>
                    </div>

                    <div className="text-base font-black text-white">
                      {selectedCase.vet_diagnosis || 'لم يُقرر بعد (قيد مراجعة الطبيب الاستشاري)'}
                    </div>

                    <div className="text-xs text-slate-400">
                      الطبيب المسؤول: <strong className="text-slate-200">{selectedCase.vet_name || 'الطبيب البيطري الاستشاري المعتمد'}</strong>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                      {selectedCase.vet_notes || 'بانتظار مطابقة نتائج الفحص المخبري لإصدار الروشتة المقفلة.'}
                    </div>
                  </div>
                </div>

                {/* 5 Vital Organs Pathology Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    نتائج الصفة التشريحية الميدانية للأعضاء الحيوية الخمسة:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {selectedCase.observations.map((obs, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-right space-y-1.5 ${
                          obs.status === 'severe_lesions'
                            ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                            : obs.status === 'suspicious'
                            ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{obs.organ_name_ar}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              obs.status === 'severe_lesions'
                                ? 'bg-rose-500'
                                : obs.status === 'suspicious'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                        {obs.image_url ? (
                          <button type="button" onClick={() => setSelectedNecropsyImage(obs.image_url || '')} className="w-full rounded-lg overflow-hidden border border-white/10 bg-slate-950 group">
                            <img src={obs.image_url} alt={obs.organ_name_ar} className="w-full h-24 object-cover group-hover:scale-105 transition" />
                            <span className="block py-1 text-[9px] text-cyan-300">فتح الصورة بالحجم الكامل</span>
                          </button>
                        ) : <div className="h-16 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-[9px] text-slate-500">لا توجد صورة تشريح أصلية مرفوعة</div>}
                        <p className="text-[10px] leading-tight line-clamp-3 opacity-90">
                          {obs.lesion_description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flock Performance Metrics: Water, Feed, Mortality Trends */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200">
                      سجل استهلاك الماء والعلف والنفوق المقارن بالمنحنى المعياري:
                    </h4>
                    {caseFlock && caseFarm && (
                      <button
                        type="button"
                        id="btn-vet-export-cycle"
                        onClick={() => setIsCycleSummaryOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                        title="تصدير تقرير ملخص الدورة (نافق، علف، روشتات) بصيغة PDF"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>تصدير ملخص الدورة (PDF)</span>
                      </button>
                    )}
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800 text-[11px]">
                          <th className="pb-2">العمر</th>
                          <th className="pb-2">التاريخ</th>
                          <th className="pb-2">استهلاك الماء</th>
                          <th className="pb-2">استهلاك العلف</th>
                          <th className="pb-2">الحرارة / الرطوبة</th>
                          <th className="pb-2 text-rose-400">النافق</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {caseFlockLogs.slice(-5).map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/50">
                            <td className="py-2 font-bold text-white">يوم {log.day_age}</td>
                            <td className="py-2 text-slate-400">{log.date}</td>
                            <td className="py-2 font-semibold text-cyan-400">
                              {log.water_consumption_liters} لتر
                            </td>
                            <td className="py-2 font-semibold text-amber-400">
                              {log.feed_consumption_kg} كغم
                            </td>
                            <td className="py-2">
                              {log.temp_celsius}°C / {log.humidity_percent}%
                            </td>
                            <td className="py-2 font-black text-rose-400">{log.mortality_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Acoustic AI night assessment if available */}
                {caseAcoustic && (
                  <div className="bg-slate-950 border border-teal-900/40 rounded-xl p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">
                          أحدث تسجيل صوتي ليلي: مؤشر الضائقة {caseAcoustic.respiratory_distress_index}% ({caseAcoustic.severity})
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {caseAcoustic.ai_assessment}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 shrink-0 font-mono space-y-2 min-w-[210px]">
                      <div>شخير: {caseAcoustic.snick_count} • عطس: {caseAcoustic.sneeze_count}</div>
                      {caseAcoustic.audio_file_url ? (
                        <audio controls src={caseAcoustic.audio_file_url} className="w-full h-9" />
                      ) : <div className="text-[9px] text-slate-600">لا يوجد ملف صوت أصلي لهذه الحالة التجريبية</div>}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                لا توجد حالات مسجلة حالياً
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Risk Index & Digital Twin (رادار المخاطر والتوأم الرقمي) */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">رادار سلامة مزارع الدواجن والتوأم الرقمي (Digital Twin)</h3>
                <p className="text-xs text-slate-400">
                  خوارزمية محاكاة تقارن معدلات استهلاك الماء والعلف والأمان الحيوي للكشف عن الانحرافات قبل وقوع الكوارث.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-400 bg-teal-950 px-3 py-1 rounded-xl border border-teal-800">
                معدل الأمان الوطني العام: 78%
              </span>
            </div>

            {/* SRS v1.0 Digital Twin Formula Banner */}
            <div className="bg-slate-950/80 border border-teal-500/20 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Activity className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  <strong>مؤشر سلامة القطيع (SRS v1.0 - Section 8.2):</strong>
                </span>
              </div>
              <div className="font-mono text-teal-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                R(t) = 100 - (0.30·ΔF + 0.25·ΔW + 0.30·ΔM + 0.15·ΔT) | تنبيه: R(t) &lt; 70% ⚠️
              </div>
            </div>

            {/* Farms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {farms.map((farm) => {
                const farmFlocks = flocks.filter((f) => f.farm_id === farm.id);
                const isUnderThreshold = farm.biosecurity_score < 70;
                return (
                  <div
                    key={farm.id}
                    className={`p-5 rounded-2xl border transition space-y-3 relative overflow-hidden ${
                      isUnderThreshold
                        ? 'bg-gradient-to-b from-rose-950/30 to-slate-900 border-rose-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{farm.name}</h4>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{farm.location_name}</span>
                        </span>
                      </div>
                      <div
                        className={`text-base font-black px-2.5 py-1 rounded-xl border ${
                          farm.biosecurity_score >= 80
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : farm.biosecurity_score >= 70
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
                        }`}
                      >
                        {farm.biosecurity_score}%
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">مالك المزرعة:</span>
                        <span className="font-semibold">{farm.owner_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">القطعان النشطة:</span>
                        <span className="font-semibold">{farmFlocks.length} قطعان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">مستوى الخطورة الحيوي:</span>
                        <span className={`font-bold ${isUnderThreshold ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isUnderThreshold ? '⚠️ حرج (دون 70%)' : '✓ مستقر وضمن الحدود'}
                        </span>
                      </div>
                    </div>

                    {isUnderThreshold && (
                      <div className="bg-rose-950/60 p-2.5 rounded-xl border border-rose-900 text-[11px] text-rose-200">
                        مطلوب إرسال فريق تفتيش بيطري ومراجعة بروتوكول التطهير الفوري.
                      </div>
                    )}

                    <button
                      onClick={() => setAuditFarm(farm)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>إجراء تدقيق الأمان الحيوي الشامل</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Contracted Farm Supervision & Daily Reports */}
      {activeTab === 'supervision' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/25 bg-cyan-950/20 p-4">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="w-5 h-5 text-cyan-300 mt-0.5" />
              <div>
                <h3 className="text-sm font-black text-white">عقود الإشراف المفعلة والمتابعة اليومية</h3>
                <p className="text-xs text-slate-400 mt-1">كل عقد مفعّل يظهر للطبيب المسؤول مع وقت التقرير اليومي وآخر بيانات القطيع. التقارير الحرجة تُرفع للمراجعة ولا يعتمد المساعد علاجاً نهائياً بدلاً عن الطبيب.</p>
              </div>
            </div>
          </div>

          {!smartOperations || !smartOperations.enterprise.farm_supervision_contracts_v12?.length ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">لا توجد عقود إشراف مسجلة حالياً.</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {smartOperations.enterprise.farm_supervision_contracts_v12.map((contract) => {
                const reports = (smartOperations.enterprise.supervision_daily_reports_v12 || [])
                  .filter((r) => r.contract_id === contract.id)
                  .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));
                const latest = reports[0];
                const isActive = contract.status === 'active';
                return (
                  <div key={contract.id} className={`rounded-2xl border p-4 ${isActive ? 'border-cyan-500/30 bg-slate-900' : 'border-slate-800 bg-slate-950/60'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono text-cyan-400">{contract.contract_number}</div>
                        <h4 className="text-sm font-black text-white mt-0.5">{contract.farm_name}</h4>
                        <div className="text-xs text-slate-400">{contract.customer_name} • {contract.governorate}/{contract.district || 'غير محدد'}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full border ${isActive ? 'bg-emerald-950/50 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>{contract.status}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-[11px]">
                      <div className="bg-slate-950 rounded-lg p-2 border border-slate-800"><span className="text-slate-500 block">الطبيب المسؤول</span><b className="text-slate-200">{contract.responsible_vet_name}</b></div>
                      <div className="bg-slate-950 rounded-lg p-2 border border-slate-800"><span className="text-slate-500 block">التقرير اليومي</span><b className="text-slate-200">{contract.daily_report_time}</b></div>
                      <div className="bg-slate-950 rounded-lg p-2 border border-slate-800"><span className="text-slate-500 block">الهناجر</span><b className="text-slate-200">{contract.hangars_count}</b></div>
                      <div className="bg-slate-950 rounded-lg p-2 border border-slate-800"><span className="text-slate-500 block">حجم القطيع</span><b className="text-slate-200">{contract.flock_size.toLocaleString('ar-YE')}</b></div>
                    </div>
                    <div className="mt-3 text-[11px] text-slate-400">نطاق الإشراف: {contract.scope.join(' • ')}</div>
                    {latest ? (
                      <div className={`mt-3 rounded-xl border p-3 ${latest.alert_level === 'urgent' ? 'border-rose-700/60 bg-rose-950/20' : latest.alert_level === 'watch' ? 'border-amber-700/40 bg-amber-950/15' : 'border-emerald-800/40 bg-emerald-950/15'}`}>
                        <div className="flex justify-between items-center text-[11px]"><b className="text-white">آخر تقرير: {latest.date}</b><span className="text-slate-400">{latest.alert_level}</span></div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 mt-2 text-[10px] text-slate-300">
                          <span>علف: {latest.feed_kg} كجم</span><span>ماء: {latest.water_liters} لتر</span><span>نافق: {latest.mortality_count}</span><span>حرارة: {latest.temperature_celsius}°</span><span>رطوبة: {latest.humidity_percent}%</span>
                        </div>
                        <div className="mt-2 text-xs text-cyan-200">{latest.ai_summary}</div>
                        <div className="mt-1 text-[10px] text-slate-500">التهوية: {latest.ventilation_note} • الفرشة: {latest.litter_note}</div>
                        <div className="mt-2 text-[10px] text-emerald-300">{latest.sent_to_vet ? '✓ تم توجيه التقرير للطبيب المسؤول' : 'بانتظار الإرسال للطبيب'}</div>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-xl border border-dashed border-slate-700 p-3 text-xs text-slate-500">لم يصل تقرير يومي لهذا العقد بعد.</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Prescriptions with QR (سجل الروشتات المقفلة) */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">سجل الروشتات الطبية المقفلة والمشفرة بـ QR</h3>
              <p className="text-xs text-slate-400">
                كافة الوصفات تصدر تحت إشراف الطبيب الاستشاري ومحمية بقفل حساسية المضادات وفترات السحب المعتمدة.
              </p>
            </div>
            <span className="text-xs text-slate-400">{prescriptions.length} روشتات صادرة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider">
                      {rx.id}
                    </span>
                    <h4 className="text-sm font-bold text-white">{rx.farm_name}</h4>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      rx.medication_category === 'antibiotic'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {rx.medication_category === 'antibiotic' ? '🔒 مضاد حيوي (بقفل فحص حساسية)' : 'داعم وقائي'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white text-sm">{rx.medication_name}</div>
                  <div className="text-slate-400">الجرعة: {rx.dosage}</div>
                  <div className="text-slate-400">طريقة الإعطاء: {rx.administration_route}</div>
                  <div className="text-slate-400">
                    مدة العلاج: <strong>{rx.duration_days} أيام</strong> • فترة السحب:{' '}
                    <strong className="text-amber-300">{rx.withdrawal_days} أيام</strong>
                  </div>
                </div>

                {rx.lab_sensitivity_summary && (
                  <div className="text-[11px] bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/50 text-emerald-300">
                    🔬 <strong>الفحص المخبري المرفق:</strong> {rx.lab_sensitivity_summary}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>الطبيب الموقع: <strong>{rx.vet_name}</strong></span>
                  <span className="font-mono text-[10px] text-teal-300">QR: {rx.qr_code_hash.substring(0, 16)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision Room Modal */}
      {selectedNecropsyImage && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm p-4 flex items-center justify-center" onClick={() => setSelectedNecropsyImage('')}>
          <div className="max-w-6xl w-full max-h-[92vh] relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedNecropsyImage('')} className="absolute top-3 left-3 z-10 px-3 py-2 rounded-xl bg-black/70 text-white text-xs">إغلاق</button>
            <img src={selectedNecropsyImage} alt="صورة التشريح الأصلية" className="w-full max-h-[90vh] object-contain rounded-2xl border border-slate-700 bg-black" />
          </div>
        </div>
      )}

      {activeModalCase && (
        <DecisionRoomModal
          caseData={activeModalCase}
          labReports={labReports}
          onClose={() => setActiveModalCase(null)}
          onPrescriptionIssued={(rx, updatedCase) => {
            onPrescriptionIssued(rx, updatedCase);
            setActiveModalCase(null);
          }}
        />
      )}

      {/* Epidemiological Outbreak GIS Map Modal */}
      {showOutbreakMap && (
        <EpidemiologicalMapModal
          outbreaks={outbreaks}
          farms={farms}
          onClose={() => setShowOutbreakMap(false)}
          onBroadcastAlert={(id) => {
            if (onBroadcastAlert) onBroadcastAlert(id);
          }}
        />
      )}

      {/* Biosecurity Standard Audit Modal */}
      {auditFarm && (
        <BiosecurityAuditModal
          farm={auditFarm}
          onClose={() => setAuditFarm(null)}
          onUpdateScore={(farmId, newScore) => {
            if (onUpdateFarmScore) onUpdateFarmScore(farmId, newScore);
          }}
        />
      )}

      {/* Official Cycle Summary Report & PDF Generator Modal */}
      {isCycleSummaryOpen && caseFlock && caseFarm && (
        <CycleSummaryModal
          isOpen={isCycleSummaryOpen}
          onClose={() => setIsCycleSummaryOpen(false)}
          flock={caseFlock}
          farm={caseFarm}
          dailyLogs={dailyLogs}
          prescriptions={prescriptions}
        />
      )}
    </div>
  );
};
