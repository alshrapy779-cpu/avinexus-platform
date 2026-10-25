import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  PieChart,
  Layers,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { PlatformFinancialConfig, FinancialTransaction } from '../../types';

interface RevenueMarginEngineTabProps {
  config: PlatformFinancialConfig;
  onUpdateConfig: (updated: PlatformFinancialConfig) => void;
}

export const RevenueMarginEngineTab: React.FC<RevenueMarginEngineTabProps> = ({
  config,
  onUpdateConfig
}) => {
  const [activeSubView, setActiveSubView] = useState<'commission_setup' | 'gross_revenue' | 'net_profit' | 'digital_ledger'>('commission_setup');
  const [filterLedger, setFilterLedger] = useState<string>('all');
  const [saveBanner, setSaveBanner] = useState<boolean>(false);

  // Commission controls state
  const handleSliderChange = (field: keyof PlatformFinancialConfig, value: number) => {
    const updated = { ...config, [field]: value };
    // Dynamic recalculation of platform net profit
    const grossTotal = updated.total_gross_volume_yer;
    const estProfit =
      (updated.monthly_gross_breakdown.medicines * (updated.medicine_profit_mode === 'percent' ? updated.marketplace_sales_commission_percent / 100 : 0.08)) +
      (updated.monthly_gross_breakdown.feeds * (updated.marketplace_sales_commission_percent / 100)) +
      (updated.monthly_gross_breakdown.equipment * (updated.marketplace_sales_commission_percent / 100)) +
      (updated.monthly_gross_breakdown.rentals * (updated.rental_brokerage_commission_percent / 100)) +
      (updated.monthly_gross_breakdown.consultations * (updated.vet_consultation_commission_percent / 100));

    updated.total_platform_net_profit_yer = Math.round(estProfit);
    onUpdateConfig(updated);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const handleProfitModeToggle = (mode: 'percent' | 'fixed') => {
    onUpdateConfig({ ...config, medicine_profit_mode: mode });
  };

  const filteredTransactions = config.transactions.filter((tx) => {
    if (filterLedger === 'all') return true;
    if (filterLedger === 'completed') return tx.status === 'مكتمل';
    if (filterLedger === 'due_company') return tx.status === 'مستحق للشركة';
    if (filterLedger === 'pending') return tx.status === 'معلق';
    return true;
  });

  const totalPlatformCommissions = config.transactions.reduce((sum, tx) => sum + tx.platform_commission_yer, 0);
  const totalGrossTransactions = config.transactions.reduce((sum, tx) => sum + tx.gross_amount_yer, 0);

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubView('commission_setup')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubView === 'commission_setup'
                ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-900/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>ضبط نسب العمولات والأرباح</span>
          </button>

          <button
            onClick={() => setActiveSubView('gross_revenue')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubView === 'gross_revenue'
                ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-900/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>إجمالي المبيعات (Gross Revenue)</span>
          </button>

          <button
            onClick={() => setActiveSubView('net_profit')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubView === 'net_profit'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>صافي أرباحك (Owner Net Profit)</span>
          </button>

          <button
            onClick={() => setActiveSubView('digital_ledger')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubView === 'digital_ledger'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>محفظة النظام الرقمية والدفعات</span>
          </button>
        </div>

        {saveBanner && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تم تحديث نسب العمولات والأرباح تلقائياً</span>
          </div>
        )}
      </div>

      {/* VIEW 1: Commission Setup */}
      {activeSubView === 'commission_setup' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Meds & Equipment Commission */}
            <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">أرباح الأدوية والمعدات</span>
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                  {config.medicine_profit_mode === 'percent'
                    ? `${config.marketplace_sales_commission_percent}%`
                    : `${config.medicine_profit_fixed_amount_yer.toLocaleString()} ريال`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تحديد نسبة مئوية أو ربح ثابت مقطوع لكل عبوة دواء أو قطعة معدات مباعة عبر المنصة.
              </p>

              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleProfitModeToggle('percent')}
                  className={`flex-1 py-1 rounded-lg transition font-medium ${
                    config.medicine_profit_mode === 'percent' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  نسبة مئوية (%)
                </button>
                <button
                  type="button"
                  onClick={() => handleProfitModeToggle('fixed')}
                  className={`flex-1 py-1 rounded-lg transition font-medium ${
                    config.medicine_profit_mode === 'fixed' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  مبلغ مقطوع (ريال)
                </button>
              </div>

              {config.medicine_profit_mode === 'percent' ? (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={0.5}
                    value={config.marketplace_sales_commission_percent}
                    onChange={(e) => handleSliderChange('marketplace_sales_commission_percent', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1%</span>
                    <span>7.5%</span>
                    <span>15%</span>
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={config.medicine_profit_fixed_amount_yer}
                      onChange={(e) => handleSliderChange('medicine_profit_fixed_amount_yer', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:border-amber-500 outline-none"
                    />
                    <span className="text-xs text-slate-400 shrink-0">ريال/عبوة</span>
                  </div>
                </div>
              )}
            </div>

            {/* Feeds Commission Setup */}
            <div className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 space-y-3 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">عمولة مبيعات الأعلاف</span>
                <span className="text-xs font-mono font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded">
                  {config.feed_profit_per_ton_yer.toLocaleString()} ريال/طن
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ربح المدير المحصل من مطاحن الأعلاف لكل كيس (50 كجم) أو لكل طن مباع للمزارع.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">لكل كيس 50 كجم:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={config.feed_profit_per_bag_yer}
                      onChange={(e) => handleSliderChange('feed_profit_per_bag_yer', Number(e.target.value))}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center outline-none focus:border-teal-500"
                    />
                    <span className="text-[10px] text-slate-400">ريال</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">لكل طن (20 كيس):</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={config.feed_profit_per_ton_yer}
                      onChange={(e) => handleSliderChange('feed_profit_per_ton_yer', Number(e.target.value))}
                      className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center outline-none focus:border-teal-500"
                    />
                    <span className="text-[10px] text-slate-400">ريال</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Brokerage Commission */}
            <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 space-y-3 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">عمولة وساطة تأجير الهناجر</span>
                <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded">
                  {config.rental_brokerage_commission_percent}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                اقتطاع نسبة المنصة من إجمالي عقد تأجير المزرعة أو الهنجر لتوثيق العقد وضمان الأمان.
              </p>

              <div className="space-y-1.5 pt-2">
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={config.rental_brokerage_commission_percent}
                  onChange={(e) => handleSliderChange('rental_brokerage_commission_percent', Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1%</span>
                  <span>4%</span>
                  <span>8%</span>
                </div>
              </div>
            </div>

            {/* Vet Consultation Commission */}
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">رسوم الاستشارات البيطرية</span>
                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {config.vet_consultation_commission_percent}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                اقتطاع تلقائي من أتعاب الطبيب الاستشاري لقاء استخدام المنظومة الذكية والتوأم الرقمي.
              </p>

              <div className="space-y-1.5 pt-2">
                <input
                  type="range"
                  min={2}
                  max={25}
                  step={0.5}
                  value={config.vet_consultation_commission_percent}
                  onChange={(e) => handleSliderChange('vet_consultation_commission_percent', Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>2%</span>
                  <span>12.5%</span>
                  <span>25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Gross Revenue */}
      {activeSubView === 'gross_revenue' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>حركة المبيعات الإجمالية الوطنية (Gross Revenue)</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    شهرياً
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  حجم السيولة النقدية المتداولة عبر قطاعات الأدوية، الأعلاف، المعدات، التأجير، والاستشارات.
                </p>
              </div>

              <div className="text-left">
                <div className="text-xs text-slate-400">إجمالي التداول الشهري</div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {config.total_gross_volume_yer.toLocaleString()} <span className="text-xs font-sans text-slate-300">ريال يمني</span>
                </div>
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>مبيعات الأعلاف</span>
                  <span className="text-teal-400 font-bold">45.5%</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {config.monthly_gross_breakdown.feeds.toLocaleString()}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-[45.5%]" />
                </div>
                <span className="text-[10px] text-slate-500">توريد مطاحن وصوامع</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>الأدوية والعلاجات</span>
                  <span className="text-amber-400 font-bold">21.7%</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {config.monthly_gross_breakdown.medicines.toLocaleString()}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[21.7%]" />
                </div>
                <span className="text-[10px] text-slate-500">عبر الوكلاء والشركات</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>وساطة تأجير الهناجر</span>
                  <span className="text-indigo-400 font-bold">15.0%</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {config.monthly_gross_breakdown.rentals.toLocaleString()}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[15%]" />
                </div>
                <span className="text-[10px] text-slate-500">عقود دورات موسمية</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>معدات المزارع</span>
                  <span className="text-cyan-400 font-bold">9.5%</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {config.monthly_gross_breakdown.equipment.toLocaleString()}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[9.5%]" />
                </div>
                <span className="text-[10px] text-slate-500">دفايات ولوحات وشفاطات</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>الاستشارات البيطرية</span>
                  <span className="text-emerald-400 font-bold">8.3%</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {config.monthly_gross_breakdown.consultations.toLocaleString()}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[8.3%]" />
                </div>
                <span className="text-[10px] text-slate-500">روشتات وتشخيصات معتمدة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Owner Net Profit */}
      {activeSubView === 'net_profit' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  شاشة صافي أرباحك الحقيقية (Owner Net Profit)
                </span>
                <h3 className="text-2xl font-black text-white">
                  {config.total_platform_net_profit_yer.toLocaleString()} <span className="text-sm font-normal text-slate-300">ريال يمني صافي</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  هذا هو العائد الصافي لمدير المنظومة بعد خصم المبالغ المستحقة للشركات الموردة وأتعاب الأطباء البيطريين وتكاليف السيرفرات السحابية.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 text-center min-w-[200px]">
                <div className="text-[11px] text-slate-400">هامش ربح المنظومة الإجمالي</div>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                  {((config.total_platform_net_profit_yer / config.total_gross_volume_yer) * 100).toFixed(2)}%
                </div>
                <div className="text-[10px] text-emerald-300 mt-1">عائد ممتاز ومستدام</div>
              </div>
            </div>

            {/* Revenue Stream Contributions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300">تفصيل مصادر صافي أرباح المدير:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">أرباح الأعلاف:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {Math.round(config.monthly_gross_breakdown.feeds * 0.05).toLocaleString()} ريال
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">أرباح الأدوية:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {Math.round(config.monthly_gross_breakdown.medicines * (config.marketplace_sales_commission_percent / 100)).toLocaleString()} ريال
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">أرباح الاستشارات البيطرية:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {Math.round(config.monthly_gross_breakdown.consultations * (config.vet_consultation_commission_percent / 100)).toLocaleString()} ريال
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">أرباح وساطة الهناجر:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {Math.round(config.monthly_gross_breakdown.rentals * (config.rental_brokerage_commission_percent / 100)).toLocaleString()} ريال
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: Digital Ledger & Wallet */}
      {activeSubView === 'digital_ledger' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-indigo-400" />
                  <span>محفظة النظام الرقمية (Digital Ledger)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تتبع الفواتير المعتمدة، الدفعات المستلمة، والمبالغ الجاري تصفيتها للشركات والأطباء.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">حالة المعاملة:</span>
                <select
                  value={filterLedger}
                  onChange={(e) => setFilterLedger(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
                >
                  <option value="all">كافة المعاملات ({config.transactions.length})</option>
                  <option value="completed">مكتمل ومحصل</option>
                  <option value="due_company">مستحق للشركات</option>
                  <option value="pending">معلق</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2.5 px-3">رقم المرجع</th>
                    <th className="py-2.5 px-3">التاريخ</th>
                    <th className="py-2.5 px-3">نوع الحركة</th>
                    <th className="py-2.5 px-3">الطرف / المنشأة</th>
                    <th className="py-2.5 px-3">الجهة الموردة</th>
                    <th className="py-2.5 px-3">إجمالي القيمة</th>
                    <th className="py-2.5 px-3">عمولة المنصة</th>
                    <th className="py-2.5 px-3">حالة السداد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-slate-400">{tx.reference_id || tx.id}</td>
                      <td className="py-3 px-3 text-slate-300">{tx.date}</td>
                      <td className="py-3 px-3 font-sans font-medium text-white">{tx.type}</td>
                      <td className="py-3 px-3 font-sans text-slate-300">{tx.farm_or_user_name}</td>
                      <td className="py-3 px-3 font-sans text-slate-400">{tx.company_name || '—'}</td>
                      <td className="py-3 px-3 text-slate-200">{tx.gross_amount_yer.toLocaleString()} ريال</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">
                        +{tx.platform_commission_yer.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'مكتمل'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : tx.status === 'مستحق للشركة'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
