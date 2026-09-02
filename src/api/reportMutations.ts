import { supabase } from '@/api/supabase';
import { buildReportPayload } from '@/domain/reports';
import type { CreateReportInput } from '@/validation/auth';
import type { ConfirmationType } from '@/constants/reportStatus';

export async function createReport(input: CreateReportInput, userId: string) {
  const payload = buildReportPayload(input, userId);

  const { data, error } = await supabase
    .from('reports')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function uploadReportImage(
  userId: string,
  reportId: string,
  uri: string,
  mimeType = 'image/jpeg',
): Promise<string> {
  const ext = mimeType.includes('png') ? 'png' : 'jpg';
  const path = `${userId}/${reportId}/${Date.now()}.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('report-images')
    .upload(path, arrayBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { error: mediaError } = await supabase.from('report_media').insert({
    report_id: reportId,
    storage_path: path,
    media_type: mimeType,
    sort_order: 0,
    metadata: {},
  });

  if (mediaError) throw mediaError;
  return path;
}

export async function getSignedImageUrl(path: string, expiresIn = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('report-images')
    .createSignedUrl(path, expiresIn);

  if (error) return null;
  return data.signedUrl;
}

export async function confirmReport(
  reportId: string,
  userId: string,
  confirmationType: ConfirmationType,
  notes?: string,
) {
  const { data, error } = await supabase
    .from('report_confirmations')
    .insert({
      report_id: reportId,
      user_id: userId,
      confirmation_type: confirmationType,
      notes: notes ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function fetchReportOwnerId(reportId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('reports')
    .select('user_id')
    .eq('id', reportId)
    .single();

  if (error) return null;
  return data.user_id;
}

export async function fetchConfirmations(reportId: string) {
  const { data, error } = await supabase
    .from('report_confirmations')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function saveReport(userId: string, reportId: string) {
  const { error } = await supabase.from('saved_reports').insert({
    user_id: userId,
    report_id: reportId,
  });
  if (error) throw error;
}
