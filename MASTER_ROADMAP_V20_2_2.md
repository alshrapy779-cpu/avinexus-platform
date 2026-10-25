# MASTER ROADMAP V20

## Product direction
The Windows/Web platform is the operational reference platform. Android is intentionally deferred until the shared backend, authorization model, veterinary workflows, finance rules, and reporting contracts are stable.

## Governing principle
Every operational event must answer: **who acted, on what organization/farm/flock, under which authority and scope, who approved it, what evidence supports it, what operational/veterinary/financial effect it created, and where that effect appears in reports and audit history.**

## Preservation Contract
No feature from V8 through the current baseline may be silently removed. Existing behavior can be migrated or wrapped only when the replacement is validated and rollback remains possible. Legacy modules stay preserved until explicit retirement approval.

## Delivery sequence

### V20.2.1 — Core Enterprise Foundation — BASELINE
Purpose: establish identity, authorization, scopes, organizational structure, veterinary territories/assignments, approval/delegation, master data, evidence metadata, notifications foundation, localization foundation, and immutable audit semantics.

Exit criteria: secure-auth API foundation works; scope enforcement is tested; overlapping primary veterinary responsibility is prevented; delegation limits are enforced; V20.2 preservation passes; remaining UI/auth migration gaps are explicitly PARTIAL.

### V20.2.2 — Veterinary & Field Operations — CURRENT
Purpose: make the daily veterinary operating loop executable end-to-end.

Target flow: Worker Daily Closing → AI Analysis → Veterinary Review → Doctor Decision → Tomorrow Plan → Worker Tasks → Evidence → Completion/Exception → Follow-up.

Includes multi-veterinarian area ownership, primary/backup/on-call coverage, workload balancing, handover, case ownership, medical timeline, consultant routing, laboratory workflow, medication/vaccine/withdrawal control, and escalation.

### V20.2.3 — Financial & Accounting Core
Purpose: deliver a true double-entry accounting backbone tied to operations.

Includes Chart of Accounts, General Ledger, journal/receipt/payment vouchers, sales and purchase invoices, debit/credit notes, AP, AR, supplier/customer ledgers, treasury, cashboxes, banks, FX history, reconciliation, cost centers, budgets, financial periods/closing, Trial Balance, Income Statement, Balance Sheet, Cash Flow, aging and audit.

### V20.2.4 — Procurement, Inventory, Suppliers, Sales & Logistics
Purpose: connect farm requirements to commercial fulfillment and accounting.

Target flow: Requirement → Approval → RFQ/Quotation → Purchase Order → Supplier confirmation → Goods Receipt → Inventory/Lot/Expiry → Supplier Invoice → Payable → Payment. Sales and logistics use the same source-of-truth and financial posting rules.

### V20.2.5 — HR, Payroll & Workforce Operations
Purpose: complete employee lifecycle, farm assignments, attendance, schedules, compensation models, allowances, transport/housing, advances, deductions, bonuses, payroll, payslips, performance, documents and cost allocation.

### V20.2.6 — Executive Intelligence & Reports
Purpose: transform validated operational and financial data into drill-down management information, exceptions and scheduled reports.

### V20.2.7 — Production Hardening
Purpose: security hardening, migration discipline, backups/restore, performance, concurrency, monitoring, error handling, deployment, automated tests, production build, penetration-oriented permission checks and final preservation audit. No major new business module should be introduced here.

### V20.3 — Android Field Platform
Purpose: mobile field experience for workers, field veterinarians, farm owners and selected logistics/inventory roles. Android consumes the same APIs, authorization, workflows, finance rules and audit contracts; it does not rebuild the business logic.

## Product backlog rule
New ideas are recorded rather than immediately inserted into the active release. Each idea is classified as Critical Foundation, Operational, Financial, Enhancement or Future and assigned to the earliest release whose dependencies are ready.

## Definition of Done
A requirement is DONE only when applicable layers are complete: Data Model → Backend/API → Authentication/RBAC/Scope → Workflow/Validation → UI → Audit/Evidence → Financial Impact → Reports → Automated Tests → Preservation. If one required layer is missing, the status remains PARTIAL.
