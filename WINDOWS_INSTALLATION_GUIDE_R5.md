# Windows Installation Guide — Farm Windows Control Center R5

## Scope
Windows/Web is the reference control-center platform. Android is not part of this stage.

## Prerequisites
1. Windows 10/11 or Windows Server supported by the installed Node.js runtime.
2. Node.js 20 or newer available in `PATH`.
3. npm access to the dependency registry (or an approved internal npm mirror/cache).
4. Write permission to the project folder and `runtime-data` directory.

## Install
From the project root, run:

```bat
windows\INSTALL_WINDOWS_PLATFORM.bat
```

The installer performs dependency installation, R5 verification, the Vite client build, the bundled Node server build, runtime-directory creation and final artifact validation. It does not silently mark an incomplete build as successful.

## Start
```bat
windows\START_WINDOWS_PLATFORM.bat
```

The default port is 3000 unless changed in `.env`. The start script launches the production server, writes its PID, performs a health check and opens the local platform URL.

## Verify
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File windows\VERIFY_WINDOWS_PLATFORM.ps1
```

## Stop
```bat
windows\STOP_WINDOWS_PLATFORM.bat
```

## Back up persistent data
```bat
windows\BACKUP_WINDOWS_DATA.bat
```

## Configuration
Copy `.env.windows.example` to `.env` if the installer has not already done so, then set production values. Do not publish secrets in source control.

## Acceptance gate
After installation succeeds, verify from the Windows control center:
- Farm navigation opens.
- All 12 sections are visible according to the logged-in role.
- The screen directory reports 177 destinations.
- Search opens the requested screen.
- Farm/house/cycle context selection works.
- Create/update actions persist after refresh/restart where applicable.
- History/export/print operate.
- S7 and S12 integration actions do not create duplicate ledgers.
- Restricted roles cannot open unauthorized Farm sections.
- Factory R3 remains unchanged and functional.

Only after this target-machine acceptance gate passes should Farm be marked production-frozen and development move to the next department.
