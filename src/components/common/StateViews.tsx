import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { useTheme } from '@/theme';

type StateProps = {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function LoadingState({ title }: { title?: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.center} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {title ? <AppText style={styles.message}>{title}</AppText> : null}
    </View>
  );
}

export function EmptyState({ title, message, actionLabel, onAction }: StateProps) {
  return (
    <ScreenContainer style={styles.center}>
      <AppText style={styles.title}>{title}</AppText>
      {message ? <AppText style={styles.message}>{message}</AppText> : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </ScreenContainer>
  );
}

export function ErrorState({ title, message, actionLabel = 'Retry', onAction }: StateProps) {
  const { theme } = useTheme();
  return (
    <ScreenContainer style={styles.center}>
      <AppText style={[styles.title, { color: theme.colors.critical }]}>{title}</AppText>
      {message ? <AppText style={styles.message}>{message}</AppText> : null}
      {onAction ? <Button title={actionLabel} onPress={onAction} style={styles.action} /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 8,
  },
  action: {
    marginTop: 20,
    minWidth: 160,
  },
});
