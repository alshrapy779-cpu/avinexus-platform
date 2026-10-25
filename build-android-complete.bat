@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ================================================
echo   Smart Poultry - Android Build Preparation
echo ================================================

echo [1/5] Checking Node.js...
where node >nul 2>&1 || (echo ERROR: Node.js is not installed. & pause & exit /b 1)
node -v

echo [2/5] Installing JavaScript dependencies...
call npm install
if errorlevel 1 (echo ERROR: npm install failed. Check Internet connection. & pause & exit /b 1)

echo [3/5] Building React/Vite web application...
call npm run build:web
if errorlevel 1 (echo ERROR: Web build failed. & pause & exit /b 1)

echo [4/5] Syncing web files into the existing Android project...
call npx cap sync android
if errorlevel 1 (echo ERROR: Capacitor Android sync failed. & pause & exit /b 1)
call node scripts/patch-android-manifest.mjs

echo [5/5] Android source is ready.
echo.
echo Open the folder: %CD%\android
echo in Android Studio and choose Build ^> Build App Bundles or APKs ^> Build APKs.
echo.
choice /M "Open Android Studio now"
if errorlevel 2 goto end
call npx cap open android
:end
pause
