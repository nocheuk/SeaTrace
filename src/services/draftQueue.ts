import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import type { ReportDraft } from '@/types/database';

const DRAFTS_KEY = '@seatrace/report_drafts';

export async function loadDrafts(): Promise<ReportDraft[]> {
  try {
    const raw = await AsyncStorage.getItem(DRAFTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReportDraft[];
  } catch {
    return [];
  }
}

export async function saveDraft(draft: ReportDraft): Promise<void> {
  const drafts = await loadDrafts();
  const index = drafts.findIndex((d) => d.id === draft.id);
  if (index >= 0) {
    drafts[index] = draft;
  } else {
    drafts.push(draft);
  }
  await AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export async function createDraft(
  partial: Omit<ReportDraft, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'errorMessage'>,
): Promise<ReportDraft> {
  const now = new Date().toISOString();
  const draft: ReportDraft = {
    ...partial,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    status: 'pending_upload',
    errorMessage: null,
  };
  await saveDraft(draft);
  return draft;
}

export async function updateDraftStatus(
  id: string,
  status: ReportDraft['status'],
  errorMessage?: string | null,
): Promise<void> {
  const drafts = await loadDrafts();
  const draft = drafts.find((d) => d.id === id);
  if (!draft) return;
  draft.status = status;
  draft.updatedAt = new Date().toISOString();
  draft.errorMessage = errorMessage ?? null;
  await saveDraft(draft);
}

export async function removeDraft(id: string): Promise<void> {
  const drafts = await loadDrafts();
  await AsyncStorage.setItem(
    DRAFTS_KEY,
    JSON.stringify(drafts.filter((d) => d.id !== id)),
  );
}

export async function getPendingDrafts(): Promise<ReportDraft[]> {
  const drafts = await loadDrafts();
  return drafts.filter((d) => d.status === 'pending_upload' || d.status === 'failed');
}
