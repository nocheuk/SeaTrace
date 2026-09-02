import { formatDistanceToNow } from 'date-fns';
import { getSubcategory } from '@/constants/categories';
import { REPORT_STATUSES, type ReportStatus } from '@/constants/reportStatus';
import type { ReportPublic } from '@/types/database';

export function getReportTitle(report: ReportPublic): string {
  if (report.title) return report.title;
  const sub = getSubcategory(report.subcategory);
  return sub?.label ?? 'Coastal observation';
}

export function getReportAge(report: ReportPublic): string {
  return formatDistanceToNow(new Date(report.observed_at), { addSuffix: true });
}

export function getStatusLabel(status: string): string {
  const key = status as ReportStatus;
  return REPORT_STATUSES[key]?.label ?? status;
}

export function getCategoryLabel(subcategoryId: string): string {
  return getSubcategory(subcategoryId)?.label ?? subcategoryId;
}

export function obscuredLocationLabel(lat: number, lng: number): string {
  return `${lat.toFixed(2)}°, ${lng.toFixed(2)}° (approximate)`;
}
