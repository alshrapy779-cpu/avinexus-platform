import React from 'react';
import { ArrowLeft, Bot, CheckCircle2, Settings2, UserPlus, X } from 'lucide-react';
import { PlatformLogo } from '../brand/PlatformLogo';
import { APP_RELEASE_LABEL } from '../../config/appVersion';

export const WelcomeExperience: React.FC<{
  open:boolean;
  customerName?:string;
  onClose:()=>void;
  onRegister:()=>void;
  onOpenAI:()=>void;
  onSettings:()=>void;
}> = ({open,customerName,onClose,onRegister,onOpenAI,onSettings}) => {
  if (!open) return null;
  return <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm grid place-items-center p-4" dir="rtl">
    <div className="w-full max-w-2xl rounded-[2rem] border border-emerald-500/25 bg-[#07181b] shadow-2xl overflow-hidden">
      <div className="p-6 sm:p-8 relative">
        <button onClick={onClose} className="spp-icon-button absolute top-4 left-4"><X className="w-4 h-4"/></button>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 border border-emerald-500/25 grid place-items-center"><PlatformLogo className="w-16 h-16"/></div>
          <div><div className="text-[11px] font-black text-emerald-300 tracking-wide">AVINEXUS POULTRY ENTERPRISE • {APP_RELEASE_LABEL}</div><h2 className="text-2xl sm:text-3xl font-black text-white mt-1">مرحبًا{customerName?`، ${customerName}`:''}</h2><p className="text-xs text-slate-400 mt-2">منصة واحدة لإدارة الصحة، التشغيل، التوريد والحوكمة.</p></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-2 mt-6">
          {['القرار الطبي معتمد من الطبيب','تتبع تشغيلي ومالي','دعم أونلاين وأوفلاين'].map((item)=><div key={item} className="flex items-center gap-2 rounded-xl bg-slate-950/50 border border-slate-800 p-3 text-[10px] font-bold text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400"/>{item}</div>)}
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          <button className="spp-button spp-button-primary" onClick={onClose}>دخول المنصة <ArrowLeft className="w-4 h-4"/></button>
          <button className="spp-button spp-button-secondary" onClick={onRegister}><UserPlus className="w-4 h-4"/> تسجيل عميل جديد</button>
          <button className="spp-button spp-button-ghost" onClick={onOpenAI}><Bot className="w-4 h-4"/> المساعد البيطري</button>
          <button className="spp-button spp-button-ghost" onClick={onSettings}><Settings2 className="w-4 h-4"/> الإعدادات</button>
        </div>
      </div>
    </div>
  </div>;
};
