import { useQuery } from '@tanstack/react-query';
import {
  fetchMostConfirmed,
  fetchNearbyReports,
  fetchReportById,
  fetchReportsInViewport,
  fetchUserReports,
  type ViewportBounds,
} from '@/api/reports';
import type { MapFilterId } from '@/constants/categories';

export function useViewportReports(
  bounds: ViewportBounds | null,
  filter: MapFilterId = 'all',
  verifiedOnly = false,
) {
  return useQuery({
    queryKey: ['reports', 'viewport', bounds, filter, verifiedOnly],
    queryFn: () => fetchReportsInViewport(bounds!, filter, verifiedOnly),
    enabled: !!bounds,
    staleTime: 30_000,
  });
}

export function useNearbyReports(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['reports', 'nearby', lat, lng],
    queryFn: () => fetchNearbyReports(lat!, lng!),
    enabled: lat != null && lng != null,
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => fetchReportById(id),
    enabled: !!id,
  });
}

export function useUserReports(userId?: string) {
  return useQuery({
    queryKey: ['reports', 'user', userId],
    queryFn: () => fetchUserReports(userId!),
    enabled: !!userId,
  });
}

export function useExploreData(lat = 50.7192, lng = -1.8808) {
  const nearby = useNearbyReports(lat, lng);
  const confirmed = useQuery({
    queryKey: ['reports', 'most-confirmed'],
    queryFn: () => fetchMostConfirmed(10),
  });

  return { nearby, confirmed };
}
