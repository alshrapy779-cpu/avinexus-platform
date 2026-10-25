# Factory Windows R8 — Responsibility Matrix

| Role | Primary responsibility | Main sections | Required handoff |
|---|---|---|---|
| Executive | Factory performance, major exceptions, governance | 9,10,12,14,15 | Manager/Accounting → Executive |
| Factory Manager | Overall Factory operational accountability | 1–15 | All Factory roles → Manager |
| Procurement | PR/RFQ/PO/supplier commercial sourcing | 1,2,3 | Warehouse/Planner → Procurement → Receiving/AP |
| Receiving / Weighbridge | Arrival, weighbridge, GRN, quantity/quality disposition | 3,7 | Procurement → Receiving → S7/AP |
| Nutritionist | Starter/Grower/Finisher formulation and version approval | 1,4,6 | Quality/Materials → Nutrition → Planner |
| Production Planner | Work orders, staging/WIP, plan vs actual | 4,5,6 | Nutrition → Planner → Operator/Warehouse |
| Production Operator | Actual input/output, timestamps, variance | 5,6 | Planner → Operator → Supervisor/Manager |
| Warehouse | Daily stock, reservation, transfer, issue, counts/quarantine | 1,3,5,7,8 | Receiving → Warehouse → Production/Dispatch |
| Dispatch | Pick/load/gate-out/POD/returns | 7,8,9,13 | Sales → Dispatch → Customer/Transport |
| Sales | Customer, pricing, credit, sales order, commercial invoice | 8,9,10 | Customer → Sales → Dispatch/Accounting |
| Accountant | AP/AR/GL/manufacturing cost/reconciliations | 2,3,9,10,11,12,13,14 | Operations → Accounting → Treasury/Executive |
| Treasury | Cash/bank, supplier/employee/customer transfers and receipts | 10,12 | Accounting → Treasury → Counterparty |
| HR / Payroll | People, attendance, leave, advances, payroll | 11,12 | Supervisor → HR → Accounting/Treasury |
| Transport | Drivers/vehicles/zones/rates/trips/POD | 8,13 | Dispatch → Transport → Accounting |
| Quality | Raw-material acceptance, production quality, quarantine, variances | 1,3,4,6,7,14 | Receiving/Production → Quality → Manager |
| Audit / Governance | RBAC, SoD, policies, audit, retention and controls | 2,7,12,14,15 | All sections → Audit → Executive |

## Non-negotiable ownership
- Inventory = Section 7
- Accounting = Section 12
- HR/payroll operational calculation = Section 11
- Transport operations = Section 13
- Report execution = Section 14
- Policies/governance = Section 15

No role may create a parallel ledger or inventory balance engine.
