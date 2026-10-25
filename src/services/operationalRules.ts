import {
  ExchangeRateSettings,
  GovernorateCurrencyRule,
  Prescription,
  RegionalCurrencyMode,
  ZoneServicePrice
} from '../types';

export interface WithdrawalDecision {
  blocked: boolean;
  safeDate?: string;
  remainingDays: number;
  activePrescription?: Prescription;
  badge: 'antibiotic_free' | 'withdrawal_completed' | 'under_withdrawal';
  message: string;
}

const normalizeDate = (value: string) => {
  const datePart = value.includes('T') ? value.split('T')[0] : value.split(' ')[0];
  return new Date(`${datePart}T00:00:00`);
};

export function evaluateWithdrawalSafety(
  prescriptions: Prescription[],
  flockId: string,
  now: Date = new Date()
): WithdrawalDecision {
  const flockPrescriptions = prescriptions.filter((rx) => rx.flock_id === flockId);
  if (flockPrescriptions.length === 0) {
    return {
      blocked: false,
      remainingDays: 0,
      badge: 'antibiotic_free',
      message: 'لا توجد وصفات دوائية مسجلة على هذا القطيع؛ يمكن إرسال طلب التسويق للمراجعة.'
    };
  }

  const latestUnsafe = flockPrescriptions
    .filter((rx) => rx.harvest_safe_date)
    .map((rx) => ({ rx, safe: normalizeDate(rx.harvest_safe_date) }))
    .sort((a, b) => b.safe.getTime() - a.safe.getTime())[0];

  if (!latestUnsafe) {
    return {
      blocked: false,
      remainingDays: 0,
      badge: 'withdrawal_completed',
      message: 'لا توجد فترة سحب نشطة مسجلة.'
    };
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = latestUnsafe.safe.getTime() - today.getTime();
  const remainingDays = Math.max(0, Math.ceil(diffMs / 86400000));

  if (remainingDays > 0 && latestUnsafe.rx.withdrawal_days > 0) {
    return {
      blocked: true,
      safeDate: latestUnsafe.rx.harvest_safe_date,
      remainingDays,
      activePrescription: latestUnsafe.rx,
      badge: 'under_withdrawal',
      message: `عفواً، القطيع تحت تأثير فترة سحب العلاج. متبقي ${remainingDays} يوم لضمان سلامة المنتج والمستهلك.`
    };
  }

  return {
    blocked: false,
    safeDate: latestUnsafe.rx.harvest_safe_date,
    remainingDays: 0,
    activePrescription: latestUnsafe.rx,
    badge: latestUnsafe.rx.medication_category === 'antibiotic' ? 'withdrawal_completed' : 'antibiotic_free',
    message: latestUnsafe.rx.medication_category === 'antibiotic'
      ? 'اكتملت فترة السحب المسجلة ويمكن إرسال طلب التسويق للمراجعة.'
      : 'لا توجد مضادات حيوية فعالة ضمن فترة سحب؛ القطيع مؤهل مبدئياً لشارة الأمان.'
  };
}

export function getCurrencyMode(
  governorate: string,
  rules: GovernorateCurrencyRule[]
): RegionalCurrencyMode {
  return rules.find((rule) => rule.active && governorate.includes(rule.governorate))?.currency_mode || 'YER_OLD_SAR';
}

export function convertReferenceYerOld(
  referenceYerOld: number,
  mode: RegionalCurrencyMode,
  rates: ExchangeRateSettings
) {
  const sar = referenceYerOld / rates.sar_to_yer_old;
  const localYer = mode === 'YER_NEW_SAR' ? sar * rates.sar_to_yer_new : referenceYerOld;
  return {
    localYer: Math.round(localYer),
    sar: Number(sar.toFixed(2)),
    label: mode === 'YER_NEW_SAR' ? 'ريال يمني جديد' : 'ريال يمني قديم'
  };
}

export function findZonePrice(
  governorate: string,
  locationName: string,
  zones: ZoneServicePrice[]
): ZoneServicePrice | undefined {
  return zones.find(
    (zone) =>
      zone.status === 'active' &&
      governorate.includes(zone.governorate) &&
      (locationName.includes(zone.district) || zone.district.includes(locationName))
  );
}
