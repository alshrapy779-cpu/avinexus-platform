$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$required = @(
  'package.json','src/App.tsx','src/main.tsx','src/types.ts','server.ts','capacitor.config.ts',
  'src/components/admin/SmartOperationsCenter.tsx',
  'src/components/operations/CustomerOperationsPanel.tsx',
  'src/components/marketplace/MarketplaceView.tsx',
  'src/components/ai/AIVeterinaryGuidanceModal.tsx',
  'android/build.gradle','android/settings.gradle','android/variables.gradle',
  'android/app/build.gradle','android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/java/com/smartpoultry/yemen/MainActivity.java',
  'BUILD_APK_COMPLETE.ps1','BUILD_APK_COMPLETE.bat'
)
$missing=@()
foreach($r in $required){ if(-not (Test-Path (Join-Path $Root $r))){$missing += $r} }
if($missing.Count){ Write-Host 'MISSING:' -ForegroundColor Red; $missing | ForEach-Object {Write-Host $_}; exit 1 }
Write-Host "Core source verification passed. Required files: $($required.Count)" -ForegroundColor Green
Write-Host "Note: node_modules, Android SDK, Gradle distribution, dist/, and APK are build dependencies/artifacts and are intentionally not stored as source." -ForegroundColor Yellow
