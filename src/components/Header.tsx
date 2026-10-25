import React, { useState } from 'react';
import {
  Bell, BriefcaseBusiness, Bot, Calculator, DollarSign, FileText, Home, Menu, Moon, QrCode, Settings2, ShoppingBag, Smartphone, Stethoscope, Sun, Syringe, Users, MessageCircleMore, ClipboardList, UserCircle2, Wifi, WifiOff, X, Sparkles, ChevronDown
} from 'lucide-react';
import { PlatformLogo } from './brand/PlatformLogo';

export type AppView = 
  | 'home' | 'enterprise' | 'farmer' | 'vet' | 'marketplace' 
  | 'finance' | 'admin' | 'passport' | 'workers' | 'communications' 
  | 'managed' | 'contracts' | 'settings';

interface HeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  uiLanguage?: 'ar' | 'en';
  isOnline?: boolean;
  user?: { name: string, role: string };
  onOpenSettings: () => void;
  onOpenAI: () => void;
  notificationsCount?: number;
  allowedViews?: AppView[];
  aiShortcutEnabled?: boolean;
}

const labelFor = (lang: 'ar' | 'en' | undefined, ar: string, en: string) => lang === 'en' ? en : ar;

export const Header: React.FC<HeaderProps> = ({ 
  activeView, onNavigate, uiLanguage = 'ar', isOnline = true, user = { name: 'مدير النظام', role: 'system_owner' }, onOpenSettings, onOpenAI, notificationsCount = 0, allowedViews, aiShortcutEnabled = true
}) => {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const primaryNav = [
    { id: 'home', label: labelFor(uiLanguage, 'الرئيسية', 'Home'), icon: <Home className="w-4 h-4" /> },
    { id: 'managed', label: labelFor(uiLanguage, 'إدارة المزارع', 'Farm Ops'), icon: <BriefcaseBusiness className="w-4 h-4" /> },
    { id: 'marketplace', label: labelFor(uiLanguage, 'السوق والتوريد', 'Market'), icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'vet', label: labelFor(uiLanguage, 'الطبي البيطري', 'Vet'), icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'finance', label: labelFor(uiLanguage, 'المالية', 'Finance'), icon: <DollarSign className="w-4 h-4" /> },
    { id: 'communications', label: labelFor(uiLanguage, 'التواصل', 'Comms'), icon: <MessageCircleMore className="w-4 h-4" /> },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all duration-300" dir={uiLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <PlatformLogo className="w-9 h-9" />
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-slate-900 leading-tight">AviNexus Poultry</h1>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Enterprise Platform</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
            {isOnline ? <><Wifi className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-emerald-700">متصل</span></> : <><WifiOff className="w-3.5 h-3.5 text-rose-500" /> <span className="text-rose-700">غير متصل</span></>}
            <span className="mx-1 text-slate-300">|</span><span>{user.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onOpenAI} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold transition-colors border border-indigo-100">
              <Sparkles className="w-4 h-4 text-indigo-500" /> المساعد الذكي
            </button>
            <button className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>}
            </button>
            <button onClick={onOpenSettings} className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <Settings2 className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <button className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
              <UserCircle2 className="w-8 h-8 text-slate-400" />
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                <p className="text-[11px] text-slate-500 mt-1">{user.role}</p>
              </div>
            </button>
          </div>
        </div>
        <div className="hidden md:block border-t border-slate-100">
          <nav className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {primaryNav.filter(item => !allowedViews || allowedViews.includes(item.id)).map((item) => (
              <NavButton key={item.id} active={activeView === item.id} label={item.label} icon={item.icon} onClick={() => onNavigate(item.id)} />
            ))}
          </nav>
        </div>
      </header>

      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMoreOpen(false)}>
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-3xl shadow-xl border border-slate-200 p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-900">المزيد من الخيارات</h3>
              <button onClick={() => setMobileMoreOpen(false)} className="p-1.5 bg-slate-100 rounded-full text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'managed', label: 'إدارة المزارع', icon: <ClipboardList /> },
                { id: 'finance', label: 'المالية', icon: <DollarSign /> },
                { id: 'communications', label: 'التواصل', icon: <MessageCircleMore /> },
                { id: 'enterprise', label: 'المؤسسات', icon: <BriefcaseBusiness /> },
                { id: 'workers', label: 'الموظفين', icon: <Users /> },
                { id: 'contracts', label: 'العقود', icon: <FileText /> },
                { id: 'passport', label: 'الجواز', icon: <QrCode /> },
                { id: 'admin', label: 'الإدارة', icon: <Settings2 /> },
              ].map(item => (
                <MobileMoreButton key={item.id} label={item.label} icon={item.icon} onClick={() => { onNavigate(item.id as AppView); setMobileMoreOpen(false); }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[75] bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto px-2 py-1.5">
          <MobileNav active={activeView === 'home'} label="الرئيسية" icon={<Home />} onClick={() => onNavigate('home')} />
          <MobileNav active={activeView === 'enterprise'} label="المؤسسات" icon={<BriefcaseBusiness />} onClick={() => onNavigate('enterprise')} />
          <MobileNav active={activeView === 'vet'} label="الطبي" icon={<Stethoscope />} onClick={() => onNavigate('vet')} />
          {aiShortcutEnabled ? <MobileNav active={false} label="الذكاء" icon={<Bot />} onClick={onOpenAI} isSpecial /> : <div />}
          <MobileNav active={mobileMoreOpen} label="المزيد" icon={<Menu />} onClick={() => setMobileMoreOpen(true)} />
        </div>
      </nav>
    </>
  );
};

const NavButton = ({ active, label, icon, badge, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${active ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
    {icon} {label}
    {badge ? <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">{badge}</span> : null}
  </button>
);

const MobileMoreButton = ({ label, icon, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 gap-2 border border-slate-100 transition-colors">
    {React.cloneElement(icon, { className: "w-6 h-6" })}<span className="text-xs font-medium">{label}</span>
  </button>
);

const MobileNav = ({ active, label, icon, onClick, isSpecial }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${active ? 'text-indigo-600 bg-indigo-50/80' : isSpecial ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-500 hover:bg-slate-50'}`}>
    {React.cloneElement(icon, { className: `w-5 h-5 mb-1 ${active || isSpecial ? '' : 'opacity-70'}` })}
    <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);
