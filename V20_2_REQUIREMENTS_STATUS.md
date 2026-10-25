# V20.2 Requirements Status — Strict Definition of Done

**Release:** V20.2 – Enterprise Web Platform Completion  
**Baseline:** V20.1 – Architecture & Flock Ledger  
**Assessment rule:** a feature is `DONE` only when all applicable layers required by the feature are complete. `PARTIAL` is used whenever a required layer is incomplete. `N/A` means the layer is not material to that requirement.

## Executive status

V20.2 now contains an executable enterprise-web foundation, not only documentation: enterprise domain models, server endpoints, desktop workspaces, balanced accounting, daily-expense posting, HR contract/payroll foundation, veterinary tomorrow-plan tasking, report snapshots, environment separation and preservation tooling.

Under the strict completion contract, **V20.2 is still PARTIAL overall**. This is intentional reporting, not a hidden deficiency: advanced authentication, complete organization CRUD/scoping, full consultant workflows, attendance/performance, treasury/AP/AR operational workflows, reconciliation/period closing, automatic finance linkage for every flock event, evidence file storage, all report generators, full light-mode/table polish and a dependency-backed production build still require completion.

Legend: `D` = DONE, `P` = PARTIAL, `N/A` = not applicable.

| # | V20.2 domain | Data Model | Backend/API | UI | RBAC | Validation | Audit | Finance Impact | Reports | Tests | Preservation | Overall |
|---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | Executive / Manager Command Center | D | D | D | P | D | P | D | P | P | D | **P** |
| 2 | Organization → Departments → Branches → Roles → Users → Scopes → Assignments | D | P | P | P | P | P | N/A | P | P | D | **P** |
| 3 | Veterinary workspace + Tomorrow Plan → Worker Tasks | D | D | D | P | D | D | P | P | D | D | **P** |
| 4 | Specialty consultant workspaces | D | P | P | P | P | P | N/A | P | P | D | **P** |
| 5 | HR / employees / contracts / compensation / payroll | D | D | D | P | P | D | D | P | P | D | **P** |
| 6 | Cost Responsibility Matrix | D | D | D | P | D | P | D | P | P | D | **P** |
| 7 | Daily Expense Management | D | D | D | P | D | D | D | P | D | D | **P** |
| 8 | Financial Command Center | D | D | D | P | D | D | D | P | D | D | **P** |
| 9 | Balanced Double-Entry Accounting | D | D | D | P | D | D | D | D | D | D | **P** |
| 10 | SAR / YER OLD / YER NEW / USD + historical FX metadata | D | D | D | P | D | D | D | P | P | D | **P** |
| 11 | Farm/Flock Cost Centers + cost summaries | D | D | D | P | D | D | D | P | D | D | **P** |
| 12 | Farm Owner Workspace | D | P | D | P | D | P | D | P | P | D | **P** |
| 13 | Flock Ledger + Finance integration | D | P | P | P | D | D | D | P | P | D | **P** |
| 14 | Professional Reports Center | D | D | D | P | D | D | D | P | P | D | **P** |
| 15 | Role Task Center | D | D | D | P | D | D | P | P | D | D | **P** |
| 16 | Legacy modules moved away from primary navigation | D | N/A | P | P | D | N/A | N/A | N/A | P | D | **P** |
| 17 | Desktop shell / sidebar / workspace / context drawer / density | D | N/A | D | P | P | N/A | N/A | N/A | P | D | **P** |
| 18 | DEMO / DEVELOPMENT / STAGING / PRODUCTION isolation | D | D | P | D | D | D | D | N/A | D | D | **P** |
| 19 | Unified Web/Android-ready backend/domain services | D | D | D | P | D | D | D | D | P | D | **P** |
| 20 | Packaging, upgrade, rollback, preservation and validation artifacts | D | N/A | N/A | N/A | D | D | N/A | D | D | D | **D** |

## Implemented V20.2 foundation

- `EnterpriseWebPlatformV20_2.ts` is the central additive domain layer.
- V20.1 `EnterprisePoultryCoreV20.ts` remains in place; V20.2 does not replace the flock-ledger baseline.
- Enterprise state now carries `enterprise_web_v20_2` alongside the preserved V20.1 state.
- Daily expenses resolve payer policy, retain original currency/rate metadata, require a cost center and can create a balanced posted journal after approval.
- Unbalanced posted journal attempts throw an error.
- Doctor Tomorrow Plans generate executable worker tasks for feed, environment, weight sample, treatment, vaccination, litter, maintenance and required items.
- Task status supports `pending`, `in_progress`, `completed`, `overdue`, `rejected`, `unable_to_execute`, `evidence_missing`.
- HR includes employee records, employment contracts, compensation models and payroll calculation/payer split foundation.
- Financial summaries derive a trial balance, income statement, balance-sheet check, cash balance and cost-center margin from posted V20.2 journals.
- The desktop V20.2 workspace provides role-filtered sections for command, veterinary, specialists, HR, finance, expenses, owner, reports, tasks, organization and preserved legacy modules.
- Server state files are environment-specific. Production does not reuse the V20.1 development JSON state and receives a clean bootstrap system-owner.

## Known completion gaps that must remain PARTIAL

1. Replace header-only role trust (`X-User-Role`) with authenticated server identity/JWT/session claims and server-side scope authorization per record.
2. Complete CRUD and approval workflows for organization, branches, user scopes and assignments.
3. Consolidate all clinical/lab/necropsy/medication legacy workflows inside the new doctor and specialty workspaces.
4. Complete attendance, schedules, performance appraisal, documents, advances/bonus/deduction approval and payroll payment/posting lifecycle.
5. Complete treasury, bank/cashbox/exchange ledgers, AP/AR invoice lifecycle, credit control, three-way matching, reconciliation, period close/reopen and realized/unrealized FX.
6. Automatically map every relevant V20.1 flock event (arrival, mortality/cull/transfer/sale, feed consumption etc.) to configurable financial events where appropriate.
7. Add real attachment/evidence persistence rather than reference strings only.
8. Implement each Reports Center definition as an audited generated report with filters/export and role scope.
9. Finish client-side production seed hardening/offline behavior so no demo fallback can appear when a production API is unavailable.
10. Complete light-mode contrast and enterprise-table/filter/sticky-header polish across the new workspace.
11. Run a dependency-backed `npm install` and `npm run build` in an environment where package installation completes, then run browser/API integration tests before production certification.
