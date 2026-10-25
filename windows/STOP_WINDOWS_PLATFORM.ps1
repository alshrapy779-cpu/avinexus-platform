$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
$pidFile = 'runtime-data\windows-platform.pid'
if (-not (Test-Path $pidFile)) { Write-Host 'No PID file found.' -ForegroundColor Yellow; exit 0 }
$pidValue = Get-Content $pidFile -ErrorAction SilentlyContinue
if ($pidValue -and (Get-Process -Id $pidValue -ErrorAction SilentlyContinue)) {
  Stop-Process -Id $pidValue -Force
  Write-Host "Stopped PID $pidValue" -ForegroundColor Green
} else { Write-Host 'Process is not running.' -ForegroundColor Yellow }
Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
