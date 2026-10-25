# MASTER ROADMAP V20.2.7+

## ثابت المشروع
Windows/Web هي منصة المرجع التشغيلي والإداري والمالي. Android لا يبدأ قبل إغلاق Windows ثم Production Hardening.

## Preservation Contract
كل وظائف V8–V20.2.6 محفوظة. أي إضافة جديدة تربط أو تطور الموجود ولا تحذفه. كل اقتراح مقبول يبقى في Master Backlog حتى التنفيذ أو التأجيل الموثق أو الاستبدال المعتمد.

## V20.2.7 — Windows Completion & Enterprise Control Closure — IMPLEMENTED
تم إغلاق طبقة التحكم التطبيقية الأساسية قبل Production Hardening، وتشمل:
- Bearer-first production/staging API security + rotating refresh sessions + device sessions + MFA state foundation.
- Granular enterprise permissions and organization lifecycle controls.
- Veterinary leave coverage, KPI derivation and medication-lot inventory linkage.
- Accounting periods, bank reconciliation, budgets, approved FX records and flock financial-event mapping/profitability.
- Three-way matching, supplier scorecards and procurement claims.
- Cycle counts, inventory adjustments and quarantine decisions.
- Factory QC, least-cost formulation foundation and production planning.
- Employee/business-contract renewals, workforce KPIs and payslip snapshots.
- Unified document index, notification delivery lifecycle, report execution, localization preferences and idempotent offline command queue.
- Windows/Web control-closure workspace and authenticated production/staging login behavior.
- Regression/preservation/upgrade-rollback testing.

## V20.2.8 — Production Hardening — NEXT
هذه المرحلة لا تعيد تصميم منطق الأعمال؛ وظيفتها نقل V20.2.7 إلى بيئة إنتاج قابلة للاعتماد:
- Production database schema and migrations.
- Transactional locking/concurrency/idempotency enforcement at persistence layer.
- Secrets, session-cookie/token policy and production MFA provider enforcement.
- Real object storage, malware scanning, retention/legal-hold controls.
- Real Email/SMS/WhatsApp/Push provider adapters with retry/webhook/acknowledgement.
- Backup/restore, point-in-time recovery and disaster-recovery runbook.
- Monitoring, structured logs, metrics, tracing and operational alerting.
- Performance/load/stress testing.
- Automated security, regression, accounting-integrity, inventory-integrity and migration suites.
- Certified `npm install`/dependency lock verification and production Vite/server build.
- Deployment installer/runbook, environment validation, upgrade and rollback certification.
- Final production data migration rehearsal and go-live checklist.

## Post-hardening finance/analytics refinements
Where deployment policy requires them, V20.2.8 or a controlled maintenance increment may add production-grade realized/unrealized FX revaluation, statutory document layouts and advanced externally validated forecasting/optimization. These do not justify duplicating the current operational ledgers.

## V20.3 — Android Field Platform
Android consumes the same backend, identities, roles/scopes, veterinary workflows, Farm/Flock Ledger, inventory, finance, tasks, evidence, offline/idempotency contracts and reporting APIs. Business logic is not reimplemented independently on mobile.
