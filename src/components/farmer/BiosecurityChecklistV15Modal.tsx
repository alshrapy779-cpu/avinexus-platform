import React from 'react';
import { X, ShieldCheck, AlertTriangle, MapPin, CheckCircle2 } from 'lucide-react';
import { SmartOperationsState } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
  farmName?: string;
}

export const BiosecurityChecklistV15Modal: React.FC<Props> = ({ isOpen, onClose, operations, onUpdateOperations, farmName }) => {
  if (!isOpen) return null;
  const enterprise = operations.enterprise;
  const run = enterprise.biosecurity_checklists_v15.find((x) => x.farm_name === farmName) || enterprise.biosecurity_checklists_v15[0];
  if (!run) return null;

  const toggle = (itemId:string) => {
    const runs = enterprise.biosecurity_checklists_v15.map((r) => {
      if (r.id !== run.id) return r;
      const items = r.items.map((item) => item.id === itemId ? {...item,completed:!item.completed,completed_at:!item.completed?new Date().toISOString():undefined,completed_by:!item.completed?'المستخدم الميداني':undefined}:item);
      const required = items.filter((x)=>x.required);
      const score = required.length ? Math.round(required.filter((x)=>x.completed).length/required.length*100) : 100;
      return {...r,items,score_percent:score};
    });
    onUpdateOperations({...operations,enterprise:{...enterprise,biosecurity_checklists_v15:runs}});
  };

  return <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
    <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-emerald-500/30 bg-slate-950 shadow-2xl">
      <div className="sticky top-0 bg-slate-950/95 border-b border-slate-800 p-4 flex items-center justify-between z-10">
        <div><div className="flex items-center gap-2 text-emerald-300 font-black"><ShieldCheck className="w-5 h-5"/> قائمة الأمن الحيوي V15</div><div className="text-xs text-slate-400 mt-1"><MapPin className="inline w-3 h-3"/> {run.governorate} / {run.district} • الاستحقاق القادم {new Date(run.next_due_at).toLocaleString('ar-YE')}</div></div>
        <button onClick={onClose} className="p-2 rounded-xl bg-slate-900"><X className="w-4 h-4"/></button>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2"><div className="rounded-2xl border border-slate-800 bg-slate-900 p-3"><div className="text-[10px] text-slate-400">درجة الالتزام</div><div className="text-2xl font-black text-emerald-300">{run.score_percent}%</div></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-3"><div className="text-[10px] text-slate-400">مستوى الخطر</div><div className="text-sm font-black text-amber-300">{run.outbreak_risk_level}</div></div></div>
        {run.movement_restriction_active&&<div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-100"><AlertTriangle className="inline w-4 h-4 ml-1"/><b>تقييد حركة وقائي:</b> {run.restriction_reason}</div>}
        {run.items.map(item=><button key={item.id} onClick={()=>toggle(item.id)} className={`w-full text-right rounded-2xl border p-3 flex gap-3 ${item.completed?'border-emerald-500/30 bg-emerald-500/10':'border-slate-800 bg-slate-900'}`}><span className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${item.completed?'bg-emerald-500 border-emerald-400 text-slate-950':'border-slate-600'}`}>{item.completed&&<CheckCircle2 className="w-4 h-4"/>}</span><div><div className="text-xs font-bold text-white">{item.label}</div><div className="text-[10px] text-slate-400 mt-1">{item.frequency} • {item.required?'إلزامي':'اختياري'} {item.completed_by?`• ${item.completed_by}`:''}</div></div></button>)}
      </div>
    </div>
  </div>;
};
