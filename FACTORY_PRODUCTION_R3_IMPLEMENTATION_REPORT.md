# Smart Poultry Platform V20.2.9 — Feed Factory Production Expansion R3

## Purpose
R3 corrects the R2 limitation where the 15 factory sections opened as broad section workspaces but did not restore the complete internal screen structure previously approved in the factory blueprint.

## What R3 adds
- Full internal factory screen registry: **189 screens** across Sections 1–15.
- Each section now has independent internal screen navigation, screen title/purpose, source-linked data context, search, metrics, tables, and access to its owning operational engine.
- Factory Profile can be provisioned inline when missing.
- Legacy V20.2.4 factory engine remains available and preserved.

### Screen counts
1. Raw Materials — 7
2. Suppliers — 5
3. Purchasing & Receiving — 15
4. Formulas — 3
5. Work Orders — 3
6. Actual Production — 3
7. Inventory — 7
8. Factory Dispatch — 3
9. Customers & Sales — 10
10. Customer Statements — 5
11. HR & Payroll — 15
12. Treasury & Accounting — 27
13. Transport — 13
14. Reports & Analytics — 32
15. Settings & Governance — 41

Total: **189**.

## Major operational workflows wired in R3
### Suppliers
- Legal-entity relationship lifecycle.
- Versioned commercial prices and approval.
- Versioned/masked payment destinations and Finance verification.
- Supplier rating snapshots.
- Supplier statement sourced from canonical counterparty ledger.

### Purchasing & Receiving
- Purchase Requisition create/approve.
- Supplier quotation capture and award.
- Purchase Order creation.
- Sent-vs-received receiving controls.
- Separate transit variance and PO receipt variance.
- GRN receipt/inventory integration.
- 3-way match integration.

### Production Core
- Formula create/review/approval.
- Work Order create/approve.
- Reservation/staging semantics preserved.
- Staging is not consumption and must not double-deduct stock.
- Actual production entry and supervisor approval.
- Finished output posting via existing factory engine.
- Append-only production cost true-up with S7 valuation and S12 accounting references.

### Inventory
- Stock transfers with dispatch/receipt and in-transit tracking.
- Cycle count creation and posting.
- Quarantine/release/reject workflow.
- Daily material balance.
- Canonical InventoryMovement remains Section 7 ownership.

### Sales
- Customer relationship and credit profile.
- Credit check.
- SO → S8 Dispatch → S7 Inventory execution.
- Operational Sales Invoice → S12 AR.
- Customer receipt.
- Sales return approval/physical receipt.
- Credit note posting to customer ledger.

### HR & Payroll
- Employee and compensation contract.
- Factory assignment and work schedule.
- Attendance.
- Leave request/decision.
- Employee advance request/approval/payment.
- Payroll period, payslip generation, approval and payment.

### Treasury & Accounting
- Existing COA/cost-center/treasury/expense/AP/AR/journal views retained.
- Accounting period creation/close/controlled reopen.
- FX rate approval snapshots.
- Section 12 remains the sole accounting owner.

### Transport
- Zones and rates.
- Trip creation.
- POD-required completion.

### Reports & Governance
- Selected internal report screen can create an immutable frozen execution.
- Settings screens create versioned/effective-dated policy records with activation and audit.

## Preservation rules retained
- V20.2.9 baseline preserved.
- No hard delete introduced.
- Section 7 remains sole inventory owner.
- Section 12 remains sole accounting owner.
- Section 10 remains presentation-only.
- Section 14 remains reporting-only.
- Section 15 remains policy/governance-only.
- Staging != Consumption.
- No direct S9 inventory issue path.
- Posted/history corrections remain append-only/reversal based.

## Verification
- V20.2.9 semantic tests: 45/45 PASS.
- Preservation: 406 baseline files, 0 missing, 0 unexpected changed.
- Factory 15-section semantics: 58/58 PASS.
- Full internal screen registry: 24/24 PASS.
- R3 production-expansion wiring: 95/95 PASS.

## Build limitation in this environment
`npm run build` cannot run here because `node_modules` is not installed and the `vite` executable is unavailable. The recorded failure is `vite: not found`. This is an environment dependency condition, not a passed production build. Run `npm install` followed by `npm run build` on the connected Windows development machine before production certification.

## Status wording
- Factory Blueprint: 15/15 closed.
- Internal screen map: 189/189 implemented for navigation/data context.
- Major cross-section factory workflows listed above: wired.
- Windows production build certification: pending local dependency install/build.

### TypeScript compiler diagnostic
A global `tsc --noEmit` was also attempted. It cannot resolve project dependencies because `node_modules` is absent. The diagnostics referencing the R3 factory files are missing `react`, `lucide-react`, and `react/jsx-runtime`; no separate factory-domain/type error was emitted in those files before dependency resolution failed.
