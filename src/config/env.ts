import Constants from 'expo-constants';

function requireEnv(key: string): string {
  const value = process.env[key] ?? Constants.expoConfig?.extra?.[key.replace('EXPO_PUBLIC_', '')];
  if (!value) {
    if (__DEV__) {
      console.warn(`Missing environment variable: ${key}`);
    }
    return '';
  }
  return value;
}

export const config = {
  supabase: {
    url: requireEnv('EXPO_PUBLIC_SUPABASE_URL'),
    anonKey: requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  },
  isConfigured: (): boolean =>
    Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  features: {
    magicLinkAuth: true,
    darkMode: false,
    offlineDrafts: true,
    multiPhotoReports: false,
  },
  limits: {
    maxImageSizeBytes: 8 * 1024 * 1024,
    maxImageWidth: 2048,
    imageCompressQuality: 0.82,
    confirmationRateLimitHours: 24,
    maxDescriptionLength: 2000,
  },
  storage: {
    reportImagesBucket: 'report-images',
    avatarsBucket: 'avatars',
  },
} as const;
