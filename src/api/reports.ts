import { supabase } from '@/api/supabase';
import type { Profile, ReportPublic } from '@/types/database';
import type { MapFilterId } from '@/constants/categories';

export type ViewportBounds = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

export async function fetchReportsInViewport(
  bounds: ViewportBounds,
  filter: MapFilterId = 'all',
  verifiedOnly = false,
  since?: string,
): Promise<ReportPublic[]> {
  const { data, error } = await supabase.rpc('reports_in_viewport', {
    min_lat: bounds.minLat,
    min_lng: bounds.minLng,
    max_lat: bounds.maxLat,
    max_lng: bounds.maxLng,
    filter_group: filter === 'all' ? null : filter,
    verified_only: verifiedOnly,
    since: since ?? null,
  });

  if (error) throw error;
  return data ?? [];
}

export async function fetchNearbyReports(
  lat: number,
  lng: number,
  radiusKm = 10,
  limit = 50,
): Promise<ReportPublic[]> {
  const { data, error } = await supabase.rpc('nearby_reports', {
    lat,
    lng,
    radius_km: radiusKm,
    limit_count: limit,
  });

  if (error) throw error;
  return data ?? [];
}

export async function fetchReportById(id: string): Promise<ReportPublic | null> {
  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  const { data: media } = await supabase
    .from('report_media')
    .select('storage_path')
    .eq('report_id', id)
    .order('sort_order', { ascending: true })
    .limit(1);

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', report.user_id)
    .maybeSingle();

  return {
    id: report.id,
    category: report.category,
    subcategory: report.subcategory,
    title: report.title,
    description: report.description,
    display_latitude: report.display_latitude,
    display_longitude: report.display_longitude,
    location_accuracy: report.location_accuracy,
    observed_at: report.observed_at,
    created_at: report.created_at,
    updated_at: report.updated_at,
    status: report.status,
    severity: report.severity,
    species_name: report.species_name,
    species_confidence: report.species_confidence,
    quantity_estimate: report.quantity_estimate,
    alive_status: report.alive_status,
    verification_score: report.verification_score,
    confirmation_count: report.confirmation_count,
    sensitive_location: report.sensitive_location,
    moderation_status: report.moderation_status,
    source: report.source,
    event_id: report.event_id,
    metadata: report.metadata,
    primary_image_path: media?.[0]?.storage_path ?? null,
    reporter_display_name: profile?.display_name ?? null,
  };
}

export async function fetchUserReports(userId: string): Promise<ReportPublic[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r) => ({
    ...r,
    primary_image_path: null,
    reporter_display_name: null,
    display_latitude: r.display_latitude,
    display_longitude: r.display_longitude,
  })) as ReportPublic[];
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function fetchRecentReports(limit = 20): Promise<ReportPublic[]> {
  return fetchNearbyReports(50.7192, -1.8808, 50, limit);
}

export async function fetchMostConfirmed(limit = 10): Promise<ReportPublic[]> {
  const { data, error } = await supabase.rpc('nearby_reports', {
    lat: 50.7192,
    lng: -1.8808,
    radius_km: 100,
    limit_count: 100,
  });

  if (error) throw error;
  return [...(data ?? [])]
    .sort((a, b) => b.confirmation_count - a.confirmation_count)
    .slice(0, limit);
}
