import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { signUp } from '@/api/auth';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { COPY } from '@/constants/copy';
import { useTheme } from '@/theme';
import { signUpSchema, type SignUpInput } from '@/validation/auth';
import { analytics } from '@/features/analytics';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', displayName: '' },
  });

  const onSubmit = async (data: SignUpInput) => {
    setLoading(true);
    try {
      await signUp(data);
      analytics.track('signup_completed');
      router.replace('/(tabs)/map');
    } catch (error) {
      Alert.alert('Sign up failed', error instanceof Error ? error.message : 'Try again');
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
      <AppText style={styles.heading}>{COPY.auth.signUp}</AppText>

      {(['displayName', 'email', 'password'] as const).map((name) => (
        <Controller
          key={name}
          control={control}
          name={name}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={styles.field}>
              <TextInput
                style={inputStyle}
                placeholder={
                  name === 'displayName'
                    ? COPY.auth.displayName
                    : name === 'email'
                      ? COPY.auth.email
                      : COPY.auth.password
                }
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize={name === 'email' ? 'none' : 'words'}
                keyboardType={name === 'email' ? 'email-address' : 'default'}
                secureTextEntry={name === 'password'}
                value={value}
                onChangeText={onChange}
              />
              {error ? <AppText style={{ color: theme.colors.critical }}>{error.message}</AppText> : null}
            </View>
          )}
        />
      ))}

      <Button title={COPY.auth.signUp} loading={loading} onPress={handleSubmit(onSubmit)} />

      <Link href="/auth/sign-in" style={styles.link}>
        <AppText style={{ color: theme.colors.primary }}>{COPY.auth.hasAccount} {COPY.auth.signIn}</AppText>
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
