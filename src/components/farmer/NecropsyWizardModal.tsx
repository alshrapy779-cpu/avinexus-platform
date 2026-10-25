import React, { useState } from 'react';
import { X, Camera, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, ArrowLeft, ArrowRight, Eye, Upload } from 'lucide-react';
import { Flock, NecropsyOrgan, OrganObservation, NecropsyCase } from '../../types';
import { apiService } from '../../services/apiService';

interface NecropsyWizardModalProps {
  flock: Flock;
  onClose: () => void;
  onCaseCreated: (newCase: NecropsyCase) => void;
}

const ORGANS: { key: NecropsyOrgan; title: string; guide: string; typicalAbnormalities: string; presetSamples: { name: string; status: 'normal' | 'suspicious' | 'severe_lesions'; desc: string }[] }[] = [
  {
    key: 'liver',
    title: '1. الكبد (Liver)',
    guide: 'افحص حجم الكبد، حدة الحواف، اللون، وجود غشاء ليفي أبيض (Perihepatitis) أو بقع نخرية بيضاء/صفراء.',
    typicalAbnormalities: 'تضخم كبدي، احتقان داكن، غشاء ليفي ملتصق (E. Coli)، بقع نخرية (Inclusion Body Hepatitis).',
    presetSamples: [
      { name: 'كبد سليم طبيعي', status: 'normal', desc: 'لون بني مائل للأحمر، حواف حادة، لا توجد إفرازات فبرينية.' },
      { name: 'غشاء ليفي متليف (التهاب ليفي)', status: 'severe_lesions', desc: 'غشاء أبيض ليفي يغطي فصي الكبد مع احتقان شديد (Perihepatitis ناتج عن مضاعفات E. Coli).' },
      { name: 'احتقان وتضخم حاد', status: 'suspicious', desc: 'تضخم كبدي مع استدارة الحواف وتغير طفيف للون المصفر.' }
    ]
  },
  {
    key: 'intestine',
    title: '2. الأمعاء (Intestines)',
    guide: 'شق الأمعاء طولياً وتفقد الاثني عشر، الصائم، الأعورين، وابحث عن نزف، مخاط، كرويات غازية أو آفات الكوكسيديا.',
    typicalAbnormalities: 'التهاب أمعاء نخري (المظهر التركي)، نزف حاد بنقاط حمراء أو بيضاء (الكوكسيديا E. tenella / necatrix).',
    presetSamples: [
      { name: 'أمعاء سليمة متماسكة', status: 'normal', desc: 'مخاطية طبيعية، محتويات علفية مهضومة بدون احمرار أو تقرح.' },
      { name: 'نزف كروي حاد (كوكسيديا أعورية)', status: 'severe_lesions', desc: 'انتفاخ الأعورين بكتل دموية متجلطة ونزف نمشي حاد ومخاط مددم.' },
      { name: 'التهاب معوي غازي نخري', status: 'suspicious', desc: 'انتفاخ بالغازات ورقة جدار الأمعاء مع بقع رمادية في الثلث المتوسط.' }
    ]
  },
  {
    key: 'bursa',
    title: '3. كيس بورسيا (Bursa of Fabricius)',
    guide: 'افحص غدة فابريشيا فوق فتحة المجمع مباشرة، دقق في الحجم، النزف الداخلي، الوذمة المائية، أو الضمور.',
    typicalAbnormalities: 'تضخم ووذمة جيلاتينية ونزف في الثنيات المخاطية (جمبورو IBD)، أو ضمور شديد صلب.',
    presetSamples: [
      { name: 'كيس بورسيا سليم', status: 'normal', desc: 'حجم ملائم لعمر الطائر، لون سمني طبيعي، ثنيات مخاطية نظيفة.' },
      { name: 'تضخم ونزف دموي حاد (جمبورو)', status: 'severe_lesions', desc: 'تضخم مضاعف مع وذمة جيلاتينية صفراء ونزف نمشي داكن على الثنيات الداخلية.' },
      { name: 'ضمور وتكلس جزئي', status: 'suspicious', desc: 'حجم أصغر من المعدل الطبيعي مع شحوب نسبي يشير لتثبيط مناعي.' }
    ]
  },
  {
    key: 'trachea',
    title: '4. القصبة الهوائية (Trachea)',
    guide: 'افتح الحنجرة وشق القصبة بالكامل إلى الشعب، ابحث عن احتقان الأوعية، إفرازات مصلية، مخاط دموي، أو سدادات كازينية متجبنة.',
    typicalAbnormalities: 'سدادة متجبنة خانقة (ILT / IB)، احتقان شعيري نزفي (نيوكاسل تنفسي)، مخاط لزج (CRD).',
    presetSamples: [
      { name: 'قصبة هوائية وردية سليمة', status: 'normal', desc: 'غشاء مخاطي وردي رطب بدون إفرازات أو احمرار.' },
      { name: 'سدادة متجبنة خانقة ومخاط دموي', status: 'severe_lesions', desc: 'انسداد مجرى التنفس بكتلة جبنية صفراء مع نزف مخاطي حاد في الحنجرة.' },
      { name: 'احتقان شعيري ومخاط مصلي', status: 'suspicious', desc: 'خطوط احتقان وعائي ممتدة على طول القصبة مع رشح مخاطي متوسط.' }
    ]
  },
  {
    key: 'droppings',
    title: '5. الذرق والمخرجات (Droppings)',
    guide: 'افحص فتحة المجمع ونوعية الذرق الطازج: أبيض طباشيري (أملاح يورات)، أخضر زمردي داكن، مائي، أو مدمم.',
    typicalAbnormalities: 'ذرق مائي أبيض طباشيري (إصابة كلوية/جمبورو)، ذرق أخضر زمردي زيتي (نيوكاسل)، مدمم (كوكسيديا).',
    presetSamples: [
      { name: 'ذرق متماسك طبيعي', status: 'normal', desc: 'قوام متماسك باللون البني الرمادي مع تاج بلوري أبيض خفيف.' },
      { name: 'ذرق مائي أبيض طباشيري شديد', status: 'severe_lesions', desc: 'إسهال أبيض يوراتي سائل ملتصق بفتحة المجمع دال على تأثر كلوي وجفاف حاد.' },
      { name: 'ذرق مصفر مخاطي رغوي', status: 'suspicious', desc: 'براز رغوي مع أجزاء علفية غير مهضومة يشير لسوء امتصاص.' }
    ]
  }
];

export const NecropsyWizardModal: React.FC<NecropsyWizardModalProps> = ({ flock, onClose, onCaseCreated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sampleCount, setSampleCount] = useState<number>(3);
  const [observations, setObservations] = useState<OrganObservation[]>(
    ORGANS.map((o) => ({
      organ: o.key,
      organ_name_ar: o.title,
      status: 'normal',
      lesion_description: o.presetSamples[0].desc
    }))
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [flockNotes, setFlockNotes] = useState('');

  const currentOrgan = ORGANS[currentStep];
  const currentObs = observations[currentStep];

  const handleSelectPreset = (status: 'normal' | 'suspicious' | 'severe_lesions', desc: string) => {
    const updated = [...observations];
    updated[currentStep] = {
      ...updated[currentStep],
      status,
      lesion_description: desc
    };
    setObservations(updated);
  };

  const handleCustomDesc = (desc: string) => {
    const updated = [...observations];
    updated[currentStep] = {
      ...updated[currentStep],
      lesion_description: desc
    };
    setObservations(updated);
  };

  const handleOrganImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const updated = [...observations];
      updated[currentStep] = {
        ...updated[currentStep],
        image_url: reader.result
      };
      setObservations(updated);
    };
    reader.readAsDataURL(file);
  };

  const removeOrganImage = () => {
    const updated = [...observations];
    const { image_url: _removedImage, ...rest } = updated[currentStep];
    updated[currentStep] = rest as OrganObservation;
    setObservations(updated);
  };

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await apiService.analyzeNecropsyAI({
        observations,
        bird_age_days: flock.current_age_days,
        breed: flock.breed_type,
        flock_context: `عنبر ${flock.house_number}، العدد الحالي: ${flock.current_count}، ملاحظات إضافية: ${flockNotes}`
      });
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleForwardToVet = async () => {
    if (!aiResult) return;

    const newCasePayload = {
      flock_id: flock.id,
      flock_code: flock.flock_code,
      farm_name: flock.farm_name,
      bird_age_days: flock.current_age_days,
      sample_count: sampleCount,
      observations,
      ai_prediction: aiResult,
      vet_approval_status: 'pending' as const
    };

    const saved = await apiService.addNecropsyCase(newCasePayload);
    onCaseCreated(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>المعالج المصور للتشخيص البصري والتشريحي</span>
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                  AI-Guided Necropsy
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                القطيع: {flock.flock_code} ({flock.breed_type}) • العمر: {flock.current_age_days} يوماً
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {!aiResult ? (
            <>
              {/* Stepper Navigation */}
              <div className="grid grid-cols-5 gap-2">
                {ORGANS.map((organ, idx) => {
                  const obs = observations[idx];
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <button
                      key={organ.key}
                      onClick={() => setCurrentStep(idx)}
                      className={`p-2 rounded-xl text-center border transition relative text-xs flex flex-col items-center justify-center gap-1 ${
                        isCurrent
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                          : isDone
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                          : 'bg-slate-900/50 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[11px]">{idx + 1}</span>
                        {obs.status === 'severe_lesions' && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                        )}
                        {obs.status === 'suspicious' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                        )}
                        {obs.status === 'normal' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        )}
                      </div>
                      <span className="truncate w-full text-[10px] font-medium">
                        {organ.key === 'liver' && 'الكبد'}
                        {organ.key === 'intestine' && 'الأمعاء'}
                        {organ.key === 'bursa' && 'بورسيا'}
                        {organ.key === 'trachea' && 'القصبة'}
                        {organ.key === 'droppings' && 'الذرق'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Current Organ Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{currentOrgan.title}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          currentObs.status === 'severe_lesions'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : currentObs.status === 'suspicious'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {currentObs.status === 'severe_lesions' && 'آفات حادة وخطيرة'}
                        {currentObs.status === 'suspicious' && 'اشتباه أو تغير ملحوظ'}
                        {currentObs.status === 'normal' && 'سليم وطبيعي'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{currentOrgan.guide}</p>
                  </div>
                </div>

                {/* Preset Pathology Samples */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    اختر العينة الأكثر تطابقاً مع التشريح الميداني (أو حدد درجة الآفة):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {currentOrgan.presetSamples.map((sample, sIdx) => {
                      const isSelected = currentObs.lesion_description === sample.desc;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleSelectPreset(sample.status, sample.desc)}
                          className={`p-3 rounded-xl text-right border transition text-xs flex flex-col justify-between gap-2 ${
                            isSelected
                              ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{sample.name}</span>
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                sample.status === 'severe_lesions'
                                  ? 'bg-rose-500'
                                  : sample.status === 'suspicious'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">{sample.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Note or Manual Input */}
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    وصف المربي الميداني لهذه الآفة:
                  </label>
                  <textarea
                    rows={2}
                    value={currentObs.lesion_description}
                    onChange={(e) => handleCustomDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    placeholder="أدخل أي ملاحظات لونية، قوام، روائح، أو إفرازات إضافية..."
                  />
                </div>

                {/* Real organ image capture / upload */}
                <div className="border-2 border-dashed border-cyan-900/60 rounded-xl p-3 bg-[#071b25]/70 text-xs text-slate-300 space-y-3">
                  {currentObs.image_url ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => window.open(currentObs.image_url, '_blank', 'noopener,noreferrer')}
                        className="w-full rounded-xl overflow-hidden bg-black/30 border border-cyan-900/50"
                        title="فتح الصورة بالحجم الكامل"
                      >
                        <img
                          src={currentObs.image_url}
                          alt={`صورة تشريح ${currentOrgan.title}`}
                          className="w-full h-56 object-contain"
                        />
                      </button>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-emerald-300 font-bold">تم إرفاق الصورة الأصلية لهذا العضو.</span>
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-800 text-cyan-200 hover:bg-cyan-900/70">
                          استبدال الصورة
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => handleOrganImage(e.target.files?.[0])}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={removeOrganImage}
                          className="px-3 py-1.5 rounded-lg bg-rose-950/50 border border-rose-900/60 text-rose-300"
                        >
                          حذف الصورة
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-3 p-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-700/50 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-cyan-300" />
                      </div>
                      <div className="text-center sm:text-right">
                        <div className="font-bold text-white">التقط أو ارفع صورة تشريح عالية الدقة</div>
                        <div className="text-[11px] text-slate-500 mt-1">الصورة الأصلية تُرفق بملف الحالة ليشاهدها الطبيب والمشرف بالحجم الكامل.</div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleOrganImage(e.target.files?.[0])}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Global Sample & Navigation Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>عدد العينات المشرحة:</span>
                  <select
                    value={sampleCount}
                    onChange={(e) => setSampleCount(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  >
                    <option value={2}>عينتان طازجتان (2 Birds)</option>
                    <option value={3}>3 عينات قياسية (3 Birds)</option>
                    <option value={5}>5 عينات موسعة (5 Birds)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>السابق</span>
                    </button>
                  )}

                  {currentStep < ORGANS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1"
                    >
                      <span>التالي: {ORGANS[currentStep + 1].title.split('.')[1]}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRunAIAnalysis}
                      disabled={isAnalyzing}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isAnalyzing ? 'جاري التحليل بالذكاء الاصطناعي...' : 'تشغيل محرك التحليل التشريحي الذكي'}</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* AI Results & Forwarding to Senior Vet Screen */
            <div className="space-y-5">
              {/* Primary Disease Badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-emerald-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>الاحتمال التشخيصي الأكثر ترجيحاً بواسطة الذكاء الاصطناعي:</span>
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      aiResult.emergency_level === 'حرج (طارئ)'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    مستوى الخطورة: {aiResult.emergency_level}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-black text-white">{aiResult.primary_disease}</h3>
                  <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                    <span className="text-xs text-emerald-300">درجة التطابق:</span>
                    <span className="text-lg font-black text-emerald-400">{aiResult.confidence_score}%</span>
                  </div>
                </div>

                {/* Human in the Loop Warning */}
                <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold mb-0.5">
                      قاعدة النظام الإلزامية (Human-in-the-Loop):
                    </strong>
                    هذا التحليل الأولي مبني على الذكاء الاصطناعي لترتيب الأولويات، ولا يعتبر وصفة علاجية. القرار الطبي
                    وصرف العلاجات حكراً على الطبيب الاستشاري الطبيب الاستشاري وفريقه المعتمد.
                  </div>
                </div>
              </div>

              {/* Differential Diagnoses & Pathological Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Differentials */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-teal-400" />
                    <span>التشخيص التفريقي (Differential Diagnoses):</span>
                  </h5>
                  <div className="space-y-2">
                    {aiResult.differential_diagnoses?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-200">{item.disease}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-teal-500 h-full rounded-full" style={{ width: `${item.probability}%` }} />
                          </div>
                          <span className="text-teal-400 font-semibold">{item.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pathological Findings */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>أبرز الآفات الملحوظة تشريحياً:</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {aiResult.pathological_findings?.map((finding: string, i: number) => (
                      <li key={i} className="leading-relaxed text-slate-300">
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Lab Tests */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs">
                <span className="font-bold text-slate-300 block mb-1.5">الفحوصات المخبرية الموصى بها قبل إقرار العلاج:</span>
                <div className="flex flex-wrap gap-2">
                  {aiResult.recommended_lab_tests?.map((test: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 text-[11px]"
                    >
                      🧪 {test}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAiResult(null)}
                  className="px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  تعديل الصفة التشريحية
                </button>

                <button
                  type="button"
                  onClick={handleForwardToVet}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-teal-900/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>إرسال الملف فوراً للاستشاري في غرفة القرار البيطري</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
