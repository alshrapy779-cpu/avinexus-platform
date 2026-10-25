import { SmartOperationsState } from '../types';
import { INITIAL_ENTERPRISE_V11 } from './enterpriseV11Data';
import { buildManagedPoultryOperationsV197 } from '../modules/managed/ManagedPoultryOperationsV19_7';

export const INITIAL_SMART_OPERATIONS: SmartOperationsState = {
  exchange_rates: {
    sar_to_yer_old: 140,
    sar_to_yer_new: 425,
    last_updated: '2026-09-15 00:30',
    updated_by: 'المدير العام'
  },
  governorate_currency_rules: [
    { id: 'cur-01', governorate: 'صنعاء', currency_mode: 'YER_OLD_SAR', active: true },
    { id: 'cur-02', governorate: 'ذمار', currency_mode: 'YER_OLD_SAR', active: true },
    { id: 'cur-03', governorate: 'إب', currency_mode: 'YER_OLD_SAR', active: true },
    { id: 'cur-04', governorate: 'الحديدة', currency_mode: 'YER_OLD_SAR', active: true },
    { id: 'cur-05', governorate: 'عدن', currency_mode: 'YER_NEW_SAR', active: true },
    { id: 'cur-06', governorate: 'تعز', currency_mode: 'YER_NEW_SAR', active: true },
    { id: 'cur-07', governorate: 'لحج', currency_mode: 'YER_NEW_SAR', active: true },
    { id: 'cur-08', governorate: 'حضرموت', currency_mode: 'YER_NEW_SAR', active: true },
    { id: 'cur-09', governorate: 'مأرب', currency_mode: 'YER_NEW_SAR', active: true }
  ],
  zone_service_prices: [
    {
      id: 'zone-01', governorate: 'صنعاء', district: 'بني حشيش', currency_mode: 'YER_OLD_SAR',
      transport_fee_yer: 12000, field_visit_fee_yer: 30000, marketing_fee_yer: 15000, transport_cost_yer: 0, field_visit_cost_yer: 0, marketing_cost_yer: 0,
      last_updated: '2026-09-15', status: 'active', branch_id: 'br-01', branch_name: 'فرع صنعاء المركزي',
      branch_address: 'العنوان يحدد من الإدارة', delivery_eta_hours: 4
    },
    {
      id: 'zone-02', governorate: 'ذمار', district: 'قاع جهران', currency_mode: 'YER_OLD_SAR',
      transport_fee_yer: 18000, field_visit_fee_yer: 42000, marketing_fee_yer: 18000, transport_cost_yer: 0, field_visit_cost_yer: 0, marketing_cost_yer: 0,
      last_updated: '2026-09-15', status: 'active', branch_name: 'نقطة توزيع ذمار',
      branch_address: 'العنوان يحدد من الإدارة', delivery_eta_hours: 6
    },
    {
      id: 'zone-03', governorate: 'إب', district: 'وادي السحول', currency_mode: 'YER_OLD_SAR',
      transport_fee_yer: 20000, field_visit_fee_yer: 45000, marketing_fee_yer: 20000, transport_cost_yer: 0, field_visit_cost_yer: 0, marketing_cost_yer: 0,
      last_updated: '2026-09-15', status: 'active', branch_name: 'نقطة توزيع إب',
      branch_address: 'العنوان يحدد من الإدارة', delivery_eta_hours: 7
    },
    {
      id: 'zone-04', governorate: 'عدن', district: 'المنصورة', currency_mode: 'YER_NEW_SAR',
      transport_fee_yer: 35000, field_visit_fee_yer: 85000, marketing_fee_yer: 40000, transport_cost_yer: 0, field_visit_cost_yer: 0, marketing_cost_yer: 0,
      last_updated: '2026-09-15', status: 'active', branch_id: 'br-02', branch_name: 'فرع عدن',
      branch_address: 'العنوان يحدد من الإدارة', delivery_eta_hours: 3
    }
  ],
  chick_prices: [
    {
      id: 'chick-01',
      date: '2026-09-15',
      chick_type: 'لاحم',
      strain: 'Ross 308',
      company_name: 'مفرخ وطني معتمد - صنعاء',
      price_per_chick_sar: 3.7,
      price_per_chick_yer_old: 518,
      price_per_chick_yer_new: 1573,
      market_trend: 'مستقر',
      image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=85',
      notes: 'سعر استرشادي يخضع لاعتماد الإدارة اليومي.'
    },
    {
      id: 'chick-02',
      date: '2026-09-15',
      chick_type: 'لاحم',
      strain: 'Cobb 500',
      company_name: 'مفرخ تجاري معتمد - ذمار',
      price_per_chick_sar: 3.5,
      price_per_chick_yer_old: 490,
      price_per_chick_yer_new: 1488,
      market_trend: 'صاعد',
      image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=85'
    },
    {
      id: 'chick-03',
      date: '2026-09-15',
      chick_type: 'لاحم',
      strain: 'Hubbard Classic',
      company_name: 'مفرخ تجاري معتمد - إب',
      price_per_chick_sar: 3.4,
      price_per_chick_yer_old: 476,
      price_per_chick_yer_new: 1445,
      market_trend: 'مستقر',
      image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=85',
      notes: 'سعر الكتكوت الواحد؛ الكمية النهائية والتوفر يؤكدان عند الطلب.'
    },
    {
      id: 'chick-04',
      date: '2026-09-15',
      chick_type: 'بياض',
      strain: 'Hy-Line Brown',
      company_name: 'مفرخ بياض معتمد',
      price_per_chick_sar: 5.2,
      price_per_chick_yer_old: 728,
      price_per_chick_yer_new: 2210,
      market_trend: 'مستقر',
      image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=85',
      notes: 'كتاكيت بياض؛ السعر للوحدة ويخضع لتأكيد توفر الدفعة.'
    }
  ],
  credit_accounts: [
    {
      id: 'credit-01',
      customer_id: 'farm-01',
      customer_name: 'أحمد صالح العنسي',
      phone: '777-123456',
      credit_limit_yer: 500000,
      current_debt_yer: 185000,
      due_date: '2026-09-25',
      status: 'within_limit',
      updated_at: '2026-09-15 00:15'
    },
    {
      id: 'credit-02',
      customer_id: 'farm-02',
      customer_name: 'محمد عبد الله القيسي',
      phone: '771-987654',
      credit_limit_yer: 300000,
      current_debt_yer: 322000,
      due_date: '2026-09-14',
      status: 'blocked_over_limit',
      updated_at: '2026-09-15 00:15'
    },
    {
      id: 'credit-03',
      customer_id: 'farm-03',
      customer_name: 'فؤاد هزاع الشرعبي',
      phone: '733-456789',
      credit_limit_yer: 400000,
      current_debt_yer: 365000,
      due_date: '2026-09-20',
      status: 'near_limit',
      updated_at: '2026-09-15 00:15'
    }
  ],
  debt_ledger: [
    {
      id: 'debt-01',
      credit_account_id: 'credit-01',
      date: '2026-09-10',
      type: 'debit',
      category: 'أعلاف',
      amount_yer: 250000,
      reference: 'FEED-ORD-1021',
      due_date: '2026-09-25',
      status: 'open',
      notes: 'توريد آجل جزئي.'
    },
    {
      id: 'debt-02',
      credit_account_id: 'credit-01',
      date: '2026-09-13',
      type: 'payment',
      category: 'أعلاف',
      amount_yer: 65000,
      reference: 'PAY-9011',
      status: 'settled'
    },
    {
      id: 'debt-03',
      credit_account_id: 'credit-02',
      date: '2026-09-03',
      type: 'debit',
      category: 'أدوية',
      amount_yer: 322000,
      reference: 'MED-ORD-441',
      due_date: '2026-09-14',
      status: 'overdue'
    }
  ],
  emergency_requests: [
    {
      id: 'emg-01',
      created_at: '2026-09-15 00:05',
      customer_name: 'محمد عبد الله القيسي',
      phone: '771-987654',
      farm_id: 'farm-02',
      farm_name: 'مزارع الجنات للدواجن اللاحمة',
      flock_id: 'flock-102',
      governorate: 'ذمار',
      district: 'قاع جهران',
      gps: { lat: 14.582, lng: 44.401 },
      mortality_today: 68,
      symptoms_summary: 'ارتفاع مفاجئ في النافق مع علامات تنفسية وانخفاض استهلاك الماء.',
      image_urls: [],
      priority: 'red_emergency',
      assigned_staff_id: 'stf-003',
      assigned_staff_name: 'م. نشوان هادي الظاهري',
      status: 'assigned'
    }
  ],
  ratings: [
    {
      id: 'rating-01',
      created_at: '2026-09-12',
      rater_name: 'الإدارة العامة',
      target_type: 'customer',
      target_id: 'farm-01',
      target_name: 'أحمد صالح العنسي',
      rating: 4.8,
      category: 'الالتزام بالأمان الحيوي',
      note: 'ملتزم بالسجلات اليومية وإجراءات التطهير.',
      admin_only: true
    },
    {
      id: 'rating-02',
      created_at: '2026-09-13',
      rater_name: 'أحمد صالح العنسي',
      target_type: 'staff',
      target_id: 'stf-001',
      target_name: 'الطبيب البيطري الاستشاري المعتمد',
      rating: 5,
      category: 'سرعة الاستجابة',
      note: 'تمت مراجعة الحالة بسرعة وتحويلها لمسار الطبيب.',
      admin_only: false
    }
  ],
  notifications: [
    {
      id: 'not-01',
      created_at: '2026-09-15 00:35',
      title: 'تحديث بورصة الدواجن والأعلاف',
      body: 'تم تحديث أسعار السوق اليومية. راجع الأسعار قبل تقديم الطلب.',
      audience: 'all_customers',
      type: 'price_update',
      priority: 'normal',
      sent: true
    },
    {
      id: 'not-02',
      created_at: '2026-09-15 00:40',
      title: 'تنبيه وقائي',
      body: 'يرجى رفع مستوى الأمان الحيوي ومراقبة التهوية والرطوبة في المنطقة.',
      audience: 'governorate',
      target_value: 'ذمار',
      type: 'outbreak_alert',
      priority: 'critical',
      sent: true
    }
  ],
  purchase_requests: [],
  branches: [
    { id: 'br-01', name: 'فرع صنعاء المركزي', governorate: 'صنعاء', district: 'أمانة العاصمة', address: 'العنوان يحدد من الإدارة', market_name: 'مركز التوزيع الرئيسي', phone: '777000001', active: true, notes: 'بيانات تجريبية قابلة للتعديل من الإدارة.' },
    { id: 'br-02', name: 'فرع عدن', governorate: 'عدن', district: 'المنصورة', address: 'العنوان يحدد من الإدارة', market_name: 'مركز توزيع عدن', phone: '777000002', active: true, notes: 'بيانات تجريبية قابلة للتعديل من الإدارة.' }
  ],
  payment_accounts: [
    { id: 'pay-01', provider: 'الكريمي', account_name: 'حساب المنصة - تجريبي', account_number: 'يُحدد من الإدارة', currency: 'YER', active: true, instructions: 'حوّل المبلغ ثم ارفع صورة إشعار الحوالة ليتم اعتمادها من المالية.' },
    { id: 'pay-02', provider: 'جيب', account_name: 'محفظة المنصة - تجريبي', account_number: 'يُحدد من الإدارة', currency: 'YER', active: true, instructions: 'استخدم رقم المحفظة المعتمد الظاهر في التطبيق فقط.' },
    { id: 'pay-03', provider: 'الكريمي', account_name: 'حساب سعودي - تجريبي', account_number: 'يُحدد من الإدارة', currency: 'SAR', active: true, instructions: 'للدفع بالريال السعودي حسب سعر الصرف المعتمد.' }
  ],
  payment_verifications: [],
  supervision_packages: [
    { id: 'svc-01', name: 'إشراف ومتابعة أساسية', description: 'متابعة تشغيلية للقطيع مع مراجعة المؤشرات والتنبيهات حتى التسويق.', base_fee_yer: 25000, per_hangar_fee_yer: 12000, per_1000_birds_fee_yer: 1500, includes: ['متابعة العلف والماء', 'متابعة الحرارة والرطوبة والتهوية', 'تنبيهات الأمان الحيوي', 'متابعة حتى التسويق'], active: true },
    { id: 'svc-02', name: 'إشراف بيطري ميداني متكامل', description: 'إشراف موسع يشمل النزول الميداني وتنسيق اللقاحات والعلاجات المعتمدة ومتابعة الأداء.', base_fee_yer: 55000, per_hangar_fee_yer: 22000, per_1000_birds_fee_yer: 2500, includes: ['نزول ميداني', 'متابعة اللقاحات', 'تنسيق العلاجات مع الطبيب', 'متابعة الأعلاف', 'متابعة حتى التسويق'], active: true }
  ],
  supervision_requests: [],
  clinical_cases: [],
  job_applications: [],
  necropsy_guides: [
    { id: 'guide-01', organ_name: 'الأعوران', disease_groups: ['طفيلي/كوكسيديا'], instructions: 'صوّر الأعورين كاملين ثم افتحهما طولياً بإضاءة جيدة، مع إظهار أي دم أو محتوى غير طبيعي.', approved_by_admin: false },
    { id: 'guide-02', organ_name: 'الأمعاء الدقيقة', disease_groups: ['طفيلي/كوكسيديا','بكتيري'], instructions: 'صوّر الأمعاء من الخارج ثم جزءاً مفتوحاً يوضح الغشاء والمحتوى.', approved_by_admin: false },
    { id: 'guide-03', organ_name: 'القصبة الهوائية', disease_groups: ['ميكوبلازما/تنفسي','فيروسي'], instructions: 'افتح القصبة طولياً وصوّر البطانة والمخاط أو النزف إن وجد.', approved_by_admin: false },
    { id: 'guide-04', organ_name: 'الأكياس الهوائية', disease_groups: ['ميكوبلازما/تنفسي','بكتيري'], instructions: 'صوّر الأكياس الهوائية قبل لمسها، مع التركيز على الشفافية أو العتامة والترسبات.', approved_by_admin: false },
    { id: 'guide-05', organ_name: 'الكبد والقلب', disease_groups: ['بكتيري','ميكوبلازما/تنفسي'], instructions: 'صوّر الكبد والقلب والأغشية المحيطة بهما دون تنظيف مفرط.', approved_by_admin: false },
    { id: 'guide-06', organ_name: 'المعدة الغدية', disease_groups: ['فيروسي','فطري/سموم'], instructions: 'افتح المعدة الغدية طولياً وصوّر الحلمات وأي نزف واضح.', approved_by_admin: false },
    { id: 'guide-07', organ_name: 'غدة البرسا', disease_groups: ['فيروسي'], instructions: 'صوّر البرسا في موضعها ثم بعد فتحها، مع بيان الحجم واللون وأي نزف.', approved_by_admin: false },
    { id: 'guide-08', organ_name: 'الكبد', disease_groups: ['فطري/سموم','طفيلي/كوكسيديا'], instructions: 'صوّر سطح الكبد وحوافه وأي تغير لون أو بقع أو تضخم.', approved_by_admin: false }
  ],
  laboratories: [
    { id: 'lab-01', name: 'مختبر بيطري معتمد - صنعاء', governorate: 'صنعاء', district: 'أمانة العاصمة', address: 'العنوان التفصيلي يدار من لوحة الإدارة', phone: '777100001', tests: ['زراعة بكتيرية وحساسية', 'PCR حسب التوفر', 'فحص طفيليات'], sample_collection_fee_yer: 15000, base_test_price_yer: 30000, turnaround_hours: 24, active: true },
    { id: 'lab-02', name: 'مختبر بيطري معتمد - عدن', governorate: 'عدن', district: 'المنصورة', address: 'العنوان التفصيلي يدار من لوحة الإدارة', phone: '777100002', tests: ['زراعة وحساسية', 'فحوص تشخيصية أساسية'], sample_collection_fee_yer: 35000, base_test_price_yer: 65000, turnaround_hours: 36, active: true }
  ],
  integrations: {
    fcm: {
      enabled: false,
      project_id: '',
      sender_id: '',
      default_topic: 'all-customers',
      connection_status: 'not_configured',
      backend_endpoint: '',
      note: 'يتم ربط FCM من الخادم فقط. لا تحفظ مفاتيح الخدمة السرية داخل تطبيق Android.'
    },
    payment_providers: [
      { id: 'int-pay-kuraimi', provider: 'الكريمي', enabled: true, mode: 'manual_verification', connection_status: 'configured', note: 'الوضع الحالي: تحويل يدوي + رفع صورة الحوالة + اعتماد المالية. يتحول إلى API عند توفر واجهة رسمية.' },
      { id: 'int-pay-jeep', provider: 'جيب', enabled: true, mode: 'manual_verification', connection_status: 'configured', note: 'الوضع الحالي: تحقق يدوي من الحوالة. بيانات API السرية تحفظ في الخادم فقط.' }
    ],
    auth_security: {
      provider: 'local_prototype',
      backend_rbac_enforced: false,
      require_mfa_for_admins: true,
      session_timeout_minutes: 30,
      max_failed_login_attempts: 5,
      require_strong_passwords: true,
      audit_login_events: true,
      connection_status: 'not_configured',
      note: 'واجهة الصلاحيات موجودة؛ التفعيل الآمن النهائي يحتاج مصادقة خادمية وRBAC من الخادم.'
    }
  },
  audit_log: [
    { id: 'audit-001', created_at: '2026-09-15T18:30:00+03:00', actor_name: 'المدير العام', actor_role: 'System Owner', action: 'مراجعة إعدادات التكاملات', module: 'التكاملات والأمان', result: 'success', details: 'تم تجهيز مركز الإدارة لربط الإشعارات والمدفوعات والمصادقة عند توفر الخدمات الخارجية.' },
    { id: 'audit-002', created_at: '2026-09-15T18:32:00+03:00', actor_name: 'النظام', actor_role: 'Automation', action: 'فحص مسار الحوالات', module: 'المالية', result: 'success', details: 'مسار رفع الإثبات واعتماد المالية مفعل في النموذج التشغيلي.' }
  ],
  approval_workflows: {
    price_changes_require_approval: true,
    exchange_rate_changes_require_approval: true,
    zone_fee_changes_require_approval: true,
    payment_account_changes_require_approval: true,
    antibiotic_override_requires_vet: true,
    high_value_payment_threshold_yer: 1000000,
    high_value_payment_requires_second_approver: true
  },
  backup_sync: {
    offline_mode_enabled: true,
    auto_sync_enabled: true,
    pending_sync_items: 0,
    last_sync_at: '2026-09-15T18:25:00+03:00',
    backup_destination_label: 'لم يتم ربط مخزن نسخ احتياطي بعد',
    backup_status: 'warning'
  },
  notification_templates: [
    { id: 'tpl-price', name: 'تحديث الأسعار اليومية', category: 'price', title: 'تم تحديث الأسعار اليوم', body: 'تم تحديث أسعار الدواجن والأعلاف والكتاكيت حسب المنطقة. راجع التطبيق قبل تأكيد الطلب.', active: true },
    { id: 'tpl-outbreak', name: 'تنبيه وبائي وقائي', category: 'outbreak', title: 'تنبيه وقائي في منطقتك', body: 'تم رصد نشاط مرضي في المنطقة. ارفع مستوى الأمان الحيوي وراقب القطيع وأبلغ عن أي أعراض غير طبيعية.', active: true },
    { id: 'tpl-payment', name: 'استلام حوالة للمراجعة', category: 'payment', title: 'تم استلام إثبات الحوالة', body: 'تم إرسال صورة الحوالة إلى المالية، وسيتم تأكيد وصول المبلغ قبل تجهيز الطلب.', active: true },
    { id: 'tpl-clinical', name: 'طمأنة العميل أثناء المراجعة', category: 'clinical', title: 'تم استلام حالة القطيع', body: 'تم جمع بيانات الحالة وإرسالها للطبيب أو المشرف المداوم. حافظ على التهوية والماء واتبع إجراءات الأمان الحيوي حتى يصلك الرد المعتمد.', active: true }
  ],
  system_health: [
    { id: 'health-ui', service_name: 'تطبيق العميل ولوحة الإدارة', category: 'frontend', status: 'healthy', last_checked_at: '2026-09-15T18:35:00+03:00', note: 'واجهة النموذج جاهزة محلياً.' },
    { id: 'health-api', service_name: 'Backend API', category: 'backend', status: 'not_connected', note: 'يحتاج نشر server/API على HTTPS.' },
    { id: 'health-db', service_name: 'قاعدة البيانات المركزية', category: 'database', status: 'not_connected', note: 'النموذج الحالي يستخدم بيانات محلية ومحاكاة.' },
    { id: 'health-fcm', service_name: 'Firebase Cloud Messaging', category: 'notifications', status: 'not_connected', note: 'يتم تفعيله من مركز التكاملات بعد تجهيز Firebase والخادم.' },
    { id: 'health-pay', service_name: 'واجهات الدفع المباشر', category: 'payments', status: 'warning', note: 'التحقق اليدوي بالحوالة يعمل؛ API المباشر ينتظر واجهات رسمية.' },
    { id: 'health-storage', service_name: 'تخزين الصور والملفات', category: 'storage', status: 'warning', note: 'الرفع يعمل كنموذج محلي/مؤقت؛ يحتاج تخزين سحابي دائم للإنتاج.' },
    { id: 'health-ai', service_name: 'خدمة الذكاء الاصطناعي', category: 'ai', status: 'warning', note: 'تعمل عند ربط Backend ومفتاح الخدمة بشكل خادمي.' }
  ],
  enterprise: {
    ...INITIAL_ENTERPRISE_V11,
    managed_operations_v19_7: buildManagedPoultryOperationsV197(
      INITIAL_ENTERPRISE_V11.platform_core_v19_5,
      INITIAL_ENTERPRISE_V11.enterprise_core_v19_6
    )
  }
};
