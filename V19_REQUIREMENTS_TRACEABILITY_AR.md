# مصفوفة تتبع متطلبات Smart Poultry Platform V19.1

هذه الحزمة مبنية فوق V18 كاملة. الغرض من هذا الملف هو منع اعتبار وجود اسم ملف دليلاً كافياً على تنفيذ الميزة؛ كل بند يوضح مكان التنفيذ الفعلي أو الجسر الذي يعيد استخدام قدرات V18 السابقة.

## 1) القيادة والسيادة التشغيلية
- مركز المدير العام/CEO: `src/components/admin/SovereigntyOperationsV19Tab.tsx` + `src/modules/admin/MasterControlCenter.tsx`.
- مصفوفة تصعيد الأزمات: `src/modules/executive/ExecutiveCommandEngine.ts`.
- RBAC للمالك/CEO/المالية/البيطرة/الفروع/المزارع: `src/modules/governance/RBACPermissions.ts` مع الحفاظ على `AdminAccessControlTab.tsx` و`governance_roles_v16`.
- مركز القيادة السابق V18 محفوظ: `src/components/admin/EnterpriseCommandV18Tab.tsx`.

## 2) الأطباء والميدان
- الطبيب المسؤول وربط المزارع: قدرات V18 في `assigned_vet_farms_v18` و`VetLabWorkflowV18.tsx`.
- شبكة الأطباء المستقلين On-Demand: `FreelanceVetV19` + `chooseFreelanceVet` داخل `AILogisticsRoutingEngine.ts` + API `/api/v19/field-vets/assign`.
- التشريح ومساعد القرار البيطري: محفوظ من `NecropsyWizardModal.tsx`, `AIVeterinaryGuidanceModal.tsx`, `ai_diagnostic_assessments_v14`.
- القرار الطبي النهائي Human-in-the-Loop: V18 config + V19 RBAC/escalation/chat guards.
- التسجيل الصوتي باللهجة اليمنية: `src/modules/ai/VoiceAgentHandler.ts` + `MediaDataParser.ts`.

## 3) الدردشة والتنسيق الميداني
- Chat نص/صوت/صورة/فيديو: نماذج `FieldChat*V19` + `AIChatCoordinator.tsx`.
- استخراج النافق/الحرارة/الرطوبة/الوزن/العلف/الماء: `MediaDataParser.ts`.
- تصعيد الحالات المعقدة والاستشاريين: `EmergencyConsultationEngine.ts`.
- لا يصدر Chat/AI وصفة علاجية نهائية تلقائياً.

## 4) الأسواق والمكاتب والشركاء
- المكاتب والأسواق القابلة للتفعيل/الإيقاف والتوسع: `market_offices` في `sovereignty_v19` وواجهة V19.
- فروع الشركات: `partner_branches` تشمل أدوية/لقاحات/أعلاف/معدات/صيصان/مختبرات وإحداثيات وحالة سلسلة تبريد.
- وظائف الفروع والأسعار والعملاء السابقة V16-V18 محفوظة.

## 5) الذكاء اللوجستي والمخزون
- التدقيق اليومي: `buildDailyInventoryAttestationsV19`.
- تحقق لحظة الطلب: `buildRealtimeStockCheckRequestV19`.
- اختيار الفرع حسب المحافظة/المديرية/المسافة/التبريد/المخزون: `routeLogistics`.
- بدائل الأصناف مع بوابة الطبيب عند المطابقة السريرية: `findAlternatives` ومسار `alternative_offered`.
- الأصناف الحرجة وسلسلة التبريد لا تمر بين المحافظات تلقائياً دون مراجعة.
- API: `/api/v19/logistics/route`, `/api/v19/inventory/attestations`.

## 6) سوق الكتاكيت والتسويق
- الفقاسات والسلالات والأسعار اليومية والعملات الثلاث: `hatcheries`, `chick_marketing_prices`.
- فلترة العروض المنشورة والمربحة: `src/modules/hatchery/HatcheryMarketplaceEngine.ts`.
- API للعروض: `/api/v19/hatchery/offers`.
- منظومة V18 للحجز الإقليمي للكتاكيت محفوظة (`hatchery_prices_v18`, `chick_reservations_v18`).

## 7) السياسة المالية والعملات والربحية
- Profit/Commission policy: `financial_policy` + `FinancialPolicyEngine.ts`.
- أسعار الصرف: `fx_rates` مع شرط الاعتماد.
- فحص ربحية المسار/الصفقة: `profitabilityGuardV19` + API `/api/v19/finance/profitability-check`.
- المحاسبة السابقة V16/V17 محفوظة: journal, branch accounting, settlements, print documents.

## 8) العقود والضمان والتسليم
- Escrow والعقود: `escrow_contracts` + `EscrowPODSettlementEngine.ts`.
- POD: `proof_of_delivery`; المطابقة تولد مستند تسوية، والفرق يتحول `discrepancy`.
- API `/api/v19/pod/:id/confirm` يستخدم محرك التسوية الفعلي.
- التوقيعات والعقود السابقة V13/V17 محفوظة.

## 9) الجودة والدواجن الصحية
- Healthy Poultry certificate: `HealthyPoultryLabel.tsx`.
- بوابات المختبر/فترة السحب/السموم/توقيع الطبيب/الصلاحية: `healthyLabelGateReasonsV19`.
- QR public payload بدون بيانات مالية: `PublicQualityVerification.ts` + `/api/v19/quality/:qrCode`.
- Digital Passport السابق محفوظ من V8-V18.

## 10) الأمان الحيوي والنقل
- تصريح النقل الرقمي: `BiosecurityTransitEngine.ts`.
- لا يُفعّل مع تعقيم غير موثّق أو انتهاء الصلاحية أو حظر وبائي حرج.
- API `/api/v19/biosecurity/transit/validate`.
- قوائم الأمان الحيوي والخرائط السابقة محفوظة.

## 11) الرادار الوبائي والإنذار المبكر
- `BioRadarEngine.ts` يجمع الإشارات، المخاطر، الثقة، المحافظات المتأثرة وإجراء الوقاية.
- `buildPreventiveBroadcastV19` يخرج رسالة وقائية وليس تشخيصاً مؤكداً.
- V18 geo outbreak alerts وV13 early disease signals محفوظة.

## 12) Digital Twin والتسعير والاستثمار
- Digital Twin: `DigitalTwinSimulator.tsx` مع الوزن/FCR/توفير العلف؛ نتيجة إرشادية فقط.
- Dynamic Pricing: `DynamicPricingEngine.ts` يوازن العرض/الطلب/النقل/FX وحد الربح، والنشر يحتاج اعتماد.
- Corporate Investment Advisor: `CorporateInvestmentAdvisor.ts` + `/api/v19/ai/investment-signals`.

## 13) HR Marketplace والهيكل الإداري
- إدارة العمال الموجودة: `WorkerManagementView.tsx`, recruitment pipeline V11, staff KPI/payroll V13, field staff V16, farm labor V18.
- جسر سوق العمل المفتوح: `src/modules/hr/PoultryHRMarketplaceBridge.ts` للمطابقة حسب الدور والمحافظة والتحقق والتوفر.

## 14) Offline-First
- طبقة V15 IndexedDB/Offline Queue لم تُستبدل حتى لا تنشأ مخازن محلية متوازية.
- سياسة عمليات V19: `src/modules/offline/OfflineFieldPolicy.ts` مع idempotency/conflict policy.

## 15) الواجهة الاحترافية
- مركز V19 موحد إلى 7 مجالات تشغيلية داخل `SovereigntyOperationsV19Tab.tsx`.
- Hero/metrics/status badges/responsive enterprise panels في `src/index.css`.
- `MasterControlCenter.tsx` يطبق Permission Gate قبل إظهار القيادة.
- واجهات V8-V18 السابقة لم تُحذف؛ V19 أضيف كقسم قيادة فوقها.

## ملاحظة إنتاجية
تكاملات WhatsApp الفعلية، Push provider، خرائط المسافات الخارجية، بوابات الدفع، التخزين السحابي للوسائط، أجهزة IoT، وأسعار الصرف الحية تتطلب مفاتيح وخدمات مزودين خارجيين عند النشر. الحزمة الحالية تحدد منطق التطبيق والحوكمة ونقاط التكامل ولا تزعم وجود حسابات مزودين غير مضافة للمشروع.

## 16) Patch V19.3 — إدارة الشبكة وعقود المخازن وبوابة العميل
- المحافظات الديناميكية: `governorates` داخل `SovereigntyV19State` + CRUD في `SovereigntyOperationsV19Tab.tsx`.
- الأسواق/المكاتب: إضافة/تفعيل/إيقاف/حذف مع حماية سجلات POD من الحذف الكاسر للتدقيق.
- المخازن المتعاقدة: `warehouses` + `warehouse_contracts`; المخزن يبدأ `pending_contract` ولا يصبح `active` إلا بعد عقد `approved` وساري.
- بوابة العميل: `FarmerApp.tsx` لم تعد تستخدم إطار هاتف أو قيم 4G/09:41؛ الواجهة Responsive كاملة.
- المساعد البيطري: يفتح دائماً من `Header` ومن زر مباشر داخل بوابة العميل؛ إذا كان الاتصال الخارجي بالـAI متوقفاً يعمل Local Safe Advisor ولا يصبح الزر صامتاً.
