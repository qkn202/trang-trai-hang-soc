// Track B7: Capacitor Native Mobile Configuration (iOS WKWebView CoreHaptics + Android)
export interface CapacitorConfigShape {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime: boolean;
  server?: {
    androidScheme?: 'https' | 'http';
    iosScheme?: string;
  };
  ios?: {
    contentInset?: 'automatic' | 'always' | 'never';
    preferredContentMode?: 'mobile' | 'desktop';
    backgroundColor?: string;
  };
  android?: {
    backgroundColor?: string;
    allowMixedContent?: boolean;
  };
}

const config: CapacitorConfigShape = {
  appId: 'vn.hpvn.hangsoc',
  appName: 'Trang Trại Hang Sóc',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    backgroundColor: '#1f1611',
  },
  android: {
    backgroundColor: '#1f1611',
    allowMixedContent: false,
  },
};

export default config;
