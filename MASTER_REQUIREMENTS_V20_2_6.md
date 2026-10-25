# MASTER REQUIREMENTS — V20.2.6

## Release
**Smart Poultry Platform V20.2.6 — Executive Intelligence, Reports & Business Control**

## Baseline
V20.2.5 — Workforce, Payroll & Managed Business Operations.

## Platform direction
Windows/Web remains the reference operational, administrative and financial platform. Android remains deferred until Windows/Web completion and production hardening.

## Preservation Contract
All accepted functions from V8 through V20.2.5 remain preserved, including farms/flocks, veterinary workflows, consultants/laboratory, marketplace, marketing, booking, sales, managed offices/companies, customers/suppliers, finance, procurement, inventory, feed factory, HR/payroll/workforce and legacy modules. V20.2.6 adds a derived command-and-control layer; it must not create an independent competing source of truth for operational or financial balances.

## Architectural rule for intelligence
Executive indicators are derived from source ledgers and operational records. V20.2.6 persistent state stores only control exceptions, reconciliation runs, report definitions/schedules/snapshots, quality findings, settings and audit metadata.

## Required capabilities
1. Unified Executive Command Center for platform and business-unit scopes.
2. Business-unit profitability using source revenue/expense journals.
3. Receivables aging buckets and overdue exposure.
4. Payables aging buckets and overdue exposure.
5. Current treasury/cash position from business-unit treasury accounts.
6. Inventory intelligence: on-hand, reserved/in-transit context where available, stock value, low-stock signals and issue-history coverage estimates.
7. Feed-factory intelligence: orders/batches, output, yield, loss, cost/kg, cost/bag and manufacturing exceptions.
8. Veterinary intelligence: open/critical cases, withdrawal locks, reports awaiting review, doctor workload and laboratory state indicators.
9. Workforce intelligence: active workforce, doctors/workers/factory staff, payroll outstanding, advances and contracts nearing expiry.
10. Unified Exception Command Center with severity, ownership, lifecycle, SLA metadata and evidence/notes fields.
11. Automatic exception derivation from current enterprise sources, including overdue AR/AP, critical medical cases, expiring workforce contracts and existing business exceptions.
12. Data-quality scan across multi-business, veterinary, factory, workforce, journal-balance and stock-integrity validators.
13. Reconciliation run comparing operational receivable/payable positions with customer/supplier ledgers and checking accounting/stock integrity.
14. Report-definition catalog for executive, profitability, AR/AP aging, cash, inventory, factory, veterinary, workforce and data-quality reports.
15. Auditable report snapshots generated from current source data.
16. Report schedule definitions with frequency and output-format metadata.
17. Drill-down from intelligence widgets to supported source entities such as invoices, receipts, medical cases, laboratory orders, manufacturing orders/batches, employees, payroll lines, journals and role tasks.
18. Business-unit filtering in the Windows/Web intelligence workspace.
19. Bearer authentication and business-unit scope enforcement using the V20.2.1 security foundation for V20.2.6 APIs.
20. Audit events for exception changes, reconciliation, report generation and scheduling.
21. Semantic End-to-End test plus regressions for V20.2.1–V20.2.5.
22. Additive preservation audit and rollback-safe upgrade from V20.2.5.

## Strict limitations / PARTIAL items
- Farm/flock profitability, Cost/Bird and live Cost/kg are only complete when all relevant flock events have automatic configurable finance mappings.
- Treasury forecast is not the same as current cash position; forward cash-flow forecasting remains a later control-closure item.
- Inventory coverage is currently based on recorded issue history; full demand forecasting from farms/production planning remains later.
- Scheduled reports are defined and auditable, but background execution, PDF/XLSX rendering and external delivery adapters remain later.
- Exception lifecycle exists; automatic background SLA timers/escalation delivery still depends on scheduler/notification hardening.
- Data-quality and reconciliation are core controls, not yet a substitute for final accounting period close/reopen and bank reconciliation.
- Cross-office comparison is available from scoped profitability/intelligence data, but advanced benchmarking/trend analytics remains later.
- Production dependency-backed build remains a V20.2.8 certification requirement.

## Acceptance flow
Create/use enterprise operating data → derive command metrics from source systems → derive exceptions → update exception lifecycle → run data-quality scan → run reconciliation → generate report snapshot → create report schedule → drill down to source record → validate state → run all previous regressions → run preservation audit.
