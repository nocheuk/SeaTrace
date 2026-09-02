import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { LoadingState } from '@/components/common/StateViews';
import { useAuth } from '@/hooks/useAuth';

const ONBOARDING_KEY = '@seatrace/onboarding_complete';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setOnboardingComplete(value === 'true');
    });
  }, []);

  if (isLoading || onboardingComplete === null) {
    return <LoadingState title="Loading..." />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/sign-in" />;
  }

  return <Redirect href="/(tabs)/map" />;
}
