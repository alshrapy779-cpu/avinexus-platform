import { EnterpriseOperationsV11State } from '../types';
import { INITIAL_PLATFORM_CORE_V195 } from '../modules/platform/PlatformCoreV19_5';
import { buildEnterpriseCoreV196 } from '../modules/enterprise/EnterpriseCoreV19_6';
import { buildManagedPoultryOperationsV197 } from '../modules/managed/ManagedPoultryOperationsV19_7';
import { buildV20State } from '../modules/v20/EnterprisePoultryCoreV20';
import { buildEnterpriseWebStateV202 } from '../modules/v20/EnterpriseWebPlatformV20_2';
import { buildEnterpriseFoundationV2021 } from '../modules/v20/EnterpriseFoundationV20_2_1';
import { buildVeterinaryFieldStateV2022 } from '../modules/v20/VeterinaryFieldOperationsV20_2_2';
import { buildMultiBusinessEnterpriseStateV2023 } from '../modules/v20/MultiBusinessEnterpriseV20_2_3';
import { buildFeedFactoryOperationsStateV2024 } from '../modules/v20/FeedFactoryOperationsV20_2_4';
import { buildWorkforcePayrollStateV2025 } from '../modules/v20/WorkforcePayrollManagedBusinessV20_2_5';
import { buildExecutiveIntelligenceStateV2026 } from '../modules/v20/ExecutiveIntelligenceBusinessControlV20_2_6';
import { buildWindowsCompletionStateV2027 } from '../modules/v20/WindowsCompletionControlClosureV20_2_7';
import { buildFarmDivisionStateV2029 } from '../modules/v20/FarmDivisionCompletionV20_2_9';

export const INITIAL_ENTERPRISE_V11: EnterpriseOperationsV11State = {
  backend_runtime: {
    mode: 'local_json',
    api_base_url: '/api',
    database_status: 'local_persistent',
    storage_status: 'local',
    offline_queue_enabled: true,
    pending_offline_actions: 0,
    note: 'V11 يضيف تخزين JSON خادمي للتجربة مع واجهات جاهزة للترقية إلى PostgreSQL/Firebase. الإنتاج يحتاج قاعدة بيانات مُدارة وتخزين ملفات دائم.'
  },
  inventory_lots: [
    { id: 'lot-001', branch_id: 'br-01', branch_name: 'فرع صنعاء المركزي', category: 'medicine', product_id: 'med-01', product_name: 'دواء بيطري - دفعة تجريبية', lot_number: 'MED-2609-A', expiry_date: '2027-08-31', quantity_on_hand: 120, quantity_reserved: 18, reorder_level: 30, unit_label: 'عبوة', cost_per_unit_yer: 8400, sell_price_per_unit_yer: 10500, status: 'available' },
    { id: 'lot-002', branch_id: 'br-01', branch_name: 'فرع صنعاء المركزي', category: 'vaccine', product_id: 'vac-01', product_name: 'لقاح نيوكاسل', lot_number: 'VAC-2609-B', expiry_date: '2026-11-15', quantity_on_hand: 22, quantity_reserved: 5, reorder_level: 20, unit_label: 'أمبول', cost_per_unit_yer: 12500, sell_price_per_unit_yer: 16000, status: 'low_stock' },
    { id: 'lot-003', branch_id: 'br-02', branch_name: 'فرع عدن', category: 'feed', product_id: 'feed-01', product_name: 'علف بادي 50 كجم', lot_number: 'FEED-2609-C', quantity_on_hand: 340, quantity_reserved: 40, reorder_level: 80, unit_label: 'كيس', cost_per_unit_yer: 22500, sell_price_per_unit_yer: 26000, status: 'available' }
  ],
  stock_transfers: [
    { id: 'tr-001', created_at: '2026-09-15T19:00:00+03:00', from_branch_id: 'br-01', from_branch_name: 'فرع صنعاء المركزي', to_branch_id: 'br-02', to_branch_name: 'فرع عدن', product_name: 'لقاح نيوكاسل', quantity: 6, unit_label: 'أمبول', status: 'requested' }
  ],
  order_lifecycle: [
    { id: 'ord-001', purchase_request_id: 'purchase-demo-001', customer_name: 'عميل تجريبي', product_summary: 'علف بادي × 10', branch_name: 'فرع صنعاء المركزي', total_amount_yer: 272000, payment_status: 'paid', fulfillment_status: 'preparing', reserved_inventory: true, invoice_number: 'INV-2026-0001', qr_reference: 'ORDER:INV-2026-0001', created_at: '2026-09-15T18:20:00+03:00', updated_at: '2026-09-15T19:05:00+03:00', delivery_fee_yer: 12000, paid_amount_yer: 272000 }
  ],
  deliveries: [
    { id: 'del-001', order_id: 'ord-001', driver_name: 'مندوب الفرع', driver_phone: '777000099', branch_name: 'فرع صنعاء المركزي', destination_address: 'بني حشيش - عنوان العميل', eta_minutes: 90, status: 'assigned' }
  ],
  lab_orders: [
    { id: 'labord-001', case_id: 'clinical-demo-001', case_number: 'CASE-2026-001', laboratory_id: 'lab-01', laboratory_name: 'مختبر بيطري معتمد - صنعاء', requested_by: 'الطبيب المناوب', sample_type: 'مسحات تنفسية + أمعاء', sample_count: 4, chain_of_custody: ['طلب الفحص', 'بانتظار جمع العينة'], requested_tests: ['زراعة بكتيرية وحساسية'], estimated_cost_yer: 45000, status: 'sample_scheduled' }
  ],
  antibiotic_safety: [
    { id: 'absafe-001', prescription_id: 'rx-demo-001', case_id: 'clinical-demo-001', flock_id: 'flock-01', medication_name: 'مضاد حيوي مقيد - مثال', active_ingredient: 'مادة فعالة تجريبية', vet_name: 'الطبيب البيطري المعتمد', reason: 'بعد مراجعة الحالة والفحص', sensitivity_report_id: 'lab-res-demo', start_date: '2026-09-15', end_date: '2026-09-18', meat_withdrawal_days: 7, egg_withdrawal_days: 10, safe_marketing_date: '2026-09-25', marketing_locked: true, antibiotic_free_badge_eligible: false, qr_trace_code: 'ABX-TRACE-2026-001' }
  ],
  ai_conversations: [
    { id: 'ai-session-001', customer_name: 'عميل تجريبي', phone: '777123456', intent: 'clinical_triage', current_step: 'صور التشريح', collected_fields: ['الاسم','الهاتف','العنوان','العمر','عدد القطيع','النافق','العلف','الماء','الحرارة','الرطوبة'], missing_fields: ['صورة العضو المطلوب','صوت التنفس'], last_message: 'أرسل صورة واضحة للعضو المحدد مع تسجيل 30 ثانية لصوت التنفس.', related_case_id: 'clinical-demo-001', status: 'waiting_customer', updated_at: '2026-09-15T19:10:00+03:00' }
  ],
  media_ai_analyses: [
    { id: 'media-001', case_id: 'clinical-demo-001', media_type: 'necropsy_image', target_label: 'الأعوران', quality_score: 82, correct_target_detected: true, ai_findings: ['الصورة واضحة بدرجة جيدة', 'يحتاج الطبيب لتأكيد الملاحظة المرضية'], confidence: 76, clinician_confirmation_required: true, status: 'analyzed' },
    { id: 'media-002', case_id: 'clinical-demo-001', media_type: 'respiratory_audio', target_label: 'صوت تنفس 30 ثانية', quality_score: 64, correct_target_detected: true, ai_findings: ['ضوضاء خلفية متوسطة', 'مؤشر تنفسي يحتاج مراجعة الطبيب'], confidence: 61, clinician_confirmation_required: true, status: 'analyzed' }
  ],
  outbreak_clusters: [
    { id: 'cluster-001', disease_group: 'طفيلي/كوكسيديا', disease_name: 'اشتباه كوكسيديا', governorate: 'ذمار', district: 'قاع جهران', suspected_cases: 4, lab_confirmed_cases: 1, first_seen_at: '2026-09-12', last_seen_at: '2026-09-15', risk_level: 'high', nearby_farms_count: 17, prevention_message: 'رفع الأمان الحيوي، تجفيف الفرشة، ومراقبة الإسهالات والنفوق.', heat_score: 78, broadcast_status: 'queued' }
  ],
  regional_price_history: [
    { id: 'priceh-001', date: '2026-09-15', governorate: 'صنعاء', category: 'live_poultry', item_name: 'دجاج حي - وزن مثالي', price_yer_old: 1850, price_sar: 13.2, weight_category: '1.3 - 1.8 كجم', approved_by: 'المدير العام', published: true },
    { id: 'priceh-002', date: '2026-09-15', governorate: 'عدن', category: 'live_poultry', item_name: 'دجاج حي - وزن مثالي', price_yer_new: 5200, price_sar: 12.2, weight_category: '1.3 - 1.8 كجم', approved_by: 'المدير العام', published: true }
  ],
  financial_kpis: {
    date: '2026-09-15', gross_revenue_yer: 4850000, cost_of_goods_yer: 3380000, delivery_cost_yer: 210000, field_service_cost_yer: 165000, gross_profit_yer: 1470000, net_profit_yer: 1095000, receivables_yer: 720000, customer_debt_yer: 872000, wallet_balance_yer: 1600000,
    branch_profitability: [
      { branch_name: 'فرع صنعاء المركزي', revenue_yer: 3100000, cost_yer: 2210000, profit_yer: 890000 },
      { branch_name: 'فرع عدن', revenue_yer: 1750000, cost_yer: 1545000, profit_yer: 205000 }
    ]
  },
  vendor_reports: [
    { company_id: 'company-01', company_name: 'شركة أدوية بيطرية - مثال', category: 'أدوية', products_count: 8, units_sold: 142, sales_yer: 1640000, commission_yer: 131200, returns_count: 2, stock_value_yer: 2200000, top_governorate: 'صنعاء', settlement_due_yer: 1508800 },
    { company_id: 'company-02', company_name: 'شركة أعلاف - مثال', category: 'أعلاف', products_count: 5, units_sold: 380, sales_yer: 9880000, commission_yer: 296400, returns_count: 0, stock_value_yer: 7600000, top_governorate: 'ذمار', settlement_due_yer: 9583600 }
  ],
  recruitment_pipeline: [
    { id: 'hr-001', applicant_name: 'متقدم تجريبي', role: 'مشرف ميداني', governorate: 'إب', phone: '777222333', experience_years: 4, requested_salary_yer: 220000, identity_verified: true, status: 'interview', rating: 4 }
  ],
  push_campaigns: [
    { id: 'push-001', created_at: '2026-09-15T18:45:00+03:00', title: 'تحديث الأسعار', body: 'تم تحديث أسعار السوق حسب منطقتك.', audience: 'customers', trigger: 'price_change', sent_count: 0, failed_count: 0, status: 'draft' },
    { id: 'push-002', created_at: '2026-09-15T18:50:00+03:00', title: 'تنبيه وقائي', body: 'رصد نشاط مرضي في منطقتك. ارفع الأمان الحيوي.', audience: 'governorate', target: 'ذمار', trigger: 'outbreak', sent_count: 0, failed_count: 0, status: 'queued' }
  ],
  pending_approvals: [
    { id: 'appr-001', created_at: '2026-09-15T19:00:00+03:00', requested_by: 'مدير منطقة صنعاء', category: 'zone_fee', title: 'تعديل أجرة توصيل بني حشيش', risk: 'normal', status: 'pending' },
    { id: 'appr-002', created_at: '2026-09-15T19:02:00+03:00', requested_by: 'المالية', category: 'payment', title: 'اعتماد حوالة كبيرة', amount_yer: 1450000, risk: 'high', status: 'pending' }
  ],
  production_security: {
    otp_enabled: true, admin_mfa_required: true, api_keys_server_only: true, storage_rules_enforced: false, rate_limiting_enabled: false, app_check_enabled: false, jwt_rotation_enabled: false, device_registration_enabled: true, remote_session_revoke_enabled: true, pii_encryption_enabled: false, immutable_audit_log_enabled: false, automated_backup_enabled: false
  },
  owner_controls: {
    maintenance_mode: false, disable_marketplace: false, disable_ai_assistant: false, disable_payments: false, allow_new_registrations: true, require_owner_approval_for_admins: true,
    owner_only_modules: ['إدارة المدراء والصلاحيات العليا','التكاملات والمفاتيح','أسعار الصرف','إعدادات الأرباح','النسخ الاحتياطي','سجل التدقيق الكامل','إيقاف أقسام النظام']
  },
  launch_qa: [
    { id: 'qa-01', scenario: 'عميل من منطقة غير مسجلة', expected_result: 'إنشاء طلب تسعير جديد وإيقاف الشراء حتى اعتماد الأجرة وموافقة العميل.', status: 'passed', last_run_at: '2026-09-15' },
    { id: 'qa-02', scenario: 'طلب شراء مضاد حيوي', expected_result: 'جمع ملف الحالة ومنع الاستخدام/الإتمام الطبي قبل موافقة الطبيب والفحص عند الحاجة.', status: 'passed', last_run_at: '2026-09-15' },
    { id: 'qa-03', scenario: 'رفض العميل أجرة النقل', expected_result: 'لا يكتمل الطلب ولا يتم طلب الدفع.', status: 'passed', last_run_at: '2026-09-15' },
    { id: 'qa-04', scenario: 'رفع حوالة خاطئة', expected_result: 'تبقى قيد مراجعة المالية ويمكن رفضها مع ملاحظة.', status: 'passed', last_run_at: '2026-09-15' },
    { id: 'qa-05', scenario: 'نافق مرتفع والطبيب غير متصل', expected_result: 'تصعيد الحالة إلى أقرب مداوم ثم الإدارة مع رسالة طمأنة للعميل.', status: 'not_run' },
    { id: 'qa-06', scenario: 'عدم وجود مختبر قريب', expected_result: 'تمييز المنطقة كبعيدة وتحويل القرار للطبيب مع خطة جمع عينات/متابعة آمنة.', status: 'not_run' },
    { id: 'qa-07', scenario: 'انقطاع الإنترنت أثناء رفع صور التشريح', expected_result: 'حفظ الإجراء في Offline Queue والمزامنة بعد عودة الشبكة.', status: 'not_run' },
    { id: 'qa-08', scenario: 'نفاد المخزون بعد الدفع', expected_result: 'منع التجهيز، تنبيه الإدارة، اقتراح فرع بديل أو استرداد/تحويل.', status: 'not_run' },
    { id: 'qa-09', scenario: 'محاولة العميل تعديل السعر', expected_result: 'رفض العملية من صلاحيات الخادم وليس فقط إخفاء الزر.', status: 'not_run' },
    { id: 'qa-10', scenario: 'موظف غير مخول يحاول الدخول للمالية', expected_result: 'حظر خادمي وتسجيل الحدث في Audit Log.', status: 'not_run' }
  ],
  ai_advisor_v12: {
    enabled: true,
    poultry_specialist_mode: true,
    sales_consultant_mode: true,
    customer_education_mode: true,
    anti_random_antibiotics_policy: true,
    require_vet_for_antibiotic_use: true,
    tone: 'مهني مقنع',
    primary_objectives: [
      'الإجابة المتخصصة في تربية الدواجن والتغذية والتحضين والتهوية والأمان الحيوي.',
      'تطوير البيع عبر فهم احتياج العميل وشرح قيمة الخدمة أو الصنف بدون تضليل أو ضغط.',
      'تحويل الاستفسار المرضي إلى ملف منظم للطبيب عند الحاجة.',
      'تشجيع القرار المبني على البيانات والفحص والابتعاد عن الاستخدام العشوائي للمضادات.'
    ],
    sales_playbook: [
      'ابدأ بفهم هدف العميل وعدد القطيع والعمر والمنطقة والميزانية قبل عرض الصنف.',
      'اشرح الفائدة التشغيلية والسعر وأجرة المنطقة ووقت التوصيل بوضوح.',
      'اعرض البدائل حسب المرحلة والسعة والمخزون ولا تدّع ضمان نتيجة إنتاجية.',
      'عند الاعتراض على السعر اشرح القيمة ثم اعرض تحويل الطلب للإدارة لمراجعة السعر أو الباقة.',
      'اربط العلف واللقاح والمعدات بخطة القطيع وليس بمجرد البيع.'
    ],
    safety_guardrails: [
      'لا يصف مضاداً حيوياً ولا يحدد جرعته النهائية دون اعتماد الطبيب.',
      'لا يعتبر شراء المضاد إذناً باستخدامه.',
      'يوضح مخاطر الاستخدام العشوائي: المقاومة، إخفاء السبب الحقيقي، بقايا الدواء، وفشل السيطرة على العدوى.',
      'يفصل بين الاشتباه والتشخيص المؤكد ويطلب المختبر عند الحاجة.',
      'لا يضمن الربح أو عدم النفوق ويعرض الشروط التجارية كما اعتمدتها الإدارة فقط.'
    ],
    poultry_knowledge_domains: ['تحضين الكتاكيت','إدارة العلف والماء','التهوية والتبريد','الأمان الحيوي','التحصينات','الأمراض الفيروسية','الأمراض البكتيرية','الميكوبلازما','الكوكسيديا والطفيليات','السموم الفطرية','التشريح الموجه','المختبر والحساسية','التسويق والوزن','FCR والخسائر الاقتصادية'],
    last_updated: '2026-09-15T20:45:00+03:00',
    updated_by: 'المدير العام'
  },
  partner_trade_contracts_v12: [
    { id:'ptc-001', partner_company_id:'comp-001', partner_name:'شركة ابن حيان للتقنية والأدوية البيطرية', business_type:'شركة أدوية', contract_number:'YEM-MED-2026-08', start_date:'2026-01-01', end_date:'2027-01-01', status:'active', governorates:['صنعاء','ذمار','إب'], customer_discount_percent:5, platform_commission_percent:8, settlement_days:14, show_prices_to_customers:true, show_discount_badge:true, customer_visible:true, require_admin_product_approval:true, logo_url:'', showcase_image_url:'', price_list_note:'الخصم يظهر على الأصناف المرتبطة بالعقد بعد اعتماد الإدارة.', notes:'المضادات الحيوية تبقى مقيدة بموافقة الطبيب.' },
    { id:'ptc-002', partner_company_id:'comp-003', partner_name:'مطاحن وصوامع الغلال الوطنية', business_type:'مصنع/مطبخ أعلاف', contract_number:'YEM-FEED-2025-03', start_date:'2025-06-01', end_date:'2026-12-31', status:'active', governorates:['صنعاء','الحديدة','ذمار'], customer_discount_percent:3, platform_commission_percent:4.5, settlement_days:7, show_prices_to_customers:true, show_discount_badge:true, customer_visible:true, require_admin_product_approval:true, logo_url:'', showcase_image_url:'', price_list_note:'أسعار العقود قابلة للتحديث من الإدارة حسب قائمة المصنع.', notes:'العروض حسب التوفر والمرحلة.' },
    { id:'ptc-003', partner_company_id:'comp-004', partner_name:'مؤسسة تهامة لتجهيز مزارع الدواجن', business_type:'مورد معدات', contract_number:'YEM-EQP-2026-21', start_date:'2026-03-01', end_date:'2027-03-01', status:'active', governorates:['صنعاء','ذمار'], customer_discount_percent:4, platform_commission_percent:6, settlement_days:10, show_prices_to_customers:true, show_discount_badge:true, customer_visible:true, require_admin_product_approval:true, logo_url:'', showcase_image_url:'', price_list_note:'الصور والموديلات لا تنشر إلا بعد اعتماد الإدارة.', notes:'الضمان حسب الموديل.' },
    { id:'ptc-004', partner_company_id:'comp-005', partner_name:'وكالة سيفا أنيمال هيلث', business_type:'وكيل لقاحات', contract_number:'YEM-VAC-2026-02', start_date:'2026-01-10', end_date:'2027-01-10', status:'active', governorates:['صنعاء','ذمار','إب'], customer_discount_percent:2.5, platform_commission_percent:5, settlement_days:10, show_prices_to_customers:true, show_discount_badge:true, customer_visible:true, require_admin_product_approval:true, logo_url:'', showcase_image_url:'', price_list_note:'اللقاحات تظهر فقط مع بيانات سلسلة التبريد والعمر وطريقة التطبيق.', notes:'الاستخدام ضمن البروتوكول المعتمد.' },
    { id:'ptc-005', partner_company_id:'comp-002', partner_name:'مختبرات الشرق الأوسط الدوائية البيطرية', business_type:'شركة أدوية', contract_number:'YEM-MED-2026-14', start_date:'2026-02-15', end_date:'2027-02-15', status:'active', governorates:['تعز','عدن','صنعاء'], customer_discount_percent:4, platform_commission_percent:7.5, settlement_days:14, show_prices_to_customers:true, show_discount_badge:true, customer_visible:true, require_admin_product_approval:true, logo_url:'', showcase_image_url:'', price_list_note:'كل مضاد حيوي يبقى مقيداً بملف الحالة واعتماد الطبيب.', notes:'عرض السعر لا يعني السماح بالاستخدام العلاجي.' }
  ],
  poultry_marketer_contracts_v12: [
    { id:'pmc-001', marketer_name:'مسوق دواجن معتمد - صنعاء', company_name:'مكتب تسويق الدواجن المركزي', phone:'777000401', governorates:['صنعاء','ذمار'], contract_number:'MKT-2026-001', start_date:'2026-09-01', end_date:'2027-08-31', status:'active', fee_mode:'fixed_per_kg', fee_value:35, settlement_days:2, daily_price_update_required:true, mortality_liability:'limited_window', mortality_liability_hours:4, mortality_liability_cap_percent:0.5, pickup_deadline_hours:6, payment_terms:'السداد خلال يومي عمل من وزن واستلام الدفعة وفق كشف الوزن المعتمد.', notes:'حدود مسؤولية النافق تطبق فقط وفق العقد الموقّع وبعد نقطة الاستلام المحددة.' },
    { id:'pmc-002', marketer_name:'مسوق دواجن معتمد - عدن', company_name:'سوق عدن للدواجن', phone:'777000402', governorates:['عدن','لحج'], contract_number:'MKT-2026-002', start_date:'2026-09-01', end_date:'2027-08-31', status:'active', fee_mode:'percent_of_sale', fee_value:1.5, settlement_days:1, daily_price_update_required:true, mortality_liability:'none', mortality_liability_hours:0, pickup_deadline_hours:5, payment_terms:'السداد في يوم التسويق بعد اعتماد الوزن والكمية.', notes:'لا يتحمل المسوق النافق قبل الاستلام وفق هذا النموذج.' }
  ],
  poultry_marketing_rates_v12: [
    { id:'pmr-001', date:'2026-09-15', governorate:'صنعاء', district:'بني حشيش', weight_category:'1.3 - 1.8 كجم', marketer_contract_id:'pmc-001', marketer_name:'مسوق دواجن معتمد - صنعاء', buy_price_per_kg_yer:1850, target_sell_price_per_kg_yer:1930, fee_yer_per_kg:35, settlement_days:2, mortality_terms:'تحمل محدود لمدة 4 ساعات بعد نقطة الاستلام وبحد العقد.', approved_by:'المدير العام', published:true },
    { id:'pmr-002', date:'2026-09-15', governorate:'عدن', district:'المنصورة', weight_category:'1.3 - 1.8 كجم', marketer_contract_id:'pmc-002', marketer_name:'مسوق دواجن معتمد - عدن', buy_price_per_kg_yer:5200, target_sell_price_per_kg_yer:5350, settlement_days:1, mortality_terms:'لا يتحمل المسوق النافق قبل الاستلام.', approved_by:'المدير العام', published:true }
  ],
  trade_finance_contracts_v12: [
    { id:'tfc-001', customer_name:'عميل تمويل تجريبي', phone:'777555111', farm_name:'مزرعة نموذجية', governorate:'ذمار', contract_number:'FIN-2026-001', total_value_yer:2500000, upfront_percent:60, upfront_amount_yer:1500000, deferred_percent:40, deferred_amount_yer:1000000, expected_marketing_date:'2026-10-20', due_rule:'first_sale_proceeds', collateral_type:'ضامن تجاري', collateral_description:'ضامن تجاري معتمد وفق مستندات تراجعها الإدارة.', guarantor_name:'ضامن تجريبي', guarantor_phone:'777555222', medical_supervision_required:true, external_purchase_requires_notice:true, first_sale_proceeds_to_platform:true, status:'active', legal_review_status:'review_required', notes:'نموذج تشغيلي؛ صياغة العقد والضمانات تحتاج مراجعة قانونية محلية قبل الاستخدام الفعلي.' }
  ],
  farm_supervision_contracts_v12: [
    { id:'fsc-001', contract_number:'SUP-2026-001', customer_name:'عميل إشراف تجريبي', phone:'777600111', farm_name:'مزرعة الروضة', governorate:'صنعاء', district:'بني حشيش', hangars_count:3, flock_size:30000, package_name:'إشراف كامل حتى التسويق', contract_fee_yer:480000, start_date:'2026-09-15', end_date:'2026-10-30', responsible_vet_id:'staff-vet-01', responsible_vet_name:'الطبيب المناوب - صنعاء', responsible_supervisor_name:'المشرف الميداني - صنعاء', daily_report_time:'19:30', scope:['العلف والماء','الحرارة والرطوبة','التهوية والفرشة','التحصينات','مراجعة العلاجات','النزول الميداني','المتابعة حتى التسويق'], status:'active', next_daily_report_due_at:'2026-09-15T19:30:00+03:00', notes:'كل تقرير يومي يظهر للطبيب المسؤول مع التنبيهات.' }
  ],
  supervision_daily_reports_v12: [
    { id:'sdr-001', contract_id:'fsc-001', date:'2026-09-15', submitted_at:'2026-09-15T19:20:00+03:00', submitted_by:'المشرف الميداني - صنعاء', feed_kg:2850, water_liters:5650, mortality_count:7, average_weight_grams:980, temperature_celsius:27.2, humidity_percent:61, ventilation_note:'التهوية مستقرة مع ضرورة رفع الحد الأدنى ليلاً قليلاً.', litter_note:'الفرشة جيدة مع رطوبة محدودة قرب خطوط المياه.', vaccine_or_treatment_note:'لا يوجد مضاد جديد؛ متابعة برنامج التحصين المعتمد.', ai_summary:'المؤشرات مستقرة إجمالاً. راقب نسبة الماء/العلف والفرشة قرب خطوط السقاية وأعد الوزن غداً.', alert_level:'normal', sent_to_vet:true, sent_to_vet_at:'2026-09-15T19:21:00+03:00' }
  ],
  laboratory_partner_contracts_v12: [
    { id:'lpc-001', laboratory_id:'lab-01', laboratory_name:'مختبر بيطري معتمد - صنعاء', contract_number:'LAB-2026-001', logo_url:'', governorate:'صنعاء', district:'أمانة العاصمة', address:'العنوان يحدد من الإدارة', phone:'777300100', start_date:'2026-09-01', end_date:'2027-08-31', status:'active', default_discount_percent:10, sample_collection_discount_percent:5, settlement_days:7, customer_visible:true, turnaround_commitment_hours:24, notes:'النتيجة والتسعير النهائي حسب نوع العينة والفحص.' }
  ],
  laboratory_test_prices_v12: [
    { id:'ltp-001', lab_contract_id:'lpc-001', test_name:'زراعة بكتيرية + اختبار حساسية', category:'بكتيري', sample_type:'مسحة/عضو طازج', base_price_yer:50000, discount_percent:10, customer_price_yer:45000, turnaround_hours:48, active:true, notes:'يفضل أخذ العينة قبل بدء المضاد متى كان ذلك ممكناً.' },
    { id:'ltp-002', lab_contract_id:'lpc-001', test_name:'PCR نيوكاسل / IB', category:'فيروسي', sample_type:'مسحات تنفسية/أنسجة', base_price_yer:65000, discount_percent:10, customer_price_yer:58500, turnaround_hours:24, active:true },
    { id:'ltp-003', lab_contract_id:'lpc-001', test_name:'فحص كوكسيديا مجهري', category:'طفيلي', sample_type:'براز/أمعاء', base_price_yer:22000, discount_percent:10, customer_price_yer:19800, turnaround_hours:8, active:true }
  ],
  deployment_readiness_v13: [
    { id:'ready-db', area:'قاعدة البيانات', status:'local_prototype', current_mode:'enterprise-v11.json على خادم محلي', production_requirement:'PostgreSQL/Firebase مُدار مع migrations ونسخ احتياطي سحابي.', admin_note:'الواجهات جاهزة؛ لا يعتبر التخزين المحلي متعدد المستخدمين.' },
    { id:'ready-auth', area:'المصادقة والصلاحيات', status:'local_prototype', current_mode:'صلاحيات واجهة + إعدادات RBAC', production_requirement:'Auth Server + JWT/Session + MFA + RBAC خادمي وإلغاء الجلسات.' },
    { id:'ready-media', area:'تخزين الوسائط', status:'local_prototype', current_mode:'روابط/بيانات محلية للتجربة', production_requirement:'Object Storage خاص بالصور والصوت والفيديو مع signed URLs وسياسات وصول.' },
    { id:'ready-push', area:'الإشعارات', status:'blocked_external', current_mode:'حملات وقوالب داخلية فقط', production_requirement:'Firebase FCM project + server credentials + device tokens.' },
    { id:'ready-pay', area:'المدفوعات', status:'blocked_external', current_mode:'إثبات حوالة ومراجعة مالية يدوية', production_requirement:'API رسمي من الكريمي/جيب أو مزود دفع مع Webhooks وتسوية.' },
    { id:'ready-msg', area:'واتساب/البريد', status:'blocked_external', current_mode:'قنوات التقرير موجودة منطقياً', production_requirement:'WhatsApp Business API ومزود Email/SMTP فعلي.' },
    { id:'ready-iot', area:'IoT', status:'local_prototype', current_mode:'نماذج أجهزة وقراءات تجريبية', production_requirement:'Gateway/MQTT أو APIs الحساسات ومفاتيح الأجهزة ومعايرة ميدانية.' },
    { id:'ready-media-ai', area:'تحليل الصور والصوت', status:'blocked_external', current_mode:'Quality Gate + مكان نتائج مساعدة', production_requirement:'نماذج بيطرية/صوتية مدربة ومختبرة سريرياً وربط Backend للاستدلال.' }
  ],
  ui_design_v13: {
    primary_hex:'#0A5C36', accent_hex:'#D4AF37', light_background_hex:'#F8F9FA', dark_background_hex:'#0F172A', success_hex:'#10B981', danger_hex:'#EF4444', info_hex:'#3B82F6',
    glassmorphism_enabled:true, soft_material_enabled:true, auto_dark_mode:true, mobile_bottom_navigation:true, micro_interactions_enabled:true
  },
  farm_management_contracts_v13: [
    { id:'fmc-001', contract_number:'MGT-2026-001', customer_name:'أحمد صالح العنسي', phone:'777123456', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', governorate:'صنعاء', district:'بني حشيش', management_mode:'full_management', status:'active', start_date:'2026-09-01', end_date:'2027-08-31', hangars_count:4, flock_size:42000, service_fee_yer:650000, responsible_vet_name:'الطبيب المناوب - صنعاء', responsible_supervisor_name:'المشرف الميداني - صنعاء', hr_manager_name:'مسؤول الموارد البشرية', marketing_manager_name:'مدير التسويق والمبيعات', daily_report_time:'20:00', report_channels:['app','email','whatsapp'], owner_approval_threshold_yer:250000, client_portal_permissions:{view_daily_reports:true,view_financials:true,view_activity_stream:true,approve_large_expenses:true,operational_editing:false}, liability_terms:'المسؤوليات وحدودها تطبق وفق العقد الموقع، مع استثناء الأحداث الخارجة عن السيطرة وعدم التزام العميل بالتعليمات المعتمدة.', performance_bonus_mode:'fcr_improvement', performance_bonus_value:5, notes:'العميل يملك بوابة رقابة واعتماد ولا يغيّر القرارات التشغيلية اليومية في عقد الإدارة الشاملة.' }
  ],
  daily_executive_reports_v13: [
    { id:'der-001', contract_id:'fmc-001', date:'2026-09-15', generated_at:'2026-09-15T20:00:00+03:00', average_weight_grams:1120, feed_kg:3820, water_liters:7350, daily_mortality_count:8, cumulative_mortality_percent:1.8, fcr:1.54, health_summary:'الحالة العامة مستقرة مع متابعة رطوبة الفرشة قرب خطوط المياه.', vet_recommendation:'استمرار المراقبة والالتزام ببرنامج التحصين؛ لا يوجد مبرر لمضاد عشوائي.', daily_expenses_yer:185000, daily_sales_yer:0, alert_level:'normal', pdf_status:'generated', delivery_channels:['app','email','whatsapp'], delivery_status:'queued' }
  ],
  attendance_shifts_v13: [
    { id:'att-001', staff_name:'المشرف الميداني - صنعاء', role:'مشرف ميداني', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', date:'2026-09-15', check_in_at:'2026-09-15T06:45:00+03:00', check_out_at:'2026-09-15T16:20:00+03:00', gps_lat:15.3694, gps_lng:44.1910, within_farm_geofence:true, shift_hours:9.58, note:'تم التحقق من الموقع ضمن نطاق المزرعة التجريبي.' }
  ],
  payroll_records_v13: [
    { id:'payroll-001', staff_name:'المشرف الميداني - صنعاء', role:'مشرف ميداني', period:'2026-09', base_salary_yer:220000, allowances_yer:30000, bonuses_yer:15000, advances_yer:20000, deductions_yer:0, net_salary_yer:245000, linked_farm_name:'مزرعة وادي سبأ النموذجية للدواجن', status:'draft' }
  ],
  staff_kpis_v13: [
    { id:'kpi-001', staff_name:'المشرف الميداني - صنعاء', role:'مشرف ميداني', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', period:'دورة سبتمبر 2026', fcr_score:91, mortality_control_score:92, report_timeliness_score:96, biosecurity_score:89, overall_score:92, admin_note:'تقييم تشغيلي تجريبي يربط النتائج بأداء القطاع ولا ينسب كل نتيجة لشخص واحد.' }
  ],
  poultry_buyers_v13: [
    { id:'buyer-001', buyer_name:'تاجر دواجن معتمد - صنعاء', phone:'777800101', governorate:'صنعاء', credit_rating:'A', settlement_days:1, active:true, notes:'حد الائتمان وفترة السداد تعتمدها الإدارة.' }
  ],
  poultry_sales_lots_v13: [
    { id:'sale-lot-001', contract_id:'fmc-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_code:'FLK-2026-08A', bird_count:18000, average_weight_kg:1.72, buyer_id:'buyer-001', buyer_name:'تاجر دواجن معتمد - صنعاء', agreed_price_per_kg_yer:1900, planned_loading_at:'2026-09-23T21:00:00+03:00', transport_vehicle:'سيارة نقل مبردة/مهوّاة - تحدد من الإدارة', loading_status:'planned', payment_status:'pending', settlement_due_date:'2026-09-24', welfare_note:'جدولة التحميل ليلاً وتقليل زمن الانتظار والإجهاد الحراري.' }
  ],
  farm_activity_stream_v13: [
    { id:'act-001', contract_id:'fmc-001', at:'2026-09-15T08:10:00+03:00', actor_name:'المشرف الميداني - صنعاء', actor_role:'مشرف ميداني', category:'feed', action:'تسجيل استهلاك العلف والماء ومراجعة الفرشة.', evidence_urls:[], immutable:true },
    { id:'act-002', contract_id:'fmc-001', at:'2026-09-15T12:30:00+03:00', actor_name:'الطبيب المناوب - صنعاء', actor_role:'طبيب بيطري', category:'health', action:'مراجعة الحالة الصحية وتأكيد عدم الحاجة لمضاد عشوائي.', evidence_urls:[], immutable:true }
  ],
  expense_approvals_v13: [
    { id:'exp-001', contract_id:'fmc-001', requested_at:'2026-09-15T14:00:00+03:00', requested_by:'مسؤول المشتريات', category:'أعلاف', amount_yer:320000, description:'توريد عاجل كمية علف لاستكمال مخزون الدورة.', invoice_image_urls:[], status:'pending_owner' }
  ],
  predictive_forecasts_v13: [
    { id:'forecast-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_code:'FLK-2026-08A', generated_at:'2026-09-15T18:00:00+03:00', age_days:27, current_average_weight_grams:1120, current_fcr:1.54, predicted_weight_3d_grams:1350, predicted_weight_7d_grams:1685, recommended_sale_date:'2026-09-23', expected_sale_weight_grams:1780, confidence_percent:78, basis:['العمر والسلالة','آخر أوزان','استهلاك العلف والماء','FCR الحالي'], note:'تنبؤ تشغيلي للمساعدة في التخطيط وليس ضماناً للوزن أو السعر.' }
  ],
  early_disease_signals_v13: [
    { id:'eds-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_code:'FLK-2026-08A', detected_at:'2026-09-15T17:30:00+03:00', feed_change_percent:-6.5, water_change_percent:9.2, mortality_change_percent:15, temperature_delta_c:1.1, risk_level:'medium', trigger_summary:'هبوط نسبي في العلف مع ارتفاع الماء؛ يحتاج مراجعة التهوية والحرارة والحالة الصحية.', assigned_vet_name:'الطبيب المناوب - صنعاء', status:'under_review' }
  ],
  supplier_quality_scores_v13: [
    { id:'supq-001', supplier_name:'مطاحن وصوامع الغلال الوطنية', category:'feed', period:'Q3-2026', delivery_score:94, biological_performance_score:90, fcr_score:91, mycotoxin_quality_score:88, complaint_score:93, overall_score:91, admin_note:'التقييم يجمع جودة التوريد ونتائج الاستخدام ولا يعتمد على مؤشر واحد.' },
    { id:'supq-002', supplier_name:'مفرخ كتاكيت معتمد', category:'chicks', period:'Q3-2026', delivery_score:92, biological_performance_score:91, chick_viability_score:94, complaint_score:90, overall_score:92 }
  ],
  auto_reorder_rules_v13: [
    { id:'reorder-001', farm_or_branch_name:'مزرعة وادي سبأ النموذجية للدواجن', category:'feed', item_name:'علف نامي', current_stock:3.2, unit:'طن', reorder_level:4, reorder_quantity:10, preferred_supplier:'مطاحن وصوامع الغلال الوطنية', enabled:true, last_triggered_at:'2026-09-15T16:00:00+03:00', draft_purchase_request_status:'ready_for_approval' }
  ],
  iot_sensors_v13: [
    { id:'iot-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', hangar_name:'هنجر 1', sensor_type:'temperature', device_name:'TEMP-H1', status:'not_connected', last_value:27.4, unit:'°C', min_threshold:24, max_threshold:30, alert_active:false },
    { id:'iot-002', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', hangar_name:'هنجر 1', sensor_type:'humidity', device_name:'HUM-H1', status:'not_connected', last_value:61, unit:'%', min_threshold:50, max_threshold:70, alert_active:false },
    { id:'iot-003', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', hangar_name:'هنجر 1', sensor_type:'ammonia', device_name:'NH3-H1', status:'not_connected', last_value:12, unit:'ppm', max_threshold:20, alert_active:false }
  ],
  remote_farm_audits_v13: [
    { id:'audit-remote-001', contract_id:'fmc-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', audited_at:'2026-09-15T15:00:00+03:00', auditor_name:'مدير الجودة', cleanliness_score:90, biosecurity_score:87, litter_score:86, ventilation_score:92, worker_compliance_score:89, overall_score:89, image_urls:[], findings:['رطوبة موضعية قرب بعض السقايات'], corrective_actions:['فحص التسريب وتحريك الفرشة الرطبة وتحسين التهوية الموضعية'] }
  ],
  digital_contract_signatures_v13: [
    { id:'sig-001', contract_type:'farm_management', contract_id:'fmc-001', signer_name:'أحمد صالح العنسي', signer_role:'مالك المزرعة', method:'otp', document_hash:'DEMO-SHA256-MGT-2026-001', status:'pending', note:'OTP الحقيقي يحتاج مزود مصادقة/رسائل مع Backend.' }
  ],
  profit_sharing_settlements_v13: [
    { id:'settle-001', contract_id:'fmc-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', cycle_label:'دورة سبتمبر 2026 - تجريبية', gross_sales_yer:26000000, feed_cost_yer:14200000, chick_cost_yer:4300000, medicine_vaccine_cost_yer:620000, payroll_cost_yer:950000, logistics_cost_yer:410000, other_cost_yer:320000, net_profit_yer:5200000, customer_share_percent:85, customer_share_yer:4420000, platform_share_percent:15, platform_share_yer:780000, team_bonus_yer:120000, status:'draft' }
  ],
  field_doctor_visits_v14: [
    {
      id:'fdv-001', visit_number:'VIS-2026-001', case_id:'clinical-demo-001', contract_id:'fmc-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', customer_name:'أحمد صالح العنسي', phone:'777123456', governorate:'صنعاء', district:'بني حشيش', detailed_address:'العنوان التفصيلي يثبت من العميل عند الزيارة', gps_lat:15.3694, gps_lng:44.1910, doctor_name:'الطبيب الميداني - صنعاء', supervisor_name:'المشرف الميداني - صنعاء', visit_reason:'urgent_mortality', started_at:'2026-09-15T17:10:00+03:00', ended_at:'2026-09-15T18:20:00+03:00', offline_created:false, sync_status:'synced', flock_size:42000, age_days:27, mortality_today:18, average_weight_grams:1120, feed_kg:3820, water_liters:7350, temperature_celsius:29.4, humidity_percent:68, air_speed_mps:1.4, ammonia_ppm:18, co2_ppm:2300, symptoms_description:'هبوط بسيط في العلف، زيادة في استهلاك الماء، أصوات تنفسية متفرقة ورطوبة موضعية في الفرشة.', barn_photos:[], droppings_photos:[], litter_photos:[],
      necropsy_observations:[
        { id:'obs-001', organ_name:'القصبة الهوائية', system:'تنفسي', image_name:'trachea-demo.jpg', image_quality:'clear', lesion_tags:['احتقان خفيف'], description:'تحتاج مراجعة الاستشاري وربطها بالصوت والفحص المخبري عند اللزوم.' },
        { id:'obs-002', organ_name:'الأمعاء والأعوران', system:'هضمي', image_name:'intestine-demo.jpg', image_quality:'clear', lesion_tags:['تغيرات محدودة'], description:'لا يعتمد التشخيص من الصورة وحدها.' }
      ],
      voice_notes:[{ id:'voice-001', recorded_at:'2026-09-15T17:55:00+03:00', file_name:'field-note-demo.m4a', duration_seconds:42, transcript_status:'queued', note:'وصف ميداني صوتي للطبيب ينتظر خدمة تحويل الكلام إلى نص.' }], status:'under_senior_review'
    }
  ],
  ai_diagnostic_assessments_v14: [
    { id:'aida-001', visit_id:'fdv-001', case_id:'clinical-demo-001', created_at:'2026-09-15T18:00:00+03:00', risk_level:'high', suspected_conditions:[{ disease:'مرض تنفسي متعدد العوامل', probability_percent:72, rationale:'أصوات تنفسية + رطوبة/أمونيا + تغيرات القصبة' },{ disease:'عدوى ثانوية بكتيرية', probability_percent:46, rationale:'احتمال يحتاج فحصاً مخبرياً ولا يثبت من الصورة وحدها' }], key_findings:['زيادة نسبية في استهلاك الماء','ارتفاع نسبي في النفوق','تغيرات تنفسية تحتاج ربطاً مخبرياً'], recommended_lab_tests:['مسحات تنفسية PCR حسب التقييم','زراعة بكتيرية وحساسية قبل المضاد عند الاشتباه البكتيري'], recommended_next_steps:['تحسين التهوية وتقليل الرطوبة','عزل الحركة غير الضرورية','إرسال الملف للاستشاري قبل أي مضاد حيوي'], image_analysis_status:'quality_only', audio_analysis_status:'quality_only', senior_vet_required:true, medical_disclaimer:'هذا دعم قرار أولي وليس تشخيصاً نهائياً. القرار العلاجي ووصف المضادات من اختصاص الطبيب البيطري المعتمد.', status:'ready_for_vet' }
  ],
  case_escalations_v14: [
    { id:'esc-001', case_id:'clinical-demo-001', visit_id:'fdv-001', created_at:'2026-09-15T18:05:00+03:00', escalated_by:'الطبيب الميداني - صنعاء', reason:'تداخل مؤشرات تنفسية وبيئية مع ارتفاع نافق يحتاج مراجعة استشاري وفحوص مستهدفة.', priority:'urgent', assigned_senior_vet:'الاستشاري المناوب', attachment_summary:['صور القصبة والأمعاء','مؤشرات البيئة','التسجيل الصوتي','بيانات العلف والماء والنفوق'], status:'under_review' }
  ],
  case_closure_reports_v14: [],
  biosecurity_vaccination_schedule_v14: [
    { id:'sched-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_code:'FLK-2026-08A', event_type:'biosecurity_audit', title:'مراجعة الأمان الحيوي والفرشة', due_at:'2026-09-16T08:00:00+03:00', responsible_role:'المشرف الميداني', status:'due', notification_queued:true, note:'متابعة مناطق الرطوبة وخطوط المياه.' },
    { id:'sched-002', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_code:'FLK-2026-08A', event_type:'lab_followup', title:'متابعة نتيجة العينة التنفسية', due_at:'2026-09-16T14:00:00+03:00', responsible_role:'الطبيب البيطري', status:'scheduled', notification_queued:true }
  ],
  cloud_production_v14: {
    database_provider:'local_json', database_connection_status:'local_only', auth_provider:'local_prototype', auth_connection_status:'prototype', media_storage_provider:'local', media_storage_status:'local_only', realtime_sync_enabled:false, encryption_at_rest_required:true, encrypted_transport_required:true, signed_media_urls_required:true, backup_policy:'daily', region_label:'يحدد عند اختيار مزود السحابة', production_note:'الواجهات والبنية جاهزة للربط، لكن الإنتاج الحقيقي يتطلب قاعدة بيانات سحابية ومصادقة وتخزين وسائط ومفاتيح خادمية فعلية.'
  },
  field_media_queue_v14: [
    { id:'mq-001', visit_id:'fdv-001', media_type:'voice', file_name:'field-note-demo.m4a', created_at:'2026-09-15T17:55:00+03:00', status:'local_only' }
  ],
  offline_sync_v15: {
    database_name:'smart-poultry-v15', storage_engine:'indexeddb', indexeddb_enabled:true, media_blob_cache_enabled:true,
    estimated_local_capacity_mb:512, conflict_strategy:'last_write_wins', device_id:'DEVICE-DEMO-001', client_revision:15, server_revision:15,
    pending_actions:2, pending_media:1, last_sync_at:'2026-09-15T19:30:00+03:00', last_successful_full_sync_at:'2026-09-15T18:00:00+03:00'
  },
  sync_conflicts_v15: [
    { id:'conflict-001', entity_type:'daily_log', entity_id:'log-demo-feed', field_name:'feed_consumption_kg', client_value:1840, server_value:1810, client_updated_at:'2026-09-15T19:25:00+03:00', server_updated_at:'2026-09-15T19:20:00+03:00', strategy:'last_write_wins', resolution:'pending' }
  ],
  vet_verification_feedback_v15: [
    { id:'verify-001', assessment_id:'aida-001', visit_id:'fdv-001', case_id:'clinical-demo-001', ai_top_suggestion:'مرض تنفسي متعدد العوامل', ai_confidence_percent:72, vet_confirmed_diagnosis:'متلازمة تنفسية متعددة العوامل - تحت استكمال الفحص', confirmation_level:'partially_confirmed', image_labels_verified:['القصبة الهوائية','الأمعاء والأعوران'], clinical_note:'تم تأكيد أن الصور للأعضاء الصحيحة، والقرار النهائي مرتبط بنتيجة الفحص المخبري.', use_for_model_improvement:true, verified_by:'الاستشاري المناوب', verified_at:'2026-09-15T19:10:00+03:00' }
  ],
  predictive_performance_v15: [
    { id:'pred-v15-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_code:'FLK-2026-08A', generated_at:'2026-09-15T19:20:00+03:00', age_days:27, fcr_current:1.54, fcr_baseline:1.50, feed_change_percent:-6.5, water_change_percent:9.2, mortality_change_percent:15, temperature_delta_c:1.1, humidity_delta_percent:7, weather_risk_label:'حرارة ورطوبة أعلى من المتوسط', disease_risk_score:68, risk_level:'high', predicted_weight_7d_grams:1685, predicted_harvest_date:'2026-09-23', recommended_actions:['مراجعة التهوية وخطوط المياه','إعادة وزن عينة ممثلة خلال 48 ساعة','مراجعة الطبيب إذا استمر هبوط العلف أو ارتفع النافق'] }
  ],
  feed_formulation_v15: {
    ingredients:[
      { id:'ing-corn', name:'ذرة صفراء', category:'energy', crude_protein_percent:8.5, metabolizable_energy_kcal_kg:3350, digestible_lysine_percent:0.22, calcium_percent:0.03, available_phosphorus_percent:0.08, price_per_kg_yer:390, min_inclusion_percent:35, max_inclusion_percent:70, active:true },
      { id:'ing-soy', name:'كسب صويا 46%', category:'protein', crude_protein_percent:46, metabolizable_energy_kcal_kg:2450, digestible_lysine_percent:2.75, calcium_percent:0.29, available_phosphorus_percent:0.62, price_per_kg_yer:720, min_inclusion_percent:15, max_inclusion_percent:40, active:true },
      { id:'ing-bran', name:'نخالة قمح', category:'energy', crude_protein_percent:16, metabolizable_energy_kcal_kg:1800, digestible_lysine_percent:0.55, calcium_percent:0.13, available_phosphorus_percent:0.35, price_per_kg_yer:300, min_inclusion_percent:0, max_inclusion_percent:10, active:true },
      { id:'ing-oil', name:'زيت نباتي', category:'energy', crude_protein_percent:0, metabolizable_energy_kcal_kg:8800, digestible_lysine_percent:0, calcium_percent:0, available_phosphorus_percent:0, price_per_kg_yer:900, min_inclusion_percent:0, max_inclusion_percent:5, active:true },
      { id:'ing-lime', name:'حجر جيري', category:'mineral', crude_protein_percent:0, metabolizable_energy_kcal_kg:0, digestible_lysine_percent:0, calcium_percent:38, available_phosphorus_percent:0, price_per_kg_yer:120, min_inclusion_percent:0.5, max_inclusion_percent:2, active:true },
      { id:'ing-dcp', name:'ثنائي فوسفات الكالسيوم', category:'mineral', crude_protein_percent:0, metabolizable_energy_kcal_kg:0, digestible_lysine_percent:0, calcium_percent:23, available_phosphorus_percent:18, price_per_kg_yer:850, min_inclusion_percent:0.5, max_inclusion_percent:2.5, active:true },
      { id:'ing-premix', name:'بريمكس فيتامينات ومعادن', category:'additive', crude_protein_percent:0, metabolizable_energy_kcal_kg:0, digestible_lysine_percent:0, calcium_percent:0, available_phosphorus_percent:0, price_per_kg_yer:2100, min_inclusion_percent:0.25, max_inclusion_percent:1, active:true }
    ],
    formulas:[
      { id:'formula-broiler-grower', name:'لاحم نامي - نموذج أولي', bird_type:'broiler', stage:'grower', target_protein_percent:20.5, target_energy_kcal_kg:3000, target_digestible_lysine_percent:1.05, target_calcium_percent:0.85, target_available_phosphorus_percent:0.45, lines:[{ingredient_id:'ing-corn',ingredient_name:'ذرة صفراء',inclusion_percent:58},{ingredient_id:'ing-soy',ingredient_name:'كسب صويا 46%',inclusion_percent:33},{ingredient_id:'ing-bran',ingredient_name:'نخالة قمح',inclusion_percent:4},{ingredient_id:'ing-oil',ingredient_name:'زيت نباتي',inclusion_percent:2},{ingredient_id:'ing-lime',ingredient_name:'حجر جيري',inclusion_percent:1.2},{ingredient_id:'ing-dcp',ingredient_name:'ثنائي فوسفات الكالسيوم',inclusion_percent:1.2},{ingredient_id:'ing-premix',ingredient_name:'بريمكس فيتامينات ومعادن',inclusion_percent:0.6}], calculated_protein_percent:20.75, calculated_energy_kcal_kg:2999.5, calculated_digestible_lysine_percent:1.057, calculated_calcium_percent:0.85, calculated_available_phosphorus_percent:0.481, calculated_cost_per_kg_yer:518.04, status:'balanced' },
      { id:'formula-broiler-starter', name:'لاحم بادي - 1 إلى 14 يوم', bird_type:'broiler', stage:'starter', target_protein_percent:22, target_energy_kcal_kg:3000, target_digestible_lysine_percent:1.18, target_calcium_percent:0.95, target_available_phosphorus_percent:0.48, lines:[{ingredient_id:'ing-corn',ingredient_name:'ذرة صفراء',inclusion_percent:53},{ingredient_id:'ing-soy',ingredient_name:'كسب صويا 46%',inclusion_percent:38},{ingredient_id:'ing-bran',ingredient_name:'نخالة قمح',inclusion_percent:2},{ingredient_id:'ing-oil',ingredient_name:'زيت نباتي',inclusion_percent:3},{ingredient_id:'ing-lime',ingredient_name:'حجر جيري',inclusion_percent:1.2},{ingredient_id:'ing-dcp',ingredient_name:'ثنائي فوسفات الكالسيوم',inclusion_percent:2.2},{ingredient_id:'ing-premix',ingredient_name:'بريمكس فيتامينات ومعادن',inclusion_percent:0.6}], calculated_protein_percent:22.305, calculated_energy_kcal_kg:3006.5, calculated_digestible_lysine_percent:1.173, calculated_calcium_percent:1.091, calculated_available_phosphorus_percent:0.681, calculated_cost_per_kg_yer:546.04, status:'balanced' },
      { id:'formula-broiler-finisher', name:'لاحم ناهي - قبل التسويق', bird_type:'broiler', stage:'finisher', target_protein_percent:19, target_energy_kcal_kg:3100, target_digestible_lysine_percent:0.95, target_calcium_percent:0.75, target_available_phosphorus_percent:0.40, lines:[{ingredient_id:'ing-corn',ingredient_name:'ذرة صفراء',inclusion_percent:62},{ingredient_id:'ing-soy',ingredient_name:'كسب صويا 46%',inclusion_percent:29},{ingredient_id:'ing-bran',ingredient_name:'نخالة قمح',inclusion_percent:4},{ingredient_id:'ing-oil',ingredient_name:'زيت نباتي',inclusion_percent:2.5},{ingredient_id:'ing-lime',ingredient_name:'حجر جيري',inclusion_percent:1},{ingredient_id:'ing-dcp',ingredient_name:'ثنائي فوسفات الكالسيوم',inclusion_percent:1},{ingredient_id:'ing-premix',ingredient_name:'بريمكس فيتامينات ومعادن',inclusion_percent:0.5}], calculated_protein_percent:19.25, calculated_energy_kcal_kg:3079.5, calculated_digestible_lysine_percent:0.956, calculated_calcium_percent:0.718, calculated_available_phosphorus_percent:0.423, calculated_cost_per_kg_yer:505.30, status:'balanced' },
      { id:'formula-layer', name:'بياض - إنتاج', bird_type:'layer', stage:'layer', target_protein_percent:17, target_energy_kcal_kg:2800, target_digestible_lysine_percent:0.82, target_calcium_percent:3.5, target_available_phosphorus_percent:0.45, lines:[{ingredient_id:'ing-corn',ingredient_name:'ذرة صفراء',inclusion_percent:58},{ingredient_id:'ing-soy',ingredient_name:'كسب صويا 46%',inclusion_percent:24},{ingredient_id:'ing-bran',ingredient_name:'نخالة قمح',inclusion_percent:7},{ingredient_id:'ing-oil',ingredient_name:'زيت نباتي',inclusion_percent:1.5},{ingredient_id:'ing-lime',ingredient_name:'حجر جيري',inclusion_percent:7.5},{ingredient_id:'ing-dcp',ingredient_name:'ثنائي فوسفات الكالسيوم',inclusion_percent:1.5},{ingredient_id:'ing-premix',ingredient_name:'بريمكس فيتامينات ومعادن',inclusion_percent:0.5}], calculated_protein_percent:17.09, calculated_energy_kcal_kg:2789, calculated_digestible_lysine_percent:0.826, calculated_calcium_percent:3.291, calculated_available_phosphorus_percent:0.490, calculated_cost_per_kg_yer:465.75, status:'balanced' }

    ],
    last_recalculated_at:'2026-09-15T19:15:00+03:00'
  },
  biosecurity_checklists_v15: [
    { id:'biochk-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', governorate:'صنعاء', district:'بني حشيش', date:'2026-09-15', outbreak_risk_level:'watch', movement_restriction_active:true, restriction_reason:'نشاط تنفسي تحت المراقبة في نطاق قريب؛ تقليل حركة الأفراد والمركبات غير الضرورية.', score_percent:75, next_due_at:'2026-09-16T07:00:00+03:00', items:[
      { id:'bc-01', label:'تسجيل وتعقيم الزوار قبل دخول المزرعة', category:'entry_control', frequency:'per_entry', required:true, completed:true, completed_at:'2026-09-15T07:30:00+03:00', completed_by:'المشرف الميداني' },
      { id:'bc-02', label:'تطهير مدخل المركبات والعجلات', category:'vehicles', frequency:'per_vehicle', required:true, completed:true, completed_at:'2026-09-15T08:00:00+03:00', completed_by:'عامل الأمن الحيوي' },
      { id:'bc-03', label:'فحص التسريبات وإزالة الفرشة الرطبة', category:'litter', frequency:'daily', required:true, completed:false },
      { id:'bc-04', label:'التخلص الآمن من النافق وتوثيق العدد', category:'mortality', frequency:'daily', required:true, completed:true, completed_at:'2026-09-15T12:00:00+03:00', completed_by:'المشرف الميداني' }
    ] }
  ],
  hardware_integrations_v15: [
    { id:'hw-printer-01', device_type:'thermal_printer', name:'طابعة فواتير Bluetooth', protocol:'bluetooth_spp_escpos', status:'not_configured', notes:'يدعم V15 الطباعة ESC/POS على أجهزة Android المقترنة.' },
    { id:'hw-scale-01', device_type:'digital_scale', name:'ميزان ميداني Bluetooth', protocol:'bluetooth_spp_text', status:'not_configured', unit:'kg', notes:'قراءة نصية عبر SPP؛ صيغة الميزان الفعلية تضبط عند معرفة موديله.' }
  ],
  app_update_v15: { provider:'google_play_in_app_update', enabled:true, current_version_name:'1.7.0', current_version_code:17, update_available:false, update_priority:'recommended', status:'not_checked', note:'التحديث داخل التطبيق يعمل عند نشر التطبيق عبر Google Play. النسخ الجانبية APK تستخدم التحديث اليدوي.' },
  data_exchange_jobs_v15: [
    { id:'exchange-001', created_at:'2026-09-15T18:30:00+03:00', direction:'export', format:'xlsx', dataset:'enterprise_snapshot', rows_count:0, status:'preview', file_name:'smart-poultry-enterprise-v15.xlsx', note:'جاهز للتصدير من لوحة الإدارة.' }
  ],
  executive_dashboard_v15: {
    generated_at:'2026-09-15T19:30:00+03:00', gross_revenue_yer:4850000, net_profit_yer:1095000, active_farms:1, live_birds:42000, average_fcr:1.54, average_mortality_percent:2.8, biosecurity_average_percent:89, open_clinical_cases:2, high_risk_farms:1, inventory_value_yer:10300000, receivables_yer:720000,
    sales_trend:[3.2,3.5,3.8,4.1,4.0,4.4,4.85], profit_trend:[0.62,0.71,0.76,0.83,0.88,0.97,1.095], fcr_trend:[1.62,1.60,1.59,1.57,1.56,1.55,1.54], mortality_trend:[3.2,3.1,3.0,3.0,2.9,2.85,2.8]
  }

,
  governance_roles_v16: [
    { id:'role-owner', key:'system_owner', name:'مالك النظام / CEO', description:'رؤية شاملة، موافقات حساسة، سجل الرقابة، وإدارة الحوكمة.', scope:'all_branches', can_view_finance:true, can_edit_prices:true, can_approve_discounts:true, can_manage_staff:true, can_view_live_locations:true, requires_mfa:true, active:true },
    { id:'role-finance', key:'finance', name:'إدارة المالية والمحاسبة', description:'القيود، التحصيل، الذمم، الأرباح والخسائر والتسويات.', scope:'all_branches', can_view_finance:true, can_edit_prices:false, can_approve_discounts:false, can_manage_staff:false, can_view_live_locations:false, requires_mfa:true, active:true },
    { id:'role-field', key:'field_ops', name:'إدارة النزول الميداني', description:'الجداول، GPS، الزيارات، تكاليف التنقل والتفتيش.', scope:'assigned_region', can_view_finance:false, can_edit_prices:false, can_approve_discounts:false, can_manage_staff:true, can_view_live_locations:true, requires_mfa:false, active:true },
    { id:'role-vet', key:'vet_manager', name:'إدارة الدعم البيطري', description:'الحالات، الزيارات، الفحوص، التحصينات واعتماد المضادات.', scope:'assigned_region', can_view_finance:false, can_edit_prices:false, can_approve_discounts:false, can_manage_staff:true, can_view_live_locations:true, requires_mfa:true, active:true },
    { id:'role-sales', key:'sales_marketing', name:'إدارة التسويق والمبيعات', description:'CRM، كبار العملاء، خطوط السير، الأهداف والحملات.', scope:'assigned_branches', can_view_finance:false, can_edit_prices:false, can_approve_discounts:true, can_manage_staff:true, can_view_live_locations:true, requires_mfa:false, active:true },
    { id:'role-warehouse', key:'warehouse', name:'المخازن', description:'المخزون والحجوزات والتحويل بين الفروع.', scope:'assigned_branches', can_view_finance:false, can_edit_prices:false, can_approve_discounts:false, can_manage_staff:false, can_view_live_locations:false, requires_mfa:false, active:true },
    { id:'role-auditor', key:'auditor', name:'الرقابة / التدقيق', description:'قراءة السجلات والتنبيهات والقيود بدون تعديل تشغيلي.', scope:'read_only', can_view_finance:true, can_edit_prices:false, can_approve_discounts:false, can_manage_staff:false, can_view_live_locations:false, requires_mfa:true, active:true }
  ],
  accounting_journal_v16: [
    { id:'je-001', date:'2026-09-15', branch_name:'فرع صنعاء المركزي', reference:'INV-2026-0001', debit_account:'الصندوق / التحصيل', credit_account:'إيرادات المبيعات', amount_yer:272000, description:'تحصيل طلب علف مع أجرة التوصيل', created_by:'المالية', status:'posted' },
    { id:'je-002', date:'2026-09-15', branch_name:'فرع عدن', reference:'EXP-FIELD-001', debit_account:'مصروف النزول الميداني', credit_account:'الصندوق', amount_yer:42000, description:'تكلفة انتقال فريق ميداني', created_by:'محاسب الفرع', status:'posted' }
  ],
  branch_accounting_v16: [
    { branch_id:'br-01', branch_name:'فرع صنعاء المركزي', date:'2026-09-15', cash_yer:1850000, receivables_yer:510000, payables_yer:340000, inventory_yer:6700000, revenue_mtd_yer:13200000, expenses_mtd_yer:9850000, net_profit_mtd_yer:3350000, debt_overdue_yer:175000 },
    { branch_id:'br-02', branch_name:'فرع عدن', date:'2026-09-15', cash_yer:920000, receivables_yer:210000, payables_yer:150000, inventory_yer:3600000, revenue_mtd_yer:7100000, expenses_mtd_yer:6160000, net_profit_mtd_yer:940000, debt_overdue_yer:85000 }
  ],
  vendor_branches_v16: [
    { id:'vb-001', partner_contract_id:'partner-001', company_name:'شركة مدخلات بيطرية متعاقدة', branch_name:'مكتب صنعاء - الشراكة', governorate:'صنعاء', district:'أمانة العاصمة', address:'المنطقة التجارية - صنعاء', phone:'777000201', lat:15.3694, lng:44.1910, linked_platform_branch_id:'br-01', customer_visible:true, active:true },
    { id:'vb-002', partner_contract_id:'partner-001', company_name:'شركة مدخلات بيطرية متعاقدة', branch_name:'مكتب عدن - الشراكة', governorate:'عدن', district:'المنصورة', address:'المنصورة - عدن', phone:'777000202', lat:12.8600, lng:44.9856, linked_platform_branch_id:'br-02', customer_visible:true, active:true }
  ],
  regional_pricing_rules_v16: [
    { id:'rpr-001', company_name:'شركة مدخلات بيطرية متعاقدة', product_name:'لقاح نيوكاسل', category:'vaccine', governorate:'صنعاء', customer_tier:'standard', base_price_yer:16500, discount_percent:3, net_price_yer:16005, currency:'YER_OLD', valid_from:'2026-09-15', approved_by:'مالك النظام', published:true },
    { id:'rpr-002', company_name:'شركة مدخلات بيطرية متعاقدة', product_name:'لقاح نيوكاسل', category:'vaccine', governorate:'عدن', customer_tier:'vip', base_price_yer:52000, discount_percent:7, net_price_yer:48360, currency:'YER_NEW', valid_from:'2026-09-15', approved_by:'مالك النظام', published:true },
    { id:'rpr-003', company_name:'شركة أعلاف متعاقدة', product_name:'علف نامي 50 كجم', category:'feed', governorate:'صنعاء', customer_tier:'contracted', base_price_yer:26500, discount_percent:5, net_price_yer:25175, currency:'YER_OLD', valid_from:'2026-09-15', approved_by:'مالك النظام', published:true }
  ],
  ai_smart_routes_v16: [
    { id:'route-001', created_at:'2026-09-15T20:00:00+03:00', customer_name:'عميل تجريبي', governorate:'صنعاء', district:'بني حشيش', prescribed_product:'لقاح نيوكاسل', doctor_approval_reference:'RX/VAC-2026-001', branch_id:'vb-001', branch_name:'مكتب صنعاء - الشراكة', company_name:'شركة مدخلات بيطرية متعاقدة', distance_km:18.4, stock_available:22, eta_minutes:55, routing_reason:'أقرب فرع نشط مرتبط بمخزون متاح بعد اعتماد الطبيب/البرنامج الوقائي.', status:'suggested' }
  ],
  customer_360_v16: [
    { id:'cust360-001', customer_name:'عميل تجريبي', phone:'777123456', governorate:'صنعاء', district:'بني حشيش', customer_tier:'vip', farms_count:2, active_flocks:2, lifetime_sales_yer:4850000, outstanding_debt_yer:172000, last_purchase_at:'2026-09-15T18:20:00+03:00', previous_disease_events:['اشتباه تنفسي - أغسطس 2026','كوكسيديا - يوليو 2026'], latest_lab_results:['زراعة بكتيرية: قيد المراجعة'], preferred_categories:['feed','vaccine','supervision'], assigned_sales_rep:'مندوب المنطقة - صنعاء', assigned_vet:'الطبيب المناوب - صنعاء', risk_note:'عميل جيد الالتزام؛ يحتاج متابعة الذمم قبل توسيع حد الآجل.' }
  ],
  crm_opportunities_v16: [
    { id:'crm-001', customer_id:'cust360-001', customer_name:'عميل تجريبي', title:'عقد إشراف للدورة القادمة', stage:'proposal', expected_value_yer:480000, probability_percent:70, owner_name:'مندوب المنطقة - صنعاء', next_action:'شرح الباقة وربطها بتقرير يومي ومتابعة حتى التسويق', due_at:'2026-09-17T11:00:00+03:00', source:'app' },
    { id:'crm-002', customer_id:'cust360-001', customer_name:'عميل تجريبي', title:'توريد علف نامي', stage:'qualified', expected_value_yer:1250000, probability_percent:65, owner_name:'مندوب المنطقة - صنعاء', next_action:'تأكيد الكمية والموقع وأجرة التوصيل', due_at:'2026-09-16T10:00:00+03:00', source:'field' }
  ],
  targeted_campaigns_v16: [
    { id:'camp-001', name:'التوعية بالاستخدام الرشيد للمضادات', audience_rule:'كل مزارع لديه قطيع نشط', category:'education', message:'لا تبدأ مضاداً حيوياً عشوائياً. اجمع بيانات القطيع والصور والفحوص، ودع الطبيب يحدد الحاجة والدواء وفترة السحب.', target_count:320, channels:['push','whatsapp','in_app'], status:'approved', requires_medical_review:true },
    { id:'camp-002', name:'عرض فحص السموم والأعلاف', audience_rule:'قطعان عمر 18-24 يوم + هبوط استهلاك العلف', category:'feed', message:'انخفاض استهلاك العلف قد يكون له أكثر من سبب. يتوفر فحص علف/سموم وخدمة مراجعة التغذية حسب المنطقة.', target_count:46, channels:['push','in_app'], status:'draft', requires_medical_review:true }
  ],
  sales_targets_v16: [
    { id:'target-001', rep_name:'مندوب المنطقة - صنعاء', region:'صنعاء', month:'2026-09', target_yer:8000000, achieved_yer:5150000, orders_target:75, orders_achieved:48, incentive_percent:1.5 },
    { id:'target-002', rep_name:'مندوب المنطقة - عدن', region:'عدن', month:'2026-09', target_yer:6500000, achieved_yer:3380000, orders_target:60, orders_achieved:31, incentive_percent:1.25 }
  ],
  field_staff_positions_v16: [
    { id:'pos-001', staff_name:'الطبيب الميداني - صنعاء', staff_role:'vet', phone:'777000301', lat:15.4050, lng:44.2100, last_ping_at:'2026-09-15T20:35:00+03:00', assigned_route:'صنعاء → بني حشيش', assigned_farm:'مزرعة وادي سبأ النموذجية للدواجن', movement_status:'on_site', geofence_valid:true, visit_cost_yer:18000 },
    { id:'pos-002', staff_name:'مندوب المنطقة - صنعاء', staff_role:'sales_rep', phone:'777000302', lat:15.3540, lng:44.2060, last_ping_at:'2026-09-15T20:34:00+03:00', assigned_route:'الأمانة → بني مطر', movement_status:'en_route', geofence_valid:true, visit_cost_yer:9500 },
    { id:'pos-003', staff_name:'سائق التوصيل - عدن', staff_role:'driver', phone:'777000303', lat:12.8450, lng:44.9900, last_ping_at:'2026-09-15T20:30:00+03:00', assigned_route:'المنصورة → دار سعد', movement_status:'en_route', geofence_valid:true }
  ],
  field_inspections_v16: [
    { id:'insp-001', visit_number:'VIS-2026-0915-01', staff_name:'الطبيب الميداني - صنعاء', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', customer_name:'عميل تجريبي', governorate:'صنعاء', district:'بني حشيش', checked_in_at:'2026-09-15T18:40:00+03:00', checked_out_at:'2026-09-15T19:35:00+03:00', geofence_distance_m:38, geofence_verified:true, biosecurity_score_percent:88, necropsy_notes:'تم توثيق الفحص والصور وربطها بملف الحالة.', media_urls:[], client_signature_url:'signature://customer-confirmed', offline_created:true, sync_status:'synced', inspection_items:[{label:'نظافة المدخل والتطهير',value:'جيد',status:'ok'},{label:'الفرشة',value:'رطوبة موضعية قرب خطوط المياه',status:'warning'},{label:'التهوية',value:'تحتاج ضبط بسيط وقت الذروة',status:'warning'}] }
  ],
  whatsapp_hub_v16: { enabled:false, provider:'not_configured', business_number_label:'يُحدد من الإدارة', api_mode:'simulation', connection_status:'not_configured', default_language:'ar', ceo_digest_time:'22:00', invoice_auto_send:true, receipt_auto_send:true, emergency_auto_send:true, note:'الواجهة والطابور جاهزان. الربط الحقيقي يحتاج WhatsApp Business/Cloud API ومفتاح خادم؛ لا يوضع المفتاح داخل APK.' },
  communication_queue_v16: [
    { id:'msg-v16-001', created_at:'2026-09-15T20:10:00+03:00', channel:'whatsapp', recipient_name:'عميل تجريبي', recipient_phone:'777123456', template_key:'invoice_ready', subject:'فاتورة الطلب', body:'تم إصدار فاتورتك INV-2026-0001 واعتماد عملية الدفع. الطلب قيد التجهيز.', related_reference:'INV-2026-0001', priority:'normal', status:'simulation' },
    { id:'msg-v16-002', created_at:'2026-09-15T20:12:00+03:00', channel:'whatsapp', recipient_name:'فريق الطوارئ - صنعاء', audience_group:'emergency_sanaa', template_key:'outbreak_alert', subject:'تنبيه وبائي', body:'رُصد ارتفاع في الحالات ضمن نطاق محدد. راجع رادار الأوبئة وارفع مستوى الأمن الحيوي.', related_reference:'cluster-001', priority:'critical', status:'simulation' }
  ],
  ceo_daily_digests_v16: [
    { id:'digest-2026-09-15', date:'2026-09-15', generated_at:'2026-09-15T22:00:00+03:00', gross_sales_yer:4850000, collected_yer:4210000, receivables_yer:720000, mortality_today:118, critical_alerts_count:3, field_visits_count:7, deliveries_count:11, summary_text:'المبيعات 4.85م ر.ي، المحصل 4.21م، 3 تنبيهات حرجة، 7 زيارات ميدانية، و11 عملية توصيل. راجع الذمم المتأخرة والبؤرة عالية الخطورة.', whatsapp_status:'simulation' }
  ],
  owner_war_room_v16: {
    last_refreshed_at:'2026-09-15T20:40:00+03:00', live_mode:true, sales_today_yer:4850000, collected_today_yer:4210000, net_cash_position_yer:2770000, active_field_staff:3, active_deliveries:1, open_critical_cases:2, epidemic_risk_regions:1, overdue_receivables_yer:260000,
    branches:[
      { branch_id:'br-01', branch_name:'فرع صنعاء المركزي', governorate:'صنعاء', status:'open', sales_today_yer:3100000, collected_today_yer:2800000, pending_orders:9, low_stock_items:1, active_staff:11, critical_cases:2, lat:15.3694, lng:44.1910 },
      { branch_id:'br-02', branch_name:'فرع عدن', governorate:'عدن', status:'open', sales_today_yer:1750000, collected_today_yer:1410000, pending_orders:5, low_stock_items:0, active_staff:7, critical_cases:0, lat:12.7855, lng:45.0187 }
    ]
  },
  owner_change_alerts_v16: [
    { id:'owner-alert-001', created_at:'2026-09-15T20:22:00+03:00', severity:'warning', module:'discounts', actor_name:'مدير المبيعات', action:'طلب خصم استثنائي 12%', before_value:'5%', after_value:'12%', reference:'CRM-001', acknowledged:false },
    { id:'owner-alert-002', created_at:'2026-09-15T20:25:00+03:00', severity:'critical', module:'prices', actor_name:'مدير فرع', action:'محاولة تعديل سعر صنف حساس خارج مسار الموافقة', before_value:'16,000', after_value:'13,500', reference:'VAC-01', acknowledged:false }
  ],

  v17_config: {
    flock_sale_broker_timeout_minutes: 30,
    supplier_timeout_minutes: 45,
    default_platform_sale_commission_percent: 2.5,
    default_lease_commission_percent: 5,
    max_ai_negotiation_attempts: 2,
    platform_main_account_label: 'الحساب الرئيسي للمنصة - تحدده الإدارة',
    require_finance_verification_before_customer_payout: true,
    hide_counterparty_contacts_until_contract: true,
    ai_may_prescribe_antibiotics: false,
    ai_may_prescribe_vaccines: false,
    supplements_only_from_vet_approved_protocols: true
  },
  flock_sales_pipeline_v17: [
    {
      id:'flocksale-v17-001', request_number:'FSALE-2026-0001', created_at:'2026-09-15T21:10:00+03:00', updated_at:'2026-09-15T21:25:00+03:00',
      customer_name:'عميل تجريبي', phone:'777123456', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_code:'FLK-2026-08A', governorate:'صنعاء', district:'بني حشيش', address:'بني حشيش - موقع المزرعة',
      birds_count:18400, average_weight_kg:1.85, estimated_live_weight_kg:34040, weight_category:'1.8-2.0 كجم', bourse_price_per_kg_yer:2150, bourse_reference:'بورصة صنعاء اليومية 2026-09-15', customer_price_accepted:true,
      sales_manager_name:'مدير المبيعات - صنعاء', marketing_fee_mode:'fixed_per_kg', marketing_fee_value:18, platform_commission_percent:2.5, broker_timeout_minutes:30,
      broker_queue:[
        { broker_contract_id:'marketer-001', broker_name:'مكتب تسويق متعاقد - صنعاء', priority:1, region_match:true, status:'accepted', offered_at:'2026-09-15T21:12:00+03:00', responded_at:'2026-09-15T21:18:00+03:00', final_price_per_kg_yer:2180, settlement_days:1, loading_at:'2026-09-16T04:30:00+03:00', mortality_terms:'لا يتحمل المكتب النافق قبل التحميل؛ بعد التسليم تطبق شروط العقد.' },
        { broker_contract_id:'marketer-002', broker_name:'مكتب تسويق احتياطي', priority:2, region_match:false, status:'pending', settlement_days:2, mortality_terms:'وفق العقد المعتمد.' }
      ], current_broker_index:0, negotiation_attempts:1, customer_final_accepted:false, sales_manager_phone:'777000302', loading_evidence_urls:[], status:'broker_offer_ready', notes:'بانتظار موافقة العميل النهائية على سعر المكتب وموعد التحميل.'
    }
  ],
  flock_sale_settlements_v17: [
    {
      id:'settle-v17-demo', sale_pipeline_id:'flocksale-v17-demo-closed', broker_name:'مكتب تسويق متعاقد', customer_name:'عميل سابق', gross_sale_yer:31200000, marketing_fee_yer:275000, platform_fee_yer:780000, debt_deduction_yer:320000, other_deductions_yer:0, net_customer_yer:29825000,
      broker_payment_reference:'BRPAY-DEMO-001', broker_payment_verified_by:'المالية', broker_payment_verified_at:'2026-09-14T14:00:00+03:00', customer_transfer_reference:'CUST-TR-DEMO-001', customer_transfer_at:'2026-09-14T16:20:00+03:00',
      invoice_lines:[
        {id:'wline-1',size_class:'large',birds_count:5200,total_weight_kg:10500,price_per_kg_yer:2240,line_total_yer:23520000},
        {id:'wline-2',size_class:'medium',birds_count:2100,total_weight_kg:3150,price_per_kg_yer:2100,line_total_yer:6615000},
        {id:'wline-3',size_class:'small',birds_count:700,total_weight_kg:700,price_per_kg_yer:1521,line_total_yer:1064700}
      ], status:'closed', created_at:'2026-09-14T08:00:00+03:00'
    }
  ],
  supplier_routing_orders_v17: [
    {
      id:'suporder-v17-001', order_number:'SUP-2026-0001', created_at:'2026-09-15T21:00:00+03:00', customer_name:'عميل تجريبي', phone:'777123456', governorate:'صنعاء', district:'بني حشيش', address:'موقع المزرعة', category:'feed', product_name:'علف نامي 50 كجم', quantity:80, unit_label:'كيس', official_price_yer:25175, transport_fee_yer:18000, customer_accepted_total:true,
      requires_doctor_approval:false, supplier_timeout_minutes:45, supplier_queue:[
        {partner_contract_id:'partner-001',supplier_name:'شركة أعلاف متعاقدة',priority:1,governorate_match:true,status:'accepted',offered_at:'2026-09-15T21:02:00+03:00',confirmed_quantity:80,confirmed_unit_price_yer:25175,eta_hours:5},
        {partner_contract_id:'partner-002',supplier_name:'مورد احتياطي',priority:2,governorate_match:false,status:'pending'}
      ], current_supplier_index:0, platform_commission_percent:3, payment_status:'awaiting_customer', supplier_settlement_status:'not_due', status:'awaiting_payment'
    }
  ],
  report_routing_rules_v17: [
    {id:'rrule-clinical-sanaa',category:'clinical',governorate:'صنعاء',primary_staff_name:'الطبيب المناوب - صنعاء',primary_role:'استشاري بيطري',phone:'777000301',whatsapp:'777000301',app_notification:true,whatsapp_notification:true,escalation_staff_name:'مدير الدعم البيطري',response_sla_minutes:15,active:true},
    {id:'rrule-necropsy-all',category:'necropsy',governorate:'ALL',primary_staff_name:'غرفة الاستشاريين',primary_role:'استشاري بيطري',phone:'777000310',whatsapp:'777000310',app_notification:true,whatsapp_notification:true,escalation_staff_name:'مدير الدعم البيطري',response_sla_minutes:20,active:true},
    {id:'rrule-feed-all',category:'feed_fcr',governorate:'ALL',primary_staff_name:'مهندس التغذية',primary_role:'تغذية',phone:'777000320',whatsapp:'777000320',app_notification:true,whatsapp_notification:false,response_sla_minutes:60,active:true},
    {id:'rrule-equip-all',category:'equipment',governorate:'ALL',primary_staff_name:'مهندس المعدات',primary_role:'صيانة ومعدات',phone:'777000330',whatsapp:'777000330',app_notification:true,whatsapp_notification:true,response_sla_minutes:60,active:true},
    {id:'rrule-finance-all',category:'finance',governorate:'ALL',primary_staff_name:'مسؤول المالية',primary_role:'مالية',phone:'777000340',whatsapp:'777000340',app_notification:true,whatsapp_notification:false,response_sla_minutes:30,active:true},
    {id:'rrule-ceo-all',category:'executive',governorate:'ALL',primary_staff_name:'مالك النظام',primary_role:'System Owner',phone:'777000350',whatsapp:'777000350',app_notification:true,whatsapp_notification:true,response_sla_minutes:0,active:true}
  ],
  routed_reports_v17: [
    {id:'routed-demo-1',created_at:'2026-09-15T20:55:00+03:00',category:'clinical',governorate:'صنعاء',reference:'CASE-2026-001',summary:'ارتفاع نافق مع أعراض تنفسية؛ الملف يحتوي صور وصوت وبيانات البيئة.',assigned_to:'الطبيب المناوب - صنعاء',assigned_role:'استشاري بيطري',channels:['app','whatsapp'],status:'delivered'},
    {id:'routed-demo-2',created_at:'2026-09-15T21:00:00+03:00',category:'finance',governorate:'صنعاء',reference:'SUP-2026-0001',summary:'طلب شراء علف جاهز لرفع إثبات الدفع والتحقق المالي.',assigned_to:'مسؤول المالية',assigned_role:'مالية',channels:['app'],status:'queued'}
  ],
  farm_lease_listings_v17: [
    {
      id:'lease-list-001',listing_number:'LEASE-2026-0001',created_at:'2026-09-15T20:45:00+03:00',owner_name:'مالك مزرعة تجريبي',owner_phone:'777888999',governorate:'صنعاء',district:'بني مطر',address:'منطقة زراعية - بني مطر',hangars_count:2,length_m:80,width_m:12,height_m:3.2,ventilation_type:'tunnel',target_density_birds_m2:12,estimated_capacity_birds:11520,equipment_items:['شفاطات','خلايا تبريد','سقايات نبل','معالف أوتوماتيك'],equipment_gaps:['مولد احتياطي يحتاج صيانة'],image_urls:[],video_urls:[],media_quality_status:'needs_review',rent_mode:'per_cycle',asking_price_yer:1400000,advance_payment_percent:30,platform_commission_percent:5,platform_commission_yer:70000,admin_review_status:'pending_review',published:false,contact_released:false,ai_assessment_note:'تقدير السعة مبني على المساحة وكثافة إدارية قابلة للتعديل. اعتماد الإعلان النهائي يتطلب مراجعة الصور والمعدات من الإدارة.'
    }
  ],
  lease_escrow_contracts_v17: [
    {id:'lease-contract-demo',contract_number:'LEC-2026-DEMO',listing_id:'lease-list-demo',lessor_name:'مؤجر تجريبي',lessee_name:'مستأجر تجريبي',start_date:'2026-09-20',end_date:'2026-11-01',rent_value_yer:1200000,platform_commission_yer:60000,collection_method:'first_payment_escrow',first_payment_yer:360000,platform_received_yer:360000,owner_net_yer:300000,penalty_clause_summary:'بنود الجزاء والتعويض تُراجع قانونياً وتُعتمد قبل التوقيع؛ لا تُنشأ تلقائياً من الذكاء الاصطناعي.',legal_review_status:'required',lessor_signed:true,lessee_signed:true,platform_signed:true,contact_release_allowed:true,status:'active'}
  ],
  approved_supplement_protocols_v17: [
    {id:'supp-hot-001',name:'بروتوكول دعم حراري - فيتامينات/إلكتروليتات معتمد',supplement_type:'electrolyte',climate:'hot',min_age_days:1,max_age_days:45,approved_dose_text:'استخدم الجرعة المسجلة في المنتج والمعتمدة في بروتوكول الطبيب/الشركة؛ لا يغيّر الذكاء الاصطناعي الجرعة.',administration_window:'الصباح الباكر أو المساء مع مياه نظيفة، حسب اعتماد الطبيب والمنتج.',approved_by_vet:'الاستشاري المسؤول',active:true,customer_note:'الدعم الغذائي لا يعالج مرضاً ولا يستبدل التشخيص. عند النفوق أو المرض تُحال الحالة للطبيب.'},
    {id:'supp-general-001',name:'بروتوكول دعم عام معتمد',supplement_type:'vitamin',climate:'any',min_age_days:1,max_age_days:70,approved_dose_text:'وفق ملصق المنتج والبروتوكول المعتمد من الطبيب.',administration_window:'حسب برنامج المزرعة المعتمد.',approved_by_vet:'الاستشاري المسؤول',active:true,customer_note:'المساعد يشرح التوقيت والهدف فقط ويعرض الجرعة المعتمدة، ولا يبتكر جرعات.'}
  ]

,
  v18_config: {
    default_outbreak_radius_km: 15,
    max_outbreak_radius_km: 20,
    require_vet_signature_before_lab_release: true,
    require_full_payment_or_finance_guarantee_before_release: true,
    chick_default_lab_reserve_percent: 2,
    chick_default_feed_reserve_percent: 6,
    chick_default_emergency_reserve_percent: 2,
    feed_reorder_days: 3,
    ai_uses_admin_standards_only: true,
    ai_may_create_medical_decision: false,
    market_forecast_requires_admin_approval: true,
    tele_vet_enabled: true
  },
  assigned_vet_farms_v18: [
    { id:'avf-001', farm_id:'farm-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', customer_name:'عميل تجريبي', customer_phone:'777123456', governorate:'صنعاء', district:'بني حشيش', vet_id:'vet-sanaa-01', vet_name:'الطبيب المناوب - صنعاء', vet_phone:'777000301', active:true, assigned_at:'2026-09-15T09:00:00+03:00' },
    { id:'avf-002', farm_id:'farm-aden-01', farm_name:'مزرعة عدن النموذجية', customer_name:'عميل عدن', customer_phone:'777222111', governorate:'عدن', district:'دار سعد', vet_id:'vet-aden-01', vet_name:'طبيب منطقة عدن', vet_phone:'777000311', active:true, assigned_at:'2026-09-15T09:15:00+03:00' }
  ],
  sample_tracking_v18: [
    {
      id:'sample-v18-001', tracking_number:'LAB-TRACK-260915-001', case_id:'clinical-demo-001', farm_id:'farm-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', customer_name:'عميل تجريبي', customer_phone:'777123456', assigned_vet_id:'vet-sanaa-01', assigned_vet_name:'الطبيب المناوب - صنعاء', assigned_vet_phone:'777000301', laboratory_id:'lab-01', laboratory_name:'مختبر بيطري معتمد - صنعاء', symptoms_summary:'ارتفاع نفوق مع أعراض تنفسية وإسهالات متقطعة', bird_age_days:28, vaccination_history:['نيوكاسل يوم 7','جمبورو يوم 14'], field_notes:'انخفاض علف وارتفاع استهلاك ماء خلال 24 ساعة.', preliminary_ai_summary:'ملف الحالة مكتمل للفرز؛ يلزم فحص مخبري قبل أي قرار علاجي نهائي.', test_reason:'استبعاد عدوى بكتيرية ثانوية وتأكيد التشخيص التفريقي', sample_type:'نافق حديث + مسحات تنفسية', requested_tests:['PCR تنفسي','زراعة بكتيرية وحساسية'], fresh_dead_birds_requested:3, preservation_instructions:'تُحفظ العينة مبردة 2–8°C ولا تُجمّد، وتنقل بأسرع وقت وفق تعليمات المختبر والطبيب.', estimated_result_at:'2026-09-16T18:00:00+03:00', status:'sample_requested', chain_of_custody:['اعتماد طلب الفحص من الطبيب','إصدار رقم التتبع LAB-TRACK-260915-001']
    }
  ],
  hatchery_prices_v18: [
    { id:'hp18-001', date:'2026-09-15', hatchery_name:'فقاسة متعاقدة - صنعاء', strain:'Ross 308', chick_type:'كتكوت لحم عمر يوم', governorate:'صنعاء', price_per_chick_yer:1250, price_per_chick_sar:3.1, available_quantity:48000, delivery_lead_hours:24, published:true, updated_by:'مسؤول المبيعات' },
    { id:'hp18-002', date:'2026-09-15', hatchery_name:'فقاسة متعاقدة - عدن', strain:'Cobb 500', chick_type:'كتكوت لحم عمر يوم', governorate:'عدن', price_per_chick_yer:3500, price_per_chick_sar:3.0, available_quantity:32000, delivery_lead_hours:18, published:true, updated_by:'مسؤول المبيعات' },
    { id:'hp18-003', date:'2026-09-15', hatchery_name:'فقاسة احتياطية - تعز', strain:'Hubbard Classic', chick_type:'كتكوت لحم عمر يوم', governorate:'تعز', price_per_chick_yer:2900, price_per_chick_sar:3.2, available_quantity:15000, delivery_lead_hours:30, published:true, updated_by:'مسؤول المبيعات' }
  ],
  chick_reservations_v18: [
    { id:'cres18-001', reservation_number:'CHICK-RES-2026-001', created_at:'2026-09-15T20:00:00+03:00', customer_name:'عميل تجريبي', phone:'777123456', farm_id:'farm-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', governorate:'صنعاء', district:'بني حشيش', address:'موقع المزرعة', hatchery_name:'فقاسة متعاقدة - صنعاء', strain:'Ross 308', quantity:10000, requested_delivery_date:'2026-09-18', farm_cleaned:true, biosecurity_closed:true, downtime_days:12, minimum_downtime_days:10, readiness_score:100, readiness_status:'ready', chick_cost_yer:12500000, transport_yer:180000, reserve_lab_yer:250000, reserve_feed_yer:750000, reserve_emergency_yer:250000, total_package_yer:13930000, customer_accepted:false, finance_status:'unpaid', sales_status:'sales_review', notes:'لا يتم إطلاق الكتاكيت قبل تحقق المالية من السداد أو ضمان معتمد.' }
  ],
  breed_regional_standards_v18: [
    { id:'std18-ross-hot-1', strain:'Ross 308', governorate:'الحديدة', climate_zone:'hot', min_age_days:1, max_age_days:7, target_weight_g:185, daily_feed_g_per_bird:24, daily_water_ml_per_bird:52, temperature_c:31, humidity_min:55, humidity_max:70, max_density_birds_m2:24, feed_form:'crumb', vaccination_program_id:'VAC-PROG-ROSS-HOT', preventive_program_note:'برنامج وقائي معتمد إدارياً للمنطقة الحارة؛ لا يتضمن وصف مضادات آلياً.', antibiotic_program_allowed:false, approved_by:'مدير النظام / الاستشاري', version:1, active:true },
    { id:'std18-ross-mod-4', strain:'Ross 308', governorate:'صنعاء', climate_zone:'moderate', min_age_days:22, max_age_days:28, target_weight_g:1500, daily_feed_g_per_bird:116, daily_water_ml_per_bird:230, temperature_c:23.5, humidity_min:50, humidity_max:65, max_density_birds_m2:13, feed_form:'pellet', vaccination_program_id:'VAC-PROG-ROSS-SANAA', preventive_program_note:'معيار منصة داخلي قابل للتعديل من الإدارة فقط.', antibiotic_program_allowed:false, approved_by:'مدير النظام / الاستشاري', version:1, active:true },
    { id:'std18-cobb-hot-4', strain:'Cobb 500', governorate:'عدن', climate_zone:'hot', min_age_days:22, max_age_days:28, target_weight_g:1450, daily_feed_g_per_bird:114, daily_water_ml_per_bird:250, temperature_c:24.5, humidity_min:55, humidity_max:70, max_density_birds_m2:12, feed_form:'pellet', vaccination_program_id:'VAC-PROG-COBB-ADEN', preventive_program_note:'المعيار المعتمد للمناخ الساحلي؛ أي قرار طبي يمر بالطبيب.', antibiotic_program_allowed:false, approved_by:'مدير النظام / الاستشاري', version:1, active:true }
  ],
  farm_performance_v18: [
    { id:'perf18-001', farm_id:'farm-001', flock_id:'flock-101', date:'2026-09-15', age_days:28, birds_alive:18400, average_weight_g:1470, feed_kg:2140, water_liters:4250, mortality_count:18, temperature_c:24.2, humidity_percent:58, fcr:1.55, daily_gain_g:68, target_weight_gap_g:-30, standard_rule_id:'std18-ross-mod-4', standard_feed_kg:2134, standard_water_liters:4232, ai_note:'الاستهلاك قريب من معيار الإدارة؛ راقب النفوق والتنفس واستمر بإدخال القياسات.' }
  ],
  cost_calculator_configs_v18: [
    { id:'cost18-sanaa', governorate:'صنعاء', litter_type:'نشارة', litter_price_per_unit_yer:6500, heater_unit_price_yer:110000, fan_unit_price_yer:165000, feeder_unit_price_yer:18000, drinker_unit_price_yer:14500, chick_price_reference_yer:1250, updated_at:'2026-09-15T20:00:00+03:00' },
    { id:'cost18-aden', governorate:'عدن', litter_type:'تبن', litter_price_per_unit_yer:15000, heater_unit_price_yer:290000, fan_unit_price_yer:430000, feeder_unit_price_yer:47000, drinker_unit_price_yer:39000, chick_price_reference_yer:3500, updated_at:'2026-09-15T20:00:00+03:00' }
  ],
  general_manager_vault_v18: [
    { id:'gmv18-001', full_name:'طبيب استشاري رئيسي', role:'استشاري بيطري', department:'الدعم البيطري', phone:'777000301', whatsapp:'777000301', experience_years:12, hire_date:'2026-01-01', promotion_history:['تعيين استشاري','تكليف رئيس غرفة الاستشاريين'], salary_yer:420000, status:'active', confidential_note:'ملف إداري خاص بالمدير العام.' },
    { id:'gmv18-002', full_name:'مسؤول مالي أول', role:'مدير مالي', department:'المالية', phone:'777000340', whatsapp:'777000340', experience_years:8, hire_date:'2026-02-01', promotion_history:['تعيين مدير مالي'], salary_yer:350000, status:'active' }
  ],
  manager_directives_v18: [
    { id:'dir18-001', created_at:'2026-09-15T21:30:00+03:00', title:'تدقيق تسويات التسويق', body:'مراجعة جميع التسويات المفتوحة قبل اعتماد حوالات العملاء.', target_department:'finance', priority:'high', issued_by:'System Owner', status:'issued' }
  ],
  farm_labor_v18: [
    { id:'labor18-001', worker_name:'عامل مزرعة تجريبي', phone:'777555444', national_id:'ID-DEMO-001', farm_id:'farm-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', recommended_by_vet:'الطبيب المناوب - صنعاء', start_date:'2026-09-01', salary_mode:'monthly', salary_yer:180000, daily_expense_allowance_yer:2500, advances_yer:20000, guarantees:['ضمانة تجارية مسجلة'], doctor_payment_approval_required:false, status:'active' }
  ],
  geo_outbreak_alerts_v18: [
    { id:'geo18-001', disease_name:'اشتباه نيوكاسل', disease_group:'فيروسي', source_case_id:'CASE-2026-001', source_lat:15.3694, source_lng:44.1910, governorate:'صنعاء', district:'بني حشيش', radius_km:15, severity:'high', suspected_farms:3, lab_confirmed:false, created_at:'2026-09-15T18:00:00+03:00', expires_at:'2026-09-22T18:00:00+03:00', nearby_farm_ids:['farm-001'], biosecurity_message:'تنبيه وقائي: رفع الأمان الحيوي، تقييد الحركة غير الضرورية، وتعقيم المركبات والأدوات. لا يعني التنبيه تأكيد المرض.', status:'published' }
  ],
  market_forecasts_v18: [
    { id:'mkt18-sanaa', governorate:'صنعاء', generated_at:'2026-09-15T21:00:00+03:00', horizon_days:30, historical:[
      {date:'2026-08-17',poultry_price_yer:1980,feed_price_yer:24500},{date:'2026-08-24',poultry_price_yer:2020,feed_price_yer:24750},{date:'2026-08-31',poultry_price_yer:2070,feed_price_yer:24900},{date:'2026-09-07',poultry_price_yer:2110,feed_price_yer:25050},{date:'2026-09-15',poultry_price_yer:2150,feed_price_yer:25175}], trend:'up', seasonal_note:'اتجاه قصير الأجل مبني على البيانات التاريخية الداخلية فقط؛ المواسم والعرض والطلب قد تغير الاتجاه.', forecast_min_yer:2080, forecast_max_yer:2280, confidence_percent:64, advisory_note:'يستخدم للتخطيط وليس ضماناً لسعر مستقبلي. قرار الإدخال/البيع يبقى للمستخدم والإدارة.', approved_for_display:true }
  ],
  credit_quality_scores_v18: [
    { id:'score18-farm1', entity_type:'farm', entity_id:'farm-001', entity_name:'مزرعة وادي سبأ النموذجية للدواجن', updated_at:'2026-09-15T21:00:00+03:00', production_score:86, payment_score:82, delivery_score:78, quality_score:88, biosecurity_score:84, composite_score:84, grade:'A', credit_limit_yer:2500000, preferred_terms:'60% مقدم + 40% ضمن عقد وضمانة معتمدة', reasons:['FCR جيد','التزام دفع جيد','أمان حيوي فوق الحد'] },
    { id:'score18-broker1', entity_type:'broker', entity_id:'marketer-001', entity_name:'مكتب تسويق متعاقد - صنعاء', updated_at:'2026-09-15T21:00:00+03:00', production_score:80, payment_score:92, delivery_score:88, quality_score:85, biosecurity_score:75, composite_score:86, grade:'A', preferred_terms:'تسوية خلال يوم', reasons:['سرعة سداد','التزام تحميل مرتفع'] },
    { id:'score18-supplier1', entity_type:'supplier', entity_id:'partner-001', entity_name:'شركة أعلاف متعاقدة', updated_at:'2026-09-15T21:00:00+03:00', production_score:84, payment_score:85, delivery_score:90, quality_score:89, biosecurity_score:80, composite_score:87, grade:'A', reasons:['جودة توريد','التزام موعد','نتائج FCR جيدة'] }
  ],
  integrator_contracts_v18: [
    { id:'int18-001', contract_number:'INT-2026-0001', company_name:'شركة تكامل داجني - نموذج', farm_id:'farm-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', customer_name:'عميل تجريبي', start_date:'2026-09-01', expected_harvest_date:'2026-10-10', chicks_supplied:20000, feed_supplied_kg:48000, medicines_budget_yer:850000, company_buys_full_flock:true, buyback_price_rule:'سعر المنطقة يوم البيع ناقص/زائد معامل الجودة حسب العقد المعتمد', target_fcr:1.58, farmer_bonus_per_kg_yer:25, platform_fee_percent:2, current_feed_consumed_kg:30200, current_live_weight_kg:19400, calculated_fcr:1.557, farmer_estimated_profit_yer:1650000, status:'active' }
  ],
  televet_sessions_v18: [
    { id:'tv18-001', case_id:'clinical-demo-001', farm_id:'farm-001', customer_name:'عميل تجريبي', assigned_vet_name:'الطبيب المناوب - صنعاء', scheduled_at:'2026-09-15T23:00:00+03:00', channel:'video', provider:'webrtc', emergency:true, status:'scheduled', notes:'جلسة استشارة لمراجعة التنفس وصور التشريح؛ القرار الطبي للطبيب.' }
  ],
  feed_replenishment_v18: [
    { id:'feedr18-001', farm_id:'farm-001', flock_id:'flock-101', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', created_at:'2026-09-15T21:20:00+03:00', birds_alive:18400, age_days:28, current_stock_kg:5600, expected_daily_consumption_kg:2134, days_remaining:2.6, reorder_threshold_days:3, recommended_order_kg:10670, preferred_supplier:'شركة أعلاف متعاقدة', status:'reorder_now' }
  ],
  sovereignty_v19: {
    config: {
      enabled:true, daily_inventory_attestation_hour:17, executive_digest_hour:20, mortality_escalation_percent_24h:5,
      require_human_vet_for_medical_decisions:true, require_finance_profit_check_for_new_routes:true, healthy_label_requires_lab_clearance:true,
      enable_offline_field_queue:true, enable_public_qr_verification:true, default_epidemic_radius_km:15, max_epidemic_radius_km:30
    },
    governorates: [
      { id:'gov19-sanaa', name:'صنعاء', code:'SA', status:'active', created_at:'2026-09-16T18:00:00+03:00', notes:'محافظة تشغيلية أساسية' },
      { id:'gov19-ibb', name:'إب', code:'IB', status:'active', created_at:'2026-09-16T18:00:00+03:00' },
      { id:'gov19-taiz', name:'تعز', code:'TA', status:'active', created_at:'2026-09-16T18:00:00+03:00' },
      { id:'gov19-marib', name:'مأرب', code:'MA', status:'active', created_at:'2026-09-16T18:00:00+03:00' }
    ],
    market_offices: [
      { id:'off19-sanaa', governorate:'صنعاء', district:'أمانة العاصمة', name:'مركز صنعاء للتسويق والعمليات', office_type:'platform_office', address:'صنعاء - المركز التشغيلي', phone:'777000901', lat:15.3694, lng:44.1910, status:'active', manager_name:'مدير مكتب صنعاء' },
      { id:'off19-ibb', governorate:'إب', district:'المدينة', name:'مكتب إب للتسويق الداجني', office_type:'marketing_market', address:'إب - السوق المركزي', phone:'777000902', lat:13.9667, lng:44.1833, status:'active', manager_name:'مسؤول تسويق إب' },
      { id:'off19-taiz', governorate:'تعز', district:'القاهرة', name:'نقطة تعز للتجميع والتسويق', office_type:'collection_point', address:'تعز - نقطة التجميع', phone:'777000903', status:'active', manager_name:'مسؤول تعز' },
      { id:'off19-marib', governorate:'مأرب', district:'المدينة', name:'مكتب مأرب للخدمات البيطرية والتسويق', office_type:'platform_office', address:'مأرب - المدينة', phone:'777000904', status:'active', manager_name:'مدير مكتب مأرب' }
    ],
    warehouses: [
      { id:'wh19-sanaa-01', name:'مخزن صنعاء المركزي', owner_name:'شريك تخزين متعاقد', governorate:'صنعاء', district:'أمانة العاصمة', address:'صنعاء - المنطقة اللوجستية', phone:'777004001', cold_chain_capable:true, capacity_label:'لقاحات وأدوية ومستلزمات', contract_id:'whc19-001', status:'active' },
      { id:'wh19-ibb-01', name:'مخزن إب المرشح', owner_name:'مالك مخزن مرشح', governorate:'إب', district:'المدينة', address:'إب - المنطقة التجارية', phone:'777004002', cold_chain_capable:false, capacity_label:'أعلاف ومستلزمات', status:'pending_contract' }
    ],
    warehouse_contracts: [
      { id:'whc19-001', contract_number:'WHC-2026-0001', warehouse_name:'مخزن صنعاء المركزي', owner_name:'شريك تخزين متعاقد', governorate:'صنعاء', district:'أمانة العاصمة', signed_at:'2026-09-16T18:30:00+03:00', valid_until:'2027-09-16', document_reference:'warehouse-contracts/WHC-2026-0001.pdf', status:'approved', approved_by:'System Owner' }
    ],
    freelance_vets: [
      { id:'fv19-ibb1', name:'طبيب ميداني مستقل - إب', phone:'777001101', governorate:'إب', districts:['المدينة','يريم','بعدان'], specialties:['أمراض دواجن','تشريح ميداني'], status:'available', rating:4.7, completed_visits:28, base_reward_yer:35000, negotiated_reward_yer:40000, last_seen_at:'2026-09-17T00:40:00+03:00', identity_verified:true, license_verified:true },
      { id:'fv19-marib1', name:'طبيب ميداني مستقل - مأرب', phone:'777001102', governorate:'مأرب', districts:['المدينة','الوادي'], specialties:['أوبئة','أمان حيوي'], status:'available', rating:4.5, completed_visits:17, base_reward_yer:45000, last_seen_at:'2026-09-17T00:35:00+03:00', identity_verified:true, license_verified:true }
    ],
    partner_branches: [
      { id:'pb19-sanaa-vac', company_name:'شركة لقاحات متعاقدة', category:'vaccines', branch_name:'فرع صنعاء', governorate:'صنعاء', district:'أمانة العاصمة', address:'صنعاء - شارع تجاري', phone:'777002001', lat:15.36, lng:44.20, cold_chain_capable:true, status:'active' },
      { id:'pb19-ibb-med', company_name:'شركة أدوية بيطرية متعاقدة', category:'medicines', branch_name:'فرع إب', governorate:'إب', district:'المدينة', address:'إب - المدينة', phone:'777002002', cold_chain_capable:false, status:'active' },
      { id:'pb19-taiz-feed', company_name:'شركة أعلاف متعاقدة', category:'feed', branch_name:'فرع تعز', governorate:'تعز', district:'القاهرة', address:'تعز - المنطقة الصناعية', phone:'777002003', cold_chain_capable:false, status:'active' },
      { id:'pb19-marib-lab', company_name:'مختبر شريك', category:'laboratory', branch_name:'مختبر مأرب', governorate:'مأرب', district:'المدينة', address:'مأرب - المدينة', phone:'777002004', cold_chain_capable:true, status:'active' }
    ],
    stock_checks: [
      { id:'sc19-001', branch_id:'pb19-sanaa-vac', branch_name:'فرع صنعاء', product_id:'vac-01', product_name:'لقاح نيوكاسل', category:'vaccine', quantity_available:38, unit_label:'أمبول', checked_at:'2026-09-16T17:05:00+03:00', checked_by:'مدير الفرع', check_mode:'daily_attestation', lot_number:'VAC-2609-B', expiry_date:'2026-11-15', cold_chain_ok:true, status:'confirmed' },
      { id:'sc19-002', branch_id:'pb19-ibb-med', branch_name:'فرع إب', product_id:'med-01', product_name:'محلول إلكتروليت بيطري', category:'medicine', quantity_available:120, unit_label:'عبوة', checked_at:'2026-09-16T17:10:00+03:00', checked_by:'مدير الفرع', check_mode:'daily_attestation', status:'confirmed' }
    ],
    alternatives: [
      { id:'alt19-001', requested_product_id:'vac-nd-a', requested_product_name:'لقاح نيوكاسل - مورد A', alternative_product_id:'vac-01', alternative_product_name:'لقاح نيوكاسل - مورد معتمد B', category:'vaccine', scientific_match_basis:'نفس الهدف التحصيني؛ المطابقة النهائية للبرنامج والجرعة تعتمد من الطبيب.', same_governorate:true, branch_id:'pb19-sanaa-vac', branch_name:'فرع صنعاء', available_quantity:38, clinical_equivalence_requires_vet:true, admin_approved:true }
    ],
    logistics_routes: [
      { id:'lr19-001', created_at:'2026-09-16T19:20:00+03:00', customer_name:'عميل تجريبي', governorate:'صنعاء', district:'بني حشيش', requested_product_id:'vac-nd-a', requested_product_name:'لقاح نيوكاسل - مورد A', quantity:4, criticality:'cold_chain_critical', selected_branch_id:'pb19-sanaa-vac', selected_branch_name:'فرع صنعاء', estimated_distance_km:18, stock_check_id:'sc19-001', route_status:'alternative_offered', alternative_id:'alt19-001', decision_reason:'الصنف الأصلي غير متاح؛ يوجد بديل محلي يخضع لاعتماد الطبيب قبل الاستبدال.' }
    ],
    healthy_certificates: [
      { id:'hp19-001', certificate_number:'HPY-2026-0001', farm_id:'farm-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_id:'flock-101', issue_date:'2026-09-16', valid_until:'2026-09-23', lab_verified:true, withdrawal_period_cleared:true, toxin_screen_cleared:true, vet_signed:true, signed_by:'الطبيب البيطري المعتمد', antibiotic_free_claim_allowed:true, toxin_safe_claim_allowed:true, qr_public_code:'HPY:2026:0001:VERIFIED', public_status:'verified', public_summary:'دفعة خضعت للمراجعة البيطرية والفحوص المطلوبة وتم التحقق من فترات السحب وفق السجل المتاح.' }
    ],
    transit_permits: [
      { id:'tp19-001', permit_number:'BIO-TRANS-2026-001', vehicle_plate:'YEM-TRK-001', vehicle_type:'chicks', origin:'صنعاء', destination:'إب', disinfection_verified:true, verified_by:'مشرف الأمان الحيوي', verified_at:'2026-09-16T21:00:00+03:00', health_document_reference:'HPY-2026-0001', issued_at:'2026-09-16T21:10:00+03:00', expires_at:'2026-09-17T21:10:00+03:00', status:'active' }
    ],
    epidemic_signals: [
      { id:'epi19-001', detected_at:'2026-09-16T22:00:00+03:00', governorate:'صنعاء', district:'بني حشيش', disease_group:'تنفسي/فيروسي', evidence_sources:['تقارير ميدانية','صور تشريح','ارتفاع نفوق'], suspected_cases:3, confirmed_cases:0, mortality_signal_percent:4.2, risk_score:72, radius_km:15, forecast_window_hours:72, confidence_percent:68, status:'warning', prevention_message:'رفع الأمان الحيوي وتقليل الحركة ومراجعة الطبيب للحالات المشتبهة. الإشارة ليست تشخيصاً مؤكداً.', requires_vet_review:true }
    ],
    chat_threads: [
      { id:'chat19-001', title:'متابعة هنجر 1 - مزرعة وادي سبأ', farm_id:'farm-001', flock_id:'flock-101', case_id:'clinical-demo-001', participants:['عامل العنبر','المشرف الميداني','الطبيب المناوب'], participant_roles:['worker','supervisor','vet'], priority:'high', status:'active', last_message_at:'2026-09-16T22:15:00+03:00', ai_summary:'هبوط استهلاك العلف مع زيادة بسيطة في النفوق؛ تم طلب صور إضافية ومراجعة التهوية من المشرف والطبيب.', extracted_daily_data:{mortality:18,weight_g:1470,temperature_c:24.2,humidity_percent:58,feed_kg:2140,water_liters:4250,notes:'متابعة تنفس وفرشة'} }
    ],
    chat_messages: [
      { id:'msg19-001', thread_id:'chat19-001', sent_at:'2026-09-16T22:10:00+03:00', sender_name:'عامل العنبر', sender_role:'worker', type:'voice', transcript:'النافق اليوم ثمانية عشر والحرارة أربع وعشرون تقريباً والعلف أقل قليلاً من المعتاد.', ai_extracted_fields:['mortality=18','temperature≈24','feed=decreased'], clinician_review_required:false },
      { id:'msg19-002', thread_id:'chat19-001', sent_at:'2026-09-16T22:15:00+03:00', sender_name:'النظام', sender_role:'ai_coordinator', type:'system', text:'تم تجميع المؤشرات وتصعيدها للمشرف والطبيب بسبب تزامن هبوط العلف مع النفوق. لا يوجد قرار علاجي آلي.', ai_extracted_fields:['escalation=vet_review'], clinician_review_required:true }
    ],
    emergency_consultations: [
      { id:'ec19-001', created_at:'2026-09-16T22:16:00+03:00', case_id:'clinical-demo-001', thread_id:'chat19-001', reason:'ارتفاع مؤشر الخطورة وتجمع إشارات تنفسية', mortality_24h_percent:4.2, severity:'high', assigned_consultants:['الاستشاري الرئيسي'], status:'acknowledged', human_final_decision_required:true }
    ],
    hatcheries: [
      { id:'hat19-001', name:'فقاسة متعاقدة - صنعاء', governorate:'صنعاء', district:'أمانة العاصمة', address:'صنعاء', phone:'777003001', strains:['Ross 308','Cobb 500'], status:'active', daily_price_owner:'طبيب التسويق', quality_score:92 },
      { id:'hat19-002', name:'فقاسة متعاقدة - إب', governorate:'إب', district:'المدينة', address:'إب', phone:'777003002', strains:['Ross 308'], status:'active', daily_price_owner:'طبيب التسويق - إب', quality_score:88 }
    ],
    chick_marketing_prices: [
      { id:'cmp19-001', date:'2026-09-16', hatchery_id:'hat19-001', hatchery_name:'فقاسة متعاقدة - صنعاء', strain:'Ross 308', age_label:'عمر يوم', governorate:'صنعاء', price_yer_old:1250, price_yer_new:3300, price_sar:3.1, available_quantity:48000, freight_yer:180000, expected_margin_yer:420000, finance_verified_profitable:true, updated_by:'طبيب التسويق', published:true }
    ],
    financial_documents: [
      { id:'fd19-001', document_number:'RCPT-2026-001', created_at:'2026-09-16T20:00:00+03:00', type:'receipt', counterparty:'عميل تجريبي', reference:'CHICK-RES-2026-001', currency:'YER_OLD', gross_amount:13930000, platform_commission:420000, net_amount:13510000, status:'issued', created_by:'المالية' }
    ],
    proof_of_delivery: [
      { id:'pod19-001', shipment_reference:'SHIP-CHICK-001', office_id:'off19-ibb', office_name:'مكتب إب للتسويق الداجني', product_type:'chicks', expected_quantity:10000, status:'awaiting_arrival' }
    ],
    financial_policy: [
      { id:'fp19-chicks', scope:'chicks', profit_mode:'fixed_per_unit', profit_value:35, currency:'YER_OLD', active:true, approved_by:'System Owner', updated_at:'2026-09-16T20:30:00+03:00' },
      { id:'fp19-feed', scope:'feed', profit_mode:'percent', profit_value:4.5, currency:'YER_OLD', active:true, approved_by:'System Owner', updated_at:'2026-09-16T20:30:00+03:00' },
      { id:'fp19-transport', scope:'transport', profit_mode:'percent', profit_value:8, currency:'YER_OLD', active:true, approved_by:'System Owner', updated_at:'2026-09-16T20:30:00+03:00' }
    ],
    fx_rates: [
      { id:'fx19-1', pair:'SAR_YER_OLD', rate:140, effective_at:'2026-09-16T20:00:00+03:00', source_label:'إدخال الإدارة', status:'approved', approved_by:'System Owner' },
      { id:'fx19-2', pair:'SAR_YER_NEW', rate:535, effective_at:'2026-09-16T20:00:00+03:00', source_label:'إدخال الإدارة', status:'approved', approved_by:'System Owner' }
    ],
    escrow_contracts: [
      { id:'esc19-001', contract_number:'ESC-2026-001', category:'chicks', party_a:'المزرعة', party_b:'الفقاسة المتعاقدة', gross_amount:13930000, currency:'YER_OLD', held_amount:13930000, release_conditions:['تأكيد جاهزية المزرعة','تأكيد التحميل','إثبات الوصول POD'], approvals:['المالية'], status:'funded' }
    ],
    digital_twins: [
      { id:'dt19-001', farm_name:'مزرعة وادي سبأ النموذجية للدواجن', flock_id:'flock-101', generated_at:'2026-09-16T22:30:00+03:00', age_days:28, birds_alive:18400, temperature_c:24.2, humidity_percent:58, ventilation_index:76, feed_kg_day:2140, current_weight_g:1470, current_fcr:1.55, predicted_weight_10d_g:2105, predicted_fcr_10d:1.62, projected_feed_saving_kg:420, projected_margin_delta_yer:185000, recommendation:'محاكاة إرشادية: تحسين استقرار التهوية وتقليل تذبذب الحرارة قد يخفض الهدر. يعتمد أي تعديل تشغيلي على المشرف والطبيب.', confidence_percent:73 }
    ],
    dynamic_pricing: [
      { id:'dp19-001', generated_at:'2026-09-16T22:40:00+03:00', governorate:'صنعاء', category:'live_poultry', current_price:2150, suggested_price:2205, currency:'YER_OLD', demand_index:74, supply_index:61, transport_index:52, fx_index:48, expected_margin_percent:11.8, status:'draft', explanation:'زيادة الطلب النسبي مع عرض متوسط؛ السعر المقترح يحتاج اعتماد الإدارة قبل النشر.' }
    ],
    investment_signals: [
      { id:'inv19-001', generated_at:'2026-09-16T22:45:00+03:00', governorate:'مأرب', category:'chicks_ross308', forecast_days:30, demand_gap_percent:22, recommended_allocation_percent:18, rationale:'الطلبات والحجوزات التاريخية تشير إلى فجوة عرض محتملة؛ التوصية تخطيطية وليست ضماناً للطلب.', confidence_percent:66, status:'advisory' }
    ],
    voice_sessions: [
      { id:'voice19-001', created_at:'2026-09-16T22:10:00+03:00', speaker_name:'عامل العنبر', role:'worker', dialect:'yemeni_arabic', transcript:'النافق اليوم ثمانية عشر والحرارة أربع وعشرون تقريباً والعلف أقل قليلاً من المعتاد.', extracted_intent:'daily_flock_update', extracted_fields:['mortality','temperature','feed_trend'], linked_thread_id:'chat19-001', status:'processed' }
    ],
    executive_issues: [
      { id:'issue19-001', created_at:'2026-09-16T22:20:00+03:00', category:'epidemic', title:'إشارة وبائية مرتفعة - بني حشيش', summary:'تجمعت 3 حالات مشتبهة مع ارتفاع مؤشر النفوق. تم التصعيد للاستشاري مع إبقاء القرار الطبي بشرياً.', severity:'high', owner:'CEO / Veterinary Command', status:'open', executive_action_required:false },
      { id:'issue19-002', created_at:'2026-09-16T22:25:00+03:00', category:'supply_crisis', title:'مخزون لقاح منخفض - صنعاء', summary:'المخزون المؤكد قريب من حد إعادة الطلب؛ يوجد بديل محلي معتمد إدارياً ويحتاج مطابقة الطبيب.', severity:'high', owner:'Supply Chain', status:'acknowledged', executive_action_required:false }
    ]
  },
  platform_core_v19_5: INITIAL_PLATFORM_CORE_V195,
  enterprise_core_v19_6: buildEnterpriseCoreV196(INITIAL_PLATFORM_CORE_V195),
  managed_operations_v19_7: buildManagedPoultryOperationsV197(
    INITIAL_PLATFORM_CORE_V195,
    buildEnterpriseCoreV196(INITIAL_PLATFORM_CORE_V195)
  ),
  v20_core: buildV20State(),
  enterprise_web_v20_2: buildEnterpriseWebStateV202(undefined, 'DEVELOPMENT'),
  enterprise_foundation_v20_2_1: buildEnterpriseFoundationV2021(),
  veterinary_field_v20_2_2: buildVeterinaryFieldStateV2022(),
  multi_business_v20_2_3: buildMultiBusinessEnterpriseStateV2023(),
  feed_factory_v20_2_4: buildFeedFactoryOperationsStateV2024(),
  workforce_payroll_v20_2_5: buildWorkforcePayrollStateV2025(),
  executive_intelligence_v20_2_6: buildExecutiveIntelligenceStateV2026(),
  windows_completion_v20_2_7: buildWindowsCompletionStateV2027(),
  farm_division_v20_2_9: buildFarmDivisionStateV2029()

};
