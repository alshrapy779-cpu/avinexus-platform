import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
  Save,
  Award,
  Info,
  CheckSquare,
  Square,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Farm, BiosecurityAuditItem } from '../../types';
import { INITIAL_BIOSECURITY_CHECKLIST } from '../../data/initialData';

interface BiosecurityAuditModalProps {
  farm: Farm;
  onClose: () => void;
  onUpdateScore: (farmId: string, newScore: number) => void;
}

export const BiosecurityAuditModal: React.FC<BiosecurityAuditModalProps> = ({
  farm,
  onClose,
  onUpdateScore
}) => {
  const [checklist, setChecklist] = useState<BiosecurityAuditItem[]>(INITIAL_BIOSECURITY_CHECKLIST);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Toggle item status
  const handleToggle = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, passed: !item.passed } : item))
    );
  };

  // Calculate dynamic score
  const totalWeight = checklist.reduce((sum, item) => sum + item.weight_points, 0);
  const earnedWeight = checklist
    .filter((item) => item.passed)
    .reduce((sum, item) => sum + item.weight_points, 0);
  const currentScore = Math.round((earnedWeight / totalWeight) * 100);

  const handleSave = () => {
    onUpdateScore(farm.id, currentScore);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 border-b border-emerald-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">أداة التدقيق والتقييم الميداني للأمان الحيوي (Biosecurity Audit)</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  {farm.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                بروتوكول المعايير القياسية لوزارة الزراعة وإشراف: <strong>الطبيب البيطري الاستشاري المعتمد</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Score Indicator Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${
                  currentScore >= 80
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : currentScore >= 70
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {currentScore}%
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">مؤشر الأمان الحيوي المحسوب للمزرعة:</div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>
                  {currentScore >= 80
                    ? 'ممتاز - المزرعة محصنة ومعتمدة بالكامل'
                    : currentScore >= 70
                    ? 'جيد - مستوى مقبول مع نقاط تحسين حيوية'
                    : 'عالي الخطورة - غير مطابقة لمعايير السلامة البيطرية'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400">
              مجموع النقاط المحققة: <strong className="text-white">{earnedWeight}</strong> من أصل {totalWeight}
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-900/30"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>تم حفظ التحديث!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>اعتماد وتحديث التقييم</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Checklist Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.passed
                  ? 'bg-slate-950/80 border-emerald-500/40 hover:border-emerald-500/70'
                  : 'bg-slate-950/40 border-rose-500/30 hover:border-rose-500/60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  className={`mt-0.5 p-1 rounded-lg transition shrink-0 ${
                    item.passed ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-500 bg-slate-800'
                  }`}
                >
                  {item.passed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {item.category_ar}
                    </span>
                    <h4 className={`text-xs font-black ${item.passed ? 'text-white' : 'text-slate-300'}`}>
                      {item.title_ar}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400">+{item.weight_points} نقطة</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description_ar}</p>

                  {!item.passed && (
                    <div className="mt-2 text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-900/50 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span><strong>الإجراء التصحيحي المطلوب:</strong> {item.corrective_action_ar}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                    item.passed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {item.passed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>مستوفى</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>غير مستوفى</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            انقر على أي بند لتغيير حالته بين مستوفى وغير مستوفى، ثم اضغط على اعتماد لتحديث بطاقة المزرعة.
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
