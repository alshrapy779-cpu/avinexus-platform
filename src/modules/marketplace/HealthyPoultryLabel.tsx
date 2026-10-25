import React from 'react';
import { HealthyPoultryCertificateV19 } from '../../types';

export function healthyLabelGateReasonsV19(c: HealthyPoultryCertificateV19): string[] {
  const reasons:string[]=[];
  if(!c.lab_verified) reasons.push('الفحص المخبري غير معتمد');
  if(!c.withdrawal_period_cleared) reasons.push('فترة السحب الدوائي غير مكتملة');
  if(!c.toxin_screen_cleared) reasons.push('فحص السموم غير مكتمل');
  if(!c.vet_signed) reasons.push('توقيع الطبيب غير موجود');
  if(c.public_status==='revoked') reasons.push('الشهادة مسحوبة');
  if(c.public_status==='expired' || new Date(c.valid_until).getTime() < Date.now()) reasons.push('الشهادة منتهية');
  return reasons;
}
export const canPublishHealthyLabelV19=(c:HealthyPoultryCertificateV19)=>healthyLabelGateReasonsV19(c).length===0;

export const HealthyPoultryLabel:React.FC<{certificate:HealthyPoultryCertificateV19;publicView?:boolean}>=({certificate,publicView=false})=>{
  const reasons=healthyLabelGateReasonsV19(certificate); const verified=!reasons.length;
  return <article className="sov-cert" dir="rtl">
    <div className="flex items-start justify-between gap-4"><div><div className="text-[10px] font-black text-emerald-300">{certificate.certificate_number}</div><h4 className="text-sm font-black text-white mt-1">{certificate.farm_name}</h4><p className="text-[11px] text-slate-400 mt-1">{certificate.public_summary}</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${verified?'border-emerald-500/30 bg-emerald-500/10 text-emerald-300':'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>{verified?'موثّق':'غير قابل للنشر'}</span></div>
    <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-slate-300"><span>مختبر: {certificate.lab_verified?'✓':'—'}</span><span>فترة السحب: {certificate.withdrawal_period_cleared?'✓':'—'}</span><span>السموم: {certificate.toxin_screen_cleared?'✓':'—'}</span><span>اعتماد الطبيب: {certificate.vet_signed?'✓':'—'}</span></div>
    {publicView&&<div className="mt-3 text-[10px] text-cyan-300 font-mono break-all">QR: {certificate.qr_public_code}</div>}
    {!verified&&<ul className="mt-3 text-[10px] text-rose-300 list-disc pr-4">{reasons.map(x=><li key={x}>{x}</li>)}</ul>}
  </article>;
};
