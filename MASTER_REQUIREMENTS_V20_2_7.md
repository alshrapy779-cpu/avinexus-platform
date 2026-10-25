# MASTER REQUIREMENTS — V20.2.7

## Release
**Smart Poultry Platform V20.2.7 — Windows Completion & Enterprise Control Closure**

## Baseline
V20.2.6 — Executive Intelligence, Reports & Business Control.

## Platform direction
Windows/Web remains the reference operational, administrative and financial platform. Android remains deferred until the Windows/Web control-closure and V20.2.8 production-hardening milestones are complete.

## Preservation Contract
All accepted functions from V8 through V20.2.6 remain preserved. V20.2.7 is additive: no prior farm/flock, veterinary, marketplace, marketing, booking, office, customer/supplier, finance, procurement, inventory, factory, HR/payroll, executive-intelligence or legacy capability may be removed merely to simplify the new release. Integration-file modifications must be explicitly allow-listed and preservation-tested.

## Definition of Done for this release
A control is considered functionally closed only when the applicable domain model, server/API path, authorization/scope rule, workflow/validation, audit linkage and semantic test exist. Production-provider concerns such as real SMS/WhatsApp delivery, production object storage, database migrations, infrastructure monitoring and certified dependency-backed builds remain V20.2.8 responsibilities and must not be misreported as completed here.

## Required capabilities
1. Bearer-first security gate for sensitive legacy and V20.2.x API mutations in STAGING/PRODUCTION while retaining development compatibility.
2. Rotating refresh sessions with hashed refresh-token storage, revocation and reuse prevention.
3. Device-session registry and session revocation foundation.
4. MFA enrollment/verification state foundation for privileged identities; external OTP/provider enforcement remains production integration.
5. Granular permission taxonomy for organization, security, veterinary, finance, procurement, inventory, factory, HR/payroll, documents, notifications, reports, localization and offline operations.
6. Organization lifecycle audit for create/update/suspend/reactivate/transfer/scope changes, while preserving inherited organization/branch/role/scope APIs.
7. Approved veterinarian leave → Backup/On-call coverage planning using existing veterinary assignments and preserving historical ownership.
8. Derived veterinary KPIs from assignments, cases, consultations, laboratory reviews and follow-ups.
9. Medication order → specific inventory lot/batch dispense, quantity decrement and audit linkage.
10. Accounting-period registry with close/reopen workflow and balanced-journal validation.
11. Bank reconciliation against enterprise treasury balances.
12. Approved historical FX-rate records and budget controls.
13. Configurable flock financial-event mapping to double-entry journals.
14. Farm/flock profitability derivation including revenue, cost, profit, Cost/Bird and Cost/live-kg when the relevant operational events are mapped.
15. Purchase Order ↔ Goods Receipt ↔ Purchase Invoice three-way matching.
16. Supplier scorecards based on receipt timeliness, shortage, damage and rejection history.
17. Procurement claims for shortage/damage/quality/price/late-delivery/other disputes.
18. Inventory cycle counts with approved stock adjustments.
19. Inventory lot quarantine with release/reject decisions and audit.
20. Factory QC records for raw-material lots and production batches.
21. Deterministic least-cost feed-formulation optimization foundation using ingredient bounds, nutrient targets and current input costs. Human nutrition/formulation approval remains mandatory.
22. Factory production planning based on demand, safety stock and available finished stock.
23. Employee compensation-contract renewal/versioning without overwriting historical contracts.
24. Managed-business/office contract renewal/versioning without overwriting historical contracts.
25. Derived workforce KPIs from assignments, attendance, tasks and payroll state.
26. Auditable payslip snapshot generation from payroll lines.
27. Unified evidence/document index over the existing evidence metadata layer.
28. Notification delivery lifecycle records for in-app/push/email/SMS/WhatsApp, including queued/sent/acknowledged/failed states. External-provider delivery remains V20.2.8/deployment integration.
29. Scheduled-report execution records connected to V20.2.6 report schedules/snapshots.
30. User Arabic/English localization preference with RTL/LTR direction.
31. Durable offline-command queue model with idempotency-key duplicate prevention and completion/conflict/failure status.
32. Windows/Web V20.2.7 control-closure workspace plus production/staging enterprise login gate.
33. Enterprise client auth session stored in sessionStorage, automatic Bearer injection and one-time refresh/retry behavior; authenticated production mode must not rely on browser local enterprise data as its authoritative source.
34. V20.2.7 validation across periods, journals, formulas, medication/inventory links, cycle-count movements, contract renewals, factory QC, payslips and report executions.
35. Semantic End-to-End V20.2.7 test plus regression tests for V20.2.1–V20.2.6.
36. Additive preservation audit against the complete V20.2.6 baseline.
37. Rollback-safe V20.2.6 → V20.2.7 upgrade package with SHA-256 manifest and backup/restore semantics.

## Explicit V20.2.8 production-hardening boundary
The following are intentionally **not** represented as production-certified in V20.2.7:
- Production database schema migrations and transactional database locking.
- Real MFA challenge delivery/identity-provider integration.
- Real SMS/WhatsApp/email/push provider credentials and provider acceptance.
- Binary object storage, malware scanning and retention enforcement for document files.
- Statutory/local payroll-bank rails, biometric providers and external GPS attestation.
- Certified PDF/XLSX binary rendering where external package/runtime support is required.
- Production-wide immutable accounting-close enforcement at the database transaction layer.
- Full realized/unrealized FX revaluation engine across production balances.
- Infrastructure backup/restore/DR, monitoring, structured logging and alerting.
- Performance/load/security certification and a dependency-backed production build.

## Acceptance flow
Authenticated privileged user → refresh/session rotation → office/business contract → farm/veterinary assignment → approved doctor leave coverage → medication lot dispense → flock financial events → profitability → accounting period close → bank reconciliation → PO/receipt/invoice three-way match → supplier scorecard/claim → cycle count/quarantine/release → factory QC/least-cost formulation/production plan → employee/business contract renewal → workforce/veterinary KPI derivation → payslip → document index → notification/report/localization/offline idempotency → validation → regressions → preservation → upgrade/rollback verification.
