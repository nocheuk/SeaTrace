import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext, darkTheme, lightTheme } from '@/theme';
import { useAuthListener } from '@/hooks/useAuth';
import { useDraftSync } from '@/services/draftSync';
import { analytics } from '@/features/analytics';
import { BRAND } from '@/constants/brand';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppProviders({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme() ?? 'light';
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  useAuthListener();
  useDraftSync();

  useEffect(() => {
    analytics.track('app_opened');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme, colorScheme: scheme === 'dark' ? 'dark' : 'light' }}>
        {children}
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light';

  return (
    <AppProviders>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="auth/sign-in" options={{ presentation: 'modal' }} />
        <Stack.Screen name="auth/sign-up" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="report" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    </AppProviders>
  );
}

export { BRAND };
