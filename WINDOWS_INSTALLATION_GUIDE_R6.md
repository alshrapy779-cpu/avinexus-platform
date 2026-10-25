# Windows Installation and Acceptance — Farm Control Center R6

## Prerequisites
- Windows 10/11 or Windows Server supported by Node.js 20+
- Node.js 20+ and npm in PATH
- access to the project directory
- production environment credentials configured in `.env`

## Install
From the extracted project folder, run:

```bat
windows\INSTALL_WINDOWS_PLATFORM.bat
```

The installer creates/uses `.env`, prepares runtime directories, installs dependencies, executes the R6 verification chain, builds the Vite frontend and bundled Node server, and fails if `dist\server.cjs` is not produced.

## Start / stop / backup
```bat
windows\START_WINDOWS_PLATFORM.bat
windows\STOP_WINDOWS_PLATFORM.bat
windows\BACKUP_WINDOWS_DATA.bat
```

## Mandatory verification before Farm freeze
Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File windows\VERIFY_WINDOWS_PLATFORM.ps1
```

Then test with real role accounts:
1. Worker enters and closes a daily report.
2. Supervisor receives and accepts the handoff; worker cannot release AI himself.
3. Supervisor/manager releases the reviewed report to AI.
4. Veterinarian reviews flags and authorizes/modifies/rejects the next-day plan.
5. Verify anti-inflammatory, antipyretic, anticoccidial, antibiotic, vaccine and lab-investigation choices require veterinarian authorization.
6. Worker receives the approved plan/tasks; lab receives lab handoff where applicable.
7. Farm manager and owner see their permitted monitoring/approval context.
8. Accountant creates Farm operational documents and sends pending events to Section 12.
9. Verify Farm cannot fabricate an S12 posting reference; link only a real accounting reference.
10. Verify reports, print, JSON/CSV export and document print.
11. Restart the server and confirm Farm records, handoffs and documents persist.
12. Verify worker cannot see Finance R6 tab, accountant cannot receive clinical authorization controls, and supplier/support views are role-scoped.
13. Confirm preserved R5 177-screen workspace remains available and prior Factory functionality is unchanged.

Farm should not be declared production-frozen until this visible target-machine checklist passes.
