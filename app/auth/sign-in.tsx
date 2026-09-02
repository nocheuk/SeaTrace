import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { signIn, sendMagicLink } from '@/api/auth';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { COPY } from '@/constants/copy';
import { config } from '@/config/env';
import { useTheme } from '@/theme';
import { signInSchema, type SignInInput } from '@/validation/auth';
import { analytics } from '@/features/analytics';

export default function SignInScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, getValues } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInInput) => {
    setLoading(true);
    try {
      await signIn(data);
      analytics.track('signup_completed');
      router.replace('/(tabs)/map');
    } catch (error) {
      Alert.alert('Sign in failed', error instanceof Error ? error.message : 'Try again');
    } finally {
      setLoading(false);
    }
  };

  const onMagicLink = async () => {
    const email = getValues('email');
    if (!email) {
      Alert.alert('Enter your email first');
      return;
    }
    setLoading(true);
    try {
      await sendMagicLink(email);
      Alert.alert('Check your email', 'We sent you a magic link to sign in.');
    } catch (error) {
      Alert.alert('Failed', error instanceof Error ? error.message : 'Try again');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text },
  ];

  return (
    <ScreenContainer style={styles.container}>
      <AppText style={styles.heading}>{COPY.auth.signIn}</AppText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={styles.field}>
            <TextInput
              style={inputStyle}
              placeholder={COPY.auth.email}
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
            {error ? <AppText style={{ color: theme.colors.critical }}>{error.message}</AppText> : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={styles.field}>
            <TextInput
              style={inputStyle}
              placeholder={COPY.auth.password}
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
            {error ? <AppText style={{ color: theme.colors.critical }}>{error.message}</AppText> : null}
          </View>
        )}
      />

      <Button title={COPY.auth.signIn} loading={loading} onPress={handleSubmit(onSubmit)} />
      {config.features.magicLinkAuth ? (
        <Button title={COPY.auth.magicLink} variant="secondary" loading={loading} onPress={onMagicLink} />
      ) : null}

      <Link href="/auth/sign-up" style={styles.link}>
        <AppText style={{ color: theme.colors.primary }}>{COPY.auth.noAccount} {COPY.auth.signUp}</AppText>
      </Link>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: 'center' },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  field: { marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
  link: { marginTop: 24, alignSelf: 'center' },
});
