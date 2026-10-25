# Smart Poultry Platform V20.2.7 — Windows Completion & Enterprise Control Closure

**Current Windows/Web development baseline:** V20.2.7, built cumulatively over V20.2.6 while preserving the accepted V8–V20.2.6 functionality. Android remains deferred until V20.2.8 Production Hardening is complete.

V20.2.7 closes major Windows application-control loops: Bearer-first production/staging security, rotating refresh sessions, device/MFA state, granular permissions, veterinarian leave coverage, medication-lot inventory linkage, accounting-period/bank reconciliation controls, flock financial event mapping and profitability, three-way procurement matching, supplier scorecards/claims, inventory cycle count/quarantine, factory QC/least-cost formulation/production planning, HR and managed-contract renewal, KPI derivation, payslip snapshots, unified evidence indexing, notification/report execution lifecycle, localization preference and idempotent offline commands.

Release documents: `MASTER_REQUIREMENTS_V20_2_7.md`, `V20_2_7_REQUIREMENTS_STATUS.md`, `V20_2_7_IMPLEMENTATION_SUMMARY_AR.md`, `V20_2_7_END_TO_END_TEST_REPORT.txt`, `V20_2_7_VALIDATION_REPORT.txt`, `V20_2_7_PRESERVATION_AUDIT.txt`, `V20_2_7_SOURCE_CHECK_REPORT.txt` and `V20_2_7_BUILD_REPORT.txt`.

> V20.2.7 is functionally implemented at the application/control layer but is **not yet production-hardened**. Production database migrations/locking, external providers, object storage/malware controls, DR/monitoring/load certification and a dependency-backed production build belong to V20.2.8.

---

# V20.1 — Architecture & Flock Ledger

هذه نسخة تراكمية فوق V19.7 ولا تحذف الوحدات السابقة. أضيف نظام Master Requirements/Patch Packs/Preservation Contract، وأول حزمة تشغيلية V20 الخاصة بسجل القطيع والمصالحة والتقارير.

- Master requirements: `docs/v20/MASTER_REQUIREMENTS_V20.md`
- Preservation baseline: `docs/v20/PRESERVATION_BASELINE_V19_7.json`
- V20 requirements status: `docs/v20/V20_1_REQUIREMENTS_STATUS_AR.md`
- Architecture distribution: `docs/v20/V20_ARCHITECTURE_DISTRIBUTION_AR.md`
- Preservation check: `node scripts/v20/preservation-check.mjs`
- Flock ledger semantic test: compile `src/modules/v20/EnterprisePoultryCoreV20.ts` then run `scripts/v20/semantic-test.cjs`.

> لا تعتبر تكاملات WhatsApp/Realtime/GPS attestation/Payment/STT/AI Vision مفعلة إنتاجيًا قبل إضافة مزودات ومفاتيح حقيقية.

---

# Smart Poultry Platform V19.7 — Managed Operations & Broker Marketplace

الإصدار الحالي: **1.9.7 / Android versionCode 197**.

V19.7 ترقية تراكمية فوق V19.6 ولا تحذف أي ملف من النسخة السابقة. تضيف مسارين منفصلين: **Marketplace Customer** للمشتري العادي، و **Managed Farm Customer** للمزارع المتعاقدة التي تدير المنصة دورة قطيعها من التجهيز حتى البيع والتسوية. كما تحول السوق من مفهوم مخزون تملكه المنصة إلى **Supplier Availability Network**، وتضيف التشغيل اليومي للعمال، قرار الطبيب المدعوم بالذكاء الاصطناعي، المشتريات والموافقات، أوامر الشراء والاستلام، Cost Center لكل قطيع، التسويق والبيع، غرف تشغيل متخصصة، وسجل تدقيق زمني كامل.

راجع `V19_7_MANAGED_OPERATIONS_AR.md` و`V19_7_REQUIREMENTS_STATUS_AR.md` و`V19_7_PRESERVATION_AUDIT.txt` و`V19_7_VALIDATION_REPORT.txt`.

> ملاحظة إنتاجية: WhatsApp/SMS/Push، الخرائط والمسافات الحقيقية، بوابات الدفع، Object Storage، STT/AI Vision، IoT وLive FX تتطلب مفاتيح وحسابات مزودي الخدمة. V19.7 تبقي هذه التكاملات ضمن المسارات المعمارية السابقة ولا تدّعي اتصالاً خارجيًا بدون Credentials.

---

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ca8589b3-5b38-416b-8f0c-19fa8421f47c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Smart Operations expansion (September 2026)

This prototype now includes an integrated smart-operations layer on top of the original AI Studio implementation:

- Withdrawal-period marketing gate linked to flock prescriptions and harvest-safe dates.
- Safety eligibility badge for marketing after withdrawal completion / no active antibiotic withdrawal.
- Customer credit limits, debt ledger state, over-limit blocking and explicit admin override.
- Emergency field dispatch requests carrying the farm GPS position and flock context.
- Admin Smart Operations Center for sale queues, credit, emergency dispatch, regional pricing, chick exchange, ratings and notifications.
- Configurable SAR/YER-old/YER-new exchange settings with governorate-based display rules.
- Zone-level transport, field-visit and marketing fees, including pending pricing for unknown locations.
- Daily chick exchange (strain/company/price) visible to customers and administrators.
- In-app notification records for daily prices, outbreak warnings, debt reminders and service updates.
- Product imagery surfaced on medicine, feed and equipment cards.

### Prototype boundaries

Operational state is currently persisted in browser localStorage for demonstration. This is not a production security boundary. Production rollout still requires authenticated server-side RBAC, a real database, object storage for uploads, auditable financial ledgers, FCM/APNs push delivery, and verified payment-provider integrations.

## V4 Operations / Finance / Clinical Triage
تتضمن هذه النسخة دورة شراء وحوالات ومراجعة مالية، فروع ومناطق وتكاليف/أجور، إشراف بيطري، حالات مرضية مستقلة، توجيه للمداوم، مختبرات وأخذ عينات، توظيف، ومكتبة صور تشريحية معتمدة من الإدارة. راجع `DEVELOPMENT_UPDATE_V4_AR.md` للتفاصيل.


## Android
المشروع مهيأ الآن للتحويل إلى تطبيق Android عبر Capacitor. راجع `ANDROID_BUILD_AR.md` ثم شغّل `setup-android.bat` على Windows أو `setup-android.sh` على macOS/Linux.

---

## V11 — Enterprise Operations Complete

أضيف مركز **تشغيل V11 الكامل** داخل لوحة الإدارة ويغطي جميع محاور ما قبل الإطلاق: Backend/Offline، RBAC، المخزون والفروع، دورة الطلب والتوصيل، المختبر والمضادات، AI Stateful، تحليل الصور والصوت، رادار الأوبئة، سجل الأسعار، المالية، الشركات، الموارد البشرية، حملات FCM، الموافقات، Security Production، System Owner، واختبارات الإطلاق.

راجع `V11_FEATURE_AUDIT_AR.md` للتدقيق التفصيلي وما يحتاج تفعيل خدمات خارجية قبل الإنتاج.

## V12 — AI Poultry Sales Advisor & Commercial/Clinical Contracts
تضيف V12 مستشار دواجن وبيع متقدم، عقود الشركات والمكاتب وعروض الخصم، عقود المسوقين والأسعار اليومية وشروط النافق والسداد، نموذج 60% مقدم + 40% آجل، عقود الإشراف المرتبطة بالطبيب والتقارير اليومية، وعقود المختبرات والفحوص والأسعار والخصومات. راجع `V12_FEATURE_AUDIT_AR.md` للتفاصيل وحدود التشغيل الإنتاجي.

## V13 — Farm Management & Predictive Operations
أضيفت طبقة إدارة المزارع المؤسسية: عقود الإدارة الشاملة، بوابة العميل، التقارير اليومية، الحضور والرواتب، تسويق وتوزيع الدواجن، سجل الشفافية وموافقات المصروفات، التنبؤ بالوزن وموعد البيع، الإنذار المبكر، Auto-Reorder، تقييم الموردين، IoT/Remote Audit، العقود الرقمية وتصفية الأرباح.

راجع `V13_FEATURE_AUDIT_AR.md` لمعرفة ما يعمل داخل النموذج حالياً وما يحتاج خدمات Cloud/Auth/Storage/FCM/Payments/IoT خارجية قبل الإطلاق التجاري.

## V14 — Field Veterinary Diagnostics & Production Cloud Control
أضيفت مساحة الطبيب الميداني داخل لوحة الطبيب لجمع بيانات القطيع والبيئة وGPS والصور والصوت والعمل أوفلاين، مع محرك دعم قرار تشخيصي محافظ، تصعيد الحالات للاستشاري، تقارير إغلاق الحالات، جدول التحصين والأمان الحيوي، ولوحة إدارة للبنية السحابية والمصادقة وتخزين الوسائط. كما أضيفت APIs خاصة بالزيارات والتصعيد وجاهزية السحابة.

راجع `V14_FEATURE_AUDIT_AR.md` لمعرفة ما تم تنفيذه فعلياً وما يحتاج خدمات Cloud/AI خارجية قبل الإنتاج.

## V15 — Enterprise ERP Scale-Up
أضيفت طبقة V15 للتوسع الميداني والمؤسسي: IndexedDB للأوفلاين وتخزين الوسائط، إدارة تعارض ومزامنة، حلقة تحقق الطبيب لتغذية بيانات المعايرة، Predictive Analytics، حاسبة تركيبات علف، قوائم أمان حيوي مرتبطة برادار الأوبئة، دعم Android Bluetooth SPP للطابعات الحرارية والموازين، Google Play In-App Update، استيراد/تصدير XLSX وCSV، ولوحة Executive Dashboard موحدة.

راجع `V15_FEATURE_AUDIT_AR.md` للتفاصيل الفنية وحدود التكامل الخارجي قبل الإنتاج.

---

## V16 — القيادة المؤسسية والميدان وCRM
أضيف في V16 قسم **القيادة والميدان V16** داخل لوحة الإدارة ويشمل Owner War Room، الحوكمة متعددة المستويات، القيود والذمم، شبكة شركات وفروع، الأسعار الإقليمية، AI Smart Routing بعد الاعتماد الطبي، Customer 360، CRM/Sales Targets، GPS/Geofencing، التفتيش الرقمي، وWhatsApp Communication Hub. راجع `V16_FEATURE_AUDIT_AR.md` للتفاصيل وحدود التشغيل الإنتاجي.


## V17 — التسويق والتسويات والتوجيه التتابعي
أضيفت دورة بيع القطيع عبر سعر البورصة ثم مسؤول المبيعات ومكاتب التسويق بالتتابع، والتسوية المالية مع التحقق من مبلغ المكتب قبل تحويل صافي العميل، وتوجيه الموردين للعلاجات/الأعلاف/الكتاكيت/المعدات، وتوجيه التقارير حسب التخصص، وإيجار العنابر بعقود ضمان تحصيل. راجع `V17_FEATURE_AUDIT_AR.md`.


## V19 — Complete Operational & Supply Chain Sovereignty
أضيف **مركز السيادة التشغيلية V19** كواجهة احترافية موحدة داخل لوحة الإدارة، ويغطي: CEO Command Center، المكاتب والأسواق، شبكة الأطباء المستقلين، فروع الشركاء، Hybrid Inventory Verification، AI Logistics Routing، Alternative Product Engine، Healthy Poultry Label، QR Verification، Biosecurity Transit Permits، Epidemic Early Warning، Smart Field Chat، AI Data Parser، Emergency Consultation، Hatchery & Chicks Marketplace، Financial Policy & FX، Smart Escrow، POD، المستندات المالية، Digital Twin، Dynamic Pricing، Predictive Bio-Radar، Voice AI وCorporate Investment Signals.

تم كذلك إضافة طبقة معمارية واضحة داخل `src/modules/` للوحدات الرئيسية المحددة في مخطط V19. جميع القرارات الطبية النهائية تبقى تحت اعتماد الطبيب، والقرارات المالية الحساسة تحت صلاحيات الإدارة، ولا يسمح لمحركات AI بتجاوز الحوكمة البشرية.

راجع `V19_FEATURE_AUDIT_AR.md` للمصفوفة الكاملة.

## V19.1 — Full Integrated Operational Sovereignty
V19.1 is an additive upgrade over the complete V18 tree. It introduces operational domain modules for logistics, inventory attestation, field-vet assignment, Healthy Poultry certification, biosecurity transit, field chat parsing/escalation, hatchery offers, FX/profit policy, Escrow/POD settlement, epidemic radar, Digital Twin, dynamic pricing, corporate investment signals, offline policy, HR matching, and executive escalation. See `V19_REQUIREMENTS_TRACEABILITY_AR.md` and `V19_FULL_REBUILD_AUDIT.txt`.

## V19.4 — Platform Experience & Closed-Loop Foundation
- Professional unified shell/navigation/buttons/logo.
- Welcome experience + application settings + back/forward navigation.
- Customer/Farm onboarding with self-registration and admin approval.
- New Customer/Farm/Flock identifiers and duplicate guard.
- Admin registration review panel.
- Operational Lifecycle center: Unified Cases, Batch/Lot, multi-level approvals and audit foundation.
- V18/V19 functionality remains preserved; this is an additive development layer.

## V19.5 — Operational Completion & Enterprise Workflow
- Role-aware operational accounts and guarded navigation for local testing.
- Field communication workspace for worker → supervisor → veterinarian → consultant with text/media and field-data parsing.
- Staff/Veterinary Directory, Supplier 360, unified catalog, SAR/YER-old/YER-new pricing and price history.
- Batch/Lot inventory, reservation, procurement, recall, cold-chain records and stock forecasting.
- Unified Case Management, complaints, veterinary appointments, multi-level approvals, document/signature center and notifications.
- Global search, audit trail, data-quality checks, fraud-rule checks, emergency mode, backup/export, support tickets and AI governance.
- Customer approval now provisions a farmer account and farm communication room.
- V18/V19/V19.4 functionality remains preserved as an additive base.

راجع `V19_5_OPERATIONAL_COMPLETION_AR.md` و`V19_5_REQUIREMENTS_STATUS_AR.md` للحالة الدقيقة وحدود التكامل الخارجي قبل الإنتاج.

## V19.6 — Preservation & Financial Command Center

V19.6 is a cumulative upgrade over V19.5. It restores the administration/manager experience as the default enterprise entry point while keeping every V8–V19.5 source file. It adds a dedicated **Finance & Contracts** workspace and a structured company hierarchy: **Company → Contract → Branch → Warehouse → Product/Price/Stock**.

Key additions:
- Dedicated Financial Command Center: treasury, cash/bank/exchange accounts, receipts, payments, sales/purchase invoices, transfers, debts/credit, general journal, contracts and daily oversight.
- Double-entry journal logic for financial documents created in V19.6.
- Financial no-hard-delete policy at the V19.6 data model level.
- Company onboarding and contract signing before warehouse activation.
- Role specialization and executive oversight model.
- Separate top-level Finance & Contracts navigation entry.
- V19.5 Supplier 360 / Catalog / Inventory data is migrated into V19.6 without deleting the original V19.5 structures.
- Bundled demonstration customer identity is no longer shown as the signed-in person on startup.

External production providers (real payment rails, live FX, WhatsApp/SMS/push, maps, cloud object storage, MFA/OTP and IoT) still require deployment credentials and provider accounts. The application contains the workflow, state, governance and provider integration points; it does not embed third-party secrets.

## V20.2.5 — Workforce, Payroll & Managed Business Operations
أضيفت طبقة قوى عاملة ورواتب مترابطة مع Business Units والمزارع والمصنع والمالية: Employee 360، عقود تعويض متعددة النماذج، Assignments، Attendance/Field Visits، Leave، Employee Advances، Payroll periods/calculation/approval/payment، Cost Allocation، Sales Commission rules، Factory Direct Labor، Transport Cost، Employee Documents، Workforce Dashboards و21 API جديدة. جميع الوظائف السابقة من V8–V20.2.4 محفوظة وفق Preservation Contract. راجع `MASTER_REQUIREMENTS_V20_2_5.md` و`V20_2_5_REQUIREMENTS_STATUS.md` للحالة الدقيقة والقيود قبل الإنتاج.

## V20.2.6 — Executive Intelligence, Reports & Business Control
V20.2.6 adds a derived command-and-control layer over the existing farm, veterinary, multi-business, finance, inventory, factory and workforce sources. It includes an Executive Command Center, business-unit profitability, AR/AP aging, cash position, inventory/factory/veterinary/workforce intelligence, a unified Exception Command Center, data-quality/reconciliation controls, report snapshots/schedule definitions and source drill-down. KPIs are derived from source ledgers/records rather than persisted as a second accounting or inventory truth. See `MASTER_REQUIREMENTS_V20_2_6.md`, `V20_2_6_REQUIREMENTS_STATUS.md` and `V20_2_6_IMPLEMENTATION_SUMMARY_AR.md`.


## V20.2.9 Farm Windows Control Center R6 — Role Completion

R6 is cumulative over Factory Production R3 + Farm R4 + Farm Windows R5. It adds responsibility-based Windows workspaces and connected handoffs for executive, regional manager, farm owner, farm manager, supervisor, worker, veterinarian, consultant, vet assistant, laboratory, accountant, inventory support, supplier, commercial, and support roles.

Critical operational chain: Worker daily close -> Supervisor review -> calculations/AI flags -> Veterinarian decision -> next-day worker/lab tasks -> Manager/Owner monitoring -> Accountant/Section 12 integration -> reports/printing. AI does not autonomously prescribe medication; final treatment and vaccination decisions remain veterinarian-authorized. Inventory remains owned by Section 7 and accounting by Section 12.

Run `npm run verify:farm-windows-r6` before a Windows build. On the target Windows machine use `windows\INSTALL_WINDOWS_PLATFORM.bat`; the installer will not declare success unless verification and the production Vite/esbuild build succeed. Android is intentionally deferred.

---
# AviNexus Poultry Enterprise — Windows R7 Customer / Office / Partner Consolidation

R7 is a cumulative Windows/Web consolidation over Factory Production R3 + Farm R4/R5/R6. It preserves earlier workflows while unifying customer journeys, canonical office IDs, companies/partners, branches and governorates, contract/version history, contracted price offers, laboratory pricing, hatcheries, feed mills, regional poultry markets, marketing offices, nearest-eligible-branch routing, procurement/receiving/accounting handoff visibility, AI/chat governance, and System Identity.

**Platform name:** AviNexus Poultry Enterprise / أفي نيكسس لإدارة الدواجن  
**Product Owner:** فارع الفارعي  
**Reference platform:** Windows/Web  
**Android:** deferred until Windows production closure.

Rules: Section 7 remains inventory owner; Section 12 remains accounting owner; veterinary medication/vaccine authorization remains human-veterinarian controlled. Historical prices/contracts are versioned and are not destructively overwritten.

---
# V20.2.9 Windows R8 — Factory Completion & Closure

R8 is **not a new department**. It is a broad Windows completion pass over the protected Factory Production R3 implementation and the preserved R7 platform.

Main additions:
- Factory role command layer for 16 operational responsibility profiles.
- 189 existing Factory screens remain preserved and governed.
- Role-specific responsibility, handoff and critical-screen mapping.
- Factory operational inbox for open purchasing, receiving, production, dispatch and matching work.
- Six critical end-to-end business chains: procurement, production, sales, HR/payroll, transport and final manufacturing cost.
- Deep-linkable Factory screen destinations using `factoryScreen`.
- Screen-level action contract with owner-workflow navigation, data/history navigation, export snapshot, printing and deep-link copy.
- Factory document/print center for PO, GRN, supplier invoice, work order, production actual, sales, customer statement, payroll, transport and official reports.
- Section-by-section Windows acceptance matrix explicitly separating source/UI readiness from visible Windows acceptance.
- Role responsibility matrix.
- Existing inventory/accounting/workforce/report/governance ownership remains unchanged: S7 / S12 / S11 / S14 / S15.

R8 deliberately does **not** mark the Factory as production-frozen merely because semantic tests pass. Final closure requires the target-Windows install/build plus visible testing of roles, screens, buttons, persistence, printing, reports and the end-to-end business chains.

Run `npm run verify:factory-windows-r8` before the Windows production build.
