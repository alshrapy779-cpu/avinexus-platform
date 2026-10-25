import { SovereigntyV19State, HealthyPoultryCertificateV19, DigitalTwinSnapshotV19, DynamicPricingSuggestionV19 } from '../types';
import { routeLogistics, chooseFreelanceVet, findAlternatives, LogisticsRequest } from '../modules/logistics/AILogisticsRoutingEngine';
import { canPublishHealthyLabelV19 } from '../modules/marketplace/HealthyPoultryLabel';
import { simulateDigitalTwin, DigitalTwinInputV19 } from '../modules/ai/DigitalTwinSimulator';
import { buildDynamicPrice, DynamicPricingInputV19 } from '../modules/ai/DynamicPricingEngine';
import { buildBioRadar } from '../modules/ai/BioRadarEngine';

export type LogisticsRequestV19 = LogisticsRequest;
export { canPublishHealthyLabelV19 };

export const chooseFreelanceVetV19 = chooseFreelanceVet;
export const routeLogisticsV19 = routeLogistics;
export const findAlternativeV19 = (state:SovereigntyV19State,requestedProductId:string) => findAlternatives(state,requestedProductId);
export const simulateDigitalTwinV19 = (input:DigitalTwinInputV19):DigitalTwinSnapshotV19 => simulateDigitalTwin(input);
export const buildDynamicPriceV19 = (base:DynamicPricingInputV19):DynamicPricingSuggestionV19 => buildDynamicPrice(base);
export const buildBioRadarV19 = buildBioRadar;

export function publicHealthyCertificateV19(c:HealthyPoultryCertificateV19){
  if(!canPublishHealthyLabelV19(c)) return {verified:false,qr_public_code:c.qr_public_code};
  return {verified:true,certificate_number:c.certificate_number,farm_name:c.farm_name,issue_date:c.issue_date,valid_until:c.valid_until,
    lab_verified:c.lab_verified,withdrawal_period_cleared:c.withdrawal_period_cleared,toxin_screen_cleared:c.toxin_screen_cleared,vet_signed:c.vet_signed,public_summary:c.public_summary};
}

export function executiveMetricsV19(state:SovereigntyV19State){
  const verifiedLabels=state.healthy_certificates.filter(canPublishHealthyLabelV19).length;
  const openIssues=state.executive_issues.filter(i=>i.status!=='resolved').length;
  const pendingPods=state.proof_of_delivery.filter(p=>p.status==='awaiting_arrival').length;
  const routeExceptions=state.logistics_routes.filter(r=>['manual_review','blocked'].includes(r.route_status)).length;
  const financeVolume=state.financial_documents.filter(d=>d.status!=='void').reduce((s,d)=>s+d.gross_amount,0);
  const activeOffices=state.market_offices.filter(o=>o.status==='active').length;
  const bio=buildBioRadar(state.epidemic_signals);
  return {verifiedLabels,openIssues,pendingPods,routeExceptions,financeVolume,activeOffices,bio};
}
