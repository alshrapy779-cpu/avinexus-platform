# حالة متطلبات V20.1

إجمالي المتطلبات المسجلة: **237**.

الحالات الحالية: {"implemented": 44, "planned": 63, "documented": 4, "partial": 17, "existing": 107, "planned_external": 2}

V20.1 لا تدّعي تنفيذ جميع المتطلبات. هذه النسخة تُنشئ نظام التتبع والحفظ وتفعّل أول حزمة تشغيلية ذات أولوية: **Flock Accounting & Reporting Core**. بقية المتطلبات تبقى مرقمة ولا يمكن إسقاطها من خطة التطوير.

## ما فُعّل في هذه الحزمة
- سجل القطيع الرئيسي.
- دفتر حركة أعداد القطيع.
- فصل نافق الوصول / المزرعة / النقل / الاستبعاد / البيع.
- معدل النافق اليومي والتراكمي وLivability.
- مصالحة العدد وتصحيح معتمد بدل التعديل الصامت.
- مؤشرات الوزن (Average/Median/Min/Max/CV/Uniformity).
- مؤشرات العلف والماء والبيئة وFCR التشغيلي المسمّى بصيغته.
- Daily Closing Gate وData Completeness.
- Owner Daily Dashboard وExecutive Farm Dashboard.
- Weekly Report وEnd-of-Cycle Report foundation.
- لقطات تقارير ثابتة وتدقيق للتعديلات.

## مهم
WhatsApp/Realtime provider/GPS device attestation/Cloud storage/payment gateways/STT production/AI vision تبقى تكاملات تحتاج مزودات ومفاتيح حقيقية، ولا يتم وصفها كمفعلة إنتاجيًا قبل الربط.
