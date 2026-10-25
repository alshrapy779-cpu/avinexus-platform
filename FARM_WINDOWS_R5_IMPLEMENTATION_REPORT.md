# Smart Poultry Platform V20.2.9 — Farm Windows Control Center R5

## Release purpose
R5 completes the Windows/Web presentation and operational-control layer for the Farm Operations domain on top of the frozen Farm Operations R4 domain and the protected Factory Production R3 baseline. It is cumulative: no previous release is overwritten and no historical business record is intentionally deleted.

## Preservation contract
- Factory Production R3 remains the protected Factory baseline.
- Farm Operations R4 remains the protected Farm domain baseline.
- R5 changes only explicit Farm/Windows integration points and adds new R5 files.
- Inventory ownership remains Section 7; Farm does not create a duplicate inventory ledger.
- Accounting ownership remains Section 12; Farm does not create a duplicate GL/AP/AR/Treasury ledger.
- Shared report execution remains Section 14.
- Shared governance remains Section 15.
- Android is preserved but is not part of the current completion gate.

## Windows/Web implementation added in R5
- Professional Farm control-center shell with a Windows-oriented desktop layout.
- Scoped professional typography: Segoe UI Variable Text / Segoe UI, with Tahoma, Noto Sans Arabic and Arial fallbacks. No external font file is required.
- 12 Farm operational sections and 177 registered, unique Farm screen destinations.
- Searchable 177-screen directory.
- Per-screen code, name, purpose, route, screen kind and capability contract.
- Farm / house / flock-cycle context selectors.
- Section sidebar and per-section screen navigation.
- Screen paging and deep-link selection through `farmScreen`.
- Per-screen data canvas, KPI strip, screen data table, integrity indicators and history/audit view.
- Refresh, history, JSON export and print actions.
- Role-scoped Farm screen access for executive/owner, finance, veterinary, supervisor, worker, laboratory and farmer roles.
- Operational action panels wired to existing Farm domain functions for all 12 Farm sections.
- Real Farm operations include ownership/assignment actions, bird population mortality/culling events, feed/water/environment records, quality tests, biosecurity, clinical cases, consultation escalation, withdrawal restrictions, medication/vaccination administration, laboratory facilities/samples/results, S7 inventory acknowledgements, S12 accounting acknowledgements, expense claims, market prices, benchmarks, offline queue/sync/conflicts, encrypted media records, alerts/tasks and reference-data version activation.
- Farm state remains integrated with the enterprise persistence path.

## Windows installation/control-center path added
The release includes a dedicated `windows/` operations folder:
- `INSTALL_WINDOWS_PLATFORM.ps1/.bat`
- `START_WINDOWS_PLATFORM.ps1/.bat`
- `STOP_WINDOWS_PLATFORM.ps1/.bat`
- `BACKUP_WINDOWS_DATA.ps1/.bat`
- `VERIFY_WINDOWS_PLATFORM.ps1`
- `.env.windows.example`

The installer validates Node.js, installs dependencies, executes the Farm R5 verification gate, runs the production build, creates runtime-data directories and refuses to report installation success if the required production artifacts are missing.

## Verification results
Final retained regression run:
- V20.2.9 semantic checks: 45/45 PASS.
- Factory 15-section semantic checks: 58/58 PASS.
- Factory full-screen registry checks: 24/24 PASS.
- Factory Production R3 semantic checks: 95/95 PASS.
- Factory R3 preservation baseline: 436 files; 0 missing; 0 unexpected changes.
- Farm Operations R4 runtime checks: 67/67 PASS.
- Farm Operations R4 integration checks: 20/20 PASS.
- Farm Windows R5 screen/install checks: 30/30 PASS.
- Farm R4 preservation baseline under R5: 451 files; 0 missing; 0 unexpected changes.

The retained V20.2.9 + Factory + Farm R4 regression set is 309 passing checks. R5 adds 30 Windows UI/installation checks, for 339 passing automated checks when counted once by suite.

## Production-build certification status
The source/UI/domain/preservation implementation is complete in this release, but a Vite/esbuild production bundle could not be generated inside the current execution environment because project dependencies are not installed and registry access is unavailable/intermittent. Therefore this report does **not** claim that a final production bundle has been executed on a real Windows machine.

The included Windows installer makes production build success a mandatory local installation gate. The department should be considered ready for Windows installation/acceptance testing, but the final deployment gate is closed only after `windows/INSTALL_WINDOWS_PLATFORM.bat` succeeds on the target Windows control-center machine and the visible screen/button smoke test is completed there.

## Completion policy going forward
No department is considered closed merely because screen names exist in a registry. A closed department must preserve prior baselines and provide real Windows/Web destinations, visible UI, controls, persistence, permissions, audit/history, integrations, regression checks and a successful target-environment installation/build verification.
