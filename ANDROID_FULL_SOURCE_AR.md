# النسخة الكاملة لمشروع Android

هذه النسخة تحتفظ بكامل مشروع React/Vite وتضيف مجلد `android/` فعلياً داخل المشروع.

## ما هو موجود
- كامل كود الويب في `src/`.
- الخادم في `server.ts` (يُنشر كـ Backend منفصل ولا يوضع مفتاح Gemini داخل APK).
- إعداد Capacitor في `capacitor.config.ts`.
- مشروع Android في `android/`.
- `MainActivity.java`.
- `AndroidManifest.xml` وصلاحيات الإنترنت والكاميرا والميكروفون والموقع.
- ملفات Gradle وGradle Wrapper وموارد Android والثيم والأيقونة.

## أول تشغيل على Windows
1. ثبّت Node.js وAndroid Studio وJDK 21.
2. شغّل `build-android-complete.bat`.
3. بعد اكتمال `npm install` و`cap sync` افتح مجلد `android` في Android Studio.
4. انتظر Gradle Sync.
5. اختر Build > Build App Bundles or APKs > Build APKs.

ملف APK التجريبي سيكون عادةً في:
`android/app/build/outputs/apk/debug/app-debug.apk`

## Backend
أنشئ `.env.production` من `.env.android.example` وضع رابط HTTPS الحقيقي للخادم في `VITE_API_BASE_URL` قبل البناء النهائي.

## ملاحظة عن dependencies
`node_modules` وملفات Gradle التي يتم تنزيلها آلياً ليست جزءاً من كود المصدر عادةً ولا ينبغي تضمينها في ZIP؛ يقوم npm وAndroid Studio بتنزيلها حسب `package.json` وGradle configuration.

## التحقق من أن المشروع كامل
شغّل `VERIFY_PROJECT.bat`. سيتحقق من الملفات الأساسية لمشروع الويب وAndroid.
يوجد أيضاً `SHA256SUMS.txt` ببصمات الملفات للتحقق من سلامة النسخة.

## مهم
المشروع يحتوي على **كود المصدر كاملاً** ومشروع Android نفسه. الحزم الخارجية (`node_modules`) وAndroid SDK ليست كود المشروع؛ يتم تنزيلها على جهاز التطوير من `package.json` وملفات Gradle، كما هو المعتاد في مشاريع Android/React.
