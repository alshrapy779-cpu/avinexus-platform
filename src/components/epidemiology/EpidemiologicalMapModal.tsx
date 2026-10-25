import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  MapPin,
  ShieldAlert,
  Send,
  CheckCircle2,
  X,
  Building,
  Activity,
  Flame,
  Volume2,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { EpidemiologicalOutbreak, Farm } from '../../types';

interface EpidemiologicalMapModalProps {
  outbreaks: EpidemiologicalOutbreak[];
  farms: Farm[];
  onClose: () => void;
  onBroadcastAlert: (outbreakId: string) => void;
}

export const EpidemiologicalMapModal: React.FC<EpidemiologicalMapModalProps> = ({
  outbreaks,
  farms,
  onClose,
  onBroadcastAlert
}) => {
  const [selectedOutbreakId, setSelectedOutbreakId] = useState<string>(outbreaks[0]?.id || '');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [broadcastedIds, setBroadcastedIds] = useState<Record<string, boolean>>({
    'outbreak-01': true,
    'outbreak-02': true
  });
  const [broadcastSuccessMessage, setBroadcastSuccessMessage] = useState<string | null>(null);

  const selectedOutbreak = outbreaks.find((o) => o.id === selectedOutbreakId) || outbreaks[0];

  const handleBroadcast = (id: string) => {
    setBroadcastedIds((prev) => ({ ...prev, [id]: true }));
    onBroadcastAlert(id);
    setBroadcastSuccessMessage(
      `تم إرسال نداء الاستغاثة والإنذار الوبائي عبر منظومة الرسائل النصية القصيرة (SMS) إلى 48 مزرعة في نطاق ${selectedOutbreak?.governorate} بنجاح!`
    );
    setTimeout(() => {
      setBroadcastSuccessMessage(null);
    }, 5000);
  };

  const filteredOutbreaks = outbreaks.filter((o) => {
    if (selectedGovernorate === 'الكل') return true;
    return o.governorate === selectedGovernorate;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-amber-950/80 p-4 border-b border-rose-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">رادار الإنذار المبكر للأوبئة وبؤر التفشي</h3>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  GIS Epidemiological Radar
                </span>
              </div>
              <p className="text-xs text-slate-400">
                منظومة الرصد البيطري الوطني للمحافظات اليمنية • الحجر الصحي وأطواق الحماية الدائرية
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

        {/* Broadcast Toast Notification */}
        {broadcastSuccessMessage && (
          <div className="bg-emerald-900/90 border-b border-emerald-500 text-emerald-200 px-4 py-2.5 text-xs flex items-center gap-2 animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{broadcastSuccessMessage}</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Radar Map Visualizer & Zones (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Map Representation Container */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-white">الخارطة التفاعلية لبؤر الأوبئة في اليمن</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    بؤرة تفشي نشطة
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    منطقة اشتباه 5-10km
                  </span>
                </div>
              </div>

              {/* Geographic Schematic Visualizer */}
              <div className="h-64 sm:h-72 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl relative border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
                {/* Visual Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>

                {/* Simulated Radar Sweep */}
                <div className="absolute w-72 h-72 rounded-full border border-rose-500/20 animate-spin-slow pointer-events-none"></div>

                {/* Governorates & Outbreak Hotspots */}
                <div className="relative w-full h-full">
                  {/* Sana'a Hotspot */}
                  <button
                    onClick={() => setSelectedOutbreakId('outbreak-02')}
                    className={`absolute top-1/4 left-1/2 -translate-x-1/2 p-2 rounded-xl transition flex flex-col items-center gap-1 group ${
                      selectedOutbreakId === 'outbreak-02' ? 'scale-110 z-20' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-900/50">
                        <Flame className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="absolute -inset-2 rounded-full border border-amber-400/40 animate-ping"></div>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                      صنعاء (بني حشيش) • نيوكاسل
                    </span>
                  </button>

                  {/* Dhamar Hotspot */}
                  <button
                    onClick={() => setSelectedOutbreakId('outbreak-01')}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 p-2 rounded-xl transition flex flex-col items-center gap-1 group ${
                      selectedOutbreakId === 'outbreak-01' ? 'scale-110 z-20' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-rose-600/40 border-2 border-rose-500 flex items-center justify-center text-rose-300 shadow-xl shadow-rose-900/80">
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      </div>
                      <div className="absolute -inset-3 rounded-full border-2 border-rose-500/50 animate-ping"></div>
                      <div className="absolute -inset-6 rounded-full border border-rose-500/20"></div>
                    </div>
                    <span className="text-[10px] font-black text-rose-200 bg-rose-950/90 px-2.5 py-0.5 rounded border border-rose-500">
                      ذمار (قاع جهران) • تفشي جمبورو
                    </span>
                  </button>

                  {/* Ibb Hotspot */}
                  <button
                    onClick={() => setSelectedOutbreakId('outbreak-03')}
                    className={`absolute bottom-6 left-1/3 p-2 rounded-xl transition flex flex-col items-center gap-1 group ${
                      selectedOutbreakId === 'outbreak-03' ? 'scale-110 z-20' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-teal-500/30 border-2 border-teal-400 flex items-center justify-center text-teal-300 shadow-md">
                        <Activity className="w-3.5 h-3.5 text-teal-400" />
                      </div>
                      <div className="absolute -inset-1.5 rounded-full border border-teal-400/40"></div>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded border border-teal-500/40">
                      إب (وادي السحول) • IBV
                    </span>
                  </button>

                  {/* Registered Safe Farms Overlay */}
                  {farms.map((farm, idx) => (
                    <div
                      key={farm.id}
                      className="absolute hidden sm:flex items-center gap-1 text-[9px] text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800"
                      style={{
                        top: idx === 0 ? '20%' : idx === 1 ? '58%' : '75%',
                        right: idx === 0 ? '15%' : idx === 1 ? '18%' : '20%'
                      }}
                    >
                      <Building className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{farm.name.slice(0, 18)}...</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radius Key */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-slate-900 border border-rose-500/30">
                  <span className="text-slate-400 block">بؤرة الإصابة (المركز):</span>
                  <strong className="text-rose-400">1 كم إغلاق تام</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/30">
                  <span className="text-slate-400 block">طوق الحجر المشدد:</span>
                  <strong className="text-amber-400">3 - 5 كم حظر النقل</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-teal-500/30">
                  <span className="text-slate-400 block">منطقة الرصد الحيوي:</span>
                  <strong className="text-teal-400">10 كم فحص عينات</strong>
                </div>
              </div>
            </div>

            {/* Outbreaks Quick Selector List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300">قائمة البؤر المرصودة حالياً في الميدان:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {outbreaks.map((outbreak) => (
                  <button
                    key={outbreak.id}
                    onClick={() => setSelectedOutbreakId(outbreak.id)}
                    className={`p-3 rounded-xl border text-right transition ${
                      selectedOutbreakId === outbreak.id
                        ? 'bg-rose-950/50 border-rose-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-black truncate text-white">{outbreak.disease_name_ar}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {outbreak.governorate} • {outbreak.district}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-rose-400 font-bold">{outbreak.mortality_rate_percent}% نفوق</span>
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                        {outbreak.quarantine_radius_km} كم حظر
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Outbreak Detailed Profile & Action Protocol (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-rose-400 font-mono tracking-wider uppercase">
                    تفاصيل بؤرة التفشي المحددة
                  </span>
                  <h4 className="text-sm font-black text-white">{selectedOutbreak.disease_name_ar}</h4>
                  <div className="text-[11px] text-slate-400">{selectedOutbreak.disease_name}</div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                    selectedOutbreak.severity.includes('حرج')
                      ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}
                >
                  {selectedOutbreak.severity}
                </span>
              </div>

              {/* Geographic & Vital Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">المحافظة والمنطقة:</span>
                  <strong className="text-white">
                    {selectedOutbreak.governorate} ({selectedOutbreak.district})
                  </strong>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">المزارع المتأثرة:</span>
                  <strong className="text-rose-400">{selectedOutbreak.affected_farms_count} عنابر نشطة</strong>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">نسبة النفوق الحقلية:</span>
                  <strong className="text-rose-400">{selectedOutbreak.mortality_rate_percent}% من القطيع</strong>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">نصف قطر الحجر:</span>
                  <strong className="text-amber-400">{selectedOutbreak.quarantine_radius_km} كم مربع</strong>
                </div>
              </div>

              {/* Mandatory Emergency Measures Recommended by the veterinary advisory team */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>الإجراءات البيطرية الإلزامية للسيطرة على البؤرة:</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {selectedOutbreak.emergency_measures.map((measure, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                      <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Broadcast Alert Button */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => handleBroadcast(selectedOutbreak.id)}
                  disabled={broadcastedIds[selectedOutbreak.id]}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                    broadcastedIds[selectedOutbreak.id]
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-900/40'
                  }`}
                >
                  {broadcastedIds[selectedOutbreak.id] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>تم بث الإنذار لجميع مزارع المنطقة بنجاح</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>بث إنذار طوارئ SMS لكافة المزارع في نطاق {selectedOutbreak.quarantine_radius_km} كم</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-500 text-center">
                  يقوم النظام بإرسال تحذيرات فورية عبر شبكات يمن موبايل وسبأفون ويوفق مواعيد إدخال الأفواج في المنطقة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>بيانات الوبائيات معتمدة تحت إشراف: الطبيب البيطري الاستشاري المعتمد</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            إغلاق الرادار
          </button>
        </div>
      </div>
    </div>
  );
};
