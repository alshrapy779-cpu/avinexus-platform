# V19.7 — حالة المتطلبات

## مفعّل داخل التطبيق/الكود
- Marketplace Customer وGuest Request.
- Supplier availability + daily attestation + real-time verification.
- Alternative routing + veterinary gate + emergency vet case.
- Managed Farm Contracts والكوادر المتعددة.
- Pre-placement gate + flock receipt.
- Daily worker data + weight analytics + feed/water/environment + treatment/vaccine logging.
- Veterinary Decision Support + daily plan + protocol versioning.
- Requirements/owner approval/finance approval/PO/supplier confirm/goods receipt/three-way matching.
- Farm/Flock cost entries and financial summary.
- Operational chat groups, moderation, Voice-to-Data/action cards.
- Marketing readiness, owner approval, sale, delivery/POD, settlement/end-cycle performance.
- Compliance, timeline, exceptions, executive brief.
- V19.6 Financial Command integration and farm cost-center tab.
- REST API routes for V19.7 state, marketplace, contracts, flocks, reports, vet decisions, requirements, POs, goods receipts, chat, sales and settlements.

## محفوظ من الإصدارات السابقة ولا يعاد حذفه
- V8–V19.6 administration/CEO panels and legacy tabs.
- Customer onboarding, cases, lots, approvals, documents, notifications, data quality, fraud, backup, support, AI governance.
- Supplier/Company/Branch/Warehouse/Catalog/Price History.
- SAR/YER old/YER new.
- Financial documents, double-entry ledger, accounts, treasury, cash close, debts/receivables/payables/contracts.
- Healthy Poultry/QR/withdrawal safeguards.
- Biosecurity transit/early warning/BioRadar.
- Hatchery/chick marketplace/passport foundations.
- Offline-first field policy and prior IndexedDB/offline modules.

## يحتاج Credentials/Provider قبل Production activation
هذه ليست أخطاء برمجية ولا يجب تمثيلها على أنها متصلة بدون مزود:
- WhatsApp Business API ثنائي الاتجاه.
- SMS/FCM/APNs Push.
- خرائط ومسافة/ETA حقيقيان.
- بوابة دفع/تحصيل إلكتروني وEscrow provider حقيقي.
- Cloud Object Storage للصور والفيديو.
- STT لهجة يمنية وAI Vision بيطري إنتاجي.
- IoT sensors المباشرة.
- Live FX provider.
- قاعدة بيانات مركزية Production/Auth/MFA إذا كان النشر التجاري مطلوبًا.

## قاعدة الأمان الطبي
AI النهائي = false. أي علاج/لقاح/مضاد أو بديل علاجي يحتاج اعتماد طبيب مخول. الذكاء الاصطناعي هو Decision Support وليس صاحب وصفة نهائية.
