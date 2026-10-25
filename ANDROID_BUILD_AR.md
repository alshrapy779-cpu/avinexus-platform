# تحويل المنصة إلى تطبيق Android

تم تجهيز المشروع لاستخدام **Capacitor 8.5.2** مع React + Vite بدون إعادة كتابة الواجهات.

## ما تم تجهيزه
- معرف التطبيق: `com.smartpoultry.yemen`
- اسم التطبيق: `المنصة الوطنية للدواجن الذكية`
- ربط مجلد Vite `dist` بالتطبيق الأصلي Android.
- تهيئة صلاحيات الكاميرا والميكروفون والموقع والإنترنت.
- فصل رابط Backend API عن واجهة الهاتف باستخدام `VITE_API_BASE_URL`.
- إضافة CORS إلى `server.ts` للسماح لتطبيق Capacitor بالاتصال بالخادم.
- أوامر جاهزة لإنشاء ومزامنة وفتح وبناء Android.

## قبل بناء التطبيق
1. ثبّت Android Studio وAndroid SDK 36 وJDK 21.
2. في جذر المشروع نفّذ: `npm install`
3. انسخ `.env.android.example` إلى `.env.production`.
4. غيّر `https://api.example.com` إلى رابط خادم المنصة الحقيقي HTTPS.

> مهم: `server.ts` وGEMINI_API_KEY يبقيان على الخادم ولا يوضع مفتاح Gemini داخل APK.

## إنشاء مشروع Android لأول مرة
Windows: شغّل `setup-android.bat`

macOS/Linux: `chmod +x setup-android.sh && ./setup-android.sh`

أو يدوياً:
`npm run android:init`
ثم:
`npm run android:open`

## بعد أي تعديل في React
`npm run android:sync`
ثم افتح Android Studio بـ:
`npm run android:open`

## إنشاء APK تجريبي
من Android Studio:
Build > Build App Bundles or APKs > Build APKs

أو من الطرفية بعد اكتمال إعداد Android SDK:
`npm run android:apk`

الملف يكون عادة في:
`android/app/build/outputs/apk/debug/app-debug.apk`

## نسخة النشر في Google Play
استخدم Android Studio لإنشاء Signed App Bundle (AAB) بمفتاح توقيع خاص بالمنصة. لا تستخدم debug APK للنشر.

## الكاميرا والصوت وGPS
الواجهة الحالية تعتمد على Web APIs (`getUserMedia`, file capture, geolocation). Capacitor WebView يدعمها، وملف patch يضيف الصلاحيات الأصلية المطلوبة إلى AndroidManifest بعد كل sync.

## Backend
على الهاتف، المسار `/api/...` لا يمكن أن يشير إلى `server.ts` الموجود على جهاز التطوير. لذلك تم تعديل `apiService.ts` ليستخدم:
`VITE_API_BASE_URL`

مثال إنتاج:
`VITE_API_BASE_URL=https://api.smartpoultry.example`

للاختبار من محاكي Android مع خادم محلي يمكن استخدام `http://10.0.2.2:3000`، لكن يفضّل HTTPS، وقد يلزم السماح بالـ cleartext للاختبار المحلي فقط.
