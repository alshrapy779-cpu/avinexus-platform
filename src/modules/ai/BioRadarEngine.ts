import { EpidemicSignalV19 } from '../../types';

export interface BioRadarSummaryV19 {
  active: number;
  critical: number;
  warning: number;
  weightedRisk: number;
  affectedGovernorates: string[];
  recommendedAction: 'routine_monitoring' | 'heightened_biosecurity' | 'vet_command_review';
}

export function buildBioRadar(signals: EpidemicSignalV19[]): BioRadarSummaryV19 {
  const active = signals.filter(s => s.status !== 'resolved');
  const weightedRisk = active.length ? Math.round(active.reduce((sum,s) => sum + s.risk_score * Math.max(.35, s.confidence_percent / 100), 0) / active.length) : 0;
  const critical = active.filter(s => s.status === 'critical').length;
  const warning = active.filter(s => s.status === 'warning').length;
  return {
    active:active.length,
    critical,
    warning,
    weightedRisk,
    affectedGovernorates:[...new Set(active.map(s => s.governorate))],
    recommendedAction: critical > 0 || weightedRisk >= 75 ? 'vet_command_review' : warning > 0 || weightedRisk >= 50 ? 'heightened_biosecurity' : 'routine_monitoring'
  };
}

export function mergeNearbySignalsV19(signals: EpidemicSignalV19[]) {
  const groups = new Map<string, EpidemicSignalV19[]>();
  for (const signal of signals.filter(s => s.status !== 'resolved')) {
    const key = `${signal.governorate}|${signal.district}|${signal.disease_group}`;
    groups.set(key, [...(groups.get(key) || []), signal]);
  }
  return [...groups.entries()].map(([key, items]) => ({
    key,
    governorate:items[0].governorate,
    district:items[0].district,
    disease_group:items[0].disease_group,
    suspected_cases:items.reduce((n,s)=>n+s.suspected_cases,0),
    confirmed_cases:items.reduce((n,s)=>n+s.confirmed_cases,0),
    max_risk_score:Math.max(...items.map(s=>s.risk_score)),
    confidence_percent:Math.round(items.reduce((n,s)=>n+s.confidence_percent,0)/items.length),
    forecast_window_hours:Math.min(...items.map(s=>s.forecast_window_hours)),
    requires_vet_review:items.some(s=>s.requires_vet_review)
  }));
}

export function buildPreventiveBroadcastV19(signal: EpidemicSignalV19) {
  return {
    title:`تنبيه أمان حيوي - ${signal.governorate}/${signal.district}`,
    radius_km:signal.radius_km,
    message:signal.prevention_message,
    classification:signal.status,
    medicalDecision:false,
    vetReviewRequired:true,
    note:'تنبيه وقائي مبني على إشارات؛ لا يمثل تشخيصاً مؤكداً ولا يصف علاجاً.'
  };
}
