@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title AviNexus Poultry Enterprise - Windows Development
set "PORT=3000"
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is missing. Install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm was not found in PATH.
  pause
  exit /b 1
)
if not exist "package.json" (
  echo [ERROR] package.json was not found in the project root.
  pause
  exit /b 1
)
echo [1/3] Installing dependencies...
call npm.cmd install
if errorlevel 1 (
  echo [ERROR] npm install failed. Check your network and npm logs.
  pause
  exit /b 1
)
echo [2/3] Preparing browser auto-open...
where powershell.exe >nul 2>&1
if not errorlevel 1 (
  start "" /min powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\windows\open-browser.ps1" -Port %PORT%
) else (
  echo [INFO] PowerShell not found. Open http://localhost:%PORT% manually.
)
echo [3/3] Starting AviNexus on http://localhost:%PORT% ...
call npm.cmd run dev
set "EXITCODE=%ERRORLEVEL%"
echo.
echo [INFO] Server stopped with exit code %EXITCODE%.
pause
exit /b %EXITCODE%
