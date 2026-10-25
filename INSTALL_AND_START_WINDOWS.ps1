$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root
Write-Host 'AviNexus Poultry Enterprise — Windows installation and launch' -ForegroundColor Cyan
Write-Host 'This is the WINDOWS launcher. Android APK tools are not needed.'
try {
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'Node.js is missing. Install Node.js 22 or 24 LTS from https://nodejs.org/en/download, reopen Windows, then retry.'
  }
  if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw 'npm is not available in PATH. Repair/install Node.js 22 or 24 LTS, then reopen the command window.'
  }
  $nodeVersion = (& node -p 'process.versions.node').Trim()
  $nodeMajor = [int]($nodeVersion.Split('.')[0])
  if ($nodeMajor -lt 20) {
    throw "Node.js 20+ is required for Windows (22 or 24 LTS recommended). Found $nodeVersion."
  }
  Write-Host "Node.js $nodeVersion detected." -ForegroundColor Green
  if (-not (Test-Path 'dist\server.cjs') -or -not (Test-Path 'dist\index.html')) {
    Write-Host 'Production files are missing: installing/verifying/building first...' -ForegroundColor Yellow
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root 'windows\INSTALL_WINDOWS_PLATFORM.ps1')
    if ($LASTEXITCODE -ne 0) { throw "Windows installation/build failed (exit code $LASTEXITCODE)." }
  } else {
    Write-Host 'Existing production bundle found; skipping rebuild.' -ForegroundColor Green
    Write-Host 'For a full rebuild, run windows\INSTALL_WINDOWS_PLATFORM.bat.'
  }
  Write-Host 'Starting server and opening the browser...' -ForegroundColor Cyan
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root 'windows\START_WINDOWS_PLATFORM.ps1')
  if ($LASTEXITCODE -ne 0) { throw "Windows server failed to start (exit code $LASTEXITCODE). Check logs\windows-platform.err.log." }
  Write-Host 'Windows startup command completed. Confirm the browser login page appears.' -ForegroundColor Green
  exit 0
} catch {
  Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
