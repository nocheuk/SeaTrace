import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { COPY } from '@/constants/copy';
import { useTheme } from '@/theme';

export default function SuccessScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const share = async () => {
    if (!id) return;
    await Share.share({ message: `Coastal observation on SeaTrace: ${id}` });
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={[styles.icon, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <AppText style={{ fontSize: 48 }}>✓</AppText>
      </View>
      <AppText style={styles.title}>{COPY.report.successTitle}</AppText>
      <AppText style={[styles.body, { color: theme.colors.textSecondary }]}>{COPY.report.successBody}</AppText>

      <View style={styles.actions}>
        <Button title={COPY.report.viewReport} onPress={() => router.replace(`/report/${id}`)} />
        <Button title={COPY.report.shareReport} variant="secondary" onPress={share} />
        <Button title={COPY.report.returnToMap} variant="ghost" onPress={() => router.replace('/(tabs)/map')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: 'center' },
  icon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  body: { fontSize: 17, textAlign: 'center', marginBottom: 32 },
  actions: { gap: 12 },
});
