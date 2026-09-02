import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ReportPreviewCard } from '@/components/report/ReportPreviewCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/common/StateViews';
import { AppText, ScreenContainer } from '@/components/ui';
import { COPY } from '@/constants/copy';
import { useExploreData } from '@/hooks/useReports';
import { useSignedImageUrl } from '@/hooks/useSignedImageUrl';
import { useTheme } from '@/theme';
import type { ReportPublic } from '@/types/database';

function ReportRow({ report }: { report: ReportPublic }) {
  const { url } = useSignedImageUrl(report.primary_image_path);
  return (
    <ReportPreviewCard
      report={report}
      imageUrl={url}
      onPress={() => router.push(`/report/${report.id}`)}
    />
  );
}

function Section({ title, reports }: { title: string; reports: ReportPublic[] }) {
  if (!reports.length) return null;
  return (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {reports.map((r) => (
        <ReportRow key={r.id} report={r} />
      ))}
    </View>
  );
}

export default function ExploreScreen() {
  const { theme } = useTheme();
  const { nearby, confirmed } = useExploreData();

  const isLoading = nearby.isLoading || confirmed.isLoading;
  const isError = nearby.isError || confirmed.isError;

  const wildlife = (nearby.data ?? []).filter((r) => r.category === 'wildlife');
  const environmental = (nearby.data ?? []).filter((r) =>
    ['pollution', 'water', 'coastal'].includes(r.category),
  );
  const unusual = (nearby.data ?? []).filter((r) => r.category === 'other');

  if (isLoading) return <LoadingState title="Loading explore..." />;
  if (isError) return <ErrorState title="Unable to load explore" onAction={() => nearby.refetch()} />;

  const hasContent = (nearby.data?.length ?? 0) > 0;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={[styles.heading, { color: theme.colors.text }]}>Explore</AppText>
        {!hasContent ? (
          <EmptyState title={COPY.empty.explore} />
        ) : (
          <>
            <Section title="Near you" reports={nearby.data?.slice(0, 5) ?? []} />
            <Section title="Recent sightings" reports={nearby.data?.slice(0, 8) ?? []} />
            <Section title="Unusual activity" reports={unusual} />
            <Section title="Wildlife" reports={wildlife} />
            <Section title="Environmental reports" reports={environmental} />
            <Section title="Most confirmed" reports={confirmed.data ?? []} />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 56, paddingBottom: 32 },
  heading: { fontSize: 28, fontWeight: '700', paddingHorizontal: 16, marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8 },
});
