import React from 'react';
import {
  Bell,
  BriefcaseBusiness,
  Bot,
  Calculator,
  DollarSign,
  FileText,
  Home,
  Menu,
  Moon,
  QrCode,
  Settings2,
  ShoppingBag,
  Smartphone,
  Stethoscope,
  Sun,
  Syringe,
  Users,
  MessageCircleMore,
  ClipboardList,
  UserCircle2,
  Wifi,
  WifiOff,
  X
} from 'lucide-react';
import { PlatformLogo } from './brand/PlatformLogo';

export type AppView =
  | 'home'
  | 'enterprise'
  | 'farmer'
  | 'vet'
  | 'calculator'
  | 'passport'
  | 'srs'
  | 'marketplace'
  | 'workers'
  | 'vaccines'
  | 'admin'
  | 'finance'
  | 'communications'
  | 'managed';

interface HeaderProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingCasesCount: number;
  onOpenAIGuidance: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenSettings?: () => void;
  aiShortcutEnabled?: boolean;
  currentUserName?: string;
  currentUserRole?: string;
  onOpenAccount?: () => void;
  allowedViews?: AppView[];
  language?: 'ar'|'en'|'bilingual';
  onRegisterUser?: () => void;
  onOpenRegistrationApprovals?: () => void;
  onOpenLogin?: () => void;
}

const primaryNav: Array<{ id: AppView; ar: string; en:string; icon: React.ReactNode; badge?: 'cases' }> = [
  { id: 'home', ar: 'الرئيسية', en:'Home', icon: <Home className="w-4 h-4"/> },
  { id: 'enterprise', ar: 'مساحة العمل', en:'Workspace', icon: <BriefcaseBusiness className="w-4 h-4"/> },
  { id: 'marketplace', ar: 'السوق والتوريدات', en:'Market & Supply', icon: <ShoppingBag className="w-4 h-4"/> },
  { id: 'communications', ar: 'التواصل', en:'Communication', icon: <MessageCircleMore className="w-4 h-4"/> }
];
const labelFor = (language: 'ar'|'en'|'bilingual', ar: string, en: string) =>
  language === 'ar' ? ar : language === 'en' ? en : `${ar} | ${en}`;

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  isOnline,
  onToggleOnline,
  pendingCasesCount,
  onOpenAIGuidance,
  theme = 'dark',
  onToggleTheme,
  onOpenSettings,
  aiShortcutEnabled = true,
  currentUserName = 'مستخدم المنصة',
  currentUserRole = '',
  onOpenAccount,
  allowedViews,
  language = 'bilingual',
  onRegisterUser, onOpenRegistrationApprovals, onOpenLogin
}) => {
  const [mobileMoreOpen, setMobileMoreOpen] = React.useState(false);
  const uiLanguage: NonNullable<HeaderProps['language']> = language ?? 'bilingual';
  return (
    <>
      <header className="no-print spp-header sticky top-0 z-50" dir={uiLanguage==='en'?'ltr':'rtl'}>
        <div className="spp-identity-strip">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-300 grid place-items-center text-[10px]">🇾🇪</span>
            <span className="hidden sm:inline text-emerald-300 font-bold">{labelFor(uiLanguage,'اليمن','Yemen')}</span>
            <span className="hidden lg:inline text-slate-500">• {labelFor(uiLanguage,'منصة تشغيل علمية للدواجن','Scientific poultry operations platform')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {aiShortcutEnabled && <button onClick={onOpenAIGuidance} className="spp-top-action"><Bot className="w-3.5 h-3.5"/><span className="hidden sm:inline">{labelFor(uiLanguage,'الذكاء العلمي','Scientific AI')}</span></button>}
            <button onClick={onToggleTheme} className="spp-top-action" title="تبديل الوضع">{theme==='light'?<Moon className="w-3.5 h-3.5"/>:<Sun className="w-3.5 h-3.5"/>}</button>
            <button onClick={onOpenSettings} className="spp-top-action" title={labelFor(uiLanguage,'الإعدادات','Settings')}><Settings2 className="w-3.5 h-3.5"/></button>
            <button onClick={onToggleOnline} className={`spp-connectivity ${isOnline?'is-online':'is-offline'}`} title="حالة الاتصال">{isOnline?<Wifi className="w-3.5 h-3.5"/>:<WifiOff className="w-3.5 h-3.5"/>}<span className="hidden sm:inline">{isOnline?labelFor(uiLanguage,'متصل','Online'):labelFor(uiLanguage,'دون اتصال','Offline')}</span></button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <button onClick={() => onViewChange('home')} className="flex items-center gap-3 min-w-0 text-right group">
            <div className="spp-logo-shell"><PlatformLogo className="w-12 h-12 sm:w-14 sm:h-14"/></div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0"><h1 className="text-sm sm:text-[17px] font-black text-white truncate">{labelFor(uiLanguage,'أفي نيكسس لإدارة الدواجن','AviNexus Poultry Enterprise')}</h1></div>
              <div className="hidden sm:flex items-center gap-2 mt-1 text-[10px]"><span className="text-emerald-300 font-black tracking-wide">AVINEXUS POULTRY ENTERPRISE</span><span className="text-slate-600">•</span><span className="text-slate-400">{labelFor(uiLanguage,'تشغيل • علم • ذكاء • حوكمة','Operations • Science • Intelligence • Governance')}</span></div>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1.5">
            {onOpenLogin && <button onClick={onOpenLogin} className="spp-top-action" title="الحساب وتسجيل الدخول">الدخول</button>}
            {onRegisterUser && <button onClick={onRegisterUser} className="spp-top-action" title="إنشاء حساب مستخدم">تسجيل جديد</button>}
            {onOpenRegistrationApprovals && <button onClick={onOpenRegistrationApprovals} className="spp-top-action" title="مراجعة طلبات التسجيل">الموافقات</button>}
            <button onClick={onOpenAccount} className="spp-user-chip" title="الحساب الحالي"><UserCircle2 className="w-4 h-4"/><span className="text-right"><b>{currentUserName}</b><small>{currentUserRole}</small></span></button>
            <button className="spp-icon-button relative" title="التنبيهات"><Bell className="w-4 h-4"/>{pendingCasesCount>0&&<span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-rose-500 text-[8px] text-white font-black grid place-items-center">{pendingCasesCount}</span>}</button>
            <button className="spp-icon-button" onClick={onOpenSettings} title={labelFor(uiLanguage,'الإعدادات','Settings')}><Settings2 className="w-4 h-4"/></button>
          </div>
        </div>

        <div className="hidden md:block border-t border-slate-800/80">
          <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center gap-1.5 overflow-x-auto spp-main-nav">
            {primaryNav.filter(item => !allowedViews || allowedViews.includes(item.id)).map(item => <NavButton key={item.id} active={activeView===item.id} label={labelFor(uiLanguage,item.ar,item.en)} icon={item.icon} badge={item.badge==='cases'?pendingCasesCount:0} onClick={()=>onViewChange(item.id)}/>)}
          </nav>
        </div>
      </header>

      <div className="md:hidden fixed bottom-[5.8rem] right-3 z-[76] flex gap-1">{onRegisterUser && <button className="spp-top-action" onClick={onRegisterUser}>تسجيل جديد</button>}{onOpenRegistrationApprovals && <button className="spp-top-action" onClick={onOpenRegistrationApprovals}>الموافقات</button>}</div>
      {mobileMoreOpen && <div className="md:hidden fixed inset-0 z-[70] bg-slate-950/70" onClick={()=>setMobileMoreOpen(false)}><div dir={uiLanguage==='en'?'ltr':'rtl'} className="absolute bottom-[5.3rem] left-3 right-3 rounded-3xl border border-slate-700 bg-[#081b20] p-3 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between mb-3"><strong className="text-xs text-white">{labelFor(uiLanguage,'الوصول السريع','Quick access')}</strong><button onClick={()=>setMobileMoreOpen(false)} className="spp-icon-button"><X className="w-4 h-4"/></button></div><div className="grid grid-cols-3 gap-2">{[
        ['managed',labelFor(uiLanguage,'إدارة المزارع','Farm Operations'),<ClipboardList className="w-4 h-4"/>],['finance',labelFor(uiLanguage,'المالية','Finance'),<DollarSign className="w-4 h-4"/>],['communications',labelFor(uiLanguage,'التواصل','Communication'),<MessageCircleMore className="w-4 h-4"/>],['workers',labelFor(uiLanguage,'القوى العاملة','Workforce'),<Users className="w-4 h-4"/>],['vaccines',labelFor(uiLanguage,'التحصين','Vaccination'),<Syringe className="w-4 h-4"/>],['marketplace',labelFor(uiLanguage,'السوق والتوريدات','Market & Supply'),<ShoppingBag className="w-4 h-4"/>],['admin',labelFor(uiLanguage,'الإدارة','Administration'),<Settings2 className="w-4 h-4"/>]
      ].filter(([id]) => !allowedViews || allowedViews.includes(id as AppView)).map(([id,label,icon])=><MobileMoreButton key={String(id)} label={String(label)} icon={icon as React.ReactNode} onClick={()=>{onViewChange(id as AppView);setMobileMoreOpen(false);}}/>)}</div></div></div>}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[75] mobile-bottom-safe px-2.5 pt-2 spp-mobile-nav" dir={uiLanguage==='en'?'ltr':'rtl'}>
        <div className="grid grid-cols-5 gap-1.5 max-w-md mx-auto">
          <MobileNav active={activeView==='home'} label={labelFor(uiLanguage,'الرئيسية','Home')} icon={<Home/>} onClick={()=>onViewChange('home')}/>
          <MobileNav active={activeView==='enterprise'} label={labelFor(uiLanguage,'العمل','Work')} icon={<BriefcaseBusiness/>} onClick={()=>onViewChange('enterprise')}/>
          <MobileNav active={activeView==='vet'} label={labelFor(uiLanguage,'الطبيب','Vet')} icon={<Stethoscope/>} onClick={()=>onViewChange('vet')}/>
          {aiShortcutEnabled ? <MobileNav active={false} label={labelFor(uiLanguage,'الذكاء','AI')} icon={<Bot/>} accent onClick={onOpenAIGuidance}/> : <MobileNav active={activeView==='marketplace'} label={labelFor(uiLanguage,'السوق','Market')} icon={<ShoppingBag/>} onClick={()=>onViewChange('marketplace')}/>} 
          <MobileNav active={mobileMoreOpen} label={labelFor(uiLanguage,'المزيد','More')} icon={<Menu/>} onClick={()=>setMobileMoreOpen(v=>!v)}/>
        </div>
      </nav>
    </>
  );
};

const NavButton: React.FC<{active:boolean;label:string;icon:React.ReactNode;badge?:number;onClick:()=>void}> = ({active,label,icon,badge=0,onClick}) => <button onClick={onClick} className={`spp-nav-button ${active?'is-active':''}`}><span className="text-current">{icon}</span><span>{label}</span>{badge>0&&<span className="spp-nav-badge">{badge}</span>}</button>;
const MobileMoreButton: React.FC<{label:string;icon:React.ReactNode;onClick:()=>void}> = ({label,icon,onClick}) => <button onClick={onClick} className="rounded-2xl bg-slate-900 border border-slate-700 px-2 py-3 text-[10px] font-black text-slate-200 flex flex-col items-center gap-1.5"><span className="text-emerald-300">{icon}</span><span>{label}</span></button>;
const MobileNav: React.FC<{active:boolean;label:string;icon:React.ReactNode;onClick:()=>void;accent?:boolean}> = ({active,label,icon,onClick,accent}) => <button onClick={onClick} className={`spp-mobile-nav-button ${active?'is-active':''} ${accent?'is-accent':''}`}><span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span><span>{label}</span></button>;
