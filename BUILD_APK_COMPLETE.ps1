$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "Smart Poultry Platform - Complete Android APK Build"

function Step($text) { Write-Host "`n=== $text ===" -ForegroundColor Cyan }
function Fail($text) { Write-Host "`nERROR: $text" -ForegroundColor Red; exit 1 }

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Step "1/9 - Checking Node.js"
try { $nodeVersion = (& node -v).Trim() } catch { Fail "Node.js 22+ is required. Install it, then run this file again." }
$major = [int](($nodeVersion -replace '^v','').Split('.')[0])
if ($major -lt 22) { Fail "Node.js 22+ is required. Current: $nodeVersion" }
Write-Host "Node $nodeVersion"

Step "2/9 - Locating Java 21"
$javaOk = $false
try {
  $jv = (& java -version 2>&1 | Select-Object -First 1)
  if ($jv -match '"(\d+)') { if ([int]$Matches[1] -ge 21) { $javaOk = $true } }
} catch {}
if (-not $javaOk) {
  $studioJbrCandidates = @(
    "$env:ProgramFiles\Android\Android Studio\jbr",
    "$env:LOCALAPPDATA\Programs\Android Studio\jbr"
  )
  foreach ($c in $studioJbrCandidates) {
    if (Test-Path "$c\bin\java.exe") { $env:JAVA_HOME=$c; $env:Path="$c\bin;$env:Path"; $javaOk=$true; break }
  }
}
if (-not $javaOk) { Fail "Java 21 was not found. Install current Android Studio first." }
& java -version

Step "3/9 - Locating Android SDK"
$sdkCandidates = @()
if ($env:ANDROID_HOME) { $sdkCandidates += $env:ANDROID_HOME }
if ($env:ANDROID_SDK_ROOT) { $sdkCandidates += $env:ANDROID_SDK_ROOT }
$sdkCandidates += "$env:LOCALAPPDATA\Android\Sdk"
$Sdk = $null
foreach ($c in $sdkCandidates) { if ($c -and (Test-Path $c)) { $Sdk = $c; break } }
if (-not $Sdk) { Fail "Android SDK was not found. Open Android Studio > SDK Manager and install Android SDK 36." }
$env:ANDROID_HOME=$Sdk; $env:ANDROID_SDK_ROOT=$Sdk
Write-Host "SDK: $Sdk"
"sdk.dir=$($Sdk -replace '\\','\\\\')" | Set-Content -Encoding ASCII "android\local.properties"

Step "4/9 - Ensuring Android SDK 36/build tools"
$sdkmanager = @(
  "$Sdk\cmdline-tools\latest\bin\sdkmanager.bat",
  "$Sdk\cmdline-tools\bin\sdkmanager.bat",
  "$Sdk\tools\bin\sdkmanager.bat"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($sdkmanager) {
  try { & $sdkmanager "platforms;android-36" "build-tools;36.0.0" "platform-tools" | Out-Host } catch { Write-Warning "SDK Manager could not update packages automatically. Android Studio can install them." }
}
if (-not (Test-Path "$Sdk\platforms\android-36")) { Fail "Android SDK Platform 36 is missing. Install it from Android Studio SDK Manager." }

Step "5/9 - Installing exact JavaScript dependencies"
if (Test-Path package-lock.json) { & npm ci } else { & npm install }
if ($LASTEXITCODE -ne 0) { Fail "npm dependency installation failed." }

Step "6/9 - Building the complete React application"
& npm run build:web
if ($LASTEXITCODE -ne 0 -or -not (Test-Path "dist\index.html")) { Fail "Vite web build failed or dist/index.html was not created." }

Step "7/9 - Synchronizing official Capacitor Android project"
& npx cap sync android
if ($LASTEXITCODE -ne 0) { Fail "Capacitor sync failed." }
if (-not (Test-Path "android\app\src\main\assets\public\index.html")) { Fail "Capacitor did not copy the built web application into Android assets." }

Step "8/9 - Getting Gradle 8.14.3 and building APK"
$Tools = Join-Path $Root ".android-build-tools"
$GradleHome = Join-Path $Tools "gradle-8.14.3"
$GradleBat = Join-Path $GradleHome "bin\gradle.bat"
if (-not (Test-Path $GradleBat)) {
  New-Item -ItemType Directory -Force -Path $Tools | Out-Null
  $Zip = Join-Path $Tools "gradle-8.14.3-bin.zip"
  Write-Host "Downloading official Gradle 8.14.3..."
  Invoke-WebRequest -UseBasicParsing -Uri "https://services.gradle.org/distributions/gradle-8.14.3-bin.zip" -OutFile $Zip
  if (-not (Test-Path $Zip)) { Fail "Gradle download failed." }
  Expand-Archive -Path $Zip -DestinationPath $Tools -Force
}
& $GradleBat -p android assembleDebug
if ($LASTEXITCODE -ne 0) { Fail "Android Gradle build failed." }

Step "9/9 - Copying APK"
$Apk = "android\app\build\outputs\apk\debug\app-debug.apk"
if (-not (Test-Path $Apk)) { Fail "Build finished but app-debug.apk was not found." }
$Out = Join-Path $Root "APK_OUTPUT"
New-Item -ItemType Directory -Force -Path $Out | Out-Null
$Dest = Join-Path $Out "Smart-Poultry-Platform-debug.apk"
Copy-Item $Apk $Dest -Force
$hash=(Get-FileHash $Dest -Algorithm SHA256).Hash
Write-Host "`nSUCCESS" -ForegroundColor Green
Write-Host "APK: $Dest"
Write-Host "SHA256: $hash"
Start-Process explorer.exe $Out
