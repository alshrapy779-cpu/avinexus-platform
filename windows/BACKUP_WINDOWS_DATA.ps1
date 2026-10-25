$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
$source = Join-Path $Root 'runtime-data'
if (-not (Test-Path $source)) { throw 'runtime-data does not exist.' }
$destRoot = Join-Path $Root 'windows-backups'
New-Item -ItemType Directory -Force -Path $destRoot | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$dest = Join-Path $destRoot "smart-poultry-runtime-$stamp.zip"
Compress-Archive -Path "$source\*" -DestinationPath $dest -CompressionLevel Optimal
Write-Host "Backup created: $dest" -ForegroundColor Green
