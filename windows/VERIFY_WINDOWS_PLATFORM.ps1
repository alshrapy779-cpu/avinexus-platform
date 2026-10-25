$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
npm run verify:r8.1
if (Test-Path 'dist\server.cjs') { Write-Host 'Production bundle present.' -ForegroundColor Green } else { Write-Host 'Production bundle absent; run INSTALL_WINDOWS_PLATFORM.ps1.' -ForegroundColor Yellow }
