/**
 * types.ts
 * Types for the National Smart Poultry Platform (المنصة الوطنية للسيادة البيطرية والداجنة الذكية)
 * Conceptualized by Veterinary Advisory Team
 */

export type BreedType = 'Ross 308' | 'Cobb 500' | 'Hubbard Classic' | 'Arbor Acres' | 'Sasso' | 'البلدي المحسن';

export type SystemType = 'مغلق أوتوماتيكي (Closed Modern)' | 'نصف مغلق (Semi-closed)' | 'مفتوح تقليدي (Open Standard)';

export interface Farm {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  location_name: string;
  location_gps: {
    lat: number;
    lng: number;
  };
  system_type: SystemType;
  capacity: number;
  biosecurity_score: number; // 0 - 100%
  governorate: string; // Sanaa, Dhamar, Ibb, Hodeidah, Taiz, Marib, etc.
}

export interface Flock {
  id: string;
  farm_id: string;
  farm_name: string;
  flock_code: string;
  breed_type: BreedType;
  initial_count: number;
  current_count: number;
  start_date: string;
  current_age_days: number;
  status: 'active' | 'harvested' | 'quarantine';
  target_market_weight_kg: number;
  house_number: string;
}

export interface DailyLog {
  id: string;
  flock_id: string;
  date: string;
  day_age: number;
  water_consumption_liters: number;
  feed_consumption_kg: number;
  temp_celsius: number;
  humidity_percent: number;
  mortality_count: number;
  culling_count: number;
  average_weight_grams?: number;
  notes?: string;
  audio_file_url?: string;
  synced: boolean;
  sync_method: 'online' | 'sms_fallback' | 'pending';
}

export type NecropsyOrgan = 'liver' | 'intestine' | 'bursa' | 'trachea' | 'droppings';

export interface OrganObservation {
  organ: NecropsyOrgan;
  organ_name_ar: string;
  image_url?: string;
  status: 'normal' | 'suspicious' | 'severe_lesions';
  lesion_description: string;
}

export interface NecropsyCase {
  id: string;
  flock_id: string;
  flock_code: string;
  farm_name: string;
  created_at: string;
  bird_age_days: number;
  sample_count: number;
  observations: OrganObservation[];
  ai_prediction: {
    primary_disease: string;
    confidence_score: number; // 0 - 100%
    differential_diagnoses: { disease: string; probability: number }[];
    pathological_findings: string[];
    recommended_lab_tests: string[];
    emergency_level: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج (طارئ)';
  };
  vet_diagnosis?: string;
  vet_notes?: string;
  vet_approval_status: 'pending' | 'approved' | 'modified' | 'rejected';
  vet_name?: string;
  approved_at?: string;
}

export interface LabSensitivityResult {
  id: string;
  lab_name: string;
  test_date: string;
  pathogen_isolated: string;
  report_document_url?: string;
  antibiotics_sensitivity: {
    antibiotic_name: string;
    sensitivity_status: 'حساس (Sensitive)' | 'متوسط (Intermediate)' | 'مقاوم (Resistant)';
    zone_mm: number;
  }[];
  verified_by_lab: boolean;
}

export type MedicationCategory = 'antibiotic' | 'antiviral' | 'anticoccidial' | 'vitamins_electrolytes' | 'disinfectant' | 'vaccine';

export interface Prescription {
  id: string;
  case_id: string;
  flock_id: string;
  farm_name: string;
  vet_id: string;
  vet_name: string;
  medication_category: MedicationCategory;
  medication_name: string;
  active_ingredient: string;
  dosage: string;
  administration_route: 'ماء الشرب' | 'العلف' | 'حقن عضلي' | 'رش هوائي';
  duration_days: number;
  withdrawal_days: number; // Mandatory withdrawal period
  lab_sensitivity_attached: boolean;
  lab_sensitivity_id?: string;
  lab_sensitivity_summary?: string;
  qr_code_hash: string;
  created_at: string;
  harvest_safe_date: string;
  status: 'locked_blocked' | 'issued_active' | 'completed_withdrawn';
  lock_reason?: string;
}

export interface AcousticAnalysisSession {
  id: string;
  flock_id: string;
  recorded_at: string;
  duration_seconds: number;
  time_of_recording: 'ليلي (هدوء تام)' | 'نهاري';
  snick_count: number; // شخير
  sneeze_count: number; // عطس
  rales_frequency_hz: number;
  respiratory_distress_index: number; // 0 - 100%
  ai_assessment: string;
  severity: 'طبيعي' | 'انحراف مبكر' | 'ضائقة حادة';
  audio_file_url?: string; // رابط التسجيل الأصلي ليستمع له الطبيب/المشرف
}

export interface EconomicLossCalculation {
  flock_size: number;
  age_days: number;
  standard_feed_kg: number;
  actual_feed_kg: number;
  standard_fcr: number;
  actual_fcr: number;
  feed_price_yer_per_50kg: number;
  feed_loss_yer: number;
  standard_mortality_percent: number;
  actual_mortality_percent: number;
  excess_dead_birds: number;
  chick_cost_yer: number;
  mortality_loss_yer: number;
  standard_weight_kg: number;
  actual_weight_kg: number;
  live_chicken_price_yer_per_kg: number;
  underweight_loss_yer: number;
  total_economic_loss_yer: number;
  action_recommendations: string[];
}

export interface QRPassportData {
  passport_number: string;
  issue_date: string;
  farm_name: string;
  owner_name: string;
  governorate: string;
  flock_code: string;
  breed: BreedType;
  total_birds_harvested: number;
  age_at_slaughter_days: number;
  average_weight_kg: number;
  withdrawal_compliance: boolean;
  withdrawal_period_completed_date: string;
  antibiotic_residue_free: boolean;
  lab_certificate_number: string;
  supervising_consultant: string;
  qr_verification_url: string;
  security_hash: string;
  slaughterhouse_ready: boolean;
}

export interface MythBustingItem {
  id: string;
  myth_title: string;
  popular_belief: string;
  scientific_fact: string;
  veterinary_advice: string;
  tag: 'مضادات حيوية' | 'تحصينات' | 'تغذية ومياه' | 'أمان حيوي';
}

export interface EpidemiologicalOutbreak {
  id: string;
  disease_name: string;
  disease_name_ar: string;
  governorate: string;
  district: string;
  severity: 'حرج (تفشي وبائي)' | 'متوسط (تحت المراقبة)' | 'منخفض (احتواء)';
  reported_at: string;
  affected_farms_count: number;
  mortality_rate_percent: number;
  quarantine_radius_km: number;
  coordinates: { lat: number; lng: number };
  emergency_measures: string[];
  alert_broadcasted: boolean;
}

export interface BiosecurityAuditItem {
  id: string;
  category: string;
  category_ar: string;
  title_ar: string;
  description_ar: string;
  weight_points: number; // e.g. 5, 10
  passed: boolean;
  corrective_action_ar: string;
}

// ----------------------------------------------------
// 1. قسم الأدوية والعلاجات البيطرية (Veterinary Medicines)
// ----------------------------------------------------
export interface VeterinaryMedicine {
  id: string;
  commercial_name: string; // اسم العلاج التجاري
  active_ingredient: string; // المادة الفعالة / التركيز
  manufacturer: string; // اسم الشركة المصنعة / المورد
  company_id?: string; // معرف الشركة المتعاقدة
  package_type_size: string; // نوع العبوة وحجمها (سائل 1 لتر / بودرة 1 كجم)
  price_yer: number; // سعر العبوة بالريال اليمني
  withdrawal_period_days: number; // فترة السحب بالأيام
  sensitivity_test_required: boolean; // فحص الحساسية مطلوب؟
  category: 'مضاد حيوي مقيد' | 'مضاد كوكسيديا' | 'فيتامينات وروافع مناعة' | 'مضاد سموم فطرية' | 'مطهرات ومعقمات';
  in_stock: boolean;
  is_active_in_market?: boolean; // تفعيل/إيقاف في السوق
  indications_ar: string;
  image_url?: string;
}

// ----------------------------------------------------
// 2. قسم الأعلاف وإضافات التغذية (Feed & Feed Additives)
// ----------------------------------------------------
export type FeedStage = 'بادي' | 'نامي' | 'ناهي' | 'مركزات' | 'إضافات أعلاف';

export interface FeedItem {
  id: string;
  feed_name: string; // اسم العلف / الصنف
  stage: FeedStage; // مرحلة العلف
  manufacturer: string; // اسم الشركة المصنعة / المطبخ
  company_id?: string; // معرف الشركة المتعاقدة
  protein_percent: number; // نسبة البروتين الخام %
  energy_kcal_per_kg: number; // الطاقة الممثلة ك.ك/كجم
  price_bag_50kg_yer: number; // سعر الكيس 50 كجم بالريال اليمني
  price_ton_yer: number; // سعر الطن بالريال اليمني
  available_in_regions: string[];
  digestibility_rating: number; // e.g. 4.8 / 5
  is_active_in_market?: boolean; // تفعيل/إيقاف في السوق
  image_url?: string;
}

// ----------------------------------------------------
// 3. قسم معدات ومستلزمات المزارع (Farm Equipment)
// ----------------------------------------------------
export type EquipmentCategory = 'دفايات' | 'شبكات سقي' | 'معالف' | 'شفاطات' | 'خلايا تبريد' | 'لوحات تحكم';

export interface FarmEquipment {
  id: string;
  category: EquipmentCategory; // تصنيف المعدة
  model_name: string; // اسم القطعة / الموديل
  brand_manufacturer: string; // اسم الشركة المصنعة / الماركة
  company_id?: string; // معرف الشركة المتعاقدة
  condition: 'جديد' | 'مستعمل'; // حالة القطعة
  unit_price_yer: number; // السعر الفردي / المباشر بالريال اليمني
  specifications: string;
  image_url: string;
  warranty_months: number;
  is_active_in_market?: boolean; // تفعيل/إيقاف في السوق
}

// ----------------------------------------------------
// 4. سوق الهناجر والمزارع للإيجار (Farm Rentals Market)
// ----------------------------------------------------
export interface HangarRental {
  id: string;
  title: string;
  governorate: string; // المحافظة
  district: string; // المديرية
  location_details: string; // الموقع الجغرافي
  images: string[]; // صور الهنجر / المنشأة
  length_meters: number; // الطول بالامتار
  width_meters: number; // العرض بالامتار
  total_area_m2: number; // المساحة الكلية
  capacity_birds: number; // السعة الاستيعابية (عدد الطيور)
  rental_price_yer: number; // سعر الإيجار بالريال اليمني
  rental_term: 'للدورة' | 'شهرياً' | 'سنوياً';
  amenities: {
    automatic_control_panel: boolean; // لوحة تحكم أوتوماتيك
    water_well: boolean; // بئر ماء
    solar_power_system: boolean; // منظومة شمسية
    worker_housing: boolean; // سكن عمال
    backup_generator: boolean; // مولد احتياطي
  };
  contact_phone: string;
  advertiser_name: string;
  is_verified_farm: boolean;
}

// ----------------------------------------------------
// 5. ملف إدارة العمالة والمربين (HR & Farmers Management)
// ----------------------------------------------------
export type WorkerProfessionalLevel = 'مبتدئ' | 'متوسط' | 'محترف';

export interface CycleHistoryItem {
  cycle_year: string;
  farm_name: string;
  breed: BreedType;
  flock_size: number;
  mortality_rate_percent: number;
  fcr_achieved: number;
  evaluator_vet_notes: string;
}

export interface WorkerProfile {
  id: string;
  full_name: string; // الاسم الكامل
  national_id: string; // رقم البطاقة الشخصية / الهوية
  birth_date: string; // تاريخ الميلاد
  age: number; // العمر
  id_card_image_url: string; // صورة بطاقة الهوية
  experience_years: number; // سنوات الخبرة الميدانية
  professional_level: WorkerProfessionalLevel; // مستوى الاحتراف
  phone: string;
  current_residence: string; // المحافظة الحالية
  specialization_role: 'مشرف عنبر' | 'مربي متخصص تحضين' | 'فني تهوية وتبريد' | 'مدير مزرعة شامل';
  previous_cycles_history: CycleHistoryItem[]; // السجل الميداني والدورات السابقة
  biosecurity_training_certified: boolean;
  status: 'متاح للعمل فوراً' | 'مرتبط بدورة حالية' | 'تحت التقييم';
}

// ----------------------------------------------------
// 6. بروتوكول اللقاحات المحدث (Vaccination Protocol Module)
// ----------------------------------------------------
export type VaccineRoute = 'ماء شرب' | 'تقطير بالعين' | 'رش' | 'حقن';

export interface VaccineProtocolItem {
  id: string;
  vaccine_name_strain: string; // اسم اللقاح والعترة (Newcastle LaSota, IB H120...)
  disease_targeted: string;
  recommended_age_days: number; // العمر الموصى به للتطعيم باليوم
  administration_route: VaccineRoute; // طريقة التطبيق
  manufacturer_country: string; // اسم الشركة المصنعة والبلد
  company_id?: string; // معرف الشركة المتعاقدة
  price_dose_vial_yer: number; // سعر الجرعة / الأمبول بالريال اليمني
  doses_per_vial: number;
  temperature_storage_celsius: string;
  critical_precautions: string;
  mandatory_national: boolean;
  is_active_in_market?: boolean; // تفعيل/إيقاف في السوق
  image_url?: string;
}

// ----------------------------------------------------
// 7. لوحة تحكم المدير العام والأرباح والشركات (Admin & Financial Dashboard)
// ----------------------------------------------------

export type CompanyCategory = 'أدوية بيطرية' | 'مطابخ ومصانع أعلاف' | 'معدات ومستلزمات' | 'وكلاء لقاحات';
export type CompanyPortalPermission = 'self_service_with_approval' | 'direct_admin_managed';
export type ContractStatus = 'ساري' | 'قيد التجديد' | 'معلق';

export interface PartnerCompany {
  id: string;
  name: string;
  category: CompanyCategory;
  governorate: string;
  contact_person: string;
  phone: string;
  email?: string;
  contract_number: string;
  contract_start_date: string;
  contract_end_date: string;
  contract_status: ContractStatus;
  regional_commission_percent: number; // النسبة الإقليمية المتفق عليها
  portal_permission: CompanyPortalPermission; // صلاحيات حساب الشركة (تدخل منتجاتها للمراجعة أم يدخلها المدير مباشرة)
  active: boolean; // تفعيل/إيقاف التعامل
  products_count: number;
  total_volume_yer: number;
  contract_document_name?: string;
  notes?: string;
}

export type SystemUserRole = 'مربي / صاحب مزرعة' | 'طبيب بيطري استشاري' | 'عامل / مشرف عنبر' | 'مختبر بيطري' | 'وكيل / مورد معتمد';
export type SystemUserStatus = 'نشط ومعتمد' | 'مجمد رقابياً' | 'قيد المراجعة';

export interface SystemUserAccount {
  id: string;
  name: string;
  role: SystemUserRole;
  governorate: string;
  phone: string;
  national_id?: string;
  status: SystemUserStatus;
  cases_or_cycles_count: number;
  rating?: number; // تقييم الأداء من 5
  freeze_reason?: string;
  created_date: string;
}

export interface GovernancePolicy {
  id: string;
  title: string;
  category: 'أمان حيوي' | 'أدوية ومضادات' | 'أعلاف' | 'ذكاء اصطناعي';
  description: string;
  active: boolean;
  enforcement_level: 'إلزامي مشدد' | 'تحذيري' | 'توجيهي';
  last_updated: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'عمولة استشارة بيطرية' | 'عمولة مبيعات معدات وأعلاف' | 'رسوم وساطة تأجير عنابر' | 'رسوم توثيق جواز السفر QR' | 'عمولة بيع دواء بيطري' | 'عمولة توريد لقاحات';
  farm_or_user_name: string;
  company_name?: string;
  gross_amount_yer: number;
  platform_commission_yer: number;
  status: 'مكتمل' | 'معلق' | 'مستحق للشركة' | 'مستحق للاستشاري';
  reference_id?: string;
}

export interface PlatformFinancialConfig {
  vet_consultation_commission_percent: number; // نسبة عمولة الاستشارات
  marketplace_sales_commission_percent: number; // نسبة عمولة المبيعات
  rental_brokerage_commission_percent: number; // نسبة عمولة التأجير
  feed_profit_per_bag_yer: number; // ربح المدير لكل كيس علف (بالريال)
  feed_profit_per_ton_yer: number; // ربح المدير لكل طن علف (بالريال)
  medicine_profit_mode: 'percent' | 'fixed'; // نسبة أو مبلغ مقطوع
  medicine_profit_fixed_amount_yer: number; // مبلغ الربح المقطوع لكل عبوة
  total_gross_volume_yer: number;
  total_platform_net_profit_yer: number;
  active_users_count: number;
  frozen_accounts_count: number;
  monthly_gross_breakdown: {
    medicines: number;
    feeds: number;
    equipment: number;
    rentals: number;
    consultations: number;
  };
  transactions: FinancialTransaction[];
}

// ----------------------------------------------------
// 8. المساعد الذكي التفاعلي (Interactive AI Guidance)
// ----------------------------------------------------
export interface AIGuidanceChat {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  requires_vet_escalation?: boolean;
}

// ----------------------------------------------------
// 9. نظام الصلاحيات وعزل الأدوار (RBAC & Master Control)
// ----------------------------------------------------
export type AppUserRole =
  | 'master_admin' // المدير العام - يجب التحقق منه عبر مصادقة خادمية فعلية
  | 'consultant_vet' // طبيب بيطري استشاري
  | 'regional_manager' // مدير منطقة / مشرف ميداني
  | 'farmer' // مربي / صاحب مزرعة
  | 'worker'; // عامل / مشرف عنبر

export type StaffRole = 'طبيب بيطري استشاري' | 'مدير منطقة' | 'مشرف ميداني' | 'مدير مالي ومحاسب';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  governorate: string; // المحافظة المسندة
  assigned_districts: string[]; // المديريات
  phone: string;
  email?: string;
  national_id: string;
  specialization: string; // مثلاً: استشاري أمراض دواجن، مشرف ميداني للأمان الحيوي
  status: 'نشط' | 'معلق' | 'إجازة';
  permissions: {
    can_issue_prescriptions: boolean;
    can_order_field_visits: boolean;
    can_manage_prices: boolean;
    can_view_financials: boolean;
    can_freeze_accounts: boolean;
    // صلاحيات إدارية تفصيلية. تبقى false/undefined افتراضياً ما لم يمنحها المدير العام.
    can_manage_catalog?: boolean;
    can_manage_exchange_rates?: boolean;
    can_manage_zone_pricing?: boolean;
    can_manage_payment_accounts?: boolean;
    can_manage_laboratories?: boolean;
    can_manage_notifications?: boolean;
    can_manage_companies?: boolean;
  };
  active_cases_count: number;
  rating: number;
  join_date: string;
  is_online?: boolean;
  on_duty?: boolean;
  last_seen_at?: string;
}

// ----------------------------------------------------
// 10. تسعير الدواجن اليومي وتسويق القطيع (Poultry Marketing Engine)
// ----------------------------------------------------
export interface PoultryDailyPrice {
  id: string;
  governorate: string; // صنعاء، الحديدة، ذمار، تعز، إب، مأرب، عدن
  date: string;
  weight_category: 'خفيف (أقل من 1.3 كجم)' | 'مثالي (1.3 - 1.8 كجم)' | 'ثقيل (أكثر من 1.8 كجم)';
  farmgate_price_per_kg_yer: number; // سعر المزرعة للكيلو
  consumer_price_per_kg_yer: number; // سعر المستهلك للكيلو
  market_trend: 'مستقر' | 'صاعد' | 'هابط';
  notes?: string;
}

export type PoultrySaleStatus =
  | 'pending_ai_evaluation' // قيد التقييم الآلي
  | 'accepted_by_farmer' // وافق المربي على السعر العادل
  | 'rejected_escalated_to_admin' // رفض المربي - تم التحويل للإدارة للتفاوض
  | 'under_review_by_admin' // قيد المراجعة المباشرة من الإدارة
  | 'admin_counter_offered' // قدمت الإدارة عرض سعر بديل
  | 'approved_deal' // تم اعتماد الصفقة
  | 'completed'; // مكتملة ومدفوعة

export interface PoultrySaleRequest {
  id: string;
  farmer_name: string;
  farm_name: string;
  phone: string;
  governorate: string;
  district: string;
  flock_breed: BreedType;
  bird_count: number;
  total_weight_kg: number;
  average_weight_kg: number;
  images: string[];
  farmer_requested_price_per_kg: number;
  ai_recommended_price_per_kg: number;
  ai_total_estimated_value_yer: number;
  status: PoultrySaleStatus;
  admin_counter_price_per_kg?: number;
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

// ----------------------------------------------------
// 11. الدليل التشريحي المصور وبلاغات المشاكل المرضية (AI Triage & Guided Necropsy)
// ----------------------------------------------------
export interface GuidedNecropsyOrgan {
  id: string;
  organ_key: 'caeca' | 'proventriculus' | 'trachea' | 'liver_airsacs' | 'bursa';
  organ_name_ar: string;
  target_diseases_ar: string;
  guide_description: string;
  guide_image_url: string;
  user_uploaded_image?: string;
  ai_observation?: string;
  suspicion_level: 'سليم طبيعي' | 'اشتباه مرضي' | 'إصابة حادة ونزف';
}

export interface DiseaseReportCase {
  id: string;
  case_number: string;
  farmer_name: string;
  farm_name: string;
  phone: string;
  governorate: string;
  district: string;
  flock_breed: BreedType;
  bird_age_days: number;
  flock_size: number;
  mortality_today: number;
  temp_celsius: number;
  humidity_percent: number;
  feed_consumption_kg: number;
  water_consumption_liters: number;
  general_barn_image?: string;
  droppings_image?: string;
  organs: GuidedNecropsyOrgan[];
  symptoms_description: string;
  ai_preliminary_triage: string;
  severity: 'حرج (تفشي وبائي طارئ)' | 'مرتفع' | 'متوسط' | 'تحت الملاحظة';
  assigned_consultant?: string;
  status: 'submitted_to_admin_vets' | 'under_vet_review' | 'field_visit_dispatched' | 'prescription_issued' | 'closed';
  created_at: string;
  admin_vet_action_notes?: string;
}

// ----------------------------------------------------
// 12. الربط المالي والمحافظ الرقمية اليمنية (Yemeni Payment Integrations)
// ----------------------------------------------------
export type YemeniPaymentMethod =
  | 'kuraimi_account' // حساب بنك الكريمي (Kuraimi Express / PFX)
  | 'jeep_wallet' // محفظة جيب - الكريمي
  | 'haseb_wallet' // محفظة حاسب - بنك التضامن
  | 'cash_wallet' // محفظة كاش - بنك اليمن والكويت
  | 'money_exchange_network'; // شبكات النجم، الامتياز، يمن إكسبرس، ون كاش

export interface PaymentTransactionRecord {
  id: string;
  receipt_number: string; // رقم السند الإلكتروني
  date: string;
  method: YemeniPaymentMethod;
  payer_name: string;
  payer_phone: string;
  recipient_account_or_wallet: string;
  transaction_ref_number: string; // رقم الحوالة أو إشعار الإيداع
  amount_yer: number;
  purpose: 'شراء أدوية بيطرية' | 'شراء أعلاف' | 'شراء معدات' | 'وساطة تأجير هنجر' | 'استشارة بيطرية' | 'تسويق دواجن' | 'رسوم توثيق الجواز الرقمي';
  status: 'مؤكد ومعتمد' | 'قيد المراجعة' | 'مرفوض';
  proof_image_url?: string;
  notes?: string;
  processed_by?: string;
}




// ----------------------------------------------------
// 13. التسعير الإقليمي والعملات وأجور المناطق
// ----------------------------------------------------
export type RegionalCurrencyMode = 'YER_OLD_SAR' | 'YER_NEW_SAR';

export interface ExchangeRateSettings {
  sar_to_yer_old: number;
  sar_to_yer_new: number;
  last_updated: string;
  updated_by: string;
}

export interface GovernorateCurrencyRule {
  id: string;
  governorate: string;
  currency_mode: RegionalCurrencyMode;
  active: boolean;
}

export interface ZoneServicePrice {
  id: string;
  governorate: string;
  district: string;
  currency_mode: RegionalCurrencyMode;
  transport_fee_yer: number;
  field_visit_fee_yer: number;
  marketing_fee_yer: number;
  transport_cost_yer?: number;
  field_visit_cost_yer?: number;
  marketing_cost_yer?: number;
  last_updated: string;
  status: 'active' | 'pending_new_location_pricing';
  branch_id?: string;
  branch_name?: string;
  branch_address?: string;
  delivery_eta_hours?: number;
}

export interface ChickDailyPrice {
  id: string;
  date: string;
  chick_type: 'لاحم' | 'بياض' | 'أمهات';
  strain: string;
  company_name: string;
  price_per_chick_sar: number;
  price_per_chick_yer_old: number;
  price_per_chick_yer_new: number;
  market_trend: 'مستقر' | 'صاعد' | 'هابط';
  notes?: string;
  image_url?: string;
}

// ----------------------------------------------------
// 14. المديونيات والآجل
// ----------------------------------------------------
export interface CustomerCreditAccount {
  id: string;
  customer_id: string;
  customer_name: string;
  phone: string;
  credit_limit_yer: number;
  current_debt_yer: number;
  due_date?: string;
  status: 'within_limit' | 'near_limit' | 'blocked_over_limit' | 'admin_override';
  admin_override_note?: string;
  updated_at: string;
}

export interface DebtLedgerEntry {
  id: string;
  credit_account_id: string;
  date: string;
  type: 'debit' | 'payment' | 'marketing_deduction' | 'adjustment';
  category: 'أدوية' | 'أعلاف' | 'خدمات بيطرية' | 'نزول ميداني' | 'معدات' | 'تسويق دواجن';
  amount_yer: number;
  reference: string;
  due_date?: string;
  status: 'open' | 'settled' | 'overdue';
  notes?: string;
}

// ----------------------------------------------------
// 15. الطوارئ والنزول الميداني
// ----------------------------------------------------
export interface EmergencyFieldRequest {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  farm_id: string;
  farm_name: string;
  flock_id: string;
  governorate: string;
  district: string;
  gps: { lat: number; lng: number };
  mortality_today: number;
  symptoms_summary: string;
  image_urls: string[];
  priority: 'red_emergency' | 'high' | 'normal';
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  status: 'new' | 'assigned' | 'en_route' | 'on_site' | 'report_submitted' | 'approved_closed';
  field_report?: string;
  admin_approved?: boolean;
}

// ----------------------------------------------------
// 16. التقييمات والتنبيهات المباشرة
// ----------------------------------------------------
export interface ServiceRatingRecord {
  id: string;
  created_at: string;
  rater_name: string;
  target_type: 'customer' | 'staff';
  target_id: string;
  target_name: string;
  rating: number;
  category: 'الالتزام بالأمان الحيوي' | 'سرعة الاستجابة' | 'جودة النزول الميداني' | 'الالتزام المالي';
  note?: string;
  admin_only: boolean;
}

export interface PushNotificationRecord {
  id: string;
  created_at: string;
  title: string;
  body: string;
  audience: 'all_customers' | 'governorate' | 'district' | 'customer';
  target_value?: string;
  type: 'price_update' | 'weather_alert' | 'outbreak_alert' | 'debt_reminder' | 'service_update';
  priority: 'normal' | 'high' | 'critical';
  sent: boolean;
}


// ----------------------------------------------------
// 17. طلبات الشراء والموافقة على الأجور والمضادات
// ----------------------------------------------------
export type MarketplacePurchaseCategory = 'medicine' | 'vaccine' | 'feed' | 'equipment' | 'chicks';

export interface AntibioticPurchaseClinicalFile {
  flock_age_days: number;
  flock_size: number;
  mortality_today: number;
  temperature_celsius: number;
  feed_consumption_kg: number;
  water_consumption_liters: number;
  reason_for_request: string;
  symptoms: string;
  diarrhea_image_note?: string;
  diarrhea_image_url?: string;
  necropsy_image_note?: string;
  necropsy_image_urls?: string[];
  farm_address: string;
}

export interface MarketplacePurchaseRequest {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  customer_address: string;
  category: MarketplacePurchaseCategory;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_label: string;
  unit_price_local: number;
  currency_label: string;
  product_total_local: number;
  governorate: string;
  district: string;
  transport_fee_local: number;
  transport_fee_accepted: boolean;
  grand_total_local: number;
  is_antibiotic: boolean;
  requires_vet_approval: boolean;
  vet_approved: boolean;
  antibiotic_case?: AntibioticPurchaseClinicalFile;
  ai_sales_message: string;
  assigned_branch_id?: string;
  assigned_branch_name?: string;
  delivery_eta_hours?: number;
  payment_method_id?: string;
  payment_method_label?: string;
  payment_proof_image_url?: string;
  payment_reference?: string;
  payment_submitted_at?: string;
  finance_approved?: boolean;
  finance_approved_by?: string;
  finance_approved_at?: string;
  status: 'pending_customer_fee_acceptance' | 'pending_vet_approval' | 'approved_for_purchase' | 'awaiting_payment' | 'payment_under_review' | 'payment_verified' | 'preparing' | 'out_for_delivery' | 'delivered' | 'confirmed' | 'rejected';
}

export interface BranchLocation {
  id: string;
  name: string;
  governorate: string;
  district: string;
  address: string;
  market_name?: string;
  phone: string;
  active: boolean;
  notes?: string;
}

export interface PaymentAccount {
  id: string;
  provider: 'الكريمي' | 'جيب' | 'حاسب' | 'كاش' | 'حوالة شبكية' | 'أخرى';
  account_name: string;
  account_number: string;
  currency: 'YER' | 'SAR';
  active: boolean;
  instructions?: string;
}

export interface PaymentVerification {
  id: string;
  purchase_request_id: string;
  customer_name: string;
  phone: string;
  amount_local: number;
  currency_label: string;
  payment_account_id: string;
  payment_account_label: string;
  proof_image_url: string;
  reference_number?: string;
  submitted_at: string;
  status: 'under_finance_review' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  finance_note?: string;
}

export interface SupervisionServicePackage {
  id: string;
  name: string;
  description: string;
  base_fee_yer: number;
  per_hangar_fee_yer: number;
  per_1000_birds_fee_yer: number;
  includes: string[];
  active: boolean;
}

export interface SupervisionServiceRequest {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  address: string;
  governorate: string;
  district: string;
  hangars_count: number;
  flock_size: number;
  package_id: string;
  package_name: string;
  calculated_fee_yer: number;
  ai_pitch: string;
  customer_accepted: boolean;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  status: 'offered' | 'accepted' | 'assigned' | 'active_followup' | 'completed' | 'declined';
}

export type ClinicalDiseaseGroup = 'فيروسي' | 'بكتيري' | 'ميكوبلازما/تنفسي' | 'طفيلي/كوكسيديا' | 'فطري/سموم' | 'غير محدد';

export interface ClinicalTriageCase {
  id: string;
  case_number: string;
  created_at: string;
  customer_name: string;
  phone: string;
  governorate: string;
  district: string;
  detailed_address: string;
  flock_size: number;
  age_days: number;
  mortality_today: number;
  average_weight_grams?: number;
  feed_kg: number;
  water_liters: number;
  temperature_celsius: number;
  humidity_percent: number;
  symptoms_description: string;
  droppings_image_url?: string;
  barn_image_url?: string;
  litter_image_url?: string;
  audio_url?: string;
  necropsy_images: { organ_name: string; image_url: string }[];
  ai_suspected_group: ClinicalDiseaseGroup;
  ai_requested_organs: string[];
  ai_triage_note: string;
  laboratory_recommended: boolean;
  lab_reason?: string;
  recommended_lab_id?: string;
  recommended_lab_name?: string;
  recommended_lab_address?: string;
  recommended_lab_phone?: string;
  sample_collection_required?: boolean;
  field_visit_for_sample_required?: boolean;
  remote_area_without_lab?: boolean;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  assigned_role?: string;
  status: 'collecting_data' | 'submitted' | 'assigned_online_staff' | 'awaiting_field_visit' | 'awaiting_lab' | 'under_vet_review' | 'closed';
}

export interface JobApplication {
  id: string;
  created_at: string;
  full_name: string;
  role_requested: 'عامل' | 'مشرف ميداني' | 'طبيب بيطري';
  phone: string;
  age: number;
  national_id: string;
  governorate: string;
  experience_years: number;
  desired_salary_yer: number;
  identity_image_url?: string;
  notes?: string;
  status: 'new' | 'under_review' | 'approved_pool' | 'rejected';
}

export interface LaboratoryDirectoryItem {
  id: string;
  name: string;
  governorate: string;
  district: string;
  address: string;
  phone: string;
  tests: string[];
  sample_collection_fee_yer: number;
  base_test_price_yer: number;
  turnaround_hours: number;
  active: boolean;
}

export interface NecropsyGuideAsset {
  id: string;
  organ_name: string;
  disease_groups: ClinicalDiseaseGroup[];
  instructions: string;
  image_url?: string;
  approved_by_admin: boolean;
}

// ----------------------------------------------------
// 18. مركز التكاملات والأمان والتشغيل المؤسسي
// ----------------------------------------------------
export type IntegrationConnectionStatus = 'not_configured' | 'configured' | 'testing' | 'connected' | 'error';

export interface FcmIntegrationSettings {
  enabled: boolean;
  project_id: string;
  sender_id?: string;
  default_topic: string;
  connection_status: IntegrationConnectionStatus;
  last_tested_at?: string;
  last_test_message?: string;
  backend_endpoint?: string;
  note?: string;
}

export interface PaymentProviderIntegrationSettings {
  id: string;
  provider: 'الكريمي' | 'جيب' | 'حاسب' | 'كاش' | 'أخرى';
  enabled: boolean;
  mode: 'manual_verification' | 'api';
  api_base_url?: string;
  merchant_reference?: string;
  connection_status: IntegrationConnectionStatus;
  last_tested_at?: string;
  note?: string;
}

export interface AuthSecuritySettings {
  provider: 'local_prototype' | 'firebase_auth' | 'custom_backend';
  backend_rbac_enforced: boolean;
  require_mfa_for_admins: boolean;
  session_timeout_minutes: number;
  max_failed_login_attempts: number;
  require_strong_passwords: boolean;
  audit_login_events: boolean;
  connection_status: IntegrationConnectionStatus;
  note?: string;
}

export interface PlatformIntegrationSettings {
  fcm: FcmIntegrationSettings;
  payment_providers: PaymentProviderIntegrationSettings[];
  auth_security: AuthSecuritySettings;
}

export interface AdminAuditLogEntry {
  id: string;
  created_at: string;
  actor_name: string;
  actor_role: string;
  action: string;
  module: string;
  target_reference?: string;
  result: 'success' | 'warning' | 'blocked';
  details?: string;
}

export interface ApprovalWorkflowSettings {
  price_changes_require_approval: boolean;
  exchange_rate_changes_require_approval: boolean;
  zone_fee_changes_require_approval: boolean;
  payment_account_changes_require_approval: boolean;
  antibiotic_override_requires_vet: boolean;
  high_value_payment_threshold_yer: number;
  high_value_payment_requires_second_approver: boolean;
}

export interface BackupSyncSettings {
  offline_mode_enabled: boolean;
  auto_sync_enabled: boolean;
  pending_sync_items: number;
  last_sync_at?: string;
  last_backup_at?: string;
  backup_destination_label: string;
  backup_status: 'never' | 'ok' | 'warning' | 'error';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  category: 'price' | 'weather' | 'outbreak' | 'payment' | 'debt' | 'service' | 'clinical';
  title: string;
  body: string;
  active: boolean;
}

export interface SystemHealthItem {
  id: string;
  service_name: string;
  category: 'frontend' | 'backend' | 'database' | 'notifications' | 'payments' | 'storage' | 'ai';
  status: 'healthy' | 'warning' | 'offline' | 'not_connected';
  last_checked_at?: string;
  note?: string;
}

export interface SmartOperationsState {
  exchange_rates: ExchangeRateSettings;
  governorate_currency_rules: GovernorateCurrencyRule[];
  zone_service_prices: ZoneServicePrice[];
  chick_prices: ChickDailyPrice[];
  credit_accounts: CustomerCreditAccount[];
  debt_ledger: DebtLedgerEntry[];
  emergency_requests: EmergencyFieldRequest[];
  ratings: ServiceRatingRecord[];
  notifications: PushNotificationRecord[];
  purchase_requests: MarketplacePurchaseRequest[];
  branches: BranchLocation[];
  payment_accounts: PaymentAccount[];
  payment_verifications: PaymentVerification[];
  supervision_packages: SupervisionServicePackage[];
  supervision_requests: SupervisionServiceRequest[];
  clinical_cases: ClinicalTriageCase[];
  job_applications: JobApplication[];
  laboratories: LaboratoryDirectoryItem[];
  necropsy_guides: NecropsyGuideAsset[];
  integrations: PlatformIntegrationSettings;
  audit_log: AdminAuditLogEntry[];
  approval_workflows: ApprovalWorkflowSettings;
  backup_sync: BackupSyncSettings;
  notification_templates: NotificationTemplate[];
  system_health: SystemHealthItem[];
  enterprise: EnterpriseOperationsV11State;
}


// ----------------------------------------------------
// 19. V11 - البنية التشغيلية المؤسسية الكاملة
// ----------------------------------------------------
export type V11BackendMode = 'local_json' | 'firebase' | 'postgres_api' | 'custom_api';
export interface V11BackendRuntime {
  mode: V11BackendMode;
  api_base_url: string;
  database_status: 'local_persistent' | 'connected' | 'not_connected';
  storage_status: 'local' | 'connected' | 'not_connected';
  offline_queue_enabled: boolean;
  pending_offline_actions: number;
  last_server_sync_at?: string;
  note: string;
}

export interface InventoryLot {
  id: string;
  branch_id: string;
  branch_name: string;
  category: MarketplacePurchaseCategory | 'other';
  product_id: string;
  product_name: string;
  lot_number: string;
  expiry_date?: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  reorder_level: number;
  unit_label: string;
  cost_per_unit_yer: number;
  sell_price_per_unit_yer: number;
  status: 'available' | 'low_stock' | 'near_expiry' | 'expired' | 'blocked';
}

export interface StockTransferRecord {
  id: string;
  created_at: string;
  from_branch_id: string;
  from_branch_name: string;
  to_branch_id: string;
  to_branch_name: string;
  product_name: string;
  quantity: number;
  unit_label: string;
  status: 'requested' | 'approved' | 'in_transit' | 'received' | 'cancelled';
  approved_by?: string;
}

export interface OrderLifecycleRecord {
  id: string;
  purchase_request_id: string;
  customer_name: string;
  product_summary: string;
  branch_name: string;
  total_amount_yer: number;
  payment_status: 'unpaid' | 'under_review' | 'paid' | 'partial' | 'refunded';
  fulfillment_status: 'new' | 'priced' | 'customer_accepted' | 'paid' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  reserved_inventory: boolean;
  invoice_number: string;
  qr_reference: string;
  created_at: string;
  updated_at: string;
  discount_yer?: number;
  delivery_fee_yer?: number;
  paid_amount_yer?: number;
  return_reason?: string;
}

export interface DeliveryAssignment {
  id: string;
  order_id: string;
  driver_name: string;
  driver_phone: string;
  branch_name: string;
  destination_address: string;
  destination_gps?: { lat: number; lng: number };
  eta_minutes: number;
  status: 'assigned' | 'picked_up' | 'en_route' | 'arrived' | 'delivered' | 'failed';
  proof_of_delivery_url?: string;
  customer_signature_url?: string;
  delivered_at?: string;
}

export interface LabTestOrder {
  id: string;
  case_id: string;
  case_number: string;
  laboratory_id: string;
  laboratory_name: string;
  requested_by: string;
  sample_type: string;
  sample_count: number;
  collected_by?: string;
  collected_at?: string;
  chain_of_custody: string[];
  requested_tests: string[];
  estimated_cost_yer: number;
  status: 'requested' | 'sample_scheduled' | 'sample_collected' | 'received_by_lab' | 'processing' | 'completed' | 'cancelled';
  result_summary?: string;
  report_url?: string;
}

export interface AntibioticSafetyRecord {
  id: string;
  prescription_id: string;
  case_id: string;
  flock_id: string;
  medication_name: string;
  active_ingredient: string;
  vet_name: string;
  reason: string;
  sensitivity_report_id?: string;
  start_date: string;
  end_date: string;
  meat_withdrawal_days: number;
  egg_withdrawal_days: number;
  safe_marketing_date: string;
  marketing_locked: boolean;
  antibiotic_free_badge_eligible: boolean;
  qr_trace_code: string;
}

export interface AIConversationSessionV11 {
  id: string;
  customer_name: string;
  phone: string;
  intent: 'clinical_triage' | 'purchase' | 'flock_sale' | 'supervision' | 'biosecurity' | 'nutrition' | 'general';
  current_step: string;
  collected_fields: string[];
  missing_fields: string[];
  last_message: string;
  related_case_id?: string;
  status: 'active' | 'waiting_customer' | 'waiting_staff' | 'completed';
  updated_at: string;
}

export interface MediaAIAnalysisRecord {
  id: string;
  case_id: string;
  media_type: 'necropsy_image' | 'droppings_image' | 'barn_image' | 'litter_image' | 'respiratory_audio';
  target_label: string;
  quality_score: number;
  correct_target_detected: boolean;
  ai_findings: string[];
  confidence: number;
  clinician_confirmation_required: boolean;
  status: 'queued' | 'analyzed' | 'needs_retake' | 'reviewed';
}

export interface OutbreakRadarClusterV11 {
  id: string;
  disease_group: ClinicalDiseaseGroup;
  disease_name: string;
  governorate: string;
  district: string;
  suspected_cases: number;
  lab_confirmed_cases: number;
  first_seen_at: string;
  last_seen_at: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  nearby_farms_count: number;
  prevention_message: string;
  heat_score: number;
  broadcast_status: 'not_sent' | 'queued' | 'sent';
}

export interface RegionalPriceHistoryRecord {
  id: string;
  date: string;
  governorate: string;
  district?: string;
  category: 'live_poultry' | 'chicks' | 'feed' | 'medicine' | 'vaccine' | 'equipment';
  item_name: string;
  price_yer_old?: number;
  price_yer_new?: number;
  price_sar?: number;
  weight_category?: string;
  approved_by: string;
  published: boolean;
}

export interface FinancialKpiSnapshotV11 {
  date: string;
  gross_revenue_yer: number;
  cost_of_goods_yer: number;
  delivery_cost_yer: number;
  field_service_cost_yer: number;
  gross_profit_yer: number;
  net_profit_yer: number;
  receivables_yer: number;
  customer_debt_yer: number;
  wallet_balance_yer: number;
  branch_profitability: { branch_name: string; revenue_yer: number; cost_yer: number; profit_yer: number }[];
}

export interface VendorPerformanceReportV11 {
  company_id: string;
  company_name: string;
  category: string;
  products_count: number;
  units_sold: number;
  sales_yer: number;
  commission_yer: number;
  returns_count: number;
  stock_value_yer: number;
  top_governorate: string;
  settlement_due_yer: number;
}

export interface RecruitmentPipelineCaseV11 {
  id: string;
  applicant_name: string;
  role: 'عامل' | 'مشرف ميداني' | 'طبيب بيطري' | 'سائق' | 'مالية' | 'مستودع';
  governorate: string;
  phone: string;
  experience_years: number;
  requested_salary_yer: number;
  cv_url?: string;
  identity_verified: boolean;
  status: 'new' | 'screening' | 'interview' | 'accepted' | 'rejected' | 'contracted';
  rating?: number;
  assigned_farms?: string[];
}

export interface PushCampaignV11 {
  id: string;
  created_at: string;
  title: string;
  body: string;
  audience: 'all' | 'customers' | 'staff' | 'governorate' | 'district' | 'customer';
  target?: string;
  trigger: 'manual' | 'price_change' | 'outbreak' | 'payment' | 'withdrawal' | 'debt' | 'weather' | 'clinical';
  scheduled_at?: string;
  sent_count: number;
  failed_count: number;
  status: 'draft' | 'queued' | 'sent' | 'failed';
}

export interface PendingAdminApprovalV11 {
  id: string;
  created_at: string;
  requested_by: string;
  category: 'price' | 'exchange_rate' | 'zone_fee' | 'product' | 'antibiotic' | 'credit_override' | 'payment' | 'advertisement' | 'company' | 'permission';
  title: string;
  amount_yer?: number;
  risk: 'normal' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  note?: string;
}

export interface ProductionSecuritySettingsV11 {
  otp_enabled: boolean;
  admin_mfa_required: boolean;
  api_keys_server_only: boolean;
  storage_rules_enforced: boolean;
  rate_limiting_enabled: boolean;
  app_check_enabled: boolean;
  jwt_rotation_enabled: boolean;
  device_registration_enabled: boolean;
  remote_session_revoke_enabled: boolean;
  pii_encryption_enabled: boolean;
  immutable_audit_log_enabled: boolean;
  automated_backup_enabled: boolean;
}

export interface SystemOwnerControlsV11 {
  maintenance_mode: boolean;
  disable_marketplace: boolean;
  disable_ai_assistant: boolean;
  disable_payments: boolean;
  allow_new_registrations: boolean;
  require_owner_approval_for_admins: boolean;
  owner_only_modules: string[];
}

export interface LaunchQATestCaseV11 {
  id: string;
  scenario: string;
  expected_result: string;
  status: 'not_run' | 'passed' | 'failed' | 'blocked';
  last_run_at?: string;
  note?: string;
}


// ----------------------------------------------------
// 20. V12 - المستشار الذكي التجاري والعقود المتقدمة
// ----------------------------------------------------
export interface AIAdvisorConfigV12 {
  enabled: boolean;
  poultry_specialist_mode: boolean;
  sales_consultant_mode: boolean;
  customer_education_mode: boolean;
  anti_random_antibiotics_policy: boolean;
  require_vet_for_antibiotic_use: boolean;
  tone: 'مهني مقنع' | 'علمي مباشر' | 'مختصر ميداني';
  primary_objectives: string[];
  sales_playbook: string[];
  safety_guardrails: string[];
  poultry_knowledge_domains: string[];
  last_updated: string;
  updated_by: string;
}

export type PartnerBusinessTypeV12 = 'شركة أدوية' | 'مكتب أدوية' | 'مصنع/مطبخ أعلاف' | 'مورد معدات' | 'وكيل لقاحات' | 'مفرخ كتاكيت';
export interface PartnerTradeContractV12 {
  id: string;
  partner_company_id?: string;
  partner_name: string;
  business_type: PartnerBusinessTypeV12;
  contract_number: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'suspended' | 'expired' | 'draft';
  governorates: string[];
  customer_discount_percent: number;
  platform_commission_percent: number;
  settlement_days: number;
  show_prices_to_customers: boolean;
  show_discount_badge: boolean;
  customer_visible: boolean;
  require_admin_product_approval: boolean;
  logo_url?: string;
  showcase_image_url?: string;
  price_list_note?: string;
  notes?: string;
}

export interface PoultryMarketerContractV12 {
  id: string;
  marketer_name: string;
  company_name?: string;
  phone: string;
  governorates: string[];
  contract_number: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'suspended' | 'expired' | 'draft';
  fee_mode: 'percent_of_sale' | 'fixed_per_kg' | 'fixed_per_load';
  fee_value: number;
  settlement_days: number;
  daily_price_update_required: boolean;
  mortality_liability: 'none' | 'limited_window' | 'full_until_handover';
  mortality_liability_hours: number;
  mortality_liability_cap_percent?: number;
  pickup_deadline_hours: number;
  payment_terms: string;
  notes?: string;
}

export interface PoultryMarketingDailyRateV12 {
  id: string;
  date: string;
  governorate: string;
  district: string;
  weight_category: string;
  marketer_contract_id: string;
  marketer_name: string;
  buy_price_per_kg_yer: number;
  target_sell_price_per_kg_yer?: number;
  fee_yer_per_kg?: number;
  settlement_days: number;
  mortality_terms: string;
  approved_by: string;
  published: boolean;
}

export interface TradeFinanceContractV12 {
  id: string;
  customer_name: string;
  phone: string;
  farm_name: string;
  governorate: string;
  contract_number: string;
  total_value_yer: number;
  upfront_percent: number;
  upfront_amount_yer: number;
  deferred_percent: number;
  deferred_amount_yer: number;
  expected_marketing_date: string;
  due_rule: 'on_marketing_date' | 'fixed_date' | 'first_sale_proceeds';
  collateral_type: 'ضامن تجاري' | 'سند لأمر' | 'شيك آجل' | 'رهن منقول' | 'رهن عقاري' | 'أخرى';
  collateral_description: string;
  guarantor_name?: string;
  guarantor_phone?: string;
  medical_supervision_required: boolean;
  external_purchase_requires_notice: boolean;
  first_sale_proceeds_to_platform: boolean;
  status: 'draft' | 'awaiting_upfront' | 'active' | 'due' | 'settled' | 'defaulted' | 'cancelled';
  legal_review_status: 'not_reviewed' | 'review_required' | 'reviewed';
  notes?: string;
}

export interface FarmSupervisionContractV12 {
  id: string;
  contract_number: string;
  customer_name: string;
  phone: string;
  farm_name: string;
  governorate: string;
  district: string;
  hangars_count: number;
  flock_size: number;
  package_name: string;
  contract_fee_yer: number;
  start_date: string;
  end_date: string;
  responsible_vet_id?: string;
  responsible_vet_name: string;
  responsible_supervisor_name?: string;
  daily_report_time: string;
  scope: string[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  last_daily_report_at?: string;
  next_daily_report_due_at?: string;
  notes?: string;
}

export interface SupervisionDailyReportV12 {
  id: string;
  contract_id: string;
  date: string;
  submitted_at: string;
  submitted_by: string;
  feed_kg: number;
  water_liters: number;
  mortality_count: number;
  average_weight_grams?: number;
  temperature_celsius: number;
  humidity_percent: number;
  ventilation_note: string;
  litter_note: string;
  vaccine_or_treatment_note?: string;
  ai_summary: string;
  alert_level: 'normal' | 'watch' | 'urgent';
  sent_to_vet: boolean;
  sent_to_vet_at?: string;
}

export interface LaboratoryPartnerContractV12 {
  id: string;
  laboratory_id?: string;
  laboratory_name: string;
  contract_number: string;
  logo_url?: string;
  governorate: string;
  district: string;
  address: string;
  phone: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'suspended' | 'expired' | 'draft';
  default_discount_percent: number;
  sample_collection_discount_percent: number;
  settlement_days: number;
  customer_visible: boolean;
  turnaround_commitment_hours?: number;
  notes?: string;
}

export interface LaboratoryTestPriceV12 {
  id: string;
  lab_contract_id: string;
  test_name: string;
  category: 'بكتيري' | 'فيروسي' | 'طفيلي' | 'سموم أعلاف' | 'مياه' | 'أخرى';
  sample_type: string;
  base_price_yer: number;
  discount_percent: number;
  customer_price_yer: number;
  turnaround_hours: number;
  active: boolean;
  notes?: string;
}


// ----------------------------------------------------
// 21. V13 - إدارة المزارع المؤسسية والأتمتة والتنبؤ
// ----------------------------------------------------
export interface DeploymentReadinessItemV13 {
  id: string;
  area: 'قاعدة البيانات' | 'المصادقة والصلاحيات' | 'تخزين الوسائط' | 'الإشعارات' | 'المدفوعات' | 'واتساب/البريد' | 'IoT' | 'تحليل الصور والصوت';
  status: 'local_prototype' | 'configured' | 'production_ready' | 'blocked_external';
  current_mode: string;
  production_requirement: string;
  admin_note?: string;
}

export interface UiDesignConfigV13 {
  primary_hex: string;
  accent_hex: string;
  light_background_hex: string;
  dark_background_hex: string;
  success_hex: string;
  danger_hex: string;
  info_hex: string;
  glassmorphism_enabled: boolean;
  soft_material_enabled: boolean;
  auto_dark_mode: boolean;
  mobile_bottom_navigation: boolean;
  micro_interactions_enabled: boolean;
}

export interface FarmManagementContractV13 {
  id: string;
  contract_number: string;
  customer_name: string;
  phone: string;
  farm_name: string;
  governorate: string;
  district: string;
  management_mode: 'full_management' | 'self_managed';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  hangars_count: number;
  flock_size: number;
  service_fee_yer: number;
  responsible_vet_name: string;
  responsible_supervisor_name: string;
  hr_manager_name: string;
  marketing_manager_name: string;
  daily_report_time: string;
  report_channels: Array<'app' | 'email' | 'whatsapp'>;
  owner_approval_threshold_yer: number;
  client_portal_permissions: {
    view_daily_reports: boolean;
    view_financials: boolean;
    view_activity_stream: boolean;
    approve_large_expenses: boolean;
    operational_editing: boolean;
  };
  liability_terms: string;
  performance_bonus_mode: 'none' | 'fcr_improvement' | 'profit_share';
  performance_bonus_value: number;
  notes?: string;
}

export interface DailyExecutiveReportV13 {
  id: string;
  contract_id: string;
  date: string;
  generated_at: string;
  average_weight_grams: number;
  feed_kg: number;
  water_liters: number;
  daily_mortality_count: number;
  cumulative_mortality_percent: number;
  fcr: number;
  health_summary: string;
  vet_recommendation: string;
  daily_expenses_yer: number;
  daily_sales_yer: number;
  alert_level: 'normal' | 'watch' | 'urgent';
  pdf_status: 'not_generated' | 'generated';
  delivery_channels: Array<'app' | 'email' | 'whatsapp'>;
  delivery_status: 'queued' | 'partially_sent' | 'sent' | 'failed';
}

export interface AttendanceShiftV13 {
  id: string;
  staff_name: string;
  role: string;
  farm_name: string;
  date: string;
  check_in_at: string;
  check_out_at?: string;
  gps_lat: number;
  gps_lng: number;
  within_farm_geofence: boolean;
  shift_hours: number;
  note?: string;
}

export interface PayrollRecordV13 {
  id: string;
  staff_name: string;
  role: string;
  period: string;
  base_salary_yer: number;
  allowances_yer: number;
  bonuses_yer: number;
  advances_yer: number;
  deductions_yer: number;
  net_salary_yer: number;
  linked_farm_name?: string;
  status: 'draft' | 'approved' | 'paid';
}

export interface StaffPerformanceKpiV13 {
  id: string;
  staff_name: string;
  role: string;
  farm_name: string;
  period: string;
  fcr_score: number;
  mortality_control_score: number;
  report_timeliness_score: number;
  biosecurity_score: number;
  overall_score: number;
  admin_note?: string;
}

export interface PoultryBuyerV13 {
  id: string;
  buyer_name: string;
  phone: string;
  governorate: string;
  credit_rating: 'A' | 'B' | 'C' | 'cash_only';
  settlement_days: number;
  active: boolean;
  notes?: string;
}

export interface PoultrySalesLotV13 {
  id: string;
  contract_id?: string;
  farm_name: string;
  flock_code: string;
  bird_count: number;
  average_weight_kg: number;
  buyer_id: string;
  buyer_name: string;
  agreed_price_per_kg_yer: number;
  planned_loading_at: string;
  transport_vehicle?: string;
  loading_status: 'planned' | 'vehicle_assigned' | 'loading' | 'dispatched' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
  settlement_due_date: string;
  welfare_note: string;
}

export interface FarmActivityEventV13 {
  id: string;
  contract_id: string;
  at: string;
  actor_name: string;
  actor_role: string;
  category: 'health' | 'feed' | 'hr' | 'finance' | 'marketing' | 'biosecurity' | 'system';
  action: string;
  evidence_urls: string[];
  immutable: boolean;
}

export interface ExpenseApprovalV13 {
  id: string;
  contract_id: string;
  requested_at: string;
  requested_by: string;
  category: string;
  amount_yer: number;
  description: string;
  invoice_image_urls: string[];
  status: 'pending_owner' | 'approved' | 'rejected' | 'paid';
  owner_note?: string;
  decided_at?: string;
}

export interface PredictiveForecastV13 {
  id: string;
  farm_name: string;
  flock_code: string;
  generated_at: string;
  age_days: number;
  current_average_weight_grams: number;
  current_fcr: number;
  predicted_weight_3d_grams: number;
  predicted_weight_7d_grams: number;
  recommended_sale_date: string;
  expected_sale_weight_grams: number;
  confidence_percent: number;
  basis: string[];
  note: string;
}

export interface EarlyDiseaseSignalV13 {
  id: string;
  farm_name: string;
  flock_code: string;
  detected_at: string;
  feed_change_percent: number;
  water_change_percent: number;
  mortality_change_percent: number;
  temperature_delta_c: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  trigger_summary: string;
  assigned_vet_name?: string;
  status: 'new' | 'under_review' | 'closed';
}

export interface SupplierQualityScoreV13 {
  id: string;
  supplier_name: string;
  category: 'feed' | 'chicks' | 'medicine' | 'vaccine' | 'equipment';
  period: string;
  delivery_score: number;
  biological_performance_score: number;
  fcr_score?: number;
  chick_viability_score?: number;
  mycotoxin_quality_score?: number;
  complaint_score: number;
  overall_score: number;
  admin_note?: string;
}

export interface AutoReorderRuleV13 {
  id: string;
  farm_or_branch_name: string;
  category: 'feed' | 'medicine' | 'vaccine' | 'equipment';
  item_name: string;
  current_stock: number;
  unit: string;
  reorder_level: number;
  reorder_quantity: number;
  preferred_supplier: string;
  enabled: boolean;
  last_triggered_at?: string;
  draft_purchase_request_status: 'none' | 'ready_for_approval' | 'approved' | 'ordered';
}

export interface IoTSensorDeviceV13 {
  id: string;
  farm_name: string;
  hangar_name: string;
  sensor_type: 'temperature' | 'humidity' | 'ammonia' | 'co2' | 'water_flow' | 'power';
  device_name: string;
  status: 'online' | 'offline' | 'maintenance' | 'not_connected';
  last_value: number;
  unit: string;
  min_threshold?: number;
  max_threshold?: number;
  last_read_at?: string;
  alert_active: boolean;
}

export interface RemoteFarmAuditV13 {
  id: string;
  contract_id: string;
  farm_name: string;
  audited_at: string;
  auditor_name: string;
  cleanliness_score: number;
  biosecurity_score: number;
  litter_score: number;
  ventilation_score: number;
  worker_compliance_score: number;
  overall_score: number;
  image_urls: string[];
  findings: string[];
  corrective_actions: string[];
}

export interface DigitalContractSignatureV13 {
  id: string;
  contract_type: 'farm_management' | 'marketing' | 'finance' | 'partner' | 'laboratory';
  contract_id: string;
  signer_name: string;
  signer_role: string;
  method: 'otp' | 'drawn_signature' | 'clickwrap';
  signed_at?: string;
  document_hash: string;
  status: 'pending' | 'signed' | 'revoked';
  note?: string;
}

export interface ProfitSharingSettlementV13 {
  id: string;
  contract_id: string;
  farm_name: string;
  cycle_label: string;
  gross_sales_yer: number;
  feed_cost_yer: number;
  chick_cost_yer: number;
  medicine_vaccine_cost_yer: number;
  payroll_cost_yer: number;
  logistics_cost_yer: number;
  other_cost_yer: number;
  net_profit_yer: number;
  customer_share_percent: number;
  customer_share_yer: number;
  platform_share_percent: number;
  platform_share_yer: number;
  team_bonus_yer: number;
  status: 'draft' | 'approved' | 'settled';
}



// ----------------------------------------------------
// 22. V14 - مساحة الطبيب الميداني والتشخيص والإنتاج السحابي
// ----------------------------------------------------
export type FieldVisitStatusV14 = 'draft' | 'offline_saved' | 'submitted' | 'under_ai_review' | 'escalated' | 'under_senior_review' | 'closed';
export type DiagnosticSystemV14 = 'تنفسي' | 'هضمي' | 'عصبي' | 'دوري' | 'مناعي' | 'عضلي' | 'عام';

export interface FieldNecropsyObservationV14 {
  id: string;
  organ_name: string;
  system: DiagnosticSystemV14;
  image_url?: string;
  image_name?: string;
  image_quality: 'not_checked' | 'clear' | 'needs_retake';
  lesion_tags: string[];
  description: string;
}

export interface FieldVoiceNoteV14 {
  id: string;
  recorded_at: string;
  audio_url?: string;
  file_name?: string;
  duration_seconds?: number;
  transcript_status: 'not_requested' | 'queued' | 'transcribed' | 'failed';
  transcript_text?: string;
  note: string;
}

export interface FieldDoctorVisitV14 {
  id: string;
  visit_number: string;
  case_id?: string;
  contract_id?: string;
  farm_name: string;
  customer_name: string;
  phone: string;
  governorate: string;
  district: string;
  detailed_address: string;
  gps_lat?: number;
  gps_lng?: number;
  doctor_name: string;
  supervisor_name?: string;
  visit_reason: 'routine' | 'urgent_mortality' | 'sample_collection' | 'follow_up' | 'biosecurity_audit';
  started_at: string;
  ended_at?: string;
  offline_created: boolean;
  sync_status: 'local_pending' | 'queued' | 'synced';
  flock_size: number;
  age_days: number;
  mortality_today: number;
  average_weight_grams?: number;
  feed_kg: number;
  water_liters: number;
  temperature_celsius: number;
  humidity_percent: number;
  air_speed_mps?: number;
  ammonia_ppm?: number;
  co2_ppm?: number;
  symptoms_description: string;
  barn_photos: string[];
  droppings_photos: string[];
  litter_photos: string[];
  necropsy_observations: FieldNecropsyObservationV14[];
  voice_notes: FieldVoiceNoteV14[];
  status: FieldVisitStatusV14;
}

export interface AIDiagnosticAssessmentV14 {
  id: string;
  visit_id: string;
  case_id?: string;
  created_at: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  suspected_conditions: { disease: string; probability_percent: number; rationale: string }[];
  key_findings: string[];
  recommended_lab_tests: string[];
  recommended_next_steps: string[];
  image_analysis_status: 'not_connected' | 'quality_only' | 'model_assisted';
  audio_analysis_status: 'not_connected' | 'quality_only' | 'model_assisted';
  senior_vet_required: boolean;
  medical_disclaimer: string;
  status: 'draft' | 'ready_for_vet' | 'reviewed' | 'overridden_by_vet';
}

export interface CaseEscalationV14 {
  id: string;
  case_id?: string;
  visit_id: string;
  created_at: string;
  escalated_by: string;
  reason: string;
  priority: 'normal' | 'urgent' | 'critical';
  assigned_senior_vet: string;
  attachment_summary: string[];
  status: 'queued' | 'accepted' | 'under_review' | 'decision_sent' | 'closed';
  senior_decision?: string;
  decided_at?: string;
}

export interface CaseClosureReportV14 {
  id: string;
  case_id?: string;
  visit_id: string;
  closed_at: string;
  closed_by: string;
  final_diagnosis: string;
  outcome: 'recovered' | 'improving' | 'stable' | 'loss_event' | 'referred';
  mortality_returned_to_baseline: boolean;
  follow_up_required: boolean;
  follow_up_date?: string;
  summary: string;
}

export interface BiosecurityVaccinationScheduleV14 {
  id: string;
  farm_name: string;
  flock_code: string;
  event_type: 'vaccine' | 'disinfection' | 'biosecurity_audit' | 'withdrawal_end' | 'lab_followup';
  title: string;
  due_at: string;
  responsible_role: string;
  status: 'scheduled' | 'due' | 'completed' | 'missed';
  notification_queued: boolean;
  note?: string;
}

export interface CloudProductionConfigV14 {
  database_provider: 'local_json' | 'postgresql' | 'firebase_firestore';
  database_connection_status: 'local_only' | 'configured' | 'connected' | 'error';
  auth_provider: 'local_prototype' | 'firebase_auth' | 'custom_jwt';
  auth_connection_status: 'prototype' | 'configured' | 'connected' | 'error';
  media_storage_provider: 'local' | 'firebase_storage' | 's3_compatible';
  media_storage_status: 'local_only' | 'configured' | 'connected' | 'error';
  realtime_sync_enabled: boolean;
  encryption_at_rest_required: boolean;
  encrypted_transport_required: boolean;
  signed_media_urls_required: boolean;
  backup_policy: 'manual' | 'daily' | 'hourly';
  last_cloud_backup_at?: string;
  region_label: string;
  production_note: string;
}

export interface FieldMediaQueueItemV14 {
  id: string;
  visit_id: string;
  media_type: 'necropsy' | 'barn' | 'droppings' | 'litter' | 'voice';
  file_name: string;
  local_preview_url?: string;
  created_at: string;
  status: 'local_only' | 'queued' | 'uploaded' | 'failed';
  remote_url?: string;
}


// ----------------------------------------------------
// V15 Enterprise ERP enhancements
// ----------------------------------------------------
export type SyncConflictStrategyV15 = 'last_write_wins' | 'server_wins' | 'client_wins' | 'manual_review';

export interface OfflineSyncConfigV15 {
  database_name: string;
  storage_engine: 'indexeddb';
  indexeddb_enabled: boolean;
  media_blob_cache_enabled: boolean;
  estimated_local_capacity_mb: number;
  conflict_strategy: SyncConflictStrategyV15;
  device_id: string;
  client_revision: number;
  server_revision: number;
  pending_actions: number;
  pending_media: number;
  last_sync_at?: string;
  last_successful_full_sync_at?: string;
}

export interface SyncConflictRecordV15 {
  id: string;
  entity_type: string;
  entity_id: string;
  field_name?: string;
  client_value: unknown;
  server_value: unknown;
  client_updated_at: string;
  server_updated_at: string;
  strategy: SyncConflictStrategyV15;
  resolution: 'pending' | 'client' | 'server' | 'merged';
  resolved_at?: string;
  resolved_by?: string;
}

export interface VetVerificationFeedbackV15 {
  id: string;
  assessment_id: string;
  visit_id?: string;
  case_id?: string;
  ai_top_suggestion: string;
  ai_confidence_percent: number;
  vet_confirmed_diagnosis: string;
  confirmation_level: 'confirmed' | 'partially_confirmed' | 'rejected' | 'pending_lab';
  image_labels_verified: string[];
  lab_result_reference?: string;
  clinical_note: string;
  use_for_model_improvement: boolean;
  verified_by: string;
  verified_at: string;
}

export interface PredictivePerformanceSignalV15 {
  id: string;
  farm_name: string;
  flock_code: string;
  generated_at: string;
  age_days: number;
  fcr_current: number;
  fcr_baseline: number;
  feed_change_percent: number;
  water_change_percent: number;
  mortality_change_percent: number;
  temperature_delta_c: number;
  humidity_delta_percent: number;
  weather_risk_label: string;
  disease_risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  predicted_weight_7d_grams: number;
  predicted_harvest_date: string;
  recommended_actions: string[];
}

export interface FeedIngredientV15 {
  id: string;
  name: string;
  category: 'energy' | 'protein' | 'mineral' | 'additive';
  crude_protein_percent: number;
  metabolizable_energy_kcal_kg: number;
  digestible_lysine_percent: number;
  calcium_percent: number;
  available_phosphorus_percent: number;
  price_per_kg_yer: number;
  min_inclusion_percent: number;
  max_inclusion_percent: number;
  active: boolean;
}

export interface FeedFormulaLineV15 {
  ingredient_id: string;
  ingredient_name: string;
  inclusion_percent: number;
}

export interface FeedFormulaProfileV15 {
  id: string;
  name: string;
  bird_type: 'broiler' | 'layer' | 'breeder';
  stage: 'starter' | 'grower' | 'finisher' | 'layer' | 'breeder';
  target_protein_percent: number;
  target_energy_kcal_kg: number;
  target_digestible_lysine_percent: number;
  target_calcium_percent: number;
  target_available_phosphorus_percent: number;
  lines: FeedFormulaLineV15[];
  calculated_protein_percent: number;
  calculated_energy_kcal_kg: number;
  calculated_digestible_lysine_percent: number;
  calculated_calcium_percent: number;
  calculated_available_phosphorus_percent: number;
  calculated_cost_per_kg_yer: number;
  status: 'draft' | 'balanced' | 'needs_adjustment';
}

export interface FeedFormulationStateV15 {
  ingredients: FeedIngredientV15[];
  formulas: FeedFormulaProfileV15[];
  last_recalculated_at?: string;
}

export interface BiosecurityChecklistItemV15 {
  id: string;
  label: string;
  category: 'entry_control' | 'disinfection' | 'movement' | 'water' | 'litter' | 'mortality' | 'ppe' | 'vehicles';
  frequency: 'daily' | 'weekly' | 'per_entry' | 'per_vehicle' | 'event_based';
  required: boolean;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
  evidence_url?: string;
}

export interface BiosecurityChecklistRunV15 {
  id: string;
  farm_name: string;
  governorate: string;
  district: string;
  date: string;
  outbreak_risk_level: 'normal' | 'watch' | 'restricted' | 'critical';
  movement_restriction_active: boolean;
  restriction_reason?: string;
  score_percent: number;
  next_due_at: string;
  items: BiosecurityChecklistItemV15[];
}

export interface HardwareIntegrationDeviceV15 {
  id: string;
  device_type: 'thermal_printer' | 'digital_scale';
  name: string;
  bluetooth_address?: string;
  protocol: 'bluetooth_spp_escpos' | 'bluetooth_spp_text' | 'ble_gatt' | 'manual';
  status: 'not_configured' | 'paired' | 'connected' | 'error';
  last_seen_at?: string;
  last_value?: number;
  unit?: 'kg' | 'g';
  notes?: string;
}

export interface AppUpdateConfigV15 {
  provider: 'google_play_in_app_update' | 'manual_apk' | 'disabled';
  enabled: boolean;
  current_version_name: string;
  current_version_code: number;
  last_checked_at?: string;
  update_available: boolean;
  available_version_code?: number;
  update_priority: 'normal' | 'recommended' | 'required';
  status: 'not_checked' | 'up_to_date' | 'available' | 'downloading' | 'ready' | 'error';
  note?: string;
}

export interface DataExchangeJobV15 {
  id: string;
  created_at: string;
  direction: 'import' | 'export';
  format: 'xlsx' | 'csv';
  dataset: string;
  rows_count: number;
  status: 'pending' | 'completed' | 'failed' | 'preview';
  file_name?: string;
  note?: string;
}

export interface ExecutiveDashboardV15 {
  generated_at: string;
  gross_revenue_yer: number;
  net_profit_yer: number;
  active_farms: number;
  live_birds: number;
  average_fcr: number;
  average_mortality_percent: number;
  biosecurity_average_percent: number;
  open_clinical_cases: number;
  high_risk_farms: number;
  inventory_value_yer: number;
  receivables_yer: number;
  sales_trend: number[];
  profit_trend: number[];
  fcr_trend: number[];
  mortality_trend: number[];
}



// ----------------------------------------------------
// 25. V16 - القيادة المؤسسية، CRM، القوة الميدانية والاتصالات
// ----------------------------------------------------
export type GovernanceRoleKeyV16 = 'system_owner' | 'finance' | 'field_ops' | 'vet_manager' | 'sales_marketing' | 'warehouse' | 'branch_manager' | 'auditor';

export interface GovernanceRoleV16 {
  id: string;
  key: GovernanceRoleKeyV16;
  name: string;
  description: string;
  scope: 'all_branches' | 'assigned_branches' | 'assigned_region' | 'read_only';
  can_view_finance: boolean;
  can_edit_prices: boolean;
  can_approve_discounts: boolean;
  can_manage_staff: boolean;
  can_view_live_locations: boolean;
  requires_mfa: boolean;
  active: boolean;
}

export interface AccountingJournalEntryV16 {
  id: string;
  date: string;
  branch_name: string;
  reference: string;
  debit_account: string;
  credit_account: string;
  amount_yer: number;
  description: string;
  created_by: string;
  status: 'draft' | 'posted' | 'reversed';
}

export interface BranchAccountingSnapshotV16 {
  branch_id: string;
  branch_name: string;
  date: string;
  cash_yer: number;
  receivables_yer: number;
  payables_yer: number;
  inventory_yer: number;
  revenue_mtd_yer: number;
  expenses_mtd_yer: number;
  net_profit_mtd_yer: number;
  debt_overdue_yer: number;
}

export interface VendorBranchV16 {
  id: string;
  partner_contract_id: string;
  company_name: string;
  branch_name: string;
  governorate: string;
  district: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  linked_platform_branch_id?: string;
  customer_visible: boolean;
  active: boolean;
}

export interface RegionalPricingRuleV16 {
  id: string;
  company_name: string;
  product_name: string;
  category: 'medicine' | 'feed' | 'vaccine' | 'equipment' | 'chicks';
  governorate: string;
  district?: string;
  customer_tier: 'standard' | 'vip' | 'contracted';
  base_price_yer: number;
  discount_percent: number;
  net_price_yer: number;
  currency: 'YER_OLD' | 'YER_NEW' | 'SAR';
  valid_from: string;
  valid_until?: string;
  approved_by: string;
  published: boolean;
}

export interface AISmartBranchRouteV16 {
  id: string;
  created_at: string;
  customer_name: string;
  governorate: string;
  district: string;
  customer_lat?: number;
  customer_lng?: number;
  prescribed_product: string;
  doctor_approval_reference?: string;
  branch_id: string;
  branch_name: string;
  company_name: string;
  distance_km?: number;
  stock_available: number;
  eta_minutes: number;
  routing_reason: string;
  status: 'suggested' | 'accepted' | 'reserved' | 'completed' | 'cancelled';
}

export interface Customer360ProfileV16 {
  id: string;
  customer_name: string;
  phone: string;
  governorate: string;
  district: string;
  customer_tier: 'standard' | 'vip' | 'contracted';
  farms_count: number;
  active_flocks: number;
  lifetime_sales_yer: number;
  outstanding_debt_yer: number;
  last_purchase_at?: string;
  previous_disease_events: string[];
  latest_lab_results: string[];
  preferred_categories: string[];
  assigned_sales_rep?: string;
  assigned_vet?: string;
  risk_note?: string;
}

export interface CrmOpportunityV16 {
  id: string;
  customer_id: string;
  customer_name: string;
  title: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  expected_value_yer: number;
  probability_percent: number;
  owner_name: string;
  next_action: string;
  due_at?: string;
  source: 'field' | 'app' | 'whatsapp' | 'referral' | 'campaign';
}

export interface TargetedCampaignV16 {
  id: string;
  name: string;
  audience_rule: string;
  category: 'education' | 'offer' | 'biosecurity' | 'feed' | 'vaccination' | 'service';
  message: string;
  target_count: number;
  channels: ('push' | 'whatsapp' | 'sms' | 'in_app')[];
  status: 'draft' | 'approved' | 'scheduled' | 'sent' | 'paused';
  scheduled_at?: string;
  requires_medical_review: boolean;
}

export interface SalesTargetV16 {
  id: string;
  rep_name: string;
  region: string;
  month: string;
  target_yer: number;
  achieved_yer: number;
  orders_target: number;
  orders_achieved: number;
  incentive_percent: number;
}

export interface FieldStaffPositionV16 {
  id: string;
  staff_name: string;
  staff_role: 'vet' | 'field_supervisor' | 'sales_rep' | 'driver';
  phone: string;
  lat: number;
  lng: number;
  last_ping_at: string;
  assigned_route?: string;
  assigned_farm?: string;
  movement_status: 'available' | 'en_route' | 'on_site' | 'offline';
  geofence_valid: boolean;
  visit_cost_yer?: number;
}

export interface FieldInspectionV16 {
  id: string;
  visit_number: string;
  staff_name: string;
  farm_name: string;
  customer_name: string;
  governorate: string;
  district: string;
  checked_in_at: string;
  checked_out_at?: string;
  geofence_distance_m: number;
  geofence_verified: boolean;
  biosecurity_score_percent: number;
  necropsy_notes?: string;
  media_urls: string[];
  client_signature_url?: string;
  offline_created: boolean;
  sync_status: 'local' | 'queued' | 'synced' | 'conflict';
  inspection_items: { label: string; value: string; status: 'ok' | 'warning' | 'critical' }[];
}

export interface WhatsAppHubConfigV16 {
  enabled: boolean;
  provider: 'meta_cloud' | 'custom_provider' | 'not_configured';
  business_number_label: string;
  api_mode: 'simulation' | 'backend_api';
  connection_status: IntegrationConnectionStatus;
  default_language: 'ar' | 'en';
  ceo_digest_time: string;
  invoice_auto_send: boolean;
  receipt_auto_send: boolean;
  emergency_auto_send: boolean;
  note: string;
}

export interface CommunicationMessageV16 {
  id: string;
  created_at: string;
  channel: 'whatsapp' | 'push' | 'sms' | 'in_app';
  recipient_name: string;
  recipient_phone?: string;
  audience_group?: string;
  template_key: string;
  subject: string;
  body: string;
  attachment_url?: string;
  related_reference?: string;
  priority: 'normal' | 'high' | 'critical';
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'simulation';
  sent_at?: string;
}

export interface CEODailyDigestV16 {
  id: string;
  date: string;
  generated_at: string;
  gross_sales_yer: number;
  collected_yer: number;
  receivables_yer: number;
  mortality_today: number;
  critical_alerts_count: number;
  field_visits_count: number;
  deliveries_count: number;
  summary_text: string;
  whatsapp_status: 'not_sent' | 'queued' | 'sent' | 'simulation';
}

export interface BranchLiveSnapshotV16 {
  branch_id: string;
  branch_name: string;
  governorate: string;
  status: 'open' | 'closed' | 'warning';
  sales_today_yer: number;
  collected_today_yer: number;
  pending_orders: number;
  low_stock_items: number;
  active_staff: number;
  critical_cases: number;
  lat: number;
  lng: number;
}

export interface OwnerChangeAlertV16 {
  id: string;
  created_at: string;
  severity: 'info' | 'warning' | 'critical';
  module: 'prices' | 'discounts' | 'finance' | 'permissions' | 'records' | 'inventory' | 'clinical';
  actor_name: string;
  action: string;
  before_value?: string;
  after_value?: string;
  reference?: string;
  acknowledged: boolean;
  acknowledged_at?: string;
}

export interface OwnerWarRoomV16 {
  last_refreshed_at: string;
  live_mode: boolean;
  sales_today_yer: number;
  collected_today_yer: number;
  net_cash_position_yer: number;
  active_field_staff: number;
  active_deliveries: number;
  open_critical_cases: number;
  epidemic_risk_regions: number;
  overdue_receivables_yer: number;
  branches: BranchLiveSnapshotV16[];
}


// ----------------------------------------------------
// 25. V17 - دورة البيع والتسوية والتوجيه التتابعي والإيجار
// ----------------------------------------------------
export type FlockSalePipelineStatusV17 =
  | 'collecting_data' | 'customer_price_review' | 'sales_manager_review'
  | 'routing_brokers' | 'broker_offer_ready' | 'customer_negotiation'
  | 'human_sales_intervention' | 'confirmed' | 'loading'
  | 'awaiting_broker_payment' | 'finance_settlement' | 'customer_paid'
  | 'completed' | 'cancelled';

export interface BrokerRouteAttemptV17 {
  broker_contract_id: string;
  broker_name: string;
  priority: number;
  region_match: boolean;
  status: 'pending' | 'offered' | 'accepted' | 'rejected' | 'expired' | 'skipped';
  offered_at?: string;
  expires_at?: string;
  responded_at?: string;
  final_price_per_kg_yer?: number;
  settlement_days?: number;
  loading_at?: string;
  mortality_terms?: string;
  rejection_reason?: string;
}

export interface FlockSalePipelineV17 {
  id: string;
  request_number: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  phone: string;
  farm_name: string;
  flock_code: string;
  governorate: string;
  district: string;
  address: string;
  lat?: number;
  lng?: number;
  birds_count: number;
  average_weight_kg: number;
  estimated_live_weight_kg: number;
  weight_category: string;
  bourse_price_per_kg_yer: number;
  bourse_reference: string;
  customer_price_accepted: boolean;
  sales_manager_name: string;
  marketing_fee_mode: 'percent_of_sale' | 'fixed_per_kg' | 'fixed_per_load';
  marketing_fee_value: number;
  platform_commission_percent: number;
  broker_timeout_minutes: number;
  broker_queue: BrokerRouteAttemptV17[];
  current_broker_index: number;
  negotiation_attempts: number;
  customer_final_accepted: boolean;
  sales_manager_phone?: string;
  loading_evidence_urls: string[];
  status: FlockSalePipelineStatusV17;
  settlement_id?: string;
  notes?: string;
}

export interface PoultryWeightInvoiceLineV17 {
  id: string;
  size_class: 'large' | 'medium' | 'small' | 'mixed';
  birds_count: number;
  total_weight_kg: number;
  price_per_kg_yer: number;
  line_total_yer: number;
}

export interface FlockSaleSettlementV17 {
  id: string;
  sale_pipeline_id: string;
  broker_name: string;
  customer_name: string;
  gross_sale_yer: number;
  marketing_fee_yer: number;
  platform_fee_yer: number;
  debt_deduction_yer: number;
  other_deductions_yer: number;
  net_customer_yer: number;
  broker_payment_reference?: string;
  broker_payment_proof_url?: string;
  broker_payment_verified_by?: string;
  broker_payment_verified_at?: string;
  customer_transfer_reference?: string;
  customer_transfer_proof_url?: string;
  customer_transfer_at?: string;
  invoice_lines: PoultryWeightInvoiceLineV17[];
  broker_receipt_url?: string;
  sale_invoice_url?: string;
  status: 'awaiting_broker_payment' | 'payment_under_review' | 'broker_paid' | 'settlement_ready' | 'customer_transferred' | 'closed';
  created_at: string;
}

export interface SupplierRouteAttemptV17 {
  partner_contract_id: string;
  supplier_name: string;
  priority: number;
  governorate_match: boolean;
  status: 'pending' | 'offered' | 'accepted' | 'rejected' | 'expired' | 'skipped';
  offered_at?: string;
  expires_at?: string;
  confirmed_quantity?: number;
  confirmed_unit_price_yer?: number;
  eta_hours?: number;
  rejection_reason?: string;
}

export interface SupplierRoutingOrderV17 {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  phone: string;
  governorate: string;
  district: string;
  address: string;
  category: 'medicine' | 'antibiotic' | 'feed' | 'chicks' | 'equipment' | 'vaccine';
  product_name: string;
  product_id?: string;
  quantity: number;
  unit_label: string;
  official_price_yer: number;
  transport_fee_yer: number;
  customer_accepted_total: boolean;
  doctor_approval_reference?: string;
  requires_doctor_approval: boolean;
  supplier_timeout_minutes: number;
  supplier_queue: SupplierRouteAttemptV17[];
  current_supplier_index: number;
  platform_commission_percent: number;
  payment_status: 'not_ready' | 'awaiting_customer' | 'proof_uploaded' | 'verified';
  customer_payment_proof_url?: string;
  customer_payment_reference?: string;
  finance_verified_by?: string;
  finance_verified_at?: string;
  invoice_number?: string;
  lot_numbers?: string[];
  supplier_payment_reference?: string;
  supplier_payment_proof_url?: string;
  supplier_settlement_status: 'not_due' | 'pending' | 'paid';
  status: 'draft' | 'sales_review' | 'routing_suppliers' | 'supplier_confirmed' | 'awaiting_payment' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
}

export type ReportRouteCategoryV17 = 'clinical' | 'necropsy' | 'feed_fcr' | 'equipment' | 'finance' | 'sales' | 'biosecurity' | 'executive';
export interface StaffReportRoutingRuleV17 {
  id: string;
  category: ReportRouteCategoryV17;
  governorate: string | 'ALL';
  primary_staff_name: string;
  primary_role: string;
  phone: string;
  whatsapp: string;
  app_notification: boolean;
  whatsapp_notification: boolean;
  escalation_staff_name?: string;
  response_sla_minutes: number;
  active: boolean;
}

export interface RoutedReportV17 {
  id: string;
  created_at: string;
  category: ReportRouteCategoryV17;
  governorate: string;
  reference: string;
  summary: string;
  assigned_to: string;
  assigned_role: string;
  channels: Array<'app' | 'whatsapp' | 'email'>;
  status: 'queued' | 'delivered' | 'acknowledged' | 'escalated';
  acknowledged_at?: string;
}

export interface FarmLeaseListingV17 {
  id: string;
  listing_number: string;
  created_at: string;
  owner_name: string;
  owner_phone: string;
  governorate: string;
  district: string;
  address: string;
  lat?: number;
  lng?: number;
  hangars_count: number;
  length_m: number;
  width_m: number;
  height_m: number;
  ventilation_type: 'open' | 'closed' | 'tunnel';
  target_density_birds_m2: number;
  estimated_capacity_birds: number;
  equipment_items: string[];
  equipment_gaps: string[];
  image_urls: string[];
  video_urls: string[];
  media_quality_status: 'missing' | 'needs_review' | 'accepted';
  rent_mode: 'per_cycle' | 'monthly' | 'annual';
  asking_price_yer: number;
  advance_payment_percent: number;
  platform_commission_percent: number;
  platform_commission_yer: number;
  admin_review_status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  published: boolean;
  contact_released: boolean;
  ai_assessment_note?: string;
}

export interface LeaseEscrowContractV17 {
  id: string;
  contract_number: string;
  listing_id: string;
  lessor_name: string;
  lessee_name: string;
  start_date: string;
  end_date: string;
  rent_value_yer: number;
  platform_commission_yer: number;
  collection_method: 'first_payment_escrow' | 'linked_to_cycle_inputs' | 'commercial_guarantee';
  first_payment_yer: number;
  platform_received_yer: number;
  owner_net_yer: number;
  penalty_clause_summary: string;
  legal_review_status: 'required' | 'reviewed';
  lessor_signed: boolean;
  lessee_signed: boolean;
  platform_signed: boolean;
  contact_release_allowed: boolean;
  status: 'draft' | 'awaiting_signatures' | 'awaiting_payment' | 'active' | 'completed' | 'cancelled';
}

export interface ApprovedSupplementProtocolV17 {
  id: string;
  name: string;
  supplement_type: 'vitamin' | 'electrolyte' | 'supportive';
  climate: 'hot' | 'cold' | 'moderate' | 'any';
  min_age_days: number;
  max_age_days: number;
  approved_dose_text: string;
  administration_window: string;
  approved_by_vet: string;
  active: boolean;
  customer_note: string;
}

export interface V17ControlConfig {
  flock_sale_broker_timeout_minutes: number;
  supplier_timeout_minutes: number;
  default_platform_sale_commission_percent: number;
  default_lease_commission_percent: number;
  max_ai_negotiation_attempts: number;
  platform_main_account_label: string;
  require_finance_verification_before_customer_payout: boolean;
  hide_counterparty_contacts_until_contract: boolean;
  ai_may_prescribe_antibiotics: false;
  ai_may_prescribe_vaccines: false;
  supplements_only_from_vet_approved_protocols: boolean;
}


// ----------------------------------------------------
// V18 - المختبر، الحجز، المعايير، الائتمان والتكامل التعاقدي
// ----------------------------------------------------
export type LabFinalDecisionV18 = 'سليم' | 'برنامج علاج' | 'برنامج تحصين' | 'خطر' | 'أمر إعدام' | 'بيع اضطراري';
export interface AssignedVetFarmV18 {
  id: string; farm_id: string; farm_name: string; customer_name: string; customer_phone: string;
  governorate: string; district: string; vet_id: string; vet_name: string; vet_phone: string;
  active: boolean; assigned_at: string;
}
export interface SampleTrackingCaseV18 {
  id: string; tracking_number: string; case_id: string; farm_id: string; farm_name: string; customer_name: string; customer_phone: string;
  assigned_vet_id: string; assigned_vet_name: string; assigned_vet_phone: string; laboratory_id: string; laboratory_name: string;
  symptoms_summary: string; bird_age_days: number; vaccination_history: string[]; field_notes: string; preliminary_ai_summary: string;
  test_reason: string; sample_type: string; requested_tests: string[]; fresh_dead_birds_requested?: number; preservation_instructions: string;
  estimated_result_at?: string; sample_received_at?: string; lab_result_summary?: string; lab_report_url?: string;
  ai_result_summary?: string; vet_signed_by?: string; vet_signed_at?: string; final_decision?: LabFinalDecisionV18; customer_released_at?: string;
  status: 'draft' | 'awaiting_vet_approval' | 'sample_requested' | 'sample_in_transit' | 'under_lab_test' | 'result_received' | 'awaiting_vet_signature' | 'released_to_customer' | 'closed';
  chain_of_custody: string[];
}

export interface HatcheryRegionalPriceV18 {
  id: string; date: string; hatchery_name: string; strain: string; chick_type: string; governorate: string; district?: string;
  price_per_chick_yer: number; price_per_chick_sar?: number; available_quantity: number; delivery_lead_hours: number; published: boolean; updated_by: string;
}
export interface ChickReservationV18 {
  id: string; reservation_number: string; created_at: string; customer_name: string; phone: string; farm_id: string; farm_name: string;
  governorate: string; district: string; address: string; lat?: number; lng?: number; hatchery_name: string; strain: string; quantity: number;
  requested_delivery_date: string; farm_cleaned: boolean; biosecurity_closed: boolean; downtime_days: number; minimum_downtime_days: number;
  readiness_score: number; readiness_status: 'not_ready' | 'needs_review' | 'ready'; chick_cost_yer: number; transport_yer: number;
  reserve_lab_yer: number; reserve_feed_yer: number; reserve_emergency_yer: number; total_package_yer: number; customer_accepted: boolean;
  finance_status: 'unpaid' | 'proof_uploaded' | 'verified' | 'guarantee_approved'; sales_status: 'draft' | 'sales_review' | 'reserved' | 'scheduled' | 'released' | 'cancelled';
  notes?: string;
}

export type ClimateZoneV18 = 'hot' | 'moderate' | 'cold';
export interface BreedRegionalStandardV18 {
  id: string; strain: string; governorate: string | 'ALL'; climate_zone: ClimateZoneV18; min_age_days: number; max_age_days: number;
  target_weight_g: number; daily_feed_g_per_bird: number; daily_water_ml_per_bird: number; temperature_c: number; humidity_min: number; humidity_max: number;
  max_density_birds_m2: number; feed_form: 'crumb' | 'pellet' | 'mash'; vaccination_program_id?: string; preventive_program_note?: string;
  antibiotic_program_allowed: false; approved_by: string; version: number; active: boolean;
}
export interface FarmPerformanceEntryV18 {
  id: string; farm_id: string; flock_id: string; date: string; age_days: number; birds_alive: number; average_weight_g: number;
  feed_kg: number; water_liters: number; mortality_count: number; temperature_c: number; humidity_percent: number;
  fcr?: number; daily_gain_g?: number; target_weight_gap_g?: number; standard_rule_id?: string; standard_feed_kg?: number; standard_water_liters?: number;
  ai_note?: string;
}
export interface CostCalculatorConfigV18 {
  id: string; governorate: string; litter_type: 'تبن' | 'نشارة' | 'أخرى'; litter_price_per_unit_yer: number; heater_unit_price_yer: number;
  fan_unit_price_yer: number; feeder_unit_price_yer: number; drinker_unit_price_yer: number; chick_price_reference_yer: number; updated_at: string;
}

export interface GeneralManagerStaffVaultV18 {
  id: string; full_name: string; role: string; department: string; phone: string; whatsapp: string; cv_url?: string; experience_years: number;
  hire_date: string; promotion_history: string[]; salary_yer: number; status: 'active' | 'leave' | 'suspended' | 'ended'; confidential_note?: string;
}
export interface ManagerDirectiveV18 {
  id: string; created_at: string; title: string; body: string; target_department: 'finance' | 'sales' | 'veterinary' | 'hr' | 'operations'; priority: 'normal' | 'high' | 'critical';
  issued_by: string; acknowledged_by?: string; acknowledged_at?: string; status: 'issued' | 'acknowledged' | 'completed';
}
export interface FarmLaborEmploymentV18 {
  id: string; worker_name: string; phone: string; national_id: string; farm_id: string; farm_name: string; recommended_by_vet?: string;
  start_date: string; salary_mode: 'monthly' | 'annual' | 'daily'; salary_yer: number; daily_expense_allowance_yer: number; advances_yer: number;
  guarantees: string[]; doctor_payment_approval_required: boolean; status: 'candidate' | 'approved_pool' | 'assigned' | 'active' | 'ended';
}

export interface GeoOutbreakAlertV18 {
  id: string; disease_name: string; disease_group: string; source_case_id: string; source_lat: number; source_lng: number; governorate: string; district: string;
  radius_km: number; severity: 'watch' | 'high' | 'critical'; suspected_farms: number; lab_confirmed: boolean; created_at: string; expires_at: string;
  nearby_farm_ids: string[]; biosecurity_message: string; status: 'draft' | 'published' | 'expired';
}
export interface MarketTrendPointV18 { date: string; poultry_price_yer: number; feed_price_yer: number; }
export interface MarketForecastV18 {
  id: string; governorate: string; generated_at: string; horizon_days: 30 | 60 | 90; historical: MarketTrendPointV18[];
  trend: 'up' | 'flat' | 'down'; seasonal_note: string; forecast_min_yer: number; forecast_max_yer: number; confidence_percent: number;
  advisory_note: string; approved_for_display: boolean;
}

export interface CreditQualityScoreV18 {
  id: string; entity_type: 'farm' | 'broker' | 'supplier'; entity_id: string; entity_name: string; updated_at: string;
  production_score: number; payment_score: number; delivery_score: number; quality_score: number; biosecurity_score: number; composite_score: number;
  grade: 'A' | 'B' | 'C' | 'D'; credit_limit_yer?: number; preferred_terms?: string; reasons: string[]; manual_override?: number;
}

export interface IntegratorContractV18 {
  id: string; contract_number: string; company_name: string; farm_id: string; farm_name: string; customer_name: string;
  start_date: string; expected_harvest_date: string; chicks_supplied: number; feed_supplied_kg: number; medicines_budget_yer: number;
  company_buys_full_flock: boolean; buyback_price_rule: string; target_fcr: number; farmer_bonus_per_kg_yer: number; platform_fee_percent: number;
  current_feed_consumed_kg: number; current_live_weight_kg: number; calculated_fcr: number; farmer_estimated_profit_yer: number;
  status: 'draft' | 'active' | 'harvest_pending' | 'settlement' | 'completed' | 'cancelled';
}

export interface TeleVetSessionV18 {
  id: string; case_id?: string; farm_id: string; customer_name: string; assigned_vet_name: string; scheduled_at: string; started_at?: string; ended_at?: string;
  channel: 'video' | 'audio'; provider: 'webrtc' | 'external_link'; join_url?: string; emergency: boolean;
  status: 'requested' | 'scheduled' | 'active' | 'completed' | 'cancelled'; notes?: string; prescription_id?: string;
}
export interface FeedReplenishmentAlertV18 {
  id: string; farm_id: string; flock_id: string; farm_name: string; created_at: string; birds_alive: number; age_days: number; current_stock_kg: number;
  expected_daily_consumption_kg: number; days_remaining: number; reorder_threshold_days: number; recommended_order_kg: number; preferred_supplier?: string;
  status: 'monitoring' | 'reorder_now' | 'order_created' | 'dismissed'; linked_supplier_order_id?: string;
}

export interface V18ControlConfig {
  default_outbreak_radius_km: number; max_outbreak_radius_km: number; require_vet_signature_before_lab_release: boolean;
  require_full_payment_or_finance_guarantee_before_release: boolean; chick_default_lab_reserve_percent: number; chick_default_feed_reserve_percent: number;
  chick_default_emergency_reserve_percent: number; feed_reorder_days: number; ai_uses_admin_standards_only: true; ai_may_create_medical_decision: false;
  market_forecast_requires_admin_approval: boolean; tele_vet_enabled: boolean;
}


// ----------------------------------------------------
// 31. V19 - Operational & Supply Chain Sovereignty
// ----------------------------------------------------
export type V19EntityStatus = 'active' | 'paused' | 'suspended' | 'archived';
export type V19CurrencyCode = 'YER_OLD' | 'YER_NEW' | 'SAR';
export type V19ProductCriticality = 'routine' | 'time_sensitive' | 'cold_chain_critical' | 'emergency';

export interface GovernorateMarketOfficeV19 {
  id: string; governorate: string; district: string; name: string; office_type: 'platform_office' | 'marketing_market' | 'collection_point';
  address: string; phone: string; logo_url?: string; lat?: number; lng?: number; status: V19EntityStatus; manager_name: string;
}

export interface GovernorateRegistryV19 {
  id: string; name: string; code?: string; status: V19EntityStatus; created_at: string; notes?: string;
}

export interface WarehouseContractV19 {
  id: string; contract_number: string; warehouse_name: string; owner_name: string; governorate: string; district: string;
  signed_at?: string; valid_until?: string; document_reference?: string; status: 'draft' | 'signed' | 'approved' | 'expired' | 'revoked'; approved_by?: string;
}

export interface ContractedWarehouseV19 {
  id: string; name: string; owner_name: string; governorate: string; district: string; address: string; phone: string;
  cold_chain_capable: boolean; capacity_label?: string; contract_id?: string; status: 'pending_contract' | 'active' | 'suspended' | 'archived';
}

export interface FreelanceVetV19 {
  id: string; name: string; phone: string; governorate: string; districts: string[]; lat?: number; lng?: number; specialties: string[];
  status: 'available' | 'busy' | 'offline' | 'suspended'; rating: number; completed_visits: number; base_reward_yer: number; negotiated_reward_yer?: number;
  last_seen_at?: string; identity_verified: boolean; license_verified: boolean;
}

export interface PartnerBranchV19 {
  id: string; company_name: string; category: 'medicines' | 'vaccines' | 'feed' | 'equipment' | 'chicks' | 'laboratory'; branch_name: string;
  governorate: string; district: string; address: string; phone: string; lat?: number; lng?: number; cold_chain_capable: boolean; status: V19EntityStatus;
}

export interface BranchStockCheckV19 {
  id: string; branch_id: string; branch_name: string; product_id: string; product_name: string; category: string; quantity_available: number;
  unit_label: string; checked_at: string; checked_by: string; check_mode: 'daily_attestation' | 'realtime_request' | 'system_sync';
  lot_number?: string; expiry_date?: string; cold_chain_ok?: boolean; status: 'confirmed' | 'pending' | 'mismatch' | 'blocked';
}

export interface ProductAlternativeV19 {
  id: string; requested_product_id: string; requested_product_name: string; alternative_product_id: string; alternative_product_name: string;
  category: string; scientific_match_basis: string; same_governorate: boolean; branch_id: string; branch_name: string; available_quantity: number;
  clinical_equivalence_requires_vet: boolean; admin_approved: boolean;
}

export interface LogisticsRouteDecisionV19 {
  id: string; created_at: string; customer_name: string; governorate: string; district: string; requested_product_id: string; requested_product_name: string;
  quantity: number; criticality: V19ProductCriticality; selected_branch_id?: string; selected_branch_name?: string; estimated_distance_km?: number;
  stock_check_id?: string; route_status: 'checking' | 'local_available' | 'alternative_offered' | 'inter_governorate_shipping' | 'manual_review' | 'blocked';
  alternative_id?: string; decision_reason: string; customer_choice?: 'wait_shipping' | 'local_alternative' | 'cancel';
}

export interface HealthyPoultryCertificateV19 {
  id: string; certificate_number: string; farm_id: string; farm_name: string; flock_id: string; issue_date: string; valid_until: string;
  lab_verified: boolean; withdrawal_period_cleared: boolean; toxin_screen_cleared: boolean; vet_signed: boolean; signed_by?: string;
  antibiotic_free_claim_allowed: boolean; toxin_safe_claim_allowed: boolean; qr_public_code: string; public_status: 'draft' | 'verified' | 'revoked' | 'expired';
  public_summary: string;
}

export interface BiosecurityTransitPermitV19 {
  id: string; permit_number: string; vehicle_plate: string; vehicle_type: 'chicks' | 'feed' | 'live_poultry' | 'supplies'; origin: string; destination: string;
  disinfection_verified: boolean; verified_by?: string; verified_at?: string; health_document_reference?: string; issued_at: string; expires_at: string;
  status: 'pending' | 'active' | 'expired' | 'revoked' | 'blocked_by_outbreak';
}

export interface EpidemicSignalV19 {
  id: string; detected_at: string; governorate: string; district: string; disease_group: string; evidence_sources: string[]; suspected_cases: number;
  confirmed_cases: number; mortality_signal_percent: number; risk_score: number; radius_km: number; forecast_window_hours: number;
  confidence_percent: number; status: 'watch' | 'warning' | 'critical' | 'resolved'; prevention_message: string; requires_vet_review: boolean;
}

export interface FieldChatThreadV19 {
  id: string; title: string; farm_id?: string; flock_id?: string; case_id?: string; participants: string[]; participant_roles: string[];
  priority: 'normal' | 'high' | 'emergency'; status: 'active' | 'escalated' | 'closed'; last_message_at: string; ai_summary: string;
  extracted_daily_data: { mortality?: number; weight_g?: number; temperature_c?: number; humidity_percent?: number; feed_kg?: number; water_liters?: number; notes?: string };
}

export interface FieldChatMessageV19 {
  id: string; thread_id: string; sent_at: string; sender_name: string; sender_role: string; type: 'text' | 'voice' | 'image' | 'video' | 'system';
  text?: string; media_url?: string; transcript?: string; ai_extracted_fields?: string[]; clinician_review_required?: boolean;
}

export interface EmergencyConsultationV19 {
  id: string; created_at: string; case_id?: string; thread_id?: string; reason: string; mortality_24h_percent?: number; severity: 'high' | 'critical';
  assigned_consultants: string[]; assigned_field_vet_id?: string; status: 'queued' | 'acknowledged' | 'decision_pending' | 'resolved';
  human_final_decision_required: true; resolution_note?: string;
}

export interface HatcherySupplierV19 {
  id: string; name: string; governorate: string; district: string; address: string; phone: string; strains: string[]; status: V19EntityStatus;
  daily_price_owner: string; quality_score: number;
}

export interface ChickMarketingPriceV19 {
  id: string; date: string; hatchery_id: string; hatchery_name: string; strain: string; age_label: string; governorate: string;
  price_yer_old: number; price_yer_new: number; price_sar: number; available_quantity: number; freight_yer: number; expected_margin_yer: number;
  finance_verified_profitable: boolean; updated_by: string; published: boolean;
}

export interface FinancialDocumentV19 {
  id: string; document_number: string; created_at: string; type: 'receipt' | 'payment_voucher' | 'sales_invoice' | 'purchase_invoice' | 'pod_settlement';
  counterparty: string; reference: string; currency: V19CurrencyCode; gross_amount: number; platform_commission: number; net_amount: number;
  status: 'draft' | 'issued' | 'settled' | 'void'; created_by: string;
}

export interface ProofOfDeliveryV19 {
  id: string; shipment_reference: string; office_id: string; office_name: string; product_type: 'chicks' | 'live_poultry' | 'feed' | 'medicines' | 'equipment';
  expected_quantity: number; received_quantity?: number; confirmed_by?: string; confirmed_at?: string; discrepancy_note?: string;
  status: 'awaiting_arrival' | 'received' | 'discrepancy' | 'settled'; settlement_document_id?: string;
}

export interface FinancialPolicyRuleV19 {
  id: string; scope: 'chicks' | 'feed' | 'medicines' | 'consultations' | 'transport' | 'equipment' | 'live_poultry';
  profit_mode: 'percent' | 'fixed_per_unit'; profit_value: number; currency: V19CurrencyCode; active: boolean; approved_by: string; updated_at: string;
}

export interface FxRateV19 {
  id: string; pair: 'SAR_YER_OLD' | 'SAR_YER_NEW' | 'YER_OLD_YER_NEW'; rate: number; effective_at: string; source_label: string;
  status: 'draft' | 'approved'; approved_by?: string;
}

export interface SmartEscrowContractV19 {
  id: string; contract_number: string; category: 'chicks' | 'feed' | 'vet_service' | 'poultry_sale' | 'equipment'; party_a: string; party_b: string;
  gross_amount: number; currency: V19CurrencyCode; held_amount: number; release_conditions: string[]; approvals: string[];
  status: 'draft' | 'funding_pending' | 'funded' | 'release_pending' | 'released' | 'disputed' | 'cancelled';
}

export interface DigitalTwinSnapshotV19 {
  id: string; farm_name: string; flock_id: string; generated_at: string; age_days: number; birds_alive: number; temperature_c: number; humidity_percent: number;
  ventilation_index: number; feed_kg_day: number; current_weight_g: number; current_fcr: number; predicted_weight_10d_g: number; predicted_fcr_10d: number;
  projected_feed_saving_kg: number; projected_margin_delta_yer: number; recommendation: string; confidence_percent: number;
}

export interface DynamicPricingSuggestionV19 {
  id: string; generated_at: string; governorate: string; category: string; current_price: number; suggested_price: number; currency: V19CurrencyCode;
  demand_index: number; supply_index: number; transport_index: number; fx_index: number; expected_margin_percent: number; status: 'draft' | 'approved' | 'rejected';
  explanation: string;
}

export interface CorporateInvestmentSignalV19 {
  id: string; generated_at: string; governorate: string; category: string; forecast_days: number; demand_gap_percent: number; recommended_allocation_percent: number;
  rationale: string; confidence_percent: number; status: 'advisory' | 'approved_for_partner';
}

export interface VoiceAgentSessionV19 {
  id: string; created_at: string; speaker_name: string; role: string; dialect: 'yemeni_arabic' | 'msa_arabic' | 'other'; transcript: string;
  extracted_intent: string; extracted_fields: string[]; linked_thread_id?: string; status: 'processed' | 'needs_review';
}

export interface ExecutiveIssueV19 {
  id: string; created_at: string; category: 'epidemic' | 'financial_variance' | 'supply_crisis' | 'quality_complaint'; title: string; summary: string;
  severity: 'high' | 'critical'; owner: string; status: 'open' | 'acknowledged' | 'resolved'; executive_action_required: boolean;
}

export interface SovereigntyV19Config {
  enabled: boolean; daily_inventory_attestation_hour: number; executive_digest_hour: number; mortality_escalation_percent_24h: number;
  require_human_vet_for_medical_decisions: true; require_finance_profit_check_for_new_routes: boolean; healthy_label_requires_lab_clearance: boolean;
  enable_offline_field_queue: boolean; enable_public_qr_verification: boolean; default_epidemic_radius_km: number; max_epidemic_radius_km: number;
}

export interface SovereigntyV19State {
  config: SovereigntyV19Config;
  governorates: GovernorateRegistryV19[];
  market_offices: GovernorateMarketOfficeV19[];
  warehouses: ContractedWarehouseV19[];
  warehouse_contracts: WarehouseContractV19[];
  freelance_vets: FreelanceVetV19[];
  partner_branches: PartnerBranchV19[];
  stock_checks: BranchStockCheckV19[];
  alternatives: ProductAlternativeV19[];
  logistics_routes: LogisticsRouteDecisionV19[];
  healthy_certificates: HealthyPoultryCertificateV19[];
  transit_permits: BiosecurityTransitPermitV19[];
  epidemic_signals: EpidemicSignalV19[];
  chat_threads: FieldChatThreadV19[];
  chat_messages: FieldChatMessageV19[];
  emergency_consultations: EmergencyConsultationV19[];
  hatcheries: HatcherySupplierV19[];
  chick_marketing_prices: ChickMarketingPriceV19[];
  financial_documents: FinancialDocumentV19[];
  proof_of_delivery: ProofOfDeliveryV19[];
  financial_policy: FinancialPolicyRuleV19[];
  fx_rates: FxRateV19[];
  escrow_contracts: SmartEscrowContractV19[];
  digital_twins: DigitalTwinSnapshotV19[];
  dynamic_pricing: DynamicPricingSuggestionV19[];
  investment_signals: CorporateInvestmentSignalV19[];
  voice_sessions: VoiceAgentSessionV19[];
  executive_issues: ExecutiveIssueV19[];
}

export interface EnterpriseOperationsV11State {
  backend_runtime: V11BackendRuntime;
  inventory_lots: InventoryLot[];
  stock_transfers: StockTransferRecord[];
  order_lifecycle: OrderLifecycleRecord[];
  deliveries: DeliveryAssignment[];
  lab_orders: LabTestOrder[];
  antibiotic_safety: AntibioticSafetyRecord[];
  ai_conversations: AIConversationSessionV11[];
  media_ai_analyses: MediaAIAnalysisRecord[];
  outbreak_clusters: OutbreakRadarClusterV11[];
  regional_price_history: RegionalPriceHistoryRecord[];
  financial_kpis: FinancialKpiSnapshotV11;
  vendor_reports: VendorPerformanceReportV11[];
  recruitment_pipeline: RecruitmentPipelineCaseV11[];
  push_campaigns: PushCampaignV11[];
  pending_approvals: PendingAdminApprovalV11[];
  production_security: ProductionSecuritySettingsV11;
  owner_controls: SystemOwnerControlsV11;
  launch_qa: LaunchQATestCaseV11[];
  ai_advisor_v12: AIAdvisorConfigV12;
  partner_trade_contracts_v12: PartnerTradeContractV12[];
  poultry_marketer_contracts_v12: PoultryMarketerContractV12[];
  poultry_marketing_rates_v12: PoultryMarketingDailyRateV12[];
  trade_finance_contracts_v12: TradeFinanceContractV12[];
  farm_supervision_contracts_v12: FarmSupervisionContractV12[];
  supervision_daily_reports_v12: SupervisionDailyReportV12[];
  laboratory_partner_contracts_v12: LaboratoryPartnerContractV12[];
  laboratory_test_prices_v12: LaboratoryTestPriceV12[];
  deployment_readiness_v13: DeploymentReadinessItemV13[];
  ui_design_v13: UiDesignConfigV13;
  farm_management_contracts_v13: FarmManagementContractV13[];
  daily_executive_reports_v13: DailyExecutiveReportV13[];
  attendance_shifts_v13: AttendanceShiftV13[];
  payroll_records_v13: PayrollRecordV13[];
  staff_kpis_v13: StaffPerformanceKpiV13[];
  poultry_buyers_v13: PoultryBuyerV13[];
  poultry_sales_lots_v13: PoultrySalesLotV13[];
  farm_activity_stream_v13: FarmActivityEventV13[];
  expense_approvals_v13: ExpenseApprovalV13[];
  predictive_forecasts_v13: PredictiveForecastV13[];
  early_disease_signals_v13: EarlyDiseaseSignalV13[];
  supplier_quality_scores_v13: SupplierQualityScoreV13[];
  auto_reorder_rules_v13: AutoReorderRuleV13[];
  iot_sensors_v13: IoTSensorDeviceV13[];
  remote_farm_audits_v13: RemoteFarmAuditV13[];
  digital_contract_signatures_v13: DigitalContractSignatureV13[];
  profit_sharing_settlements_v13: ProfitSharingSettlementV13[];
  field_doctor_visits_v14: FieldDoctorVisitV14[];
  ai_diagnostic_assessments_v14: AIDiagnosticAssessmentV14[];
  case_escalations_v14: CaseEscalationV14[];
  case_closure_reports_v14: CaseClosureReportV14[];
  biosecurity_vaccination_schedule_v14: BiosecurityVaccinationScheduleV14[];
  cloud_production_v14: CloudProductionConfigV14;
  field_media_queue_v14: FieldMediaQueueItemV14[];
  offline_sync_v15: OfflineSyncConfigV15;
  sync_conflicts_v15: SyncConflictRecordV15[];
  vet_verification_feedback_v15: VetVerificationFeedbackV15[];
  predictive_performance_v15: PredictivePerformanceSignalV15[];
  feed_formulation_v15: FeedFormulationStateV15;
  biosecurity_checklists_v15: BiosecurityChecklistRunV15[];
  hardware_integrations_v15: HardwareIntegrationDeviceV15[];
  app_update_v15: AppUpdateConfigV15;
  data_exchange_jobs_v15: DataExchangeJobV15[];
  executive_dashboard_v15: ExecutiveDashboardV15;

  governance_roles_v16: GovernanceRoleV16[];
  accounting_journal_v16: AccountingJournalEntryV16[];
  branch_accounting_v16: BranchAccountingSnapshotV16[];
  vendor_branches_v16: VendorBranchV16[];
  regional_pricing_rules_v16: RegionalPricingRuleV16[];
  ai_smart_routes_v16: AISmartBranchRouteV16[];
  customer_360_v16: Customer360ProfileV16[];
  crm_opportunities_v16: CrmOpportunityV16[];
  targeted_campaigns_v16: TargetedCampaignV16[];
  sales_targets_v16: SalesTargetV16[];
  field_staff_positions_v16: FieldStaffPositionV16[];
  field_inspections_v16: FieldInspectionV16[];
  whatsapp_hub_v16: WhatsAppHubConfigV16;
  communication_queue_v16: CommunicationMessageV16[];
  ceo_daily_digests_v16: CEODailyDigestV16[];
  owner_war_room_v16: OwnerWarRoomV16;
  owner_change_alerts_v16: OwnerChangeAlertV16[];

  v17_config: V17ControlConfig;
  flock_sales_pipeline_v17: FlockSalePipelineV17[];
  flock_sale_settlements_v17: FlockSaleSettlementV17[];
  supplier_routing_orders_v17: SupplierRoutingOrderV17[];
  report_routing_rules_v17: StaffReportRoutingRuleV17[];
  routed_reports_v17: RoutedReportV17[];
  farm_lease_listings_v17: FarmLeaseListingV17[];
  lease_escrow_contracts_v17: LeaseEscrowContractV17[];
  approved_supplement_protocols_v17: ApprovedSupplementProtocolV17[];

  v18_config: V18ControlConfig;
  assigned_vet_farms_v18: AssignedVetFarmV18[];
  sample_tracking_v18: SampleTrackingCaseV18[];
  hatchery_prices_v18: HatcheryRegionalPriceV18[];
  chick_reservations_v18: ChickReservationV18[];
  breed_regional_standards_v18: BreedRegionalStandardV18[];
  farm_performance_v18: FarmPerformanceEntryV18[];
  cost_calculator_configs_v18: CostCalculatorConfigV18[];
  general_manager_vault_v18: GeneralManagerStaffVaultV18[];
  manager_directives_v18: ManagerDirectiveV18[];
  farm_labor_v18: FarmLaborEmploymentV18[];
  geo_outbreak_alerts_v18: GeoOutbreakAlertV18[];
  market_forecasts_v18: MarketForecastV18[];
  credit_quality_scores_v18: CreditQualityScoreV18[];
  integrator_contracts_v18: IntegratorContractV18[];
  televet_sessions_v18: TeleVetSessionV18[];
  feed_replenishment_v18: FeedReplenishmentAlertV18[];
  sovereignty_v19: SovereigntyV19State;
  platform_core_v19_5: import('./modules/platform/PlatformCoreV19_5').PlatformCoreStateV195;
  enterprise_core_v19_6: import('./modules/enterprise/EnterpriseCoreV19_6').EnterpriseCoreStateV196;
  managed_operations_v19_7: import('./modules/managed/ManagedPoultryOperationsV19_7').ManagedOperationsStateV197;
  v20_core: import('./modules/v20/EnterprisePoultryCoreV20').V20State;
  enterprise_web_v20_2: import('./modules/v20/EnterpriseWebPlatformV20_2').EnterpriseWebStateV202;
  enterprise_foundation_v20_2_1: import('./modules/v20/EnterpriseFoundationV20_2_1').EnterpriseFoundationStateV2021;
  veterinary_field_v20_2_2: import('./modules/v20/VeterinaryFieldOperationsV20_2_2').VeterinaryFieldStateV2022;
  multi_business_v20_2_3: import('./modules/v20/MultiBusinessEnterpriseV20_2_3').MultiBusinessEnterpriseStateV2023;
  feed_factory_v20_2_4: import('./modules/v20/FeedFactoryOperationsV20_2_4').FeedFactoryOperationsStateV2024;
  workforce_payroll_v20_2_5: import('./modules/v20/WorkforcePayrollManagedBusinessV20_2_5').WorkforcePayrollStateV2025;
  executive_intelligence_v20_2_6: import('./modules/v20/ExecutiveIntelligenceBusinessControlV20_2_6').ExecutiveIntelligenceStateV2026;
  windows_completion_v20_2_7: import('./modules/v20/WindowsCompletionControlClosureV20_2_7').WindowsCompletionStateV2027;
  farm_division_v20_2_9: import('./modules/v20/FarmDivisionCompletionV20_2_9').FarmDivisionStateV2029;
  operational_readiness_r8_1?: import('./modules/v20/OperationalReadinessR8_1').OperationalReadinessStateR81;
}
