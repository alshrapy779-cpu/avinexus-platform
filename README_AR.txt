تعديلان كاملان يحافظان على الشاشات الأصلية.
1. استبدل src/App.tsx و src/components/auth/AdminRegistrationDashboard.tsx.
2. الخادم المستخدم يوفر GET /api/registration/requests و POST /api/registration/requests/:id/decision وليس /api/admin/pending-users.
3. يتطلب اعتماد المستخدم إنشاء هوية مؤسسية فعالة ذات role_code ونطاق scope_ids قبل الموافقة.
4. تحقق من session token ودور SYSTEM_OWNER.
5. لم يتم إجراء بناء وتشغيل نهائي لهذه النسخة؛ اختبر على بيئة staging قبل الإنتاج.
