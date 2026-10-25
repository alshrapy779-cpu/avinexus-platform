@echo off
npm install
if not exist android (
  call npm run android:init
) else (
  call npm run android:sync
)
call npm run android:open
