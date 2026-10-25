# ملخص تنفيذ V20.2.7

## اسم الإصدار
**V20.2.7 — Windows Completion & Enterprise Control Closure**

تم البناء مباشرة فوق V20.2.6 مع تطبيق Preservation Contract على كامل خط الأساس، وليس فقط على الملفات التي نعتقد أنها مهمة.

## ما تم إغلاقه وظيفيًا

### الأمن والجلسات
- أصبحت المسارات الحساسة في STAGING/PRODUCTION تعمل بمنطق Bearer-first مع إبقاء توافق التطوير فقط عند الحاجة.
- تمت إضافة Refresh Sessions دوّارة؛ لا يتم حفظ Refresh Token الخام، وإنما SHA-256 hash فقط.
- تدوير Refresh Token يبطل السابق، وإعادة استخدام token قديم مرفوضة في الاختبار.
- تمت إضافة Device Sessions وإلغاء الجلسة، ومؤسسة MFA enrollment/verification metadata.
- واجهة Windows/Web في البيئات التي تتطلب المصادقة تعرض Enterprise Login بدل الاعتماد على local account switch كحد أمني.
- عميل API يضيف Bearer تلقائيًا ويحاول Refresh واحدًا عند 401.
- عند تفعيل مصادقة الخادم في Production/Staging لا يتم استخدام localStorage/IndexedDB للـenterprise state كمصدر حقيقة بديل.

### الصلاحيات والإدارة
- Permission taxonomy أدق للمنظمة، الأمن، الطب البيطري، المالية، المشتريات، المخزون، المصنع، HR، المستندات، الإشعارات، التقارير، Localization وOffline.
- Organization lifecycle audit لعمليات create/update/suspend/reactivate/transfer/scope change.

### الطب البيطري والمخزون الدوائي
- Approved doctor leave يمكن أن ينشئ Backup/On-call coverage مؤقتًا اعتمادًا على Assignments الموجودة.
- Veterinary KPIs مشتقة من Assignments/Cases/Consultations/Labs/Follow-ups.
- Medication Order أصبح قادرًا على صرف Lot فعلي من المخزون مع quantity/cost/inventory movement، بدل بقاء العلاج منفصلًا عن المخزون.

### المالية وربحية القطيع
- Accounting Periods: create/close/reopen.
- Bank Reconciliation.
- Budget records وApproved FX rate records.
- Configurable Flock Finance Rules/Events تنشئ قيودًا مزدوجة متوازنة.
- Farm/Flock profitability من الأحداث المربوطة ماليًا، مع Revenue/Cost/Profit/Cost per Bird/Cost per Live Kg.

### المشتريات والموردين
- Three-Way Match بين PO وGoods Receipt وPurchase Invoice.
- Supplier Scorecard مشتق من تاريخ التوريد والنقص والتالف والمرفوض.
- Procurement Claims للنقص/التالف/الجودة/السعر/التأخير وغيرها.

### المخزون
- Cycle Count ثم Approval/Post لإنشاء Adjustment عند الحاجة.
- Quarantine للـLot ثم Release أو Reject بقرار مدقق.
- الاستفادة من Lot/Expiry الموجودة سابقًا بدل بناء مخزون موازٍ.

### مصنع الأعلاف
- QC للمواد الخام أو Production Batch.
- Least-Cost Formulation foundation يستخدم تكاليف المواد، الحدود الدنيا/العليا والقيم الغذائية المستهدفة. لا يحل محل اعتماد أخصائي التغذية.
- Production Plan يحسب Recommended Production من Demand + Safety Stock - Finished Stock.

### الموارد البشرية والعقود
- Employee Compensation Contract Renewal/versioning مع حفظ العقد السابق.
- Managed Business/Office Contract Renewal/versioning مع نقل ارتباط الوحدة/المزارع إلى العقد الجديد.
- Workforce KPIs مشتقة من Assignments/Attendance/Field Visits/Overtime/Tasks/Payroll.
- Payslip Snapshot مدقق من Payroll Line.

### المستندات والإشعارات والتقارير
- Unified Document Index فوق Evidence infrastructure السابقة.
- Notification Delivery lifecycle لكل in-app/push/email/SMS/WhatsApp: queued/sent/acknowledged/failed.
- Report Schedule execution فوق V20.2.6 snapshots/schedules.
- Arabic/English preference + RTL/LTR.
- Offline Queue مع idempotency لمنع تكرار نفس العملية عند retry/sync.

## واجهة Windows/Web
أضيفت لوحة V20.2.7 داخل Enterprise Workspace، بالإضافة إلى Enterprise Login للبيئات التي تفرض المصادقة. تم كذلك إصلاح خطأين TypeScript موروثين في Workforce/Vet UI ظهرَا أثناء فحص المصدر، بدون إزالة أي وظيفة سابقة.

## الاختبار المتكامل
سيناريو V20.2.7 يغطي:
Refresh rotation → office + managed contract → farm → doctor/leave/backup coverage → medication lot dispense → flock feed cost + sale → profitability → period close → bank reconciliation → budget/FX approval → PO/receipt/invoice three-way match → supplier scorecard/claim → cycle count → quarantine/release → factory QC → least-cost formula → production plan → payroll/payslip → employee contract renewal → business contract renewal → veterinary/workforce KPI → evidence index → notification lifecycle → report execution → localization → device/MFA state → offline idempotency.

النتيجة: **PASS** و `validation_issues = 0`.

## Regression
اختبارات V20.2.1 وV20.2.2 وV20.2.3 وV20.2.4 وV20.2.5 وV20.2.6 وV20.2.7 جميعها PASS بعد الدمج.

## Preservation
يتم القياس ضد النسخة الكاملة V20.2.6. يجب أن تبقى جميع ملفات ومسارات APIs وTypeScript exports السابقة موجودة، وأي تعديل على ملف سابق يجب أن يكون ضمن allow-list محددة.

## Production boundary
الإصدار لا يُسمى Production Hardened. Object Storage الحقيقي، malware scanning، مزودات MFA/SMS/WhatsApp/Email/Push، DB migrations/locking، backup/DR، monitoring، load/security testing وdependency-backed Vite build النهائي تبقى ضمن V20.2.8. كذلك لا يتم وصف least-cost formulation على أنه اعتماد تغذية آلي؛ القرار النهائي يبقى بشريًا.
