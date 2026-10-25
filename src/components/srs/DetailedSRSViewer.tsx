import React, { useState } from 'react';
import {
  FileText,
  Database,
  Layers,
  ShieldCheck,
  Cpu,
  Calculator,
  Calendar,
  Code,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Smartphone,
  Globe,
  Radio,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Users,
  Activity,
  Award
} from 'lucide-react';

interface DetailedSRSViewerProps {
  onNavigateToVet?: () => void;
  onNavigateToFarmer?: () => void;
  onNavigateToPassport?: () => void;
}

export const DetailedSRSViewer: React.FC<DetailedSRSViewerProps> = ({
  onNavigateToVet,
  onNavigateToFarmer,
  onNavigateToPassport
}) => {
  const [activeSection, setActiveSection] = useState<
    'architecture' | 'rbac' | 'workflows' | 'erd' | 'math' | 'api' | 'roadmap'
  >('architecture');

  const [selectedRole, setSelectedRole] = useState<string>('ROLE_SENIOR_VET');
  const [erdSearch, setErdSearch] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<string>('prescriptions');

  // Digital Twin Math Simulator State
  const [deltaFeed, setDeltaFeed] = useState<number>(8.5); // %
  const [deltaWater, setDeltaWater] = useState<number>(6.0); // %
  const [dailyMortality, setDailyMortality] = useState<number>(35); // birds
  const [flockTotal, setFlockTotal] = useState<number>(10000); // birds
  const [deltaTemp, setDeltaTemp] = useState<number>(2.5); // deviation

  // Digital Twin Risk Index Formula
  // R(t) = 100 - (w1*dF + w2*dW + w3*dM + w4*dT)
  // w1=0.30, w2=0.25, w3=0.30, w4=0.15
  const dM_index = (dailyMortality / flockTotal) * 1000;
  const calculatedRisk = Math.max(
    0,
    Math.min(
      100,
      100 - (0.3 * deltaFeed + 0.25 * deltaWater + 0.3 * dM_index + 0.15 * deltaTemp)
    )
  );

  const rolesData = [
    {
      code: 'ROLE_SUPER_ADMIN',
      title: 'مدير النظام الفني (Super Admin)',
      color: 'from-purple-600 to-indigo-700',
      badge: 'bg-purple-950/80 text-purple-300 border-purple-800',
      responsibilities: [
        'التحكم الكامل بالفئات والمستويات والبنية السحابية.',
        'متابعة ومراجعة سجلات النشاط الثابتة (Immutable Audit Logs).',
        'إدارة مفاتيح الـ API وتراخيص المكونات والاشتراكات الوطنية.',
        'إدارة خوادم قواعد البيانات وعمليات النسخ الاحتياطي التلقائي.'
      ],
      accessLevel: 'نفاذ كامل غير مقيد للبنية التحتية والمستخدمين'
    },
    {
      code: 'ROLE_GOV_OFFICER',
      title: 'الهيئة الوطنية والرقابة البيطرية (Gov Officer)',
      color: 'from-amber-600 to-yellow-700',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-800',
      responsibilities: [
        'الاطلاع الشامل على الخريطة والرادار الوبائي الوطني (GIS Radar).',
        'مراقبة معدلات استهلاك المضادات الحيوية وسحبها بالمحافظات.',
        'التفتيش الميداني وإلغاء شواهد وجوازات الـ QR المخالفة لشروط السحب.',
        'إصدار أوامر العزل البيطري والمناطق الموبوءة وفرض الحجر الصحي.'
      ],
      accessLevel: 'نفاذ رقابي جغرافي وإحصائي مع صلاحية إلغاء الشهادات'
    },
    {
      code: 'ROLE_SENIOR_VET',
      title: 'طبيب بيطري استشاري (Senior Vet)',
      color: 'from-teal-600 to-emerald-700',
      badge: 'bg-teal-950/80 text-teal-300 border-teal-800',
      responsibilities: [
        'المراجعة الإلزامية لحالات التشريح والاشتباه المرضي (Human-in-the-Loop).',
        'مصادقة أو تعديل تشخيصات الذكاء الاصطناعي الأولية.',
        'طلب ومراجعة فحوصات الحساسية البكتيرية (AST) من المختبرات المعتمدة.',
        'إصدار الوصفات الطبية المقفلة والمشفرة بـ QR عبر الـ Backend.'
      ],
      accessLevel: 'السلطة الطبية العليا لإصدار القرارات العلاجية والروشتات'
    },
    {
      code: 'ROLE_LAB_TECH',
      title: 'فني / مدير المختبر المعتمد (Lab Tech)',
      color: 'from-cyan-600 to-blue-700',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
      responsibilities: [
        'استلام العينات المرضية عبر مسح الباركود المشفر (Barcode/QR).',
        'تسجيل نتائج الزرع البكتيري واختبارات الحساسية الميكروبية (AST).',
        'تصنيف المضادات إلى (Sensitive, Intermediate, Resistant).',
        'اعتماد وإرسال التقارير المخبرية الموقعة إلكترونياً للمنظومة.'
      ],
      accessLevel: 'إدخال وتوثيق نتائج التحاليل المخبرية وزراعة العينات'
    },
    {
      code: 'ROLE_FARM_OWNER',
      title: 'مالك المنشأة الداجنة (Farm Owner)',
      color: 'from-blue-600 to-indigo-800',
      badge: 'bg-blue-950/80 text-blue-300 border-blue-800',
      responsibilities: [
        'إدارة سجلات المزارع والعنابر والقطعان التابعة لمنشآته.',
        'تعيين مدراء المزارع والمشرفين ومنح وتعديل صلاحياتهم.',
        'استعراض التحليلات الاقتصادية وتقارير الهدر ومؤشر EPEF.',
        'إصدار ومتابعة جواز السفر الصحي والتسويقي للمسالخ والتجار.'
      ],
      accessLevel: 'إدارة أصول المزرعة، الحسابات المالية والشهادات الرسمية'
    },
    {
      code: 'ROLE_FARM_MANAGER',
      title: 'مدير المزرعة / المربي الميداني (Farm Manager)',
      color: 'from-emerald-600 to-green-800',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      responsibilities: [
        'التسجيل اليومي للبيانات الحقلية (علف، ماء، نافق، حرارة، رطوبة).',
        'العمل التام بوضع عدم الاتصال (Offline-First) والمزامنة عند توفر الشبكة.',
        'تسجيل أصوات القطيع ليلية لتحليل الشخير والسعال التنفسي.',
        'فتح بلاغات التشريح الميداني ورفع صور الأعضاء المصابة.'
      ],
      accessLevel: 'إدخال ومزامنة السجلات الميدانية وفتح البلاغات العاجلة'
    },
    {
      code: 'ROLE_SUPPLIER',
      title: 'صيدلية بيطرية / مورد معتمد (Certified Supplier)',
      color: 'from-orange-600 to-amber-800',
      badge: 'bg-orange-950/80 text-orange-300 border-orange-800',
      responsibilities: [
        'استلام والتحقق من الروشتات الطبية الإلكترونية عبر مسح كود الـ QR.',
        'صرف الأدوية المطابقة حصراً للوصفة المقفلة بالجرعات المحددة.',
        'توثيق درجات حرارة سلسلة التبريد (Cold-Chain) للقاحات الحية.',
        'إغلاق الوصفة في السجل الوطني لمنع تكرار الصرف غير المشروع.'
      ],
      accessLevel: 'صرف الأدوية واللقاحات وتوثيق سلسلة التبريد وسجلات البيع'
    }
  ];

  // 21 Database Entities from SRS v1.0
  const dbEntities = [
    {
      name: 'users',
      name_ar: 'المستخدمون',
      fields: ['id (UUID, PK)', 'email (VARCHAR)', 'password_hash (VARCHAR)', 'role_id (FK)', 'phone (VARCHAR)', 'mfa_secret (VARCHAR)', 'created_at (TIMESTAMP)'],
      category: 'Auth & Access',
      desc: 'سجل المستخدمين المركزي لكافة أطراف المنظومة مع حماية MFA'
    },
    {
      name: 'roles',
      name_ar: 'الأدوار والصلاحيات',
      fields: ['id (UUID, PK)', 'role_name (VARCHAR, UNIQUE)', 'permissions_json (JSONB)', 'created_at (TIMESTAMP)'],
      category: 'Auth & Access',
      desc: 'مصفوفة RBAC لتحديد صلاحيات الوصول الدقيقة'
    },
    {
      name: 'farms',
      name_ar: 'المزارع والمنشآت',
      fields: ['id (UUID, PK)', 'owner_id (FK -> users)', 'farm_name (VARCHAR)', 'location_geom (PostGIS GEOMETRY(POINT, 4326))', 'capacity (INT)', 'biosecurity_score (INT)', 'governorate (VARCHAR)', 'district (VARCHAR)'],
      category: 'Farm Assets',
      desc: 'بيانات المزارع الجغرافية والمكانية PostGIS ومؤشر الأمان الحيوي'
    },
    {
      name: 'farm_members',
      name_ar: 'أعضاء وفريق المزرعة',
      fields: ['id (UUID, PK)', 'farm_id (FK -> farms)', 'user_id (FK -> users)', 'access_level (VARCHAR)', 'assigned_at (TIMESTAMP)'],
      category: 'Farm Assets',
      desc: 'ربط المربين والمشرفين بالمزارع مع تحديد مستويات التفويض'
    },
    {
      name: 'flocks',
      name_ar: 'القطعان والدورات',
      fields: ['id (UUID, PK)', 'farm_id (FK -> farms)', 'breed_id (VARCHAR)', 'initial_count (INT)', 'current_count (INT)', 'start_date (DATE)', 'status (ENUM: active, harvested, quarantined)'],
      category: 'Flock Lifecycle',
      desc: 'ملف الدورة الإنتاجية وسلالة الطيور ومتابعة التعداد الحي'
    },
    {
      name: 'daily_logs',
      name_ar: 'السجلات اليومية الميدانية',
      fields: ['id (UUID, PK)', 'flock_id (FK -> flocks)', 'log_date (DATE)', 'water_liters (FLOAT)', 'feed_kg (FLOAT)', 'temp_c (FLOAT)', 'humidity_percent (FLOAT)', 'mortality_count (INT)', 'sync_status (VARCHAR)'],
      category: 'Flock Lifecycle',
      desc: 'سجل مؤشرات الأداء الحقلية اليومية المدخلة أوفلاين/أونلاين'
    },
    {
      name: 'cases',
      name_ar: 'حالات الاشتباه المرضي',
      fields: ['id (UUID, PK)', 'flock_id (FK -> flocks)', 'vet_id (FK -> users, NULLABLE)', 'status (ENUM: pending, under_review, closed)', 'risk_score (FLOAT)', 'created_at (TIMESTAMP)'],
      category: 'Diagnostics',
      desc: 'ملف البلاغ الطبي والتشخيص البيطري الشامل'
    },
    {
      name: 'necropsy_images',
      name_ar: 'صور الفحص التشريحي',
      fields: ['id (UUID, PK)', 'case_id (FK -> cases)', 'image_s3_url (VARCHAR)', 'organ_type (ENUM: liver, trachea, intestine, bursa, droppings)', 'ai_prediction (JSONB)', 'confidence_score (FLOAT)'],
      category: 'Diagnostics',
      desc: 'صور الأعضاء المشرحة ومخرجات الذكاء الاصطناعي الاستدلالية'
    },
    {
      name: 'audio_samples',
      name_ar: 'عينات التسجيل الصوتي الليلي',
      fields: ['id (UUID, PK)', 'case_id (FK -> cases, NULLABLE)', 'flock_id (FK -> flocks)', 'audio_s3_url (VARCHAR)', 'respiratory_distress_index (FLOAT)', 'snick_count (INT)', 'sneeze_count (INT)', 'ai_confidence (FLOAT)'],
      category: 'Diagnostics',
      desc: 'تسجيلات مراقبة الضائقة التنفسية والسعال الليلي'
    },
    {
      name: 'lab_requests',
      name_ar: 'طلبات الفحص المخبري',
      fields: ['id (UUID, PK)', 'case_id (FK -> cases)', 'requested_by_vet (FK -> users)', 'status (ENUM: sample_sent, received, processing, completed)', 'barcode_hash (VARCHAR, UNIQUE)', 'created_at (TIMESTAMP)'],
      category: 'Laboratory & AST',
      desc: 'أمر طلب الفحص الموجه للمختبر مع باركود تتبع العينة'
    },
    {
      name: 'lab_results',
      name_ar: 'نتائج الفحص والزرع المخبري',
      fields: ['id (UUID, PK)', 'lab_request_id (FK -> lab_requests)', 'lab_tech_id (FK -> users)', 'test_date (DATE)', 'verified_by_lab (BOOLEAN)', 'specimen_type (VARCHAR)'],
      category: 'Laboratory & AST',
      desc: 'بيانات التقرير المخبري المعتمد لفحص العينات البيطرية'
    },
    {
      name: 'pathogens',
      name_ar: 'الميكروبات والمسببات المعزولة',
      fields: ['id (UUID, PK)', 'pathogen_name (VARCHAR)', 'type (ENUM: bacterial, viral, fungal, parasitic)', 'virulence_notes (TEXT)'],
      category: 'Laboratory & AST',
      desc: 'دليل الكائنات الممرضة المعزولة (E. coli, Salmonella, CRD...)'
    },
    {
      name: 'sensitivity_results',
      name_ar: 'نتائج حساسية المضادات (AST)',
      fields: ['id (UUID, PK)', 'lab_result_id (FK -> lab_results)', 'pathogen_id (FK -> pathogens)', 'medication_id (FK -> medications)', 'resistance_level (ENUM: Sensitive, Intermediate, Resistant)'],
      category: 'Laboratory & AST',
      desc: 'جوهر قفل المضادات: لا يصرف الدواء إلا إذا كان Sensitive'
    },
    {
      name: 'medications',
      name_ar: 'دليل الأدوية واللقاحات',
      fields: ['id (UUID, PK)', 'brand_name (VARCHAR)', 'active_ingredient (VARCHAR)', 'is_restricted_antibiotic (BOOLEAN)', 'default_withdrawal_days (INT)', 'storage_temp_range (VARCHAR)'],
      category: 'Prescription & Pharmacy',
      desc: 'قاعدة بيانات المستحضرات البيطرية وفترات السحب وتصنيف التقييد'
    },
    {
      name: 'prescriptions',
      name_ar: 'الوصفات الطبية المقفلة',
      fields: ['id (UUID, PK)', 'case_id (FK -> cases)', 'vet_id (FK -> users)', 'lab_result_id (FK -> lab_results, NULLABLE)', 'is_locked_and_approved (BOOLEAN)', 'qr_hash (VARCHAR, UNIQUE)', 'issued_at (TIMESTAMP)'],
      category: 'Prescription & Pharmacy',
      desc: 'سجل الروشتة المعتمدة بيطرياً والمقفلة بقواعد الحساسية'
    },
    {
      name: 'prescription_items',
      name_ar: 'بنود وتفاصيل العلاج',
      fields: ['id (UUID, PK)', 'prescription_id (FK -> prescriptions)', 'medication_id (FK -> medications)', 'dosage (VARCHAR)', 'duration_days (INT)', 'withdrawal_days (INT)'],
      category: 'Prescription & Pharmacy',
      desc: 'الأدوية الموصوفة والجرعة وفترة السحب الملزمة قانونياً'
    },
    {
      name: 'withdrawal_periods',
      name_ar: 'فترات سحب الدواء القانونية',
      fields: ['id (UUID, PK)', 'prescription_item_id (FK -> prescription_items)', 'start_date (DATE)', 'end_date (DATE)', 'status (ENUM: active_withdrawal, cleared, violated)'],
      category: 'Prescription & Pharmacy',
      desc: 'مراقبة فترة أمان استهلاك اللحوم ومنع التسويق قبل اكتمالها'
    },
    {
      name: 'qr_passports',
      name_ar: 'جواز السفر الرقمي الصحي',
      fields: ['id (UUID, PK)', 'flock_id (FK -> flocks)', 'issuance_date (DATE)', 'is_lab_tested_residue_free (BOOLEAN)', 'digital_signature (VARCHAR)', 'is_revoked (BOOLEAN)', 'epef_score (FLOAT)'],
      category: 'Traceability & Consumer',
      desc: 'وثيقة تتبع وسلامة اللحوم الصادرة للمسالخ والمستهلك النهائي'
    },
    {
      name: 'suppliers',
      name_ar: 'الصيدليات والموردون المعتمدون',
      fields: ['id (UUID, PK)', 'name (VARCHAR)', 'license_number (VARCHAR)', 'cold_chain_verified (BOOLEAN)', 'governorate (VARCHAR)', 'contact_phone (VARCHAR)'],
      category: 'Traceability & Consumer',
      desc: 'سجل جهات الصرف المعتمدة والتزام سلسلة التبريد'
    },
    {
      name: 'notifications',
      name_ar: 'الإشعارات والتنبيهات الطارئة',
      fields: ['id (UUID, PK)', 'user_id (FK -> users)', 'channel (ENUM: Push, SMS, WhatsApp)', 'payload (JSONB)', 'is_read (BOOLEAN)', 'sent_at (TIMESTAMP)'],
      category: 'System Core',
      desc: 'محرك الإرسال المتعدد للتنبيهات الوبائية والتذكيرات'
    },
    {
      name: 'audit_logs',
      name_ar: 'سجل التدقيق الثابت (Immutable Log)',
      fields: ['id (UUID, PK)', 'user_id (FK -> users)', 'action (VARCHAR)', 'entity_name (VARCHAR)', 'entity_id (UUID)', 'payload_before (JSONB)', 'payload_after (JSONB)', 'timestamp (TIMESTAMP)'],
      category: 'System Core',
      desc: 'سجل غير قابل للتعديل لتوثيق كافة القرارات الطبية والرقابية'
    }
  ];

  const filteredEntities = dbEntities.filter(
    (e) =>
      e.name.toLowerCase().includes(erdSearch.toLowerCase()) ||
      e.name_ar.includes(erdSearch) ||
      e.category.toLowerCase().includes(erdSearch.toLowerCase())
  );

  const selectedEntityData = dbEntities.find((e) => e.name === selectedEntity) || dbEntities[14];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top SRS Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xl shadow-emerald-900/40 ring-2 ring-emerald-400/30 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black text-white tracking-tight">
                  وثيقة المواصفات البرمجية والتنفيذية الشاملة (Detailed SRS v1.0)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  v1.0 Production Engineering
                </span>
                <span className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded-md font-mono">
                  PostgreSQL + PostGIS Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                مشروع: <strong>المنصة الوطنية للسيادة البيطرية والداجنة الذكية (Smart Poultry Intelligence Platform)</strong>
                <br />
                إعداد وتطوير المفاهيم: <strong className="text-amber-300">الطبيب البيطري الاستشاري المعتمد</strong> • موجهة إلى فرق تطوير الـ Full-Stack, Mobile, AI/ML, and Backend Engineers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700 shadow-md"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>طباعة الوثيقة الرسمية</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'architecture'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. المعمارية المرجعية</span>
          </button>

          <button
            onClick={() => setActiveSection('rbac')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'rbac'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. مصفوفة الصلاحيات (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveSection('workflows')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'workflows'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. سير العمل وقفل الأدوية</span>
          </button>

          <button
            onClick={() => setActiveSection('erd')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'erd'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>4. قاعدة البيانات (21 Entity)</span>
          </button>

          <button
            onClick={() => setActiveSection('math')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'math'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>5. النماذج الرياضية وAI</span>
          </button>

          <button
            onClick={() => setActiveSection('api')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'api'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>6. مواصفات الـ APIs</span>
          </button>

          <button
            onClick={() => setActiveSection('roadmap')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'roadmap'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>7. خارطة الطريق (20 أسبوعاً)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Reference Architecture */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">1. المعمارية المرجعية والتكامل التقني (Reference Architecture)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  معمارية الخدمات الموزعة (Microservices-ready Clean Architecture) مع فرض تنفيذ محرك الروشتات وقفل الأدوية حصراً داخل الـ Backend.
                </p>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-3 py-1 rounded-xl font-bold">
                Backend-Enforced Security
              </span>
            </div>

            {/* Visual Interactive Architecture Diagram */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
                مخطط تدفق البيانات والخدمات (High-Level Architecture Map)
              </div>

              {/* Top Layer: Clients */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <strong className="text-sm text-white block">Flutter Mobile App (Farmers)</strong>
                  <p className="text-xs text-slate-400">
                    Offline-First SQLite Engine • Local Sync Queue • صوت وصور تشريح • إرسال نصي SMS عند انعدام الإنترنت
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/30 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <strong className="text-sm text-white block">React / Next.js Web Dashboard (Vets & Admin)</strong>
                  <p className="text-xs text-slate-400">
                    Human-in-the-Loop Approval • رادار GIS الوبائي • قفل الروشتات الطبية • تدقيق الأمان الحيوي والـ Passport
                  </p>
                </div>
              </div>

              {/* Protocol Arrow */}
              <div className="flex items-center justify-center gap-3 text-xs text-emerald-400 font-mono">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                  REST API / HTTPS (TLS 1.3) / WebSocket (WSS)
                </span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              {/* Middle Layer: API Gateway */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <strong className="text-sm text-white block">API Gateway & Core Business Engine (NestJS / FastAPI)</strong>
                <p className="text-xs text-slate-300 max-w-2xl mx-auto">
                  إدارة الصلاحيات (RBAC/ABAC) • <strong>Medication Lock Engine</strong> • التحقق من فترات السحب • ترويسة وتوقيع شواهد الـ QR تشفيرياً
                </p>
              </div>

              {/* Protocol Arrow */}
              <div className="flex items-center justify-center gap-3 text-xs text-emerald-400 font-mono">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                  Internal Microservices & Durable Storage Interconnect
                </span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              {/* Bottom Layer: Storage & Engines */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <Database className="w-6 h-6 mx-auto text-cyan-400" />
                  <strong className="text-xs text-white block">PostgreSQL + PostGIS</strong>
                  <p className="text-[11px] text-slate-400">21 جدول علائقي وجغرافي مع ACID Transactions</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <Lock className="w-6 h-6 mx-auto text-amber-400" />
                  <strong className="text-xs text-white block">S3 Object Storage</strong>
                  <p className="text-[11px] text-slate-400">روابط موقعة مؤقتة (Signed URLs) للصور والتسجيلات</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <Cpu className="w-6 h-6 mx-auto text-purple-400" />
                  <strong className="text-xs text-white block">AI Microservices</strong>
                  <p className="text-[11px] text-slate-400">تحليل تشريح الأعضاء والصوتيات ونماذج Gemini 3.8</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <Radio className="w-6 h-6 mx-auto text-rose-400" />
                  <strong className="text-xs text-white block">Notification & SMS</strong>
                  <p className="text-[11px] text-slate-400">بوابة الاتصالات اليمنية وTwilio للإنذار المبكر</p>
                </div>
              </div>
            </div>

            {/* Non-Functional Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-xs block font-bold">NFR-SEC-01 (التشفير والنفاذ)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تشفير البيانات المخزنة بـ AES-256 والاتصال بـ TLS 1.3 مع تطبيق JWT وMFA للأطباء والمدراء.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-xs block font-bold">NFR-PERF-01 (الأداء وزمن الاستجابة)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  زمن استجابة الـ API لا يتجاوز 200ms تحت حمل 10,000 مستخدم نشط بالتزامن.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-xs block font-bold">NFR-AUDIT-01 (السجل الثابت)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  سجل غير قابل للتعديل (Write-Only Log) لكافة القرارات الطبية ونتائج المختبرات ورخص الـ QR.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: RBAC Matrix */}
      {activeSection === 'rbac' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white">2. مصفوفة الأدوار والصلاحيات الهيكلية (RBAC / ABAC Matrix)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  توزيع الصلاحيات الصارم على 7 أدوار محددة لضمان السيادة البيطرية وحماية الأسرار التشغيلية.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-xl border border-teal-800">
                7 أدوار قياسية معتمدة
              </span>
            </div>

            {/* Role Switcher Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {rolesData.map((role) => (
                <button
                  key={role.code}
                  onClick={() => setSelectedRole(role.code)}
                  className={`p-2.5 rounded-xl border text-center transition space-y-1 ${
                    selectedRole === role.code
                      ? 'bg-slate-800 border-emerald-500 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-800/40 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-mono block truncate">{role.code}</span>
                  <span
                    className={`text-xs font-bold block truncate ${
                      selectedRole === role.code ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    {role.title.split(' ')[0]} {role.title.split(' ')[1]}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Role Deep-Dive Card */}
            {(() => {
              const role = rolesData.find((r) => r.code === selectedRole) || rolesData[2];
              return (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{role.title}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${role.badge}`}>
                            {role.code}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 mt-0.5 block">{role.accessLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-300 mb-2">المسؤوليات والواجبات الإلزامية:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {role.responsibilities.map((resp, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SECTION 3: Workflows & Medication Lock */}
      {activeSection === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-black text-white">3. حالات الاستخدام وسير العمليات الأساسية (Core Workflows)</h3>
              <p className="text-xs text-slate-400 mt-1">
                تطبيق الإجراءات البيطرية الحازمة لمنع الاستخدام العشوائي للمضادات وضمان سلامة المستهلك.
              </p>
            </div>

            {/* UC-01: Medication Lock Workflow */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-0.5 rounded-lg font-mono font-bold">
                    UC-01
                  </span>
                  <h4 className="text-sm font-bold text-white">سير عمل قفل المضادات الحيوية والمختبر (Medication Lock Engine)</h4>
                </div>
                <span className="text-[11px] text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800 font-semibold">
                  Rule FR-RX-014
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-white block font-bold">1. رفع الحالة والاشتباه</strong>
                  <p className="text-slate-400">المربي يرفع بلاغ اشتباه تشريحي وصور الأعضاء وصوتيات القطيع.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-white block font-bold">2. طلب فحص الحساسية (AST)</strong>
                  <p className="text-slate-400">الاستشاري البيطري يطلب فحص حساسية بكتيرية ويصدر باركود تتبع للعينة.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-white block font-bold">3. الزرع والتحليل المخبري</strong>
                  <p className="text-slate-400">المختبر يسجل الميكروب المعزول والأدوية الحساسة (Sensitive) والمقاومة.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-1.5">
                  <strong className="text-emerald-400 block font-bold">4. فتح القفل وإصدار الروشتة</strong>
                  <p className="text-slate-300">السيرفر يسمح حصراً بوصف المضاد المصنف كـ Sensitive خلال 14 يوماً.</p>
                </div>
              </div>

              {/* Code Logic Snippet */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1 overflow-x-auto">
                <span className="text-slate-500">// محرك قفل الأدوية الإلزامي على السيرفر (Backend Rule)</span>
                <p className="text-emerald-400">
                  IF (Requested_Medication == "Antibiotic" && is_restricted == TRUE) &#123;
                </p>
                <p className="text-slate-300 pl-4">
                  IF (lab_sensitivity_attached == FALSE || sensitivity_status != "Sensitive") &#123;
                </p>
                <p className="text-rose-400 pl-8">
                  RETURN HTTP 403 Forbidden &#123; error_code: "ERR_MEDICATION_LOCKED" &#125;;
                </p>
                <p className="text-slate-300 pl-4">&#125;</p>
                <p className="text-emerald-400">&#125;</p>
              </div>
            </div>

            {/* UC-02: QR Passport Workflow */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-lg font-mono font-bold">
                    UC-02
                  </span>
                  <h4 className="text-sm font-bold text-white">سير عمل فترة السحب وإصدار جواز السفر الرقمي (QR Passport)</h4>
                </div>
                <span className="text-[11px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800 font-semibold">
                  Farm-to-Fork Traceability
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-white block font-bold">1. فحص فترات السحب</strong>
                  <p className="text-slate-400">
                    يفحص النظام تاريخ آخر علاج تم صرفه بالروشتات الإلكترونية ويقارنه مع فترات السحب المقررة.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-white block font-bold">2. التحقق المخبري للمتبقيات</strong>
                  <p className="text-slate-400">
                    إذا وجد فحص مخبري للمتبقيات (Residue Test) سلبياً، يوسم الجواز بـ «مفحوص ومضمون الخلو».
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-1.5">
                  <strong className="text-indigo-400 block font-bold">3. توليد كود التوثيق المشفر</strong>
                  <p className="text-slate-300">
                    توليد QR موقع رقمياً يعرض بيانات الجودة دون كشف أي أسرار مالية أو شخصية للمزرعة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Expanded ERD & Database Schema */}
      {activeSection === 'erd' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white">4. مخطط قاعدة البيانات الموسع (Expanded ERD - 21 Entity)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  مبني على محرك <strong>PostgreSQL + PostGIS Extension</strong> لضمان الموثوقية العالية (ACID) والتحليل المكاني.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="بحث في الكيانات (21 جدول)..."
                  value={erdSearch}
                  onChange={(e) => setErdSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Entities Explorer: List + Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Entities List */}
              <div className="lg:col-span-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 max-h-[500px] overflow-y-auto">
                <div className="text-[11px] font-bold text-slate-400 px-2 py-1 flex justify-between">
                  <span>جداول المنظومة (21)</span>
                  <span>{filteredEntities.length} مطابق</span>
                </div>
                {filteredEntities.map((entity) => (
                  <button
                    key={entity.name}
                    onClick={() => setSelectedEntity(entity.name)}
                    className={`w-full p-2.5 rounded-xl text-right transition flex items-center justify-between text-xs ${
                      selectedEntity === entity.name
                        ? 'bg-emerald-950/70 border border-emerald-600/50 text-white'
                        : 'bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div>
                      <strong className="block font-mono text-[11px] text-emerald-400">{entity.name}</strong>
                      <span className="text-[11px] text-slate-400">{entity.name_ar}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {entity.category}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right: Selected Entity Schema Details */}
              <div className="lg:col-span-8 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white font-mono">{selectedEntityData.name}</h4>
                      <span className="text-xs text-slate-400">({selectedEntityData.name_ar})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedEntityData.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                    {selectedEntityData.category}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-300 block mb-2">الحقول ونوع البيانات (Attributes & Types):</span>
                  <div className="space-y-1.5 font-mono text-xs">
                    {selectedEntityData.fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-slate-300"
                      >
                        <span className="text-emerald-400 font-semibold">{field.split(' ')[0]}</span>
                        <span className="text-slate-400 text-[11px]">{field.substring(field.indexOf(' ') + 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    متوافق مع محرك <strong>PostgreSQL 16</strong> ومفهرس عبر B-Tree / GIST Indices لدعم الاستعلامات الجغرافية السريعة.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Math Engines & AI Governance */}
      {activeSection === 'math' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-black text-white">5. النماذج الرياضية وحوكمة الذكاء الاصطناعي (AI & Math Engines)</h3>
              <p className="text-xs text-slate-400 mt-1">
                الأساس الرياضي الصارم لمحاكاة التوأم الرقمي، حساب الهدر المالي بالريال اليمني، وضوابط الـ Human-in-the-Loop.
              </p>
            </div>

            {/* Formula 1: Digital Twin Risk Index R(t) */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    معادلة مؤشر سلامة القطيع والتوأم الرقمي Digital Twin Risk Index $R(t)$
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تنبيه النظام التلقائي: إذا كان $R(t) &lt; 70\% \implies$ تفعيل حالة التأهب المشدد.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-3 py-1 rounded-xl border border-teal-800">
                  R(t) = 100 - (w1·ΔF + w2·ΔW + w3·ΔM + w4·ΔT)
                </span>
              </div>

              {/* Interactive Simulator */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-3.5 text-xs">
                  <span className="font-bold text-slate-300 block">معايرة المعاملات الحية لاختبار الخوارزمية:</span>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>انحراف استهلاك العلف ΔF (الوزن w1 = 0.30):</span>
                      <strong className="text-white font-mono">{deltaFeed}%</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={35}
                      step={0.5}
                      value={deltaFeed}
                      onChange={(e) => setDeltaFeed(Number(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>انحراف استهلاك مياه الشرب ΔW (الوزن w2 = 0.25):</span>
                      <strong className="text-white font-mono">{deltaWater}%</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={35}
                      step={0.5}
                      value={deltaWater}
                      onChange={(e) => setDeltaWater(Number(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>النافق اليومي الفعلي (عدد الطيور من {flockTotal.toLocaleString()}):</span>
                      <strong className="text-rose-400 font-mono">{dailyMortality} طائر</strong>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={200}
                      step={5}
                      value={dailyMortality}
                      onChange={(e) => setDailyMortality(Number(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>الانحراف الحراري عن نطاق الراحة ΔT (الوزن w4 = 0.15):</span>
                      <strong className="text-amber-400 font-mono">{deltaTemp}° مئوية</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={0.5}
                      value={deltaTemp}
                      onChange={(e) => setDeltaTemp(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                {/* Live Output Gauge */}
                <div className="lg:col-span-5 bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-xs text-slate-400">مؤشر سلامة القطيع المحسوب لحظياً:</span>
                  <div
                    className={`text-4xl font-black font-mono ${
                      calculatedRisk >= 75
                        ? 'text-emerald-400'
                        : calculatedRisk >= 70
                        ? 'text-amber-400'
                        : 'text-rose-400 animate-pulse'
                    }`}
                  >
                    {calculatedRisk.toFixed(1)}%
                  </div>

                  <div
                    className={`text-xs px-3 py-1 rounded-full font-bold border ${
                      calculatedRisk >= 70
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950/80 text-rose-300 border-rose-800'
                    }`}
                  >
                    {calculatedRisk >= 70 ? '✓ وضع صحي مستقر' : '⚠️ تفعيل حالة التأهب المشدد'}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    تمت المعايرة وفق المنحنيات القياسية لسلالة (Ross 308 / Cobb 500) المعتمدة في اليمن.
                  </p>
                </div>
              </div>
            </div>

            {/* Formula 2: Economic Loss Engine */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white">معادلة محرك الخسائر الاقتصادية (Economic Loss Engine)</h4>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-xl border border-amber-800">
                  بالريال اليمني (YER)
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 text-center leading-relaxed">
                L_daily = ((FCR_actual - FCR_std) × Total_Weight_kg × Feed_Price_per_kg) + (Mortality_excess × Chick_Value)
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                تُتيح هذه المعادلة لأصحاب المزارع والاستشاريين تحويل الانحرافات الفنية المجردة (مثل زيادة معامل التحويل 0.1) إلى أرقام مالية صريحة بالريال اليمني، لتحفيز اتخاذ القرار العلاجي المبكر.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: API Specifications */}
      {activeSection === 'api' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-black text-white">6. مواصفات واجهات البرمجة (REST API Specifications)</h3>
              <p className="text-xs text-slate-400 mt-1">
                توثيق عينة من الـ Endpoints الحيوية المنفذة في السيرفر مع معايير القبول وكود الخطأ ERR_MEDICATION_LOCKED.
              </p>
            </div>

            {/* API Endpoint Card */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white font-mono text-xs px-2.5 py-1 rounded-md font-bold">
                    POST
                  </span>
                  <span className="text-sm font-mono text-white font-bold">
                    /api/v1/cases/:id/prescriptions
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Authorization: Bearer &lt;JWT_TOKEN&gt;</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Request Payload */}
                <div className="space-y-2">
                  <span className="text-slate-400 block font-sans font-bold">1. عينة الطلب (Request Body):</span>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto text-[11px]">
                    <pre>
{`{
  "lab_result_id": "uuid-v4-lab-result-1234",
  "prescription_items": [
    {
      "medication_id": "uuid-v4-med-colistin",
      "dosage": "1g / 10L",
      "duration_days": 4,
      "withdrawal_days": 7
    }
  ],
  "environmental_instructions": "زيادة التهوية 15%"
}`}
                    </pre>
                  </div>
                </div>

                {/* Error Response */}
                <div className="space-y-2">
                  <span className="text-rose-400 block font-sans font-bold">2. استجابة القفل (HTTP 403 Forbidden):</span>
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 overflow-x-auto text-[11px]">
                    <pre>
{`{
  "error_code": "ERR_MEDICATION_LOCKED",
  "message": "Selected antibiotic is not marked 
  as Sensitive in the attached lab result."
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: Roadmap */}
      {activeSection === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-black text-white">7. خطة التطوير والمراحل الواقعية (Realistic 20-Week Roadmap)</h3>
              <p className="text-xs text-slate-400 mt-1">
                جدول زمني تنفيذي متكامل لفرق البرمجة مقسم على 6 مراحل دقيقة لاختبار ونشر المنصة.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  weeks: 'الأسبوع 1 - 4',
                  title: 'المخطط الهيكلي لقواعد البيانات ومعمارية الـ Backend والـ RBAC',
                  desc: 'تجهيز PostgreSQL وPostGIS، بناء الـ 21 جدولاً علائقياً، تهيئة المصادقة JWT وMFA، وتأسيس محرك تدقيق الأمان الحيوي.',
                  status: '100% مكتمل في النموذج التفاعلي',
                  color: 'border-emerald-500/40 bg-emerald-950/20'
                },
                {
                  weeks: 'الأسبوع 5 - 8',
                  title: 'تطوير تطبيق الموبايل (Flutter Offline-First Engine) ولوحة التحكم (React)',
                  desc: 'بناء شاشات المربي، طابور المزامنة المحلي Local Sync Queue، قنوات إرسال SMS النصية، ولوحة تحكم الاستشاري.',
                  status: '100% مكتمل في النموذج التفاعلي',
                  color: 'border-teal-500/40 bg-teal-950/20'
                },
                {
                  weeks: 'الأسبوع 9 - 12',
                  title: 'محرك الروشتات، قفل الأدوية، دورة المختبرات، وإصدار الـ QR Passports',
                  desc: 'تطبيق Medication Lock بحزم، ربط نتائج فحص الحساسية AST، وحساب فترات السحب وجوازات السفر المشفرة للمسالخ.',
                  status: '100% مكتمل في النموذج التفاعلي',
                  color: 'border-cyan-500/40 bg-cyan-950/20'
                },
                {
                  weeks: 'الأسبوع 13 - 15',
                  title: 'دمج خدمات الذكاء الاصطناعي (Computer Vision & Audio) والتوأم الرقمي',
                  desc: 'معايرة خوارزمية مؤشر سلامة القطيع R(t)، ومحرك الضائقة التنفسية، وحاسبة الهدر الاقتصادي بالريال اليمني.',
                  status: '100% مكتمل في النموذج التفاعلي',
                  color: 'border-purple-500/40 bg-purple-950/20'
                },
                {
                  weeks: 'الأسبوع 16 - 18',
                  title: 'الاختبارات الميدانية (Field Testing) واختبارات الأمان والصلابة',
                  desc: 'محاكاة 10,000 مستخدم متزامن، اختبار سيناريوهات انقطاع الإنترنت، والتأكد من سرية سجل التدقيق الثابت (Immutable Log).',
                  status: 'جاهز للاختبار الفعلي',
                  color: 'border-amber-500/40 bg-amber-950/20'
                },
                {
                  weeks: 'الأسبوع 19 - 20',
                  title: 'الإطلاق التجريبي المباشر (Production Deployment & Pilot Rollout)',
                  desc: 'تدشين المنصة في المحافظات التجريبية (صنعاء، ذمار، إب) بالتعاون مع المزارع النموذجية ونقابة الأطباء البيطريين.',
                  status: 'مرحلة الإطلاق الوطني',
                  color: 'border-indigo-500/40 bg-indigo-950/20'
                }
              ].map((phase, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${phase.color} space-y-2`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-slate-900 text-slate-200 text-xs px-3 py-1 rounded-xl border border-slate-700 font-mono font-bold">
                        {phase.weeks}
                      </span>
                      <h4 className="text-sm font-bold text-white">{phase.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-slate-900/90 px-3 py-0.5 rounded-full border border-emerald-900">
                      {phase.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
