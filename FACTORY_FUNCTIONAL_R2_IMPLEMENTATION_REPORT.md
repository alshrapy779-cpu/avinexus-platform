# Smart Poultry Platform V20.2.9 — Factory Functional R2

Date: 2026-09-23
Baseline: V20.2.9 Windows 90% Field Completion + preserved V20.2.4 factory engine

## Purpose
This release replaces the previous Factory 15-section navigation shell with functional section workspaces while preserving all prior source files and the V20.2.4 factory engine.

## Functional navigation
All 15 Factory cards now open dedicated section workspaces with a return-to-factory action. The factory can also be provisioned from inside the factory page when no Factory Profile exists.

## Factory Profile provisioning
The embedded wizard creates/reuses, additively:
- Feed Factory Business Unit
- Raw Material Warehouse
- Finished Goods Warehouse
- Factory Profile

No existing business unit or warehouse is destructively replaced.

## Implemented workflows by section
1. Raw Materials: create raw/finished-feed product records, stock/availability views, nutrient profile references.
2. Suppliers: create supplier, legal-entity relationship, activate relationship, supplier 360-style operational table.
3. Purchasing & Receiving: create PO, sent-vs-received controls, accepted/quarantine/rejected/damaged capture, GRN/inventory posting through the preserved inventory engine.
4. Formulas: create formula, submit, approve; approved version used by work orders.
5. Work Orders: create/approve WO, material reservation, staging record. Staging is explicitly non-consumption.
6. Actual Production: start/consume, complete output, production actual/variance history. Actual consumption is the stock-deducting event.
7. Inventory: stock-node/warehouse balances and create/dispatch/receive stock transfers.
8. Factory Dispatch: internal factory dispatch plus customer sales-dispatch queue. Sales physical issue executes here and creates exactly one inventory issue.
9. Customers & Sales: customer + legal relationship + versioned credit profile, product/quantity/price sales order, credit check, S8 dispatch request, operational invoice -> AR posting, customer receipt -> treasury/AR.
10. Customer Statements: live read model + frozen official execution history; no duplicate AR ledger.
11. HR & Payroll: employee creation, attendance, effective compensation contract, payroll period, payslip generation, payroll approval/payable posting, payment from treasury.
12. Treasury & Accounting: finance foundation initialization, treasury accounts, daily expense request/approval/posting, AP/AR projections, treasury balances, immutable journal history, manufacturing cost source view.
13. Transport: zones, rates, trips, POD completion.
14. Reports & Analytics: report catalog and frozen report executions.
15. Settings & Governance: versioned policies and activation/supersession history.

## Critical preservation contracts enforced
- S7 remains the sole inventory movement/balance owner.
- S12 remains the sole accounting/GL/AP/AR/Treasury owner.
- S10 remains presentation/execution only.
- S14 remains reporting only.
- S15 remains policy/governance only.
- Reservation reduces availability, not physical on-hand.
- Staging is allocation/internal transfer, not consumption.
- Actual consumption is the real raw-material deduction.
- Sales flow is S9 -> S8 -> S7; S9 does not issue inventory.
- Sales invoice AR posting does not issue inventory a second time.
- Posted accounting history is append-only/reversal-oriented.

## Automated verification
- V20.2.9 semantic suite: 45/45 PASS
- V20.2.9 preservation audit: 406 baseline files, 0 missing, 0 unexpected changed
- Factory functional semantic suite: 58/58 PASS
- TS/TSX transpile syntax check for modified factory files: 0 syntax errors

## Build certification status
`npm run build` could not execute in this container because local project dependencies are not installed (`vite: not found`). This environment did not have package installation available. The source-level semantic, preservation, and syntax checks above passed. A final production bundle should be built on the user's Windows environment after `npm install`.

## Supersession note
The earlier `factory-15-sections-complete` package represented Blueprint + navigation shell completion. This R2 package supersedes that claim for functional factory workspaces and explicitly records the remaining production-build certification condition above.
