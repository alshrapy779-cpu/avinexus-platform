$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
Write-Host 'AviNexus Poultry Enterprise - Windows/Web R8.1 Operational Readiness & Scientific AI Installation' -ForegroundColor Cyan

function Require-Command($Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name is required. Install Node.js 20+ and reopen PowerShell."
  }
}
Require-Command node
Require-Command npm
$nodeVersion = (& node -p "process.versions.node").Trim()
$nodeMajor = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt 20) { throw "Node.js 20+ is required. Current: $nodeVersion" }

if (-not (Test-Path '.env')) {
  Copy-Item '.env.windows.example' '.env'
  Write-Host 'Created .env from .env.windows.example. Review production credentials before first production login.' -ForegroundColor Yellow
}
New-Item -ItemType Directory -Force -Path 'runtime-data','runtime-data\backups','logs' | Out-Null

# Native commands do not throw under $ErrorActionPreference='Stop' in Windows PowerShell 5.1.
# Check their exit codes explicitly, otherwise a failed install or verification can be
# silently followed by a misleading 'installation completed' message.
if (Test-Path 'package-lock.json') {
  & npm.cmd ci
} else {
  & npm.cmd install
}
if ($LASTEXITCODE -ne 0) { throw "Dependency installation failed (npm exit code $LASTEXITCODE)." }

& npm.cmd run verify:r8.1
if ($LASTEXITCODE -ne 0) { throw "Source/regression verification failed (exit code $LASTEXITCODE)." }

& npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw "Vite/server production build failed (exit code $LASTEXITCODE)." }
if (-not (Test-Path 'dist\server.cjs')) { throw 'Build did not create dist\server.cjs' }
if (-not (Test-Path 'dist\index.html')) { throw 'Build did not create dist\index.html' }
Write-Host 'Windows/Web installation completed successfully.' -ForegroundColor Green
Write-Host 'Run windows\START_WINDOWS_PLATFORM.ps1 to start the control center.' -ForegroundColor Green
