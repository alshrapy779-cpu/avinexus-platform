export interface PredictiveInputV15 {
  fcrCurrent: number;
  fcrBaseline: number;
  feedChangePercent: number;
  waterChangePercent: number;
  mortalityChangePercent: number;
  temperatureDeltaC: number;
  humidityDeltaPercent: number;
}

export function calculateDiseaseRiskV15(input: PredictiveInputV15) {
  const fcrPenalty = Math.max(0, input.fcrCurrent - input.fcrBaseline) * 120;
  const feedPenalty = Math.max(0, -input.feedChangePercent) * 2.2;
  const waterPenalty = Math.max(0, Math.abs(input.waterChangePercent) - 5) * 1.5;
  const mortalityPenalty = Math.max(0, input.mortalityChangePercent) * 1.4;
  const temperaturePenalty = Math.abs(input.temperatureDeltaC) * 7;
  const humidityPenalty = Math.max(0, Math.abs(input.humidityDeltaPercent) - 5) * 0.8;
  const score = Math.max(0, Math.min(100, Math.round(fcrPenalty + feedPenalty + waterPenalty + mortalityPenalty + temperaturePenalty + humidityPenalty)));
  const riskLevel = score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 35 ? 'medium' : 'low';
  return { score, riskLevel } as const;
}
