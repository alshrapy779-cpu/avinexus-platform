# MASTER ROADMAP V20.2.5+

## ثابت المشروع
Windows/Web هي منصة المرجع التشغيلي والإداري والمالي. Android مؤجل حتى اكتمال منصة Windows والخدمات المشتركة والصلاحيات والتقارير والتثبيت الإنتاجي.

## Preservation Contract
كل وظائف V8–V20.2.4 تبقى محفوظة: المزارع والقطعان، الطبيب والاستشاري والمختبر، Marketplace، التسويق، الحجز، المبيعات، المكاتب والشركات المُدارة، المصنع، المشتريات، المخزون، المالية، العملاء والموردون، وواجهات Legacy. الجديد يربطها ويطورها ولا يحذفها.

## V20.2.5 — Workforce, Payroll & Managed Business Operations — IMPLEMENTED
الهدف: ربط من ينفذ العمل بالعقد والتكليف والحضور والتكلفة والراتب والمكتب/المزرعة/المصنع والمالية.

الدورة المرجعية:
**Employee → Contract → Assignment → Attendance/Field Work → Payroll/Advance/Transport → Payer Split → Cost Center → Approval → Treasury/Payable → Journal → Dashboard/Report/Audit.**

## V20.2.6 — Executive Intelligence, Reports & Business Control — NEXT
الهدف: تحويل البيانات المترابطة الحالية إلى قيادة تشغيلية ومالية قابلة للحفر Drill-down بدل إضافة وحدات منفصلة جديدة.

النطاق المخطط:
- Executive Command Center موحد للمنصة.
- Office/Managed Company/Factory/Farm profitability.
- Cost/Bird, Cost/kg live weight, Feed Cost/Ton, Cost/Bag, Payroll cost by business unit/farm/flock/factory.
- Receivables/Payables aging, cash position, treasury forecast and overdue exposure.
- Inventory coverage, low-stock and factory raw-material/finished-product intelligence.
- Veterinary exceptions, doctor workload, worker execution, laboratory turnaround and farm operational exceptions.
- Contract expiry/renewal exposure and cost-responsibility analysis.
- Cross-office comparisons and drill-down to source invoice/task/case/journal/stock movement.
- Scheduled report definitions/export foundation.
- Exception Command Center with ownership, SLA, escalation and closure evidence.
- Data-quality and reconciliation dashboards.
- Continue closing PARTIAL items from V20.2.1–V20.2.5 instead of leaving them behind.

## V20.2.7 — Windows Completion & Control Closure
- Close remaining PARTIAL requirements across veterinary, finance, factory, HR, offices and reports.
- Dedicated permission taxonomy including HR/payroll roles.
- Accounting closing controls, AP/AR/reconciliation depth, inventory/manufacturing controls and report completeness.
- Localization/UI consistency and Windows desktop usability.

## V20.2.8 — Production Hardening
- Production database/migrations.
- Security hardening and secrets/session policies.
- Backup/restore and disaster recovery.
- Concurrency/idempotency/locking.
- Monitoring, structured logs and alerting.
- Performance/load testing.
- Automated regression/security/accounting integrity suites.
- Installer/deployment documentation and certified production build.

## V20.3 — Android Field Platform
Android consumes the same backend, roles, workflows, financial rules, farm/flock ledger, audit and reporting contracts; it does not recreate business logic.

## Backlog rule
Every accepted old or new suggestion remains in the Master Backlog until implemented, explicitly superseded with approval, or documented as deferred. No suggestion disappears merely because a newer release is being developed.
