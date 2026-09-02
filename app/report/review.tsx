import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { createReport, uploadReportImage } from '@/api/reportMutations';
import { AppText, Button, Card, ScreenContainer } from '@/components/ui';
import { getSubcategory } from '@/constants/categories';
import { COPY } from '@/constants/copy';
import { getCategoryLabel, obscuredLocationLabel } from '@/domain/reportDisplay';
import { analytics } from '@/features/analytics';
import { useAuth } from '@/hooks/useAuth';
import { createDraft } from '@/services/draftQueue';
import { queueDraftForUpload } from '@/services/draftSync';
import { useReportFlowStore } from '@/stores/reportFlowStore';
import { useTheme } from '@/theme';

export default function ReviewStep() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const store = useReportFlowStore();
  const [loading, setLoading] = useState(false);

  const sub = getSubcategory(store.subcategory ?? '');

  const submit = async () => {
    if (!user || !store.latitude || !store.longitude || !store.subcategory || !store.observedAt) {
      Alert.alert('Incomplete report', 'Please complete all required steps.');
      return;
    }

    setLoading(true);
    try {
      const report = await createReport(
        {
          latitude: store.latitude,
          longitude: store.longitude,
          locationAccuracy: store.locationAccuracy,
          observedAt: store.observedAt,
          subcategory: store.subcategory,
          title: store.title,
          description: store.description,
          severity: store.severity as 'low' | 'moderate' | 'high' | null,
          speciesName: store.speciesName,
          quantityEstimate: store.quantityEstimate,
          aliveStatus: store.aliveStatus as 'alive' | 'dead' | 'unknown' | null,
        },
        user.id,
      );

      if (store.photoUri) {
        await uploadReportImage(user.id, report.id, store.photoUri);
      }

      analytics.track('report_submitted', { reportId: report.id });
      store.reset();
      router.replace({ pathname: '/report/success', params: { id: report.id } });
    } catch (error) {
      analytics.track('report_failed');
      const draft = await createDraft({
        localPhotoUri: store.photoUri,
        latitude: store.latitude,
        longitude: store.longitude,
        locationAccuracy: store.locationAccuracy,
        observedAt: store.observedAt,
        subcategory: store.subcategory,
        title: store.title,
        description: store.description,
        severity: store.severity,
        speciesName: store.speciesName,
        quantityEstimate: store.quantityEstimate,
        aliveStatus: store.aliveStatus,
      });

      try {
        await queueDraftForUpload(draft);
      } catch {
        Alert.alert('Saved as draft', COPY.report.draftSaved);
        router.replace('/(tabs)/map');
        return;
      }

      Alert.alert('Error', error instanceof Error ? error.message : COPY.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={styles.title}>{COPY.report.reviewStep}</AppText>

        <Card>
          {store.photoUri ? (
            <Image source={{ uri: store.photoUri }} style={styles.photo} />
          ) : null}
          <AppText style={styles.label}>Category</AppText>
          <AppText style={styles.value}>{sub?.label ?? store.subcategory}</AppText>

          {store.title ? (
            <>
              <AppText style={styles.label}>Title</AppText>
              <AppText style={styles.value}>{store.title}</AppText>
            </>
          ) : null}

          {store.latitude && store.longitude ? (
            <>
              <AppText style={styles.label}>Location</AppText>
              <AppText style={styles.value}>
                {obscuredLocationLabel(store.latitude, store.longitude)}
              </AppText>
            </>
          ) : null}

          <AppText style={[styles.emergency, { color: theme.colors.textSecondary }]}>
            {COPY.report.emergencyNotice}
          </AppText>
        </Card>

        <Button title={COPY.report.submit} loading={loading} onPress={submit} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  photo: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', color: '#6B8A90', marginTop: 8 },
  value: { fontSize: 16, marginTop: 4 },
  emergency: { fontSize: 13, marginTop: 16, lineHeight: 18 },
});
