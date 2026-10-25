# ملخص تنفيذ V20.2.5

## اسم الإصدار
**V20.2.5 – Workforce, Payroll & Managed Business Operations**

تم البناء فوق V20.2.4 مباشرة مع الحفاظ على المزارع، الطب البيطري، المكاتب، المصنع، المشتريات، المخزون، المالية، التسويق، Marketplace والحجوزات وجميع طبقات V8–V20.2.4.

## ما تم تنفيذه
- Employee 360 موحد للموظف بدل إنشاء ملف جديد عند كل تكليف.
- Job Families تشمل العامل، الطبيب، الاستشاري، المحاسب، أمين المخزن، عامل/مشرف المصنع، المبيعات، التسويق، السائق، المختبر، المشتريات، المدير وIT.
- عقود تعويض شهرية/يومية/بالساعة/بالزيارة/بالمزرعة/بالدورة/عمولة/Combination.
- Cost Responsibility Split بين المنصة والوحدة التشغيلية وصاحب المزرعة، مع التحقق من أن النسب = 100%.
- Assignment Engine يربط الموظف بالمكتب/المصنع/المزرعة/القطيع/المخزن/المنطقة مع فترة وتوزيع تكلفة.
- Work Schedules وحضور ميداني/مكتبي، ساعات عادية وإضافية، زيارات ومهمات وإجازات.
- Employee Advances: طلب → اعتماد → دفع من الخزينة → رصيد قائم → استرداد عبر Payroll.
- Payroll Periods وPayroll Lines مع حساب الراتب والأجر اليومي/بالساعة والزيارات والساعات الإضافية والبدلات والعمولات والمكافآت والخصومات والسلف.
- توزيع تكلفة Payroll على Business Unit/Farm/Flock/Factory/Cost Center حسب التكليف.
- اعتماد الرواتب ثم الدفع الجزئي أو الكامل من الخزينة، مع قيود محاسبية متوازنة.
- Payroll Register وملخصات الوحدة والموظف.
- Commission Rules للمبيعات بحسب الفاتورة أو التحصيل أو الكمية.
- Factory Direct Labor Allocation على Manufacturing Order وربط تكلفة العمل بأمر التصنيع.
- Transport Trips تشمل السائق والمسار والمسافة والنقل والوقود والتحميل والجهة المتحملة والتكلفة المالية.
- Employee Documents registry بصلاحيات رؤية metadata.
- Performance Snapshot foundation دون إصدار أحكام وظيفية تلقائية.
- Workforce Dashboard لكل Business Unit يعرض الموظفين والأطباء والعمال وطاقم المصنع والرواتب المتبقية والسلف والعقود القريبة من الانتهاء.
- واجهة Windows/Web جديدة للقوى العاملة والرواتب داخل Enterprise Workspace.
- 21 API جديدة خاصة بـV20.2.5 مع Signed Authentication وBusiness-Unit Scope الموجودين مسبقًا.

## الاختبار End-to-End
تم اختبار سيناريو متكامل يتضمن إنشاء مكتب ومزرعة وخزينة، إضافة طبيب بعقد Combination وتقسيم تكلفة 60/40، ربطه بالمزرعة، حضور وزيارة ميدانية وساعات إضافية، إجازة معتمدة، سلفة 600 SAR ثم دفعها، إنشاء مصنع وعامل مصنع وربطه بأمر تصنيع وتسجيل 200 SAR عمالة مباشرة، إنشاء Payroll للطبيب، استرداد 200 SAR من السلفة، احتساب 40 SAR ساعات إضافية و100 SAR زيارة، اعتماد الراتب، دفعه جزئيًا ثم بالكامل، تسجيل رحلة نقل ومستند موظف ولقطة أداء.

نتيجة السيناريو:
- Gross payroll: 3,440 SAR.
- Net payroll: 3,240 SAR.
- Paid: 3,240 SAR.
- Advance remaining: 400 SAR.
- Factory direct labor: 200 SAR.
- Transport cost: 200 SAR.
- Journal entries generated in the test: 5.
- All generated journals balanced: نعم.
- Validation issues: 0.

## ما بقي PARTIAL
- الربط الآلي بين إجازة الطبيب وVeterinary Territory/On-call replacement.
- KPIs آلية كاملة للعمال والأطباء من كل وحدات التشغيل.
- Dedicated HR_MANAGER/PAYROLL_MANAGER permission vocabulary.
- PDF Payslip المعتمد والطباعة القانونية/المحلية.
- ربط تكلفة العمل تلقائيًا بكل Batch تاريخي وإعادة احتساب Factory Costing دون تدخل.
- Biometric/GPS attendance providers والحوالات البنكية للرواتب تتطلب بيئة/مزود إنتاج.

## Preservation
اختبار الحفظ يستخدم V20.2.4 كخط أساس: 346 ملفًا و220 API و1000 TypeScript export. النتيجة: لا ملفات مفقودة، لا API مفقودة، لا exports مفقودة، ولا تعديل غير مصرح به على ملفات الأساس.

## Build status
فحوص TypeScript syntax وdomain module نجحت، وجميع الاختبارات الدلالية V20.2.1–V20.2.5 نجحت. محاولة `npm run build` توقفت لأن `vite` المحلي غير موجود و`node_modules` غير مثبت في بيئة التنفيذ الحالية؛ لذلك لا ندعي Production Build معتمدًا.

## الاتجاه التالي
**V20.2.6 – Executive Intelligence, Reports & Business Control** مع استمرار تطوير HR والمصنع والمكاتب والمزارع والمالية والطب البيطري معًا، ثم Production Hardening، ثم Android فقط بعد استقرار Windows/Web.
