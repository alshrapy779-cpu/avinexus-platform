import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Syringe,
  Droplet,
  Eye,
  Wind,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Thermometer,
  Search,
  BookOpen,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { VaccineProtocolItem, VaccineRoute } from '../../types';

interface VaccineProtocolViewProps {
  protocols: VaccineProtocolItem[];
  flockAgeDays?: number;
}

export const VaccineProtocolView: React.FC<VaccineProtocolViewProps> = ({
  protocols,
  flockAgeDays = 12
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineProtocolItem>(protocols[0]);

  const filteredProtocols = protocols.filter((p) => {
    const matchSearch =
      p.vaccine_name_strain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.disease_targeted.includes(searchQuery) ||
      p.manufacturer_country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRoute = selectedRoute === 'all' || p.administration_route === selectedRoute;
    return matchSearch && matchRoute;
  });

  const getRouteIcon = (route: VaccineRoute) => {
    switch (route) {
      case 'تقطير بالعين':
        return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'ماء شرب':
        return <Droplet className="w-4 h-4 text-blue-400" />;
      case 'رش':
        return <Wind className="w-4 h-4 text-emerald-400" />;
      case 'حقن':
        return <Syringe className="w-4 h-4 text-rose-400" />;
      default:
        return <Droplet className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                البروتوكول الوطني المحدث للقاحات الدواجن
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
                Vaccination Protocol Module
              </span>
            </div>
            <h2 className="text-xl font-black text-white">
              جدول التحصينات الميدانية والوقاية الحيوية لقطعان التسمين
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              تحديد دقيق للعترات المعتمدة وطرق التطبيق بحسب العمر اليومي، لمنع الفشل المناعي الناتج عن أخطاء حفظ اللقاح أو تفاعل الكلور أو التوقيت الخاطئ.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 text-xs text-indigo-300 space-y-1 shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>عمر القطيع النموذجي للمقارنة:</span>
              <strong className="text-white font-mono">{flockAgeDays} يوماً</strong>
            </div>
            <span className="text-[11px] text-slate-400 block">
              التحصين القادم المستحق: <strong>النيوكاسل التنشيطي (اليوم 14)</strong>
            </span>
          </div>
        </div>

        {/* Visual Age Timeline Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>الخط الزمني لتحصينات الدورة (من عمر 1 يوم إلى التسويق):</span>
            <span className="font-mono text-indigo-400 font-bold">Cycle 1 - 35 Days</span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {protocols.map((p) => {
              const isDue = p.recommended_age_days <= flockAgeDays;
              const isNext = p.recommended_age_days > flockAgeDays && p.recommended_age_days <= flockAgeDays + 3;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedVaccine(p)}
                  className={`p-2.5 rounded-xl border text-center transition space-y-1 ${
                    selectedVaccine.id === p.id
                      ? 'bg-indigo-950 border-indigo-400 text-white shadow-lg ring-1 ring-indigo-400/40'
                      : isNext
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 animate-pulse'
                      : isDue
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-mono block">عمر {p.recommended_age_days} يوم</span>
                  <strong className="text-xs block truncate">{p.disease_targeted.split(' ')[0]}</strong>
                  <span className="text-[10px] block opacity-80">{p.administration_route}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Vaccines */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="بحث باللقاح، العترة أو المرض..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-slate-400 text-[11px] whitespace-nowrap">طريقة التطبيق:</span>
              {['all', 'ماء شرب', 'تقطير بالعين', 'حقن', 'رش'].map((rt) => (
                <button
                  key={rt}
                  onClick={() => setSelectedRoute(rt)}
                  className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap ${
                    selectedRoute === rt
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {rt === 'all' ? 'الكل' : rt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredProtocols.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedVaccine(p)}
                className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                  selectedVaccine.id === p.id
                    ? 'bg-slate-900 border-indigo-500 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {p.image_url ? <img src={p.image_url} alt={p.vaccine_name_strain} className="w-20 h-20 object-contain bg-white rounded-2xl border border-slate-700 p-2 shrink-0 shadow-lg" /> : <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">{getRouteIcon(p.administration_route)}</div>}
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">{p.vaccine_name_strain}</h4>
                      <span className="text-[11px] text-indigo-400 block">{p.disease_targeted}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold bg-slate-950 px-2 py-0.5 rounded-lg text-emerald-400 border border-slate-800">
                    اليوم {p.recommended_age_days}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>طريقة: {p.administration_route}</span>
                  <span className="text-slate-300 font-mono font-bold">
                    {p.price_dose_vial_yer.toLocaleString()} ريال / أمبول
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Card for Selected Vaccine */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              {selectedVaccine.image_url && <img src={selectedVaccine.image_url} alt={selectedVaccine.vaccine_name_strain} className="w-28 h-28 object-contain bg-white rounded-2xl border border-slate-700 p-2 shrink-0 shadow-xl" />}
              <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedVaccine.vaccine_name_strain}</h3>
                {selectedVaccine.mandatory_national && (
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-bold">
                    إلزامي وطنياً
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-300 mt-0.5">{selectedVaccine.disease_targeted}</p>
              </div>
            </div>

            <div className="text-left">
              <span className="text-slate-400 text-[11px] block">سعر الأمبول (1000 جرعة):</span>
              <strong className="text-emerald-400 font-mono text-lg font-bold">
                {selectedVaccine.price_dose_vial_yer.toLocaleString()} <span className="text-xs">ريال يمني</span>
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-center">
              <span className="text-slate-400 text-[11px] block">العمر المستهدف:</span>
              <strong className="text-white font-mono text-sm block">اليوم {selectedVaccine.recommended_age_days}</strong>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-center">
              <span className="text-slate-400 text-[11px] block">طريقة التطبيق:</span>
              <strong className="text-cyan-400 text-sm block">{selectedVaccine.administration_route}</strong>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-center">
              <span className="text-slate-400 text-[11px] block">حرارة الحفظ المعتمدة:</span>
              <strong className="text-amber-400 font-mono text-sm block">{selectedVaccine.temperature_storage_celsius}</strong>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>بيانات الشركة المصنعة وسلسلة التبريد (Cold-Chain):</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              المصنع والبلد: <strong className="text-white">{selectedVaccine.manufacturer_country}</strong>. يجب نقل اللقاح في صناديق ثلج معزولة والتأكد من عدم تعرضه للشمس المباشرة أو التجميد للقاحات الزيتية الميتة.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-rose-950/30 border border-rose-800/60 rounded-2xl text-xs text-rose-200">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>محاذير واحتياطات حرجة للتطبيق الميداني:</span>
            </div>
            <p className="leading-relaxed">{selectedVaccine.critical_precautions}</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>مسجل ومعتمد في دليل الهيئة العامة للثروة الحيوانية</span>
            </div>
            <span className="text-emerald-400 font-bold">Batch Verified ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
