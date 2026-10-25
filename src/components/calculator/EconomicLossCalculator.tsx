import React, { useState } from 'react';
import { Calculator, TrendingDown, DollarSign, Scale, AlertOctagon, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Flock } from '../../types';

interface EconomicLossCalculatorProps {
  flocks: Flock[];
  onNavigateToFarmer: () => void;
}

export const EconomicLossCalculator: React.FC<EconomicLossCalculatorProps> = ({ flocks, onNavigateToFarmer }) => {
  const [flockCount, setFlockCount] = useState<number>(10000);
  const [actualFCR, setActualFCR] = useState<number>(1.78);
  const [standardFCR, setStandardFCR] = useState<number>(1.58);
  const [feedCostPerKgYER, setFeedCostPerKgYER] = useState<number>(850);
  const [averageBirdWeightKg, setAverageBirdWeightKg] = useState<number>(2.0);
  const [mortalityPercentage, setMortalityPercentage] = useState<number>(7.5);
  const [standardMortalityPercent, setStandardMortalityPercent] = useState<number>(3.5);
  const [blindAntibioticCostYER, setBlindAntibioticCostYER] = useState<number>(450000);

  // Calculations
  // Total Meat Produced (Live kg)
  const totalBirdsMarketed = Math.round(flockCount * (1 - mortalityPercentage / 100));
  const totalMeatKg = totalBirdsMarketed * averageBirdWeightKg;

  // 1. Loss from FCR Deviation (Feed Conversion Ratio)
  // Extra feed per kg meat = (Actual FCR - Standard FCR)
  const excessFeedKg = Math.max(0, (actualFCR - standardFCR) * totalMeatKg);
  const lossFromExcessFeedYER = Math.round(excessFeedKg * feedCostPerKgYER);

  // 2. Loss from Excess Mortality
  const excessMortalityBirds = Math.max(
    0,
    Math.round(flockCount * ((mortalityPercentage - standardMortalityPercent) / 100))
  );
  // Approx cost invested in each dead bird (chick + feed + electricity ~ 2,500 YER)
  const birdCostYER = 2800;
  const lossFromMortalityYER = excessMortalityBirds * birdCostYER;

  // 3. Loss from Blind Medication / Cocktails
  const lossFromWastedMedsYER = blindAntibioticCostYER;

  // Total Losses
  const totalLossYER = lossFromExcessFeedYER + lossFromMortalityYER + lossFromWastedMedsYER;
  const totalBagsOfFeedWasted = Math.round(excessFeedKg / 50); // 50kg per bag

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">حاسبة الهدر والخسائر الاقتصادية بالريال اليمني</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                Economic Loss Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              نموذج تحليلي لقياس الخسائر الصامتة الناتجة عن العشوائية في استهلاك العلف، كوكتيل الأدوية، والنفوق الزائد
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <TrendingDown className="w-4 h-4 text-rose-400" />
          <span>كل 0.1 زيادة في معامل التحويل تهدر ملايين الريالات</span>
        </div>
      </div>

      {/* Official SRS v1.0 Mathematical Model Banner */}
      <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>النموذج الرياضي للهدر الاقتصادي (SRS v1.0 - Section 8.3):</strong>
          </span>
        </div>
        <div className="font-mono text-amber-300 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center text-[11px] sm:text-xs">
          L_daily = ((FCR_actual - FCR_std) × Total_Weight_kg × Feed_Price/kg) + (Mortality_excess × Chick_Value)
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Sliders & Fields */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>بيانات ومعايير الدورة الإنتاجية:</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Flock Size */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>حجم القطيع المدخل (عدد الطيور):</span>
                <strong className="text-white font-mono">{flockCount.toLocaleString('ar-YE')} طير</strong>
              </div>
              <input
                type="range"
                min={2000}
                max={50000}
                step={1000}
                value={flockCount}
                onChange={(e) => setFlockCount(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Actual FCR vs Standard */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">معامل التحويل الفعلي (FCR):</label>
                <input
                  type="number"
                  step="0.01"
                  value={actualFCR}
                  onChange={(e) => setActualFCR(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">معيار السلالة القياسي (Ross/Cobb):</label>
                <input
                  type="number"
                  step="0.01"
                  value={standardFCR}
                  onChange={(e) => setStandardFCR(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Average Market Weight */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>متوسط وزن الطير عند التسويق (كغم):</span>
                <strong className="text-white font-mono">{averageBirdWeightKg} كغم</strong>
              </div>
              <input
                type="range"
                min={1.5}
                max={2.8}
                step={0.1}
                value={averageBirdWeightKg}
                onChange={(e) => setAverageBirdWeightKg(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Feed Cost in Yemeni Rials */}
            <div>
              <label className="text-slate-300 block mb-1">سعر كيس أو كيلو العلف بالريال اليمني (YER/kg):</label>
              <input
                type="number"
                step="20"
                value={feedCostPerKgYER}
                onChange={(e) => setFeedCostPerKgYER(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                كيس العلف 50 كجم = {(feedCostPerKgYER * 50).toLocaleString('ar-YE')} ريال يمني تقريباً
              </span>
            </div>

            {/* Mortality Rate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">نسبة النفوق الفعلية (%):</label>
                <input
                  type="number"
                  step="0.5"
                  value={mortalityPercentage}
                  onChange={(e) => setMortalityPercentage(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">نسبة النفوق الطبيعية القياسية (%):</label>
                <input
                  type="number"
                  step="0.5"
                  value={standardMortalityPercent}
                  onChange={(e) => setStandardMortalityPercent(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Blind Antibiotic Costs */}
            <div>
              <label className="text-slate-300 block mb-1">
                تكلفة الأدوية والمضادات العشوائية المصروفة دون فحص حساسية (ريال يمني):
              </label>
              <input
                type="number"
                step="25000"
                value={blindAntibioticCostYER}
                onChange={(e) => setBlindAntibioticCostYER(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Detailed Economic Losses Summary */}
        <div className="lg:col-span-6 space-y-5">
          {/* Total Massive Losses Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-amber-950/30 border-2 border-rose-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                <span>إجمالي الخسائر المالية التقديرية بالدورة الواحدة:</span>
              </span>
              <span className="text-[11px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold border border-rose-500/30">
                هدر صامت يمكن تلافيه
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-white">
              {totalLossYER.toLocaleString('ar-YE')}{' '}
              <span className="text-sm font-normal text-slate-400">ريال يمني</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              هذا المبلغ كان من الممكن توفيره بالكامل كصافي أرباح للمربي عند تطبيق بروتوكول منصة السيادة البيطرية:
              ضبط منحنى العلف + قفل المضادات العشوائية + الأمان الحيوي.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">أكياس علف مهدورة</span>
                <strong className="text-base font-black text-amber-400">{totalBagsOfFeedWasted} كيس</strong>
                <span className="text-[10px] text-slate-500 block">({excessFeedKg.toLocaleString('ar-YE')} كغم)</span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">طيور نافقة زائدة</span>
                <strong className="text-base font-black text-rose-400">{excessMortalityBirds.toLocaleString('ar-YE')} طير</strong>
                <span className="text-[10px] text-slate-500 block">بسبب تأخر التشخيص المبكر</span>
              </div>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-200">تفصيل مصادر الهدر المالي:</h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">1. هدر انحراف معامل التحويل الغذائي (FCR):</span>
                  <span className="text-[11px] text-slate-400">
                    فرق {(actualFCR - standardFCR).toFixed(2)} في معامل التحويل على {totalMeatKg.toLocaleString('ar-YE')} كغم لحم
                  </span>
                </div>
                <strong className="text-amber-400 font-mono text-sm shrink-0">
                  {lossFromExcessFeedYER.toLocaleString('ar-YE')} ريال
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">2. خسائر النفوق الزائد عن المعدل القياسي:</span>
                  <span className="text-[11px] text-slate-400">
                    {excessMortalityBirds} طير نافق إضافي مع العلف المستهلك قبل النفوق
                  </span>
                </div>
                <strong className="text-rose-400 font-mono text-sm shrink-0">
                  {lossFromMortalityYER.toLocaleString('ar-YE')} ريال
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">3. هدر الأدوية والمضادات العشوائية المهدورة:</span>
                  <span className="text-[11px] text-slate-400">
                    تكلفة علاجات غير مستندة لفحص حساسية مخبري
                  </span>
                </div>
                <strong className="text-cyan-400 font-mono text-sm shrink-0">
                  {lossFromWastedMedsYER.toLocaleString('ar-YE')} ريال
                </strong>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onNavigateToFarmer}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ابدأ الآن بتسجيل قطيعك وتطبيق المعايير العلمية لتوفير هذا الهدر</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
