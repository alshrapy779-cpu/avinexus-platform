# MASTER REQUIREMENTS — V20.2.5

## Release
**V20.2.5 – Workforce, Payroll & Managed Business Operations**

## Product objective
Extend the Windows/Web enterprise platform so every worker, veterinarian, consultant, accountant, storekeeper, factory worker, supervisor, sales employee, driver and manager can be tied to a business unit, contract, assignment, work evidence, compensation model, cost centre and financial posting without replacing any V8–V20.2.4 capability.

## Governing traceability rule
Every workforce cost must be traceable through:
**Employee → Contract → Assignment → Business Unit / Office / Farm / Flock / Factory → Attendance / Visit / Work Evidence → Payroll / Advance / Transport → Payer Responsibility → Cost Allocation → Treasury / Payable → Balanced Journal → Dashboard / Report / Audit.**

## Functional requirements

### A. Employee 360
1. Maintain one employee identity across transfers and assignments.
2. Support job families: worker, veterinarian, consultant, accountant, storekeeper, factory worker, production supervisor, sales, marketing, driver, laboratory, procurement, manager, IT and extensible other roles.
3. Store employment state, department, job title, supervisor, home business unit, contact and professional-license metadata.
4. Show assignments, compensation contracts, attendance, leave, advances, payroll and documents in Employee 360.

### B. Contracts and compensation
5. Support monthly salary, daily, hourly, per-visit, per-farm, per-cycle, commission and combination compensation models.
6. Support allowances, overtime, bonus, deductions and multiple currencies.
7. Support payer responsibility splits between platform, business unit and farm owner.
8. Preserve historical contracts instead of overwriting prior terms.

### C. Assignment and workforce scope
9. Assign employees to business unit, office, factory, farm, flock, warehouse or territory with effective dates and allocation percentages.
10. Preserve assignment history across transfers.
11. Allow cost-centre/farm/flock/factory attribution.
12. Validate invalid or orphan assignments.

### D. Attendance, schedules and leave
13. Maintain work schedules.
14. Record present, absent, leave, sick leave, official mission, field visit, overtime, late and early-departure entries.
15. Support field-oriented evidence/reference metadata for veterinarians and mobile workers.
16. Support leave request and approval/rejection workflow.

### E. Advances and employee liabilities
17. Employee advance request → approval → treasury payment → outstanding balance → payroll recovery.
18. Store installment rules and remaining balance.
19. Post advance and recovery into balanced accounting entries.

### F. Payroll
20. Maintain payroll periods per business unit.
21. Generate employee payroll from active contract and attendance/field metrics.
22. Calculate base salary or hourly/daily work, visits, farms, cycles, overtime, allowances, commission, bonuses, deductions and advance recovery where applicable.
23. Allocate payroll cost across assigned business units/farms/flocks/factories/cost centres.
24. Approve payroll before payment.
25. Support partial and full payroll payment.
26. Post salary expense/payable and payment journals.
27. Maintain payroll register and payment history.

### G. Factory workforce integration
28. Assign factory workers and production supervisors.
29. Capture direct labour against manufacturing orders.
30. Calculate labour cost per manufacturing order for use in factory costing.

### H. Veterinary workforce integration
31. Support veterinarian/consultant employee identities, compensation models and farm assignments.
32. Support field-visit attendance and per-visit remuneration.
33. Preserve the V20.2.1 territory and V20.2.2 veterinary workflow; do not replace them.
34. Prepare integration for on-call, leave coverage and automatic territory handover.

### I. Transport and field cost
35. Record driver/vehicle, route, farm/factory/warehouse context, distance, transport fee, fuel and loading cost.
36. Allocate transport cost to the responsible business unit/cost centre.
37. Post completed transport cost financially.

### J. Sales commissions
38. Support commission rules based on invoiced sales, collected sales or quantity.
39. Support percentage, amount-per-unit and tiered rules.
40. Integrate calculated commission into payroll contracts where configured.

### K. Managed business operations
41. Workforce data must respect existing business-unit separation.
42. Office/factory managers receive unit-level workforce dashboards.
43. Platform executives retain cross-unit oversight subject to authorization.
44. Workforce costs must roll into office/farm/factory financial reporting rather than a separate HR ledger.

### L. Documents, performance and audit
45. Register employee contract, identity, certificate, license, salary-amendment, leave and assignment document metadata with visibility controls.
46. Preserve workforce audit events for create/change/approve/pay operations.
47. Support performance snapshots without converting operational metrics into automatic employment judgments.
48. Flag expiring contracts in workforce dashboard.

### M. Security, API and preservation
49. Use the signed V20.2.1 authentication layer for V20.2.5 endpoints.
50. Enforce business-unit access using the existing enterprise scope model.
51. Preserve all V8–V20.2.4 source files, APIs and exported symbols unless explicitly listed as allowed integration changes.
52. Provide semantic regression tests and preservation audit.
53. Provide guarded upgrade and rollback package.

## Deferred / next-layer requirements
- Dedicated HR_MANAGER / PAYROLL_MANAGER role vocabulary and finer permission matrix.
- Biometric/time-clock provider integration.
- GPS/geofence production attendance provider.
- Printable PDF payslips and statutory/local payroll forms.
- Automatic synchronization between HR leave and veterinary territory replacement/on-call scheduling.
- Full automated worker/veterinarian performance metrics fed from every operational module.
- Advanced workforce planning/headcount budgeting.
- Full Executive BI and scheduled reporting (V20.2.6).
- Production deployment certification (hardening phase).

## Definition of Done
A capability is DONE only if all applicable layers are present: **Data Model → Backend/API → Authorization/Scope → Workflow/Validation → Windows/Web UI → Finance/Cost Impact → Audit → Tests → Preservation.** Any missing applicable layer keeps the capability PARTIAL.
