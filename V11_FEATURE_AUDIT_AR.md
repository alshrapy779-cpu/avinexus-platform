# تدقيق V11 — جميع إضافات التطوير المقترحة

تم بناء V11 فوق V10 مع الحفاظ على جميع الملفات والميزات السابقة. هذه الوثيقة تربط كل اقتراح بالتنفيذ الموجود في الكود، وتوضح بصدق ما هو تشغيل محلي/فعلي وما يحتاج خدمة خارجية قبل الإنتاج.

## النتيجة المختصرة

- جميع الاقتراحات العشرين ممثلة في الكود والواجهة ومنطق البيانات.
- لم يُحذف أي ملف من V10.
- تمت إضافة مركز إداري جديد: **تشغيل V11 الكامل**.
- تمت إضافة تخزين Backend تجريبي دائم بصيغة JSON مع نسخ احتياطية تلقائية وسجل Audit append-only للتطوير.
- خدمات الطرف الثالث لا يتم تزويرها: FCM، بوابات الكريمي/جيب المباشرة، قاعدة PostgreSQL/Firebase المُدارة، ونماذج التحليل الطبي للصوت/الصور تحتاج تفعيل خارجي واعتمادات حقيقية.

## 1. Backend + قاعدة البيانات + Offline-first
**منفذ:**
- `server.ts`: مسارات `/api/v11/enterprise` و`/api/v11/enterprise/sync`.
- تخزين دائم للتطوير في `runtime-data/enterprise-v11.json` عند تشغيل الخادم.
- كتابة آمنة عبر ملف مؤقت ثم rename.
- حفظ حتى 20 نسخة احتياطية تلقائياً.
- Audit log خادمي append-only بصيغة JSONL.
- `localStorage` يبقى fallback داخل Android/المتصفح عند عدم توفر الخادم.
- نموذج Backend قابل للتحويل لاحقاً إلى PostgreSQL/Firebase دون تغيير عقد الواجهة.

**قبل الإنتاج:** يجب استبدال JSON بقاعدة بيانات مُدارة وتخزين ملفات دائم.

## 2. تسجيل الدخول والصلاحيات RBAC
**منفذ:**
- صفحة صلاحيات الموظفين موجودة من V9/V10.
- مركز V11 يعرض حالة RBAC/MFA/مزود المصادقة.
- مسار تعديل V11 في الخادم يرفض الأدوار غير `system_owner/admin` كنموذج حوكمة.

**قبل الإنتاج:** يلزم Auth حقيقي وJWT/Session/Claims من Backend.

## 3. إدارة المخزون والفروع
**منفذ بالكامل كنموذج تشغيلي:**
- مخزون مستقل لكل فرع.
- Lot/Batch.
- تاريخ الصلاحية.
- الكمية الفعلية والمحجوزة.
- Reorder level.
- تكلفة الوحدة وسعر البيع.
- Low stock / Near expiry / Expired / Blocked.
- تحويل مخزون بين الفروع.
- الحجز التلقائي عند اعتماد دفع الطلب إذا توفرت الكمية.
- تنزيل المحجوز من المخزون عند التسليم.

## 4. دورة الطلب الكاملة
**منفذ:**
- رقم فاتورة.
- QR reference.
- Unpaid / Under review / Paid / Partial / Refunded.
- New → Priced → Accepted → Paid → Preparing → Ready → Out for delivery → Delivered / Cancelled / Returned.
- خصم ورسوم توصيل ومرتجع مهيأة في نموذج البيانات.
- ربط الطلب مع Purchase Request الأصلي.

## 5. التوصيل واللوجستيات
**منفذ:**
- تعيين مندوب/سائق.
- الفرع المسؤول.
- عنوان الوجهة وGPS قابل للحفظ.
- ETA.
- حالات الرحلة.
- إثبات التسليم/توقيع العميل في نموذج البيانات.
- إنشاء Delivery Assignment تلقائياً عند خروج الطلب للتوصيل.

## 6. Case Management الطبي
**منفذ:**
- كل حالة Case مستقلة.
- بيانات القطيع، النافق، الماء، العلف، الحرارة، الرطوبة، الأعراض، الصور، الصوت، التشريح.
- إسناد للطبيب/المشرف المتصل والمداوم.
- ربط المختبر بالـCase.
- استمرار Human-in-the-loop للقرار النهائي.

## 7. محرك المضادات الحيوية والسلامة
**منفذ:**
- سجل سلامة مضاد مستقل مرتبط بالوصفة والحالة والقطيع.
- سبب الاستخدام والطبيب والمادة الفعالة.
- رابط فحص الحساسية عند توفره.
- Meat/Egg withdrawal.
- Safe marketing date.
- Marketing lock.
- Antibiotic-free badge eligibility.
- QR trace code.
- المحرك السابق لمنع التسويق أثناء السحب ما زال محفوظاً.

## 8. المختبرات وسلسلة العينة
**منفذ:**
- Lab Test Order.
- نوع وعدد العينات.
- Requested by / Collected by / Collected at.
- Chain of custody.
- الاختبارات المطلوبة.
- التكلفة.
- Requested → Scheduled → Collected → Received → Processing → Completed.
- إنشاء طلب مختبر آلياً من الحالة عندما يوصي الفرز بذلك.

## 9. AI Stateful Conversation
**منفذ:**
- جلسة حوار مستقلة تحفظ Intent وCurrent step.
- Collected fields وMissing fields.
- لا يعاد سؤال ما تم جمعه في الجلسة المنطقية.
- ربط الجلسة بالحالة.
- Waiting customer / Waiting staff / Completed.
- عند رفع حالة جديدة تُنشأ جلسة متابعة تلقائياً.

## 10. تحليل الصور والصوت
**منفذ كنموذج قرار مساعد:**
- Media type.
- جودة الملف.
- التحقق من أن العضو/الهدف الصحيح ظاهر.
- Findings + Confidence.
- Needs retake.
- Clinician confirmation required دائماً للنتائج الطبية.

**قبل الإنتاج:** يحتاج نموذج Vision/Audio مُختبر ومُعاير؛ الواجهة لا تدعي التشخيص النهائي.

## 11. رادار الأوبئة المتقدم
**منفذ:**
- Cluster حسب المرض/المجموعة + المحافظة + المديرية.
- Suspected مقابل Lab confirmed.
- First/last seen.
- Risk level.
- Nearby farms count.
- Heat score.
- Prevention message.
- Broadcast state.
- عند وصول حالتين متشابهتين في نفس المنطقة يتم إنشاء/تحديث Cluster تلقائياً وإنشاء حملة تنبيه.

## 12. سجل الأسعار والبورصة
**منفذ:**
- سجل تاريخي حسب المحافظة والمديرية.
- فئات: دواجن حية، كتاكيت، أعلاف، أدوية، لقاحات، معدات.
- YER old / YER new / SAR.
- وزن الدواجن عند الحاجة.
- Approved by + Published.

## 13. التقارير المالية
**منفذ:**
- Gross Revenue.
- COGS.
- Delivery/Field costs.
- Gross/Net profit.
- Receivables.
- Customer debt.
- Wallet balance.
- ربحية كل فرع.

## 14. الشركات والموردون
**منفذ:**
- تقرير منفصل لكل شركة.
- عدد المنتجات والوحدات المباعة.
- Sales / Commission / Returns.
- Stock value.
- Top governorate.
- Settlement due.
- يبقى نشر وتعديل كتالوج الشركات تحت موافقات الإدارة الموجودة سابقاً.

## 15. الموارد البشرية
**منفذ:**
- Pipeline: New → Screening → Interview → Accepted/Rejected → Contracted.
- عامل/مشرف/طبيب/سائق/مالية/مستودع.
- المحافظة والهاتف والخبرة والراتب والهوية وCV والتقييم والمزارع المكلف بها.

## 16. Push Notifications / FCM
**منفذ:**
- Campaign model.
- جمهور عام/عملاء/موظفين/محافظة/مديرية/عميل.
- Triggers: سعر، وباء، دفع، سحب دواء، دين، طقس، حالة سريرية.
- Queue/Draft/Sent/Failed.
- إنشاء Campaign تلقائي عند رصد Cluster جديد.

**قبل الإنتاج:** الإرسال الفعلي يحتاج FCM Backend credentials.

## 17. مركز الموافقات
**منفذ:**
- Price / Exchange / Zone fee / Product / Antibiotic / Credit override / Payment / Ad / Company / Permission.
- Risk normal/high/critical.
- Approve/Reject من لوحة V11.
- اسم المعتمد محفوظ في السجل.

## 18. Security Production
**موجود كسياسات وجاهزية داخل لوحة الإدارة:**
- OTP.
- Admin MFA.
- API keys server-only.
- Storage rules.
- Rate limiting.
- App Check.
- JWT rotation.
- Device registration.
- Remote session revoke.
- PII encryption.
- Immutable audit policy.
- Automated backup.

**قبل الإنتاج:** البنود التي تعتمد على مزود هوية/سحابة/خادم يجب تفعيلها فعلياً وليست مجرد Toggle.

## 19. System Owner Console
**منفذ:**
- Maintenance mode.
- إيقاف السوق.
- إيقاف المساعد الذكي.
- إيقاف المدفوعات.
- السماح بالتسجيل الجديد.
- اشتراط موافقة المالك لإنشاء مدير.
- قائمة وحدات Owner-only.
- تعطيل السوق والمساعد ينعكس فعلياً على الواجهة.

## 20. اختبارات ما قبل الإطلاق
**منفذ داخل V11:**
- منطقة جديدة.
- مضاد حيوي.
- رفض أجرة.
- حوالة خاطئة.
- نافق مرتفع والطبيب Offline.
- لا يوجد مختبر قريب.
- انقطاع الإنترنت أثناء الصور.
- نفاد المخزون بعد الدفع.
- محاولة العميل تعديل السعر.
- موظف غير مخول يدخل المالية.
- يمكن تسجيل Passed/Failed لكل Scenario.

## الربط بين الوحدات الذي تمت إضافته في V11
1. اعتماد المالية → إنشاء Order Lifecycle.
2. اعتماد المالية → محاولة حجز المخزون من الفرع.
3. بدء `out_for_delivery` → إنشاء Delivery Assignment.
4. `delivered` → إنقاص المخزون والمحجوز تلقائياً.
5. Clinical case → AI stateful session.
6. Clinical case يحتاج مختبر → Lab order.
7. حالتان متشابهتان في نفس المنطقة → Outbreak cluster + Push campaign.
8. System Owner يستطيع إيقاف السوق أو المساعد من لوحة V11.
9. Enterprise state يمكن حفظه على Backend JSON التجريبي أو LocalStorage كـ offline fallback.

## ما لا يزال يحتاج خدمات خارجية حتى يصبح Production
- PostgreSQL/Firebase/Managed DB بدلاً من JSON التجريبي.
- Cloud Storage دائم للصور/الصوت/المستندات.
- Firebase/Auth أو Custom Auth فعلي.
- FCM credentials خادمية.
- APIs رسمية للكريمي/جيب إن توفرت.
- نموذج AI Vision/Audio طبي يتم اختباره واعتماده.
- تشفير PII وWAF/App Check/Rate limiting حقيقي في البنية المنشورة.

هذه ليست ميزات محذوفة؛ هي نقاط نشر وربط خارجي لا يمكن جعلها حقيقية بدون حسابات ومفاتيح وبنية إنتاج.
