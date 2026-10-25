import { FinancialPolicyRuleV19, FxRateV19, V19CurrencyCode } from '../../types';

export function approvedFxRateV19(rates:FxRateV19[],pair:FxRateV19['pair']){
  return rates.filter(r=>r.pair===pair&&r.status==='approved').sort((a,b)=>new Date(b.effective_at).getTime()-new Date(a.effective_at).getTime())[0];
}

export function calculatePlatformProfitV19(rule:FinancialPolicyRuleV19,gross:number,units=1){
  if(!rule.active)return 0;
  return rule.profit_mode==='percent'?Math.round(gross*rule.profit_value/100):Math.round(rule.profit_value*Math.max(1,units));
}

export function convertCurrencyV19(amount:number,from:V19CurrencyCode,to:V19CurrencyCode,rates:FxRateV19[]){
  if(from===to)return amount;
  const direct=`${from.replace('SAR','SAR').replace('YER_OLD','YER_OLD').replace('YER_NEW','YER_NEW')}_${to}`;
  const reverse=`${to}_${from}`;
  const d=rates.find(r=>r.pair===direct&&r.status==='approved'); if(d)return amount*d.rate;
  const r=rates.find(x=>x.pair===reverse&&x.status==='approved'); if(r&&r.rate!==0)return amount/r.rate;
  throw new Error(`لا يوجد سعر صرف معتمد للمسار ${from} -> ${to}`);
}

export function profitabilityGuardV19(revenue:number,directCost:number,freight:number,platformProfit:number,minMarginPercent=3){
  const net=revenue-directCost-freight-platformProfit; const margin=revenue>0?net/revenue*100:0;
  return {profitable:net>0&&margin>=minMarginPercent,net,marginPercent:Number(margin.toFixed(2)),requiresFinanceApproval:margin<minMarginPercent};
}
