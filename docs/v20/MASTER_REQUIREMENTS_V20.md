# V20 Master Requirements Registry

Total requirements: **237**

> Stable IDs are the source of truth. Existing functionality is preserved unless an explicit approved removal requirement is created.

## PACK ARCH

| ID | Requirement | Status |
|---|---|---|
| REQ-ARCH-001 | Master requirements registry with stable IDs | implemented |
| REQ-ARCH-002 | Preservation baseline for V19.7 files/routes/exports | implemented |
| REQ-ARCH-003 | Patch-pack manifest and overlay upgrade mechanism | implemented |
| REQ-ARCH-004 | Rollback script and backup before patch | implemented |
| REQ-ARCH-005 | Central application version constant | implemented |
| REQ-ARCH-006 | No-delete compatibility policy for V8-V19.7 | implemented |
| REQ-ARCH-007 | Definition of Done checklist per requirement | implemented |
| REQ-ARCH-008 | Demo/Development/Staging/Production environment separation | planned |
| REQ-ARCH-009 | Brand settings centralization for name/logo/tagline | planned |
| REQ-ARCH-010 | Desktop/Web and Android role distribution | documented |
| REQ-ARCH-011 | Real-time API sync contract between field and office | planned |
| REQ-ARCH-012 | Offline-first field cache and conflict model | partial |
| REQ-ARCH-013 | System health dashboard for API/database/realtime/AI/backups/providers | planned |

## PACK FLOCK

| ID | Requirement | Status |
|---|---|---|
| REQ-FLOCK-001 | Flock Master Record | implemented |
| REQ-FLOCK-002 | Population accounting equation and reconciliation | implemented |
| REQ-FLOCK-003 | Arrival mortality separated from farm mortality | implemented |
| REQ-FLOCK-004 | Daily farm mortality and cumulative mortality rates | implemented |
| REQ-FLOCK-005 | Livability percentage | implemented |
| REQ-FLOCK-006 | 3-day and 7-day mortality trends | planned |
| REQ-FLOCK-007 | Flock Population Ledger | implemented |
| REQ-FLOCK-008 | No silent historical population edits | implemented |
| REQ-FLOCK-009 | Reconciliation correction approval workflow | implemented |
| REQ-FLOCK-010 | Weight sampling raw observations | partial |
| REQ-FLOCK-011 | Average/median/min/max weight | implemented |
| REQ-FLOCK-012 | CV% calculation | implemented |
| REQ-FLOCK-013 | Uniformity calculation | implemented |
| REQ-FLOCK-014 | ADG/daily gain | implemented |
| REQ-FLOCK-015 | Breed-standard weight variance | partial |
| REQ-FLOCK-016 | Sampling locations and fasted/fed condition | implemented |
| REQ-FLOCK-017 | Intelligent sample size/location scheduling | planned |
| REQ-FLOCK-018 | Feed opening/received/used/closing ledger | implemented |
| REQ-FLOCK-019 | Cumulative feed consumption | implemented |
| REQ-FLOCK-020 | Feed per bird per day | implemented |
| REQ-FLOCK-021 | Feed days remaining forecast | implemented |
| REQ-FLOCK-022 | FCR formula identification and inputs | implemented |
| REQ-FLOCK-023 | Water daily/cumulative metrics | implemented |
| REQ-FLOCK-024 | Water per bird and water:feed ratio | implemented |
| REQ-FLOCK-025 | Environment min/max/average temperature | implemented |
| REQ-FLOCK-026 | Humidity metrics | implemented |
| REQ-FLOCK-027 | Ventilation/lighting/heater/fan periodic readings | planned |
| REQ-FLOCK-028 | Medication timeline | partial |
| REQ-FLOCK-029 | Vaccination timeline | partial |
| REQ-FLOCK-030 | Farm on-hand stock separated from supplier availability | documented |
| REQ-FLOCK-031 | Daily Flock Closing gate | implemented |
| REQ-FLOCK-032 | Daily data completeness score | implemented |
| REQ-FLOCK-033 | AI logic validation before close | implemented |
| REQ-FLOCK-034 | Veterinary review before final daily close | implemented |
| REQ-FLOCK-035 | Weekly Performance Report | implemented |
| REQ-FLOCK-036 | Owner Daily Dashboard core KPIs | implemented |
| REQ-FLOCK-037 | Executive Farm Dashboard core KPIs | implemented |
| REQ-FLOCK-038 | Exception-based farm table | partial |
| REQ-FLOCK-039 | End-of-Cycle Report foundation | implemented |
| REQ-FLOCK-040 | Reports Center snapshots | implemented |
| REQ-FLOCK-041 | Fixed flock summary strip on flock screens | implemented |

## PACK VET

| ID | Requirement | Status |
|---|---|---|
| REQ-VET-001 | Verified Veterinary Network | existing |
| REQ-VET-002 | Worker boundary: records data but cannot approve treatment | existing |
| REQ-VET-003 | Veterinary Decision Support Engine | existing |
| REQ-VET-004 | AI proposal -> vet review -> approval -> worker task | existing |
| REQ-VET-005 | Clinical case timeline | existing |
| REQ-VET-006 | Differential diagnosis terminology instead of definitive AI diagnosis | planned |
| REQ-VET-007 | Evidence quality gate for necropsy/droppings images | planned |
| REQ-VET-008 | Laboratory chain of custody | planned |
| REQ-VET-009 | Clinical diagnosis vs laboratory-confirmed state machine | planned |
| REQ-VET-010 | Antibiotic stewardship | existing |
| REQ-VET-011 | Withdrawal period gate | existing |
| REQ-VET-012 | Healthy Poultry certification gate | existing |
| REQ-VET-013 | Biosecurity score and gaps list | existing |
| REQ-VET-014 | Biosecurity visit check-in | existing |
| REQ-VET-015 | Disease risk radar as warning signal, not diagnosis | existing |
| REQ-VET-016 | On-call veterinarian emergency escalation | existing |
| REQ-VET-017 | Veterinary treatment alternatives approval gate | existing |
| REQ-VET-018 | Farm operating protocol versioning | existing |
| REQ-VET-019 | Daily veterinary report | planned |
| REQ-VET-020 | AI daily analysis report with confidence and missing data | planned |

## PACK MARKET

| ID | Requirement | Status |
|---|---|---|
| REQ-MARKET-001 | Marketplace Customer separated from Managed Farm Customer | existing |
| REQ-MARKET-002 | Guest checkout | existing |
| REQ-MARKET-003 | Progressive conversion to Managed Customer | planned |
| REQ-MARKET-004 | Service packages | existing |
| REQ-MARKET-005 | Supplier Availability instead of platform-owned stock | existing |
| REQ-MARKET-006 | Daily supplier availability attestation | existing |
| REQ-MARKET-007 | Stale offer protection | existing |
| REQ-MARKET-008 | Request availability before purchase when unconfirmed | existing |
| REQ-MARKET-009 | Nearest branch routing | existing |
| REQ-MARKET-010 | Supplier response SLA and failover | existing |
| REQ-MARKET-011 | Cold-chain-aware routing | existing |
| REQ-MARKET-012 | Alternative engine for non-medical goods | existing |
| REQ-MARKET-013 | Scientific alternative matching for medicines/vaccines | existing |
| REQ-MARKET-014 | Veterinary gate for therapeutic alternatives | existing |
| REQ-MARKET-015 | Emergency wait-time decision and inter-governorate route | existing |
| REQ-MARKET-016 | Customer 360 identity/location/farm/flock/clinical/commercial | partial |
| REQ-MARKET-017 | Smart customer profiling | planned |
| REQ-MARKET-018 | Supplier response performance scoring | planned |
| REQ-MARKET-019 | No competitor data leakage between suppliers | planned |
| REQ-MARKET-020 | Broker commission model | existing |
| REQ-MARKET-021 | No fake availability / no Buy Now until supplier confirmation | existing |
| REQ-MARKET-022 | Marketplace full audit trail | existing |
| REQ-MARKET-023 | Subscription + transaction hybrid | existing |
| REQ-MARKET-024 | Loyalty and retention | planned |
| REQ-MARKET-025 | Smart reorder reminders without automatic medical reordering | planned |
| REQ-MARKET-026 | Referral tracking | planned |
| REQ-MARKET-027 | Consent and privacy minimization | planned |

## PACK SUPPLY

| ID | Requirement | Status |
|---|---|---|
| REQ-SUPPLY-001 | Company as parent entity | existing |
| REQ-SUPPLY-002 | Company legal profile | existing |
| REQ-SUPPLY-003 | Multi-activity company categories | partial |
| REQ-SUPPLY-004 | Contract -> branch -> warehouse -> product/offer hierarchy | existing |
| REQ-SUPPLY-005 | Supplier 360 drill-down | partial |
| REQ-SUPPLY-006 | Master Product Catalog separated from Supplier Offers | planned |
| REQ-SUPPLY-007 | Scientific master data controlled by veterinary/scientific role | planned |
| REQ-SUPPLY-008 | Supplier offer price history | existing |
| REQ-SUPPLY-009 | SAR/YER Old/YER New price support | existing |
| REQ-SUPPLY-010 | Hatchery module | existing |
| REQ-SUPPLY-011 | Chick Health Passport | existing |
| REQ-SUPPLY-012 | Cold chain breach recording | existing |
| REQ-SUPPLY-013 | Batch/Lot and expiry tracking | existing |
| REQ-SUPPLY-014 | QR/barcode receiving scan | planned |
| REQ-SUPPLY-015 | Supplier/hatchery quality scoring | existing |

## PACK FIN

| ID | Requirement | Status |
|---|---|---|
| REQ-FIN-001 | Independent Financial Command Center | existing |
| REQ-FIN-002 | Chart of Accounts | existing |
| REQ-FIN-003 | Double-entry accounting | existing |
| REQ-FIN-004 | Treasury cash/bank/exchange accounts | existing |
| REQ-FIN-005 | Receivables | existing |
| REQ-FIN-006 | Payables | existing |
| REQ-FIN-007 | Credit limits and due dates | existing |
| REQ-FIN-008 | Multi-currency original transaction preservation | existing |
| REQ-FIN-009 | FX rates with historical effective date | existing |
| REQ-FIN-010 | Realized/unrealized FX gain/loss foundation | planned |
| REQ-FIN-011 | Farm/flock cost centers | existing |
| REQ-FIN-012 | Cost per bird | existing |
| REQ-FIN-013 | Cost per kg live weight | existing |
| REQ-FIN-014 | Payroll for platform staff | existing |
| REQ-FIN-015 | Worker/vet salary allocated to farm cost center | existing |
| REQ-FIN-016 | Advances/bonuses/deductions/gratuities | existing |
| REQ-FIN-017 | Daily expenses | existing |
| REQ-FIN-018 | Commission engine | existing |
| REQ-FIN-019 | Cash closing | planned |
| REQ-FIN-020 | Bank/exchange reconciliation | planned |
| REQ-FIN-021 | Period closing and controlled reopening | planned |
| REQ-FIN-022 | No hard delete for posted financial documents | existing |
| REQ-FIN-023 | Event-driven auto-journaling from field events | planned |
| REQ-FIN-024 | Biological asset valuation / IAS 41 optional policy module | planned |
| REQ-FIN-025 | Veterinary-financial forecasting and break-even | existing |
| REQ-FIN-026 | Multi-currency reconciliation center | planned |

## PACK PROC

| ID | Requirement | Status |
|---|---|---|
| REQ-PROC-001 | Doctor requirement -> finance review -> supplier verification | existing |
| REQ-PROC-002 | Owner approval for cost-bearing requests | existing |
| REQ-PROC-003 | Purchase Order | existing |
| REQ-PROC-004 | Supplier confirmation | existing |
| REQ-PROC-005 | Goods Receipt / GRN | existing |
| REQ-PROC-006 | Three-Way Match: PO + GRN + Supplier Invoice | partial |
| REQ-PROC-007 | Delivery ETA tracking | existing |
| REQ-PROC-008 | Delay reason tracking | planned |
| REQ-PROC-009 | Worker receipt evidence/photos | existing |
| REQ-PROC-010 | Procurement requirement report | planned |
| REQ-PROC-011 | Marketing readiness | existing |
| REQ-PROC-012 | Owner sale approval | existing |
| REQ-PROC-013 | Vehicle and driver data | existing |
| REQ-PROC-014 | Vehicle disinfection before loading | existing |
| REQ-PROC-015 | Loading quantity/weight/time | existing |
| REQ-PROC-016 | POD at destination | existing |
| REQ-PROC-017 | Transport mortality | existing |
| REQ-PROC-018 | Partial/cumulative sales ledger | partial |
| REQ-PROC-019 | Final settlement | existing |
| REQ-PROC-020 | Customer collections and due dates | partial |
| REQ-PROC-021 | Sales & Marketing Report | planned |

## PACK CHAT

| ID | Requirement | Status |
|---|---|---|
| REQ-CHAT-001 | Farm Operations Chat per managed farm | existing |
| REQ-CHAT-002 | Veterinary Advisory Chat | existing |
| REQ-CHAT-003 | Finance & Procurement Chat | existing |
| REQ-CHAT-004 | Executive Control Tower Chat | existing |
| REQ-CHAT-005 | Role-based group membership | existing |
| REQ-CHAT-006 | Moderator rights | existing |
| REQ-CHAT-007 | Auto-create groups on onboarding | existing |
| REQ-CHAT-008 | Text messages | existing |
| REQ-CHAT-009 | Voice-to-Data | existing |
| REQ-CHAT-010 | Image/video/file messages | existing |
| REQ-CHAT-011 | Sent/delivered/read states | existing |
| REQ-CHAT-012 | Action cards | existing |
| REQ-CHAT-013 | Pinned/reply/message filtering | planned |
| REQ-CHAT-014 | Farm/flock/case context header | planned |
| REQ-CHAT-015 | Voice extraction confirmation before database write | existing |
| REQ-CHAT-016 | WhatsApp bidirectional relay adapter | planned_external |
| REQ-CHAT-017 | Realtime WebSocket/Firebase/Supabase transport | planned_external |
| REQ-CHAT-018 | Immutable operational chat archive foundation | partial |
| REQ-CHAT-019 | GPS/time evidence for live field capture | planned |

## PACK GOV

| ID | Requirement | Status |
|---|---|---|
| REQ-GOV-001 | Role + Department + Scope authorization | existing |
| REQ-GOV-002 | Segregation of duties | existing |
| REQ-GOV-003 | Unified approval inbox | existing |
| REQ-GOV-004 | Who/What/Why/Farm/Flock/Time/Approval/Cost/Evidence/Audit envelope | partial |
| REQ-GOV-005 | Device fingerprinting/binding | planned |
| REQ-GOV-006 | GPS farm-presence verification with consent | planned |
| REQ-GOV-007 | Field time evidence | planned |
| REQ-GOV-008 | Append-only audit trail | existing |
| REQ-GOV-009 | Hash-chain/signature tamper-evidence foundation | planned |
| REQ-GOV-010 | Fraud/anomaly detection | existing |
| REQ-GOV-011 | Data Quality Center | existing |
| REQ-GOV-012 | Backup/restore foundation | existing |
| REQ-GOV-013 | Document Center | existing |
| REQ-GOV-014 | License/contract expiry monitoring | existing |
| REQ-GOV-015 | Digital signatures | existing |
| REQ-GOV-016 | Service SLA tracking | planned |
| REQ-GOV-017 | Identity & Access Governance by account type | planned |

## PACK REPORTS

| ID | Requirement | Status |
|---|---|---|
| REQ-REPORTS-001 | Independent Reports Center | implemented |
| REQ-REPORTS-002 | Daily report | implemented |
| REQ-REPORTS-003 | Weekly report | implemented |
| REQ-REPORTS-004 | Cycle report | implemented |
| REQ-REPORTS-005 | Financial farm report | partial |
| REQ-REPORTS-006 | Clinical report | planned |
| REQ-REPORTS-007 | Biosecurity report | planned |
| REQ-REPORTS-008 | Procurement report | planned |
| REQ-REPORTS-009 | Sales report | planned |
| REQ-REPORTS-010 | Audit report | partial |
| REQ-REPORTS-011 | Filters by date/governorate/customer/farm/house/flock/vet/worker/company/currency | planned |
| REQ-REPORTS-012 | PDF export | planned |
| REQ-REPORTS-013 | Excel export | planned |
| REQ-REPORTS-014 | Executive daily brief | existing |
| REQ-REPORTS-015 | Dashboard KPIs across organizational levels | implemented |
| REQ-REPORTS-016 | Loss Prevention Dashboard | existing |
| REQ-REPORTS-017 | Economic loss scenarios | planned |
| REQ-REPORTS-018 | Compliance Engine | existing |
| REQ-REPORTS-019 | Worker performance scoring | existing |
| REQ-REPORTS-020 | Vet performance scoring with non-outcome-only metrics | existing |
| REQ-REPORTS-021 | Service quality scoring | planned |

## PACK UX

| ID | Requirement | Status |
|---|---|---|
| REQ-UX-001 | Role-specific workspaces | partial |
| REQ-UX-002 | Desktop/Web for finance/admin/marketing/logistics | documented |
| REQ-UX-003 | Android for vets/farmers/workers | documented |
| REQ-UX-004 | Professional sidebar/subnavigation | planned |
| REQ-UX-005 | Light theme contrast hardening | planned |
| REQ-UX-006 | Arabic-first terminology | planned |
| REQ-UX-007 | Legacy version modules hidden under compatibility area | planned |
| REQ-UX-008 | Centralized breadcrumbs | existing |
| REQ-UX-009 | Enterprise data tables | planned |
| REQ-UX-010 | Reduced white space and responsive density | planned |
| REQ-UX-011 | Demo seed data isolated from production | planned |
| REQ-UX-012 | Central brand architecture Hisana-ready | planned |
| REQ-UX-013 | Trust Center | existing |
| REQ-UX-014 | Farmer education in workflow | existing |
| REQ-UX-015 | Task & Responsibility Center | planned |
| REQ-UX-016 | Managed Farm onboarding wizard | planned |
| REQ-UX-017 | Contract governance wizard | planned |
