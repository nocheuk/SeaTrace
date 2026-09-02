import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { getSubcategory } from '@/constants/categories';
import { SAFETY_CATEGORIES } from '@/constants/safety';
import { COPY } from '@/constants/copy';
import { useReportFlowStore } from '@/stores/reportFlowStore';
import { useTheme } from '@/theme';

export default function DetailsStep() {
  const { theme } = useTheme();
  const store = useReportFlowStore();
  const sub = getSubcategory(store.subcategory ?? '');

  const showSpecies = store.subcategory && ['wildlife', 'water'].includes(sub?.group ?? '');
  const showAlive = sub?.group === 'wildlife';
  const showSeverity = sub?.group === 'pollution' || sub?.group === 'coastal';
  const showSafety = store.subcategory && SAFETY_CATEGORIES.has(store.subcategory);

  return (
    <ScreenContainer style={styles.container}>
      <AppText style={styles.title}>{COPY.report.detailsStep}</AppText>

      {showSafety ? (
        <AppText style={[styles.notice, { color: theme.colors.warning }]}>
          {COPY.report.safetyNotice}
        </AppText>
      ) : null}

      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
        placeholder="Title (optional)"
        placeholderTextColor={theme.colors.textSecondary}
        value={store.title ?? ''}
        onChangeText={(v) => store.setDetails({ title: v || null })}
      />

      <TextInput
        style={[styles.input, styles.multiline, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
        placeholder="Description (optional)"
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        value={store.description ?? ''}
        onChangeText={(v) => store.setDetails({ description: v || null })}
      />

      {showSpecies ? (
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Species if known"
          placeholderTextColor={theme.colors.textSecondary}
          value={store.speciesName ?? ''}
          onChangeText={(v) => store.setDetails({ speciesName: v || null })}
        />
      ) : null}

      {showAlive ? (
        <View style={styles.row}>
          {(['alive', 'dead', 'unknown'] as const).map((status) => (
            <Button
              key={status}
              title={status}
              variant={store.aliveStatus === status ? 'primary' : 'secondary'}
              onPress={() => store.setDetails({ aliveStatus: status })}
              style={styles.chip}
            />
          ))}
        </View>
      ) : null}

      {showSeverity ? (
        <View style={styles.row}>
          {(['low', 'moderate', 'high'] as const).map((sev) => (
            <Button
              key={sev}
              title={sev}
              variant={store.severity === sev ? 'primary' : 'secondary'}
              onPress={() => store.setDetails({ severity: sev })}
              style={styles.chip}
            />
          ))}
        </View>
      ) : null}

      <Button title="Continue" onPress={() => router.push('/report/review')} style={styles.continue} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  notice: { fontSize: 14, marginBottom: 12, lineHeight: 20 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  chip: { flex: 1, minWidth: 90 },
  continue: { marginTop: 8 },
});
