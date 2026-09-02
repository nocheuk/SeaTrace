import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Share, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useQueryClient } from '@tanstack/react-query';
import { confirmReport, fetchReportOwnerId } from '@/api/reportMutations';
import { ErrorState, LoadingState } from '@/components/common/StateViews';
import { AppText, Button, Card, ScreenContainer } from '@/components/ui';
import { CONFIRMATION_TYPES } from '@/constants/reportStatus';
import { COPY } from '@/constants/copy';
import {
  getCategoryLabel,
  getReportAge,
  getReportTitle,
  getStatusLabel,
  obscuredLocationLabel,
} from '@/domain/reportDisplay';
import { canConfirmReport } from '@/domain/reports';
import { analytics } from '@/features/analytics';
import { useAuth } from '@/hooks/useAuth';
import { useReport } from '@/hooks/useReports';
import { useSignedImageUrl } from '@/hooks/useSignedImageUrl';
import { useTheme } from '@/theme';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: report, isLoading, isError, refetch } = useReport(id ?? '');
  const { url: imageUrl } = useSignedImageUrl(report?.primary_image_path);
  const [confirming, setConfirming] = useState(false);
  const [ownerId, setOwnerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (id) {
      analytics.track('report_viewed', { reportId: id });
      fetchReportOwnerId(id).then(setOwnerId);
    }
  }, [id]);

  const canConfirm = canConfirmReport(ownerId ?? '', user?.id);

  const handleConfirm = async (type: keyof typeof CONFIRMATION_TYPES) => {
    if (!user || !id) {
      Alert.alert('Sign in required', 'Please sign in to confirm reports.');
      return;
    }
    setConfirming(true);
    try {
      await confirmReport(id, user.id, CONFIRMATION_TYPES[type].value);
      analytics.track('report_confirmed', { reportId: id, type });
      await queryClient.invalidateQueries({ queryKey: ['report', id] });
      Alert.alert('Thank you', 'Your confirmation has been recorded.');
    } catch (error) {
      Alert.alert('Unable to confirm', error instanceof Error ? error.message : COPY.errors.generic);
    } finally {
      setConfirming(false);
    }
  };

  const share = async () => {
    if (!report) return;
    await Share.share({
      message: `${getReportTitle(report)} — observed ${getReportAge(report)}`,
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError || !report) return <ErrorState title="Report not found" onAction={() => refetch()} />;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.hero} accessibilityLabel="Report photo" />
          ) : (
            <View style={[styles.hero, styles.placeholder, { backgroundColor: theme.colors.surfaceSecondary }]} />
          )}

          <Card>
            <AppText style={styles.category}>{getCategoryLabel(report.subcategory)}</AppText>
            <AppText style={styles.title}>{getReportTitle(report)}</AppText>
            <AppText style={{ color: theme.colors.textSecondary }}>
              {getStatusLabel(report.status)} · {getReportAge(report)}
            </AppText>
            <AppText style={{ color: theme.colors.textSecondary, marginTop: 4 }}>
              {obscuredLocationLabel(report.display_latitude, report.display_longitude)}
            </AppText>
            {report.description ? (
              <AppText style={styles.description}>{report.description}</AppText>
            ) : null}
            <AppText style={{ color: theme.colors.accent, marginTop: 8 }}>
              {report.confirmation_count} community confirmation{report.confirmation_count === 1 ? '' : 's'}
            </AppText>
          </Card>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: report.display_latitude,
              longitude: report.display_longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            scrollEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: report.display_latitude,
                longitude: report.display_longitude,
              }}
            />
          </MapView>

          {canConfirm ? (
            <View style={styles.confirmSection}>
              <AppText style={styles.sectionTitle}>Community verification</AppText>
              {(['confirm', 'still_here', 'no_longer_here', 'incorrect'] as const).map((type) => (
                <Button
                  key={type}
                  title={CONFIRMATION_TYPES[type].label}
                  variant={type === 'incorrect' ? 'ghost' : 'secondary'}
                  loading={confirming}
                  onPress={() => handleConfirm(type)}
                  style={styles.confirmBtn}
                />
              ))}
            </View>
          ) : null}

          <Button title="Share" variant="ghost" onPress={share} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  hero: { width: '100%', height: 260 },
  placeholder: {},
  category: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: '700', marginVertical: 8 },
  description: { fontSize: 16, lineHeight: 24, marginTop: 12 },
  map: { height: 180, marginHorizontal: 16, borderRadius: 12, marginTop: 16 },
  confirmSection: { padding: 16, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  confirmBtn: { marginBottom: 4 },
});
