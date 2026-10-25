# AviNexus Poultry Enterprise — Windows R8.1
## Operational Readiness, Scientific AI & Full Closure

### Release purpose
R8.1 is a closure and operational-readiness layer over the preserved R8/R7/Farm/Factory baseline. It does not add a new major department. Windows/Web remains the reference platform and Android remains deferred.

### Protected ownership
- Inventory source of truth: Section 7.
- Accounting / GL / AP / AR / Treasury source of truth: Section 12.
- Operational HR/payroll calculation: Section 11.
- Report execution/presentation: Section 14.
- Governance/policy: Section 15.

### Implemented R8.1 changes
- AviNexus operational branding is primary; release/developer metadata is removed from the normal top header.
- Compact role-aware navigation replaces scattered top-level technical destinations.
- Global search, My Work, role-scoped destinations, alerts, actions and acceptance workspaces.
- Arabic / English / bilingual application language settings with document direction updates.
- Configurable Geography Master: country → governorate → district → locality → site, with non-destructive archive/merge semantics.
- Yemen's 22 governorates are initial configurable seed data, not fixed screen logic.
- Governorate/region purposes cover farms, rented houses, factories, offices, companies, markets, branches, labs, feed mills, hatcheries, suppliers, veterinary services, warehouses, transport and marketing.
- Poultry site and house registration with coordinates, address, elevation, open/semi-open/closed/controlled house types, feed storage, water infrastructure, monitoring mode and operational context.
- Extensible equipment register for feeders, drinkers, tanks, pumps, filters, fans, cooling pads, heaters, brooders, curtains, sensors, thermometers, hygrometers, generators, solar, lighting, scales, disinfection, sprayers, footbaths, washers, storage, silos, medicine refrigeration, vaccination and emergency equipment.
- Weather provider abstraction with authentication, scope enforcement, coordinate-based lookup, cache, manual fallback, temperature, humidity, wind speed/direction and precipitation.
- Open-house intelligence considers house type, wind, curtains, fans, heaters, indoor/outdoor readings and flock context; it does not blindly advise sealing or fully opening a house.
- Scientific knowledge workflow: extracted → normalized → expert review → approved → active → retired.
- Deterministic equation engine foundation with active FCR and mortality calculations; AI calls approved calculations instead of inventing formulas.
- Contextual AviNexus Intelligence UI: Ask, Analyze, Calculate, Check, Risk and Next Actions.
- AI endpoint is authenticated and farm-scope checked. High-risk clinical diagnosis/prescription/treatment/vaccination/withdrawal/containment remains under authorized veterinary control.
- Disease Alert lifecycle: Detected → Acknowledged → Investigating → Containment → Clinical Decision → Monitoring → Closed → Post-event Review.
- Unsafe Action Guard, AI provenance and offline-field-queue requirements are protected settings.
- Critical Action Contracts for farm daily closure, treatment approval, vaccination confirmation, disease-alert acknowledgement, material receipt, production actual finalization and financial posting.
- Full acceptance registry now covers all preserved registered Factory screens, Farm screens, R6 critical role/workflow destinations and R8.1 operational screens. Acceptance is intentionally not pre-marked as passed; it must be proven visibly on the target Windows runtime.

### Screen acceptance inventory
- Factory registered screens: 189.
- Farm preserved screens: 177.
- Farm R6 critical role/workflow destinations: 24.
- R8.1 operational/closure screens: 9.
- Total entries in the R8.1 visible acceptance matrix: 399.

### Source verification
`npm run verify:r8.1` passes the cumulative source/regression suite:
- V20.2.9 semantic checks: 45/45.
- Factory 15-section checks: 58/58.
- Factory full-screen registry: 24/24.
- Factory Production R3: 95/95.
- Farm R4 runtime: 67/67.
- Farm R4 integration: 20/20.
- Farm Windows R5: 30/30.
- Farm Windows R6: 41/41.
- Customer/Office/Partner R7: 31/31.
- Factory Windows R8: 45/45.
- R8.1 semantic/closure checks: 78/78.
- Aggregate checks passed: 534; failed: 0.

### Preservation verification
R8.1 preservation compares against the complete R8 source baseline:
- Baseline files: 515.
- Missing baseline files: 0.
- Unexpected baseline changes: 0.
- Documented integration points changed: 13 (including the marketplace TypeScript hotfix).
- New R8.1 files are additive.

### Target Windows certification status
The source package is ready for target-Windows installation and visible acceptance. The current build environment does not contain `node_modules`; dependency installation previously timed out, so the following are deliberately **not** falsely marked complete here:
- target-Windows dependency installation;
- Vite/esbuild production build;
- real startup/health verification;
- role-by-role visible acceptance;
- screen/button-by-screen acceptance;
- live weather-provider acceptance;
- restart persistence acceptance;
- documents/PDF/printing acceptance;
- multi-day operational acceptance.

Run `windows\\INSTALL_WINDOWS_PLATFORM.ps1`, then `windows\\START_WINDOWS_PLATFORM.ps1` on the target Windows machine. Use the built-in 399-screen acceptance matrix for the visible test pass.

### Freeze rule
Do not call R8.1 production-frozen and do not start a new major department until the target Windows gates above pass. During the sustained test period, changes are limited to defects, missing fields/actions, permission corrections, AI interpretation corrections, workflow/UX improvements, persistence, reports and printing.


### Programming hotfix 1 — interface startup blockers
Two source files were corrected after a real TypeScript/runtime review:
- `src/components/Header.tsx`: the bilingual label helper incorrectly referenced `uiLanguage` outside component scope. It now uses its explicit `language` argument and a non-nullable normalized UI language.
- `src/components/marketplace/v197/BrokerMarketplaceV197.tsx`: marketplace request/attestation child components now use explicit React prop interfaces and the canonical `AvailabilityAttestationV197` / `AvailabilityStateV197` domain types instead of loose interface assumptions.
- R8.1 regression checks were extended to cover both defects.
- R8 baseline preservation remains PASS with 515 baseline files, 0 missing and 0 unexpected changes.
- The full cumulative source suite passes 534 checks with 0 failures.
