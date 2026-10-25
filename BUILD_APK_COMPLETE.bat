@echo off
setlocal
cd /d "%~dp0"
echo Smart Poultry Platform - Complete APK Builder
echo.
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0BUILD_APK_COMPLETE.ps1"
set ERR=%ERRORLEVEL%
echo.
if not "%ERR%"=="0" (
  echo Build stopped with error code %ERR%.
) else (
  echo Build completed successfully.
)
pause
exit /b %ERR%
