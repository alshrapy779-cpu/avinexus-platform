# V19.7 — Managed Poultry Operations & Broker Marketplace

## الهدف
V19.7 تبني فوق V19.6 دون حذف وظائف سابقة، وتفصل بين مسار المشتري العادي ومسار المزرعة التي تتعاقد مع المنصة لإدارة القطيع بالكامل.

## 1) Marketplace Customer
- Guest Checkout بدون إنشاء مزرعة.
- Supplier Availability Network بدل اعتبار المنصة مالكة للمخزون.
- التحقق اليومي من عروض كل فرع، مع Available / Limited / Unconfirmed / Unavailable / Paused.
- إعادة التحقق عند الطلب واختيار الفرع الأقرب تنظيميًا حسب المحافظة/المديرية وآخر تأكيد؛ المسافة الحقيقية تحتاج Maps provider.
- دورة الطلب: Request → Supplier Confirmation → Veterinary Gate عند الدواء/اللقاح → Customer Confirmation → Payment/Collection → Dispatch → POD → Delivered.
- Alternative Engine حسب الفئة والمادة العلمية المتاحة في الكتالوج.
- الحالات الحرجة يمكن تحويلها إلى Emergency Vet Case مع بيانات العميل والقطيع والأعراض والمحاولات السابقة.
- المنصة لا تعرض كمية مخزون دقيقة افتراضيًا؛ الكمية exact/range اختيار للمورد.

## 2) Managed Farm Customer
عقد الإدارة ينشئ:
Customer → Contract → Farm → House → Flock Cycle → Assigned Vet → Assigned Workers → Finance Officer → Chat Groups → Cost Center.

- الطبيب يختار عاملًا واحدًا أو عدة عمال من كوادر المنصة.
- كل مزرعة تحصل على Farm Operations Group وFinance & Procurement Group.
- يوجد مجلس بيطري واستشاري عام وغرفة قيادة تنفيذية.

## 3) Pre-Placement
- أبعاد العنبر، المساحة، الطاقة، المعدات الأساسية.
- تنظيف، غسيل، مطهر، تركيز، كمية، جاهزية الماء والعلف والكهرباء والمعدات والفرشة.
- صور إثبات.
- لا يتم استقبال القطيع قبل اعتماد الطبيب.

## 4) Placement Receipt
- عدد المستند، العدد المستلم، نافق الوصول، العدد الابتدائي المعتمد.
- الفقاسة، السلالة، عينة الوزن، السيارة، السائق، التطهير، الصور والمستندات.

## 5) Daily Worker Operations
- Morning / Evening / Daily Close.
- Opening birds, mortality, culls, closing birds.
- Feed opening/incoming/used/remaining, water.
- Temperature/humidity.
- Fasted/fed weighing, sample weights, CV%, uniformity, min/max/median, variance from standard, FCR estimate.
- Treatment/vaccine execution with quantities, active ingredient/batch/cold-chain status.
- Litter/equipment/respiratory sounds/abnormal droppings/media.
- Mandatory close validation.

## 6) Veterinary Decision Support
- AI يجمع المؤشرات ويولد risk flags وخطة تشغيل مقترحة.
- الطبيب يعتمد الخطة؛ AI لا يصدر قرارًا علاجيًا نهائيًا.
- Protocol Versioning يحفظ كل تغيير في خطة التشغيل.
- Daily Farm Plan يحول الخطة إلى Tasks للعامل.

## 7) Farm Requirements & Procurement
Doctor Requirement → Owner Approval → Finance Approval → Purchase Order → Supplier Confirmation → Goods Receipt → Three-Way Match → Cost Booking.

- رفض المالك للعلاج/اللقاح/المختبر يسجل Compliance Event ولا يجبره النظام على العلاج.
- أوامر الشراء تسجل المورد، الفرع، السعر، العملة، النقل، عمولة المنصة، طريقة الدفع، الاستحقاق وETA.
- الاستلام يسجل Batch/Lot، الصلاحية، Cold Chain، الفاتورة، الصور والفرق.
- عند المطابقة يتم تحميل التكلفة تلقائيًا على Cost Center للقطيع.

## 8) Farm Financial Cost Center
- SAR / YER_OLD / YER_NEW.
- تكلفة وإيراد وآجل ومدفوع وربح/خسارة لكل Farm/Flock.
- الربط مع Financial Command Center V19.6 محفوظ بالكامل.

## 9) Operational Chat
- Farm Operations Group.
- Veterinary Advisory Board.
- Finance & Procurement Group.
- Executive Control Tower.
- Text/Voice/Image/Video/File model.
- Voice-to-Data extraction and confirmation.
- Action Cards للموافقات وأوامر الشراء.
- Moderator/mute/posting-policy controls.
- Sent/Read metadata foundation.

## 10) Marketing & Sale
- Marketing Readiness + Break-even.
- Owner sale approval.
- Buyer/office/price/fees/transport.
- Loading, sanitized vehicle, driver, delivery, transport mortality, POD.
- Partial/cumulative sales supported by multiple sale records.
- Cycle Settlement and End-of-Cycle Performance record.

## 11) Governance
كل حدث تشغيلي رئيسي يسجل Timeline مبني على:
Who → What → Why → Farm/Flock → Time → Approval → Cost → Evidence → Audit.

- Compliance Score.
- Exception-Based Management.
- Executive Daily Brief.
- Data validation for flock counts, negative feed, orphan references, PO without finance approval.

## 12) Preserved V8–V19.6
V19.7 لا تستبدل الوحدات السابقة: Healthy Poultry، Withdrawal Periods، Biosecurity، Lab، Hatchery/Chicks، Case Management، Supplier 360، Catalog/Price History، Financial Command، Double-Entry، Treasury، Receivables/Payables، Audit، Offline، Backup، AI Governance، Global Search وغيرها تبقى في المشروع.

## 13) توزيع الواجهات والتشغيل
- Desktop/Web: الإدارة، المالية، التسويق واللوجستيات، مع لوحات واسعة للمطابقة والموافقات والتقارير.
- Android: الطبيب، العامل، الاستشاري والمزارع/العميل، مع التشغيل الميداني والوسائط وVoice-to-Data وOffline Queue.
- فصل الصلاحيات يمنع المالية من تعديل السجل البيطري ويمنع الميدان من الوصول للدفاتر والتحويلات.
- API persistence يزامن حالة Enterprise بعد التغيير؛ مزود Realtime خارجي يبقى تكاملًا إنتاجيًا عند توفيره.
