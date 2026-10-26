import React from 'react';
import { Activity, ArrowUpLeft, Bot, Building2, ClipboardList, HeartPulse, Home, PackageSearch, Settings2, ShieldCheck, ShoppingBag, Stethoscope, UserPlus, Users, MessageCircleMore, DollarSign } from 'lucide-react';
import { AppView } from '../Header';
import { PlatformLogo } from '../brand/PlatformLogo';
import { APP_RELEASE_LABEL } from '../../config/appVersion';

interface Props {
  customerName?: string;
  farmCount: number;
  activeFlocks: number;
  pendingCases: number;
  pendingRegistrations: number;
  isOnline: boolean;
  onNavigate: (view: AppView) => void;
  onOpenAI: () => void;
  onRegisterCustomer: () => void;
  onOpenSettings: () => void;
  onRegisterUser?: () => void;
  onOpenRegistrationApprovals?: () => void;
}

export const HomeDashboard: React.FC<Props> = ({ customerName, farmCount, activeFlocks, pendingCases, pendingRegistrations, isOnline, onNavigate, onOpenAI, onRegisterCustomer, onOpenSettings, onRegisterUser, onOpenRegistrationApprovals }) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5" dir="rtl">
      <section className="spp-welcome-hero">
        <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-black mb-2"><span className={`w-2 h-2 rounded-full ${isOnline?'bg-emerald-400':'bg-amber-400'}`}/>{isOnline?'المنصة متصلة وجاهزة للعمل':'وضع العمل دون اتصال مفعّل'}</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">مركز إدارة المنصة{customerName ? ` • ${customerName}` : ''}</h2>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-7">مركزك الموحد لإدارة المزرعة، القرار البيطري، السوق، التوريد، الجودة، والعمليات التنفيذية. اختر المهمة التي تريدها دون البحث بين عشرات الشاشات.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              <button className="spp-button spp-button-primary" onClick={() => onNavigate('farmer')}><Home className="w-4 h-4"/> دخول بوابة العميل</button>
              <button className="spp-button spp-button-secondary" onClick={onOpenAI}><Bot className="w-4 h-4"/> المساعد البيطري</button>
              {onRegisterUser && <button className="spp-button spp-button-ghost" onClick={onRegisterUser}><UserPlus className="w-4 h-4"/> تسجيل مستخدم جديد</button>}
              {onOpenRegistrationApprovals && <button className="spp-button spp-button-secondary" onClick={onOpenRegistrationApprovals}><ShieldCheck className="w-4 h-4"/> طلبات الموافقة</button>}
              <button className="spp-button spp-button-ghost" onClick={onRegisterCustomer}><UserPlus className="w-4 h-4"/> تسجيل عميل/مزرعة</button>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 rounded-3xl border border-emerald-500/20 bg-slate-950/40 px-5 py-4">
            <PlatformLogo className="w-20 h-20" />
            <div><div className="text-sm font-black text-white">AviNexus Poultry Enterprise</div><div className="text-[11px] text-emerald-300 mt-1">Enterprise Veterinary Network</div><div className="text-[10px] text-slate-500 mt-2">{APP_RELEASE_LABEL}</div></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric icon={<Building2/>} label="المزارع المسجلة" value={farmCount}/>
        <Metric icon={<Activity/>} label="القطعان النشطة" value={activeFlocks}/>
        <Metric icon={<HeartPulse/>} label="حالات بيطرية معلقة" value={pendingCases}/>
        <Metric icon={<ClipboardList/>} label="طلبات تسجيل جديدة" value={pendingRegistrations}/>
      </section>

      <section className="spp-section-card">
        <div className="flex items-center justify-between gap-3 mb-4"><div><h3 className="text-base font-black text-white">أقسام المنصة</h3><p className="text-[11px] text-slate-500 mt-1">انتقال مباشر حسب المهمة والصلاحية</p></div><button className="spp-icon-button" onClick={onOpenSettings}><Settings2 className="w-4 h-4"/></button></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SectionCard icon={<Home/>} title="العميل والمزرعة" text="القطيع، السجلات، الأمان الحيوي والخدمات" onClick={() => onNavigate('farmer')}/>
          <SectionCard icon={<Building2/>} title="إدارة المزارع المتعاقدة" text="عقود الإدارة، المكاتب، العنابر، القطعان، المهام والمحاسبة التشغيلية" onClick={() => onNavigate('managed')}/>
          <SectionCard icon={<Stethoscope/>} title="الاستشاري البيطري" text="الحالات، التشخيص، المختبر والاعتماد الطبي" onClick={() => onNavigate('vet')}/>
          <SectionCard icon={<ShoppingBag/>} title="السوق والتوريدات" text="الأدوية، الأعلاف، المعدات والحجوزات" onClick={() => onNavigate('marketplace')}/>
          <SectionCard icon={<MessageCircleMore/>} title="التواصل الميداني" text="العامل، المشرف، الطبيب والاستشاري مع تحليل البيانات" onClick={() => onNavigate('communications')}/>
          <SectionCard icon={<DollarSign/>} title="المالية والعقود" text="الخزينة، الفواتير، القبض، الصرف، الديون والتحويلات" onClick={() => onNavigate('finance')}/>
          <SectionCard icon={<ShieldCheck/>} title="الإدارة والقيادة" text="المالية، الشبكة، الصلاحيات والحوكمة" onClick={() => onNavigate('admin')}/>
          <SectionCard icon={<Users/>} title="العمالة والمربين" text="الكوادر، التوظيف، الأداء والمكافآت" onClick={() => onNavigate('workers')}/>
          <SectionCard icon={<PackageSearch/>} title="الجواز والتتبع" text="QR، الشهادات وسجل الدفعات" onClick={() => onNavigate('passport')}/>
          <SectionCard icon={<Bot/>} title="المساعد الذكي" text="مساعدة أولية مع بوابة اعتماد الطبيب" onClick={onOpenAI}/>
          <SectionCard icon={<Settings2/>} title="إعدادات التطبيق" text="المظهر، التنبيهات، النص وتجربة الاستخدام" onClick={onOpenSettings}/>
        </div>
      </section>
    </div>
  );
};

const Metric: React.FC<{icon:React.ReactNode;label:string;value:number}> = ({icon,label,value}) => <div className="spp-metric-card"><span className="spp-metric-icon">{icon}</span><div><strong className="text-xl font-black text-white">{value.toLocaleString('ar-YE')}</strong><div className="text-[10px] text-slate-500 mt-1">{label}</div></div></div>;
const SectionCard: React.FC<{icon:React.ReactNode;title:string;text:string;onClick:()=>void}> = ({icon,title,text,onClick}) => <button onClick={onClick} className="spp-section-link"><span className="spp-section-link-icon">{icon}</span><span className="min-w-0 flex-1 text-right"><b>{title}</b><small>{text}</small></span><ArrowUpLeft className="w-4 h-4 text-slate-600"/></button>;
