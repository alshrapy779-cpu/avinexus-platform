# V20.1 – Architecture & Flock Ledger

هذه الحزمة هي **أول Pack تراكمي في V20** فوق V19.7، وليست ادعاءً بأن جميع متطلبات V20 البالغ عددها 237 قد اكتملت.

## ما تم تفعيله في V20.1
- Master Requirements Registry بمعرّفات ثابتة.
- Preservation Contract مقابل V19.7 للملفات والمسارات البرمجية والـexports.
- Upgrade/Rollback Pack foundation.
- Central APP_VERSION.
- Flock Master Record.
- Flock Population Ledger وفصل نافق الوصول/المزرعة/النقل والاستبعاد والبيع.
- Daily/Cumulative Mortality وLivability.
- Population Reconciliation مع اعتماد بدل التعديل الصامت.
- Weight statistics: Average/Median/Min/Max/CV/Uniformity/ADG.
- Feed/Water/Environment metrics وFCR مسمى بصيغته.
- Daily Closing Gate وData Completeness.
- Owner Daily Dashboard وExecutive Farm Dashboard.
- Weekly Performance وEnd-of-Cycle foundation وReport Snapshots.
- Audit mutations للحقول الحرجة.

## ما لم يُدّعَ اكتماله
بقية Packs (Veterinary, Marketplace/Suppliers, Finance, Procurement/Sales, Chat/Realtime, Reports, UX/Security) تبقى مسجلة في Master Registry ويتم تنفيذها تدريجيًا دون إسقاط أي Requirement.

## التكاملات الخارجية
WhatsApp، مزود Realtime، GPS/device attestation، Cloud Storage، بوابات الدفع، STT/AI Vision الإنتاجي تحتاج حسابات ومفاتيح خارجية قبل وصفها كمفعلة إنتاجيًا.
