# حالة متطلبات V19.5

| المجال | الحالة داخل V19.5 المحلية | ملاحظة |
|---|---|---|
| تسجيل العميل/المزرعة والاعتماد | منفذ | الاعتماد ينشئ حساب Farmer وربط تواصل |
| صلاحيات حسب الدور | منفذ للاختبار المحلي | Auth/MFA المركزي مطلوب للإنتاج |
| Staff/Veterinary Directory | منفذ | يحتاج ربط موارد بشرية/رواتب إنتاجية عند النشر |
| الدردشة النصية | منفذ | محلية ضمن حالة التطبيق |
| صور/فيديو/صوت/PDF | منفذ محلياً | Object Storage مطلوب للإنتاج |
| Voice-to-Data | منفذ عبر SpeechRecognition/Parser عند الدعم | مزود صوت متخصص اختياري للإنتاج |
| Case Management | منفذ | قابل للتوسعة إلى SLA أعمق |
| Farmer/Flock Timeline | منفذ جزئياً عبر Cases/Chat والطبقات السابقة | توحيد كل أحداث V8-V19 في Timeline واحد مرحلة لاحقة |
| Catalog CRUD | منفذ | أرشفة بدل حذف عند وجود معاملات |
| SAR/YER Old/YER New | منفذ | Live FX خارجي غير مربوط |
| Price History | منفذ | محلي |
| Supplier 360 | منفذ | ربط ERP خارجي إن وجد مرحلة نشر |
| Batch/Lot Tracking | منفذ | محلي |
| Stock Reservation | منفذ | يمنع الحجز فوق المتاح في المنطق المحلي |
| Procurement | منفذ كأساس Workflow | المقارنة المتقدمة للمناقصات قابلة للتوسع |
| Product Recall | منفذ | إرسال تنبيهات خارجية يحتاج provider |
| Cold Chain log | منفذ | IoT live sensors غير موصولة |
| Vet Scheduling | منفذ | Calendar خارجي غير مطلوب للاختبار |
| Complaints/Disputes | منفذ | يرتبط بالحالات |
| Multi-Level Approvals | منفذ | قواعد المؤسسات قابلة للتهيئة أكثر |
| Digital Signature/Audit | منفذ كتوقيع/اعتماد تشغيلي | توقيع قانوني PKI يحتاج مزوداً معتمداً |
| Document Center | منفذ | Object storage خارجي مطلوب للإنتاج |
| Contract/license expiry checks | منفذ عبر Data Quality foundation | تنبيه Push خارجي يحتاج provider |
| Fraud/anomaly rules | منفذ كأساس Rules | ML fraud model غير مطلوب حالياً |
| Unified Notifications | منفذ داخل التطبيق | Push/WhatsApp/SMS تحتاج مزودين |
| Emergency Mode | منفذ | تكامل النقل الخارجي يحتاج مزودات |
| Inventory Forecast | منفذ حسابياً | دقة التنبؤ تتحسن بالبيانات التاريخية |
| Data Quality Center | منفذ | قابل للتوسعة بقواعد إضافية |
| Backup/Export | منفذ محلياً | Disaster Recovery حقيقي يحتاج تخزين خارجي |
| Audit Center | منفذ | DB append-only/WORM مطلوبة للإنتاج الحساس |
| Global Search | منفذ | البحث الإنتاجي يمكن نقله لمحرك DB/Search |
| AI Governance | منفذ | يحتفظ ببيانات القرار داخل state المحلي |
| WhatsApp الحقيقي | نقطة تكامل فقط | يحتاج WhatsApp Business provider |
| الخرائط الحقيقية | نقطة تكامل فقط | يحتاج Maps provider |
| بوابة الدفع/Escrow الحقيقية | نقطة تكامل فقط | يحتاج مزود دفع/تسويات |
| AI Necropsy Vision الموثوق | غير مكتمل إنتاجياً | يحتاج نموذجاً بيطرياً متحققاً وبيانات تدريب |
| تنبؤ وبائي 72 ساعة مضمون | غير مزعوم | Bio-Radar الحالي risk-signal engine فقط |
