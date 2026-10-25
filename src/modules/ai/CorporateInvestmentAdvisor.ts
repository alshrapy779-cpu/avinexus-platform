import { CorporateInvestmentSignalV19 } from '../../types';
export interface SupplyDemandPointV19 { governorate:string; category:string; demand:number; supply:number; }
export function buildCorporateInvestmentSignalsV19(points:SupplyDemandPointV19[],forecastDays=30):CorporateInvestmentSignalV19[]{
  return points.map((p,i)=>{const gap=p.demand<=0?0:Math.max(-100,Math.min(100,(p.demand-p.supply)/p.demand*100)); const allocation=Math.max(0,Math.min(60,gap*.6)); return {id:`cis19-${Date.now()}-${i}`,generated_at:new Date().toISOString(),governorate:p.governorate,category:p.category,forecast_days:forecastDays,demand_gap_percent:Number(gap.toFixed(1)),recommended_allocation_percent:Number(allocation.toFixed(1)),rationale:gap>0?'توجد فجوة عرض مقارنة بالطلب المدخل؛ الإشارة تخطيطية وتحتاج تحققاً تجارياً.':'لا تظهر فجوة عرض موجبة في البيانات المدخلة.',confidence_percent:65,status:'advisory'};});
}
