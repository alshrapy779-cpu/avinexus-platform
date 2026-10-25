AviNexus Poultry Enterprise — Windows R8.1
Operational Readiness, Scientific AI & Full Closure

1) Extract the full archive on the target Windows computer.
2) Open PowerShell in the extracted project folder.
3) Run: windows\INSTALL_WINDOWS_PLATFORM.ps1
4) After a successful install/build, run: windows\START_WINDOWS_PLATFORM.ps1
5) Sign in and use the built-in Acceptance Matrix for visible role/screen/button testing.

Source/regression status in the packaging environment:
- 532 cumulative automated/source checks passed, 0 failed.
- R8 baseline preservation: 515 files checked, 0 missing, 0 unexpected changes.
- 399 visible acceptance entries registered (189 Factory + 177 Farm + 24 Farm R6 + 9 R8.1).

Important: target-Windows production build/startup, live role acceptance, restart persistence,
printing and multi-day operational acceptance are still gates that must be executed on the target
Windows runtime. They are intentionally not pre-marked as passed.
