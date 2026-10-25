import React from 'react';
import { FieldChatMessageV19, FieldChatThreadV19 } from '../../types';
import { parseFieldMediaTranscriptV19 } from './MediaDataParser';

export function coordinateFieldMessageV19(thread:FieldChatThreadV19,message:FieldChatMessageV19,mortalityThresholdPercent=5){
  const source=message.transcript||message.text||''; const parsed=parseFieldMediaTranscriptV19(source);
  const mortality=parsed.find(x=>x.key==='mortality'); const mortalityValue=typeof mortality?.value==='number'?mortality.value:undefined;
  const shouldEscalate=thread.priority==='emergency'||Boolean(message.clinician_review_required)||(mortalityValue!==undefined&&mortalityValue>=20);
  return {parsed,shouldEscalate,clinicianReviewRequired:shouldEscalate,
    dailyPatch:Object.fromEntries(parsed.filter(x=>['mortality','temperature_c','humidity_percent','weight_g','feed_kg','water_liters'].includes(x.key)).map(x=>[x.key,x.value])),
    note:shouldEscalate?'تم التصعيد للمراجعة البيطرية البشرية. الذكاء الاصطناعي لا يعتمد وصفة أو قراراً علاجياً نهائياً.':'تم استخراج البيانات وأرشفتها ضمن متابعة العنبر.',mortalityThresholdPercent};
}

export const AIChatCoordinator:React.FC<{thread:FieldChatThreadV19;messages:FieldChatMessageV19[]}>=({thread,messages})=><section className="sov-panel" dir="rtl">
  <div className="flex items-center justify-between"><div><h4 className="text-sm font-black text-white">{thread.title}</h4><p className="text-[10px] text-slate-400 mt-1">{thread.ai_summary}</p></div><span className="text-[10px] text-cyan-300">{thread.priority}</span></div>
  <div className="mt-3 space-y-2">{messages.filter(m=>m.thread_id===thread.id).slice(-8).map(m=><div key={m.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div className="text-[10px] text-slate-500">{m.sender_name} • {m.sender_role}</div><div className="text-xs text-slate-200 mt-1">{m.text||m.transcript||m.type}</div></div>)}</div>
</section>;
