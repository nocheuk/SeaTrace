import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '@/components/ui';
import { getReportAge, getReportTitle, getStatusLabel } from '@/domain/reportDisplay';
import { getSubcategory } from '@/constants/categories';
import { useTheme } from '@/theme';
import type { ReportPublic } from '@/types/database';

type Props = {
  report: ReportPublic;
  imageUrl?: string | null;
  onPress?: () => void;
  compact?: boolean;
};

export function ReportPreviewCard({ report, imageUrl, onPress, compact }: Props) {
  const { theme } = useTheme();
  const sub = getSubcategory(report.subcategory);

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card style={[styles.card, compact && styles.compact]}>
        <View style={styles.row}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder, { backgroundColor: theme.colors.surfaceSecondary }]}>
              <Ionicons name="image-outline" size={28} color={theme.colors.textSecondary} />
            </View>
          )}
          <View style={styles.content}>
            <AppText style={styles.category}>{sub?.label ?? report.subcategory}</AppText>
            <AppText style={styles.title} numberOfLines={2}>
              {getReportTitle(report)}
            </AppText>
            <AppText style={[styles.meta, { color: theme.colors.textSecondary }]}>
              {getReportAge(report)} · {getStatusLabel(report.status)}
            </AppText>
            {report.confirmation_count > 0 ? (
              <AppText style={[styles.meta, { color: theme.colors.accent }]}>
                {report.confirmation_count} confirmation{report.confirmation_count === 1 ? '' : 's'}
              </AppText>
            ) : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginBottom: 12 },
  compact: { marginHorizontal: 0 },
  row: { flexDirection: 'row', gap: 12 },
  image: { width: 88, height: 88, borderRadius: 12 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center' },
  category: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  meta: { fontSize: 13 },
});
