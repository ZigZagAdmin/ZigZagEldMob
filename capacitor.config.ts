import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zigzag.eld',
  appName: 'ZigZag ELD',
  webDir: 'www',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'always',
  },
};

export default config;
