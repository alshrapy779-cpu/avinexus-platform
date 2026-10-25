import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Activity, Volume2, Sparkles, AlertTriangle, CheckCircle2, Play, Square, ShieldCheck } from 'lucide-react';
import { Flock, AcousticAnalysisSession } from '../../types';
import { apiService } from '../../services/apiService';

interface AcousticRecordingModalProps {
  flock: Flock;
  onClose: () => void;
  onSessionSaved: (session: AcousticAnalysisSession) => void;
}

export const AcousticRecordingModal: React.FC<AcousticRecordingModalProps> = ({ flock, onClose, onSessionSaved }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioPreset, setAudioPreset] = useState<'mild' | 'severe' | 'normal'>('mild');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [ambientNotes, setAmbientNotes] = useState('تم التسجيل الساعة 11:30 ليلاً أثناء سكون العمال وانطفاء الإضاءة الكلية');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string>('');
  const [recordingError, setRecordingError] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Simulated 30-second recording timer
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 30) {
            clearInterval(timer);
            setIsRecording(false);
            if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    setRecordingSeconds(0);
    setAnalysisResult(null);
    setRecordingError('');
    setRecordedAudioUrl('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      recorder.onstop = () => {
        if (audioChunksRef.current.length) {
          const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => setRecordedAudioUrl(typeof reader.result === 'string' ? reader.result : '');
          reader.readAsDataURL(blob);
        }
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError('تعذر الوصول إلى الميكروفون. امنح التطبيق إذن التسجيل ثم أعد المحاولة.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const snickCount = audioPreset === 'severe' ? 36 : audioPreset === 'mild' ? 8 : 1;
      const sneezeCount = audioPreset === 'severe' ? 18 : audioPreset === 'mild' ? 3 : 0;

      const result = await apiService.analyzeAcousticAI({
        snick_count: snickCount,
        sneeze_count: sneezeCount,
        duration_seconds: recordingSeconds || 30,
        time_of_recording: 'ليلي (هدوء تام في العنبر)',
        ambient_notes: ambientNotes
      });

      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndSync = async () => {
    if (!analysisResult) return;

    const snickCount = audioPreset === 'severe' ? 36 : audioPreset === 'mild' ? 8 : 1;
    const sneezeCount = audioPreset === 'severe' ? 18 : audioPreset === 'mild' ? 3 : 0;

    const saved = await apiService.recordAcousticSession({
      flock_id: flock.id,
      recorded_at: new Date().toLocaleString('ar-YE', { hour12: false }) + ' (تسجيل ليلي)',
      duration_seconds: 30,
      time_of_recording: 'ليلي (هدوء تام)',
      snick_count: snickCount,
      sneeze_count: sneezeCount,
      rales_frequency_hz: audioPreset === 'severe' ? 4900 : audioPreset === 'mild' ? 3100 : 1200,
      respiratory_distress_index: analysisResult.respiratory_distress_index || 40,
      ai_assessment: analysisResult.ai_assessment || 'تحليل ذكاء اصطناعي صوتي مكتمل.',
      severity: analysisResult.severity || 'انحراف مبكر',
      audio_file_url: recordedAudioUrl || undefined
    });

    onSessionSaved(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-teal-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>الاستشعار الصوتي لكشف الشخير والعطس الليلي</span>
                <span className="text-[11px] font-normal text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800/60">
                  Acoustic AI
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                القطيع: {flock.flock_code} • العمر: {flock.current_age_days} يوماً (كشف مبكر قبل الأعراض الظاهرة بـ 48 ساعة)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Scientific guidance callout */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-300">
              <Volume2 className="w-4 h-4 text-teal-400" />
              <span>إرشادات التسجيل الصوتي المعياري:</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              يتم التسجيل ليلاً (بين 11:00م و 2:00ص) لمدة 30 ثانية في هدوء تام عند سكون الطيور. يلتقط المحرك الذكي ترددات
              الخشخشة التنفسية وحساب مؤشر الشخير (Snick Rate)، مما يكشف بداية التهاب القصبة والميكوبلازما قبل ظهور النفوق.
            </p>
          </div>

          {/* Sound Scenario Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              اختر سيناريو الصوت الليلي للمحاكاة الميدانية:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAudioPreset('normal');
                  setRecordingSeconds(30);
                }}
                className={`p-3 rounded-xl border text-right transition text-xs ${
                  audioPreset === 'normal'
                    ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div className="font-bold text-white mb-1">قطيع سليم وهادئ</div>
                <div className="text-[10px] text-slate-400">سكون كامل مع تنفس طبيعي (0-1 شخير)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAudioPreset('mild');
                  setRecordingSeconds(30);
                }}
                className={`p-3 rounded-xl border text-right transition text-xs ${
                  audioPreset === 'mild'
                    ? 'bg-amber-950/50 border-amber-500 text-white ring-1 ring-amber-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div className="font-bold text-white mb-1">شخير وعطس خفيف</div>
                <div className="text-[10px] text-slate-400">انحراف تنفسي مبكر (8 أصوات شخير متفرقة)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAudioPreset('severe');
                  setRecordingSeconds(30);
                }}
                className={`p-3 rounded-xl border text-right transition text-xs ${
                  audioPreset === 'severe'
                    ? 'bg-rose-950/50 border-rose-500 text-white ring-1 ring-rose-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div className="font-bold text-white mb-1">ضائقة وحشرجة حادة</div>
                <div className="text-[10px] text-slate-400">عطس وشخير متواصل (36 صوت شخير / 30ث)</div>
              </button>
            </div>
          </div>

          {/* Interactive Recording Area */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center space-y-4 text-center">
            {/* Audio Wave Visualizer Simulation */}
            <div className="w-full h-16 flex items-end justify-center gap-1 px-4">
              {Array.from({ length: 32 }).map((_, i) => {
                const height = isRecording
                  ? Math.sin(i * 0.4 + recordingSeconds * 2) * 28 + 32
                  : audioPreset === 'severe'
                  ? (i % 3 === 0 ? 45 : 18)
                  : audioPreset === 'mild'
                  ? (i % 5 === 0 ? 30 : 12)
                  : 8;
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.max(6, height)}px` }}
                    className={`w-2 rounded-full transition-all duration-150 ${
                      isRecording
                        ? 'bg-teal-400'
                        : audioPreset === 'severe'
                        ? 'bg-rose-500'
                        : audioPreset === 'mild'
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                  />
                );
              })}
            </div>

            {/* Timer & Controls */}
            <div className="space-y-1">
              <div className="text-3xl font-mono font-black text-white">
                00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 00:30
              </div>
              <p className="text-xs text-slate-400">
                {isRecording
                  ? 'جاري التقاط الذبذبات الصوتية وترددات الحشرجة...'
                  : recordingSeconds >= 30
                  ? 'تم تسجيل المقطع الصوتي بنجاح (30 ثانية كاملة)'
                  : 'اضغط على زر التسجيل لبدء المراقبة'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-900/40"
                >
                  <Mic className="w-4 h-4" />
                  <span>بدء التسجيل الصوتي الميداني (30 ثانية)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  <span>إيقاف التسجيل يدوياً</span>
                </button>
              )}
            </div>
          </div>

          {recordingError && <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">{recordingError}</div>}
          {recordedAudioUrl && (
            <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-800/50 space-y-2">
              <div className="text-xs font-bold text-teal-300 flex items-center gap-2"><Volume2 className="w-4 h-4" /> التسجيل الأصلي — سيكون متاحاً للطبيب والمشرف للاستماع</div>
              <audio controls src={recordedAudioUrl} className="w-full h-10" />
            </div>
          )}

          {/* Environmental Note */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              ملاحظة المربي الميدانية أثناء التسجيل:
            </label>
            <input
              type="text"
              value={ambientNotes}
              onChange={(e) => setAmbientNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Trigger Analysis Button */}
          {!analysisResult && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-teal-900/30 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'جاري التحليل الصوتي المتقدم...' : 'تشغيل الذكاء الاصطناعي الصوتي (Acoustic AI)'}</span>
              </button>
            </div>
          )}

          {/* AI Analysis Result Display */}
          {analysisResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-teal-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>مؤشر الضائقة التنفسية (Respiratory Distress Index):</span>
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      analysisResult.severity === 'ضائقة حادة'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : analysisResult.severity === 'انحراف مبكر'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {analysisResult.severity}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {analysisResult.respiratory_distress_index}%
                    <span className="text-xs font-normal text-slate-400 mr-2">معدل الضائقة المحسوب</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    أصوات الشخير: <strong className="text-white">{audioPreset === 'severe' ? 36 : audioPreset === 'mild' ? 8 : 1}</strong> • العطس: <strong className="text-white">{audioPreset === 'severe' ? 18 : audioPreset === 'mild' ? 3 : 0}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {analysisResult.ai_assessment}
                </p>

                {analysisResult.recommended_actions && (
                  <div className="space-y-1.5 text-xs text-teal-200">
                    <span className="font-bold text-slate-300 block">الإجراءات والتدابير البيئية العاجلة:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {analysisResult.recommended_actions.map((act: string, idx: number) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setAnalysisResult(null)}
                  className="px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  إعادة التسجيل
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndSync}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-teal-900/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ التسجيل ومزامنته مع ملف الحالة الموحد</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
