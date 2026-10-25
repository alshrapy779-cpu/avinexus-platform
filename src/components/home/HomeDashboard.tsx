import React from 'react';
import { Activity, ArrowUpLeft, Bot, Building2, ClipboardList, HeartPulse, Home, PackageSearch, Settings2, ShieldCheck, ShoppingBag, Stethoscope, UserPlus, Users, MessageCircleMore, DollarSign, FileText, Settings, Sparkles, LayoutDashboard, Cpu, TrendingUp, AlertCircle } from 'lucide-react';
import { PlatformLogo } from '../brand/PlatformLogo';
import { APP_RELEASE_LABEL } from '../../config/appVersion';

interface Props {
  customerName?: string;
  farmCount: number;
  activeFlocks: number;
  pendingCases: number;
  pendingRegistrations: number;
  isOnline: boolean;
  onNavigate: (view: any) => void;
  onOpenAI: () => void;
  onRegisterCustomer: () => void;
  onOpenSettings: () => void;
}

export const HomeDashboard: React.FC<Props> = ({ customerName, farmCount, activeFlocks, pendingCases, pendingRegistrations, isOnline, onNavigate, onOpenAI, onRegisterCustomer, onOpenSettings }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans bg-slate-50 min-h-screen" dir="rtl">
      
      {/* 1. قسم الترحيب (Hero Section) */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              {isOnline ? 'الأنظمة متصلة' : 'غير متصل'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              مرحباً، {customerName || 'عميل المنصة'} 👋
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              أهلاً بك في مركز القيادة الخاص بك. إدارة شاملة للمزارع، الطوارئ البيطرية، السوق والتوريدات، مع تحليلات ذكية لاتخاذ قرارات دقيقة.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => onNavigate('farmer')} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm shadow-indigo-200">
              <LayoutDashboard className="w-5 h-5" /> دخول بوابة العمل
            </button>
            <button onClick={onOpenAI} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all duration-200 shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-500" /> المساعد الذكي
            </button>
            <button onClick={onRegisterCustomer} className="flex items-center gap-2 px-5 py-3 text-slate-500 hover:text-slate-900 font-medium transition-colors">
              <UserPlus className="w-5 h-5" /> تسجيل جديد
            </button>
          </div>
        </div>
      </section>

      {/* 2. الإحصائيات السريعة */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard icon={<Building2 />} color="blue" label="المزارع المسجلة" value={farmCount} />
        <MetricCard icon={<Activity />} color="emerald" label="القطعان النشطة" value={activeFlocks} />
        <MetricCard icon={<AlertCircle />} color="rose" label="حالات بيطرية معلقة" value={pendingCases} />
        <MetricCard icon={<ClipboardList />} color="amber" label="طلبات تسجيل جديدة" value={pendingRegistrations} />
      </section>

      {/* 3. أقسام المنصة */}
      <section className="space-y-6">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">مركز التحكم</h2>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">الوصول السريع لجميع أدواتك الإدارية والتشغيلية</p>
          </div>
          <button onClick={onOpenSettings} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-900 transition-all shadow-sm">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          <SectionCard icon={<Building2 />} title="العمل والمرابض" text="العزل، السجلات، العمل اليومي" onClick={() => onNavigate('managed')} />
          <SectionCard icon={<Stethoscope />} title="الاستشاري البيطري" text="التشخيص، التخدير والإشراف الطبي" onClick={() => onNavigate('vet')} />
          <SectionCard icon={<ShoppingBag />} title="السوق والتوريدات" text="البيع، الإعلانات والمجزورات" onClick={() => onNavigate('marketplace')} />
          <SectionCard icon={<MessageCircleMore />} title="التواصل الميداني" text="الطوارئ والاستشارات المباشرة" onClick={() => onNavigate('communications')} />
          <SectionCard icon={<DollarSign />} title="المالية والعقود" text="التمويل، الفواتير والتقارير المالية" onClick={() => onNavigate('finance')} />
          <SectionCard icon={<ShieldCheck />} title="الإدارة والقيادة" text="الصلاحيات، المراجعات، والحوكمة" onClick={() => onNavigate('admin')} />
          <SectionCard icon={<PackageSearch />} title="الجواز والتتبع" text="QR، الشهادات وسجل الدفعات" onClick={() => onNavigate('passport')} />
          <SectionCard icon={<Users />} title="العمالة والموظفين" text="الكوادر، الأداء والمكافآت" onClick={() => onNavigate('workers')} />
          <SectionCard icon={<FileText />} title="المزارع المتعاقدة" text="عقود الإيجار والعهود التشغيلية" onClick={() => onNavigate('contracts')} />
          <SectionCard icon={<Cpu />} title="المساعد الذكي" text="ذكاء اصطناعي لإدارة العمل الطبي" onClick={onOpenAI} isAI />
          <SectionCard icon={<Settings />} title="إعدادات النظام" text="الخصائص، المظهر وتجربة الاستخدام" onClick={onOpenSettings} />
        </div>
      </section>

      {/* التذييل */}
      <footer className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 text-slate-400 text-sm border-t border-slate-200 mt-8">
        <PlatformLogo className="w-6 h-6 opacity-50 grayscale" />
        <span className="font-medium">© {new Date().getFullYear()} AviNexus Poultry Enterprise.</span>
        <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-mono">{APP_RELEASE_LABEL}</span>
      </footer>
    </div>
  );
};

// --- المكونات الفرعية ---

const MetricCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: 'blue' | 'emerald' | 'rose' | 'amber' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="group bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl border ${colorMap[color]} transition-transform duration-300 group-hover:scale-110`}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
        <span className="text-3xl font-extrabold text-slate-900">{value.toLocaleString('ar-YE')}</span>
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
};

const SectionCard = ({ icon, title, text, onClick, isAI }: { icon: React.ReactNode, title: string, text: string, onClick: () => void, isAI?: boolean }) => (
  <button 
    onClick={onClick} 
    className={`group relative flex flex-col items-start p-6 rounded-2xl text-right w-full transition-all duration-300 border ${
      isAI 
        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300 hover:shadow-indigo-100 shadow-sm' 
        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
    }`}
  >
    <div className="w-full flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl transition-all duration-300 ${
        isAI 
          ? 'bg-indigo-100 text-indigo-600' 
          : 'bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
      }`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <ArrowUpLeft className={`w-5 h-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 ${isAI ? 'text-indigo-400' : 'text-slate-300 group-hover:text-indigo-600'}`} />
    </div>
    <h4 className={`text-base font-bold mb-1.5 transition-colors ${isAI ? 'text-indigo-900' : 'text-slate-900'}`}>{title}</h4>
    <p className={`text-sm leading-relaxed ${isAI ? 'text-indigo-700/70' : 'text-slate-500'}`}>{text}</p>
  </button>
);
