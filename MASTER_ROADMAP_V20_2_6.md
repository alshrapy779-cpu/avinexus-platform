# MASTER ROADMAP V20.2.6+

## ثابت المشروع
Windows/Web هي منصة المرجع التشغيلي والإداري والمالي. Android لا يبدأ قبل Windows Completion + Production Hardening.

## Preservation Contract
كل وظائف V8–V20.2.5 محفوظة. الجديد يربط ويطور ولا يحذف. كل اقتراح قديم أو جديد يبقى في Master Backlog حتى التنفيذ أو التأجيل الموثق أو الاستبدال المعتمد.

## V20.2.6 — Executive Intelligence, Reports & Business Control — IMPLEMENTED
الهدف: تحويل بيانات المزارع، الطب البيطري، المكاتب، المالية، المخزون، المصنع والموظفين إلى طبقة قيادة موحدة مشتقة من مصادر الحقيقة.

Implemented core:
- Executive Command Center.
- Business-unit profitability.
- AR/AP aging and current cash position.
- Inventory/factory/veterinary/workforce intelligence.
- Unified Exception Command Center.
- Data-quality scan and reconciliation controls.
- Audited report snapshots and schedule definitions.
- Drill-down to source entities.
- Windows/Web intelligence workspace and V20.2.6 APIs.

## V20.2.7 — Windows Completion & Control Closure — NEXT
هذه مرحلة إغلاق وليست مرحلة إضافة عشوائية لوحدات جديدة. تشمل:
- إنهاء Auth migration لكل المسارات الحساسة، Refresh Sessions/MFA/device/rate-limit hardening.
- Full Organization/Department/Branch/User/Role/Scope/Assignment administration UI.
- Dedicated permission taxonomy للـHR/Payroll/Finance/Procurement/Inventory/Veterinary/Executive roles.
- إغلاق واجهات Veterinary Territory/Handover/Consultant وDoctor leave → Backup/On-call automation وKPI ingestion.
- Medication lot/batch ↔ inventory linkage وإكمال clinical/inventory integration.
- AP/AR aging workflows, bank reconciliation, three-way matching, budgets, period close/reopen, realized/unrealized FX and deeper treasury controls.
- تحويل كل أحداث Flock Ledger ذات الأثر المالي إلى configurable financial events، لإغلاق Farm/Flock profitability وCost/Bird/live Cost/kg.
- Procurement supplier scorecards/quotation history/returns/claims and high-value approval routing.
- Inventory cycle count/stocktake/aging/quarantine/expiry/lot traceability and stronger coverage forecasting.
- Factory QC acceptance, least-cost formulation, production planning/forecasting and automatic historical labor/batch cost recalculation where policy allows.
- HR: doctor leave coverage, automated KPIs, payslip rendering, contract renewal and deeper payroll permissions.
- Managed-office contract lifecycle, renewal and document handling.
- Unified Document/Evidence Center with secure storage abstraction, retention and authorization.
- Notification adapters and escalation templates/retry/acknowledgement integration points.
- Reports: executable filtered reports, export contracts, scheduled execution integration and complete role-scoped catalog.
- Localization catalog, Arabic/English switch, Light Mode, tables/filters/sticky headers, desktop density and Legacy navigation cleanup.
- Offline queue/conflict/idempotency closure where required for Windows/Web field workflows.

## V20.2.8 — Production Hardening
- Production database and migrations.
- Secrets/session/security hardening.
- Object storage and malware/retention controls.
- Backup/restore/disaster recovery.
- Concurrency, idempotency and locking.
- Monitoring, structured logs and alerting.
- Performance/load testing.
- Automated regression/security/accounting/inventory integrity suites.
- Certified dependency-backed npm/Vite build.
- Installer/deployment/runbook and rollback certification.

## V20.3 — Android Field Platform
Android consumes the same backend, roles/scopes, veterinary workflow, farm/flock ledger, inventory/finance rules, tasks, evidence and reporting contracts. It does not recreate business logic.
