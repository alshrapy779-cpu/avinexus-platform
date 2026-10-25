import React from 'react';
import { ArrowLeft, ArrowRight, Home, Settings2 } from 'lucide-react';
import { AppView } from '../Header';

const labels: Record<AppView, string> = {
  enterprise: 'منصة V20.2',
  home: 'الرئيسية', farmer: 'العميل والمزرعة', managed: 'إدارة المزارع والقطعان', vet: 'الاستشاري البيطري', communications: 'التواصل الميداني', finance: 'المالية والعقود', marketplace: 'السوق والتوريدات', workers: 'العمالة والمربين', vaccines: 'اللقاحات', calculator: 'حاسبة الخسائر', passport: 'الجواز الرقمي', admin: 'الإدارة والقيادة', srs: 'وثيقة SRS'
};

export const NavigationTrail: React.FC<{
  activeView: AppView;
  canBack: boolean;
  canForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onHome: () => void;
  onSettings: () => void;
}> = ({ activeView, canBack, canForward, onBack, onForward, onHome, onSettings }) => (
  <div className="no-print max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3">
    <div className="spp-nav-trail">
      <div className="flex items-center gap-1.5">
        <button className="spp-icon-button" onClick={onBack} disabled={!canBack} title="رجوع"><ArrowRight className="w-4 h-4"/></button>
        <button className="spp-icon-button" onClick={onForward} disabled={!canForward} title="تقدم"><ArrowLeft className="w-4 h-4"/></button>
        <button className="spp-icon-button" onClick={onHome} title="الرئيسية"><Home className="w-4 h-4"/></button>
      </div>
      <div className="min-w-0 flex-1 px-2 text-[11px] text-slate-500 truncate"><span className="text-slate-500">المنصة</span><span className="mx-2 text-slate-700">/</span><strong className="text-slate-200">{labels[activeView]}</strong></div>
      <button className="spp-icon-button" onClick={onSettings} title="الإعدادات"><Settings2 className="w-4 h-4"/></button>
    </div>
  </div>
);
