@echo off
cd /d "%~dp0"
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0VERIFY_V8_COMPLETE.ps1"
pause
