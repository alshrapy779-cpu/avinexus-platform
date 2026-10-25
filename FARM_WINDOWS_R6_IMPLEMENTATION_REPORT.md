# Smart Poultry Platform V20.2.9 — Farm Windows Control Center R6

## Purpose
R6 closes the role/orchestration gaps found during manual testing of R5. It is cumulative over Factory Production R3, Farm Operations R4, and Farm Windows Control Center R5. No prior department, screen registry, workflow contract, or historical financial data is intentionally removed.

## Preservation result
- R5 baseline files checked: **473**
- Missing baseline files: **0**
- Unexpected baseline modifications: **0**
- Approved additive integration points changed: **7**
- R5 177-screen workspace remains available from R6.

## Role completion
R6 defines responsibility contracts and role-scoped Windows workspaces for 15 operational roles:
1. Executive / system owner
2. Regional manager
3. Farm owner
4. Farm manager
5. Supervisor
6. Worker / farmer
7. Veterinarian
8. Veterinary consultant
9. Veterinary assistant
10. Lab technician / reviewer
11. Farm accountant
12. Inventory / supply support
13. Supplier
14. Commercial / marketing
15. Support

Every contract defines mission, responsibilities, inputs, outputs, required evidence, approval authority, prohibited actions, default destination, inbox items, and handoff targets.

## Connected operating chain
R6 implements the following connected sequence:

**Worker daily close → Supervisor review/handoff → automatic performance calculations → AI risk/operational analysis → Veterinarian decision → approved next-day plan → worker/lab tasks → manager/owner monitoring → accountant/Section 12 integration → reports/printing.**

### Daily worker entry
The R6 daily close captures bird opening count, mortality, culls, feed opening/received/used/closing, water, temperature, humidity, sample weights, expected weight, litter condition, equipment issues, respiratory observations, abnormal droppings, and notes. The preserved Managed Operations engine calculates closing population and performance metrics including average weight, daily gain when a previous sample exists, CV, uniformity, target variance and estimated FCR.

The same close also writes to the canonical Farm R4 domain for mortality/culls, feed consumption, water consumption and environmental readings. Feed inventory integration continues through Section 7 rather than a duplicate Farm inventory ledger.

A worker submission creates a persistent worker→supervisor handoff. Workers cannot directly release the report to AI; AI release is limited to supervisor, farm manager or executive roles.

### AI and veterinary governance
The preserved AI engine generates operational risk flags and proposed next-day targets. AI is not permitted to autonomously prescribe medicine.

The veterinarian is the final medical authorization gate. R6 supports explicit treatment categories:
- no treatment
- supportive care
- anti-inflammatory
- antipyretic / fever reducer
- anticoccidial
- antibiotic
- vaccine
- laboratory investigation

The veterinarian records treatment/vaccine identity, active ingredient, dose/route, duration, withdrawal period, feed target, environmental target, water target and clinical rationale. Approved plans create worker tasks; lab investigation also creates a doctor→lab handoff. Consultants provide an advisory opinion and hand it back to the doctor rather than replacing the doctor's final authorization.

### Finance and documents
R6 adds Farm operational financial documents including supplier invoice, goods receipt, expense voucher, payment request, receipt advice, owner funding record, supplier/owner statements and cycle cost sheets. These remain operational documents: Section 12 is still the sole accounting ledger/payment/posting owner.

The Farm UI no longer fabricates a Section 12 reference. A document can only be linked as posted after the user enters a real confirmed Section 12 reference.

### Reports, guide and catalog
R6 provides a report studio with live operational data, print, JSON export and CSV export. The knowledge center exposes versioned breed references (Ross 308, Cobb 500, Hubbard, Arbor Acres and Sasso identifiers), clinical governance references and the enterprise product catalog. Exact commercial-strain daily performance standards remain versioned reference/protocol data and should be populated from authorized official source material rather than invented values.

## Windows user experience
- Windows-first control center; Android remains deferred.
- Segoe UI Variable / Segoe UI / Tahoma / Noto Sans Arabic font stack.
- Role-scoped navigation: users only see R6 workspaces relevant to their responsibility.
- Farm / cycle / house context is retained across workflows.
- Role inbox, handoffs, KPIs, forms, tables, actions, printing and exports are integrated.
- R5's 177 screen destinations remain accessible according to their preserved role controls.
- R6 adds 24 critical responsibility destinations, for 201 governed destinations across R5+R6 layers.

## Automated verification
Final source/runtime verification:
- V20.2.9 semantic: **45/45**
- Factory 15-section: **58/58**
- Factory full-screen registry: **24/24**
- Factory Production R3: **95/95**
- Farm R4 runtime: **67/67**
- Farm R4 integration: **20/20**
- Farm Windows R5: **30/30**
- Farm Windows R6 role/workflow: **41/41**

**Total: 380/380 checks passed.**

R6 pure-domain TypeScript compilation also passes without requiring React dependencies. A full project TypeScript pass cannot complete in the current execution environment because `node_modules` is absent; diagnostics are dependency-resolution errors, not R6-owned source syntax/type errors.

## Production certification status
R6 is implementation-closed at the source/workflow gate, but **not production-frozen yet**. The current environment could not complete `npm install` before timeout, so the final Vite/esbuild production bundle has not been certified here.

The target Windows machine must still pass:
1. dependency installation,
2. `npm run verify:farm-windows-r6`,
3. `npm run build`,
4. Windows start/health verification,
5. visible end-to-end role acceptance for the critical workflow,
6. persistence test across server restart,
7. print/export and permission acceptance.

Only after those pass should Farm be marked production-frozen and development move to the next department.
