@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul
set "APK=%CD%\APK_OUTPUT\Smart-Poultry-Platform-debug.apk"
if not exist "%APK%" (
  echo APK not found. Run BUILD_APK_ONE_CLICK.bat first.
  pause
  exit /b 1
)

set "ADB="
if defined ANDROID_SDK_ROOT if exist "%ANDROID_SDK_ROOT%\platform-tools\adb.exe" set "ADB=%ANDROID_SDK_ROOT%\platform-tools\adb.exe"
if not defined ADB if defined ANDROID_HOME if exist "%ANDROID_HOME%\platform-tools\adb.exe" set "ADB=%ANDROID_HOME%\platform-tools\adb.exe"
if not defined ADB if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" set "ADB=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
if not defined ADB (
  echo adb.exe not found. Install Android SDK Platform-Tools from Android Studio.
  pause
  exit /b 1
)

echo Enable Developer Options and USB debugging on the phone, then connect USB.
"%ADB%" devices
echo.
choice /M "Install/update the APK on the connected phone"
if errorlevel 2 exit /b 0
"%ADB%" install -r "%APK%"
if errorlevel 1 (
  echo Installation failed. Check the phone screen for USB debugging authorization.
  pause
  exit /b 1
)
echo APK installed successfully.
pause
