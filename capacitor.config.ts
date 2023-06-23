import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zigzag.plus',
  appName: 'ZigZag Plus',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http',
    allowNavigation: ['api.zigzagplus.com'],
  },
};

export default config;
