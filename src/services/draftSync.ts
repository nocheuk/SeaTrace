import { useEffect } from 'react';
import * as Network from 'expo-network';
import { createReport, uploadReportImage } from '@/api/reportMutations';
import { analytics } from '@/features/analytics';
import {
  getPendingDrafts,
  removeDraft,
  updateDraftStatus,
} from '@/services/draftQueue';
import { useAuthStore } from '@/hooks/useAuth';
import type { ReportDraft } from '@/types/database';

async function submitDraft(draft: ReportDraft, userId: string): Promise<void> {
  if (!draft.latitude || !draft.longitude || !draft.subcategory || !draft.observedAt) {
    throw new Error('Incomplete draft');
  }

  const report = await createReport(
    {
      latitude: draft.latitude,
      longitude: draft.longitude,
      locationAccuracy: draft.locationAccuracy,
      observedAt: draft.observedAt,
      subcategory: draft.subcategory,
      title: draft.title,
      description: draft.description,
      severity: draft.severity as 'low' | 'moderate' | 'high' | null,
      speciesName: draft.speciesName,
      quantityEstimate: draft.quantityEstimate,
      aliveStatus: draft.aliveStatus as 'alive' | 'dead' | 'unknown' | null,
    },
    userId,
  );

  if (draft.localPhotoUri) {
    await uploadReportImage(userId, report.id, draft.localPhotoUri);
  }

  await removeDraft(draft.id);
  analytics.track('report_submitted', { reportId: report.id, fromDraft: true });
}

export function useDraftSync() {
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!userId) return;

    const sync = async () => {
      const network = await Network.getNetworkStateAsync();
      if (!network.isConnected) return;

      const pending = await getPendingDrafts();
      for (const draft of pending) {
        try {
          await submitDraft(draft, userId);
        } catch (error) {
          await updateDraftStatus(
            draft.id,
            'failed',
            error instanceof Error ? error.message : 'Upload failed',
          );
          analytics.track('report_failed', { draftId: draft.id });
        }
      }
    };

    sync();
    const interval = setInterval(sync, 30_000);
    return () => clearInterval(interval);
  }, [userId]);
}

export async function queueDraftForUpload(draft: ReportDraft): Promise<void> {
  const network = await Network.getNetworkStateAsync();
  if (!network.isConnected) {
    await updateDraftStatus(draft.id, 'pending_upload');
    return;
  }

  const userId = useAuthStore.getState().user?.id;
  if (!userId) {
    await updateDraftStatus(draft.id, 'pending_upload');
    return;
  }

  try {
    await submitDraft(draft, userId);
  } catch (error) {
    await updateDraftStatus(
      draft.id,
      'failed',
      error instanceof Error ? error.message : 'Upload failed',
    );
    throw error;
  }
}
