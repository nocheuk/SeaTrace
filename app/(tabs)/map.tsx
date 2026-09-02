import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { CoastalMap } from '@/components/map/CoastalMap';
import { ReportPreviewCard } from '@/components/report/ReportPreviewCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/common/StateViews';
import { AppText } from '@/components/ui';
import { MAP_FILTERS, type MapFilterId } from '@/constants/categories';
import { COPY } from '@/constants/copy';
import { analytics } from '@/features/analytics';
import { useMapRegion, useUserLocation, regionToBounds } from '@/hooks/useLocation';
import { useSignedImageUrl } from '@/hooks/useSignedImageUrl';
import { useViewportReports } from '@/hooks/useReports';
import { useTheme } from '@/theme';
import type { ReportPublic } from '@/types/database';

function SelectedReportCard({
  report,
  onClose,
}: {
  report: ReportPublic;
  onClose: () => void;
}) {
  const { url } = useSignedImageUrl(report.primary_image_path);
  return (
    <View style={styles.previewContainer}>
      <Pressable style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close preview">
        <Ionicons name="close" size={22} color="#102A2E" />
      </Pressable>
      <ReportPreviewCard
        report={report}
        imageUrl={url}
        onPress={() => router.push(`/report/${report.id}`)}
        compact
      />
    </View>
  );
}

export default function MapScreen() {
  const { theme } = useTheme();
  const { location, error: locationError, requestPermission } = useUserLocation();
  const initialRegion = useMapRegion(location);
  const [region, setRegion] = useState<Region>(initialRegion);
  const [filter, setFilter] = useState<MapFilterId>('all');
  const [selectedReport, setSelectedReport] = useState<ReportPublic | null>(null);

  const bounds = regionToBounds(region);
  const { data: reports = [], isLoading, isError, refetch } = useViewportReports(bounds, filter);

  React.useEffect(() => {
    analytics.track('map_viewed');
  }, []);

  React.useEffect(() => {
    if (location) {
      setRegion((r) => ({ ...r, latitude: location.latitude, longitude: location.longitude }));
    }
  }, [location]);

  const onRegionChangeComplete = useCallback((r: Region) => {
    setRegion(r);
  }, []);

  if (locationError && !location) {
    return (
      <EmptyState
        title={COPY.map.locationPermissionTitle}
        message={COPY.map.locationPermissionBody}
        actionLabel={COPY.map.enableLocation}
        onAction={requestPermission}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CoastalMap
        reports={reports}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        onMarkerPress={setSelectedReport}
        userLocation={location}
        selectedReportId={selectedReport?.id}
      />

      <View style={[styles.filterBar, { backgroundColor: theme.colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {MAP_FILTERS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === f.id ? theme.colors.primary : theme.colors.surfaceSecondary,
                },
              ]}
            >
              <AppText
                style={{
                  color: filter === f.id ? theme.colors.textInverse : theme.colors.text,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {f.label}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <LoadingState title={COPY.map.loading} />
        </View>
      ) : null}

      {isError ? (
        <View style={styles.loadingOverlay}>
          <ErrorState title="Unable to load reports" onAction={() => refetch()} />
        </View>
      ) : null}

      {!isLoading && reports.length === 0 ? (
        <View style={[styles.emptyBanner, { backgroundColor: theme.colors.surface }]}>
          <AppText style={{ color: theme.colors.textSecondary }}>{COPY.map.noReports}</AppText>
        </View>
      ) : null}

      {selectedReport ? (
        <SelectedReportCard report={selectedReport} onClose={() => setSelectedReport(null)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterBar: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#073B4C',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filters: { gap: 8, paddingHorizontal: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  previewContainer: { position: 'absolute', bottom: 24, left: 0, right: 0 },
  closeBtn: {
    position: 'absolute',
    top: -8,
    right: 24,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 12,
  },
  emptyBanner: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
