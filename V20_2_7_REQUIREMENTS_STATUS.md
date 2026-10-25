# V20.2.7 REQUIREMENTS STATUS

Release: **V20.2.7 — Windows Completion & Enterprise Control Closure**  
Baseline: **V20.2.6 — Executive Intelligence, Reports & Business Control**  
Platform: **Windows/Web first; Android remains deferred**.

Status vocabulary: **DONE / PARTIAL / DEFERRED**. `DONE` in this document means implemented and semantically validated at the application/domain level where applicable; it does not override the separate V20.2.8 production-certification boundary.

| Capability | Status | Evidence / limitation |
|---|---|---|
| V8–V20.2.6 preservation | DONE | Complete V20.2.6 file/API/export baseline is preservation-tested; only allow-listed integration files may change. |
| Bearer-first sensitive legacy API gate in STAGING/PRODUCTION | DONE | Mutating/sensitive API access fails closed to Bearer identity except explicit public auth/health endpoints. Development compatibility remains intentional. |
| Rotating refresh sessions | DONE | Refresh token is persisted only as SHA-256 hash; rotation revokes the prior session and old-token reuse is rejected. |
| Client auth gate/session refresh | DONE | Production/staging UI requires server auth, injects Bearer token and can refresh once on 401. |
| Device session registry/revocation | DONE | Device sessions and revoke action exist. |
| MFA state foundation | DONE (foundation) | Enrollment/verified/disabled state exists. Real OTP/TOTP provider challenge and mandatory second-factor enforcement are production/provider work. |
| Granular permission taxonomy | DONE | HR/Payroll/Finance/Procurement/Inventory/Veterinary/Executive/security/document/report permissions defined and used by V20.2.7 APIs. |
| Full organization lifecycle audit | DONE (control layer) | Organization/user/role/scope/assignment lifecycle actions can be recorded; inherited CRUD remains preserved. Polished all-in-one org admin UX can continue as UX refinement. |
| Doctor leave → Backup/On-call coverage | DONE | Approved leave derives a temporary replacement from existing eligible coverage. |
| Veterinary KPI derivation | DONE | Assignment/case/consultation/lab/follow-up metrics derive from operational sources. |
| Medication lot/batch ↔ inventory | DONE | Approved medication order can issue a specific product lot and records the inventory movement/cost. |
| Accounting periods close/reopen | DONE (application control) | Period lifecycle and balanced-journal validation implemented. Database-level hard lock across every future deployment transaction remains V20.2.8. |
| Bank reconciliation | DONE (core) | Book vs statement balance and variance status recorded/audited. |
| Budget controls | DONE (core) | Enterprise budget record creation integrated with existing cost centers/accounts. |
| FX approval records | DONE | Historical approved rate records implemented. |
| Full realized/unrealized FX revaluation | DEFERRED | Production-grade balance revaluation/settlement engine remains later accounting hardening. |
| Flock finance rules/events | DONE | Configurable event mapping posts double-entry journals. |
| Farm/flock profitability + Cost/Bird/live kg | DONE for mapped events | Accurate result requires all relevant real deployment events to use the configurable finance mappings; semantic scenario validates the calculation. |
| Three-way matching | DONE (core) | PO/accepted receipt/purchase invoice quantities and values are compared with status. |
| Supplier scorecards | DONE (core) | Delivery/quality scores derive from real PO/receipt history. |
| Procurement claims | DONE | Claim lifecycle record supported for shortage/damage/quality/price/late delivery/other. |
| Inventory cycle count + adjustment | DONE | Physical vs system quantity, variance and approved stock movement implemented. |
| Quarantine release/reject | DONE | Lot quarantine has explicit reviewed release/reject decision with audit. |
| Inventory lot/expiry traceability | DONE (existing + closure) | Existing movement lot/expiry fields preserved and used by medication/QC/quarantine controls. |
| Advanced predictive stock forecasting | PARTIAL | V20.2.6/7 coverage and production-plan foundations exist; fully trained/validated demand forecasting remains future intelligence work. |
| Factory QC | DONE (core) | Raw-material/production-batch QC record and outcome implemented. |
| Least-cost formulation | DONE (application optimizer) | Deterministic constrained formulation foundation implemented; not represented as a nutritionist-certified solver and always needs human formulation approval. |
| Production planning | DONE (core) | Demand + safety stock + finished stock → recommended production. |
| Automatic historical batch recosting | PARTIAL | Existing direct labour/material costing is preserved; retroactive recosting of closed historical periods is intentionally not automatic. |
| Employee contract renewal/versioning | DONE | Old contract history preserved; new version generated. |
| Managed-business contract renewal/versioning | DONE | Old contract expires, replacement contract becomes active and linked farms/unit references migrate. |
| Workforce KPI derivation | DONE | Assignment, attendance, field visit, overtime, task and payroll metrics derive from source state. |
| Payslip snapshot | DONE (data/render contract) | Auditable payslip data snapshot generated. Final statutory/local PDF rendering remains deployment/localization work. |
| Unified document/evidence index | DONE (application index) | Existing evidence metadata can be indexed by entity/classification. Binary object storage/malware scan/retention enforcement are V20.2.8. |
| Notification delivery lifecycle | DONE (application layer) | Queue/sent/acknowledged/failed tracking implemented for all target channels. Real external provider transport requires credentials/integration. |
| Scheduled report execution | DONE (control layer) | Schedule can be executed against an available auditable snapshot. PDF/XLSX binary rendering/external delivery remain production integration. |
| Arabic/English user preference | DONE | `ar/en` preference and RTL/LTR direction implemented in V20.2.7 state/UI. Full historical legacy-string translation is ongoing UX cleanup. |
| Offline idempotent command queue | DONE (core) | Duplicate idempotency keys are blocked/reused and command terminal statuses are tracked. |
| Production browser-data safety | DONE (client control) | When production/staging auth is required, browser local enterprise state is not used as the authoritative persistence fallback. |
| Windows/Web V20.2.7 workspace | DONE | Control-closure section integrated in the enterprise workspace with dedicated login gate for required environments. |
| Source-level TypeScript checks | DONE | V20.2.7 domain, server and client/App checks pass with temporary external dependency type stubs. |
| Semantic End-to-End V20.2.7 | DONE | Complete closure scenario passes with `validation_issues = 0`. |
| Regression V20.2.1–V20.2.6 | DONE | All previous semantic suites pass after V20.2.7 integration. |
| Dependency-backed production build | PARTIAL / NOT CERTIFIED | `npm run build` cannot run in this execution environment because local `node_modules`/Vite are unavailable (`vite: not found`). |
| Production database/security/DR/monitoring/load certification | DEFERRED | Explicit V20.2.8 scope. |
| Android field app | DEFERRED | Starts only after V20.2.8; reuses the same backend and domain contracts. |

## Overall release assessment
**FUNCTIONALLY IMPLEMENTED WINDOWS CONTROL-CLOSURE / NOT YET PRODUCTION-HARDENED.**

V20.2.7 closes the major application-level loops required before production hardening while preserving previous versions. It does not falsely claim completion of provider/infrastructure/database concerns that require the V20.2.8 deployment environment.
