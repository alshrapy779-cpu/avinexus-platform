#!/usr/bin/env bash
set -e
npm install
if [ ! -d android ]; then
  npm run android:init
else
  npm run android:sync
fi
npm run android:open
