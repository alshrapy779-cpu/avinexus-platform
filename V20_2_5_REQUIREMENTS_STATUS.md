# V20.2.5 REQUIREMENTS STATUS

Status vocabulary: **DONE / PARTIAL / DEFERRED**. A visible screen alone is not considered DONE.

| Capability | Status | Evidence / limitation |
|---|---|---|
| Employee 360 data model | DONE | Unified profile plus assignments, contracts, attendance, leave, advances, payroll and documents. |
| Job-family model | DONE | Worker, veterinarian, consultant, accountant, storekeeper, factory worker/supervisor, sales, marketing, driver, lab, procurement, manager, IT and other. |
| Compensation contracts | DONE | Monthly/daily/hourly/per-visit/per-farm/per-cycle/commission/combination models. |
| Cost responsibility split | DONE | Platform/business-unit/farm-owner payer percentages validated to 100%. |
| Workforce assignment engine | DONE | Business unit/office/factory/farm/flock/warehouse/territory scopes with effective dates and allocation. |
| Work schedules | DONE | Effective schedule records with days/times/breaks. |
| Attendance / field attendance | DONE | Standard and field statuses, regular/overtime hours and evidence reference. |
| Leave workflow | DONE | Request and approve/reject lifecycle. |
| Veterinary HR linkage | PARTIAL | Veterinarian profiles, compensation, farm assignments and field visits are implemented; automatic leave → territory/on-call replacement remains future integration. |
| Worker performance automation | PARTIAL | Performance snapshots exist; full automatic KPI ingestion from every task/field module is deferred. |
| Employee advances | DONE | Request → approve → treasury payment → payroll recovery with balance tracking and journals. |
| Payroll periods | DONE | Business-unit payroll periods with duplicate/date controls. |
| Payroll calculation | DONE | Base/daily/hourly/visits/farms/cycles/overtime/allowances/commission/bonus/deductions/advance recovery supported. |
| Payroll cost allocation | DONE | Cost is allocated to assignment-linked business unit/farm/flock/factory/cost centre. |
| Payroll approval and posting | DONE | Approval posts salary expense/payable journals and advance recovery. |
| Partial/full payroll payment | DONE | Treasury movement + payment journal + line balance/status. |
| Multi-currency payroll | DONE | Uses enterprise currency and historical exchange rate fields. |
| Payroll register | DONE | Period register with gross/net/paid totals and employee detail. |
| Printable payslip/PDF | PARTIAL | Data is available; production PDF/document rendering is not yet closed. |
| Sales commission rules | DONE | Invoiced/collected/quantity basis plus percent/per-unit/tiered calculation. |
| Factory labour allocation | DONE | Manufacturing-order direct labour capture and labor-cost aggregation. |
| Factory costing automatic consumption of HR labour | PARTIAL | Labour allocation is available; automatic recalculation/posting back into every historical manufacturing batch is not yet closed. |
| Transport / driver cost | DONE | Trip, driver, route, distance, fees/fuel/loading and balanced financial posting. |
| Employee document registry | DONE | Metadata and visibility controls implemented; external object storage/provider remains deployment work. |
| Contract-expiry dashboard signal | DONE | Active contracts expiring within 30 days are surfaced. |
| Office/business-unit workforce dashboard | DONE | Employees, doctors, workers, factory staff, payroll outstanding, advances and pending items. |
| Managed-business separation | DONE | Workforce operations are business-unit scoped and use existing multi-business model. |
| Dedicated HR permission role | PARTIAL | Signed authentication and business-unit admin/finance/operate checks are used; dedicated HR/payroll permission taxonomy is future hardening. |
| Workforce audit trail | DONE | Create/approve/pay/assignment/attendance/document actions are audited. |
| Financial integration | DONE | Advance, payroll and transport journals are balanced; treasury movements recorded where applicable. |
| V20.2.5 API | DONE | 21 new unique routes; 220 V20.2.4 baseline routes preserved. |
| Windows/Web workspace | DONE | Workforce & Payroll workspace integrated in Enterprise Web navigation. |
| Semantic end-to-end test | DONE | Vet employee, assignment, attendance, leave, advance, payroll, factory labor, transport, document and finance scenario passes. |
| Regression V20.2.1–V20.2.4 | DONE | All previous semantic tests pass after V20.2.5 integration. |
| Preservation V8–V20.2.4 | DONE | 346-file V20.2.4 baseline preserved; zero missing routes/exports and no unauthorized baseline edits. |
| Production dependency build | PARTIAL | TypeScript syntax/domain checks pass; `npm run build` cannot run because local `vite`/`node_modules` are absent in this environment. |
| Production HR/provider integrations | DEFERRED | Biometric clock, GPS attendance provider, payroll bank rails and statutory/local forms require deployment/provider decisions. |

## Overall release status
**FUNCTIONALLY IMPLEMENTED / NOT YET PRODUCTION-HARDENED.** The core workforce/payroll operating loop is implemented and integrated with multi-business finance, factory labor and Windows/Web. Production certification remains a later hardening milestone.
