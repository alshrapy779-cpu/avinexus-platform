$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
if (-not (Test-Path 'dist\server.cjs')) { throw 'Production build not found. Run windows\INSTALL_WINDOWS_PLATFORM.ps1 first.' }
New-Item -ItemType Directory -Force -Path 'logs' | Out-Null
$pidFile = 'runtime-data\windows-platform.pid'
if (Test-Path $pidFile) {
  $oldPid = Get-Content $pidFile -ErrorAction SilentlyContinue
  if ($oldPid -and (Get-Process -Id $oldPid -ErrorAction SilentlyContinue)) {
    Write-Host "Platform already running. PID: $oldPid" -ForegroundColor Yellow
    $existingPort = if ($env:PORT) { $env:PORT } else { "3000" }
    Start-Process "http://localhost:$existingPort"
    exit 0
  }
}
$env:SPP_ENVIRONMENT = if ($env:SPP_ENVIRONMENT) { $env:SPP_ENVIRONMENT } else { 'PRODUCTION' }
$port = if ($env:PORT) { $env:PORT } else { '3000' }
$stdout = Join-Path $Root 'logs\windows-platform.out.log'
$stderr = Join-Path $Root 'logs\windows-platform.err.log'
$p = Start-Process -FilePath 'node' -ArgumentList 'dist/server.cjs' -WorkingDirectory $Root -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
$p.Id | Set-Content $pidFile
Start-Sleep -Seconds 2
try {
  $health = Invoke-RestMethod -Uri "http://localhost:$port/api/health" -TimeoutSec 8
  Write-Host "Platform started. PID $($p.Id)." -ForegroundColor Green
  Start-Process "http://localhost:$port"
} catch {
  Write-Host 'Server process started but health check failed. Review logs\windows-platform.err.log.' -ForegroundColor Red
  throw
}
