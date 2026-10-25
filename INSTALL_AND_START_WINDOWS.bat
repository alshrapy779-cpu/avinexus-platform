@echo off
setlocal
cd /d "%~dp0"
title AviNexus Poultry Enterprise - Windows Launcher
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0INSTALL_AND_START_WINDOWS.ps1"
set "CODE=%ERRORLEVEL%"
echo.
if not "%CODE%"=="0" (
  echo WINDOWS START FAILED. Error code: %CODE%
  echo See the error details above. Do not use BUILD_APK_COMPLETE.bat on Windows.
) else (
  echo Launcher finished. The platform is expected at http://localhost:3000
)
echo.
pause
exit /b %CODE%
