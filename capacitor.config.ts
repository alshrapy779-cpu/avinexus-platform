import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartpoultry.yemen',
  appName: 'المنصة الوطنية للدواجن الذكية',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    backgroundColor: '#061922'
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
