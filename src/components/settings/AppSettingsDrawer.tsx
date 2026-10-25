import React from 'react';
import { Bell, Bot, Check, Gauge, MonitorCog, RotateCcw, Settings2, Sparkles, Text, X } from 'lucide-react';
import { AppView } from '../Header';

export interface AppUISettingsV194 {
  theme: 'dark' | 'light';
  language: 'ar' | 'en' | 'bilingual';
  density: 'comfortable' | 'compact';
  fontScale: 'sm' | 'md' | 'lg';
  reduceMotion: boolean;
  showWelcome: boolean;
  notificationsEnabled: boolean;
  aiShortcutEnabled: boolean;
  startView: AppView;
}

export const DEFAULT_UI_SETTINGS_V194: AppUISettingsV194 = {
  theme: 'dark',
  language: 'bilingual',
  density: 'comfortable',
  fontScale: 'md',
  reduceMotion: false,
  showWelcome: true,
  notificationsEnabled: true,
  aiShortcutEnabled: true,
  startView: 'home'
};

export const loadUISettingsV194 = (): AppUISettingsV194 => {
  try {
    const raw = localStorage.getItem('spp-ui-settings-v19-4');
    return raw ? { ...DEFAULT_UI_SETTINGS_V194, ...JSON.parse(raw) } : DEFAULT_UI_SETTINGS_V194;
  } catch {
    return DEFAULT_UI_SETTINGS_V194;
  }
};

interface Props {
  open: boolean;
  settings: AppUISettingsV194;
  onChange: (next: AppUISettingsV194) => void;
  onClose: () => void;
  onReset: () => void;
}

export const AppSettingsDrawer: React.FC<Props> = ({ open, settings, onChange, onClose, onReset }) => {
  if (!open) return null;
  const set = <K extends keyof AppUISettingsV194>(key: K, value: AppUISettingsV194[K]) => onChange({ ...settings, [key]: value });
  return (
    <div className="fixed inset-0 z-[90] bg-slate-950/65" onMouseDown={onClose}>
      <aside
        dir="rtl"
        className="absolute top-0 right-0 h-full w-full max-w-md overflow-y-auto bg-[#071519] border-l border-emerald-900/50 shadow-2xl p-5 sm:p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 grid place-items-center"><Settings2 className="w-5 h-5"/></div>
            <div><h2 className="text-base font-black text-white">الإعدادات | Settings</h2><p className="text-[11px] text-slate-400 mt-0.5">المظهر واللغة وسهولة الاستخدام | Appearance, language & usability</p></div>
          </div>
          <button className="spp-icon-button" onClick={onClose} aria-label="إغلاق"><X className="w-4 h-4"/></button>
        </div>

        <Section icon={<Text/>} title="اللغة | Language">
          <Segmented value={settings.language} options={[['ar','العربية'],['en','English'],['bilingual','عربي | English']]} onChange={(v) => set('language', v as AppUISettingsV194['language'])}/>
          <p className="text-[10px] text-slate-500 mt-2">تُستخدم في الواجهة التشغيلية R8.1 والشريط الرئيسي، مع الحفاظ على البيانات بلغتها الأصلية.</p>
        </Section>

        <Section icon={<MonitorCog/>} title="المظهر">
          <Segmented
            value={settings.theme}
            options={[['dark','داكن'],['light','فاتح']]}
            onChange={(v) => set('theme', v as AppUISettingsV194['theme'])}
          />
        </Section>

        <Section icon={<Gauge/>} title="كثافة الواجهة">
          <Segmented value={settings.density} options={[['comfortable','مريح'],['compact','مضغوط']]} onChange={(v) => set('density', v as AppUISettingsV194['density'])}/>
        </Section>

        <Section icon={<Text/>} title="حجم النص">
          <Segmented value={settings.fontScale} options={[['sm','صغير'],['md','متوسط'],['lg','كبير']]} onChange={(v) => set('fontScale', v as AppUISettingsV194['fontScale'])}/>
        </Section>

        <Section icon={<Sparkles/>} title="تجربة الدخول">
          <Toggle checked={settings.showWelcome} label="إظهار رسالة الترحيب عند بدء جلسة جديدة" onChange={(v) => set('showWelcome', v)}/>
          <Toggle checked={!settings.reduceMotion} label="الحركات والانتقالات الاحترافية" onChange={(v) => set('reduceMotion', !v)}/>
        </Section>

        <Section icon={<Bell/>} title="التنبيهات">
          <Toggle checked={settings.notificationsEnabled} label="إظهار تنبيهات المنصة داخل التطبيق" onChange={(v) => set('notificationsEnabled', v)}/>
        </Section>

        <Section icon={<Bot/>} title="المساعد البيطري">
          <Toggle checked={settings.aiShortcutEnabled} label="إظهار اختصار المساعد في شريط التنقل" onChange={(v) => set('aiShortcutEnabled', v)}/>
        </Section>

        <Section icon={<MonitorCog/>} title="صفحة البداية">
          <select className="spp-field" value={settings.startView} onChange={(e) => set('startView', e.target.value as AppView)}>
            <option value="home">الرئيسية</option><option value="farmer">العميل والمزرعة</option><option value="vet">الاستشاري</option><option value="communications">التواصل الميداني</option><option value="marketplace">السوق والتوريدات</option><option value="finance">المالية والعقود</option><option value="admin">الإدارة</option>
          </select>
          <p className="text-[10px] text-slate-500 mt-2">تُطبق الصفحة المختارة عند فتح جلسة جديدة.</p>
        </Section>

        <div className="flex gap-2 mt-6">
          <button className="spp-button spp-button-primary flex-1" onClick={onClose}><Check className="w-4 h-4"/> حفظ وإغلاق</button>
          <button className="spp-button spp-button-ghost" onClick={onReset}><RotateCcw className="w-4 h-4"/> افتراضي</button>
        </div>
      </aside>
    </div>
  );
};

const Section: React.FC<{icon: React.ReactNode; title: string; children: React.ReactNode}> = ({ icon, title, children }) => (
  <section className="spp-settings-section">
    <div className="flex items-center gap-2 text-xs font-black text-slate-200 mb-3"><span className="text-emerald-300 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>{title}</div>
    {children}
  </section>
);

const Segmented: React.FC<{ value: string; options: [string,string][]; onChange: (value:string)=>void }> = ({ value, options, onChange }) => (
  <div className="grid gap-1 p-1 rounded-xl bg-slate-950/70 border border-slate-800" style={{gridTemplateColumns:`repeat(${options.length},minmax(0,1fr))`}}>
    {options.map(([id,label]) => <button key={id} onClick={() => onChange(id)} className={`rounded-lg px-2 py-2 text-[11px] font-black transition ${value===id?'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30':'text-slate-400 border border-transparent hover:bg-slate-800'}`}>{label}</button>)}
  </div>
);

const Toggle: React.FC<{checked:boolean; label:string; onChange:(v:boolean)=>void}> = ({checked,label,onChange}) => (
  <button type="button" onClick={() => onChange(!checked)} className="w-full flex items-center justify-between gap-3 py-2.5 text-right">
    <span className="text-[11px] font-bold text-slate-300">{label}</span>
    <span className={`w-11 h-6 rounded-full p-0.5 transition ${checked?'bg-emerald-500':'bg-slate-700'}`}><span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${checked?'translate-x-0':'-translate-x-5'}`}/></span>
  </button>
);
