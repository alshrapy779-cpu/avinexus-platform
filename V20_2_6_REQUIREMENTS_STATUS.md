# V20.2.6 REQUIREMENTS STATUS

Release: **V20.2.6 – Executive Intelligence, Reports & Business Control**  
Baseline: **V20.2.5 – Workforce, Payroll & Managed Business Operations**  
Platform: **Windows/Web first; Android remains deferred**.

Status vocabulary: **DONE / PARTIAL / DEFERRED**. A dashboard card alone is not considered DONE.

| Capability | Status | Evidence / limitation |
|---|---|---|
| Derived Executive Command Center | DONE | KPIs are calculated from enterprise source records rather than duplicated balances. |
| Business-unit filter/scope | DONE | Intelligence APIs/UI support business-unit scope with V20.2.1 bearer security. |
| Business-unit profitability | DONE | Revenue/expense journal-based profitability and comparison are derived by unit. |
| Farm/flock profitability | PARTIAL | Cost-centre foundations exist; final result requires complete automatic finance mapping for all relevant flock events. |
| Cost/Bird and live Cost/kg | PARTIAL | Existing farm/flock/financial data can support it, but complete event-to-finance coverage is not yet certified. |
| AR aging | DONE | Current/1–30/31–60/61–90/90+ buckets derived from open sales invoices. |
| AP aging | DONE | Current/1–30/31–60/61–90/90+ buckets derived from open purchase invoices. |
| Current cash/treasury position | DONE | Current business-unit treasury account balances are exposed. |
| Forward treasury forecast | PARTIAL | Future cash forecast from scheduled inflows/outflows is not yet a full forecasting engine. |
| Inventory intelligence | DONE (core) | Stock value, low-stock state and issue-history coverage are derived from stock records. |
| Predictive stock coverage | PARTIAL | Full farm-demand/production-plan forecasting remains later. |
| Factory intelligence | DONE (core) | Manufacturing order/batch/output/yield/loss/cost indicators derive from V20.2.4 data. |
| Veterinary intelligence | DONE (core) | Open/critical cases, withdrawal controls, review queues, doctor workload and lab indicators are derived. |
| Workforce intelligence | DONE (core) | Active staff, workforce categories, payroll outstanding, advances and expiring contracts are derived. |
| Exception Command Center | DONE (core) | Unified exception records, severity, owner, lifecycle, notes/evidence and source links implemented. |
| Automatic exception derivation | DONE (core) | Existing business exceptions, overdue AR/AP, critical medical cases and expiring contracts are included. |
| Automatic background SLA/escalation delivery | PARTIAL | Lifecycle/SLA metadata exists; recurring scheduler/external channel delivery remains hardening work. |
| Data-quality scan | DONE (core) | Existing domain validators plus unbalanced-journal/negative-stock checks are consolidated. |
| Reconciliation dashboard | DONE (core) | AR/customer-ledger, AP/supplier-ledger, journal and stock integrity checks implemented. |
| Bank reconciliation / period close | PARTIAL | Remains V20.2.7 control closure. |
| Report-definition catalog | DONE | Executive, profitability, aging, cash, inventory, factory, veterinary, workforce and data-quality definitions seeded. |
| Auditable report snapshots | DONE | Snapshot generation stores parameters, source scope, output payload and audit event. |
| Report schedule definitions | DONE | Frequency/output-format schedule metadata implemented. |
| Automatic scheduled execution/delivery | PARTIAL | Scheduler, PDF/XLSX renderer and email/WhatsApp delivery adapters are not production-wired yet. |
| Drill-down to source | DONE (core) | Invoice, receiving, customer/supplier, medical/lab, manufacturing/batch/dispatch, employee/payroll, journal and role-task entities supported. |
| Advanced cross-office benchmarking | PARTIAL | Unit-by-unit comparisons exist; advanced trends/benchmarks remain later. |
| V20.2.6 API | DONE | 19 unique V20.2.6 routes added above baseline. |
| Windows/Web intelligence workspace | DONE | Dedicated navigation/workspace with role-aware default for executive/finance users. |
| Semantic End-to-End test | DONE | Aging, stock, profitability, exceptions, quality, reconciliation, report, schedule, command center and drill-down scenario passes. |
| Regression V20.2.1–V20.2.5 | DONE | All previous semantic tests pass after V20.2.6 integration. |
| Preservation V8–V20.2.5 | DONE | 362/362 V20.2.5 baseline files, 241/241 baseline API routes and 1000/1000 captured baseline exports preserved; 260 unique routes now present. |
| Production dependency build | PARTIAL | Source/domain checks run; dependency-backed Vite production certification remains unavailable until node_modules are installed. |

## Overall release assessment
**FUNCTIONALLY IMPLEMENTED COMMAND/CONTROL INCREMENT / NOT YET PRODUCTION-HARDENED.**

V20.2.6 converts the data already produced by farms, veterinary operations, offices, finance, inventory, factory and workforce into a common management/control layer. It intentionally does not claim that final accounting close, complete farm-event costing, external report delivery or production deployment hardening are finished.
