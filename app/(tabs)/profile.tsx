import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { signOut } from '@/api/auth';
import { ReportPreviewCard } from '@/components/report/ReportPreviewCard';
import { EmptyState, LoadingState } from '@/components/common/StateViews';
import { AppText, Button, Card, ScreenContainer } from '@/components/ui';
import { BRAND } from '@/constants/brand';
import { COPY } from '@/constants/copy';
import { useAuth } from '@/hooks/useAuth';
import { useUserReports } from '@/hooks/useReports';
import { useSignedImageUrl } from '@/hooks/useSignedImageUrl';
import { useTheme } from '@/theme';
import type { ReportPublic } from '@/types/database';

function MyReportRow({ report }: { report: ReportPublic }) {
  const { url } = useSignedImageUrl(report.primary_image_path);
  return (
    <ReportPreviewCard
      report={report}
      imageUrl={url}
      onPress={() => router.push(`/report/${report.id}`)}
    />
  );
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, profile } = useAuth();
  const { data: reports, isLoading } = useUserReports(user?.id);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/sign-in');
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={styles.heading}>Profile</AppText>

        <Card>
          <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <AppText style={styles.avatarText}>
              {(profile?.display_name ?? 'U').charAt(0).toUpperCase()}
            </AppText>
          </View>
          <AppText style={styles.name}>{profile?.display_name ?? 'Observer'}</AppText>
          <AppText style={{ color: theme.colors.textSecondary }}>
            {profile?.contribution_count ?? 0} reports · {profile?.confirmation_count ?? 0} confirmations
          </AppText>
          <AppText style={{ color: theme.colors.textSecondary, marginTop: 4 }}>
            Score: {profile?.reputation_score ?? 0}
          </AppText>
        </Card>

        <AppText style={styles.sectionTitle}>My Reports</AppText>
        {isLoading ? <LoadingState /> : null}
        {!isLoading && !reports?.length ? <EmptyState title={COPY.empty.myReports} /> : null}
        {reports?.map((r) => <MyReportRow key={r.id} report={r} />)}

        <Card style={styles.about}>
          <AppText style={styles.sectionTitle}>About {BRAND.name}</AppText>
          <AppText style={{ color: theme.colors.textSecondary }}>{BRAND.tagline}</AppText>
        </Card>

        <Button title="Sign out" variant="ghost" onPress={handleSignOut} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 48 },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  about: { marginTop: 24 },
});
