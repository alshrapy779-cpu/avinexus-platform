import { DynamicPricingSuggestionV19, V19CurrencyCode } from '../../types';

export interface DynamicPricingInputV19 {
  governorate:string; category:string; current_price:number; currency:V19CurrencyCode;
  demand_index:number; supply_index:number; transport_index:number; fx_index:number;
  unit_cost?:number; minimum_margin_percent?:number; expected_margin_percent?:number;
}

export function buildDynamicPrice(input: DynamicPricingInputV19): DynamicPricingSuggestionV19 {
  const pressure = ((input.demand_index-input.supply_index)*0.0025) + ((input.transport_index-50)*0.0008) + ((input.fx_index-50)*0.0005);
  let factor = Math.max(.92, Math.min(1.12, 1 + pressure));
  let suggested = Math.round(input.current_price * factor);
  const minMargin = input.minimum_margin_percent ?? 8;
  if (typeof input.unit_cost === 'number' && input.unit_cost > 0) {
    const floor = Math.ceil(input.unit_cost * (1 + minMargin/100));
    suggested = Math.max(suggested, floor);
  }
  const margin = typeof input.unit_cost === 'number' && input.unit_cost > 0 ? ((suggested-input.unit_cost)/suggested)*100 : 0;
  return {
    id:`dp19-${Date.now()}`, generated_at:new Date().toISOString(), governorate:input.governorate, category:input.category,
    current_price:input.current_price, suggested_price:suggested, currency:input.currency,
    demand_index:input.demand_index, supply_index:input.supply_index, transport_index:input.transport_index, fx_index:input.fx_index,
    expected_margin_percent:Number(margin.toFixed(1)), status:'draft',
    explanation:'اقتراح تشغيلي يعتمد على العرض والطلب والنقل والعملات وحد الربحية. لا يُنشر قبل اعتماد الإدارة.'
  };
}

export function approveDynamicPriceV19(suggestion: DynamicPricingSuggestionV19, approverRole: string) {
  const permitted = ['system_owner','ceo','sales_marketing','finance'].includes(approverRole);
  return permitted ? { ...suggestion, status:'approved' as const } : { ...suggestion, status:'rejected' as const };
}
