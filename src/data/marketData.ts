import {
  VeterinaryMedicine,
  FeedItem,
  FarmEquipment,
  HangarRental,
  WorkerProfile,
  VaccineProtocolItem,
  PlatformFinancialConfig,
  PartnerCompany,
  SystemUserAccount,
  GovernancePolicy,
  StaffMember,
  PoultryDailyPrice,
  PoultrySaleRequest,
  GuidedNecropsyOrgan,
  DiseaseReportCase,
  PaymentTransactionRecord
} from '../types';

export const INITIAL_COMPANIES: PartnerCompany[] = [
  {
    id: 'comp-001',
    name: 'شركة ابن حيان للتقنية والأدوية البيطرية',
    category: 'أدوية بيطرية',
    governorate: 'أمانة العاصمة صنعاء',
    contact_person: 'د. جمال الحكيمي',
    phone: '+967 777 441 223',
    email: 'info@ibnhayyan-vet.ye',
    contract_number: 'YEM-MED-2026-08',
    contract_start_date: '2026-01-01',
    contract_end_date: '2027-01-01',
    contract_status: 'ساري',
    regional_commission_percent: 8.0,
    portal_permission: 'self_service_with_approval',
    active: true,
    products_count: 14,
    total_volume_yer: 42500000,
    contract_document_name: 'عقد_شراكة_ابن_حيان_المعتمد_2026.pdf',
    notes: 'وكيل معتمد ومطابق لاشتراطات فترات السحب، يوفر أصناف إنروكين وتولترازوريل.'
  },
  {
    id: 'comp-002',
    name: 'مختبرات الشرق الأوسط الدوائية البيطرية',
    category: 'أدوية بيطرية',
    governorate: 'محافظة تعز / عدن',
    contact_person: 'د. طارق السروري',
    phone: '+967 733 118 990',
    contract_number: 'YEM-MED-2026-14',
    contract_start_date: '2026-02-15',
    contract_end_date: '2027-02-15',
    contract_status: 'ساري',
    regional_commission_percent: 7.5,
    portal_permission: 'direct_admin_managed',
    active: true,
    products_count: 9,
    total_volume_yer: 28400000,
    contract_document_name: 'وثيقة_مختبرات_الشرق_الأوسط_المعتمدة.pdf',
    notes: 'ملتزمة بضوابط فحص الحساسية المخبرية للمضادات الحيوية واسعة المجال.'
  },
  {
    id: 'comp-003',
    name: 'مطاحن وصوامع الغلال الوطنية (أعلاف سبأ النموذجية)',
    category: 'مطابخ ومصانع أعلاف',
    governorate: 'محافظة الحديدة / صنعاء',
    contact_person: 'م. فؤاد العريقي',
    phone: '+967 771 889 004',
    contract_number: 'YEM-FEED-2025-03',
    contract_start_date: '2025-06-01',
    contract_end_date: '2026-12-31',
    contract_status: 'ساري',
    regional_commission_percent: 4.5,
    portal_permission: 'self_service_with_approval',
    active: true,
    products_count: 6,
    total_volume_yer: 89000000,
    contract_document_name: 'بروتوكول_توريد_أعلاف_سبأ_الوطنية.pdf',
    notes: 'مطبخ أعلاف متكامل (بادي 23%، نامي 21%، ناهي 19%) مع شهادات فحص سموم فطرية دورية.'
  },
  {
    id: 'comp-004',
    name: 'مؤسسة تهامة لتجهيز مزارع الدواجن والأنظمة الآلية',
    category: 'معدات ومستلزمات',
    governorate: 'محافظة ذمار / صنعاء',
    contact_person: 'المهندس نشوان الظاهري',
    phone: '+967 770 556 122',
    contract_number: 'YEM-EQP-2026-21',
    contract_start_date: '2026-03-01',
    contract_end_date: '2027-03-01',
    contract_status: 'ساري',
    regional_commission_percent: 6.0,
    portal_permission: 'direct_admin_managed',
    active: true,
    products_count: 11,
    total_volume_yer: 18500000,
    contract_document_name: 'اتفاقية_توريد_وصيانة_معدات_تهامة.pdf',
    notes: 'توريد دفايات ديزل أوتوماتيكية، شفاطات مخروطية، وشبكات نيبل مع ضمان وصيانة محلية.'
  },
  {
    id: 'comp-005',
    name: 'وكالة سيفا أنيمال هيلث (CEVA Yemen Agency)',
    category: 'وكلاء لقاحات',
    governorate: 'أمانة العاصمة صنعاء',
    contact_person: 'د. سامي الأصبحي',
    phone: '+967 774 332 110',
    contract_number: 'YEM-VAC-2026-02',
    contract_start_date: '2026-01-10',
    contract_end_date: '2027-01-10',
    contract_status: 'ساري',
    regional_commission_percent: 5.0,
    portal_permission: 'self_service_with_approval',
    active: true,
    products_count: 8,
    total_volume_yer: 31200000,
    contract_document_name: 'ترخيص_سلسلة_التبريد_وتوريد_اللقاحات_سيفا.pdf',
    notes: 'وكيل حصري معتمد يضمن سلسلة التبريد (+2°C إلى +8°C) وتحصينات الجمبورو والنيوكاسل.'
  }
];

export const INITIAL_SYSTEM_USERS: SystemUserAccount[] = [
  {
    id: 'usr-001',
    name: 'الطبيب البيطري الاستشاري المعتمد',
    role: 'طبيب بيطري استشاري',
    governorate: 'أمانة العاصمة صنعاء',
    phone: '+967 777 123 456',
    national_id: '100293847',
    status: 'نشط ومعتمد',
    cases_or_cycles_count: 142,
    rating: 5.0,
    created_date: '2025-01-01'
  },
  {
    id: 'usr-002',
    name: 'د. عادل الشراعي',
    role: 'طبيب بيطري استشاري',
    governorate: 'محافظة ذمار / صنعاء',
    phone: '+967 779 881 224',
    national_id: '100482910',
    status: 'نشط ومعتمد',
    cases_or_cycles_count: 89,
    rating: 4.9,
    created_date: '2025-03-15'
  },
  {
    id: 'usr-003',
    name: 'مزرعة البركة النموذجية (الحاج قاسم الهتار)',
    role: 'مربي / صاحب مزرعة',
    governorate: 'محافظة ذمار',
    phone: '+967 772 334 551',
    status: 'نشط ومعتمد',
    cases_or_cycles_count: 8,
    rating: 4.8,
    created_date: '2025-05-10'
  },
  {
    id: 'usr-004',
    name: 'مزرعة وادي سهام الحديثة',
    role: 'مربي / صاحب مزرعة',
    governorate: 'محافظة الحديدة',
    phone: '+967 733 992 110',
    status: 'نشط ومعتمد',
    cases_or_cycles_count: 6,
    rating: 4.7,
    created_date: '2025-06-20'
  },
  {
    id: 'usr-005',
    name: 'مزرعة الأمل النموذجية (صالح العولقي)',
    role: 'مربي / صاحب مزرعة',
    governorate: 'محافظة لحج',
    phone: '+967 775 009 882',
    status: 'مجمد رقابياً',
    freeze_reason: 'تجاوز فترة سحب دواء إنروكين فورت ومحاولة بيع الطيور دون اعتماد الاستشاري',
    cases_or_cycles_count: 3,
    rating: 2.3,
    created_date: '2025-08-01'
  },
  {
    id: 'usr-006',
    name: 'م. عبد الله سيف المهدي',
    role: 'عامل / مشرف عنبر',
    governorate: 'محافظة ذمار',
    phone: '+967 773 221 445',
    national_id: '109827364',
    status: 'نشط ومعتمد',
    cases_or_cycles_count: 14,
    rating: 4.9,
    created_date: '2025-02-11'
  },
  {
    id: 'usr-007',
    name: 'مختبر الأمان والتشخيص الميكروبي البيطري',
    role: 'مختبر بيطري',
    governorate: 'أمانة العاصمة صنعاء',
    phone: '+967 770 119 228',
    status: 'نشط ومعتمد',
    cases_or_cycles_count: 215,
    rating: 4.95,
    created_date: '2025-01-20'
  }
];

export const INITIAL_POLICIES: GovernancePolicy[] = [
  {
    id: 'pol-001',
    title: 'إلزامية فحص الحساسية (AST Gate) قبل صرف المضادات الحيوية المقيدة',
    category: 'أدوية ومضادات',
    description: 'يُحظر منعاً باتاً إصدار أو صرف أي روشتة مضاد حيوي واسع المجال دون إرفاق تقرير عزل مخبري وحساسية مسبق منعاً لتكوين سلالات مقاومة.',
    active: true,
    enforcement_level: 'إلزامي مشدد',
    last_updated: '2026-09-01'
  },
  {
    id: 'pol-002',
    title: 'حظر كولستين سلفات لأغراض وقائية أو منشطات نمو',
    category: 'أدوية ومضادات',
    description: 'يُمنع استخدام الكوليستين في الأعلاف أو التحصينات الوقائية ويقتصر على الحالات الحرجة بموافقة استشاري بيطري معتمد.',
    active: true,
    enforcement_level: 'إلزامي مشدد',
    last_updated: '2026-08-15'
  },
  {
    id: 'pol-003',
    title: 'قفل الأمان الحيوي: منع تسكين كتاكيت للمزارع أقل من 70% أمان حيوي',
    category: 'أمان حيوي',
    description: 'ربط ترخيص دورة جديدة باجتياز تدقيق الأمان الحيوي الميداني بنسبة لا تقل عن 70% للوقاية من تفشي الأوبئة.',
    active: true,
    enforcement_level: 'إلزامي مشدد',
    last_updated: '2026-07-30'
  },
  {
    id: 'pol-004',
    title: 'حوكمة الذكاء الاصطناعي (Strict Human-in-the-Loop)',
    category: 'ذكاء اصطناعي',
    description: 'الذكاء الاصطناعي يقدم اقتراحات إرشادية وتحليلية فقط، والقرار العلاجي وإقرار الروشتات حكراً على الطبيب الاستشاري البشري.',
    active: true,
    enforcement_level: 'إلزامي مشدد',
    last_updated: '2026-09-10'
  },
  {
    id: 'pol-005',
    title: 'توجيهات وإشراف الطبيب البيطري الاستشاري المعتمد لمكافحة الهدر الغذائي',
    category: 'ذكاء اصطناعي',
    description: 'تطبيق معادلة خسائر معامل التحويل (FCR) وحساب الفاقد المالي بالريال اليمني عند أي انحراف عن منحنى السلالة القياسي.',
    active: true,
    enforcement_level: 'إلزامي مشدد',
    last_updated: '2026-09-12'
  }
];

export const INITIAL_VET_MEDICINES: VeterinaryMedicine[] = [
  {
    id: 'med-001',
    company_id: 'comp-001',
    commercial_name: 'إنروكين فورت 20% (Enroquin Forte)',
    active_ingredient: 'إنروفلوكساسين (Enrofloxacin 200 mg/ml)',
    manufacturer: 'شركة ابن حيان للتقنية البيطرية / وكيل معتمد',
    package_type_size: 'سائل 1 لتر',
    price_yer: 18500,
    withdrawal_period_days: 7,
    sensitivity_test_required: true,
    category: 'مضاد حيوي مقيد',
    in_stock: true,
    indications_ar: 'علاج المايكوبلازما، الكولاي المتفشية، والالتهابات التنفسية المعوية الحادة.',
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'med-002',
    company_id: 'comp-002',
    commercial_name: 'كوليستين ماكس (Colistin Max 4.8 MIU)',
    active_ingredient: 'كوليستين سلفات (Colistin Sulphate 4,800,000 IU/g)',
    manufacturer: 'مختبرات الشرق الأوسط الدوائية',
    package_type_size: 'بودرة 1 كجم',
    price_yer: 24000,
    withdrawal_period_days: 5,
    sensitivity_test_required: true,
    category: 'مضاد حيوي مقيد',
    in_stock: true,
    indications_ar: 'مطهر معوي واسع المجال لعلاج الإشريكية القولونية والسالمونيلا.',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'med-003',
    company_id: 'comp-002',
    commercial_name: 'أموكسي فيت 50% (Amoxi-Vet)',
    active_ingredient: 'أموكسيسيللين ترايهيدرات (Amoxicillin 500 mg/g)',
    manufacturer: 'الشركة العربية للأدوية البيطرية',
    package_type_size: 'بودرة 1 كجم',
    price_yer: 31000,
    withdrawal_period_days: 4,
    sensitivity_test_required: true,
    category: 'مضاد حيوي مقيد',
    in_stock: true,
    indications_ar: 'علاج التهابات الجهاز التنفسي والتهاب الأمعاء النخري والتسمم الدموي.',
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'med-004',
    company_id: 'comp-001',
    commercial_name: 'تولترازوريل كوكستوب (CoxStop 2.5%)',
    active_ingredient: 'تولترازوريل (Toltrazuril 25 mg/ml)',
    manufacturer: 'باير للأدوية البيطرية / وكيل صنعاء',
    package_type_size: 'سائل 1 لتر',
    price_yer: 29500,
    withdrawal_period_days: 8,
    sensitivity_test_required: false,
    category: 'مضاد كوكسيديا',
    in_stock: true,
    indications_ar: 'العلاج الجذري لكوكسيديا الأمعاء والأعورين (إيميريا تينيلا ونيكاتريكس).',
    image_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'med-005',
    company_id: 'comp-001',
    commercial_name: 'فيتامين أد3هـ + سيلينيوم (Bio-VITA AD3E + Se)',
    active_ingredient: 'Vit A 100,000 IU + Vit D3 20,000 IU + Vit E 20 mg + Sodium Selenite',
    manufacturer: 'أفيكو الدولية (AVICO)',
    package_type_size: 'سائل 1 لتر',
    price_yer: 12000,
    withdrawal_period_days: 0,
    sensitivity_test_required: false,
    category: 'فيتامينات وروافع مناعة',
    in_stock: true,
    indications_ar: 'رفع الكفاءة المناعية بعد التحصين، مكافحة الإجهاد الحراري، وتنشيط النمو.',
    image_url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'med-006',
    company_id: 'comp-001',
    commercial_name: 'توكسين بايندر سوبر (Toxin Binder Plus)',
    active_ingredient: 'خمائر نشطة + سيليكات ألومنيوم مميعة + أحماض عضوية',
    manufacturer: 'مؤسسة الدواجن الحديثة',
    package_type_size: 'بودرة 5 كجم',
    price_yer: 26000,
    withdrawal_period_days: 0,
    sensitivity_test_required: false,
    category: 'مضاد سموم فطرية',
    in_stock: true,
    indications_ar: 'امتصاص وتثبيط السموم الفطرية (الأفلاتوكسين والـ T-2) وحماية وظائف الكبد.',
    image_url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'med-007',
    company_id: 'comp-002',
    commercial_name: 'مطهر تي إتش فور بلس (TH4+ Virucidal)',
    active_ingredient: 'مركبات الأمونيوم الرباعية + الجلوترالدهيد 12%',
    manufacturer: 'سوجيفال الفرنسية / وكالة اليمن',
    package_type_size: 'سائل 5 لتر',
    price_yer: 45000,
    withdrawal_period_days: 0,
    sensitivity_test_required: false,
    category: 'مطهرات ومعقمات',
    in_stock: true,
    indications_ar: 'تطهير العنابر ومغطس الأقدام ورش الهواء لمكافحة فيروس النيوكاسل والإنفلونزا.',
    image_url: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=500&q=80'
  }
];

export const INITIAL_FEEDS: FeedItem[] = [
  {
    id: 'feed-001',
    company_id: 'comp-003',
    feed_name: 'بادي سوبر تسمين 23% بروتين (حبيبات مكرومة)',
    stage: 'بادي',
    manufacturer: 'مطاحن ومصانع صنعاء الوطنية للأعلاف',
    protein_percent: 23.0,
    energy_kcal_per_kg: 3050,
    price_bag_50kg_yer: 19500,
    price_ton_yer: 390000,
    available_in_regions: ['صنعاء', 'ذمار', 'عمران', 'إب'],
    digestibility_rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'feed-002',
    company_id: 'comp-003',
    feed_name: 'نامي بريميوم 21% بروتين (حبيبات كبس 3 ملم)',
    stage: 'نامي',
    manufacturer: 'مجموعة هائل سعيد أنعم - أعلاف السعيد',
    protein_percent: 21.0,
    energy_kcal_per_kg: 3150,
    price_bag_50kg_yer: 18800,
    price_ton_yer: 376000,
    available_in_regions: ['تعز', 'الحديدة', 'إب', 'صنعاء'],
    digestibility_rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'feed-003',
    company_id: 'comp-003',
    feed_name: 'ناهي اقتصادي 19% بروتين (معدل تحويل قياسي)',
    stage: 'ناهي',
    manufacturer: 'مجمع ذمار التنموي للإنتاج الداجني',
    protein_percent: 19.0,
    energy_kcal_per_kg: 3200,
    price_bag_50kg_yer: 18200,
    price_ton_yer: 364000,
    available_in_regions: ['ذمار', 'البيضاء', 'صنعاء'],
    digestibility_rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'feed-004',
    company_id: 'comp-003',
    feed_name: 'مركز تسمين نباتي 5% فائق التركيز (بروتين 40%)',
    stage: 'مركزات',
    manufacturer: 'شركة تهامة للأعلاف والمركزات',
    protein_percent: 40.0,
    energy_kcal_per_kg: 2400,
    price_bag_50kg_yer: 48000,
    price_ton_yer: 960000,
    available_in_regions: ['الحديدة', 'حجة', 'صنعاء'],
    digestibility_rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'feed-005',
    company_id: 'comp-003',
    feed_name: 'إضافات إنزيمات هضم ومحفزات فلورا الأمعاء',
    stage: 'إضافات أعلاف',
    manufacturer: 'شركة كيميفيت الدنماركية / استيراد مباشر',
    protein_percent: 12.0,
    energy_kcal_per_kg: 1800,
    price_bag_50kg_yer: 35000,
    price_ton_yer: 700000,
    available_in_regions: ['كافة المحافظات'],
    digestibility_rating: 5.0,
    image_url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=500&q=80'
  }
];

export const INITIAL_EQUIPMENT: FarmEquipment[] = [
  {
    id: 'eq-001',
    company_id: 'comp-004',
    category: 'دفايات',
    model_name: 'دفاية ديزل توربو هوائية أوتوماتيكية 50KW',
    brand_manufacturer: 'Master Climate Solutions (إيطاليا)',
    condition: 'جديد',
    unit_price_yer: 650000,
    specifications: 'قدرة 50 كيلو واط، تدفق هواء 1500 م3/ساعة، ثيرموستات رقمي دقيق لمنع التذبذب الحراري في التحضين.',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    warranty_months: 12
  },
  {
    id: 'eq-002',
    company_id: 'comp-004',
    category: 'شبكات سقي',
    model_name: 'خط حلمات نبل أوتوماتيكية ستانلس ستيل 360 درجة',
    brand_manufacturer: 'Lubing Germany الأصلية',
    condition: 'جديد',
    unit_price_yer: 480000,
    specifications: 'شبكة متكاملة لطول 80 متراً، مانعة لتسريب المياه لتقليل رطوبة الفرشة، منظم ضغط أمامي ومقياس مدرج.',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    warranty_months: 24
  },
  {
    id: 'eq-003',
    company_id: 'comp-004',
    category: 'معالف',
    model_name: 'خط معالف أوتوماتيكي حلزوني بان فيدر (Pan Feeder)',
    brand_manufacturer: 'Roxell Belgium / صيانة وكيل',
    condition: 'مستعمل',
    unit_price_yer: 320000,
    specifications: 'طول 65 متراً يشمل 60 طبق علف مانع للهدر بمستشعر علف في نهاية الخط ومحرك إيطالي 1 حصان بحالة ممتازة.',
    image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80',
    warranty_months: 3
  },
  {
    id: 'eq-004',
    company_id: 'comp-004',
    category: 'شفاطات',
    model_name: 'شفاط مخروطي عملاق 140 سم (Cone Fan 54 inch)',
    brand_manufacturer: 'Gigola & Riccardi محرك Siemens',
    condition: 'جديد',
    unit_price_yer: 280000,
    specifications: 'تدفق 44,000 م3/ساعة، ريش ستانلس ستيل 430 مقاومة للأمونيا، نظام فتح الشتر الأوتوماتيكي المركزي.',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
    warranty_months: 12
  },
  {
    id: 'eq-005',
    company_id: 'comp-004',
    category: 'خلايا تبريد',
    model_name: 'ألواح تبريد سليلوزية كرتونية كرافت (Cooling Pad 15cm)',
    brand_manufacturer: 'Munters سويسرا',
    condition: 'جديد',
    unit_price_yer: 45000,
    specifications: 'سماكة 15 سم، زاوية ترطيب 45/15 لخفض الحرارة حتى 10 درجات مئوية مع الحفاظ على كفاءة التهوية.',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    warranty_months: 6
  },
  {
    id: 'eq-006',
    company_id: 'comp-004',
    category: 'لوحات تحكم',
    model_name: 'لوحة التحكم المناخي المتطورة لمزارع الدواجن SmartFarm V4',
    brand_manufacturer: 'Fancom Agro / تجميع وطني معتمد',
    condition: 'جديد',
    unit_price_yer: 890000,
    specifications: 'حساسات حرارة ورطوبة وضغط استاتيكي، تشغيل مرحلي للشفاطات، إنذار انقطاع الكهرباء عبر SMS ورسائل صوتية.',
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    warranty_months: 24
  }
];

export const INITIAL_HANGAR_RENTALS: HangarRental[] = [
  {
    id: 'hangar-001',
    title: 'عنبر تسمين مغلق حديث ومتكامل (صنعاء - بني مطر)',
    governorate: 'محافظة صنعاء',
    district: 'مديرية بني مطر (قرب خط الحديدة)',
    location_details: 'موقع معزول ومحصن بيئياً وفق اشتراطات الأمان الحيوي على بعد 4 كم من أقرب مزرعة.',
    images: [
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
    ],
    length_meters: 80,
    width_meters: 12,
    total_area_m2: 960,
    capacity_birds: 12000,
    rental_price_yer: 850000,
    rental_term: 'للدورة',
    amenities: {
      automatic_control_panel: true,
      water_well: true,
      solar_power_system: true,
      worker_housing: true,
      backup_generator: true
    },
    contact_phone: '+967 771 234 567',
    advertiser_name: 'الحاج عبد الرقيب السراجي',
    is_verified_farm: true
  },
  {
    id: 'hangar-002',
    title: 'مزرعة نموذجية عنبرين مغلقين مع حوش مسور (ذمار - معبر)',
    governorate: 'محافظة ذمار',
    district: 'قاع معبر الزراعي',
    location_details: 'موقع استراتيجي في بيئة باردة مثالية لتحقيق أفضل معامل تحويل غذائي FCR صيفاً.',
    images: [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80'
    ],
    length_meters: 100,
    width_meters: 14,
    total_area_m2: 1400,
    capacity_birds: 18000,
    rental_price_yer: 1400000,
    rental_term: 'للدورة',
    amenities: {
      automatic_control_panel: true,
      water_well: true,
      solar_power_system: true,
      worker_housing: true,
      backup_generator: true
    },
    contact_phone: '+967 777 889 900',
    advertiser_name: 'المهندس فاروق العنسي',
    is_verified_farm: true
  },
  {
    id: 'hangar-003',
    title: 'عنبر نصف مغلق نظيف للتشغيل الفوري (إب - ميتم)',
    governorate: 'محافظة إب',
    district: 'منطقة ميتم الزراعية',
    location_details: 'قريب من مصادر التوريد، شبكة مياه جيدة، ومستودع علف معزول ومحمي من القوارض.',
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
    ],
    length_meters: 60,
    width_meters: 10,
    total_area_m2: 600,
    capacity_birds: 6500,
    rental_price_yer: 290000,
    rental_term: 'شهرياً',
    amenities: {
      automatic_control_panel: false,
      water_well: true,
      solar_power_system: true,
      worker_housing: true,
      backup_generator: true
    },
    contact_phone: '+967 733 445 566',
    advertiser_name: 'أبو يحيى الصبري',
    is_verified_farm: false
  }
];

export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'worker-001',
    full_name: 'أحمد صالح عبد الله البرطي',
    national_id: '01020304051',
    birth_date: '1989-04-12',
    age: 35,
    id_card_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    experience_years: 12,
    professional_level: 'محترف',
    phone: '+967 770 112 233',
    current_residence: 'محافظة صنعاء / مستعد للتنقل في ذمار وإب',
    specialization_role: 'مشرف عنبر',
    previous_cycles_history: [
      {
        cycle_year: '2023 - 2024',
        farm_name: 'مزرعة الوادي النموذجي (3 دورات)',
        breed: 'Ross 308',
        flock_size: 15000,
        mortality_rate_percent: 2.8,
        fcr_achieved: 1.49,
        evaluator_vet_notes: 'التزام حديدي بإجراءات الأمان الحيوي ومراقبة استهلاك العلف اليومي بدقة متناهية.'
      },
      {
        cycle_year: '2022',
        farm_name: 'مزارع سبأ الحديثة (دورتان)',
        breed: 'Cobb 500',
        flock_size: 12000,
        mortality_rate_percent: 3.1,
        fcr_achieved: 1.52,
        evaluator_vet_notes: 'مهارة استثنائية في إدارة التدفئة خلال الأسبوع الأول من التحضين.'
      }
    ],
    biosecurity_training_certified: true,
    status: 'متاح للعمل فوراً'
  },
  {
    id: 'worker-002',
    full_name: 'عمار مهدي حمود الريمي',
    national_id: '02030405062',
    birth_date: '1995-08-20',
    age: 29,
    id_card_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    experience_years: 7,
    professional_level: 'متوسط',
    phone: '+967 733 998 877',
    current_residence: 'محافظة الحديدة / باجل',
    specialization_role: 'فني تهوية وتبريد',
    previous_cycles_history: [
      {
        cycle_year: '2023',
        farm_name: 'منشأة تهامة الداجنة',
        breed: 'Hubbard Classic',
        flock_size: 10000,
        mortality_rate_percent: 3.4,
        fcr_achieved: 1.55,
        evaluator_vet_notes: 'خبير في ضبط ضغط الهواء الاستاتيكي وخلايا التبريد صيفاً.'
      }
    ],
    biosecurity_training_certified: true,
    status: 'متاح للعمل فوراً'
  },
  {
    id: 'worker-003',
    full_name: 'بشير يحيى ناصر الحصامي',
    national_id: '03040506073',
    birth_date: '1992-02-15',
    age: 32,
    id_card_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    experience_years: 9,
    professional_level: 'محترف',
    phone: '+967 775 664 433',
    current_residence: 'محافظة ذمار / عنس',
    specialization_role: 'مربي متخصص تحضين',
    previous_cycles_history: [
      {
        cycle_year: '2023 - 2024',
        farm_name: 'مزارع البركة المركزية',
        breed: 'Ross 308',
        flock_size: 20000,
        mortality_rate_percent: 2.2,
        fcr_achieved: 1.47,
        evaluator_vet_notes: 'سجل تحضين استثنائي؛ معدل نفوق الأسبوع الأول لم يتجاوز 0.5%.'
      }
    ],
    biosecurity_training_certified: true,
    status: 'مرتبط بدورة حالية'
  }
];

export const INITIAL_VACCINE_PROTOCOLS: VaccineProtocolItem[] = [
  {
    id: 'vac-001',
    company_id: 'comp-005',
    vaccine_name_strain: 'Newcastle disease (B1 / CVI) + IB H120',
    disease_targeted: 'النيوكاسل والالتهاب الشعبي المعدي (ND + IB)',
    recommended_age_days: 1,
    administration_route: 'تقطير بالعين',
    manufacturer_country: 'Intervet MSD (هولندا)',
    price_dose_vial_yer: 9500,
    doses_per_vial: 1000,
    temperature_storage_celsius: '+2°C إلى +8°C',
    critical_precautions: 'التأكد من إذابة اللقاح في محلول مبرد خاص وتقطير نقطة كاملة في عين الصوص والتأكد من بلعها.',
    mandatory_national: true,
    image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'vac-002',
    company_id: 'comp-005',
    vaccine_name_strain: 'Gumboro Intermediate (D78 / MB)',
    disease_targeted: 'مرض الجمبورو (التهاب كيس فابريشيا IBD)',
    recommended_age_days: 8,
    administration_route: 'ماء شرب',
    manufacturer_country: 'Boehringer Ingelheim (ألمانيا)',
    price_dose_vial_yer: 8800,
    doses_per_vial: 1000,
    temperature_storage_celsius: '+2°C إلى +8°C',
    critical_precautions: 'تعطيش الطيور لساعتين مسبقاً، وإضافة حليب مجفف خالي الدسم بمعدل 2 جم/لتر لحماية العترة من الكلور.',
    mandatory_national: true,
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'vac-003',
    company_id: 'comp-005',
    vaccine_name_strain: 'Newcastle LaSota Clone 30',
    disease_targeted: 'النيوكاسل التنشيطي (ND Booster)',
    recommended_age_days: 14,
    administration_route: 'ماء شرب',
    manufacturer_country: 'Ceva Santé Animale (فرنسا)',
    price_dose_vial_yer: 9200,
    doses_per_vial: 1000,
    temperature_storage_celsius: '+2°C إلى +8°C',
    critical_precautions: 'توزيع مياه اللقاح بالتساوي واستهلاك كامل الكمية خلال 90 إلى 120 دقيقة كحد أقصى.',
    mandatory_national: true,
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'vac-004',
    company_id: 'comp-005',
    vaccine_name_strain: 'Gumboro Plus Intermediate (228E)',
    disease_targeted: 'الجمبورو التنشيطي للعترات الشديدة الضراوة',
    recommended_age_days: 19,
    administration_route: 'ماء شرب',
    manufacturer_country: 'Hipra (إسبانيا)',
    price_dose_vial_yer: 10500,
    doses_per_vial: 1000,
    temperature_storage_celsius: '+2°C إلى +8°C',
    critical_precautions: 'فحص عيار المناعة الأمية والتأكد من خلو القطيع من أي مشاكل تنفسية أو معوية وقت التحصين.',
    mandatory_national: true,
    image_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'vac-005',
    company_id: 'comp-005',
    vaccine_name_strain: 'Avian Influenza H9N2 Inactivated (لقاح زيتي ميت)',
    disease_targeted: 'إنفلونزا الطيور قليلة الضراوة (H9N2)',
    recommended_age_days: 10,
    administration_route: 'حقن',
    manufacturer_country: 'Merial / Boehringer (ألمانيا)',
    price_dose_vial_yer: 22000,
    doses_per_vial: 1000,
    temperature_storage_celsius: '+2°C إلى +8°C (ممنوع التجميد)',
    critical_precautions: 'الحقن تحت جلد الرقبة 0.2 مل لكل طائر باستخدام إبر معقمة وتدفئة الزجاجة لدرجة حرارة الغرفة قبل الحقن.',
    mandatory_national: false,
    image_url: 'https://images.unsplash.com/photo-1583912267550-d44d9c968f30?auto=format&fit=crop&w=500&q=80'
  }
];

export const INITIAL_FINANCIAL_CONFIG: PlatformFinancialConfig = {
  vet_consultation_commission_percent: 10.0,
  marketplace_sales_commission_percent: 5.0,
  rental_brokerage_commission_percent: 3.5,
  feed_profit_per_bag_yer: 350,
  feed_profit_per_ton_yer: 7000,
  medicine_profit_mode: 'percent',
  medicine_profit_fixed_amount_yer: 1500,
  total_gross_volume_yer: 195600000,
  total_platform_net_profit_yer: 11425000,
  active_users_count: 1420,
  frozen_accounts_count: 3,
  monthly_gross_breakdown: {
    medicines: 42500000,
    feeds: 89000000,
    equipment: 18500000,
    rentals: 29400000,
    consultations: 16200000
  },
  transactions: [
    {
      id: 'tx-001',
      date: '2026-09-14',
      type: 'عمولة استشارة بيطرية',
      farm_or_user_name: 'مزرعة البركة الحديثة',
      company_name: 'الاستشاري د. عادل الشراعي',
      gross_amount_yer: 35000,
      platform_commission_yer: 3500,
      status: 'مكتمل',
      reference_id: 'RX-2026-09-001'
    },
    {
      id: 'tx-002',
      date: '2026-09-13',
      type: 'رسوم وساطة تأجير عنابر',
      farm_or_user_name: 'عنبر بني مطر (المستأجر: منيف الحميري)',
      company_name: 'وساطة منصة السيادة البيطرية',
      gross_amount_yer: 850000,
      platform_commission_yer: 29750,
      status: 'مكتمل',
      reference_id: 'HNG-RENT-001'
    },
    {
      id: 'tx-003',
      date: '2026-09-12',
      type: 'عمولة مبيعات معدات وأعلاف',
      farm_or_user_name: 'توريد 20 طن علف بادي 23%',
      company_name: 'مطاحن وصوامع الغلال الوطنية (أعلاف سبأ)',
      gross_amount_yer: 7800000,
      platform_commission_yer: 390000,
      status: 'مكتمل',
      reference_id: 'PO-FEED-7712'
    },
    {
      id: 'tx-004',
      date: '2026-09-11',
      type: 'عمولة بيع دواء بيطري',
      farm_or_user_name: 'صرف 10 عبوات تولترازوريل كوكستوب',
      company_name: 'شركة ابن حيان للتقنية البيطرية',
      gross_amount_yer: 295000,
      platform_commission_yer: 23600,
      status: 'مستحق للشركة',
      reference_id: 'MED-ORD-8819'
    },
    {
      id: 'tx-005',
      date: '2026-09-10',
      type: 'عمولة توريد لقاحات',
      farm_or_user_name: 'توريد 15 ألف جرعة نيوكاسل كلون 30',
      company_name: 'وكالة سيفا أنيمال هيلث (CEVA)',
      gross_amount_yer: 247500,
      platform_commission_yer: 12375,
      status: 'مكتمل',
      reference_id: 'VAC-ORD-3301'
    },
    {
      id: 'tx-006',
      date: '2026-09-09',
      type: 'رسوم توثيق جواز السفر QR',
      farm_or_user_name: 'مسلخ الأمانة الآلي (دفعة 15,000 طائر)',
      company_name: 'منظومة الجواز الرقمي والتتبع',
      gross_amount_yer: 50000,
      platform_commission_yer: 50000,
      status: 'مكتمل',
      reference_id: 'PASSPORT-QR-902'
    },
    {
      id: 'tx-007',
      date: '2026-09-08',
      type: 'عمولة مبيعات معدات وأعلاف',
      farm_or_user_name: 'دفايات ديزل أوتوماتيك 80KW عدد 2',
      company_name: 'مؤسسة تهامة لتجهيز المزارع',
      gross_amount_yer: 1700000,
      platform_commission_yer: 102000,
      status: 'مستحق للشركة',
      reference_id: 'EQP-SALE-441'
    }
  ]
};

// ====================================================
// الكوادر والمشرفين المعتمدين (Staff & Cadres)
// ====================================================
export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'stf-001',
    name: 'الطبيب البيطري الاستشاري المعتمد',
    role: 'طبيب بيطري استشاري',
    governorate: 'أمانة العاصمة صنعاء',
    assigned_districts: ['بني الحارث', 'معين', 'السبعين', 'سنحان'],
    phone: '+967 777 123 456',
    email: 'vet.consultant@smart-poultry.local',
    national_id: '100293847',
    specialization: 'استشاري أول أمراض الدواجن والسيادة البيطرية ومطابقة FCR',
    status: 'نشط',
    permissions: {
      can_issue_prescriptions: true,
      can_order_field_visits: true,
      can_manage_prices: true,
      can_view_financials: true,
      can_freeze_accounts: true
    },
    active_cases_count: 32,
    rating: 5.0,
    join_date: '2024-01-01', is_online: true, on_duty: true, last_seen_at: 'الآن'
  },
  {
    id: 'stf-002',
    name: 'د. عبد الجليل القدسي',
    role: 'طبيب بيطري استشاري',
    governorate: 'محافظة تعز',
    assigned_districts: ['صالة', 'المظفر', 'التعزية', 'دمنة خدير'],
    phone: '+967 771 998 877',
    national_id: '103847562',
    specialization: 'تشخيص ميداني وتشريح وبائي لأمراض الجهاز التنفسي',
    status: 'نشط',
    permissions: {
      can_issue_prescriptions: true,
      can_order_field_visits: true,
      can_manage_prices: false,
      can_view_financials: false,
      can_freeze_accounts: false
    },
    active_cases_count: 19,
    rating: 4.88,
    join_date: '2025-03-10', is_online: true, on_duty: true, last_seen_at: 'الآن'
  },
  {
    id: 'stf-003',
    name: 'م. نشوان هادي الظاهري',
    role: 'مدير منطقة',
    governorate: 'محافظة ذمار',
    assigned_districts: ['عنس', 'معبر', 'مغرب عنس', 'ميفعة عنس'],
    phone: '+967 775 332 211',
    national_id: '104928374',
    specialization: 'إدارة العمليات الميدانية والرقابة على مزارع قاع معبر',
    status: 'نشط',
    permissions: {
      can_issue_prescriptions: false,
      can_order_field_visits: true,
      can_manage_prices: true,
      can_view_financials: true,
      can_freeze_accounts: true
    },
    active_cases_count: 14,
    rating: 4.92,
    join_date: '2025-01-15', is_online: true, on_duty: true, last_seen_at: 'الآن'
  },
  {
    id: 'stf-004',
    name: 'د. سمير أحمد الخولاني',
    role: 'طبيب بيطري استشاري',
    governorate: 'محافظة الحديدة',
    assigned_districts: ['باجل', 'بيت الفقيه', 'الزهرة', 'المراوعة'],
    phone: '+967 733 665 544',
    national_id: '105829103',
    specialization: 'إدارة الإجهاد الحراري وأمراض الجهاز الهضمي والسموم الفطرية',
    status: 'نشط',
    permissions: {
      can_issue_prescriptions: true,
      can_order_field_visits: true,
      can_manage_prices: false,
      can_view_financials: false,
      can_freeze_accounts: false
    },
    active_cases_count: 11,
    rating: 4.8,
    join_date: '2025-04-01', is_online: false, on_duty: false, last_seen_at: 'منذ ساعتين'
  },
  {
    id: 'stf-005',
    name: 'أ. رضوان حمود الشامي',
    role: 'مدير مالي ومحاسب',
    governorate: 'أمانة العاصمة صنعاء',
    assigned_districts: ['كافة المحافظات - إدارة العمولات والتحصيلات'],
    phone: '+967 770 443 322',
    national_id: '102938475',
    specialization: 'إدارة التسويات المالية مع بنك الكريمي ومحفظة جيب وحسابات الشركات',
    status: 'نشط',
    permissions: {
      can_issue_prescriptions: false,
      can_order_field_visits: false,
      can_manage_prices: false,
      can_view_financials: true,
      can_freeze_accounts: false
    },
    active_cases_count: 48,
    rating: 4.95,
    join_date: '2024-06-01', is_online: true, on_duty: true, last_seen_at: 'الآن'
  }
];

// ====================================================
// جدول أسعار الدواجن اليومية بحسب المنطقة والوزن (Daily Prices)
// ====================================================
export const INITIAL_POULTRY_PRICES: PoultryDailyPrice[] = [
  {
    id: 'prc-001',
    governorate: 'أمانة العاصمة ومحافظة صنعاء',
    date: '2026-09-14',
    weight_category: 'مثالي (1.3 - 1.8 كجم)',
    farmgate_price_per_kg_yer: 2450,
    consumer_price_per_kg_yer: 2750,
    market_trend: 'مستقر',
    notes: 'الطلب متوازن والوفرة كافية في أسواق التوزيع المركزية.'
  },
  {
    id: 'prc-002',
    governorate: 'أمانة العاصمة ومحافظة صنعاء',
    date: '2026-09-14',
    weight_category: 'ثقيل (أكثر من 1.8 كجم)',
    farmgate_price_per_kg_yer: 2350,
    consumer_price_per_kg_yer: 2600,
    market_trend: 'مستقر',
    notes: 'يفضله المطاعم ومحلات الشواية.'
  },
  {
    id: 'prc-003',
    governorate: 'أمانة العاصمة ومحافظة صنعاء',
    date: '2026-09-14',
    weight_category: 'خفيف (أقل من 1.3 كجم)',
    farmgate_price_per_kg_yer: 2550,
    consumer_price_per_kg_yer: 2900,
    market_trend: 'صاعد',
    notes: 'طلب عالي من محلات التجزئة.'
  },
  {
    id: 'prc-004',
    governorate: 'محافظة الحديدة',
    date: '2026-09-14',
    weight_category: 'مثالي (1.3 - 1.8 كجم)',
    farmgate_price_per_kg_yer: 2380,
    consumer_price_per_kg_yer: 2650,
    market_trend: 'هابط',
    notes: 'انخفاض طفيف نتيجة وفرة الإمدادات من مزارع الساحل.'
  },
  {
    id: 'prc-005',
    governorate: 'محافظة ذمار',
    date: '2026-09-14',
    weight_category: 'مثالي (1.3 - 1.8 كجم)',
    farmgate_price_per_kg_yer: 2420,
    consumer_price_per_kg_yer: 2700,
    market_trend: 'مستقر',
    notes: 'جودة اللحوم ممتازة ومعدلات التحويل الغذائي مرتفعة.'
  },
  {
    id: 'prc-006',
    governorate: 'محافظة تعز',
    date: '2026-09-14',
    weight_category: 'مثالي (1.3 - 1.8 كجم)',
    farmgate_price_per_kg_yer: 2500,
    consumer_price_per_kg_yer: 2850,
    market_trend: 'صاعد',
    notes: 'زيادة طفيفة نظراً لتكاليف النقل.'
  },
  {
    id: 'prc-007',
    governorate: 'محافظة إب',
    date: '2026-09-14',
    weight_category: 'مثالي (1.3 - 1.8 كجم)',
    farmgate_price_per_kg_yer: 2460,
    consumer_price_per_kg_yer: 2780,
    market_trend: 'مستقر',
    notes: 'طلب مطرد من المطاعم السياحية ومحلات البروست.'
  },
  {
    id: 'prc-008',
    governorate: 'محافظة مأرب',
    date: '2026-09-14',
    weight_category: 'مثالي (1.3 - 1.8 كجم)',
    farmgate_price_per_kg_yer: 2600,
    consumer_price_per_kg_yer: 2950,
    market_trend: 'صاعد',
    notes: 'ارتفاع في الطلب الاستهلاكي.'
  }
];

// ====================================================
// طلبات تسويق الدواجن والمفاوضات (Poultry Sale Requests)
// ====================================================
export const INITIAL_POULTRY_SALE_REQUESTS: PoultrySaleRequest[] = [
  {
    id: 'sale-req-001',
    farmer_name: 'الحاج عبد الرقيب السراجي',
    farm_name: 'مزرعة السراجي النموذجية',
    phone: '+967 771 234 567',
    governorate: 'محافظة صنعاء',
    district: 'بني مطر',
    flock_breed: 'Ross 308',
    bird_count: 8500,
    total_weight_kg: 14450,
    average_weight_kg: 1.7,
    images: [
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80'
    ],
    farmer_requested_price_per_kg: 2600,
    ai_recommended_price_per_kg: 2450,
    ai_total_estimated_value_yer: 35402500,
    status: 'rejected_escalated_to_admin',
    admin_counter_price_per_kg: 2500,
    admin_notes: 'المربي يطلب 2600 ريال؛ متوسط الوزن 1.7 كجم ممتاز، اقترحنا تسوية عند 2500 ريال بحسب تسعيرة اليوم والتفاوض جارٍ.',
    created_at: '2026-09-14 10:30'
  },
  {
    id: 'sale-req-002',
    farmer_name: 'المهندس فاروق العنسي',
    farm_name: 'مزارع قاع معبر الحديثة',
    phone: '+967 777 889 900',
    governorate: 'محافظة ذمار',
    district: 'معبر',
    flock_breed: 'Cobb 500',
    bird_count: 12000,
    total_weight_kg: 21600,
    average_weight_kg: 1.8,
    images: [
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80'
    ],
    farmer_requested_price_per_kg: 2420,
    ai_recommended_price_per_kg: 2420,
    ai_total_estimated_value_yer: 52272000,
    status: 'approved_deal',
    admin_notes: 'وافق المربي على التسعيرة العادلة؛ تم ربط الطلب مع مسلخ الأمانة النموذجي للتحميل غداً.',
    created_at: '2026-09-14 08:15'
  },
  {
    id: 'sale-req-003',
    farmer_name: 'صالح علي الصبري',
    farm_name: 'مزرعة وادي ميتم الداجنة',
    phone: '+967 733 445 566',
    governorate: 'محافظة إب',
    district: 'ميتم',
    flock_breed: 'Hubbard Classic',
    bird_count: 5000,
    total_weight_kg: 7250,
    average_weight_kg: 1.45,
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
    ],
    farmer_requested_price_per_kg: 2550,
    ai_recommended_price_per_kg: 2460,
    ai_total_estimated_value_yer: 17835000,
    status: 'under_review_by_admin',
    admin_notes: 'طلب جديد قيد التقييم من إدارة التسويق.',
    created_at: '2026-09-14 12:40'
  }
];

// ====================================================
// الدليل التشريحي الإرشادي المصور (Guided Necropsy Organs Template)
// ====================================================
export const GUIDED_NECROPSY_ORGANS_TEMPLATE: GuidedNecropsyOrgan[] = [
  {
    id: 'org-caeca',
    organ_key: 'caeca',
    organ_name_ar: 'الأعوران (Caeca)',
    target_diseases_ar: 'الكوكسيديا الأعورية (Eimeria tenella)، داء الرؤوس السوداء، والتهاب الأعورين التجبني',
    guide_description: 'افتح التجويف البطني وتفحص فرعي الأعورين؛ ابحث عن وجود انتفاخ، امتلاء بالدم السائل، أو كتل تجبنية ومخاط مدمم.',
    guide_image_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=500&q=80',
    suspicion_level: 'سليم طبيعي'
  },
  {
    id: 'org-proventriculus',
    organ_key: 'proventriculus',
    organ_name_ar: 'المعدة الغدية (Proventriculus)',
    target_diseases_ar: 'مرض النيوكاسل الحاد (Newcastle ND)، أنفلونزا الطيور (AI)، والتهاب المعدة الفيروسي',
    guide_description: 'افصل المعدة الغدية وافتحها طولياً، اغسل المخاط برفق وتفحص حلمات إفراز العصارة الهاضمة هل بها نقاط نزف دائرية دقيقة حمراء كطبعات الدبوس.',
    guide_image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
    suspicion_level: 'سليم طبيعي'
  },
  {
    id: 'org-trachea',
    organ_key: 'trachea',
    organ_name_ar: 'القصبة الهوائية والحنجرة (Trachea & Larynx)',
    target_diseases_ar: 'الالتهاب الشعبي المعدي (IB)، التهاب الحنجرة والقصبة النزفي (ILT)، والميكوبلازما (MG)',
    guide_description: 'شق القصبة الهوائية من الحنجرة إلى التفرع؛ راقب هل بطانتها محتقنة بشدة، أو تحتوي على سدادات مخاطية صفراء أو نزيف دموي صريح يعيق التنفس.',
    guide_image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=500&q=80',
    suspicion_level: 'سليم طبيعي'
  },
  {
    id: 'org-liver-airsacs',
    organ_key: 'liver_airsacs',
    organ_name_ar: 'الكبد والأكياس الهوائية (Liver & Air Sacs)',
    target_diseases_ar: 'متلازمة الكولاي (Colibacillosis)، التهاب الكبد الفبريني، وتعفن الدم، والتسمم الفطري',
    guide_description: 'تفحص غشاء الكبد والأكياس الهوائية البطنية والصدرية؛ هل شفافة كالزجاج (طبيعي) أم مغطاة بغشاء فيبريني أبيض/أصفر معتم يشبه زلال البيض المطبوخ.',
    guide_image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=500&q=80',
    suspicion_level: 'سليم طبيعي'
  },
  {
    id: 'org-bursa',
    organ_key: 'bursa',
    organ_name_ar: 'غدة البرسا (Bursa of Fabricius)',
    target_diseases_ar: 'مرض الجمبورو (IBD) والانهيار المناعي الفيروسي',
    guide_description: 'تقع غدة البرسا فوق فتحة المجمع مباشرة؛ افحص حجمها ولونها؛ التورم الشديد والوذمة الجيلاتينية أو النزف المخطط يدل على طور حاد من الجمبورو، والضمور يدل على إصابة متقدمة.',
    guide_image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80',
    suspicion_level: 'سليم طبيعي'
  }
];

// ====================================================
// بلاغات المشاكل المرضية المحولة للإدارة (Disease Triage Reports)
// ====================================================
export const INITIAL_DISEASE_REPORTS: DiseaseReportCase[] = [
  {
    id: 'rep-case-101',
    case_number: 'REP-YEM-2026-089',
    farmer_name: 'الحاج عبد الرقيب السراجي',
    farm_name: 'عنبر السراجي 1',
    phone: '+967 771 234 567',
    governorate: 'محافظة صنعاء',
    district: 'بني مطر',
    flock_breed: 'Ross 308',
    bird_age_days: 26,
    flock_size: 10000,
    mortality_today: 48,
    temp_celsius: 28,
    humidity_percent: 68,
    feed_consumption_kg: 850,
    water_consumption_liters: 1750,
    general_barn_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
    droppings_image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    organs: [
      {
        id: 'rep-org-1',
        organ_key: 'caeca',
        organ_name_ar: 'الأعوران (Caeca)',
        target_diseases_ar: 'الكوكسيديا الأعورية',
        guide_description: 'انتفاخ شديد بالأعورين ووجود كتل دموية داكنة.',
        guide_image_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=500&q=80',
        user_uploaded_image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=500&q=80',
        suspicion_level: 'إصابة حادة ونزف',
        ai_observation: 'احتقان شديد بالأعورين مع تجلط دموي يرجح بقوة كوكسيديا أعورية (E. tenella).'
      },
      {
        id: 'rep-org-2',
        organ_key: 'proventriculus',
        organ_name_ar: 'المعدة الغدية (Proventriculus)',
        target_diseases_ar: 'مرض النيوكاسل',
        guide_description: 'فحص حلمات المعدة الغدية.',
        guide_image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
        suspicion_level: 'سليم طبيعي',
        ai_observation: 'الحلمات سليمة وخالية من النزف النقطي، لا اشتباه نيوكاسل حاد.'
      }
    ],
    symptoms_description: 'ظهور إسهال مدمم أحمر داكن بالفرشة، انكماش الطيور وريش منفوش، والنافق قفز فجأة من 8 طيور إلى 48 طائراً اليوم.',
    ai_preliminary_triage: '⚠️ تنبيه سريري عالي: تطابق عالي مع تفشي كوكسيديا حادة مصحوبة بنزيف أعوري. الذكاء الاصطناعي لا يصرف دواءً ويحيل الملف فوراً للأطباء الاستشاريين لاعتماد جرعة تولترازوريل أو أمبروليوم عاجلة مع فيتامين K3.',
    severity: 'مرتفع',
    assigned_consultant: 'الطبيب البيطري الاستشاري المعتمد',
    status: 'submitted_to_admin_vets',
    created_at: '2026-09-14 09:15',
    admin_vet_action_notes: 'تم استلام الملف ومطالعة صور الأعورين، التوجيه بصرف مضاد كوكسيديا عاجل مع فحص حساسية بكتيرية للكولاي المصاحبة.'
  }
];

// ====================================================
// سجل المدفوعات والمحافظ اليمنية (Yemeni Payment Transactions)
// ====================================================
export const INITIAL_PAYMENT_RECORDS: PaymentTransactionRecord[] = [
  {
    id: 'pay-rec-001',
    receipt_number: 'REC-KRM-2026-9011',
    date: '2026-09-14 11:20',
    method: 'jeep_wallet',
    payer_name: 'أحمد علي عبده حزام (مربي)',
    payer_phone: '+967 772 334 455',
    recipient_account_or_wallet: 'محفظة جيب الرسمية: 777123456 (المنصة الوطنية للسيادة البيطرية)',
    transaction_ref_number: 'JEEP-TX-8839201',
    amount_yer: 148500,
    purpose: 'شراء أدوية بيطرية',
    status: 'مؤكد ومعتمد',
    proof_image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    notes: 'سداد قيمة فاتورة إنروكين فورت ومطهر TH4+ عبر محفظة جيب بنك الكريمي.',
    processed_by: 'أ. رضوان حمود الشامي (المدير المالي)'
  },
  {
    id: 'pay-rec-002',
    receipt_number: 'REC-KRM-2026-9012',
    date: '2026-09-13 16:45',
    method: 'kuraimi_account',
    payer_name: 'شركة ومطاحن سبأ الوطنية للأعلاف',
    payer_phone: '+967 771 889 004',
    recipient_account_or_wallet: 'حساب بنك الكريمي PFX: 1204488391 (إدارة المنصة الداجنة)',
    transaction_ref_number: 'KRM-TRANS-551928',
    amount_yer: 890000,
    purpose: 'شراء أعلاف',
    status: 'مؤكد ومعتمد',
    proof_image_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=80',
    notes: 'تحويل عمولة وساطة توريد 40 طن علف بادي ونامي لمزارع قاع معبر.',
    processed_by: 'أ. رضوان حمود الشامي (المدير المالي)'
  },
  {
    id: 'pay-rec-003',
    receipt_number: 'REC-EXCH-2026-4402',
    date: '2026-09-12 14:10',
    method: 'money_exchange_network',
    payer_name: 'فايز محمد المحمدي (مربي)',
    payer_phone: '+967 733 881 229',
    recipient_account_or_wallet: 'شبكة النجم للحوالات - حوالة باسم المدير المالي رضوان الشامي',
    transaction_ref_number: 'NAJM-88192039',
    amount_yer: 50000,
    purpose: 'رسوم توثيق الجواز الرقمي',
    status: 'مؤكد ومعتمد',
    notes: 'رسوم إصدار وتوثيق شهادة الجواز الصحي QR لدفعة الطيور المعدة للذبح.',
    processed_by: 'أ. رضوان حمود الشامي (المدير المالي)'
  }
];

