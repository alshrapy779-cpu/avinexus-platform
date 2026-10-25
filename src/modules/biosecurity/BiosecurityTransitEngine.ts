import { BiosecurityTransitPermitV19, EpidemicSignalV19 } from '../../types';

export function validateTransitPermitV19(permit:BiosecurityTransitPermitV19,signals:EpidemicSignalV19[]){
  const now=Date.now(); const reasons:string[]=[];
  if(!permit.disinfection_verified)reasons.push('تعقيم المركبة غير موثّق');
  if(new Date(permit.expires_at).getTime()<=now)reasons.push('التصريح منتهي');
  const outbreak=signals.find(s=>s.status==='critical'&&(permit.origin.includes(s.governorate)||permit.destination.includes(s.governorate)));
  if(outbreak)reasons.push(`حظر وبائي نشط: ${outbreak.governorate}/${outbreak.district}`);
  return {allowed:reasons.length===0,reasons,status:reasons.some(r=>r.includes('وبائي'))?'blocked_by_outbreak' as const:reasons.length?'pending' as const:'active' as const};
}

export function issueTransitPermitV19(input:Omit<BiosecurityTransitPermitV19,'id'|'issued_at'|'status'>,signals:EpidemicSignalV19[]):BiosecurityTransitPermitV19{
  const draft={...input,id:`btp19-${Date.now()}`,issued_at:new Date().toISOString(),status:'pending' as const};
  return {...draft,status:validateTransitPermitV19(draft,signals).status};
}
