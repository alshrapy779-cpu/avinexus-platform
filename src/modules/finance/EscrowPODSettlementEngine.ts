import { FinancialDocumentV19, ProofOfDeliveryV19, SmartEscrowContractV19, V19CurrencyCode } from '../../types';

export function canReleaseEscrowV19(contract:SmartEscrowContractV19,fulfilledConditions:string[]){
  const missing=contract.release_conditions.filter(c=>!fulfilledConditions.includes(c));
  return {canRelease:contract.status==='funded'&&missing.length===0,missing};
}

export function settlePodV19(pod:ProofOfDeliveryV19,receivedQuantity:number,confirmedBy:string,currency:V19CurrencyCode='YER_OLD'){
  const matched=receivedQuantity===pod.expected_quantity; const now=new Date().toISOString();
  const documentId=`fd19-pod-${Date.now()}`;
  const updated:ProofOfDeliveryV19={...pod,received_quantity:receivedQuantity,confirmed_by:confirmedBy,confirmed_at:now,
    status:matched?'settled':'discrepancy',discrepancy_note:matched?undefined:`فرق كمية: المتوقع ${pod.expected_quantity} والمستلم ${receivedQuantity}`,settlement_document_id:matched?documentId:undefined};
  const document:FinancialDocumentV19|undefined=matched?{id:documentId,document_number:`POD-${String(Date.now()).slice(-7)}`,created_at:now,type:'pod_settlement',counterparty:pod.office_name,reference:pod.shipment_reference,currency,gross_amount:0,platform_commission:0,net_amount:0,status:'issued',created_by:confirmedBy}:undefined;
  return {pod:updated,document};
}
