import fs from 'node:fs';
import path from 'node:path';

const manifest = path.resolve('android/app/src/main/AndroidManifest.xml');
if (!fs.existsSync(manifest)) {
  console.error('AndroidManifest.xml غير موجود. نفّذ npm run android:init أولاً.');
  process.exit(1);
}

let xml = fs.readFileSync(manifest, 'utf8');
const permissions = [
  'android.permission.INTERNET',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
];

for (const permission of permissions) {
  if (!xml.includes(`android:name="${permission}"`)) {
    xml = xml.replace('</manifest>', `    <uses-permission android:name="${permission}" />\n</manifest>`);
  }
}

// The application is RTL/Arabic and uses camera, microphone and geolocation from the WebView.
if (!xml.includes('android:supportsRtl=')) {
  xml = xml.replace('<application', '<application android:supportsRtl="true"');
}

fs.writeFileSync(manifest, xml);
console.log('Android permissions verified: camera, microphone, location, internet.');
