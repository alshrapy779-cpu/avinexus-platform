@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title AviNexus - Development Verification
where node >nul 2>&1
if errorlevel 1 (echo [FAIL] Node.js missing & pause & exit /b 1)
where npm.cmd >nul 2>&1
if errorlevel 1 (echo [FAIL] npm missing & pause & exit /b 1)
if not exist "package.json" (echo [FAIL] package.json missing & pause & exit /b 1)
echo [1/5] Install dependencies
call npm.cmd install
if errorlevel 1 goto failed
echo [2/5] TypeScript check
call npm.cmd run lint
if errorlevel 1 goto failed
echo [3/5] Build web and server
call npm.cmd run build
if errorlevel 1 goto failed
echo [4/5] R7 and R8.1 regression
call npm.cmd run test:customer-office-partner-r7
if errorlevel 1 goto failed
call npm.cmd run test:r8.1
if errorlevel 1 goto failed
echo [5/5] Phase 2 source checks
node scripts\phase2-price\verify.cjs
if errorlevel 1 goto failed
node scripts\phase2-price-concurrency\verify.cjs
if errorlevel 1 goto failed
node scripts\phase2-hardening\verify.cjs
if errorlevel 1 goto failed
echo [PASS] Automated build and source checks passed. Manual end-to-end Windows acceptance remains required.
pause
exit /b 0
:failed
echo [FAIL] Verification stopped. Review the error above; do not certify this build.
pause
exit /b 1
