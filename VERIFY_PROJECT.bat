@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set FAIL=0
for %%F in (package.json capacitor.config.ts src\App.tsx server.ts android\settings.gradle android\app\build.gradle android\app\src\main\AndroidManifest.xml android\app\src\main\java\com\smartpoultry\yemen\MainActivity.java android\gradle\wrapper\gradle-wrapper.jar) do (
  if not exist "%%F" (
    echo MISSING: %%F
    set FAIL=1
  ) else (
    echo OK: %%F
  )
)
if "%FAIL%"=="0" (
  echo.
  echo PROJECT STRUCTURE: COMPLETE
) else (
  echo.
  echo PROJECT STRUCTURE: INCOMPLETE
)
pause
