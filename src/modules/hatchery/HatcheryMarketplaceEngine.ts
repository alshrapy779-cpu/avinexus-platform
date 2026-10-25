import { ChickMarketingPriceV19, HatcherySupplierV19 } from '../../types';

export function availableChickOffersV19(hatcheries:HatcherySupplierV19[],prices:ChickMarketingPriceV19[],governorate?:string){
  const active=new Set(hatcheries.filter(h=>h.status==='active').map(h=>h.id));
  return prices.filter(p=>active.has(p.hatchery_id)&&p.published&&p.available_quantity>0&&(!governorate||p.governorate===governorate)).sort((a,b)=>Number(b.finance_verified_profitable)-Number(a.finance_verified_profitable)||b.available_quantity-a.available_quantity);
}

export function validateChickOfferForPublicationV19(price:ChickMarketingPriceV19){
  const reasons:string[]=[];
  if(price.available_quantity<=0)reasons.push('الكمية غير متاحة');
  if(!price.finance_verified_profitable)reasons.push('الربحية لم تعتمدها المالية');
  if(price.expected_margin_yer<=0)reasons.push('الهامش المتوقع غير موجب');
  return {publishable:reasons.length===0,reasons};
}
