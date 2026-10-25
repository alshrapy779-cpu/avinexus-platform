# V8 — النسخة المصححة الكاملة للمصدر + بناء Android

هذه النسخة تستبدل V7 بعد اكتشاف أن V7 احتوت على Gradle Wrapper يدوي مختصر وملف web asset تجريبي، ولذلك لم تكن جاهزة للبناء المباشر كما وُصفت.

## ما هو موجود فعلاً
- كل ملفات المشروع الأصلي React/TypeScript بدون حذف.
- كل إضافات التشغيل والإدارة والشراء والمالية والحالات البيطرية السابقة.
- مشروع Android/Capacitor source كامل من حيث ملفات المشروع القابلة للصيانة.
- Manifest بصلاحيات الإنترنت، الكاميرا، الميكروفون والموقع.
- MainActivity ومعرّف التطبيق `com.smartpoultry.yemen`.
- ملفات Gradle project الفعلية.
- سكربت بناء لا يعتمد على Gradle Wrapper ناقص.

## ما لا يجب وضعه داخل ZIP المصدر
هذه ليست ملفات كود مصدر للمشروع ويتم إنشاؤها/تنزيلها أثناء البناء:
- `node_modules/`
- Android SDK
- Gradle 8.14.3 distribution
- `dist/`
- `android/app/build/`
- ملف APK النهائي

`BUILD_APK_COMPLETE.bat` يتولى تنزيل/إنشاء ما يلزم على جهاز Windows ثم يضع APK في `APK_OUTPUT`.

## طريقة البناء
1. ثبّت Node.js 22 أو أحدث.
2. ثبّت Android Studio مع Android SDK Platform 36.
3. فك ضغط المشروع في مسار إنجليزي قصير، مثال `C:\SmartPoultry`.
4. شغّل `VERIFY_V8_COMPLETE.bat` أولاً.
5. شغّل `BUILD_APK_COMPLETE.bat`.
6. بعد النجاح ستجد:
   `APK_OUTPUT\Smart-Poultry-Platform-debug.apk`

## الـ Backend
واجهة Android لا تشغّل `server.ts` داخل الهاتف. عند الإطلاق الحقيقي يجب نشر Backend على HTTPS ووضع عنوانه في `.env.production` عبر `VITE_API_BASE_URL` قبل البناء. لا تضع Gemini API Key داخل APK.
