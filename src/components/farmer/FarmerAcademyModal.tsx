import React, { useState } from 'react';
import { X, Award, BookOpen, CheckCircle, AlertOctagon, HelpCircle, Check, Sparkles, Printer } from 'lucide-react';
import { MYTH_BUSTING_ITEMS } from '../../data/initialData';

interface FarmerAcademyModalProps {
  onClose: () => void;
  farmerName: string;
  farmName: string;
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'ما هو التصرف العلمي الصحيح عند الاشتباه بعدوى بكتيرية في القطيع؟',
    options: [
      'خلط 3 مضادات حيوية معاً في خزان الماء فوراً لضمان القضاء على الميكروب.',
      'عزل العينات وعمل فحص حساسية بكتيرية مخبري قبل صرف أي مضاد حيوي.',
      'مضاعفة جرعة المضاد القديم المستخدم في الدورة السابقة دون استشارة.',
      'إيقاف ماء الشرب تماماً لمنع انتشار الإسهال.'
    ],
    correctIndex: 1,
    explanation: 'الاستخدام العشوائي للمضادات دون فحص حساسية يؤدي إلى نشوء بكتيريا مستعصية وفشل كلوي وتسمم كبدي للقطيع.'
  },
  {
    id: 2,
    question: 'كم المدة العلمية الموصى بها لتعطيش الدواجن قبل إعطاء لقاح مائي في الطقس المعتدل؟',
    options: [
      'ساعة ونصف إلى ساعتين كحد أقصى لتفادي إفراز هرمون التوتر وتثبيط المناعة.',
      '6 ساعات لضمان أن كل الدجاج يشرب بشراهة.',
      'لا داعي للتعطيش نهائياً ويوضع اللقاح في أي وقت.',
      'ليلة كاملة (12 ساعة) متواصلة.'
    ],
    correctIndex: 0,
    explanation: 'التعطيش الجائر يفرز هرمون الكورتيكوستيرون المثبط للمناعة، مما يقضي على فاعلية اللقاح ويسبب صدمة للقطيع.'
  },
  {
    id: 3,
    question: 'ما هي أهمية الالتزام الصارم بفترات سحب الدواء (Withdrawal Periods) قبل الذبح؟',
    options: [
      'فقط لإرضاء المشتري وليس لها تأثير صحي حقيقي.',
      'ضمان خلو لحوم الدواجن من المتبقيات الكيميائية لحماية المستهلك والحصول على جواز السفر الرقمي المعتمد.',
      'تخفيض تكلفة استهلاك العلف في الأيام الأخيرة.',
      'زيادة رطوبة اللحم في المسلخ.'
    ],
    correctIndex: 1,
    explanation: 'متبقيات المضادات الحيوية في لحوم الدواجن تتسبب في فشل كلوي وسرطانات وتفشي البكتيريا الخارقة المقاومة للعلاج البشري.'
  }
];

export const FarmerAcademyModal: React.FC<FarmerAcademyModalProps> = ({ onClose, farmerName, farmName }) => {
  const [activeTab, setActiveTab] = useState<'myths' | 'quiz' | 'badge'>('myths');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCertified, setIsCertified] = useState(false);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
    const score = QUIZ_QUESTIONS.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;
    if (score === QUIZ_QUESTIONS.length) {
      setIsCertified(true);
      setActiveTab('badge');
    }
  };

  const score = QUIZ_QUESTIONS.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>أكاديمية تصحيح المفاهيم والوعي البيطري</span>
                <span className="text-[11px] font-normal text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/60">
                  MythBusting & Literacy
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                إشراف علمي: الطبيب البيطري الاستشاري المعتمد • للحصول على وسام "المربي المعتمد علمياً"
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950/60">
          <button
            onClick={() => setActiveTab('myths')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'myths'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>تصحيح المعتقدات الخاطئة (MythBusting)</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>الاختبار المعرفي التأهيلي (3 أسئلة)</span>
          </button>

          {isCertified && (
            <button
              onClick={() => setActiveTab('badge')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'badge'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>وسام المربي المعتمد علمياً</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'myths' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                مفاهيم خاطئة متوارثة في تربية الدواجن باليمن تكبد المربين خسائر بملايين الريالات وتضر بصحة المواطنين.
                اطلع على الحقائق العلمية الموثقة أدناه ثم اجتز الاختبار لتحصل على شهادتك.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MYTH_BUSTING_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                        {item.tag}
                      </span>
                      <span className="text-xs font-black text-rose-400">❌ معتقد خاطئ شائع</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{item.myth_title}</h4>

                    <div className="bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-xl text-xs text-rose-200">
                      <strong className="block text-rose-300 mb-0.5">ما يعتقده البعض:</strong>
                      {item.popular_belief}
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-xl text-xs text-emerald-200">
                      <strong className="block text-emerald-300 mb-0.5">الحقيقة العلمية الدامغة:</strong>
                      {item.scientific_fact}
                    </div>

                    <div className="text-[11px] text-amber-300/90 font-medium pt-1 border-t border-slate-800">
                      💡 <strong>نصيحة الطبيب الاستشاري:</strong> {item.veterinary_advice}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-900/30"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>بدء الاختبار المعرفي لنيل وسام المربي المعتمد</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-5">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">اختبار الإدارة العلمية لمزارع الدواجن:</span>
                  <span className="text-slate-400 text-[11px]">أجب على الأسئلة الثلاثة بنسبة 100% لنيل الوسام المعتمد.</span>
                </div>
                {quizSubmitted && (
                  <div
                    className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      score === QUIZ_QUESTIONS.length
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    النتيجة: {score} من {QUIZ_QUESTIONS.length}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {QUIZ_QUESTIONS.map((q, qIndex) => {
                  const selected = selectedAnswers[q.id];
                  const isCorrect = selected === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          <span className="text-amber-400 ml-1">سؤال {qIndex + 1}:</span> {q.question}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isChosen = selected === optIndex;
                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';

                          if (quizSubmitted) {
                            if (optIndex === q.correctIndex) {
                              btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                            } else if (isChosen && !isCorrect) {
                              btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                            }
                          } else if (isChosen) {
                            btnStyle = 'bg-amber-950/50 border-amber-500 text-white ring-1 ring-amber-500';
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              className={`w-full p-2.5 rounded-xl border text-right transition text-xs flex items-center justify-between gap-2 ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIndex === q.correctIndex && (
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                          <strong>التفسير العلمي:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                {quizSubmitted && score < QUIZ_QUESTIONS.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-white hover:bg-slate-700"
                  >
                    إعادة المحاولة
                  </button>
                ) : <div />}

                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleGradeQuiz}
                    disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-900/30 disabled:opacity-50"
                  >
                    <span>تصحيح الاختبار وإصدار النتيجة</span>
                  </button>
                ) : score === QUIZ_QUESTIONS.length ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('badge')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>عرض وطباعة وسام المربي المعتمد</span>
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {activeTab === 'badge' && (
            <div className="space-y-4 text-center">
              {/* Certificate Card */}
              <div
                id="certified-farmer-certificate"
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-emerald-950/40 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden text-slate-100"
              >
                {/* Decorative Emblem */}
                <div className="absolute top-2 right-2 text-amber-500/10 text-8xl font-black select-none pointer-events-none">
                  YE
                </div>

                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 mb-4 ring-4 ring-amber-400/30">
                  <Award className="w-12 h-12" />
                </div>

                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                  الجمهورية اليمنية • المنصة الوطنية للسيادة البيطرية والداجنة الذكية
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  وسام المربي المعتمد علمياً
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
                  تشهد المنصة الوطنية بأن المربي الفاضل قد اجتاز معايير الأمان الحيوي والتربية الدقيقة وتصحيح المفاهيم
                  البيطرية بنجاح، وملتزم بقفل المضادات الحيوية وفترات السحب لحماية الأمن الصحي الوطني.
                </p>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 max-w-md mx-auto space-y-2 text-xs mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">اسم المربي المعتمد:</span>
                    <span className="font-bold text-white">{farmerName || 'أحمد صالح العنسي'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">المزرعة التابعة:</span>
                    <span className="font-bold text-emerald-400">{farmName || 'مزرعة وادي سبأ النموذجية'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">رقم الاعتماد الرقمي:</span>
                    <span className="font-mono text-amber-300 font-bold">YE-VET-CERT-2026-994</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">تاريخ الإصدار:</span>
                    <span className="text-slate-300">سبتمبر 2026</span>
                  </div>
                </div>

                <div className="flex items-center justify-around pt-4 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">الختم الرقمي للمنصة:</span>
                    <span className="font-bold text-emerald-400">معتمد وموثق سحابياً</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">المستشار العلمي والمشرف:</span>
                    <span className="font-bold text-amber-300">الطبيب البيطري الاستشاري المعتمد</span>
                  </div>
                </div>
              </div>

              {/* Print button */}
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-2 border border-slate-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الشهادة الرسمية</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
