import { ExecutiveIssueV19, SovereigntyV19State } from '../../types';

export function buildExecutiveIssuesV19(state:SovereigntyV19State):ExecutiveIssueV19[]{
  const now=new Date().toISOString(); const out:ExecutiveIssueV19[]=[];
  for(const signal of state.epidemic_signals.filter(s=>s.status==='critical'||s.mortality_signal_percent>=state.config.mortality_escalation_percent_24h))out.push({id:`exec-epi-${signal.id}`,created_at:now,category:'epidemic',title:`خطر وبائي - ${signal.governorate}/${signal.district}`,summary:`مؤشر الخطر ${signal.risk_score}/100 ونفوق ${signal.mortality_signal_percent}%`,severity:'critical',owner:'Veterinary Command',status:'open',executive_action_required:true});
  for(const route of state.logistics_routes.filter(r=>r.route_status==='blocked'||r.route_status==='manual_review'))out.push({id:`exec-supply-${route.id}`,created_at:now,category:'supply_crisis',title:`استثناء توريد - ${route.requested_product_name}`,summary:route.decision_reason,severity:route.criticality==='emergency'?'critical':'high',owner:'Supply Chain',status:'open',executive_action_required:route.criticality==='emergency'});
  for(const cert of state.healthy_certificates.filter(c=>c.public_status==='revoked'))out.push({id:`exec-quality-${cert.id}`,created_at:now,category:'quality_complaint',title:`شهادة جودة مسحوبة - ${cert.farm_name}`,summary:`الشهادة ${cert.certificate_number} غير صالحة للنشر العام.`,severity:'high',owner:'Quality Assurance',status:'open',executive_action_required:false});
  return out;
}

export function executiveDigestMetricsV19(state:SovereigntyV19State){
  const financeVolume=state.financial_documents.filter(d=>d.status!=='void').reduce((s,d)=>s+d.gross_amount,0);
  return {activeOffices:state.market_offices.filter(o=>o.status==='active').length,availableVets:state.freelance_vets.filter(v=>v.status==='available').length,pendingPods:state.proof_of_delivery.filter(p=>p.status==='awaiting_arrival').length,criticalSignals:state.epidemic_signals.filter(s=>s.status==='critical').length,financeVolume};
}
