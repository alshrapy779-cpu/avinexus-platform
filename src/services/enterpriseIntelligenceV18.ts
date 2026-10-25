import {
  BreedRegionalStandardV18, ChickReservationV18, CreditQualityScoreV18,
  EnterpriseOperationsV11State, FeedReplenishmentAlertV18, GeoOutbreakAlertV18,
  MarketForecastV18, SampleTrackingCaseV18
} from '../types';

export const clamp = (n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));

export function evaluateChickReadinessV18(input:{farm_cleaned:boolean;biosecurity_closed:boolean;downtime_days:number;minimum_downtime_days:number}) {
  let score=0;
  if(input.farm_cleaned) score+=35;
  if(input.biosecurity_closed) score+=35;
  score+=Math.min(30, Math.round((input.downtime_days/Math.max(1,input.minimum_downtime_days))*30));
  score=clamp(score);
  return {score,status:(score>=90?'ready':score>=65?'needs_review':'not_ready') as ChickReservationV18['readiness_status']};
}

export function calculateChickPackageV18(base:number,transport:number,labPct:number,feedPct:number,emergencyPct:number){
  const reserve_lab_yer=Math.round(base*labPct/100);
  const reserve_feed_yer=Math.round(base*feedPct/100);
  const reserve_emergency_yer=Math.round(base*emergencyPct/100);
  return {reserve_lab_yer,reserve_feed_yer,reserve_emergency_yer,total_package_yer:base+transport+reserve_lab_yer+reserve_feed_yer+reserve_emergency_yer};
}

export function findAdminStandardV18(rules:BreedRegionalStandardV18[],strain:string,governorate:string,ageDays:number){
  return rules.find(r=>r.active&&r.strain===strain&&r.governorate===governorate&&ageDays>=r.min_age_days&&ageDays<=r.max_age_days)
    ||rules.find(r=>r.active&&r.strain===strain&&r.governorate==='ALL'&&ageDays>=r.min_age_days&&ageDays<=r.max_age_days);
}

export function calculateFarmRecommendationV18(rule:BreedRegionalStandardV18|undefined,birds:number){
  if(!rule) return undefined;
  return {
    feed_kg:Number(((rule.daily_feed_g_per_bird*birds)/1000).toFixed(1)),
    water_liters:Number(((rule.daily_water_ml_per_bird*birds)/1000).toFixed(1)),
    target_weight_g:rule.target_weight_g,
    temperature_c:rule.temperature_c,
    humidity_range:`${rule.humidity_min}-${rule.humidity_max}%`,
    density_birds_m2:rule.max_density_birds_m2,
    feed_form:rule.feed_form,
    vaccination_program_id:rule.vaccination_program_id,
    safety_note:'القيم مأخوذة من معيار الإدارة فقط. أي لقاح/دواء يحتاج بروتوكولاً أو اعتماداً بيطرياً؛ الذكاء الاصطناعي لا يصف مضاداً.'
  };
}

export function computeCreditQualityScoreV18(parts:{production:number;payment:number;delivery:number;quality:number;biosecurity:number}){
  const composite=Math.round(parts.production*.25+parts.payment*.25+parts.delivery*.15+parts.quality*.2+parts.biosecurity*.15);
  const grade:CreditQualityScoreV18['grade']=composite>=82?'A':composite>=70?'B':composite>=55?'C':'D';
  return {composite,grade};
}

export function feedReplenishmentV18(input:{currentStockKg:number;dailyKg:number;thresholdDays:number;coverDays?:number}){
  const days=input.dailyKg>0?input.currentStockKg/input.dailyKg:99;
  const reorder=days<=input.thresholdDays;
  const cover=input.coverDays??5;
  return {days_remaining:Number(days.toFixed(1)),status:(reorder?'reorder_now':'monitoring') as FeedReplenishmentAlertV18['status'],recommended_order_kg:reorder?Math.max(0,Math.ceil(input.dailyKg*cover-input.currentStockKg)):0};
}

export function haversineKm(a:{lat:number;lng:number},b:{lat:number;lng:number}){
  const R=6371,toRad=(x:number)=>x*Math.PI/180;
  const dLat=toRad(b.lat-a.lat),dLon=toRad(b.lng-a.lng);
  const s=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(s));
}

export function farmsWithinOutbreakV18(alert:GeoOutbreakAlertV18,farms:Array<{id:string;location_gps:{lat:number;lng:number}}>){
  return farms.filter(f=>haversineKm({lat:alert.source_lat,lng:alert.source_lng},f.location_gps)<=alert.radius_km).map(f=>f.id);
}

export function buildMarketForecastV18(history:Array<{date:string;poultry_price_yer:number;feed_price_yer:number}>,governorate:string):MarketForecastV18{
  const vals=history.map(x=>x.poultry_price_yer); const first=vals[0]||0,last=vals.at(-1)||0;
  const change=first?((last-first)/first)*100:0; const trend=change>3?'up':change<-3?'down':'flat';
  const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:last;
  return {id:`forecast-v18-${Date.now()}`,governorate,generated_at:new Date().toISOString(),horizon_days:30,historical:history,trend,seasonal_note:'توقع إرشادي من سجل الأسعار الداخلي؛ لا يمثل وعداً أو سعراً مضموناً.',forecast_min_yer:Math.round(avg*.94),forecast_max_yer:Math.round(avg*1.08),confidence_percent:Math.min(75,45+history.length*4),advisory_note:'استخدم الاتجاه للتخطيط مع مراجعة مسؤول المبيعات والظروف المحلية.',approved_for_display:false};
}

export function canReleaseLabResultV18(sample:SampleTrackingCaseV18,enterprise:EnterpriseOperationsV11State){
  if(!enterprise.v18_config.require_vet_signature_before_lab_release) return true;
  return Boolean(sample.vet_signed_at&&sample.vet_signed_by&&sample.final_decision);
}
