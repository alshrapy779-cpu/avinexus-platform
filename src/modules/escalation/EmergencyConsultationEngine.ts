import { EmergencyConsultationV19, FieldChatThreadV19 } from '../../types';

export interface EscalationEvidenceV19 { mortality24hPercent?:number; repeatedFailure?:boolean; suspectedOutbreak?:boolean; supplyCritical?:boolean; qualityComplaint?:boolean; }

export function shouldEscalateV19(e:EscalationEvidenceV19,threshold=5){
  const reasons:string[]=[];
  if((e.mortality24hPercent??0)>=threshold)reasons.push(`النفوق خلال 24 ساعة ≥ ${threshold}%`);
  if(e.repeatedFailure)reasons.push('عدم استجابة الحالة بعد متابعة ميدانية');
  if(e.suspectedOutbreak)reasons.push('اشتباه بؤرة وبائية');
  if(e.supplyCritical)reasons.push('انقطاع توريد حرج');
  if(e.qualityComplaint)reasons.push('شكوى جودة صريحة');
  return {escalate:reasons.length>0,reasons,severity:reasons.length>=2||((e.mortality24hPercent??0)>=threshold*1.5)?'critical' as const:'high' as const};
}

export function createEmergencyConsultationV19(thread:FieldChatThreadV19,reason:string,mortality24hPercent?:number):EmergencyConsultationV19{
  const assessment=shouldEscalateV19({mortality24hPercent,suspectedOutbreak:thread.priority==='emergency'});
  return {id:`ec19-${Date.now()}`,created_at:new Date().toISOString(),case_id:thread.case_id,thread_id:thread.id,reason,
    mortality_24h_percent:mortality24hPercent,severity:assessment.severity,assigned_consultants:['الاستشاري المناوب','الطبيب المسؤول عن المزرعة'],status:'queued',human_final_decision_required:true};
}
