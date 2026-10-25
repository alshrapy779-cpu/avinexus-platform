import React from 'react';
import { DigitalTwinSnapshotV19 } from '../../types';

export type DigitalTwinInputV19 = Pick<DigitalTwinSnapshotV19,'farm_name'|'flock_id'|'age_days'|'birds_alive'|'temperature_c'|'humidity_percent'|'ventilation_index'|'feed_kg_day'|'current_weight_g'|'current_fcr'>;

export function simulateDigitalTwin(input: DigitalTwinInputV19): DigitalTwinSnapshotV19 {
  const tempPenalty=Math.max(0,Math.abs(input.temperature_c-24)*.018);
  const humidityPenalty=Math.max(0,Math.abs(input.humidity_percent-60)*.002);
  const ventilationBenefit=Math.max(-.05,Math.min(.06,(input.ventilation_index-65)/500));
  const climatePenalty=tempPenalty+humidityPenalty;
  const dailyGain=Math.max(35,68*(1-climatePenalty+ventilationBenefit));
  const predictedWeight=Math.round(input.current_weight_g+dailyGain*10);
  const predictedFcr=Number(Math.max(1.25,input.current_fcr+climatePenalty*.35-ventilationBenefit*.25).toFixed(2));
  const feedSaving=Math.round(Math.max(0,input.feed_kg_day*10*Math.max(0,ventilationBenefit+.015)));
  return {...input,id:`dt19-${Date.now()}`,generated_at:new Date().toISOString(),predicted_weight_10d_g:predictedWeight,predicted_fcr_10d:predictedFcr,
    projected_feed_saving_kg:feedSaving,projected_margin_delta_yer:feedSaving*380,
    recommendation:'محاكاة إرشادية لمقارنة السيناريوهات؛ أي تعديل ميداني في الحرارة أو التهوية أو البرنامج العلاجي يحتاج تحقق المشرف والطبيب.',confidence_percent:72};
}

export const DigitalTwinSimulator:React.FC<{snapshot:DigitalTwinSnapshotV19}>=({snapshot})=><div className="sov-ai-card" dir="rtl">
  <div className="flex items-center justify-between gap-3"><b className="text-sm text-white">{snapshot.farm_name}</b><span className="text-[10px] text-cyan-300">ثقة {snapshot.confidence_percent}%</span></div>
  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]"><div>الوزن المتوقع: <b>{snapshot.predicted_weight_10d_g} جم</b></div><div>FCR المتوقع: <b>{snapshot.predicted_fcr_10d}</b></div><div>توفير العلف: <b>{snapshot.projected_feed_saving_kg} كجم</b></div><div>الأثر المالي: <b>{snapshot.projected_margin_delta_yer}</b></div></div>
  <p className="text-[10px] text-slate-400 mt-3">{snapshot.recommendation}</p>
</div>;
