# MASTER ROADMAP V20.2.3+

## Product direction
Windows/Web remains the operational reference platform. Android remains deferred until the Windows platform, shared backend, authorization, veterinary workflow, financial posting rules, multi-business model, and reporting contracts are stable.

## Governing principle
Every operational event should be traceable through: actor → authority/scope → business unit/office → farm/flock/customer/supplier/product → source document → approval/evidence → stock/clinical/financial impact → report/audit.

## Preservation Contract
No existing feature from V8 through V20.2.2 may be silently removed. Existing farms, flock ledger, veterinary workflows, marketplace, marketing, booking, sales, managed operations, companies/factories, legacy screens, and APIs remain preserved. New enterprise structures wrap and link them; they do not replace them without validated migration and rollback.

## Delivery sequence

### V20.2.3 — Multi-Business Enterprise Operations — CURRENT
Purpose: establish the shared operating model for multiple offices, managed companies, warehouses, farms, customers, suppliers, treasury, inventory, commercial operations, finance, and the feed-factory foundation.

Required end-to-end flow:
Business Unit → Contract → Staff/Doctor Assignment → Farm Link → Warehouse → Supplier → Purchase Order → Goods Receipt/Variance → Inventory → Customer → Sales Invoice → Cash/Credit → Customer/Supplier Ledger → Treasury → Balanced Journal → Office Dashboard → Platform Dashboard → Audit/Report.

Feed-factory foundation in this release:
Feed Factory Business Unit → Factory Profile → Raw Material Warehouse → Finished Goods Warehouse → Raw Material Master → Nutrient Profile → Starter/Grower/Finisher definitions → supplier/inventory/finance linkage.

Manufacturing/formulation is intentionally not faked in this release; it is the next layer.

### V20.2.4 — Feed Factory, Procurement & Inventory Expansion
Purpose: complete the factory/manufacturing operating loop while continuing to evolve offices, finance, farms, veterinary, inventory and reports together.

Target flow:
Raw Material Purchase → Receiving/Quality/Variance → Batch Stock → Formula Version → Nutrient Calculation (protein/ME/calcium/etc.) → Manufacturing Order → Material Issue → Start/Finish → Actual Consumption → Produced Quantity → Bags/Kg/Tons → Yield/Loss → Finished Goods → Dispatch → Receiving Office/Warehouse/Farm → Sale/Consumption → Finance.

Includes formulation versioning, nutrient targets, raw-material actual analysis, manufacturing costs, production variance, stock coverage and factory dashboards.

### V20.2.5 — HR, Payroll & Workforce Expansion
Purpose: complete employee lifecycle, office/factory/farm assignment, attendance, schedules, compensation models, allowances, transport/housing, advances, deductions, bonuses, payroll, payslips, performance, documents and cost allocation—integrated with business units and financial postings.

### V20.2.6 — Executive Intelligence & Reports Expansion
Purpose: consolidate office, factory, farm, veterinary, inventory, sales, HR and finance data into drill-down dashboards, exception management, scheduled reports and end-of-cycle profitability.

### V20.2.7 — Production Hardening
Purpose: production database/migrations, security hardening, backups/restore, concurrency, monitoring, performance, error handling, deployment, automated regression/security tests, accounting controls, final preservation and production builds.

### V20.3 — Android Field Platform
Purpose: mobile field workflows for workers, veterinarians, farm owners and selected logistics/inventory roles. Android consumes the same APIs/RBAC/workflows/finance/audit model; it does not recreate business logic.

## Backlog rule
New suggestions are recorded, impact-assessed and assigned to the earliest safe release. A new suggestion never deletes an older accepted requirement unless explicitly approved.

## Definition of Done
A requirement is DONE only when all applicable layers are complete: Data Model → Backend/API → Auth/RBAC/Scope → Workflow/Validation → UI → Audit/Evidence → Stock/Finance impact → Reports → Automated Tests → Preservation. Otherwise it remains PARTIAL.
