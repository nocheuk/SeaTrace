import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, ScreenContainer } from '@/components/ui';
import {
  CATEGORY_GROUPS,
  REPORT_SUBCATEGORIES,
  type ReportCategoryGroup,
} from '@/constants/categories';
import { COPY } from '@/constants/copy';
import { analytics } from '@/features/analytics';
import { useReportFlowStore } from '@/stores/reportFlowStore';
import { useTheme } from '@/theme';

const GROUP_ORDER: ReportCategoryGroup[] = [
  'wildlife',
  'pollution',
  'debris',
  'coastal',
  'water',
  'other',
];

export default function CategoryStep() {
  const { theme } = useTheme();
  const setCategory = useReportFlowStore((s) => s.setCategory);

  const select = (subcategoryId: string) => {
    setCategory(subcategoryId);
    analytics.track('category_selected', { subcategory: subcategoryId });
    router.push('/report/details');
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={styles.title}>{COPY.report.categoryStep}</AppText>

        {GROUP_ORDER.map((group) => (
          <React.Fragment key={group}>
            <AppText style={[styles.groupTitle, { color: theme.colors.primary }]}>
              {CATEGORY_GROUPS[group].label}
            </AppText>
            {REPORT_SUBCATEGORIES.filter((s) => s.group === group).map((sub) => (
              <Pressable
                key={sub.id}
                onPress={() => select(sub.id)}
                style={[styles.item, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                accessibilityRole="button"
              >
                <Ionicons name={sub.icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.colors.primary} />
                <AppText style={styles.itemLabel}>{sub.label}</AppText>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
              </Pressable>
            ))}
          </React.Fragment>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  groupTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 16, marginBottom: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  itemLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
});
