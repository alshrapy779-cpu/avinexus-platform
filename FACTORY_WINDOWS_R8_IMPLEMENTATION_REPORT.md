# AviNexus Poultry Enterprise — V20.2.9 Windows R8 Factory Completion & Closure

## Purpose
R8 is a broad Factory completion pass. It does **not** create a new department. It preserves Windows R7 and the earlier Factory Production R3/Farm baselines while strengthening the real Windows Factory control center.

## Protected baseline
- R7 baseline files checked: **500**
- Missing baseline files: **0**
- Unexpected baseline modifications: **0**
- Allowed cumulative integration edits: **6**
- No Factory, Farm, customer/office/partner, inventory, accounting or historical data domain was removed.

## Factory scope retained
The 15 Factory sections and all **189** existing registered screens remain present:

| Section | Domain | Screens | Source/owner rule |
|---|---|---:|---|
| 1 | Raw Materials | 7 | Material master + S7 references |
| 2 | Suppliers | 5 | Supplier relationship/commercial master |
| 3 | Purchasing & Receiving | 15 | PR/RFQ/PO/GRN docs; S7 inventory; S12 accounting |
| 4 | Formulas | 3 | Versioned formula master |
| 5 | Work Orders | 3 | Planning / staging; no double consumption |
| 6 | Actual Production | 3 | Production actual source |
| 7 | Inventory | 7 | **S7 sole inventory owner** |
| 8 | Factory Dispatch | 3 | Physical dispatch; S7 movements |
| 9 | Customers & Sales | 10 | Commercial documents; no direct AR ledger |
| 10 | Customer Statements | 5 | Presentation only; S12 AR truth |
| 11 | HR & Payroll | 15 | S11 operational HR/payroll |
| 12 | Treasury & Accounting | 27 | **S12 sole accounting owner** |
| 13 | Transport | 13 | S13 operational transport |
| 14 | Reports & Analytics | 32 | S14 report execution/presentation |
| 15 | Settings & Governance | 41 | S15 policies/tolerances/governance |

## Significant R8 additions
### 1. Factory role command layer
R8 defines 16 responsibility profiles: Executive, Factory Manager, Procurement, Receiving/Weighbridge, Nutritionist, Production Planner, Production Operator, Warehouse, Dispatch, Sales, Accountant, Treasury, HR/Payroll, Transport, Quality, and Audit/Governance.

Each profile has:
- assigned Factory sections;
- explicit responsibilities;
- upstream/downstream handoffs;
- critical screen destinations;
- no second inventory or accounting authority.

### 2. Factory operational inbox
The main Factory dashboard now exposes work queues for open purchase requisitions, purchase orders awaiting receiving, manufacturing orders not completed, production actuals needing review, incomplete dispatches, and invoice/receiving matching work.

### 3. Six critical end-to-end chains
R8 makes the following chains visible from the Factory control center:
- Supplier → PR → RFQ/Quote → PO → Receiving → S7 → AP/S12
- Formula → Work Order → Staging/WIP → Actual Production → Finished Goods → Final Cost
- Sales Order → Credit → Dispatch → POD → Invoice → Receipt → Customer Statement
- Employee → Attendance/Leave/Advance → Payroll → S12 Payable → Treasury Payment
- Transport Zone/Rate → Trip → Loading → POD → Claim/Earning → Accounting
- S7 materials + S11 labor + S12 overhead + S6 actuals → final manufacturing cost / true-up

### 4. Deep-linkable Factory screens
All Factory screens can be addressed using `factoryScreen=<SCREEN_CODE>`. Deep links restore the selected section/screen on load and are cleared when returning to the Factory home.

### 5. Screen action contract
Every registered Factory screen now exposes a consistent Windows action dock:
- navigate to the owning operational workflow;
- jump to screen data/history;
- export a screen snapshot;
- print the current screen;
- copy a deep link;
- show source owner and responsible roles;
- show create/update/approval capability where applicable.

The action dock does not invent a second write engine. Actual state-changing actions remain in the owning section workflow.

### 6. Factory document and print center
The main dashboard links operational documents to their real screens: purchase orders, GRNs, supplier invoices, manufacturing orders, production actuals, sales orders, customer statements, payroll, transport trips and frozen reports. Current-screen printing is available from the Factory control center.

### 7. Section acceptance matrix
R8 explicitly distinguishes **Source/UI Wired** from **Windows Accepted**. A section is not frozen merely because its registry/backend/tests exist. Target-Windows visible testing is required.

### 8. Preservation and governance
- Section 7 remains the only inventory movement/balance/valuation owner.
- Section 12 remains the only GL/AP/AR/Treasury/cost-accounting owner.
- Section 11 owns HR/payroll calculation and employee operational records.
- Section 14 owns report execution/presentation.
- Section 15 owns versioned policies/tolerances/approval matrices.
- Historical records remain append-only/reversal based; no destructive financial history deletion is introduced.

## Automated verification
Retained semantic/runtime suites plus R8 pass **456/456** checks:
- V20.2.9 semantic: 45/45
- Factory 15-section semantic: 58/58
- Factory full-screen registry: 24/24
- Factory Production R3: 95/95
- Farm R4 runtime: 67/67
- Farm R4 integration: 20/20
- Farm Windows R5: 30/30
- Farm Windows R6: 41/41
- R7 Customer/Office/Partner: 31/31
- R8 Factory Windows closure: 45/45

R8 preservation: 500 baseline files, 0 missing, 0 unexpected modifications.

## Production completion status
R8 is a source/UI/workflow closure release, but Factory is **not production-frozen yet**. Final closure requires on the target Windows machine:
1. dependency installation;
2. `npm run verify:factory-windows-r8`;
3. Vite/esbuild production build;
4. production startup;
5. visible role-by-role screen/button testing;
6. persistence after restart;
7. reports/documents/printing acceptance;
8. complete end-to-end Factory chains.

Only after those pass should Factory be marked 100% frozen.
