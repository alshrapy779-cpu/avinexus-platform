# V20.2.1 REQUIREMENTS STATUS

**Release:** V20.2.1 — Core Enterprise Foundation  
**Baseline:** V20.2 — Enterprise Web Platform Completion  
**Overall status:** **PARTIAL / DEVELOPMENT BASELINE**  
**Production certification:** **NO**

This status follows the strict Definition of Done. A visible screen or data model alone is not counted as DONE.

| Requirement | Status | Implemented now | Remaining before DONE |
|---|---|---|---|
| Preservation V20.2 | DONE | 286/286 baseline files present; old API routes and TS exports preserved; only explicitly allowed baseline files changed | Continue re-running on each patch |
| Secure authentication core | PARTIAL | PBKDF2-SHA512 password hashing, HMAC signed bearer access tokens, expiry, lockout, logout revocation, auth-version session invalidation, production secret guard | Migrate full UI/account switcher and legacy routes; refresh-token/session UX; MFA/device/rate-limit hardening |
| Enterprise identities | PARTIAL | Identity records with role, department, branches, scopes, allow/deny permissions, locale/timezone, active flag | Full admin CRUD UI and lifecycle flows |
| RBAC permissions | PARTIAL | Dynamic role + identity permission calculation; deny overrides; current identity checked on secure API requests | Migrate all V20.2 legacy routes from header trust to V20.2.1 bearer authorization |
| Scope enforcement | DONE at domain/API foundation | Global/governorate/district/branch/farm/flock scopes; inheritance; allow/deny tests | Broader end-to-end UI integration remains outside this foundation item |
| Organization departments/branches/roles | PARTIAL | Secure APIs and validated upsert operations | Full organization hierarchy CRUD UI, organization-level lifecycle, import/export |
| Veterinary territories | DONE at foundation level | Territory model by governorate/district/branch/farm/flock; validated creation | Operational veterinary UI belongs to V20.2.2 |
| Veterinary coverage assignments | DONE at foundation level | Primary/backup/on-call/consultant roles, specialty, priority, period, workload limits, scope | Operational scheduling/roster UX in V20.2.2 |
| Primary veterinarian conflict protection | DONE | Prevents overlapping active/scheduled primary coverage for same specialty including cross-territory farm/flock overlap | Continue expanding edge-case tests as territory model grows |
| Veterinary workload | DONE at foundation level | Per-veterinarian assignment/farm/flock counts and limit flags | Case severity/time workload scoring in V20.2.2 |
| Veterinary handover | PARTIAL | Handover model and API preserving farms/flocks/case/plan/lab/medication references | Acceptance workflow and operational timeline UI in V20.2.2 |
| Approval engine | PARTIAL | Tiered workflow definitions, approval requests, pending-step progression, rejection and audit | Workflow-definition administration UI; link every business module to common engine |
| Delegation of Authority | DONE at foundation level | Period, permissions, scope and amount limits; delegated approval validation | Administrative UI and expiry notification |
| Master Data | PARTIAL | Validated bilingual master-data records and secure API | Full domains catalog, UI, dependency/version policies |
| Evidence/Documents | PARTIAL | Evidence metadata, SHA-256 validation, immutable flag, entity link and storage key | Actual binary/object storage, malware scanning, retention, preview/download authorization |
| Notifications | PARTIAL | Policy records and internal queued notifications | Real email/SMS/WhatsApp/push delivery, retry, templates, acknowledgements/escalation |
| Localization | PARTIAL | Arabic/English configuration, default/fallback/RTL rules, secure settings API | Complete translation catalog and full UI language switch |
| Audit | PARTIAL | Foundation domain changes record actor/action/entity/before/after metadata | Tamper-evident persistence, retention/archival and cross-module unification |
| Foundation UI | PARTIAL | Read-only management visibility, veterinary workload, territories, workflows and validation state | Secure authenticated editing screens and full UX |
| Production build | BLOCKED/NOT CERTIFIED | Source-level and semantic checks pass | Dependency-backed `npm install` + production build not certified in this environment |

## Release decision
V20.2.1 is suitable as the next development baseline and architecture foundation. It is **not** declared production-ready and it does **not** supersede V20.2.7 production-hardening requirements.
