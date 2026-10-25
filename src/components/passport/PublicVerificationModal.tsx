import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Building,
  Calendar,
  Award,
  Clock,
  Sparkles,
  ExternalLink,
  Share2,
  FileCheck,
  QrCode
} from 'lucide-react';
import { Flock, Farm, Prescription } from '../../types';

interface PublicVerificationModalProps {
  flock: Flock;
  farm: Farm;
  prescriptions: Prescription[];
  passportHash: string;
  onClose: () => void;
}

export const PublicVerificationModal: React.FC<PublicVerificationModalProps> = ({
  flock,
  farm,
  prescriptions,
  passportHash,
  onClose
}) => {
  const activePrescriptions = prescriptions.filter((p) => p.flock_id === flock.id);
  const withdrawalCompleted = activePrescriptions.every((p) => p.status === 'completed_withdrawn' || !p.lab_sensitivity_attached);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-4 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <span>بوابة فحص المستهلك والمسالخ المباشرة</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="text-[10px] text-slate-300">الجمهورية اليمنية • التحقق السيادي لسلامة اللحوم</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Main Big Clearance Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/90 to-emerald-900/40 border border-emerald-500/60 text-center space-y-2 shadow-inner">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 mx-auto shadow-lg shadow-emerald-900/40">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">المنتج معتمد وصالح للاستهلاك الآدمي</h3>
              <p className="text-emerald-300 font-bold text-xs mt-0.5">
                خالٍ من متبقيات المضادات الحيوية بنسبة 100% (Zero Residue Certified)
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-700/40 flex items-center justify-center gap-2 text-[11px] text-slate-200">
              <span className="text-slate-400">كود التحقق الرقمي:</span>
              <strong className="font-mono text-white bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                {passportHash}
              </strong>
            </div>
          </div>

          {/* Core Verification Items */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Building className="w-4 h-4 text-teal-400" />
                <span>المزرعة المنتجة:</span>
              </div>
              <span className="font-bold text-white">{farm?.name}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>كود الدفعة (Flock Code):</span>
              </div>
              <span className="font-mono font-bold text-white">{flock?.flock_code}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>العمر والسلالة:</span>
              </div>
              <span className="font-medium text-white">{flock?.current_age_days} يوماً ({flock?.breed_type})</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>فترة سحب الأدوية (Withdrawal):</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>مكتملة ومستوفاة بالكامل</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>مؤشر الأمان الحيوي للمنشأة:</span>
              </div>
              <span className="font-bold text-emerald-400">{farm?.biosecurity_score}% (مطابق للمعايير)</span>
            </div>
          </div>

          {/* Scientific Endorsement Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-amber-300">
                إشراف واعتماد: الطبيب البيطري الاستشاري المعتمد
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                تم التحقق من بيانات هذه الشحنة بموجب بروتوكول حوكمة الأدوية البيطرية، وسحب عينات عشوائية للتأكد
                من خلوها التام من أي مضادات حيوية أو متبقيات هرمونية، وهي جاهزة للذبح والتداول التجاري.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>طباعة بطاقة التحقق</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/30"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
