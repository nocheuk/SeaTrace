import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { EmptyState } from '@/components/common/StateViews';
import { AppText, Card, ScreenContainer } from '@/components/ui';
import { COPY } from '@/constants/copy';
import { useTheme } from '@/theme';

export default function ActivityScreen() {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={styles.heading}>Activity</AppText>
        <Card style={{ backgroundColor: theme.colors.surfaceSecondary }}>
          <AppText style={styles.subtitle}>Coming soon in Milestone 2</AppText>
          <AppText style={{ color: theme.colors.textSecondary, marginTop: 8 }}>
            Confirmations on your reports, verification updates, nearby alerts, and coastal events will appear here.
          </AppText>
        </Card>
        <EmptyState title={COPY.empty.activity} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 32 },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  subtitle: { fontSize: 16, fontWeight: '600' },
});
