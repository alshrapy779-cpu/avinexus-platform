/**
 * initialData.ts
 * Real-world veterinary and poultry management seed data for Yemen
 * Supervision: Veterinary Advisory Team (الطبيب البيطري الاستشاري المعتمد)
 */

import {
  Farm,
  Flock,
  DailyLog,
  NecropsyCase,
  LabSensitivityResult,
  Prescription,
  AcousticAnalysisSession,
  MythBustingItem,
  EpidemiologicalOutbreak,
  BiosecurityAuditItem
} from '../types';

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-01',
    name: 'مزرعة وادي سبأ النموذجية للدواجن',
    owner_name: 'أحمد صالح العنسي',
    phone: '777-123456',
    location_name: 'صنعاء - بني حشيش',
    location_gps: { lat: 15.421, lng: 44.312 },
    system_type: 'مغلق أوتوماتيكي (Closed Modern)',
    capacity: 25000,
    biosecurity_score: 88,
    governorate: 'صنعاء'
  },
  {
    id: 'farm-02',
    name: 'مزارع الجنات للدواجن اللاحمة',
    owner_name: 'محمد عبد الله القيسي',
    phone: '771-987654',
    location_name: 'ذمار - قاع جهران',
    location_gps: { lat: 14.582, lng: 44.401 },
    system_type: 'نصف مغلق (Semi-closed)',
    capacity: 15000,
    biosecurity_score: 64, // below 70% risk alert!
    governorate: 'ذمار'
  },
  {
    id: 'farm-03',
    name: 'مزرعة الخير الحديثة',
    owner_name: 'فؤاد هزاع الشرعبي',
    phone: '733-456789',
    location_name: 'إب - وادي السحول',
    location_gps: { lat: 13.987, lng: 44.175 },
    system_type: 'مغلق أوتوماتيكي (Closed Modern)',
    capacity: 20000,
    biosecurity_score: 92,
    governorate: 'إب'
  }
];

export const INITIAL_FLOCKS: Flock[] = [
  {
    id: 'flock-101',
    farm_id: 'farm-01',
    farm_name: 'مزرعة وادي سبأ النموذجية للدواجن',
    flock_code: 'FLK-2026-08A',
    breed_type: 'Ross 308',
    initial_count: 12000,
    current_count: 11620,
    start_date: '2026-08-15',
    current_age_days: 30,
    status: 'active',
    target_market_weight_kg: 2.15,
    house_number: 'عنبر 1'
  },
  {
    id: 'flock-102',
    farm_id: 'farm-02',
    farm_name: 'مزارع الجنات للدواجن اللاحمة',
    flock_code: 'FLK-2026-09B',
    breed_type: 'Cobb 500',
    initial_count: 10000,
    current_count: 9140, // higher mortality!
    start_date: '2026-08-20',
    current_age_days: 25,
    status: 'active',
    target_market_weight_kg: 2.10,
    house_number: 'عنبر 3'
  },
  {
    id: 'flock-103',
    farm_id: 'farm-03',
    farm_name: 'مزرعة الخير الحديثة',
    flock_code: 'FLK-2026-07C',
    breed_type: 'Ross 308',
    initial_count: 15000,
    current_count: 14680,
    start_date: '2026-07-28',
    current_age_days: 38,
    status: 'harvested',
    target_market_weight_kg: 2.25,
    house_number: 'عنبر 2'
  }
];

// Breed standard performance curves for Ross 308 & Cobb 500 (Cumulative Feed g, Weight g, Daily water ml, mortality %)
export const BREED_STANDARDS: Record<string, { age: number; feed_g_day: number; water_ml_day: number; weight_g: number; cum_mortality_pct: number }[]> = {
  'Ross 308': [
    { age: 1, feed_g_day: 14, water_ml_day: 28, weight_g: 44, cum_mortality_pct: 0.2 },
    { age: 5, feed_g_day: 26, water_ml_day: 52, weight_g: 135, cum_mortality_pct: 0.5 },
    { age: 10, feed_g_day: 47, water_ml_day: 94, weight_g: 310, cum_mortality_pct: 0.8 },
    { age: 15, feed_g_day: 73, water_ml_day: 146, weight_g: 580, cum_mortality_pct: 1.1 },
    { age: 20, feed_g_day: 103, water_ml_day: 206, weight_g: 950, cum_mortality_pct: 1.4 },
    { age: 25, feed_g_day: 133, water_ml_day: 266, weight_g: 1410, cum_mortality_pct: 1.8 },
    { age: 30, feed_g_day: 160, water_ml_day: 320, weight_g: 1930, cum_mortality_pct: 2.2 },
    { age: 35, feed_g_day: 182, water_ml_day: 364, weight_g: 2470, cum_mortality_pct: 2.7 },
    { age: 38, feed_g_day: 191, water_ml_day: 382, weight_g: 2780, cum_mortality_pct: 3.0 },
  ],
  'Cobb 500': [
    { age: 1, feed_g_day: 13, water_ml_day: 27, weight_g: 43, cum_mortality_pct: 0.2 },
    { age: 5, feed_g_day: 25, water_ml_day: 50, weight_g: 132, cum_mortality_pct: 0.5 },
    { age: 10, feed_g_day: 46, water_ml_day: 92, weight_g: 305, cum_mortality_pct: 0.8 },
    { age: 15, feed_g_day: 71, water_ml_day: 142, weight_g: 570, cum_mortality_pct: 1.2 },
    { age: 20, feed_g_day: 101, water_ml_day: 202, weight_g: 940, cum_mortality_pct: 1.5 },
    { age: 25, feed_g_day: 130, water_ml_day: 260, weight_g: 1395, cum_mortality_pct: 2.0 },
    { age: 30, feed_g_day: 156, water_ml_day: 312, weight_g: 1905, cum_mortality_pct: 2.4 },
    { age: 35, feed_g_day: 178, water_ml_day: 356, weight_g: 2435, cum_mortality_pct: 2.9 },
    { age: 38, feed_g_day: 187, water_ml_day: 374, weight_g: 2730, cum_mortality_pct: 3.2 },
  ]
};

export const INITIAL_DAILY_LOGS: DailyLog[] = [
  // Logs for flock-101 (Ross 308 - Age 30)
  {
    id: 'log-01',
    flock_id: 'flock-101',
    date: '2026-09-10',
    day_age: 26,
    water_consumption_liters: 3200,
    feed_consumption_kg: 1580,
    temp_celsius: 25.5,
    humidity_percent: 58,
    mortality_count: 9,
    culling_count: 2,
    average_weight_grams: 1510,
    notes: 'القطيع نشط واستهلاك العلف ممتاز.',
    synced: true,
    sync_method: 'online'
  },
  {
    id: 'log-02',
    flock_id: 'flock-101',
    date: '2026-09-11',
    day_age: 27,
    water_consumption_liters: 3350,
    feed_consumption_kg: 1640,
    temp_celsius: 26.0,
    humidity_percent: 56,
    mortality_count: 8,
    culling_count: 1,
    average_weight_grams: 1620,
    notes: 'تم فحص أجهزة السقايات الأوتوماتيكية.',
    synced: true,
    sync_method: 'online'
  },
  {
    id: 'log-03',
    flock_id: 'flock-101',
    date: '2026-09-12',
    day_age: 28,
    water_consumption_liters: 3480,
    feed_consumption_kg: 1710,
    temp_celsius: 25.2,
    humidity_percent: 60,
    mortality_count: 11,
    culling_count: 3,
    average_weight_grams: 1725,
    notes: 'بدء ملاحظة أصوات شخير ليلية خفيفة في نهاية العنبر.',
    synced: true,
    sync_method: 'online'
  },
  {
    id: 'log-04',
    flock_id: 'flock-101',
    date: '2026-09-13',
    day_age: 29,
    water_consumption_liters: 3520,
    feed_consumption_kg: 1760,
    temp_celsius: 26.8,
    humidity_percent: 54,
    mortality_count: 14,
    culling_count: 4,
    average_weight_grams: 1830,
    notes: 'تسجيل مقطع صوتي 30 ثانية لكشف الخشخشة التنفسية.',
    synced: true,
    sync_method: 'online'
  },
  {
    id: 'log-05',
    flock_id: 'flock-101',
    date: '2026-09-14',
    day_age: 30,
    water_consumption_liters: 3600,
    feed_consumption_kg: 1810,
    temp_celsius: 26.1,
    humidity_percent: 57,
    mortality_count: 16,
    culling_count: 5,
    average_weight_grams: 1940,
    notes: 'تم أخذ عينتين للتشريح الموجه بالذكاء الاصطناعي.',
    synced: true,
    sync_method: 'online'
  },

  // Logs for flock-102 (Cobb 500 - Age 25 - high risk case!)
  {
    id: 'log-11',
    flock_id: 'flock-102',
    date: '2026-09-12',
    day_age: 23,
    water_consumption_liters: 1900,
    feed_consumption_kg: 1050, // lower than standard
    temp_celsius: 31.0, // high heat stress
    humidity_percent: 38,
    mortality_count: 48,
    culling_count: 12,
    average_weight_grams: 1180,
    notes: 'انخفاض واضح في الشهية والطيور متجمعة قرب الجدران.',
    synced: true,
    sync_method: 'sms_fallback'
  },
  {
    id: 'log-12',
    flock_id: 'flock-102',
    date: '2026-09-13',
    day_age: 24,
    water_consumption_liters: 1850,
    feed_consumption_kg: 980,
    temp_celsius: 32.5,
    humidity_percent: 35,
    mortality_count: 65,
    culling_count: 18,
    average_weight_grams: 1220,
    notes: 'إسهالات بيضاء وطبقية وذرق مصفر مائي.',
    synced: true,
    sync_method: 'online'
  },
  {
    id: 'log-13',
    flock_id: 'flock-102',
    date: '2026-09-14',
    day_age: 25,
    water_consumption_liters: 1780,
    feed_consumption_kg: 920,
    temp_celsius: 32.0,
    humidity_percent: 36,
    mortality_count: 78,
    culling_count: 22,
    average_weight_grams: 1260,
    notes: 'حالة طوارئ - تم رفع ملف الصفة التشريحية والتسجيل الصوتي للاستشاري.',
    synced: true,
    sync_method: 'online'
  }
];

export const INITIAL_NECROPSY_CASES: NecropsyCase[] = [
  {
    id: 'case-2026-001',
    flock_id: 'flock-102',
    flock_code: 'FLK-2026-09B',
    farm_name: 'مزارع الجنات للدواجن اللاحمة (ذمار)',
    created_at: '2026-09-14 09:30',
    bird_age_days: 25,
    sample_count: 3,
    observations: [
      {
        organ: 'bursa',
        organ_name_ar: 'كيس بورسيا (Bursa of Fabricius)',
        status: 'severe_lesions',
        lesion_description: 'تضخم شديد مع وذمة جيلاتينية ونزف نمشي حاد في الثنيات المخاطية وتغير اللون إلى الكرزي المائل للبني.'
      },
      {
        organ: 'liver',
        organ_name_ar: 'الكبد (Liver)',
        status: 'suspicious',
        lesion_description: 'تضخم واحتقان طفيف مع حواف شاحبة صفراء.'
      },
      {
        organ: 'intestine',
        organ_name_ar: 'الأمعاء (Intestines)',
        status: 'suspicious',
        lesion_description: 'مخاط زائد في الاثني عشر مع التهاب نزلي خفيف.'
      },
      {
        organ: 'trachea',
        organ_name_ar: 'القصبة الهوائية (Trachea)',
        status: 'normal',
        lesion_description: 'الغشاء المخاطي وردي طبيعي بدون إفرازات متجبنة.'
      },
      {
        organ: 'droppings',
        organ_name_ar: 'الذرق (Droppings)',
        status: 'severe_lesions',
        lesion_description: 'ذرق مائي أبيض طباشيري (Urate deposits) ملتصق بريش فتحة المجمع.'
      }
    ],
    ai_prediction: {
      primary_disease: 'مرض الجمبورو الحاد (Infectious Bursal Disease - IBD)',
      confidence_score: 93,
      differential_diagnoses: [
        { disease: 'مرض الجمبورو النمطي (IBD Classic)', probability: 93 },
        { disease: 'تسمم كلوي وارتفاع اليورات (Visceral Gout)', probability: 45 },
        { disease: 'مرض النيوكاسل المعوي الحشوي (vvND)', probability: 28 },
        { disease: 'تسمم فطري (Mycotoxicosis)', probability: 22 }
      ],
      pathological_findings: [
        'التهاب وتضخم نزفي شديد في غدة فابريشيا (كيس بورسيا).',
        'تراكم أملاح اليورات في الكليتين ومخرجات الذرق.',
        'نزف عضلي سطحي على عضلات الفخذ والصدر.',
        'هبوط مناعي حاد يهدد بعدوى بكتيرية ثانوية (E. Coli).'
      ],
      recommended_lab_tests: [
        'فحص PCR أو ELISA لتأكيد عترة الجمبورو الفيروسية.',
        'فحص حساسية بكتيرية للمكورات القولونية المترافقة (Colibacillosis Antibiotic Sensitivity).'
      ],
      emergency_level: 'حرج (طارئ)'
    },
    vet_approval_status: 'pending'
  },
  {
    id: 'case-2026-002',
    flock_id: 'flock-101',
    flock_code: 'FLK-2026-08A',
    farm_name: 'مزرعة وادي سبأ النموذجية للدواجن (صنعاء)',
    created_at: '2026-09-13 16:45',
    bird_age_days: 29,
    sample_count: 2,
    observations: [
      {
        organ: 'trachea',
        organ_name_ar: 'القصبة الهوائية (Trachea)',
        status: 'suspicious',
        lesion_description: 'احتقان شعيري خفيف مع مخاط مصلي في الثلث العلوي للقصبة.'
      },
      {
        organ: 'liver',
        organ_name_ar: 'الكبد (Liver)',
        status: 'normal',
        lesion_description: 'لون وملمس وحواف كبدية سليمة بدون تغطية ليفية.'
      },
      {
        organ: 'intestine',
        organ_name_ar: 'الأمعاء (Intestines)',
        status: 'normal',
        lesion_description: 'جدار معوي سليم ومحتويات غذائية مهضومة.'
      },
      {
        organ: 'bursa',
        organ_name_ar: 'كيس بورسيا (Bursa of Fabricius)',
        status: 'normal',
        lesion_description: 'حجم طبيعي مناسب للعمر 29 يوماً وبنية متماسكة.'
      },
      {
        organ: 'droppings',
        organ_name_ar: 'الذرق (Droppings)',
        status: 'normal',
        lesion_description: 'قوام متماسك باللون الرمادي المخضر مع قبعة بولية بيضاء طبيعية.'
      }
    ],
    ai_prediction: {
      primary_disease: 'متلازمة التهاب الجهاز التنفسي المزمن المبكر (Early CRD - Mycoplasma gallisepticum)',
      confidence_score: 76,
      differential_diagnoses: [
        { disease: 'ميكوبلازما طيور تنفسية (Mycoplasma gallisepticum)', probability: 76 },
        { disease: 'التهاب الشعب الهوائية المعدي خفيف (Infectious Bronchitis - IB)', probability: 48 },
        { disease: 'تهيج غباري وتهوية غير كافية (Ammonia & Dust Irritation)', probability: 40 }
      ],
      pathological_findings: [
        'احتقان الغشاء المخاطي للقصبة الهوائية.',
        'إفرازات مصلية خفيفة في الأكياس الهوائية البطنية.',
        'غياب الآفات النخرية أو النزفية في الأحشاء الحيوية.'
      ],
      recommended_lab_tests: [
        'فحص مصل الدم السريع SPA للميكوبلازما.',
        'فحص حساسية بكتيرية في حال تقرر العلاج بالمضادات الحيوية.'
      ],
      emergency_level: 'متوسط'
    },
    vet_diagnosis: 'تهيج تنفسي مبكر مرتبط برطوبة الفرشة مع اشتباه ميكوبلازما تنفسية.',
    vet_notes: 'يوصى بتعديل دورة الشفاطات وتدفئة هواء الاستقبال، ومنع استخدام المضادات الحيوية دون فحص حساسية مخبري.',
    vet_approval_status: 'approved',
    vet_name: 'الطبيب البيطري الاستشاري المعتمد',
    approved_at: '2026-09-13 18:20'
  }
];

export const INITIAL_LAB_REPORTS: LabSensitivityResult[] = [
  {
    id: 'lab-res-901',
    lab_name: 'المختبر البيطري التشخيصي المرجعي - صنعاء',
    test_date: '2026-09-12',
    pathogen_isolated: 'E. Coli (O78 Serotype) + Mycoplasma synoviae',
    report_document_url: 'https://smart-poultry-ye.gov/reports/lab-res-901.pdf',
    verified_by_lab: true,
    antibiotics_sensitivity: [
      { antibiotic_name: 'كوليستين سلفات (Colistin Sulphate)', sensitivity_status: 'حساس (Sensitive)', zone_mm: 22 },
      { antibiotic_name: 'فلورفينيكول (Florfenicol)', sensitivity_status: 'حساس (Sensitive)', zone_mm: 24 },
      { antibiotic_name: 'دوكسيسيكلين (Doxycycline Hyclate)', sensitivity_status: 'حساس (Sensitive)', zone_mm: 20 },
      { antibiotic_name: 'إنروفلوكساسين (Enrofloxacin)', sensitivity_status: 'متوسط (Intermediate)', zone_mm: 14 },
      { antibiotic_name: 'أموكسيسيللين (Amoxicillin)', sensitivity_status: 'مقاوم (Resistant)', zone_mm: 6 },
      { antibiotic_name: 'أوكسي تتراسيكلين (Oxytetracycline)', sensitivity_status: 'مقاوم (Resistant)', zone_mm: 8 }
    ]
  },
  {
    id: 'lab-res-902',
    lab_name: 'مختبر الصحة الحيوانية وعلوم الأدوية - ذمار',
    test_date: '2026-09-14',
    pathogen_isolated: 'Salmonella enteritidis',
    report_document_url: 'https://smart-poultry-ye.gov/reports/lab-res-902.pdf',
    verified_by_lab: true,
    antibiotics_sensitivity: [
      { antibiotic_name: 'فلورفينيكول (Florfenicol)', sensitivity_status: 'حساس (Sensitive)', zone_mm: 25 },
      { antibiotic_name: 'كوليستين سلفات (Colistin Sulphate)', sensitivity_status: 'حساس (Sensitive)', zone_mm: 21 },
      { antibiotic_name: 'إنروفلوكساسين (Enrofloxacin)', sensitivity_status: 'مقاوم (Resistant)', zone_mm: 7 },
      { antibiotic_name: 'تايلوزين (Tylosin Tartrate)', sensitivity_status: 'مقاوم (Resistant)', zone_mm: 5 }
    ]
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-2026-1001',
    case_id: 'case-2026-002',
    flock_id: 'flock-101',
    farm_name: 'مزرعة وادي سبأ النموذجية للدواجن',
    vet_id: 'vet-consultant',
    vet_name: 'الطبيب البيطري الاستشاري المعتمد',
    medication_category: 'vitamins_electrolytes',
    medication_name: 'فيتامين ج + إليكترولايت وموسع قصبات (Menthol & Vitamin C)',
    active_ingredient: 'Ascorbic acid + Eucalyptus oil + Mint extract',
    dosage: '1 مل / لتر ماء شرب لمدة 3 أيام',
    administration_route: 'ماء الشرب',
    duration_days: 3,
    withdrawal_days: 0,
    lab_sensitivity_attached: false, // Allowed because it is NOT an antibiotic!
    qr_code_hash: 'SHA256:4a8c9b2e1f0e8d7c6b5a4321',
    created_at: '2026-09-13 18:30',
    harvest_safe_date: '2026-09-16',
    status: 'issued_active'
  },
  {
    id: 'rx-2026-1002',
    case_id: 'case-2026-001',
    flock_id: 'flock-102',
    farm_name: 'مزارع الجنات للدواجن اللاحمة',
    vet_id: 'vet-consultant',
    vet_name: 'الطبيب البيطري الاستشاري المعتمد',
    medication_category: 'antibiotic',
    medication_name: 'فلورفينيكول 10% (Florfenicol 10%)',
    active_ingredient: 'Florfenicol',
    dosage: '20 ملغ / كغم وزن حي (1 مل / لتر ماء)',
    administration_route: 'ماء الشرب',
    duration_days: 4,
    withdrawal_days: 7, // 7 days withdrawal mandatory!
    lab_sensitivity_attached: true,
    lab_sensitivity_id: 'lab-res-902',
    lab_sensitivity_summary: 'تم التحقق من حساسية العزلة لفلورفينيكول بقطر تثبيط 25 ملم (حساس S).',
    qr_code_hash: 'SHA256:7f8e9d0c1b2a34567890abcdef',
    created_at: '2026-09-14 10:15',
    harvest_safe_date: '2026-09-25', // 4 days treatment + 7 days withdrawal
    status: 'issued_active'
  }
];

export const INITIAL_ACOUSTIC_SESSIONS: AcousticAnalysisSession[] = [
  {
    id: 'audio-01',
    flock_id: 'flock-101',
    recorded_at: '2026-09-13 23:45 (تسجيل ليلي)',
    duration_seconds: 30,
    time_of_recording: 'ليلي (هدوء تام)',
    snick_count: 7,
    sneeze_count: 2,
    rales_frequency_hz: 3200,
    respiratory_distress_index: 34,
    ai_assessment: 'رصد ترددات حشرجة خفيفة متفرقة، معدل العطس الليلي 0.23/ثانية ضمن النطاق المقبول مع توصية بالمراقبة.',
    severity: 'انحراف مبكر'
  },
  {
    id: 'audio-02',
    flock_id: 'flock-102',
    recorded_at: '2026-09-14 01:15 (تسجيل ليلي)',
    duration_seconds: 30,
    time_of_recording: 'ليلي (هدوء تام)',
    snick_count: 38,
    sneeze_count: 19,
    rales_frequency_hz: 4800,
    respiratory_distress_index: 82,
    ai_assessment: 'مؤشر ضائقة تنفسية مرتفع جداً (82%)، رصد سعال وعطس جماعي متواصل في العنبر الليلي يشير لانسداد مجرى الهواء أو مضاعفات فيروسية/بكتيرية حادة.',
    severity: 'ضائقة حادة'
  }
];

export const MYTH_BUSTING_ITEMS: MythBustingItem[] = [
  {
    id: 'myth-01',
    myth_title: 'أسطورة الكوكتيل الثلاثي للمضادات الحيوية',
    popular_belief: 'خلط 2 أو 3 مضادات حيوية معاً في خزان الماء يضاعف سرعة الشفاء ويقضي على جميع الأمراض فوراً.',
    scientific_fact: 'الخلط العشوائي يؤدي إلى تضاد كيميائي (Antagonism)، وترسب الدواء، وتدمير كبد وكلى الطائر، وخلق سلالات بكتيرية خارقة المقاومة تبيد القطيع.',
    veterinary_advice: 'ممنوع خلط أي مضادين بدون توجيه استشاري وفحص حساسية مخبري يثبت التآزر (Synergy). استشر الطبيب والتزم بالدواء المستهدف.',
    tag: 'مضادات حيوية'
  },
  {
    id: 'myth-02',
    myth_title: 'أسطورة التعطيش الجائر قبل التحصين',
    popular_belief: 'تعطيش الدواجن لأكثر من 4 أو 5 ساعات في الصيف الحار حتى تشرب ماء اللقاح بسرعة.',
    scientific_fact: 'التعطيش الطويل يسبب إجهاداً شديداً (Stress)، وتدافعاً يؤدي للكسور والنفوق، كما يفرز هرمون الكورتيكوستيرون الذي يثبط الجهاز المناعي ويمنع استجابة اللقاح.',
    veterinary_advice: 'التعطيش العلمي يجب ألا يتجاوز 1.5 إلى ساعتين في الطقس المعتدل وساعة واحدة في الأجواء الحارة، مع إضافة منشط مناعي وحليب خالي الدسم لحماية الفيروس الحي.',
    tag: 'تحصينات'
  },
  {
    id: 'myth-03',
    myth_title: 'أسطورة يوم واحد يكفي لسحب الدواء قبل البيع',
    popular_belief: 'إيقاف المضاد الحيوي قبل الذبح بـ 24 ساعة كافٍ لخروج الدواء من جسم الدجاج ليصبح آمناً.',
    scientific_fact: 'فترات السحب لمعظم المضادات الحيوية الفعالة (مثل إنروفلوكساسين، فلورفينيكول، تايلوزين) تتراوح بين 5 إلى 14 يوماً. تسويق الدجاج قبلها يترك متبقيات كيميائية سامة تسبب الفشل الكلوي وسرطانات للمستهلكين.',
    veterinary_advice: 'الالتزام الصارم بفترة السحب (Withdrawal Period) شرط شرعي وقانوني وأخلاقي، وإصدار جواز السفر الرقمي المعتمد هو الضامن لحماية المستهلك وسعر البيع الممتاز.',
    tag: 'مضادات حيوية'
  },
  {
    id: 'myth-04',
    myth_title: 'أسطورة إغلاق العنابر تماماً لتدفئة الصيصان',
    popular_belief: 'إغلاق فتحات التهوية والستائر 100% في الشتاء لحفظ الدفء يمنع نزلات البرد.',
    scientific_fact: 'كتم العنبر يرفع غاز الأمونيا (NH3) وثاني أكسيد الكربون والرطوبة في الفرشة، مما يحرق الأهداب التنفسية للقصبة الهوائية ويفتح الباب واسعاً للميكوبلازما والإيكولاي.',
    veterinary_advice: 'التهوية الدنيا (Minimum Ventilation) إلزامية من اليوم الأول لتجديد الأكسجين وطرد الغازات، ولا يجوز استبدال التدفئة بخنق الطيور.',
    tag: 'أمان حيوي'
  }
];

export const INITIAL_OUTBREAKS: EpidemiologicalOutbreak[] = [
  {
    id: 'outbreak-01',
    disease_name: 'Infectious Bursal Disease (IBD - Gumboro)',
    disease_name_ar: 'التهاب غدة فابريشيا المعدي (جمبورو ضاري)',
    governorate: 'ذمار',
    district: 'قاع جهران / معبر',
    severity: 'حرج (تفشي وبائي)',
    reported_at: '2026-09-12',
    affected_farms_count: 5,
    mortality_rate_percent: 18.5,
    quarantine_radius_km: 7.5,
    coordinates: { lat: 14.62, lng: 44.38 },
    emergency_measures: [
      'فرض طوق بيطري مشدد وإيقاف حركة سيارات نقل الدواجن الحية',
      'حرق ودفن الطيور النافقة فوراً وعدم إلقائها في مجاري السيول',
      'تطهير صوامع العلف بمحلول الجلوترالدهيد 2% بصورة يومية',
      'إيقاف إدخال كتاكيت عمر يوم في المنطقة لمدة 3 أسابيع'
    ],
    alert_broadcasted: true
  },
  {
    id: 'outbreak-02',
    disease_name: 'Velogenic Newcastle Disease (ND)',
    disease_name_ar: 'نيوكاسل ضاري أحشائي (NDV)',
    governorate: 'صنعاء',
    district: 'بني حشيش / وادي السر',
    severity: 'متوسط (تحت المراقبة)',
    reported_at: '2026-09-10',
    affected_farms_count: 2,
    mortality_rate_percent: 8.2,
    quarantine_radius_km: 5.0,
    coordinates: { lat: 15.44, lng: 44.33 },
    emergency_measures: [
      'تنشيط التحصين الطارئ بلقاح كلون 30 بالرش الخشن للمزارع المجاورة',
      'منع الزيارات المتبادلة بين المربين وعمال المزارع نهائياً',
      'استخدام مغاطس الفنيك والجير الحي عند بوابات العنابر'
    ],
    alert_broadcasted: true
  },
  {
    id: 'outbreak-03',
    disease_name: 'Infectious Bronchitis Variant (IBV)',
    disease_name_ar: 'التهاب القصبات المعدي المتحور (IBV-QX)',
    governorate: 'إب',
    district: 'وادي السحول / ميتم',
    severity: 'منخفض (احتواء)',
    reported_at: '2026-09-08',
    affected_farms_count: 1,
    mortality_rate_percent: 4.1,
    quarantine_radius_km: 3.0,
    coordinates: { lat: 13.99, lng: 44.18 },
    emergency_measures: [
      'رفع درجات حرارة الحضانة بدرجتين وتجنب التيارات الهوائية المباشرة',
      'إعطاء موسعات الشعب الهوائية بالزيوت العطرية في مياه الشرب',
      'أخذ مسحات قصبة هوائية للتنميط الجيني PCR بالمختبر البيطري المركزي'
    ],
    alert_broadcasted: false
  }
];

export const INITIAL_BIOSECURITY_CHECKLIST: BiosecurityAuditItem[] = [
  {
    id: 'bio-01',
    category: 'perimeter',
    category_ar: 'السياج ومكافحة الطيور البرية والقوارض',
    title_ar: 'شباك مانعة للطيور البرية والقوارض',
    description_ar: 'تغطية جميع فتحات التهوية والستائر وخلايا التبريد بشباك سلكية ضيقة تمنع دخول العصافير والحمام الناقل للفيروسات.',
    weight_points: 10,
    passed: true,
    corrective_action_ar: 'سد الفجوات في خلايا التبريد وتثبيت شبك معدني مجلفن عيون 1 سم.'
  },
  {
    id: 'bio-02',
    category: 'perimeter',
    category_ar: 'السياج ومكافحة الطيور البرية والقوارض',
    title_ar: 'محطة تعقيم عجلات السيارات عند البوابة',
    description_ar: 'حوض تغطيس لعجلات الشاحنات أو جهاز رش أوتوماتيكي بمطهر فيروسي معتمد عند المدخل الرئيسي للمزرعة.',
    weight_points: 10,
    passed: true,
    corrective_action_ar: 'تعبئة حوض المدخل بماء ومطهر جلوترالدهيد وتبديله كل 3 أيام.'
  },
  {
    id: 'bio-03',
    category: 'entry',
    category_ar: 'بوابة العنبر وتغيير الملابس',
    title_ar: 'حوض تطهير الأقدام (Footbath) عند كل عنبر',
    description_ar: 'وجود مغطس أو حوض بلاستيكي يحتوي على مطهر نشط ومظلة لمنع جفافه بأشعة الشمس.',
    weight_points: 10,
    passed: false,
    corrective_action_ar: 'إلزام العاملين بتغطيس الأحذية وتجديد المطهر عند ظهور أي رواسب.'
  },
  {
    id: 'bio-04',
    category: 'entry',
    category_ar: 'بوابة العنبر وتغيير الملابس',
    title_ar: 'منطقة تغيير الملابس والأحذية (Gowning Area)',
    description_ar: 'منطقة فاصلة (Zone Grey/Clean) لارتداء بدلات وأحذية خاصة بعنبر التربية دون إدخال أحذية الشارع.',
    weight_points: 10,
    passed: true,
    corrective_action_ar: 'تخصيص رفوف للأحذية النظيفة وتوفير أفرولات قماشية مغسولة ومعقمة.'
  },
  {
    id: 'bio-05',
    category: 'water',
    category_ar: 'المياه والصرف الصحي',
    title_ar: 'كلورة وتعقيم مياه الشرب المستمر',
    description_ar: 'حقن الكلور أو ثاني أكسيد الكلور بتركيز 2-4 جزء بالمليون عند الحلمات لطرد البيوفيلم وبكتيريا الإيكولاي.',
    weight_points: 10,
    passed: true,
    corrective_action_ar: 'تركيب مضخة حقن كلور أوتوماتيكية وفحص الكلور الحر بواسطة شريط كاشف يومياً.'
  },
  {
    id: 'bio-06',
    category: 'water',
    category_ar: 'المياه والصرف الصحي',
    title_ar: 'غسيل وتطهير خطوط النبل بين الدورات',
    description_ar: 'تنظيف الخطوط بحمض الخليك أو ماء الأكسجين لإزالة التكلسات والبقايا الدوائية قبل استقبال الدفعة.',
    weight_points: 10,
    passed: false,
    corrective_action_ar: 'شطف شبكة المياه بالكامل بضغط هيدروليكي وإضافة ماء الأكسجين 3% لمدة 12 ساعة ثم تصريفه.'
  },
  {
    id: 'bio-07',
    category: 'mortality',
    category_ar: 'التخلص من النافق',
    title_ar: 'محرقة مغلقة أو حفرة بيولوجية محكمة',
    description_ar: 'التخلص الفوري من الطيور الميتة دون تركها مكشوفة أو رميها في الأودية المحيطة، وتغطيتها بالجير الحي.',
    weight_points: 15,
    passed: true,
    corrective_action_ar: 'بناء محرقة حجرية محكمة أو حفرة مغطاة بفتحة أسطوانية ذات غطاء ثقيل.'
  },
  {
    id: 'bio-08',
    category: 'feed',
    category_ar: 'العلف والمخازن',
    title_ar: 'تخزين العلف على طبالي خشبية/بلاستيكية مرتفعة',
    description_ar: 'رفع أكياس العلف 15 سم عن الأرضية و50 سم عن الجدران للتهوية ومنع الرطوبة ونمو فطريات الأفلاتوكسين.',
    weight_points: 10,
    passed: true,
    corrective_action_ar: 'شراء طبالي بلاستيكية معقمة ومقاومة للحشرات.'
  },
  {
    id: 'bio-09',
    category: 'downtime',
    category_ar: 'فترة الفراغ والتطهير النهائي',
    title_ar: 'فترة تفريغ (Down-Time) لا تقل عن 14 يوماً',
    description_ar: 'ترك العنبر فارغاً وجافاً بعد إخراج الفرشة والغسيل بالصابون والتطهير بالحرارة أو الغاز لكسر دورة حياة الميكروبات.',
    weight_points: 15,
    passed: true,
    corrective_action_ar: 'الالتزام التام بفترة 14 يوماً وعدم التسرع بإدخال صيصان جديدة لضمان فاعلية التطهير.'
  }
];

